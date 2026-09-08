import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createFsrsScheduler } from "./fsrs.ts";
import { leitnerBoxOfScore, masteryScoreOf } from "./mastery.ts";
import type { SchedulerState } from "./scheduler.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 0, 1, 12, 0, 0);

const scheduler = createFsrsScheduler();

/** Review a card repeatedly with the same rating, each time exactly when due. */
function reviewOnSchedule(rating: "again" | "hard" | "good" | "easy", times: number) {
  let state: SchedulerState | null = null;
  let now = T0;
  for (let i = 0; i < times; i += 1) {
    state = scheduler.next({ previous: state, rating, now });
    now = state.dueAt ?? now;
  }
  return state!;
}

describe("scheduler state transitions", () => {
  it("starts a card as NEW with no due date", () => {
    const initial = scheduler.initial();
    assert.equal(initial.state, "new");
    assert.equal(initial.dueAt, null);
    assert.equal(initial.reps, 0);
    assert.equal(initial.stability, 0);
  });

  it("moves NEW → LEARNING on a first non-easy answer", () => {
    const state = scheduler.next({ previous: null, rating: "good", now: T0 });
    assert.equal(state.state, "learning");
    assert.equal(state.reps, 1);
    assert.ok(state.dueAt !== null && state.dueAt > T0, "gets a due date");
  });

  it("reaches REVIEW, then MASTERED, as intervals grow", () => {
    const states: string[] = [];
    let state: SchedulerState | null = null;
    let now = T0;
    for (let i = 0; i < 8; i += 1) {
      state = scheduler.next({ previous: state, rating: "good", now });
      states.push(state.state);
      now = state.dueAt ?? now;
    }
    assert.ok(states.includes("review"), `expected a REVIEW state, saw ${states.join(" → ")}`);
    assert.equal(states.at(-1), "mastered", `expected to end MASTERED, saw ${states.join(" → ")}`);
    // The pipeline must not skip backwards: once mastered, it stays mastered
    // under continued success.
    assert.equal(states.indexOf("mastered") > states.indexOf("review"), true);
  });

  it("drops a mastered card back to LEARNING on 'again', and counts a lapse", () => {
    const mastered = reviewOnSchedule("good", 8);
    assert.equal(mastered.state, "mastered");

    const lapsed = scheduler.next({
      previous: mastered,
      rating: "again",
      now: mastered.dueAt ?? T0,
    });
    assert.equal(lapsed.state, "learning");
    assert.equal(lapsed.lapses, mastered.lapses + 1);
    assert.ok(
      lapsed.intervalDays < mastered.intervalDays,
      "a forgotten card must come back sooner than it just did",
    );
  });

  it("orders intervals again < hard < good < easy on a first review", () => {
    const first = (rating: "again" | "hard" | "good" | "easy") =>
      scheduler.next({ previous: null, rating, now: T0 }).intervalDays;

    assert.ok(first("again") < first("hard"), "again < hard");
    assert.ok(first("hard") < first("good"), "hard < good");
    assert.ok(first("good") < first("easy"), "good < easy");
  });

  it("grows the interval on each successful review", () => {
    let state = scheduler.next({ previous: null, rating: "good", now: T0 });
    for (let i = 0; i < 4; i += 1) {
      const next = scheduler.next({
        previous: state,
        rating: "good",
        now: state.dueAt ?? T0,
      });
      assert.ok(
        next.intervalDays > state.intervalDays,
        `interval should grow: ${state.intervalDays} → ${next.intervalDays}`,
      );
      state = next;
    }
  });

  it("raises difficulty on hard answers and lowers it on easy ones", () => {
    const base = scheduler.next({ previous: null, rating: "good", now: T0 });
    const harder = scheduler.next({ previous: base, rating: "hard", now: base.dueAt ?? T0 });
    const easier = scheduler.next({ previous: base, rating: "easy", now: base.dueAt ?? T0 });

    assert.ok(harder.difficulty > base.difficulty, "hard raises difficulty");
    assert.ok(easier.difficulty < base.difficulty, "easy lowers difficulty");
  });

  it("keeps difficulty inside 1..10 under repeated extremes", () => {
    const hardest = reviewOnSchedule("hard", 25);
    const easiest = reviewOnSchedule("easy", 25);
    for (const state of [hardest, easiest]) {
      assert.ok(state.difficulty >= 1 && state.difficulty <= 10, `difficulty ${state.difficulty}`);
    }
  });

  it("caps the interval at the configured maximum", () => {
    const capped = createFsrsScheduler({ maximumIntervalDays: 30 });
    let state = capped.next({ previous: null, rating: "easy", now: T0 });
    for (let i = 0; i < 20; i += 1) {
      state = capped.next({ previous: state, rating: "easy", now: state.dueAt ?? T0 });
    }
    assert.ok(state.intervalDays <= 30, `interval ${state.intervalDays} should be capped at 30`);
  });

  it("is deterministic — same input, same output", () => {
    const a = scheduler.next({ previous: null, rating: "good", now: T0 });
    const b = scheduler.next({ previous: null, rating: "good", now: T0 });
    assert.deepEqual(a, b);
  });

  it("is swappable: weights change the schedule, not the shape", () => {
    const patient = createFsrsScheduler({ requestRetention: 0.7 });
    const strict = createFsrsScheduler({ requestRetention: 0.97 });

    const patientFirst = patient.next({ previous: null, rating: "good", now: T0 });
    const strictFirst = strict.next({ previous: null, rating: "good", now: T0 });

    // Demanding higher retention means testing sooner.
    assert.ok(strictFirst.intervalDays < patientFirst.intervalDays);
    assert.equal(patientFirst.state, strictFirst.state);
  });
});

describe("mastery score", () => {
  it("is 0 for a card that has never been reviewed", () => {
    assert.equal(masteryScoreOf({ stability: 0 }), 0);
  });

  it("rises with stability and never exceeds 100", () => {
    const scores = [1, 7, 30, 180, 3650].map((stability) => masteryScoreOf({ stability }));
    for (let i = 1; i < scores.length; i += 1) {
      assert.ok(scores[i] >= scores[i - 1], `expected non-decreasing, got ${scores.join(", ")}`);
    }
    assert.ok(scores.at(-1)! <= 100);
    assert.equal(masteryScoreOf({ stability: 10_000 }), 100);
  });

  it("maps onto the six Leitner boxes", () => {
    assert.equal(leitnerBoxOfScore(0), 0);
    assert.equal(leitnerBoxOfScore(100), 5);
    for (const score of [0, 17, 33, 50, 66, 83, 100]) {
      const box = leitnerBoxOfScore(score);
      assert.ok(box >= 0 && box <= 5, `box ${box} out of range for score ${score}`);
    }
  });

  it("is an output only — it never feeds back into scheduling", () => {
    // Two identical states scheduled the same way, regardless of any score
    // that might be attached: the scheduler reads stability/difficulty only.
    const state = scheduler.next({ previous: null, rating: "good", now: T0 });
    const withScore = { ...state, masteryScore: 99 } as SchedulerState;
    const withoutScore = { ...state, masteryScore: 0 } as SchedulerState;

    const a = scheduler.next({ previous: withScore, rating: "good", now: T0 + DAY_MS });
    const b = scheduler.next({ previous: withoutScore, rating: "good", now: T0 + DAY_MS });
    assert.deepEqual(a, b);
  });
});
