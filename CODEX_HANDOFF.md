# CODEX_HANDOFF — Karta / vocabapp-pro

Audit date: 2026-10-04 (Europe/Berlin). Repository: `Mahsum4747/vocabapp-pro`.
Audited source: `2f3e680e438626e7759162c79f1afeafad229d16`, branch `main`.

This document describes the checked-out implementation, not an earlier agent's plans. Paths below are repository-relative. Source and observed command results take precedence over comments. No application code was changed. No production records were queried. No credentials were printed. Fetch updated local remote-tracking references; no pull, commit, push, merge, deployment, or migration was performed during this audit. Temporary validation logs and a disposable source archive live outside the repository under `/tmp/codex-audit-*`.

## Home primary recommendation UI — 2026-10-04

Feature branch `codex/home-recommended-next-v1`, based on merged LearningSignals /
adaptive policy main `35d73daadf0d95198c641e942210a00ffe618dae`.
See `HOME_RECOMMENDED_NEXT.md` for placement, states, exact route semantics,
screenshot audit/polish, validation and additional read cost.
Home now renders only the engine's primary suggestion after Today/creation shortcuts.
The existing authenticated signals loader is reused; no ranking or Firestore query
path duplicated. Retry is quiet; empty/signed-out/known-stale targets render nothing.
Reuse the existing lazy auth gates boundary: a separate auth entry for the card
caused a Nitro/rolldown SSR chunk failure; compilation alone did not detect it.
No migration, reset, production access, deployment, merge or push in this task.

## Current hardening update — 2026-10-04

The original audit below is a dated baseline at `2f3e680e`. The current feature
branch is `codex/preprod-foundation-hardening`; see `PREPROD_HARDENING.md` for the
current architecture, exact validation, reset strategy and merge-review items.
The audit's original failures/debt are historical where this update supersedes them.

Dependencies now match the unchanged lockfile versions. Card edits use explicit
immutable IDs, moves preserve progress, grammar/Lesen/Paste writes are transactions,
Paste sessions await idempotent saving and have durable per-round retry receipts.
Deletion includes all four user roots. Runtime schemas and privacy-safe diagnostics
are strengthened. Default TS tests discover omitted Kurdish/drill tests; desktop
and mobile learning regressions execute hermetically. No SRS semantics changed.
No production data reset, migration, deployment, push to main or merge occurred.
The pre-merge review further corrects the full-set transfer bound/current caches,
late session writes, server-enforced deletion ordering, native review controls,
profile-dependent touch targets and legacy missing counters. Accuracy evidence
separates its rolling denominator from lifetime attempts.
See PREPROD_HARDENING_REVIEW.md for fresh validation and the merge decision;
the original hardening validation remains recorded in PREPROD_HARDENING.md.

## LearningSignals foundation — 2026-10-04

Production main was merged/deployed at `088be3e0`. The next isolated branch,
`codex/learning-signals-foundation`, adds an authenticated session-only read model:
`getLearningSignals()` → projected Firestore reads → pure `buildLearningSignals`.
No persistence, scheduler, cache repair, recommendation or UI feature changes.
Existing Hub CEFR labels are extracted unchanged into shared grammar-curriculum.
Fixed/Paste and bundled/Paste reading stay separate. Per-level reading accuracy,
writing error rates and longest streak remain unavailable rather than fabricated.
See LEARNING_SIGNALS.md for the complete model, date/evidence rules and read costs.
This foundation branch is not merged or deployed.

## Adaptive recommendations v1 — 2026-10-04

`codex/adaptive-recommendations-v1` starts from unmerged LearningSignals HEAD
`395e504024b545a18e67a73633216bf38564c898`. Pure buildAdaptiveStudyPlan consumes
only LearningSignals, deterministic bounded candidates with explanatory evidence,
conservative thresholds, shared actual destinations and deduplication. Existing
set projections now derive eligible practiceTargets; no additional Firestore reads.
No endpoint, Home/UI, scheduler, persistence or AI changes. See
ADAPTIVE_RECOMMENDATIONS.md for exact types, scoring, routes, full fixture outputs
and validation. Branch stays local, unmerged and undeployed; no migration/reset.

## Recommendation quality review — 2026-10-04

65 synthetic scenarios pass, with 77 added quality tests (129 combined engine tests).
Exactly1 overdue base95→85 permits severe evidenced grammar to win; large backlog
unchanged. Domain cap yields only to work >6 points stronger than alternatives.
New-content action opens review without a new-only/count guarantee; Lesen explicitly
asks manual level selection. Paste history prevents false new-user fallback.
No architecture/read/SRS/UI changes. ADAPTIVE_RECOMMENDATIONS_REVIEW.md records
actual candidate scores, decisions and caveats. Local review commit; no push/merge/deploy.

## 1. Executive Summary

Karta is an authenticated vocabulary and German practice application. React/TanStack Start supplies the UI and server-function transport. Better Auth uses Postgres for identity/session persistence; Firestore stores learning content, progress, settings, and AI caches. Firebase Auth is not the application's login mechanism.

The repository already includes vocabulary study modes, a substantial German Grammar Hub, Grammar Paste with saved history, A1–B2 Lesen with touch drag/drop, Lesen Paste with saved history, free writing with optional Gemini feedback, and a browsable 19-topic rule library. Do not rebuild these as missing features.

Git is synchronized: local HEAD and fetched `origin/main` are identical, ahead/behind `0/0`. The working directory has existing untracked files. Installed dependencies are NOT synchronized with the lockfile: dnd-kit is missing and installed TanStack versions predate the recent security upgrade. This prevents a successful local build and adds two typecheck errors to the documented five-error baseline.

Observed validation: typecheck 7 diagnostics; script tests 195 pass / 13 fail; TypeScript tests 771 pass / 1 failing test-file entry out of 772 reported tests. Isolated production compilation failed resolving `@dnd-kit/core`. These results describe the existing local installation, not a clean lockfile install or a deployed release.

## 2. Project Purpose

The product name is Karta (`src/routes/__root.tsx`). Users maintain private study sets, optionally publish sets and copy public content, review vocabulary with scheduling, and practice German grammar, reading, and writing. Canonical language metadata and learning preferences support German, Turkish, Kurmanji and English-related translation flows. German grammatical augmentation is deliberately language-specific; the whole product is not restricted to German vocabulary.

Folders are single-level labels on sets, not a separate hierarchical tree. Reference sets are browsable material excluded from ordinary study. AI is explicitly requested; many language features use bundled resources without an AI call. This does not mean the app is an offline-capable persistence system: authentication and durable learning records still require server access.

## 3. Current Tech Stack

`package.json` and `package-lock.json` are the dependency contract. Actual inspected lock versions include React 19.2.8, Vite 8.2.2, TypeScript 5.9.3, Better Auth 1.7.2, Firebase Admin 14.3.0, TanStack Start 1.168.60, Router 1.170.41, router-plugin 1.168.42, Nitro 3.0.260610-beta, dnd-kit/core 6.3.1 and utilities 3.2.2. Tailwind v4, Radix components, Zustand v5, Zod v4, pg, Kysely, PGLite and Playwright supplement them. These are inspected repository versions, not a claim about the latest available packages.

Local Node reports v24.20.0 in the test output; Nitro's build log selected `nodejs24.x`. Generic AGENTS.md still describes a Linux sandbox with Node 22; this audit ran on the user's macOS checkout.

| Dependency | Lockfile | Installed locally |
| --- | --- | --- |
| `@tanstack/react-start` | 1.168.60 | 1.168.49 |
| `@tanstack/react-router` | 1.170.41 | 1.170.32 |
| `@tanstack/router-plugin` | 1.168.42 | 1.168.35 |
| `@dnd-kit/core` | 6.3.1 | missing |
| `@dnd-kit/utilities` | 3.2.2 | missing |

