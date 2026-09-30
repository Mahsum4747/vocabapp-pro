#!/usr/bin/env node
/**
 * One-off data-generation script — NOT wired into npm dev/build/test.
 *
 * Reads every infinitive out of src/lib/german/verb-conjugation-data.ts
 * (VERB_CONJUGATION_DATA, 6659 lemmas) and runs each one through
 * @v4nn4/ablaut's conjugate() to produce a full paradigm (Präsens,
 * Präteritum, Perfekt, Plusquamperfekt, Futur I/II, Konjunktiv I/II,
 * würde-form, Imperativ, Partizipien, auxiliary, zu-Infinitiv), then
 * writes src/lib/german/verb-conjugation-extended-data.ts.
 *
 * @v4nn4/ablaut is NOT a project dependency. Install it temporarily before
 * running this script, and make sure package.json/package-lock.json show
 * no trace afterward:
 *
 *   npm install @v4nn4/ablaut --no-save
 *   node scripts/generate-verb-conjugation-extended.mjs
 *   git status   # package.json / package-lock.json must show no changes
 *
 * Run manually only. Never called from package.json scripts or CI.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const ablautPath = path.join(repoRoot, "node_modules/@v4nn4/ablaut/ablaut.js");
if (!fs.existsSync(ablautPath)) {
  console.error(
    "@v4nn4/ablaut not found in node_modules. Run:\n  npm install @v4nn4/ablaut --no-save\nfirst.",
  );
  process.exit(1);
}
const ablaut = await import(ablautPath);
ablaut.initSync({
  module: fs.readFileSync(path.join(repoRoot, "node_modules/@v4nn4/ablaut/ablaut_bg.wasm")),
});

const sourcePath = path.join(repoRoot, "src/lib/german/verb-conjugation-data.ts");
const source = fs.readFileSync(sourcePath, "utf8");

// Pull every `infinitive: "..."` out of the VERB_CONJUGATION_DATA array
// literal — deliberately not importing the .ts module (would need a TS
// loader); a simple regex over the generated-file's own stable shape is
// enough and never touches the source file.
const infinitives = [...source.matchAll(/infinitive:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log(`Found ${infinitives.length} infinitives in verb-conjugation-data.ts.`);

const rows = [];
const failed = [];

for (const infinitive of infinitives) {
  try {
    const c = ablaut.conjugate(infinitive);
    rows.push(c);
  } catch (err) {
    failed.push({ infinitive, error: err?.message ?? String(err) });
  }
}

console.log(`${rows.length}/${infinitives.length} succeeded, ${failed.length} failed.`);
if (failed.length > 0) {
  console.log("Failed lemmas:");
  for (const f of failed) console.log(`  - ${f.infinitive}: ${f.error}`);
}

// TSV-ish template literal, one line per lemma, columns tab-separated,
// multi-form fields ("|"-joined 6-tuples / 2-tuples), same encoding style
// as nouns-data.ts / examples-data.ts.
const COLUMNS = [
  "infinitive",
  "zuInfinitive",
  "auxiliary",
  "presentParticiple",
  "pastParticiple",
  "imperative",
  "imperativeExtended",
  "present",
  "preterite",
  "perfect",
  "pluperfect",
  "future1",
  "future2",
  "konjunktiv1",
  "konjunktiv2",
  "wuerde",
];

function encodeField(value) {
  if (Array.isArray(value)) return value.join("|");
  return value;
}

const lines = rows.map((r) => COLUMNS.map((col) => encodeField(r[col]) ?? "").join("\t"));

// The full TSV comes out to ~6MB as one file — split into two roughly
// equal halves (part1/part2) so no single generated file gets too large
// for editors/bundlers to handle comfortably. lookupVerbConjugationExtended
// merges both transparently; callers never see the split.
const mid = Math.ceil(lines.length / 2);
const part1Lines = lines.slice(0, mid);
const part2Lines = lines.slice(mid);
const tsvPart1 = part1Lines.join("\n");
const tsvPart2 = part2Lines.join("\n");

function escapeTemplate(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const part1Header = `/**
 * German full-paradigm verb conjugations — part 1 of 2 — GENERATED FILE,
 * DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/generate-verb-conjugation-extended.mjs
 * See verb-conjugation-extended-data.ts for format docs, attribution and
 * the lookup function; this file only holds the first half of the rows
 * (split in two because the combined TSV is ~6MB).
 */
export const VERB_CONJUGATION_EXTENDED_TSV_PART1 = \`${escapeTemplate(tsvPart1)}\`;
`;

const part2Header = `/**
 * German full-paradigm verb conjugations — part 2 of 2 — GENERATED FILE,
 * DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/generate-verb-conjugation-extended.mjs
 * See verb-conjugation-extended-data.ts for format docs, attribution and
 * the lookup function; this file only holds the second half of the rows
 * (split in two because the combined TSV is ~6MB).
 */
export const VERB_CONJUGATION_EXTENDED_TSV_PART2 = \`${escapeTemplate(tsvPart2)}\`;
`;

const part1Path = path.join(repoRoot, "src/lib/german/verb-conjugation-extended-data-part1.ts");
const part2Path = path.join(repoRoot, "src/lib/german/verb-conjugation-extended-data-part2.ts");
fs.writeFileSync(part1Path, part1Header, "utf8");
fs.writeFileSync(part2Path, part2Header, "utf8");
console.log(
  `Wrote ${part1Path} (${(fs.statSync(part1Path).size / (1024 * 1024)).toFixed(2)} MB, ${part1Lines.length} lines) and ` +
    `${part2Path} (${(fs.statSync(part2Path).size / (1024 * 1024)).toFixed(2)} MB, ${part2Lines.length} lines).`,
);

