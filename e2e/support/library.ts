import { card, DAY, NOW, reviewed, studySet, type Seed } from "./backend.ts";

/**
 * One library that exercises every branch of the review queue at once.
 * Which cards SHOULD come up is decided by the queue's documented rules
 * (overdue > due > weak > new; not-due, excluded, archived, reference and
 * one-card sets stay out), not by running the queue.
 */
export function queueLibrary(): Seed {
  const verbs = studySet("set-verbs", "Verbs", [
    card("gehen", "to go", { example: "Ich gehe nach Hause." }),
    card("kommen", "to come", { starred: true }),
    card("bleiben", "to stay"),
    card("lernen", "to learn"),
    card("sprechen", "to speak"),
    card("vergessen", "to forget"),
    card("schlafen", "to sleep", { status: "excluded" }),
    card("warten", "to wait", { status: "archived" }),
  ]);
  const nouns = studySet("set-nouns", "Nouns", [card("Tisch", "table"), card("Stuhl", "chair")]);
  const reference = studySet("set-ref", "Cheat sheet", [card("Ref eins", "one"), card("Ref zwei", "two")], {
    isReference: true,
  });
  const tiny = studySet("set-tiny", "Tiny", [card("Einzeln", "single")]);

  return {
    sets: [verbs, nouns, reference, tiny],
    dailyGoal: 10,
    progress: [
      // Overdue: more than a day past due.
      reviewed("gehen", "set-verbs", { dueAt: NOW - 3 * DAY }),
      // Due: past due, but by less than a day.
      reviewed("kommen", "set-verbs", { dueAt: NOW - 2 * 60 * 60 * 1000 }),
      // Comfortable and not due: stays out of the round.
      reviewed("bleiben", "set-verbs", { dueAt: NOW + 5 * DAY }),
      // "lernen" has no row at all: a new card.
      // Not due, but the last answer was wrong: comes up as "Needs practice".
      reviewed("sprechen", "set-verbs", {
        dueAt: NOW + 2 * DAY,
        consecutiveCorrect: 0,
        totalReviews: 2,
        correctReviews: 1,
        lapses: 1,
        masteryScore: 40,
      }),
      // Not due and not "weak" for the queue, but a weak WORD (low mastery and
      // forgotten in half its reviews): only the weak-words filter shows it.
      reviewed("vergessen", "set-verbs", {
        dueAt: NOW + 4 * DAY,
        consecutiveCorrect: 2,
        totalReviews: 4,
        correctReviews: 2,
        lapses: 2,
        masteryScore: 30,
      }),
      // Overdue, but excluded / archived / reference / one-card set: never queued.
      reviewed("schlafen", "set-verbs", { dueAt: NOW - 3 * DAY }),
      reviewed("warten", "set-verbs", { dueAt: NOW - 3 * DAY }),
      reviewed("ref eins", "set-ref", { dueAt: NOW - 3 * DAY }),
      reviewed("einzeln", "set-tiny", { dueAt: NOW - 3 * DAY }),
      // A due card in a second set: the round crosses sets.
      reviewed("tisch", "set-nouns", { dueAt: NOW - 60 * 60 * 1000 }),
      reviewed("stuhl", "set-nouns", { dueAt: NOW + 6 * DAY }),
    ],
  };
}
