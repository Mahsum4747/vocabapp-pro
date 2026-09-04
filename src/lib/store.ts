import { create } from "zustand";
import type { StudySet } from "./types";
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
} from "./study-sets";

type DraftCard = {
  term: string;
  definition: string;
};

type StudyState = {
  sets: StudySet[];
  publicSets: StudySet[];
  isLoaded: boolean;
  fetchSets: () => Promise<void>;
  fetchSetById: (id: string) => Promise<StudySet | null>;
  fetchPublicSets: () => Promise<void>;
  addSet: (input: {
    title: string;
    description: string;
    subject: string;
    cards: DraftCard[];
  }) => Promise<string>;
  updateSetMeta: (
    id: string,
    patch: Partial<Pick<StudySet, "title" | "description" | "subject">>,
  ) => Promise<void>;
  replaceCards: (id: string, cards: DraftCard[]) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  toggleStar: (setId: string, cardId: string) => Promise<void>;
  bumpMastery: (setId: string, cardId: string, delta: number) => Promise<void>;
  resetMastery: (setId: string) => Promise<void>;
  markStudied: (setId: string) => Promise<void>;
  importSet: (set: StudySet) => Promise<string>;
  restoreSeeds: () => Promise<void>;
  togglePublic: (setId: string) => Promise<void>;
  copyPublicSet: (setId: string) => Promise<string | null>;
};

export const useStudyStore = create<StudyState>()((set, get) => ({
  sets: [],
  publicSets: [],
  isLoaded: false,

  fetchSets: async () => {
    try {
      const sets = await getMySets();
      set({ sets, isLoaded: true });
    } catch (error) {
      console.error("Setler çekilemedi:", error);
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
      console.error("Set çekilemedi:", error);
      return null;
    }
  },

  fetchPublicSets: async () => {
    try {
      const publicSets = await getPublicSets();
      set({ publicSets });
    } catch (error) {
      console.error("Herkese açık setler çekilemedi:", error);
    }
  },

  addSet: async ({ title, description, subject, cards }) => {
    const next = await createSet({ data: { title, description, subject, cards } });
    set({ sets: [next, ...get().sets] });
    return next.id;
  },

  updateSetMeta: async (id, patch) => {
    await updateSetMetaFn({ data: { id, patch } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: now } : s)),
    });
  },

  replaceCards: async (id, cards) => {
    const nextCards = await replaceCardsFn({ data: { id, cards } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id === id ? { ...s, cards: nextCards, updatedAt: now } : s,
      ),
    });
  },

  deleteSet: async (id) => {
    await deleteSetFn({ data: { id } });
    set({ sets: get().sets.filter((s) => s.id !== id) });
  },

  toggleStar: async (setId, cardId) => {
    const targetSet = get().sets.find((s) => s.id === setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId ? { ...card, starred: !card.starred } : card,
    );
    await replaceCardsFn({ data: { id: setId, cards: updatedCards } });
    set({
      sets: get().sets.map((s) => (s.id !== setId ? s : { ...s, cards: updatedCards })),
    });
  },

  bumpMastery: async (setId, cardId, delta) => {
    const targetSet = get().sets.find((s) => s.id === setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId
        ? { ...card, mastery: Math.min(5, Math.max(0, card.mastery + delta)) }
        : card,
    );
    await replaceCardsFn({ data: { id: setId, cards: updatedCards } });
    set({
      sets: get().sets.map((s) => (s.id !== setId ? s : { ...s, cards: updatedCards })),
    });
  },

  resetMastery: async (setId) => {
    const targetSet = get().sets.find((s) => s.id === setId);
    if (!targetSet) return;
    const updatedCards = targetSet.cards.map((card) => ({ ...card, mastery: 0 }));
    await replaceCardsFn({ data: { id: setId, cards: updatedCards } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id !== setId ? s : { ...s, updatedAt: now, cards: updatedCards },
      ),
    });
  },

  markStudied: async (setId) => {
    await updateSetMetaFn({ data: { id: setId, patch: {} } });
    const now = Date.now();
    set({
      sets: get().sets.map((s) =>
        s.id === setId ? { ...s, lastStudiedAt: now, updatedAt: now } : s,
      ),
    });
  },

  importSet: async (incoming) => {
    const next = await createSet({
      data: {
        title: incoming.title,
        description: incoming.description,
        subject: incoming.subject,
        cards: incoming.cards.map((c) => ({ term: c.term, definition: c.definition })),
      },
    });
    set({ sets: [next, ...get().sets] });
    return next.id;
  },

  togglePublic: async (setId) => {
    const nextIsPublic = await togglePublicFn({ data: { id: setId } });
    set({
      sets: get().sets.map((s) => (s.id === setId ? { ...s, isPublic: nextIsPublic } : s)),
    });
  },

  copyPublicSet: async (setId) => {
    const cloned = await copyPublicSetFn({ data: { id: setId } });
    set({ sets: [cloned, ...get().sets] });
    return cloned.id;
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
  return useStudyStore((state) => state.sets.find((item) => item.id === id));
}