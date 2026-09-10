import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_PROFILE,
  articleWordsForAnswer,
  articleizedTerm,
  profileFor,
  stripArticle,
} from "./profiles.ts";

describe("profileFor", () => {
  it("returns the German profile for 'de'", () => {
    assert.equal(profileFor("de").hasNounEnrichment, true);
  });

  it("returns the empty profile for every other real language", () => {
    for (const code of ["en", "tr", "ku", "ckb", "fr", "ru"] as const) {
      assert.equal(profileFor(code).hasNounEnrichment, false, code);
    }
  });

  it("returns the empty profile for null/undefined, never throws", () => {
    assert.equal(profileFor(null).hasNounEnrichment, false);
    assert.equal(profileFor(undefined).hasNounEnrichment, false);
  });

  it("the empty profile has no articleFor at all", () => {
    assert.equal(EMPTY_PROFILE.articleFor, undefined);
  });
});

describe("articleWords", () => {
  it("lists exactly German's three articles, once each", () => {
    const words = profileFor("de").articleWords;
    assert.deepEqual([...words].sort(), ["das", "der", "die"]);
  });

  it("agrees with articleFor — the same words, not a second hand-written list", () => {
    const german = profileFor("de");
    for (const gender of ["m", "f", "n"] as const) {
      const article = german.articleFor?.(gender);
      assert.ok(article && german.articleWords.includes(article), gender);
    }
  });

  it("is empty for the empty profile", () => {
    assert.deepEqual(EMPTY_PROFILE.articleWords, []);
  });

  it("is empty for every other language too", () => {
    for (const code of ["en", "tr", "ku", "ckb", "fr", "ru"] as const) {
      assert.deepEqual(profileFor(code).articleWords, [], code);
    }
  });
});

describe("articleizedTerm", () => {
  const german = profileFor("de");

  it("prefixes the correct article for each gender", () => {
    assert.equal(articleizedTerm("Tisch", { gender: "m", source: "dict" }, german), "der Tisch");
    assert.equal(articleizedTerm("Tür", { gender: "f", source: "dict" }, german), "die Tür");
    assert.equal(articleizedTerm("Haus", { gender: "n", source: "dict" }, german), "das Haus");
  });

  it("returns the bare term when there is no gender to show", () => {
    assert.equal(articleizedTerm("Tisch", undefined, german), "Tisch");
    assert.equal(articleizedTerm("Tisch", null, german), "Tisch");
    assert.equal(articleizedTerm("Tisch", { source: "dict" }, german), "Tisch");
  });

  it("returns the bare term for a profile with no article rendering", () => {
    // Even if a card somehow carried a gender under a non-German set.
    assert.equal(articleizedTerm("Tisch", { gender: "m", source: "dict" }, EMPTY_PROFILE), "Tisch");
  });

  it("never mutates the term string itself", () => {
    const term = "Tisch";
    articleizedTerm(term, { gender: "m", source: "dict" }, german);
    assert.equal(term, "Tisch");
  });
});

describe("articleWordsForAnswer", () => {
  const german = profileFor("de");

  it("returns the profile's articles when the card's gender is known", () => {
    assert.deepEqual(articleWordsForAnswer({ gender: "m", source: "dict" }, german), [
      "der",
      "die",
      "das",
    ]);
  });

  it("returns [] when the card has no gender at all — the no-regression path", () => {
    // This is the path every existing (enrichment-less) card takes today.
    assert.deepEqual(articleWordsForAnswer(undefined, german), []);
    assert.deepEqual(articleWordsForAnswer(null, german), []);
    assert.deepEqual(articleWordsForAnswer({ source: "dict" }, german), []);
  });

  it("returns [] for a non-German profile even when the card has a gender", () => {
    // The second, independent gate: a malformed or legacy value (e.g. a
    // card copied out of a German set into one with a different language)
    // must not grant leniency just because a gender happens to be present.
    assert.deepEqual(articleWordsForAnswer({ gender: "m", source: "dict" }, EMPTY_PROFILE), []);
  });

  it("respects a user's own correction the same as a dictionary value", () => {
    assert.deepEqual(articleWordsForAnswer({ gender: "f", source: "user" }, german), [
      "der",
      "die",
      "das",
    ]);
  });
});

describe("hasExampleSuggestions", () => {
  it("is enabled for German only", () => {
    assert.equal(profileFor("de").hasExampleSuggestions, true);
  });

  it("is disabled for every other language and the empty profile", () => {
    for (const code of ["en", "tr", "ku", "ckb", "fr", "ru"] as const) {
      assert.equal(profileFor(code).hasExampleSuggestions, false, code);
    }
    assert.equal(EMPTY_PROFILE.hasExampleSuggestions, false);
  });
});

describe("stripArticle", () => {
  const german = profileFor("de");

  it("strips a leading article, case-insensitively", () => {
    assert.equal(stripArticle("der Sohn", german), "Sohn");
    assert.equal(stripArticle("DIE Tür", german), "Tür");
    assert.equal(stripArticle("Das Haus", german), "Haus");
  });

  it("leaves a term with no article untouched (just trimmed)", () => {
    assert.equal(stripArticle("Sohn", german), "Sohn");
    assert.equal(stripArticle("  Sohn  ", german), "Sohn");
  });

  it("does not treat a word merely starting with an article as prefixed", () => {
    // Same boundary rule as answersMatch's leniency: a real word ("Derby")
    // must never be mistaken for "der" + "by".
    assert.equal(stripArticle("Derby", german), "Derby");
  });

  it("does not strip anything for a profile with no article words", () => {
    assert.equal(stripArticle("der Sohn", EMPTY_PROFILE), "der Sohn");
  });

  it("strips only one leading article, not a chain of them", () => {
    assert.equal(stripArticle("der der Sohn", german), "der Sohn");
  });
});
