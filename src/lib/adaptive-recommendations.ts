import { evidenceLevel } from "./learning-evidence";
import type { EvidenceLevel, LearningSignals, GrammarTopicSignal } from "./learning-signals";
import {
  practiceDestination,
  RECOMMENDATION_ROUTES,
  WRITING_PRACTICE_MAP,
  type PracticeDestination,
} from "./recommendation-targets";

export type StudyRecommendation = {
  id: string;
  domain: "vocabulary" | "grammar" | "reading" | "writing" | "review";
  priority: "urgent" | "high" | "medium" | "low";
  title: string;
  reason: string;
  route: string;
  action: {
    type:
      | "review"
      | "weak_review"
      | "introduce_words"
      | "grammar_practice"
      | "reading_passage"
      | "choose_reading_level"
      | "writing_task";
    targetId?: string;
    setId?: string;
    level?: string;
    count?: number;
  };
  evidence: {
    level: EvidenceLevel;
    sources: (
      "schedule" | "vocabulary" | "drill" | "grammar" | "reading" | "writing" | "exploration"
    )[];
    metrics: Record<string, number | string | null>;
  };
};
export type AdaptiveStudyPlan = {
  generatedAt: number;
  recommendations: StudyRecommendation[];
  primary: StudyRecommendation | null;
};
export const ADAPTIVE_RULES = Object.freeze({
  maxRecommendations: 4,
  maxPerDomain: 2,
  diversityBand: 6,
  urgentOverdueAbove: 5,
  largeDueAt: 6,
  minimumWeakCards: 3,
  minimumDrillMisses: 3,
  minimumWritingSubmissions: 3,
  grammarWeakBelow: 65,
  grammarBorderlineBelow: 80,
  minimumEvidenceQuestions: 10,
  minimumWritingWindow: 5,
  recentPenalty: 16,
  staleBoost: 6,
  staleAfterDays: 14,
  explorationAfterDays: 7,
});
type Candidate = { key: string; score: number; recommendation: StudyRecommendation };
const DAY = 86400000;
const ranks: Record<EvidenceLevel, number> = { none: 0, low: 1, medium: 2, high: 3 };
const meaningful = (level: EvidenceLevel) => ranks[level] >= 2;
const sample = (topic: GrammarTopicSignal) => topic.recentAttempts ?? topic.lifetimeAttempts;
const priority = (score: number): StudyRecommendation["priority"] =>
  score >= 100 ? "urgent" : score >= 70 ? "high" : score >= 45 ? "medium" : "low";
const age = (now: number, at: number | null) =>
  at === null ? null : Math.max(0, (now - at) / DAY);
