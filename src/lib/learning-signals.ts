import { evidenceLevel, type EvidenceLevel } from "./learning-evidence";
export { evidenceLevel, type EvidenceLevel } from "./learning-evidence";
import { buildSignalPracticeTargets, type SignalPracticeTargets } from "./learning-signal-targets";
import {
  isCardActive,
  isCorrectRating,
  readDailyStats,
  type StudySet,
  type CardProgress,
  type ReviewEvent,
  type ArticleDrillProgress,
} from "./types";
import { isStudiableSet, isWeakWord, summarizeLibrary } from "./srs/queue";
import { masteryStats, masteryScoreFor } from "./quiz";
import { MASTERED_SCORE } from "./gamification";
import { readUserSettings } from "./daily-goal";
import { readLearningPrefs, type LearningPrefs } from "./learning-prefs";
import { readStreak, todayUTC, type StoredStreak } from "./streak-rules";
import { CURRICULUM_TOPIC_IDS, CEFR_LEVEL } from "./grammar-curriculum";
import { RECENT_WINDOW } from "./progress-window";
import { ERROR_CATEGORIES, type ErrorCategory } from "./write-feedback-types";
import {
  buildLearnerGapStates,
  type DiagnosticObservation,
  type LearnerGapState,
} from "./learner-diagnostics";

export const WRITING_SIGNAL_WINDOW = 20;
export const REVIEW_SIGNAL_WINDOW = 100;
export const READING_LEVELS = ["A1", "A2", "B1", "B2"] as const;
export type ReadingLevel = (typeof READING_LEVELS)[number];
export type AccuracySignal = {
  accuracy: number | null;
  lifetimeAttempts: number;
  recentAttempts: number | null;
  recentRounds: number | null;
  evidence: EvidenceLevel;
  evidenceBasis: "recentQuestions" | "lifetimeQuestions";
  lastPracticedAt: number | null;
};
export type GrammarTopicSignal = AccuracySignal & {
  topicId: string;
  source: "curriculum" | "paste";
  displayName: string;
  cefrLevel: string | null;
};
export type ReadingLevelSignal = {
  totalPassages: number;
  completedPassages: number;
  completionPercent: number;
  lastPracticedAt: number | null;
  accuracy: null;
  evidence: EvidenceLevel;
};
export type WritingErrorSignal = {
  category: ErrorCategory;
  count: number;
  submissionsWithError: number;
  submissionRate: number | null;
  severity: { minor: number; major: number };
  lastSeenAt: number | null;
};
export type GrammarRemediationSignal = {
  id: string;
  topic: string;
  diagnosticTargetId?: string;
  correctCount: number;
  totalCount: number;
  completedAt: number;
  nextReviewAt: number;
};

