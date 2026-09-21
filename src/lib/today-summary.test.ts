import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyCountDelta,
  applyReviewToSummary,
  buildTodaySummary,
  cardCounts,
  countedCardIds,
  needsFullRebuild,
  refreshClockFields,
  sumCounts,
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
  it("first-ever review: new-1, studied+1, next due tracked", () => {
    const base = summary({ new: 5, studiedToday: 0 });
    const next = progress("a", { dueAt: NOW + DAY, lastReviewedAt: NOW, totalReviews: 1 });
    const out = applyReviewToSummary(base, { previous: null, next, now: NOW });
    assert.ok(out);
    assert.equal(out.new, 4);
    assert.equal(out.studiedToday, 1);
    assert.equal(out.nextDueAt, NOW + DAY);
  });
  it("due card graded: due-1; a card already studied today is not re-counted", () => {
    const base = summary({ due: 3, studiedToday: 2 });
    const previous = progress("a", { dueAt: NOW - 1000, lastReviewedAt: NOW - 1000 });
    const next = progress("a", { dueAt: NOW + 3 * DAY, lastReviewedAt: NOW });
    const out = applyReviewToSummary(base, { previous, next, now: NOW });
    assert.ok(out);
    assert.equal(out.due, 2);
    assert.equal(out.studiedToday, 2);
  });
  it("weak counter follows the row across the threshold in both directions", () => {
    const strong = progress("a", { masteryScore: 90, consecutiveCorrect: 4 });
    const shaky = progress("a", { masteryScore: 30, consecutiveCorrect: 0, dueAt: NOW + 600000 });
    const down = applyReviewToSummary(summary({ weak: 0 }), { previous: strong, next: shaky, now: NOW });
    assert.equal(down?.weak, 1);
    const up = applyReviewToSummary(summary({ weak: 1 }), { previous: shaky, next: strong, now: NOW });
    assert.equal(up?.weak, 0);
  });
  it("a stale clock is marked for re-count, not nudged; new/weak/studied still move", () => {
    const next = progress("a", { lastReviewedAt: NOW });
    const out = applyReviewToSummary(summary({ new: 3, due: 9, nextDueAt: NOW - 1 }), {
      previous: null,
      next,
      now: NOW,
    });
    assert.ok(out);
    assert.equal(out.new, 2);
    assert.equal(out.due, 9);
    assert.equal(isSummaryFresh(out, NOW), false);
  });
  it("first review after the UTC day rolled resets studiedToday and forces a re-count", () => {
    const out = applyReviewToSummary(
      summary({ dayKey: "2026-09-20", studiedToday: 12, nextDueAt: null }),
      { previous: null, next: progress("a", { lastReviewedAt: NOW }), now: NOW },
    );
    assert.ok(out);
    assert.equal(out.studiedToday, 1);
    assert.equal(out.dayKey, utcDayKey(NOW));
    assert.equal(isSummaryFresh(out, NOW), false, "clock must still be re-counted");
  });
  it("no stored summary: nothing to patch", () => {
    assert.equal(applyReviewToSummary(null, { previous: null, next: progress("a"), now: NOW }), null);
  });
});

describe("card entering / leaving the pool", () => {
  const dueRow = progress("d", { dueAt: NOW - 1000 });
  const weakRow = progress("w", { masteryScore: 20, consecutiveCorrect: 0 });
  it("cardCounts: fresh, due and weak-at-rest are independent", () => {
    assert.deepEqual(cardCounts(undefined, NOW), { new: 1, due: 0, weak: 0 });
    assert.deepEqual(cardCounts(dueRow, NOW), { new: 0, due: 1, weak: 0 });
    assert.deepEqual(cardCounts(weakRow, NOW), { new: 0, due: 0, weak: 1 });
  });
  it("adding fresh cards raises new only", () => {
    const out = applyCountDelta(summary({ new: 4 }), { added: sumCounts([undefined, undefined], NOW), removed: sumCounts([], NOW) }, NOW);
    assert.equal(out?.new, 6);
  });
  it("removing a due + a weak + a fresh card lowers each counter it was in", () => {
    const out = applyCountDelta(
      summary({ new: 5, due: 4, weak: 2 }),
      { added: sumCounts([], NOW), removed: sumCounts([dueRow, weakRow, undefined], NOW) },
      NOW,
    );
    assert.deepEqual([out?.new, out?.due, out?.weak], [4, 3, 1]);
  });
  it("never goes below zero, and leaves `due` alone when the clock is stale", () => {
    const out = applyCountDelta(
      summary({ new: 0, due: 5, nextDueAt: NOW - 1 }),
      { added: sumCounts([], NOW), removed: sumCounts([undefined, dueRow], NOW) },
      NOW,
    );
    assert.equal(out?.new, 0);
    assert.equal(out?.due, 5);
  });
  it("countedCardIds: only active cards of studiable sets", () => {
    const s = set("s", ["a", "b", "c"]);
    s.cards[2] = { ...s.cards[2], status: "archived" };
    assert.deepEqual([...countedCardIds(s)].sort(), ["a", "b"]);
    assert.equal(countedCardIds(set("one", ["a"])).size, 0);
    assert.equal(countedCardIds({ ...s, isReference: true }).size, 0);
    assert.equal(countedCardIds(null).size, 0);
  });
});

describe("clock refresh and drift safety net", () => {
  it("re-counts due/nextDueAt, keeps new/weak, resets studiedToday only on a real roll", () => {
    const base = summary({ new: 7, weak: 2, studiedToday: 5, dayKey: "2026-09-20", nextDueAt: NOW - 1 });
    const out = refreshClockFields(base, { due: 3, nextDueAt: NOW + DAY }, NOW);
    assert.deepEqual([out.due, out.new, out.weak, out.studiedToday], [3, 7, 2, 0]);
    const sameDay = refreshClockFields(summary({ studiedToday: 5, nextDueAt: NOW - 1 }), { due: 1, nextDueAt: null }, NOW);
    assert.equal(sameDay.studiedToday, 5);
  });
  it("forces a full rebuild only with no summary or once it is over a week old", () => {
    assert.equal(needsFullRebuild(null, NOW), true);
    assert.equal(needsFullRebuild(summary({ builtAt: NOW - 6 * DAY }), NOW), false);
    assert.equal(needsFullRebuild(summary({ builtAt: NOW - 8 * DAY }), NOW), true);
  });
});
