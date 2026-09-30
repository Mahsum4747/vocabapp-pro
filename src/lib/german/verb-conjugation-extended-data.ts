/**
 * German full-paradigm verb conjugations — GENERATED FILE, DO NOT EDIT BY
 * HAND.
 *
 * Regenerate with: node scripts/generate-verb-conjugation-extended.mjs
 * (requires `npm install @v4nn4/ablaut --no-save` first — ablaut is not a
 * project dependency, see VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md).
 *
 * Source: @v4nn4/ablaut (npm, MIT OR Apache-2.0), run once offline against
 * every infinitive already in verb-conjugation-data.ts (this file adds no
 * new lemmas, no new valenz/case claims — see that file's own header for
 * why case-government stays exclusively verb-government-data.ts/
 * dative-verbs-data.ts's job). Full details, including the licensing
 * ambiguity around ablaut's exception table, in
 * VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md.
 *
 * Format: one record per line, tab-separated, columns in this order:
 *   infinitive, zuInfinitive, auxiliary, presentParticiple, pastParticiple, imperative, imperativeExtended, present, preterite, perfect, pluperfect, future1, future2, konjunktiv1, konjunktiv2, wuerde
 * A "|"-joined field is a 6-tuple (ich/du/er/wir/ihr/sie) for present,
 * preterite, perfect, pluperfect, future1, future2, konjunktiv1,
 * konjunktiv2, wuerde — or a 2-tuple (du/ihr) for imperative and
 * (wir/Sie) for imperativeExtended. Passiv (Vorgang/Zustand) is
 * deliberately NOT stored here: it is `werden`/`sein` conjugated +
 * this record's own pastParticiple, combined at runtime by whichever
 * drill needs it — storing it here would just duplicate auxiliary
 * conjugation tables already implicit in this file.
 *
 * Generated 2026-09-30 — 6659 lemmas succeeded,
 * 0 failed (see VERB-CONJUGATION-EXTENDED-ATTRIBUTION.md for the list).
 *
 * Held as two plain strings (see verb-conjugation-extended-data-part1.ts /
 * -part2.ts, split because the combined TSV is ~6MB) rather than an
 * object/array literal, for the same cold-start-parsing reason
 * nouns-data.ts documents.
 */
import { VERB_CONJUGATION_EXTENDED_TSV_PART1 } from "./verb-conjugation-extended-data-part1.ts";
import { VERB_CONJUGATION_EXTENDED_TSV_PART2 } from "./verb-conjugation-extended-data-part2.ts";

export const VERB_CONJUGATION_EXTENDED_TSV = VERB_CONJUGATION_EXTENDED_TSV_PART1 + "\n" + VERB_CONJUGATION_EXTENDED_TSV_PART2;

export type VerbConjugationExtendedEntry = {
  infinitive: string;
  zuInfinitive: string;
  auxiliary: string;
  presentParticiple: string;
  pastParticiple: string;
  /** [du, ihr] */
  imperative: [string, string];
  /** [wir, Sie] */
  imperativeExtended: [string, string];
  /** [ich, du, er, wir, ihr, sie] */
  present: [string, string, string, string, string, string];
  preterite: [string, string, string, string, string, string];
  perfect: [string, string, string, string, string, string];
  pluperfect: [string, string, string, string, string, string];
  future1: [string, string, string, string, string, string];
  future2: [string, string, string, string, string, string];
  konjunktiv1: [string, string, string, string, string, string];
  konjunktiv2: [string, string, string, string, string, string];
  wuerde: [string, string, string, string, string, string];
};

let entries: VerbConjugationExtendedEntry[] | null = null;

function parse(): VerbConjugationExtendedEntry[] {
  if (entries) return entries;
  entries = VERB_CONJUGATION_EXTENDED_TSV.split("\n").filter(Boolean).map((line) => {
    const cols = line.split("\t");
    const [
      infinitive,
      zuInfinitive,
      auxiliary,
      presentParticiple,
      pastParticiple,
      imperative,
      imperativeExtended,
      present,
      preterite,
      perfect,
      pluperfect,
      future1,
      future2,
      konjunktiv1,
      konjunktiv2,
      wuerde,
    ] = cols;
    const six = (s: string) => s.split("|") as [string, string, string, string, string, string];
    const two = (s: string) => s.split("|") as [string, string];
    return {
      infinitive,
      zuInfinitive,
      auxiliary,
      presentParticiple,
      pastParticiple,
      imperative: two(imperative),
      imperativeExtended: two(imperativeExtended),
      present: six(present),
      preterite: six(preterite),
      perfect: six(perfect),
      pluperfect: six(pluperfect),
      future1: six(future1),
      future2: six(future2),
      konjunktiv1: six(konjunktiv1),
      konjunktiv2: six(konjunktiv2),
      wuerde: six(wuerde),
    };
  });
  return entries;
}

let lookupIndex: Map<string, VerbConjugationExtendedEntry> | null = null;

/**
 * Case-insensitive lookup by infinitive, same `term.trim().toLowerCase()`
 * normalization every other German lookup here uses. Lazily built once.
 */
export function lookupVerbConjugationExtended(term: string): VerbConjugationExtendedEntry | null {
  if (!lookupIndex) {
    lookupIndex = new Map(parse().map((entry) => [entry.infinitive.toLowerCase(), entry]));
  }
  return lookupIndex.get(term.trim().toLowerCase()) ?? null;
}
