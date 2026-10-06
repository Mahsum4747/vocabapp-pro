import type { AssessmentAttempt, AssessmentDefinition } from "./assessment";

export type OutcomeProjection = {
  targetId: string;
  state: "no evidence" | "demonstrated in this check" | "needs more evidence";
};

/** Latest accepted attempt only. All observations for a target must fit; never averages across targets. */
export function projectOutcomes(
  definition: AssessmentDefinition,
  attempt: AssessmentAttempt | null,
): OutcomeProjection[] {
  return definition.targets.map((target) => {
    const events =
      attempt?.status === "submitted" &&
      attempt.compatibilityVersion === definition.compatibilityVersion &&
      attempt.assessmentId === definition.id
        ? attempt.evidence.filter((event) => event.targetId === target.id)
        : [];
    const required = definition.items.filter((item) => item.targetId === target.id).length;
    return {
      targetId: target.id,
      state: !events.length
        ? "no evidence"
        : events.length === required && events.every((event) => event.correct)
          ? "demonstrated in this check"
          : "needs more evidence",
    };
  });
}
