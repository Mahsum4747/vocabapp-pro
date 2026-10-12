import assert from "node:assert/strict";
import test from "node:test";
import { listVerbLexicon, lookupVerbLexicon, verbLexiconCoverage } from "./verb-lexicon";

test("every sourced conjugation lemma has an explicit government status", () => {
  const entries = listVerbLexicon();
  const coverage = verbLexiconCoverage();
  assert.equal(entries.length, 6659);
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
      break;
    }
  }
});
