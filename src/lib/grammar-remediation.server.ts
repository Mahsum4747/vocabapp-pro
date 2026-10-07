import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";

export const DIAGNOSTIC_TARGET_TOPICS = {
  "DE.GRAMMAR.LEXICAL.HELFEN_DAT": "helfen-dativ",
  "DE.GRAMMAR.PREPOSITION.MIT_DAT": "mit-dativ",
} as const satisfies Record<string, GrammarRuleTopic>;

export type DiagnosticTargetId = keyof typeof DIAGNOSTIC_TARGET_TOPICS;

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

export function remediationNextReviewAt(completedAt: number): number {
  return completedAt + 24 * 60 * 60 * 1000;
}

export const recordGrammarRemediation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordSchema.parse(input))
  .handler(async ({ context, data }) => {
    if (!isRuleTopic(data.topic) || data.correctCount > data.totalCount) {
      return { ok: false as const, error: "Invalid grammar practice result." };
    }
    const expectedTopic = data.diagnosticTargetId
      ? DIAGNOSTIC_TARGET_TOPICS[data.diagnosticTargetId as DiagnosticTargetId]
      : undefined;
    if (expectedTopic && expectedTopic !== data.topic) {
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
    }

    return { ok: true as const, completedAt, nextReviewAt };
  });
