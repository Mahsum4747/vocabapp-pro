import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildIndexFromTsv, dictionarySize, lookupBundled, lookupInDictionary } from "./examples.server.ts";
import { EXAMPLES_TSV_ROWS } from "./examples-data.ts";

/**
 * Most tests here run against a small, hand-written fixture TSV, not the
 * real committed `examples-data.ts` — `buildIndexFromTsv` and
 * `lookupInDictionary` are exported specifically so lookup/parsing
 * correctness can be verified independent of the real dataset's exact
 * contents, the same separation card-enrichment-policy.test.ts already
 * draws between "the policy logic" and "the real 102k-record dictionary".
 * The "real data" describe block at the bottom is the exception, now that
 * the real 2,885-record dataset has landed.
 */

const FIXTURE_TSV = [
  "Haus\tnoun\tneuter\tHäuser\tDas Haus ist sehr groß.|Wir bauen ein neues Haus.\thouse\thaus\tmal",
  "Fuß\tnoun\tmasculine\tFüße\tMein Fuß tut weh.\tfoot\t\t",
  "gehen\tverb\t\t\tWir gehen heute spazieren.\tgo|walk\tgitmek\tçûn",
  "leer\tadj\t\t\t\t\t\t",
  // Cross-POS collision, reproducing the real "gehen"/"Gehen" bug on a
  // DIFFERENT lemma ("laufen"/"Laufen") so it doesn't disturb the plain
  // "gehen" verb-parsing test above.
  "laufen\tverb\t\t\tWir laufen jeden Morgen.\tto run\tkoşmak\t",
  "Laufen\tnoun\tneuter\t\tRegelmäßiges Laufen ist gesund.\trunning\t\t",
  // Same-POS collision: two distinct noun senses of the same spelling —
  // the real "Mensch" (human being / a "hussy") shape, here as "Bank"
  // (bench / financial bank).
  "Bank\tnoun\tfeminine\tBänke\tWir saßen auf der Bank.\tbench\t\t",
  "Bank\tnoun\tfeminine\tBanken\tIch war bei der Bank.\tbank\t\t",
].join("\n");

function lookupIn(tsv: string, term: string) {
  return lookupInDictionary(buildIndexFromTsv(tsv), term);
}

describe("lookupInDictionary — parsing", () => {
  it("parses all eight columns, splitting list fields on |", () => {
    const entry = lookupIn(FIXTURE_TSV, "Haus");
    assert.deepEqual(entry, {
      lemma: "Haus",
      pos: "noun",
      gender: "neuter",
      plural: "Häuser",
      examples: ["Das Haus ist sehr groß.", "Wir bauen ein neues Haus."],
      translations: { en: ["house"], tr: ["haus"], ku: ["mal"] },
    });
  });

  it("an entirely empty row (no gender/plural/examples/translations) parses cleanly", () => {
    const entry = lookupIn(FIXTURE_TSV, "leer");
    assert.deepEqual(entry, {
      lemma: "leer",
      pos: "adj",
      gender: null,
      plural: null,
      examples: [],
      translations: { en: [], tr: [], ku: [] },
    });
  });

  it("a verb has no gender/plural, and multiple EN translations parse as a list", () => {
    const entry = lookupIn(FIXTURE_TSV, "gehen");
    assert.equal(entry?.gender, null);
    assert.equal(entry?.plural, null);
    assert.deepEqual(entry?.translations.en, ["go", "walk"]);
  });

  it("an empty TSV string builds an empty, working index rather than throwing", () => {
    assert.equal(lookupIn("", "Haus"), null);
  });
});

