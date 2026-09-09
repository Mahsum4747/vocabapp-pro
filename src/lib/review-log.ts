import { useCallback, useEffect } from "react";
import { useCelebration } from "@/components/celebration";
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
  const profile = useStudyStore((s) => s.profile);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const celebrate = useCelebration();

  // A study mode opened directly — a bookmark, a reload — has no profile yet,
  // and without it the daily goal cannot be recognised as met. One fetch per
  // session; a signed-out visitor simply leaves it null.
  useEffect(() => {
    if (!profile) void fetchProfile();
  }, [profile, fetchProfile]);

  return useCallback(
    (input) => {
      // Immediate, before the write goes out: the answer was right whether or
      // not the network agrees, and the whole point of this path is that the
      // learner is never left waiting on it.
      if (input.rating === "easy") celebrate.correct("excellent");
      else if (input.rating === "good") celebrate.correct("correct");
      else if (input.rating === "hard") celebrate.hard();
      else if (input.rating === "again") celebrate.wrong();

      void recordReview(input)
        .then((outcome) => {
          // What the server worked out: badges, a finished set, today's goal.
          celebrate.achievements(outcome.unlocked);
          if (outcome.setCompleted) celebrate.setCompleted(outcome.setCompleted);
          else if (outcome.goalJustMet) celebrate.dailyGoalMet();
        })
        .catch((error) => {
          console.error("Failed to record review:", error);
        });
    },
    [recordReview, celebrate],
  );
}
