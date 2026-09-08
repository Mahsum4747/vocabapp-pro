import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildReviewQueue, isWeakWord, queuedCards } from "./queue.ts";
import type { Card, CardProgress } from "../types.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);

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

function progress(cardId: string, overrides: Partial<CardProgress> = {}): CardProgress {
  return {
    userId: "u1",
    cardId,
    setId: "s1",
    state: "review",
    stability: 10,
    difficulty: 5,
    intervalDays: 10,
    dueAt: NOW + 5 * DAY_MS,
    reps: 3,
    lapses: 0,
    totalReviews: 3,
    correctReviews: 3,
    consecutiveCorrect: 3,
    lastReviewedAt: NOW - 5 * DAY_MS,
    lastReviewedDate: null,
    masteryScore: 50,
    scheduler: "fsrs",
    ...overrides,
  };
}

const ids = (cards: Card[]) => cards.map((c) => c.id);

describe("review queue ordering", () => {
  it("puts overdue before due, due before weak, weak before new", () => {
    const cards = [card("new"), card("weak"), card("due"), card("overdue")];
    const map = {
      overdue: progress("overdue", { dueAt: NOW - 10 * DAY_MS }),
      due: progress("due", { dueAt: NOW - 60 * 1000 }),
      weak: progress("weak", {
        dueAt: NOW + 3 * DAY_MS,
        consecutiveCorrect: 0,
        totalReviews: 4,
      }),
      // "new" has no progress row at all.
    };

    assert.deepEqual(ids(queuedCards(cards, map, { now: NOW })), ["overdue", "due", "weak", "new"]);
  });

  it("orders more overdue cards ahead of less overdue ones", () => {
    const cards = [card("a"), card("b"), card("c")];
    const map = {
      a: progress("a", { dueAt: NOW - 2 * DAY_MS }),
      b: progress("b", { dueAt: NOW - 30 * DAY_MS }),
      c: progress("c", { dueAt: NOW - 9 * DAY_MS }),
    };

    assert.deepEqual(ids(queuedCards(cards, map, { now: NOW })), ["b", "c", "a"]);
  });

  it("leaves comfortable, not-yet-due cards out entirely", () => {
    const cards = [card("later"), card("due")];
    const map = {
      later: progress("later", { dueAt: NOW + 20 * DAY_MS }),
      due: progress("due", { dueAt: NOW - 1000 }),
    };

    const queue = buildReviewQueue(cards, map, { now: NOW });
    assert.deepEqual(ids(queue.map((e) => e.card)), ["due"]);
  });

  it("falls back to everything rather than showing an empty round", () => {
    const cards = [card("later")];
    const map = { later: progress("later", { dueAt: NOW + 20 * DAY_MS }) };

    assert.deepEqual(ids(queuedCards(cards, map, { now: NOW })), ["later"]);
  });

  it("prioritises repeatedly forgotten cards within their band", () => {
    const cards = [card("steady"), card("lapsed")];
    const map = {
      steady: progress("steady", { dueAt: NOW - DAY_MS * 2 }),
      lapsed: progress("lapsed", { dueAt: NOW - DAY_MS * 2, lapses: 4 }),
    };

    assert.deepEqual(ids(queuedCards(cards, map, { now: NOW })), ["lapsed", "steady"]);
  });

  it("rate-limits how many new cards a session introduces", () => {
    const cards = [card("n1"), card("n2"), card("n3"), card("due")];
    const map = { due: progress("due", { dueAt: NOW - 1000 }) };

    const queue = queuedCards(cards, map, { now: NOW, newCardLimit: 2 });
    assert.deepEqual(ids(queue), ["due", "n1", "n2"]);
  });

  it("skips excluded and archived cards", () => {
    const cards = [
      card("active"),
      card("excluded", { status: "excluded" }),
      card("archived", { status: "archived" }),
    ];

    assert.deepEqual(ids(queuedCards(cards, {}, { now: NOW })), ["active"]);
  });

  it("respects the requested limit", () => {
    const cards = [card("a"), card("b"), card("c")];
    assert.equal(queuedCards(cards, {}, { now: NOW, limit: 2 }).length, 2);
  });

  it("is stable for equal-priority cards", () => {
    const cards = [card("a"), card("b"), card("c")];
    const first = ids(queuedCards(cards, {}, { now: NOW }));
    const second = ids(queuedCards(cards, {}, { now: NOW }));
    assert.deepEqual(first, second);
    assert.deepEqual(first, ["a", "b", "c"]);
  });

  it("consumes due dates without producing any of its own", () => {
    // The queue must never mutate scheduling state — it only reads dueAt.
    const map = { a: progress("a", { dueAt: NOW - DAY_MS }) };
    const snapshot = structuredClone(map);

    queuedCards([card("a")], map, { now: NOW });

    assert.deepEqual(map, snapshot, "queue must not touch scheduler state");
  });

  it("accepts a Map as well as a plain object", () => {
    const cards = [card("a"), card("b")];
    const map = new Map([["b", progress("b", { dueAt: NOW - 5 * DAY_MS })]]);

    assert.deepEqual(ids(queuedCards(cards, map, { now: NOW })), ["b", "a"]);
  });
});