Dependencies were not installed or repaired during this documentation-only task.

## 4. Repository Architecture

| Area | Role and important entry points |
| --- | --- |
| `src/router.tsx`, `src/routeTree.gen.ts` | Named `getRouter()`, generated file-route tree, scroll restoration and shared error component |
| `src/routes/` | Home/library, create/edit, login/signup/account, `/review`, set modes, Grammar Hub and standalone drills |
| `src/routes/__root.tsx` | Document metadata, stylesheet, AuthProvider, PreviewHostBridge, HydrationGate, celebration, tooltips and toaster |
| `src/components/` | AppShell/MobileNav, card editor, reusable study chrome/session shell, grammar runner, Lesen boards and UI primitives |
| `src/lib/store.ts` | Zustand state and application server-function adapters |
| `src/lib/study-sets.ts` | Core set/card CRUD, sharing/copying/transfers, reviews, profile/settings and Today summary |
| `src/lib/auth/`, `src/lib/db.ts` | Better Auth, origin/session guards, broker/gate support and SQL adapters |
| `src/lib/firebase-admin.server.ts` | Lazy singleton Admin SDK access; fixed project ID and credential loading |
| `src/lib/srs/` | Pure scheduler, memory-derived mastery and queue policy |
| `src/lib/german/`, `src/lib/kurdish/` | Bundled dictionaries, morphology, examples, reading content, lookup wrappers and attribution |
| `src/content/` | Grammar rules, static writing prompts and Turkish A1 pilot content |
| `server/middleware/`, `public/__grok/` | Platform PWA/install/branding plumbing; not ordinary feature routes |
| `scripts/`, `migrations/` | Environment/build helpers, tests, dataset generation and guarded data migrations |
| `e2e/` | Playwright specifications and hermetic backend/session mocking support |

`grammar.tsx` is an Outlet-only parent; `grammar.index.tsx` implements the hub. This distinction matters: a previous implementation rendered the hub at the parent and hid child drills, fixed by `971eb40a`. Set routes similarly use a thin parent and index/detail children.

README.md, RTK.md and AGENTS.project.md were not present at the repository root. User-supplied instructions reference RTK.md, so future work must not pretend it was read. CodeGraph was available and queried before source searches. Its result supplies current source but many comments are historical; verify claims independently.

## 5. Runtime / Request Architecture

Typical private flow: React component → Zustand action or directly imported `createServerFn` → TanStack server-function transport → `authMiddleware` → verified session user → dynamically imported server dependency → Firestore operation → serialized result → store/UI refresh.

Public set listing intentionally queries `isPublic == true` without a private-session requirement. Individual set reads use `optionalAuthMiddleware`, accept document ID or share ID, and return private content only to its owner. Writes check ownership where appropriate; public studying does not grant editing rights.

Vite handles development and TanStack Start compilation. Nitro participates in build/preview with the Vercel preset. Its `serverDir: './server'` wires platform middleware. The dev scripts pass through `scripts/with-app-env.mjs`, which merges only VITE-prefixed string entries from `.grok/app-env.json`; explicit process environment wins over that file. Vite's dotenv loading happens later. An app-env process value can therefore supersede a dotenv value, but cannot overwrite an explicit process override.

`startup.sh` is the inherited Linux revive contract and hard-codes `/workspace`; it is not a ready-to-use macOS startup script. It stops the QA preview, probes the dev app and backgrounds `npm run dev`. It was inspected, not executed or modified.

## 6. Authentication Architecture

Browser auth uses `createAuthClient` from `better-auth/react`, same-origin `/api/auth/*`, login/signup forms and `emailAndPasswordEnabled = true`. The current client explicitly describes email/password-only product sign-in. Server scaffolding still configures generic OAuth broker providers and gate-identity sessions when enabled; those retained capabilities must not be confused with current visible login options or a verified production configuration.

`src/lib/auth/server.ts` builds Better Auth using pg/Neon when DATABASE_URL exists, otherwise the shared in-memory PGLite adapter. Tables come from SQL migrations. The server config includes cookie caching, bearer support, token encryption, trusted origins, account linking and the final TanStack cookie plugin. `gate-identity.server.ts` verifies Ed25519 identity tokens against gate keys with issuer/audience checks; activation depends on environment. Gate availability was not exercised.

`authMiddleware` has both client and server halves. Its client hook forwards a stored preview bearer token; its server half calls `assertSameSiteRequest()` and `requireUserId()`. `verify.server.ts` resolves the session through Better Auth, never a client-supplied user ID. Production cookie identity and preview bearer identity feed the same user-scoped data boundary.

Auth-off with DATABASE_URL configured fails closed; auth-off without a SQL database can fall back to `dev-user`. Do not run an auth-off local server with real Firebase credentials simply because SQL is absent: the fallback is not a general production-data isolation guarantee.

`__Host-` cookie names, Secure/Path attributes and fetch-metadata sibling isolation are intentional defenses. `AppShell` lazy-loads UserButton/auth gates via React.lazy/Suspense; eager shared imports of the auth client caused earlier SSR bundling failures. `.server.ts` naming and dynamic imports prevent Node/auth/Admin dependencies from entering browser graphs.

## 7. State Management

`useStudyStore` is an in-memory Zustand store; it holds owned/public sets, progress indexed by card ID, loading flags, profile, daily stats, streak and Today summary. Actions call server functions and apply returned persisted state. It is not a durable localStorage replacement for Firestore.

`useSet()` resolves document/share IDs; `useSetProgress()` loads per-set rows. Review results patch scheduled progress, daily deltas, XP/profile, Today counters and celebrations without requiring a complete refetch. Separate local component state holds answers, score screens, pasted JSON and writing drafts.

Sound settings have a localStorage cache (`src/lib/sound.ts`) and profile persistence. The preview bearer token uses sessionStorage (`src/lib/auth/client.ts`). `useSessionPlan()` snapshots the per-set session state when a mode opens so subsequent progress writes do not reshuffle the active question/deck.

## 8. Persistence & Data Model

Schemas below are inferred from source; no live records were inspected to discover them. Cards are embedded arrays on a set document, not a separate Firestore cards collection.

