import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { enrichGermanTerm } from "./enrich.server.ts";

describe("enrichGermanTerm — exact dictionary hits fill silently", () => {
  const cases: [string, { gender?: string; plural?: string }][] = [
    ["Tisch", { gender: "m", plural: "Tische" }],
    ["Haus", { gender: "n", plural: "Häuser" }],
    ["Tür", { gender: "f", plural: "Türen" }],
    ["Vater", { gender: "m", plural: "Väter" }],
  ];
  for (const [term, expected] of cases) {
    it(`${term} -> ${JSON.stringify(expected)}, not inferred`, () => {
      const result = enrichGermanTerm(term);
      assert.equal(result?.gender, expected.gender);
      assert.equal(result?.plural, expected.plural);
      assert.equal(result?.source, "dict");
      assert.equal(result?.inferred, undefined);
    });
  }

  it("is case-insensitive, like the underlying lookup", () => {
    assert.deepEqual(enrichGermanTerm("tisch"), enrichGermanTerm("Tisch"));
    assert.deepEqual(enrichGermanTerm("HAUS"), enrichGermanTerm("Haus"));
  });
});

describe("enrichGermanTerm — leaves an ambiguous field blank, per-field", () => {
  it("leaves gender blank but fills plural when only gender is ambiguous", () => {
    // Joghurt is m/f/n — genuinely, not a data error — but "Joghurts" is
    // its only plural. Filling any one gender would assert a fact nobody
    // agrees on; the plural has no such conflict.
    const result = enrichGermanTerm("Joghurt");
    assert.equal(result?.gender, undefined);
    assert.equal(result?.plural, "Joghurts");
  });

  it("leaves plural blank but fills gender when only plural is ambiguous", () => {
    // "Wort" pluralizes to both "Worte" (words in a speech) and "Wörter"
    // (words in a dictionary) — different meanings, so neither is filled.
    const result = enrichGermanTerm("Wort");
    assert.equal(result?.gender, "n");
    assert.equal(result?.plural, undefined);
  });

  it("returns null when nothing is left after filtering names, even with real entries", () => {
    // "Berlin" is a real dictionary entry, entirely as a place name.
    assert.equal(enrichGermanTerm("Berlin"), null);
  });

  it("filters a name sense out before judging ambiguity, not after", () => {
    // "Zeit" is both an ordinary feminine noun and (separately) a surname
    // with no recorded gender. Naively unioning both senses' genders would
    // manufacture an ambiguity ("f" vs "unmarked") that isn't real; the
    // surname sense must be dropped before the fields are even compared.
    const result = enrichGermanTerm("Zeit");
    assert.equal(result?.gender, "f");
    assert.equal(result?.plural, "Zeiten");
  });

  it("returns null, not a half-filled object, when nothing at all agrees", () => {
    // Every non-name sense of "Frankfurter" disagrees on gender (a person
    // from Frankfurt is "der", the adjectival form is genderless) — only
    // its plural (identical to the singular) survives.
    const result = enrichGermanTerm("Frankfurter");
    assert.equal(result?.gender, undefined);
    assert.equal(result?.plural, "Frankfurter");
    assert.equal(result?.source, "dict");
  });
});

describe("enrichGermanTerm — compound-derived values are marked as guesses", () => {
  it("infers gender and plural from an unambiguous compound's head", () => {
    // Not itself a dictionary lemma; "Vermögen" + "Bildung" is its only
    // viable split, and "Bildung" (the head) is unambiguously feminine.
    const result = enrichGermanTerm("Vermögensbildung");
    assert.equal(result?.gender, "f");
    assert.equal(result?.plural, "Bildungen");
    assert.equal(result?.source, "dict");
    assert.equal(result?.inferred, true);
  });

  it("prefers an exact dictionary hit over a compound guess for the same word", () => {
    // "Bundesregierung" and "Haustür" are themselves listed lemmas, even
    // though they're also cleanly splittable — the direct, non-guessed
    // answer must win.
    for (const term of ["Bundesregierung", "Haustür", "Wachstube"]) {
      const result = enrichGermanTerm(term);
      assert.equal(result?.inferred, undefined, term);
    }
  });

  it("infers nothing when the compound itself splits ambiguously", () => {
    // "Aaseradler" genuinely reads two ways — Aas+Radler or Aaser+Adler —
    // close enough in score to be a coin flip. Deriving gender from
    // whichever guess happens to rank first would be guessing on top of a
    // guess; the contract is to answer nothing rather than that.
    assert.equal(enrichGermanTerm("Aaseradler"), null);
  });

  it("returns null for a word that neither the dictionary nor the splitter recognizes", () => {
    assert.equal(enrichGermanTerm("xyzzyfoo"), null);
  });
});

describe("enrichGermanTerm — input handling", () => {
  it("returns null for empty or whitespace-only input", () => {
    assert.equal(enrichGermanTerm(""), null);
    assert.equal(enrichGermanTerm("   "), null);
  });

  it("tolerates surrounding whitespace on a real word", () => {
    assert.equal(enrichGermanTerm("  Tisch  ")?.gender, "m");
  });
});
