# Batch B: Unit 6 and Checkpoint 2

Original Karta prototype content, pending external pedagogical review. No external exam material or AI grading.

## Lesson scope

Four lessons, ten purposeful steps each. Frozen IDs, titles, outcomes, introduced/consolidated skills and hard prerequisite graph are preserved.

- **L01 — Recent experiences: the past frame:** meaning-first `habe/hat … participle`, bounded regular forms, supported separable `eingekauft`, explicit email arrangement/constraint and a fresh completed-action statement.
- **L02 — Familiar past actions and auxiliaries:** reviewed `gegangen`, `gekommen`, `gesehen`, `gegessen`; auxiliary choice by lexical sense/frame, two independent events and past-versus-plan. No universal motion rule; connectors are optional support.
- **L03 — Earlier states and changed arrangements:** only selected ich/er/sie `war/hatte` chunks, explicit message purpose, current/event/possibility transfer and a bounded cancellation with a new proposal.
- **L04 — Choose the useful message:** match explicit place/day/time constraints to original short texts; reuse transport/help vocabulary and produce a fresh three-point response. No hidden inference.

Lexical scope: familiar work/study, shopping, food, station/bank/office, bus, help and social arrangements. Small regular inventory: lernen/gelernt, arbeiten/gearbeitet, einkaufen/eingekauft; machen/gemacht is supplied support. Four irregular verbs above. Earlier-state words krank/müde and reading words geöffnet/ab/bis are glossed. New day/time details are supplied. No later-unit travel vocabulary or subordinate-clause grammar.

Every lesson has recall, production and a fresh final formative observation. Hints, German-character insertion and show-answer recovery use the existing lesson engine. Guided continuation is not recorded as a correct answer. Historical traversal remains practice completion, not mastery.

## Assessments

- **U6 Check:** `DE.A1.U06.CHECK.PROTOTYPE.1`, ten items per A/B form. Functional targets: past bracket, reviewed participle, auxiliary, short email, event sequence, earlier state, changed-arrangement purpose, frame transfer, practical change message and relevant-text matching. Requires four actual historical U6 lesson completions.
- **U6 Challenge:** eight server-keyed items per A/B family. Samples completed action, participle/auxiliary, event sequence, earlier state, purpose, intent transfer and practical change. Existing >=75% rule: 6/8 clears; 5/8 fails. B changes elicitation through correction, reordering and text selection, beyond names. Clearance changes recommendation only; it creates no lessons or Unit Check evidence.
- **CP2:** `DE.A1.CP2.PROTOTYPE.1`, `CP2.FORM.A/B` and `CP2.FAMILY.A/B`, version/compatibility 1. Sixteen bounded tasks **including** one original three-point practical message per form. The existing submission and stored-attempt contracts cap task arrays at sixteen. The brief permits a different size when infrastructure strongly favors it, so this batch preserves those contracts rather than expanding a persistence schema. The message is under the existing 160-character bound.

CP2 samples nine groups: personal information; people/objects/routines; reading/detail extraction; time/changed plans; place/service interaction; requests/rules/instructions; practical message fulfilment; recent events/changed arrangements; transfer/revision. Different A/B scenarios, information layouts and elicitation structures are authored. Retries alternate through existing family selection; same-family practice is explicitly non-independent. History is not pooled into a mastery percentage.

Result groups describe the exact accepted attempt: **Demonstrated** only when every elicited item for that group is correct; **Follow-up needed** if a required item fails; **Insufficient evidence** before a valid submitted observation. Invalid/foreign evidence is rejected. The final message credits only its explicitly graded message group. A 15/16 result with a failed message calls out the message gap directly beneath the task count and keeps its lesson recommendations visible.

## Access, eligibility and persistence

U6 is open for exploration immediately. Existing sequential recommendation chooses U6 after U5 historical lesson completion or valid U5 challenge clearance. U7 remains visible, unauthored and non-interactive. No CP3/U7 content is added.

CP2 follows CP1's existing eligibility philosophy: all four historical U6 lesson completions **or** owner-validated U6 challenge clearance. Restarting a historically completed lesson preserves eligibility. Blocked/incompatible lesson records do not count as completion. A challenge-only learner has CP2 eligibility but remains ineligible for U6 Check.

No persistence schema, collection root, version, migration, FSRS/CardProgress, auth or build configuration changes. Existing owner-scoped courseProgress, unitChallenges and assessmentAttempts contracts are reused. Typed assessment responses remain tab-local; stored results contain correctness/provenance, not raw answers. U1–U5 and CP1 authored banks are unchanged. The shared checkpoint renderer resolves the registered exact form, while keeping CP1's single-family semantics.

## Editorial review completed before commit

Checked all new German prompts, stimuli, keys and feedback for auxiliaries, participles, separable prefix placement, bounded war/hatte use, A1 word order, supported vocabulary, explicit response shapes, missing facts, answer leakage, genuine alternate-family elicitation and evidence scope.

Corrections made:

- Replaced unnatural neutral object-pronoun negation with `Ich kaufe ihn nicht.`
- Removed an unnecessary new visit verb from CP2's final message; reused `können … kommen` with an explicit time.
- Kept lexical-frame auxiliary explanations instead of a universal movement rule.
- Authored reviewed equivalent introductions, phrase orders and mixed native/ASCII keyboard variants in new keys; no old grading keys changed.
- Final message groups receive only the explicitly elicited all-points message observation, never extra ungraded skill credit.

The final observations have fresh intentions/details; Check, Challenge and CP2 offer no hint or answer reveal before submission. Exact task/result reviews remain bounded and non-certifying.

## Focused verification

Real domain/persistence boundary tests cover frozen membership/DAG, all U6 lessons, durable historical progress/restart, Check/Challenge A/B, 75% boundary, U5→U6 recommendation, U7 boundary, CP2 eligibility, immutable exact attempts, message gaps, retries/families and owner isolation. Existing CP1, Batch A, unit/check and navigation regressions are included because the registry and checkpoint renderer are shared.

Compiled browser cases cover exploration, Perfekt lesson completion and hint/show-answer recovery, Check A/B, 5/8 failure, 6/8 clearance, lesson-gated and challenge-gated CP2 entry, CP2 A/B/A exact results/reloads, visible essential message gap, no synthetic lesson writes, U7 closed, desktop, 390px and dark 320px. Screenshots are visually inspected; the hermetic harness rejects unmatched backend calls and runtime page errors.

Typecheck, scoped lint, diff whitespace, safe `build:compile` and compiled SSR syntax checks are required before integration. No normal production build, migration or manual deployment.

Verified before integration: 212 focused domain tests and 34 distinct compiled browser cases passed. Four stale pre-U6 boundary/cleared-course expectations were updated and the affected cases passed on rerun. The final prominent message-gap note and CP1 completed flow were also rechecked on desktop/mobile. Typecheck, scoped lint, `git diff --check`, safe compile and syntax of 199 compiled SSR modules passed.