| Exact path | Purpose and principal shape | Writer/reader |
| --- | --- | --- |
| `study_sets/{setId}` | StudySet metadata, ownerId, isPublic, timestamps, embedded cards, languages, folder, reference/sharing fields | `study-sets.ts` |
| `users/{uid}` | dailyGoal, timeZone, totalXP, totalReviews, perfectRun, achievements, completedSets, soundSettings, setSessions, explanationLanguage, direction, prefsPrompted, todaySummary and timestamps | `study-sets.ts` |
| `users/{uid}/cardProgress/{cardId}` | SchedulerState plus setId/cardId/userId, review counters, lastReviewedAt/date, masteryScore, scheduler and optional miss counters | `recordReview`, progress APIs |
| `users/{uid}/reviewEvents/{eventId}` | Append-only rating event with identity, reviewedAt and optional responseTimeMs | `recordReview` |
| `users/{uid}/dailyStats/{YYYY-MM-DD}` | date, reviews, correctReviews, studySeconds, uniqueWordsReviewed and xpEarned | `recordReview`, profile/range reads |
| `user_streaks/{uid}` | UTC-day activity and current/longest streak bookkeeping | `streak.ts` |
| `users/{uid}/articleDrillProgress/{cardId}` | Article attempt/correct totals and set/card identity | `article-drill.ts` |
| `users/{uid}/articleDrillProgress/{cardId}:case` | Independent case attempt/correct totals | same APIs with kind=case |
| `users/{uid}/articleDrillErrors/{eventId}` | Drill miss details, selected/correct form and kind | `article-drill.ts` |
| `grammarProgress/{uid}` | Map topicId → accuracy, lastPracticedAt, totalAttempts, stored recentRounds | `grammar-progress.ts` |
| `lesenProgress/{uid}` | Map A1/A2/B1/B2 → completedPassageIds and lastPracticedAt | `lesen-passage-progress.ts` |
| `users/{uid}/grammarPasteTopics/{id}` | topic, ruleExplanation, questions, createdAt and independent accuracy/attempt/recentRounds fields | `grammar-paste-topics.ts` |
| `users/{uid}/lesenPasteTopics/{id}` | level, optional topic, title, text, questions, createdAt and independent progress | `lesen-paste-topics.ts` |
| `users/{uid}/aiFeedbackLog/{id}` | Learner sentence, feedback, set metadata, time; optional card/form/promptId/errorTags | WriteIt and free-write feedback modules |
| `ai_generated_sets/{cacheKey}` | Versioned topic/language generation response cache | `generate-set.ts` |
| `ai_card_suggestions/{cacheKey}` | Versioned definition/example response cache | `suggest-card.ts` |
| `ai_example_suggestions/{cacheKey}` | Versioned 2–3 example candidate cache | `example-suggestions.ts` |
| `ai_usage/{UTC-day}` | dayKey and shared Gemini request count | `ai-budget.server.ts` |

SQL stores Better Auth `user`, `session`, `account`, `verification`, and `_migrations`. Columns use quoted camelCase names. `0002_account_issuer.sql` adds the account issuer column required by the auth library. `migrations/auth/0001_auth.sql` is also retained as template source; root `migrations/0001_auth.sql` is deliberately active. No evidence in the inspected learning modules indicates vocabulary/progress is stored in Neon.

Bundled TSVs/static TypeScript contain dictionary, morphology, rule and reading content. SQL's PGLite fallback is in-memory across a process and HMR, erased on process restart. Neither this fallback nor the client store offers durable offline learning synchronization.

Firestore write boundaries are server handlers/helpers, not browser SDK calls. Batch operations typically chunk at 400 writes below Firestore's 500-write limit; getAll reads are chunked at 300. Learning summaries are cached/delta-updated to control read cost.

## 9. Study Sets & Cards

`StudySet` carries id/title/description/subject, timestamps, ownerId/isPublic, cards, optional shareId/copyCount/copiedFrom, isReference, folder and canonical/free-text language metadata. `Card` carries id, term, definition, starred, imageUrl, optional example, examples.nom/akk/dat, definition2, enrichment, note and status. Missing status means active; excluded/archived cards are omitted from study, and archived cards need the archive view.

**Current identity contract:** Card IDs are opaque and immutable. Create/edit drafts carry explicit IDs; edits/renames and duplicate terms preserve independent identities. Copies/public copies/imports get new IDs. Moves atomically retain identity, vocabulary progress and article/case counters with a new setId. E2E fixture IDs are deterministic test keys, not production identity rules.

`replaceCards()` preserves omitted image/example/examples/definition2/note/enrichment fields and prior flags by ID. User overrides survive, dict/AI enrichment follows server policy. Renames do not create a new card. Duplicate terms have independent IDs. Concurrent set changes are rejected instead of silently overwritten.

`copyPublicSet()` makes a private owned copy with new share ID, timestamps, new card IDs, reset stars/status and copiedFrom provenance. The source copyCount increment is best-effort. `transferCards` checks both owners, skips duplicate target terms, creates fresh copied IDs, and optionally removes source cards. It does not carry source progress into target IDs; target and source updates are sequential, not one atomic multi-document transaction.

Removing/deleting cards removes current vocabulary/drill/session references; historical events remain. Moves retain current progress with corrected setId. `getTodaySummary()` can still rebuild caches and prune orphans despite GET semantics; it is not a passive production audit.

Sharing uses a 10-character cryptographically generated URL-safe shareId (~60 bits) and document-ID fallback. A shareId alone does not override isPublic/ownership. Write/review calls must use the resolved document ID.

Karta JSON is a separate import flow (`karta-prompt.ts`, `karta-import.ts`, `components/import-dialog.tsx`): strict all-or-nothing parsing, 8–200 cards, A1/A2 level, language pickers outside the JSON, ignored legacy pair field, gloss → definition, singular example or per-case examples, user-origin grammatical fields and optional sourceNote. German-only validation checks cases/gender/plural. Set description comes only from the typed description field, never a raw JSON dump.

## 10. SRS / FSRS

Lifecycle: open a mode or `/review` → load sets/progress/profile → queue and session snapshot → serve an active card → produce rating → `useReviewLogger()` → store.recordReview → authenticated `recordReview()` → `planReview()` plus default scheduler inside a Firestore transaction → write progress/event/day/profile → best-effort streak/achievement updates → return state/deltas → Zustand patches UI.

Scheduler interface lives in `srs/scheduler.ts`. State: new/learning/review/mastered, stability, difficulty (1–10), intervalDays, dueAt, reps and lapses. Ratings are again/hard/good/easy; only again is incorrect. Binary modes use good/again. This is a custom **FSRS-shaped** power forgetting model (`srs/fsrs.ts`), not the upstream ts-fsrs package or a verified fitted standard FSRS implementation. Shape compatibility is an intention; an upstream replacement still needs a verified adapter for state/time/rating semantics.

Defaults: requestRetention 0.9, maximum interval 365 days, review graduation interval 1 day, scheduler-mastered interval 21 days. Initial stabilities are [0.4, 1.2, 3.2, 15.6]. The power curve uses decay -0.5 and factor 19/81. First exposure remains learning regardless of the interval; again returns to learning, adjusts stability and counts a lapse on a non-first scheduling path. Elapsed time is reconstructed from dueAt minus prior interval.

`masteryScoreOf()` computes round(log1p(stability)/log1p(180)*100), clamped, returning zero for invalid stability. Leitner boxes 0–5 derive from this score. Display mastery does not feed scheduling. Scheduler state=mastered at 21 days and product mastery threshold=80 are different concepts; do not conflate them.

Queue bands are overdue (more than a day past due), due, weak, fresh and early. Base weights 1000/800/600/400/100 plus bounded overdue/lapse/recent-failure bonuses. Selection never schedules. `isNew()` means no real reviews, not all cards in the fresh band. Due totals include overdue and exclude never-reviewed work. `isWeakWord()` requires reviewed history and at least two signals: mastery<60, last outcome wrong, lapses/reviews>0.3, or a passed due date. This is broader than queue weak banding.

Library sessions exclude reference/small sets, deduplicate card IDs, and keep set provenance. `/review` can limit new introductions to the remaining daily goal. Per-set session cap/pass is independent: default min(20,setSize), served IDs and optional cap stored on user.setSessions; all-served resets a pass. `useSessionPlan()` freezes a round snapshot so results do not reshuffle mid-question. Session caps must not reduce the displayed total due count.

Articles/Cases maintain separate attempt counters on every attempt. Their misses additionally log again with missKind=article/case into real memory; hits do not advance FSRS. Both report a completed grammar round separately. Raw miss counters now drive weak-practice routing: `/review` walks weak cards and routes on the first eligible set with a dominant miss type. The old comment saying these counters are never read is stale.

## 11. Progress / Stats / Gamification

`planReview()` is pure and computes the event, next progress and daily deltas. `recordReview()` reads stored progress/profile before any transaction writes; it writes an append-only event, scheduled progress, daily increments and profile state atomically. Set completion may read other mastery rows before writes. Streak/achievements occur after that transaction and are best-effort.

