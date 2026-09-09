import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EXPECTED_ROWS,
  dictionarySize,
  lookupExact,
  lookupNoun,
} from "./nouns.server.ts";
import { isNameOnly } from "./types.ts";

/** The first (best-ranked) sense, as a compact string, for terse assertions. */
function top(word: string): string {
  const entry = lookupNoun(word)[0];
  if (!entry) return "(none)";
  return `${entry.lemma} ${entry.genus.join("/")} ${entry.plural.join("/") || "-"}`;
}

describe("the dictionary data file", () => {
  it("loads every record the generator wrote", () => {
    // Guards against the data file and the loader drifting apart — a
    // regenerated dataset that isn't parsed cleanly shows up here.
    assert.equal(dictionarySize(), EXPECTED_ROWS);
    assert.ok(dictionarySize() > 100_000, "suspiciously small dictionary");
  });
});

describe("lookupNoun — known lemmas", () => {
  const cases: [string, string][] = [
    ["Vater", "Vater m Väter"],
    ["Kind", "Kind n Kinder"],
    ["Zeit", "Zeit f Zeiten"],
    ["Haus", "Haus n Häuser"],
    ["Tür", "Tür f Türen"],
    ["Fahrrad", "Fahrrad n Fahrräder"],
    ["Hand", "Hand f Hände"],
    // Plural identical to the singular — a real answer, not a missing one.
    ["Arbeitszimmer", "Arbeitszimmer n Arbeitszimmer"],
  ];
  for (const [word, expected] of cases) {
    it(`${word} -> ${expected}`, () => {
      assert.equal(top(word), expected);
    });
  }

  it("is case-insensitive, and tolerates surrounding whitespace", () => {
    for (const spelling of ["Vater", "vater", "VATER", "  Vater  "]) {
      assert.equal(top(spelling), "Vater m Väter", spelling);
    }
  });

  it("always reports Substantiv in pos", () => {
    for (const word of ["Vater", "Haus", "Berlin", "Müller"]) {
      assert.ok(lookupNoun(word)[0]?.pos.includes("Substantiv"), word);
    }
  });
});

describe("lookupNoun — German's plural forms", () => {
  it("finds a lemma by its plural", () => {
    assert.equal(lookupNoun("Fahrräder")[0]?.lemma, "Fahrrad");
    assert.equal(lookupNoun("Häuser")[0]?.lemma, "Haus");
    assert.equal(lookupNoun("väter")[0]?.lemma, "Vater");
  });

  it("ranks the lemma sense above a merely-plural match", () => {
    // "Frankfurter" is its own lemma and also the plural of itself; the
    // lemma reading must come first whatever else matches.
    assert.equal(lookupNoun("Frankfurter")[0]?.lemma, "Frankfurter");
  });

  it("keeps both plurals when a word has two that mean different things", () => {
    const plurals = lookupNoun("Wort").flatMap((entry) => entry.plural);
    assert.ok(plurals.includes("Wörter"), "Wörter missing");
    assert.ok(plurals.includes("Worte"), "Worte missing");
  });

  it("reports no plural rather than inventing one", () => {
    // ~21% of records have none: mass nouns, singularia tantum, proper nouns.
    // Empty is the source's answer, and must survive to the caller as empty.
    const berlin = lookupNoun("Berlin")[0];
    assert.deepEqual(berlin?.plural, []);
  });
});

describe("lookupNoun — gender", () => {
  it("keeps every gender a word actually has", () => {
    assert.deepEqual(lookupNoun("Joghurt")[0]?.genus, ["m", "f", "n"]);
  });

  it("reports no gender rather than guessing one", () => {
    assert.deepEqual(lookupNoun("Berlin")[0]?.genus, []);
  });
});

describe("lookupNoun — ß and ss", () => {
  it("finds a ß lemma when the user types ss", () => {
    assert.ok(
      lookupNoun("Fuss").some((entry) => entry.lemma === "Fuß"),
      "Fuß not found for 'Fuss'",
    );
  });

  it("does not let the fold hide an exact match", () => {
    // "Strasse" is a real exact hit (a plural of "Strass") AND folds to
    // "Straße". Both must come back; returning only one would be a silent
    // wrong answer either way round.
    const lemmas = lookupNoun("Strasse").map((entry) => entry.lemma);
    assert.ok(lemmas.includes("Strass"), "exact match lost");
    assert.ok(lemmas.includes("Straße"), "folded match lost");
  });

  it("leaves the exact index unfolded", () => {
    // lookupExact is what the compound splitter walks; folding there would
    // change which splits are considered legal.
    assert.equal(lookupExact("fuss").some((entry) => entry.lemma === "Fuß"), false);
    assert.ok(lookupExact("fuß").some((entry) => entry.lemma === "Fuß"));
  });
});

describe("lookupNoun — proper names are tagged, not hidden", () => {
  it("tags a surname sense so a caller can filter it", () => {
    const senses = lookupNoun("Zeit");
    assert.equal(senses[0]?.lemma, "Zeit");
    assert.ok(senses[0]?.pos.includes("Nachname") === false, "ordinary sense mislabelled");
    assert.ok(
      senses.some((entry) => entry.pos.includes("Nachname")),
      "surname sense missing",
    );
  });

  it("marks a place name as name-only", () => {
    assert.ok(lookupNoun("Berlin").every(isNameOnly));
    assert.equal(lookupNoun("Haus").some(isNameOnly), false);
  });

  it("keeps an ordinary sense alongside a name sense", () => {
    // "Müller" is a job and a surname; dropping either would be wrong.
    const senses = lookupNoun("Müller");
    assert.ok(senses.some((entry) => !isNameOnly(entry)), "ordinary sense missing");
    assert.ok(senses.some(isNameOnly), "surname sense missing");
  });
});

describe("lookupNoun — not found", () => {
  for (const word of ["", "   ", "xyzzy", "Vermögensbildung", "notagermanword"]) {
    it(`"${word}" -> []`, () => {
      assert.deepEqual(lookupNoun(word), []);
    });
  }

  it("returns an empty array, never null or a partial match", () => {
    // A 102k-lemma extract genuinely lacks rare compounds; that is an answer,
    // and the compound splitter is what handles it.
    const result = lookupNoun("Donaudampfschifffahrtskapitänsmütze");
    assert.ok(Array.isArray(result));
    assert.equal(result.length, 0);
  });
});
