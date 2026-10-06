import type { AssessmentDefinition } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";

/** Original unpublished tasks. Functional sampling, not essential-outcome certification.
 * Two original observation families; independence is an authoring rule, not validated equivalence.
 * Bump compatibilityVersion for changed item IDs/order, response/grading contracts or target meanings.
 * Copy-only edits keep it stable; the stored definition hash is diagnostic.
 * Common forms/nouns recur by necessity; complete stimuli/tasks differ from lessons.
 */
export const unit1Check: AssessmentDefinition = {
  id: "DE.A1.U01.CHECK.PROTOTYPE.1",
  assessmentVersion: 1,
  formId: "U01.FORM.A",
  formFamilyId: "U01.FAMILY.A",
  trackId: "de-a1-text-practice-v1",
  releaseId: germanA1.id,
  unitId: "DE.A1.U01",
  compatibilityVersion: 1,
  status: "prototype",
  provenance: "Original Karta authoring; pending pedagogical review",
  targets: [
    {
      id: "U01.person",
      label: "Identify a person",
      scope: "One speaker identified in a short exchange.",
    },
    {
      id: "U01.articles",
      label: "Recognize familiar articles",
      scope: "Articles for Büro and Telefon only.",
    },
    {
      id: "U01.question",
      label: "Ask an identity question",
      scope: "One yes/no question about a person’s identity.",
    },
    {
      id: "U01.details",
      label: "Retrieve explicit details",
      scope: "One number and one day.month date from short messages.",
    },
    {
      id: "U01.statements",
      label: "Give controlled information",
      scope: "Two controlled sentences: having phones and describing a phone.",
    },
    {
      id: "U01.form",
      label: "Complete a supported field",
      scope: "One labelled Name field using a fictional message.",
    },
  ],
  items: [
    {
      id: "U01.C01",
      type: "choice",
      targetId: "U01.person",
      prompt: "Who answers the question?",
      stimulus: "Anja: Wer bist du?\nOmar: Ich bin Omar.",
      options: ["Anja", "Omar"],
      acceptedAnswers: ["Omar"],
    },
    {
      id: "U01.C02",
      type: "choice",
      targetId: "U01.articles",
      prompt: "Choose the pair with the matching articles.",
      options: ["die Büro · der Telefon", "das Büro · das Telefon", "der Büro · die Telefon"],
      acceptedAnswers: ["das Büro · das Telefon"],
    },
    {
      id: "U01.C03",
      type: "construction",
      targetId: "U01.question",
      prompt: "Ask the person directly whether they are Sara. Write a German yes/no question.",
      acceptedAnswers: ["Bist du Sara?"],
    },
    {
      id: "U01.C04",
      type: "reading-extraction",
      targetId: "U01.details",
      prompt: "What is Ben’s number? Enter digits.",
      stimulus: "Anja: Nummer 12.\nBen: Nummer 1.",
      acceptedAnswers: ["1"],
    },
    {
      id: "U01.C05",
      type: "reading-extraction",
      targetId: "U01.details",
      prompt: "What date belongs to the small office? Use day.month.",
      stimulus: "Das Büro ist groß. Datum: 12.03.\nDas Büro ist klein. Datum: 02.12.",
      acceptedAnswers: ["02.12", "2.12"],
    },
    {
      id: "U01.C06",
      type: "construction",
      targetId: "U01.statements",
      prompt: "Say in German that you have two phones. Write one sentence.",
      acceptedAnswers: ["Ich habe zwei Telefone."],
      caseSensitive: true,
    },
    {
      id: "U01.C07",
      type: "bounded-text",
      targetId: "U01.statements",
      prompt: "Describe the phone as small in one German sentence.",
      acceptedAnswers: ["Das Telefon ist klein."],
      caseSensitive: true,
    },
    {
      id: "U01.C08",
      type: "supported-field",
      targetId: "U01.form",
      prompt: "Enter the person’s name in the Name field.",
      stimulus: "Ich bin Timo. Ich habe ein Telefon.",
      acceptedAnswers: ["Timo"],
    },
  ],
};

/** Alternate tasks stay within the SAME narrow samples as A. No psychometric equivalence claim.
 * A's existing items/targets are preserved verbatim. B has globally distinct item IDs.
 */
export const unit1CheckB: AssessmentDefinition = {
  ...unit1Check,
  formId: "U01.FORM.B",
  formFamilyId: "U01.FAMILY.B",
  items: [
    {
      id: "U01.B.C01",
      type: "choice",
      targetId: "U01.person",
      prompt: "A visitor asks Kai who he is. Which reply identifies Kai himself?",
      stimulus: "Visitor: Wer bist du?\nKai: …",
      options: ["Ich bin Kai.", "Du bist Kai.", "Er ist Kai."],
      acceptedAnswers: ["Ich bin Kai."],
    },
    {
      id: "U01.B.C02",
      type: "bounded-text",
      targetId: "U01.articles",
      prompt:
        "Repair both articles in this note. Write the two corrected phrases, separated by a comma.",
      stimulus: "die Telefon, der Büro",
      acceptedAnswers: ["das Telefon, das Büro"],
    },
    {
      id: "U01.B.C03",
      type: "construction",
      targetId: "U01.question",
      prompt:
        "You need to check the visitor’s identity. Assemble a yes/no question using all three pieces.",
      stimulus: "du · bist · Ada",
      acceptedAnswers: ["Bist du Ada?"],
    },
    {
      id: "U01.B.C04",
      type: "reading-extraction",
      targetId: "U01.details",
      prompt: "How many phones does the person have? Enter digits, not the reference number.",
      stimulus: "Nummer: 12\nIch habe zwei Telefone.",
      acceptedAnswers: ["2"],
    },
    {
      id: "U01.B.C05",
      type: "choice",
      targetId: "U01.details",
      prompt: "Select the date from the phone note, not the office note.",
      stimulus: "Büro — Datum: 03.12.\nTelefon — Datum: 12.03.",
      options: ["03.12", "12.03", "02.12"],
      acceptedAnswers: ["12.03"],
    },
    {
      id: "U01.B.C06",
      type: "bounded-text",
      targetId: "U01.statements",
      prompt: "Rewrite the labelled facts as one German sentence about Eva having phones.",
      stimulus: "Name: Eva\nTelefone: zwei",
      acceptedAnswers: ["Eva hat zwei Telefone."],
      caseSensitive: true,
    },
    {
      id: "U01.B.C07",
      type: "construction",
      targetId: "U01.statements",
      prompt:
        "The office is small, but the phone is large. Build the sentence about the phone using the pieces.",
      stimulus: "ist · groß · Das Telefon",
      acceptedAnswers: ["Das Telefon ist groß."],
      caseSensitive: true,
    },
    {
      id: "U01.B.C08",
      type: "supported-field",
      targetId: "U01.form",
      prompt: "Complete the Name field for the person answering, not the person asking.",
      stimulus: "Kai: Wer bist du?\nAda: Ich bin Ada.\nName: …",
      acceptedAnswers: ["Ada"],
    },
  ],
};
export const unit1CheckForms = [unit1Check, unit1CheckB] as const;
export function unit1CheckForm(formId: string): AssessmentDefinition {
  const form = unit1CheckForms.find((definition) => definition.formId === formId);
  if (!form) throw Error("Unknown check form.");
  return form;
}
