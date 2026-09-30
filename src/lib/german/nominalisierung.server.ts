import { NOUNS_TSV } from "./nouns-data.ts";
import { VERB_CONJUGATION_DATA } from "./verb-conjugation-data.ts";
import type { NominalisierungSampleEntry } from "./grammar-drill-sample.ts";

export type { NominalisierungSampleEntry };

/**
 * Server-only source for the Nominalisierung drill's two question kinds —
 * see the task's own research pass for the numbers this is built from:
 *
 * 1. "ung": a verb → its real -ung noun, derived (never hand-written) by
 *    stripping "-en" off a `verb-conjugation-data.ts` infinitive and
 *    checking whether "<stem>ung" exists as a non-affix noun in
 *    `nouns-data.ts` — 1,322 pairs this way, confirmed against a 65-pair
 *    manual sample with zero false positives, and (checked again here)
 *    100% feminine ("die"), so the article never needs to vary.
 * 2. "infinitiv": the bare-infinitive-as-noun pattern ("das Lesen", "das
 *    Schreiben") — every one of `verb-conjugation-data.ts`'s 6659
 *    infinitives qualifies, unconditionally ("das" + capitalized
 *    infinitive), no lookup/matching needed at all.
 *
 * Server-only for the same reason nouns.server.ts is: `NOUNS_TSV` is a
 * 2.9 MB string that has no business in a browser bundle, and this module
 * is the only thing that ever touches it for Nominalisierung — the client
 * only ever sees the small, already-resolved sample
 * `grammar-drill-sample.ts`'s `fetchRandomNominalisierungSample` hands
 * back (see that file).
 */

/** Every noun row, tab-separated: lemma \t genus \t plural \t pos (see
 *  nouns-data.ts's own header comment). Only the first two columns matter
 *  here. */
function parseNounRow(line: string): { lemma: string; genus: string; pos: string } | null {
  const firstTab = line.indexOf("\t");
  if (firstTab < 0) return null;
  const lemma = line.slice(0, firstTab);
  if (!lemma) return null;
  const secondTab = line.indexOf("\t", firstTab + 1);
  const thirdTab = line.indexOf("\t", secondTab + 1);
  const fourthTab = line.indexOf("\t", thirdTab + 1);
  const genus = line.slice(secondTab + 1, thirdTab);
  const pos = line.slice(thirdTab + 1, fourthTab < 0 ? undefined : fourthTab);
  return { lemma, genus, pos };
}

export interface UngPair {
  /** The verb infinitive this noun derives from (lowercased). */
  base: string;
  /** The real noun, as spelled in nouns-data.ts — always feminine (see
   *  this module's own doc comment), so no article field is stored; every
   *  caller renders it as `die ${noun}`. */
  noun: string;
}

let ungPairsCache: UngPair[] | null = null;

/**
 * Every "<verb>-derived -ung noun" pair, built once and memoized for the
 * life of the instance (same lazy-singleton shape as nouns.server.ts's own
 * dictionary). Affix/Suffix-tagged rows (e.g. the dictionary's own "-ung"
 * entry for the suffix itself) are excluded — they were excluded from the
 * research pass's count too.
 */
function ungPairs(): UngPair[] {
  if (ungPairsCache) return ungPairsCache;

  const verbLemmas = new Set(VERB_CONJUGATION_DATA.map((v) => v.infinitive.toLowerCase()));
  const seen = new Set<string>();
  const pairs: UngPair[] = [];

  for (const line of NOUNS_TSV.split("\n")) {
    const row = parseNounRow(line);
    if (!row) continue;
    const lower = row.lemma.toLowerCase();
    if (!lower.endsWith("ung")) continue;
    if (row.pos.includes("Affix") || row.pos.includes("Suffix")) continue;
    if (seen.has(row.lemma)) continue; // dedupe multi-sense rows, same lemma

    const stem = lower.slice(0, -3);
    const candidateVerb = `${stem}en`;
    if (!verbLemmas.has(candidateVerb)) continue;

    seen.add(row.lemma);
    pairs.push({ base: candidateVerb, noun: row.lemma });
  }

  ungPairsCache = pairs;
  return pairs;
}

/** For the report/tests only — the real, current size of the derived pool. */
export function ungPairCount(): number {
  return ungPairs().length;
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}

function sample<T>(items: readonly T[], count: number): T[] {
  return shuffleInPlace([...items]).slice(0, count);
}

function capitalize(word: string): string {
  return word.length === 0 ? word : word[0]!.toUpperCase() + word.slice(1);
}

/**
 * A round's worth of Nominalisierung questions, roughly half "ung" and half
 * "infinitiv" (mixed within the same round — see grammar.nominalisierung.tsx's
 * own doc comment for why this drill mixes variants in one mode rather than
 * splitting into two routes, the same pattern `buildPassivQuestion`/
 * `buildKonjunktivQuestion` already use for their own tense/form variants).
 * Each entry already carries its own distractors (3 other real nouns/
 * infinitive-nouns from the same pool) — the client-side builder
 * (`buildNominalisierungQuestion`) only ever shuffles them into options, it
 * never sees the full pool.
 */
export function randomNominalisierungSample(count: number): NominalisierungSampleEntry[] {
  const pairs = ungPairs();
  const ungCount = Math.ceil(count / 2);
  const infinitivCount = count - ungCount;

  const ungPicks = sample(pairs, ungCount).map((pair): NominalisierungSampleEntry => {
    const distractorPool = pairs.filter((p) => p.noun !== pair.noun);
    const distractors = sample(distractorPool, 3).map((p) => `die ${p.noun}`);
    return {
      kind: "ung",
      base: pair.base,
      correctAnswer: `die ${pair.noun}`,
      distractors,
    };
  });

  const verbPicks = sample(VERB_CONJUGATION_DATA, infinitivCount).map(
    (verb): NominalisierungSampleEntry => {
      const distractorPool = VERB_CONJUGATION_DATA.filter((v) => v.infinitive !== verb.infinitive);
      const distractors = sample(distractorPool, 3).map((v) => `das ${capitalize(v.infinitive)}`);
      return {
        kind: "infinitiv",
        base: verb.infinitive,
        correctAnswer: `das ${capitalize(verb.infinitive)}`,
        distractors,
      };
    },
  );

  return shuffleInPlace([...ungPicks, ...verbPicks]);
}
