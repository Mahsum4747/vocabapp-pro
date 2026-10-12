import assert from "node:assert/strict";
import test from "node:test";
import {
  eligibleBareDativeFrames,
  eligiblePrepositionalFrames,
  isPrepositionToken,
  lookupVerbValency,
  valencyEvidenceCount,
} from "./verb-valency-index";

test("preserves all three existing runtime valency source families", () => {
  assert.ok(valencyEvidenceCount() > 1000);
  assert.ok(lookupVerbValency("helfen").some((f) => f.source === "curated-dative"));
  assert.ok(lookupVerbValency("sprechen").some((f) => f.source === "curated-government"));
  assert.ok(lookupVerbValency("abdriften").some((f) =>
    f.source === "kaikki-extracted" && f.review === "reference-only"));
});

test("regex-extracted frames remain reference-only", () => {
  assert.equal(eligiblePrepositionalFrames("in", "akkusativ")
    .some((f) => f.lemma === "abdriften"), false);
});

test("contradictory curated preposition cases are withheld", () => {
  const entries = lookupVerbValency("schreiben").filter((f) => f.preposition === "an"
    && f.source === "curated-government");
  assert.equal(new Set(entries.map((f) => f.case)).size, 2);
  assert.ok(entries.every((f) => f.review === "conflicted"));
  assert.equal(eligiblePrepositionalFrames("an", "dativ")
    .some((f) => f.lemma === "schreiben"), false);
});

test("expands bounded dative candidates but holds back untagged entries", () => {
  assert.ok(eligibleBareDativeFrames().length > 9);
  assert.ok(eligibleBareDativeFrames().some((f) => f.lemma === "danken"));
  assert.equal(eligibleBareDativeFrames().some((f) => f.lemma === "geben"), false);
  assert.ok(lookupVerbValency("geben").some((f) => f.review === "context-required"));
});

test("recognizes fixed and Wechsel prepositions when excluding bare dative", () => {
  assert.ok(isPrepositionToken("mit"));
  assert.ok(isPrepositionToken("an"));
  assert.ok(isPrepositionToken("wegen"));
  assert.equal(isPrepositionToken("helfe"), false);
});
