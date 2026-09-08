import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Type-only, so no firebase-admin code reaches the client bundle.
import type { PartialWithFieldValue } from "firebase-admin/firestore";
import { authMiddleware, optionalAuthMiddleware } from "./auth/middleware";
import { recordStudyActivityFor, type StreakInfo } from "./streak";
import { defaultScheduler as scheduler } from "./srs";
import { planReview } from "./review-plan";
import { freshCardCopy, isCorrectRating } from "./types";
import type { Card, CardProgress, DailyStats, StudySet } from "./types";

/** Firestore ids and the date key are path segments — keep them tight. */
const idSchema = z.string().trim().min(1).max(200);

const recordReviewSchema = z.object({
  cardId: idSchema,
  setId: idSchema,
  rating: z.enum(["again", "hard", "good", "easy"]),
  /**
   * The viewer's LOCAL calendar day. The server can't derive it — deriving it
   * from the server clock would file an evening review under tomorrow for
   * anyone east of UTC. The strict shape also keeps it usable as a document
   * id: Firestore reads "a/b/c" as a nested path, so an unvalidated string
   * here would let a caller write outside the dailyStats collection.
   */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  /** Capped at an hour — a longer "response" is a tab left open, not study time. */
  responseTimeMs: z
    .number()
    .int()
    .min(0)
    .max(60 * 60 * 1000)
    .optional(),
});

const cardProgressQuerySchema = z.object({ cardId: idSchema });
const setProgressQuerySchema = z.object({ setId: idSchema });

type DraftCard = {
  term: string;
  definition: string;
  imageUrl?: string | null;
  example?: string | null;
};
type DraftCardWithProgress = DraftCard & {
  starred?: boolean;
  status?: Card["status"];
};

function uidServer(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * 64 URL-safe characters — a power of two, so taking each random byte modulo
 * the alphabet length introduces no bias.
 */
const SHARE_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const SHARE_ID_LENGTH = 10;

/**
 * A short, unguessable id for share links (~60 bits of entropy). Unlike the
 * document id this is safe to hand out, and unlike a sequential id it can't be
 * walked to enumerate other people's sets.
 */
function shareIdServer(): string {
  const bytes = new Uint8Array(SHARE_ID_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += SHARE_ID_ALPHABET[byte % SHARE_ID_ALPHABET.length];
  return out;
}

function toCards(drafts: DraftCard[]): Card[] {
  return drafts
    .map((d) => ({
      id: uidServer(),
      term: d.term.trim(),
      definition: d.definition.trim(),
      starred: false,
      imageUrl: d.imageUrl || null,
      example: d.example?.trim() || null,
    }))
    .filter((c) => c.term || c.definition);
}

export const getMySets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db.collection("study_sets").where("ownerId", "==", context.userId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
  });

/**
 * Fetch a set by id, for both reading and studying it. A signed-out visitor
 * may call this too (`context.userId` is `null` then) — anyone can read a
 * set that's `isPublic: true`; a private set is only returned to its owner.
 * Editing/deleting/toggling-public stay owner-only, checked separately below.
 *
 * `id` is either the document id or the set's `shareId`, so a /sets/{shareId}
 * link resolves through the same page as an owner's own /sets/{docId} link.
 */
export const getSetById = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const collection = db.collection("study_sets");

    let doc = await collection.doc(data.id).get();
    if (!doc.exists) {
      const bySnap = await collection.where("shareId", "==", data.id).limit(1).get();
      if (bySnap.empty) return null;
      doc = bySnap.docs[0];
    }

    const set = { id: doc.id, ...doc.data() } as StudySet;
    if (set.ownerId !== context.userId && !set.isPublic) return null;
    return set;
  });

export const getPublicSets = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const snap = await db.collection("study_sets").where("isPublic", "==", true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
});

