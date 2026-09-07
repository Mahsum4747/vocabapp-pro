import { create } from "zustand";
import type { CardStatus, StudySet } from "./types";
import {
  getMySets,
  getSetById as getSetByIdFn,
  getPublicSets,
  createSet,
  updateSetMeta as updateSetMetaFn,
  replaceCards as replaceCardsFn,
  deleteSet as deleteSetFn,
  togglePublic as togglePublicFn,
  copyPublicSet as copyPublicSetFn,
  copyCardsToSet as copyCardsToSetFn,
  moveCardsToSet as moveCardsToSetFn,
} from "./study-sets";
import {
  getStreak as getStreakFn,
  recordStudyActivity as recordStudyActivityFn,
  type StreakInfo,
} from "./streak";

type DraftCard = {
  term: string;
  definition: string;
  imageUrl?: string | null;
  example?: string | null;
};

type StudyState = {
  sets: StudySet[];
  publicSets: StudySet[];
  isLoaded: boolean;
  streak: StreakInfo | null;
  fetchSets: () => Promise<void>;
  fetchSetById: (id: string) => Promise<StudySet | null>;
  fetchPublicSets: () => Promise<void>;
  fetchStreak: () => Promise<void>;
  addSet: (input: {
    title: string;
    description: string;
    subject: string;
    cards: DraftCard[];
    isReference?: boolean;
    termLanguage?: string;
    folder?: string;
  }) => Promise<string>;
  updateSetMeta: (
    id: string,
    patch: Partial<
      Pick<
        StudySet,
        "title" | "description" | "subject" | "isReference" | "termLanguage" | "folder"
      >
    >,
  ) => Promise<void>;
  replaceCards: (id: string, cards: DraftCard[]) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  toggleStar: (setId: string, cardId: string) => Promise<void>;
  bumpMastery: (setId: string, cardId: string, delta: number) => Promise<void>;
  resetMastery: (setId: string) => Promise<void>;
  setCardStatus: (setId: string, cardId: string, status: CardStatus) => Promise<void>;
  markStudied: (setId: string) => Promise<void>;
  importSet: (set: StudySet) => Promise<string>;
  restoreSeeds: () => Promise<void>;
  togglePublic: (setId: string) => Promise<void>;
  copyPublicSet: (setId: string) => Promise<string | null>;
  /**
   * Load the caller's own sets for a "copy/move cards to…" picker, merging
   * them into `sets` without discarding what's already there (e.g. a public
   * set currently being viewed). Returns the caller's own sets, or `null`
   * when the fetch failed (most likely signed out) — the picker uses that to
   * send the visitor to sign in instead of showing an empty list.
   */
  fetchMySetsForTransfer: () => Promise<StudySet[] | null>;
  copyCardsToSet: (sourceSetId: string, targetSetId: string, cardIds: string[]) => Promise<number>;
  moveCardsToSet: (sourceSetId: string, targetSetId: string, cardIds: string[]) => Promise<number>;
};

/**
 * A route param is either a set's document id or its public `shareId`
 * (/sets/{shareId} share links), so every client-side lookup accepts both.
 * Server functions always take the resolved document id.
 */
