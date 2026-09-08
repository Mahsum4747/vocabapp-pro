import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { leitnerBoxCounts, leitnerBoxOf, masteryPercent, type ProgressMap } from "./quiz.ts";
import { freshCardCopy, initialProgress, isCorrectRating, type Card } from "./types.ts";
import { defaultScheduler } from "./srs/index.ts";

function card(id: string, overrides: Partial<Card> = {}): Card {
  return {
    id,
    term: `term-${id}`,
    definition: `definition-${id}`,
    starred: false,
    imageUrl: null,
    ...overrides,
  };
}

function progressFor(cardId: string, masteryScore: number, userId = "u1"): ProgressMap[string] {
  return {
    ...initialProgress(userId, cardId, "s1", defaultScheduler.initial(), defaultScheduler.name),
    masteryScore,
  };
}

describe("progress is user-scoped", () => {
  it("reads mastery from the viewer's own progress, not from the card", () => {
    const cards = [card("a"), card("b")];
    const mine: ProgressMap = { a: progressFor("a", 100), b: progressFor("b", 50) };
    const theirs: ProgressMap = { a: progressFor("a", 0, "u2"), b: progressFor("b", 0, "u2") };

    assert.equal(masteryPercent(cards, mine), 75);
    // Same cards, different user's progress map — the cards themselves carry
    // nothing that could leak one user's mastery into another's view.
    assert.equal(masteryPercent(cards, theirs), 0);
  });

  it("treats a card with no progress row as unstudied", () => {
    const cards = [card("a"), card("b")];
    assert.equal(masteryPercent(cards, {}), 0);
    assert.equal(leitnerBoxOf(cards[0], {}), 0);
  });

  it("excludes excluded and archived cards from the mastery average", () => {
    const cards = [
      card("a"),
      card("skipped", { status: "excluded" }),
      card("gone", { status: "archived" }),
    ];
    const progress: ProgressMap = {
      a: progressFor("a", 100),
      skipped: progressFor("skipped", 0),
      gone: progressFor("gone", 0),
    };

    assert.equal(masteryPercent(cards, progress), 100);
  });

  it("derives Leitner boxes from progress", () => {
    const cards = [card("a"), card("b"), card("c")];
    const progress: ProgressMap = {
      a: progressFor("a", 0),
      b: progressFor("b", 100),
      // "c" has no row at all.
    };

    const counts = leitnerBoxCounts(cards, progress);
    assert.equal(counts.length, 6);
    assert.equal(counts[0], 2, "unstudied and 0% both sit in box 0");
    assert.equal(counts[5], 1, "100% sits in the top box");
    assert.equal(
      counts.reduce((a, b) => a + b, 0),
      cards.length,
    );
  });

  it("keeps no learning state on the shared card model", () => {
    const shared = card("a") as Record<string, unknown>;
    for (const field of ["mastery", "masteryScore", "stability", "dueAt", "state", "lapses"]) {
      assert.equal(field in shared, false, `Card must not carry ${field}`);
    }
  });
});

describe("copied sets start with fresh progress", () => {
  it("gives a copy no progress to inherit", () => {
    const source = card("source-1", { starred: true, status: "excluded" });
    const copy = freshCardCopy(source, "copy-1");

    // Progress is keyed by card id under each user, and the copy has a new id,
    // so the copier starts with no row — nothing to reset on the card itself.
    const ownersProgress: ProgressMap = { "source-1": progressFor("source-1", 100) };

    assert.equal(masteryPercent([copy], ownersProgress), 0);
    assert.equal(leitnerBoxOf(copy, ownersProgress), 0);
    assert.notEqual(copy.id, source.id);
  });
});

describe("initial progress", () => {
  it("starts every counter at zero and the card as NEW", () => {
    const fresh = initialProgress("u1", "c1", "s1", defaultScheduler.initial(), "fsrs");

    assert.equal(fresh.state, "new");
    assert.equal(fresh.totalReviews, 0);
    assert.equal(fresh.correctReviews, 0);
    assert.equal(fresh.consecutiveCorrect, 0);
    assert.equal(fresh.masteryScore, 0);
    assert.equal(fresh.lastReviewedAt, null);
    assert.equal(fresh.dueAt, null);
    assert.equal(fresh.userId, "u1");
  });
});

describe("rating correctness", () => {
  it("counts only 'again' as a failure", () => {
    assert.equal(isCorrectRating("again"), false);
    assert.equal(isCorrectRating("hard"), true);
    assert.equal(isCorrectRating("good"), true);
    assert.equal(isCorrectRating("easy"), true);
  });
});
