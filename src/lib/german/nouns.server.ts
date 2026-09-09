import { NOUNS_TSV, NOUNS_TSV_ROWS } from "./nouns-data.ts";
import type { Genus, NounEntry, NounIndex } from "./types.ts";

/**
 * Server-only German noun dictionary: ~102k lemmas with gender, plural and
 * part-of-speech, looked up in memory with no network call and no per-request
 * cost beyond a Map hit.
 *
 * Server-only for the same reason Firestore access is: the data has no
 * business in a browser bundle. It is 2.9 MB, and shipping it to every visitor
 * to save one server function call would be a bad trade in both directions.
 *
 * Built lazily on first lookup and kept for the life of the instance, the same
 * shape as `firebase-admin.server.ts`'s lazy singleton — a cold start that
 * never looks up a German noun never pays for the dictionary at all.
 */

/** Every record in the source carries it, so the generated file omits it.
 *  Keep in sync with scripts/build-german-nouns.mjs. */
const IMPLIED_POS = "Substantiv";

/** A form maps to one record far more often than several, so the common case
 *  stores the row number bare rather than allocating 100k single-element
 *  arrays. Worth the union: it is most of the index. */
type RowRef = number | number[];

interface Dictionary {
  rows: string[];
  /** Lower-cased lemma and plural forms -> the rows they belong to. */
  byForm: Map<string, RowRef>;
  /** The same keys with ß folded to ss, consulted only when `byForm` misses,
   *  so a user typing "Strasse" still finds "Straße" without that fold ever
   *  changing what an exact match resolves to. */
  byFolded: Map<string, RowRef>;
}

let dictionary: Dictionary | null = null;

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

function build(): Dictionary {
  const rows = NOUNS_TSV.split("\n");
  const byForm = new Map<string, RowRef>();
  const byFolded = new Map<string, RowRef>();

  for (let row = 0; row < rows.length; row++) {
    const line = rows[row]!;
    // Only the first two columns are needed to index; parsing the rest is
    // deferred to whichever rows a caller actually asks for.
    const firstTab = line.indexOf("\t");
    if (firstTab < 0) continue;
    const lemma = line.slice(0, firstTab);
    const secondTab = line.indexOf("\t", firstTab + 1);
    const thirdTab = line.indexOf("\t", secondTab + 1);
    const plurals = line.slice(secondTab + 1, thirdTab);

    for (const form of [lemma, ...(plurals ? plurals.split("|") : [])]) {
      const key = form.toLowerCase();
      if (!key) continue;
      addRef(byForm, key, row);
      const folded = fold(key);
      if (folded !== key) addRef(byFolded, folded, row);
    }
  }

  return { rows, byForm, byFolded };
}

function dict(): Dictionary {
  dictionary ??= build();
  return dictionary;
}

function parseRow(line: string): NounEntry {
  const [lemma = "", genus = "", plural = "", pos = ""] = line.split("\t");
  return {
    lemma,
    genus: genus ? (genus.split("|") as Genus[]) : [],
    plural: plural ? plural.split("|") : [],
    pos: [IMPLIED_POS, ...(pos ? pos.split("|") : [])],
  };
}

/**
 * Every sense filed under an exact, already-lowercased key — the raw index
 * lookup, with no ß fallback and no ranking. This is what the compound
 * splitter walks; `lookupNoun` is the one callers want.
 */
export function lookupExact(key: string): NounEntry[] {
  const { rows, byForm } = dict();
  return refToRows(byForm.get(key)).map((row) => parseRow(rows[row]!));
}

/** The dictionary as a `NounIndex`, for `analyzeCompound`. */
export const germanNouns: NounIndex = { lookup: lookupExact };

/**
 * Look up a German noun by any of its nominative forms — the lemma itself, or
 * a plural ("Fahrräder" finds "Fahrrad"). Case-insensitive, and tolerant of
 * "ss" typed for "ß".
 *
 * Returns every matching sense, entries whose lemma *is* the query first, then
 * source order. An empty array means the word is not in the dictionary, which
 * for a 102k-lemma extract of Wiktionary is a real answer, not an error: rare
 * compounds and technical terms genuinely are absent, and `analyzeCompound`
 * exists for exactly that case.
 */
export function lookupNoun(word: string): NounEntry[] {
  const key = word.trim().toLowerCase();
  if (!key) return [];
  const { rows, byForm, byFolded } = dict();
  // Exact matches first, then ss/ß ones. Not `??`: "Strasse" is itself a real
  // exact match (a plural of "Strass"), and short-circuiting there would hide
  // "Straße", which is what the person almost certainly meant.
  const matched = [...refToRows(byForm.get(key)), ...refToRows(byFolded.get(fold(key)))];
  const entries = [...new Set(matched)].map((row) => parseRow(rows[row]!));
  // A lemma match is what someone typing a word means; a plural match is a
  // useful second-best. Stable within each group, so the order above survives.
  return entries.sort(
    (a, b) => Number(b.lemma.toLowerCase() === key) - Number(a.lemma.toLowerCase() === key),
  );
}

/** Records in the loaded dictionary. Forces the build; used by tests. */
export function dictionarySize(): number {
  return dict().rows.length;
}

/** Asserted by the tests: data file and loader must be regenerated together. */
export const EXPECTED_ROWS = NOUNS_TSV_ROWS;
