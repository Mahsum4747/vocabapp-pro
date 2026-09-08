import type { SchedulerState } from "./srs/scheduler.ts";

/**
 * "active" (default, absent = active) shows everywhere; "excluded" is
 * skipped by study modes but still listed (faded) — "I already know this,
 * don't quiz me on it for now"; "archived" is skipped by both study modes
 * and the normal card list, reachable only via the Archived filter.
 */
export type CardStatus = "active" | "excluded" | "archived";

/**
 * Card CONTENT. Shared and copyable — a card means the same thing to every
 * user who has it, so nothing user-specific belongs here. How well *you* know
 * a card lives in `CardProgress`, under your own user id.
 *
 * (`starred` is the one remaining per-user flag; it is a bookmark on the set
 * you own rather than learning state, and copies reset it.)
 */
export type Card = {
  id: string;
  term: string;
  definition: string;
  starred: boolean;
  /** Optional card image (Firebase Storage download URL). Null = no image. */
  imageUrl: string | null;
  /**
   * Optional example sentence using the term, written in the set's term
   * language. Kept separate from `definition` (which is the meaning, in the
   * definition language) so each can be shown, searched, and spoken on its own.
   */
  example?: string | null;
  status?: CardStatus;
};

export function isCardActive(card: Card): boolean {
  return !card.status || card.status === "active";
}

/**
 * A card as it should land in someone else's library: the same content, none
 * of the original owner's curation. Starring resets and the status goes back
 * to active (absent = active), so a copied set is never pre-marked as starred,
 * excluded or archived. Learning progress needs no resetting here — it lives
 * under each user's own id, so a copier simply has none yet.
 *
 * Shared by both copy paths — a whole public set, and individual cards moved
 * or copied between sets — so the two can't drift apart again.
 *
 * `id` comes from the caller's id generator, which keeps this pure and
 * testable; every copy must get a fresh id rather than reusing the source's.
 */
export function freshCardCopy(card: Card, id: string): Card {
  return {
    id,
    term: card.term,
    definition: card.definition,
    imageUrl: card.imageUrl,
    example: card.example ?? null,
    starred: false,
  };
}

export type StudySet = {
  id: string;
  title: string;
  description: string;
  subject: string;
  createdAt: number;
  updatedAt: number;
  lastStudiedAt: number | null;
  cards: Card[];
  ownerId: string;
  isPublic: boolean;
  /**
   * Short, unguessable public identifier used in share links (/sets/{shareId})
   * so the Firestore document id never has to be handed out. Optional only
   * because sets created before this existed are backfilled by a migration.
   */
  shareId?: string;
  /** How many times this set has been copied into someone else's library. */
  copyCount?: number;
  /** Set on a copy, pointing back at the public set it came from. */
  copiedFrom?: { setId: string; ownerId: string; title: string };
  /** Reference/cheat-sheet set: no study modes or mastery tracking, just a browsable list. */
  isReference?: boolean;
  /** Language the terms are written in (e.g. "German") — set when generated via AI. Drives text-to-speech accent; absent means use the browser's default voice. */
  termLanguage?: string;
  /** Optional single-level grouping label (e.g. "A1", "İş Almancası") — free text, not nested. */
  folder?: string;
};

export const SUBJECTS = [
  "Language",
  "Science",
  "History",
  "Geography",
  "Software",
  "General",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const MASTERY_MAX = 5;

/**
 * How well a card went in one review. Only "again" counts as a failure; the
 * other three are degrees of success.
 */
export type ReviewRating = "again" | "hard" | "good" | "easy";

export function isCorrectRating(rating: ReviewRating): boolean {
  return rating !== "again";
}

/**
 * One user's progress on one card: the scheduler's memory state, the review
 * counters derived from `reviewEvents`, and the mastery score shown in the UI.
 *
 * This is the single authority for how well a card is known. Card content is
 * shared and copyable; this is not — it is stored under the user's own id, so
 * two people studying the same public set have entirely separate progress.
 */
export type CardProgress = SchedulerState & {
  userId: string;
  cardId: string;
  setId: string;
  totalReviews: number;
  correctReviews: number;
  /** Reviews correct in a row, reset to 0 by a wrong answer. */
  consecutiveCorrect: number;
  lastReviewedAt: number | null;
  /**
   * The LOCAL calendar day of the last review, "YYYY-MM-DD", as the client
   * reported it.
   *
   * Stored next to `lastReviewedAt` rather than derived from it: the epoch
   * timestamp is the server's, and the server does not know the viewer's
   * timezone, so it cannot tell which local day an evening review belongs to.
   * This is what lets a second review of the same card today be recognised as
   * the same day. Rows written before this field existed have it absent.
   */
  lastReviewedDate: string | null;
  /**
   * 0..100, derived from scheduler state for display and the Leitner boxes.
   * A product metric only: the scheduler never reads it back, so it cannot
   * influence when a card is next shown.
   */
  masteryScore: number;
  /** Which scheduler produced the state above, so stored rows stay traceable. */
  scheduler: string;
};

/** Progress for a card that has never been reviewed. */
export function initialProgress(
  userId: string,
  cardId: string,
  setId: string,
  state: SchedulerState,
  scheduler: string,
): CardProgress {
  return {
    ...state,
    userId,
    cardId,
    setId,
    totalReviews: 0,
    correctReviews: 0,
    consecutiveCorrect: 0,
    lastReviewedAt: null,
    lastReviewedDate: null,
    masteryScore: 0,
    scheduler,
  };
}

/** One graded review. The raw, append-only log everything else is derived from. */
export type ReviewEvent = {
  id: string;
  userId: string;
  cardId: string;
  setId: string;
  rating: ReviewRating;
  /** Server clock, not the browser's. */
  reviewedAt: number;
  responseTimeMs?: number;
};

/** Per-day totals, keyed by the viewer's local calendar day (YYYY-MM-DD). */
export type DailyStats = {
  date: string;
  reviews: number;
  correctReviews: number;
  studySeconds: number;
  /**
   * Distinct cards reviewed today — one per card however many times it was
   * graded. "How many words did I work on" is a different question from "how
   * many answers did I give", and a daily goal is about the former.
   */
  uniqueWordsReviewed: number;
};
