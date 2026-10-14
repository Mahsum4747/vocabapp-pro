import { VERB_CONJUGATION_DATA, type VerbConjugationEntry } from "./verb-conjugation-data";
import { canonicalValencyLemma, lookupVerbValency, type ValencyFrame } from "./verb-valency-index";
import currentSource from "../../content/karta-kaikki-valency-2026-10-03.json" with { type: "json" };
import transitiveSource from "../../content/karta-wiktionary-transitiv-de.json" with { type: "json" };
import extractedSource from "../../content/karta-kaikki-verb-prep-case.json" with { type: "json" };

export type VerbSourceEvidence = ValencyFrame["source"] | "wiktionary-transitive";
const normalize = (lemma: string) => lemma.trim().toLocaleLowerCase("de-DE");
const transitiveLemmas = new Set(transitiveSource.verbs.map(normalize));
const currentMatchedLemmas = new Set(currentSource.matchedLemmas);
const extractedLemmas = new Set(extractedSource.frames.map((frame) => canonicalValencyLemma(frame.lemma)));

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
  lexicalSourceVersions: readonly string[];
  frames: readonly ValencyFrame[];
  // Source membership is evidence to review, never an inferred case frame.
  // Raw Kaikki bare-case rows and the noisy transitive category stay here;
  // only the separately gated runtime frames can support diagnostics.
  sourceEvidence: readonly VerbSourceEvidence[];
  governmentStatus: "diagnostic-eligible" | "evidence-needs-review" | "unresolved";
};

const entries = new Map<string, VerbLexiconEntry>();
for (const conjugation of VERB_CONJUGATION_DATA) {
  const lemma = normalize(conjugation.infinitive);
  const frames = lookupVerbValency(lemma);
  const sourceEvidence = new Set<VerbSourceEvidence>(frames.map((frame) => frame.source));
  if (extractedLemmas.has(lemma)) sourceEvidence.add("kaikki-extracted");
  if (transitiveLemmas.has(lemma)) sourceEvidence.add("wiktionary-transitive");
  const governmentStatus = frames.some((frame) => frame.review === "eligible")
    ? "diagnostic-eligible"
    : sourceEvidence.size
      ? "evidence-needs-review"
      : "unresolved";
  entries.set(lemma, { lemma, conjugation,
    lexicalSourceVersions: currentMatchedLemmas.has(lemma) ? [currentSource.source.version] : [], frames, sourceEvidence: [...sourceEvidence], governmentStatus });
}

/** Lookup by lemma; unknown means unknown, never a guessed case. */
export function lookupVerbLexicon(lemma: string): VerbLexiconEntry | null {
  return entries.get(normalize(lemma)) ?? null;
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