Daily stats and `lastReviewedDate` use the browser's validated local YYYY-MM-DD key, while reviewedAt/dueAt use server epoch time. A card contributes uniqueWordsReviewed once per local day. XP uses the same first-review-day decision: again -5, hard 0, good 10, easy 20; total XP never below zero. 100 XP per level, one-time set-completion bonus 150, product mastery threshold 80. Achievements include seven-day streak, perfect run, ten mastered cards and set completion.

Streaks use **UTC** via `todayUTC()` in `streak.ts`, unlike daily goal statistics. Same-day activity is idempotent; consecutive days extend; gaps restart. This timezone difference is current behavior, not an inferred unified policy.

Today summary is a cached user-doc aggregate over owned, active, studiable content, with clock refresh, next-due logic, edit/review deltas and periodic full rebuild/orphan cleanup. Store patches returned summary immediately. Rebuild and repair paths need particular care because read-looking functions can mutate cached fields and delete orphan progress.

Review logging remains fire-and-forget with privacy-safe diagnostics and visible failure feedback. No offline durable retry queue or exactly-once token is introduced; an answered screen is not itself persistence proof.

## 12. German Enrichment Pipeline

`resolveSetLanguages()` in `types.ts` validates stored codes, then falls back to normalized free text for term and second definition language. Primary definition language has only defLangCode; older sets can have null without a recoverable fallback. LanguageProfile gates article rendering, grading, dictionary suggestions and term autocomplete.

Automatic dictionary grammar applies only when resolved term language is de. `card-enrichment-policy.ts` trusts sanitized source=user overrides first (including noPlural/sourceNote); otherwise it recomputes server dictionary facts. Thus non-German user provenance may be retained even though automatic German dictionary augmentation is off.

`enrichGermanTerm()` tries lowercase verb government and direct dative signals before noun lookup to avoid plural/verb collisions. Noun facts are filled only when non-name senses agree. Ambiguous compounds remain unresolved; an unambiguous head can supply inferred gender/plural. Lowercase nominalized-infinitive collisions are refused. No gender is guessed for a verb just because an uppercase neuter noun exists.

`nouns-data.ts` is a large (~102k-entry, per source comments) bundled dictionary with lazy indexing. `examples-data.ts` is a smaller frequency-bounded Wiktionary translation/example dataset. `lookupBundled()` rejects ambiguous lemmas rather than selecting file order; German compounds do not magically provide definition/example semantics. Term autocomplete comes from examples lemmas, alphabetical and accent-folded, not a fabricated frequency-ranked search over the large noun table.

Card editor blur/panel flows call authenticated offline lookup wrappers. They expose bundled definition/example chips; the learner chooses content. AI generation is an explicit fallback action, never automatic panel opening. Per-case examples are independently stored; Cases selects the requested case sentence rather than reusing a mismatched nominative example. Cloze/Satzbau use the ordinary example and their own eligibility logic.

Verb government and dative datasets are separate from conjugation. `verb-conjugation-data.ts` contains UniMorph-backed present forms; extended paradigm data generated offline with ablaut covers 6,659 lemmas according to its header, includes participles/tenses/Konjunktiv, and derives passive combinations at runtime. `scripts/generate-verb-conjugation-extended.mjs` is a regeneration tool, not a runtime dependency or a data migration.

Kurmancî resources are already implemented in `kurdish/{ku,tr,de,en}-data.ts`, `lookup.server.ts`, and `bundled-suggestions.ts`: KU↔TR/DE/EN, lazy TSV indexes, up to five glosses. Unlike ambiguous German sense handling, this source lacks sense-level translation links, so the UI presents multiple dictionary translations rather than silently asserting one sense. Do not treat Kurdish lookup as merely a future plan or force German noun enrichment onto TR/KU/EN terms. Preserve attribution files for dictionary/morphology/content licensing; upstream accuracy/licensing was not independently re-audited here.

## 13. Grammar System

Hub categories are Basics, Cases & Pronouns, Verbs & Actions, Sentence Structure, and Advanced. Five existing set-scoped routes are Articles, Cases, Conjugation, Satzbau and Cloze. German sets are filtered through `isGermanSet()` and shared eligibility helpers in `german/grammar-hub.ts`.

Standalone content includes Plural, nicht/kein, possessives, separable verbs, modal verbs, imperative, pronouns, adjective endings, comparison, passive, Konjunktiv II, relative clauses, Diktat, Lesen, participial constructions, nominalization, Funktionsverbgefüge, modal particles, Konjunktiv I, subjective modals and passive alternatives. Grammar Paste is a separate free-topic entry. Comments counting only three/eight modes are historical.

CEFR badges sort topics within categories; they are informational, not permission locks: A1.1 basics/pronouns, A1.2 cases/conjugation/modal/separable/imperative, A2.1 adjective/comparison/Satzbau, A2.2 Cloze/Diktat, B1.1 passive/relative, B1.2 Konjunktiv II, B2 advanced structures, B2/C1 reported speech/subjective modal/passive alternatives. Lesen has its own A1–B2 chooser. Paste has no fixed hub level.

`GrammarDrillRunner` shares question selection, Check/reveal/Continue, score screen and rule dialog. It prioritizes eligible user-library nouns/verbs, deduplicates lemma/infinitive and fills from a general sampled pool. Questions are built by pure functions in `grammar-drills.ts`, normally ten per round. Advanced drills combine extended paradigms, fixed phrases and templates; nominalization uses real bundled source data rather than an obsolete short hard-coded pool. Gloss/explanation selection uses profile explanation language when source data supports it.

`recordGrammarRoundResult()` transactionally records one completed round. Accuracy is question-weighted over the last 20 completed rounds, stored as exact recentRounds counts. totalAttempts counts lifetime questions. No synthetic answer order is invented.

`/grammar/rules` already exposes 19 static rule topics with search, category grouping and accordions. `GrammarRuleContent` is shared with the runner's rule dialog. Rule topic IDs need not match route names verbatim (e.g. partizipialkonstruktionen vs partizipial). The library is a subset of the complete hub, not a nonexistent 30+ topic system.

## 14. Grammar Paste

Route `grammar.paste.tsx` creates a prompt for the user's own external AI chat, with topic, explanation language and 10/15/20 count. It does not secretly call Gemini to generate the questions. Prompt explicitly requests diverse contexts/structures and an error object when it cannot handle a topic.

`parseGrammarPasteJson()` accepts fenced JSON, rejects unknown fields, requires nonempty topic/ruleExplanation (max 1000), exactly the selected number of questions, one ___ blank per prompt, four distinct nonempty options and correctIndex 0–3. Explanation is string/null, normalized/capped at 400. Parsing is all-or-nothing. The server independently validates counts, blank markers, option uniqueness, content bounds and indices with Zod.

Successful paste automatically saves one users/{uid}/grammarPasteTopics document, then runs a shuffled `GrammarDrillRunner` with trackProgress=false, ruleOverride and onRoundComplete. Reopening reads saved content without creating another copy; history supports deletion and JSON copy/export. Each completion updates that topic's independent rolling accuracy/attempt count. It does not write arbitrary topic names into fixed grammarProgress or FSRS.

AI-generated badges label the session/history. `grammar-assessment.ts` can include user-generated topics with at least three attempts in the same optional Gemini assessment, clearly separated from fixed curriculum. `grammar-paste-import.ts` still claims the content is throwaway/unpersisted; source persistence and commit `742ae9b8` supersede that comment.

Paste explicitly validates/saves before opening practice. Failure keeps the session closed and offers same-ID retry. Each completed round has a durable receipt and retry control; reopening and Practice again allocate a fresh round ID.

