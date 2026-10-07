import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildLearningSignals,
  accuracySignal,
  evidenceLevel,
  signalDayKeys,
  type LearningSignalsInput,
} from "./learning-signals";
import { readLearningSignalsFor, readSignalsForSession } from "./learning-signals.server";
import { initialProgress, type Card, type CardProgress, type StudySet } from "./types";
import { defaultScheduler } from "./srs/index";
import { reviewSummary, isWeakWord } from "./srs/queue";
import { masteryStats } from "./quiz";
const NOW = Date.UTC(2026, 9, 4, 12),
  DAY = 86400000;
const card = (id: string, status?: Card["status"]): Card => ({
  id,
  term: "same term",
  definition: "word",
  imageUrl: null,
  starred: false,
  ...(status ? { status } : {}),
});
const set = (cards: Card[], extra: Partial<StudySet> = {}): StudySet => ({
  id: "s",
  title: "Set",
  description: "",
  subject: "Language",
  ownerId: "u",
  isPublic: false,
  createdAt: NOW,
  updatedAt: NOW,
  lastStudiedAt: null,
  cards,
  ...extra,
});
const progress = (id: string, extra: Partial<CardProgress> = {}): CardProgress => ({
  ...initialProgress("u", id, "s", defaultScheduler.initial(), defaultScheduler.name),
  state: "review",
  totalReviews: 3,
  correctReviews: 2,
  masteryScore: 70,
  dueAt: NOW + DAY,
  lastReviewedAt: NOW - DAY,
  consecutiveCorrect: 2,
  ...extra,
});
const input = (extra: Partial<LearningSignalsInput> = {}): LearningSignalsInput => ({
  now: NOW,
  sets: [],
  progress: [],
  drills: [],
  reviewEvents: [],
  grammar: {},
  lesen: {},
  grammarPaste: [],
  lesenPaste: [],
  writing: [],
  diagnostics: [],
  totalWritingSubmissions: 0,
  dailyStats: [],
  profile: {},
  streak: null,
  passages: [
    { id: "p1", level: "A1" },
    { id: "p2", level: "A1" },
    { id: "a2", level: "A2" },
  ],
  ...extra,
});
const build = (extra: Partial<LearningSignalsInput> = {}) => buildLearningSignals(input(extra));

