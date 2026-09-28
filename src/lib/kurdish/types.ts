/**
 * Result shape for the Kurmancî (KU) <-> Turkish (TR) bundled lookup —
 * mirrors `BundledEntry` in `src/lib/german/types.ts` closely enough that
 * `card-editor.tsx` can treat both as the same `BundledEntry` shape (see
 * `bundled-suggestions.ts`), but kept as its own type because this dataset
 * genuinely has less to offer: no gender/plural (KU/TR nouns don't carry
 * that the way German does) and no example sentences (out of scope for this
 * pipeline — see KURDISH-ATTRIBUTION.md).
 */
export interface KurdishBundledEntry {
  /** The dictionary's own headword (KU direction) or the first matched KU
   *  headword (TR direction, when the query matches 2+ headwords) — never
   *  the query string's casing. */
  lemma: string;
  /** Turkish gloss(es) for a KU query, or the matched KU headword(s) for a
   *  TR query — 1 to 5 entries, never empty when this entry is returned at
   *  all. */
  translations: string[];
}
