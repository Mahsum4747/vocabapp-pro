import type { Card } from "./types";
import { shuffle } from "./utils";

export type McQuestion = {
  type: "mc";
  cardId: string;
  prompt: string;
  promptSide: "term" | "definition";
  options: string[];
  answer: string;
};

export type WrittenQuestion = {
  type: "written";
  cardId: string;
  prompt: string;
  answer: string;
};

export type TfQuestion = {
  type: "tf";
  cardId: string;
  prompt: string;
  statement: string;
  answer: boolean;
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
  };
}

export function writtenQuestion(card: Card, ask: "term" | "definition" = "definition"): WrittenQuestion {
  return {
    type: "written",
    cardId: card.id,
    prompt: ask === "definition" ? card.definition : card.term,
    answer: ask === "definition" ? card.term : card.definition,
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
