/**
 * German example/translation dataset — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/build-german-examples.mjs <path-to-dataset.jsonl>
 *
 * *** PLACEHOLDER — 0 records. ***
 * This is NOT real data. Regenerate against the real dataset.jsonl
 * before enabling LanguageProfile.hasBundledSuggestions in production.
 *
 * Source:   German Wiktionary (https://de.wiktionary.org), via kaikki.org's
 *           wiktextract JSON extraction.
 * Filtered: by this repo's offline measurement kit (see
 *           EXAMPLES-ATTRIBUTION.md for the full pipeline and license chain).
 *
 * Format: one record per line, tab-separated, eight columns:
 *   lemma \t pos \t gender \t plural \t examples \t en \t tr \t ku
 * where gender/plural are noun-only (empty otherwise), and examples/en/tr/ku
 * are "|"-separated lists (possibly empty).
 *
 * Held as one string rather than an object literal — same reasoning as
 * NOUNS_TSV in nouns-data.ts: a large object literal is parsed as code on
 * every cold start, while this is one string the engine skips over until
 * something actually splits it.
 */
export const EXAMPLES_TSV = ``;

/** Records in `EXAMPLES_TSV` — asserted by the loader's tests as a smoke
 *  check that the data file and the loader were regenerated together. */
export const EXAMPLES_TSV_ROWS = 0;
