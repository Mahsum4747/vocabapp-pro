import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { clozeBlankForCard, findBlankSpan } from "./cloze.ts";
import type { Card } from "./types.ts";

describe("findBlankSpan", () => {
  it("finds an exact-case match", () => {
    assert.deepEqual(findBlankSpan("Ich trinke gern Tee.", "Tee"), {
      before: "Ich trinke gern ",
      answer: "Tee",
      after: ".",
    });
  });

  it("matches case-insensitively", () => {
    assert.deepEqual(findBlankSpan("TEE ist lecker.", "Tee"), {
      before: "",
      answer: "TEE",
      after: " ist lecker.",
    });
  });

  it("matches accent-insensitively", () => {
    assert.deepEqual(findBlankSpan("Wir gehen ins Café.", "Cafe"), {
      before: "Wir gehen ins ",
      answer: "Café",
      after: ".",
    });
    assert.deepEqual(findBlankSpan("Wir gehen ins Cafe.", "Café"), {
      before: "Wir gehen ins ",
      answer: "Cafe",
      after: ".",
    });
  });

  it("requires a word boundary — a shorter term doesn't match inside a longer word", () => {
    assert.equal(findBlankSpan("Die Söhne kamen spät nach Hause.", "Sohn"), null);
    assert.equal(findBlankSpan("Teelöffel sind praktisch.", "Tee"), null);
  });

  it("blanks the first occurrence when the term appears more than once", () => {
    assert.deepEqual(findBlankSpan("Der Tisch neben dem Tisch ist leer.", "Tisch"), {
      before: "Der ",
      answer: "Tisch",
      after: " neben dem Tisch ist leer.",
    });
  });

  it("returns null for an empty term", () => {
    assert.equal(findBlankSpan("Ich trinke gern Tee.", ""), null);
  });

  it("returns null when nothing matches at all", () => {
    assert.equal(findBlankSpan("Ich trinke gern Tee.", "Kaffee"), null);
  });
});

describe("clozeBlankForCard", () => {
  const base: Card = {
    id: "tee",
    term: "Tee",
    definition: "tea",
    starred: false,
    imageUrl: null,
  };

  it("is null when the card has no example", () => {
    assert.equal(clozeBlankForCard({ ...base, example: null }), null);
    assert.equal(clozeBlankForCard({ ...base }), null);
  });

  it("is null when the example doesn't contain the term", () => {
    assert.equal(clozeBlankForCard({ ...base, example: "Kaffee ist auch gut." }), null);
  });

  it("blanks the term out of the card's own example", () => {
    assert.deepEqual(clozeBlankForCard({ ...base, example: "Ich trinke gern Tee." }), {
      before: "Ich trinke gern ",
      answer: "Tee",
      after: ".",
    });
  });
});
