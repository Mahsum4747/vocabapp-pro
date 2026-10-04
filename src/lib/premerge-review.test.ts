import assert from "node:assert/strict";
import { test } from "node:test";
import type { Firestore, FieldValue } from "firebase-admin/firestore";
import { transferCardDocuments, saveCurrentSetSession } from "./card-transfer.server";
import { deleteLearningThenIdentity } from "./account-deletion.server";
import { movedClientState } from "./transfer-client";
import { foldRoundIntoRollingAccuracy } from "./progress-window";
import { recordTopicRound, recordSavedRound } from "./learning-progress.server";
import { transferSchema } from "./input-schemas";
import { assertCardMembership } from "./input-schemas";
import { buildLibrarySession } from "./review-session";
import { summarizeLibrary } from "./srs/index.ts";
import { findOrphanProgressIds } from "./progress-orphans";
import { masteryStats } from "./quiz.ts";
import { takeSession } from "./session-pass";
import { initialProgress, type Card, type CardProgress, type StudySet } from "./types";
import { defaultScheduler } from "./srs/index.ts";
const NOW = Date.UTC(2026, 2, 10, 12);
const USER_ID = "review-test-user";
const card = (term: string, definition: string, extra: Partial<Card> = {}): Card => ({
  id: term,
  term,
  definition,
  starred: false,
  imageUrl: null,
  ...extra,
});
const studySet = (id: string, title: string, cards: Card[]): StudySet => ({
  id,
  title,
  cards,
  ownerId: USER_ID,
  isPublic: false,
  description: "",
  subject: "Language",
  createdAt: NOW,
  updatedAt: NOW,
  lastStudiedAt: null,
});
const reviewed = (id: string, setId: string, extra: Partial<CardProgress>): CardProgress => ({
  ...initialProgress(USER_ID, id, setId, defaultScheduler.initial(), defaultScheduler.name),
  state: "review",
  stability: 10,
  difficulty: 5,
  intervalDays: 8,
  reps: 4,
  totalReviews: 4,
  correctReviews: 2,
  lastReviewedAt: NOW - 86400000,
  ...extra,
});

const DELETE = "__test_delete_field__" as unknown as FieldValue;
/** Storage-boundary fake: production service does every read/write. Enforces
 * read-before-write, optimistic retry, merge semantics and atomic rollback;
 * recursive deletes include missing parents and nested orphan subcollections. */
