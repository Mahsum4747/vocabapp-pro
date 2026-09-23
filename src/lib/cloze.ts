import { caseFormFor, type NounCase } from "./case-forms.ts";
import type { Card } from "./types";

/**
 * Cloze mode: blank the term out of a card's own example sentence, e.g.
 * "Ich trinke gern ___." for the card "Tee". Reuses `Card.example` — no new
 * data source, unlike the German-enrichment work (Phase 3A/3B).
 *
 * Grading (in the route) compares the typed answer against `answer` here —
 * the exact span found in the sentence, not the card's bare `term`. An
 * example built around an inflected form ("Söhne") blanks and grades
 * against that inflected form, not the singular lemma "Sohn" — the learner
 * has to produce what's actually grammatical in that sentence, which sidesteps
 * the inflected-form mismatch a lemma-only comparison would hit.
 */
export type ClozeBlank = {
  before: string;
  /** The exact substring matched in the sentence, original casing/accents. */
  answer: string;
  after: string;
  /**
   * Set only for a case-aware blank: the blank covers the inflected article
   * AND the noun ("den Vater") for this case, and is graded with
   * `caseBlankMatches` (exact form; case-fold and trim only). Absent = the
   * classic noun-only blank, graded as before.
   */
  caseBlank?: NounCase;
};

/**
 * Trim, collapse runs of spaces, case-fold. Deliberately NOT accent-folding
 * (unlike `answersMatch`): for an article+noun blank the umlaut/ß is part of
 * the answer, so "Bäume" must not pass as "Baume".
 */
export function caseBlankMatches(typed: string, answer: string): boolean {
  const norm = (s: string) => s.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
  const a = norm(typed);
  return a.length > 0 && a === norm(answer);
}

/** Lowercase + strip accents, one source character at a time — case- and
 *  accent-insensitive matching without disturbing anything else (no
 *  punctuation stripping, no whitespace collapsing), so indices stay usable. */
function fold(ch: string): string {
  return ch.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** A letter or digit — used to require a word boundary around the match, so
 *  "Sohn" never blanks itself out of the middle of "Söhne". */
const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Find `term` inside `example`, case- and accent-insensitively, and split
 * the sentence around its first occurrence. Returns `null` when the term
 * doesn't appear verbatim (modulo case/accent) — deliberately no stemming or
 * inflection-matching: guessing a span wrong would blank the wrong word.
 */
export function findBlankSpan(example: string, term: string): ClozeBlank | null {
  const termFolded = Array.from(term).map(fold).join("");
  if (!termFolded) return null;

  const chars = Array.from(example);
  let folded = "";
  const map: number[] = []; // folded-string index -> index into `chars`
  chars.forEach((ch, i) => {
    for (const fc of fold(ch)) {
      folded += fc;
      map.push(i);
    }
  });

  let searchFrom = 0;
  for (;;) {
    const idx = folded.indexOf(termFolded, searchFrom);
    if (idx === -1) return null;

    const startCharIdx = map[idx];
    const endCharIdx = map[idx + termFolded.length - 1];
    if (startCharIdx === undefined || endCharIdx === undefined) return null;

    const before = chars.slice(0, startCharIdx).join("");
    const after = chars.slice(endCharIdx + 1).join("");
    const precededByWordChar = WORD_CHAR.test(before.slice(-1));
    const followedByWordChar = WORD_CHAR.test(after.slice(0, 1));
    if (!precededByWordChar && !followedByWordChar) {
      return { before, answer: chars.slice(startCharIdx, endCharIdx + 1).join(""), after };
    }
    // Found mid-word (e.g. "Sohn" inside "Söhne") — keep looking.
    searchFrom = idx + 1;
  }
}

const CASE_EXAMPLE_KEYS: ReadonlyArray<readonly [NounCase, "akk" | "dat"]> = [
  ["akkusativ", "akk"],
  ["dativ", "dat"],
];

/**
 * Case-aware blank: from the card's own `examples.akk` / `examples.dat`,
 * blank the inflected article + noun together ("den Vater"), so a wrong
 * article form is caught, not just a forgotten noun. Only for a noun with a
 * known gender (verbs never have one, so they never enter this path); never
 * from `examples.nom`. When both cases are usable one is picked at random.
 * Returns null when no case sentence has the exact `form + term` adjacency.
 */
function caseAwareBlank(card: Card, pick: () => number): ClozeBlank | null {
  const gender = card.enrichment?.gender;
  if (!gender || !card.examples) return null;
  const usable: ClozeBlank[] = [];
  for (const [nounCase, key] of CASE_EXAMPLE_KEYS) {
    const sentence = card.examples[key]?.trim();
    if (!sentence) continue;
    const span = findBlankSpan(sentence, `${caseFormFor(gender, nounCase)} ${card.term}`);
    if (span) usable.push({ ...span, caseBlank: nounCase });
  }
  if (usable.length === 0) return null;
  return usable[Math.min(usable.length - 1, Math.floor(pick() * usable.length))] ?? null;
}

/**
 * Whether — and how — a card's own example can be blanked for Cloze mode.
 * Case-aware blank first (see `caseAwareBlank`); otherwise the classic
 * noun-only blank from `Card.example`, unchanged.
 */
export function clozeBlankForCard(card: Card, pick: () => number = Math.random): ClozeBlank | null {
  const caseBlank = caseAwareBlank(card, pick);
  if (caseBlank) return caseBlank;
  if (!card.example) return null;
  return findBlankSpan(card.example, card.term);
}
