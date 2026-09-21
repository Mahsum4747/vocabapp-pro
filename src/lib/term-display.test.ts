import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { profileFor } from "./lang/profiles.ts";
import { buildTermDisplay, displayTerm, isIncompleteNoun } from "./term-display.ts";

const de = profileFor("de");
const en = profileFor("en");
const c = (term: string, gender?: "m" | "f" | "n") => ({
  term,
  enrichment: gender ? { gender, source: "dict" as const } : null,
});

describe("displayTerm", () => {
  it("adds the article when gender is known", () => {
    assert.equal(displayTerm(c("Apfel", "m"), de), "der Apfel");
    assert.equal(displayTerm(c("Frau", "f"), de), "die Frau");
    assert.equal(displayTerm(c("Haus", "n"), de), "das Haus");
  });
  it("never invents one: no gender, or a language without articles", () => {
    assert.equal(displayTerm(c("Apfel"), de), "Apfel");
    assert.equal(displayTerm(c("Apple", "m"), en), "Apple");
  });
});

describe("buildTermDisplay", () => {
  it("maps bare terms to display strings", () => {
    const show = buildTermDisplay([c("Apfel", "m"), c("gehen")], de);
    assert.equal(show("Apfel"), "der Apfel");
    assert.equal(show("gehen"), "gehen");
    assert.equal(show("unknown"), "unknown");
  });
  it("falls back to the bare term when two cards would disagree", () => {
    const show = buildTermDisplay([c("See", "m"), c("See", "f")], de);
    assert.equal(show("See"), "See");
  });
});

describe("isIncompleteNoun", () => {
  it("flags a capitalised German term without gender", () => {
    assert.equal(isIncompleteNoun(c("Tisch"), de), true);
  });
  it("does not flag known gender, lowercase terms, blanks or other languages", () => {
    assert.equal(isIncompleteNoun(c("Tisch", "m"), de), false);
    assert.equal(isIncompleteNoun(c("gehen"), de), false);
    assert.equal(isIncompleteNoun(c("  "), de), false);
    assert.equal(isIncompleteNoun(c("Table"), en), false);
  });
});
