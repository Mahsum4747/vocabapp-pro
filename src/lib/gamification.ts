import type { ReviewRating } from "./types.ts";

/**
 * XP, levels and achievements: the rules, as plain functions.
 *
 * Everything here is pure and testable without a database. The transaction in
 * `study-sets.ts` reads these decisions and stores them; nothing about the
 * scheduler or the review queue depends on any of it — this layer is
 * motivation, not memory.
 */

/** What one review is worth, before the per-card daily cap. */
export const XP_BY_RATING: Record<ReviewRating, number> = {
  again: -5,
  hard: 0,
  good: 10,
  easy: 20,
};

/**
 * The most XP one card can earn in one day.
 *
 * Enforced by only awarding XP on a card's FIRST review of the day: the
 * largest single award is `easy` at 20, so the cap holds by construction and
 * needs no per-card running total. Reviewing the same word ten times in an
 * evening is not ten times the learning, and paying for it would make
 * hammering one card the fastest way to level up.
 */
export const XP_PER_CARD_PER_DAY = 20;

export const XP_PER_LEVEL = 100;

/**
 * XP for one review. `firstReviewToday` comes from the same day-key check
 * that decides `uniqueWordsReviewed`, so the two can never disagree.
 */
export function xpForReview(rating: ReviewRating, firstReviewToday: boolean): number {
  return firstReviewToday ? XP_BY_RATING[rating] : 0;
}

/**
 * A wrong answer costs XP, but a total never goes below zero — a learner who
 * comes back after a bad session should see a bar that can only fill up.
 */
export function applyXp(totalXp: number, delta: number): number {
  const current = Number.isFinite(totalXp) ? totalXp : 0;
  return Math.max(0, current + delta);
}

export type LevelInfo = {
  level: number;
  /** XP earned inside the current level, 0..XP_PER_LEVEL. */
  xpIntoLevel: number;
  /** Total XP at which the next level starts. */
  nextLevelAt: number;
  /** XP still needed to reach it. */
  xpToNextLevel: number;
};

export function levelFromXp(totalXp: number): LevelInfo {
  const xp = Number.isFinite(totalXp) && totalXp > 0 ? Math.floor(totalXp) : 0;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const nextLevelAt = level * XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel: xp - (level - 1) * XP_PER_LEVEL,
    nextLevelAt,
    xpToNextLevel: nextLevelAt - xp,
  };
}

export type AchievementId = "streak_7" | "perfect_run" | "mastered_10" | "set_completed";

/**
 * The running totals every achievement is judged against.
 *
 * Deliberately not "reviews recorded": counting attempts rewards showing up,
 * and every badge here is meant to reward something that actually went well.
 */
export type AchievementStats = {
  /** Current streak in days, from `user_streaks`. */
  currentStreak: number;
  /** Consecutive good/easy answers; any `again` or `hard` resets it. */
  perfectRun: number;
  /** Cards whose mastery score has reached MASTERED_SCORE. */
  masteredCards: number;
  /** Sets whose every active card has reached mastery. 0 or 1 is enough here. */
  setsCompleted: number;
};

export const MASTERED_SCORE = 80;

/**
 * Everything the profile UI reads, in one shape.
 *
 * Settings and totals travel together because they live in one document —
 * `users/{uid}` — and splitting them across two endpoints would mean two reads
 * of the same document and two chances to drift.
 */
export type UserProfile = {
  dailyGoal: number;
  timeZone: string;
  totalXP: number;
  /** Reviews recorded ever, which is what the milestone badges count. */
  totalReviews: number;
  perfectRun: number;
  masteredCards: number;
  /** Achievement id -> epoch ms it was unlocked. */
  achievements: Record<string, number>;
};

/** The stats every achievement is judged against, pulled out of a profile. */
export function statsOf(profile: UserProfile, currentStreak: number): AchievementStats {
  return {
    currentStreak,
    perfectRun: profile.perfectRun,
    masteredCards: profile.masteredCards,
    // Whether a set is finished is only ever established at review time, from
    // the set being reviewed — so for display it is simply whether the badge
    // has been earned. A locked one reads 0 / 1, which is all it can say.
    setsCompleted: profile.achievements.set_completed !== undefined ? 1 : 0,
  };
}

export type Achievement = {
  id: AchievementId;
  name: string;
  description: string;
  /** Which running total it watches, and the value that unlocks it. */
  metric: keyof AchievementStats;
  target: number;
};

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "streak_7",
    name: "Seven days",
    description: "Study seven days in a row.",
    metric: "currentStreak",
    target: 7,
  },
  {
    id: "perfect_run",
    name: "Perfect run",
    description: "Answer ten cards in a row without a slip.",
    metric: "perfectRun",
    target: 10,
  },
  {
    id: "mastered_10",
    name: "Ten mastered",
    description: `Take ten words to a mastery score of ${MASTERED_SCORE}.`,
    metric: "masteredCards",
    target: 10,
  },
  {
    id: "set_completed",
    name: "Set complete",
    description: "Take every card in one set to mastery.",
    metric: "setsCompleted",
    target: 1,
  },
];

/** How far along an achievement is, for the locked ones in the UI. */
export function achievementProgress(
  achievement: Achievement,
  stats: AchievementStats,
): { current: number; target: number } {
  const raw = stats[achievement.metric];
  const current = Number.isFinite(raw) ? Math.max(0, raw) : 0;
  return { current: Math.min(current, achievement.target), target: achievement.target };
}

export function isAchievementEarned(achievement: Achievement, stats: AchievementStats): boolean {
  const raw = stats[achievement.metric];
  return Number.isFinite(raw) && raw >= achievement.target;
}

/**
 * Which achievements this review just earned.
 *
 * Compared with `>=` rather than `===` so a milestone can't be missed forever
 * because a review landed while the counter was already past it (a retried
 * transaction, or a counter that moved by more than one). Anything already in
 * `unlocked` is skipped, so re-running this is harmless — the stored unlock
 * timestamp is never overwritten.
 */
export function newlyUnlocked(
  stats: AchievementStats,
  unlocked: Record<string, unknown> | undefined,
): AchievementId[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      isAchievementEarned(achievement, stats) && !(achievement.id in (unlocked ?? {})),
  ).map((achievement) => achievement.id);
}

/**
 * The consecutive-good/easy counter after one review.
 *
 * `hard` is a correct answer for scheduling but not a clean one, so it breaks
 * the run — a "perfect" run that tolerates struggling would not mean much.
 */
export function nextPerfectRun(current: number, rating: ReviewRating): number {
  const clean = rating === "good" || rating === "easy";
  if (!clean) return 0;
  return (Number.isFinite(current) && current > 0 ? Math.floor(current) : 0) + 1;
}
