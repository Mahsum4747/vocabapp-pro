import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { planReview } from "./review-plan.ts";
import { defaultScheduler } from "./srs/index.ts";
import type { CardProgress } from "./types.ts";

const NOW = Date.UTC(2026, 1, 3, 9, 30, 0);

function plan(overrides: Partial<Parameters<typeof planReview>[0]> = {}) {
  return planReview({
    userId: "u1",
    cardId: "c1",
    setId: "s1",
    eventId: "e1",
    rating: "good",
    date: "2026-02-03",
    previous: null,
    now: NOW,
    scheduler: defaultScheduler,
    ...overrides,
  });
}

function priorProgress(overrides: Partial<CardProgress> = {}): CardProgress {
  return {
    ...defaultScheduler.next({ previous: null, rating: "good", now: NOW - 86_400_000 }),
    userId: "u1",
    cardId: "c1",
    setId: "s1",
    totalReviews: 4,
    correctReviews: 3,
    consecutiveCorrect: 2,
    lastReviewedAt: NOW - 86_400_000,
    masteryScore: 20,
    scheduler: defaultScheduler.name,
    ...overrides,
  };
}

describe("review events", () => {
  it("records the rating, the ids and the server clock", () => {
    const { event } = plan({ rating: "hard" });

    assert.equal(event.id, "e1");
    assert.equal(event.userId, "u1");
    assert.equal(event.cardId, "c1");
    assert.equal(event.setId, "s1");
    assert.equal(event.rating, "hard");
    assert.equal(event.reviewedAt, NOW);
  });

  it("keeps response time when the mode measured it, and omits it otherwise", () => {
    assert.equal(plan({ responseTimeMs: 4200 }).event.responseTimeMs, 4200);
    assert.equal("responseTimeMs" in plan().event, false);
  });

  it("produces a new event per review rather than amending the last one", () => {
    const first = plan({ eventId: "e1" }).event;
    const second = plan({ eventId: "e2", previous: priorProgress() }).event;

    assert.notEqual(first.id, second.id);
    // Nothing in the plan points at an existing event to modify.
    assert.deepEqual(Object.keys(second).includes("updatedAt"), false);
  });
});

describe("progress counters", () => {
  it("counts a first correct review", () => {
    const { progress } = plan({ rating: "good" });

    assert.equal(progress.totalReviews, 1);
    assert.equal(progress.correctReviews, 1);
    assert.equal(progress.consecutiveCorrect, 1);
    assert.equal(progress.lastReviewedAt, NOW);
  });

  it("advances counters from the stored row", () => {
    const { progress } = plan({ previous: priorProgress(), rating: "good" });

    assert.equal(progress.totalReviews, 5);
    assert.equal(progress.correctReviews, 4);
    assert.equal(progress.consecutiveCorrect, 3);
  });

  it("breaks the correct streak on 'again' without losing the totals", () => {
    const { progress } = plan({ previous: priorProgress(), rating: "again" });

    assert.equal(progress.totalReviews, 5);
    assert.equal(progress.correctReviews, 3, "a wrong answer adds no correct review");
    assert.equal(progress.consecutiveCorrect, 0, "the streak resets, it does not decrement");
  });

  it("counts hard and easy as correct", () => {
    for (const rating of ["hard", "good", "easy"] as const) {
      assert.equal(plan({ rating }).progress.correctReviews, 1, `${rating} is correct`);
    }
    assert.equal(plan({ rating: "again" }).progress.correctReviews, 0);
  });

  it("stamps the scheduler that produced the state", () => {
    assert.equal(plan().progress.scheduler, defaultScheduler.name);
  });

  it("carries a mastery score derived from the new scheduler state", () => {
    const { progress } = plan({ rating: "easy" });
    assert.ok(progress.masteryScore > 0 && progress.masteryScore <= 100);
    assert.ok(progress.dueAt !== null && progress.dueAt > NOW);
  });

  it("stays scoped to the user it was recorded for", () => {
    const { progress, event } = plan({ userId: "someone-else" });
    assert.equal(progress.userId, "someone-else");
    assert.equal(event.userId, "someone-else");
  });
});

describe("daily stats", () => {
  it("adds one review to the given local day", () => {
    const { daily } = plan({ date: "2026-02-03" });

    assert.equal(daily.date, "2026-02-03");
    assert.equal(daily.reviews, 1);
    assert.equal(daily.correctReviews, 1);
  });

  it("counts a wrong answer as a review but not a correct one", () => {
    const { daily } = plan({ rating: "again" });

    assert.equal(daily.reviews, 1);
    assert.equal(daily.correctReviews, 0);
  });

  it("accumulates study time in whole seconds", () => {
    assert.equal(plan({ responseTimeMs: 8400 }).daily.studySeconds, 8);
    assert.equal(plan({ responseTimeMs: 400 }).daily.studySeconds, 0);
    assert.equal(plan().daily.studySeconds, 0);
  });

  it("carries only date-based fields", () => {
    // Guards against reintroducing wordsReviewedToday / lastActiveDate /
    // uniqueWords / mastered, which are not date-scoped counters.
    assert.deepEqual(Object.keys(plan().daily).sort(), [
      "correctReviews",
      "date",
      "reviews",
      "studySeconds",
    ]);
  });
});