test("empty domains distinguish no evidence from measured zero", () => {
  const s = build();
  assert.equal(s.vocabulary.totalActiveCards, 0);
  assert.equal(s.vocabulary.averageMastery, null);
  assert.equal(s.vocabulary.recentAccuracy, null);
  assert.equal(s.grammar.topics.length, 26);
  assert.ok(s.grammar.topics.every((t) => t.evidence === "none" && t.accuracy === null));
  assert.equal(s.writing.evidence, "none");
  assert.equal(s.activity.currentStreak, 0);
  assert.equal(s.activity.longestStreak, null);
});
test("all new matches canonical mastery/new semantics", () => {
  const cards = [card("a"), card("b")];
  const s = build({ sets: [set(cards)] });
  assert.equal(s.vocabulary.newCards, 2);
  assert.equal(s.vocabulary.reviewedCards, 0);
  assert.equal(s.vocabulary.dueCards, 0);
  assert.equal(s.vocabulary.weakCards, 0);
  assert.equal(s.vocabulary.averageMastery, 0);
});
test("due and overdue share queue boundary, overdue included in due", () => {
  const cards = [card("a"), card("b"), card("c"), card("d")];
  const rows = [
    progress("a", { dueAt: NOW }),
    progress("b", { dueAt: NOW - DAY }),
    progress("c", { dueAt: NOW - DAY - 1 }),
    progress("d"),
  ];
  const s = build({ sets: [set(cards)], progress: rows });
  const q = reviewSummary(cards, Object.fromEntries(rows.map((r) => [r.cardId, r])), { now: NOW });
  assert.equal(s.vocabulary.dueCards, q.due);
  assert.equal(s.vocabulary.overdueCards, 1);
  assert.equal(s.vocabulary.dueCards, 3);
});
test("weak membership reuses isWeakWord rather than queue weak band", () => {
  const rows = [progress("a", { masteryScore: 20, consecutiveCorrect: 0 }), progress("b")];
  const s = build({ sets: [set([card("a"), card("b")])], progress: rows });
  assert.equal(s.vocabulary.weakCards, rows.filter((p) => isWeakWord(p, { now: NOW })).length);
  assert.equal(s.vocabulary.weakCards, 1);
});
test("mastered threshold and average reuse existing display policy", () => {
  const cards = [card("a"), card("b")],
    rows = [progress("a", { masteryScore: 80 }), progress("b", { masteryScore: 79 })];
  const s = build({ sets: [set(cards)], progress: rows });
  assert.equal(s.vocabulary.masteredCards, 1);
  assert.equal(
    s.vocabulary.averageMastery,
    masteryStats(cards, Object.fromEntries(rows.map((r) => [r.cardId, r]))).percent,
  );
});
test("excluded, archived, reference and too-small sets omitted", () => {
  const s = build({
    sets: [
      set([card("a"), card("b", "excluded"), card("c", "archived")]),
      set([card("d"), card("e")], { id: "ref", isReference: true }),
      set([card("z")], { id: "tiny" }),
    ],
    progress: [progress("b", { masteryScore: 100 }), progress("c", { masteryScore: 100 })],
  });
  assert.equal(s.vocabulary.totalActiveCards, 1);
  assert.equal(s.vocabulary.masteredCards, 0);
});
test("same terms with opaque different ids retain independent memory", () => {
  const s = build({ sets: [set([card("a"), card("b")])], progress: [progress("a")] });
  assert.equal(s.vocabulary.reviewedCards, 1);
  assert.equal(s.vocabulary.newCards, 1);
});
test("orphan or wrong-set rows cannot affect current card signals", () => {
  const s = build({
    sets: [set([card("a"), card("b")])],
    progress: [
      progress("a", { setId: "old", masteryScore: 100 }),
      progress("orphan", { masteryScore: 100 }),
    ],
  });
  assert.equal(s.vocabulary.reviewedCards, 0);
});
test("moved card uses current membership; history preserves original context", () => {
  const s = build({
    sets: [set([card("a"), card("b")], { id: "new" })],
    progress: [progress("a", { setId: "new" })],
    reviewEvents: [
      { id: "e", userId: "u", cardId: "a", setId: "old", rating: "good", reviewedAt: NOW - 1 },
    ],
  });
  assert.equal(s.vocabulary.reviewedCards, 1);
  assert.equal(s.vocabulary.recentAccuracy, 100);
});
test("article and case counters stay independent, inactive rows ignored", () => {
  const s = build({
    sets: [set([card("a"), card("b")])],
    drills: [
      { cardId: "a", setId: "s", attempts: 10, correct: 7, lastAttemptAt: NOW - 1 },
      { cardId: "a", setId: "s", kind: "case", attempts: 4, correct: 1, lastAttemptAt: NOW - 2 },
      { cardId: "deleted", setId: "s", attempts: 99, correct: 0, lastAttemptAt: NOW },
    ],
  });
  assert.equal(s.vocabulary.dominantWeaknesses.article.misses, 3);
  assert.equal(s.vocabulary.dominantWeaknesses.case.misses, 3);
  assert.equal(s.vocabulary.dominantWeaknesses.article.accuracy, 70);
});
test("review accuracy last100 events, hard/good/easy correct", () => {
  const events = Array.from({ length: 101 }, (_, i) => ({
    id: String(i),
    userId: "u",
    cardId: "a",
    setId: "s",
    rating: i === 100 ? ("again" as const) : ("hard" as const),
    reviewedAt: NOW - i,
  }));
  const s = build({ reviewEvents: events });
  assert.equal(s.vocabulary.recentReviewCount, 100);
  assert.equal(s.vocabulary.recentAccuracy, 100);
});
test("grammar exposes participation distinct from rolling denominator", () => {
  const s = build({
    grammar: {
      articles: {
        accuracy: 100,
        totalAttempts: 100,
        lastPracticedAt: NOW,
        recentRounds: [{ correct: 1, total: 1 }],
      },
      cases: { accuracy: 90, totalAttempts: 100, recentRounds: [{ correct: 36, total: 40 }] },
    },
  });
  const a = s.grammar.topics.find((t) => t.topicId === "articles")!,
    c = s.grammar.topics.find((t) => t.topicId === "cases")!;
  assert.equal(a.evidence, "low");
  assert.equal(a.lifetimeAttempts, 100);
  assert.equal(a.recentAttempts, 1);
  assert.equal(c.evidence, "high");
  assert.equal(c.accuracy, 90);
});
test("legacy accuracy retained without inventing round evidence", () => {
  const a = accuracySignal({ accuracy: 75, totalAttempts: 80, recentResults: [1, 0] });
  assert.equal(a.accuracy, 75);
  assert.equal(a.recentAttempts, null);
  assert.equal(a.evidenceBasis, "lifetimeQuestions");
});
test("missing lifetime counter never becomes guessed lifetime accuracy denominator", () => {
  const a = accuracySignal({ accuracy: 100, recentRounds: [{ correct: 5, total: 5 }] });
  assert.equal(a.lifetimeAttempts, 0);
  assert.equal(a.recentAttempts, 5);
  assert.equal(a.evidence, "low");
});
test("grammar paste separate and cannot replace curriculum topic", () => {
  const s = build({
    grammar: { articles: { accuracy: 20, totalAttempts: 40 } },
    grammarPaste: [{ id: "articles", topic: "My topic", accuracy: 100, totalAttempts: 1 }],
  });
  assert.equal(s.grammar.topics.find((t) => t.topicId === "articles")!.accuracy, 20);
  assert.equal(s.grammar.pasteTopics[0]!.source, "paste");
  assert.equal(s.grammar.pasteTopics[0]!.evidence, "low");
});
test("reading zero, partial, complete; dedup and unknown IDs ignored", () => {
  assert.equal(build().reading.levels.A1.completedPassages, 0);
  assert.equal(
    build({ lesen: { A1: { completedPassageIds: ["p1", "p1", "stale"] } } }).reading.levels.A1
      .completionPercent,
    50,
  );
  assert.equal(
    build({ lesen: { A1: { completedPassageIds: ["p1", "p2"] } } }).reading.levels.A1
      .completionPercent,
    100,
  );
});
test("generic Lesen accuracy never masquerades as level accuracy or paste", () => {
  const s = build({
    grammar: { lesen: { accuracy: 80, totalAttempts: 40 } },
    lesenPaste: [{ id: "x", title: "Own", level: "A1", accuracy: 100, totalAttempts: 5 }],
  });
  assert.equal(s.reading.overallBundledAccuracy.accuracy, 80);
  assert.equal(s.reading.levels.A1.accuracy, null);
  assert.equal(s.reading.levels.A1.completedPassages, 0);
  assert.equal(s.reading.pasteTopics[0]!.source, "paste");
});
test("writing repeated categories count occurrences and distinct submissions/severity", () => {
  const s = build({
    writing: [
      {
        id: "a",
        createdAt: NOW - 1,
        errorTags: [
          { category: "case", severity: "minor" },
          { category: "case", severity: "major" },
        ],
      },
      { id: "b", createdAt: NOW - 2, errorTags: [{ category: "case", severity: "major" }] },
    ],
    totalWritingSubmissions: 2,
  });
  const c = s.writing.recentErrorCategories[0]!;
  assert.equal(c.count, 3);
  assert.equal(c.submissionsWithError, 2);
  assert.deepEqual(c.severity, { minor: 1, major: 2 });
  assert.equal(c.lastSeenAt, NOW - 1);
  assert.equal(c.submissionRate, null);
});
test("writing uses last20 feedbacks; no free text parsing or historical zero-error inference", () => {
  const s = build({
    writing: Array.from({ length: 21 }, (_, i) => ({
      id: String(i),
      createdAt: NOW - i,
      errorTags: i === 20 ? [{ category: "case", severity: "major" }] : undefined,
    })),
    totalWritingSubmissions: 21,
  });
  assert.equal(s.writing.recentReviewedSubmissions, 20);
  assert.equal(s.writing.totalReviewedSubmissions, 21);
  assert.equal(s.writing.recentErrorCategories.length, 0);
  assert.equal(s.writing.evidence, "none");
});
test("unknown/invalid structured tags ignored, known valid tags survive", () => {
  const s = build({
    writing: [
      {
        id: "a",
        createdAt: NOW,
        errorTags: [
          { category: "unknown", severity: "major" },
          { category: "case", severity: "huge" },
          { category: "spelling", severity: "minor" },
        ],
      },
    ],
  });
  assert.deepEqual(
    s.writing.recentErrorCategories.map((e) => e.category),
    ["spelling"],
  );
});
test("activity empty history gives zero with existing default preferences", () => {
  const s = build();
  assert.equal(s.activity.reviewsToday, 0);
  assert.equal(s.activity.activeDays30, 0);
  assert.equal(s.activity.dailyGoal, 10);
  assert.equal(s.activity.goalProgress, 0);
  assert.equal(s.preferences.direction, "learn_de");
});
test("activity bounded7/30 windows inclusive today, meaningful goal ratio", () => {
  const keys = signalDayKeys(NOW, "UTC").keys;
  const s = build({
    dailyStats: [
      ...keys.map((date) => ({ date, data: { reviews: 3, uniqueWordsReviewed: 5 } })),
      { date: "2026-09-04", data: { reviews: 100 } },
    ],
  });
  assert.equal(s.activity.activeDays7, 7);
  assert.equal(s.activity.activeDays30, 30);
  assert.equal(s.activity.goalProgress, 0.5);
});
test("goal overachievement clamps ratio, stale UTC streak reads broken", () => {
  const s = build({
    dailyStats: [{ date: "2026-10-04", data: { reviews: 30, uniqueWordsReviewed: 30 } }],
    streak: { lastStudiedDate: "2026-10-01", currentStreak: 9 },
  });
  assert.equal(s.activity.goalProgress, 1);
  assert.equal(s.activity.currentStreak, 0);
});
test("local dailyStats and UTC streak day stay explicitly different", () => {
  const now = Date.UTC(2026, 9, 4, 1);
  const s = build({
    now,
    profile: { timeZone: "America/Los_Angeles" },
    dailyStats: [{ date: "2026-10-03", data: { reviews: 2 } }],
    streak: { lastStudiedDate: "2026-10-03", currentStreak: 3 },
  });
  assert.equal(s.activity.localDay, "2026-10-03");
  assert.equal(s.activity.utcDay, "2026-10-04");
  assert.equal(s.activity.reviewsToday, 2);
  assert.equal(s.activity.currentStreak, 3);
});
test("DST calendar windows and invalid IANA fallback are safe", () => {
  const keys = signalDayKeys(Date.UTC(2026, 2, 9), "America/New_York").keys;
  assert.equal(new Set(keys).size, 30);
  assert.equal(signalDayKeys(NOW, "Invented/Zone").timeZone, "UTC");
});
for (const [n, level] of [
  [0, "none"],
  [1, "low"],
  [9, "low"],
  [10, "medium"],
  [29, "medium"],
  [30, "high"],
  [80, "high"],
  [NaN, "none"],
  [-1, "none"],
] as const)
  test(`evidence boundary ${n}`, () => assert.equal(evidenceLevel(n), level));
