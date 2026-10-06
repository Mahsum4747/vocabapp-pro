import type { AssessmentAttempt, AssessmentDefinition } from "./assessment";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit1CheckForms } from "@/content/curriculum/german-a1-unit1-check";
import { unit2CheckForms } from "@/content/curriculum/german-a1-unit2-check";

/** Two published-in-code prototype registrations, not a plugin or persisted registry. */
export const assessmentRegistry = [unit1CheckForms, unit2CheckForms].map((forms) => ({
  definition: forms[0],
  unitNumber: germanA1.units.findIndex((u) => u.id === forms[0].unitId) + 1,
  forms,
  lessonIds: germanA1.units.find((u) => u.id === forms[0].unitId)!.lessonIds,
}));
export function assessmentForUnit(unitId: string) {
  return assessmentRegistry.find((r) => r.definition.unitId === unitId);
}
export function registeredAssessment(id: string) {
  const registration = assessmentRegistry.find((r) => r.definition.id === id);
  if (!registration) throw Error("Unknown check.");
  return registration;
}
export function assessmentForm(assessmentId: string, formId: string): AssessmentDefinition {
  const form = registeredAssessment(assessmentId).forms.find((f) => f.formId === formId);
  if (!form) throw Error("Unknown check form.");
  return form;
}
export function checkFormLabel(formId: string) {
  const form = assessmentRegistry.flatMap((r) => [...r.forms]).find((f) => f.formId === formId);
  if (!form) throw Error("Unknown check form.");
  return form.formId === registeredAssessment(form.id).forms[0].formId ? "Form A" : "Form B";
}
/** Server supplies the verified owner; pure reducers may additionally bind it explicitly.
 * No foreign assessment, release, unit, version, family or draft enters a history calculation.
 */
export function compatibleHistory(
  definition: AssessmentDefinition,
  history: readonly AssessmentAttempt[],
  ownerId?: string,
) {
  const forms = registeredAssessment(definition.id).forms;
  return history
    .filter(
      (a) =>
        a.status === "submitted" &&
        (ownerId === undefined || a.learnerId === ownerId) &&
        a.assessmentId === definition.id &&
        a.assessmentVersion === definition.assessmentVersion &&
        a.trackId === definition.trackId &&
        a.releaseId === definition.releaseId &&
        a.unitId === definition.unitId &&
        forms.some(
          (f) =>
            f.formId === a.formId &&
            f.formFamilyId === a.formFamilyId &&
            f.compatibilityVersion === a.compatibilityVersion,
        ),
    )
    .sort((a, b) => b.finishedAt! - a.finishedAt! || b.attemptId.localeCompare(a.attemptId));
}
