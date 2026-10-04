import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { buildAdaptiveStudyPlan, ADAPTIVE_RULES } from "./adaptive-recommendations";
import {
  fixtureSignals,
  experiencedSignals,
  fixtureTopic,
  recommendationExamples,
  FIXTURE_NOW as NOW,
  FIXTURE_DAY as DAY,
} from "./adaptive-recommendations.fixtures";
import { practiceDestination, WRITING_PRACTICE_MAP } from "./recommendation-targets";
import { buildSignalPracticeTargets } from "./learning-signal-targets";
import { CURRICULUM_TOPIC_IDS } from "./grammar-curriculum";
import type { LearningSignals } from "./learning-signals";
import type { StudySet, Card } from "./types";
const plan = (s: LearningSignals) => buildAdaptiveStudyPlan(s);
const topicWeak = (id: string, extra: Partial<ReturnType<typeof fixtureTopic>> = {}) =>
  fixtureTopic(id, {
    accuracy: 60,
    lifetimeAttempts: 50,
    recentAttempts: 50,
    evidence: "high",
    evidenceBasis: "recentQuestions",
    lastPracticedAt: NOW - 2 * DAY,
    ...extra,
  });
const writing = (
  s: LearningSignals,
  category: LearningSignals["writing"]["recentErrorCategories"][number]["category"],
  n = 5,
) => {
  Object.assign(s.writing, {
    totalReviewedSubmissions: 10,
    recentReviewedSubmissions: 10,
    recentTaggedSubmissions: 10,
    evidence: "medium",
  });
  s.writing.recentErrorCategories.push({
    category,
    count: n,
    submissionsWithError: n,
    submissionRate: null,
    severity: { minor: 2, major: n - 2 },
    lastSeenAt: NOW - 2 * DAY,
  });
  return s;
};

test("brand-new learner receives at most conservative level chooser, no weakness or CEFR inference", () => {
  const p = plan(fixtureSignals());
  assert.equal(p.recommendations.length, 1);
  assert.equal(p.primary!.action.type, "choose_reading_level");
  assert.equal(p.primary!.action.level, undefined);
  assert.equal(p.primary!.evidence.level, "none");
  assert.doesNotMatch(p.primary!.reason, /weak|struggle|A1/);
});
test("brand-new no real content has no recommendation", () => {
  const s = fixtureSignals();
  for (const l of Object.values(s.reading.levels)) l.totalPassages = 0;
  assert.equal(plan(s).primary, null);
});
test("only new vocabulary starts at current remaining capacity", () => {
  const s = fixtureSignals();
  Object.assign(s.vocabulary, { totalActiveCards: 15, newCards: 15 });
  Object.assign(s.activity, { uniqueWordsToday: 7, goalProgress: 0.7 });
  const p = plan(s);
  assert.equal(p.primary!.action.type, "introduce_words");
  assert.equal(p.primary!.action.count, 3);
});
test("large overdue backlog urgent and ahead of even severe grammar", () => {
  const s = experiencedSignals();
  Object.assign(s.vocabulary, { overdueCards: 12, dueCards: 12 });
  s.grammar.topics = [topicWeak("plural", { accuracy: 10, lastPracticedAt: NOW - 30 * DAY })];
  assert.equal(plan(s).primary!.id, "adaptive:scheduled-review");
  assert.equal(plan(s).primary!.priority, "urgent");
});
for (const [n, p] of [
  [1, "high"],
  [5, "high"],
  [6, "urgent"],
] as const)
  test(`overdue priority boundary ${n}`, () => {
    const s = experiencedSignals();
    Object.assign(s.vocabulary, { overdueCards: n, dueCards: n });
    assert.equal(plan(s).primary!.priority, p);
  });
for (const [n, p] of [
  [1, "medium"],
  [5, "medium"],
  [6, "high"],
] as const)
  test(`due priority boundary ${n}`, () => {
    const s = experiencedSignals();
    s.vocabulary.dueCards = n;
    assert.equal(plan(s).primary!.priority, p);
    assert.equal(plan(s).primary!.route, "/review");
  });
