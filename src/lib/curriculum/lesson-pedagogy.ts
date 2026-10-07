import type { LessonDefinition } from "./types";

export type LessonPedagogyFlag =
  | "missing_teaching"
  | "practice_before_teaching"
  | "missing_supported_production"
  | "missing_transfer"
  | "missing_formative_check";

export type LessonPedagogyAudit = {
  lessonId: string;
  flags: LessonPedagogyFlag[];
  teachingStepCount: number;
  practiceStepCount: number;
  hasOriginalTransfer: boolean;
};

const productiveStages = new Set(["recall", "produce", "apply"]);

export function auditLessonPedagogy(lesson: LessonDefinition): LessonPedagogyAudit {
  const flags: LessonPedagogyFlag[] = [];
  const teachingIndexes = lesson.steps
    .map((step, index) => (step.purpose === "teach" ? index : -1))
    .filter((index) => index >= 0);
  const firstIndependentLike = lesson.steps.findIndex(
    (step) =>
      step.purpose === "practice" &&
      productiveStages.has(step.stage) &&
      (step.kind === "text" || step.kind === "original"),
  );

  if (!teachingIndexes.length) flags.push("missing_teaching");
  if (
    firstIndependentLike >= 0 &&
    (!teachingIndexes.length || teachingIndexes.every((index) => index > firstIndependentLike))
  ) {
    flags.push("practice_before_teaching");
  }

  const hasSupportedProduction = lesson.steps.some(
    (step) =>
      step.purpose === "practice" &&
      step.kind === "text" &&
      step.stage === "produce" &&
      Boolean(step.example || /use these|complete|using|supplied/i.test(step.prompt)),
  );
  if (!hasSupportedProduction) flags.push("missing_supported_production");

  const hasOriginalTransfer = lesson.steps.some(
    (step) => step.kind === "original" && step.stage === "apply" && step.purpose === "practice",
  );
  if (!hasOriginalTransfer) flags.push("missing_transfer");

  if (!lesson.steps.some((step) => step.purpose === "formative-check")) {
    flags.push("missing_formative_check");
  }

  return {
    lessonId: lesson.id,
    flags,
    teachingStepCount: teachingIndexes.length,
    practiceStepCount: lesson.steps.filter((step) => step.purpose === "practice").length,
    hasOriginalTransfer,
  };
}
