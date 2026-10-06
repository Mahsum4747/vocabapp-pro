import { z } from "zod";
import { germanA1 } from "@/content/curriculum/german-a1";
import { evaluateStep } from "./lesson-session";
import type { LessonDefinition } from "./types";

import { COURSE_SCOPE } from "./course-progress-session";
export { COURSE_SCOPE, resumeProgress } from "./course-progress-session";
const id = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[A-Za-z0-9._-]+$/);
const counter = z
  .number()
  .int()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER - 1);
const resumeContractVersionSchema = counter.min(1);
export function lessonResumeContractVersion(lesson: LessonDefinition) {
  return resumeContractVersionSchema.parse(lesson.resumeContractVersion);
}
export const courseScopeSchema = z.object({ trackId: id, releaseId: id }).strict();
export const progressCommandSchema = courseScopeSchema
  .extend({
    lessonId: id,
    resumeContractVersion: resumeContractVersionSchema,
    expectedRevision: counter,
    operationId: z.string().uuid(),
    action: z.discriminatedUnion("type", [
      z
        .object({ type: z.literal("check"), stepId: id, response: z.string().max(160).optional() })
        .strict(),
      z.object({ type: z.literal("continue"), stepId: id }).strict(),
      z.object({ type: z.literal("restart") }).strict(),
    ]),
  })
  .strict();