test("severe high-evidence grammar can win over one due card", () => {
  const s = experiencedSignals();
  s.vocabulary.dueCards = 1;
  s.grammar.topics = [topicWeak("plural", { accuracy: 40 })];
  assert.equal(plan(s).primary!.action.targetId, "plural");
});
test("daily goal completion never suppresses overdue review", () => {
  const s = experiencedSignals();
  Object.assign(s.vocabulary, { overdueCards: 30, dueCards: 30 });
  s.activity.goalProgress = 1;
  s.activity.uniqueWordsToday = 10;
  assert.equal(plan(s).primary!.priority, "urgent");
});
test("focused weakness uses existing filter and minimum evidence", () => {
  const s = experiencedSignals();
  s.vocabulary.weakCards = 3;
  assert.equal(plan(s).primary!.route, "/review?filter=weak");
  s.vocabulary.evidence = "low";
  s.vocabulary.reviewedCards = 2;
  assert.equal(plan(s).recommendations.length, 0);
});
test("one weak word does not become a new weakness diagnosis", () => {
  const s = experiencedSignals();
  s.vocabulary.weakCards = 1;
  assert.equal(plan(s).primary, null);
});
test("scheduled review already covers weak vocabulary; no redundant weak recommendation", () => {
  const s = experiencedSignals();
  s.vocabulary.dueCards = 10;
  s.vocabulary.weakCards = 20;
  assert.equal(plan(s).recommendations.length, 1);
});
test("new words suppressed by scheduled pressure", () => {
  const s = experiencedSignals();
  s.vocabulary.newCards = 10;
  s.vocabulary.dueCards = 1;
  assert.ok(!plan(s).recommendations.some((r) => r.action.type === "introduce_words"));
});
test("new words suppressed by meaningful weakness", () => {
  const s = experiencedSignals();
  s.vocabulary.newCards = 10;
  s.grammar.topics = [topicWeak("plural")];
  assert.ok(!plan(s).recommendations.some((r) => r.action.type === "introduce_words"));
});
test("new words suppressed after daily goal or with no remaining capacity", () => {
  const s = experiencedSignals();
  s.vocabulary.newCards = 10;
  s.activity.goalProgress = 1;
  s.activity.uniqueWordsToday = 10;
  assert.equal(plan(s).primary, null);
});
test("all mastered with no other need is not gamification farming", () => {
  assert.equal(plan(recommendationExamples().strong).primary, null);
});
test("grammar 100% after two answers never weak; recent low evidence not explored", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", {
      accuracy: 100,
      recentAttempts: 2,
      lifetimeAttempts: 2,
      evidence: "low",
      lastPracticedAt: NOW,
    }),
  ];
  assert.equal(plan(s).primary, null);
});
test("grammar absent does not create 26 exploration cards or assume level", () => {
  assert.equal(plan(experiencedSignals()).primary, null);
});
test("grammar 60% with50 questions produces exact weighted-window wording", () => {
  const s = experiencedSignals();
  s.grammar.topics = [topicWeak("plural")];
  assert.match(plan(s).primary!.reason, /60% with 50 questions in recent rounds/);
});
test("legacy lifetime evidence explicitly not accuracy denominator", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", { recentAttempts: null, evidenceBasis: "lifetimeQuestions" }),
  ];
  assert.match(plan(s).primary!.reason, /lifetime questions \(legacy evidence\)/);
});
for (const [accuracy, expected] of [
  [64, "high"],
  [65, "medium"],
  [79, "medium"],
  [80, null],
] as const)
  test(`grammar weak/borderline boundary ${accuracy}`, () => {
    const s = experiencedSignals();
    s.grammar.topics = [topicWeak("plural", { accuracy, evidence: "medium", recentAttempts: 20 })];
    assert.equal(plan(s).primary?.priority ?? null, expected);
  });
