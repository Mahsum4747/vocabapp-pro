import type { GrammarRuleTopic } from "@/content/grammar-rules";

export const DIAGNOSTIC_TARGET_TOPICS = {
  "DE.GRAMMAR.LEXICAL.HELFEN_DAT": "helfen-dativ",
  "DE.GRAMMAR.PREPOSITION.MIT_DAT": "mit-dativ",
} as const satisfies Record<string, GrammarRuleTopic>;

export type DiagnosticTargetId = keyof typeof DIAGNOSTIC_TARGET_TOPICS;

/** Never accept an arbitrary or mismatched diagnostic target as reviewed remediation. */
export function isDiagnosticTargetForTopic(targetId: string, topic: GrammarRuleTopic): boolean {
  return (
    Object.prototype.hasOwnProperty.call(DIAGNOSTIC_TARGET_TOPICS, targetId) &&
    DIAGNOSTIC_TARGET_TOPICS[targetId as DiagnosticTargetId] === topic
  );
}

export const REMEDIATION_RECHECK_DELAY_MS = 24 * 60 * 60 * 1000;

export function remediationNextReviewAt(completedAt: number): number {
  return completedAt + REMEDIATION_RECHECK_DELAY_MS;
}
