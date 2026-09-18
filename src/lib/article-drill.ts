import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import type { ArticleDrillProgress, StudySet } from "./types";

/**
 * Server functions for Phase 3C's article drill — "which article is this
 * noun" practice, testing der/die/das specifically, unlike 3B.5's typed-
 * answer leniency (which accepts any article as an unpenalized prefix).
 *
 * Deliberately its own tiny module, not added to study-sets.ts: the whole
 * point is a write path with nothing in it that could reach `recordReview`,
 * the FSRS scheduler, `cardProgress`, `reviewEvents`, `dailyStats`, or XP/
 * achievements. Keeping it physically separate makes that easy to verify —
 * see article-drill.test.ts, which greps this file for exactly that.
 */

const idSchema = z.string().trim().min(1).max(200);
const articleSchema = z.string().trim().min(1).max(50);

const recordAttemptSchema = z.object({
  cardId: idSchema,
  setId: idSchema,
  correct: z.boolean(),
  selectedArticle: articleSchema,
  correctArticle: articleSchema,
});

const setQuerySchema = z.object({ setId: idSchema });

/**
 * Record one article-drill attempt for the signed-in user.
 *
 * A plain merge-write of an attempts/correct counter — no scheduler, no due
 * date, no mastery score. Ownership check mirrors `recordReview`'s: a drill
 * attempt only makes sense against a set the caller can actually open.
 */
export const recordArticleDrillAttempt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordAttemptSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore, FieldValue } = await import("./firebase-admin.server");
    const db = getAdminFirestore();

    const setDoc = await db.collection("study_sets").doc(data.setId).get();
    if (!setDoc.exists) throw new Error("That set no longer exists.");
    const studySet = setDoc.data() as StudySet;
    if (studySet.ownerId !== context.userId && !studySet.isPublic) {
      throw new Error("You don't have permission to study that set.");
    }

    const userRef = db.collection("users").doc(context.userId);
    const ref = userRef.collection("articleDrillProgress").doc(data.cardId);

    const now = Date.now();
    await ref.set(
      {
        cardId: data.cardId,
        setId: data.setId,
        attempts: FieldValue.increment(1),
        correct: FieldValue.increment(data.correct ? 1 : 0),
        lastAttemptAt: now,
      },
      { merge: true },
    );

    // Append-only error log, wrong attempts only — pure data collection for
    // future error-type analysis, no scheduler/mastery implications. A
    // separate write, not part of the update above: its failure must never
    // stop the user's attempt (the counters above) from being recorded.
    if (!data.correct) {
      try {
        await userRef.collection("articleDrillErrors").add({
          cardId: data.cardId,
          setId: data.setId,
          selectedArticle: data.selectedArticle,
          correctArticle: data.correctArticle,
          occurredAt: now,
        });
      } catch {
        // Best-effort log only; swallow so the attempt above still counts.
      }
    }

    return { ok: true as const };
  });

/** Every article-drill row the signed-in user has for one set. */
export const getArticleDrillProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setQuerySchema.parse(input))
  .handler(async ({ context, data }): Promise<ArticleDrillProgress[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("users")
      .doc(context.userId)
      .collection("articleDrillProgress")
      .where("setId", "==", data.setId)
      .get();
    return snap.docs.map((d) => d.data() as ArticleDrillProgress);
  });
