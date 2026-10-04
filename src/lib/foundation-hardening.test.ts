import assert from "node:assert/strict";
import { test } from "node:test";
import { indexCardDrafts, removedCardIds, planCardTransfer } from "./card-identity.ts";
import { freshCardCopy } from "./types.ts";
import { foldRoundIntoRollingAccuracy } from "./progress-window.ts";
import { documentIdSchema, roundCountsSchema, assertCardMembership } from "./input-schemas.ts";
import { userDocumentPaths } from "./user-data-inventory.ts";
import { parseGrammarPasteJson } from "./grammar-paste-import.ts";
import { parseLesenPasteJson } from "./lesen-paste-import.ts";
import {
  recordTopicRound,
  recordSavedRound,
  recordPassageCompletion,
} from "./learning-progress.server.ts";
import type { Firestore, DocumentReference } from "firebase-admin/firestore";
import type { Card } from "./types.ts";

/** Optimistic transaction fake: snapshot versions conflict, causing the callback
 * to rerun, just as Firestore does. No Firebase SDK initialization or network. */
function fakeFirestore(initial: Record<string, unknown> = {}) {
  const records = new Map(Object.entries(initial));
  let version = 0;
  let retries = 0;
  const reference = (path: string): any => ({
    path,
    id: path.split("/").at(-1),
    collection: (name: string) => ({ doc: (id: string) => reference(`${path}/${name}/${id}`) }),
  });
  const db = {
    async runTransaction(action: (tx: any) => Promise<any>): Promise<any> {
      for (;;) {
        const snapshotVersion = version;
        const snapshot = structuredClone(records);
        const writes: [string, any, boolean][] = [];
        const result = await action({
          get: async (ref: any) => ({
            exists: snapshot.has(ref.path),
            data: () => snapshot.get(ref.path),
          }),
          set: (ref: any, value: any, options?: { merge?: boolean }) =>
            writes.push([ref.path, value, !!options?.merge]),
        });
        if (version !== snapshotVersion) {
          retries++;
          continue;
        }
        for (const [path, value, merge] of writes)
          records.set(path, merge ? { ...(records.get(path) as object), ...value } : value);
        if (writes.length) version++;
        return result;
      }
    },
  } as unknown as Firestore;
  return { db, ref: reference("progress/u") as DocumentReference, records, retries: () => retries };
}
test("rename and duplicate terms preserve independent explicit identity", () => {
  const drafts = [
    { id: "a", term: "Wort" },
    { id: "b", term: "Wort" },
  ];
  drafts[0].term = "Umbenannt";
  const cards = indexCardDrafts(drafts, () => {
    throw Error("must not mint");
  });
  assert.deepEqual(
    cards.map((c) => c.id),
    ["a", "b"],
  );
  assert.equal(cards[1].term, "Wort");
  assert.throws(() => indexCardDrafts([{ id: "a" }, { id: "a" }], () => "x"));
  assert.deepEqual(removedCardIds(cards, [cards[1]]), ["a"]);
});
test("copy creates new identity and clears owner flags; move retains card", () => {
  const card = {
    id: "a",
    term: "Wort",
    definition: "word",
    starred: true,
    imageUrl: null,
    status: "excluded",
  } as Card;
  const copy = freshCardCopy(card, "b");
  assert.equal(copy.id, "b");
  assert.equal(copy.starred, false);
  assert.equal(copy.status, undefined);
  assert.equal(card.id, "a");
  assert.equal(card.starred, true);
});
test("round accuracy is weighted, bounded, and never invents answer order", () => {
  assert.equal(foldRoundIntoRollingAccuracy([], 25, 50).accuracy, 50);
  assert.throws(() => foldRoundIntoRollingAccuracy([{ correct: 2, total: 1 }], 0, 1));
  const next = foldRoundIntoRollingAccuracy([{ correct: 1, total: 1 }], 0, 9);
  assert.equal(next.accuracy, 10);
  assert.equal(
    foldRoundIntoRollingAccuracy(Array(20).fill({ correct: 0, total: 1 }), 1, 1).recentRounds
      .length,
    20,
  );
  for (const [c, t] of [
    [2, 1],
    [-1, 2],
    [0, 0],
    [1.5, 2],
    [2, 51],
  ])
    assert.throws(() => foldRoundIntoRollingAccuracy([], c, t));
});
test("concurrent grammar rounds preserve totals, history and other topics", async () => {
  const f = fakeFirestore();
  await Promise.all([
    recordTopicRound(f.db, f.ref, "lesen", 3, 5),
    recordTopicRound(f.db, f.ref, "lesen", 2, 5),
    recordTopicRound(f.db, f.ref, "cases", 1, 2),
  ]);
  const stored = f.records.get("progress/u") as any;
  assert.equal(stored.lesen.totalAttempts, 10);
  assert.equal(stored.lesen.accuracy, 50);
  assert.equal(stored.lesen.recentRounds.length, 2);
  assert.equal(stored.cases.totalAttempts, 2);
  assert.ok(f.retries() > 0);
});
test("concurrent completion is a union including duplicate retries", async () => {
  const f = fakeFirestore();
  await Promise.all(["a", "b", "a"].map((id) => recordPassageCompletion(f.db, f.ref, "A1", id)));
  assert.deepEqual((f.records.get("progress/u") as any).A1.completedPassageIds.sort(), ["a", "b"]);
});
test("Paste retries are durable idempotent, and different rounds accumulate", async () => {
  const f = fakeFirestore({
    "progress/u": { accuracy: null, totalAttempts: 0, lastPracticedAt: null, recentRounds: [] },
  });
  await Promise.all([
    recordSavedRound(f.db, f.ref, "one", 3, 5),
    recordSavedRound(f.db, f.ref, "one", 3, 5),
    recordSavedRound(f.db, f.ref, "two", 2, 5),
  ]);
  assert.equal((f.records.get("progress/u") as any).totalAttempts, 10);
  assert.equal((f.records.get("progress/u") as any).recentRounds.length, 2);
  await assert.rejects(recordSavedRound(f.db, f.ref, "one", 0, 5));
  assert.equal(
    await recordSavedRound(f.db, { ...f.ref, path: "missing" } as DocumentReference, "one", 1, 1),
    null,
  );
});
test("identifier, membership and count validation rejects unsafe inputs", () => {
  for (const id of ["", "a/b", ".", ".."])
    assert.equal(documentIdSchema.safeParse(id).success, false);
  assert.equal(roundCountsSchema.safeParse({ correctInRound: 5, totalInRound: 2 }).success, false);
  assert.throws(() => assertCardMembership([{ id: "a" }], "b"));
});
test("account deletion inventory includes all owned roots and excludes global caches", () => {
  assert.deepEqual(userDocumentPaths("u"), [
    "users/u",
    "user_streaks/u",
    "grammarProgress/u",
    "lesenProgress/u",
  ]);
  assert.throws(() => userDocumentPaths("u/other"));
});
test("Paste validators accept valid content and reject malformed question indices", () => {
  const question = {
    prompt: "Ich ___ hier.",
    options: ["a", "b", "c", "d"],
    correctIndex: 0,
    explanation: null,
  };
  const grammar = {
    topic: "Test",
    ruleExplanation: "Eine Regel.",
    questions: Array(10).fill(question),
  };
  assert.equal(parseGrammarPasteJson(JSON.stringify(grammar)).ok, true);
  assert.equal(parseGrammarPasteJson("{").ok, false);
  assert.equal(
    parseGrammarPasteJson(
      JSON.stringify({ ...grammar, questions: [{ ...question, correctIndex: 4 }] }),
      1,
    ).ok,
    false,
  );
  const lesen = {
    title: "Test",
    text: "Ein langer deutscher Text.",
    questions: Array(5).fill(question),
  };
  assert.equal(parseLesenPasteJson(JSON.stringify(lesen)).ok, true);
  assert.equal(parseLesenPasteJson(JSON.stringify({ ...lesen, questions: [] })).ok, false);
});

