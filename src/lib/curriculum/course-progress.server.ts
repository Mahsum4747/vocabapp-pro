import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { userDocumentPaths } from "../user-data-inventory";
import type { LessonDefinition } from "./types";
import {
  applyProgressCommand,
  courseScopeSchema,
  storedProgressSchema,
  lessonResumeContractVersion,
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
/** Full definition fingerprint for diagnostics; never a resume/grading compatibility gate. */
export const lessonDefinitionHash = (lesson: LessonDefinition) => hash(lesson);
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
      const definitionHash = lessonDefinitionHash(lesson);
      const resumeContractVersion = lessonResumeContractVersion(lesson);
      const raw = rows[index].data();
      const stored = raw === undefined ? null : storedProgressSchema.parse(raw);
      if (
        stored &&
        (stored.trackId !== scope.trackId ||
          stored.releaseId !== scope.releaseId ||
          stored.lessonId !== lesson.id)
      )
        throw Error("Stored progress scope mismatch.");
      const unavailable =
        stored !== null &&
        (stored.schemaVersion !== 2 || stored.resumeContractVersion !== resumeContractVersion);
      return {
        lessonId: lesson.id,
        resumeContractVersion,
        definitionHash,
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
  const definitionHash = lessonDefinitionHash(lesson);
  const resumeContractVersion = lessonResumeContractVersion(lesson);
  if (command.resumeContractVersion !== resumeContractVersion) return { kind: "unavailable" };
  const ref = db.doc(courseProgressPath(ownerId, command));
  const digest = hash(command);
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    const previous =
      raw === undefined ? initialProgress(lesson, definitionHash) : storedProgressSchema.parse(raw);
    if (previous.schemaVersion !== 2 || previous.resumeContractVersion !== resumeContractVersion)
      return { kind: "unavailable" };
    validateStoredProgress(previous, lesson);
    const result = applyProgressCommand(previous, command, lesson, digest, now);
    if (result.kind === "saved" && result.progress !== previous) {
      const progress = { ...result.progress, definitionHash };
      tx.set(ref, progress);
      return { ...result, progress };
    }
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
