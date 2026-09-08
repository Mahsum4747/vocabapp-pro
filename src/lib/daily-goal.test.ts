import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DAILY_GOAL_OPTIONS,
  DEFAULT_DAILY_GOAL,
  DEFAULT_TIME_ZONE,
  goalMet,
  isDailyGoalOption,
  isTimeZoneName,
  readUserSettings,
} from "./daily-goal.ts";

describe("reading a user's settings", () => {
  it("gives defaults to a user who has no settings document", () => {
    // Which today is every user: users/{uid} has never been written.
    assert.deepEqual(readUserSettings(null), {
      dailyGoal: DEFAULT_DAILY_GOAL,
      timeZone: DEFAULT_TIME_ZONE,
    });
    assert.deepEqual(readUserSettings(undefined).dailyGoal, DEFAULT_DAILY_GOAL);
    assert.deepEqual(readUserSettings({}).timeZone, DEFAULT_TIME_ZONE);
  });

  it("reads a stored goal and timezone back", () => {
    const settings = readUserSettings({
      id: "u1",
      dailyGoal: 20,
      timeZone: "Europe/Berlin",
      createdAt: 1,
      updatedAt: 2,
    });

    assert.deepEqual(settings, { dailyGoal: 20, timeZone: "Europe/Berlin" });
  });

  it("falls back per field rather than failing on a half-written document", () => {
    assert.deepEqual(readUserSettings({ dailyGoal: 30 }), {
      dailyGoal: 30,
      timeZone: DEFAULT_TIME_ZONE,
    });
    assert.deepEqual(readUserSettings({ timeZone: "Asia/Tokyo" }), {
      dailyGoal: DEFAULT_DAILY_GOAL,
      timeZone: "Asia/Tokyo",
    });
  });

  it("replaces a goal the UI can no longer offer", () => {
    // A goal stored by an older version, or hand-edited in the console: the
    // reader must return something the settings UI can actually render.
    for (const stored of [7, 0, -10, 1000, "20", null, NaN]) {
      assert.equal(readUserSettings({ dailyGoal: stored }).dailyGoal, DEFAULT_DAILY_GOAL);
    }
  });

  it("rejects a timezone that could not be one", () => {
    for (const stored of ["", "../../etc", "Europe/Berlin; DROP", 42, {}]) {
      assert.equal(readUserSettings({ timeZone: stored }).timeZone, DEFAULT_TIME_ZONE);
    }
  });
});

describe("goal validation", () => {
  it("accepts exactly the offered goals", () => {
    for (const goal of DAILY_GOAL_OPTIONS) assert.equal(isDailyGoalOption(goal), true);
    for (const goal of [0, 1, 15, 25, 50, -5, 10.5, "10", null, undefined, NaN]) {
      assert.equal(isDailyGoalOption(goal), false, `${String(goal)} must not be accepted`);
    }
  });

  it("accepts real zone names and rejects junk", () => {
    for (const zone of ["UTC", "Europe/Berlin", "America/Argentina/Buenos_Aires", "Etc/GMT+3"]) {
      assert.equal(isTimeZoneName(zone), true, zone);
    }
    for (const zone of ["", " ", "/", "Europe//Berlin", "../secrets", "a\nb"]) {
      assert.equal(isTimeZoneName(zone), false, JSON.stringify(zone));
    }
  });
});

describe("meeting the goal", () => {
  it("is met at the target, not only above it", () => {
    assert.equal(goalMet(9, 10), false);
    assert.equal(goalMet(10, 10), true);
    assert.equal(goalMet(11, 10), true);
  });

  it("treats a broken counter as not met", () => {
    assert.equal(goalMet(NaN, 10), false);
  });
});
