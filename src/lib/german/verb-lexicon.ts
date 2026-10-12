import { VERB_CONJUGATION_DATA, type VerbConjugationEntry } from "./verb-conjugation-data";
import { lookupVerbValency, type ValencyFrame } from "./verb-valency-index";

/**
 * Canonical inventory of every sourced UniMorph lemma.
 *
 * IMPORTANT: A verb with no government evidence is NOT automatically
 * intransitive or accusative. Conjugation and valency are different facts.
 * The registry makes the unknown state explicit instead of dropping verbs.
 */
export type VerbLexiconEntry = {
  lemma: string;
  conjugation: VerbConjugationEntry;
  frames: readonly ValencyFrame[];
  governmentStatus: "diagnostic-eligible" | "evidence-needs-review" | "unresolved";
};

const entries = new Map<string, VerbLexiconEntry>();
for (const conjugation of VERB_CONJUGATION_DATA) {
  const lemma = conjugation.infinitive.trim().toLocaleLowerCase("de-DE");
  const frames = lookupVerbValency(lemma);
  const governmentStatus = frames.some((frame) => frame.review === "eligible")
    ? "diagnostic-eligible"
    : frames.length
      ? "evidence-needs-review"
      : "unresolved";
  entries.set(lemma, { lemma, conjugation, frames, governmentStatus });
}

/** Lookup by lemma; unknown means unknown, never a guessed case. */
export function lookupVerbLexicon(lemma: string): VerbLexiconEntry | null {
  return entries.get(lemma.trim().toLocaleLowerCase("de-DE")) ?? null;
}

/** Enumerate the entire existing verb lexicon for review or progress reports. */
export function listVerbLexicon(): readonly VerbLexiconEntry[] {
  return [...entries.values()];
}

export function verbLexiconCoverage() {
  const result = {
    total: entries.size,
    diagnosticEligible: 0,
    evidenceNeedsReview: 0,
    unresolved: 0,
  };
  for (const entry of entries.values()) {
    if (entry.governmentStatus === "diagnostic-eligible") result.diagnosticEligible++;
    else if (entry.governmentStatus === "evidence-needs-review") result.evidenceNeedsReview++;
    else result.unresolved++;
  }
  return result;
}
