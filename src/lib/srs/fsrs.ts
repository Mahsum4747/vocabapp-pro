import type { ReviewRating } from "../types.ts";
import type { LearningState, ReviewInput, Scheduler, SchedulerState } from "./scheduler.ts";

/**
 * An FSRS-shaped scheduler.
 *
 * It uses the FSRS memory model — a power forgetting curve over (stability,
 * difficulty) — rather than SM-2's ease factor, so the stored state is the
 * same shape the upstream `ts-fsrs` package expects and can be handed over to
 * it later without a data migration.
 *
 * The weights below are FSRS-shaped defaults, not values fitted to this app's
 * review history. They are deliberately exposed as parameters: once there is
 * enough review data, fit a real weight vector (or drop in `ts-fsrs`) and pass
 * it here — nothing else has to change.
 */
export type FsrsWeights = {
  /** Initial stability per rating: again, hard, good, easy. */
  initialStability: [number, number, number, number];
  /** Initial difficulty anchor and per-rating slope. */
  initialDifficulty: number;
  difficultySlope: number;
  /** Difficulty change per rating step, and pull back toward the anchor. */
  difficultyDelta: number;
  difficultyMeanReversion: number;
  /** Stability growth on a successful recall. */
  stabilityGrowth: number;
  /** How much growth slows as a card gets more stable (S^-decay). */
  stabilityDecay: number;
  /** How much extra growth comes from recalling a card that was nearly forgotten. */
  stabilityRetrievabilityBoost: number;
  stabilityHardPenalty: number;
  stabilityEasyBonus: number;
  /** Stability after a lapse. */
  lapseStabilityFactor: number;
  lapseDifficultyPenalty: number;
  lapseStabilityExponent: number;
};

export const DEFAULT_WEIGHTS: FsrsWeights = {
  initialStability: [0.4, 1.2, 3.2, 15.6],
  initialDifficulty: 5.5,
  difficultySlope: 0.7,
  difficultyDelta: 1.0,
  difficultyMeanReversion: 0.05,
  stabilityGrowth: 4.5,
  stabilityDecay: 0.15,
  stabilityRetrievabilityBoost: 1,
  stabilityHardPenalty: 0.6,
  stabilityEasyBonus: 1.35,
  lapseStabilityFactor: 0.35,
  lapseDifficultyPenalty: 0.12,
  lapseStabilityExponent: 0.4,
};

export type FsrsOptions = {
  weights?: FsrsWeights;
  /** Probability of recall we schedule for. Lower = longer intervals. */
  requestRetention?: number;
  /** Hard ceiling on any interval, in days. */
  maximumIntervalDays?: number;
  /** A card counts as MASTERED once its interval reaches this many days. */
  masteredIntervalDays?: number;
  /** Intervals below this stay in LEARNING rather than graduating to REVIEW. */
  graduatingIntervalDays?: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** FSRS power forgetting curve constants. */
const DECAY = -0.5;
const FACTOR = 19 / 81;

const RATING_INDEX: Record<ReviewRating, 0 | 1 | 2 | 3> = {
  again: 0,
  hard: 1,
  good: 2,
  easy: 3,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Probability the card is still recalled `elapsedDays` after its last review. */
export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / stability, DECAY);
}

/** Days until recall probability falls to `requestRetention`, given `stability`. */
function intervalForStability(stability: number, requestRetention: number): number {
  return (stability / FACTOR) * (Math.pow(requestRetention, 1 / DECAY) - 1);
}

