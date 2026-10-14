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
const current = JSON.parse(read("src/content/karta-kaikki-valency-2026-10-03.json"));
const transitive = JSON.parse(read("src/content/karta-wiktionary-transitiv-de.json"));

const normalize = (lemma) => lemma.trim().toLocaleLowerCase("de-DE");
const canonical = (lemma) => normalize(lemma).replace(/^sich\s+/, "");
const sourceSpellings = [...conjugations.matchAll(/\{ infinitive: "([^"]+)", ich:/g)].map((m) => m[1]);
const conjugatedLemmas = new Set(sourceSpellings.map(normalize));
const dativeLemmas = new Set([...curatedDative.matchAll(/\{ verb: "([^"]+)"(?:, level: "[^"]+")? \}/g)].map((m) => canonical(m[1])));
const governmentRows = [...curatedGovernment.matchAll(/\{ verb: "([^"]+)", preposition: "([^"]+)", case: "(akkusativ|dativ)"/g)]
  .map((m) => ({ lemma: canonical(m[1]), preposition: m[2], case: m[3] }));
const governmentLemmas = new Set(governmentRows.map((row) => row.lemma));
const extractedLemmas = new Set(extractedFrames.frames.map((row) => canonical(row.lemma)));
const transitiveLemmas = new Set(transitive.verbs.map(normalize));
const currentLemmas = new Set(current.frames.map((row) => canonical(row.lemma)));
const knownLemmas = new Set([...currentLemmas,...dativeLemmas, ...governmentLemmas, ...extractedLemmas, ...transitiveLemmas]);
const unaccounted = [...conjugatedLemmas].filter((lemma) => !knownLemmas.has(lemma)).sort();

const report = {
  definition: "source inventory, not confirmed valency coverage",
  conjugationSourceRecords: sourceSpellings.length,
  conjugationNormalizationDuplicates: sourceSpellings.length - conjugatedLemmas.size,
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
    currentKaikki: currentLemmas.has(lemma),
    currentLexicalSourceMatched: current.matchedLemmas.includes(lemma),
    wiktionaryTransitive: transitiveLemmas.has(lemma),
    sourceStatus: knownLemmas.has(lemma) ? "evidence-present" : "unresolved",
  }));
}
if (process.argv.includes("--runtime")) {
  // Load the same registry the application consumes; do not duplicate trust policy.
  await import("./test-register.mjs");
  const { listVerbLexicon, verbLexiconCoverage } = await import("../src/lib/german/verb-lexicon.ts");
  const { valencyEvidenceCount } = await import("../src/lib/german/verb-valency-index.ts");
  report.kaikkiContextCoverage = {
    rows: extractedFrames.frames.length,
    associated: extractedFrames.frames.filter((row) => Array.isArray(row.context) && row.context.length > 0).length,
    pending: extractedFrames.frames.filter((row) => !Array.isArray(row.context) || row.context.length === 0).length,
    associationIsDiagnosticApproval: false,
  };
  report.currentKaikkiCoverage = current.summary;
  report.runtimeCoverage = verbLexiconCoverage();
  report.runtimeEvidenceRecords = valencyEvidenceCount();
  if (process.argv.includes("--full")) {
    const entries = new Map(listVerbLexicon().map((entry) => [entry.lemma, entry]));
    report.lemmaInventory = report.lemmaInventory.map((row) => {
      const entry = entries.get(row.lemma);
      return { ...row, governmentStatus: entry.governmentStatus,
        sourceEvidence: entry.sourceEvidence, frames: entry.frames };
    });
  }
}
console.log(JSON.stringify(report, null, 2));
