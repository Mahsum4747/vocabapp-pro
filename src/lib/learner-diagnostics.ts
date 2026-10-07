export const DIAGNOSTIC_CATEGORIES = [
  "lexical_government",
  "case_selection",
  "case_form",
  "pronoun_form",
  "word_order",
  "agreement",
  "verb_conjugation",
  "vocabulary_gap",
  "reading_detail",
  "reading_negation",
  "reading_change",
  "task_fulfilment",
  "register",
  "spelling",
  "likely_slip",
  "uncertain",
] as const;

export type DiagnosticCategory = (typeof DIAGNOSTIC_CATEGORIES)[number];

export type DiagnosticDomain = "grammar" | "reading" | "writing" | "vocabulary";

export type DiagnosticContext =
  | "lesson_guided"
  | "lesson_independent"
  | "unit_check"
  | "challenge"
  | "checkpoint"
  | "targeted_practice";

export type DiagnosticObservation = {
  id: string;
  domain: DiagnosticDomain;
  category: DiagnosticCategory;
  /** Narrow canonical target where known, e.g. "DE.GRAMMAR.LEXICAL.HELFEN_DAT". */
  targetId?: string;
  /** Human-safe short label, e.g. "helfen + Dativ". Never raw private prose. */
  targetLabel?: string;
  context: DiagnosticContext;
  occurredAt: number;
  /** 0..1: confidence in the diagnosis, not confidence in learner mastery. */
  confidence: number;
  /** Whether the response was produced without hint/reveal/scaffold. */
  independent: boolean;
  /** Optional support used before the response. */
  support?: "hint" | "example" | "reveal" | "choice" | "none";
};

export type LearnerGapState = {
  key: string;
  domain: DiagnosticDomain;
  category: DiagnosticCategory;
  targetId?: string;
  targetLabel?: string;
  observationCount: number;
  independentObservationCount: number;
  confidence: number;
  firstSeenAt: number;
  lastSeenAt: number;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function diagnosticKey(
  observation: Pick<DiagnosticObservation, "domain" | "category" | "targetId" | "targetLabel">,
): string {
  return [
    observation.domain,
    observation.category,
    observation.targetId ?? observation.targetLabel ?? "unscoped",
  ].join(":");
}

/**
 * Conservative aggregation: repeated independent observations increase confidence;
 * supported/guided observations contribute less. This models a possible gap only.
 * It is deliberately not a mastery score and never changes completion evidence.
 */
export function buildLearnerGapStates(
  observations: readonly DiagnosticObservation[],
): LearnerGapState[] {
  const groups = new Map<string, DiagnosticObservation[]>();
  for (const observation of observations) {
    if (!Number.isFinite(observation.occurredAt) || observation.occurredAt <= 0) continue;
    const key = diagnosticKey(observation);
    const current = groups.get(key) ?? [];
    current.push({ ...observation, confidence: clamp01(observation.confidence) });
    groups.set(key, current);
  }

  return [...groups.entries()]
    .map(([key, rows]) => {
      rows.sort((a, b) => a.occurredAt - b.occurredAt || a.id.localeCompare(b.id));
      const independent = rows.filter((row) => row.independent);
      const weighted = rows.reduce(
        (sum, row) => sum + row.confidence * (row.independent ? 1 : 0.45),
        0,
      );
      // One weak observation remains tentative; repeated independent evidence rises quickly
      // without ever turning into a binary "learner cannot do this" label.
      const recurrenceBoost = Math.max(0, independent.length - 1) * 0.12;
      const confidence = clamp01(weighted / Math.max(1, rows.length) + recurrenceBoost);
      const first = rows[0]!;
      const last = rows[rows.length - 1]!;
      return {
        key,
        domain: first.domain,
        category: first.category,
        ...(first.targetId ? { targetId: first.targetId } : {}),
        ...(first.targetLabel ? { targetLabel: first.targetLabel } : {}),
        observationCount: rows.length,
        independentObservationCount: independent.length,
        confidence,
        firstSeenAt: first.occurredAt,
        lastSeenAt: last.occurredAt,
      };
    })
    .sort((a, b) => b.confidence - a.confidence || b.lastSeenAt - a.lastSeenAt || a.key.localeCompare(b.key));
}

export function shouldRecommendRemediation(gap: LearnerGapState): boolean {
  if (gap.category === "likely_slip" || gap.category === "uncertain") {
    return gap.independentObservationCount >= 2 && gap.confidence >= 0.7;
  }
  return (
    (gap.independentObservationCount >= 2 && gap.confidence >= 0.55) ||
    (gap.independentObservationCount >= 1 &&
      gap.observationCount >= 3 &&
      gap.confidence >= 0.72)
  );
}
