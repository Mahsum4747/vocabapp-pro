import type { AssessmentItem, AssessmentDefinition } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";
// Explicit equivalents are authored for these new assessment families only.
const keyboard = (s: string) =>
  s
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("Ä", "Ae")
    .replaceAll("Ö", "Oe")
    .replaceAll("Ü", "Ue")
    .replaceAll("ß", "ss");
export function checkAuthor(
  unit: "04" | "05",
  targets: readonly { id: string; label: string; scope: string }[],
) {
  return {
    item: (
      form: "A" | "B",
      n: number,
      type: AssessmentItem["type"],
      target: string,
      prompt: string,
      answers: string[],
      stimulus?: string,
      options?: string[],
    ): AssessmentItem => ({
      id: `U${unit}.${form}.C${String(n).padStart(2, "0")}`,
      type,
      targetId: `U${unit}.${target}`,
      prompt,
      acceptedAnswers: [...new Set(answers.flatMap((s) => [s, keyboard(s)]))],
      caseSensitive: type !== "choice",
      ...(stimulus ? { stimulus } : {}),
      ...(options ? { options } : {}),
    }),
    form: (form: "A" | "B", items: AssessmentItem[]): AssessmentDefinition => ({
      id: `DE.A1.U${unit}.CHECK.PROTOTYPE.1`,
      assessmentVersion: 1,
      compatibilityVersion: 1,
      formId: `U${unit}.FORM.${form}`,
      formFamilyId: `U${unit}.FAMILY.${form}`,
      unitId: `DE.A1.U${unit}`,
      trackId: "de-a1-text-practice-v1",
      releaseId: germanA1.id,
      status: "prototype",
      provenance: "Original Karta authoring; pending pedagogical review",
      targets: targets.map((t) => ({ ...t, id: `U${unit}.${t.id}` })),
      items,
    }),
  };
}
