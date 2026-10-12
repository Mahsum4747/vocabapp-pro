/**
 * Reproducible Karta verb-data coverage audit.
 * Run: node scripts/audit-verb-valency.mjs
 * Counts describe source coverage, NOT verified case-government accuracy.
 */
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const conjugations = read("src/lib/german/verb-conjugation-data.ts");
const curatedDative = read("src/lib/german/dative-verbs-data.ts");
const curatedGovernment = read("src/lib/german/verb-government-data.ts");
const extractedFrames = JSON.parse(read("src/content/karta-kaikki-verb-prep-case.json"));
const transitive = JSON.parse(read("src/content/karta-wiktionary-transitiv-de.json"));

const conjugatedLemmas = new Set([...conjugations.matchAll(/\{ infinitive: "([^"]+)", ich:/g)].map((m) => m[1]));
const dativeLemmas = new Set([...curatedDative.matchAll(/\{ verb: "([^"]+)"(?:, level: "[^"]+")? \}/g)].map((m) => m[1]));
const governmentRows = [...curatedGovernment.matchAll(/\{ verb: "([^"]+)", preposition: "([^"]+)", case: "(akkusativ|dativ)"/g)]
  .map((m) => ({ lemma: m[1], preposition: m[2], case: m[3] }));
const governmentLemmas = new Set(governmentRows.map((row) => row.lemma));
const extractedLemmas = new Set(extractedFrames.frames.map((row) => row.lemma));
const transitiveLemmas = new Set(transitive.verbs);
const knownLemmas = new Set([...dativeLemmas, ...governmentLemmas, ...extractedLemmas, ...transitiveLemmas]);
const unaccounted = [...conjugatedLemmas].filter((lemma) => !knownLemmas.has(lemma)).sort();

const report = {
  definition: "source inventory, not confirmed valency coverage",
  conjugationLemmas: conjugatedLemmas.size,
  curatedDativeLemmas: dativeLemmas.size,
  curatedGovernmentFrames: governmentRows.length,
  curatedGovernmentLemmas: governmentLemmas.size,
  extractedKaikkiFrames: extractedFrames.frames.length,
  extractedKaikkiLemmas: extractedLemmas.size,
  wiktionaryTransitiveLemmas: transitiveLemmas.size,
  conjugatedLemmasWithAnySourceEvidence: conjugatedLemmas.size - unaccounted.length,
  conjugatedLemmasWithoutSourceEvidence: unaccounted.length,
  sampleUnaccounted: unaccounted.slice(0, 30),
  caveats: [
    "Transitive-category absence does not imply intransitivity.",
    "Kaikki frames are regex-extracted, not gold-standard grammar.",
    "Curated Dative entries include ditransitive and sense-dependent verbs.",
    "A lemma's presence in any source does not prove all its senses are covered.",
  ],
};
if (!conjugatedLemmas.size || !governmentRows.length || !extractedFrames.frames.length) {
  throw new Error("Verb source parsing failed; audit numbers would be misleading");
}
if (process.argv.includes("--full")) {
  // Machine-readable queue for source review; no guessed valency assignments.
  report.lemmaInventory = [...conjugatedLemmas].sort().map((lemma) => ({
    lemma,
    curatedDative: dativeLemmas.has(lemma),
    curatedGovernment: governmentLemmas.has(lemma),
    extractedKaikki: extractedLemmas.has(lemma),
    wiktionaryTransitive: transitiveLemmas.has(lemma),
    sourceStatus: knownLemmas.has(lemma) ? "evidence-present" : "unresolved",
  }));
}
console.log(JSON.stringify(report, null, 2));
