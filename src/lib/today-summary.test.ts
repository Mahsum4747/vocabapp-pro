import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyReviewToSummary,
  buildTodaySummary,
  describeToday,
  isSummaryFresh,
  newLeftToday,
  utcDayKey,
  type TodaySummary,
} from "./today-summary.ts";
import type { Card, CardProgress, StudySet } from "./types.ts";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 8, 21, 9, 0, 0);

const card = (id: string): Card => ({
  id,
  term: id,
  definition: id,
  starred: false,
  imageUrl: null,
});
const set = (id: string, ids: string[]): StudySet =>
  ({ id, title: id, cards: ids.map(card), ownerId: "u", isPublic: false }) as unknown as StudySet;

const progress = (cardId: string, over: Partial<CardProgress> = {}): CardProgress =>
  ({
    userId: "u",
    cardId,
    setId: "s",
    state: "review",
    dueAt: NOW + DAY,
    lapses: 0,
    totalReviews: 3,
    correctReviews: 3,
    consecutiveCorrect: 3,
    lastReviewedAt: NOW - 3 * DAY,
    lastReviewedDate: null,
    masteryScore: 80,
    scheduler: "fsrs",
    ...over,
  }) as unknown as CardProgress;

const summary = (over: Partial<TodaySummary> = {}): TodaySummary => ({
  due: 0,
  new: 0,
  weak: 0,
  studiedToday: 0,
  dayKey: utcDayKey(NOW),
  nextDueAt: null,
  builtAt: NOW,
  ...over,
});

describe("isSummaryFresh", () => {
  it("trusts a same-day summary with no or a future nextDueAt", () => {
    assert.equal(isSummaryFresh(summary(), NOW), true);
    assert.equal(isSummaryFresh(summary({ nextDueAt: NOW + 1 }), NOW), true);
  });
  it("rejects a missing summary, a rolled day, and a passed nextDueAt", () => {
    assert.equal(isSummaryFresh(null, NOW), false);
    assert.equal(isSummaryFresh(summary(), NOW + DAY), false);
    assert.equal(isSummaryFresh(summary({ nextDueAt: NOW }), NOW), false);
  });
});

describe("overnight due (the bug this phase exists to kill)", () => {
  it("a card that goes due overnight shows up after a rebuild with no review in between", () => {
    const sets = [set("s", ["a", "b"])];
    const prog = { a: progress("a", { dueAt: NOW + 6 * 60 * 60 * 1000 }), b: progress("b") };
    const evening = buildTodaySummary(sets, prog, NOW);
    assert.equal(evening.due, 0);
    assert.equal(evening.nextDueAt, NOW + 6 * 60 * 60 * 1000);

    const morning = NOW + DAY;
    assert.equal(isSummaryFresh(evening, morning), false);
    const rebuilt = buildTodaySummary(sets, prog, morning);
    assert.equal(rebuilt.due, 2);
    assert.equal(rebuilt.studiedToday, 0);
  });
});

describe("describeToday", () => {
  it("49 unstudied cards is never 'finished'", () => {
    const ids = Array.from({ length: 49 }, (_, i) => `c${i}`);
    const s = buildTodaySummary([set("s", ids)], {}, NOW);
    assert.equal(s.new, 49);
    const q = describeToday(s, 10, NOW);
    assert.equal(q.kind, "items");
    assert.equal(q.line, "0 due · 10 new left for today's goal.");
  });
  it("goal met with cards left: empty copy, no 'caught up'", () => {
    const q = describeToday(summary({ new: 49, studiedToday: 10 }), 10, NOW);
    assert.equal(q.kind, "empty");
    assert.equal(q.line, "Nothing due. You can still open a set.");
    assert.ok(!/caught up/i.test(q.line));
  });
  it("surfaces nextDueAt on the empty state only when present", () => {
    const withNext = describeToday(summary({ nextDueAt: NOW + 2 * DAY }), 10, NOW);
    assert.equal(withNext.kind, "empty");
    if (withNext.kind === "empty") assert.match(withNext.nextLine ?? "", /^Next review: /);
    const none = describeToday(summary(), 10, NOW);
    if (none.kind === "empty") assert.equal(none.nextLine, null);
  });
  it("caps new cards by goal minus studied, and by supply", () => {
    assert.equal(newLeftToday(summary({ new: 49, studiedToday: 4 }), 10), 6);
    assert.equal(newLeftToday(summary({ new: 3, studiedToday: 0 }), 10), 3);
    assert.equal(newLeftToday(summary({ new: 9, studiedToday: 15 }), 10), 0);
  });
});

describe("applyReviewToSummary", () => {
  it("moves a first-ever review from new to scheduled and counts it studied", () => {
    const base = summary({ new: 5, studiedToday: 0 });
    const next = progress("a", { dueAt: NOW + DAY, lastReviewedAt: NOW, totalReviews: 1 });
    const out = applyReviewToSummary(base, { previous: null, next, now: NOW });
    assert.ok(out);
    assert.equal(out.new, 4);
    assert.equal(out.studiedToday, 1);
    assert.equal(out.nextDueAt, NOW + DAY);
  });
  it("moves a due card out of due, and does not re-count a card already studied today", () => {
    const base = summary({ due: 3, studiedToday: 2 });
    const previous = progress("a", { dueAt: NOW - 1000, lastReviewedAt: NOW - 1000 });
    const next = progress("a", { dueAt: NOW + 3 * DAY, lastReviewedAt: NOW });
    const out = applyReviewToSummary(base, { previous, next, now: NOW });
    assert.ok(out);
    assert.equal(out.due, 2);
    assert.equal(out.studiedToday, 2);
  });
  it("declines to patch a stale summary so the next read rebuilds it", () => {
    const next = progress("a");
    assert.equal(applyReviewToSummary(summary({ dayKey: "2026-09-20" }), { previous: null, next, now: NOW }), null);
    assert.equal(applyReviewToSummary(summary({ nextDueAt: NOW - 1 }), { previous: null, next, now: NOW }), null);
    assert.equal(applyReviewToSummary(null, { previous: null, next, now: NOW }), null);
  });
});