test("contradictory high evidence with tiny question count cannot call weakness", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", { recentAttempts: 2, lifetimeAttempts: 2, accuracy: 20 }),
  ];
  assert.equal(plan(s).primary, null);
});
test("high evidence beats medium for equal weakness and recency", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", { evidence: "medium", recentAttempts: 20 }),
    topicWeak("passiv"),
  ];
  assert.equal(plan(s).primary!.action.targetId, "passiv");
});
test("practiced recently loses to equally useful older topic", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", { lastPracticedAt: NOW }),
    topicWeak("passiv", { lastPracticedAt: NOW - 2 * DAY }),
  ];
  assert.equal(plan(s).primary!.action.targetId, "passiv");
});
test("stale repeated interest may be exploration without weakness claim", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", {
      recentAttempts: 2,
      lifetimeAttempts: 2,
      evidence: "low",
      lastPracticedAt: NOW - 15 * DAY,
    }),
  ];
  assert.equal(plan(s).primary!.priority, "low");
  assert.match(plan(s).primary!.reason, /little evidence/);
  assert.ok(plan(s).primary!.evidence.sources.includes("exploration"));
});
test("Paste never ranked as curriculum even with strong accuracy weakness", () => {
  const s = experiencedSignals();
  s.grammar.pasteTopics = [topicWeak("plural", { source: "paste", accuracy: 0 })];
  s.reading.pasteTopics = [{ ...topicWeak("mine", { source: "paste", accuracy: 0 }), level: "B2" }];
  assert.equal(plan(s).primary, null);
});
test("reading untouched with established vocabulary does not infer a level", () => {
  assert.equal(plan(experiencedSignals()).recommendations.length, 0);
});
test("partial reading resumes existing B1 interest, no fabricated level accuracy/query", () => {
  const s = experiencedSignals();
  Object.assign(s.reading.levels.B1, {
    completedPassages: 4,
    completionPercent: (100 * 4) / 30,
    lastPracticedAt: NOW - 15 * DAY,
    evidence: "low",
  });
  const r = plan(s).primary!;
  assert.equal(r.action.level, "B1");
  assert.equal(r.route, "/grammar/lesen");
  assert.equal(r.evidence.metrics.levelAccuracy, null);
  assert.equal(r.reason, "You have completed 4 of 30 B1 reading passages.");
});
test("fully completed reading not recommended without clear overall weakness", () => {
  const s = experiencedSignals();
  for (const l of Object.values(s.reading.levels)) {
    l.completedPassages = l.totalPassages;
    l.lastPracticedAt = NOW - DAY;
  }
  assert.equal(plan(s).primary, null);
});
test("weak overall Lesen may revisit completed curriculum but assigns no level accuracy", () => {
  const s = experiencedSignals();
  s.reading.overallBundledAccuracy = {
    accuracy: 40,
    recentAttempts: 50,
    lifetimeAttempts: 100,
    recentRounds: 10,
    evidence: "high",
    evidenceBasis: "recentQuestions",
    lastPracticedAt: NOW - 2 * DAY,
  };
  const r = plan(s).primary!;
  assert.equal(r.action.type, "choose_reading_level");
  assert.equal(r.action.level, undefined);
  assert.match(r.reason, /not level-specific/);
});
test("reading completion plus overall weakness merges to one destination", () => {
  const s = experiencedSignals();
  s.reading.levels.B1.completedPassages = 4;
  s.reading.overallBundledAccuracy = {
    accuracy: 40,
    recentAttempts: 50,
    lifetimeAttempts: 100,
    recentRounds: 10,
    evidence: "high",
    evidenceBasis: "recentQuestions",
    lastPracticedAt: NOW - 2 * DAY,
  };
  assert.equal(plan(s).recommendations.length, 1);
  assert.equal(plan(s).primary!.evidence.metrics.completedPassages, 4);
});
test("writing absent never becomes write-more suggestion", () => {
  assert.equal(plan(experiencedSignals()).primary, null);
});
test("single writing error insufficient; repeated category maps correctly", () => {
  const s = writing(experiencedSignals(), "verb_position", 2);
  assert.equal(plan(s).primary, null);
  s.writing.recentErrorCategories[0]!.submissionsWithError = 5;
  const r = plan(s).primary!;
  assert.equal(r.route, "/sets/fixture-set/satzbau");
  assert.match(r.reason, /5 of the last 10/);
});
test("writing repetition requires at least five saved feedback records", () => {
  const s = writing(experiencedSignals(), "case", 3);
  s.writing.recentReviewedSubmissions = 3;
  assert.equal(plan(s).primary, null);
});
test("unmapped spelling/word choice do not force a bad grammar mapping", () => {
  const s = writing(writing(experiencedSignals(), "spelling"), "word_choice");
  assert.equal(plan(s).primary, null);
  assert.equal(WRITING_PRACTICE_MAP.spelling, null);
});
test("register and missing required points map to existing Write mode, one recommendation", () => {
  const s = writing(writing(experiencedSignals(), "register"), "missing_leitpunkt");
  const p = plan(s);
  assert.equal(p.recommendations.length, 1);
  assert.equal(p.primary!.route, "/sets/fixture-set/write");
  assert.equal(p.primary!.action.type, "writing_task");
  assert.ok("register.submissionsWithError" in p.primary!.evidence.metrics);
  assert.ok("missing_leitpunkt.submissionsWithError" in p.primary!.evidence.metrics);
});
test("drill grammar and writing evidence for cases merges without triple scoring", () => {
  const s = writing(experiencedSignals(), "case");
  s.grammar.topics = [topicWeak("cases")];
  s.vocabulary.dominantWeaknesses.case = {
    attempts: 50,
    correct: 20,
    misses: 30,
    accuracy: 40,
    reviewMissCount: 30,
    evidence: "high",
    lastPracticedAt: NOW - 2 * DAY,
  };
  const p = plan(s);
  assert.equal(p.recommendations.length, 1);
  assert.deepEqual(new Set(p.primary!.evidence.sources), new Set(["drill", "grammar", "writing"]));
  assert.ok("grammar.accuracy" in p.primary!.evidence.metrics);
  assert.ok("case.misses" in p.primary!.evidence.metrics);
});
test("article/case stronger weakness first, independent valid set routes", () => {
  const s = experiencedSignals();
  s.vocabulary.dominantWeaknesses.article = {
    attempts: 30,
    correct: 18,
    misses: 12,
    accuracy: 60,
    reviewMissCount: 12,
    evidence: "high",
    lastPracticedAt: NOW - 2 * DAY,
  };
  s.vocabulary.dominantWeaknesses.case = {
    attempts: 30,
    correct: 9,
    misses: 21,
    accuracy: 30,
    reviewMissCount: 21,
    evidence: "high",
    lastPracticedAt: NOW - 2 * DAY,
  };
  assert.equal(plan(s).primary!.action.targetId, "cases");
  assert.equal(plan(s).recommendations.length, 2);
});
test("set-scoped recommendation suppressed without eligible owned target", () => {
  const s = writing(experiencedSignals(), "case");
  s.grammar.topics = [topicWeak("cases")];
  s.vocabulary.practiceTargets = {};
  assert.equal(plan(s).primary, null);
});
test("max4 with at most2 per domain; output not padded", () => {
  const s = experiencedSignals();
  s.grammar.topics = ["plural", "passiv", "pronomen", "steigerung", "imperativ"].map((id) =>
    topicWeak(id),
  );
  s.vocabulary.dueCards = 10;
  s.reading.levels.B1.completedPassages = 3;
  const p = plan(s);
  assert.equal(p.recommendations.length, 4);
  assert.equal(p.recommendations.filter((r) => r.domain === "grammar").length, 2);
  assert.equal(plan(recommendationExamples().overdue).recommendations.length, 1);
});
test("domain diversity within6 score points preserves primary", () => {
  const s = experiencedSignals();
  s.grammar.topics = [
    topicWeak("plural", { accuracy: 70, evidence: "medium", recentAttempts: 20 }),
    topicWeak("pronomen", { accuracy: 70, evidence: "medium", recentAttempts: 20 }),
  ];
  s.reading.levels.B1.completedPassages = 2;
  s.reading.levels.B1.lastPracticedAt = NOW - 15 * DAY;
  const p = plan(s);
  assert.equal(p.primary!.domain, "grammar");
  assert.equal(p.recommendations[1]!.domain, "reading");
});
test("stable order unaffected by grammar input order, no input mutation", () => {
  const s = experiencedSignals();
  s.grammar.topics = ["plural", "passiv", "pronomen"].map((id) => topicWeak(id));
  const copy = structuredClone(s);
  const p = plan(s);
  assert.deepEqual(plan(s), p);
  assert.deepEqual(s, copy);
  s.grammar.topics.reverse();
  assert.deepEqual(plan(s), p);
});
test("all routes are real, no undocumented query, categories centralized", () => {
  const s = experiencedSignals();
  for (const id of CURRICULUM_TOPIC_IDS) {
    const d = practiceDestination(id, s)!;
    assert.ok(d);
    const filename = d.setId
      ? `sets.$setId.${id}.tsx`
      : id === "lesen"
        ? "grammar.lesen.tsx"
        : `grammar.${id}.tsx`;
    assert.ok(existsSync(new URL(`../routes/${filename}`, import.meta.url)), filename);
  }
  assert.equal(practiceDestination("invented", s), null);
  assert.equal(ADAPTIVE_RULES.maxRecommendations, 4);
});
test("fixture scenarios assert exact primary titles and evidence", () => {
  const examples = recommendationExamples();
  assert.equal(plan(examples.overdue!).primary!.title, "Review overdue words");
  assert.equal(plan(examples.grammarWeak!).primary!.route, "/sets/fixture-set/cases");
  assert.equal(plan(examples.writingError!).primary!.route, "/sets/fixture-set/satzbau");
  assert.equal(plan(examples.brandNew!).primary!.title, "Choose a reading level");
  assert.equal(plan(examples.strong!).primary, null);
});
const card = (id: string, extra: Partial<Card> = {}): Card => ({
  id,
  term: "Tisch",
  definition: "table",
  starred: false,
  imageUrl: null,
  ...extra,
});
const set = (id: string, cards: Card[], extra: Partial<StudySet> = {}): StudySet => ({
  id,
  cards,
  title: "Fixture",
  description: "",
  subject: "Language",
  ownerId: "u",
  isPublic: false,
  createdAt: NOW,
  updatedAt: NOW,
  lastStudiedAt: null,
  termLangCode: "de",
  ...extra,
});
test("routing capability computed from current active German content, deterministic set choice", () => {
  const cards = [card("a", { enrichment: { gender: "m", source: "user" } }), card("b")];
  assert.equal(buildSignalPracticeTargets([set("z", cards), set("a", cards)]).cases, "a");
  assert.equal(
    buildSignalPracticeTargets([
      set("a", [
        card("a", { status: "archived", enrichment: { gender: "m", source: "user" } }),
        card("b"),
      ]),
    ]).cases,
    undefined,
  );
  assert.equal(
    buildSignalPracticeTargets([set("a", cards, { isReference: true })]).write,
    undefined,
  );
  assert.equal(
    buildSignalPracticeTargets([set("a", cards, { termLangCode: "ku" })]).cases,
    undefined,
  );
});
test("engine imports no storage, auth, AI, runtime clock or random API", () => {
  const source = readFileSync(new URL("./adaptive-recommendations.ts", import.meta.url), "utf8");
  assert.doesNotMatch(
    source,
    /Firestore|firebase|createServerFn|Date\.now|Math\.random|generateContent|console\./,
  );
});
