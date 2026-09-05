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
  ownerId: string;
  isPublic: boolean;
};

export const SUBJECTS = [
  "Language",
  "Science",
  "History",
  "Geography",
  "Software",
  "General",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const MASTERY_MAX = 5;