import { cp2 } from "@/content/curriculum/german-a1-cp2";
import { assessmentForm } from "./assessment-registry";
import { validateAttempt, type AssessmentAttempt } from "./assessment";
export const CP2_REQUEST = { assessmentId: cp2.id, compatibilityVersion: cp2.compatibilityVersion };
const followups: Record<string, readonly string[]> = {
  "CP2.personal": ["DE.A1.U01.L01"],
  "CP2.familiar": ["DE.A1.U02.L01", "DE.A1.U03.L02"],
  "CP2.reading": ["DE.A1.U01.L03", "DE.A1.U05.L03"],
  "CP2.time": ["DE.A1.U04.L01"],
  "CP2.place": ["DE.A1.U05.L01", "DE.A1.U05.L02"],
  "CP2.rules": ["DE.A1.U04.L04", "DE.A1.U05.L04"],
  "CP2.message": ["DE.A1.U06.L03", "DE.A1.U06.L04"],
  "CP2.recent": ["DE.A1.U06.L01", "DE.A1.U06.L02", "DE.A1.U06.L03"],
  "CP2.transfer": ["DE.A1.U06.L04"],
};
/** Exact-attempt sampled dimensions only. No pooled score, cross-family mastery or progression write. */
export function projectCheckpoint2(attempt: AssessmentAttempt | null, ownerId: string) {
  const form = attempt ? assessmentForm(CP2_REQUEST.assessmentId, attempt.formId) : cp2;
  const valid = attempt ? validateAttempt(attempt, form, ownerId) : null;
  return form.targets.map((target) => {
    const rows =
      valid?.status === "submitted" ? valid.responses.filter((r) => r.targetId === target.id) : [];
    const required = form.items.filter((i) => i.targetId === target.id).length;
    const state =
      rows.length !== required || !required
        ? ("Insufficient evidence" as const)
        : rows.every((r) => r.correct)
          ? ("Demonstrated" as const)
          : ("Follow-up needed" as const);
    return {
      ...target,
      state,
      demonstrated: state === "Demonstrated",
      lessonIds: state === "Demonstrated" ? [] : followups[target.id],
    };
  });
}