export function createFsrsScheduler(options: FsrsOptions = {}): Scheduler {
  const w = options.weights ?? DEFAULT_WEIGHTS;
  const requestRetention = options.requestRetention ?? 0.9;
  const maximumIntervalDays = options.maximumIntervalDays ?? 365;
  const masteredIntervalDays = options.masteredIntervalDays ?? 21;
  const graduatingIntervalDays = options.graduatingIntervalDays ?? 1;

  function initialDifficulty(rating: ReviewRating): number {
    const g = RATING_INDEX[rating];
    return clamp(w.initialDifficulty - w.difficultySlope * (g - 2), 1, 10);
  }

  function nextDifficulty(difficulty: number, rating: ReviewRating): number {
    const g = RATING_INDEX[rating];
    // "good" (2) leaves difficulty alone; worse raises it, better lowers it.
    const moved = difficulty - w.difficultyDelta * (g - 2);
    // Pull slowly back toward the anchor so difficulty can't ratchet forever.
    const reverted = moved + w.difficultyMeanReversion * (w.initialDifficulty - moved);
    return clamp(reverted, 1, 10);
  }

  function stabilityAfterRecall(
    stability: number,
    difficulty: number,
    recall: number,
    rating: ReviewRating,
  ): number {
    const ratingFactor =
      rating === "hard" ? w.stabilityHardPenalty : rating === "easy" ? w.stabilityEasyBonus : 1;
    // FSRS stability growth: easier cards grow more, already-stable cards grow
    // proportionally less, and recalling a card that was nearly forgotten is
    // worth far more than recalling one that was still fresh.
    const growth =
      1 +
      w.stabilityGrowth *
        (11 - difficulty) *
        Math.pow(stability, -w.stabilityDecay) *
        (Math.exp(w.stabilityRetrievabilityBoost * (1 - recall)) - 1) *
        ratingFactor;
    return Math.max(stability * growth, stability);
  }

  function stabilityAfterLapse(stability: number, difficulty: number): number {
    const lapsed =
      w.lapseStabilityFactor *
      Math.exp(-w.lapseDifficultyPenalty * difficulty) *
      Math.pow(stability, w.lapseStabilityExponent);
    // A forgotten card must always come back sooner than it just did.
    return clamp(lapsed, w.initialStability[0], Math.max(w.initialStability[0], stability));
  }

  function stateFor(intervalDays: number, rating: ReviewRating, reps: number): LearningState {
    if (rating === "again") return "learning";
    // A card is never "known" off a single exposure, however long the interval
    // the rating bought it — the pipeline is NEW → LEARNING → REVIEW → MASTERED
    // and the first review is the LEARNING step.
    if (reps < 2) return "learning";
    if (intervalDays >= masteredIntervalDays) return "mastered";
    if (intervalDays >= graduatingIntervalDays) return "review";
    return "learning";
  }

  return {
    name: "fsrs",

    initial(): SchedulerState {
      return {
        state: "new",
        stability: 0,
        difficulty: w.initialDifficulty,
        intervalDays: 0,
        dueAt: null,
        reps: 0,
        lapses: 0,
      };
    },

    next({ previous, rating, now }: ReviewInput): SchedulerState {
      const isFirst = previous === null || previous.state === "new" || previous.stability <= 0;

      let stability: number;
      let difficulty: number;
      let lapses = previous?.lapses ?? 0;

      if (isFirst) {
        stability = w.initialStability[RATING_INDEX[rating]];
        difficulty = initialDifficulty(rating);
      } else {
        const elapsedDays = previous.dueAt
          ? Math.max(0, (now - (previous.dueAt - previous.intervalDays * DAY_MS)) / DAY_MS)
          : 0;
        const recall = retrievability(elapsedDays, previous.stability);
        difficulty = nextDifficulty(previous.difficulty, rating);
        if (rating === "again") {
          stability = stabilityAfterLapse(previous.stability, difficulty);
          lapses += 1;
        } else {
          stability = stabilityAfterRecall(previous.stability, difficulty, recall, rating);
        }
      }

      const rawInterval = intervalForStability(stability, requestRetention);
      const intervalDays = clamp(rawInterval, 0, maximumIntervalDays);
      const reps = (previous?.reps ?? 0) + 1;

      return {
        state: stateFor(intervalDays, rating, reps),
        stability,
        difficulty,
        intervalDays,
        dueAt: now + Math.round(intervalDays * DAY_MS),
        reps,
        lapses,
      };
    },
  };
}
