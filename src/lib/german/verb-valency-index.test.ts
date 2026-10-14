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


test("canonical lemmas retain reflexive construction constraints and original source records", () => {
  const frames = lookupVerbValency("erinnern");
  const frame = frames.find((row) => row.construction === "sich erinnern" && row.review === "eligible");
  assert.ok(frame);
  assert.equal(frame.sense, null);
  assert.equal(frame.provenance.method, "source-curated");
  assert.match(frame.provenance.record, /^sich erinnern\|an\|akkusativ$/);
  assert.ok(lookupVerbValency("sich erinnern").every((row) => row.construction === "sich erinnern"));
});

test("all raw source records, including bare and genitive frames, remain traceable without promotion", async () => {
  const { default: source } = await import("../../content/karta-kaikki-verb-prep-case.json", { with: { type: "json" } });
  for (const [index, row] of source.frames.entries()) {
    const frame = lookupVerbValency(row.lemma).find((f) => f.source === "kaikki-extracted" &&
      f.provenance.record === `frames[${index}]`);
    assert.ok(frame, `${index}: ${row.lemma}`);
    assert.equal(frame.preposition, row.prep);
    assert.equal(frame.case, ({ akk: "akkusativ", dat: "dativ", gen: "genitiv" })[row.case]);
    assert.equal(frame.sense, null);
    assert.notEqual(frame.review, "eligible");
  }
  assert.ok(lookupVerbValency("sehen").some((row) => row.preposition === null && row.case === "akkusativ"));
});

test("AI additions cannot gain source trust from an attached CEFR level", () => {
  const frame = lookupVerbValency("liegen").find((row) => row.preposition === "an");
  assert.ok(frame);
  assert.equal(frame.provenance.method, "generated-unverified");
  assert.equal(frame.review, "reference-only");
  assert.equal(eligiblePrepositionalFrames("an", "dativ").some((row) => row.lemma === "liegen"), false);
});

test("raw two-way conflicts are retained as conflicts, not arbitrarily dropped or resolved", () => {
  const frames = lookupVerbValency("fesseln").filter((row) => row.source === "kaikki-extracted" && row.preposition === "an");
  assert.equal(new Set(frames.map((row) => row.case)).size, 2);
  assert.ok(frames.every((row) => row.review === "conflicted"));
});

test("new snapshot remains distinct from legacy and only reviewed source records are eligible",()=>{
 const frames=lookupVerbValency("huldigen");
 const current=frames.filter(f=>f.source==="kaikki-current");
 assert.ok(current.some(f=>f.review==="eligible" && f.provenance.method==="source-reviewed"));
 assert.ok(current.every(f=>f.context[0].source.retrieved==="2026-10-14"));
 assert.ok(frames.filter(f=>f.source==="kaikki-extracted").every(f=>f.review!=="eligible"));
 assert.ok(lookupVerbValency("gehen").filter(f=>f.source==="kaikki-current" && f.review==="eligible").every(f=>f.diagnosticConditions?.allowedPronounTargets?.length));
});
