import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Type-only, so no firebase-admin code reaches the client bundle — same
// convention study-sets.ts's own top-level firebase-admin type import uses.
import type { Firestore } from "firebase-admin/firestore";
import { authMiddleware } from "./auth/middleware";
import { foldRoundIntoRollingAccuracy } from "./grammar-progress";

/**
 * Persistence for Grammar Paste's AI-generated, learner-supplied topics —
 * `users/{uid}/grammarPasteTopics/{topicId}`, a per-user SUBCOLLECTION (the
 * same shape write-it-feedback.ts's `users/{uid}/aiFeedbackLog` already
 * uses for "every X this learner has ever generated"), not a single
 * `grammarPasteTopics/{uid}` document — a learner can save many topics, and
 * a subcollection keeps each one its own doc instead of one doc growing
 * without bound.
 *
 * Deliberately SEPARATE from both:
 * - `grammarProgress/{uid}` (grammar-progress.ts): the fixed 26-topic
 *   schema there is never touched — a pasted topic's progress lives on
 *   its OWN doc here (`accuracy`/`lastPracticedAt`/`totalAttempts`/
 *   `recentResults`, same rolling-window shape and math as
 *   `grammar-progress.ts`'s own, via the shared `foldRoundIntoRollingAccuracy`
 *   helper) — never merged into the fixed collection.
 * - The fixed 26-topic hub: nothing here is a `ModeId`, nothing here shows
 *   up in `grammar.index.tsx`'s `CATEGORIES`. This collection only feeds
 *   grammar.paste.tsx's own "Your saved topics" list and (read-only,
 *   clearly labeled) grammar-assessment.ts's prompt.
 *
 * WRITE BUDGET, same discipline as grammar-progress.ts: one write to save a
 * topic (on a successful paste, not per question), and one write per
 * finished round thereafter (never per question).
 */

const questionSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  options: z.array(z.string().trim().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().max(400).nullable(),
});

const saveSchema = z.object({
  topic: z.string().trim().min(1).max(200),
  ruleExplanation: z.string().trim().min(1).max(1000),
  questions: z.array(questionSchema).min(1).max(50),
});

export interface GrammarPasteQuestionStored {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string | null;
}

/** Summary shape for the "Your saved topics" list — no `questions` payload,
 *  kept light since the list can hold many topics. */
export interface GrammarPasteTopicSummary {
  id: string;
  topic: string;
  questionCount: number;
  createdAt: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  totalAttempts: number;
}

/** Full shape for re-opening a saved topic into a session. */
export interface GrammarPasteTopicFull extends GrammarPasteTopicSummary {
  ruleExplanation: string;
  questions: GrammarPasteQuestionStored[];
}

type StoredGrammarPasteTopic = {
  topic: string;
  ruleExplanation: string;
  questions: GrammarPasteQuestionStored[];
  createdAt: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  totalAttempts: number;
  recentResults: number[];
};

function collectionFor(db: Firestore, userId: string) {
  return db.collection("users").doc(userId).collection("grammarPasteTopics");
}

function toSummary(id: string, data: StoredGrammarPasteTopic): GrammarPasteTopicSummary {
  return {
    id,
    topic: data.topic,
    questionCount: data.questions.length,
    createdAt: data.createdAt,
    accuracy: data.accuracy,
    lastPracticedAt: data.lastPracticedAt,
    totalAttempts: data.totalAttempts,
  };
}

/** One write, on a successful paste (see grammar.paste.tsx's `start()`) —
 *  never per question, never automatic beyond that one save. */
export const saveGrammarPasteTopic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const stored: StoredGrammarPasteTopic = {
      topic: data.topic,
      ruleExplanation: data.ruleExplanation,
      // zod validates exactly 4 options and correctIndex 0-3 above; the
      // tuple/literal-union types here are narrower than what zod's own
      // inferred array/number types express, not a looser runtime check.
      questions: data.questions as GrammarPasteQuestionStored[],
      createdAt: Date.now(),
      accuracy: null,
      lastPracticedAt: null,
      totalAttempts: 0,
      recentResults: [],
    };
    const ref = await collectionFor(db, context.userId).add(stored);
    return { id: ref.id };
  });

/** Every saved topic's summary for the signed-in user, newest first — the
 *  read path for grammar.paste.tsx's "Your saved topics" list. */
export const listGrammarPasteTopics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<GrammarPasteTopicSummary[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await collectionFor(db, context.userId).orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => toSummary(d.id, d.data() as StoredGrammarPasteTopic));
  });

const idSchema = z.object({ id: z.string().trim().min(1).max(200) });

/** Full content (including `questions`) for re-opening one saved topic into
 *  a session — a separate, heavier call from the list above so browsing
 *  the list never pulls every topic's full question set over the wire. */
export const getGrammarPasteTopic = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => idSchema.parse(input))
  .handler(async ({ context, data }): Promise<GrammarPasteTopicFull | null> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await collectionFor(db, context.userId).doc(data.id).get();
    if (!doc.exists) return null;
    const stored = doc.data() as StoredGrammarPasteTopic;
    return {
      ...toSummary(doc.id, stored),
      ruleExplanation: stored.ruleExplanation,
      questions: stored.questions,
    };
  });

export const deleteGrammarPasteTopic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => idSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    await collectionFor(db, context.userId).doc(data.id).delete();
    return { ok: true };
  });

const recordSchema = z.object({
  id: z.string().trim().min(1).max(200),
  correctInRound: z.number().int().min(0),
  totalInRound: z.number().int().min(1).max(50),
});

/** One write per finished round (never per question) — same write-budget
 *  discipline as grammar-progress.ts's own `recordGrammarRoundResult`,
 *  applied to this separate per-topic doc instead of the fixed
 *  `grammarProgress/{uid}` collection. */
export const recordGrammarPasteTopicRoundResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordSchema.parse(input))
  .handler(async ({ context, data }): Promise<GrammarPasteTopicSummary | null> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = collectionFor(db, context.userId).doc(data.id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const existing = doc.data() as StoredGrammarPasteTopic;

    const { accuracy, recentResults } = foldRoundIntoRollingAccuracy(
      existing.recentResults ?? [],
      data.correctInRound,
      data.totalInRound,
    );
    const totalAttempts = (existing.totalAttempts ?? 0) + data.totalInRound;
    const lastPracticedAt = Date.now();

    const next: StoredGrammarPasteTopic = {
      ...existing,
      accuracy,
      lastPracticedAt,
      totalAttempts,
      recentResults,
    };
    await ref.set(next, { merge: true });
    return toSummary(doc.id, next);
  });
