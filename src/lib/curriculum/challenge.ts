import { z } from "zod";
const id = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[A-Za-z0-9._-]+$/);
export const challengeScopeSchema = z.object({ trackId: id, releaseId: id, unitId: id }).strict();
export const challengeStartSchema = challengeScopeSchema
  .extend({ attemptId: z.string().uuid() })
  .strict();
export const challengeSubmitSchema = challengeStartSchema
  .extend({
    responses: z
      .array(z.object({ itemId: id, response: z.string().min(1).max(160) }).strict())
      .min(8)
      .max(8),
  })
  .strict();
export const challengeSummarySchema = challengeScopeSchema
  .extend({
    schemaVersion: z.literal(1),
    purpose: z.literal("unit-challenge"),
    ownerId: id,
    contractVersion: z.literal(1),
    revision: z.number().int().nonnegative(),
    attemptCount: z.number().int().nonnegative(),
    clearedAt: z.number().int().nonnegative().nullable(),
    activeAttemptId: z.string().uuid().nullable(),
    lastAttemptId: z.string().uuid().nullable(),
    retryAfter: z.number().int().nonnegative().nullable(),
  })
  .strict();
export const challengeAttemptSchema = challengeScopeSchema
  .extend({
    schemaVersion: z.literal(1),
    purpose: z.literal("unit-challenge"),
    ownerId: id,
    contractVersion: z.literal(1),
    attemptId: z.string().uuid(),
    formId: z.enum(["A", "B"]),
    status: z.enum(["in-progress", "submitted"]),
    startedAt: z.number().int().nonnegative(),
    submittedAt: z.number().int().nonnegative().nullable(),
    passed: z.boolean().nullable(),
    correctCount: z.number().int().min(0).max(8).nullable(),
    submissionDigest: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .nullable(),
  })
  .strict();
export type ChallengeScope = z.infer<typeof challengeScopeSchema>;
export type ChallengeSummary = z.infer<typeof challengeSummarySchema>;
export type ChallengeAttempt = z.infer<typeof challengeAttemptSchema>;
export type ChallengeItem = {
  id: string;
  outcome: string;
  prompt: string;
  stimulus?: string;
  options?: readonly string[];
  acceptedAnswers: readonly string[];
  caseSensitive?: boolean;
};
export type PublicChallengeItem = Omit<ChallengeItem, "acceptedAnswers" | "caseSensitive">;
export type ChallengeView = {
  summary: ChallengeSummary;
  attempt: ChallengeAttempt | null;
  items: readonly PublicChallengeItem[];
  serverNow: number;
};
export const CHALLENGE_RETRY_MS = 24 * 60 * 60 * 1000;
