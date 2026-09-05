import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";
import type { Card, StudySet } from "./types";

type DraftCard = { term: string; definition: string };
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
    }))
    .filter((c) => c.term || c.definition);
}

export const getMySets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("study_sets")
      .where("ownerId", "==", context.userId)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
  });

export const getSetById = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("study_sets").doc(data.id).get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as StudySet;
  });

export const getPublicSets = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("study_sets")
      .where("isPublic", "==", true)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
  },
);

export const createSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      description: string;
      subject: string;
      cards: DraftCard[];
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
    };
    await db.collection("study_sets").doc(id).set(next);
    return next;
  });

export const updateSetMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      patch: Partial<Pick<StudySet, "title" | "description" | "subject">>;
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
    const previous = new Map(
      existing.cards.map((c) => [c.term.trim().toLowerCase(), c]),
    );
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