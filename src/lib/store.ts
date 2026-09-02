import { create } from "zustand";
import type { Card, StudySet } from "./types";
import { uid } from "./utils";
import { MASTERY_MAX } from "./types";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC1imYK_UXvZ89Y1uxMCmOypr-5fqhmSiE",
    authDomain: "vocabappmm.firebaseapp.com",
    projectId: "vocabappmm",
    storageBucket: "vocabappmm.firebasestorage.app",
    messagingSenderId: "571186108874",
    appId: "1:571186108874:web:e3ff09569f873ba91f9733"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type DraftCard = {
  term: string;
  definition: string;
};

type StudyState = {
  sets: StudySet[];
  isLoaded: boolean;
  fetchSets: () => Promise<void>;
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
};

function toCards(drafts: DraftCard[]): Card[] {
  return drafts
    .map((draft) => ({
      id: uid(),
      term: draft.term.trim(),
      definition: draft.definition.trim(),
      starred: false,
      mastery: 0,
    }))
    .filter((card) => card.term || card.definition);
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  sets: [],
  isLoaded: false,

  fetchSets: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "study_sets"));
      const remoteSets: StudySet[] = [];
      querySnapshot.forEach((docSnap) => {
        remoteSets.push({ id: docSnap.id, ...docSnap.data() } as StudySet);
      });
      set({ sets: remoteSets, isLoaded: true });
    } catch (error) {
      console.error("Firebase'den veri çekilemedi:", error);
    }
  },

  addSet: async ({ title, description, subject, cards }) => {
    const id = uid();
    const now = Date.now();
    const next: StudySet = {
      id,
      title: title.trim() || "Adsız set",
      description: description.trim(),
      subject: subject.trim() || "Genel",
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      cards: toCards(cards),
    };

    await setDoc(doc(db, "study_sets", id), next);
    set({ sets: [next, ...get().sets] });
    return id;
  },

  updateSetMeta: async (id, patch) => {
    const now = Date.now();
    const target = get().sets.find(s => s.id === id);
    if (!target) return;

    const updated = { ...target, ...patch, updatedAt: now };
    await updateDoc(doc(db, "study_sets", id), { ...patch, updatedAt: now });

    set({
      sets: get().sets.map((s) => (s.id === id ? updated : s)),
    });
  },

  replaceCards: async (id, cards) => {
    const existing = get().sets.find((s) => s.id === id);
    if (!existing) return;
    const previous = new Map(existing.cards.map((card) => [card.term.trim().toLowerCase(), card]));
    const nextCards: Card[] = toCards(cards).map((card) => {
      const prior = previous.get(card.term.toLowerCase());
      if (!prior) return card;
      return {
        ...card,
        starred: prior.starred,
        mastery: prior.mastery,
      };
    });

    const now = Date.now();
    await updateDoc(doc(db, "study_sets", id), { cards: nextCards, updatedAt: now });

    set({
      sets: get().sets.map((studySet) =>
        studySet.id === id
          ? { ...studySet, cards: nextCards, updatedAt: now }
          : studySet,
      ),
    });
  },

  deleteSet: async (id) => {
    await deleteDoc(doc(db, "study_sets", id));
    set({ sets: get().sets.filter((studySet) => studySet.id !== id) });
  },

  toggleStar: async (setId, cardId) => {
    const targetSet = get().sets.find(s => s.id === setId);
    if (!targetSet) return;

    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId ? { ...card, starred: !card.starred } : card
    );

    await updateDoc(doc(db, "study_sets", setId), { cards: updatedCards });

    set({
      sets: get().sets.map((studySet) =>
        studySet.id !== setId ? studySet : { ...studySet, cards: updatedCards }
      ),
    });
  },

  bumpMastery: async (setId, cardId, delta) => {
    const targetSet = get().sets.find(s => s.id === setId);
    if (!targetSet) return;

    const updatedCards = targetSet.cards.map((card) =>
      card.id === cardId
        ? { ...card, mastery: Math.min(MASTERY_MAX, Math.max(0, card.mastery + delta)) }
        : card
    );

    await updateDoc(doc(db, "study_sets", setId), { cards: updatedCards });

    set({
      sets: get().sets.map((studySet) =>
        studySet.id !== setId ? studySet : { ...studySet, cards: updatedCards }
      ),
    });
  },

  resetMastery: async (setId) => {
    const targetSet = get().sets.find(s => s.id === setId);
    if (!targetSet) return;

    const now = Date.now();
    const updatedCards = targetSet.cards.map((card) => ({ ...card, mastery: 0 }));

    await updateDoc(doc(db, "study_sets", setId), { cards: updatedCards, updatedAt: now });

    set({
      sets: get().sets.map((studySet) =>
        studySet.id !== setId
          ? studySet
          : { ...studySet, updatedAt: now, cards: updatedCards }
      ),
    });
  },

  markStudied: async (setId) => {
    const now = Date.now();
    await updateDoc(doc(db, "study_sets", setId), { lastStudiedAt: now, updatedAt: now });

    set({
      sets: get().sets.map((studySet) =>
        studySet.id === setId
          ? { ...studySet, lastStudiedAt: now, updatedAt: now }
          : studySet,
      ),
    });
  },

  importSet: async (incoming) => {
    const id = uid();
    const now = Date.now();
    const cloned: StudySet = {
      ...incoming,
      id,
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      cards: incoming.cards.map((card) => ({ ...card, id: uid() })),
    };

    await setDoc(doc(db, "study_sets", id), cloned);
    set({ sets: [cloned, ...get().sets] });
    return id;
  },

  restoreSeeds: async () => {},
}));

// HydrationGate bileşeninin patlamasını önleyen güvenli persist köprüsü
(useStudyStore as any).persist = {
  rehydrate: async () => {},
  hasHydrated: () => true,
  onRehydrateStorage: () => () => {},
  clearStorage: () => {}
};

// İlk açılışta buluttan verileri çek
useStudyStore.getState().fetchSets();

export function useSet(id: string | undefined) {
  return useStudyStore((state) => state.sets.find((item) => item.id === id));
}