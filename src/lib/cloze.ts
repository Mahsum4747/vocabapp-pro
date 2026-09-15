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
};

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

/** Whether — and how — a card's own example can be blanked for Cloze mode. */
export function clozeBlankForCard(card: Card): ClozeBlank | null {
  if (!card.example) return null;
  return findBlankSpan(card.example, card.term);
}
