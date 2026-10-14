import assert from "node:assert/strict";
import test from "node:test";
import { readValencySourceContext, valencySourceContextSchema } from "./valency-source-context";
import { lookupVerbValency } from "./verb-valency-index";

const context = {
  source: { url: "https://kaikki.org/fixture", retrieved: "2026-09-24", license: "fixture", snapshotSha256: "a".repeat(64), line: 1, recordSha256: "b".repeat(64), word: "erinnern", entryId: null },
  senseMetadata: { senseid: ["fixture-sense-id"] }, senseIndex: 0, senseId: null, glosses: ["an + accusative"], rawGlosses: [], tags: ["reflexive"], rawTags: [], entryTags: [], examples: [{ text: "fixture" }], requiredReflexive: true,
  evidence: { kind: "explicit-gloss-grammar", text: "an + accusative", offset: 0, glossIndex: 0 }, diagnosticEligible: false,
};
test("source text and reflexive constraints survive the validated context model", () => {
  assert.deepEqual(readValencySourceContext({ lemma: "erinnern", context: [context] }), [context]);
  assert.deepEqual(readValencySourceContext({ lemma: "erinnern" }), []);
});
test("gloss association cannot mark a record diagnostic-eligible or point outside the actual text", () => {
  assert.equal(valencySourceContextSchema.safeParse({ ...context, diagnosticEligible: true }).success, false);
  assert.equal(valencySourceContextSchema.safeParse({ ...context, evidence: { ...context.evidence, offset: 1 } }).success, false);
});
test("legacy dataset remains untouched while current contexts retain AI quarantine", () => {
  const frames = lookupVerbValency("liegen");
  assert.ok(frames.filter((frame) => frame.source !== "kaikki-current").every((frame) => frame.context.length === 0));
  assert.ok(frames.filter((frame) => frame.provenance.method === "generated-unverified").every((frame) => frame.review === "reference-only"));
});