export type DrillSignal = {
  /** Existing vocabulary-row miss counter; independent of drill attempts. */
  reviewMissCount: number;
  attempts: number;
  correct: number;
  misses: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  evidence: EvidenceLevel;
};
export type LearningSignals = {
  generatedAt: number;
  vocabulary: {
    practiceTargets: SignalPracticeTargets;
    totalActiveCards: number;
    reviewedCards: number;
    newCards: number;
    dueCards: number;
    overdueCards: number;
    weakCards: number;
    masteredCards: number;
    averageMastery: number | null;
    evidence: EvidenceLevel;
    recentAccuracy: number | null;
    recentReviewCount: number;
    lastReviewedAt: number | null;
    dominantWeaknesses: { article: DrillSignal; case: DrillSignal };
  };
  grammar: { topics: GrammarTopicSignal[]; pasteTopics: GrammarTopicSignal[] };
  diagnostics: { gaps: LearnerGapState[]; observationCount: number };
  remediation: { recent: GrammarRemediationSignal[] };
  reading: {
    levels: Record<ReadingLevel, ReadingLevelSignal>;
    overallBundledAccuracy: AccuracySignal;
    pasteTopics: (GrammarTopicSignal & { level: ReadingLevel })[];
  };
  writing: {
    totalReviewedSubmissions: number;
    recentReviewedSubmissions: number;
    recentTaggedSubmissions: number;
    windowSize: number;
    evidence: EvidenceLevel;
    recentErrorCategories: WritingErrorSignal[];
    lastReviewedAt: number | null;
  };
  activity: {
    currentStreak: number;
    longestStreak: null;
    reviewsToday: number;
    uniqueWordsToday: number;
    dailyGoal: number;
    goalProgress: number;
    activeDays7: number;
    activeDays30: number;
    localDay: string;
    timeZone: string;
    utcDay: string;
  };
  preferences: LearningPrefs;
};
/** Raw projected persisted data. No feedback text, sentences, questions or user ID returned. */
export type LearningSignalsInput = {
  now: number;
  sets: StudySet[];
  progress: CardProgress[];
  drills: ArticleDrillProgress[];
  reviewEvents: ReviewEvent[];
  grammar: Record<string, unknown>;
  lesen: Record<string, unknown>;
  grammarPaste: (Record<string, unknown> & { id: string })[];
  lesenPaste: (Record<string, unknown> & { id: string })[];
  writing: { id: string; createdAt?: unknown; errorTags?: unknown }[];
  diagnostics: DiagnosticObservation[];
  remediation: GrammarRemediationSignal[];
  totalWritingSubmissions: number;
  dailyStats: { date: string; data: unknown }[];
  profile: unknown;
  streak: StoredStreak | null;
  passages: readonly { id: string; level: ReadingLevel }[];
};
const object = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const count = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
const timestamp = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null;
const percent = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100 ? v : null;
const latest = (values: (number | null)[]): number | null =>
  values.reduce<number | null>((a, b) => (b === null ? a : a === null ? b : Math.max(a, b)), null);