export const createSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      description: string;
      subject: string;
      cards: DraftCard[];
      isReference?: boolean;
      termLanguage?: string;
      folder?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const id = uidServer();
    const now = Date.now();
    const folder = data.folder?.trim();
    const next: StudySet = {
      id,
      title: data.title.trim() || "Untitled set",
      description: data.description.trim(),
      subject: data.subject.trim() || "General",
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      cards: toCards(data.cards),
      ownerId: context.userId,
      isPublic: false,
      shareId: shareIdServer(),
      copyCount: 0,
      isReference: data.isReference ?? false,
      ...(data.termLanguage ? { termLanguage: data.termLanguage } : {}),
      ...(folder ? { folder } : {}),
    };
    await db.collection("study_sets").doc(id).set(next);
    return next;
  });

export const updateSetMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      patch: Partial<
        Pick<
          StudySet,
          "title" | "description" | "subject" | "isReference" | "termLanguage" | "folder"
        >
      >;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to edit this set.");
    }
    const now = Date.now();
    // Firestore's update() rejects an explicit `undefined` field value —
    // drop any patch keys left `undefined` (e.g. a set with no termLanguage)
    // instead of sending them through.
    const cleanPatch = Object.fromEntries(
      Object.entries(data.patch).filter(([, value]) => value !== undefined),
    );
    await ref.update({ ...cleanPatch, updatedAt: now });
    return { ok: true };
  });

export const replaceCards = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; cards: DraftCardWithProgress[] }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to edit this set.");
    }
    const existing = doc.data() as StudySet;
    const previous = new Map(existing.cards.map((c) => [c.term.trim().toLowerCase(), c]));
    // Learning progress is keyed by card id, so a card that survives an edit
    // has to keep its id — minting a new one on every save would orphan the
    // user's whole review history for that card.
    const usedIds = new Set<string>();
    const nextCards = data.cards
      .map((d): Card | null => {
        const term = d.term.trim();
        const definition = d.definition.trim();
        if (!term && !definition) return null;
        const prior = previous.get(term.toLowerCase());
        const status = d.status ?? prior?.status;
        // Two cards can share a term; only the first inherits the id.
        const keptId = prior && !usedIds.has(prior.id) ? prior.id : uidServer();
        usedIds.add(keptId);
        // An editor that knows about examples always sends the field (empty
        // string = cleared); one that doesn't omits it, so keep what's there.
        const example =
          d.example !== undefined ? d.example?.trim() || null : (prior?.example ?? null);
        return {
          id: keptId,
          term,
          definition,
          starred: d.starred ?? prior?.starred ?? false,
          imageUrl: d.imageUrl || null,
          example,
          ...(status ? { status } : {}),
        };
      })
      .filter((c): c is Card => c !== null);
    const now = Date.now();
    await ref.update({ cards: nextCards, updatedAt: now });
    return nextCards;
  });

export const deleteSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to delete this set.");
    }
    await ref.delete();
    return { ok: true };
  });

export const togglePublic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to change this set.");
    }
    const nextIsPublic = !doc.data()?.isPublic;
    await ref.update({ isPublic: nextIsPublic });
    return nextIsPublic;
  });

export const copyPublicSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const sourceDoc = await db.collection("study_sets").doc(data.id).get();
    if (!sourceDoc.exists || sourceDoc.data()?.isPublic !== true) {
      throw new Error("This set isn't public.");
    }
    const source = sourceDoc.data() as StudySet;
    const id = uidServer();
    const now = Date.now();
    const cloned: StudySet = {
      ...source,
      id,
      ownerId: context.userId,
      isPublic: false,
      // A copy is its own set: fresh share link, its own (zero) copy count,
      // and a pointer back to where it came from.
      shareId: shareIdServer(),
      copyCount: 0,
      copiedFrom: {
        setId: sourceDoc.id,
        ownerId: source.ownerId,
        title: source.title,
      },
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      // Content only — the copier starts from zero, not from the original
      // owner's mastery, stars, or excluded/archived flags.
      cards: source.cards.map((c) => freshCardCopy(c, uidServer())),
    };
    await db.collection("study_sets").doc(id).set(cloned);

    // Best-effort: the copy already succeeded, so a failed counter bump must
    // not fail the call. `increment` keeps concurrent copies from racing.
    try {
      const { FieldValue } = await import("./firebase-admin.server");
      await sourceDoc.ref.update({ copyCount: FieldValue.increment(1) });
    } catch (error) {
      console.error("Failed to bump copyCount:", error);
    }

    return cloned;
  });

