/**
 * Offline, one-time build of the trimmed German noun dictionary.
 *
 * NOT part of `npm run build` — this repo has no Python step and no data
 * pipeline, and we don't want a 20 MB CSV download in the Vercel build. Run it
 * by hand when the upstream dataset is refreshed and commit its output:
 *
 *   git clone --depth 1 https://github.com/gambolputty/german-nouns /tmp/german-nouns
 *   node scripts/build-german-nouns.mjs /tmp/german-nouns
 *
 * Input:  german_nouns/nouns.csv — 79 columns, one row per Wiktionary sense.
 * Output: src/lib/german/nouns-data.ts — a single TSV string, four columns.
 *
 * We keep lemma, genus, nominative plural and pos, and drop the other 74
 * columns (genitive/dative/accusative, singular forms, declension variants):
 * ~95% of the payload for data no vocabulary card needs.
 *
 * See src/lib/german/ATTRIBUTION.md — the data is CC BY-SA 4.0.
 */
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { execFileSync } from "node:child_process";
import { gzipSync } from "node:zlib";
import path from "node:path";

const REPO_URL = "https://github.com/gambolputty/german-nouns";
const OUT_FILE = new URL("../src/lib/german/nouns-data.ts", import.meta.url);

/** Every row in the source carries this; the loader adds it back so it doesn't
 *  cost 11 bytes × 102k rows on disk. Keep in sync with nouns.server.ts. */
const IMPLIED_POS = "Substantiv";

/**
 * A minimal RFC 4180 CSV line splitter. The source has quoted fields (the
 * `pos` column is a quoted comma-separated list) but no embedded newlines,
 * so a line-at-a-time reader is safe and avoids buffering 20 MB.
 */
function splitCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }
  fields.push(field);
  return fields;
}

/** Distinct, order-preserving, empties dropped. */
function distinct(values) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

async function main() {
  const repoDir = process.argv[2];
  if (!repoDir) {
    console.error("usage: node scripts/build-german-nouns.mjs <path-to-german-nouns-clone>");
    process.exit(1);
  }
  const csvPath = path.join(repoDir, "german_nouns", "nouns.csv");

  let sha = "unknown";
  try {
    sha = execFileSync("git", ["-C", repoDir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    console.warn("! could not read upstream commit SHA");
  }

  const input = createInterface({ input: createReadStream(csvPath), crlfDelay: Infinity });
  let header = null;
  let genusCols = [];
  let pluralCols = [];
  const lines = [];
  let rows = 0;

  for await (const line of input) {
    if (!line) continue;
    const fields = splitCsvLine(line);
    if (!header) {
      header = fields;
      genusCols = header
        .map((name, i) => [name, i])
        .filter(([name]) => name === "genus" || name.startsWith("genus "))
        .map(([, i]) => i);
      pluralCols = header
        .map((name, i) => [name, i])
        .filter(([name]) => name.startsWith("nominativ plural"))
        .map(([, i]) => i);
      if (header[0] !== "lemma" || header[1] !== "pos") {
        throw new Error(`unexpected header shape: ${header.slice(0, 3).join(",")}`);
      }
      if (genusCols.length === 0 || pluralCols.length === 0) {
        throw new Error("could not locate the genus/plural columns");
      }
      continue;
    }
    rows++;

    const lemma = fields[0]?.trim() ?? "";
    if (!lemma) continue;

    // m/f/n, in column order. A word with two genders (das/der Joghurt) leaves
    // `genus` empty and fills `genus 1`/`genus 2`, so all five columns matter.
    const genus = distinct(genusCols.map((i) => fields[i] ?? ""));
    // Every distinct nominative plural, including the variant columns: German
    // words with two plurals (Worte/Wörter) mean different things, and picking
    // one for the user would be inventing information.
    const plural = distinct(pluralCols.map((i) => fields[i] ?? ""));
    const pos = distinct((fields[1] ?? "").split(",")).filter((p) => p !== IMPLIED_POS);

    for (const value of [lemma, ...genus, ...plural, ...pos]) {
      if (/[\t\n\r]/.test(value)) throw new Error(`field contains a TSV separator: ${value}`);
    }
    // "|" and not "," — German writes decimals with a comma, and the source
    // has plurals like "0,2-Liter-Flaschen" that would split into nonsense.
    for (const value of [...genus, ...plural, ...pos]) {
      if (value.includes("|")) throw new Error(`multi-value field contains a "|": ${value}`);
    }
    if (!genus.every((g) => g === "m" || g === "f" || g === "n")) {
      throw new Error(`unexpected genus on ${lemma}: ${genus.join("/")}`);
    }

    lines.push(`${lemma}\t${genus.join("|")}\t${plural.join("|")}\t${pos.join("|")}`);
  }

  const tsv = lines.join("\n");
  // The data is machine-generated German text; nothing in it should be able to
  // break out of a template literal, but assert rather than trust.
  if (/[`\\]|\$\{/.test(tsv)) throw new Error("data would not survive a template literal");

  const file = `/**
 * German noun dictionary — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/build-german-nouns.mjs <path-to-german-nouns-clone>
 *
 * Source:  German Wiktionary (https://de.wiktionary.org)
 * Via:     ${REPO_URL}
 *          commit ${sha}
 * License: CC BY-SA 4.0 — see src/lib/german/ATTRIBUTION.md
 *
 * Format: one record per line, tab-separated, four columns:
 *   lemma \\t genus \\t plural \\t pos
 * where genus, plural and pos are "|"-separated lists (possibly empty), and
 * "${IMPLIED_POS}" is omitted from pos because every record has it.
 *
 * Held as one string rather than an object literal on purpose: a 100k-key
 * object literal has to be parsed as code on every cold start, while this is
 * one string the engine skips over until something actually splits it.
 */
export const NOUNS_TSV = \`${tsv}\`;

/** Records in ${"`"}NOUNS_TSV${"`"} — asserted by the loader's tests as a smoke check
 *  that the data file and the loader were regenerated together. */
export const NOUNS_TSV_ROWS = ${lines.length};
`;

  await writeFile(OUT_FILE, file);

  const written = await readFile(OUT_FILE);
  const dataBytes = Buffer.byteLength(tsv, "utf8");
  console.log(`upstream commit: ${sha}`);
  console.log(`csv data rows:   ${rows.toLocaleString("en-US")}`);
  console.log(`records written: ${lines.length.toLocaleString("en-US")}`);
  console.log(`tsv payload:     ${(dataBytes / 1e6).toFixed(2)} MB`);
  console.log(`  gzipped:       ${(gzipSync(Buffer.from(tsv), { level: 9 }).length / 1e6).toFixed(2)} MB`);
  console.log(`nouns-data.ts:   ${(written.length / 1e6).toFixed(2)} MB`);
  console.log(`  gzipped:       ${(gzipSync(written, { level: 9 }).length / 1e6).toFixed(2)} MB`);
}

await main();
