import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isNounShaped, missingNounFields } from "./card-completeness.ts";

const noun = (over: object = {}) => ({
  term: "Tisch",
  example: "Der Tisch ist groß.",
  enrichment: { gender: "m" as const, plural: "Tische", source: "dict" as const },
  ...over,
});

describe("missingNounFields", () => {
  it("a full noun card is complete", () => {
    assert.deepEqual(missingNounFields(noun(), true), []);
  });
  it("names exactly what is missing", () => {
    assert.deepEqual(missingNounFields(noun({ example: "  " }), true), ["example"]);
    assert.deepEqual(
      missingNounFields(noun({ enrichment: { gender: "m", source: "dict" } }), true),
      ["plural"],
    );
    assert.deepEqual(missingNounFields({ term: "Tisch", example: null, enrichment: null }, true), [
      "gender",
      "plural",
      "example",
    ]);
  });
  it("never applies to verbs, phrases or other languages", () => {
    assert.deepEqual(missingNounFields({ term: "gehen", example: null }, true), []);
    assert.deepEqual(missingNounFields({ term: "Guten Morgen", example: null }, true), []);
    assert.deepEqual(missingNounFields({ term: "Table", example: null }, false), []);
    assert.deepEqual(
      missingNounFields(
        { term: "Warten", example: null, enrichment: { governs: [{ preposition: "auf", case: "akkusativ" }], source: "dict" } },
        true,
      ),
      [],
    );
  });
});

describe("isNounShaped", () => {
  it("single capitalised word only", () => {
    assert.equal(isNounShaped("Haustür"), true);
    assert.equal(isNounShaped("gehen"), false);
    assert.equal(isNounShaped("Guten Morgen"), false);
  });
});
