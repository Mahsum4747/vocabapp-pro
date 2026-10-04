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

import { foldRoundIntoRollingAccuracy, type RoundResult } from "./progress-window";
export { RECENT_WINDOW, foldRoundIntoRollingAccuracy } from "./progress-window";
import { roundCountsSchema } from "./input-schemas";

const recordSchema = roundCountsSchema.and(
  z.object({
    topicId: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .max(64),
  }),
);

export interface GrammarTopicProgress {
  topicId: string;
  /** 0-100, over the most recent up-to-RECENT_WINDOW completed rounds — see `recordGrammarRoundResult`. */
  accuracy: number;
  lastPracticedAt: number;
  /** Total questions ever answered for this topic — never trimmed, unlike
   *  the rolling window `accuracy` is computed from. */
  totalAttempts: number;
}

/** The stored Firestore shape adds the raw rolling round window `accuracy` is
 *  derived from — never returned to a client, an implementation detail of
 *  this file only. */
type StoredTopicProgress = GrammarTopicProgress & {
  recentRounds: RoundResult[];
};

export type GrammarProgressDoc = Record<string, GrammarTopicProgress>;

/** One transaction per finished round. Accuracy is question-weighted over
 * the most recent 20 completed rounds; lifetime attempts never get trimmed. */
export const recordGrammarRoundResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(recordSchema)
  .handler(async ({ context, data }): Promise<GrammarTopicProgress> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("grammarProgress").doc(context.userId);
    const { recordTopicRound } = await import("./learning-progress.server");
    const next = await recordTopicRound(
      db,
      ref,
      data.topicId,
      data.correctInRound,
      data.totalInRound,
    );
    return {
      topicId: data.topicId,
      accuracy: next.accuracy!,
      lastPracticedAt: next.lastPracticedAt!,
      totalAttempts: next.totalAttempts,
    };
  });

/**
 * Every topic's progress for the signed-in user, for the grammar hub's
 * per-tile accuracy display. Strips `recentRounds` (the raw round window) —
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
