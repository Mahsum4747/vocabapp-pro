import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Type-only, so no firebase-admin code reaches the client bundle — same
// convention grammar-paste-topics.ts's own top-level import uses.
import type { Firestore } from "firebase-admin/firestore";
import { authMiddleware } from "./auth/middleware";
import { foldRoundIntoRollingAccuracy } from "./grammar-progress";

/**
 * Persistence for Lesen Paste's AI-generated, learner-supplied reading
 * passages — `users/{uid}/lesenPasteTopics/{id}`, a per-user subcollection,
 * BYTE-FOR-BYTE the same shape grammar-paste-topics.ts uses for
 * `grammarPasteTopics` (same write-budget discipline, same rolling-
 * accuracy math via the shared `foldRoundIntoRollingAccuracy` helper, same
 * separation rules). See that file's own doc comment for the full
 * reasoning — repeated briefly here:
 *
 * Deliberately SEPARATE from both:
 * - `lesenProgress/{uid}` (lesen-passage-progress.ts): the bundled-content
 *   per-level completion tracking there never sees a Paste passage — a
 *   Paste topic's own accuracy/attempts live on its OWN doc here instead.
 * - The bundled `LESEN_PASSAGES` pool: nothing here is ever mixed into
 *   `pickPassage()` in grammar.lesen.tsx. This collection only feeds
 *   grammar.lesen-paste.tsx's own "Your saved passages" list.
 *
 * WRITE BUDGET, same discipline as grammar-paste-topics.ts: one write to
 * save a passage (on a successful paste, not per question), and one write
 * per finished round thereafter (never per question).
 */

const questionSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  options: z.array(z.string().trim().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().max(400).nullable(),
});

const saveSchema = z.object({
  level: z.enum(["A1", "A2", "B1", "B2"]),
  topic: z.string().trim().max(200),
  title: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1).max(4000),
  questions: z.array(questionSchema).min(1).max(20),
});

export interface LesenPasteQuestionStored {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string | null;
}

/** Summary shape for the "Your saved passages" list — no `questions`
 *  payload, kept light since the list can hold many passages. */
export interface LesenPasteTopicSummary {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  /** The learner's own typed topic, or "" if they left it blank (the AI
   *  picked its own). */
  topic: string;
  title: string;
  questionCount: number;
  createdAt: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  totalAttempts: number;
}

/** Full shape for re-opening a saved passage into a session. */
export interface LesenPasteTopicFull extends LesenPasteTopicSummary {
  text: string;
  questions: LesenPasteQuestionStored[];
}

type StoredLesenPasteTopic = {
  level: "A1" | "A2" | "B1" | "B2";
  topic: string;
  title: string;
  text: string;
  questions: LesenPasteQuestionStored[];
  createdAt: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  totalAttempts: number;
  recentResults: number[];
};

function collectionFor(db: Firestore, userId: string) {
  return db.collection("users").doc(userId).collection("lesenPasteTopics");
}

function toSummary(id: string, data: StoredLesenPasteTopic): LesenPasteTopicSummary {
  return {
    id,
    level: data.level,
    topic: data.topic,
    title: data.title,
    questionCount: data.questions.length,
    createdAt: data.createdAt,
    accuracy: data.accuracy,
    lastPracticedAt: data.lastPracticedAt,
    totalAttempts: data.totalAttempts,
  };
}

/** One write, on a successful paste (see grammar.lesen-paste.tsx's
 *  `start()`) — never per question, never automatic beyond that one save. */
export const saveLesenPasteTopic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const stored: StoredLesenPasteTopic = {
      level: data.level,
      topic: data.topic,
      title: data.title,
      text: data.text,
      // zod validates exactly 4 options and correctIndex 0-3 above; the
      // tuple/literal-union types here are narrower than what zod's own
      // inferred array/number types express, not a looser runtime check.
      questions: data.questions as LesenPasteQuestionStored[],
      createdAt: Date.now(),
      accuracy: null,
      lastPracticedAt: null,
      totalAttempts: 0,
      recentResults: [],
    };
    const ref = await collectionFor(db, context.userId).add(stored);
    return { id: ref.id };
  });

/** Every saved passage's summary for the signed-in user, newest first —
 *  the read path for grammar.lesen-paste.tsx's "Your saved passages" list. */
export const listLesenPasteTopics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LesenPasteTopicSummary[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await collectionFor(db, context.userId).orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => toSummary(d.id, d.data() as StoredLesenPasteTopic));
  });

const idSchema = z.object({ id: z.string().trim().min(1).max(200) });

/** Full content (including `questions`) for re-opening one saved passage
 *  into a session. */
export const getLesenPasteTopic = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => idSchema.parse(input))
  .handler(async ({ context, data }): Promise<LesenPasteTopicFull | null> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await collectionFor(db, context.userId).doc(data.id).get();
    if (!doc.exists) return null;
    const stored = doc.data() as StoredLesenPasteTopic;
    return {
      ...toSummary(doc.id, stored),
      text: stored.text,
      questions: stored.questions,
    };
  });

export const deleteLesenPasteTopic = createServerFn({ method: "POST" })
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
 *  discipline as grammar-paste-topics.ts's own equivalent. */
export const recordLesenPasteTopicRoundResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordSchema.parse(input))
  .handler(async ({ context, data }): Promise<LesenPasteTopicSummary | null> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = collectionFor(db, context.userId).doc(data.id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const existing = doc.data() as StoredLesenPasteTopic;

    const { accuracy, recentResults } = foldRoundIntoRollingAccuracy(
      existing.recentResults ?? [],
      data.correctInRound,
      data.totalInRound,
    );
    const totalAttempts = (existing.totalAttempts ?? 0) + data.totalInRound;
    const lastPracticedAt = Date.now();

    const next: StoredLesenPasteTopic = {
      ...existing,
      accuracy,
      lastPracticedAt,
      totalAttempts,
      recentResults,
    };
    await ref.set(next, { merge: true });
    return toSummary(doc.id, next);
  });
