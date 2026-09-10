import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { freshCardCopy, isCardActive, type Card } from "./types.ts";

/** A card carrying every bit of the original owner's curation. */
function usedCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "source-card-1",
    term: "zurückgeben",
    definition: "to give back",
    example: "Gib mir das Buch zurück!",
    imageUrl: null,
    starred: true,
    status: "excluded",
    ...overrides,
  };
}

describe("freshCardCopy", () => {
  it("resets the original owner's curation", () => {
    const copy = freshCardCopy(usedCard(), "new-id");

    assert.equal(copy.starred, false);
  });

  it("carries no learning state at all", () => {
    // Progress is user-scoped and lives in CardProgress, so a copied card has
    // nothing to reset — there is no per-user field on the card to inherit.
    const copy = freshCardCopy(usedCard(), "new-id") as Record<string, unknown>;

    assert.equal("mastery" in copy, false);
    assert.equal("masteryScore" in copy, false);
    assert.equal("stability" in copy, false);
    assert.equal("dueAt" in copy, false);
  });

  it("resets status to active, whatever the source was", () => {
    for (const status of ["excluded", "archived", "active", undefined] as const) {
      const copy = freshCardCopy(usedCard({ status }), "new-id");
      assert.ok(isCardActive(copy), `a copy of a ${status ?? "status-less"} card should be active`);
      assert.notEqual(copy.status, "excluded");
      assert.notEqual(copy.status, "archived");
    }
  });

  it("keeps the content", () => {
    const source = usedCard({ imageUrl: "https://example.test/pic.png" });
    const copy = freshCardCopy(source, "new-id");

    assert.equal(copy.term, source.term);
    assert.equal(copy.definition, source.definition);
    assert.equal(copy.example, source.example);
    assert.equal(copy.imageUrl, source.imageUrl);
  });

  it("takes the id it is given rather than the source's", () => {
    const source = usedCard();
    const copy = freshCardCopy(source, "generated-id");

    assert.equal(copy.id, "generated-id");
    assert.notEqual(copy.id, source.id);
  });

  it("normalizes a missing example to null", () => {
    const copy = freshCardCopy(usedCard({ example: undefined }), "new-id");
    assert.equal(copy.example, null);
  });

  it("leaves the source untouched", () => {
    const source = usedCard();
    freshCardCopy(source, "new-id");

    assert.equal(source.starred, true);
    assert.equal(source.status, "excluded");
  });
});

describe("copying a whole set", () => {
  // What copyPublicSet does: map every card through freshCardCopy with a
  // fresh id. Regression guard for copies that used to inherit the original
  // owner's mastery, stars and excluded/archived flags.
  it("gives every card a clean slate and a unique id", () => {
    const source: Card[] = [
      usedCard({ id: "a", term: "eins", starred: true, status: "archived" }),
      usedCard({ id: "b", term: "zwei", starred: false, status: "excluded" }),
      usedCard({ id: "c", term: "drei", starred: true, status: undefined }),
    ];

    let counter = 0;
    const copied = source.map((card) => freshCardCopy(card, `copy-${counter++}`));

    for (const card of copied) {
      assert.equal(card.starred, false);
      assert.ok(isCardActive(card));
    }
    assert.deepEqual(
      copied.map((c) => c.term),
      ["eins", "zwei", "drei"],
    );
    const ids = new Set(copied.map((c) => c.id));
    assert.equal(ids.size, source.length, "every copied card needs its own id");
    for (const card of copied) {
      assert.ok(!source.some((s) => s.id === card.id), "copied ids must not reuse source ids");
    }
  });
});

describe("freshCardCopy — enrichment", () => {
  it("carries enrichment over, unlike starred/status", () => {
    const source = usedCard({
      enrichment: { gender: "n", plural: "Häuser", source: "dict" },
    });
    const copy = freshCardCopy(source, "new-id");

    assert.deepEqual(copy.enrichment, { gender: "n", plural: "Häuser", source: "dict" });
  });

  it("carries an inferred (compound-guess) enrichment over as-is", () => {
    const source = usedCard({
      enrichment: { gender: "f", plural: "Haustüren", source: "dict", inferred: true },
    });
    const copy = freshCardCopy(source, "new-id");

    assert.equal(copy.enrichment?.inferred, true);
  });

  it("carries a user's own correction over, still attributed to them", () => {
    const source = usedCard({ enrichment: { gender: "m", source: "user" } });
    const copy = freshCardCopy(source, "new-id");

    assert.equal(copy.enrichment?.source, "user");
  });

  it("normalizes a missing enrichment to null, like example/definition2", () => {
    const source = usedCard();
    delete (source as { enrichment?: unknown }).enrichment;
    const copy = freshCardCopy(source, "new-id");

    assert.equal(copy.enrichment, null);
  });

  it("never folds gender into the term string itself", () => {
    // The regression this guards: term identity in replaceCards is keyed on
    // term.trim().toLowerCase(), and a card's id (which FSRS/cardProgress
    // key off) is only kept when that match succeeds. An article prefix
    // here would silently orphan review history on the next edit-page save.
    const source = usedCard({
      term: "Haus",
      enrichment: { gender: "n", plural: "Häuser", source: "dict" },
    });
    const copy = freshCardCopy(source, "new-id");

    assert.equal(copy.term, "Haus");
    assert.doesNotMatch(copy.term, /^(der|die|das)\s/i);
  });
});
