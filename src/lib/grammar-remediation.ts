import type { GrammarRuleTopic } from "@/content/grammar-rules";

export const DIAGNOSTIC_TARGET_TOPICS = {
  "DE.GRAMMAR.LEXICAL.HELFEN_DAT": "helfen-dativ",
  "DE.GRAMMAR.PREPOSITION.MIT_DAT": "mit-dativ",
} as const satisfies Record<string, GrammarRuleTopic>;

export type DiagnosticTargetId = keyof typeof DIAGNOSTIC_TARGET_TOPICS;

export const REMEDIATION_RECHECK_DELAY_MS = 24 * 60 * 60 * 1000;

export function remediationNextReviewAt(completedAt: number): number {
  return completedAt + REMEDIATION_RECHECK_DELAY_MS;
}