function storage(seed: Record<string, unknown>) {
  const records = new Map(Object.entries(seed));
  let version = 0;
  let failCommit = false;
  let failDelete: string | null = null;
  let retries = 0;
  let commits = 0;
  const deletes: string[] = [];
  const readGroups: number[] = [];
  const ref = (path: string): any => ({
    path,
    id: path.split("/").at(-1),
    parent: { id: path.split("/").at(-2) },
    collection: (name: string) => collection(`${path}/${name}`),
  });
  const snapshot = (r: any, data: Map<string, unknown>) => ({
    ref: r,
    id: r.id,
    exists: data.has(r.path),
    data: () => structuredClone(data.get(r.path)),
  });
  const collection = (path: string): any => ({
    doc: (id: string) => ref(`${path}/${id}`),
    where: (field: string, op: string, value: string) => {
      assert.equal(op, "==");
      return {
        get: async () => ({
          docs: [...records]
            .filter(
              ([key, data]) =>
                key.startsWith(`${path}/`) &&
                key.split("/").length === path.split("/").length + 1 &&
                (data as any)[field] === value,
            )
            .map(([key]) => snapshot(ref(key), records)),
        }),
      };
    },
  });
  const merge = (previous: any, value: any): any => {
    const next = { ...previous };
    for (const [key, val] of Object.entries(value)) {
      if (val === DELETE) delete next[key];
      else if (val && typeof val === "object" && !Array.isArray(val))
        next[key] = merge(previous?.[key], val);
      else next[key] = structuredClone(val);
    }
    return next;
  };
  const db = {
    doc: ref,
    collection,
    async recursiveDelete(r: any) {
      deletes.push(r.path);
      if (r.path === failDelete) throw Error("injected deletion failure");
      for (const key of records.keys())
        if (key === r.path || key.startsWith(`${r.path}/`)) records.delete(key);
    },
    async runTransaction(action: (tx: any) => Promise<any>) {
      for (let attempt = 0; attempt < 10; attempt++) {
        const start = version;
        const seen = structuredClone(records);
        const writes: Array<[string, any, boolean]> = [];
        const read = (r: any) => {
          assert.equal(writes.length, 0, "all reads must precede writes");
          return snapshot(r, seen);
        };
        const result = await action({
          get: async (r: any) => read(r),
          getAll: async (...refs: any[]) => {
            readGroups.push(refs.length);
            return refs.map(read);
          },
          update: (r: any, data: any) => {
            assert.ok(seen.has(r.path));
            writes.push([r.path, data, true]);
          },
          set: (r: any, data: any, opts?: { merge?: boolean }) =>
            writes.push([r.path, data, !!opts?.merge]),
        });
        if (version !== start) {
          retries++;
          continue;
        }
        if (failCommit) throw Error("injected commit failure");
        for (const [path, data, combine] of writes)
          records.set(path, combine ? merge(records.get(path), data) : structuredClone(data));
        if (writes.length) {
          version++;
          commits++;
        }
        return result;
      }
      throw Error("retry budget exceeded");
    },
  } as unknown as Firestore;
  return {
    db,
    records,
    ref,
    deletes,
    readGroups,
    retries: () => retries,
    commits: () => commits,
    failCommit: () => {
      failCommit = true;
    },
    failDelete: (path: string | null) => {
      failDelete = path;
    },
  };
}
const transfer = (ids: string[]) => ({ sourceSetId: "A", targetSetId: "B", cardIds: ids });
function librarySeed(count = 3) {
  const cards = Array.from({ length: count }, (_, i) =>
    card("same", `meaning-${i}`, { id: `opaque-${i}` }),
  );
  const A = studySet("A", "Source", cards);
  const B = studySet("B", "Target", [card("other", "x", { id: "other" })]);
  const row = reviewed(cards[0].id, "A", {
    dueAt: NOW - 1,
    masteryScore: 10,
    consecutiveCorrect: 0,
    articleMissCount: 7,
  });
  const sessions = {
    A: { cap: 20, served: [cards[0].id, "gone"] },
    B: { served: [cards[0].id, "other"] },
  };
  const seed: Record<string, unknown> = {
    "study_sets/A": A,
    "study_sets/B": B,
    [`users/${USER_ID}`]: {
      setSessions: sessions,
      todaySummary: { stale: true },
      completedSets: ["A"],
    },
    [`users/${USER_ID}/cardProgress/${row.cardId}`]: row,
    [`users/${USER_ID}/articleDrillProgress/${row.cardId}`]: {
      cardId: row.cardId,
      setId: "A",
      attempts: 9,
      correct: 3,
    },
    [`users/${USER_ID}/articleDrillProgress/${row.cardId}:case`]: {
      cardId: row.cardId,
      setId: "A",
      attempts: 8,
      correct: 2,
      kind: "case",
    },
    [`users/${USER_ID}/reviewEvents/history`]: { cardId: row.cardId, setId: "A" },
    [`users/${USER_ID}/articleDrillErrors/history`]: { cardId: row.cardId, setId: "A" },
  };
  return { cards, A, B, row, sessions, seed };
}

