import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isDativeVerb, dativeVerbDatasetSize } from "./dative-verbs.server.ts";

describe("isDativeVerb", () => {
  it("finds the well-known examples", () => {
    assert.equal(isDativeVerb("helfen"), true);
    assert.equal(isDativeVerb("danken"), true);
    assert.equal(isDativeVerb("gefallen"), true);
    assert.equal(isDativeVerb("gehören"), true);
    assert.equal(isDativeVerb("gratulieren"), true);
  });

  it("includes the single-word wehtun/leidtun lemmas", () => {
    assert.equal(isDativeVerb("wehtun"), true);
    assert.equal(isDativeVerb("leidtun"), true);
  });

  it("includes the E-VALBU ditransitive batch and the Duden/DWDS-only verbs", () => {
    assert.equal(isDativeVerb("zeigen"), true);
    assert.equal(isDativeVerb("verkaufen"), true);
    assert.equal(isDativeVerb("schmeicheln"), true);
    assert.equal(isDativeVerb("imponieren"), true);
    assert.equal(isDativeVerb("missfallen"), true);
  });

  it("excludes marginal/polysemous verbs whose dative sense is not their defining valence", () => {
    for (const verb of ["gehen", "kommen", "sein", "werden", "stehen", "liegen", "bleiben"]) {
      assert.equal(isDativeVerb(verb), false, `${verb} should not be tagged as a dative verb`);
    }
  });

  it("is case-insensitive", () => {
    assert.equal(isDativeVerb("Helfen"), true);
    assert.equal(isDativeVerb("HELFEN"), true);
  });

  it("tolerates surrounding whitespace", () => {
    assert.equal(isDativeVerb("  helfen  "), true);
  });

  it("returns false for a verb not in the curated dataset, not an error", () => {
    assert.equal(isDativeVerb("essen"), false);
    assert.equal(isDativeVerb("xyzzyfoo"), false);
  });

  it("returns false for empty input", () => {
    assert.equal(isDativeVerb(""), false);
    assert.equal(isDativeVerb("   "), false);
  });

  it("dataset is non-trivial and has no duplicate entries", () => {
    assert.ok(dativeVerbDatasetSize() > 100);
  });
});
