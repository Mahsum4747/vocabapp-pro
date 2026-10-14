# Kaikki context restoration — 2026-10-14

## Source and commit status

HEAD/base: `b013c10bb4ed4ecbd639c4d99c9a264f0284d09d` (`main`).
There is no integration commit yet. Tests cover this HEAD plus the uncommitted
working-tree changes listed below, not a committed SHA containing those changes.
The earlier integration remains intact. No commit, push, migration, login-test
rerun, deployment or production-data operation occurred in this task.

## Investigation and exact missing input

Searched the repository including ignored files outside node_modules, Git
history, `/private/tmp` and `~/Downloads` for Kaikki/Wiktextract filenames and
raw JSONL/JSONL.gz data. Only the 1001-triple artifact was found. Its originating
commit is `cf86beeb`; attribution records an externally retrieved/handed-in dump.
No original verb-valency extractor is present. `build-german-examples.mjs` is a
separate German Wiktionary example/translation TSV pipeline using a pre-extracted
measurement-kit file, not the English Wiktionary verb-sense source; its examples
cannot safely be attached to these 1001 frames.

Needed input: the original **2026-09-24 snapshot** of
`kaikki.org-dictionary-German-by-pos-verb.jsonl`, from
https://kaikki.org/dictionary/German/pos-verb/kaikki.org-dictionary-German-by-pos-verb.jsonl,
with full verb entries (`word`, `pos`, `lang_code`, `senses`, `glosses`,
`raw_glosses`, examples, tags/raw_tags and upstream identifiers when present).
Also needed: the original extractor if exact reproduction of all old triples is
required. It is not recoverable from the current method description alone.
A current download is a different snapshot and must be identified as such,
not silently represented as the original 2026-09-24 input.

The source manifest must identify URL, retrieval/snapshot date, actual license
and SHA256 of the exact JSONL bytes. The historic generic `CC BY-SA` header is
not enough to invent a license version or snapshot digest.

## Implemented offline transfer and model

`restore-kaikki-valency-context.mjs` verifies the supplied input checksum and
writes to a NEW output path with exclusive creation; it cannot overwrite the
legacy dataset or an earlier output. It retains all existing triples and attaches
contexts only within the matching source verb AND the same sense that contains
an explicit grammatical preposition/case expression (or explicit bare-case
expression). Other formulations stay pending; regex association is deliberately
incomplete and is not a valency parser or independent validation.

Every context retains exact glosses/raw glosses, examples with their fields,
sense-level tags/raw tags, entry tags, upstream identifiers/other sense metadata,
source record line/hash, snapshot metadata and sense position. Missing IDs remain
null; line/position are extraction locators, not fabricated upstream IDs.
Reflexivity from a sibling sense or a general entry tag is never propagated to
every sense. Where source sense tags or the full reflexive headword explicitly
require it, that condition is retained. Absence remains unknown, not non-reflexive.

The runtime registry accepts validated per-sense context arrays without changing
its review policy. The schema verifies that evidence offsets point to the exact
source text and requires `diagnosticEligible: false`. Context restoration alone
cannot resolve two-way case ambiguity or enable a lexical diagnostic. Promotion
still requires independently supported, reviewed construction and sense/context
conditions. All 66 AI government records remain traceable and quarantined.
No placeholder gloss/example/meaning was written to the actual dataset.

Usage (offline):

```sh
node scripts/restore-kaikki-valency-context.mjs RAW.jsonl LEGACY.json SOURCE-MANIFEST.json NEW-OUTPUT.json
node scripts/audit-verb-valency.mjs --runtime
```

The audit now reports associated/pending Kaikki rows explicitly. Generated output
requires review before deliberate adoption; it is not installed automatically.

## Actual results and validation

- Real source rows with restored context: **0/1001**.
- Pending for missing original raw sense data: **1001/1001**.
- Newly diagnostic-eligible verbs/constructions this turn: **0/0**.
- Existing corpus coverage unchanged: **6658 keys; 303 diagnosticEligible,
  2099 evidenceNeedsReview, 4256 unresolved**.
- Existing eligible constructions among corpus keys: **394**. This is bounded
  construction coverage, not full sense-level verification.
- Synthetic importer fixtures are tests only, not restored corpus rows.
- 20 targeted cases pass across importer (5), schema (3), existing registry (9)
  and audit (3). Typecheck and compile-only build pass. No auth/browser retests.

## Changed files (entire uncommitted integration)

- `docs/KAIKKI-CONTEXT-RESTORATION-2026-10-14.md`
- `docs/VERB-VALENCY-INTEGRATION-2026-10-13.md`
- `scripts/audit-verb-valency.mjs`
- `scripts/audit-verb-valency.test.mjs`
- `scripts/restore-kaikki-valency-context.mjs`
- `scripts/restore-kaikki-valency-context.test.mjs`
- `src/content/KAIKKI-VERB-PREP-CASE-ATTRIBUTION.md`
- `src/lib/curriculum/lesson-diagnostics.test.ts`
- `src/lib/curriculum/lesson-diagnostics.ts`
- `src/lib/german/GOVERNMENT-ATTRIBUTION.md`
- `src/lib/german/valency-source-context.test.ts`
- `src/lib/german/valency-source-context.ts`
- `src/lib/german/verb-case-hint.test.ts`
- `src/lib/german/verb-case-hint.ts`
- `src/lib/german/verb-government-data.ts`
- `src/lib/german/verb-government.server.test.ts`
- `src/lib/german/verb-government.server.ts`
- `src/lib/german/verb-lexicon.ts`
- `src/lib/german/verb-valency-index.test.ts`
- `src/lib/german/verb-valency-index.ts`
