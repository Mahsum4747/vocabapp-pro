# German A1 Batch A — Units 4 and 5

Branch: `codex/karta-batch-a-u4-u5`. Base: fetched `origin/main`,
`b275aefc4261bebd6537079d157d181bdfd8622c`. Authored 2026-10-07.
The deployment state of that base was not independently queried.

Original Karta content follows the frozen `GERMAN_A1_BLUEPRINT.md`: lesson IDs,
titles, purposes, skill mappings and hard prerequisites are retained. All six
repository-local Karta skills were read for this task. The current lesson,
assessment, challenge, character-helper and recovery engines are reused.

## Teaching

| Lesson | Context and independent outcome | Steps |
| --- | --- | --- |
| U4 L1 Time and plans | Changed course time, opening window, habit versus plan; a time-first V2 statement | 10 |
| U4 L2 Daily actions with prefixes | Calls, shopping and getting up; full statements, yes/no and wh-questions, time/place arrangement | 10 |
| U4 L3 Ability, wants and requests | Ticket service, own intention versus outside instruction; relevant modal service question | 10 |
| U4 L4 Necessity and permission | Original course/office notices; obligation, permission, prohibition and a workable alternative | 10 |
| U5 L1 Around town: place and transport | Bus/station/bank routes; supported mit/von/zu/aus/bei chunks, dem/der/den and Freunden | 10 |
| U5 L2 Personal help and service interaction | Friend versus staff request; mir/dir/uns/euch/Ihnen, helfen/danken/gehören/es geht, supported written greeting/closing | 10 |
| U5 L3 Location, destination and forms | Station/centre/city/person relations, field labels, independent bounded two-sentence arrival note | 10 |
| U5 L4 Polite instructions and invitations | du/ihr/Sie instructions with kommen/gehen, invitation, acceptance and a constrained alternative | 11 |

Each lesson includes genuine typed recall, sentence production, practical
application and a fresh final observation. Selection, constrained blanks,
ordering, repair, extraction and bounded practical responses are mixed. Prompts
state whether to supply a word, phrase, sentence or multiple sentences. Open-ended
mastery is not inferred from these deliberately bounded tasks.

Lexicon stays compact. Reused: personal names, ich/du/wir/Sie, learning/work,
buying, books, pen, bag, phone, office, small/large, numbers. U4 explicitly supports
Kurs/beginnen, later/tomorrow/month/day/time chunks, anrufen/einkaufen/aufstehen,
and Fahrkarte. U5 supports Bus, Bahnhof, Bank, Zentrum, Stadt, Freund/Freunde,
route chunks, helfen/danken/gehören, form labels and greeting/closing formulas.
Incidental Dienstag, Termin, Anmeldung, Treffen, Zeit and update labels are glossed
in the relevant assessment stimuli/prompts. Place grammar in U4 remains supported,
not independently assessed as U5 grammar. No subordinate clauses, past tense or
complete two-way-preposition system is introduced.

## Checks and challenges

U4: `DE.A1.U04.CHECK.PROTOTYPE.1`, `U04.FORM.A/B`, `U04.FAMILY.A/B`.
Targets: time/V2, changed plan, separable statement/question, possibility,
request versus intention/instruction, modal bracket, notices, practical alternative.

U5: `DE.A1.U05.CHECK.PROTOTYPE.1`, `U05.FORM.A/B`, `U05.FAMILY.A/B`.
Targets: route/place, dative phrase, personal pronoun, help/register, location versus
destination, form field, imperative addressee, usable invitation/message reply.

Every Check form has eight items with reading and productive observations. A/B
vary elicitation and stimulus family (composition/extraction versus repair,
interpretation and alternative scenarios), rather than changing only names.
Assessment keyboard variants are explicit new-family answer keys; older grading
and compatibility versions remain unchanged. These forms are author-reviewed
prototypes, not psychometrically calibrated equivalent tests.

Each unit also has two server-only Challenge families, eight items apiece. They
sample independent communicative arrangements; keys are not sent with challenge
prompts. The existing rule remains `correctCount / total >= 0.75`: 6/8 clears;
5/8 does not. No hints or answer reveal before results, AI grading, raw assessment
answer history, fabricated mastery or certification were added.

## Progress and persistence

