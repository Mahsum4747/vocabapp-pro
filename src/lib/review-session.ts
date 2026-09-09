import { buildReviewQueue, isStudiableSet, weakCards, type QueueEntry } from "./srs/index.ts";
import { isCardActive, type Card, type CardProgress, type StudySet } from "./types.ts";

/** One card in a library-wide review round, with the set it came from. */
export type SessionCard = {
  card: Card;
  /** The set's document id — where this card's review is recorded. */
  setId: string;
  setTitle: string;
  termLanguage?: string;
  definitionLanguage2?: string;
  /** Why the queue picked this card now. */
  band: QueueEntry["band"];
};

export type ReviewSession = {
  cards: SessionCard[];
  /**
   * The earliest future due date in the library, or null when nothing is
   * scheduled. Read straight off stored progress — it is what the caught-up
   * screen reports, and the reason that screen offers no practice button.
   */
  nextDueAt: number | null;
};

/**
 * The whole library's review round, in the queue's own priority order.
 *
 * This is the review queue that already existed, applied across sets instead
 * of inside one: `buildReviewQueue` still does the banding and the ordering,
 * and no due date is computed or moved here. Not-due cards are left out —
 * answering a card early would tell the scheduler the recall was easier than
 * it was and shorten the interval it just earned.
 */
export function buildLibrarySession(
  sets: StudySet[],
  progress: Record<string, CardProgress>,
  options: { now: number; newCardLimit?: number; filter?: "weak" },
): ReviewSession {
  const studiable = sets.filter(isStudiableSet);

  const setOfCard = new Map<string, StudySet>();
  const cards: Card[] = [];
  for (const set of studiable) {
    for (const card of set.cards) {
      // A card id is unique across sets, so one flat pool is safe and lets the
      // queue rank an overdue card in one set against a due one in another.
      setOfCard.set(card.id, set);
      cards.push(card);
    }
  }

  /**
   * Two ways to fill a round, one set of progress rows.
   *
   * The weak filter replaces the queue's selection — it is a different
   * question ("what keeps going wrong") than the queue's ("what is owed
   * today") — but it reads exactly the same stored state, computes no due
   * dates, and grades through the same path. Without the filter, nothing
   * about the round changes.
   */
  const queue: QueueEntry[] =
    options.filter === "weak"
      ? weakCards(cards, progress, { now: options.now }).map((card) => ({
          card,
          progress: progress[card.id],
          priority: 0,
          band: "weak" as const,
        }))
      : buildReviewQueue(cards, progress, {
          now: options.now,
          ...(options.newCardLimit !== undefined ? { newCardLimit: options.newCardLimit } : {}),
        });

  const sessionCards: SessionCard[] = [];
  for (const entry of queue) {
    const set = setOfCard.get(entry.card.id);
    if (!set) continue;
    sessionCards.push({
      card: entry.card,
      setId: set.id,
      setTitle: set.title,
      termLanguage: set.termLanguage,
      definitionLanguage2: set.definitionLanguage2,
      band: entry.band,
    });
  }

  let nextDueAt: number | null = null;
  for (const set of studiable) {
    for (const card of set.cards) {
      if (!isCardActive(card)) continue;
      const dueAt = progress[card.id]?.dueAt;
      if (typeof dueAt !== "number" || !Number.isFinite(dueAt) || dueAt <= options.now) continue;
      if (nextDueAt === null || dueAt < nextDueAt) nextDueAt = dueAt;
    }
  }

  return { cards: sessionCards, nextDueAt };
}
