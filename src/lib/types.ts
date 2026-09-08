/**
 * "active" (default, absent = active) shows everywhere; "excluded" is
 * skipped by study modes but still listed (faded) — "I already know this,
 * don't quiz me on it for now"; "archived" is skipped by both study modes
 * and the normal card list, reachable only via the Archived filter.
 */
export type CardStatus = "active" | "excluded" | "archived";

export type Card = {
  id: string;
  term: string;
  definition: string;
  starred: boolean;
  mastery: number;
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
 * Per-card review history, derived from `reviewEvents` — counters only.
 *
 * Deliberately holds NO mastery of its own: `Card.mastery` (0..MASTERY_MAX)
 * stays the single authority for mastery percentage and Leitner boxes. Two
 * places computing "how well is this card known" would inevitably drift.
 */
export type CardProgress = {
  userId: string;
  cardId: string;
  setId: string;
  totalReviews: number;
  correctReviews: number;
  /** Reviews correct in a row, reset to 0 by a wrong answer. */
  consecutiveCorrect: number;
  lastReviewedAt: number | null;
};

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
};