describe("lookupInDictionary — case-insensitivity and canonical casing", () => {
  it("finds an entry regardless of the query's casing", () => {
    for (const spelling of ["Haus", "haus", "HAUS", "  Haus  "]) {
      assert.equal(lookupIn(FIXTURE_TSV, spelling)?.lemma, "Haus", spelling);
    }
  });

  it("the returned lemma is the dictionary's own casing, never the query string's", () => {
    // The one requirement called out explicitly: a lowercase query must
    // never leak back out as if it were the canonical spelling.
    const entry = lookupIn(FIXTURE_TSV, "haus");
    assert.equal(entry?.lemma, "Haus");
    assert.notEqual(entry?.lemma, "haus");
  });
});

describe("lookupInDictionary — ß and ss", () => {
  it("finds a ß lemma when the query types ss", () => {
    assert.equal(lookupIn(FIXTURE_TSV, "Fuss")?.lemma, "Fuß");
  });

  it("an exact ß query still matches directly, no fold needed", () => {
    assert.equal(lookupIn(FIXTURE_TSV, "Fuß")?.lemma, "Fuß");
  });
});

describe("lookupInDictionary — not found", () => {
  for (const term of ["", "   ", "xyzzy", "notagermanword"]) {
    it(`"${term}" -> null`, () => {
      assert.equal(lookupIn(FIXTURE_TSV, term), null);
    });
  }
});

describe("lookupInDictionary — ambiguous lemmas return null, never a guess", () => {
  // Real bug, confirmed once the actual dataset landed: "gehen" (verb) ->
  // "Gehen" (nominalized noun, "das Gehen"/"the walking") won under the
  // old "first row in file order" rule — a wrong answer presented as
  // correct, the same class of failure as the "schmutzig" -> "çirkin"
  // mistranslation. There is no POS input anywhere in the card editor to
  // disambiguate with, so the only safe answer is none at all.
  it("a cross-POS collision (verb vs. nominalized noun) returns null for both spellings", () => {
    assert.equal(lookupIn(FIXTURE_TSV, "laufen"), null);
    assert.equal(lookupIn(FIXTURE_TSV, "Laufen"), null);
    assert.equal(lookupIn(FIXTURE_TSV, "LAUFEN"), null);
  });

  it("a same-POS collision (two distinct noun senses) is just as unsafe, and also returns null", () => {
    // "Bank" (bench) vs. "Bank" (financial bank) share a POS tag but are
    // not the same word in any sense a learner would recognize — the real
    // dataset's own "Mensch" (human being / a vulgar "hussy" sense) is the
    // same shape. Sharing a POS tag is not evidence the rows are safe to
    // merge or pick between.
    assert.equal(lookupIn(FIXTURE_TSV, "bank"), null);
  });

  it("an unambiguous lemma elsewhere in the same fixture is entirely unaffected", () => {
    // Adding colliding rows for "laufen"/"Laufen"/"Bank" must not degrade
    // any OTHER, unambiguous lookup in the same dictionary.
    assert.equal(lookupIn(FIXTURE_TSV, "Haus")?.lemma, "Haus");
    assert.equal(lookupIn(FIXTURE_TSV, "gehen")?.pos, "verb");
  });
});

describe("the real dataset — now that it has landed", () => {
  it("loads every record the generator wrote", () => {
    // Guards against the data file and the loader drifting apart, same
    // check nouns.server.test.ts runs against its own dataset.
    assert.equal(dictionarySize(), EXAMPLES_TSV_ROWS);
    assert.ok(dictionarySize() > 2000, "suspiciously small dataset");
  });

  it("the real 'gehen'/'Gehen' collision is now null, not the wrong-sense noun", () => {
    // The exact case that surfaced this bug: querying the verb "gehen"
    // used to silently return the nominalized noun "Gehen" instead.
    assert.equal(lookupBundled("gehen"), null);
  });

  it("the real 'Mensch' same-POS collision is also null, not a coin flip", () => {
    assert.equal(lookupBundled("Mensch"), null);
  });

  it("an unambiguous real lemma still resolves normally", () => {
    const entry = lookupBundled("haus");
    assert.equal(entry?.lemma, "Haus");
    assert.ok(entry!.translations.en.length > 0);
  });
});
