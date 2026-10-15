# Current Kaikki valency integration — 2026-10-14

## Commit and validation identity

The earlier integration/context transfer was reviewed and secured in local commit
`ad52ba2368d9a8496c508ba31d70a7ce74a8a8f2` (20 task files only). No push/deploy.
The work below is an additional uncommitted working-tree change on that HEAD.
Tests run against that HEAD plus this diff, not a committed SHA containing the
current-source changes. Unrelated local skill/CodeGraph/Firebase/Vercel files
were not staged or changed.

## Source actually used

The requested path `~/Documents/wiktionary-measure/raw-wiktextract-data.jsonl`
does not exist. No additional disk-wide search was performed.

Official URL: https://kaikki.org/dictionary/German/pos-verb/kaikki.org-dictionary-German-by-pos-verb.jsonl

- Download date: 2026-10-14; completion UTC: 2026-10-14T10:22:52.710415+00:00.
- Official page's Wiktionary dump date: 2026-09-02.
- Official page's Wiktextract extraction date: 2026-10-03.
- HTTP Last-Modified: 2026-10-03T13:56:53Z.
- Bytes: 312729518.
- SHA256: `25a8581ddef225c405493b557bc8a18a816ef7706b1bd0588459dd2efd376141`.
- License for Wiktionary text: CC BY-SA 4.0 / alternatively GFDL, documented at
  https://en.wiktionary.org/wiki/Wiktionary:Copyrights. Derived application slice
  is CC BY-SA 4.0 and attributes Kaikki/Wiktionary and per-word pages. Examples
  may carry independent quotation rights; original references remain in research
  output, but third-party quotations and media are excluded from the shipped slice.
- Provenance/version page: https://kaikki.org/dictionary/German/pos-verb/index.html.
- This is Kaikki's official **postprocessed verb JSONL**, not the complete
  unprocessed multilingual Wiktextract dump. It is not called the 2026-09-24 data.

The first bounded download timed out (curl 28) after 124649472 bytes. Resume
returned HTTP 206 with the same ETag/Last-Modified; completed size and SHA256
were then verified. There is no unresolved access blocker.

## Real-data scope and results

All 6658 canonical keys were compared by normalized exact lemma; no spelling
variants were silently conflated. Inflected form-of senses were excluded from
lexical matching and valency extraction.

| Metric | Actual result |
| --- | ---: |
| Unique canonical verbs with lexical senses in current source | 6654 |
| Canonical keys not found | 4 |
| Lexical senses retained in research output | 12280 |
| Candidate sense-level valency records | 1125 |
| Distinct candidate construction/preposition/case structures | 955 |
| Verbs with explicit valency candidates | 589 |
| New lemma/preposition/case triples absent from legacy set | 150 |
| Legacy rows associated with current-version contexts | 777 / 1001 |
| Legacy rows without a current-version association | 224 |
| Approved current-version sense/frame records | 197 |
| Unique approved current-version structures | 161 |
| Newly diagnostic-eligible verbs / structures | 2 / 2 |

Missing keys: `abflaken`, `bieren`, `nassmachen`, `nassspritzen`. A miss is not a
claim that the verb does not exist. 6065 matched verbs have senses but no explicit
valency candidate supported by the implemented grammar-field extraction; neither
examples nor a transitive tag invent their case frames.

Legacy rows are untouched. Association means the **new** snapshot has the same
triple and a recorded sense context; it does not reconstruct the old snapshot.
Different versions remain separate provenance families. Version differences do
not automatically become errors or conflicts.

Application government coverage changes from 303/2099/4256 to
**305 diagnosticEligible / 2101 evidenceNeedsReview / 4252 unresolved** (6658 total).
Those statuses describe valency evidence; lexical-source matching of 6654 keys
is recorded separately. There are now 396 distinct eligible structures among
corpus keys, up from 394. This is not complete sense-level coverage of all verbs.

## Acceptance checks actually applied

Candidates retain same-sense glosses, raw glosses, labels, examples, source IDs,
line/hash, snapshot hash and explicit evidence offsets. The source also has
structured `info_templates` named `+obj`: e.g. `:auf(acc)` supplies a grammatical
preposition/case argument even when clean gloss text omits it. Those fields and
raw glosses are parsed, not guessed from transitivity or example morphology.
`acc` is normalized to internal `akk` while its exact source span is retained.

Context association itself always has `diagnosticEligible: false`. Separate
review governs actual frame eligibility:

1. 195 sense-level records are accepted because their explicit same-sense `+obj`
   is an exact match for an independently source-curated, already eligible
   construction/case, with no current-version case alternatives or historical
   label. Reflexive syntax must match exactly; an AI addition cannot corroborate.
2. Two new records are manually source-reviewed: **huldigen + bare Dativ** and
   **schwanen + bare Dativ**, each explicit in its +obj and independently checked
   against https://www.duden.de/rechtschreibung/huldigen and
   https://www.duden.de/rechtschreibung/schwanen. Duden prose is not copied.
   The schwanen rule is confined to the listed impersonal normalized authored
   answers; it does not apply to arbitrary personal uses. Review identity binds
   snapshot hash, source-record hash, sense ID, construction, case and exact
   template argument, so approval cannot float to a different snapshot/sense.
3. Lesson diagnosis still requires one aligned same-person case substitution in
   an otherwise identical authored accepted answer, sourced verb forms, adjacent
   preposition when relevant and reflexive conditions. No free dependency parser,
   generic transitive-to-Akkusativ conversion or automatic mastery claim was added.
