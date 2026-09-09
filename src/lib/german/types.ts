/** Grammatical gender. The source has exactly these three values. */
export type Genus = "m" | "f" | "n";

/**
 * One dictionary sense of a German noun.
 *
 * Every field is a list because German genuinely is: "Joghurt" is both
 * masculine and neuter, "Wort" pluralizes to both "Worte" and "Wörter" with
 * different meanings, and a lemma can be tagged as several parts of speech at
 * once. Collapsing any of these to a single value would mean picking one and
 * presenting a guess as a fact.
 */
export interface NounEntry {
  /** The dictionary form, in its original capitalization. */
  lemma: string;
  /** Genders, in source order. Empty for records the source leaves unmarked. */
  genus: Genus[];
  /**
   * Nominative plural forms. Empty is meaningful and common (~21% of records):
   * singularia tantum, mass nouns and most proper nouns have no plural, which
   * is not the same as "we don't know it".
   */
  plural: string[];
  /**
   * Part-of-speech tags. Always contains "Substantiv"; may additionally
   * contain "Vorname", "Nachname", "Toponym", "Eigenname", "Abkürzung", ...
   *
   * Callers enriching an ordinary vocabulary card should check this: someone
   * adding "Frankfurter" as a word must not be handed a place-name sense as
   * though it were the answer.
   */
  pos: string[];
}

/** Tags that mark a record as a name rather than an ordinary noun. */
export const NAME_POS = ["Vorname", "Nachname", "Familienname", "Eigenname", "Toponym", "Straßenname", "Ortsnamengrundwort"] as const;

/** Whether every sense of this entry is a proper name (place, surname, ...). */
export function isNameOnly(entry: NounEntry): boolean {
  return entry.pos.some((p) => (NAME_POS as readonly string[]).includes(p));
}

/**
 * The lookup surface `compound.ts` needs. Declared as an interface so the
 * compound splitter is a pure function over an index and can be tested with a
 * ten-word fixture instead of the full 102k-record dictionary.
 */
export interface NounIndex {
  /** Every sense filed under an exact, already-lowercased key. */
  lookup(key: string): NounEntry[];
}
