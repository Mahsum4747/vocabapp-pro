import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { analyzeCompound } from "./compound.ts";
import { germanNouns } from "./nouns.server.ts";
import type { NounEntry, NounIndex } from "./types.ts";

/** A hand-built index, so the search itself can be tested independently of
 *  which words happen to be in Wiktionary. */
function fixture(words: (string | Partial<NounEntry>)[]): NounIndex {
  const byForm = new Map<string, NounEntry[]>();
  for (const word of words) {
    const entry: NounEntry = {
      lemma: typeof word === "string" ? word : (word.lemma ?? ""),
      genus: [],
      plural: [],
      pos: ["Substantiv"],
      ...(typeof word === "string" ? {} : word),
    };
    for (const form of [entry.lemma, ...entry.plural]) {
      const key = form.toLowerCase();
      byForm.set(key, [...(byForm.get(key) ?? []), entry]);
    }
  }
  return { lookup: (key) => byForm.get(key) ?? [] };
}

/** "Haus+Tür", for readable assertions. */
function split(analysis: ReturnType<typeof analyzeCompound>, rank = 0): string {
  return analysis.guesses[rank]?.parts.map((part) => part.lemma).join("+") ?? "(none)";
}

describe("analyzeCompound — the search", () => {
  const index = fixture(["Haus", "Tür", "Hau", "Schuh", "Hand", "Arbeit", "Zimmer"]);

  it("splits a two-part compound", () => {
    assert.equal(split(analyzeCompound("Haustür", index)), "Haus+Tür");
    assert.equal(split(analyzeCompound("Handschuh", index)), "Hand+Schuh");
  });

  it("prefers the reading that uses the whole word", () => {
    // "Hau" is a real word and a prefix of "Haustür"; taking it would leave
    // "stür", which is nothing, so the search must not be greedy about it.
    assert.equal(split(analyzeCompound("Haustür", index)), "Haus+Tür");
  });

  it("requires the parts to account for every letter", () => {
    // "Hausxyz" starts with a real word, but the rest is not a word, so there
    // is no reading — deliberately not "Haus plus something we ignored".
    assert.deepEqual(analyzeCompound("Hausxyz", index).guesses, []);
  });

  it("is case-insensitive and ignores surrounding whitespace", () => {
    for (const spelling of ["Haustür", "haustür", "HAUSTÜR", "  Haustür "]) {
      assert.equal(split(analyzeCompound(spelling, index)), "Haus+Tür", spelling);
    }
  });

  it("does not report a word that is merely in the dictionary as a compound", () => {
    // One part covering everything is a lookup, not a split.
    assert.deepEqual(analyzeCompound("Haus", index).guesses, []);
    assert.deepEqual(analyzeCompound("Arbeit", index).guesses, []);
  });

  it("finds nothing in a word that is not built from known nouns", () => {
    assert.deepEqual(analyzeCompound("xyzzyfoo", index).guesses, []);
    assert.deepEqual(analyzeCompound("", index).guesses, []);
    assert.deepEqual(analyzeCompound("ab", index).guesses, []);
  });
});

describe("analyzeCompound — linking elements", () => {
  const index = fixture([
    "Arbeit",
    "Zimmer",
    { lemma: "Hund", plural: ["Hunde"] },
    "Hütte",
    "Schrecken",
    "Schreck",
    "Kammer",
    "Bund",
    "Regierung",
  ]);

  it("absorbs a linking -s-", () => {
    assert.equal(split(analyzeCompound("Arbeitszimmer", index)), "Arbeit+Zimmer");
  });

  it("absorbs a linking -es-", () => {
    assert.equal(split(analyzeCompound("Bundesregierung", index)), "Bund+Regierung");
  });

  it("absorbs a linking -e-", () => {
    assert.equal(split(analyzeCompound("Hundehütte", index)), "Hund+Hütte");
  });

  it("strips the shortest linking element that leaves a real word", () => {
    // "Schreckenskammer" contains both "Schreck" (strip -ens) and "Schrecken"
    // (strip -s). The longer stem is the word that is actually in there;
    // preferring the longest strippable suffix gets this one wrong.
    assert.equal(split(analyzeCompound("Schreckenskammer", index)), "Schrecken+Kammer");
  });

  it("keeps the linking element in the part's surface form", () => {
    // The lemma is "Arbeit" but it occupies "arbeits" in the input — a caller
    // highlighting parts in the original word needs the latter.
    const [first] = analyzeCompound("Arbeitszimmer", index).guesses[0]!.parts;
    assert.equal(first?.lemma, "Arbeit");
    assert.equal(first?.surface, "arbeits");
  });

  it("does not allow a linking element on the final part", () => {
    // A trailing "-s" is a case ending, not a join; "Arbeitzimmers" is not
    // "Arbeit + Zimmer" with something left over.
    assert.deepEqual(analyzeCompound("Arbeitzimmers", index).guesses, []);
  });
});