test("derivation deterministic, no input mutation, no global blended score", () => {
  const raw = input({
    sets: [set([card("a"), card("b")])],
    writing: [{ id: "a", createdAt: NOW }],
  });
  const copy = structuredClone(raw);
  assert.deepEqual(buildLearningSignals(raw), buildLearningSignals(raw));
  assert.deepEqual(raw, copy);
  assert.ok(!("learningScore" in buildLearningSignals(raw)));
});

/** A read-only fake: deliberately exposes no set/delete/update/transaction methods. */
function storage() {
  const paths: string[] = [];
  const records: Record<string, any> = {
    "users/u": { dailyGoal: 5 },
    "study_sets/s": set([card("a"), card("b")]),
  };
  const snapshot = (path: string) => ({
    id: path.split("/").at(-1),
    data: () => records[path],
    exists: path in records,
  });
  const query = (path: string, filter?: [string, unknown]): any => ({
    doc: (id: string) => ({
      get: async () => {
        paths.push(`${path}/${id}`);
        return snapshot(`${path}/${id}`);
      },
      collection: (name: string) => query(`${path}/${id}/${name}`),
      path: `${path}/${id}`,
    }),
    where: (field: string, _op: string, value: unknown) => query(path, [field, value]),
    orderBy: () => query(path, filter),
    limit: () => query(path, filter),
    select: () => query(path, filter),
    get: async () => {
      paths.push(path);
      return {
        docs: Object.keys(records)
          .filter(
            (k) =>
              k.startsWith(path + "/") &&
              !k.slice(path.length + 1).includes("/") &&
              (!filter || records[k][filter[0]] === filter[1]),
          )
          .map(snapshot),
      };
    },
    count: () => ({
      get: async () => {
        paths.push(path + ":count");
        return { data: () => ({ count: 0 }) };
      },
    }),
  });
  return {
    paths,
    db: {
      collection: (p: string) => query(p),
      getAll: async (...refs: any[]) => {
        paths.push(...refs.map((r) => r.path));
        return refs.map((r) => snapshot(r.path));
      },
    } as any,
  };
}
test("authenticated storage reads one user, no mutations; 30 daily docs batched", async () => {
  const s = storage();
  const result = await readSignalsForSession(s.db, "u", { id: "u" }, NOW);
  assert.equal(result.activity.dailyGoal, 5);
  assert.equal(s.paths.filter((p: string) => p.startsWith("users/u/dailyStats/")).length, 30);
  assert.equal(s.paths.filter((p: string) => p === "users/u/cardProgress").length, 1);
  assert.ok(!s.paths.some((p: string) => p.includes("users/v")));
});
test("signed-out and auth-off fallback rejected before storage", async () => {
  const s = storage();
  await assert.rejects(readSignalsForSession(s.db, "u", null, NOW), /Unauthorized/);
  assert.equal(s.paths.length, 0);
});
test("session/context mismatch cannot request another learner", async () => {
  const s = storage();
  await assert.rejects(readSignalsForSession(s.db, "v", { id: "u" }, NOW), /Unauthorized/);
  assert.equal(s.paths.length, 0);
});
test("service refuses path injection", async () => {
  await assert.rejects(
    readLearningSignalsFor(storage().db, "u/other", NOW),
    /Invalid verified user/,
  );
});
test("transport uses authenticated session, no input ID and dynamic server boundary", () => {
  const source = readFileSync(new URL("./get-learning-signals.ts", import.meta.url), "utf8");
  assert.match(source, /middleware\(\[authMiddleware\]\)/);
  assert.match(source, /getSessionUser\(context.bearerToken\)/);
  assert.doesNotMatch(source, /\.validator\(|data\.|userId:/);
  assert.match(source, /await import\(["\']\.\/learning-signals.server["\']\)/);
});

test("existing article/case review miss counters are separate from drill evidence", () => {
  const signals = build({
    sets: [set([card("a"), card("b")])],
    progress: [progress("a", { articleMissCount: 7, caseMissCount: 2 })],
  });
  assert.equal(signals.vocabulary.dominantWeaknesses.article.reviewMissCount, 7);
  assert.equal(signals.vocabulary.dominantWeaknesses.case.reviewMissCount, 2);
  assert.equal(signals.vocabulary.dominantWeaknesses.article.attempts, 0);
  assert.equal(signals.vocabulary.dominantWeaknesses.article.accuracy, null);
});
test("known curriculum metadata exposes existing badges without reading UI modules", () => {
  const topics = build().grammar.topics;
  assert.equal(topics.find((t) => t.topicId === "articles")!.cefrLevel, "A1.1");
  assert.equal(topics.find((t) => t.topicId === "lesen")!.cefrLevel, null);
  assert.equal(new Set(topics.map((t) => t.topicId)).size, 26);
});
test("invalid rolling history never fabricates recent evidence or repairs data", () => {
  const raw = { accuracy: 70, totalAttempts: 12, recentRounds: [{ correct: 11, total: 10 }] };
  const signal = accuracySignal(raw);
  assert.equal(signal.recentAttempts, null);
  assert.equal(signal.evidenceBasis, "lifetimeQuestions");
  assert.equal(signal.accuracy, 70);
  assert.deepEqual(raw.recentRounds, [{ correct: 11, total: 10 }]);
});

test("another verified account cannot see the first accounts owned sets or settings", async () => {
  const s = storage();
  const result = await readSignalsForSession(s.db, "v", { id: "v" }, NOW);
  assert.equal(result.vocabulary.totalActiveCards, 0);
  assert.equal(result.activity.dailyGoal, 10);
  assert.ok(!s.paths.some((p: string) => p.startsWith("users/u")));
});
test("read failure propagates instead of fabricating an empty learner", async () => {
  const s = storage();
  s.db.getAll = async () => {
    throw new Error("unavailable");
  };
  await assert.rejects(readSignalsForSession(s.db, "u", { id: "u" }, NOW), /unavailable/);
});
test("storage adapter never calls a mutation, cleanup, cache or AI API", () => {
  const source = readFileSync(new URL("./learning-signals.server.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\.(set|update|delete|add|runTransaction|batch|recursiveDelete)\(/);
  assert.doesNotMatch(source, /getTodaySummary|getProfile|cleanup|gemini|generateContent/);
});
