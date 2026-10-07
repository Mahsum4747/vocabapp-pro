import { CP1_ID } from "@/lib/curriculum/checkpoint-identity";
import type { AssessmentDefinition, AssessmentItem } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";
/** Original integrated prototype tasks; no external or Unit Check tasks copied. */
/** Permit mixed native/ASCII spelling in new CP1 keys; shared grading stays unchanged. */
function keyboardVariants(value: string): string[] {
  return [
    ["ä", "ae"],
    ["ö", "oe"],
    ["ü", "ue"],
    ["ß", "ss"],
  ].reduce(
    (variants, [native, ascii]) => [
      ...new Set(variants.flatMap((text) => [text, text.replaceAll(native, ascii)])),
    ],
    [value],
  );
}
const task = (
  id: number,
  target: string,
  type: AssessmentItem["type"],
  prompt: string,
  answers: string[],
  stimulus?: string,
): AssessmentItem => ({
  id: `CP1.A.${id.toString().padStart(2, "0")}`,
  targetId: `CP1.${target}`,
  type,
  prompt,
  acceptedAnswers: [...new Set(answers.flatMap(keyboardVariants))],
  caseSensitive: true,
  ...(stimulus ? { stimulus } : {}),
});
export const cp1: AssessmentDefinition = {
  id: CP1_ID,
  assessmentVersion: 1,
  compatibilityVersion: 1,
  formId: "CP1.FORM.A",
  formFamilyId: "CP1.FAMILY.A",
  trackId: "de-a1-text-practice-v1",
  releaseId: germanA1.id,
  // Existing generic scope field holds the checkpoint ID, never an authored unit ID.
  unitId: "DE.A1.CP1",
  status: "prototype",
  provenance: "Original Karta authoring; pending pedagogical review",
  targets: [
    {
      id: "CP1.identity",
      label: "Introduce someone and complete basic fields",
      scope: "One fictional name field and one bounded two-sentence introduction.",
    },
    {
      id: "CP1.details",
      label: "Extract numbers, dates and prices",
      scope: "Three explicit details from short practical notes; no general numeracy claim.",
    },
    {
      id: "CP1.people",
      label: "Describe people and a routine",
      scope: "One bounded plural routine and one description preserving negation.",
    },
    {
      id: "CP1.reference",
      label: "Keep ownership and object reference",
      scope: "One feminine possessive reply and one masculine object-pronoun replacement.",
    },
    {
      id: "CP1.shopping",
      label: "State a shopping need and availability",
      scope: "One two-sentence request and one negative stock detail with es gibt.",
    },
    {
      id: "CP1.preference",
      label: "Communicate preference and alternatives",
      scope: "One buying preference and one two-clause alternative with oder.",
    },
    {
      id: "CP1.revision",
      label: "Revise a practical message without losing meaning",
      scope:
        "One three-sentence correction preserving a preference and correcting the intended object.",
    },
  ],
  items: [
    task(
      1,
      "identity",
      "supported-field",
      "Complete the short form's Name field for the person answering. Type only the name.",
      ["Mara"],
      "Name: ___\nOrt: Bonn\nTom: Wer bist du?\nMara: Ich bin Mara.",
    ),
    task(
      2,
      "details",
      "reading-extraction",
      "Copy the appointment date from the note. Type only the date, in the note's format.",
      ["14.05."],
      "Name: Mara\nTermin: 14.05.\nPreis: 3 Euro",
    ),
    task(
      3,
      "identity",
      "construction",
      "Introduce yourself as Mara and say you live in Bonn. Write two complete German sentences, each beginning Ich.",
      ["Ich bin Mara. Ich wohne in Bonn.", "Ich heiße Mara. Ich wohne in Bonn."],
    ),
    task(
      4,
      "people",
      "construction",
      "Write a shared study note: Mara and Tom learn German. Begin Mara und Tom. Write one complete German sentence with lernen.",
      ["Mara und Tom lernen Deutsch."],
    ),
    task(
      5,
      "details",
      "reading-extraction",
      "How many books does Mara have? Type only the number in digits.",
      ["12"],
      "Mara: Ich habe zwölf Bücher. Tom: Ich habe zwei Bücher.",
    ),
    task(
      6,
      "people",
      "bounded-text",
      "The draft reverses the description of the books. Correct it using the update. Keep Die Bücher, nicht and groß; write one full sentence.",
      ["Die Bücher sind nicht groß."],
      "Update: Die Bücher sind klein.\nDraft: Die Bücher sind groß.",
    ),
    task(
      7,
      "reference",
      "construction",
      "Reply to Mara: confirm you have her bag, using the possessive for your. Begin Ich habe. Write one full German sentence.",
      ["Ich habe deine Tasche."],
      "Mara: Du hast meine Tasche.",
    ),
    task(
      8,
      "reference",
      "bounded-text",
      "Rewrite Tom sieht den Stift. Replace the object with its pronoun, keeping Tom and sieht. Write the whole sentence.",
      ["Tom sieht ihn."],
    ),
    task(
      9,
      "shopping",
      "construction",
      "Write a short shopping request: you need a book; you do not need a pen. Write two complete German sentences beginning Ich brauche, in that order.",
      ["Ich brauche ein Buch. Ich brauche keinen Stift."],
    ),
    task(
      10,
      "details",
      "reading-extraction",
      "Read the note and copy the bag's price, including Euro. Type only the price phrase.",
      ["3 Euro"],
      "Das Buch kostet 2 Euro. Die Tasche kostet 3 Euro.",
    ),
    task(
      11,
      "shopping",
      "reading-extraction",
      "Which stock detail answers Mara's phone request? Write one complete German sentence beginning Es gibt, stating only phone availability.",
      ["Es gibt kein Telefon."],
      "Mara: Ich brauche ein Telefon.\nShop: Es gibt eine Tasche. Es gibt kein Telefon.",
    ),
    task(
      12,
      "preference",
      "construction",
      "Say that you enjoy buying books. Begin Ich. Use kaufen and gern. Write one complete German sentence.",
      ["Ich kaufe gern Bücher.", "Ich kaufe Bücher gern."],
    ),
    task(
      13,
      "preference",
      "construction",
      "Offer Tom two choices: he buys a book or he buys a bag. Address him as du. Write two complete clauses joined by oder, book first.",
      ["Du kaufst ein Buch oder du kaufst eine Tasche."],
    ),
    task(
      14,
      "revision",
      "bounded-text",
      "Mara enjoys buying books. She intends the particular bag, not the particular book. Repair the draft: write three full German sentences, keeping the preference first, explicitly denying that book purchase second, and naming the intended bag third. Begin each sentence Mara kauft.",
      ["Mara kauft gern Bücher. Mara kauft nicht das Buch. Mara kauft die Tasche."],
      "Draft: Mara kauft sehr Bücher. Mara kauft das Buch.\nIntended purchase: die Tasche",
    ),
  ],
};
export const cp1Forms = [cp1] as const;