test("B1 no-match answers are reachable in the matching board", async () => {
  const { matchingOptions } = await import("./german/lesen-matching-options.ts");
  const { LESEN_PASSAGES } = await import("./german/lesen-data.ts");
  for (const passage of LESEN_PASSAGES)
    if (passage.kind === "matching") {
      const options = matchingOptions(passage);
      for (const target of passage.targets)
        assert.ok(options.some((option) => option.id === target.correctOptionId));
    }
});

test("transactional move plan preserves identity and copy/public-copy plans reset it", () => {
  const source = [
    { id: "a", term: "same", definition: "one", starred: true, imageUrl: null },
    { id: "b", term: "same", definition: "two", starred: false, imageUrl: null },
  ];
  const move = planCardTransfer(source, [], ["a"], true, () => "unused", freshCardCopy);
  assert.deepEqual(
    move.sourceCards.map((c) => c.id),
    ["b"],
  );
  assert.equal(move.targetCards[0], source[0]);
  const copy = planCardTransfer(source, [], ["a"], false, () => "new", freshCardCopy);
  assert.equal(copy.sourceCards, source);
  assert.equal(copy.targetCards[0].id, "new");
  assert.equal(copy.targetCards[0].starred, false);
  assert.throws(() => planCardTransfer(source, [], ["missing"], true, () => "new", freshCardCopy));
  assert.throws(() =>
    planCardTransfer(source, [source[0]], ["a"], true, () => "new", freshCardCopy),
  );
});
