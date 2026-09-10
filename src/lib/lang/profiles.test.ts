import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_PROFILE, articleizedTerm, profileFor } from "./profiles.ts";

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