test("A to B move preserves full memory, independent duplicate identity and history; current selectors resolve B", async () => {
  const f = librarySeed();
  const s = storage(f.seed);
  const result = await transferCardDocuments(s.db, USER_ID, transfer([f.row.cardId]), true, DELETE);
  const moved = s.records.get(`users/${USER_ID}/cardProgress/${f.row.cardId}`);
  assert.deepEqual(moved, { ...f.row, setId: "B" });
  for (const suffix of ["", ":case"]) {
    const path = `users/${USER_ID}/articleDrillProgress/${f.row.cardId}${suffix}`;
    assert.deepEqual(s.records.get(path), { ...(f.seed[path] as object), setId: "B" });
  }
  for (const collection of ["reviewEvents", "articleDrillErrors"])
    assert.deepEqual(
      s.records.get(`users/${USER_ID}/${collection}/history`),
      f.seed[`users/${USER_ID}/${collection}/history`],
    );
  assert.deepEqual(
    result.sourceCards.map((c) => c.id),
    ["opaque-1", "opaque-2"],
  );
  assert.deepEqual(
    result.targetCards.map((c) => c.id),
    ["other", "opaque-0"],
  );
  assert.throws(() => assertCardMembership(result.sourceCards, f.row.cardId));
  assert.doesNotThrow(() => assertCardMembership(result.targetCards, f.row.cardId));
  const state = movedClientState(
    {
      sets: [f.A, f.B],
      publicSets: [f.A],
      progress: { [f.row.cardId]: f.row },
      profile: { setSessions: f.sessions } as any,
    },
    "A",
    "B",
    [f.row.cardId],
    result,
  );
  assert.equal(state.progress[f.row.cardId].setId, "B");
  assert.equal(
    state.publicSets[0].cards.some((c) => c.id === f.row.cardId),
    false,
  );
  assert.deepEqual(state.profile!.setSessions.A.served, []);
  assert.deepEqual(state.profile!.setSessions.B.served, ["other"]);
  assert.equal(state.todaySummary, null);
  assert.equal((s.records.get(`users/${USER_ID}`) as any).todaySummary, undefined);
  assert.deepEqual((s.records.get(`users/${USER_ID}`) as any).completedSets, ["A"]);
  const weak = buildLibrarySession(state.sets, state.progress, { now: NOW, filter: "weak" });
  assert.deepEqual(
    weak.cards.map((c) => [c.card.id, c.setId]),
    [[f.row.cardId, "B"]],
  );
  assert.equal(summarizeLibrary(state.sets, state.progress, { now: NOW }).target!.set.id, "B");
  assert.equal(masteryStats(result.targetCards, state.progress).active, 2);
  assert.deepEqual(
    findOrphanProgressIds({
      ownerSets: state.sets,
      rows: state.progress,
      existingForeignSetIds: new Set(),
    }),
    [],
  );
  assert.ok(
    takeSession(result.targetCards, state.profile!.setSessions.B, result.targetCards.length).some(
      (c) => c.id === f.row.cardId,
    ),
  );
  // An old in-flight round sends source IDs after the move: persist only current membership.
  await saveCurrentSetSession(s.db, USER_ID, {
    setId: "A",
    cap: 20,
    served: [f.row.cardId, "opaque-1"],
  });
  assert.deepEqual((s.records.get(`users/${USER_ID}`) as any).setSessions.A.served, ["opaque-1"]);
});

test("maximum 2000-card move is one atomic commit with all 6000 current progress rows, bounded reads", async () => {
  const f = librarySeed(2000);
  f.B.cards = [];
  for (const c of f.cards) {
    f.seed[`users/${USER_ID}/cardProgress/${c.id}`] = { ...f.row, cardId: c.id };
    for (const suffix of ["", ":case"])
      f.seed[`users/${USER_ID}/articleDrillProgress/${c.id}${suffix}`] = {
        cardId: c.id,
        setId: "A",
        attempts: 12,
        correct: 4,
      };
  }
  const s = storage(f.seed);
  const result = await transferCardDocuments(
    s.db,
    USER_ID,
    transfer(f.cards.map((c) => c.id)),
    true,
    DELETE,
  );
  assert.equal(result.addedCount, 2000);
  assert.equal(result.sourceCards.length, 0);
  assert.equal(result.targetCards.length, 2000);
  assert.equal(result.movedProgress.length, 2000);
  assert.equal(s.commits(), 1);
  assert.ok(s.readGroups.every((n) => n <= 300));
  for (const [path, row] of s.records)
    if (path.includes("/cardProgress/") || path.includes("/articleDrillProgress/"))
      assert.equal((row as any).setId, "B");
  assert.equal(
    transferSchema.safeParse(transfer(Array.from({ length: 2001 }, (_, i) => `c-${i}`))).success,
    false,
  );
});

test("maximum copy mints 2000 distinct cards, keeps source memory and flags isolated", async () => {
  const f = librarySeed(2000);
  f.B.cards = [];
  f.cards[0].starred = true;
  const s = storage(f.seed);
  let n = 0;
  const result = await transferCardDocuments(
    s.db,
    USER_ID,
    transfer(f.cards.map((c) => c.id)),
    false,
    DELETE,
    () => `copy-${n++}`,
  );
  assert.equal(result.targetCards.length, 2000);
  assert.equal(new Set(result.targetCards.map((c) => c.id)).size, 2000);
  assert.equal(result.targetCards[0].starred, false);
  assert.equal(result.sourceCards[0].starred, true);
  assert.deepEqual(s.records.get(`users/${USER_ID}/cardProgress/${f.row.cardId}`), f.row);
  assert.deepEqual(result.movedProgress, []);
});

