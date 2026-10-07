import type { AssessmentAttempt, AssessmentDefinition } from "./assessment";
import { unit1Check } from "@/content/curriculum/german-a1-unit1-check";
import { compatibleHistory, registeredAssessment } from "./assessment-registry";

export type OutcomeProjection = {
  targetId: string;
  state:
    | "no evidence"
    | "demonstrated in one observation"
    | "confirmed in an alternate form"
    | "needs more evidence";
  repeatedForms: number;
};
/** Latest accepted observation PER known family, never an average. Any failed family remains
 * a contradiction. Repeat counts explain exposure; retries cannot create additional families.
 */
export function projectOutcomes(
  definition: AssessmentDefinition,
  input: readonly AssessmentAttempt[] | AssessmentAttempt | null,
  ownerId?: string,
): OutcomeProjection[] {
  const history = (
    Array.isArray(input) ? input : input ? [input] : []
  ) as readonly AssessmentAttempt[];
  const known = compatibleHistory(definition, history, ownerId);
  const families = registeredAssessment(definition.id).forms.map((form) => ({
    form,
    attempts: known
      .filter((a) => a.formFamilyId === form.formFamilyId)
      .sort((a, b) => b.finishedAt! - a.finishedAt! || b.attemptId.localeCompare(a.attemptId)),
  }));
  return definition.targets.map((target) => {
    const observations = families
      .filter(({ attempts }) => attempts.length)
      .map(({ form, attempts }) => {
        const required = form.items.filter((i) => i.targetId === target.id);
        const events = attempts[0].evidence.filter((e) => e.targetId === target.id);
        return (
          events.length === required.length &&
          required.every((item) =>
            events.some(
              (e) =>
                e.itemId === item.id &&
                e.learnerId === attempts[0].learnerId &&
                e.assessmentAttemptId === attempts[0].attemptId &&
                e.assessmentId === definition.id &&
                e.assessmentVersion === definition.assessmentVersion &&
                e.compatibilityVersion === form.compatibilityVersion &&
                e.correct &&
                e.formId === form.formId &&
                e.formFamilyId === form.formFamilyId,
            ),
          )
        );
      });
    return {
      targetId: target.id,
      repeatedForms: families.filter(({ attempts }) => attempts.length > 1).length,
      state: !observations.length
        ? "no evidence"
        : observations.some((correct) => !correct)
          ? "needs more evidence"
          : observations.length === 2
            ? "confirmed in an alternate form"
            : "demonstrated in one observation",
    };
  });
}
/** History-derived exposure wording; never stored as a growing independent-evidence count. */
export function observationKind(attempt: AssessmentAttempt, history: readonly AssessmentAttempt[]) {
  const definition = registeredAssessment(attempt.assessmentId).definition;
  const prior = compatibleHistory(definition, history, attempt.learnerId).filter(
    (a) =>
      a.status === "submitted" &&
      a.attemptId !== attempt.attemptId &&
      (a.finishedAt! < (attempt.finishedAt ?? Infinity) ||
        (a.finishedAt === attempt.finishedAt && a.attemptId.localeCompare(attempt.attemptId) < 0)),
  );
  if (prior.some((a) => a.formFamilyId === attempt.formFamilyId)) return "Repeated observation";
  return prior.length ? "Additional independent observation" : "First observation";
}
export function nextFormLabel(
  history: readonly AssessmentAttempt[],
  definition = unit1Check,
  ownerId?: string,
) {
  const known = compatibleHistory(definition, history, ownerId);
  const forms = registeredAssessment(definition.id).forms;
  const next = known[0]?.formFamilyId === forms[0].formFamilyId ? (forms[1] ?? forms[0]) : forms[0];
  return { formId: next.formId, repeated: known.some((a) => a.formFamilyId === next.formFamilyId) };
}
