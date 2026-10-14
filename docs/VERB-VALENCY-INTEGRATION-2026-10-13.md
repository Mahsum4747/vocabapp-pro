# Source-preserving German valency integration — 2026-10-13

Base source: `b013c10bb4ed4ecbd639c4d99c9a264f0284d09d`.
The baseline was recalculated from the checkout, not assumed from the previous audit.

| Canonical verb keys | Before | After |
| --- | ---: | ---: |
| Total | 6658 | 6658 |
| At least one diagnostic-eligible construction | 250 | 303 |
| Evidence requiring review, no eligible construction | 2134 | 2099 |
| No valency-source evidence | 4274 | 4256 |

These categories describe available evidence, not complete sense-level validation.
No source download or linguistic fact generation occurred. UniMorph still supplies
6659 source conjugation records, with one duplicate normalized key.

## Implemented behavior

The registry now links leading `sich` constructions to their canonical infinitive
without discarding the original construction. Non-reflexive terms do not inherit
reflexive auto-enrichment; lesson diagnostics require the reflexive context and
retain the construction in feedback. Multiword idioms are not reduced to their
last verb. Unknown senses are explicitly null; no meaning was inferred.

All 1001 bundled Kaikki rows are integrated as traceable reference evidence,
including bare cases and 37 Genitiv rows. Registry evidence records increase
from 1086 to 1541; this is retained-source coverage, not 455 new verified rules.
Each frame carries its attribution document, record locator and extraction method.
Conflicting prepositional alternatives are retained and withheld. Bare dat+akk
rows alone are not classified as contradictions because they could be different
roles or readings, for which the source retained no identifying context.

The 66 AI-generated government additions are identified explicitly by exact
triple difference against commit `fadba6d5`'s parent, the original 370 rows.
CEFR labels do not promote these additions to source truth. Automatic government
enrichment, lesson diagnostics and lexical case hints exclude them. The two
original schreiben+an case alternatives are retained but withheld because the
available dataset has no sense/context distinction. The remaining 368 original
non-conflicting government records are usable within their construction scope.

Case hints no longer promote the lossy regex subset into lexical government.
A prepositional object cannot be justified by a bare-dative verb elsewhere.
Independent fixed-preposition case rules and existing motion/location handling
remain separate. The Wiktionary transitive category remains source membership;
it creates no Akkusativ frame. Grading, learning progress and FSRS are unchanged.

## Remaining concrete data gaps

- 4256 canonical keys have conjugation but no valency evidence in the four
  bundled source families; examples include abarbeiten, abarten and abbauen.
- 2099 have evidence requiring review. Of these, 1631 have only the raw
  transitive category: no argument, preposition, case or sense is supplied.
- All 1001 regex rows lack retained gloss text/sense IDs, complement roles and
  context to distinguish lexical government from incidental adjuncts. Examples:
  fesseln+an and hängen+an have unresolved case alternatives; the raw befüllen+mit
  Akkusativ row cannot safely become a rule. Genitiv rows stay reference-only.
- All 66 AI additions require independent source verification. They are not
  counted as completed linguistic integration.
- Untagged bare-dative/ditransitive source rows still require role and sense
  context before diagnostic promotion; no extra Akkusativ role was fabricated.
- Even the 303 eligible keys cover one or more bounded constructions, not every
  sense of each verb. Full coverage of all 6658 verbs remains incomplete.

## Reproduce the report

`node scripts/audit-verb-valency.mjs --runtime` prints current application coverage.
Add `--full` to obtain every key's status, source membership and individual
source-preserving frames, including the unresolved/review queues.

Validation uses focused registry, inventory, government enrichment, lesson
case diagnostics and case-hint tests, plus the audit's own tests, typecheck and
compile-only build. No auth/persistence browser rerun, migration, deploy or
production-data operation is part of this change.
