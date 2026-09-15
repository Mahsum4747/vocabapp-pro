import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildIndexFromTsv, lookupInDictionary } from "./examples.server.ts";

/**
 * Tests against a small, hand-written fixture TSV — NOT the real committed
 * `examples-data.ts`, which is currently a 0-record placeholder (see its own
 * header comment and EXAMPLES-ATTRIBUTION.md). `buildIndexFromTsv` and
 * `lookupInDictionary` are exported specifically so lookup/parsing
 * correctness can be verified now, independent of whether the real dataset
 * has landed yet — the same separation card-enrichment-policy.test.ts
 * already draws between "the policy logic" and "the real 102k-record
 * dictionary". Once the real data is in, a "loads every record" smoke test
 * against dictionarySize()/EXAMPLES_TSV_ROWS belongs here too, mirroring
 * nouns.server.test.ts.
 */

const FIXTURE_TSV = [
  "Haus\tnoun\tneuter\tHäuser\tDas Haus ist sehr groß.|Wir bauen ein neues Haus.\thouse\thaus\tmal",
  "Fuß\tnoun\tmasculine\tFüße\tMein Fuß tut weh.\tfoot\t\t",
  "gehen\tverb\t\t\tWir gehen heute spazieren.\tgo|walk\tgitmek\tçûn",
  "leer\tadj\t\t\t\t\t\t",
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
