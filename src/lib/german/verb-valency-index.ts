import { DATIVE_VERB_DATA } from "./dative-verbs-data";
import { VERB_GOVERNMENT_DATA } from "./verb-government-data";
import { VERB_PREP_CASE_FRAMES } from "./verb-prep-case-frames-data";

/** Existing source evidence, not a complete lexical-valency dictionary. */
export type ValencyCase = "akkusativ" | "dativ";
export type ValencyFrame = {
  lemma: string;
  preposition: string | null;
  case: ValencyCase;
  source: "curated-dative" | "curated-government" | "kaikki-extracted";
  review: "eligible" | "context-required" | "conflicted" | "reference-only";
};

const normalized = (s: string) => s.trim().toLocaleLowerCase("de-DE");
const key = (verb: string, prep: string) => normalized(verb) + "|" + normalized(prep);
const EXTRA_PREPOSITIONS = [
  "ab", "an", "auf", "aus", "außer", "bei", "bis", "durch", "entlang",
  "für", "gegen", "gegenüber", "hinter", "in", "mit", "nach", "neben",
  "ohne", "seit", "über", "um", "unter", "von", "vor", "zu", "zwischen",
  "wegen", "trotz", "während", "innerhalb", "außerhalb",
];
const curatedCases = new Map<string, Set<ValencyCase>>();
for (const e of VERB_GOVERNMENT_DATA) {
  const k = key(e.verb, e.preposition);
  if (!curatedCases.has(k)) curatedCases.set(k, new Set());
  curatedCases.get(k)!.add(e.case);
}

const frames: ValencyFrame[] = [
  ...DATIVE_VERB_DATA.map((e): ValencyFrame => ({
    lemma: normalized(e.verb), preposition: null, case: "dativ",
    source: "curated-dative", review: e.level ? "eligible" : "context-required",
  })),
  ...VERB_GOVERNMENT_DATA.map((e): ValencyFrame => ({
    lemma: normalized(e.verb), preposition: normalized(e.preposition),
    case: e.case, source: "curated-government",
    review: curatedCases.get(key(e.verb, e.preposition))!.size > 1 ? "conflicted" : "eligible",
  })),
  ...VERB_PREP_CASE_FRAMES.map((e): ValencyFrame => ({
    lemma: normalized(e.lemma), preposition: normalized(e.preposition),
    case: e.case, source: "kaikki-extracted", review: "reference-only",
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
    if (!list.some((v) => v.lemma === f.lemma)) list.push(f);
  }
}
export const lookupVerbValency = (lemma: string): readonly ValencyFrame[] =>
  byLemma.get(normalized(lemma)) ?? [];
export const eligiblePrepositionalFrames = (prep: string, nounCase: ValencyCase): readonly ValencyFrame[] =>
  eligibleByPrep.get(normalized(prep) + "|" + nounCase) ?? [];
export const eligibleBareDativeFrames = (): readonly ValencyFrame[] => eligibleDative;
export const isPrepositionToken = (token: string): boolean => prepositions.has(normalized(token));
export const valencyEvidenceCount = (): number => frames.length;
