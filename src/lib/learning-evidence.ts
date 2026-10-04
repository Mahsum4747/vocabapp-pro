export type EvidenceLevel = "none" | "low" | "medium" | "high";
/** Shared participation bands, unchanged from LearningSignals v1. */
export function evidenceLevel(sampleSize: number): EvidenceLevel {
  const n = Number.isFinite(sampleSize) && sampleSize > 0 ? Math.floor(sampleSize) : 0;
  return n === 0 ? "none" : n < 10 ? "low" : n < 30 ? "medium" : "high";
}
