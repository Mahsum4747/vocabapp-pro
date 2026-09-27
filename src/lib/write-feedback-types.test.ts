import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseErrorTags } from "./write-feedback-types.ts";

describe("parseErrorTags", () => {
  it("parses a well-formed tag block", () => {
    const raw = [
      { category: "missing_leitpunkt", severity: "major" },
      { category: "register", severity: "minor", excerpt: "Hallo Herr Weber" },
    ];
    assert.deepEqual(parseErrorTags(raw), raw);
  });

  it("returns [] on a malformed/missing block, without throwing", () => {
    assert.deepEqual(parseErrorTags(undefined), []);
    assert.deepEqual(parseErrorTags(null), []);
    assert.deepEqual(parseErrorTags("not an array"), []);
    assert.deepEqual(parseErrorTags({ category: "case" }), []);
  });

  it("drops an unknown category, keeps valid tags in the same response", () => {
    const raw = [
      { category: "made_up_category", severity: "major" },
      { category: "case", severity: "minor" },
    ];
    assert.deepEqual(parseErrorTags(raw), [{ category: "case", severity: "minor" }]);
  });
});
