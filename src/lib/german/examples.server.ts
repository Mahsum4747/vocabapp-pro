import { EXAMPLES_TSV } from "./examples-data.ts";

/**
 * Server-only lookup for the bundled German example/translation dataset —
 * same shape as nouns.server.ts (one big TSV string + a lazily-built lookup
 * Map), for the same reason: the data has no business in a browser bundle,
 * and a cold start that never looks up a German term never pays for it.
 *
 * Unlike the noun dictionary, this does NOT split compounds or rank
 * multiple senses: it returns the FIRST row (in file order) whose lemma
 * matches, whatever its part of speech. There is no equivalent, for
 * examples/translations, of "a compound's head decides the answer" the way
 * there is for gender — and the card editor has no separate POS input to
 * disambiguate with regardless. If the real dataset ever has multiple rows
 * for the same lemma under different parts of speech, this returns
 * whichever comes first; that is a known, accepted simplification, not a
 * bug, and worth revisiting only once real overlap is actually observed.
 */

type RowRef = number | number[];

interface Dictionary {
  rows: string[];
  /** Lower-cased lemma -> the row(s) it belongs to. */
  byLemma: Map<string, RowRef>;
  /** The same keys with ß folded to ss, consulted only when `byLemma`
   *  misses — same fallback nouns.server.ts uses, for the same reason: a
   *  user typing "Fussball" should still find "Fußball". */
  byFolded: Map<string, RowRef>;
}

export interface BundledEntry {
  /** The dictionary's own canonical spelling — NEVER the query string's
   *  casing. A lookup for "haus" must still report "Haus", exactly as
   *  Wiktionary capitalizes it; nothing here ever echoes user input back
   *  as if it were a fact about the word. */
  lemma: string;
  pos: string;
  gender: string | null;
  plural: string | null;
  examples: string[];
  translations: { en: string[]; tr: string[]; ku: string[] };
}

function fold(value: string): string {
  return value.replace(/ß/g, "ss");
}

function addRef(index: Map<string, RowRef>, key: string, row: number): void {
  const existing = index.get(key);
  if (existing === undefined) {
    index.set(key, row);
  } else if (typeof existing === "number") {
    if (existing !== row) index.set(key, [existing, row]);
  } else if (!existing.includes(row)) {
    existing.push(row);
  }
}

function refToRows(ref: RowRef | undefined): number[] {
  if (ref === undefined) return [];
  return typeof ref === "number" ? [ref] : ref;
}

/**
 * Builds the lookup structure from a raw TSV string. Exported (unlike
 * nouns.server.ts's equivalent) specifically so tests can inject a small
 * hand-written fixture instead of depending on the real committed data —
 * `examples-data.ts` is currently a 0-record placeholder (the real
 * dataset.jsonl was generated on a different machine and never reached this
 * repo), so there is nothing real to test lookups against yet. Once the
 * real data lands, a "loads every record the generator wrote" smoke test
 * (mirroring nouns.server.test.ts's own first test) belongs here too.
 */
export function buildIndexFromTsv(tsv: string): Dictionary {
  const rows = tsv.length > 0 ? tsv.split("\n") : [];
  const byLemma = new Map<string, RowRef>();
  const byFolded = new Map<string, RowRef>();

  for (let row = 0; row < rows.length; row++) {
    const line = rows[row]!;
    const firstTab = line.indexOf("\t");
    if (firstTab < 0) continue;
    const lemma = line.slice(0, firstTab);
    if (!lemma) continue;
    const key = lemma.toLowerCase();
    addRef(byLemma, key, row);
    const folded = fold(key);
    if (folded !== key) addRef(byFolded, folded, row);
  }

  return { rows, byLemma, byFolded };
}

let dictionary: Dictionary | null = null;

function dict(): Dictionary {
  dictionary ??= buildIndexFromTsv(EXAMPLES_TSV);
  return dictionary;
}

function splitList(value: string): string[] {
  return value ? value.split("|") : [];
}

function parseRow(line: string): BundledEntry {
  const [lemma = "", pos = "", gender = "", plural = "", examples = "", en = "", tr = "", ku = ""] =
    line.split("\t");
  return {
    lemma,
    pos,
    gender: gender || null,
    plural: plural || null,
    examples: splitList(examples),
    translations: { en: splitList(en), tr: splitList(tr), ku: splitList(ku) },
  };
}

/**
 * Look up the bundled example/translation entry for a German term, or
 * `null` when nothing is bundled for it — a real, common answer for a
 * dataset this size, not an error. Case-insensitive, and tolerant of "ss"
 * typed for "ß", same as `lookupNoun`.
 *
 * Split from `lookupBundled` (which fixes the dictionary to the real
 * committed data) specifically so tests can exercise this exact logic
 * against a fixture `Dictionary`, since `examples-data.ts` is currently a
 * 0-record placeholder with nothing real to look up yet.
 */
export function lookupInDictionary(dictionary: Dictionary, term: string): BundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byLemma, byFolded } = dictionary;
  const row = refToRows(byLemma.get(key))[0] ?? refToRows(byFolded.get(fold(key)))[0];
  if (row === undefined) return null;
  return parseRow(rows[row]!);
}

export function lookupBundled(term: string): BundledEntry | null {
  return lookupInDictionary(dict(), term);
}

/** Records in the loaded dictionary. Forces the build; used by tests. */
export function dictionarySize(): number {
  return dict().rows.length;
}
