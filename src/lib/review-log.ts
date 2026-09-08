import { useCallback } from "react";
import { useStudyStore } from "./store";
import type { ReviewRating } from "./types";

/**
 * How a mode that only knows "right or wrong" reports into the four-rating
 * scheduler.
 *
 * Test, Learn and Match grade a typed or clicked answer, where Hard and Easy
 * have no meaning — forcing four buttons into those flows would make them
 * worse. They map onto the two ratings that carry the same information, and
 * the scheduler treats them exactly as it would the same rating from
 * Flashcards.
 */
export function ratingForOutcome(correct: boolean): ReviewRating {
  return correct ? "good" : "again";
}

export type LogReview = (input: {
  /** The set's DOCUMENT id (`studySet.id`), not the route param — that can be a share id. */
  setId: string;
  cardId: string;
  rating: ReviewRating;
  responseTimeMs?: number;
}) => void;

/**
 * Record one graded review without making the study UI wait for it.
 *
 * The learner has already been shown the outcome locally, so a failed write
 * must never block or undo it; failures are logged and dropped. Everything
 * else — scheduling, counters, daily stats, the streak — happens server-side
 * inside `recordReview`, and the resulting progress lands back in the store,
 * so this is the only review-writing path in the client.
 */
export function useReviewLogger(): LogReview {
  const recordReview = useStudyStore((s) => s.recordReview);

  return useCallback(
    (input) => {
      void recordReview(input).catch((error) => {
        console.error("Failed to record review:", error);
      });
    },
    [recordReview],
  );
}