## 15. Lesen

Sources are `german/lesen-data.ts` and `lesen-data-b1-b2.ts`, modeled by `lesen-types.ts`. Counts were computed from the actual exported arrays using local TypeScript transpilation and an isolated VM, not guessed from comments.

| Level | Total passages | Choice | Matching | Sentence insertion |
| --- | ---: | ---: | ---: | ---: |
| A1 | 35 | 35 | 0 | 0 |
| A2 | 15 | 15 | 0 | 0 |
| B1 | 30 | 25 | 5 | 0 |
| B2 | 25 | 5 | 15 | 5 |

Content is bundled third-party exam-trainer content under the repository's CC BY 4.0 attribution, including generated-content provenance. Do not market it as independently authenticated official exams. A1/A2 intentionally omit certain source matching types; B1/B2 map all their source reading shapes. Explanations are source English rationales, not automatically translated to TR/KU.

`LesenChoiceBoard` renders text and comprehension choices (including two-option true/false-style questions), shuffles options and recomputes correctIndex stably per question. Matching uses short draggable labels alongside reference bodies; allowMultiple is true for person-reuse exercises and otherwise choices are single-use. Sentence insertion splits segments around numbered gaps and supplies an extra distractor.

`lesen-match.tsx` uses dnd-kit pointer/touch/keyboard sensors plus click-select/tap-target fallback. Pointer activation distance=4; Touch delay=150ms/tolerance=12. Collision detection prefers pointerWithin, then rectIntersection. Inline touchAction=none on draggables/targets is intentional: the unlayered global button rule touch-action:manipulation overrides a Tailwind touch-none class. Removing inline styles resurrects a real-phone bug. Drop targets have expanded hitboxes and drag payloads avoid dragging whole reference paragraphs.

`grammar.lesen.tsx` starts with level selection and N/total completed. `pickPassage()` chooses among uncompleted passages with 85% preference, otherwise the entire level pool; completion is a preference, not a no-repeat guarantee. Practice again selects a new randomized passage and may repeat. Back from a round/result returns to level picker; back from picker returns to Grammar.

Completion writes both fixed grammarProgress topic lesen (accuracy/attempts) and `lesenProgress/{uid}` (per-level unique completed IDs), each once per round, best-effort. The separate collection preserves the flat fixed-topic schema. Lesen Paste is never recorded in this bundled completion map. Its completion union is now transactional; simultaneous completions are preserved.

## 16. Lesen Paste

`grammar.lesen-paste.tsx` supports level A1/A2/B1/B2 and optional topic; prompt comes from `lesen-paste-prompt.ts` and respects en/tr/ku explanation preference. German passage/title/questions/options remain German. The app validates external-AI output; it does not generate this content through its own Gemini quota.

JSON schema is title, text, questions[{prompt,options,correctIndex,explanation}], with optional error escape. Exact count is five, four distinct options each; no ___ grammar blank is required. Title max 200, text 10–4000, explanation string/null capped at 400; unknown keys and malformed values fail the complete import.

Only choice comprehension is supported, not matching or sentence insertion. Successful paste automatically saves level/topic/title/text/questions to `users/{uid}/lesenPasteTopics/{id}`. History lists newest first, reopens stored content, and deletes owned documents. Progress is independent accuracy/recentRounds/totalAttempts/lastPracticedAt on that saved document.

AI-generated labels remain visible. The shared choice board handles shuffled correct-answer positions. `handleRoundComplete()` now sets done/result counters and displays a score screen, fixing the previously inert final Continue. This flow never calls recordGrammarRoundResult or recordLesenPassageCompletion and never contaminates either grammarProgress or lesenProgress. Its save lifecycle and durable progress retries follow the same contract as Grammar Paste.

## 17. Write Mode

`sets.$setId.write.tsx` has Set words and Task tabs. Set words suggests three distinct active terms from the existing queue and accepts a short free sentence (200 chars). Task uses the static `content/write-prompts.ts` bank (available A1/A2/B1), task instructions/required points and word targets; submission requires the minimum and input has a hard stop at maxWords+20%. Default task level is A2.

Check explicitly calls `getWriteSentenceFeedback()`. This mode has no fixed answer, numeric objective grading or vocabulary logReview write; it does not advance FSRS/CardProgress. It presents free-text feedback and structured error categories. Drafts are component-local; feedback is saved best-effort to aiFeedbackLog, with promptId for tasks, and exposed on Account grouped by set.

Categories: article_gender, case, verb_position, verb_conjugation, register, missing_leitpunkt, word_choice, spelling, word_order_other; severity minor/major and optional excerpt. `parseErrorTags()` drops malformed tags while preserving valid tags and free text. Recent `6fd0f2ad` clarified the two tab purposes and category summary.

WriteIt is a different existing subsystem (`components/write-it-step.tsx` and related feedback helpers), embedded after Articles/Cases. It checks an inflected phrase using rule-based form relevance, distinguishes irrelevant sentences from wrong forms, and can request optional AI feedback. Do not merge these grading semantics with free Write mode merely because both log AI comments.

Other established modes: Flashcards with explicit ratings, Test/Learn answer grading, Match pairs, Articles, Cases, Conjugation, Cloze and Satzbau. Session snapshots and served tracking are reused. Language-aware article rendering and grading leniency are distinct from the drills that explicitly test articles/cases.

## 18. AI / Gemini Usage

Inspected call sites configure `gemini-3.6-flash` and Google generateContent: generate-set, suggest-card, example-suggestions, write-it-feedback, write-sentence-feedback, grammar-assessment. This is the repository's configured string; API/model availability was not queried. Do not repeat source comments about current GA/free-tier quotas as independently verified provider facts.

API key remains server-only. Input/output schemas, short requests, cached generation/suggestions and explicit user actions constrain use. Shared cache keys are versioned and canonicalize languages; example suggestions strip leading article and intentionally omit topic/existingTerms from the cache key to reuse word-level responses. Cached answers can reflect the first context requested.

`spendAiAction()` transactionally increments ai_usage per UTC day. No per-user quota remains. Default configured ceiling is 1500 unless GEMINI_DAILY_CEILING overrides it; generate stops at floor(0.7*ceiling), assists at ceiling. Cache hits do not spend; failed requests are not refunded. This is application accounting, not a verification of actual vendor quota.

AI-generated German noun sets have a save-time completeness gate: gender, plural or explicit noPlural, and example. User corrections outrank dictionaries. Automatic bundled lookup consumes no Gemini action. Paste workflows consume the user's external chat, not the project's generation endpoint.

## 19. Testing Architecture

Node's built-in test runner supplies script tests and explicitly enumerated TypeScript tests via experimental type stripping. `npm test` runs both even if the first fails. It is not Vitest. Pure scheduler/queue/review/gamification/language/import functions have tests; some regression tests inspect source text rather than execute Firestore behavior.

The explicit test:ts list excludes some existing files, notably `kurdish/lookup.server.test.ts` and `article-drill.test.ts`; presence on disk does not mean default npm test executes them. Grammar/Lesen Paste validators and touch completion flows lack a default executed test result in this audit.

Playwright has desktop Chromium and Pixel 7 projects, two workers, fixed UTC/en-US and retained failure traces. `e2e/support/app.ts` freezes time, blocks off-origin requests, mocks auth sessions and fails on unclaimed API/server-function calls. `ServerFnMock` models TanStack serialized wire responses; MockBackend stores sets/reviews/progress in memory. Config also blanks DATABASE_URL/Firebase/Gemini/Better Auth credentials and refuses server reuse. The wire contract may need updating after transport upgrades; it was not exercised here.

