import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  forwardDictionarySize,
  lookupKurdishToTurkish,
  lookupTurkishToKurdish,
  reverseDictionarySize,
} from "./lookup.server.ts";

/**
 * Runs against the real committed dataset (ku-data.ts / tr-data.ts) — this
 * dataset is small enough, and its ambiguity filtering happened entirely at
 * build time (see KURDISH-ATTRIBUTION.md), that there is no separate
 * fixture-based parsing suite the way examples.server.test.ts has: the only
 * logic left at runtime is "look the key up, or don't."
 */

describe("the real dataset loads", () => {
  it("has a non-trivial number of records in both directions", () => {
    assert.ok(forwardDictionarySize() > 10_000, "suspiciously small KU->TR dataset");
    assert.ok(reverseDictionarySize() > 5_000, "suspiciously small TR->KU dataset");
  });
});

describe("lookupKurdishToTurkish — unambiguous term resolves", () => {
  it("'malbat' (family) resolves to Turkish gloss(es)", () => {
    const entry = lookupKurdishToTurkish("malbat");
    assert.equal(entry?.lemma, "malbat");
    assert.ok(entry!.translations.includes("aile"));
  });

  it("is case-insensitive", () => {
    for (const spelling of ["MALBAT", "Malbat", "  malbat  "]) {
      assert.equal(lookupKurdishToTurkish(spelling)?.lemma, "malbat", spelling);
    }
  });
});

describe("lookupKurdishToTurkish — multi-sense/cross-POS headwords now resolve with all glosses", () => {
  // Confirmed against the real dataset, not assumed: each of these either
  // has multiple senses under one part-of-speech ("şev": night vs. an
  // "apple tree" sense sharing the same section), multiple different
  // parts-of-speech ("dê", "nan", "dost"), or both. These used to be
  // excluded entirely at build time; they're now included with every
  // translation the entry has (deduped, capped at 5) since there was never
  // a principled way to split them by sense (see KURDISH-ATTRIBUTION.md).
  it(`"mal" (house/property/goods) resolves to multiple Turkish glosses`, () => {
    const entry = lookupKurdishToTurkish("mal");
    assert.equal(entry?.lemma, "mal");
    assert.ok(entry!.translations.length >= 2, "expected 2+ translations for 'mal'");
    assert.ok(entry!.translations.length <= 5);
    assert.ok(entry!.translations.includes("ev"));
    assert.ok(entry!.translations.includes("mal"));
  });

  for (const term of ["şev", "dê", "nan", "dost"]) {
    it(`"${term}" resolves with 2+ translations, capped at 5`, () => {
      const entry = lookupKurdishToTurkish(term);
      assert.equal(entry?.lemma, term);
      assert.ok(entry!.translations.length >= 2, `expected 2+ translations for '${term}'`);
      assert.ok(entry!.translations.length <= 5, `expected at most 5 translations for '${term}'`);
    });
  }
});

describe("lookupKurdishToTurkish — not found", () => {
  for (const term of ["", "   ", "xyzzyxyzzy", "notakurdishword"]) {
    it(`"${term}" -> null`, () => {
      assert.equal(lookupKurdishToTurkish(term), null);
    });
  }
});

describe("lookupTurkishToKurdish — reverse lookup", () => {
  it("'fare' (mouse, one clear KU headword) still resolves the same as before", () => {
    const entry = lookupTurkishToKurdish("fare");
    assert.equal(entry?.lemma, "mişk");
    assert.deepEqual(entry!.translations, ["mişk"]);
  });

  it("a Turkish word linked to 2+ different Kurdish headwords now resolves with all of them", () => {
    // "aile" translates several distinct KU words (malbat, binemal, xêzan,
    // ...) in the real dataset — this used to be dropped entirely by the
    // old "exactly one match" rule; it's now included with every distinct
    // headword it maps to, deduped and capped at 5.
    const entry = lookupTurkishToKurdish("aile");
    assert.ok(entry, "'aile' should resolve");
    assert.ok(entry!.translations.length >= 2, "expected 2+ KU headwords for 'aile'");
    assert.ok(entry!.translations.length <= 5, "expected at most 5 KU headwords for 'aile'");
    assert.ok(entry!.translations.includes("malbat"));
    assert.equal(entry!.lemma, entry!.translations[0]);
  });

  it("not found / empty input -> null", () => {
    for (const term of ["", "   ", "xyzzyxyzzy"]) {
      assert.equal(lookupTurkishToKurdish(term), null);
    }
  });

  it("is case-insensitive", () => {
    // "fare" has no dotted/dotless-I ambiguity under Turkish casing rules,
    // unlike "aile" (whose Turkish-locale-uppercase round-trip changes
    // letters), so a plain toUpperCase() round-trip is safe here.
    const lower = lookupTurkishToKurdish("fare");
    const upper = lookupTurkishToKurdish("FARE".toLowerCase());
    assert.deepEqual(upper, lower);
  });
});
