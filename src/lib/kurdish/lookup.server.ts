import { KU_FORWARD_TSV } from "./ku-data.ts";
import { TR_REVERSE_TSV } from "./tr-data.ts";
import { KU_DE_FORWARD_TSV, DE_KU_REVERSE_TSV } from "./de-data.ts";
import { KU_EN_FORWARD_TSV, EN_KU_REVERSE_TSV } from "./en-data.ts";
import type { KurdishBundledEntry } from "./types.ts";

/**
 * Server-only lookup for the bundled Kurmancî (KU) <-> {German, English,
 * Turkish} datasets (see KURDISH-ATTRIBUTION.md) — same shape as
 * `german/examples.server.ts`: one big TSV string per direction, parsed
 * once into a lazily-built Map, so a cold start that never looks up a
 * KU/DE/EN/TR term never pays the parse cost.
 *
 * All three target languages (de/en/tr) share the SAME shape and rules,
 * because they come from the same source table (`translations`), just
 * filtered by a different `language_code`:
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
 *   - KU -> {DE,EN,TR}: a KU headword's dictionary entry is kept only if no
 *     OTHER entry shares that exact (lowercased) headword
 *     (`ambiguous_cross_entry` — 0 cases in the v2.5.0 release, so this
 *     filter passes almost every headword in practice). Multi-sense and
 *     cross-part-of-speech headwords are NOT excluded — all of an included
 *     entry's translations (for that target language) are kept (deduped,
 *     capped at 5, in source row order).
 *   - {DE,EN,TR} -> KU: every target-language string that translates at
 *     least one Kurdish headword is kept, pointing at ALL of the distinct
 *     Kurdish headwords it translates (deduped, capped at 5, in source row
 *     order) — not just a single "unambiguous" one.
 *
 * All TSVs are pre-capped at 5 translations/headwords per row at build
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

// Same shape/parser as buildForward — every reverse TSV's rows are
// "text \t headword(s)", already lowercased on the query side at build
// time.
const buildReverse = buildForward;

function splitList(value: string): string[] {
  return value ? value.split("|") : [];
}

/** Look up column 2 of a forward-direction row for `term`, or `null`. The
 *  lemma returned is the row's own headword (column 1), never the query's
 *  casing. */
function lookupForward(dict: Direction, term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const row = dict.byKey.get(key);
  if (row === undefined) return null;
  const line = dict.rows[row]!;
  const [headword = "", value = ""] = line.split("\t");
  const translations = splitList(value).slice(0, 5);
  if (translations.length === 0) return null;
  return { lemma: headword, translations };
}

/** Look up column 2 of a reverse-direction row for `term`, or `null`. The
 *  lemma returned is the first matched KU headword (never the query's
 *  casing). */
function lookupReverse(dict: Direction, term: string): KurdishBundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const row = dict.byKey.get(key);
  if (row === undefined) return null;
  const line = dict.rows[row]!;
  const [, headwords = ""] = line.split("\t");
  const translations = splitList(headwords).slice(0, 5);
  if (translations.length === 0) return null;
  return { lemma: translations[0]!, translations };
}

// Lazily-built dictionaries, one pair per target language. Each is built at
// most once, the first time its own lookup function is actually called.
let kuTr: Direction | null = null;
let trKu: Direction | null = null;
let kuDe: Direction | null = null;
let deKu: Direction | null = null;
let kuEn: Direction | null = null;
let enKu: Direction | null = null;

function kuTrDict(): Direction {
  kuTr ??= buildForward(KU_FORWARD_TSV);
  return kuTr;
}
function trKuDict(): Direction {
  trKu ??= buildReverse(TR_REVERSE_TSV);
  return trKu;
}
function kuDeDict(): Direction {
  kuDe ??= buildForward(KU_DE_FORWARD_TSV);
  return kuDe;
}
function deKuDict(): Direction {
  deKu ??= buildReverse(DE_KU_REVERSE_TSV);
  return deKu;
}
function kuEnDict(): Direction {
  kuEn ??= buildForward(KU_EN_FORWARD_TSV);
  return kuEn;
}
function enKuDict(): Direction {
  enKu ??= buildReverse(EN_KU_REVERSE_TSV);
  return enKu;
}

/**
 * Look up Turkish gloss(es) for a Kurmancî term, or `null` when nothing is
 * bundled for it. A hit can carry 1 to 5 translations (see module doc
 * comment) — never zero. Case-insensitive.
 */
export function lookupKurdishToTurkish(term: string): KurdishBundledEntry | null {
  return lookupForward(kuTrDict(), term);
}

/**
 * Look up the Kurmancî headword(s) a Turkish term translates, or `null`
 * when nothing is bundled for it. A hit can carry 1 to 5 headwords (see
 * module doc comment) — never zero. Case-insensitive.
 */
export function lookupTurkishToKurdish(term: string): KurdishBundledEntry | null {
  return lookupReverse(trKuDict(), term);
}

/** German gloss(es) for a Kurmancî term, or `null`. Same rules as
 *  `lookupKurdishToTurkish`, different target language. */
export function lookupKurdishToGerman(term: string): KurdishBundledEntry | null {
  return lookupForward(kuDeDict(), term);
}

/** Kurmancî headword(s) a German term translates, or `null`. Same rules as
 *  `lookupTurkishToKurdish`, different source language. */
export function lookupGermanToKurdish(term: string): KurdishBundledEntry | null {
  return lookupReverse(deKuDict(), term);
}

/** English gloss(es) for a Kurmancî term, or `null`. Same rules as
 *  `lookupKurdishToTurkish`, different target language. */
export function lookupKurdishToEnglish(term: string): KurdishBundledEntry | null {
  return lookupForward(kuEnDict(), term);
}

/** Kurmancî headword(s) an English term translates, or `null`. Same rules
 *  as `lookupTurkishToKurdish`, different source language. */
export function lookupEnglishToKurdish(term: string): KurdishBundledEntry | null {
  return lookupReverse(enKuDict(), term);
}

/** Records in the loaded KU->TR forward dictionary. Forces the build; used
 *  by tests. */
export function forwardDictionarySize(): number {
  return kuTrDict().rows.length;
}

/** Records in the loaded TR->KU reverse dictionary. Forces the build; used
 *  by tests. */
export function reverseDictionarySize(): number {
  return trKuDict().rows.length;
}

/** Records in the loaded KU->DE forward dictionary. Forces the build; used
 *  by tests. */
export function germanForwardDictionarySize(): number {
  return kuDeDict().rows.length;
}

/** Records in the loaded DE->KU reverse dictionary. Forces the build; used
 *  by tests. */
export function germanReverseDictionarySize(): number {
  return deKuDict().rows.length;
}

/** Records in the loaded KU->EN forward dictionary. Forces the build; used
 *  by tests. */
export function englishForwardDictionarySize(): number {
  return kuEnDict().rows.length;
}

/** Records in the loaded EN->KU reverse dictionary. Forces the build; used
 *  by tests. */
export function englishReverseDictionarySize(): number {
  return enKuDict().rows.length;
}
