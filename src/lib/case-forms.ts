import type { GrammaticalGender } from "./types";

/**
 * Phase 2, Adım 2: the German definite-article case grid, A1 scope only —
 * Nominativ is already covered by the article drill (der/die/das), Genitiv
 * is out of scope. A fixed table, not a new CardEnrichment field: the
 * correct form is derived from a noun's EXISTING `enrichment.gender` at
 * render time, the same way `articleFor` derives the nominative article.
 * Deliberately not reusing `governs`/`directCase` — those describe a VERB's
 * government of a case (e.g. "helfen + dative"), a different question from
 * "decline this noun's own article," and the two are documented as mutually
 * exclusive per card by orthography (types.ts).
 */
export type NounCase = "akkusativ" | "dativ";

export const CASE_LABEL: Record<NounCase, string> = {
  akkusativ: "Akkusativ",
  dativ: "Dativ",
};

const CASE_FORM_TABLE: Record<GrammaticalGender, Record<NounCase, string>> = {
  m: { akkusativ: "den", dativ: "dem" },
  f: { akkusativ: "die", dativ: "der" },
  n: { akkusativ: "das", dativ: "dem" },
};

/** The one correct inflected article form for a gender × case pair. */
export function caseFormFor(gender: GrammaticalGender, nounCase: NounCase): string {
  return CASE_FORM_TABLE[gender][nounCase];
}

// Fixed grid order, not alphabetical or shuffled: dem appears twice in the
// table (masculine and neuter dative) but only once here — a tap grid shows
// each distinct form once. Nominative-familiar die/der/das lead, so a
// learner already anchored on those meets the case forms (den/dem) right
// after, not scattered.
const CASE_FORM_OPTIONS = ["die", "der", "das", "den", "dem"] as const;

/** Every distinct inflected form the grid can show, in a fixed display order. */
export function caseFormOptions(): readonly string[] {
  return CASE_FORM_OPTIONS;
}