Playwright/browser smoke was NOT run: current dnd dependency failure already blocks rendering, and dev startup's PGLite bootstrap applies SQL migrations in memory. The user's explicit no-migration constraint and one-repository-file limit were prioritized over generic app-building QA instructions. No server was started, no screenshots generated, and no claim of browser/runtime correctness is made.

### Executed baseline

| Command | Result | Observed details |
| --- | --- | --- |
| `git fetch origin` | PASS | Added two remote branch refs; origin/main unchanged |
| `npm run typecheck` | FAIL | 7 diagnostics: missing dnd core, consequent implicit-any, popup API mismatch, four seed input errors |
| `npm run test:scripts` | FAIL | 208 tests, 195 pass, 13 fail |
| `npm run test:ts` | FAIL | 772 reported tests, 771 pass, 1 failing file entry |
| isolated `node scripts/with-app-env.mjs vite build` | FAIL | Production client compilation cannot resolve @dnd-kit/core; Nitro Vercel preset selected; no migration command called |
| Local VM evaluation of bundled arrays/rules | PASS | 105 Lesen passages and 19 rule topics counted |
| `git diff`, `git diff --cached`, final ahead/behind | PASS | No tracked application diff; main 0/0 against origin/main |

Typecheck locations: `src/components/lesen-match.tsx:16` TS2307, line 74 TS7006; `src/lib/auth/popup.server.ts:65` missing signInWithOAuth2; `src/lib/seed.ts:29,53,76,94` missing ownerId/isPublic. The latter five match the historical locations. Missing dnd is an existing local-install mismatch observed before any source changes; a clean install baseline is unmeasured.

TypeScript failing file: `src/lib/term-display.test.ts`; plain Node cannot resolve the `@/components/articleized-term` import reached through term-display.ts. Commit ebe1f938 already records the same 1/772 failure as predating its upgrade. The result is a loader failure, not a failed scheduling assertion.

The 13 script failures reproduce CLAUDE.md's count:

1. `check-auth-invariant.test.mjs:93`: build side resolves template shipped app-env.
2. `grok-pwa-plugin.test.mjs:105`: platform chrome overwrites share-card metas/og:title.
3. Same file `:246`: published grok.me slug title fallback.
4. `:305`: public-host/custom og:image.
5. `:326`: placeholder image color.
6. `:349`: title entity escaping.
7. `:365`: document without head.
8. `:372`: case-insensitive streaming HEAD injection.
9. `:397`: app-name injected title tag.
10. `migration-plan.test.mjs:59`: template auth schema outside glob.
11. `with-app-env.test.mjs:62`: template ships auth off.
12. `:76`: wrapped command app-env.
13. `:116`: symlinked CLI path.

These largely assert generic template branding/auth defaults rather than this customized auth-on Karta project. Exact behavior was not repaired; source intent and test assumptions must be reconciled before deleting assertions. Logs: `/tmp/codex-audit-{typecheck,scripts,ts,build}.log`. The compiler was rerun to retain diagnostics after its first asynchronous output handle was no longer available; results above use the retained log.

## 20. Deployment Architecture

`vite.config.ts` selects Nitro's vercel preset only for build/preview, serverDir ./server, traceDeps=['firebase-admin*'], and fra1 region. `vercel.json` also sets fra1. External tracing is essential: bundling Admin/grpc as plain ESM breaks __dirname; plain externalization alone fails to copy runtime packages into Vercel functions.

`npm run build` = wrapped vite build **then npm run db:migrate**. scripts/migrate.mjs applies root SQL migration files against DATABASE_URL, records `_migrations`, and skips without that variable. A plain production build is therefore not inherently read-only. For this task an archived HEAD in `/tmp/codex-audit-build` used existing node_modules via symlink, with DB/Firebase/Gemini/auth-secret environment blanked, and invoked only the compile part. It contained no copied `.env` files and never invoked the migration script. It failed before a complete production artifact was validated.

Source compilation emitted a warning that node:crypto in example-suggestions.ts was externalized for browser compatibility. Treat it as a boundary item to inspect after dependencies are aligned; it is not evidence that any secret value was emitted.

Core env names: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, VITE_AUTH_ENABLED, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, optional FIREBASE_STORAGE_BUCKET, GEMINI_API_KEY, optional GEMINI_DAILY_CEILING. Retained platform/broker integration uses GROK_AUTH_ISSUER, GROK_AUTH_CLIENT_ID, GROK_AUTH_CLIENT_SECRET, GROK_PROJECT_ID, GROK_GATE_ORIGIN and related connector configuration; branding can use VITE_PUBLIC_HOSTNAME. VITE-prefixed values are public, never credential carriers. Actual env values and Vercel secrets were not inspected.

CLAUDE.md reports only main auto-deploys through an Ignored Build Step. Repository vercel.json does not establish that project setting; Vercel dashboard/deployment status, branch binding, remote installed rules and live migration state were not accessed. Do not assert latest source is deployed just because origin/main is current.

`firebase.json` points to firestore.rules/storage.rules. Firestore source rules deny all client access. Storage upload UI is disabled by IMAGE_UPLOAD_ENABLED=false; server upload helper remains implemented and token URLs have different read semantics. Installed remote Firebase rules were not verified.

## 21. Git / Development History

Recent history was inspected through the last 30 main commits, an all-refs recent log, targeted messages, branch listings and full messages/stats for important commits. Status was verified against current source rather than message alone.

| Commit | Verified milestone |
| --- | --- |
| `2f3e680e` (Oct 2) | Always-visible Organize entry for folder moves; 19-topic rules browser with shared rule renderer |
| `ebe1f938` (Oct 1) | Lock/package TanStack security upgrade and unknown-error boundary handling; installed local packages lag it |
| `6fd0f2ad` | Write tab purpose copy and error-category summaries |
| `90758660` | Shared Lesen choice option shuffle; Lesen Paste done state; Grammar Paste diversity instruction |
| `8dd2572c` | Lesen Paste and per-level bundled passage completion |
| `6a7f2d94`, `7d04a9e7`, `80da5627` | Touch-action cascade, pointer collision/drop hitboxes, internal back flow and reuse/drag-content fixes |
| `09184161`, `5d05e347` | B1/B2 then A1/A2 reading content, replacing the former Lesen skeleton |
| `742ae9b8`, `7338da6b`, `ff37cd29` | Grammar Paste persistence/assessment, count/export, then initial copy/paste feature |
| `b7fe2f2f`, `71aff21a`, `07407541` | Grammar topic progress, advanced drills, extended conjugation data |
| `8d2fd01d`, `971eb40a` | Prioritize user library; correct parent/child grammar route rendering |
| `7c5e15a4`, `67f0afea`, `9b0d95e8` | Existing KU/DE/EN/TR dictionary integration and multi-gloss presentation |
| `dc4586dc`, `9e200f23`, `ee727147` | Structured writing tags, task bank and free Write mode |
| `2c6b110e` | Removed per-user AI quota; shared pool remains |
| `29fdd21b`, `b792436b` | Weak practice routes by dominant miss type, then walks all weak candidates |

History also records reversed experiments: single-row Term textarea `a3db195d` reverted by `09ce2513`; Test focus-time readonly trick reverted by `abe40227`; motion branch reverted then reapplied (`9783ac63`, `11db11c6`). Do not reintroduce an old experiment as a new fix without reviewing its failure history. Temporary dictionary diagnostic logging was added then removed (`210ef66c`/`40e8ac05`).

Migration tools for share IDs/examples/progress are present and default to dry-run; even dry-runs query live records, so none ran. Whether previously applied cannot be determined from source. The progress migration's comment still says Card.mastery is authoritative, which conflicts with today's scheduler-derived progress model.

