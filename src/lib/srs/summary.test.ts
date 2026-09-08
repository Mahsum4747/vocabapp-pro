import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasReviewWork, reviewSummary, summarizeLibrary } from "./queue.ts";
import type { Card, CardProgress, StudySet } from "../types.ts";

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
    masteryScore: 50,
    scheduler: "fsrs",
    ...overrides,
  };
}

describe("due counts", () => {
  it("counts cards whose due date has passed", () => {
    const cards = [card("a"), card("b"), card("c")];
    const map = {
      a: progress("a", { dueAt: NOW - 1000 }),
      b: progress("b", { dueAt: NOW - 3 * DAY_MS }),
      c: progress("c", { dueAt: NOW + 5 * DAY_MS }),
    };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 2);
    assert.equal(summary.notDue, 1);
  });

  it("treats a card due exactly now as due", () => {
    const summary = reviewSummary([card("a")], { a: progress("a", { dueAt: NOW }) }, { now: NOW });
    assert.equal(summary.due, 1);
  });

  it("counts overdue as a subset of due, not in addition to it", () => {
    const cards = [card("a"), card("b")];
    const map = {
      a: progress("a", { dueAt: NOW - 30 * DAY_MS }), // overdue
      b: progress("b", { dueAt: NOW - 60 * 1000 }), // due, not yet overdue
    };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 2, "both are due");
    assert.equal(summary.overdue, 1, "only one is overdue");
    assert.ok(summary.overdue <= summary.due, "overdue must never exceed due");
  });

  it("does not count a card due a few hours ago as overdue", () => {
    const summary = reviewSummary(
      [card("a")],
      { a: progress("a", { dueAt: NOW - 3 * 60 * 60 * 1000 }) },
      { now: NOW },
    );
    assert.equal(summary.due, 1);
    assert.equal(summary.overdue, 0);
  });
});

describe("new vs due", () => {
  it("keeps never-studied cards out of the due count", () => {
    const cards = [card("seen"), card("unseen1"), card("unseen2")];
    const map = { seen: progress("seen", { dueAt: NOW - DAY_MS * 2 }) };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 1, "only the studied, past-due card is due");
    assert.equal(summary.fresh, 2, "never-studied cards are counted separately");
  });

  it("counts a card with a NEW state row as new, not due", () => {
    const summary = reviewSummary(
      [card("a")],
      { a: progress("a", { state: "new", dueAt: null, totalReviews: 0 }) },
      { now: NOW },
    );
    assert.equal(summary.fresh, 1);
    assert.equal(summary.due, 0);
  });

  it("counts a set that has never been studied as all new", () => {
    const cards = [card("a"), card("b"), card("c")];
    const summary = reviewSummary(cards, {}, { now: NOW });

    assert.equal(summary.fresh, 3);
    assert.equal(summary.due, 0);
    assert.equal(summary.overdue, 0);
    assert.equal(summary.total, 3);
  });
});

describe("nothing due", () => {
  it("reports zero when every card is comfortably scheduled ahead", () => {
    const cards = [card("a"), card("b")];
    const map = {
      a: progress("a", { dueAt: NOW + 5 * DAY_MS }),
      b: progress("b", { dueAt: NOW + 30 * DAY_MS }),
    };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 0);
    assert.equal(summary.overdue, 0);
    assert.equal(summary.fresh, 0);
    assert.equal(summary.notDue, 2);
    assert.equal(hasReviewWork(summary), false, "nothing to start a session for");
  });

  it("reports an empty set as having no work", () => {
    const summary = reviewSummary([], {}, { now: NOW });
    assert.equal(summary.total, 0);
    assert.equal(hasReviewWork(summary), false);
  });

  it("still flags work when only new cards remain", () => {
    const summary = reviewSummary([card("a")], {}, { now: NOW });
    assert.equal(summary.due, 0);
    assert.equal(hasReviewWork(summary), true);
  });
});

