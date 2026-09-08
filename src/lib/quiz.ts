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

// Mastery and Leitner boxes are per-user, so they read the signed-in user's
// CardProgress rather than anything on the shared card. A card with no
// progress row simply hasn't been studied yet, and counts as 0.
//
// Excluded/archived cards aren't part of the working set — they don't count
// toward mastery or Leitner box totals.
export function masteryPercent(cards: Card[], progress: ProgressMap): number {
  const active = cards.filter(isCardActive);
  if (active.length === 0) return 0;
  const sum = active.reduce((acc, card) => acc + masteryScoreFor(progress, card.id), 0);
  return Math.round(sum / active.length);
}

/** Which Leitner box (0..MASTERY_MAX) a card currently sits in for this user. */
export function leitnerBoxOf(card: Card, progress: ProgressMap): number {
  return leitnerBoxOfScore(masteryScoreFor(progress, card.id));
}

/** Leitner box counts: index N is how many active cards sit in box N (0..MASTERY_MAX). */
export function leitnerBoxCounts(cards: Card[], progress: ProgressMap): number[] {
  const counts = new Array(MASTERY_MAX + 1).fill(0) as number[];
  for (const card of cards) {
    if (!isCardActive(card)) continue;
    counts[leitnerBoxOf(card, progress)] += 1;
  }
  return counts;
}