## 22. Current Git State

Initial and final branch: main. HEAD and fetched origin/main: `2f3e680e438626e7759162c79f1afeafad229d16`. Ahead=0, behind=0. Initial tracked unstaged/staged diffs empty. Fetch succeeded and discovered origin/claude/kurdish-turkish-enrichment-research-0ngxns and origin/karta-phase4-ku; neither appeared in `--no-merged origin/main`. No pull was required. Existing untracked work made a future automatic pull conditional under this audit's strict rule.

Initial untracked file inventory (10 files; .codegraph also contains ignored/generated state):

- `.agents/skills/animate/RECIPES.md`
- `.agents/skills/animate/SKILL.md`
- `.agents/skills/emil-design-eng/SKILL.md`
- `.agents/skills/mobile-native/SKILL.md`
- `.agents/skills/review-animations/SKILL.md`
- `.agents/skills/review-animations/STANDARDS.md`
- `.codegraph/.gitignore`
- `.env.local`
- `.firebaserc`
- `.vercelignore`

Final status adds only untracked CODEX_HANDOFF.md. The above local files were preserved. `.env` is gitignored; `.env.local` is currently untracked and not protected by an explicit .env.local/.env.* ignore rule. Never stage it blindly. Secret contents were not examined.

Remote branches still not merged into origin/main: origin/visual-urgent-fixes (9ad470ea and 4fd14617), origin/debug-hooks-violation (64c75edc), origin/claude/ecstatic-curie-ppv5j3 (6546b15b). Main contains analogous hook/order, feedback and ignore fixes in its history; unique SHAs do not establish unique desired features. Compare patches before any integration. Many older local feature branches remain; local main has no local-only or remote-only commits relative to origin/main. No branch was changed.

## 23. Original audit debt (historical; see current hardening update)

### CRITICAL

- Local TanStack installation predates the repository's security fix; security commit ebe1f938 records the affected transport vulnerability and aligned upgrade. Running this stale installation is not equivalent to running audited lockfile source. Install alignment is the first follow-up; no claim about live production exposure is made.
- Account deletion is incomplete for the current model: `deleteUserAccount()` removes owned study_sets and recursively users/{uid}, but does not delete top-level user_streaks/{uid}, grammarProgress/{uid} or lesenProgress/{uid}. New grammar/reading data therefore outlives the described delete-all path. Verify retention requirements and implement comprehensive deletion in a separate authorized task.

### MEDIUM

- Local build blocked by missing dnd-kit; five historical type errors plus the Node path-alias test failure remain. Current script baseline contains 13 failures. Production success cannot be concluded from this checkout.
- Paste saving/completion race: active ID arrives asynchronously; progress can be skipped or content history can fail while the exercise still works. Feedback/progress writes are often best-effort with swallowed errors.
- Grammar/Paste/Lesen progress uses read-modify-merge writes without transactions, risking lost updates across tabs/devices. The synthetic rolling accuracy bit order biases trimmed windows; validators do not enforce correctInRound<=totalInRound, so invalid input can reach negative-array construction.
- `recordReview` verifies set access but does not establish that submitted cardId is in the set before scheduling. Several core create/update validators are pass-through typed inputs rather than full runtime schemas. This is source-observed validation debt, not a demonstrated cross-user exploit.
- Cross-set card move is sequential and re-identifies cards; failures can leave a partially transferred state and progress intentionally does not follow the move. Duplicate-term edit matching is ambiguous.
- Source docs materially disagree on card identity, persistence locations, Grammar Paste durability, Grammar Hub scope and current focus. Treat this handoff as a dated snapshot, not an excuse to stop reading source.
- Explicit test lists omit Kurdish/drill tests; tests encode older normalized-ID and framework transport assumptions. Important reading/touch/history behavior has no executed browser verification in this audit.

### LOW

- Large bundled datasets can grow parse/cold-start/bundle costs. Lazy server indexes help; measure before relocating them. The compiler's node:crypto externalization warning deserves follow-up boundary inspection.
- Root SQL schema is active while template tests expect auth off/outside root; generic platform tests and Karta customization need intentional separation.
- Local daily statistics and UTC streaks differ; product expectations may need clarification rather than silently changing date semantics.
- Existing full-list history/public-set reads have no inspected pagination. This is a scaling consideration, not a measured outage.
- Script migration comments include obsolete mastery claims; no live migration completion evidence exists. The hard-coded Linux startup path is incompatible with direct macOS execution.

## 24. Security & Privacy Boundaries

Firestore Admin bypasses security rules; authorization must remain in server middleware and each handler's owner/public checks. Deny-all browser rules are defense in depth, not proof that an Admin handler is safe. Firebase JS dependency presence does not prove Firebase Auth/client Firestore usage; inspected access points use Admin dynamically on the server.

Secrets belong in server environment and server-only modules. Do not print .env, copy credentials into handoff docs, use VITE_ for private keys or expose Admin imports through shared components. Public/shared set content has owner IDs and copy provenance by design; individual progress remains user-scoped.

AI feedback sends learner-authored text to the configured external model and stores text/feedback in a private user log. Paste generation happens in the user's own AI chat. Cache responses are shared across users and must not acquire private user-specific context without redesigning cache scope.

No penetration testing, production APIs, Firebase console, Vercel dashboard, Neon queries or real user records were accessed. Remote deployment/rules/migrations/security posture remain unverified. E2E config has strong mocks/credential seals, but a normal local dev server is not automatically production-isolated.

## 25. DO NOT BREAK

1. Preserve actual stored card IDs across compatible edits; progress is keyed by ID. Normalized term is a matching aid, not today's universal ID generator. Rewriting IDs or adopting the stale CLAUDE invariant would disconnect learning history.
2. Resolve share links to document IDs before writes. Share IDs are a read/link contract; confusing them creates missing-set/progress failures.
3. Keep private-set ownership and isPublic checks at server boundaries. A public set may be read/studied but not edited by a visitor; public copying makes a separate private set.
4. Preserve Card fields through replace/copy/transfer policy: example, examples, definition2, enrichment/noPlural/sourceNote, note, status, images and bookmarks. Undefined versus explicit null distinguishes keep from clear; copies intentionally reset user flags.
5. Keep German automatic grammar augmentation behind resolved de/profile gates, while preserving user corrections/provenance. Applying it to KU/TR/EN corrupts semantics; recomputing source=user overrides erases deliberate corrections.
6. Keep dictionary ambiguity refusal and verb/noun collision safeguards. Returning a wrong sense/article is worse than an unavailable suggestion.
7. Keep canonical language-code fallback for older sets. Assuming every document has defLangCode/termLangCode hides legacy content or changes grading/TTS.
8. Keep scheduler state authoritative and mastery presentation-only. Queue, XP, grammar accuracy and raw misses must not become independent due-date engines.
9. Preserve again-only failure semantics and Articles/Cases asymmetry: misses affect memory, hits do not graduate vocabulary. Their dedicated counters and grammar round summaries are separate signals.
10. Keep new/due/overdue definitions consistent across Home, badges and sessions. Overdue is included in due; new means never reviewed. Session cap/pass must not change backlog counts.
11. Freeze an active round's deck/session/question options. Live persistence updates must not reshuffle a question after selection; prior Cases and Lesen fixes depend on it.
12. Keep server transactions' reads before writes, append-only review events and local-day unique counting. Reordering or using raw attempt counts changes statistics and XP.
13. Keep profile/set completion payout idempotence and first-review-day XP. Otherwise repeated practice can manufacture awards.
14. Preserve distinct grammarProgress, bundled lesenProgress, grammarPasteTopics and lesenPasteTopics. AI free topics must not inflate verified/bundled curriculum completion.
15. Preserve one-per-round grammar/reading write patterns; do not add per-question Firestore writes casually. Bundled Lesen intentionally writes two different concerns on completion.
16. Keep typed strict import contracts and AI labels. Schema acceptance does not verify generated language correctness; raw JSON must not become set description.
17. Preserve Lesen option shuffling with correct-index remapping, final done state, person option reuse and internal back navigation. These are implemented fixes, not TODOs.
18. Preserve inline touchAction=none, sensor tolerance, pointer-first collision and tap placement fallback. Global CSS layering previously broke real-phone dragging despite desktop tests.
19. Keep `.server.ts` boundaries, auth lazy loading and Nitro firebase-admin traceDeps. Breaking them can ship Node dependencies to browsers or omit Admin runtime packages.
20. Keep Better Auth identity authoritative, fetch-metadata guard, trusted origins and __Host cookies. Do not trust caller IDs or substitute Firebase Auth assumptions.
21. Preserve env-wrapper precedence and never run build/migration helpers blindly against production credentials. npm run build has a SQL write side effect.
22. Keep AI actions explicit, cached where appropriate and globally budgeted; no automatic Gemini call on blur/panel opening. Vendor quota assumptions require independent verification before changing limits.
23. Keep dataset attribution/provenance and procedural regeneration boundaries. Morphology generation is not authority for verb-case government.
24. Keep mobile safe-area/nav/toast clearance, keyboard behavior and reduced-motion hooks. AppShell/StudySessionShell and shared rule rendering are reusable architecture, not duplication to remove blindly.
25. Do not deploy, migrate, stage .env.local, or merge old branches based solely on this handoff. Check current Git, installed dependencies, real source and fresh authorization first.

