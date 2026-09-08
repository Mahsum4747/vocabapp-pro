import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildLibrarySession } from "./review-session.ts";
import type { Card, CardProgress, StudySet } from "./types.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 2, 10, 9, 0, 0);

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

function set(id: string, cards: Card[], overrides: Partial<StudySet> = {}): StudySet {
  return {
    id,
    title: `Set ${id}`,
    description: "",
    subject: "Language",
    createdAt: 0,
    updatedAt: 0,
    lastStudiedAt: null,
    cards,
    ownerId: "u1",
    isPublic: false,
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
    dueAt: NOW + 10 * DAY_MS,
    reps: 3,
    lapses: 0,
    totalReviews: 3,
    correctReviews: 3,
    consecutiveCorrect: 3,
    lastReviewedAt: NOW - 10 * DAY_MS,
    lastReviewedDate: null,
    masteryScore: 50,
    scheduler: "fsrs",
    ...overrides,
  };
}

const overdueRow = (id: string) => progress(id, { dueAt: NOW - 20 * DAY_MS });
const dueRow = (id: string) => progress(id, { dueAt: NOW - 1000 });

describe("a review round drawn from the whole library", () => {
  it("mixes sets and orders by the queue's priority, not by set", () => {
    const sets = [
      set("a", [card("a1"), card("a2")]),
      set("b", [card("b1"), card("b2")]),
      set("c", [card("c1"), card("c2")]),
    ];
    const map = { a1: dueRow("a1"), b1: overdueRow("b1"), c1: dueRow("c1") };

    const { cards } = buildLibrarySession(sets, map, { now: NOW });
    const ids = cards.map((c) => c.card.id);

    assert.equal(ids[0], "b1", "the overdue card outranks due cards in other sets");
    // The three unstudied cards are new, which the queue puts behind due work.
    assert.deepEqual(ids.slice(0, 3).sort(), ["a1", "b1", "c1"]);
    assert.equal(cards.length, 6, "due, overdue and new cards from every set");
  });

  it("carries the source set with every card", () => {
    const sets = [set("a", [card("a1"), card("a2")]), set("b", [card("b1"), card("b2")])];
    const { cards } = buildLibrarySession(sets, { b1: dueRow("b1") }, { now: NOW });

    const first = cards[0];
    assert.equal(first.card.id, "b1");
    assert.equal(first.setId, "b", "grading has to know which set's card this is");
    assert.equal(first.setTitle, "Set b");
  });

  it("labels each card with the band the queue put it in", () => {
    const sets = [set("a", [card("over"), card("due"), card("new")])];
    const map = { over: overdueRow("over"), due: dueRow("due") };

    const bands = Object.fromEntries(
      buildLibrarySession(sets, map, { now: NOW }).cards.map((c) => [c.card.id, c.band]),
    );
    assert.deepEqual(bands, { over: "overdue", due: "due", new: "fresh" });
  });

  it("never serves a card that is not due yet", () => {
    const sets = [set("a", [card("soon"), card("later")])];
    const map = {
      soon: progress("soon", { dueAt: NOW + 60 * 1000 }),
      later: progress("later", { dueAt: NOW + 30 * DAY_MS }),
    };

    // Reviewing early would tell the scheduler the recall was easier than it
    // was, so an empty round is the correct answer here.
    assert.equal(buildLibrarySession(sets, map, { now: NOW }).cards.length, 0);
  });

  it("caps how many new cards one round introduces", () => {
    const many = Array.from({ length: 50 }, (_, i) => card(`n${i}`));
    const { cards } = buildLibrarySession([set("a", many)], {}, { now: NOW, newCardLimit: 20 });

    assert.equal(cards.length, 20);
  });

  it("skips reference sets and sets too small to study", () => {
    const sets = [
      set("ref", [card("r1"), card("r2")], { isReference: true }),
      set("tiny", [card("t1")]),
      set("real", [card("x1"), card("x2")]),
    ];
    const map = { r1: overdueRow("r1"), t1: overdueRow("t1"), x1: dueRow("x1") };

    const { cards } = buildLibrarySession(sets, map, { now: NOW });
    assert.deepEqual(
      cards.map((c) => c.setId),
      ["real", "real"],
      "only the studiable set contributes",
    );
  });

  it("leaves excluded and archived cards out", () => {
    const sets = [
      set("a", [
        card("keep"),
        card("skip", { status: "excluded" }),
        card("gone", { status: "archived" }),
      ]),
    ];
    const map = { keep: dueRow("keep"), skip: dueRow("skip"), gone: dueRow("gone") };

    const { cards } = buildLibrarySession(sets, map, { now: NOW });
    assert.deepEqual(
      cards.map((c) => c.card.id),
      ["keep"],
    );
  });
});

describe("the caught-up state", () => {
  it("reports the earliest future due date", () => {
    const sets = [set("a", [card("a1"), card("a2")]), set("b", [card("b1"), card("b2")])];
    const map = {
      a1: progress("a1", { dueAt: NOW + 5 * DAY_MS }),
      a2: progress("a2", { dueAt: NOW + 9 * DAY_MS }),
      b1: progress("b1", { dueAt: NOW + 2 * DAY_MS }),
      b2: progress("b2", { dueAt: NOW + 40 * DAY_MS }),
    };

    const session = buildLibrarySession(sets, map, { now: NOW });
    assert.equal(session.cards.length, 0, "nothing is due, so there is no round");
    assert.equal(session.nextDueAt, NOW + 2 * DAY_MS);
  });

  it("ignores past due dates when reporting what comes next", () => {
    const sets = [set("a", [card("a1"), card("a2")])];
    const map = { a1: overdueRow("a1"), a2: progress("a2", { dueAt: NOW + 3 * DAY_MS }) };

    assert.equal(buildLibrarySession(sets, map, { now: NOW }).nextDueAt, NOW + 3 * DAY_MS);
  });

  it("has no next due date when nothing has ever been scheduled", () => {
    const session = buildLibrarySession([set("a", [card("a1"), card("a2")])], {}, { now: NOW });

    assert.equal(session.nextDueAt, null);
    assert.equal(session.cards.length, 2, "but the new cards are still worth a round");
  });

  it("handles an empty library", () => {
    const session = buildLibrarySession([], {}, { now: NOW });
    assert.deepEqual(session.cards, []);
    assert.equal(session.nextDueAt, null);
  });
});
