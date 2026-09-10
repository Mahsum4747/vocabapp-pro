import type { NounIndex } from "./types.ts";

/**
 * Splitting German compounds is guesswork, and this module's API says so.
 *
 * "Wachstube" is either Wach|stube (a guardroom) or Wachs|tube (a tube of
 * wax). Nothing in the spelling decides it; only context does, and this code
 * has none. So there is deliberately no function here that returns *the*
 * split: `analyzeCompound` returns ranked candidates and tells you when the
 * top one is a coin flip, and a caller has to look at that to use the result.
 *
 * Pure over an injected `NounIndex`, so it can be tested against a ten-word
 * fixture as well as the real 102k-record dictionary.
 */

/**
 * German linking elements, SHORTEST first — that is, leaving the longest stem.
 * "Schreckenskammer" ends in "-ens", and stripping the longest match gives the
 * real but wrong "Schreck"; stripping just the "s" gives "Schrecken", which is
 * the word actually in there.
 */
const FUGEN = ["e", "n", "s", "er", "en", "es", "ens"] as const;

/** Below this, "parts" are noise: nearly every German string contains a
 *  two-letter word, and one-letter ones match everywhere. */
const MIN_PART_LENGTH = 3;

/** A part of a compound is a thing, not a name and not an abbreviation.
 *  Without this, "Zeit" and "Müller" match through their surname senses and
 *  half the map matches through Toponyms. Mirrors upstream's exclusions. */
const EXCLUDED_POS = new Set([
  "Buchstabe",
  "Abkürzung",
  "Wortverbindung",
  "Vorname",
  "Nachname",
  "Familienname",
  "Eigenname",
  "Straßenname",
  "Ortsnamengrundwort",
  "Toponym",
  "Symbol",
]);

/** Pronouns that are also spelled like the start of half the language. */
const EXCLUDED_WORDS = new Set(["ich", "du", "er", "sie", "es", "wir", "ihr"]);

/** Candidate segmentations kept per position while searching. Enough to keep
 *  real alternatives, small enough that a long compound stays linear. */
const BEAM_WIDTH = 12;

/** Candidates returned. More than a handful is noise, not information. */
const MAX_GUESSES = 5;

/** How close the runner-up has to be before the top guess stops being an
 *  answer and becomes a coin flip. */
const AMBIGUITY_MARGIN = 0.95;

/** One component of a candidate split. */
export interface CompoundPart {
  /** The dictionary form this part was recognized as ("Stube"). */
  lemma: string;
  /** The letters it actually occupied in the input ("stube"), including any
   *  linking element that was stripped to recognize it ("s" in "Arbeitszimmer"
   *  belongs to the surface of the preceding part). */
  surface: string;
}

/** One possible reading of a compound. A guess, as the name says. */
export interface CompoundGuess {
  parts: CompoundPart[];
  /** Relative plausibility, higher is better. Meaningful only for comparing
   *  guesses about the same word — it is a ranking key, not a probability. */
  score: number;
}

/**
 * The result of trying to read a word as a compound.
 *
 * There is no "the split" field on purpose. Read `guesses[0]` if you like, but
 * `ambiguous` is right next to it and you have to decide what to do about it.
 */
export interface CompoundAnalysis {
  /** The word as given. */
  word: string;
  /** Candidate readings, most plausible first. Empty means the word could not
   *  be read as a compound of known nouns — which is the common case for
   *  ordinary words, and is not an error. */
  guesses: CompoundGuess[];
  /**
   * True when the best guess is not meaningfully better than the next one, as
   * for Wach|stube vs Wachs|tube. A caller showing this to a learner should
   * show the alternatives or show nothing — never the first one alone as if
   * it were the answer.
   */
  ambiguous: boolean;
}

/** The lemma to credit a surface form to, or null if this form is not a
 *  usable compound part. */
function lemmaFor(form: string, index: NounIndex): string | null {
  if (form.length < MIN_PART_LENGTH || EXCLUDED_WORDS.has(form)) return null;
  const entries = index.lookup(form).filter((entry) => !entry.pos.some((p) => EXCLUDED_POS.has(p)));
  if (entries.length === 0) return null;
  // Prefer the sense whose lemma *is* this form over one that merely inflects
  // to it, so "Kinder" is credited to "Kind" only when no lemma "Kinder" exists.
  const exact = entries.find((entry) => entry.lemma.toLowerCase() === form);
  return (exact ?? entries[0]!).lemma;
}

/**
 * The lemma for the slice `surface`, trying it as written and then with each
 * linking element stripped. Linking elements only occur where one part joins
 * the next, so they are not tried on the final part.
 */
function partFor(surface: string, index: NounIndex, isFinal: boolean): CompoundPart | null {
  const direct = lemmaFor(surface, index);
  if (direct) return { lemma: direct, surface };
  if (isFinal) return null;
  for (const fuge of FUGEN) {
    if (!surface.endsWith(fuge)) continue;
    const stem = surface.slice(0, -fuge.length);
    const lemma = lemmaFor(stem, index);
    if (lemma) return { lemma, surface };
  }
  return null;
}

/** Longer parts are better than more parts: squaring rewards a two-part
 *  reading over the three-part one that carves a fragment off its head. */
function scoreOf(parts: readonly CompoundPart[]): number {
  return parts.reduce((total, part) => total + part.surface.length ** 2, 0);
}

function keyOf(guess: CompoundGuess): string {
  return guess.parts.map((part) => part.lemma).join("+");
}

/**
 * Read `word` as a compound of known nouns.
 *
 * Every segmentation into parts of `MIN_PART_LENGTH` or more is considered,
 * with linking elements allowed between them; the results are ranked by
 * preferring few long parts over many short ones. A word that is itself in the
 * dictionary is still analyzed — "Wachstube" is a listed lemma *and* a
 * compound — because the parts are the point, not the lookup.
 */
export function analyzeCompound(word: string, index: NounIndex): CompoundAnalysis {
  const lower = word.trim().toLowerCase();
  const empty: CompoundAnalysis = { word, guesses: [], ambiguous: false };
  if (lower.length < MIN_PART_LENGTH * 2) return empty;

  // paths[i] holds the best ways to account for the first i characters.
  const paths: CompoundGuess[][] = Array.from({ length: lower.length + 1 }, () => []);
  paths[0] = [{ parts: [], score: 0 }];

  for (let end = MIN_PART_LENGTH; end <= lower.length; end++) {
    const isFinal = end === lower.length;
    const reached: CompoundGuess[] = [];
    for (let start = 0; start <= end - MIN_PART_LENGTH; start++) {
      if (paths[start]!.length === 0) continue;
      const part = partFor(lower.slice(start, end), index, isFinal);
      if (!part) continue;
      for (const prefix of paths[start]!) {
        const parts = [...prefix.parts, part];
        reached.push({ parts, score: scoreOf(parts) });
      }
    }
    reached.sort((a, b) => b.score - a.score);
    paths[end] = reached.slice(0, BEAM_WIDTH);
  }

  const seen = new Set<string>();
  const guesses: CompoundGuess[] = [];
  for (const guess of paths[lower.length]!) {
    // One "part" covering the whole word is a dictionary hit, not a compound.
    if (guess.parts.length < 2) continue;
    const key = keyOf(guess);
    if (seen.has(key)) continue;
    seen.add(key);
    guesses.push(guess);
    if (guesses.length === MAX_GUESSES) break;
  }

  const [best, runnerUp] = guesses;
  return {
    word,
    guesses,
    ambiguous: Boolean(best && runnerUp && runnerUp.score >= best.score * AMBIGUITY_MARGIN),
  };
}
