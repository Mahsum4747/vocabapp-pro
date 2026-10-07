import type { LearningSignals, GrammarTopicSignal, ReadingLevel } from "./learning-signals";
import { CURRICULUM_TOPIC_IDS, CEFR_LEVEL } from "./grammar-curriculum";
export const FIXTURE_NOW = Date.UTC(2026, 9, 4, 12);
export const FIXTURE_DAY = 86400000;
export const fixtureTopic = (
  topicId: string,
  extra: Partial<GrammarTopicSignal> = {},
): GrammarTopicSignal => ({
  topicId,
  source: "curriculum",
  displayName: topicId,
  cefrLevel: CEFR_LEVEL[topicId] ?? null,
  accuracy: null,
  lifetimeAttempts: 0,
  recentAttempts: null,
  recentRounds: null,
  evidence: "none",
  evidenceBasis: "lifetimeQuestions",
  lastPracticedAt: null,
  ...extra,
});
export function fixtureSignals(): LearningSignals {
  const drill = {
    reviewMissCount: 0,
    attempts: 0,
    correct: 0,
    misses: 0,
    accuracy: null,
    lastPracticedAt: null,
    evidence: "none" as const,
  };
  return {
    generatedAt: FIXTURE_NOW,
    vocabulary: {
      practiceTargets: {},
      totalActiveCards: 0,
      reviewedCards: 0,
      newCards: 0,
      dueCards: 0,
      overdueCards: 0,
      weakCards: 0,
      masteredCards: 0,
      averageMastery: null,
      evidence: "none",
      recentAccuracy: null,
      recentReviewCount: 0,
      lastReviewedAt: null,
      dominantWeaknesses: { article: { ...drill }, case: { ...drill } },
    },
    grammar: { topics: CURRICULUM_TOPIC_IDS.map((id) => fixtureTopic(id)), pasteTopics: [] },
    diagnostics: { gaps: [], observationCount: 0 },
    remediation: { recent: [] },
    reading: {
      levels: Object.fromEntries(
        (["A1", "A2", "B1", "B2"] as ReadingLevel[]).map((level, i) => [
          level,
          {
            totalPassages: [35, 15, 30, 25][i]!,
            completedPassages: 0,
            completionPercent: 0,
            lastPracticedAt: null,
            accuracy: null,
            evidence: "none",
          },
        ]),
      ) as LearningSignals["reading"]["levels"],
      overallBundledAccuracy: {
        accuracy: null,
        lifetimeAttempts: 0,
        recentAttempts: null,
        recentRounds: null,
        evidence: "none",
        evidenceBasis: "lifetimeQuestions",
        lastPracticedAt: null,
      },
      pasteTopics: [],
    },
    writing: {
      totalReviewedSubmissions: 0,
      recentReviewedSubmissions: 0,
      recentTaggedSubmissions: 0,
      windowSize: 20,
      evidence: "none",
      recentErrorCategories: [],
      lastReviewedAt: null,
    },
    activity: {
      currentStreak: 0,
      longestStreak: null,
      reviewsToday: 0,
      uniqueWordsToday: 0,
      dailyGoal: 10,
      goalProgress: 0,
      activeDays7: 0,
      activeDays30: 0,
      localDay: "2026-10-04",
      utcDay: "2026-10-04",
      timeZone: "UTC",
    },
    preferences: { explanationLanguage: "en", direction: "learn_de" },
  };
}
export function experiencedSignals(): LearningSignals {
  const s = fixtureSignals();
  Object.assign(s.vocabulary, {
    totalActiveCards: 40,
    reviewedCards: 40,
    masteredCards: 40,
    averageMastery: 90,
    evidence: "high",
    practiceTargets: {
      articles: "fixture-set",
      cases: "fixture-set",
      conjugation: "fixture-set",
      satzbau: "fixture-set",
      cloze: "fixture-set",
      write: "fixture-set",
    },
  });
  return s;
}
/** Synthetic scenarios only, never production learner data. */
export function recommendationExamples(): Record<string, LearningSignals> {
  const overdue = experiencedSignals();
  Object.assign(overdue.vocabulary, { dueCards: 12, overdueCards: 12 });
  const grammarWeak = experiencedSignals();
  grammarWeak.grammar.topics = [
    fixtureTopic("cases", {
      accuracy: 60,
      lifetimeAttempts: 50,
      recentAttempts: 50,
      recentRounds: 5,
      evidence: "high",
      evidenceBasis: "recentQuestions",
      lastPracticedAt: FIXTURE_NOW - 15 * FIXTURE_DAY,
    }),
  ];
  const writingError = experiencedSignals();
  Object.assign(writingError.writing, {
    totalReviewedSubmissions: 6,
    recentReviewedSubmissions: 6,
    recentTaggedSubmissions: 6,
    evidence: "low",
    lastReviewedAt: FIXTURE_NOW - 2 * FIXTURE_DAY,
    recentErrorCategories: [
      {
        category: "verb_position",
        count: 6,
        submissionsWithError: 6,
        submissionRate: null,
        severity: { major: 4, minor: 2 },
        lastSeenAt: FIXTURE_NOW - 2 * FIXTURE_DAY,
      },
    ],
  });
  const strong = experiencedSignals();
  strong.grammar.topics = strong.grammar.topics.map((t) => ({
    ...t,
    accuracy: 95,
    lifetimeAttempts: 50,
    recentAttempts: 50,
    recentRounds: 5,
    evidence: "high",
    evidenceBasis: "recentQuestions",
    lastPracticedAt: FIXTURE_NOW - 2 * FIXTURE_DAY,
  }));
  for (const l of Object.values(strong.reading.levels)) {
    l.completedPassages = l.totalPassages;
    l.completionPercent = 100;
    l.lastPracticedAt = FIXTURE_NOW - 2 * FIXTURE_DAY;
    l.evidence = "high";
  }
  Object.assign(strong.activity, {
    goalProgress: 1,
    uniqueWordsToday: 10,
    activeDays7: 4,
    activeDays30: 12,
  });
  return { overdue, grammarWeak, writingError, brandNew: fixtureSignals(), strong };
}
