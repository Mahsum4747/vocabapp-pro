import type { Scheduler } from "./srs/scheduler.ts";
import { masteryScoreOf } from "./srs/mastery.ts";
import {
  isCorrectRating,
  type CardProgress,
  type ReviewEvent,
  type ReviewRating,
} from "./types.ts";

/** The counter deltas a review adds to the day's totals. */
export type DailyDelta = {
  date: string;
  reviews: number;
  correctReviews: number;
  studySeconds: number;
  /** 1 the first time this card is graded today, 0 for every repeat. */
  uniqueWordsReviewed: number;
};

export type ReviewPlan = {
  /** The row to append to the event log. Never an update — history is append-only. */
  event: ReviewEvent;
  /** The card's progress after this review, with counters already resolved. */
  progress: CardProgress;
  /** What to add to the day's totals. */
  daily: DailyDelta;
};

/**
 * Everything one review changes, computed in one pure step.
 *
 * Split out of the Firestore transaction so the decisions — which rating counts
 * as correct, how counters advance, what the event records, what the day's
 * totals gain — are testable without a database. The transaction's only job is
 * to apply this.
 */
export function planReview(input: {
  userId: string;
  cardId: string;
  setId: string;
  /** Pre-allocated document id, so the event carries its own id. */
  eventId: string;
  rating: ReviewRating;
  /** The viewer's local day, YYYY-MM-DD. */
  date: string;
  responseTimeMs?: number;
  /** The stored progress this review advances from, or null on a first review. */
  previous: CardProgress | null;
  /** Server clock. */
  now: number;
  scheduler: Scheduler;
}): ReviewPlan {
  const { userId, cardId, setId, eventId, rating, date, responseTimeMs, previous, now, scheduler } =
    input;

  const correct = isCorrectRating(rating);
  const scheduled = scheduler.next({ previous, rating, now });

  const event: ReviewEvent = {
    id: eventId,
    userId,
    cardId,
    setId,
    rating,
    // Server clock, not the browser's — a client cannot backdate its history.
    reviewedAt: now,
    ...(responseTimeMs !== undefined ? { responseTimeMs } : {}),
  };

  /**
   * Is this the card's first review today?
   *
   * Compared as day KEYS, not timestamps: both sides are the viewer's own
   * local day, so there is no timezone arithmetic to get wrong. A row written
   * before `lastReviewedDate` existed has none, and counts as a first review —
   * a one-time overcount of at most one per card, which self-heals as soon as
   * that card is reviewed again.
   */
  const firstReviewToday = previous?.lastReviewedDate !== date;

  const progress: CardProgress = {
    ...scheduled,
    userId,
    cardId,
    setId,
    totalReviews: (previous?.totalReviews ?? 0) + 1,
    correctReviews: (previous?.correctReviews ?? 0) + (correct ? 1 : 0),
    // A wrong answer breaks the streak outright rather than decrementing it.
    consecutiveCorrect: correct ? (previous?.consecutiveCorrect ?? 0) + 1 : 0,
    lastReviewedAt: now,
    lastReviewedDate: date,
    masteryScore: masteryScoreOf(scheduled),
    scheduler: scheduler.name,
  };

  return {
    event,
    progress,
    daily: {
      date,
      reviews: 1,
      correctReviews: correct ? 1 : 0,
      studySeconds: Math.round((responseTimeMs ?? 0) / 1000),
      uniqueWordsReviewed: firstReviewToday ? 1 : 0,
    },
  };
}
