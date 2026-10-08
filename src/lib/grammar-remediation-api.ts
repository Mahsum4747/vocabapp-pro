import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";
import {
  isDiagnosticTargetForTopic,
  remediationNextReviewAt,
} from "./grammar-remediation";

const recordSchema = z.object({
  operationId: z.string().uuid(),
  topic: z.string().trim().min(1).max(80),
  diagnosticTargetId: z.string().trim().min(1).max(120).optional(),
  correctCount: z.number().int().min(0).max(8),
  totalCount: z.number().int().min(3).max(8),
});

export type GrammarRemediationRecord = {
  id: string;
  topic: GrammarRuleTopic;
  diagnosticTargetId?: string;
  correctCount: number;
  totalCount: number;
  completedAt: number;
  nextReviewAt: number;
};

function isRuleTopic(value: string): value is GrammarRuleTopic {
  return Object.prototype.hasOwnProperty.call(GRAMMAR_RULES, value);
}

export const recordGrammarRemediation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordSchema.parse(input))
  .handler(async ({ context, data }) => {
    if (!isRuleTopic(data.topic) || data.correctCount > data.totalCount) {
      return { ok: false as const, error: "Invalid grammar practice result." };
    }
    if (data.diagnosticTargetId && !isDiagnosticTargetForTopic(data.diagnosticTargetId, data.topic)) {
      return { ok: false as const, error: "Practice target does not match the diagnosed topic." };
    }

    const completedAt = Date.now();
    const nextReviewAt = remediationNextReviewAt(completedAt);
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db
      .collection("users")
      .doc(context.userId)
      .collection("grammarRemediation")
      .doc(data.operationId);

    try {
      await ref.create({
        topic: data.topic,
        ...(data.diagnosticTargetId ? { diagnosticTargetId: data.diagnosticTargetId } : {}),
        correctCount: data.correctCount,
        totalCount: data.totalCount,
        completedAt,
        nextReviewAt,
        schemaVersion: 1,
      });
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";
      if (code !== "6" && code !== "already-exists") throw error;

      // A network retry must preserve the first session's spacing anchor.
      // Reusing an operation ID for a different result is a conflict, not success.
      const saved = (await ref.get()).data();
      if (
        !saved ||
        saved.topic !== data.topic ||
        saved.diagnosticTargetId !== data.diagnosticTargetId ||
        saved.correctCount !== data.correctCount ||
        saved.totalCount !== data.totalCount ||
        !Number.isFinite(saved.completedAt) ||
        !Number.isFinite(saved.nextReviewAt)
      ) {
        return { ok: false as const, error: "This practice result was already recorded with different details." };
      }
      return {
        ok: true as const,
        completedAt: saved.completedAt as number,
        nextReviewAt: saved.nextReviewAt as number,
      };
    }

    return { ok: true as const, completedAt, nextReviewAt };
  });
