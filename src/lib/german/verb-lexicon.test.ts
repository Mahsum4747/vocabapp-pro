import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { VERB_CONJUGATION_DATA } from "./verb-conjugation-data";
import { listVerbLexicon, lookupVerbLexicon, verbLexiconCoverage } from "./verb-lexicon";

test("every sourced conjugation lemma has an explicit government status", () => {
  const entries = listVerbLexicon();
  const coverage = verbLexiconCoverage();
  assert.equal(entries.length, new Set(VERB_CONJUGATION_DATA.map((entry) =>
    entry.infinitive.trim().toLocaleLowerCase("de-DE"))).size);
  assert.equal(coverage.total, entries.length);
  assert.equal(
    coverage.diagnosticEligible + coverage.evidenceNeedsReview + coverage.unresolved,
    coverage.total,
  );
  assert.ok(coverage.unresolved > 0, "Unknown valency must not be silently assigned");
});

test("known evidence is retained without converting it to unsupported rules", () => {
  const helfen = lookupVerbLexicon("helfen");
  assert.ok(helfen);
  assert.equal(helfen.governmentStatus, "diagnostic-eligible");
  assert.ok(helfen.frames.some((frame) => frame.case === "dativ" && frame.review === "eligible"));
  assert.equal(lookupVerbLexicon("nonsense-nonexistent-verb"), null);
});

test("lexicon lookups normalize spelling and never infer unknown government", () => {
  assert.equal(lookupVerbLexicon(" HELFEN ")?.lemma, "helfen");
  for (const entry of listVerbLexicon()) {
    if (entry.governmentStatus === "unresolved") {
      assert.equal(entry.frames.length, 0);
      assert.equal(entry.sourceEvidence.length, 0);
      break;
    }
  }
});

test("lexicon source presence agrees with the full four-source inventory audit", () => {
  const report = JSON.parse(execFileSync(process.execPath,
    ["scripts/audit-verb-valency.mjs", "--full"], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
  for (const row of report.lemmaInventory) {
    const entry = lookupVerbLexicon(row.lemma);
    assert.ok(entry, row.lemma);
    assert.equal(entry.sourceEvidence.includes("wiktionary-transitive"), row.wiktionaryTransitive, row.lemma);
    assert.equal(entry.sourceEvidence.includes("kaikki-extracted"), row.extractedKaikki, row.lemma);
    assert.equal(entry.sourceEvidence.includes("curated-dative"), row.curatedDative, row.lemma);
    assert.equal(entry.sourceEvidence.includes("curated-government"), row.curatedGovernment, row.lemma);
    assert.equal(entry.governmentStatus === "unresolved", row.sourceStatus === "unresolved", row.lemma);
  }
  assert.equal(verbLexiconCoverage().unresolved, report.conjugatedLemmasWithoutSourceEvidence);
});

test("category-only evidence is retained without inventing an accusative rule", () => {
  const categoryOnly = listVerbLexicon().filter((entry) =>
    entry.frames.length === 0 && entry.sourceEvidence.includes("wiktionary-transitive"));
  assert.ok(categoryOnly.length > 0);
  for (const entry of categoryOnly) {
    assert.equal(entry.governmentStatus, "evidence-needs-review");
    assert.equal(entry.frames.length, 0);
  }
});