4. Existing and new eligible records are deduplicated by construction when
   choosing diagnostic candidates; independent corroboration does not create
   false ambiguity. All 66 AI records remain quarantined and traceable.

## Pending records and reasons

928 current-version candidate records are not approved:

- 93: gloss/raw-gloss association without structured +obj evidence.
- 42: historical/register labels require suitability review.
- 187: alternative cases across senses require actual sense selection; these are
  not automatically linguistic errors, and no generic rule was chosen.
- 606: explicit grammar exists, but independent verification or a safe context
  binding is still missing. Structured extraction is not universal approval.

61 candidate sense-frames are Genitiv; diagnostic handling remains A1-safe
Akkusativ/Dativ. Multi-role and idiomatic bare cases remain scoped to source
senses rather than becoming unconditional rules. Current-source candidate
product records carry a machine-readable pendingReason. The old 224 unmatched
rows are a source/version/extraction association gap, not 224 declared mistakes.

## Reproduce / inspect actual artifacts

The 312729518-byte download and full research data are outside Git:
`/private/tmp/karta-kaikki-current/verbs.jsonl`, `report-final.json`, `senses.jsonl`.
The shipped slice is approximately 2 MB, versioned under `src/content/`; it
contains contextual valency candidates, source matching and review results,
not the full raw research dataset.

```sh
node scripts/extract-current-kaikki-valency.mjs RAW.jsonl MANIFEST.json KEYS.json LEGACY.json NEW-REPORT.json NEW-SENSES.jsonl
node scripts/build-current-kaikki-valency-pack.mjs NEW-REPORT.json REVIEWS.json NEW-PACK.json
node scripts/audit-verb-valency.mjs --runtime
```

`KEYS.json` is the JSON array of `listVerbLexicon().map(entry => entry.lemma)`.
Both exporters use exclusive output creation. The pack builder automatically
reads only independently curated eligible frames for corroboration; it excludes
AI/current-source frames from its own supporting evidence. Review file:
`src/content/kaikki-valency-reviews-2026-10-14.json`.

Validation: 13 targeted script/audit cases and 47 registry/lexicon/context/lesson
cases pass (60 total); typecheck and safe compile-only build pass. No migration,
auth/persistence test, deployment, push or production-data write.

## Task files changed after the safety commit

- `docs/KAIKKI-CURRENT-INTEGRATION-2026-10-14.md`
- `docs/kaikki-current-source-manifest.json`
- `scripts/audit-verb-valency.mjs`
- `scripts/build-current-kaikki-valency-pack.mjs`
- `scripts/build-current-kaikki-valency-pack.test.mjs`
- `scripts/extract-current-kaikki-valency.mjs`
- `scripts/extract-current-kaikki-valency.test.mjs`
- `scripts/restore-kaikki-valency-context.mjs`
- `src/content/kaikki-valency-reviews-2026-10-14.json`
- `src/content/karta-kaikki-valency-2026-10-03.json`
- `src/lib/curriculum/lesson-diagnostics.test.ts`
- `src/lib/curriculum/lesson-diagnostics.ts`
- `src/lib/german/valency-source-context.test.ts`
- `src/lib/german/valency-source-context.ts`
- `src/lib/german/verb-lexicon.ts`
- `src/lib/german/verb-valency-index.test.ts`
- `src/lib/german/verb-valency-index.ts`

## Kalıcı araştırma kopyası

2026-10-14: `/Users/mahsum/Documents/karta-language-data/kaikki-current-2026-10-14` Git dışındadır. 15 dosyanın kaynak/kopya SHA256 eşitliği doğrulandı; `COPY-INTEGRITY.json` dosya bazında hashleri içerir. Ham JSONL SHA256: `25a8581ddef225c405493b557bc8a18a816ef7706b1bd0588459dd2efd376141`.

## Fixed exercise delivery — 2026-10-15

The earlier 227-item review remains versioned separately. Its 211 active fixed
items are joined with 45 source-example clozes from the remaining 686 candidates
plus the 16 earlier holds. None of those 16 could safely be resolved. The new
702-record artifact retains every per-record hold reason, full sense/source
identity, register/reflexive/argument conditions and rejected example checks.
Reproduce without downloading: `node scripts/review-remaining-valency.mjs NEW.json`.

All 49 initially extractable candidates were inspected: three subject slots and
one example missing the specified prepositional argument were rejected. Accepted
items require a same-sense explicit +obj, an unchanged complete source example,
one case-marked target, visible reflexive conditions and preserved other
arguments. Determiners additionally require unambiguous singular noun gender in
the existing noun source. Alternative-case, historical/rare, gloss-only and
unsupported Genitiv candidates stay held; reasons may overlap. No CEFR is inferred.

The 256 reviewed exercises (95 pronouns, 161 articles; 234 distinct
construction/preposition/case structures, 208 lemmas) are reachable from Home,
Grammar practice and Grammar Reference. The older 15 source-pronoun exercises
remain available in their original Pronomen flow and are not double-counted here.
Unknown teaching levels prevent mass insertion into the A1 curriculum. The 657
held records are separate from accepted reference facts and from lexical
free-sentence diagnostic permission; the latter indexes are unchanged.

Each fixed-item answer is regraded on the server against exercise ID, content
version, sense, record ID and exact sentence. Authenticated writes reuse
`users/{uid}/grammarRemediation` and `learningDiagnostics` in one transaction.
Operation retries are idempotent; latest valid answers derive the mistake and
24-hour due queues. Correct retries clear immediate mistakes but add no
independent mastery evidence or vocabulary FSRS writes. No new collection,
migration, compatibility layer or production setting is required. Failed saves
are visible and must be retried before advancing.
