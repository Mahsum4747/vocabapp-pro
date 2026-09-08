import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  achievementProgress,
  ACHIEVEMENTS,
  applyXp,
  levelFromXp,
  newlyUnlocked,
  nextPerfectRun,
  XP_PER_CARD_PER_DAY,
  XP_PER_LEVEL,
  xpForReview,
  type AchievementStats,
} from "./gamification.ts";
import type { ReviewRating } from "./types.ts";

function stats(overrides: Partial<AchievementStats> = {}): AchievementStats {
  return { totalReviews: 0, currentStreak: 0, perfectRun: 0, masteredCards: 0, ...overrides };
}

describe("XP for one review", () => {
  it("pays by how the recall went", () => {
    assert.equal(xpForReview("easy", true), 20);
    assert.equal(xpForReview("good", true), 10);
    assert.equal(xpForReview("hard", true), 0);
    assert.equal(xpForReview("again", true), -5);
  });

  it("pays nothing for the same card twice in a day", () => {
    for (const rating of ["again", "hard", "good", "easy"] as ReviewRating[]) {
      assert.equal(xpForReview(rating, false), 0, rating);
    }
  });

  it("cannot pay more than the daily cap for one card", () => {
    // The cap holds by construction: the largest single award is the cap, and
    // only the first review of the day is paid.
    const mostForOneCard = Math.max(
      ...(["again", "hard", "good", "easy"] as ReviewRating[]).map((r) => xpForReview(r, true)),
    );
    assert.equal(mostForOneCard, XP_PER_CARD_PER_DAY);
  });
});

describe("the XP total", () => {
  it("adds what a review earned", () => {
    assert.equal(applyXp(100, 10), 110);
  });

  it("never drops below zero", () => {
    assert.equal(applyXp(0, -5), 0);
    assert.equal(applyXp(3, -5), 0);
  });

  it("treats a broken stored total as zero", () => {
    assert.equal(applyXp(NaN, 10), 10);
  });
});

describe("levels", () => {
  it("starts everyone at level 1", () => {
    const level = levelFromXp(0);
    assert.equal(level.level, 1);
    assert.equal(level.xpIntoLevel, 0);
    assert.equal(level.nextLevelAt, XP_PER_LEVEL);
    assert.equal(level.xpToNextLevel, XP_PER_LEVEL);
  });

  it("reads 240 XP as level 3, 40 into it, 60 to go", () => {
    const level = levelFromXp(240);
    assert.equal(level.level, 3);
    assert.equal(level.xpIntoLevel, 40);
    assert.equal(level.nextLevelAt, 300);
    assert.equal(level.xpToNextLevel, 60);
  });

  it("turns over exactly on the hundred", () => {
    assert.equal(levelFromXp(99).level, 1);
    assert.equal(levelFromXp(100).level, 2);
    assert.equal(levelFromXp(100).xpIntoLevel, 0);
  });

  it("survives a broken total", () => {
    assert.equal(levelFromXp(NaN).level, 1);
    assert.equal(levelFromXp(-50).level, 1);
  });
});

describe("the perfect run counter", () => {
  it("counts good and easy answers", () => {
    assert.equal(nextPerfectRun(3, "good"), 4);
    assert.equal(nextPerfectRun(3, "easy"), 4);
  });

  it("is broken by anything else", () => {
    assert.equal(nextPerfectRun(9, "again"), 0);
    // "Hard" is correct for scheduling but not a clean answer, and a perfect
    // run that tolerates struggling would not mean much.
    assert.equal(nextPerfectRun(9, "hard"), 0);
  });
});

describe("achievements", () => {
  it("unlocks the first card on the first review", () => {
    assert.deepEqual(newlyUnlocked(stats({ totalReviews: 1 }), {}), ["first_card"]);
  });

  it("does not unlock the same achievement twice", () => {
    const earned = stats({ totalReviews: 5 });
    assert.deepEqual(newlyUnlocked(earned, { first_card: 1_700_000_000_000 }), []);
  });

  it("still fires a milestone that was passed rather than hit exactly", () => {
    // A counter can move past 100 without ever equalling it — a retried
    // transaction, a repaired total. The badge must not be lost forever.
    assert.deepEqual(newlyUnlocked(stats({ totalReviews: 104 }), { first_card: 1 }), ["100_words"]);
  });

  it("unlocks the week streak from the streak counter", () => {
    assert.equal(newlyUnlocked(stats({ currentStreak: 6 }), {}).includes("streak_7"), false);
    assert.equal(newlyUnlocked(stats({ currentStreak: 7 }), {}).includes("streak_7"), true);
  });

  it("unlocks a perfect run at ten clean answers", () => {
    assert.equal(newlyUnlocked(stats({ perfectRun: 9 }), {}).includes("perfect_run"), false);
    assert.equal(newlyUnlocked(stats({ perfectRun: 10 }), {}).includes("perfect_run"), true);
  });

  it("unlocks ten mastered words", () => {
    assert.equal(newlyUnlocked(stats({ masteredCards: 10 }), {}).includes("mastered_10"), true);
  });

  it("reports progress towards a locked one, capped at the target", () => {
    const century = ACHIEVEMENTS.find((a) => a.id === "100_words")!;
    assert.deepEqual(achievementProgress(century, stats({ totalReviews: 42 })), {
      current: 42,
      target: 100,
    });
    assert.deepEqual(achievementProgress(century, stats({ totalReviews: 500 })), {
      current: 100,
      target: 100,
    });
  });
});

describe("a session, end to end", () => {
  it("pays for two cards but not for grading one of them twice", () => {
    // The scenario from the spec: good on card A, good on A again the same
    // day, good on card B.
    const awards = [
      xpForReview("good", true), // A, first today
      xpForReview("good", false), // A again, same day
      xpForReview("good", true), // B, first today
    ];

    assert.deepEqual(awards, [10, 0, 10]);
    assert.equal(
      awards.reduce((total, xp) => applyXp(total, xp), 0),
      20,
    );
  });

  it("unlocks the perfect run after ten clean answers and not before", () => {
    let run = 0;
    let unlocked: Record<string, number> = {};

    for (let i = 1; i <= 10; i++) {
      run = nextPerfectRun(run, "good");
      const fired = newlyUnlocked(stats({ totalReviews: i, perfectRun: run }), unlocked);
      unlocked = { ...unlocked, ...Object.fromEntries(fired.map((id) => [id, i])) };

      if (i < 10) assert.equal("perfect_run" in unlocked, false, `unlocked too early at ${i}`);
    }

    assert.equal("perfect_run" in unlocked, true);
    assert.equal(unlocked.perfect_run, 10, "unlocked on the tenth answer");
    assert.equal(unlocked.first_card, 1, "and the first card badge kept its own date");
  });

  it("resets the run when one answer goes wrong", () => {
    let run = 0;
    for (const rating of ["good", "good", "good", "again", "good"] as ReviewRating[]) {
      run = nextPerfectRun(run, rating);
    }
    assert.equal(run, 1, "the run restarts from the answer after the slip");
  });
});
