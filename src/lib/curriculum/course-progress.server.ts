import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { userDocumentPaths } from "../user-data-inventory";
import type { LessonDefinition } from "./types";
import {
  applyProgressCommand,
  courseScopeSchema,
  durableProgressSchema,
  initialProgress,
  progressCommandSchema,
  progressDocumentId,
  resolveCourse,
  resolveProgressLesson,
  validateStoredProgress,
  type CourseProgress,
  type SaveProgressResult,
} from "./course-progress";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
/** Immutable release + exact authored definition pin; changed content cannot grade an old answer. */
export const lessonContentVersion = (lesson: LessonDefinition) => hash(lesson);
export function courseProgressPath(
  ownerId: string,
  scope: { trackId: string; releaseId: string; lessonId: string },
) {
  userDocumentPaths(ownerId); // Same authenticated-owner/path validation as deletion.
  return `users/${ownerId}/courseProgress/${progressDocumentId(scope)}`;
}
/** Exactly two known lesson document reads today. Missing rows are not initialized. */
export async function readCourseProgress(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<CourseProgress> {
  const scope = courseScopeSchema.parse(input);
  const lessons = resolveCourse(scope);
  const refs = lessons.map((lesson) =>
    db.doc(courseProgressPath(ownerId, { ...scope, lessonId: lesson.id })),
  );
  const rows = await db.getAll(...refs);
  return {
    ...scope,
    lessons: lessons.map((lesson, index) => {
      const lessonVersion = lessonContentVersion(lesson);
      const raw = rows[index].data();
      const stored = raw === undefined ? null : durableProgressSchema.parse(raw);
      if (
        stored &&
        (stored.trackId !== scope.trackId ||
          stored.releaseId !== scope.releaseId ||
          stored.lessonId !== lesson.id)
      )
        throw Error("Stored progress scope mismatch.");
      const unavailable = stored !== null && stored.lessonVersion !== lessonVersion;
      return {
        lessonId: lesson.id,
        lessonVersion,
        unavailable,
        progress: stored && !unavailable ? validateStoredProgress(stored, lesson) : null,
      };
    }),
  };
}
/** One owner-scoped transaction, one progress write; never touches another learning root. */
export async function saveCourseProgress(
  db: Firestore,
  ownerId: string,
  input: unknown,
  now = Date.now(),
): Promise<SaveProgressResult> {
  const command = progressCommandSchema.parse(input);
  const lesson = resolveProgressLesson(command);
  const lessonVersion = lessonContentVersion(lesson);
  if (command.lessonVersion !== lessonVersion) return { kind: "unavailable" };
  const ref = db.doc(courseProgressPath(ownerId, command));
  const digest = hash(command);
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    const previous =
      raw === undefined ? initialProgress(lesson, lessonVersion) : durableProgressSchema.parse(raw);
    if (previous.lessonVersion !== lessonVersion) return { kind: "unavailable" };
    validateStoredProgress(previous, lesson);
    const result = applyProgressCommand(previous, command, lesson, digest, now);
    if (result.kind === "saved" && result.progress !== previous) tx.set(ref, result.progress);
    return result;
  });
}
/** Auth-off shared preview identities must never become durable course owners. */
export async function requireCourseAuthentication() {
  // The existing middleware verifies sessions when auth is enabled. Its auth-off
  // preview fallback is deliberately disallowed for durable course data.
  if (process.env.VITE_AUTH_ENABLED === "false")
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
}
