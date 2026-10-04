// Shared existing Hub labels; informational only, never mastery or eligibility.
export type CefrLevel = "A1.1" | "A1.2" | "A2.1" | "A2.2" | "B1.1" | "B1.2" | "B2" | "B2/C1";

export const CEFR_LEVEL: Partial<Record<string, CefrLevel>> = {
  articles: "A1.1",
  plural: "A1.1",
  pronomen: "A1.1",
  possessive: "A1.1",
  "nicht-kein": "A1.1",
  cases: "A1.2",
  conjugation: "A1.2",
  modalverben: "A1.2",
  "trennbare-verben": "A1.2",
  imperativ: "A1.2",
  adjektivendungen: "A2.1",
  steigerung: "A2.1",
  satzbau: "A2.1",
  cloze: "A2.2",
  diktat: "A2.2",
  passiv: "B1.1",
  relativsaetze: "B1.1",
  konjunktiv: "B1.2",
  partizipial: "B2",
  nominalisierung: "B2",
  funktionsverbgefuege: "B2",
  modalpartikeln: "B2",
  konjunktiv1: "B2/C1",
  "subjektive-modalverben": "B2/C1",
  passiversatzformen: "B2/C1",
};

export const CURRICULUM_TOPIC_IDS = [...Object.keys(CEFR_LEVEL), "lesen"] as const;
