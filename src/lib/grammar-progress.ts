import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";

/**
 * Topic-level grammar-drill mastery tracking — a NEW, completely separate
 * Firestore collection (`grammarProgress/{uid}`), parallel to the existing
 * vocabulary-card FSRS system (`cardProgress`/`reviewEvents`) and never
 * written by it or to it. Every one of the 26 grammar drills (the 5
 * set-scoped modes — Articles/Cases/Conjugation/Satzbau/Cloze — plus the 21
 * standalone drills under /grammar/*) writes here once per completed round,
 * keyed by its own fixed topicId string (the same id already used as each
 * drill's `mode.id`/`topic` prop — see grammar.index.tsx's `ModeId`).
 *
 * WRITE BUDGET: exactly one write per finished round (~10 questions), never
 * per question — see `recordGrammarRoundResult`'s own doc comment for how a
 * whole round's result is folded into the stored rolling accuracy in that
 * one call.
 */

const RECENT_WINDOW = 20;

const recordSchema = z.object({
  topicId: z.string().trim().min(1).max(64),
  correctInRound: z.number().int().min(0),
  totalInRound: z.number().int().min(1).max(50),
});

export interface GrammarTopicProgress {
  topicId: string;
  /** 0-100, over the most recent up-to-RECENT_WINDOW individual questions
   *  (not rounds) — see `recordGrammarRoundResult`. */
  accuracy: number;
  lastPracticedAt: number;
  /** Total questions ever answered for this topic — never trimmed, unlike
   *  the rolling window `accuracy` is computed from. */
  totalAttempts: number;
}

/** The stored Firestore shape adds the raw rolling bit window `accuracy` is
 *  derived from — never returned to a client, an implementation detail of
 *  this file only. */
type StoredTopicProgress = GrammarTopicProgress & {
  recentResults: number[];
};

export type GrammarProgressDoc = Record<string, GrammarTopicProgress>;

/**
 * Folds one just-finished round's (correctInRound / totalInRound) result
 * into the topic's stored rolling-accuracy window and writes it — ONE
 * Firestore write, called exactly once per round from each drill's
 * session-end transition (never per question).
 *
 * `accuracy` is a rolling average over the last `RECENT_WINDOW` individual
 * QUESTIONS, not rounds, per the task spec ("son 20 soru"). Since this only
 * ever receives a round-level count (never per-question detail, by the same
 * write-budget constraint), the round is expanded into `totalInRound`
 * synthetic 1/0 bits (all the round's correct answers, then all its misses
 * — order doesn't matter for a plain average) and appended to the topic's
 * existing bit window, then trimmed back to `RECENT_WINDOW`. `totalAttempts`
 * is a separate, never-trimmed lifetime counter.
 */
export const recordGrammarRoundResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(recordSchema)
  .handler(async ({ context, data }): Promise<GrammarTopicProgress> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("grammarProgress").doc(context.userId);
    const doc = await ref.get();
    const existing = doc.data()?.[data.topicId] as StoredTopicProgress | undefined;

    const wrongInRound = data.totalInRound - data.correctInRound;
    const roundBits = [
      ...Array<number>(data.correctInRound).fill(1),
      ...Array<number>(wrongInRound).fill(0),
    ];
    const recentResults = [...(existing?.recentResults ?? []), ...roundBits].slice(-RECENT_WINDOW);
    const accuracy = Math.round(
      (recentResults.reduce((sum, bit) => sum + bit, 0) / recentResults.length) * 100,
    );
    const totalAttempts = (existing?.totalAttempts ?? 0) + data.totalInRound;
    const lastPracticedAt = Date.now();

    const next: StoredTopicProgress = {
      topicId: data.topicId,
      accuracy,
      lastPracticedAt,
      totalAttempts,
      recentResults,
    };
    // Merge-write scoped to just this one topic's field — never touches any
    // other topic's entry in the same doc, let alone cardProgress/FSRS.
    await ref.set({ [data.topicId]: next }, { merge: true });
    return { topicId: data.topicId, accuracy, lastPracticedAt, totalAttempts };
  });

/**
 * Every topic's progress for the signed-in user, for the grammar hub's
 * per-tile accuracy display. Strips `recentResults` (the raw bit window) —
 * the hub only ever needs the summary fields.
 */
export const getGrammarProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<GrammarProgressDoc> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("grammarProgress").doc(context.userId).get();
    const data = doc.data() ?? {};
    const result: GrammarProgressDoc = {};
    for (const [topicId, value] of Object.entries(data)) {
      const stored = value as StoredTopicProgress;
      result[topicId] = {
        topicId: stored.topicId,
        accuracy: stored.accuracy,
        lastPracticedAt: stored.lastPracticedAt,
        totalAttempts: stored.totalAttempts,
      };
    }
    return result;
  });
