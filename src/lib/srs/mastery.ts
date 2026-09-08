import { MASTERY_MAX } from "../types.ts";
import type { SchedulerState } from "./scheduler.ts";

/**
 * Stability (in days) at which a card reads as 100% mastered. Purely a
 * presentation choice — moving it changes what the progress bar says, never
 * when a card is actually scheduled.
 */
export const MASTERY_TARGET_STABILITY_DAYS = 180;

/**
 * The product metric: 0..100, derived from scheduler state.
 *
 * This is an output, never an input — the scheduler does not read it back, so
 * changing this curve can never alter review scheduling. Log-shaped because
 * the first week of stability is the part a learner actually feels; going from
 * 90 to 180 days of stability should not look like half the progress bar.
 */
export function masteryScoreOf(state: Pick<SchedulerState, "stability">): number {
  const { stability } = state;
  // A stored row can carry a stability this code cannot use — a row written
  // before the field existed, or one whose value is already NaN. `undefined
  // <= 0` is false, so without an explicit finite check that value falls
  // straight into log1p and returns NaN, which then silently poisons every
  // average and box count downstream. No usable stability means no measurable
  // mastery: 0.
  if (!Number.isFinite(stability) || stability <= 0) return 0;
  const ratio = Math.log1p(stability) / Math.log1p(MASTERY_TARGET_STABILITY_DAYS);
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
}

/**
 * Which Leitner box (0..MASTERY_MAX) a mastery score falls in. Keeps the
 * existing six-box UI meaningful now that boxes are derived from real
 * scheduling state rather than a hand-incremented counter.
 */
export function leitnerBoxOfScore(masteryScore: number): number {
  // Same reasoning as above: a non-finite score would make Math.round return
  // NaN, and `counts[NaN] += 1` drops the card out of the box totals entirely
  // rather than failing loudly.
  if (!Number.isFinite(masteryScore)) return 0;
  const box = Math.round((masteryScore / 100) * MASTERY_MAX);
  return Math.min(Math.max(box, 0), MASTERY_MAX);
}
