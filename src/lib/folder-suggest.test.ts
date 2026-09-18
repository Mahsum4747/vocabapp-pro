import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { suggestFolder } from "./folder-suggest.ts";

describe("suggestFolder", () => {
  it("matches a folder whose words all appear in the title, any order", () => {
    assert.equal(suggestFolder("CEFR A1 German Verbs", ["German A1"]), "German A1");
  });

  it("is case-insensitive", () => {
    assert.equal(suggestFolder("cefr a1 german verbs", ["German A1"]), "German A1");
  });

  it("prefers the folder with the most matching words", () => {
    const folders = ["German", "German A1"];
    assert.equal(suggestFolder("German A1 Nouns", folders), "German A1");
  });

  it("returns undefined when no folder's words all appear", () => {
    assert.equal(suggestFolder("Spanish Vocabulary", ["German A1"]), undefined);
  });

  it("returns undefined for an empty title or empty folder list", () => {
    assert.equal(suggestFolder("", ["German A1"]), undefined);
    assert.equal(suggestFolder("German A1 Nouns", []), undefined);
  });

  it("ignores a folder with only whitespace", () => {
    assert.equal(suggestFolder("German A1 Nouns", ["   "]), undefined);
  });
});
