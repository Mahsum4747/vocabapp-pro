import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { multipleChoice, trueFalse, writtenQuestion } from "./quiz.ts";
import { answersMatch } from "./utils.ts";
import { freshCardCopy, type Card } from "./types.ts";
import { articleizedTerm, profileFor } from "./lang/profiles.ts";
import { resolveEnrichment, resolveEnrichmentOnOmit } from "./card-enrichment-policy.ts";
import type { LanguageCode } from "./lang/languages.ts";

/**
 * Cross-cutting regression tests for the whole enrichment feature, kept
 * separate from each module's own unit tests because what they prove only
 * shows up when several pieces are used together: that grading genuinely
 * never sees an enrichment value, and that every language this feature
 * doesn't apply to is provably a no-op end to end, not just at one
 * function's boundary.
 */

function card(overrides: Partial<Card> = {}): Card {
  return {
    id: "c1",
    term: "Tisch",
    definition: "table",
    starred: false,
    imageUrl: null,
    ...overrides,
  };
}

const GERMAN_ENRICHMENT = { gender: "m" as const, plural: "Tische", source: "dict" as const };

describe("grading never sees enrichment", () => {
  it("multipleChoice is byte-identical with and without enrichment", () => {
    const plain = card();
    const enriched = card({ enrichment: GERMAN_ENRICHMENT });
    const pool = [plain, card({ id: "c2", term: "Haus", definition: "house" })];
    const enrichedPool = [enriched, card({ id: "c2", term: "Haus", definition: "house" })];

    // Random distractor order makes the two calls non-deterministic against
    // each other, so compare the field that matters and would leak an
    // article first: the prompt and the answer themselves.
    const a = multipleChoice(pool, plain, "definition");
    const b = multipleChoice(enrichedPool, enriched, "definition");
    assert.equal(a.answer, b.answer);
    assert.equal(a.answer, "Tisch");
    assert.equal(a.prompt, b.prompt);
  });

  it("writtenQuestion is identical with and without enrichment, either direction", () => {
    const plain = card();
    const enriched = card({ enrichment: GERMAN_ENRICHMENT });
    for (const ask of ["term", "definition"] as const) {
      assert.deepEqual(writtenQuestion(plain, ask), writtenQuestion(enriched, ask));
    }
  });

  it("trueFalse's statement is built from the bare term, never an article", () => {
    const enriched = card({ enrichment: GERMAN_ENRICHMENT });
    const result = trueFalse([enriched], enriched);
    assert.match(result.statement, /^Tisch\s/);
    assert.doesNotMatch(result.statement, /^(der|die|das)\s/i);
  });

  it("answersMatch grades a bare answer as correct and an article-prefixed one as wrong", () => {
    // Enrichment is display-only, so what a learner is asked to type never
    // changes — typing the article must not suddenly become required OR
    // accepted as equivalent to the bare word.
    assert.equal(answersMatch("Tisch", "Tisch"), true);
    assert.equal(answersMatch("der Tisch", "Tisch"), false);
  });
});

describe("every other language is a no-op, end to end", () => {
  const OTHER_LANGUAGES: LanguageCode[] = ["en", "tr", "ku", "ckb", "fr", "ru"];
  const dictLookup = () => GERMAN_ENRICHMENT; // would fill, if anything let it

  for (const code of OTHER_LANGUAGES) {
    it(`${code}: no enrichment is ever computed`, () => {
      const context = { isGermanTermLanguage: false, dictLookup };
      assert.equal(resolveEnrichment("Tisch", undefined, context), null);
      assert.equal(
        resolveEnrichmentOnOmit("Tisch", { source: "dict", gender: "n" }, context),
        null,
      );
    });

    it(`${code}: display never shows an article, even if a card somehow carries one`, () => {
      const profile = profileFor(code);
      assert.equal(profile.hasNounEnrichment, false);
      assert.equal(articleizedTerm("Tisch", GERMAN_ENRICHMENT, profile), "Tisch");
    });

    it(`${code}: a user's own correction still survives (it's the user's word, not the profile's)`, () => {
      const context = { isGermanTermLanguage: false, dictLookup };
      const userValue = { source: "user" as const, gender: "n" as const };
      assert.deepEqual(resolveEnrichment("Tisch", userValue, context), userValue);
      assert.deepEqual(resolveEnrichmentOnOmit("Tisch", userValue, context), userValue);
    });
  }

  it("null (a set with no resolved language at all) behaves exactly like a named non-German language", () => {
    const profile = profileFor(null);
    assert.equal(profile.hasNounEnrichment, false);
    assert.equal(articleizedTerm("Tisch", GERMAN_ENRICHMENT, profile), "Tisch");
  });
});

describe("end-to-end: a German card's enrichment survives a copy and displays correctly", () => {
  it("copies, still displays with the article, and term is never mutated", () => {
    const original = card({ enrichment: GERMAN_ENRICHMENT });
    const copy = freshCardCopy(original, "new-id");
    const profile = profileFor("de");

    assert.equal(copy.term, "Tisch");
    assert.equal(articleizedTerm(copy.term, copy.enrichment, profile), "der Tisch");
    // And the copy would still grade identically to the original.
    assert.equal(answersMatch(copy.term, original.term), true);
  });

  it("a card with no enrichment at all displays as the bare term, same as before this feature existed", () => {
    const original = card({ term: "Buch", definition: "book" });
    const copy = freshCardCopy(original, "new-id");
    const profile = profileFor("de");

    assert.equal(articleizedTerm(copy.term, copy.enrichment, profile), "Buch");
  });
});