function findSet(sets: StudySet[], idOrShareId: string): StudySet | undefined {
  return sets.find((s) => s.id === idOrShareId || s.shareId === idOrShareId);
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  sets: [],
  publicSets: [],
  isLoaded: false,
  streak: null,

  fetchSets: async () => {
    try {
      const sets = await getMySets();
      set({ sets, isLoaded: true });
    } catch (error) {
      console.error("Failed to fetch sets:", error);
      set({ sets: [], isLoaded: true });
    }
  },

  fetchSetById: async (id) => {
    try {
      const found = await getSetByIdFn({ data: { id } });
      if (found) {
        set({
          sets: get().sets.some((s) => s.id === found.id)
            ? get().sets.map((s) => (s.id === found.id ? found : s))
            : [...get().sets, found],
        });
      }
      return found;
    } catch (error) {
      console.error("Failed to fetch set:", error);
      return null;
    }
  },

  fetchPublicSets: async () => {
    try {
      const publicSets = await getPublicSets();
      set({ publicSets });
    } catch (error) {
      console.error("Failed to fetch public sets:", error);
    }
  },

  fetchStreak: async () => {
    try {
      const streak = await getStreakFn();
      set({ streak });
    } catch (error) {
      console.error("Failed to fetch streak:", error);
    }
  },

  addSet: async ({ title, description, subject, cards, isReference, termLanguage, folder }) => {
    const next = await createSet({
      data: { title, description, subject, cards, isReference, termLanguage, folder },
    });
    set({ sets: [next, ...get().sets] });
    return next.id;
  },

  updateSetMeta: async (id, patch) => {
    const setId = findSet(get().sets, id)?.id ?? id;
    await updateSetMetaFn({ data: { id: setId, patch } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) => (s.id === setId ? { ...s, ...patch, updatedAt: now } : s)),
    });
  },

  replaceCards: async (id, cards) => {
    const setId = findSet(get().sets, id)?.id ?? id;
    const nextCards = await replaceCardsFn({ data: { id: setId, cards } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id === setId ? { ...s, cards: nextCards, updatedAt: now } : s,
      ),
    });
  },

  deleteSet: async (id) => {
    const setId = findSet(get().sets, id)?.id ?? id;
    await deleteSetFn({ data: { id: setId } });
    set({ sets: get().sets.filter((s) => s.id !== setId) });
  },

  // Starring/mastery are per-card progress on the set's own document — only
  // its owner can persist them (server-enforced). Studying someone else's
  // public set still updates this tab's view optimistically so the mode
  // itself works end-to-end; it just doesn't stick past a reload for a
  // non-owner, which is expected since it isn't "your" set to track.
  toggleStar: async (setId, cardId) => {
    const targetSet = findSet(get().sets, setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId ? { ...card, starred: !card.starred } : card,
    );
    set({
      sets: get().sets.map((s) => (s.id !== targetSet.id ? s : { ...s, cards: updatedCards })),
    });
    try {
      await replaceCardsFn({ data: { id: targetSet.id, cards: updatedCards } });
    } catch (error) {
      console.error("Failed to save star:", error);
    }
  },

  bumpMastery: async (setId, cardId, delta) => {
    const targetSet = findSet(get().sets, setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId
        ? { ...card, mastery: Math.min(5, Math.max(0, card.mastery + delta)) }
        : card,
    );
    set({
      sets: get().sets.map((s) => (s.id !== targetSet.id ? s : { ...s, cards: updatedCards })),
    });
    try {
      await replaceCardsFn({ data: { id: targetSet.id, cards: updatedCards } });
    } catch (error) {
      console.error("Failed to save mastery:", error);
    }
  },

  resetMastery: async (setId) => {
    const targetSet = findSet(get().sets, setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) => ({ ...card, mastery: 0 }));
    await replaceCardsFn({ data: { id: targetSet.id, cards: updatedCards } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id !== targetSet.id ? s : { ...s, updatedAt: now, cards: updatedCards },
      ),
    });
  },

  // Curation, not progress — owner-only in the UI, so unlike toggleStar/
  // bumpMastery this doesn't need to tolerate a non-owner viewer.
  setCardStatus: async (setId, cardId, status) => {
    const targetSet = findSet(get().sets, setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId ? { ...card, status } : card,
    );
    const nextCards = await replaceCardsFn({ data: { id: targetSet.id, cards: updatedCards } });
    set({
      sets: get().sets.map((s) => (s.id !== targetSet.id ? s : { ...s, cards: nextCards })),
    });
  },

  markStudied: async (setId) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id === resolvedId ? { ...s, lastStudiedAt: now, updatedAt: now } : s,
      ),
    });
    try {
      // Only the owner can persist `updatedAt` on the set's own document —
      // studying someone else's public set still counts for YOUR streak below.
      await updateSetMetaFn({ data: { id: resolvedId, patch: {} } });
    } catch (error) {
      console.error("Failed to record set activity:", error);
    }
    try {
      const streak = await recordStudyActivityFn();
      set({ streak });
    } catch (error) {
      console.error("Failed to record study activity:", error);
    }
  },

  importSet: async (incoming) => {
    const next = await createSet({
      data: {
        title: incoming.title,
        description: incoming.description,
        subject: incoming.subject,
        cards: incoming.cards.map((c) => ({
          term: c.term,
          definition: c.definition,
          example: c.example ?? null,
        })),
      },
    });
    set({ sets: [next, ...get().sets] });
    return next.id;
  },

  togglePublic: async (setId) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    const nextIsPublic = await togglePublicFn({ data: { id: resolvedId } });
    set({
      sets: get().sets.map((s) => (s.id === resolvedId ? { ...s, isPublic: nextIsPublic } : s)),
    });
  },

  copyPublicSet: async (setId) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    const cloned = await copyPublicSetFn({ data: { id: resolvedId } });
    set({
      sets: [cloned, ...get().sets],
      // Mirror the server's counter bump so the source card's "N copies"
      // updates without a refetch.
      publicSets: get().publicSets.map((s) =>
        s.id === resolvedId ? { ...s, copyCount: (s.copyCount ?? 0) + 1 } : s,
      ),
    });
    return cloned.id;
  },

  fetchMySetsForTransfer: async () => {
    try {
      const mySets = await getMySets();
      set((state) => {
        const byId = new Map(state.sets.map((s) => [s.id, s]));
        for (const s of mySets) byId.set(s.id, s);
        return { sets: Array.from(byId.values()), isLoaded: true };
      });
      return mySets;
    } catch (error) {
      console.error("Failed to load your sets:", error);
      return null;
    }
  },

  copyCardsToSet: async (sourceSetId, targetSetId, cardIds) => {
    const source = findSet(get().sets, sourceSetId)?.id ?? sourceSetId;
    const target = findSet(get().sets, targetSetId)?.id ?? targetSetId;
    const result = await copyCardsToSetFn({
      data: { sourceSetId: source, targetSetId: target, cardIds },
    });
    set({
      sets: get().sets.map((s) => (s.id === target ? { ...s, cards: result.targetCards } : s)),
    });
    return result.addedCount;
  },

  moveCardsToSet: async (sourceSetId, targetSetId, cardIds) => {
    const source = findSet(get().sets, sourceSetId)?.id ?? sourceSetId;
    const target = findSet(get().sets, targetSetId)?.id ?? targetSetId;
    const result = await moveCardsToSetFn({
      data: { sourceSetId: source, targetSetId: target, cardIds },
    });
    set({
      sets: get().sets.map((s) => {
        if (s.id === target) return { ...s, cards: result.targetCards };
        if (s.id === source) return { ...s, cards: result.sourceCards };
        return s;
      }),
    });
    return result.addedCount;
  },

  restoreSeeds: async () => {},
}));

(useStudyStore as any).persist = {
  rehydrate: async () => {},
  hasHydrated: () => true,
  onRehydrateStorage: () => () => {},
  clearStorage: () => {},
};

export function useSet(id: string | undefined) {
  return useStudyStore((state) => (id ? findSet(state.sets, id) : undefined));
}
