/**
 * Offline, one-time build of the bundled German example/translation dataset.
 *
 * NOT part of `npm run build` — same reasoning as build-german-nouns.mjs:
 * this repo has no data pipeline, and the input isn't something the build
 * step should ever fetch or regenerate on its own. Run it by hand when the
 * dataset is refreshed and commit its output:
 *
 *   node scripts/build-german-examples.mjs <path-to-dataset.jsonl>
 *
 * Input:  a JSONL file, one record per line, in the exact shape the
 *         measurement kit's `measure.mjs --extract-out` produces:
 *           { lemma, pos, gender?, plural?, examples: string[],
 *             translations: { en: string[], tr: string[], ku: string[] } }
 * Output: src/lib/german/examples-data.ts — a single TSV string, eight
 *         columns, the exact shape measure.mjs's own --measure-heap step
 *         already builds and measured (see its README.txt v6/v7 changelog
 *         for why: one static string + a lazy Map is the same technique
 *         nouns-data.ts/nouns.server.ts already ship, not a new one).
 *
 * See src/lib/german/EXAMPLES-ATTRIBUTION.md — the data is derived from
 * German Wiktionary content and carries the same CC BY-SA obligations as
 * the noun dictionary.
 */
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { gzipSync } from "node:zlib";

const OUT_FILE = new URL("../src/lib/german/examples-data.ts", import.meta.url);

/** Tab/newline/pipe are the TSV structure's own separators — any occurring
 *  inside a field's actual text is space-escaped so the column split on the
 *  read side stays exact, never best-effort. Same rule measure.mjs's own
 *  --measure-heap step already applies to this exact record shape. */
function escape(value) {
  return String(value ?? "").replace(/[\t\n|]/g, " ");
}

function toTsvLine(record) {
  const t = record.translations ?? { en: [], tr: [], ku: [] };
  return [
    escape(record.lemma),
    record.pos ?? "",
    escape(record.gender ?? ""),
    escape(record.plural ?? ""),
    (record.examples ?? []).map(escape).join("|"),
    (t.en ?? []).map(escape).join("|"),
    (t.tr ?? []).map(escape).join("|"),
    (t.ku ?? []).map(escape).join("|"),
  ].join("\t");
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("usage: node scripts/build-german-examples.mjs <path-to-dataset.jsonl>");
    process.exit(1);
  }

  const input = createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });
  const lines = [];
  let recordsRead = 0;
  let skipped = 0;

  for await (const line of input) {
    if (!line.trim()) continue;
    recordsRead++;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      skipped++;
      continue;
    }
    if (!record.lemma || !record.pos) {
      skipped++;
      continue;
    }
    lines.push(toTsvLine(record));
  }

  const tsv = lines.join("\n");
  // The data is machine-extracted German/English/Turkish/Kurdish text;
  // nothing in it should be able to break out of a template literal, but
  // assert rather than trust — same guard build-german-nouns.mjs applies.
  if (/[`\\]|\$\{/.test(tsv)) {
    throw new Error("data would not survive a template literal — check for stray backticks/${ in input");
  }

  const placeholderNotice =
    lines.length === 0
      ? ` *\n * *** PLACEHOLDER — 0 records. ***\n * This is NOT real data. Regenerate against the real dataset.jsonl\n` +
        ` * before enabling LanguageProfile.hasBundledSuggestions in production.\n`
      : "";
  const file = `/**
 * German example/translation dataset — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/build-german-examples.mjs <path-to-dataset.jsonl>
${placeholderNotice} *
 * Source:   German Wiktionary (https://de.wiktionary.org), via kaikki.org's
 *           wiktextract JSON extraction.
 * Filtered: by this repo's offline measurement kit (see
 *           EXAMPLES-ATTRIBUTION.md for the full pipeline and license chain).
 *
 * Format: one record per line, tab-separated, eight columns:
 *   lemma \\t pos \\t gender \\t plural \\t examples \\t en \\t tr \\t ku
 * where gender/plural are noun-only (empty otherwise), and examples/en/tr/ku
 * are "|"-separated lists (possibly empty).
 *
 * Held as one string rather than an object literal — same reasoning as
 * NOUNS_TSV in nouns-data.ts: a large object literal is parsed as code on
 * every cold start, while this is one string the engine skips over until
 * something actually splits it.
 */
export const EXAMPLES_TSV = \`${tsv}\`;

/** Records in ${"`"}EXAMPLES_TSV${"`"} — asserted by the loader's tests as a smoke
 *  check that the data file and the loader were regenerated together. */
export const EXAMPLES_TSV_ROWS = ${lines.length};
`;

  await writeFile(OUT_FILE, file);

  const written = await readFile(OUT_FILE);
  const dataBytes = Buffer.byteLength(tsv, "utf8");
  console.log(`records read:     ${recordsRead.toLocaleString("en-US")}`);
  console.log(`skipped (bad):    ${skipped.toLocaleString("en-US")}`);
  console.log(`records written:  ${lines.length.toLocaleString("en-US")}`);
  console.log(`tsv payload:      ${(dataBytes / 1e6).toFixed(2)} MB`);
  console.log(`  gzipped:        ${(gzipSync(Buffer.from(tsv), { level: 9 }).length / 1e6).toFixed(2)} MB`);
  console.log(`examples-data.ts: ${(written.length / 1e6).toFixed(2)} MB`);
}

await main();
