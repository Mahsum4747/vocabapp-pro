import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { suggestTerms, termSuggestionDatasetSize } from "./term-suggestions.server.ts";

describe("suggestTerms", () => {
  it("returns [] for an empty or whitespace-only prefix", () => {
    assert.deepEqual(suggestTerms(""), []);
    assert.deepEqual(suggestTerms("   "), []);
  });

  it("finds lemmas by prefix, case-insensitively", () => {
    const lower = suggestTerms("wart");
    const upper = suggestTerms("WART");
    const mixed = suggestTerms("Wart");
    assert.deepEqual(lower, upper);
    assert.deepEqual(lower, mixed);
    assert.ok(lower.some((w) => w.toLowerCase() === "warten"));
  });

  it("finds lemmas by prefix, accent-insensitively", () => {
    // "träumen" should be found by the unaccented prefix "traum".
    const result = suggestTerms("traum");
    assert.ok(result.some((w) => w.toLowerCase() === "träumen"));
  });

  it("only matches the start of the word, not anywhere inside it", () => {
    const result = suggestTerms("arten");
    assert.ok(!result.some((w) => w.toLowerCase() === "warten"));
  });

  it("respects the result cap", () => {
    // A common single-letter prefix should have well over 8 matches in a
    // 2,885-lemma dataset.
    const result = suggestTerms("s", 8);
    assert.ok(result.length <= 8);
  });

  it("defaults the cap to 8", () => {
    const result = suggestTerms("s");
    assert.ok(result.length <= 8);
  });

  it("is alphabetical, not in dataset file order", () => {
    const result = suggestTerms("s", 50);
    const sorted = [...result].sort((a, b) => a.localeCompare(b, "de"));
    assert.deepEqual(result, sorted);
  });

  it("returns [] for a prefix nothing matches", () => {
    assert.deepEqual(suggestTerms("xyzzyfooqux"), []);
  });

  it("dataset has a non-trivial number of unique lemmas", () => {
    assert.ok(termSuggestionDatasetSize() > 1000);
  });
});