describe("weak words", () => {
  // The helper's defaults are a healthy card: reviewed, answered right, not
  // due, mastery 50. Each test turns on only the signals it is about.
  const healthy = () =>
    progress("c", {
      masteryScore: 90,
      consecutiveCorrect: 3,
      totalReviews: 10,
      lapses: 0,
      dueAt: NOW + 5 * DAY_MS,
    });

  it("needs two signals, not one", () => {
    // Low mastery alone: a card in a set started yesterday looks exactly like
    // this, and it is not weak.
    assert.equal(isWeakWord({ ...healthy(), masteryScore: 20 }, { now: NOW }), false);

    // One wrong answer alone, on a card answered right nine times before.
    assert.equal(isWeakWord({ ...healthy(), consecutiveCorrect: 0 }, { now: NOW }), false);
  });

  it("flags a card with low mastery that was just answered wrong", () => {
    const card = { ...healthy(), masteryScore: 20, consecutiveCorrect: 0 };
    assert.equal(isWeakWord(card, { now: NOW }), true);
  });

  it("flags a card that keeps being forgotten and is now overdue", () => {
    const card = {
      ...healthy(),
      lapses: 5, // 5/10 reviews lapsed, well over the third
      dueAt: NOW - 3 * DAY_MS,
    };
    assert.equal(isWeakWord(card, { now: NOW }), true);
  });

  it("flags a low-mastery card sitting past its due date", () => {
    const card = { ...healthy(), masteryScore: 30, dueAt: NOW - DAY_MS };
    assert.equal(isWeakWord(card, { now: NOW }), true);
  });

  it("leaves a card that is merely due alone", () => {
    // Due is the queue's business. Weakness is about how the answers have
    // been going, and this card's have been going fine.
    assert.equal(isWeakWord({ ...healthy(), dueAt: NOW - 1000 }, { now: NOW }), false);
  });

  it("never calls a card weak before it has been reviewed", () => {
    const unseen = progress("c", {
      state: "new",
      dueAt: null,
      totalReviews: 0,
      correctReviews: 0,
      consecutiveCorrect: 0,
      masteryScore: 0,
      lastReviewedAt: null,
    });

    // Mastery 0 and no correct answers would otherwise be two signals — but
    // "not started" is not "struggling".
    assert.equal(isWeakWord(unseen, { now: NOW }), false);
    assert.equal(isWeakWord(undefined, { now: NOW }), false);
  });

  it("survives a row with broken numbers", () => {
    const broken = progress("c", {
      masteryScore: NaN,
      totalReviews: NaN,
      lapses: NaN,
    });
    assert.equal(isWeakWord(broken, { now: NOW }), false, "an unreadable row is not evidence");
  });

  it("counts a lapse rate over a third, but not one under it", () => {
    const overdue = { ...healthy(), dueAt: NOW - DAY_MS };
    assert.equal(isWeakWord({ ...overdue, lapses: 4, totalReviews: 10 }, { now: NOW }), true);
    assert.equal(isWeakWord({ ...overdue, lapses: 3, totalReviews: 10 }, { now: NOW }), false);
  });
});
