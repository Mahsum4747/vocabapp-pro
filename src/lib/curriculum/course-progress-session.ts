import { germanA1 } from "@/content/curriculum/german-a1";
import { evaluateStep, startLesson, type LessonSession } from "./lesson-session";
import type { LessonDefinition } from "./types";
import type { DurableProgress } from "./course-progress";

/** Temporary target-course practice track, not published enrollment or an overlay preference. */
export const COURSE_SCOPE = { trackId: "de-a1-text-practice-v1", releaseId: germanA1.id } as const;

export function resumeProgress(progress: DurableProgress, lesson: LessonDefinition): LessonSession {
  const state = startLesson(progress.releaseId, lesson);
  const stepIndex =
    progress.currentStepId === null
      ? lesson.steps.length - 1
      : lesson.steps.findIndex((step) => step.id === progress.currentStepId);
  const step = lesson.steps[stepIndex];
  const feedback = progress.checked
    ? step.kind === "original"
      ? {
          outcome: "unassessed" as const,
          message: "This practice step is saved. Your open writing was not stored.",
        }
      : evaluateStep(step, progress.response ?? "")
    : null;
  return {
    ...state,
    stepIndex,
    status: progress.currentStepId === null ? "finished" : "in-progress",
    historicallyFinished: progress.firstFinishedAt !== null,
    completedStepIds: progress.completedStepIds,
    responses: progress.response === null ? {} : { [step.id]: progress.response },
    attempts: progress.attempts ? { [step.id]: progress.attempts } : {},
    results: feedback ? { [step.id]: feedback } : {},
    feedback,
  };
}