test("commit failure rolls back content, memory and pass; permissions/capacity never partially move", async () => {
  const f = librarySeed();
  const s = storage(f.seed);
  s.failCommit();
  await assert.rejects(
    transferCardDocuments(s.db, USER_ID, transfer([f.row.cardId]), true, DELETE),
  );
  assert.deepEqual(Object.fromEntries(s.records), f.seed);
  const invalid = librarySeed();
  invalid.B.ownerId = "someone-else";
  const other = storage(invalid.seed);
  await assert.rejects(
    transferCardDocuments(other.db, USER_ID, transfer([invalid.row.cardId]), true, DELETE),
  );
  assert.equal(other.commits(), 0);
  const large = librarySeed();
  large.B.cards = Array.from({ length: 2000 }, (_, i) => card(`b-${i}`, "x"));
  await assert.rejects(
    transferCardDocuments(
      storage(large.seed).db,
      USER_ID,
      transfer([large.row.cardId]),
      true,
      DELETE,
    ),
  );
});

test("concurrent overlapping moves recheck membership on retry and move exactly once", async () => {
  const f = librarySeed();
  const s = storage(f.seed);
  const outcomes = await Promise.allSettled(
    [1, 2].map(() => transferCardDocuments(s.db, USER_ID, transfer([f.row.cardId]), true, DELETE)),
  );
  assert.equal(outcomes.filter((o) => o.status === "fulfilled").length, 1);
  assert.equal(s.commits(), 1);
  assert.ok(s.retries() > 0);
  assert.equal(
    (s.records.get("study_sets/B") as any).cards.filter((c: any) => c.id === f.row.cardId).length,
    1,
  );
});

for (const total of [5, 20])
  test(`20 complete rounds of ${total} questions preserve round boundaries`, () => {
    let state = { accuracy: 0, recentRounds: [] as Array<{ correct: number; total: number }> };
    for (let i = 0; i < 20; i++)
      state = foldRoundIntoRollingAccuracy(state.recentRounds, total - 1, total);
    assert.equal(state.recentRounds.length, 20);
    assert.equal(state.accuracy, total === 5 ? 80 : 95);
    assert.equal(
      state.recentRounds.reduce((sum, r) => sum + r.total, 0),
      total * 20,
    );
  });

test("mixed 5/10/15/20 rounds use aggregate counts and longer failures weigh proportionally", () => {
  let state = { accuracy: 0, recentRounds: [] as Array<{ correct: number; total: number }> };
  for (const [correct, total] of [
    [5, 5],
    [5, 10],
    [10, 15],
    [10, 20],
  ])
    state = foldRoundIntoRollingAccuracy(state.recentRounds, correct, total);
  assert.equal(state.accuracy, 60); // 30/50, not mean(100,50,67,50)
  assert.equal(foldRoundIntoRollingAccuracy([{ correct: 20, total: 20 }], 0, 20).accuracy, 50);
  assert.equal(foldRoundIntoRollingAccuracy([{ correct: 20, total: 20 }], 0, 5).accuracy, 80);
});

test("21st round evicts the complete oldest round and recomputes both sums", () => {
  const rounds = [
    { correct: 0, total: 20 },
    ...Array.from({ length: 19 }, () => ({ correct: 5, total: 5 })),
  ];
  const next = foldRoundIntoRollingAccuracy(rounds, 0, 5);
  assert.deepEqual(next.recentRounds, [...rounds.slice(1), { correct: 0, total: 5 }]);
  assert.equal(next.accuracy, 95); // 95/100; old failure is fully out
});

for (const saved of [false, true])
  test(`legacy recentResults is ignored without synthetic conversion (${saved ? "Paste" : "fixed topic"})`, async () => {
    const legacy = {
      accuracy: 12,
      totalAttempts: 100,
      lastPracticedAt: 1,
      recentResults: [0, 1, 0],
    };
    const s = storage({ "progress/u": saved ? legacy : { cases: legacy } });
    if (saved) await recordSavedRound(s.db, s.ref("progress/u"), "new-round", 4, 5);
    else await recordTopicRound(s.db, s.ref("progress/u"), "cases", 4, 5);
    const doc = s.records.get("progress/u") as any;
    const result = saved ? doc : doc.cases;
    assert.equal(result.accuracy, 80);
    assert.equal(result.totalAttempts, 105);
    assert.deepEqual(result.recentRounds, [{ correct: 4, total: 5 }]);
    assert.deepEqual(result.recentResults, legacy.recentResults); // inert legacy field retained by merge
  });

function deletionSeed() {
  return {
    "study_sets/owned": { ownerId: USER_ID },
    "study_sets/foreign": { ownerId: "other" },
    [`users/${USER_ID}/grammarPasteTopics/t/roundReceipts/r`]: { correct: 2 }, // parent absent
    [`grammarProgress/${USER_ID}`]: { topic: {} },
    [`lesenProgress/${USER_ID}`]: {},
    [`user_streaks/${USER_ID}`]: {},
    "generatedSetCache/shared": { keep: true },
    "ai_usage/global": { keep: true },
  };
}

