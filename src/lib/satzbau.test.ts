import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { satzbauChipsForCard, shuffleChips, tokenizeSentence } from "./satzbau.ts";
import type { Card } from "./types.ts";

describe("tokenizeSentence", () => {
  it("splits on whitespace", () => {
    assert.deepEqual(tokenizeSentence("Ich trinke gern Tee"), ["Ich", "trinke", "gern", "Tee"]);
  });

  it("keeps punctuation attached to its word", () => {
    assert.deepEqual(tokenizeSentence("Ich trinke gern Tee."), [
      "Ich",
      "trinke",
      "gern",
      "Tee.",
    ]);
    assert.deepEqual(tokenizeSentence("Ich weiß, dass du kommst."), [
      "Ich",
      "weiß,",
      "dass",
      "du",
      "kommst.",
    ]);
  });

  it("preserves original casing", () => {
    assert.deepEqual(tokenizeSentence("Der Hund läuft schnell."), [
      "Der",
      "Hund",
      "läuft",
      "schnell.",
    ]);
  });

  it("collapses repeated whitespace and trims", () => {
    assert.deepEqual(tokenizeSentence("  Ich   trinke  Tee.  "), ["Ich", "trinke", "Tee."]);
  });

  it("returns [] for empty input", () => {
    assert.deepEqual(tokenizeSentence(""), []);
    assert.deepEqual(tokenizeSentence("   "), []);
  });

  it("rejoining chips with single spaces reproduces a normally-spaced sentence", () => {
    const sentence = "Ich trinke gern Tee.";
    assert.equal(tokenizeSentence(sentence).join(" "), sentence);
  });
});

describe("satzbauChipsForCard", () => {
  const base: Card = {
    id: "tee",
    term: "Tee",
    definition: "tea",
    starred: false,
    imageUrl: null,
  };

  it("is null when the card has no example", () => {
    assert.equal(satzbauChipsForCard({ ...base, example: null }), null);
    assert.equal(satzbauChipsForCard({ ...base }), null);
  });

  it("is null when the example has fewer than 4 words", () => {
    assert.equal(satzbauChipsForCard({ ...base, example: "Ich trinke Tee." }), null);
  });

  it("is null when the example has more than 12 words", () => {
    const long = "Ich trinke jeden Morgen sehr gern eine große Tasse heißen grünen Tee zuhause.";
    assert.equal(tokenizeSentence(long).length > 12, true);
    assert.equal(satzbauChipsForCard({ ...base, example: long }), null);
  });

  it("returns the chips in original order at the boundaries (4 and 12 words)", () => {
    const fourWords = "Ich trinke gern Tee.";
    assert.deepEqual(satzbauChipsForCard({ ...base, example: fourWords }), [
      "Ich",
      "trinke",
      "gern",
      "Tee.",
    ]);
    const twelveWords = "Ich trinke jeden Morgen sehr gern eine große Tasse heißen grünen Tee.";
    assert.equal(tokenizeSentence(twelveWords).length, 12);
    assert.deepEqual(satzbauChipsForCard({ ...base, example: twelveWords }), tokenizeSentence(twelveWords));
  });
});

describe("shuffleChips", () => {
  it("returns the same multiset of words", () => {
    const chips = ["Ich", "trinke", "gern", "Tee."];
    const shuffled = shuffleChips(chips);
    assert.deepEqual([...shuffled].sort(), [...chips].sort());
  });

  it("never returns the original order verbatim for distinct-word input", () => {
    const chips = ["Ich", "trinke", "gern", "Tee."];
    for (let i = 0; i < 25; i++) {
      assert.notDeepEqual(shuffleChips(chips), chips);
    }
  });

  it("does not mutate its input", () => {
    const chips = ["Ich", "trinke", "gern", "Tee."];
    const copy = [...chips];
    shuffleChips(chips);
    assert.deepEqual(chips, copy);
  });

  it("returns a copy unchanged for inputs shorter than 2", () => {
    assert.deepEqual(shuffleChips([]), []);
    assert.deepEqual(shuffleChips(["Tee."]), ["Tee."]);
  });
});
