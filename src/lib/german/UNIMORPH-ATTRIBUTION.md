# Irregular verb conjugation dataset — attribution

`verb-conjugation-data.ts` in this directory is a trimmed derivative of
third-party data. Same situation `ATTRIBUTION.md` (nouns-data.ts) and
`EXAMPLES-ATTRIBUTION.md` (examples-data.ts) already describe, for the same
reason: it ultimately comes from Wiktionary content.

## Source

| | |
|---|---|
| Original source | English Wiktionary (https://en.wiktionary.org) German conjugation tables |
| Extraction project | [UniMorph](https://unimorph.github.io/) — `unimorph/deu` on GitHub (fetched via `raw.githubusercontent.com/unimorph/deu/master/deu`, no date/commit pin available from the repository itself — it has no tags/releases; fetched 2026-09-24) |
| License | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Format | UniMorph Schema: `lemma \t inflected-form \t UniMorph-tag-bundle`, one row per inflected form (519,143 rows total across nouns/adjectives/verbs) |

## Why this source, not kaikki.org

This app's network sandbox blocks `en.wiktionary.org`, `de.wiktionary.org`,
`kaikki.org` and `www.ids-mannheim.de` outright (confirmed by direct
request — all four returned an egress-proxy rejection). `raw.
githubusercontent.com`, however, is reachable, and UniMorph publishes its
German paradigm data there as a plain TSV mirror of exactly the same
underlying source (Wiktionary conjugation tables) `nouns-data.ts` and
`examples-data.ts` already carry attribution for — same lineage, same
license family, different extraction project. This was the task's own
documented fallback path ("bu mümkün değilse ... alternatif ... kaynağı ve
tarihi bir ATTRIBUTION.md dosyasında belirt").

## What we changed

One offline step, not part of `npm run build`:

1. Downloaded `unimorph/deu`'s `deu` file (18.9 MB, 519,143 rows).
2. Filtered to every row whose UniMorph tag starts with `V` (verb), grouped
   by lemma — **6659 distinct lemmas** ended up with usable present-tense
   data. Unlike the first version of this file, this is **not** limited to
   the verbs already in `verb-government-data.ts`/`dative-verbs-data.ts`
   — see "Scope" in `verb-conjugation-data.ts`'s own header comment for why
   that limit was wrong: this file only ever answers "what verb is this
   token, conjugated how" (recognition), never "which case does it govern"
   (valenz, which stays exclusively `verb-government-data.ts`/
   `dative-verbs-data.ts`'s job — UniMorph carries no such information at
   all, so widening this file's coverage cannot add or imply any new
   valenz claim).
3. Extracted each lemma's present-tense indicative forms (`V;IND;SG;1;PRS`
   / `;2;` / `;3;`) and past participle (`V.PTCP;PST`). Several lemmas
   (mostly `-eln`/`-ern` verbs, e.g. "handeln") had more than one listed
   spelling variant for the `ich`-form ("handle" / "handele" / "handel");
   the longest non-apostrophed variant was kept in every case — a choice
   among the source's own listed forms, never an invented one. For a
   separable-prefix verb (e.g. "abgeben"), the source's present-tense forms
   already separate the prefix ("gebe ab"); only the conjugated verb itself
   was kept ("gebe") — the prefix's position in a real sentence isn't fixed
   relative to the verb, so keeping it would make the stored form useless
   for a literal-word sentence match. The participle is fused with its
   prefix as it actually appears in a sentence ("abgegeben") and was kept
   as-is. Only 2 of the 6661 V-tagged lemmas had no present-tense form at
   all in the source and were dropped.
4. Re-encoded as the `VerbConjugationEntry[]` array literal
   `verb-conjugation-data.ts` holds — selection and reshaping only, no
   values edited, corrected, or invented at this stage.

The one-off extraction script is not part of this repository (ad hoc, run
once against the downloaded `deu` file, same "offline, not in the build"
status `measure.mjs` has for `examples-data.ts` per `EXAMPLES-ATTRIBUTION.
md`).

## Not covered

A verb whose exact spelling has no entry in UniMorph's German data at all
(verified directly, not a parsing bug on this project's side) — e.g.
`sein` ("to be"): UniMorph's `deu` file has no `sein`/`bin`/`bist`/`ist`
verb entries whatsoever, a real gap in that source. `verb-case-hint.ts`
falls back to its existing mechanical (regular weak-verb) rule for any
such verb, same as before this file existed — correct for a genuinely
regular verb, and a documented, accepted under-match for a harder,
irregular one like `sein`.

## What CC BY-SA 3.0 requires of us

Same two obligations `ATTRIBUTION.md`/`EXAMPLES-ATTRIBUTION.md` already
describe: **attribution** (this file, plus `verb-conjugation-data.ts`'s own
header comment) and **ShareAlike**, which attaches to the derived dataset
file itself, not to the application code that reads it.

## Deferred: user-visible attribution

Same open question the other two attribution files already record, not
decided here either.
