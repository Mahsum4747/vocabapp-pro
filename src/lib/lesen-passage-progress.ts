import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "./auth/middleware";

/**
 * Per-level "which bundled Lesen passages has this learner already
 * finished" tracking — `lesenProgress/{uid}`, ONE write alongside (not
 * instead of) `recordGrammarRoundResult`'s existing per-round write to the
 * fixed "lesen" topicId in `grammarProgress/{uid}` (see grammar.lesen.tsx's
 * `finishRound`).
 *
 * Deliberately a SEPARATE collection, not a new field bolted onto
 * `grammarProgress`'s per-topic entry:
 * - `grammarProgress`'s `GrammarTopicProgress` is one flat scalar record
 *   per topicId (accuracy/lastPracticedAt/totalAttempts) shared by all 27
 *   fixed drills — adding a Lesen-only, per-LEVEL nested field there would
 *   be a one-off shape no other topic needs, read by nothing else, and
 *   `grammar-progress.ts`'s own `GrammarProgressDoc` type/`getGrammarProgress`
 *   return shape would need special-casing just for this one topic.
 * - A dedicated doc keeps grammar-progress.ts completely untouched (same
 *   "least interference with the existing shape" principle
 *   grammar-paste-topics.ts's own doc comment already applied), and keeps
 *   this file's own schema simple: one map, one key per CEFR level.
 *
 * Passages from Lesen Paste (lesen-paste-topics.ts) are NEVER recorded
 * here — this is bundled-content-only, matching `pickPassage()` in
 * grammar.lesen.tsx, which never draws from a learner's own pasted
 * passages either.
 *
 * WRITE BUDGET: exactly one write per finished round (never per question),
 * same discipline as every other progress write in this app.
 */

const LEVELS = ["A1", "A2", "B1", "B2"] as const;
type Level = (typeof LEVELS)[number];

export type LesenPassageProgressDoc = Partial<
  Record<Level, { completedPassageIds: string[]; lastPracticedAt: number }>
>;

const recordSchema = z.object({
  level: z.enum(LEVELS),
  passageId: z.string().trim().min(1).max(200),
});

/** Every level's completed-passage-id list for the signed-in user — the
 *  read path for grammar.lesen.tsx's "N/total completed" line and its
 *  completed-aware passage picker. Absent levels (never played) are simply
 *  missing keys, read as "0 completed" by the caller. */
export const getLesenPassageProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LesenPassageProgressDoc> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("lesenProgress").doc(context.userId).get();
    return (doc.data() ?? {}) as LesenPassageProgressDoc;
  });

/**
 * Adds one passage id to its level's completed set (a plain dedup union —
 * finishing the same passage again just confirms it's still there, it
 * doesn't duplicate) and writes it. Called once per finished round from
 * `finishRound` in grammar.lesen.tsx, alongside the existing
 * `recordGrammarRoundResult` call — fire-and-forget, same as that one, so
 * a failure here never blocks or degrades the score screen.
 */
export const recordLesenPassageCompletion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ completedPassageIds: string[] }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const { LESEN_PASSAGES } = await import("./german/lesen-data");
    if (
      !LESEN_PASSAGES.some(
        (passage) => passage.id === data.passageId && passage.level === data.level,
      )
    )
      throw new Error("Unknown bundled passage for this level.");
    const ref = db.collection("lesenProgress").doc(context.userId);
    const { recordPassageCompletion } = await import("./learning-progress.server");
    return recordPassageCompletion(db, ref, data.level, data.passageId);
  });
