import { articleizedTerm, type LanguageProfile } from "./lang/profiles.ts";
import type { Card } from "./types.ts";

/**
 * "der Apfel" for a card whose gender is known, the term exactly as stored
 * when it isn't — an article is never guessed.
 *
 * Rendering only, like `articleizedTerm`: nothing here is written back to
 * `term`, compared in grading, or stored.
 */
export function displayTerm(card: Pick<Card, "term" | "enrichment">, profile: LanguageProfile): string {
  return articleizedTerm(card.term, card.enrichment, profile);
}

/**
 * Term string -> display string, for surfaces that only carry the bare term
 * (multiple-choice options, match tiles, missed lists).
 *
 * If two cards share a term but would display differently (one has a gender,
 * the other doesn't, or they disagree), the bare term is used for both:
 * showing one card's article on the other's answer would invent one.
 */
export function buildTermDisplay(
  cards: Pick<Card, "term" | "enrichment">[],
  profile: LanguageProfile,
): (term: string) => string {
  const byTerm = new Map<string, string | null>();
  for (const card of cards) {
    const shown = displayTerm(card, profile);
    const seen = byTerm.get(card.term);
    byTerm.set(card.term, seen === undefined || seen === shown ? shown : null);
  }
  return (term) => byTerm.get(term) ?? term;
}

/**
 * A German noun card with no known gender — the editor flags it as incomplete.
 *
 * "Noun" is the same signal the dictionary lookup uses (a capitalised term in a
 * language whose profile has noun enrichment); a lowercase term is a verb or
 * adjective and is never asked for an article.
 */
export function isIncompleteNoun(
  card: Pick<Card, "term" | "enrichment">,
  profile: LanguageProfile,
): boolean {
  const term = card.term.trim();
  if (!profile.hasNounEnrichment || !term) return false;
  const first = term.charAt(0);
  const capitalised = first !== first.toLowerCase() && first === first.toUpperCase();
  return capitalised && !card.enrichment?.gender;
}
