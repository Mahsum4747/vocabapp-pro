import type { Card, CardProgress, StudySet } from "../types.ts";
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
 * What a set (or a whole library) currently owes the learner.
 *
 * "Due" means the scheduler's due date has passed: `due` counts every card
 * with `dueAt <= now`, and `overdue` is the subset more than a day past it, so
 * `overdue` is always included in `due` rather than added to it.
 *
 * NEW cards are counted separately and never folded into `due`. A card that
 * has never been seen isn't owed a review — it's unstarted work — and merging
 * the two would let a big new set read as a huge review backlog.
 */
export type ReviewSummary = {
  /** dueAt <= now. Includes `overdue`. */
  due: number;
  /** More than a day past due. */
  overdue: number;
  /** Never studied — no progress row yet. */
  fresh: number;
  /** Not due, but the last answer was wrong or the card keeps being forgotten. */
  weak: number;
  /** Not due and in good shape. */
  notDue: number;
  /** Active cards considered (excluded/archived are not counted). */
  total: number;
};

/**
 * Count what's waiting, using the same banding the queue orders by — so the
 * number on a button and the cards a session actually serves can't disagree.
 */
export function reviewSummary(
  cards: Card[],
  progressByCardId: Map<string, CardProgress> | Record<string, CardProgress>,
  options: Pick<QueueOptions, "now">,
): ReviewSummary {
  const entries = buildReviewQueue(cards, progressByCardId, {
    now: options.now,
    includeNotDue: true,
  });

  const count = (band: Band) => entries.filter((e) => e.band === band).length;
  const overdue = count("overdue");

  return {
    due: overdue + count("due"),
    overdue,
    fresh: count("fresh"),
    weak: count("weak"),
    notDue: count("early"),
    total: entries.length,
  };
}

/** Is there anything worth opening a review session for? */
export function hasReviewWork(summary: ReviewSummary): boolean {
  return summary.due > 0 || summary.fresh > 0 || summary.weak > 0;
}

/**
 * Can a review session draw from this set?
 *
 * Reference sets are lookup material, not study material, and a one-card set
 * has no round worth running. Shared so the library-wide counts and the
 * library-wide session agree on what they are counting.
 */
export function isStudiableSet(set: StudySet): boolean {
  return !set.isReference && set.cards.length >= 2;
}

export type LibraryReview = {
  /** Every set's counts added together. */
  totals: ReviewSummary;
  /** The set to open first, or undefined when nothing is waiting anywhere. */
  target?: { set: StudySet; summary: ReviewSummary };
};

/**
 * The library-wide view: how much is waiting in total, and which set to open.
 *
 * Review happens inside a set, so the "start review" action has to pick one.
 * It picks the set with the most overdue cards, then the most due, then the
 * most new — i.e. wherever the learner is furthest behind.
 *
 * Reference sets and sets too small to study are left out entirely; they have
 * no review flow to send anyone into.
 */
export function summarizeLibrary(
  sets: StudySet[],
  progressByCardId: Map<string, CardProgress> | Record<string, CardProgress>,
  options: Pick<QueueOptions, "now">,
): LibraryReview {
  const perSet = sets
    .filter(isStudiableSet)
    .map((set) => ({ set, summary: reviewSummary(set.cards, progressByCardId, options) }));

  const totals = perSet.reduce<ReviewSummary>(
    (acc, { summary }) => ({
      due: acc.due + summary.due,
      overdue: acc.overdue + summary.overdue,
      fresh: acc.fresh + summary.fresh,
      weak: acc.weak + summary.weak,
      notDue: acc.notDue + summary.notDue,
      total: acc.total + summary.total,
    }),
    { due: 0, overdue: 0, fresh: 0, weak: 0, notDue: 0, total: 0 },
  );

  const best = [...perSet].sort(
    (a, b) =>
      b.summary.overdue - a.summary.overdue ||
      b.summary.due - a.summary.due ||
      b.summary.fresh - a.summary.fresh,
  )[0];

  const hasWork = best !== undefined && (best.summary.due > 0 || best.summary.fresh > 0);
  return { totals, target: hasWork ? best : undefined };
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
