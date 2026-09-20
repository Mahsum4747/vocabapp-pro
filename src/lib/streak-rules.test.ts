import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { daysBetween, nextStreak, readStreak, todayUTC, type StoredStreak } from "./streak-rules.ts";

const stored = (lastStudiedDate: string, currentStreak: number): StoredStreak => ({
  lastStudiedDate,
  currentStreak,
});

describe("todayUTC", () => {
  it("is the UTC calendar day of the given instant, not the local one", () => {
    // 23:30 UTC on the 9th is already the 10th in UTC+2 — the streak day is UTC's.
    assert.equal(todayUTC(new Date("2026-03-09T23:30:00Z")), "2026-03-09");
    assert.equal(todayUTC(new Date("2026-03-10T00:00:00Z")), "2026-03-10");
  });

  it("follows the (fake) system clock when called without an argument", () => {
    mock.timers.enable({ apis: ["Date"], now: new Date("2026-03-10T23:59:59.999Z") });
    try {
      assert.equal(todayUTC(), "2026-03-10");
      mock.timers.setTime(new Date("2026-03-11T00:00:00.000Z").getTime());
      assert.equal(todayUTC(), "2026-03-11");
    } finally {
      mock.timers.reset();
    }
  });
});

describe("daysBetween", () => {
  it("counts whole calendar days", () => {
    assert.equal(daysBetween("2026-03-10", "2026-03-10"), 0);
    assert.equal(daysBetween("2026-03-10", "2026-03-09"), 1);
    assert.equal(daysBetween("2026-03-10", "2026-03-07"), 3);
  });

  it("is correct across month, year and leap-day boundaries", () => {
    assert.equal(daysBetween("2026-03-01", "2026-02-28"), 1);
    assert.equal(daysBetween("2026-01-01", "2025-12-31"), 1);
    assert.equal(daysBetween("2028-03-01", "2028-02-29"), 1); // 2028 is a leap year
    assert.equal(daysBetween("2028-03-01", "2028-02-28"), 2);
  });
});

describe("nextStreak — recording a review", () => {
  it("starts a streak at 1 for a first-ever review", () => {
    assert.deepEqual(nextStreak(null, "2026-03-10"), {
      currentStreak: 1,
      lastStudiedDate: "2026-03-10",
    });
  });

  it("does not count a second review on the same day", () => {
    assert.deepEqual(nextStreak(stored("2026-03-10", 4), "2026-03-10"), {
      currentStreak: 4,
      lastStudiedDate: "2026-03-10",
    });
  });

  it("extends the streak when the last study day was yesterday", () => {
    assert.deepEqual(nextStreak(stored("2026-03-09", 4), "2026-03-10"), {
      currentStreak: 5,
      lastStudiedDate: "2026-03-10",
    });
  });

  it("restarts at 1 after missing a day", () => {
    assert.deepEqual(nextStreak(stored("2026-03-08", 9), "2026-03-10"), {
      currentStreak: 1,
      lastStudiedDate: "2026-03-10",
    });
  });

  it("restarts at 1 after a long absence", () => {
    assert.equal(nextStreak(stored("2025-11-01", 30), "2026-03-10").currentStreak, 1);
  });

  it("extends across month, year and leap-day boundaries", () => {
    assert.equal(nextStreak(stored("2026-02-28", 2), "2026-03-01").currentStreak, 3);
    assert.equal(nextStreak(stored("2025-12-31", 2), "2026-01-01").currentStreak, 3);
    assert.equal(nextStreak(stored("2028-02-29", 2), "2028-03-01").currentStreak, 3);
    // 28 Feb → 1 Mar in a leap year skips the 29th: that is a missed day.
    assert.equal(nextStreak(stored("2028-02-28", 2), "2028-03-01").currentStreak, 1);
  });

  it("builds up one per day over a run, breaks on a gap, and rebuilds", () => {
    const days = ["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04", "2026-03-05"];
    let state: StoredStreak | null = null;
    for (const [i, day] of days.entries()) {
      const next = nextStreak(state, day);
      assert.equal(next.currentStreak, i + 1);
      state = { lastStudiedDate: next.lastStudiedDate!, currentStreak: next.currentStreak };
    }
    // Skip the 6th, study on the 7th: back to 1.
    const afterGap = nextStreak(state, "2026-03-07");
    assert.equal(afterGap.currentStreak, 1);
    // And the 8th continues from there.
    const rebuilt = nextStreak(
      { lastStudiedDate: afterGap.lastStudiedDate!, currentStreak: afterGap.currentStreak },
      "2026-03-08",
    );
    assert.equal(rebuilt.currentStreak, 2);
  });

  it("treats the UTC midnight boundary as the day change (fake clock)", () => {
    const previous = stored("2026-03-10", 3);
    mock.timers.enable({ apis: ["Date"], now: new Date("2026-03-10T23:59:59.999Z") });
    try {
      assert.equal(nextStreak(previous, todayUTC()).currentStreak, 3); // still the 10th
      mock.timers.setTime(new Date("2026-03-11T00:00:00.000Z").getTime());
      assert.equal(nextStreak(previous, todayUTC()).currentStreak, 4); // now the 11th
    } finally {
      mock.timers.reset();
    }
  });
});

describe("readStreak — what the home screen shows", () => {
  it("is 0 with no stored streak", () => {
    assert.deepEqual(readStreak(null, "2026-03-10"), { currentStreak: 0, lastStudiedDate: null });
  });

  it("keeps the streak when studied today", () => {
    assert.equal(readStreak(stored("2026-03-10", 6), "2026-03-10").currentStreak, 6);
  });

  it("keeps the streak when studied yesterday — today is still to come", () => {
    assert.equal(readStreak(stored("2026-03-09", 6), "2026-03-10").currentStreak, 6);
  });

  it("reads as broken (0) once a whole day was missed, keeping the last date", () => {
    assert.deepEqual(readStreak(stored("2026-03-08", 6), "2026-03-10"), {
      currentStreak: 0,
      lastStudiedDate: "2026-03-08",
    });
  });

  it("does not change what was stored (pure read)", () => {
    const before = stored("2026-03-01", 6);
    const copy = { ...before };
    readStreak(before, "2026-03-10");
    assert.deepEqual(before, copy);
  });

  it("agrees with the next review: a streak that reads 0 restarts at 1, not 1+old", () => {
    const old = stored("2026-03-05", 12);
    assert.equal(readStreak(old, "2026-03-10").currentStreak, 0);
    assert.equal(nextStreak(old, "2026-03-10").currentStreak, 1);
  });
});