export type ProgressCommand = z.infer<typeof progressCommandSchema>;
export const durableProgressSchema = courseScopeSchema
  .extend({
    schemaVersion: z.literal(2),
    lessonId: id,
    resumeContractVersion: resumeContractVersionSchema,
    definitionHash: z.string().regex(/^[a-f0-9]{64}$/),
    revision: counter,
    practiceRun: counter,
    currentStepId: id.nullable(),
    completedStepIds: z.array(id).max(64),
    response: z.string().max(160).nullable(),
    checked: z.boolean(),
    attempts: counter,
    firstFinishedAt: counter.nullable(),
    updatedAt: counter,
    receipts: z
      .array(
        z.object({ id: z.string().uuid(), digest: z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
      )
      .max(64),
  })
  .strict();
// Old unpublished prototype rows stay readable as unavailable; never migrate or overwrite them.
export const storedProgressSchema = z.discriminatedUnion("schemaVersion", [
  durableProgressSchema,
  durableProgressSchema
    .omit({ resumeContractVersion: true, definitionHash: true })
    .extend({ schemaVersion: z.literal(1), lessonVersion: z.string().regex(/^[a-f0-9]{64}$/) })
    .strict(),
]);
export type DurableProgress = z.infer<typeof durableProgressSchema>;
export type ProgressDescriptor = {
  lessonId: string;
  resumeContractVersion: number;
  definitionHash: string;
  progress: DurableProgress | null;
  unavailable: boolean;
};
export type CourseProgress = {
  trackId: string;
  releaseId: string;
  lessons: ProgressDescriptor[];
  challengeClearances?: readonly string[];
};
export type SaveProgressResult =
  { kind: "saved" | "conflict"; progress: DurableProgress } | { kind: "unavailable" };

export function resolveCourse(scope: z.infer<typeof courseScopeSchema>) {
  if (scope.trackId !== COURSE_SCOPE.trackId || scope.releaseId !== COURSE_SCOPE.releaseId)
    throw Error("Unsupported course scope.");
  return germanA1.lessons.filter((lesson) => lesson.availability === "prototype");
}
export function resolveProgressLesson(
  command: Pick<ProgressCommand, "trackId" | "releaseId" | "lessonId">,
) {
  const lesson = resolveCourse(command).find((candidate) => candidate.id === command.lessonId);
  if (!lesson) throw Error("Lesson content is unavailable.");
  return lesson;
}
/** Collision-free tuple identity; no owner identity accepted from a browser payload. */
export function progressDocumentId(scope: {
  trackId: string;
  releaseId: string;
  lessonId: string;
}) {
  return encodeURIComponent(JSON.stringify([scope.trackId, scope.releaseId, scope.lessonId]));
}
export function initialProgress(lesson: LessonDefinition, definitionHash: string): DurableProgress {
  return {
    ...COURSE_SCOPE,
    schemaVersion: 2,
    lessonId: lesson.id,
    resumeContractVersion: lessonResumeContractVersion(lesson),
    definitionHash,
    revision: 0,
    practiceRun: 0,
    currentStepId: lesson.steps[0].id,
    completedStepIds: [],
    response: null,
    checked: false,
    attempts: 0,
    firstFinishedAt: null,
    updatedAt: 0,
    receipts: [],
  };
}
/** Stored progress is traversal only. The pinned definition determines all rendering/feedback. */
export function validateStoredProgress(input: unknown, lesson: LessonDefinition): DurableProgress {
  const progress = durableProgressSchema.parse(input);
  if (
    progress.trackId !== COURSE_SCOPE.trackId ||
    progress.releaseId !== COURSE_SCOPE.releaseId ||
    progress.lessonId !== lesson.id ||
    progress.resumeContractVersion !== lessonResumeContractVersion(lesson)
  )
    throw Error("Stored progress scope mismatch.");
  const count = progress.completedStepIds.length;
  if (
    JSON.stringify(progress.completedStepIds) !==
    JSON.stringify(lesson.steps.slice(0, count).map((step) => step.id))
  )
    throw Error("Invalid completed step sequence.");
  const step = lesson.steps[count];
  if (progress.currentStepId !== (step?.id ?? null) || count > lesson.steps.length)
    throw Error("Invalid resume position.");
  if (!step) {
    if (
      progress.firstFinishedAt === null ||
      progress.response !== null ||
      progress.checked ||
      progress.attempts
    )
      throw Error("Invalid finished lesson state.");
  } else {
    if (
      step.kind === "explanation" &&
      (progress.checked || progress.response !== null || progress.attempts)
    )
      throw Error("Invalid explanation state.");
    if (step.kind === "original" && progress.response !== null)
      throw Error("Open writing must remain ephemeral.");
    if (
      progress.checked &&
      (!progress.attempts ||
        (step.kind !== "original" && !evaluateStep(step, progress.response ?? "")))
    )
      throw Error("Invalid checked response.");
    if (!progress.checked && (progress.response !== null || progress.attempts))
      throw Error("Invalid unchecked state.");
  }
  if (new Set(progress.receipts.map((receipt) => receipt.id)).size !== progress.receipts.length)
    throw Error("Duplicate receipts.");
  return progress;
}
/** Pure compare-and-advance. Receipts are bounded; evicted retries fail stale rather than replay. */
export function applyProgressCommand(
  previous: DurableProgress,
  command: ProgressCommand,
  lesson: LessonDefinition,
  digest: string,
  now: number,
): SaveProgressResult {
  if (
    previous.resumeContractVersion !== command.resumeContractVersion ||
    command.resumeContractVersion !== lessonResumeContractVersion(lesson)
  )
    return { kind: "unavailable" };
  const receipt = previous.receipts.find((candidate) => candidate.id === command.operationId);
  if (receipt) {
    if (receipt.digest !== digest) throw Error("Acknowledgement ID reused with another operation.");
    return { kind: "saved", progress: previous };
  }
  if (previous.revision !== command.expectedRevision)
    return { kind: "conflict", progress: previous };
  const action = command.action;
  let next = { ...previous };
  if (action.type === "restart") {
    next = {
      ...next,
      practiceRun: next.practiceRun + 1,
      currentStepId: lesson.steps[0].id,
      completedStepIds: [],
      response: null,
      checked: false,
      attempts: 0,
    };
  } else {
    const step = lesson.steps[previous.completedStepIds.length];
    if (!step || step.id !== action.stepId) throw Error("That step is no longer current.");
    if (action.type === "check") {
      if (step.kind === "explanation") throw Error("Explanation has no answer.");
      if (
        previous.checked &&
        (step.kind === "original" ||
          evaluateStep(step, previous.response ?? "")?.outcome === "correct")
      )
        throw Error("This answer is already acknowledged.");
      if (step.kind === "original") {
        if (action.response !== undefined) throw Error("Open writing must not be sent.");
      } else if (!evaluateStep(step, action.response ?? "")) throw Error("An answer is required.");
      next = {
        ...next,
        response: step.kind === "original" ? null : action.response!,
        checked: true,
        attempts: previous.attempts + 1,
      };
    } else {
      // Guided traversal may continue after repeated checked failures. Keep the actual
      // failed response; no success, assistance flag, evidence or schema change is stored.
      if (
        step.kind !== "explanation" &&
        (!previous.checked ||
          (step.kind !== "original" &&
            evaluateStep(step, previous.response ?? "")?.outcome !== "correct" &&
            previous.attempts < 3))
      )
        throw Error("Check this step before continuing.");
      const completedStepIds = [...previous.completedStepIds, step.id];
      const currentStepId = lesson.steps[completedStepIds.length]?.id ?? null;
      next = {
        ...next,
        completedStepIds,
        currentStepId,
        response: null,
        checked: false,
        attempts: 0,
        firstFinishedAt:
          currentStepId === null ? (previous.firstFinishedAt ?? now) : previous.firstFinishedAt,
      };
    }
  }
  next = {
    ...next,
    revision: previous.revision + 1,
    updatedAt: Math.max(previous.updatedAt, now),
    receipts: [...previous.receipts, { id: command.operationId, digest }].slice(-64),
  };
  return { kind: "saved", progress: validateStoredProgress(next, lesson) };
}
