import { cp1 } from "@/content/curriculum/german-a1-cp1";
import { validateAttempt, type AssessmentAttempt } from "./assessment";
export const CP1_REQUEST = { assessmentId: cp1.id, compatibilityVersion: cp1.compatibilityVersion };
/** Explainable follow-up to sampled task groups; no mastery state or progression mutation. */
export const checkpointFollowups: Record<string, readonly string[]> = {
  "CP1.identity": ["DE.A1.U01.L01", "DE.A1.U01.L03"],
  "CP1.details": ["DE.A1.U01.L03", "DE.A1.U03.L01"],
  "CP1.people": ["DE.A1.U02.L01", "DE.A1.U02.L03"],
  "CP1.reference": ["DE.A1.U02.L02", "DE.A1.U03.L02"],
  "CP1.shopping": ["DE.A1.U03.L01", "DE.A1.U03.L03"],
  "CP1.preference": ["DE.A1.U03.L03", "DE.A1.U03.L04"],
  "CP1.revision": ["DE.A1.U02.L04", "DE.A1.U03.L04"],
};
/** Result belongs to this exact submitted attempt. A retry never becomes a new independent family. */
export function projectCheckpoint(attempt: AssessmentAttempt, ownerId: string) {
  const valid = validateAttempt(attempt, cp1, ownerId);
  if (valid.status !== "submitted") throw Error("Checkpoint not submitted.");
  return cp1.targets.map((target) => {
    const results = valid.responses.filter((row) => row.targetId === target.id);
    const demonstrated =
      results.length === cp1.items.filter((item) => item.targetId === target.id).length &&
      results.every((row) => row.correct);
    return {
      ...target,
      demonstrated,
      lessonIds: demonstrated ? [] : checkpointFollowups[target.id],
    };
  });
}
