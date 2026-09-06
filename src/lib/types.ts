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
  /** Reference/cheat-sheet set: no study modes or mastery tracking, just a browsable list. */
  isReference?: boolean;
  /** Language the terms are written in (e.g. "German") — set when generated via AI. Drives text-to-speech accent; absent means use the browser's default voice. */
  termLanguage?: string;
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
