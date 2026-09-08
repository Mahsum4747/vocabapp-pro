import { useEffect } from "react";
import { create } from "zustand";
import type { CardProgress, CardStatus, ReviewRating, StudySet } from "./types";
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
  recordReview as recordReviewFn,
  getSetProgress as getSetProgressFn,
  getAllProgress as getAllProgressFn,
  resetSetProgress as resetSetProgressFn,
} from "./study-sets";
import { getStreak as getStreakFn, type StreakInfo } from "./streak";
import { localDateKey } from "./utils";

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
  /**
   * The signed-in user's learning progress, keyed by card id. Flat rather
   * than nested per set: a card id is unique, and every read site (mastery
   * bar, Leitner boxes, review queue) wants a card-id lookup.
   */
  progress: Record<string, CardProgress>;
  /** Set ids whose progress has been fetched, so a set isn't refetched per mode. */
  loadedProgressSetIds: string[];
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
  /** Load this set's progress rows for the signed-in user. */
  fetchSetProgress: (setId: string) => Promise<void>;
  /** Load every progress row the user has — one query for the whole library. */
  fetchAllProgress: () => Promise<void>;
  /**
   * Record one graded review. The single client entry point into the SRS
   * engine — the server schedules, this just stores what came back.
   */
  recordReview: (input: {
    setId: string;
    cardId: string;
    rating: ReviewRating;
    responseTimeMs?: number;
  }) => Promise<void>;
  /** Forget this set's learning progress (content is untouched). */
  resetProgress: (setId: string) => Promise<void>;
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
  progress: {},
  loadedProgressSetIds: [],

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

  // Starring lives on the set document, so only its owner can persist it
  // (server-enforced). Studying someone else's public set still updates this
  // tab's view optimistically so the mode works end-to-end; it just doesn't
  // stick past a reload for a non-owner, which is expected since it isn't
  // "your" set to curate. Learning progress is NOT like this — it is stored
  // per user, so it persists for everyone (see recordReview below).
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

  fetchSetProgress: async (setId) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    try {
      const rows = await getSetProgressFn({ data: { setId: resolvedId } });
      const next = { ...get().progress };
      for (const row of rows) next[row.cardId] = row;
      set({
        progress: next,
        loadedProgressSetIds: Array.from(new Set([...get().loadedProgressSetIds, resolvedId])),
      });
    } catch (error) {
      // Signed out, or someone else's set — study still works, it just shows
      // no prior progress.
      console.error("Failed to load progress:", error);
    }
  },

  fetchAllProgress: async () => {
    try {
      const rows = await getAllProgressFn();
      const next: Record<string, CardProgress> = {};
      for (const row of rows) next[row.cardId] = row;
      set({
        progress: { ...get().progress, ...next },
        loadedProgressSetIds: Array.from(
          new Set([...get().loadedProgressSetIds, ...rows.map((r) => r.setId)]),
        ),
      });
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  },

  recordReview: async ({ setId, cardId, rating, responseTimeMs }) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    const result = await recordReviewFn({
      data: {
        setId: resolvedId,
        cardId,
        rating,
        date: localDateKey(),
        ...(responseTimeMs !== undefined ? { responseTimeMs } : {}),
      },
    });
    // The server returns the scheduled state it just stored, so the mastery
    // bar and Leitner boxes update without a refetch.
    set({
      progress: { ...get().progress, [cardId]: result.progress },
      ...(result.streak ? { streak: result.streak } : {}),
    });
  },

  resetProgress: async (setId) => {
    const resolvedId = findSet(get().sets, setId)?.id ?? setId;
    await resetSetProgressFn({ data: { setId: resolvedId } });
    const cardIds = new Set(findSet(get().sets, setId)?.cards.map((c) => c.id) ?? []);
    const next = { ...get().progress };
    for (const id of cardIds) delete next[id];
    set({ progress: next });
  },

  // Curation, not progress — owner-only in the UI, so unlike toggleStar this
  // doesn't need to tolerate a non-owner viewer.
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
      // Only the owner can persist `updatedAt` on the set's own document.
      // This marks "you opened this set", nothing more — the streak is driven
      // by completed reviews, server-side, inside recordReview.
      await updateSetMetaFn({ data: { id: resolvedId, patch: {} } });
    } catch (error) {
      console.error("Failed to record set activity:", error);
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

/**
 * The signed-in user's progress, keyed by card id — the read path for the
 * mastery bar, the Leitner boxes and the review queue.
 *
 * Returns the whole map rather than slicing per set: it is one object
 * reference, so components re-render only when a review actually lands.
 */
export function useProgress(): Record<string, CardProgress> {
  return useStudyStore((state) => state.progress);
}

/**
 * Load a set's progress once. Safe to call from every study mode — the second
 * caller for the same set is a no-op.
 */
export function useSetProgress(setId: string | undefined) {
  const progress = useProgress();
  const fetchSetProgress = useStudyStore((s) => s.fetchSetProgress);
  const loaded = useStudyStore((s) => s.loadedProgressSetIds);
  const resolvedId = useSet(setId)?.id;

  useEffect(() => {
    if (!resolvedId || loaded.includes(resolvedId)) return;
    void fetchSetProgress(resolvedId);
  }, [resolvedId, loaded, fetchSetProgress]);

  return progress;
}
