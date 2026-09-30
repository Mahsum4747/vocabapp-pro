import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERB_CONJUGATION_EXTENDED_TSV,
  lookupVerbConjugationExtended,
} from "./verb-conjugation-extended-data.ts";

describe("verb-conjugation-extended-data", () => {
  it("loads a plausible number of records", () => {
    const rowCount = VERB_CONJUGATION_EXTENDED_TSV.split("\n").filter(Boolean).length;
    assert.ok(rowCount > 6000 && rowCount < 6700, `unexpected row count: ${rowCount}`);
  });

  it("looks up nennen with the ablaut-corrected konjunktiv2 (not the indicative preterite)", () => {
    const entry = lookupVerbConjugationExtended("nennen");
    assert.ok(entry, "expected an entry for nennen");
    assert.equal(entry!.konjunktiv2[0], "nennte");
    assert.notEqual(entry!.konjunktiv2[0], "nannte");
    assert.equal(entry!.preterite[0], "nannte");
  });

  it("is case-insensitive and normalizes whitespace, same as lookupVerbConjugation", () => {
    assert.ok(lookupVerbConjugationExtended("  Nennen  "));
    assert.equal(lookupVerbConjugationExtended("not-a-real-verb-xyz"), null);
  });

  it("carries the full paradigm shape for a known lemma", () => {
    const entry = lookupVerbConjugationExtended("gehen");
    assert.ok(entry);
    assert.equal(entry!.present.length, 6);
    assert.equal(entry!.imperative.length, 2);
    assert.equal(entry!.imperativeExtended.length, 2);
    assert.ok(entry!.auxiliary === "sein" || entry!.auxiliary === "haben");
    assert.ok(entry!.pastParticiple.length > 0);
  });
});
