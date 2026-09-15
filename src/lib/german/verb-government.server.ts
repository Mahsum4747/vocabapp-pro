import { VERB_GOVERNMENT_DATA } from "./verb-government-data.ts";
import type { VerbGovernment } from "../types.ts";

/**
 * Server-only lookup over the curated verb government (Rektion) dataset —
 * see verb-government-data.ts and GOVERNMENT-ATTRIBUTION.md for what this
 * is and where it came from. Built lazily, same lazy-singleton shape as
 * nouns.server.ts, though at 370 rows this is trivial next to that 102k-row
 * dictionary — kept server-only for architectural consistency with the rest
 * of the German enrichment pipeline, not because the data is large or secret.
 */

let index: Map<string, VerbGovernment[]> | null = null;

function build(): Map<string, VerbGovernment[]> {
  const map = new Map<string, VerbGovernment[]>();
  for (const entry of VERB_GOVERNMENT_DATA) {
    const key = entry.verb.toLowerCase();
    const list = map.get(key);
    const value = { preposition: entry.preposition, case: entry.case };
    if (list) list.push(value);
    else map.set(key, [value]);
  }
  return map;
}

function idx(): Map<string, VerbGovernment[]> {
  index ??= build();
  return index;
}

/**
 * Every preposition+case construction a verb governs, or `[]` if the verb
 * isn't in the curated dataset — absence here is a real, common answer (370
 * curated entries is a fraction of the German verb lexicon), not an error.
 * Case-insensitive but not otherwise fuzzy: no stemming, no compound
 * splitting — those don't apply to verb government the way they do to noun
 * gender, so a lookup miss is left as a miss rather than guessed at.
 */
export function lookupVerbGovernment(term: string): VerbGovernment[] {
  const key = term.trim().toLowerCase();
  if (!key) return [];
  return idx().get(key) ?? [];
}

/** Records in the loaded dataset. Forces the build; used by tests. */
export function verbGovernmentDatasetSize(): number {
  return VERB_GOVERNMENT_DATA.length;
}
