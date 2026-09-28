import { KU_FORWARD_TSV } from "./ku-data.ts";
import { TR_REVERSE_TSV } from "./tr-data.ts";
import type { KurdishBundledEntry } from "./types.ts";

/**
 * Server-only lookup for the bundled Kurmancî (KU) <-> Turkish (TR) dataset
 * (see KURDISH-ATTRIBUTION.md) — same shape as `german/examples.server.ts`:
 * one big TSV string per direction, parsed once into a lazily-built Map, so
 * a cold start that never looks up a KU/TR term never pays the parse cost.
 *
 * A LOOKUP CAN RETURN MULTIPLE TRANSLATIONS, ON PURPOSE — unlike
 * `examples.server.ts`'s German rule ("more than one candidate -> null,
 * never guess which one"), this dataset's `translations` table has no
 * sense-level FK at all (see `KURDISH-ATTRIBUTION.md`): a multi-sense
 * headword's translations were never separable by sense in the source
 * data, so there is nothing to disambiguate BETWEEN — every gloss the
 * dictionary lists for a headword is presented, and the editor's chip UI
 * (`card-editor.tsx`) lets the person pick the one they meant. "Found" no
 * longer means "unambiguous": a lookup hit can carry 1 to 5 translations.
 *
 * What's still filtered out at build time (see `KURDISH-ATTRIBUTION.md`):
 *   - KU -> TR: a KU headword's dictionary entry is kept only if no OTHER
 *     entry shares that exact (lowercased) headword (`ambiguous_cross_entry`
 *     — 0 cases in the v2.5.0 release, so this filter passes almost every
 *     headword in practice). Multi-sense and cross-part-of-speech headwords
 *     are NO LONGER excluded — all of an included entry's Turkish
 *     translations are kept (deduped, capped at 5, in source row order).
 *   - TR -> KU: every Turkish string that translates at least one Kurdish
 *     headword is kept, pointing at ALL of the distinct Kurdish headwords
 *     it translates (deduped, capped at 5, in source row order) — not just
 *     a single "unambiguous" one anymore.
 *
 * Both TSVs are pre-capped at 5 translations/headwords per row at build
 * time; the `.slice(0, 5)` calls below are a defensive re-cap only, in case
 * the data is ever regenerated without the cap.
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
 * bundled for it. A hit can carry 1 to 5 translations (see module doc
 * comment) — never zero. Case-insensitive.
 */
export function lookupKurdishToTurkish(term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byKey } = forwardDict();
  const row = byKey.get(key);
  if (row === undefined) return null;
  const line = rows[row]!;
  const [headword = "", tr = ""] = line.split("\t");
  const translations = splitList(tr).slice(0, 5);
  if (translations.length === 0) return null;
  return { lemma: headword, translations };
}

/**
 * Look up the Kurmancî headword(s) a Turkish term translates, or `null`
 * when nothing is bundled for it. A hit can carry 1 to 5 headwords (see
 * module doc comment) — never zero. Case-insensitive.
 */
export function lookupTurkishToKurdish(term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byKey } = reverseDict();
  const row = byKey.get(key);
  if (row === undefined) return null;
  const line = rows[row]!;
  const [, headwords = ""] = line.split("\t");
  const translations = splitList(headwords).slice(0, 5);
  if (translations.length === 0) return null;
  return { lemma: translations[0]!, translations };
}

/** Records in the loaded forward/reverse dictionaries. Forces the build;
 *  used by tests. */
export function forwardDictionarySize(): number {
  return forwardDict().rows.length;
}

export function reverseDictionarySize(): number {
  return reverseDict().rows.length;
}