## 26. Product / UX Conventions

The UI uses shared app/study shells, theme tokens, Figtree/Geist/Fraunces typography, responsive navigation, safe-area spacing, mobile toast clearance and reduced-motion CSS. Pull-to-refresh is already present for relevant library/set surfaces in history. Card editor has German diacritic tools and intentional autofill mitigation; reverted readonly/textarea experiments should not be casually restored.

CEFR communicates level and category ordering rather than gating ownership/availability. Grammar drills share reveal/Continue/score conventions and accessible rule content. Reading has level-first navigation and passage completion visibility. Touch placement has a non-drag fallback. Learning direction reorders library sets, does not hide other sets.

AI content carries explicit badges; offline dictionary suggestions are distinguishable from optional AI generation. Example/definition candidates require user choice. Vocabulary mastery, grammar accuracy, reading completion and free writing feedback are distinct visible product metrics.

## 27. Implemented vs Partial vs Planned vs Abandoned

| Status | Evidence-based scope |
| --- | --- |
| IMPLEMENTED | Core set/card CRUD/sharing/copy/transfer; custom scheduling/mastery/Today/XP; Articles/Cases/Cloze/Satzbau/Conjugation; Grammar Hub/advanced drills and rules browser; Grammar Paste history; A1–B2 Lesen/touch boards/completion; Lesen Paste history/result screen; Write Words/Task/tags/log; KU↔TR/DE/EN lookup; Organize entry |
| PARTIALLY IMPLEMENTED / LIMITED | Storage server helper exists but UI disabled; account deletion misses top-level progress; feedback/history persistence best-effort; old card IDs/fields coexist; local dependency alignment incomplete |
| PLANNED / NOT ESTABLISHED | Upstream/fitted FSRS replacement suggested by interface comments, not shipped; unspecified future features must not be inferred from stale phase notes; actual migration/deployment completion unknown |
| ABANDONED / REVERTED | Term single-row textarea experiment; Test readonly focus trick; temporary lookup diagnostic logging; per-user AI cap removed; initial Lesen placeholder superseded by working content |

Server broker/gate helpers remain present although browser sign-in is email/password-focused. Treat that as retained platform support, not evidence of exposed social-login UI.

## 28. Current Development Focus

The latest source/history focus has moved beyond CLAUDE.md's German examples phase: standalone grammar breadth, reading/touch reliability, pasted-content persistence, writing feedback, transport security alignment, folder organization and rule browsing. The most recent commit implements Organize and the 19-rule library. No current unfinished feature mandate can be recovered solely from this history; this task establishes the baseline for the next user request.

Mature architecture includes server-authenticated Firestore learning, pure/tested scheduling and shared study components. Recently implemented areas are Grammar/Lesen Paste, advanced grammar, reading completion/touch and writing tags. Fragility is concentrated in dependency drift, persisted asynchronous flows, schema/ID documentation and untransactional progress merges. Runtime/browser behavior is not newly validated here.

## 29. Recommended Next Steps

### Bugs / regressions

1. In a separately authorized task, align local installation with the committed lockfile and rerun the same baseline. This restores dnd-kit and the security-upgraded TanStack set, and distinguishes install failures from code failures.
2. Extend account deletion to every current user-owned collection, then verify isolated deletion coverage. Existing top-level grammar/reading/streak rows are otherwise retained.
3. Make Paste save state/retry and completion-to-saved-ID linkage reliable. Current optimistic rounds can finish before persistence identity exists.
4. Validate review card membership and cross-field grammar counts server-side; preserve scheduling behavior while tightening transport inputs.

### Technical debt

5. Resolve the five historical type diagnostics and Node alias loader failure; separate Karta-specific test expectations from generic platform defaults. Include omitted Kurdish/drill tests and add meaningful pure-parser/isolated persistence coverage.
6. Make progress increments/completion unions concurrency-safe and reconsider synthetic last-20 scoring. Test simultaneous sessions and round-window boundaries before changing visible metrics.
7. Document/decide rename, duplicate-term and move-progress semantics; make transfers robust to partial failure. Do not automatically migrate IDs.
8. Replace stale comments and CLAUDE memory claims using verified source, then measure large dataset/server bundling before optimizing.

### Product improvements

9. Expose unsaved history/progress states and retry affordances; existing toasts and swallowed failures can make successful practice appear lost later.
10. Recheck the preserved reading/touch/back-flow fixes in a hermetic desktop/mobile environment after dependency alignment. A regression suite should cover reused person options, final Continue, stable shuffled answers and real touch-action styles.
11. Clarify UTC streak versus local-day goal semantics and support history pagination as usage grows.

### Larger future work

12. Consider fitted/upstream FSRS only with an explicit compatibility/data adapter and scheduling authorization, not as a cleanup refactor. Expand reading/source languages or storage only after verifying actual user demand, licensing and deployment capabilities.

None of these recommendations was implemented.

## 30. Compact Takeover Checklist

- Read this dated snapshot, then inspect current source and Git; do not replay earlier AI claims.
- Check installed packages against lockfile, particularly the three TanStack packages and dnd-kit.
- Preserve all existing untracked files and credentials; never stage .env.local.
- Read task-specific instructions; AGENTS is generic Linux platform material and CLAUDE contains stale architecture claims.
- Resolve actual card/document IDs and review middleware before modifying study flows.
- Keep four independent grammar/reading/Paste persistence concerns separate.
- Inspect package scripts before running validation: npm run build invokes db:migrate.
- Use isolated mocks/blank credentials for tests; no production-data discovery is needed for schemas.
- Rerun typecheck/script/TS/build baselines and record real errors, rather than claiming a pass from historical comments.
- Check untouched application diff; commit/deploy/migration authorization is separate from taking ownership.
- Revalidate remote Vercel/rules/migration status only when requested; this audit did not inspect them.
- Start new feature work from what already exists, especially rules, Grammar Paste, Lesen/Lesen Paste and Write mode.
