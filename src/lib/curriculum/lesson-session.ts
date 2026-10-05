import type { LessonDefinition, LessonStep } from "./types";

export type StepResult = { outcome: "correct" | "incorrect" | "unassessed"; message: string };
export type LessonSession = {
  lessonId: string;
  releaseId: string;
  stepIndex: number;
  completedStepIds: readonly string[];
  responses: Readonly<Record<string, string>>;
  attempts: Readonly<Record<string, number>>;
  results: Readonly<Record<string, StepResult>>;
  feedback: StepResult | null;
  status: "in-progress" | "finished";
};
export type LessonAction =
  { type: "respond"; value: string } | { type: "check" } | { type: "continue" };
export function startLesson(releaseId: string, lesson: LessonDefinition): LessonSession {
  if (lesson.availability !== "prototype" || !lesson.steps.length)
    throw Error("Lesson content is unavailable.");
  return {
    releaseId,
    lessonId: lesson.id,
    stepIndex: 0,
    completedStepIds: [],
    responses: {},
    attempts: {},
    results: {},
    feedback: null,
    status: "in-progress",
  };
}
function normalize(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]$/, "")
    .toLocaleLowerCase("en");
}
/** Only exact bounded answers are evaluated. Original writing stays unassessed. */
export function evaluateStep(step: LessonStep, response: string): StepResult | null {
  if (step.kind === "explanation" || !response.trim()) return null;
  if (step.kind === "original") {
    if (response.length > step.maxLength)
      return {
        outcome: "incorrect",
        message: `Keep this response within ${step.maxLength} characters.`,
      };
    return {
      outcome: "unassessed",
      message:
        "Response recorded for this session. Its meaning and writing quality have not been assessed.",
    };
  }
  const answers = step.kind === "choice" ? [step.correctAnswer] : step.acceptedAnswers;
  const correct = answers.some((answer) => normalize(answer) === normalize(response));
  return {
    outcome: correct ? "correct" : "incorrect",
    message: correct ? `That fits. ${step.feedback}` : `Try again. ${step.feedback}`,
  };
}
/** In-memory lesson traversal only; no evidence, memory ratings or persistence. */
export function transitionLesson(
  lesson: LessonDefinition,
  state: LessonSession,
  action: LessonAction,
): LessonSession {
  if (state.lessonId !== lesson.id || state.status === "finished") return state;
  const step = lesson.steps[state.stepIndex];
  if (!step) return state;
  if (action.type === "respond") {
    if (step.kind === "explanation" || (state.feedback && state.feedback.outcome !== "incorrect"))
      return state;
    return { ...state, responses: { ...state.responses, [step.id]: action.value }, feedback: null };
  }
  if (action.type === "check") {
    if (state.feedback) return state;
    const feedback = evaluateStep(step, state.responses[step.id] ?? "");
    if (!feedback) return state;
    return {
      ...state,
      feedback,
      attempts: { ...state.attempts, [step.id]: (state.attempts[step.id] ?? 0) + 1 },
      results: { ...state.results, [step.id]: feedback },
    };
  }
  if (step.kind !== "explanation" && (!state.feedback || state.feedback.outcome === "incorrect"))
    return state;
  const last = state.stepIndex === lesson.steps.length - 1;
  return {
    ...state,
    stepIndex: last ? state.stepIndex : state.stepIndex + 1,
    completedStepIds: [...state.completedStepIds, step.id],
    feedback: null,
    status: last ? "finished" : "in-progress",
  };
}