type TransferCardsInput = { sourceSetId: string; targetSetId: string; cardIds: string[] };

/**
 * Shared by `copyCardsToSet` and `moveCardsToSet`: add the selected cards
 * (as fresh copies, mastery/starred reset) to `targetSetId`, which must be
 * owned by the caller. For a move, the cards are also removed from
 * `sourceSetId`, which must then be owned by the caller too; for a copy the
 * source only needs to be readable (own set, or someone else's public set —
 * same rule as `getSetById`).
 */
async function transferCards(userId: string, data: TransferCardsInput, removeFromSource: boolean) {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const sourceRef = db.collection("study_sets").doc(data.sourceSetId);
  const targetRef = db.collection("study_sets").doc(data.targetSetId);
  const [sourceDoc, targetDoc] = await Promise.all([sourceRef.get(), targetRef.get()]);

  if (!targetDoc.exists || targetDoc.data()?.ownerId !== userId) {
    throw new Error("You don't have permission to add cards to that set.");
  }
  if (!sourceDoc.exists) {
    throw new Error("The source set no longer exists.");
  }
  const source = sourceDoc.data() as StudySet;
  if (removeFromSource && source.ownerId !== userId) {
    throw new Error("You don't have permission to remove cards from that set.");
  }
  if (!removeFromSource && source.ownerId !== userId && !source.isPublic) {
    throw new Error("You don't have permission to read that set.");
  }

  const idSet = new Set(data.cardIds);
  const selected = source.cards.filter((c) => idSet.has(c.id));
  if (selected.length === 0) {
    throw new Error("No matching cards found.");
  }

  const target = targetDoc.data() as StudySet;
  const addedCards: Card[] = selected.map((c) => freshCardCopy(c, uidServer()));
  const now = Date.now();
  const targetCards = [...target.cards, ...addedCards];
  await targetRef.update({ cards: targetCards, updatedAt: now });

  let sourceCards = source.cards;
  if (removeFromSource) {
    sourceCards = source.cards.filter((c) => !idSet.has(c.id));
    await sourceRef.update({ cards: sourceCards, updatedAt: now });
  }

  return { addedCount: addedCards.length, targetCards, sourceCards };
}

export const copyCardsToSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: TransferCardsInput) => input)
  .handler(({ context, data }) => transferCards(context.userId, data, false));

export const moveCardsToSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: TransferCardsInput) => input)
  .handler(({ context, data }) => transferCards(context.userId, data, true));

/**
 * Record one graded review: append the raw event, advance the scheduler, roll
 * the card's counters, and add to the day's totals — one round trip, one
 * transaction.
 *
 * This is the ONLY path that writes learning progress. The three collections
 * live under `users/{userId}/`, where the id always comes from the verified
 * session, never from the request body, so a caller can only ever write their
 * own history.
 *
 * Scheduling happens here rather than on the client: the client can't be
 * trusted to compute a due date, and running it inside the transaction means
 * the next interval is always derived from the state actually stored.
 */