test("Firestore partial failure never calls SQL; authenticated retry removes remaining nested data", async () => {
  const s = storage(deletionSeed());
  s.failDelete(`grammarProgress/${USER_ID}`);
  let sql = 0;
  await assert.rejects(
    deleteLearningThenIdentity(s.db, USER_ID, async () => {
      sql++;
    }),
  );
  assert.equal(sql, 0);
  assert.equal(s.records.has(`grammarProgress/${USER_ID}`), true);
  assert.equal(s.records.has(`users/${USER_ID}/grammarPasteTopics/t/roundReceipts/r`), false);
  s.failDelete(null);
  await deleteLearningThenIdentity(s.db, USER_ID, async () => {
    sql++;
  });
  assert.equal(sql, 1);
  assert.deepEqual([...s.records.keys()].sort(), [
    "ai_usage/global",
    "generatedSetCache/shared",
    "study_sets/foreign",
  ]);
});

test("SQL failure follows complete Firestore cleanup; repeat cleanup safely retries identity", async () => {
  const s = storage(deletionSeed());
  let identityExists = true;
  await assert.rejects(
    deleteLearningThenIdentity(s.db, USER_ID, async () => {
      assert.equal(s.records.has(`grammarProgress/${USER_ID}`), false);
      assert.equal(s.records.has("study_sets/owned"), false);
      throw Error("SQL unavailable");
    }),
  );
  assert.equal(identityExists, true);
  await deleteLearningThenIdentity(s.db, USER_ID, async () => {
    identityExists = false;
  });
  assert.equal(identityExists, false);
  await deleteLearningThenIdentity(s.db, USER_ID, async () => {}); // absence safe
  assert.deepEqual([...s.records.keys()].sort(), [
    "ai_usage/global",
    "generatedSetCache/shared",
    "study_sets/foreign",
  ]);
});

test("accuracy evidence never labels lifetime attempts as the rolling denominator", async () => {
  const { roundAccuracyEvidence } = await import("./progress-window");
  assert.equal(
    roundAccuracyEvidence(60, 5000),
    "60% rolling accuracy; lifetime questions answered: 5000",
  );
});
for (const saved of [false, true])
  test(`history-only legacy state initializes missing counters (${saved ? "Paste" : "fixed"})`, async () => {
    const history = { recentResults: [0, 1, 0] };
    const s = storage({ "progress/u": saved ? history : { cases: history } });
    if (saved) await recordSavedRound(s.db, s.ref("progress/u"), "round", 3, 5);
    else await recordTopicRound(s.db, s.ref("progress/u"), "cases", 3, 5);
    const doc = s.records.get("progress/u") as any;
    const result = saved ? doc : doc.cases;
    assert.equal(result.totalAttempts, 5);
    assert.equal(result.accuracy, 60);
    assert.deepEqual(result.recentRounds, [{ correct: 3, total: 5 }]);
    if (!saved) assert.equal(result.topicId, "cases");
  });

test("actual Paste save transaction handles simultaneous retries, rejects content collision and preserves learned progress", async () => {
  const { saveIdempotentPasteTopic } = await import("./learning-progress.server");
  const s = storage({});
  const content = {
    id: "topic",
    topic: "Example",
    questions: [{ prompt: "Question", options: ["a", "b", "c", "d"], correctIndex: 0 }],
  };
  const { id: _, ...fields } = content;
  const initial = { ...fields, createdAt: 1, accuracy: null, totalAttempts: 0, recentRounds: [] };
  const ref = s.ref("users/u/grammarPasteTopics/topic");
  await Promise.all([1, 2].map(() => saveIdempotentPasteTopic(s.db, ref, content, initial)));
  assert.equal(s.records.size, 1);
  assert.ok(s.retries() > 0);
  await recordSavedRound(s.db, ref, "round", 1, 1);
  const learned = structuredClone(s.records.get(ref.path));
  await saveIdempotentPasteTopic(s.db, ref, content, { ...initial, createdAt: 999 });
  assert.deepEqual(s.records.get(ref.path), learned);
  await assert.rejects(
    saveIdempotentPasteTopic(s.db, ref, { ...content, topic: "Collision" }, initial),
  );
  assert.deepEqual(s.records.get(ref.path), learned);
});
