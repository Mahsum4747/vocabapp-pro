import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { freshCardCopy, isCardActive, type Card } from "./types.ts";

/** A card carrying every bit of the original owner's progress and curation. */
function usedCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "source-card-1",
    term: "zurückgeben",
    definition: "to give back",
    example: "Gib mir das Buch zurück!",
    imageUrl: null,
    starred: true,
    mastery: 5,
    status: "excluded",
    ...overrides,
  };
}

describe("freshCardCopy", () => {
  it("resets the original owner's progress", () => {
    const copy = freshCardCopy(usedCard(), "new-id");

    assert.equal(copy.mastery, 0);
    assert.equal(copy.starred, false);
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

    assert.equal(source.mastery, 5);
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
      usedCard({ id: "a", term: "eins", mastery: 3, starred: true, status: "archived" }),
      usedCard({ id: "b", term: "zwei", mastery: 5, starred: false, status: "excluded" }),
      usedCard({ id: "c", term: "drei", mastery: 1, starred: true, status: undefined }),
    ];

    let counter = 0;
    const copied = source.map((card) => freshCardCopy(card, `copy-${counter++}`));

    for (const card of copied) {
      assert.equal(card.mastery, 0);
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
