# Full-paradigm verb conjugation dataset — attribution

`verb-conjugation-extended-data-part1.ts` / `-part2.ts` (assembled by
`verb-conjugation-extended-data.ts`) in this directory hold a full verb
paradigm (Präsens, Präteritum, Perfekt, Plusquamperfekt, Futur I/II,
Konjunktiv I/II, würde-Form, Imperativ, Partizipien, auxiliary,
zu-Infinitiv) for every lemma already in `verb-conjugation-data.ts`. Same
"generated file, attribution lives here" pattern `UNIMORPH-ATTRIBUTION.md`
already documents for that file.

## Source

| | |
|---|---|
| Package | [`@v4nn4/ablaut`](https://www.npmjs.com/package/@v4nn4/ablaut) (npm) |
| Version | 0.10.0 (`npm view @v4nn4/ablaut version`) |
| License | MIT OR Apache-2.0 |
| Generated | 2026-09-30 |
| Generation script | `scripts/generate-verb-conjugation-extended.mjs` (not wired into `npm run dev`/`build`/`test` — manual `node scripts/generate-verb-conjugation-extended.mjs` only) |
| Lemmas processed | 6659 (every `infinitive` in `verb-conjugation-data.ts`) |
| Succeeded | 6659 |
| Failed | 0 |

`@v4nn4/ablaut` is a WASM package used only by the generation script above,
run once, offline. It is **not** a project dependency — installed
temporarily with `npm install @v4nn4/ablaut --no-save` before running the
script, and `package.json`/`package-lock.json` carry no trace of it
afterward. It never ships in the production bundle.

## Licensing note (verbatim, not paraphrased)

> ablaut MIT/Apache-2.0 lisanslı, kod kendisi bağımsız. Ancak ablaut'un
> istisna tablosu UniMorph/Wiktextract'a bakılarak yazılmış (test-oracle
> olarak) — bu iki kaynağın CC BY-SA'sının "türetilmiş eser" sayılıp
> sayılmayacağı hukuken net değil, sadece makul bir ayrım (gramer olgusu
> vs. yaratıcı ifade) savunması var.

## What fields are included

Per lemma: `infinitive, zuInfinitive, auxiliary, presentParticiple,
pastParticiple, imperative (du/ihr), imperativeExtended (wir/Sie), present,
preterite, perfect, pluperfect, future1, future2, konjunktiv1, konjunktiv2,
wuerde` — the last nine as 6-tuples (ich/du/er/wir/ihr/sie). This is the
full set of fields `@v4nn4/ablaut`'s `conjugate()` returns, minus nothing.

## What is deliberately NOT included: Passiv

Passiv (Vorgang: `werden` + Partizip II; Zustand: `sein` + Partizip II) is
**not** its own stored field. `@v4nn4/ablaut` does not return it as a
separate field either — it is `werden`'s or `sein`'s own conjugation
(itself just a normal verb, already resolvable the same way) combined at
runtime with a lemma's `pastParticiple`. Storing it here would be pure
duplication of auxiliary-conjugation data already implicit in this file,
and the task this dataset was built for explicitly excludes it.

## Why two files (part1/part2)

The combined TSV comes out to ~5.9MB as one string constant — split at the
midpoint into `verb-conjugation-extended-data-part1.ts` (3330 rows, ~2.96MB)
and `verb-conjugation-extended-data-part2.ts` (3329 rows, ~2.93MB), each a
single exported TSV string constant, concatenated back together at import
time by `verb-conjugation-extended-data.ts`. Same "one big skip-until-used
string, not a parsed object literal" rationale `nouns-data.ts` documents
for cold-start cost — splitting in two keeps each individual generated
file at a manageable size for editors/bundlers without changing that
rationale.

## What we changed

1. Extracted all 6659 `infinitive` values already present in
   `verb-conjugation-data.ts` (regex over that file's own array literal —
   `verb-conjugation-data.ts` itself was never modified, read-only).
2. Ran each infinitive through `@v4nn4/ablaut`'s `conjugate(lemma)`
   (German is the package's default language). All 6659 succeeded; 0
   threw ("not a German infinitive" is the package's own error for an
   unrecognized lemma — none hit here since every lemma already came from
   a real, sourced dictionary).
3. Re-encoded the fields listed above as tab-separated rows, `|`-joined
   for multi-form fields, split across the two files described above.
4. Added `lookupVerbConjugationExtended(term)` — case-insensitive,
   `term.trim().toLowerCase()` normalized, same pattern as the existing
   `lookupVerbConjugation`. The original `lookupVerbConjugation` and
   `verb-conjugation-data.ts` are untouched.

## What CC BY-SA / MIT / Apache-2.0 requires of us

`@v4nn4/ablaut`'s own code is MIT OR Apache-2.0 — permissive, attribution
sufficient (this file, plus each generated file's own header comment). The
open question is the licensing note above: whether the package's exception
table itself is a "derivative" of the CC BY-SA-licensed sources it was
apparently checked against. Not resolved here, same "deferred" status
`UNIMORPH-ATTRIBUTION.md` already carries for its own open question.
