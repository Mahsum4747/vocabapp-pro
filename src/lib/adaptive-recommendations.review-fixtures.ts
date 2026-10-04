import {
  experiencedSignals,
  fixtureSignals,
  fixtureTopic,
  recommendationExamples,
  FIXTURE_NOW as NOW,
  FIXTURE_DAY as DAY,
} from "./adaptive-recommendations.fixtures";
import type { LearningSignals, ReadingLevel } from "./learning-signals";
import type { ErrorCategory } from "./write-feedback-types";
export type QualityScenario = {
  name: string;
  signals: LearningSignals;
  expected: string;
  notes: string;
};
const weak = (s: LearningSignals, id = "plural", accuracy = 45, days = 30, attempts = 80) => {
  s.grammar.topics.push(
    fixtureTopic(id, {
      accuracy,
      lifetimeAttempts: attempts,
      recentAttempts: attempts,
      evidence: attempts >= 30 ? "high" : "medium",
      evidenceBasis: "recentQuestions",
      lastPracticedAt: NOW - days * DAY,
    }),
  );
  return s;
};
const base = () => {
  const s = experiencedSignals();
  s.grammar.topics = [];
  return s;
};
const read = (s: LearningSignals, level: ReadingLevel, completed: number, days = 2) => {
  Object.assign(s.reading.levels[level], {
    completedPassages: completed,
    completionPercent: (completed * 100) / s.reading.levels[level].totalPassages,
    lastPracticedAt: NOW - days * DAY,
    evidence: completed >= 10 ? "medium" : "low",
  });
  return s;
};
const write = (s: LearningSignals, category: ErrorCategory, n = 6, window = 6) => {
  Object.assign(s.writing, {
    totalReviewedSubmissions: Math.max(window, 25),
    recentReviewedSubmissions: Math.min(window, 20),
    recentTaggedSubmissions: Math.min(window, 20),
  });
  s.writing.recentErrorCategories.push({
    category,
    count: n,
    submissionsWithError: n,
    submissionRate: null,
    severity: { major: n, minor: 0 },
    lastSeenAt: NOW - 2 * DAY,
  });
  return s;
};
const drill = (s: LearningSignals, kind: "article" | "case", accuracy = 45, attempts = 50) => {
  s.vocabulary.dominantWeaknesses[kind] = {
    attempts,
    correct: Math.round((attempts * accuracy) / 100),
    misses: attempts - Math.round((attempts * accuracy) / 100),
    accuracy,
    reviewMissCount: 0,
    evidence: attempts >= 30 ? "high" : "low",
    lastPracticedAt: NOW - 2 * DAY,
  };
  return s;
};
export function qualityScenarios(): QualityScenario[] {
  const out: QualityScenario[] = [];
  const add = (name: string, signals: LearningSignals, expected: string, notes: string) =>
    out.push({ name, signals, expected, notes });
  for (const n of [1, 3, 5, 20, 50]) {
    const s = weak(base());
    Object.assign(s.vocabulary, { dueCards: n, overdueCards: n });
    add(
      `${n} overdue vs severe grammar`,
      s,
      n === 1 ? "grammar:grammar_practice:plural" : "review:review",
      "One overdue can yield to severe high-evidence weakness; larger backlog wins.",
    );
  }
  for (const n of [1, 3, 15]) {
    const s = weak(base(), "plural", n === 15 ? 60 : 45, 2, n === 15 ? 30 : 80);
    s.vocabulary.dueCards = n;
    add(
      `${n} due vs grammar`,
      s,
      n === 15 ? "review:review" : "grammar:grammar_practice:plural",
      "Small due loses to severe evidence; 15 due beats moderate weakness.",
    );
  }
  const wv = weak(base());
  wv.vocabulary.weakCards = 20;
  add(
    "20 weak words vs severe grammar",
    wv,
    "grammar:grammar_practice:plural",
    "High-evidence severe grammar outranks aggregate weak pool.",
  );
  add(
    "Article only",
    drill(base(), "article"),
    "grammar:grammar_practice:articles",
    "Eligible owned Article drill.",
  );
  add(
    "Case only",
    drill(base(), "case"),
    "grammar:grammar_practice:cases",
    "Eligible owned Cases drill.",
  );
  add(
    "Both, case stronger",
    drill(drill(base(), "article", 60), "case", 40),
    "grammar:grammar_practice:cases",
    "Severity decides.",
  );
  add(
    "Equal article and case",
    drill(drill(base(), "article"), "case"),
    "grammar:grammar_practice:articles",
    "Stable lexical tie.",
  );
  add(
    "Low article vs high case",
    drill(drill(base(), "article", 30, 5), "case", 60),
    "grammar:grammar_practice:cases",
    "Low sample cannot diagnose weakness.",
  );
  add(
    "Writing 6 of 6 position",
    write(base(), "verb_position"),
    "grammar:grammar_practice:satzbau",
    "High usefulness, low sample label retained.",
  );
  add(
    "Writing 8 of latest20, 25 lifetime",
    write(base(), "verb_position", 8, 25),
    "grammar:grammar_practice:satzbau",
    "Latest20 records only, not 25 denominator.",
  );
  add("Writing 1 of 5", write(base(), "case", 1, 5), "none", "No repetition.");
  add(
    "Repeated missing_leitpunkt",
    write(base(), "missing_leitpunkt"),
    "writing:writing_task:write",
    "Manual Task instruction.",
  );
  add("Repeated spelling", write(base(), "spelling"), "none", "No reliable grammar mapping.");
  add("Repeated word_choice", write(base(), "word_choice"), "none", "No invented drill.");
  for (const [level, n] of [
    ["A1", 3],
    ["A1", 30],
    ["A1", 35],
    ["A2", 2],
    ["B1", 2],
    ["B1", 20],
    ["B2", 3],
  ] as [ReadingLevel, number][])
    add(
      `${level} ${n} completed`,
      read(base(), level, n),
      n === 35 ? "none" : `reading:choose_reading_level:${level}`,
      "Continuation requires manual selection; completed level omitted.",
    );
  add("A1 untouched established learner", base(), "none", "No CEFR inference.");
  const overall = read(base(), "B1", 30);
  Object.assign(overall.reading.overallBundledAccuracy, {
    accuracy: 45,
    lifetimeAttempts: 80,
    recentAttempts: 80,
    evidence: "high",
    lastPracticedAt: NOW - 2 * DAY,
  });
  add(
    "B1 complete overall Lesen weak",
    overall,
    "reading:choose_reading_level",
    "Overall weakness, no fabricated level accuracy.",
  );
  add(
    "Multiple levels stale B1 vs recent A2",
    read(read(base(), "A2", 3), "B1", 2, 30),
    "reading:choose_reading_level:B1",
    "Stale existing interest wins, not progression.",
  );
  const paste = fixtureSignals();
  paste.reading.pasteTopics = [
    {
      ...fixtureTopic("paste", {
        source: "paste",
        accuracy: 20,
        lifetimeAttempts: 50,
        evidence: "high",
      }),
      level: "B2",
    },
  ];
  add("Only Paste reading", paste, "none", "Paste excluded.");
  add(
    "Brand new no sets",
    fixtureSignals(),
    "reading:choose_reading_level",
    "Generic content chooser, no level.",
  );
  for (const label of ["Owned new vocabulary", "Owned vocabulary plus reading"]) {
    const s = fixtureSignals();
    Object.assign(s.vocabulary, { totalActiveCards: 50, newCards: 50 });
    add(label, s, "vocabulary:review", "Owned actionable content wins generic start.");
  }
  add(
    "Curriculum available no evidence",
    fixtureSignals(),
    "reading:choose_reading_level",
    "No grammar weakness/exploration from availability.",
  );
  add(
    "Only reference set projected out",
    fixtureSignals(),
    "reading:choose_reading_level",
    "Canonical projection removes reference cards.",
  );
  add(
    "Tiny non-studiable set projected out",
    fixtureSignals(),
    "reading:choose_reading_level",
    "Canonical projection removes tiny sets.",
  );
  add("Strong caught up", recommendationExamples().strong!, "none", "Empty plan valid.");
  const strongNew = recommendationExamples().strong!;
  strongNew.vocabulary.newCards = 10;
  add("Strong new words goal complete", strongNew, "none", "No extra new work after goal.");
  const strongRead = recommendationExamples().strong!;
  read(strongRead, "B2", 20, 30);
  add(
    "Strong neglected partial B2",
    strongRead,
    "reading:choose_reading_level:B2",
    "Optional meaningful existing interest.",
  );
  add("Strong untouched low-evidence grammar", base(), "none", "Untouched is not neglected.");
  for (const progress of [0, 0.5, 1, 1.5]) {
    const s = weak(base());
    Object.assign(s.activity, {
      goalProgress: progress,
      uniqueWordsToday: Math.round(progress * 10),
    });
    add(
      `Goal ${progress * 100}% severe weakness`,
      s,
      "grammar:grammar_practice:plural",
      "Goal cannot hide real weakness.",
    );
  }
  for (const days of [0, 2, 13, 14, 30])
    add(
      `Severe grammar recency ${days}d`,
      weak(base(), "plural", 45, days),
      "grammar:grammar_practice:plural",
      "Severe high-evidence weakness survives penalty.",
    );
  for (const due of [0, 1, 10]) {
    const s = base();
    Object.assign(s.vocabulary, { newCards: 50, dueCards: due });
    add(
      `50 new ${due} due`,
      s,
      due ? "review:review" : "vocabulary:review",
      "No new-only session promise.",
    );
  }
  const newWeak = base();
  Object.assign(newWeak.vocabulary, { newCards: 50, weakCards: 20 });
  add("50 new significant weak pool", newWeak, "vocabulary:weak_review", "Weak focus wins.");
  const newEmpty = base();
  newEmpty.vocabulary.newCards = 10;
  add("10 new goal empty", newEmpty, "vocabulary:review", "Open review, availability only.");
  for (const [id, cat, kind] of [
    ["cases", "case", "case"],
    ["articles", "article_gender", "article"],
    ["satzbau", "verb_position", null],
    ["conjugation", "verb_conjugation", null],
  ] as const) {
    let s = write(weak(base(), id, 60, 2), cat);
    if (kind) s = drill(s, kind);
    if (id === "satzbau") s = write(s, "word_order_other");
    add(
      `Multi-source ${id}`,
      s,
      `grammar:grammar_practice:${id}`,
      "One destination, maximum score, separate source counts.",
    );
  }
  const near = weak(weak(base(), "plural", 70, 2, 20), "pronomen", 70, 2, 20);
  read(near, "B1", 2, 30);
  add(
    "Diversity near tie",
    near,
    "grammar:grammar_practice:plural",
    "Reading second within1 point, primary unchanged.",
  );
  const far = weak(weak(base(), "plural", 45, 30), "pronomen", 60, 2);
  read(far, "B1", 2);
  add(
    "Diversity materially stronger grammar",
    far,
    "grammar:grammar_practice:plural",
    "Grammar second before weaker reading.",
  );
  const all = base();
  for (const id of ["plural", "pronomen", "passiv", "imperativ"]) weak(all, id, 60, 2);
  add(
    "Four equal grammar needs",
    all,
    "grammar:grammar_practice:imperativ",
    "Two-per-domain cap; omitted needs documented.",
  );
  add(
    "No content of any kind",
    (() => {
      const s = fixtureSignals();
      for (const l of Object.values(s.reading.levels)) l.totalPassages = 0;
      return s;
    })(),
    "none",
    "No fake fallback.",
  );
  const recentRead = read(base(), "B1", 2, 0);
  recentRead.vocabulary.newCards = 50;
  add(
    "Today reading vs owned new words",
    recentRead,
    "vocabulary:review",
    "Recent reading yields to owned content.",
  );
  const readNew = read(base(), "B1", 2, 2);
  readNew.vocabulary.newCards = 50;
  add(
    "Reading continuation vs new words",
    readNew,
    "reading:choose_reading_level:B1",
    "Established reading score45 blocks optional new42.",
  );
  // Keep synthetic pool counts coherent even when a scenario adds new/due cards.
  for (const c of out) {
    const v = c.signals.vocabulary;
    v.reviewedCards = Math.max(v.reviewedCards, v.dueCards, v.weakCards);
    v.totalActiveCards = v.reviewedCards + v.newCards;
  }
  return out;
}