export function accuracySignal(raw: unknown): AccuracySignal {
  const r = object(raw);
  const rounds = Array.isArray(r.recentRounds) ? r.recentRounds.slice(-RECENT_WINDOW) : null;
  const validRounds =
    rounds !== null &&
    rounds.every((value) => {
      const round = object(value);
      return (
        Number.isInteger(round.total) &&
        Number.isInteger(round.correct) &&
        Number(round.total) >= 1 &&
        Number(round.total) <= 50 &&
        Number(round.correct) >= 0 &&
        Number(round.correct) <= Number(round.total)
      );
    });
  const recentAttempts = validRounds
    ? rounds.reduce<number>((n, v) => n + Number(object(v).total), 0)
    : null;
  const lifetimeAttempts = count(r.totalAttempts);
  return {
    // Stored accuracy stays authoritative; legacy history is never reconstructed.
    accuracy: percent(r.accuracy),
    lifetimeAttempts,
    recentAttempts,
    recentRounds: validRounds ? rounds.length : null,
    evidence: evidenceLevel(recentAttempts ?? lifetimeAttempts),
    evidenceBasis: recentAttempts === null ? "lifetimeQuestions" : "recentQuestions",
    lastPracticedAt: timestamp(r.lastPracticedAt),
  };
}
function topic(
  topicId: string,
  raw: unknown,
  source: GrammarTopicSignal["source"],
): GrammarTopicSignal {
  const r = object(raw);
  return {
    ...accuracySignal(raw),
    topicId,
    source,
    displayName:
      source === "paste" && typeof r.topic === "string" ? r.topic : topicId.split("-").join(" "),
    cefrLevel: source === "curriculum" ? (CEFR_LEVEL[topicId] ?? null) : null,
  };
}
/** Calendar keys advance in calendar days, avoiding DST's 23/25 hour days. */
export function signalDayKeys(now: number, timeZone: string): { keys: string[]; timeZone: string } {
  let zone = timeZone;
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
  } catch {
    zone = "UTC";
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
  }
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  const anchor = Date.parse(`${part("year")}-${part("month")}-${part("day")}T00:00:00Z`);
  return {
    timeZone: zone,
    keys: Array.from({ length: 30 }, (_, i) =>
      new Date(anchor - i * 86400000).toISOString().slice(0, 10),
    ),
  };
}
export function buildLearningSignals(input: LearningSignalsInput): LearningSignals {
  const { now } = input;
  const sets = input.sets.filter(isStudiableSet);
  const cards = sets.flatMap((s) => s.cards.filter(isCardActive));
  const membership = new Map(
    sets.flatMap((s) => s.cards.filter(isCardActive).map((c) => [c.id, s.id] as const)),
  );
  const progress = Object.fromEntries(
    input.progress.filter((p) => membership.get(p.cardId) === p.setId).map((p) => [p.cardId, p]),
  );
  const mastery = masteryStats(cards, progress);
  const summary = summarizeLibrary(sets, progress, { now }).totals;
  const events = input.reviewEvents
    .filter(
      (e) =>
        timestamp(e.reviewedAt) !== null &&
        e.reviewedAt <= now &&
        ["again", "hard", "good", "easy"].includes(e.rating),
    )
    .sort((a, b) => b.reviewedAt - a.reviewedAt || a.id.localeCompare(b.id))
    .slice(0, REVIEW_SIGNAL_WINDOW);
  const drill = (kind: "article" | "case"): DrillSignal => {
    const rows = input.drills.filter(
      (r) => membership.get(r.cardId) === r.setId && (r.kind ?? "article") === kind,
    );
    const attempts = rows.reduce((n, r) => n + count(r.attempts), 0);
    const correct = rows.reduce((n, r) => n + Math.min(count(r.correct), count(r.attempts)), 0);
    return {
      reviewMissCount: Object.values(progress).reduce(
        (n, p) => n + count(kind === "article" ? p.articleMissCount : p.caseMissCount),
        0,
      ),
      attempts,
      correct,
      misses: attempts - correct,
      accuracy: attempts ? (100 * correct) / attempts : null,
      lastPracticedAt: latest(rows.map((r) => timestamp(r.lastAttemptAt))),
      evidence: evidenceLevel(attempts),
    };
  };
  const topics = CURRICULUM_TOPIC_IDS.map((id) => topic(id, input.grammar[id], "curriculum"));
  const levels = Object.fromEntries(
    READING_LEVELS.map((level) => {
      const ids = new Set(input.passages.filter((p) => p.level === level).map((p) => p.id));
      const raw = object(input.lesen[level]);
      const completed = new Set(
        Array.isArray(raw.completedPassageIds)
          ? raw.completedPassageIds.filter((id) => typeof id === "string" && ids.has(id))
          : [],
      );
      return [
        level,
        {
          totalPassages: ids.size,
          completedPassages: completed.size,
          completionPercent: ids.size ? (100 * completed.size) / ids.size : 0,
          lastPracticedAt: timestamp(raw.lastPracticedAt),
          accuracy: null,
          evidence: evidenceLevel(completed.size),
        },
      ];
    }),
  ) as Record<ReadingLevel, ReadingLevelSignal>;
  const writing = [...input.writing]
    .filter((r) => timestamp(r.createdAt) !== null && Number(r.createdAt) <= now)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt) || a.id.localeCompare(b.id))
    .slice(0, WRITING_SIGNAL_WINDOW);
  // Missing tags cannot distinguish old/WriteIt/untagged/correct feedback: rates unavailable.
  const tagsOf = (raw: unknown): { category: ErrorCategory; severity: "minor" | "major" }[] =>
    !Array.isArray(raw)
      ? []
      : (raw
          .map(object)
          .filter(
            (r) =>
              ERROR_CATEGORIES.includes(r.category as ErrorCategory) &&
              (r.severity === "minor" || r.severity === "major"),
          ) as { category: ErrorCategory; severity: "minor" | "major" }[]);
  const errors = ERROR_CATEGORIES.map((category) => {
    let occurrences = 0,
      submissionsWithError = 0,
      minor = 0,
      major = 0;
    const times: (number | null)[] = [];
    for (const row of writing) {
      const tags = tagsOf(row.errorTags).filter((t) => t.category === category);
      if (tags.length) {
        submissionsWithError++;
        times.push(timestamp(row.createdAt));
      }
      for (const tag of tags) {
        occurrences++;
        if (tag.severity === "major") major++;
        else minor++;
      }
    }
    return {
      category,
      count: occurrences,
      submissionsWithError,
      submissionRate: null,
      severity: { minor, major },
      lastSeenAt: latest(times),
    };
  }).filter((e) => e.count > 0);
  const diagnosticGaps = buildLearnerGapStates(input.diagnostics.filter((row) => row.occurredAt <= now));
  const settings = readUserSettings(input.profile);
  const calendar = signalDayKeys(now, settings.timeZone);
  const days = new Map(input.dailyStats.map((r) => [r.date, readDailyStats(r.date, r.data)]));
  const today = days.get(calendar.keys[0]!) ?? readDailyStats(calendar.keys[0]!, null);
  const activeDays = (limit: number) =>
    calendar.keys.slice(0, limit).filter((key) => (days.get(key)?.reviews ?? 0) > 0).length;
  return {
    generatedAt: now,
    vocabulary: {
      practiceTargets: buildSignalPracticeTargets(sets),
      totalActiveCards: mastery.active,
      reviewedCards: mastery.reviewed,
      newCards: mastery.notStarted,
      dueCards: summary.due,
      overdueCards: summary.overdue,
      weakCards: cards.filter((c) => isWeakWord(progress[c.id], { now })).length,
      masteredCards: cards.filter((c) => masteryScoreFor(progress, c.id) >= MASTERED_SCORE).length,
      averageMastery: cards.length ? mastery.percent : null,
      evidence: evidenceLevel(mastery.reviewed),
      recentAccuracy: events.length
        ? (100 * events.filter((e) => isCorrectRating(e.rating)).length) / events.length
        : null,
      recentReviewCount: events.length,
      lastReviewedAt: events[0]?.reviewedAt ?? null,
      dominantWeaknesses: { article: drill("article"), case: drill("case") },
    },
    grammar: { topics, pasteTopics: input.grammarPaste.map((p) => topic(p.id, p, "paste")) },
    diagnostics: { gaps: diagnosticGaps, observationCount: input.diagnostics.length },
    remediation: {
      recent: input.remediation
        .filter((row) => row.completedAt <= now && row.totalCount >= 3 && row.correctCount <= row.totalCount)
        .sort((a, b) => b.completedAt - a.completedAt || a.id.localeCompare(b.id))
        .slice(0, 100),
    },
    reading: {
      levels,
      overallBundledAccuracy: accuracySignal(input.grammar.lesen),
      pasteTopics: input.lesenPaste
        .filter((p) => READING_LEVELS.includes(p.level as ReadingLevel))
        .map((p) => ({
          ...topic(p.id, { ...p, topic: p.title }, "paste"),
          level: p.level as ReadingLevel,
        })),
    },
    writing: {
      totalReviewedSubmissions: count(input.totalWritingSubmissions),
      recentReviewedSubmissions: writing.length,
      recentTaggedSubmissions: writing.filter((r) => tagsOf(r.errorTags).length > 0).length,
      windowSize: WRITING_SIGNAL_WINDOW,
      evidence: evidenceLevel(writing.filter((r) => tagsOf(r.errorTags).length > 0).length),
      recentErrorCategories: errors,
      lastReviewedAt: timestamp(writing[0]?.createdAt),
    },
    activity: {
      ...readStreak(input.streak, todayUTC(new Date(now))),
      longestStreak: null,
      reviewsToday: count(today.reviews),
      uniqueWordsToday: count(today.uniqueWordsReviewed),
      dailyGoal: settings.dailyGoal,
      goalProgress: Math.min(1, count(today.uniqueWordsReviewed) / settings.dailyGoal),
      activeDays7: activeDays(7),
      activeDays30: activeDays(30),
      localDay: calendar.keys[0]!,
      timeZone: calendar.timeZone,
      utcDay: todayUTC(new Date(now)),
    },
    preferences: readLearningPrefs(input.profile),
  };
}
