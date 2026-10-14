import { readValencySourceContext, type ValencySourceContext } from "./valency-source-context";
import { DATIVE_VERB_DATA } from "./dative-verbs-data";
import { VERB_GOVERNMENT_DATA } from "./verb-government-data";
import extractedSource from "../../content/karta-kaikki-verb-prep-case.json" with { type: "json" };

/** Existing source evidence, not a complete lexical-valency dictionary. */
export type ValencyCase = "akkusativ" | "dativ" | "genitiv";
export type ValencyFrame = {
  /** Canonical infinitive; reflexive construction remains a separate constraint. */
  lemma: string;
  construction: string;
  /** Legacy aggregate has no single sense; restored per-sense facts live in context. */
  sense: null;
  /** Upstream sense contexts, when restored; never imply eligibility. */
  context: readonly ValencySourceContext[];
  provenance: {
    document: string;
    record: string;
    method: "source-curated" | "generated-unverified" | "gloss-regex";
  };
  preposition: string | null;
  case: ValencyCase;
  source: "curated-dative" | "curated-government" | "kaikki-extracted";
  review: "eligible" | "context-required" | "conflicted" | "reference-only";
};

const normalized = (s: string) => s.trim().toLocaleLowerCase("de-DE");
export const canonicalValencyLemma = (construction: string) =>
  normalized(construction).replace(/^sich\s+/, "");
const key = (verb: string, prep: string) => normalized(verb) + "|" + normalized(prep);
const EXTRA_PREPOSITIONS = [
  "ab", "an", "auf", "aus", "außer", "bei", "bis", "durch", "entlang",
  "für", "gegen", "gegenüber", "hinter", "in", "mit", "nach", "neben",
  "ohne", "seit", "über", "um", "unter", "von", "vor", "zu", "zwischen",
  "wegen", "trotz", "während", "innerhalb", "außerhalb",
];
const curatedCases = new Map<string, Set<ValencyCase>>();
for (const e of VERB_GOVERNMENT_DATA.filter((row) => !row.provenance)) {
  const k = key(e.verb, e.preposition);
  if (!curatedCases.has(k)) curatedCases.set(k, new Set());
  curatedCases.get(k)!.add(e.case);
}

const rawCases = new Map<string, Set<ValencyCase>>();
const caseNames: Record<string, ValencyCase> = { akk: "akkusativ", dat: "dativ", gen: "genitiv" };
for (const e of extractedSource.frames) {
  const k = key(e.lemma, e.prep ?? "");
  if (!rawCases.has(k)) rawCases.set(k, new Set());
  if (caseNames[e.case]) rawCases.get(k)!.add(caseNames[e.case]);
}
const frames: ValencyFrame[] = [
  ...DATIVE_VERB_DATA.map((e): ValencyFrame => ({
    lemma: canonicalValencyLemma(e.verb), construction: normalized(e.verb), sense: null, context: [],
    preposition: null, case: "dativ", source: "curated-dative",
    provenance: { document: "src/lib/german/DATIVE-ATTRIBUTION.md",
      record: e.verb, method: "source-curated" },
    review: e.level ? "eligible" : "context-required",
  })),
  ...VERB_GOVERNMENT_DATA.map((e): ValencyFrame => ({
    lemma: canonicalValencyLemma(e.verb), construction: normalized(e.verb), sense: null, context: [],
    preposition: normalized(e.preposition), case: e.case, source: "curated-government",
    provenance: { document: "src/lib/german/GOVERNMENT-ATTRIBUTION.md",
      record: `${e.verb}|${e.preposition}|${e.case}`,
      method: e.provenance ? "generated-unverified" : "source-curated" },
    review: e.provenance ? "reference-only"
      : (curatedCases.get(key(e.verb, e.preposition))?.size ?? 0) > 1 ? "conflicted" : "eligible",
  })),
  ...extractedSource.frames.map((e, index): ValencyFrame => ({
    lemma: canonicalValencyLemma(e.lemma), construction: normalized(e.lemma), sense: null, context: readValencySourceContext(e),
    preposition: e.prep === null ? null : normalized(e.prep), case: caseNames[e.case],
    source: "kaikki-extracted",
    provenance: { document: "src/content/KAIKKI-VERB-PREP-CASE-ATTRIBUTION.md",
      record: `frames[${index}]`, method: "gloss-regex" },
    // Keep ALL rows, including bare/genitive/conflicted/idiomatic evidence.
    // No gloss/sense context survives extraction, so none becomes a diagnostic rule.
    review: e.prep !== null && rawCases.get(key(e.lemma, e.prep))!.size > 1
      ? "conflicted" : "reference-only",
  })),
];
const byLemma = new Map<string, ValencyFrame[]>();
const eligibleByPrep = new Map<string, ValencyFrame[]>();
const eligibleDative: ValencyFrame[] = [];
const prepositions = new Set(EXTRA_PREPOSITIONS);
for (const f of frames) {
  if (!byLemma.has(f.lemma)) byLemma.set(f.lemma, []);
  byLemma.get(f.lemma)!.push(f);
  if (f.preposition) prepositions.add(f.preposition);
  if (f.review !== "eligible") continue;
  if (!f.preposition) eligibleDative.push(f);
  else {
    const k = f.preposition + "|" + f.case;
    if (!eligibleByPrep.has(k)) eligibleByPrep.set(k, []);
    const list = eligibleByPrep.get(k)!;
    if (!list.some((v) => v.construction === f.construction)) list.push(f);
  }
}
export const lookupVerbValency = (lemma: string): readonly ValencyFrame[] =>
  (byLemma.get(canonicalValencyLemma(lemma)) ?? []).filter((frame) =>
    !normalized(lemma).startsWith("sich ") || frame.construction === normalized(lemma));
export const eligiblePrepositionalFrames = (prep: string, nounCase: ValencyCase): readonly ValencyFrame[] =>
  eligibleByPrep.get(normalized(prep) + "|" + nounCase) ?? [];
export const eligibleBareDativeFrames = (): readonly ValencyFrame[] => eligibleDative;
export const isPrepositionToken = (token: string): boolean => prepositions.has(normalized(token));
export const valencyEvidenceCount = (): number => frames.length;

/** Runtime government facts with independent source provenance, retaining constructions. */
export const sourcedGovernmentEntries = VERB_GOVERNMENT_DATA.filter((entry) =>
  !entry.provenance && curatedCases.get(key(entry.verb, entry.preposition))?.size === 1);