const recency = (now: number, at: number | null) => {
  const days = age(now, at);
  return days === null
    ? 0
    : days < 1
      ? -ADAPTIVE_RULES.recentPenalty
      : days >= ADAPTIVE_RULES.staleAfterDays
        ? ADAPTIVE_RULES.staleBoost
        : 0;
};
const LABELS: Record<string, string> = {
  articles: "Articles",
  cases: "Cases",
  conjugation: "Conjugation",
  satzbau: "Satzbau",
  cloze: "Cloze",
  write: "Write Task",
};
const label = (topic: string) =>
  LABELS[topic] ??
  topic
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
/** Rules read ONLY signals. No clock access, database, mutation, AI or random ranking. */
export function buildAdaptiveStudyPlan(signals: LearningSignals): AdaptiveStudyPlan {
  const now = signals.generatedAt,
    v = signals.vocabulary,
    a = signals.activity;
  const candidates: Candidate[] = [];
  const goalBoost = a.goalProgress < 1 ? 2 : 0;
  const push = (
    key: string,
    score: number,
    recommendation: Omit<StudyRecommendation, "id" | "priority">,
  ) =>
    candidates.push({
      key,
      score,
      recommendation: { ...recommendation, id: `adaptive:${key}`, priority: priority(score) },
    });
  const practice = (
    dest: PracticeDestination,
    domain: StudyRecommendation["domain"],
    score: number,
    reason: string,
    evidence: StudyRecommendation["evidence"],
  ) =>
    push(dest.key, score, {
      domain,
      title: `Practice ${label(dest.topicId)}`,
      reason,
      route: dest.route,
      action: {
        type: dest.topicId === "write" ? "writing_task" : "grammar_practice",
        targetId: dest.topicId,
        ...(dest.setId ? { setId: dest.setId } : {}),
      },
      evidence,
    });
  if (v.overdueCards > 0 || v.dueCards > 0) {
    const overdue = v.overdueCards > 0;
    const score = overdue
      ? v.overdueCards > ADAPTIVE_RULES.urgentOverdueAbove
        ? 110
        : 95
      : v.dueCards >= ADAPTIVE_RULES.largeDueAt
        ? 85
        : 60;
    push("scheduled-review", score + goalBoost, {
      domain: "review",
      title: overdue ? "Review overdue words" : "Review due words",
      reason: `You have ${overdue ? v.overdueCards : v.dueCards} ${overdue ? "overdue" : "due"} word${(overdue ? v.overdueCards : v.dueCards) === 1 ? "" : "s"}.`,
      route: RECOMMENDATION_ROUTES.review,
      action: { type: "review", count: Math.min(v.dueCards, 20) },
      evidence: {
        level: v.evidence,
        sources: ["schedule"],
        metrics: { overdueCards: v.overdueCards, dueCards: v.dueCards },
      },
    });
  } else if (
    v.weakCards >= ADAPTIVE_RULES.minimumWeakCards &&
    meaningful(v.evidence) &&
    v.reviewedCards >= ADAPTIVE_RULES.minimumEvidenceQuestions
  ) {
    push("weak-review", 72 + goalBoost, {
      domain: "vocabulary",
      title: "Practice weak words",
      reason: `${v.weakCards} reviewed words meet the existing weak-word criteria.`,
      route: RECOMMENDATION_ROUTES.weakReview,
      action: { type: "weak_review", count: Math.min(v.weakCards, 20) },
      evidence: {
        level: v.evidence,
        sources: ["vocabulary"],
        metrics: { weakCards: v.weakCards, reviewedCards: v.reviewedCards },
      },
    });
  }
  const weakScore = (accuracy: number, evidence: EvidenceLevel, at: number | null) =>
    70 + (accuracy < 50 ? 10 : 0) + (evidence === "high" ? 6 : 0) + recency(now, at) + goalBoost;
  for (const kind of ["article", "case"] as const) {
    const d = v.dominantWeaknesses[kind],
      topicId = kind === "article" ? "articles" : "cases",
      dest = practiceDestination(topicId, signals);
    if (
      !dest ||
      !meaningful(d.evidence) ||
      d.attempts < ADAPTIVE_RULES.minimumEvidenceQuestions ||
      d.misses < ADAPTIVE_RULES.minimumDrillMisses ||
      d.accuracy === null ||
      d.accuracy >= 70
    )
      continue;
    practice(
      dest,
      "grammar",
      weakScore(d.accuracy, d.evidence, d.lastPracticedAt),
      `${d.misses} ${kind} errors were recorded across ${d.attempts} drill attempts.`,
      {
        level: d.evidence,
        sources: ["drill"],
        metrics: {
          [`${kind}.misses`]: d.misses,
          [`${kind}.attempts`]: d.attempts,
          [`${kind}.accuracy`]: d.accuracy,
        },
      },
    );
  }
  for (const topic of [...signals.grammar.topics].sort((x, y) =>
    x.topicId.localeCompare(y.topicId),
  )) {
    if (topic.source !== "curriculum" || topic.topicId === "lesen") continue;
    const dest = practiceDestination(topic.topicId, signals);
    if (!dest) continue;
    const attempts = sample(topic);
    const metric = {
      topicId: topic.topicId,
      accuracy: topic.accuracy,
      lifetimeAttempts: topic.lifetimeAttempts,
      recentAttempts: topic.recentAttempts,
      evidenceBasis: topic.evidenceBasis,
      cefrLevel: topic.cefrLevel,
      lastPracticedAt: topic.lastPracticedAt,
    };
    const basis =
      topic.evidenceBasis === "recentQuestions"
        ? "questions in recent rounds"
        : "lifetime questions (legacy evidence)";
    if (
      meaningful(topic.evidence) &&
      attempts >= ADAPTIVE_RULES.minimumEvidenceQuestions &&
      topic.accuracy !== null &&
      topic.accuracy < ADAPTIVE_RULES.grammarBorderlineBelow
    ) {
      const weak = topic.accuracy < ADAPTIVE_RULES.grammarWeakBelow;
      practice(
        dest,
        "grammar",
        weak
          ? weakScore(topic.accuracy, topic.evidence, topic.lastPracticedAt)
          : 50 + recency(now, topic.lastPracticedAt) + goalBoost,
        `Your ${label(topic.topicId)} accuracy is ${topic.accuracy}% with ${attempts} ${basis}.`,
        {
          level: topic.evidence,
          sources: ["grammar"],
          metrics: Object.fromEntries(
            Object.entries(metric).map(([k, val]) => [`grammar.${k}`, val]),
          ),
        },
      );
    } else if (
      !meaningful(topic.evidence) &&
      attempts > 0 &&
      topic.lastPracticedAt !== null &&
      (age(now, topic.lastPracticedAt) ?? 0) >= ADAPTIVE_RULES.explorationAfterDays
    ) {
      practice(
        dest,
        "grammar",
        30 + recency(now, topic.lastPracticedAt) + (a.goalProgress >= 1 ? -5 : 0),
        `Revisit ${label(topic.topicId)}: you have answered ${attempts} questions, so there is little evidence yet.`,
        {
          level: topic.evidence,
          sources: ["exploration"],
          metrics: {
            "grammar.attempts": attempts,
            "grammar.lastPracticedAt": topic.lastPracticedAt,
          },
        },
      );
    }
  }
  for (const error of [...signals.writing.recentErrorCategories].sort((x, y) =>
    x.category.localeCompare(y.category),
  )) {
    if (
      error.submissionsWithError < ADAPTIVE_RULES.minimumWritingSubmissions ||
      signals.writing.recentReviewedSubmissions < ADAPTIVE_RULES.minimumWritingWindow
    )
      continue;
    const mapped = WRITING_PRACTICE_MAP[error.category];
    const dest = mapped ? practiceDestination(mapped, signals) : null;
    if (!dest) continue;
    const evidence = evidenceLevel(error.submissionsWithError);
    const isWriting = mapped === "write";
    const score =
      (isWriting ? 45 : 65) +
      (error.submissionsWithError >= 5 ? 5 : 0) +
      recency(now, error.lastSeenAt) +
      goalBoost;
    practice(
      dest,
      isWriting ? "writing" : "grammar",
      score,
      `${error.category.replaceAll("_", " ")} errors appeared in ${error.submissionsWithError} of the last ${signals.writing.recentReviewedSubmissions} saved writing feedback records.`,
      {
        level: evidence,
        sources: ["writing"],
        metrics: {
          [`${error.category}.submissionsWithError`]: error.submissionsWithError,
          [`${error.category}.occurrences`]: error.count,
          [`${error.category}.major`]: error.severity.major,
          [`${error.category}.minor`]: error.severity.minor,
          [`${error.category}.lastSeenAt`]: error.lastSeenAt,
          writingWindow: signals.writing.recentReviewedSubmissions,
        },
      },
    );
  }
  // Existing level activity establishes interest, never a global proficiency level.
  const reading = Object.entries(signals.reading.levels)
    .filter(
      ([, l]) =>
        l.totalPassages > 0 &&
        l.completedPassages < l.totalPassages &&
        (l.completedPassages > 0 || l.lastPracticedAt !== null),
    )
    .map(([level, l]) => ({
      level,
      l,
      score: 45 + recency(now, l.lastPracticedAt) + (a.goalProgress >= 1 ? -5 : 0),
    }))
    .sort(
      (x, y) =>
        y.score - x.score ||
        (y.l.lastPracticedAt ?? 0) - (x.l.lastPracticedAt ?? 0) ||
        x.level.localeCompare(y.level),
    )[0];
  if (reading) {
    const { level, l, score } = reading;
    push("lesen", score, {
      domain: "reading",
      title: `Continue ${level} reading`,
      reason: `You have completed ${l.completedPassages} of ${l.totalPassages} ${level} reading passages.`,
      route: RECOMMENDATION_ROUTES.reading,
      action: { type: "reading_passage", level, count: 1 },
      evidence: {
        level: l.evidence,
        sources: ["reading"],
        metrics: {
          level,
          completedPassages: l.completedPassages,
          totalPassages: l.totalPassages,
          lastPracticedAt: l.lastPracticedAt,
          levelAccuracy: null,
        },
      },
    });
  }
  const overall = signals.reading.overallBundledAccuracy;
  const overallAttempts = overall.recentAttempts ?? overall.lifetimeAttempts;
  if (
    meaningful(overall.evidence) &&
    overallAttempts >= ADAPTIVE_RULES.minimumEvidenceQuestions &&
    overall.accuracy !== null &&
    overall.accuracy < ADAPTIVE_RULES.grammarWeakBelow
  ) {
    push("lesen", weakScore(overall.accuracy, overall.evidence, overall.lastPracticedAt), {
      domain: "reading",
      title: "Review reading comprehension",
      reason: `Your overall bundled Lesen accuracy is ${overall.accuracy}%. Choose a level to revisit; this accuracy is not level-specific.`,
      route: RECOMMENDATION_ROUTES.reading,
      action: { type: "choose_reading_level" },
      evidence: {
        level: overall.evidence,
        sources: ["reading"],
        metrics: {
          overallAccuracy: overall.accuracy,
          overallRecentAttempts: overall.recentAttempts,
          overallLifetimeAttempts: overall.lifetimeAttempts,
          levelAccuracy: null,
        },
      },
    });
  }
  const capacity = Math.max(0, a.dailyGoal - a.uniqueWordsToday);
  if (
    v.dueCards === 0 &&
    v.overdueCards === 0 &&
    v.newCards > 0 &&
    capacity > 0 &&
    a.goalProgress < 1 &&
    !candidates.some((c) => c.score >= 45)
  ) {
    const count = Math.min(v.newCards, capacity, 20);
    push("new-words", 40 + goalBoost, {
      domain: "vocabulary",
      title: "Learn new words",
      reason: `You have ${v.newCards} unreviewed words and room for ${count} new words within today's goal.`,
      route: RECOMMENDATION_ROUTES.review,
      action: { type: "introduce_words", count },
      evidence: {
        level: v.evidence,
        sources: ["vocabulary"],
        metrics: { newCards: v.newCards, remainingDailyCapacity: capacity },
      },
    });
  }
  const noHistory =
    Object.values(signals.reading.levels).every(
      (l) => l.completedPassages === 0 && l.lastPracticedAt === null,
    ) &&
    v.reviewedCards === 0 &&
    signals.grammar.topics.every(
      (t) => t.lifetimeAttempts === 0 && (t.recentAttempts ?? 0) === 0,
    ) &&
    signals.writing.totalReviewedSubmissions === 0 &&
    a.activeDays30 === 0;
  if (
    candidates.length === 0 &&
    noHistory &&
    signals.preferences.direction === "learn_de" &&
    Object.values(signals.reading.levels).some((l) => l.totalPassages > 0)
  ) {
    push("lesen", 20, {
      domain: "reading",
      title: "Choose a reading level",
      reason: "Bundled reading passages are available. Choose a level you want to try.",
      route: RECOMMENDATION_ROUTES.reading,
      action: { type: "choose_reading_level" },
      evidence: {
        level: "none",
        sources: ["exploration"],
        metrics: {
          availablePassages: Object.values(signals.reading.levels).reduce(
            (n, l) => n + l.totalPassages,
            0,
          ),
          learnerCefrLevel: null,
        },
      },
    });
  }
  const merged = new Map<string, Candidate>();
  for (const c of candidates) {
    const old = merged.get(c.key);
    if (!old) {
      merged.set(c.key, c);
      continue;
    }
    const stronger = c.score > old.score ? c : old,
      weaker = stronger === c ? old : c;
    merged.set(c.key, {
      ...stronger,
      recommendation: {
        ...stronger.recommendation,
        reason: [old.recommendation.reason, c.recommendation.reason]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .join(" "),
        evidence: {
          level:
            ranks[old.recommendation.evidence.level] >= ranks[c.recommendation.evidence.level]
              ? old.recommendation.evidence.level
              : c.recommendation.evidence.level,
          sources: [
            ...new Set([
              ...old.recommendation.evidence.sources,
              ...c.recommendation.evidence.sources,
            ]),
          ],
          metrics: {
            ...weaker.recommendation.evidence.metrics,
            ...stronger.recommendation.evidence.metrics,
          },
        },
      },
    });
  }
  const pool = [...merged.values()].sort((x, y) => y.score - x.score || x.key.localeCompare(y.key));
  const selected: Candidate[] = [],
    domainCounts = new Map<string, number>();
  while (pool.length && selected.length < ADAPTIVE_RULES.maxRecommendations) {
    const allowed = pool.filter(
      (c) => (domainCounts.get(c.recommendation.domain) ?? 0) < ADAPTIVE_RULES.maxPerDomain,
    );
    if (!allowed.length) break;
    const top = allowed[0]!;
    const next =
      selected.length === 0
        ? top
        : allowed
            .filter((c) => top.score - c.score <= ADAPTIVE_RULES.diversityBand)
            .sort(
              (x, y) =>
                (domainCounts.get(x.recommendation.domain) ?? 0) -
                  (domainCounts.get(y.recommendation.domain) ?? 0) ||
                y.score - x.score ||
                x.key.localeCompare(y.key),
            )[0]!;
    selected.push(next);
    domainCounts.set(
      next.recommendation.domain,
      (domainCounts.get(next.recommendation.domain) ?? 0) + 1,
    );
    pool.splice(pool.indexOf(next), 1);
  }
  const recommendations = selected.map((c) =>
    c.recommendation.action.type === "writing_task"
      ? {
          ...c.recommendation,
          reason: `${c.recommendation.reason} Open Write and select the Task tab.`,
        }
      : c.recommendation,
  );
  return { generatedAt: now, recommendations, primary: recommendations[0] ?? null };
}
