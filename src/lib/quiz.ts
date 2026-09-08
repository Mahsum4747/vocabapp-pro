import type { Card, CardProgress } from "./types.ts";
import { isCardActive, MASTERY_MAX } from "./types.ts";
import { leitnerBoxOfScore } from "./srs/mastery.ts";
import { shuffle } from "./utils.ts";

/** Per-card progress for the signed-in user, keyed by card id. */
export type ProgressMap = Record<string, CardProgress>;

/**
 * One card's mastery score, as a number that is always safe to average.
 *
 * The single boundary where stored progress becomes arithmetic. A missing row
 * means unstudied (0), and so does a row whose score isn't a real number —
 * `?? 0` alone would let a stored NaN through and turn the whole set's mastery
 * into NaN%.
 */
export function masteryScoreFor(progress: ProgressMap, cardId: string): number {
  const score = progress[cardId]?.masteryScore;
  return typeof score === "number" && Number.isFinite(score) ? score : 0;
}

export type McQuestion = {
  type: "mc";
  cardId: string;
  prompt: string;
  promptSide: "term" | "definition";
  options: string[];
  answer: string;
  imageUrl?: string | null;
  /** The card's example sentence — it contains the term, so only ever shown after the answer is revealed. */
  example?: string | null;
};

export type WrittenQuestion = {
  type: "written";
  cardId: string;
  prompt: string;
  answer: string;
  imageUrl?: string | null;
  example?: string | null;
};

export type TfQuestion = {
  type: "tf";
  cardId: string;
  prompt: string;
  statement: string;
  answer: boolean;
  imageUrl?: string | null;
  example?: string | null;
};

export type TestQuestion = McQuestion | WrittenQuestion | TfQuestion;

export function multipleChoice(
  cards: Card[],
  card: Card,
  ask: "term" | "definition" = "definition",
  optionCount = 4,
): McQuestion {
  const answer = ask === "definition" ? card.term : card.definition;
  const pool = cards.filter((c) => c.id !== card.id);
  const distractors = shuffle(pool)
    .slice(0, Math.max(0, optionCount - 1))
    .map((c) => (ask === "definition" ? c.term : c.definition));
  const options = shuffle([answer, ...distractors]);
  return {
    type: "mc",
    cardId: card.id,
    prompt: ask === "definition" ? card.definition : card.term,
    promptSide: ask,
    options,
    answer,
    imageUrl: card.imageUrl,
    example: card.example,
  };
}

export function writtenQuestion(
  card: Card,
  ask: "term" | "definition" = "definition",
): WrittenQuestion {
  return {
    type: "written",
    cardId: card.id,
    prompt: ask === "definition" ? card.definition : card.term,
    answer: ask === "definition" ? card.term : card.definition,
    imageUrl: card.imageUrl,
    example: card.example,
  };
}

export function trueFalse(cards: Card[], card: Card): TfQuestion {
  const others = cards.filter((c) => c.id !== card.id);
  const lie = others.length > 0 && Math.random() < 0.5;
  const paired = lie ? others[Math.floor(Math.random() * others.length)] : card;
  const statement = `${card.term}  →  ${paired?.definition ?? card.definition}`;
  return {
    type: "tf",
    cardId: card.id,
    prompt: "Is this pairing correct?",
    statement,
    answer: !lie,
    imageUrl: card.imageUrl,
    example: card.example,
  };
}

export function buildTest(cards: Card[], limit = 12): TestQuestion[] {
  const usable = shuffle(cards.filter((c) => c.term.trim() && c.definition.trim()));
  const picked = usable.slice(0, Math.min(limit, usable.length));
  return picked.map((card, index) => {
    const slot = index % 3;
    if (slot === 0 && usable.length >= 3) return multipleChoice(usable, card);
    if (slot === 1) return writtenQuestion(card);
    return trueFalse(usable, card);
  });
}

/**
 * Has this user actually reviewed this card?
 *
 * A card with no progress row has never been seen; so has one whose row was
 * created empty (the deferred backfill seeds zeroed rows). Both are
 * "not started", which is a different thing from "reviewed and doing badly" —
 * merging them makes a brand new set look like a set of failures.
 */
export function hasBeenReviewed(progress: ProgressMap, cardId: string): boolean {
  const row = progress[cardId];
  return row !== undefined && Number.isFinite(row.totalReviews) && row.totalReviews > 0;
}

export type MasteryStats = {
  /** 0..100 over every active card. Never-reviewed cards contribute 0. */
  percent: number;
  /** Active cards with at least one recorded review. */
  reviewed: number;
  /** Active cards never reviewed — unstarted, not failed. */
  notStarted: number;
  /** Active cards in total (excluded/archived are not counted). */
  active: number;
};

// Mastery and Leitner boxes are per-user, so they read the signed-in user's
// CardProgress rather than anything on the shared card.
//
// Excluded/archived cards aren't part of the working set — they don't count
// toward mastery or Leitner box totals.

/**
 * Mastery for a set, with the unstarted cards counted separately.
 *
 * `percent` still divides by every active card — "how much of this set do I
 * know" has to treat untouched cards as not-yet-known, or a set with one
 * mastered card would read 100%. But `notStarted` travels alongside it so the
 * UI can say "12% · 39 not started" rather than implying 39 failures.
 */
export function masteryStats(cards: Card[], progress: ProgressMap): MasteryStats {
  const active = cards.filter(isCardActive);
  let reviewed = 0;
  let sum = 0;
  for (const card of active) {
    if (hasBeenReviewed(progress, card.id)) reviewed += 1;
    sum += masteryScoreFor(progress, card.id);
  }
  return {
    percent: active.length === 0 ? 0 : Math.round(sum / active.length),
    reviewed,
    notStarted: active.length - reviewed,
    active: active.length,
  };
}

export function masteryPercent(cards: Card[], progress: ProgressMap): number {
  return masteryStats(cards, progress).percent;
}

/**
 * Which Leitner box a card sits in for this user, or null when it has never
 * been reviewed. Null rather than 0: box 0 means "reviewed and still weak",
 * and an untouched card has not earned that.
 */
export function leitnerBoxOf(card: Card, progress: ProgressMap): number | null {
  if (!hasBeenReviewed(progress, card.id)) return null;
  return leitnerBoxOfScore(masteryScoreFor(progress, card.id));
}

export type LeitnerCounts = {
  /** Index N is how many REVIEWED active cards sit in box N (0..MASTERY_MAX). */
  boxes: number[];
  /** Active cards that have never been reviewed, which belong in no box. */
  notStarted: number;
};

export function leitnerBoxCounts(cards: Card[], progress: ProgressMap): LeitnerCounts {
  const boxes = new Array(MASTERY_MAX + 1).fill(0) as number[];
  let notStarted = 0;
  for (const card of cards) {
    if (!isCardActive(card)) continue;
    const box = leitnerBoxOf(card, progress);
    if (box === null) notStarted += 1;
    else boxes[box] += 1;
  }
  return { boxes, notStarted };
}
