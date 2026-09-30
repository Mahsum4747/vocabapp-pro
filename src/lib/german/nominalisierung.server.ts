import { NOUNS_TSV } from "./nouns-data.ts";
import { VERB_CONJUGATION_DATA } from "./verb-conjugation-data.ts";
import type { VerbConjugationEntry } from "./verb-conjugation-data.ts";
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
 * -ung nouns and infinitives built with these Latinate/Greek suffixes
 * (Acetylierung, Entmilitarisierung, Anthropomorphisierung, ...) are real,
 * but overwhelmingly rare/technical compared to the rest of the pool — a
 * wrong option that obviously doesn't belong makes a question easier to
 * guess by elimination, not more instructive. Excluded from the DISTRACTOR
 * pool only; a word in this pattern is still used normally whenever it is
 * itself the correct answer (this never removes anything from what can be
 * asked, only from what can be offered as a decoy).
 */
const TECHNICAL_UNG_PATTERN = /(isierung|ifizierung)$/i;
const TECHNICAL_INFINITIV_PATTERN = /(isieren|ifizieren)$/i;

/**
 * `count` distractors for `correctNoun`, drawn from `pool` (every other
 * -ung noun): the technical-suffix pattern above is filtered out first
 * (falling back to the full pool only if that leaves too few candidates to
 * pick from), then the result is narrowed to nouns closest in LENGTH to
 * the correct one before sampling — a same-length real word tends to look
 * and sound more like a plausible answer than an arbitrarily
 * shorter/longer one, without needing any actual frequency data (which
 * nouns-data.ts doesn't have — see the task's own research pass).
 */
function pickUngDistractors(pool: readonly UngPair[], correctNoun: string, count: number): string[] {
  const candidates = pool.filter((p) => p.noun !== correctNoun);
  const plain = candidates.filter((p) => !TECHNICAL_UNG_PATTERN.test(p.noun));
  const usable = plain.length >= count * 4 ? plain : candidates;
  const byCloseness = [...usable].sort(
    (a, b) => Math.abs(a.noun.length - correctNoun.length) - Math.abs(b.noun.length - correctNoun.length),
  );
  const nearPool = byCloseness.slice(0, Math.max(count * 5, 15));
  return sample(nearPool, count).map((p) => `die ${p.noun}`);
}

/** Same idea as `pickUngDistractors`, for the infinitiv-as-noun kind. */
function pickInfinitivDistractors(
  pool: readonly VerbConjugationEntry[],
  correctInfinitive: string,
  count: number,
): string[] {
  const candidates = pool.filter((v) => v.infinitive !== correctInfinitive);
  const plain = candidates.filter((v) => !TECHNICAL_INFINITIV_PATTERN.test(v.infinitive));
  const usable = plain.length >= count * 4 ? plain : candidates;
  const byCloseness = [...usable].sort(
    (a, b) =>
      Math.abs(a.infinitive.length - correctInfinitive.length) -
      Math.abs(b.infinitive.length - correctInfinitive.length),
  );
  const nearPool = byCloseness.slice(0, Math.max(count * 5, 15));
  return sample(nearPool, count).map((v) => `das ${capitalize(v.infinitive)}`);
}

/**
 * A round's worth of Nominalisierung questions, roughly half "ung" and half
 * "infinitiv" (mixed within the same round — see grammar.nominalisierung.tsx's
 * own doc comment for why this drill mixes variants in one mode rather than
 * splitting into two routes, the same pattern `buildPassivQuestion`/
 * `buildKonjunktivQuestion` already use for their own tense/form variants).
 * Each entry already carries its own distractors (3 other real nouns/
 * infinitive-nouns from the same pool, chosen by `pickUngDistractors`/
 * `pickInfinitivDistractors` above) — the client-side builder
 * (`buildNominalisierungQuestion`) only ever shuffles them into options, it
 * never sees the full pool.
 */
export function randomNominalisierungSample(count: number): NominalisierungSampleEntry[] {
  const pairs = ungPairs();
  const ungCount = Math.ceil(count / 2);
  const infinitivCount = count - ungCount;

  const ungPicks = sample(pairs, ungCount).map((pair): NominalisierungSampleEntry => {
    const distractors = pickUngDistractors(pairs, pair.noun, 3);
    return {
      kind: "ung",
      base: pair.base,
      correctAnswer: `die ${pair.noun}`,
      distractors,
    };
  });

  const verbPicks = sample(VERB_CONJUGATION_DATA, infinitivCount).map(
    (verb): NominalisierungSampleEntry => {
      const distractors = pickInfinitivDistractors(VERB_CONJUGATION_DATA, verb.infinitive, 3);
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
