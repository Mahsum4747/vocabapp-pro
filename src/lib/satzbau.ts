import type { Card } from "./types";

/**
 * Satzbau mode: reconstruct a card's own example sentence by tapping
 * shuffled word chips into the right order. Reuses `Card.example` — no new
 * data source, same as Cloze.
 *
 * Tokenization is a plain whitespace split — punctuation stays attached to
 * whichever word it's adjacent to ("weiter.", "weiß,", "„Wort"") rather than
 * becoming its own chip. That keeps grading a simple exact-sequence
 * comparison and reads naturally: nobody wants to separately place a lone
 * comma. Casing is kept exactly as written in the example, deliberately not
 * normalized — capitalization (sentence-initial word, German noun
 * capitalization) is a real grammar cue here, not a hint worth hiding.
 *
 * Not language-specific: any set with example sentences is eligible, same
 * as Cloze.
 */

const MIN_WORDS = 4;
const MAX_WORDS = 12;

/** Split a sentence into chips — one per whitespace-delimited token, kept in
 *  original order and casing. */
export function tokenizeSentence(example: string): string[] {
  return example.trim().split(/\s+/).filter(Boolean);
}

/**
 * The chips for a card's own example, in correct order, or `null` when the
 * example is missing or its word count falls outside [MIN_WORDS, MAX_WORDS]
 * — too short is a trivial reorder (few permutations to get wrong), too
 * long is tedious to tap through on a phone-width chip pool.
 */
export function satzbauChipsForCard(card: Card): string[] | null {
  if (!card.example) return null;
  const chips = tokenizeSentence(card.example);
  if (chips.length < MIN_WORDS || chips.length > MAX_WORDS) return null;
  return chips;
}

/**
 * A shuffle of `chips` that is never the original order verbatim — a
 * scramble that happens to reproduce the answer defeats the exercise before
 * it starts, most likely right at the MIN_WORDS end where there are few
 * permutations to begin with. Capped at 20 reshuffle attempts so a
 * pathological all-duplicate-word input (which has no other valid
 * permutation) can't loop forever; falling through just returns that last
 * attempt, order-equal-to-original or not. Never mutates `chips`.
 */
export function shuffleChips(chips: readonly string[]): string[] {
  if (chips.length < 2) return [...chips];

  const shuffleOnce = () => {
    const result = [...chips];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  let result = shuffleOnce();
  for (let attempt = 0; attempt < 20 && result.every((word, i) => word === chips[i]); attempt++) {
    result = shuffleOnce();
  }
  return result;
}
