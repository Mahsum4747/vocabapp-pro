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
