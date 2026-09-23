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

/**
 * The tap grid for one asked case: only that case's articles, never the
 * nominative and case forms mixed (der next to den is a test of telling two
 * cases apart, not a drill of the one being asked). Each distinct form shows
 * once — Dativ's masculine and neuter both take "dem", so it is "dem / der",
 * not a doubled button. Ordered by gender (m, f, n) so the layout is stable.
 */
export function caseFormOptions(nounCase: NounCase): readonly string[] {
  const forms = (["m", "f", "n"] as const).map((g) => CASE_FORM_TABLE[g][nounCase]);
  return [...new Set(forms)];
}

export const GENDER_LABEL_DE: Record<GrammaticalGender, string> = {
  m: "maskülen",
  f: "feminin",
  n: "neutral",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The card's own example sentence, but only when it visibly uses the ASKED
 * case: `correctForm` must stand right before the headword (with at most two
 * words between, e.g. "den guten Kaffee"). A sentence that doesn't (the
 * usual case: a Nominativ "Meine Freundin studiert in Hamburg.") returns
 * null so the reveal shows nothing rather than the wrong case. Never
 * invents or rewrites a sentence.
 *
 * die/das are identical in Nominativ and Akkusativ, so for those a match at
 * the very start of the sentence is treated as the subject (Nominativ) and
 * rejected.
 */
export function exampleForCase(
  sentence: string | null | undefined,
  term: string,
  correctForm: string,
  nominativeArticle: string | undefined,
  nounCase: NounCase,
): string | null {
  const text = sentence?.trim();
  if (!text || !term.trim()) return null;
  const re = new RegExp(
    `(?<![\\p{L}])${escapeRegExp(correctForm)}(?:\\s+[\\p{L}-]+){0,2}?\\s+${escapeRegExp(term.trim())}(?![\\p{L}])`,
    "iu",
  );
  const match = re.exec(text);
  if (!match) return null;
  if (nounCase === "akkusativ" && correctForm === nominativeArticle && match.index === 0) {
    return null;
  }
  return text;
}
