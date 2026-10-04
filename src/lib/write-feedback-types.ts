import { logOperationFailure } from "./diagnostics";
import { z } from "zod";

/**
 * Structured error tags returned alongside Write mode's free-text AI
 * feedback (write-sentence-feedback.ts) — additive, Dilim 3. The category
 * list is given to Gemini verbatim so it can't invent new ones; anything
 * else that comes back is dropped rather than surfaced or thrown on (see
 * `parseErrorTags` below).
 */
export const ERROR_CATEGORIES = [
  "article_gender",
  "case",
  "verb_position",
  "verb_conjugation",
  "register",
  "missing_leitpunkt",
  "word_choice",
  "spelling",
  "word_order_other",
] as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[number];

export interface FeedbackErrorTag {
  category: ErrorCategory;
  severity: "minor" | "major";
  excerpt?: string;
}

const errorTagSchema = z.object({
  category: z.enum(ERROR_CATEGORIES),
  severity: z.enum(["minor", "major"]),
  excerpt: z.string().trim().min(1).max(200).optional(),
});

/**
 * Fail-safe, not fail-loud: an unknown category or a malformed single tag
 * is dropped, valid tags in the same array still parse; anything that
 * isn't an array at all (missing field, wrong type, whole block malformed)
 * yields `[]`. Never throws. Logs a privacy-safe diagnostic so
 * a parse miss is noticeable during testing without ever blocking submit
 * or surfacing to the user — the free-text feedback renders regardless.
 */
export function parseErrorTags(raw: unknown): FeedbackErrorTag[] {
  if (!Array.isArray(raw)) {
    if (raw !== undefined) logOperationFailure("write.tags.invalid", new Error("Invalid tags"));
    return [];
  }
  const tags: FeedbackErrorTag[] = [];
  for (const item of raw) {
    const result = errorTagSchema.safeParse(item);
    if (result.success) {
      tags.push(result.data);
    } else {
      logOperationFailure("write.tags.invalid", result.error);
    }
  }
  return tags;
}
