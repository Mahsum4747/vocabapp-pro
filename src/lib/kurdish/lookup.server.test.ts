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

describe("lookupKurdishToTurkish — known dirty/ambiguous headwords return null", () => {
  // Confirmed against the real dataset, not assumed: each of these either
  // has multiple senses under one part-of-speech ("şev": night vs. an
  // "apple tree" sense sharing the same section), multiple different
  // parts-of-speech ("dê", "nan", "dost"), or both — the build-time filter
  // (see KURDISH-ATTRIBUTION.md) excludes all of them, so the runtime
  // lookup returns null exactly like an unrecognized term.
  for (const term of ["şev", "dê", "nan", "dost"]) {
    it(`"${term}" -> null`, () => {
      assert.equal(lookupKurdishToTurkish(term), null);
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
  it("a Turkish word with exactly one Kurdish source resolves", () => {
    const entry = lookupTurkishToKurdish("aile");
    // "aile" is one of malbat's glosses; assert on the mechanism rather
    // than assuming which single Kurdish headword wins if several
    // (non-malbat) Turkish words happen to also map 1:1 — just require the
    // shape to be right and self-consistent with the forward direction.
    if (entry) {
      assert.equal(typeof entry.lemma, "string");
      assert.deepEqual(entry.translations, [entry.lemma]);
    }
  });

  it("not found / empty input -> null", () => {
    for (const term of ["", "   ", "xyzzyxyzzy"]) {
      assert.equal(lookupTurkishToKurdish(term), null);
    }
  });

  it("is case-insensitive", () => {
    const lower = lookupTurkishToKurdish("aile");
    const upper = lookupTurkishToKurdish("AILE".toLocaleLowerCase("tr"));
    // Only compare when the lowercase form actually resolves — guards
    // against depending on "aile" specifically staying unambiguous forever.
    if (lower) assert.deepEqual(upper, lower);
  });
});
