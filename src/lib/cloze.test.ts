import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { caseBlankMatches, clozeBlankForCard, findBlankSpan } from "./cloze.ts";
import type { Card } from "./types.ts";

describe("findBlankSpan", () => {
  it("finds an exact-case match", () => {
    assert.deepEqual(findBlankSpan("Ich trinke gern Tee.", "Tee"), {
      before: "Ich trinke gern ",
      answer: "Tee",
      after: ".",
    });
  });

  it("matches case-insensitively", () => {
    assert.deepEqual(findBlankSpan("TEE ist lecker.", "Tee"), {
      before: "",
      answer: "TEE",
      after: " ist lecker.",
    });
  });

  it("matches accent-insensitively", () => {
    assert.deepEqual(findBlankSpan("Wir gehen ins Café.", "Cafe"), {
      before: "Wir gehen ins ",
      answer: "Café",
      after: ".",
    });
    assert.deepEqual(findBlankSpan("Wir gehen ins Cafe.", "Café"), {
      before: "Wir gehen ins ",
      answer: "Cafe",
      after: ".",
    });
  });

  it("requires a word boundary — a shorter term doesn't match inside a longer word", () => {
    assert.equal(findBlankSpan("Die Söhne kamen spät nach Hause.", "Sohn"), null);
    assert.equal(findBlankSpan("Teelöffel sind praktisch.", "Tee"), null);
  });

  it("blanks the first occurrence when the term appears more than once", () => {
    assert.deepEqual(findBlankSpan("Der Tisch neben dem Tisch ist leer.", "Tisch"), {
      before: "Der ",
      answer: "Tisch",
      after: " neben dem Tisch ist leer.",
    });
  });

  it("returns null for an empty term", () => {
    assert.equal(findBlankSpan("Ich trinke gern Tee.", ""), null);
  });

  it("returns null when nothing matches at all", () => {
    assert.equal(findBlankSpan("Ich trinke gern Tee.", "Kaffee"), null);
  });
});

describe("clozeBlankForCard", () => {
  const base: Card = {
    id: "tee",
    term: "Tee",
    definition: "tea",
    starred: false,
    imageUrl: null,
  };

  it("is null when the card has no example", () => {
    assert.equal(clozeBlankForCard({ ...base, example: null }), null);
    assert.equal(clozeBlankForCard({ ...base }), null);
  });

  it("is null when the example doesn't contain the term", () => {
    assert.equal(clozeBlankForCard({ ...base, example: "Kaffee ist auch gut." }), null);
  });

  it("blanks the term out of the card's own example", () => {
    assert.deepEqual(clozeBlankForCard({ ...base, example: "Ich trinke gern Tee." }), {
      before: "Ich trinke gern ",
      answer: "Tee",
      after: ".",
    });
  });
});

// ── Case-aware blank (examples.akk / examples.dat) ─────────────────────────


const vater = (examples: Card["examples"], example: string | null = null): Card => ({
  id: "vater",
  term: "Vater",
  definition: "father",
  starred: false,
  imageUrl: null,
  example,
  examples,
  enrichment: { gender: "m", source: "user" },
});

describe("case-aware blank", () => {
  it("akk example: the blank covers article + noun; wrong article fails", () => {
    const blank = clozeBlankForCard(vater({ akk: "Ich besuche den Vater." }));
    assert.equal(blank?.answer, "den Vater");
    assert.equal(blank?.caseBlank, "akkusativ");
    assert.equal(blank?.before, "Ich besuche ");
    assert.ok(caseBlankMatches("den Vater", "den Vater"));
    assert.ok(caseBlankMatches("  Den   vater ", "den Vater"));
    assert.ok(!caseBlankMatches("der Vater", "den Vater"));
    assert.ok(!caseBlankMatches("Vater", "den Vater"));
  });

  it("case-aware grading keeps umlauts exact", () => {
    assert.ok(!caseBlankMatches("dem Baum", "dem Bäum"));
    assert.ok(caseBlankMatches("den Bäume", "Den bäume"));
  });

  it("both akk and dat usable: picks either, never sticks to akk", () => {
    const card = vater({ akk: "Ich sehe den Vater.", dat: "Ich helfe dem Vater." });
    assert.equal(clozeBlankForCard(card, () => 0)?.caseBlank, "akkusativ");
    assert.equal(clozeBlankForCard(card, () => 0.99)?.caseBlank, "dativ");
  });

  it("nom example is never a case blank; missing examples fall back unchanged", () => {
    const nomOnly = vater({ nom: "Der Vater ist alt." }, "Der Vater ist alt.");
    const blank = clozeBlankForCard(nomOnly);
    assert.equal(blank?.answer, "Vater");
    assert.equal(blank?.caseBlank, undefined);
    assert.equal(clozeBlankForCard(vater(null, "Mein Vater kocht."))?.answer, "Vater");
  });

  it("no gender (verbs etc.) never takes the case path", () => {
    const verb: Card = { ...vater({ akk: "Ich sehe den Vater." }), enrichment: null };
    assert.equal(clozeBlankForCard(verb)?.caseBlank, undefined);
  });

  it("case sentence without exact article+noun adjacency falls back", () => {
    const card = vater({ akk: "Ich besuche den alten Vater." }, "Mein Vater kocht.");
    const blank = clozeBlankForCard(card);
    assert.equal(blank?.answer, "Vater");
    assert.equal(blank?.caseBlank, undefined);
  });
});
