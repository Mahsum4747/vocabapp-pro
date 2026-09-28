import { KU_FORWARD_TSV } from "./ku-data.ts";
import { TR_REVERSE_TSV } from "./tr-data.ts";
import type { KurdishBundledEntry } from "./types.ts";

/**
 * Server-only lookup for the bundled Kurmancî (KU) <-> Turkish (TR) dataset
 * (see KURDISH-ATTRIBUTION.md) — same shape as `german/examples.server.ts`:
 * one big TSV string per direction, parsed once into a lazily-built Map, so
 * a cold start that never looks up a KU/TR term never pays the parse cost.
 *
 * AMBIGUOUS TERMS RETURN NOTHING, ON PURPOSE — the exact same decision
 * `examples.server.ts` documents for German, applied here for the same
 * reason: this app's editor has no part-of-speech input to disambiguate
 * with, so there is no principled way to guess which sense a bare typed
 * term means. Both datasets were already filtered at build time (see
 * `KURDISH-ATTRIBUTION.md`) to contain ONLY unambiguous records, so at
 * runtime "found" and "unambiguous" are the same thing: a lookup miss here
 * covers both "never in the dictionary" and "was in the dictionary but
 * ambiguous," indistinguishably, matching the German module's own contract.
 *
 * What "unambiguous" meant at build time, for the record (the filtering
 * itself already happened, offline, before this file's data existed):
 *   - KU -> TR: a KU headword's dictionary entry is kept only if (a) no
 *     OTHER entry shares that exact (lowercased) headword, (b) all of its
 *     senses share one part-of-speech `section` tag, and (c) it has
 *     exactly one sense. Any of those failing means the headword's meaning
 *     isn't pinned down by a bare string match, so it's left out entirely.
 *   - TR -> KU: the source `translations` table has no sense-level FK (see
 *     KURDISH-ATTRIBUTION.md) — a translation belongs to an entry, not a
 *     sense — so a Turkish string is kept only if it is never listed as a
 *     translation of more than one DISTINCT Kurdish headword, across every
 *     Kurdish entry (ambiguous or not) that lists it. A Turkish word that
 *     genuinely translates several different Kurdish words (a common,
 *     general word) is exactly the case this excludes.
 */

interface Direction {
  rows: string[];
  byKey: Map<string, number>;
}

function buildForward(tsv: string): Direction {
  const rows = tsv.length > 0 ? tsv.split("\n") : [];
  const byKey = new Map<string, number>();
  for (let row = 0; row < rows.length; row++) {
    const line = rows[row]!;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const headword = line.slice(0, tab);
    if (!headword) continue;
    const key = headword.trim().toLowerCase();
    // Build-time filtering already guarantees at most one row per key; a
    // duplicate here would be a data-pipeline bug, not a real ambiguity —
    // still handled safely by just keeping the first row.
    if (!byKey.has(key)) byKey.set(key, row);
  }
  return { rows, byKey };
}

function buildReverse(tsv: string): Direction {
  // Same shape/parser as buildForward — the TR_REVERSE_TSV rows are
  // "tr \t headword", already lowercased on the TR side at build time.
  return buildForward(tsv);
}

let forward: Direction | null = null;
let reverse: Direction | null = null;

function forwardDict(): Direction {
  forward ??= buildForward(KU_FORWARD_TSV);
  return forward;
}

function reverseDict(): Direction {
  reverse ??= buildReverse(TR_REVERSE_TSV);
  return reverse;
}

function splitList(value: string): string[] {
  return value ? value.split("|") : [];
}

/**
 * Look up Turkish gloss(es) for a Kurmancî term, or `null` when nothing is
 * bundled for it OR the term is ambiguous (both indistinguishable — see the
 * module doc comment). Case-insensitive.
 */
export function lookupKurdishToTurkish(term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byKey } = forwardDict();
  const row = byKey.get(key);
  if (row === undefined) return null;
  const line = rows[row]!;
  const [headword = "", tr = ""] = line.split("\t");
  const translations = splitList(tr);
  if (translations.length === 0) return null;
  return { lemma: headword, translations };
}

/**
 * Look up the single Kurmancî headword a Turkish term unambiguously
 * translates, or `null` (see module doc comment). Case-insensitive.
 */
export function lookupTurkishToKurdish(term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byKey } = reverseDict();
  const row = byKey.get(key);
  if (row === undefined) return null;
  const line = rows[row]!;
  const [, headword = ""] = line.split("\t");
  if (!headword) return null;
  return { lemma: headword, translations: [headword] };
}

/** Records in the loaded forward/reverse dictionaries. Forces the build;
 *  used by tests. */
export function forwardDictionarySize(): number {
  return forwardDict().rows.length;
}

export function reverseDictionarySize(): number {
  return reverseDict().rows.length;
}
