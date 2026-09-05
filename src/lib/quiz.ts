import type { Card } from "./types";
import { MASTERY_MAX } from "./types";
import { shuffle } from "./utils";

export type McQuestion = {
  type: "mc";
  cardId: string;
  prompt: string;
  promptSide: "term" | "definition";
  options: string[];
  answer: string;
  imageUrl?: string | null;
};

export type WrittenQuestion = {
  type: "written";
  cardId: string;
  prompt: string;
  answer: string;
  imageUrl?: string | null;
};

export type TfQuestion = {
  type: "tf";
  cardId: string;
  prompt: string;
  statement: string;
  answer: boolean;
  imageUrl?: string | null;
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
  };
}

export function writtenQuestion(card: Card, ask: "term" | "definition" = "definition"): WrittenQuestion {
  return {
    type: "written",
    cardId: card.id,
    prompt: ask === "definition" ? card.definition : card.term,
    answer: ask === "definition" ? card.term : card.definition,
    imageUrl: card.imageUrl,
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

export function masteryPercent(cards: Card[]) {
  if (cards.length === 0) return 0;
  const sum = cards.reduce((acc, card) => acc + card.mastery, 0);
  return Math.round((sum / (cards.length * 5)) * 100);
}

/** Leitner box counts: index N is how many cards sit at mastery level N (0..MASTERY_MAX). */
export function leitnerBoxCounts(cards: Card[]): number[] {
  const counts = new Array(MASTERY_MAX + 1).fill(0) as number[];
  for (const card of cards) {
    const box = Math.min(Math.max(Math.round(card.mastery), 0), MASTERY_MAX);
    counts[box] += 1;
  }
  return counts;
}
