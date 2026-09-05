import { createServerFn } from "@tanstack/react-start";
import { authMiddleware, optionalAuthMiddleware } from "./auth/middleware";
import type { Card, StudySet } from "./types";

type DraftCard = { term: string; definition: string; imageUrl?: string | null };
type DraftCardWithProgress = DraftCard & { starred?: boolean; mastery?: number };

function uidServer(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function toCards(drafts: DraftCard[]): Card[] {
  return drafts
    .map((d) => ({
      id: uidServer(),
      term: d.term.trim(),
      definition: d.definition.trim(),
      starred: false,
      mastery: 0,
      imageUrl: d.imageUrl || null,
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
 */
export const getSetById = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("study_sets").doc(data.id).get();
    if (!doc.exists) return null;
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
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const id = uidServer();
    const now = Date.now();
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
      isReference: data.isReference ?? false,
    };
    await db.collection("study_sets").doc(id).set(next);
    return next;
  });

export const updateSetMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      patch: Partial<Pick<StudySet, "title" | "description" | "subject" | "isReference">>;
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
    await ref.update({ ...data.patch, updatedAt: now });
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
    const nextCards = data.cards
      .map((d) => {
        const term = d.term.trim();
        const definition = d.definition.trim();
        if (!term && !definition) return null;
        const prior = previous.get(term.toLowerCase());
        return {
          id: uidServer(),
          term,
          definition,
          starred: d.starred ?? prior?.starred ?? false,
          mastery: d.mastery ?? prior?.mastery ?? 0,
          imageUrl: d.imageUrl || null,
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
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      cards: source.cards.map((c) => ({ ...c, id: uidServer() })),
    };
    await db.collection("study_sets").doc(id).set(cloned);
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
  const addedCards: Card[] = selected.map((c) => ({
    id: uidServer(),
    term: c.term,
    definition: c.definition,
    starred: false,
    mastery: 0,
    imageUrl: c.imageUrl,
  }));
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
