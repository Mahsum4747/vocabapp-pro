import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";

test("verb source coverage audit accounts for all four existing source families", () => {
  const report = JSON.parse(execFileSync(process.execPath, ["scripts/audit-verb-valency.mjs"], { encoding: "utf8" }));
  assert.ok(report.conjugationLemmas >= 6000);
  assert.ok(report.curatedDativeLemmas >= 60);
  assert.ok(report.curatedGovernmentFrames >= 100);
  assert.ok(report.extractedKaikkiFrames >= 900);
  assert.ok(report.wiktionaryTransitiveLemmas >= 3000);
  assert.equal(
    report.conjugatedLemmasWithAnySourceEvidence + report.conjugatedLemmasWithoutSourceEvidence,
    report.conjugationLemmas,
  );
  assert.match(report.definition, /not confirmed valency/);
});

test("full audit enumerates each lemma exactly once with explicit unresolved status", () => {
  const report = JSON.parse(execFileSync(process.execPath,
    ["scripts/audit-verb-valency.mjs", "--full"], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
  assert.equal(report.lemmaInventory.length, report.conjugationLemmas);
  assert.equal(new Set(report.lemmaInventory.map((row) => row.lemma)).size,
    report.conjugationLemmas);
  assert.equal(report.lemmaInventory.filter((row) => row.sourceStatus === "unresolved").length,
    report.conjugatedLemmasWithoutSourceEvidence);
  assert.ok(report.lemmaInventory.every((row) =>
    row.sourceStatus === "unresolved" || row.sourceStatus === "evidence-present"));
});


test("runtime audit uses application coverage and retains per-record provenance", () => {
  const report = JSON.parse(execFileSync(process.execPath,
    ["scripts/audit-verb-valency.mjs", "--full", "--runtime"],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }));
  const counts = { "diagnostic-eligible": 0, "evidence-needs-review": 0, unresolved: 0 };
  for (const row of report.lemmaInventory) {
    counts[row.governmentStatus]++;
    assert.ok(row.frames.every((frame) => frame.provenance.record && frame.provenance.document));
    if (row.governmentStatus === "unresolved") assert.equal(row.frames.length, 0);
  }
  assert.equal(report.runtimeCoverage.diagnosticEligible, counts["diagnostic-eligible"]);
  assert.equal(report.runtimeCoverage.evidenceNeedsReview, counts["evidence-needs-review"]);
  assert.equal(report.runtimeCoverage.unresolved, counts.unresolved);
});
