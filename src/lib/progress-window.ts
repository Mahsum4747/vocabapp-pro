/** Accuracy over the last 20 completed rounds, weighted by question count.
 * Store round counts, never invent the order of individual answers. */
export const RECENT_WINDOW = 20;
export type RoundResult = { correct: number; total: number };
export function foldRoundIntoRollingAccuracy(
  existing: RoundResult[],
  correct: number,
  total: number,
  window = RECENT_WINDOW,
): { accuracy: number; recentRounds: RoundResult[] } {
  if (
    !Number.isInteger(correct) ||
    !Number.isInteger(total) ||
    total < 1 ||
    total > 50 ||
    correct < 0 ||
    correct > total ||
    !Number.isInteger(window) ||
    window < 1
  ) {
    throw new Error("Invalid round result");
  }
  if (
    !Array.isArray(existing) ||
    existing.some(
      (round) =>
        !round ||
        !Number.isInteger(round.correct) ||
        !Number.isInteger(round.total) ||
        round.total < 1 ||
        round.total > 50 ||
        round.correct < 0 ||
        round.correct > round.total,
    )
  )
    throw new Error("Invalid stored round history; reset test data");
  const recentRounds = [...existing, { correct, total }].slice(-window);
  const sums = recentRounds.reduce(
    (a, r) => ({ correct: a.correct + r.correct, total: a.total + r.total }),
    { correct: 0, total: 0 },
  );
  return { accuracy: Math.round((100 * sums.correct) / sums.total), recentRounds };
}
