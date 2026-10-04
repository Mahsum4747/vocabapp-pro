import {
  experiencedSignals,
  fixtureSignals,
  fixtureTopic,
} from "../../src/lib/adaptive-recommendations.fixtures";
import { queueLibrary } from "./library";
import type { LearningSignals } from "../../src/lib/learning-signals";
import { NOW, DAY, card, studySet, reviewed, type Seed } from "./backend";
export const practiceSet = () =>
  studySet(
    "fixture-set",
    "Everyday German",
    [
      card("Tisch", "table", {
        id: "fixture-tisch",
        enrichment: { source: "user", gender: "m" },
        example: "Der Tisch steht im Zimmer.",
      }),
      card("gehen", "to go", { id: "fixture-gehen", example: "Ich gehe heute nach Hause." }),
      card("Stuhl", "chair", {
        id: "fixture-stuhl",
        enrichment: { source: "user", gender: "m" },
        example: "Der Stuhl ist bequem.",
      }),
    ],
    { termLangCode: "de", defLangCode: "en" },
  );
export function homeSignals(kind: string): LearningSignals {
  const s = experiencedSignals();
  s.generatedAt = NOW;
  s.grammar.topics = [];
  if (kind === "overdue") Object.assign(s.vocabulary, { dueCards: 12, overdueCards: 12 });
  else if (kind === "due") s.vocabulary.dueCards = 3;
  else if (kind === "weak") s.vocabulary.weakCards = 10;
  else if (["articles", "cases", "satzbau", "conjugation", "plural"].includes(kind))
    s.grammar.topics = [
      fixtureTopic(kind, {
        accuracy: 60,
        lifetimeAttempts: 50,
        recentAttempts: 50,
        evidence: "high",
        evidenceBasis: "recentQuestions",
        lastPracticedAt: NOW - 2 * DAY,
      }),
    ];
  else if (kind === "reading")
    Object.assign(s.reading.levels.B1, {
      completedPassages: 4,
      lastPracticedAt: NOW - 2 * DAY,
      evidence: "low",
    });
  else if (kind === "chooser") {
    const n = fixtureSignals();
    n.generatedAt = NOW;
    return n;
  } else if (kind === "write")
    Object.assign(s.writing, {
      totalReviewedSubmissions: 6,
      recentReviewedSubmissions: 6,
      recentTaggedSubmissions: 6,
      recentErrorCategories: [
        {
          category: "missing_leitpunkt",
          count: 6,
          submissionsWithError: 6,
          submissionRate: null,
          severity: { major: 6, minor: 0 },
          lastSeenAt: NOW - 2 * DAY,
        },
      ],
    });
  else if (kind === "new") Object.assign(s.vocabulary, { totalActiveCards: 50, newCards: 10 });
  return s;
}

export function homeSeed(kind: string): Seed {
  const seed = queueLibrary();
  seed.sets.push(practiceSet());
  if (kind === "overdue") {
    const extra = studySet(
      "review-fixture",
      "Daily words",
      Array.from({ length: 9 }, (_, i) => card(`Wort ${i + 1}`, `word ${i + 1}`)),
    );
    seed.sets.push(extra);
    seed.progress = seed.progress!.map((p) =>
      p.dueAt !== null && p.dueAt <= NOW ? { ...p, dueAt: NOW - 3 * DAY } : p,
    );
    seed.progress.push(
      ...extra.cards.map((c) => reviewed(c.id, extra.id, { dueAt: NOW - 3 * DAY })),
    );
  }
  if (kind === "empty") {
    seed.progress = seed.sets.flatMap((s) =>
      s.cards.map((c) =>
        reviewed(c.id, s.id, {
          dueAt: NOW + 10 * DAY,
          masteryScore: 95,
          lapses: 0,
          correctReviews: 4,
          consecutiveCorrect: 4,
        }),
      ),
    );
  }
  return seed;
}
