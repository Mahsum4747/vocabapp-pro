import { analyzeCompound } from "./compound.ts";
import { germanNouns, lookupNoun } from "./nouns.server.ts";
import { isNameOnly, type NounEntry } from "./types.ts";
import type { CardEnrichment, GrammaticalGender } from "../types.ts";

/**
 * Server-only: derive a `CardEnrichment` for a German noun term, or `null`
 * when there is nothing safe to fill in silently.
 *
 * "Safe" is the operative word, and the contract is the same one
 * `analyzeCompound` already keeps: answer less often, and be right every
 * time it does. A field is only filled when every non-name sense of the
 * word agrees on it. The moment two senses disagree — "Joghurt" is
 * m/f/n, "Wort" pluralizes to both "Worte" and "Wörter" with different
 * meanings — that field is left blank rather than asserting one of them
 * as fact. Gender and plural are judged independently, so a word can get
 * one filled and not the other.
 *
 * Two sources, tried in order:
 *  1. An exact dictionary hit for the term itself (not `inferred`).
 *  2. Failing that, the head of a compound split — German compounds take
 *     their gender and plural from their last part ("Haustür" is
 *     feminine because "Tür" is), so `analyzeCompound`'s head is looked
 *     up the same way. Only used when the split itself isn't ambiguous;
 *     inferring from an arbitrarily-picked guess among several plausible
 *     splits would be a guess about a guess. Always `inferred: true`.
 *
 * Name-only senses (`isNameOnly`) never contribute a value on either path
 * — an ordinary vocabulary card must never be handed a place name or a
 * surname's (non-)gender as though it were the word's.
 */

function uniqueGenderOf(entries: readonly NounEntry[]): GrammaticalGender | undefined {
  const genders = new Set(entries.flatMap((entry) => entry.genus));
  return genders.size === 1 ? ([...genders][0] as GrammaticalGender) : undefined;
}

function uniquePluralOf(entries: readonly NounEntry[]): string | undefined {
  const plurals = new Set(entries.flatMap((entry) => entry.plural));
  return plurals.size === 1 ? [...plurals][0] : undefined;
}

/** Builds an enrichment from whichever fields every usable sense agrees on,
 *  or `null` if none of them agree on anything, or every sense was a name. */
function enrichmentFrom(entries: readonly NounEntry[], inferred: boolean): CardEnrichment | null {
  const usable = entries.filter((entry) => !isNameOnly(entry));
  if (usable.length === 0) return null;

  const gender = uniqueGenderOf(usable);
  const plural = uniquePluralOf(usable);
  if (gender === undefined && plural === undefined) return null;

  return {
    ...(gender !== undefined ? { gender } : {}),
    ...(plural !== undefined ? { plural } : {}),
    source: "dict",
    ...(inferred ? { inferred: true as const } : {}),
  };
}

/** The lemma of a compound's head (its last part) — the sense that decides
 *  German compound gender and plural — or `null` if the word doesn't split,
 *  or splits ambiguously enough that picking one guess's head would be
 *  guessing twice over. */
function compoundHeadLemma(term: string): string | null {
  const analysis = analyzeCompound(term, germanNouns);
  if (analysis.ambiguous) return null;
  const best = analysis.guesses[0];
  if (!best) return null;
  return best.parts.at(-1)?.lemma ?? null;
}

export function enrichGermanTerm(term: string): CardEnrichment | null {
  const trimmed = term.trim();
  if (!trimmed) return null;

  const direct = enrichmentFrom(lookupNoun(trimmed), false);
  if (direct) return direct;

  const headLemma = compoundHeadLemma(trimmed);
  if (!headLemma) return null;
  return enrichmentFrom(lookupNoun(headLemma), true);
}
