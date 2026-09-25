/**
 * Static Turkish UI strings for write-it-step.tsx — same pilot pattern as
 * src/content/a1-german-nouns-tr.ts (Adım 4): hand-written, not AI-
 * generated, not tied to any Firestore field. That file translates
 * per-noun gloss/feedback; this one translates the write-it step's own
 * fixed instruction/button/feedback copy, which isn't per-noun at all —
 * a separate small map, same "static, Gemini-free, EN fallback" rule.
 *
 * `explanationLanguage !== "tr"` (or any other/missing value) always
 * falls through to English — never blank.
 */
type WriteItStrings = {
  label: string;
  /** Split around the emphasized phrase (e.g. "den Vater") so the caller
   *  can bold it — same visual treatment in either language, just
   *  different surrounding text/word order. */
  instruction: (phrase: string) => { before: string; after: string };
  placeholder: (example: string) => string;
  check: string;
  correct: string;
  incorrect: (phrase: string) => string;
};

const EN: WriteItStrings = {
  label: "Write it — optional",
  instruction: () => ({ before: "Write a short sentence using ", after: "." }),
  placeholder: (example) => `e.g. "${example}"`,
  check: "Check",
  correct: "Nice — that's the right form.",
  incorrect: (phrase) => `Almost — the form here is "${phrase}".`,
};

const TR: WriteItStrings = {
  label: "Yazma adımı — opsiyonel",
  instruction: () => ({ before: "", after: " kullanarak kısa bir cümle yaz." }),
  placeholder: (example) => `örn. "${example}"`,
  check: "Kontrol et",
  correct: "Harika — doğru hâl bu.",
  incorrect: (phrase) => `Neredeyse — doğru hâl: "${phrase}".`,
};

export function writeItStrings(explanationLanguage: string | null | undefined): WriteItStrings {
  return explanationLanguage === "tr" ? TR : EN;
}
