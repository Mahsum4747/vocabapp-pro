import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { answersMatch, normalizeAnswer } from "./utils.ts";

describe("normalizeAnswer", () => {
  it("trims, lowercases, and collapses whitespace", () => {
    assert.equal(normalizeAnswer("  Tisch  "), "tisch");
    assert.equal(normalizeAnswer("a   b"), "a b");
  });

  it("strips accents and punctuation", () => {
    assert.equal(normalizeAnswer("café!"), "cafe");
    assert.equal(normalizeAnswer("naïve?"), "naive");
  });
});

describe("answersMatch — default behavior, unchanged by the third argument existing", () => {
  it("matches modulo case, accents, and punctuation", () => {
    assert.equal(answersMatch("Tisch", "tisch"), true);
    assert.equal(answersMatch("café", "cafe"), true);
    assert.equal(answersMatch("Tisch!", "Tisch"), true);
  });

  it("rejects a genuinely different answer", () => {
    assert.equal(answersMatch("Stuhl", "Tisch"), false);
  });

  it("rejects an empty answer", () => {
    assert.equal(answersMatch("", "Tisch"), false);
    assert.equal(answersMatch("   ", "Tisch"), false);
  });

  it("is exactly as strict with no options argument as it always was", () => {
    // The regression this whole feature must never cause: an omitted third
    // argument must behave identically to the function's original shape.
    assert.equal(answersMatch("der Tisch", "Tisch"), false);
    assert.equal(answersMatch("die Tür", "Tür"), false);
  });

  it("is exactly as strict when given an empty word list", () => {
    assert.equal(answersMatch("der Tisch", "Tisch", { ignorableLeadingWords: [] }), false);
  });
});

describe("answersMatch — ignorableLeadingWords", () => {
  const german = { ignorableLeadingWords: ["der", "die", "das"] };

  it("accepts the answer with a leading article", () => {
    assert.equal(answersMatch("der Tisch", "Tisch", german), true);
    assert.equal(answersMatch("die Tür", "Tür", german), true);
    assert.equal(answersMatch("das Haus", "Haus", german), true);
  });

  it("still accepts the bare answer with no article at all", () => {
    assert.equal(answersMatch("Tisch", "Tisch", german), true);
  });

  it("accepts ANY of the given words, not just the one matching the term's real gender", () => {
    // Deliberate: judging which article is correct is a different, harder
    // question (deferred to a future article-specific drill) — this
    // function has no opinion on it.
    assert.equal(answersMatch("die Tisch", "Tisch", german), true);
    assert.equal(answersMatch("das Tisch", "Tisch", german), true);
  });

  it("is case- and accent-insensitive about the article too", () => {
    assert.equal(answersMatch("DER Tisch", "Tisch", german), true);
    assert.equal(answersMatch("Der   Tisch", "Tisch", german), true);
  });

  it("does not accept a word that merely starts with an article as a prefix without a boundary", () => {
    // "Derby" must not be treated as "der" + "by": there is no real word
    // "by" to have stripped an article from, and this must not silently
    // accept a wrong answer that happens to start with "der".
    assert.equal(answersMatch("Derby", "by", german), false);
  });

  it("does not accept the article word alone, with nothing after it", () => {
    assert.equal(answersMatch("der", "Tisch", german), false);
  });

  it("does not strip more than one leading word", () => {
    assert.equal(answersMatch("der der Tisch", "Tisch", german), false);
  });

  it("rejects a genuinely wrong answer even with an article prefixed", () => {
    assert.equal(answersMatch("der Stuhl", "Tisch", german), false);
  });

  it("still rejects an empty answer", () => {
    assert.equal(answersMatch("", "Tisch", german), false);
  });
});
