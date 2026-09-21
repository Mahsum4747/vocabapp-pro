import type { CardEnrichment } from "./types.ts";

/** What a complete German noun card has: gender, plural, and one example sentence. */
export type MissingField = "gender" | "plural" | "example";

type CompletenessCard = {
  term: string;
  example?: string | null;
  enrichment?: CardEnrichment | null;
};

/**
 * A single capitalised word ("Tisch", "Haustür") — German's orthographic noun
 * signal, the same one the dictionary lookup routes on. A capitalised phrase
 * ("Guten Morgen") isn't treated as a noun: it has no gender to demand.
 */
export function isNounShaped(term: string): boolean {
  return /^\p{Lu}[\p{L}-]*$/u.test(term.trim());
}

/**
 * Which of gender / plural / example a German noun card still lacks, or `[]`
 * for a complete card and for anything that isn't a noun (a verb with its
 * government, a phrase, another language). Pass the card's RESOLVED enrichment
 * (dictionary fill included) — this only judges what is there.
 */
export function missingNounFields(card: CompletenessCard, isGermanTerm: boolean): MissingField[] {
  if (!isGermanTerm) return [];
  const e = card.enrichment;
  if (e?.governs?.length || e?.directCase) return [];
  if (!e?.gender && !isNounShaped(card.term)) return [];

  const missing: MissingField[] = [];
  if (!e?.gender) missing.push("gender");
  // An explicit "no plural" is a complete answer; a blank plural is not.
  if (!e?.plural?.trim() && !e?.noPlural) missing.push("plural");
  if (!card.example?.trim()) missing.push("example");
  return missing;
}

export function describeMissing(missing: readonly MissingField[]): string {
  return missing.join(", ");
}