describe("analyzeCompound — a split is a guess, not a fact", () => {
  it("flags a genuine ambiguity and returns both readings", () => {
    // The canonical case: Wach|stube (a guardroom) or Wachs|tube (a tube of
    // wax). Spelling cannot decide it and neither can this code.
    const index = fixture(["Wach", "Stube", "Wachs", "Tube"]);
    const analysis = analyzeCompound("Wachstube", index);
    assert.equal(analysis.ambiguous, true);
    const readings = analysis.guesses.map((guess) =>
      guess.parts.map((part) => part.lemma).join("+"),
    );
    assert.ok(readings.includes("Wach+Stube"), readings.join(", "));
    assert.ok(readings.includes("Wachs+Tube"), readings.join(", "));
  });

  it("does not flag a clear winner as ambiguous", () => {
    // "Bahnhof+Straße" and "Bahn+Hof+Straße" are both derivable, but the
    // two-part reading is decisively better; calling that a coin flip would
    // make the flag meaningless.
    const index = fixture(["Bahn", "Hof", "Bahnhof", "Straße"]);
    const analysis = analyzeCompound("Bahnhofstraße", index);
    assert.equal(split(analysis), "Bahnhof+Straße");
    assert.equal(analysis.ambiguous, false);
  });

  it("is never ambiguous when there is nothing to be ambiguous between", () => {
    const index = fixture(["Haus", "Tür"]);
    assert.equal(analyzeCompound("Haustür", index).ambiguous, false);
    assert.equal(analyzeCompound("xyzzyfoo", index).ambiguous, false);
  });

  it("ranks guesses best-first", () => {
    const index = fixture(["Bahn", "Hof", "Bahnhof", "Straße"]);
    const scores = analyzeCompound("Bahnhofstraße", index).guesses.map((g) => g.score);
    assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  });
});

describe("analyzeCompound — proper names are not compound parts", () => {
  it("refuses to build a word out of a surname or a place", () => {
    const index = fixture([
      { lemma: "Bahn", pos: ["Substantiv", "Nachname"] },
      { lemma: "Berlin", pos: ["Substantiv", "Toponym"] },
      "Straße",
      "Hof",
    ]);
    // Only the name senses could supply the first part, so there is no
    // reading at all — better than "Berlin + Straße" presented as morphology.
    assert.deepEqual(analyzeCompound("Berlinstraße", index).guesses, []);
    assert.deepEqual(analyzeCompound("Bahnhof", index).guesses, []);
  });
});

describe("analyzeCompound — against the real dictionary", () => {
  const cases: [string, string][] = [
    ["Vermögensbildung", "Vermögen+Bildung"],
    ["Haustür", "Haus+Tür"],
    ["Arbeitszimmer", "Arbeit+Zimmer"],
    ["Handschuh", "Hand+Schuh"],
    ["Bundesregierung", "Bund+Regierung"],
    ["Hundehütte", "Hund+Hütte"],
    ["Geschwindigkeitsbegrenzung", "Geschwindigkeit+Begrenzung"],
    // Plural as the linking form, umlaut and all: "Bücher", not "Buche".
    ["Bücherregal", "Buch+Regal"],
  ];
  for (const [word, expected] of cases) {
    it(`${word} -> ${expected}`, () => {
      assert.equal(split(analyzeCompound(word, germanNouns)), expected);
    });
  }

  it("splits a word the dictionary itself does not contain", () => {
    // The whole point: "Vermögensbildung" is not a lemma, but its parts are.
    assert.equal(analyzeCompound("Vermögensbildung", germanNouns).guesses.length > 0, true);
  });

  it("leaves simplex words alone", () => {
    for (const word of ["Vater", "Haus", "Zeit", "Kind"]) {
      assert.deepEqual(analyzeCompound(word, germanNouns).guesses, [], word);
    }
  });
});
