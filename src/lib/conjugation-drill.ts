import { lookupVerbConjugation } from "@/lib/german/verb-conjugation-data";
import { type Card } from "@/lib/types";

export type ConjugationPerson = "ich" | "du" | "er";

const PERSONS: ConjugationPerson[] = ["ich", "du", "er"];

export type ConjugationQuestion = {
  card: Card;
  infinitive: string;
  person: ConjugationPerson;
  answer: string;
};

/**
 * A conjugation question for a card: the lemma + a randomly chosen person
 * (ich/du/er), the learner types the conjugated form. Only present-tense
 * ich/du/er are used here — Cloze's simplicity, not partizipII as a separate
 * question type, keeps this mode as small as the drill it's modeled on.
 * Returns null when `lookupVerbConjugation` has nothing for this card's
 * term — the caller counts that as a skip, same as Cloze's `clozeBlankForCard`.
 */
export function conjugationQuestionForCard(card: Card): ConjugationQuestion | null {
  const entry = lookupVerbConjugation(card.term);
  if (!entry) return null;
  const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
  const answer = entry[person];
  if (!answer) return null;
  return { card, infinitive: entry.infinitive, person, answer };
}
