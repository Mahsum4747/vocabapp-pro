import { applyXp, xpForReview, type UserProfile } from "../../src/lib/gamification.ts";
import { planReview } from "../../src/lib/review-plan.ts";
import { defaultScheduler } from "../../src/lib/srs/index.ts";
import type { StreakInfo } from "../../src/lib/streak.ts";
import {
  emptyDailyStats,
  initialProgress,
  type Card,
  type CardProgress,
  type DailyStats,
  type ReviewRating,
  type StudySet,
} from "../../src/lib/types.ts";
import type { ServerFnHandler } from "./serverfn.ts";

/** The frozen clock every browser test runs on: Tue 10 Mar 2026, 12:00 UTC. */
export const NOW = Date.UTC(2026, 2, 10, 12, 0, 0);
export const DAY = 24 * 60 * 60 * 1000;
export const TODAY_KEY = "2026-03-10";
export const USER_ID = "user-e2e";

/** A card whose id follows the app's invariant: `term.trim().toLowerCase()`. */
export function card(term: string, definition: string, extra: Partial<Card> = {}): Card {
  return {
    id: term.trim().toLowerCase(),
    term,
    definition,
    starred: false,
    imageUrl: null,
    ...extra,
  };
}

export function studySet(id: string, title: string, cards: Card[], extra: Partial<StudySet> = {}): StudySet {
  return {
    id,
    title,
    description: "",
    subject: "Language",
    createdAt: NOW - 30 * DAY,
    updatedAt: NOW - 30 * DAY,
    lastStudiedAt: null,
    cards,
    ownerId: USER_ID,
    isPublic: false,
    ...extra,
  };
}

/** A progress row for a card that has been reviewed before. */
export function reviewed(
  cardId: string,
  setId: string,
  over: Partial<CardProgress> & { dueAt: number },
): CardProgress {
  return {
    ...initialProgress(USER_ID, cardId, setId, defaultScheduler.initial(), defaultScheduler.name),
    state: "review",
    stability: 10,
    difficulty: 5,
    intervalDays: 8,
    reps: 4,
    lapses: 0,
    totalReviews: 4,
    correctReviews: 4,
    consecutiveCorrect: 4,
    lastReviewedAt: NOW - 8 * DAY,
    lastReviewedDate: "2026-03-02",
    masteryScore: 70,
    ...over,
  };
}

export type Seed = {
  sets: StudySet[];
  progress?: CardProgress[];
  /** What `getStreak` answers. */
  streak?: StreakInfo;
  /** What `recordReview` reports as the streak afterwards. */
  streakAfterReview?: StreakInfo | null;
  dailyGoal?: number;
};

export type RecordedReview = {
  setId: string;
  cardId: string;
  rating: ReviewRating;
  date: string;
  responseTimeMs?: number;
};

/**
 * An in-memory stand-in for the server's data, answering with the same shapes
 * the real server functions return (typed from the app's own types).
 *
 * Scheduling is NOT re-implemented here: `recordReview` runs the app's own
 * `planReview` and scheduler — exactly what the server transaction applies —
 * against the stored row, so the browser sees genuine intervals. What is
 * faked is only the storage underneath.
 */
export class MockBackend {
  readonly reviews: RecordedReview[] = [];
  private readonly progress = new Map<string, CardProgress>();
  private streak: StreakInfo;
  private today: DailyStats = emptyDailyStats(TODAY_KEY);
  private profile: UserProfile;

  constructor(private readonly seed: Seed) {
    for (const row of seed.progress ?? []) this.progress.set(row.cardId, row);
    this.streak = seed.streak ?? { currentStreak: 0, lastStudiedDate: null };
    this.profile = {
      dailyGoal: seed.dailyGoal ?? 10,
      timeZone: "UTC",
      totalXP: 0,
      totalReviews: 0,
      perfectRun: 0,
      masteredCards: 0,
      achievements: {},
      soundSettings: { enabled: false, volume: 0 },
    };
  }

  progressOf(cardId: string): CardProgress | undefined {
    return this.progress.get(cardId);
  }

  handlers(): Record<string, ServerFnHandler> {
    return {
      getMySets: () => this.seed.sets,
      getPublicSets: () => [],
      getSetById: (data) => this.seed.sets.find((s) => s.id === (data as { id: string }).id) ?? null,
      getAllProgress: () => [...this.progress.values()],
      getSetProgress: (data) =>
        [...this.progress.values()].filter((p) => p.setId === (data as { setId: string }).setId),
      // Opening a study mode marks the set as studied; the response is not read.
      updateSetMeta: () => null,
      getStreak: () => this.streak,
      // Account page chart: one zeroed day per requested key, as the real function does.
      getDailyStatsRange: (data) => {
        const d = data as { dates?: string[] };
        return (d.dates ?? []).map((date) => emptyDailyStats(date));
      },
      getProfile: () => ({ profile: this.profile, today: this.today }),
      recordReview: (data) => this.recordReview(data as RecordedReview),
    };
  }

  private recordReview(input: RecordedReview) {
    if (!["again", "hard", "good", "easy"].includes(input.rating)) {
      throw new Error("Invalid rating");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error("Invalid date");
    this.reviews.push(input);

    const plan = planReview({
      userId: USER_ID,
      cardId: input.cardId,
      setId: input.setId,
      eventId: `event-${this.reviews.length}`,
      rating: input.rating,
      date: input.date,
      responseTimeMs: input.responseTimeMs,
      previous: this.progress.get(input.cardId) ?? null,
      now: NOW,
      scheduler: defaultScheduler,
    });
    this.progress.set(input.cardId, plan.progress);

    const xpDelta = xpForReview(input.rating, plan.daily.uniqueWordsReviewed > 0);
    this.profile = {
      ...this.profile,
      totalXP: applyXp(this.profile.totalXP, xpDelta),
      totalReviews: this.profile.totalReviews + 1,
    };
    if (this.seed.streakAfterReview !== undefined) {
      this.streak = this.seed.streakAfterReview ?? this.streak;
    }

    return {
      ok: true as const,
      progress: plan.progress,
      streak: this.seed.streakAfterReview ?? null,
      xp: { total: this.profile.totalXP, gained: xpDelta },
      dailyDelta: { ...plan.daily, xpEarned: xpDelta },
      unlocked: [],
      setCompleted: null,
    };
  }
}
