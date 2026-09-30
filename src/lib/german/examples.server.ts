import { EXAMPLES_TSV } from "./examples-data.ts";
import type { BundledEntry } from "./types.ts";

/**
 * Server-only lookup for the bundled German example/translation dataset —
 * same shape as nouns.server.ts (one big TSV string + a lazily-built lookup
 * Map), for the same reason: the data has no business in a browser bundle,
 * and a cold start that never looks up a German term never pays for it.
 *
 * Unlike the noun dictionary, this does NOT split compounds or rank
 * multiple senses. There is no equivalent, for examples/translations, of
 * "a compound's head decides the answer" the way there is for gender.
 *
 * AMBIGUOUS LEMMAS RETURN NOTHING, ON PURPOSE. The real 2,885-record
 * dataset has 322 lowercased lemmas with more than one row — 204 are
 * cross-POS ("gehen" the verb vs. "Gehen" the nominalized noun), 118 are
 * same-POS homographs that are just as risky ("Mensch" -> human being, or
 * a separate, vulgar "hussy" sense; "See" -> lake, or sea; "Bank" -> bench,
 * or financial bank). An earlier version of this picked "whichever row
 * comes first in file order" — confirmed, once the real dataset landed, to
 * silently return the WRONG sense for "gehen" (the noun "das Gehen"/"the
 * walking" instead of the verb). That is the same class of failure as the
 * "schmutzig" -> "çirkin" mistranslation Blocker 2 fixed for translation
 * senses: wrong information presented as correct is worse than nothing.
 *
 * The card editor has no POS input to disambiguate with (verified: there
 * is no part-of-speech concept anywhere in `Card`/`EditorCard` to pass
 * through), so there is no principled way to pick the right row here.
 * Returning `null` for any ambiguous lemma — cross-POS or same-POS alike —
 * degrades to the panel's existing, already-safe "nothing bundled, AI
 * action only" behavior, exactly like a lemma with no bundled data at all.
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
    // `de` is always empty here: a German entry has no Kurmancî-Ferheng+
    // German translation of ITSELF (that field is only ever filled by the
    // Kurdish->German lookup path in card-editor.tsx, never by this
    // dataset). Kept as an explicit `[]`, not an omitted field, so
    // `BundledEntry.translations` never needs an optional `de`.
    translations: { en: splitList(en), tr: splitList(tr), ku: splitList(ku), de: [] },
  };
}

/**
 * Look up the bundled example/translation entry for a German term, or
 * `null` when nothing is bundled for it OR the lemma is ambiguous (see the
 * module doc comment) — both are real, common, and equally "no safe answer"
 * outcomes for a dataset this size, not errors. Case-insensitive, and
 * tolerant of "ss" typed for "ß", same as `lookupNoun`.
 *
 * Split from `lookupBundled` (which fixes the dictionary to the real
 * committed data) specifically so tests can exercise this exact logic
 * against a fixture `Dictionary`.
 */
export function lookupInDictionary(dictionary: Dictionary, term: string): BundledEntry | null {
  const key = term.trim().toLowerCase();
  if (!key) return null;
  const { rows, byLemma, byFolded } = dictionary;

  const direct = refToRows(byLemma.get(key));
  if (direct.length > 0) return direct.length === 1 ? parseRow(rows[direct[0]!]!) : null;

  const folded = refToRows(byFolded.get(fold(key)));
  if (folded.length > 0) return folded.length === 1 ? parseRow(rows[folded[0]!]!) : null;

  return null;
}

export function lookupBundled(term: string): BundledEntry | null {
  return lookupInDictionary(dict(), term);
}

/** Records in the loaded dictionary. Forces the build; used by tests. */
export function dictionarySize(): number {
  return dict().rows.length;
}

/**
 * A1-friendly length cap for the Diktat drill's sentence pool — word count,
 * not difficulty: examples-data.ts has no CEFR/frequency-tier field to
 * filter on (see EXAMPLES-ATTRIBUTION.md — the dataset is frequency-
 * *bounded* at build time, never frequency-*ranked* within itself), so word
 * count is the only honest lever available. Measured against the real
 * dataset before picking this number: <=9 words keeps 3,709 of 5,412 total
 * example sentences (2,347 of 2,885 lemma rows have at least one) — nowhere
 * near thin enough to need loosening to 10.
 */
const DICTATION_MAX_WORDS = 9;

function wordCount(sentence: string): number {
  return sentence.trim().split(/\s+/).length;
}

/** Every example sentence at or under `DICTATION_MAX_WORDS` words, flattened
 *  across all lemma rows — the pool the Diktat drill (grammar.diktat.tsx)
 *  draws from. Built once, lazily, same shape as nouns.server.ts's
 *  `eligibleRows`. Filtering at the sentence level (not just "this row has
 *  at least one short example") matters: a row can mix a short and a long
 *  example, and only the short one should ever be picked. */
let dictationSentencePool: string[] | null = null;

function dictationSentences(): string[] {
  if (dictationSentencePool) return dictationSentencePool;
  const { rows } = dict();
  const out: string[] = [];
  for (const row of rows) {
    for (const example of parseRow(row).examples) {
      if (wordCount(example) <= DICTATION_MAX_WORDS) out.push(example);
    }
  }
  dictationSentencePool = out;
  return out;
}

/**
 * One random real German example sentence from `examples-data.ts`'s bundled
 * Wiktionary dataset, for the Diktat drill — NEVER a generated/AI sentence,
 * per that drill's own constraint (see grammar.diktat.tsx). `null` only if
 * the dataset genuinely has no examples at all (placeholder/empty file).
 */
export function randomExampleSentence(): string | null {
  const pool = dictationSentences();
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
