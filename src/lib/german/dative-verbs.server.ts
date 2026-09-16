import { DATIVE_VERB_DATA } from "./dative-verbs-data.ts";

/**
 * Server-only lookup over the curated fixed-dative-object verb dataset —
 * see dative-verbs-data.ts and DATIVE-ATTRIBUTION.md for what this is and
 * where it came from. Same lazy-singleton shape as verb-government.server.ts.
 */

let index: Set<string> | null = null;

function build(): Set<string> {
  return new Set(DATIVE_VERB_DATA.map((entry) => entry.verb.toLowerCase()));
}

function idx(): Set<string> {
  index ??= build();
  return index;
}

/**
 * Whether `term` is a curated fixed-dative-object verb ("helfen", "danken",
 * ...) — `false` if it isn't in the dataset, not an error. Absence is a real,
 * common answer: this is a closed, hand-compiled list, not exhaustive of
 * every German verb that can govern a bare dative. Case-insensitive but not
 * otherwise fuzzy, same reasoning as `lookupVerbGovernment`.
 */
export function isDativeVerb(term: string): boolean {
  const key = term.trim().toLowerCase();
  if (!key) return false;
  return idx().has(key);
}

/** Records in the loaded dataset. Forces the build; used by tests. */
export function dativeVerbDatasetSize(): number {
  return DATIVE_VERB_DATA.length;
}
