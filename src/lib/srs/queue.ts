import type { Card, CardProgress } from "../types.ts";
import { isCardActive } from "../types.ts";

/**
 * How the queue ranks candidates. Every number that shapes the ordering lives
 * here, so the policy can be retuned without touching the selection code.
 *
 * The bands are spaced far enough apart that they never interleave: an overdue
 * card always outranks a due one, which always outranks a weak card, and so
 * on. Within a band the bonuses decide the order.
 */
export type QueueWeights = {
  overdue: number;
  due: number;
  weak: number;
  fresh: number;
  /** Not due yet — only ever reached when nothing better is left. */
  early: number;
  /** Per day overdue, added on top of the overdue band (capped). */
  overdueDayBonus: number;
  maxOverdueBonus: number;
  /** Added per recorded lapse, so repeatedly forgotten cards come back sooner. */
  lapseBonus: number;
  maxLapseBonus: number;
  /** Added when the last answer was wrong. */
  recentlyFailedBonus: number;
};

export const DEFAULT_QUEUE_WEIGHTS: QueueWeights = {
  overdue: 1000,
  due: 800,
  weak: 600,
  fresh: 400,
  early: 100,
  overdueDayBonus: 2,
  maxOverdueBonus: 150,
  lapseBonus: 15,
  maxLapseBonus: 90,
  recentlyFailedBonus: 60,
};

export type QueueOptions = {
  now: number;
  /** Cap on how many never-seen cards a single session introduces. */
  newCardLimit?: number;
  /** Cap on the returned queue length. */
  limit?: number;
  /** Include cards that are not due yet (used when there is nothing else to study). */
  includeNotDue?: boolean;
  weights?: QueueWeights;
};

const DAY_MS = 24 * 60 * 60 * 1000;

type Band = "overdue" | "due" | "weak" | "fresh" | "early";

function bandOf(progress: CardProgress | undefined, now: number): Band {
  if (!progress || progress.state === "new" || progress.dueAt === null) return "fresh";
  if (progress.dueAt < now - DAY_MS) return "overdue";
  if (progress.dueAt <= now) return "due";
  // Not due, but the last answer was wrong or it keeps being forgotten —
  // worth revisiting ahead of comfortable cards.
  if (progress.consecutiveCorrect === 0 && progress.totalReviews > 0) return "weak";
  if (progress.lapses > 0 && progress.state === "learning") return "weak";
  return "early";
}

function priorityOf(
  progress: CardProgress | undefined,
  options: Required<Pick<QueueOptions, "now">> & { weights: QueueWeights },
): number {
  const { now, weights } = options;
  const band = bandOf(progress, now);
  let score = weights[band];

  if (progress) {
    if (band === "overdue" && progress.dueAt !== null) {
      const daysOverdue = (now - progress.dueAt) / DAY_MS;
      score += Math.min(daysOverdue * weights.overdueDayBonus, weights.maxOverdueBonus);
    }
    score += Math.min(progress.lapses * weights.lapseBonus, weights.maxLapseBonus);
    if (progress.totalReviews > 0 && progress.consecutiveCorrect === 0) {
      score += weights.recentlyFailedBonus;
    }
  }

  return score;
}

export type QueueEntry = {
  card: Card;
  progress: CardProgress | undefined;
  priority: number;
  band: Band;
};

/**
 * Order cards for a study session.
 *
 * The queue only ORDERS and SELECTS. It reads the due dates the scheduler
 * produced and never computes an interval or a due date of its own — there is
 * exactly one place that decides when a card comes back, and it is the
 * scheduler.
 *
 * Roughly: overdue first, then due now, then weak/recently failed, then new
 * cards (rate-limited), and comfortable cards that are not due yet are left
 * out entirely unless the caller asks for them.
 */
export function buildReviewQueue(
  cards: Card[],
  progressByCardId: Map<string, CardProgress> | Record<string, CardProgress>,
  options: QueueOptions,
): QueueEntry[] {
  const weights = options.weights ?? DEFAULT_QUEUE_WEIGHTS;
  const lookup =
    progressByCardId instanceof Map
      ? (id: string) => progressByCardId.get(id)
      : (id: string) => progressByCardId[id];

  const entries: QueueEntry[] = cards.filter(isCardActive).map((card) => {
    const progress = lookup(card.id);
    return {
      card,
      progress,
      band: bandOf(progress, options.now),
      priority: priorityOf(progress, { now: options.now, weights }),
    };
  });

  const includeNotDue = options.includeNotDue ?? false;
  let selected = includeNotDue ? entries : entries.filter((e) => e.band !== "early");

  // Stable ordering: priority first, then the card's own order, so a session
  // does not reshuffle for equal-priority cards on every render.
  const order = new Map(cards.map((card, index) => [card.id, index]));
  selected.sort(
    (a, b) => b.priority - a.priority || (order.get(a.card.id) ?? 0) - (order.get(b.card.id) ?? 0),
  );

  if (options.newCardLimit !== undefined) {
    let introduced = 0;
    selected = selected.filter((entry) => {
      if (entry.band !== "fresh") return true;
      introduced += 1;
      return introduced <= options.newCardLimit!;
    });
  }

  return options.limit === undefined ? selected : selected.slice(0, options.limit);
}

/**
 * The queue as plain cards, with the safety net the study modes need: if
 * nothing is due, fall back to everything rather than showing an empty round.
 */
export function queuedCards(
  cards: Card[],
  progressByCardId: Map<string, CardProgress> | Record<string, CardProgress>,
  options: QueueOptions,
): Card[] {
  const due = buildReviewQueue(cards, progressByCardId, options).map((entry) => entry.card);
  if (due.length > 0) return due;
  return buildReviewQueue(cards, progressByCardId, { ...options, includeNotDue: true }).map(
    (entry) => entry.card,
  );
}
