import { z } from "zod";
/** Identifiers are single Firestore path segments, never paths. */
export const documentIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .refine((v) => !v.includes("/") && v !== "." && v !== "..", "Invalid document ID");
export const roundCountsSchema = z
  .object({
    correctInRound: z.number().int().min(0),
    totalInRound: z.number().int().min(1).max(50),
  })
  .refine((v) => v.correctInRound <= v.totalInRound, "Correct count exceeds total");
export function assertCardMembership(cards: readonly { id: string }[], cardId: string): void {
  if (!cards.some((card) => card.id === cardId))
    throw new Error("Card does not belong to this set.");
}
