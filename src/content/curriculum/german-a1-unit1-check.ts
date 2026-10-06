import type { AssessmentDefinition } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";

/** Original unpublished tasks. Functional sampling, not essential-outcome certification.
 * Retakes reuse this exposed prototype family and are explicitly labelled repeats.
 * Bump compatibilityVersion for changed item IDs/order, response/grading contracts or target meanings.
 * Copy-only edits keep it stable; the stored definition hash is diagnostic.
 * Common forms/nouns recur by necessity; complete stimuli/tasks differ from lessons.
 */
export const unit1Check: AssessmentDefinition = {
  id: "DE.A1.U01.CHECK.PROTOTYPE.1",
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
