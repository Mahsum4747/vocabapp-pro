export type Card = {
  id: string;
  term: string;
  definition: string;
  starred: boolean;
  mastery: number;
};

export type StudySet = {
  id: string;
  title: string;
  description: string;
  subject: string;
  createdAt: number;
  updatedAt: number;
  lastStudiedAt: number | null;
  cards: Card[];
};

export const SUBJECTS = [
  "Dil",
  "Fen",
  "Tarih",
  "Coğrafya",
  "Yazılım",
  "Genel",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const MASTERY_MAX = 5;
