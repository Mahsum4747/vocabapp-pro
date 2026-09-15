import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { lookupVerbGovernment, verbGovernmentDatasetSize } from "./verb-government.server.ts";

describe("lookupVerbGovernment", () => {
  it("finds the well-known examples", () => {
    assert.deepEqual(lookupVerbGovernment("warten"), [{ preposition: "auf", case: "akkusativ" }]);
    assert.deepEqual(lookupVerbGovernment("denken"), [{ preposition: "an", case: "akkusativ" }]);
    assert.deepEqual(lookupVerbGovernment("träumen"), [{ preposition: "von", case: "dativ" }]);
  });

  it("returns every construction for a verb with more than one", () => {
    const result = lookupVerbGovernment("sprechen");
    assert.ok(result.some((g) => g.preposition === "mit" && g.case === "dativ"));
    assert.ok(result.some((g) => g.preposition === "über" && g.case === "akkusativ"));
    assert.ok(result.length >= 2);
  });

  it("is case-insensitive", () => {
    assert.deepEqual(lookupVerbGovernment("Warten"), lookupVerbGovernment("warten"));
    assert.deepEqual(lookupVerbGovernment("WARTEN"), lookupVerbGovernment("warten"));
  });

  it("tolerates surrounding whitespace", () => {
    assert.deepEqual(lookupVerbGovernment("  warten  "), lookupVerbGovernment("warten"));
  });

  it("returns [] for a verb not in the curated dataset, not an error", () => {
    assert.deepEqual(lookupVerbGovernment("xyzzyfoo"), []);
  });

  it("returns [] for empty input", () => {
    assert.deepEqual(lookupVerbGovernment(""), []);
    assert.deepEqual(lookupVerbGovernment("   "), []);
  });

  it("dataset has no duplicate verb+preposition+case rows", () => {
    // A loose invariant check via the loader itself, cheaper than re-parsing
    // the data file here: every (verb, preposition, case) should be unique.
    const seen = new Set<string>();
    let total = 0;
    for (const verb of ["warten", "denken", "sprechen", "sein", "bestehen", "schreiben"]) {
      for (const g of lookupVerbGovernment(verb)) {
        const key = `${verb}|${g.preposition}|${g.case}`;
        assert.equal(seen.has(key), false, `duplicate: ${key}`);
        seen.add(key);
        total++;
      }
    }
    assert.ok(total > 0);
  });

  it("dataset size is non-trivial", () => {
    assert.ok(verbGovernmentDatasetSize() > 300);
  });
});
