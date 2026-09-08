import type { ReviewRating } from "../types.ts";

/**
 * Where a card sits in the learning pipeline.
 *
 * NEW → LEARNING → REVIEW → MASTERED, with a lapse ("again" on a card that had
 * graduated) dropping it back to LEARNING.
 */
export type LearningState = "new" | "learning" | "review" | "mastered";

/**
 * Everything the scheduler needs to schedule the next review, and nothing else.
 *
 * This is memory state, not a score: `stability` and `difficulty` are the two
 * FSRS variables, and the due date is derived from them. The product-facing
 * mastery percentage is computed from this (see ./mastery), never the reverse.
 */
export type SchedulerState = {
  state: LearningState;
  /** FSRS stability: days until recall probability decays to the target retention. */
  stability: number;
  /** FSRS difficulty, 1..10. Higher means the card needs shorter intervals. */
  difficulty: number;
  /** The interval that produced `dueAt`, in days. */
  intervalDays: number;
  /** When this card should next be shown. Null only while it is still NEW. */
  dueAt: number | null;
  /** Total scheduled reviews so far. */
  reps: number;
  /** How many times a graduated card has been forgotten. */
  lapses: number;
};

export type ReviewInput = {
  /** The card's state before this review, or null if it has never been reviewed. */
  previous: SchedulerState | null;
  rating: ReviewRating;
  /** Review time (ms since epoch), so scheduling is deterministic and testable. */
  now: number;
};

/**
 * A replaceable scheduling strategy.
 *
 * Everything above this interface — the review queue, the study modes, the
 * server write path — depends only on the shape below, so the FSRS
 * implementation in ./fsrs can be swapped for a different one (a tuned
 * parameter set, or the upstream `ts-fsrs` package) without touching callers.
 */
export interface Scheduler {
  /** Identifier recorded alongside progress, so stored state can be traced to the strategy that produced it. */
  readonly name: string;
  /** State for a card that has never been reviewed. */
  initial(): SchedulerState;
  /** State after applying one rating. Pure: same input, same output. */
  next(input: ReviewInput): SchedulerState;
}
