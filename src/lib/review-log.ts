import { recordReview } from "./study-sets";
import { localDateKey } from "./utils";

/**
 * Record one graded review, without making the study UI wait for it.
 *
 * The learning history is a side record: a card is graded locally and
 * `Card.mastery` updates immediately, so a failed write here must never
 * block or undo what the learner just did. Failures are logged and dropped.
 *
 * `setId` must be the set's DOCUMENT id (`studySet.id`), not the route
 * param — that can be a share id, which the server has no set to match.
 */
export function logReview({
  setId,
  cardId,
  correct,
  responseTimeMs,
}: {
  setId: string;
  cardId: string;
  correct: boolean;
  responseTimeMs?: number;
}): void {
  void recordReview({
    data: {
      setId,
      cardId,
      rating: correct ? "good" : "again",
      date: localDateKey(),
      ...(responseTimeMs !== undefined ? { responseTimeMs } : {}),
    },
  }).catch((error) => {
    console.error("Failed to record review:", error);
  });
}