describe("counts match what a session serves", () => {
  it("excludes excluded and archived cards from every count", () => {
    const cards = [
      card("a"),
      card("skip", { status: "excluded" }),
      card("gone", { status: "archived" }),
    ];
    const map = {
      a: progress("a", { dueAt: NOW - DAY_MS * 2 }),
      skip: progress("skip", { dueAt: NOW - DAY_MS * 2 }),
      gone: progress("gone", { dueAt: NOW - DAY_MS * 2 }),
    };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 1, "only the active card counts");
    assert.equal(summary.total, 1);
  });

  it("accounts for every active card in exactly one band", () => {
    const cards = [card("overdue"), card("due"), card("weak"), card("new"), card("later")];
    const map = {
      overdue: progress("overdue", { dueAt: NOW - 20 * DAY_MS }),
      due: progress("due", { dueAt: NOW - 1000 }),
      weak: progress("weak", { dueAt: NOW + 4 * DAY_MS, consecutiveCorrect: 0, totalReviews: 5 }),
      later: progress("later", { dueAt: NOW + 40 * DAY_MS }),
    };

    const s = reviewSummary(cards, map, { now: NOW });
    assert.equal(s.due + s.fresh + s.weak + s.notDue, s.total, "bands must partition the set");
    assert.equal(s.total, 5);
  });
});

describe("user and set scoping", () => {
  it("counts only against the progress map it is given", () => {
    const cards = [card("a"), card("b")];
    const mine = { a: progress("a", { dueAt: NOW - DAY_MS * 2 }) };

    // Another user has no rows for these cards at all.
    assert.equal(reviewSummary(cards, mine, { now: NOW }).due, 1);
    assert.equal(reviewSummary(cards, {}, { now: NOW }).due, 0);
    assert.equal(reviewSummary(cards, {}, { now: NOW }).fresh, 2);
  });

  it("ignores progress rows for cards that are not in the set", () => {
    const cards = [card("a")];
    const map = {
      a: progress("a", { dueAt: NOW + 10 * DAY_MS }),
      "other-set-card": progress("other-set-card", { setId: "s2", dueAt: NOW - 9 * DAY_MS }),
    };

    const summary = reviewSummary(cards, map, { now: NOW });
    assert.equal(summary.due, 0, "another set's overdue card must not leak in");
    assert.equal(summary.total, 1);
  });
});

describe("library review entry point", () => {
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

  const overdueRow = (id: string) => progress(id, { dueAt: NOW - 20 * DAY_MS });
  const dueRow = (id: string) => progress(id, { dueAt: NOW - 1000 });

  it("adds up counts across sets", () => {
    const sets = [set("s1", [card("a"), card("b")]), set("s2", [card("c"), card("d")])];
    const map = { a: dueRow("a"), c: overdueRow("c") };

    const { totals } = summarizeLibrary(sets, map, { now: NOW });
    assert.equal(totals.due, 2);
    assert.equal(totals.overdue, 1);
    assert.equal(totals.fresh, 2);
    assert.equal(totals.total, 4);
  });

  it("opens the set with the most overdue cards", () => {
    const sets = [set("few", [card("a"), card("b")]), set("many", [card("c"), card("d")])];
    const map = { a: overdueRow("a"), c: overdueRow("c"), d: overdueRow("d") };

    assert.equal(summarizeLibrary(sets, map, { now: NOW }).target?.set.id, "many");
  });

  it("falls back to the most due, then the most new", () => {
    const dueSets = [set("a", [card("a1"), card("a2")]), set("b", [card("b1"), card("b2")])];
    const dueMap = { a1: dueRow("a1"), b1: dueRow("b1"), b2: dueRow("b2") };
    assert.equal(summarizeLibrary(dueSets, dueMap, { now: NOW }).target?.set.id, "b");

    const newSets = [
      set("small", [card("s1"), card("s2")]),
      set("big", [card("g1"), card("g2"), card("g3")]),
    ];
    assert.equal(summarizeLibrary(newSets, {}, { now: NOW }).target?.set.id, "big");
  });

  it("offers no entry point when nothing is waiting", () => {
    const sets = [set("s1", [card("a"), card("b")])];
    const map = {
      a: progress("a", { dueAt: NOW + 9 * DAY_MS }),
      b: progress("b", { dueAt: NOW + 20 * DAY_MS }),
    };

    const result = summarizeLibrary(sets, map, { now: NOW });
    assert.equal(result.target, undefined);
    assert.equal(result.totals.due, 0);
  });

  it("skips reference sets and sets too small to study", () => {
    const sets = [
      set("reference", [card("r1"), card("r2")], { isReference: true }),
      set("tiny", [card("t1")]),
    ];

    const result = summarizeLibrary(sets, {}, { now: NOW });
    assert.equal(result.target, undefined, "neither is studiable");
    assert.equal(result.totals.total, 0);
  });

  it("handles an empty library", () => {
    const result = summarizeLibrary([], {}, { now: NOW });
    assert.equal(result.target, undefined);
    assert.equal(result.totals.total, 0);
  });
});
