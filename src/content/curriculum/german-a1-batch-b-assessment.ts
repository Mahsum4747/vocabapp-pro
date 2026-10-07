import type { AssessmentDefinition, AssessmentItem } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";
// New keys only: permit independently mixed keyboard substitutions; old grading is untouched.
function keyboardVariants(value: string): string[] {
  return [
    ["ä", "ae"],
    ["ö", "oe"],
    ["ü", "ue"],
    ["ß", "ss"],
  ].reduce(
    (rows, [native, ascii]) => [...new Set(rows.flatMap((s) => [s, s.replaceAll(native, ascii)]))],
    [value],
  );
}
export function batchBAuthor(
  scope: "U06" | "CP2",
  targets: readonly { id: string; label: string; scope: string }[],
) {
  return {
    item: (
      form: "A" | "B",
      n: number,
      target: string,
      type: AssessmentItem["type"],
      prompt: string,
      answers: string[],
      stimulus?: string,
      options?: string[],
    ): AssessmentItem => ({
      id: `${scope}.${form}.${String(n).padStart(2, "0")}`,
      targetId: `${scope}.${target}`,
      type,
      prompt,
      acceptedAnswers: [...new Set(answers.flatMap(keyboardVariants))],
      caseSensitive: type !== "choice",
      ...(stimulus ? { stimulus } : {}),
      ...(options ? { options } : {}),
    }),
    form: (form: "A" | "B", items: AssessmentItem[]): AssessmentDefinition => ({
      id: scope === "U06" ? "DE.A1.U06.CHECK.PROTOTYPE.1" : "DE.A1.CP2.PROTOTYPE.1",
      assessmentVersion: 1,
      compatibilityVersion: 1,
      formId: `${scope}.FORM.${form}`,
      formFamilyId: `${scope}.FAMILY.${form}`,
      unitId: `DE.A1.${scope}`,
      trackId: "de-a1-text-practice-v1",
      releaseId: germanA1.id,
      status: "prototype",
      provenance: "Original Karta authoring; pending pedagogical review",
      targets: targets.map((t) => ({ ...t, id: `${scope}.${t.id}` })),
      items,
    }),
  };
}