export const recordReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordReviewSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore, FieldValue } = await import("./firebase-admin.server");
    const db = getAdminFirestore();

    // A review only makes sense against a set the caller can actually open —
    // same rule as `getSetById`. Without this, any card/set id pair would be
    // accepted and quietly fill the history with rows for sets that the
    // caller can't see, or that don't exist at all.
    const setDoc = await db.collection("study_sets").doc(data.setId).get();
    if (!setDoc.exists) throw new Error("That set no longer exists.");
    const studySet = setDoc.data() as StudySet;
    if (studySet.ownerId !== context.userId && !studySet.isPublic) {
      throw new Error("You don't have permission to study that set.");
    }

    const now = Date.now();
    const correct = isCorrectRating(data.rating);
    const userRef = db.collection("users").doc(context.userId);
    const progressRef = userRef.collection("cardProgress").doc(data.cardId);
    const eventRef = userRef.collection("reviewEvents").doc();
    const dailyRef = userRef.collection("dailyStats").doc(data.date);

    const progress = await db.runTransaction(async (tx) => {
      // The scheduler needs the state it is advancing from, and a streak of
      // correct answers has to be read before it can be extended or broken.
      const previous = (await tx.get(progressRef)).data() as CardProgress | undefined;

      const plan = planReview({
        userId: context.userId,
        cardId: data.cardId,
        setId: data.setId,
        eventId: eventRef.id,
        rating: data.rating,
        date: data.date,
        responseTimeMs: data.responseTimeMs,
        previous: previous ?? null,
        now,
        scheduler,
      });

      // The counters are stored as increments so concurrent reviews of
      // different cards can't clobber each other's totals; the resolved values
      // in `plan.progress` are what gets returned to the client.
      const update: PartialWithFieldValue<CardProgress> = {
        ...plan.progress,
        totalReviews: FieldValue.increment(1),
        correctReviews: FieldValue.increment(correct ? 1 : 0),
      };
      const daily: PartialWithFieldValue<DailyStats> = {
        date: plan.daily.date,
        reviews: FieldValue.increment(plan.daily.reviews),
        correctReviews: FieldValue.increment(plan.daily.correctReviews),
        studySeconds: FieldValue.increment(plan.daily.studySeconds),
      };

      tx.set(progressRef, update, { merge: true });
      // A fresh document id every time: the log is append-only, never updated.
      tx.set(eventRef, plan.event);
      tx.set(dailyRef, daily, { merge: true });

      return plan.progress;
    });

    // A completed review is the study activity a streak should count — not
    // merely opening a study mode. Best-effort: the review is already stored,
    // so a streak hiccup must not fail the call.
    let streak: StreakInfo | null = null;
    try {
      streak = await recordStudyActivityFor(context.userId);
    } catch (error) {
      console.error("Failed to record streak activity:", error);
    }

    return { ok: true as const, progress, streak };
  });

/** One card's progress for the signed-in user, or null if never reviewed. */
export const getCardProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => cardProgressQuerySchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .doc(data.cardId)
      .get();
    if (!doc.exists) return null;
    return doc.data() as CardProgress;
  });

/**
 * Every progress row the signed-in user has for one set — the read path the
 * study modes, the Leitner boxes and the mastery bar all run on.
 *
 * Scoped by `setId` rather than fetching the whole collection so opening a set
 * costs one query regardless of how much history the user has elsewhere.
 */
export const getSetProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setProgressQuerySchema.parse(input))
  .handler(async ({ context, data }): Promise<CardProgress[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .where("setId", "==", data.setId)
      .get();
    return snap.docs.map((d) => d.data() as CardProgress);
  });

/**
 * Every progress row the signed-in user has, across all their sets.
 *
 * One query for the whole library grid, instead of one per set card. Bounded
 * by cards actually reviewed, not by cards owned.
 */
export const getAllProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CardProgress[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db.collection("users").doc(context.userId).collection("cardProgress").get();
    return snap.docs.map((d) => d.data() as CardProgress);
  });

/**
 * Forget everything the signed-in user has learned about one set: their
 * progress rows go, the set's content does not.
 *
 * The review event log is deliberately left alone — it is an append-only
 * record of what actually happened, and resetting progress doesn't unhappen it.
 */
export const resetSetProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setProgressQuerySchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .where("setId", "==", data.setId)
      .get();

    // Firestore caps a batch at 500 writes.
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = db.batch();
      for (const doc of snap.docs.slice(i, i + 400)) batch.delete(doc.ref);
      await batch.commit();
    }
    return { ok: true as const, cleared: snap.size };
  });