const header = `/**
 * German full-paradigm verb conjugations — GENERATED FILE, DO NOT EDIT BY
 * HAND.
 *
 * Regenerate with: node scripts/generate-verb-conjugation-extended.mjs
 * (requires \`npm install @v4nn4/ablaut --no-save\` first — ablaut is not a
 * project dependency, see VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md).
 *
 * Source: @v4nn4/ablaut (npm, MIT OR Apache-2.0), run once offline against
 * every infinitive already in verb-conjugation-data.ts (this file adds no
 * new lemmas, no new valenz/case claims — see that file's own header for
 * why case-government stays exclusively verb-government-data.ts/
 * dative-verbs-data.ts's job). Full details, including the licensing
 * ambiguity around ablaut's exception table, in
 * VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md.
 *
 * Format: one record per line, tab-separated, columns in this order:
 *   ${COLUMNS.join(", ")}
 * A "|"-joined field is a 6-tuple (ich/du/er/wir/ihr/sie) for present,
 * preterite, perfect, pluperfect, future1, future2, konjunktiv1,
 * konjunktiv2, wuerde — or a 2-tuple (du/ihr) for imperative and
 * (wir/Sie) for imperativeExtended. Passiv (Vorgang/Zustand) is
 * deliberately NOT stored here: it is \`werden\`/\`sein\` conjugated +
 * this record's own pastParticiple, combined at runtime by whichever
 * drill needs it — storing it here would just duplicate auxiliary
 * conjugation tables already implicit in this file.
 *
 * Generated ${new Date().toISOString().slice(0, 10)} — ${rows.length} lemmas succeeded,
 * ${failed.length} failed (see VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md for the list).
 *
 * Held as two plain strings (see verb-conjugation-extended-data-part1.ts /
 * -part2.ts, split because the combined TSV is ~6MB) rather than an
 * object/array literal, for the same cold-start-parsing reason
 * nouns-data.ts documents.
 */
import { VERB_CONJUGATION_EXTENDED_TSV_PART1 } from "./verb-conjugation-extended-data-part1.ts";
import { VERB_CONJUGATION_EXTENDED_TSV_PART2 } from "./verb-conjugation-extended-data-part2.ts";

export const VERB_CONJUGATION_EXTENDED_TSV = VERB_CONJUGATION_EXTENDED_TSV_PART1 + "\\n" + VERB_CONJUGATION_EXTENDED_TSV_PART2;

export type VerbConjugationExtendedEntry = {
  infinitive: string;
  zuInfinitive: string;
  auxiliary: string;
  presentParticiple: string;
  pastParticiple: string;
  /** [du, ihr] */
  imperative: [string, string];
  /** [wir, Sie] */
  imperativeExtended: [string, string];
  /** [ich, du, er, wir, ihr, sie] */
  present: [string, string, string, string, string, string];
  preterite: [string, string, string, string, string, string];
  perfect: [string, string, string, string, string, string];
  pluperfect: [string, string, string, string, string, string];
  future1: [string, string, string, string, string, string];
  future2: [string, string, string, string, string, string];
  konjunktiv1: [string, string, string, string, string, string];
  konjunktiv2: [string, string, string, string, string, string];
  wuerde: [string, string, string, string, string, string];
};

let entries: VerbConjugationExtendedEntry[] | null = null;

function parse(): VerbConjugationExtendedEntry[] {
  if (entries) return entries;
  entries = VERB_CONJUGATION_EXTENDED_TSV.split("\\n").filter(Boolean).map((line) => {
    const cols = line.split("\\t");
    const [
      infinitive,
      zuInfinitive,
      auxiliary,
      presentParticiple,
      pastParticiple,
      imperative,
      imperativeExtended,
      present,
      preterite,
      perfect,
      pluperfect,
      future1,
      future2,
      konjunktiv1,
      konjunktiv2,
      wuerde,
    ] = cols;
    const six = (s: string) => s.split("|") as [string, string, string, string, string, string];
    const two = (s: string) => s.split("|") as [string, string];
    return {
      infinitive,
      zuInfinitive,
      auxiliary,
      presentParticiple,
      pastParticiple,
      imperative: two(imperative),
      imperativeExtended: two(imperativeExtended),
      present: six(present),
      preterite: six(preterite),
      perfect: six(perfect),
      pluperfect: six(pluperfect),
      future1: six(future1),
      future2: six(future2),
      konjunktiv1: six(konjunktiv1),
      konjunktiv2: six(konjunktiv2),
      wuerde: six(wuerde),
    };
  });
  return entries;
}

let lookupIndex: Map<string, VerbConjugationExtendedEntry> | null = null;

/**
 * Case-insensitive lookup by infinitive, same \`term.trim().toLowerCase()\`
 * normalization every other German lookup here uses. Lazily built once.
 */
export function lookupVerbConjugationExtended(term: string): VerbConjugationExtendedEntry | null {
  if (!lookupIndex) {
    lookupIndex = new Map(parse().map((entry) => [entry.infinitive.toLowerCase(), entry]));
  }
  return lookupIndex.get(term.trim().toLowerCase()) ?? null;
}
`;

const outPath = path.join(repoRoot, "src/lib/german/verb-conjugation-extended-data.ts");
fs.writeFileSync(outPath, header, "utf8");

const stats = fs.statSync(outPath);
console.log(`Wrote ${outPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB, ${lines.length} lines).`);

const failedLogPath = path.join(repoRoot, "scripts/generate-verb-conjugation-extended.failed.json");
fs.writeFileSync(failedLogPath, JSON.stringify(failed, null, 2), "utf8");
console.log(`Failed-lemma log written to ${failedLogPath}`);