U4 lesson/unit entry and durable writes require historical completion of all four
U3 lessons OR validated U3 challenge clearance. U5 similarly follows U4. The
existing U3 policy is delegated unchanged. Incompatible/blocked prior lesson rows
do not supply completion. Clearance permits voluntary study of skipped lessons,
but does not mark them complete or create Check evidence. Each Unit Check still
requires its own four actual historical lesson-completion milestones.

The course exposes twenty authored lessons. U6 remains unauthored/unavailable;
CP2 has no registration or content. CP1 still follows U3 completion OR U3 challenge
clearance. Existing challenge entry/retry semantics and historical verdict
interpretation are retained.

No new persistence paths, schemas, migrations or auth/ownership rules. Registration
uses existing assessmentAttempts/courseProgress/unitChallenges contracts. New
content uses initial resume contract version 1; previous lesson/Check/CP1 keys and
versions are unchanged. FSRS/CardProgress, grammarProgress, lesenProgress and Paste
were not modified.

## Editorial pass

Reviewed every new lesson, Check and Challenge prompt, stimulus and answer set for
scope, grammar, register, response shape, lexical support and form independence.
Corrections during review:

- Added explicit teaching that a separable infinitive stays whole after a modal
  (`Ich kann einkaufen`), before that transfer appears in a challenge.
- Used a book request for U4 Check A, avoiding the lesson's exact ticket-request
  stimulus; A/B also contrast request, intention and instruction deliberately.
- Removed an awkward third-person service request with euch. Group euch remains
  taught in a natural direct-address frame; polite requests use mir/uns.
- Kept challenge question morphology within reviewed forms (`Was soll ich lernen?`).
- Replaced spoken farewell in a written service request with supported
  `Vielen Dank!`; retained complete `Ich danke dir/Ihnen` frames rather than unnatural fragments.
- Accepted both genuine source/accompaniment orders in the U5 dative sentence;
  selected station location/destination phrases explicitly describe their relation.
- Updated obsolete future-unavailability/count expectations to U6/twenty authored
  lessons. The original Unit 1–2 sentence-blank regression remains scoped to those
  reviewed tasks; U3 and the new typed responses have separate answer tests.

## Validation

- Curriculum domain: **284 passed, zero failed/skipped**. Includes all eight new
  lessons, frozen mappings/DAG, grading/keyboard/meaning reversals, durable reload,
  Check A/B gates/evidence/owner isolation, Challenge A/B 5/8 and 6/8 boundaries,
  truthful progression, blocked rows, CP1 and existing curriculum regressions.
- Compiled browser: **18 passed**, desktop and mobile, using hermetic verified-owner
  mocks: U4/U5 representative completion/reload, Check A/B and exact results,
  character helper, hints/reveal recovery, U4 5/8 versus 6/8 progression, optional
  skipped lessons, direct entry gates, U6 absence and CP1 challenge regression.
- Final editorial U5 Check A/B change: affected desktop/mobile scenarios rechecked
  separately after recompilation: **2 passed**, zero failed/skipped.
- Typecheck, scoped ESLint, safe `build:compile`, generated SSR syntax checks and
  `git diff --check` pass. Screenshots under ignored `screenshots/batch-a/` include
  desktop, 390px mobile and dark 320px recovery; visually inspected, no overflow.
- The first browser attempt used the wrong retry-button locator. It was stopped,
  corrected to the existing “Try the alternate form” control, and rerun successfully.

Commands (from repository root with pinned Node 24.20.0/npm 11.19.0 active):

```sh
node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts
npm run typecheck
npm run build:compile
node node_modules/playwright/cli.js test --config e2e/home-compiled.config.ts \
  e2e/learn-batch-a.spec.ts e2e/learn-challenge-threshold.spec.ts
git diff --check
```

This cloud machine uses its installed Chromium via Playwright's `executablePath`
option, supplied by `/workspace/.onboarding/system-chromium.mjs` as a runner preload.
Compiled QA uses the existing `compiled-db-seal.mjs`: no SQL bootstrap/migration or
real Firebase/AI operation. Scoped lint covers every changed TS/TSX file. SSR syntax
was checked with `node --check` for each generated `_ssr/*.mjs` (200 modules).
No normal production build, manual migration, deployment, merge or push.
