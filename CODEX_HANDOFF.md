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

## 31. Phase 1A curriculum vertical slice — 2026-10-05

Implemented on `codex/karta-phase1a-vertical-slice`, branched from approved architecture HEAD `9271cdc391570dbfee2615f513f53533af64f396`. All six repository-local Karta skills were available and applied. The approved blueprints were preserved; no architecture contradiction or redesign was needed.

### Repository audit and implementation

The actual stack remains React/TanStack Start/Router, TypeScript and existing UI primitives. `/sets/$setId/learn` is vocabulary practice, not a canonical course surface; no `/learn` course existed. AppShell/MobileNav have lazy authentication boundaries. StudySessionShell is layout-only but includes set-oriented back/mute chrome; the new lesson uses a focused layout and reuses Button/Input/Textarea/Progress. Grammar runners contain sampling/service/progress behavior and were not mounted in the curriculum flow. Existing server-side Firestore learning progress and FSRS remain untouched. Tests use the repository's Node TypeScript loader and hermetic Playwright harness. Normal `npm run build` runs `db:migrate`, so it was not used.

The new pure contracts cover releases, skills, units, lessons, hard prerequisite IDs, stages and four small response kinds. The static fixture preserves all 100 approved skill IDs and hard prerequisites, all 10 units and all 40 lesson IDs/focus. Soft/related edges are not implemented in Phase 1A. They remain advisory blueprint metadata, not silent runtime unlock requirements. Only U01.L01 has content; the remaining 39 lessons have empty steps and explicit `not-authored` availability.

The pure validator returns deterministic readable errors for duplicate/empty/cross-entity canonical IDs, unresolved prerequisites/lesson/step/unit references, self-dependencies, hard cycles, invalid/duplicate/orphan unit membership and malformed actionable content/answer metadata. It performs no I/O or writes. Tests compare the checked-in fixture with the blueprint's exact registry and lesson tables; the app does not parse Markdown at runtime.

### Lesson and UI behavior

`DE.A1.U01.L01`, “Meet and identify: introduce yourself”, introduces G01/G02/G13/V01/W01 in deliberately limited scope. Seven original stages:

1. Discover: Mira introduces herself with `Ich bin Mira.`
2. Understand: `ich bin`, informal singular `du bist`, singular `sie/er ist`, simple person–verb–name order; no exhaustive pronoun/sein paradigm.
3. Recognize: choose Nora's first-person introduction.
4. Recall: supply `bin` for Emil's introduction without choices.
5. Produce: construct `Ich bin Leo.` from a specified intent.
6. Apply: write an original introduction using a chosen/fictional name; explicitly unassessed.
7. Check: supply `bist` while addressing Lina; a formative lesson check only.

Exact bounded answers tolerate case, surrounding/extra whitespace and terminal punctuation; this does not assess orthographic mastery. Original text is length-bounded/nonempty but its meaning and writing quality are not judged. Incorrect responses offer nearby explanation and retry; no automatic advance. Successful checks require explicit Continue; completion offers Return to Learn and restart. Controls stay disabled until hydration so native form submission cannot reload and discard the session. Input labels, radio semantics, keyboard submission, live feedback, focus movement, safe spacing and progress naming are explicit.

Learn shows German A1, the ten-unit structure and four U01 lesson titles; only the first is actionable. Later lessons and unknown URLs return honest unavailable/not-found states. One desktop header link and one mobile Learn entry were added; no Home redesign, route removal or global navigation migration occurred. Existing color/type/spacing tokens support Quiet Editorial without recoloring legacy pages. Screenshot polish replaced the native bright-green progress bar with the existing primitive, added its optional accessible label, removed a duplicate mobile header Learn entry and split the explanation into short paragraphs.

### Progress, governance and deferred work

Learn owns React context state per mounted route tree: pinned release/lesson IDs, current step, completed steps, responses, attempt counts, outcomes and finished state. It survives Learn↔lesson client navigation, resets on reload/leaving Learn, and never enters a module-global learner store, localStorage, database or legacy study store. Lesson finished is not skill mastered, text-path complete or full A1. There is no evidence projection, legacy backfill, SRS rating, AI call or scheduler write.

The release is labelled unpublished/prototype, with original Karta provenance. `prototype-review` records this internal prototype review, not qualified educator/publication approval. Expert editorial/linguistic review and accepted release assessment/writing policy remain required before canonical publication. English support is a minimal placeholder; full source-language overlays, durable resume, U01.L02+, published curriculum, Progress, mixed review, formal assessments, exam adapters and listening/speaking remain deferred. No migrations/collections/dependencies/authentication/production configuration were added or changed. No migration command, production data mutation, merge, push or deployment was performed. Existing blank-credential local dev/test infrastructure retains its normal in-memory PGLite schema bootstrap; that is not a production migration or new curriculum persistence.

### Validation and visual review

- Eight focused curriculum/session tests passed. The relevant broader set (curriculum, FSRS scheduler, review plan, grammar drills and foundation hardening) passed all 74 tests.
- `npm run typecheck` passed.
- `npm run build:compile` passed with production credentials blanked and migration/deploy commands excluded. Existing browser-externalized `node:crypto`/large-bundle warnings were not changed.
- Development Playwright Learn + existing Home recommendations: 48 tests passed on desktop/mobile. Final narrow mobile Learn rerun also passed all three tests (390px flow, 320px dark layout).
- Production-compiled local preview: all six Learn tests passed on desktop/mobile. The keyboard test explicitly waits for controls to become ready after route return.
- End-to-end tests cover wrong/correct answers, blank gating, keyboard Check, original/unassessed response, long input, retained draft/current step, completion, restart/reload reset, unavailable IDs, dark mode and no horizontal overflow. The complete Learn flow asserted zero learning server-function calls and zero POST/PUT/PATCH/DELETE requests.
- Actual Learn/Lesson desktop/mobile light/dark screenshots were inspected before and after the second polish pass, including input and writing-feedback states. Hierarchy, readable width, wrapping, touch controls and narrow-screen overflow were checked. Desktop emulation does not prove behavior on a physical mobile keyboard.
- Targeted ESLint: zero errors, one React Fast Refresh warning for colocating the session provider and hook. Existing dev warmup import-protection warnings from untouched `streak.ts` and expected blank-backend errors remain outside this slice; the tested Learn flow had no uncaught runtime errors.
- Linux-specific `/workspace` smoke/startup helpers were not rewritten for this macOS checkout. Existing hermetic dev/compiled Playwright configurations provided actual rendered and interaction verification. The agent-browser CLI was unavailable; Playwright and the Codex browser were used. Screenshots remain ignored local artifacts under `screenshots/`.

### Exact file changes

Created:
- `src/lib/curriculum/types.ts`
- `src/lib/curriculum/validate.ts`
- `src/lib/curriculum/lesson-session.ts`
- `src/lib/curriculum/curriculum.test.ts`
- `src/content/curriculum/german-a1.ts`
- `src/content/curriculum/german-a1-lesson.ts`
- `src/components/learn/session-context.tsx`
- `src/components/learn/lesson-screen.tsx`
- `src/routes/learn.tsx`
- `src/routes/learn.index.tsx`
- `src/routes/learn.$lessonId.tsx`
- `e2e/learn-prototype.spec.ts`

Changed:
- `src/components/app-shell.tsx` — additive desktop Learn link
- `src/components/mobile-nav.tsx` — additive mobile Learn link
- `src/components/ui/progress.tsx` — optional accessible label, unchanged existing defaults
- `src/routeTree.gen.ts` — generated Learn route registration/types
- `CODEX_HANDOFF.md` — this implementation record

## 32. Karta Phase 1B — Unit 1 and a second authored lesson (2026-10-05)

Base: `codex/karta-phase1a-vertical-slice`, `cb7e2a48e197418b4d385f0645681c581a4fea8a`.
Implementation branch: `codex/karta-phase1b-unit1-engine`. All six repository-local Karta skills were discoverable and consulted. Approved architecture/blueprint documents remain unchanged.

### Audit and justified changes

Phase 1A's pure validation/transition functions and four response kinds were sound. The route-owned provider held only one session, so opening another lesson would discard the first. The lesson screen embedded Lesson 1 numbering, an introduction subtitle and first-lesson completion copy; response controls were embedded in that screen. These became generic only where the second lesson required it. Existing Button/Input/Textarea/Progress and design tokens were reused. No plugin framework, factory, backend interface or new provider was added.

- `src/lib/curriculum/types.ts`: adds `classify`/`read` stages, optional case-sensitive bounded text and a learner-facing description separate from the approved outcome.
- `src/lib/curriculum/lesson-session.ts`: retains pure traversal/retries; adds release-qualified per-lesson map updates, isolated restart, truthful status and next authored lesson lookup. Original writing remains unassessed. Capitalization checking is opt-in; L01 answer behavior is unchanged.
- `src/components/learn/session-context.tsx`: the existing Learn-owned React provider stores multiple sessions. Entering a lesson initializes its own entry; responses, attempts, step index and completion remain isolated. Reload or leaving the Learn route tree resets everything. No browser storage or server calls.
- `src/components/learn/exercise-response.tsx` (new): shared native choice and bounded text/open-writing controls. Classification is a single-choice task; reading, recall and phrase construction are bounded text tasks. Definitions and validation remain outside presentation.
- `src/components/learn/lesson-screen.tsx`: generic unit/lesson numbering, content description, completion and next action; return to Unit and restart one lesson; keeps hydration-safe submission, retry guards and heading focus.
- `src/content/curriculum/german-a1-entities.ts` (new): original L02 authored content.
- `src/content/curriculum/german-a1.ts`: authors L02 and versions the prototype release to `DE.A1.CURRICULUM.PROTOTYPE.1B` / `1.0.0-prototype.2`; all 100 skills, hard prerequisite edges, 40 lesson IDs and approved focus/outcome metadata remain intact.
- `src/content/curriculum/german-a1-lesson.ts`: only concise learner wording/paragraph spacing; L01 progression and scoring unchanged.
- `src/routes/learn.units.$unitId.tsx` (new): Unit title/outcome and four rows; L01/L02 available/in progress/finished in this session; L03/L04 not authored. No mastery percentage, fake locks or unit completion claim.
- `src/routes/learn.index.tsx`: retains 10 units/40 lessons and hides the internal skill taxonomy; Unit 1 opens the Unit view, two lessons are available, and the next unfinished authored lesson is the course action.
- `src/routes/learn.$lessonId.tsx`: generic release prop and truthful two-lesson availability copy.
- `src/routeTree.gen.ts`: generated Unit route registration; existing vocabulary Learn route unchanged.
- `src/lib/curriculum/curriculum.test.ts`: updates only authored-availability expectations and preserves registry/graph/L01 tests.
- `src/lib/curriculum/phase1b.test.ts` (new): exact L02 metadata/stages, deterministic category/entity/capitalization checks, bounded phrases, isolated retries/completion/restart, release isolation/reset and no mastery/unit completion.
- `e2e/learn-prototype.spec.ts`: retains L01 end-to-end coverage and checks/clicks the L02 next action; unavailable case moves to L03.
- `e2e/learn-unit1.spec.ts` (new): L02 end-to-end, two session isolation, restart, keyboard Check/Continue, focus, zero new Learn server calls/write requests, mobile targets/overflow, dark 320px, and existing vocabulary question/grading/next flow with its existing session bookkeeping explicitly mocked.
- `CODEX_HANDOFF.md`: this Phase 1B record only.

### L02 content and progression

`DE.A1.U01.L02`, “Name people and things”, retains exactly G08/G09/G10/G12/V02/W02/R01 and the approved outcome. Eight stages: Discover → Understand → Recognize → Classify → Recall → Read → Produce → Check. Four controlled workplace labels: der Mann, die Frau, das Büro, das Telefon. Learners recognize das Telefon, classify Büro as a place, recall eine Frau, retrieve Nora from “Die Frau ist Nora”, write ein Büro with capital/umlaut, and identify Die Frau as the subject. Articles are taught as lexical gender information and simple nominative phrases, without broader paradigms/case theory. All examples are original Karta content; no external assets, copyrighted exam questions or AI grading.

L01 completion offers L02 directly. L02 completion says the next lesson is not authored and the unit is still in progress. Completed guided practice never creates independent evidence or mastery. L01 open writing stays explicitly unassessed.

### Visual review and accessibility

Actual browser screenshots were inspected for overview desktop/mobile, Unit desktop/mobile, L01 desktop, L02 desktop/mobile, dark Unit/lesson and 320px narrow layouts. Files are ignored local artifacts under `screenshots/phase1b-*.png`, with the existing `lesson-writing-*.png` feedback captures retained.

First review found L02 explanation density and metadata-like subtitles particularly awkward on narrow phones. The second polish pass added concise authored learner descriptions while preserving outcome metadata, shortened the explanation into three compact lines/paragraphs, reduced L01 double paragraph gaps and completion action spacing, and retained quieter feedback boxes and clear primary/secondary hierarchy. Repeated prototype footers were removed from individual steps; overview/Unit/completion communicate session limits, and open-writing feedback says “Saved for this practice session. This writing is unassessed.” Final accessibility review removed a nested main landmark and allowed the next-lesson action to wrap on narrow screens. Final screenshots confirm readable text/controls and no horizontal overflow. Native labels/radios/forms, visible focus styles, announced feedback, focus after step change, keyboard Enter for Check and Continue, disabled guards and >=44px lesson targets were exercised. Mobile checks use 390px and 320px browser emulation; a physical software keyboard/screen-reader session was not tested.

### Validation and safety

- `node --import ./scripts/test-register.mjs --test src/lib/curriculum/curriculum.test.ts src/lib/curriculum/phase1b.test.ts`: **12 passed, 0 failed**.
- Relevant broader suite (`src/lib/srs/scheduler.test.ts`, `src/lib/review-plan.test.ts`, `src/lib/foundation-hardening.test.ts`, `src/lib/grammar-drills.test.ts`): **66 passed, 0 failed**.
- `npm run typecheck`: passed.
- Scoped ESLint across curriculum/content/Learn routes/components: **0 errors**, one existing provider/hook Fast Refresh warning.
- `git diff --check`: passed.
- `npm run build:compile`: passed; normal `build` still invokes migration, so it was deliberately not used. The compile-only wrapper blanks backend/AI credentials.
- `npx playwright test e2e/learn-prototype.spec.ts e2e/learn-unit1.spec.ts`: **12 passed** (desktop/mobile).
- `npx playwright test --config e2e/home-compiled.config.ts e2e/learn-prototype.spec.ts e2e/learn-unit1.spec.ts`: **12 passed**. After the final landmark/wrapping-action adjustments, `--grep 'bounded lesson|two lessons|dark 320'` compiled recheck: **6 passed, 0 failed**.
- Initial legacy test failures were test assumptions/fixture gaps: the route starts directly with a question, and grading invokes existing `updateSetSession`. The regression test now exercises the real unchanged flow with that call explicitly mocked. The new Learn tests still assert no server-function calls and no POST/PUT/PATCH/DELETE requests. Fixtures also reject unexpected server calls/API requests and uncaught page errors.
- Existing dev warmup emits credential-denied backend diagnostics and the pre-existing `streak.ts` import-protection warning. Those do not represent new Learn writes; backend credentials are blank and actual test requests are sealed/mocked. The local dev adapter may bootstrap its existing in-memory PGLite schema; no migration command, new schema or production migration was run.

FSRS scheduler/queue, vocabulary progress, old grammar scoring, existing practice routes, authentication, dependencies, production configuration and persistence code are unchanged. No durable state, evidence backend, production migration/Firestore collection, new service, deployment, merge or push. Unrelated pre-existing untracked files were preserved and excluded from the commit.

Remaining scope: only L01/L02 authored; L03 onward, assessment/checkpoints, mixed review, mastery/evidence, durable progress, source-language overlays, audio/speaking/listening and publication expert review remain deferred. This is an unpublished prototype, not a proficiency or exam-readiness assessment.


## 33. Karta Phase 1C — durable course progress and resume (2026-10-05)

Base: approved/pushed `codex/karta-phase1b-unit1-engine`, `56597b598bdb4a833ca0c7fc5eb0f20f84135960`. Work branch: `codex/karta-phase1c-durable-progress`. All six repository-local Karta skills were discoverable and read before substantive work. Approved architecture/content remains unchanged; only L01/L02 are supported. This section supersedes the Phase 1B session-only limitations for those lessons.

### Source audit and storage decision

The audit verified current source, not just this handoff: `study-sets.ts`, `learning-progress.server.ts`, `grammar-paste-topics.ts`, `lesen-paste-topics.ts`, `write-it-feedback.ts`, authentication middleware/verification, user-data inventory/deletion, existing lesson/session routes and the wire-level browser mocking infrastructure.

- `users/{uid}` holds legacy preferences/profile/XP/session/cache fields. Vocabulary `cardProgress`, `reviewEvents` and daily statistics are separate user subcollections; review transactions and membership/owner checks must remain authoritative for FSRS.
- `grammarProgress/{uid}` and `lesenProgress/{uid}` are separate legacy document roots. Grammar round aggregation and Lesen completion merging retain their existing transactional semantics.
- `users/{uid}/grammarPasteTopics` and `lesenPasteTopics` contain authored imported-topic progress; their round receipts bind IDs to payloads and guard retries. They are not course persistence.
- `users/{uid}/aiFeedbackLog` stores optional writing-feedback records. Learn open writing does not use that log.
- Existing authenticated server functions derive `context.userId` from verified sessions and reject cross-site requests. The auth-off middleware has a shared preview fallback: new Learn handlers additionally reject `VITE_AUTH_ENABLED=false`, before initializing Firestore. A Learn-only gate was added to the existing lazy authentication module, preserving all prior gates/verifier behavior; this avoids the known Nitro SSR chunk cycle.
- Existing profile reads and legacy Today cache behavior were inspected; the new course read does not reuse cache paths with hidden writes.
- Central deletion recursively deletes `users/{uid}` plus the separate legacy roots. Recursive deletion covers descendants even without a parent document. Adding `courseProgress` to the subcollection inventory is sufficient; a hermetic test executes the existing deletion helper against newly written Learn records and preserves another owner's records.

Chosen model: **one user subcollection, one bounded document per scoped lesson**. It reuses the existing authenticated Firestore/server-function transaction pattern, avoids a second database or a growing account-wide document, and limits concurrency contention to one lesson.

Exact path:

`users/{verifiedUid}/courseProgress/{encodeURIComponent(JSON.stringify([trackId, releaseId, lessonId]))}`

The tuple is collision-free and independent of labels. Owner identity exists in the authoritative path, never in browser input. The strict input schema rejects client owner IDs and extra fields. This is additive: absent documents are valid, and no migration or live collection initialization is needed.

### Durable contract and classification

Version 2 prototype document fields:

- `schemaVersion: 2`, `trackId`, `releaseId`, `lessonId`, `resumeContractVersion` (explicit positive integer), `definitionHash` (SHA-256 of the full authored lesson definition at the last accepted checkpoint).
- `revision`, `practiceRun`, `currentStepId: string | null`, ordered `completedStepIds` (validated contiguous prefix).
- `response: string | null` (at most 160 characters; current checked bounded response only), `checked`, `attempts` (current step only).
- `firstFinishedAt: number | null`, `updatedAt: number` (server epoch milliseconds).
- `receipts: [{id: UUID, digest: SHA-256}]` (last 64 commands, no raw answer history).

Durable truth: scope/version, ordered acknowledged traversal, current checked bounded answer, current-step retry count, revision/run, first completion milestone, server update time and bounded replay receipts.

Derived: row status, current step index, completion percentage, deterministic feedback/results and display labels. They come from durable truth plus current local work and the current compatible lesson definition, never copied into storage. Merely opening an untouched lesson can mark it in progress in route memory; no document is created until acknowledgement. Historical completion is independent of the current repeat-practice run.

Session only: unchecked drafts, open/original writing, immediate answer feedback before acknowledgement, focus/button/loading/error state and pending command. Responses are retained locally on save failure/conflict. No keystroke writes or browser-local persistence.

Future: track enrollment/publication, source-language overlays, compatible archived content/replacement mappings, skill evidence, mastery, assessment/checkpoint records, unit completion, AI grading and audio. Future independent evidence must have its own validated contract; these traversal receipts must not be repurposed as proficiency evidence. The scoped/versioned adapter and pure domain functions provide an additive extension boundary. Browser resume helpers live separately from runtime validation; server functions load lazily.

### Track/release and resume

Temporary practice track: `de-a1-text-practice-v1`. Release: `DE.A1.CURRICULUM.PROTOTYPE.1B`. This is explicit unpublished target-course practice, not enrollment in a published curriculum. Current source-language preferences do not define its identity. A future published/directional learning track needs an explicit mapping policy; do not silently reinterpret this practice key or split it per overlay.

Entering Learn authenticates the learner and reads exactly the two known authored lesson references. Strict Mode effect replay shares the same pending request. Missing rows remain missing until acknowledgement; entering a lesson, rendering rows and typing perform no writes. Reload or leaving/re-entering Learn reconstructs the current pinned step, checked bounded answer, retry count and completion from server truth. L01/L02 remain independent.

Finished lessons open in the finished view. Intentional restart creates a new current practice run and resets its traversal/answer while retaining `firstFinishedAt`. Unit rows retain Finished and show Practicing again for an active repeat. Completion is guided-practice traversal, never mastery or complete A1 proficiency.

A different `resumeContractVersion` blocks saved-answer restoration/grading and writes; it preserves the old document and shows an unavailable lesson. A different `definitionHash` alone does not block resume. L01/L02 explicitly declare compatibility version 1. Authors must bump it when persisted step IDs/order become incompatible, task meaning or grading materially changes, or required response contracts change (including relevant grading-algorithm changes). Keep it stable for titles, descriptions, explanations, punctuation, spacing/layout and feedback wording that does not change grading. This is an explicit author/reviewer responsibility, not automatic semantic inference from a hash. Schema-1 prototype records remain unavailable and untouched; no migration or replacement occurs. Unknown scopes/lessons and unauthored lessons are rejected. There is no compatible archive or replacement mapping yet, so the UI does not invent one or silently migrate answers. Withdrawn/unauthored route content stays unavailable.

### Writes, concurrency and cost

Each explicit Check, Continue/Finish or Restart submits one UUID command with the authored compatibility version and expected revision. One owner-scoped Firestore transaction reads one progress document, validates the stored contract and applies a pure transition. An accepted new command writes that one document. Reads, duplicate acknowledgements, conflicts and unavailable versions write nothing. Definition hashes are diagnostic integrity fingerprints, excluded from command payloads/receipt digests. Copy edits therefore preserve exact retry identity. A new accepted checkpoint records the current definition hash in the existing write; reads expose the current hash without refreshing stored records or revisions.

Identical retries reuse their original UUID, payload and revision. The receipt digest rejects UUID reuse with another payload. A duplicate returns current server truth without replaying the transition, including when newer commands already exist. A duplicate acknowledgement returning a newer revision is shown as a conflict in the UI, keeping the local answer until explicit recovery. Compare-and-update rejects stale tabs/restarts; transactional retries admit one competing revision, returning a conflict for the other. Step order/prefix validation prevents skipping and out-of-order traversal. First completion and update times never regress. The last-64 receipt window is bounded; an evicted delayed retry conflicts on its stale revision rather than replaying.

Correct first-pass traversal costs 12 accepted commands for L01 and 14 for L02 (Check plus Continue for answer steps, Continue for explanation steps). Wrong-answer retries and explicit restarts each add one accepted command. A new Learn route mount reads two documents, with no query/index or profile/FSRS/cache reads needed. Current route memory avoids additional reads while moving between Learn/Unit/lesson. Transaction retries can add reads; no listeners, polling, per-keystroke writes or new composite indexes.

### Failure UX, privacy and deletion

Initial load failure gates lesson interaction and offers Retry loading. Check feedback is local immediately, while Progress saved, traversal, completion and restart wait for server acknowledgement. Save failure keeps the answer and pending command and offers Retry saving with the same operation ID. Lost acknowledgement is therefore recoverable without counting another attempt. Conflict keeps the local answer until explicit Load saved progress replaces it. Version-unavailable saves preserve the answer locally and block further progression.

Leaving Learn with an unsaved/failed/pending answer requires an explicit Stay in Learn or Leave without saving choice; hard reload/close uses the browser's before-unload warning. Within Learn the provider retains local answers. Account changes remount the provider by verified user ID; pending responses from an unmounted owner are ignored. This is not an offline queue: forcibly closing/confirming discard loses unacknowledged local work.

Open/original text is never sent or stored. Only its unassessed step acknowledgement is durable; after reload the saved marker can continue without restoring sensitive writing. Bounded checked text is retained only for the current resumable step, then cleared on Continue, completion or restart. No previous answers, full keystroke history, question/title copies, AI feedback, analytics or mastery are stored. Hash receipts contain no raw text, but bounded-answer hashes are not an anonymization claim. Completion/receipts remain until account deletion; no automatic lifetime-history or draft retention service was added.

The centralized recursive users-root deletion includes all track/release lesson documents. Inventory and hermetic deletion coverage were extended in the same change; there is no new orphan root.

### Visual review and validation

Actual screenshots were inspected for persisted overview, Unit 1 (L01 Finished/L02 In progress), resumed L02, save failure and stale-tab conflict, including desktop, 390px mobile and dark 320px layouts. Local ignored artifacts: `screenshots/phase1c/`. The second polish shortened recovery messages and kept a quiet saved status, clear retry/load actions, retained answer, disabled Continue until acknowledgement and wrapping actions without horizontal overflow. Existing keyboard/focus/native labels and lesson target sizes are retained. Keyboard tests wait for acknowledgement before pressing Continue. Physical mobile keyboards, screen readers and real Firestore/network devices were not exercised.

Validation results are recorded below. All backend fixtures are hermetic; the fake transaction adapter and wire-level server-function mocks never initialize a production backend. Existing dev warmup can emit credential-denied diagnostics and the pre-existing `streak.ts` import-protection warning. Test server credentials are blank and actual test requests are sealed. The existing dev adapter can bootstrap its in-memory PGLite schema; no new schema, migration command or production migration was run.

FSRS scheduling/queues and vocabulary review semantics, `grammarProgress`, `lesenProgress`, Paste behavior, legacy `/sets/$setId/learn`, Home/Progress, authored curriculum, dependencies and production configuration remain unchanged. New course reads perform no writes. No live user records, production migration, deployment, merge or push. Unrelated pre-existing untracked files are preserved and excluded.


Final checks:

- `node --import ./scripts/test-register.mjs --test src/lib/curriculum/curriculum.test.ts src/lib/curriculum/phase1b.test.ts src/lib/curriculum/course-progress.test.ts`: **25 passed, 0 failed**. Covers strict contracts, owner isolation/auth wiring and auth-off denial, both lesson resumes/completions/restarts, ordering/versions, concurrent revisions, identical receipts and eviction, answer pruning, isolated writes, read purity and existing recursive deletion.
- `node --import ./scripts/test-register.mjs --test src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`: **66 passed, 0 failed**.
- `npm run typecheck`: passed.
- Scoped ESLint across curriculum, fake backend, Learn components/routes, user inventory and auth gates: **0 errors**, one existing colocated-provider/hook Fast Refresh warning.
- `git diff --check`: passed.
- `npm run build:compile`: passed. Normal migration-triggering `build` was not run. Compilation initially exposed the existing Nitro/rolldown SSR chunk fragility; the final Learn-only gate reuses the established lazy authentication module, browser resume helpers stay separate from runtime validation, and new server functions load lazily. No dependencies or production configuration were changed. The compiled browser fixture now discovers the registry across emitted chunks rather than assuming a single entry file.
- `npx playwright test --config e2e/home-compiled.config.ts e2e/learn-durable.spec.ts e2e/learn-prototype.spec.ts e2e/learn-unit1.spec.ts`: **24 passed, 0 failed** (desktop/mobile). Includes signed-out denial, load/save/lost-ack failures, same-command retry, delayed retry after another tab advances, explicit conflict replacement, changed-version blocking, durable route/reload behavior, open-writing network minimization, keyboard/focus/targets/layout and the unchanged legacy vocabulary Learn flow.

The first dev browser pass exposed duplicate Strict Mode loads and an incorrect logo selector. A subsequent keyboard test exposed a test pressing Enter before acknowledgement enabled Continue; the test now waits for that enabled state. A later parallel dev/compiled run reached the 30-second whole-test limit on the long multi-reload scenario (23 other dev tests passed); its limit is now 60 seconds and the final dev recheck runs without a competing compiled server. These are recorded to distinguish corrected fixture/timing issues from the final results.


- Final isolated dev run: `npx playwright test e2e/learn-durable.spec.ts e2e/learn-prototype.spec.ts e2e/learn-unit1.spec.ts`: **24 passed, 0 failed** (desktop/mobile).
- `npm run check:auth -- --dev-url http://127.0.0.1:5199`: passed, dev and build agree (sign-in on). The earlier default-server probe was indeterminate because no server was observable at its default address; the hermetic test-server probe confirms the actual tested configuration.

Remaining limitations: two unpublished lessons only; no offline queue/autosave, compatible archived release or replacement map, automatic TTL, published/directional enrollment mapping, skill evidence/mastery/assessments, overlays, audio or live-backend verification. A deliberately discarded/forcibly closed unsaved answer cannot resume. Authentication must be configured; shared auth-off preview identities are refused. Existing account-deletion transaction/lifecycle semantics are unchanged.


### Phase 1C compatibility hardening (2026-10-05)

Based on `855d13efd50fa477f5e3196c50b5412232ad1b83`, this narrow revision separates authored `resumeContractVersion` from diagnostic `definitionHash`. Only L01/L02 compatibility metadata was added; lesson content, IDs, Firestore paths, release/track identity, revisions, receipts, concurrency/idempotency, completion and privacy rules remain unchanged. Schema-1 unpublished records are preserved as unavailable, without migration. Approved architecture documents are unchanged.

Hardening validation:

- Focused persistence tests: **23 passed**; combined curriculum/Phase 1B/persistence tests: **35 passed**. New coverage proves copy/feedback and explanation edits preserve resume, completion and receipt retries; explicit bumps for IDs/order/task meaning/grading/response changes reject old progress and commands without writes. Existing stale revisions/idempotency, bounded-answer pruning, owner isolation and no legacy/FSRS writes still pass.
- Legacy FSRS/review/foundation/grammar regressions: **66 passed**.
- Typecheck and compile-only `npm run build:compile`: passed. No migration-triggering build was run.
- Compiled desktop/mobile Learn regressions: **24 passed**, including L01/L02 durable reload resume, completion, retries/conflicts and unchanged legacy vocabulary Learn. Resumed desktop/mobile screenshots were inspected.
- Scoped lint: **0 errors**, existing provider/hook Fast Refresh warning only. `git diff --check`: passed.
- No migration, production data access, push, merge or deployment.

## 34. Karta Phase 1D — complete authored Unit 1 (2026-10-06)

Base: approved/pushed `codex/karta-phase1c-durable-progress`, `a98019537f8ca7e54385facd2c21f9690ea2c558`. Work branch: `codex/karta-phase1d-complete-unit1`. All six repository-local Karta skills were discoverable and read. This section supersedes the two-authored-lesson limitation in Phase 1C; approved architecture and blueprint documents are unchanged.

### Audit and exact approved metadata

The audit verified curriculum contracts/graph validation, L01/L02 definitions, response controls, pure session transitions, schema-2 durable progress/resume, compatibility rules, Learn/Unit/finished views and existing domain/browser coverage. The response engine and persistence resolver already support any authored lesson. Two-lesson assumptions existed in overview/finished copy, a read comment and fixtures/assertions, not in transaction/storage architecture. Existing Unit copy could imply the unit remained unfinished after its last available lesson; completion must now depend on all four actual historical milestones, never unauthored placeholders.

Exact blueprint registry preserved:

- `DE.A1.U01.L03`: **Ask for personal details**. Outcome: **Ask a new person's detail and extract number/date**. Introduced G14/G15/G52/V03/R02; consolidated list remains empty. Canonical IDs: `DE.A1.GRAMMAR.QUESTIONS.YES_NO`, `DE.A1.GRAMMAR.QUESTIONS.WH`, `DE.A1.GRAMMAR.QUANTITY.NUMBER_NOUN`, `DE.A1.VOCABULARY.NUMERIC_TIME`, `DE.A1.READING.NUMERIC_DETAILS`. Prerequisites: G14→G13; G15→G14; G52→G09/G10; V03→V01; R02→R01/V03.
- `DE.A1.U01.L04`: **Give basic information**. Outcome: **Supported registration form and simple description**. Introduced G03/G50/V04/W03/R03; consolidated list remains empty. Canonical IDs: `DE.A1.GRAMMAR.VERBS.HABEN_PRESENT`, `DE.A1.GRAMMAR.ADJECTIVES.PREDICATIVE`, `DE.A1.VOCABULARY.NOUN_BUNDLE`, `DE.A1.WRITING.FORM_COMPLETION`, `DE.A1.READING.EXPLICIT_FACT`. Prerequisites: G03→G01; G50→G02/G13; V04→V02; W03→W01/R02; R03→R01/G13. The blueprint expressly permits supported W03 form entry before R11 independent form interpretation.

### Authored content and engine boundaries

`german-a1-details.ts` supplies ten L03 steps: Discover → Understand → Recognize → Recall → Understand (numbers) → Read (number) → Read (date) → Produce (count) → Produce (question) → formative Check. Learners contrast `Bist du…?` with `Wer bist du?`, build bounded questions from supplied words, read fictional registration cards, distinguish date from number and use `ein Telefon / zwei Telefone`. Numbers 1/2/3/12 and explicit day.month support keep lexical/numeric scope controlled. Supplied plurals do not claim general plural instruction. R02 is genuine extraction from visible cards, not translation of the expected answer.

`german-a1-information.ts` supplies eleven L04 steps: Discover → Understand → Recognize → Recall → Read → Produce → Apply (name field) → Apply (date field) → Apply (telephone-count field) → Apply (open writing) → formative Check. Familiar office nouns recur with supplied gender/plural bundles; `ich habe / Nora hat` use bounded telephone phrases, and `Das Büro ist klein/groß` introduces predicative descriptions without adjective declension. A short office note supplies an explicit fact. A fictional registration provides supported fields, one response at a time. The two-sentence original introduction/description is explicitly unassessed, never sent/stored as text; bounded fields are deterministically graded only against their requested supplied details.

All content is original Karta prototype material; no exam-provider items or external datasets were copied. Mira/Nora/Leo, Telefon and Büro recur without requiring later-unit grammar. L01/L02 content, step identity/order, grading and compatibility versions are untouched. No new response/stage types, generic component lesson IDs, grading algorithm or session transition changes were needed. New work uses existing declarative explanation/choice/text/original controls; arbitrary supported sequences already work.

### Persistence, compatibility and derived Unit state

The existing authored registry filter now returns L01–L04. A Learn mount reads four known scoped documents instead of two; no query, initialization or hidden read write was added. Each accepted Check/Continue/Restart still uses the same single-document transaction, expected revision, UUID and bounded receipt digest/window. Correct first-pass L03/L04 traversal uses 17/20 accepted commands respectively; wrong retries/restarts add their existing commands.

Firestore path remains `users/{verifiedUid}/courseProgress/{encodeURIComponent(JSON.stringify([trackId, releaseId, lessonId]))}`. Track remains `de-a1-text-practice-v1`; release remains `DE.A1.CURRICULUM.PROTOTYPE.1B`; prototype publication status is unchanged. Schema 2, revisions, practice runs, first-finished timestamps, receipts, privacy/minimization and auth-off denial are unchanged. No new collection/root, unit-completion record, migration or live backend operation.

L03/L04 declare initial `resumeContractVersion: 1`. L01/L02 retain version 1. Definition hashes remain diagnostics only; copy/feedback/formatting edits retain compatibility. Authors must bump the explicit contract for incompatible step identity/order, task meaning, grading or required responses. This is reviewed metadata, not automatic semantic inference. Schema-1 prototype rows and mismatched contracts remain untouched/unavailable; no conversion was introduced.

`unit-progress.ts` is a pure shared read model used by overview, Unit route and finished view. It counts only authored, available lessons with current finished state or acknowledged historical completion. All four expected lessons must count before **Unit lessons complete**; three finished lessons remain **In progress**. Missing/unauthored/blocked entries cannot complete a unit, and another release's sessions do not count. Restart retains historical completion and can show **Finished · Practicing again** separately. Next lesson is the first unfinished available lesson in registry order; repeat practice does not displace unfinished learning work.

Learn retains all ten units: Unit 1 has four actionable authored rows; Units 2–10 remain not authored, with no fake locks/unlocks. Unit 1 shows finished count and next action; all-four completion clearly says Unit 2 is not yet available. Overview offers Revisit Unit 1, or Continue practice for an active repeat. Finishing L04 alone never falsely completes an unfinished unit. No assessment/score/mastery/proficiency/CEFR/exam-readiness claim or button was added.

### Visual review and second polish

Rendered first and final screenshots cover overview desktop, mixed/all-finished Unit 1 desktop, L03/L04 desktop, both new lessons at 390px, Unit 1 at 390px, dark 320px Unit/reading/form views, durable checked resumes, and final all-lessons-complete/overview state. Ignored local artifacts: `screenshots/phase1d/`. Screenshots were inspected, not inferred from source.

First inspection found repetitive completion wording and a long mobile form explanation. Second pass shortened Unit completion messaging, form support and L04 reading feedback without changing grading/response semantics or compatibility. Practical-target testing exposed the shared New set header link's existing 36px box: the existing `tap-target` utility now expands its invisible hit area to 44px without changing layout or behavior. No global button redesign. Lessons retain semantic forms/radios/labels, visible focus, keyboard Check/Continue, heading focus on step changes, announced feedback, save/recovery controls and disabled-until-ack behavior. Tests wait for enabled acknowledged actions before capturing checked-state screenshots. Narrow/dark views have no horizontal overflow. Physical keyboards/screen readers/real-device/live-backend behavior remain unverified.

### Validation and deferred scope

Final validation results are recorded after the final browser/build checks below. Tests use the real pure/boundary logic with fake document transactions and sealed server-function/auth mocks, with backend credentials disabled. `agent-browser` is unavailable in this local environment; the existing hermetic Playwright suite drives actual browser interactions and captures rendered screenshots. Existing dev warmup may report denied credential/unauthorized diagnostics and the known `streak.ts` import-protection warning; no production backend is accessed.

FSRS scheduler/queue semantics and legacy vocabulary Learn remain unchanged. `grammarProgress`, `lesenProgress`, Paste progress, Home recommendation logic, dependencies and production configuration remain unchanged. No mastery/evidence projection, assessment attempt/unit assessment/checkpoint/placement persistence, AI grading, audio, overlays, Unit 2 content or separately persisted Unit state was introduced. This is four unpublished lessons, not German A1 or CEFR completion. Educator publication review, source-language overlays, remaining units, independent assessments and live-backend verification remain deferred. No offline queue or restoration of discarded unsaved/open writing was added. Unrelated pre-existing untracked files are preserved and excluded. No push, merge or deployment.

Final checks:

- `node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts`: **50 passed, 0 failed**. Includes exact blueprint IDs/titles/outcomes/skills/prerequisites, distinct stage invariants, bounded grading and unassessed writing, all-four checked reload/completion/restart and copy compatibility, isolation, stale/duplicate writes (including a stale restart after Unit completion), schema/version/release guards, no legacy/FSRS writes and derived Unit truth.
- `node --import ./scripts/test-register.mjs --test src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`: **66 passed, 0 failed**.
- `npm run typecheck`: passed. Scoped ESLint: **0 errors**, one existing provider/hook Fast Refresh warning. `git diff --check`: passed.
- `npm run build:compile`: passed. Migration-triggering normal `build` was not run; no migration/deployment command.
- `npx playwright test e2e/learn-phase1d.spec.ts e2e/learn-durable.spec.ts e2e/learn-prototype.spec.ts e2e/learn-unit1.spec.ts`: **32 passed, 0 failed**, desktop/mobile.
- Same four files with `--config e2e/home-compiled.config.ts`: **32 passed, 0 failed**, desktop/mobile, against compile-only output. Browser harness also asserts no uncaught runtime errors or unhandled backend requests. L01/L02 and legacy vocabulary Learn remain covered alongside complete L03/L04 traversal, checked reload/open-writing minimization, all-four completion, active repeat history, signed-out/recovery/conflict/idempotency, unavailable/unknown routes, keyboard/focus, targets and narrow/dark layouts.
- First dev pass: **30 passed, 2 failed**; both failures were the same existing 36px New set header target in the new 320px full-page target audit. Existing hit-area utility correction resolved both. Final dev and compiled passes are clean. Initial optional-lesson narrowing/test-object type errors were fixed before the clean typecheck.

No push, merge, migration or deployment. Tracked work contains only Phase 1D content, derived-state/UX integration, focused tests and this implementation handoff section.

## 35. Karta Phase 1E — Unit 1 Check and evidence foundation (2026-10-06)

Base: approved/pushed `codex/karta-phase1d-complete-unit1`, `a4edc4652c17deeffbf32689d68976b265c9305b`. Work branch: `codex/karta-phase1e-unit1-evidence`. All six repository-local Karta skills were discoverable and applied. Approved architecture/blueprint documents, lesson definitions, course-progress persistence, dependencies, migrations and production configuration are unchanged.

### Audit and scope

Audited the four authored U01 lessons, exact 100-skill registry and validated prerequisite graph; blueprint essential/supporting/diagnostic policy and W03 supported-exposure exception; Phase 1C/1D traversal contracts and historical completion; grammar/Lesen practice scoring and `grammar-assessment.ts`; LearningSignals/evidence bands, auth/Firestore boundaries, result components and recursive account deletion. Existing grammar assessment generates AI advice from practice summaries; it is not assessment evidence and is not reused. LearningSignals' sample-size bands and existing vocabulary mastery are not used by this check.

The blueprint specifies course-level essential functional groups but not an exact essential/supporting classification for each U01 skill. The six groups below are **narrow task observations**, not new canonical skills or independently certified essential gates. G01/G02/G03/G08/G09/G10/G12/G13/G14/G15/G50/G52, lexical scaffolding V01–V04, R01–R03 and W01–W03 are not independently certified. In particular the Name field is supported W03 exposure, not R11 independent form interpretation. No general gender/nominative knowledge, free writing, speaking, whole-unit mastery or A1 proficiency is inferred. Independent introduction/open writing remains unassessed.

### Original item plan and exact mapping

`DE.A1.U01.CHECK.PROTOTYPE.1`, release `DE.A1.CURRICULUM.PROTOTYPE.1B`, track `de-a1-text-practice-v1`, Unit `DE.A1.U01`, compatibility version 1, unpublished prototype. Eight original Karta tasks, pending educator/editorial review. No third-party assessment material. Fresh entities, complete prompts/stimuli and task arrangements differ from the lessons: speaker exchange, paired article recognition, intent-to-question construction, contrasting number messages, date selection across descriptions, two controlled sentences and a supported name field. Shared taught forms/nouns necessarily recur; replacing names alone is not claimed as a new task family.

| Items | Type | Evidence target | Actual elicitation |
| --- | --- | --- | --- |
| U01.C01 | Single choice | U01.person | Identify Omar as the answering speaker in an exchange |
| U01.C02 | Single choice | U01.articles | Select the correct articles for Büro and Telefon together |
| U01.C03 | Construction | U01.question | Produce one yes/no identity question about Sara |
| U01.C04–C05 | Reading extraction | U01.details | Retrieve Ben's number and the date associated with a small office |
| U01.C06–C07 | Construction / bounded text | U01.statements | Produce one first-person haben statement and one phone description with ist |
| U01.C08 | Supported field | U01.form | Enter Timo in a labelled Name field from a fictional message |

Only taught Unit 1 language is scored. Item types and target IDs are declarative; rendering has no lesson-ID cases. Grading is deterministic bounded equivalence: NFC, trimmed/collapsed whitespace and one terminal punctuation mark normalized; declared case-sensitive production checks preserve German capitalization. Numeric date alternatives are explicit. No keyword/free-writing evaluator or AI. Feedback/accepted responses appear only in final item review, with source text for context.

### Contracts, durability and concurrency

`AssessmentDefinition`, `AssessmentItem`, `AssessmentResponse`, `AssessmentAttempt`, `EvidenceEvent` and `OutcomeProjection` are explicit narrow contracts in `assessment.ts`; strict Zod schemas reject unknown fields, IDs, versions, repeated/missing items, non-option choices and responses over 160 characters. Stored attempt/evidence validation also checks owner, scope, exact order, lifecycle and event provenance. `schemaVersion: 1` is new assessment data; course-progress schema 2 remains untouched.

Explicit Start creates an `in-progress` attempt with a client UUID (validated, owner assigned exclusively by verified server auth), server `startedAt`, fixed item order, definition hash and compatibility version. Creation is idempotent for that owner/UUID, and the server reads all four existing course rows to require historical completion. No traversal fields are copied into assessment evidence. The attempt ID is retained in the route URL after creation. No shuffle, draft-answer persistence, keystroke writes or partial-answer resume.

All eight answers remain local until final Submit. Refresh/confirmed navigation clears unfinished answers and restarts the same draft's fixed item order; the screen explains this and guards unsaved navigation. Creation acknowledgement loss may leave a harmless empty draft if the page is closed before its URL is established. Accepted submissions remain recoverable by URL or Unit 1's latest-result read.

Submission validates and grades on the server, then atomically transitions the draft to `submitted`, adds server `finishedAt`, stores classified item responses and embeds eight immutable evidence events. A submitted attempt is never updated. One start write plus one accepted submit write; no writes per answer, on reads, for projection or for retries. A SHA-256 digest of exact trimmed responses in fixed item order identifies the final payload. An identical retry, including reordered transport input, returns the accepted truth with zero writes. Different competing answers return `conflict` plus the winning immutable result; the UI explicitly says another tab's answers won. Double-clicks are guarded locally; transaction retries enforce the same rule server-side. Failed/lost acknowledgements retain and resend exactly the frozen submission; `Check saved result` reads durable truth without resubmitting. Effect re-entry shares one read promise per attempt/explicit retry so an accidental second success cannot hide a load failure. Load/start/submit/retake errors have explicit recovery controls; owner changes/unmounts ignore late responses.

`compatibilityVersion` changes for incompatible item identity/order, response/grading semantics or outcome meaning. Copy/formatting edits keep it stable. `definitionHash` fingerprints the definition at start for diagnostics, not the compatibility gate. A production migration/version archive is not introduced; unknown or incompatible prototype versions are rejected without writes.

### Storage, events and projection

Only new path: `users/{verifiedUid}/assessmentAttempts/{attemptUUID}`. No separate evidence collection/root is necessary: the entire accepted attempt and its bounded events fit one transaction/document. Evidence ID `${attemptUUID}:${itemId}` is deterministic. Each event contains verified learner scope, attempt ID, assessment ID/version, item ID, narrow target, correctness, server timestamp and `provenance: assessment`; no raw response or mastery value. Events are semantically append-only across independently created attempts and immutable within each submitted document.

GET by ID reads one known user-owned document. Unit history reads the latest document by `finishedAt` descending, limit 1; Firestore's implicit document-ID ordering breaks equal-time ties descending. Null-finished drafts sort after submitted attempts and never replace the last accepted result. This single-field query requires no added composite-index configuration. The prototype supports only this one assessment/release in the new subcollection; future multi-assessment/history/version support must be designed deliberately rather than extending this query silently.

`projectOutcomes` is a pure derived read model of the latest accepted compatible attempt. No accepted observations → `no evidence`; all required items for a target correct → `demonstrated in this check`; otherwise → `needs more evidence`. Two-item targets require both, so success in an unrelated target cannot average away a gap. No persisted projection, global mastery, CEFR percentage, completion flag or recommendation write. Raw score is correct items / 8 and remains separate from traversal and outcome labels.

Retakes create a new UUID, preserve all prior attempts/events, and use the latest accepted result rather than best score or averaging. The same eight prototype items repeat; UI explicitly calls this a repeat observation, **not new independent transfer evidence**. Alternate held-out families, exposure-ledger/assistance metadata and delayed rechecks are deferred prerequisites for stronger/public completion claims. This prototype does not grant reviewed curriculum completion credit.

### Privacy, deletion and UX

Bounded submitted text is transmitted only for deterministic grading/digest computation; raw typed responses are not stored. `responses` stores item/target/correctness classes, sufficient for the score and item-result review. No prompts, stimulus snapshots, open writing, keystrokes, AI feedback, unrelated analytics or user-supplied owner IDs are persisted. Thus review shows accepted responses and correctness, not the learner's original typed mistake. The hashed submission digest serves idempotency only.

`assessmentAttempts` is explicitly added to `USER_SUBCOLLECTIONS`. Existing recursive `users/{uid}` account deletion removes drafts, accepted truth and all embedded events, including when the parent user document is absent. No orphan top-level event records. An explicit deletion test preserves another user's subtree while removing the assessed user's data.

Unit 1 shows the Check action only after all four lessons are historically complete (repeating lessons does not revoke it). It shows the last accepted score/review link after submission. Lesson revisits remain available; Unit 2 stays unavailable. `/learn/check?attempt=...` uses the existing authenticated Learn owner/provider boundary with four middleware-protected APIs, verified server ownership and auth-off preview denial before initializing Firestore. No browser-direct Firestore. An incomplete learner cannot create an attempt by bypassing the entry UI.

Quiet Editorial screen: compact item counter, labelled radios/inputs, Previous/Next and a single final Submit; no Discover/Understand stages or teaching explanations during the check. Focus follows item/result changes. Results separate “Unit lessons complete”, a raw check score and cautious six-target evidence. No proficiency celebration. Failure, lost-acknowledgement recovery, competing-tab result and retake states are explicit.

### Validation and visual review

- Focused assessment suite: **20 passed, 0 failed**. Covers definition/count/types/scope/originality, exact mapping, deterministic grading, overclaim boundaries, strict inputs/stored provenance, start gating and idempotency, accepted submit, duplicate/concurrent submit, immutable history/retakes/latest projection, read purity, compatible copy edits/incompatible versions, absent/different-owner attempts, auth-off/API ownership boundary, deletion and course/legacy isolation.
- Combined curriculum/assessment plus Phase 1C/1D and FSRS/review/foundation/grammar regressions: **136 passed, 0 failed** (20 assessment + 50 existing curriculum/progress + 66 relevant legacy regressions).
- Browser projection is isolated in `assessment-projection.ts`; new check screen/entry use explicit lazy/Suspense boundaries. An initial compiled-preview startup exposed the existing Nitro/rolldown undefined `ssr_exports` issue; this boundary correction resolves generated SSR syntax without dependency/configuration edits.
- Typecheck passes. Scoped ESLint passes without errors/warnings. `build:compile` passes; normal `build` and `db:migrate` are not run.
- Dev browsers: initial full Learn/assessment suite **42 passed, 0 failed**; final polished/lazy-boundary assessment suite **14 passed, 0 failed**, plus final Previous-item keyboard/retake check **2 passed, 0 failed**. The intervening failure-injection pass exposed duplicate effect reads (two failed cases); sharing each explicit read promise resolved it.
- Final compiled browsers: **46 passed, 0 failed** (14 Phase 1E + 32 existing Learn regressions), desktop and mobile. Includes L01–L04 durable resume, stale/idempotent course writes, legacy vocabulary Learn, all eight items, mixed evidence, result reload/review, retake failure/success, duplicate/double-click submit, lost acknowledgements with read recovery and reload, competing-tab result, signed-out/incomplete gating and narrow/dark/touch/keyboard checks. The initial broken compiled preview started zero browser tests; the final lazy-boundary rebuild passes both generated SSR syntax and the complete compiled suite.
- Rendered/inspected screenshots under ignored `screenshots/phase1e/`: Unit 1 available entry, desktop check/mid-check, mixed 6/8 result, expanded review, repeat attempt, submit failure/recovery, concurrent result, 390px mobile check/result, dark 320px check/result and scrolled result action. Browser fixtures exercise real assessment/course persistence logic on hermetic in-memory Firestore, seal external APIs and assert no uncaught browser errors or unhandled calls; they do not exercise a live Firestore deployment.
- Second polish after screenshot review shortened date/form prompts and target descriptions, distinguished follow-up labels with neutral color, included the original short stimulus in result review, clarified saved score/traversal wording, and kept keyboard focus on the question when returning to Item 1. Rechecked mobile touch targets, horizontal overflow and result action visibility above fixed navigation. The read-deduplication fix also prevents an initial load failure being masked by effect re-entry.

### Protected and deferred scope

Lesson completion != evidence. Assessment attempt != mastery. FSRS/CardProgress, grammarProgress, lesenProgress, Paste, course-progress semantics and legacy vocabulary Learn are unchanged. No Progress/Home integration, A1 completion algorithm, placement/exam mode, assessment scheduling, AI/open-writing grading, audio/speaking, Unit 2 content, mass authoring or production migration. Prototype English support and one exposed retake family remain explicit limits; educator review, stronger transfer coverage and live Firestore integration verification remain deferred.

No push, merge, migration or deployment. Commit only Phase 1E contracts/content/UI, focused/browser tests, generated route registration, deletion inventory and this new handoff section; unrelated pre-existing machine-local files remain excluded.

## 36. Karta Phase 1F — Assessment robustness and alternate-form foundation (2026-10-06)

Base: approved/pushed `codex/karta-phase1e-unit1-evidence`, `4919a8235f99a34bc26fca8cc5dc1e6d697679e6`. Work branch: `codex/karta-phase1f-alternate-form`. All six repository-local Karta skills are discoverable and applied. This section supersedes Phase 1E's single exposed form/latest-attempt projection policy; approved architecture/blueprint documents, lessons, course-progress persistence, dependencies, migrations and production configuration remain unchanged.

### Audit and minimal extension

Inspected the existing eight items/render contracts, strict attempts/events, transactions and authenticated APIs, latest-attempt read/projection, same-form retake and result/review UI, exact six targets, Unit 1 blueprint/lesson scope, deletion inventory, transaction fixture and hermetic browser fixtures. Phase 1E had no explicit form/family identity, served the same tasks on every retake and projected only the last accepted attempt. Its immutable per-attempt document and embedded events already suffice for alternate forms; no storage redesign or new root is needed. The concrete limitation is that latest-attempt-only evidence cannot distinguish repeated success from confirmation across forms.

`AssessmentDefinition` now carries assessment version, stable form ID and family ID in addition to its existing assessment ID, track/release/unit and compatibility version. `DE.A1.U01.CHECK.PROTOTYPE.1` remains assessment version 1. Form A is `U01.FORM.A` / `U01.FAMILY.A`; Form B is `U01.FORM.B` / `U01.FAMILY.B`. Both compatibility contracts currently have version 1. Existing A items, grading, IDs, ordering and six narrow target definitions are preserved. B item IDs `U01.B.C01`–`U01.B.C08` do not collide with A's `U01.C01`–`U01.C08`. Stable IDs, rather than array positions, resolve forms.

Definition hashes remain deterministic diagnostics. Compatibility versions must bump for unsafe item/order, target meaning or response/grading-contract changes; learner-facing copy alone does not bump them. Assessment version describes the assessment, while per-form compatibility governs safe restore/grading. Requests identify the supported assessment/contract; the server chooses/resolves the attempt's form, never trusts a client-selected form/family, and validates stored metadata and complete event provenance against that exact form.

New attempts use schema 2. Known schema-1 Phase 1E records are interpreted read-only as A, including derived A identity on events. No live data migration or read repair occurs. Existing accepted A retry digests remain valid. An explicit final submission of an old unfinished draft remains its normal one acceptance write; it does not trigger a bulk migration.

### Original Form B plan

Eight original Karta prototype tasks, pending pedagogical/editorial review. Same six narrow groups and distribution (one person, one articles, one question, two details, two statements, one supported field). B has two choices, two bounded-text tasks, two constructions, one reading extraction and one supported field. Only Unit 1 taught forms, familiar Büro/Telefon nouns, haben/sein statements, supplied plural/count/date scaffolding and fictional names are used. English role/field labels supply context, not new scored German vocabulary. No later grammar or independently assessed open writing.

| Item | Target | Alternate structure |
| --- | --- | --- |
| U01.B.C01 | U01.person | Choose a self-identifying reply for a visitor exchange, rather than name the answering speaker |
| U01.B.C02 | U01.articles | Repair both articles in a short note, rather than recognize a bundled option |
| U01.B.C03 | U01.question | Assemble a yes/no identity question from pieces, rather than the unscaffolded intent-only A prompt |
| U01.B.C04 | U01.details | Extract phone quantity in digits while ignoring a reference number |
| U01.B.C05 | U01.details | Select the phone-note date from labelled notes, rather than type the small-office date |
| U01.B.C06 | U01.statements | Turn labelled facts into a third-person haben sentence |
| U01.B.C07 | U01.statements | Assemble the large-phone statement from pieces amid contrasting office context |
| U01.B.C08 | U01.form | Fill the answering person's Name field from a dialogue, rather than a single first-person message |

Complete B task arrangements differ from A and lesson fixtures; changing names alone is not the independence rule. Familiar language necessarily recurs. B's article production and scaffolding differences mean **psychometric equivalence is not claimed**. Targets remain narrow functional samples, not certification of all constituent skills or essential-outcome gates. The Name field remains supported W03 exposure, not independent R11 interpretation.

### Selection, history and immutable provenance

Same form/family = repeat observation. A and B = distinct observation families under the prototype authoring rule, allowing at most two independent families. This is not validated parallel-form reliability, controlled exam security or a guarantee of unseen exposure outside Karta. Accepted history determines the observation labels; drafts/abandoned answers provide no evidence. Unlimited retries do not create unlimited independent families.

Server selection is deterministic: no accepted attempt → A; latest accepted A → B; latest accepted B → A. Thus the first alternate retake is B and subsequent retakes alternate based on accepted history. `finishedAt` descending, then attempt document ID descending, defines “latest,” including simultaneous timestamps. Drafts never advance selection. Start reads existing UUID first inside its transaction; an existing attempt is returned without changing its form. New selection reads the owner's attempts in the same transaction before its one create write. The stored form is immutable across refresh, URL reopen, retries and concurrent tabs. Different concurrent UUIDs may legitimately get the same form; those results stay in one family and cannot establish alternate confirmation. A start racing a submit observes a serialized before/after history and cannot reassign a previously created attempt.

Storage remains `users/{verifiedOwner}/assessmentAttempts/{UUID}`. Two lifetime writes for new attempts: explicit draft start and atomic final acceptance. Read, duplicate start, identical retry and projection remain write-free. Changed competing submissions return the winning immutable result. New digest identity includes assessment version/form/family and ordered transient responses; legacy A digests retain their original layout. No duplicate deterministic events (`attemptId:itemId`). Attempts/events persist assessment ID/version, form/family, compatibility version, owner, attempt/item/target, correctness and server times; existing track/release/unit scope stays intact.

A fifth authenticated API reads accepted history; all five deny auth-off access before Firestore initialization and use verified `context.userId`. No browser-direct database access. History is a prototype collection scan, avoiding a new persisted index/score or composite-index configuration. Its read/transfer cost grows with the number of attempts, and selection reads drafts as well. A production-scale history read plan needs deliberate follow-up; this phase does not silently add one. Transactions are exercised by deterministic hermetic optimistic fixtures, not a live Firestore service.

### Cautious projection and retakes

Projection is a pure read model. It uses the latest accepted compatible attempt **per known family**, with the same time/ID tie-break as selection. Every required item for a target must be correct within that form; both items are required for details/statements. No averaging across items, targets or history.

- Neither family observed → `no evidence`.
- Any latest observed family fails that target → `needs more evidence`, even when the other succeeds.
- Only one successful family observed → `demonstrated in one observation`.
- Latest target observations in both A and B succeed → `confirmed in an alternate form`.

A repeat replaces that family's latest classification; it can resolve or introduce a contradiction but **does not add another independent family**. A+B confirmation means agreement between the latest samples from two authored families, not two guaranteed first-exposure successes. Repeat exposure is indicated separately. No score decay, confidence/proficiency percentages, lifetime weighting, scheduling or persisted projection/mastery record.

Current-attempt score, form and observation kind are separate from the combined evidence section. Review resolves the URL's exact form and items, with its own classified results/accepted responses; combined history can include newer attempts and is labelled accordingly. Old attempt review never silently uses B prompts for A or merges responses. Unit entry labels the last saved form. After A the primary CTA offers the alternate form; once the next form has an accepted observation, retake wording calls it a repeat. Combined-history failure hides the unavailable summary and disables the history-dependent retake until explicit retry, while preserving exact-attempt review. One promise per explicit history/load token prevents effect re-entry from masking a failure. Lost acceptance acknowledgements support exact-payload retry or saved-result recovery.

### Privacy, deletion and protected scope

No raw typed answers, prompt/stimulus snapshots, keystrokes, AI feedback or exposure ledger are stored. Only classified item results and required provenance are durable; submission text is transient for bounded deterministic grading/digest. Existing recursive account deletion already covers both forms and their embedded events, plus drafts, even without a parent user document. Tests preserve another user's A/B records.

Lesson completion != evidence. Assessment attempt != mastery. Same-form repeat != independent evidence. FSRS/CardProgress, grammarProgress, lesenProgress, Paste, courseProgress semantics and legacy vocabulary Learn remain unchanged. No unit/A1/CEFR mastery percentage, Progress/Home integration, recommendations, adaptive selection/scheduling, spaced assessment, AI/open-writing/audio grading, Unit 2 or mass authoring. No migration, merge, deployment or push. Pre-existing untracked local skills, CodeGraph, `.firebaserc` and `.vercelignore` are excluded.

### Validation and visual review

The existing sealed browser harness exercises real assessment/progress logic with fake transactions and mocked verified auth/server functions; credentials are blank and external APIs blocked. Initial browser assertions needed two corrections: wait for the actual Form B navigation before reading its URL, and select the specific competing-tab status rather than both that status and the new history-loading status. No application overwrite/form-switch bug was involved.

Initial desktop and dark-320 screenshots showed legible forms and explicit cautious contradiction states, but too much result explanation and six duplicated repeat notes. The second polish pass shortened score/combined-history copy (also avoiding the implication that B already exists after A), moved repeat exposure to one summary note, removed internal authoring-rule jargon from learner copy, and gave the first alternate CTA primary emphasis while repeats stay secondary. The historical-read recovery also preserves explicit failure/retry instead of automatically masking initial history failures.

Remaining limits: original unpublished English-supported content awaits educator review; only two authored families and narrow bounded samples; exact bounded acceptance is not open writing; no psychometric equivalence, parallel reliability or public completion certification; accepted-history exposure semantics and growing history-read cost; live backend/production transaction verification deferred.


Final validation:

- Focused `node --import ./scripts/test-register.mjs --test src/lib/curriculum/assessment*.test.ts`: final **35 passed, 0 failed** within the combined regression run (20 retained/updated Phase 1E + 15 Phase 1F cases). The selection/submission collision uses a barrier to force overlapping transaction snapshots and verifies retry, not merely parallel Promise dispatch. Covers exact A/B definitions and taught scope, structural alternation, immutable form/version/event provenance, A→B→repeat selection, concurrent same/different UUID starts, refresh, duplicate/lost-ack/competing submission, one-family repeats, alternate confirmation, contradictions/full two-item rules, latest-per-family history, stale/incompatible/forged data, legacy A read-only interpretation/retry, both-form deletion and unchanged protected documents.
- `node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`: **151 passed, 0 failed** (35 assessment + 50 existing curriculum/progress + 66 legacy regressions).
- `npm run typecheck`: passed after final changes. Scoped ESLint: **0 errors, 0 warnings**. `git diff --check`: passed.
- `npm run build:compile`: passed on final application source. Generated SSR syntax check also passes. Normal migration-triggering `build`, `db:migrate` and deployment commands were not run. Existing bundle-size warnings remain outside this phase.
- `npm exec playwright -- test e2e/learn-phase1e.spec.ts e2e/learn-phase1f.spec.ts e2e/learn-durable.spec.ts e2e/learn-phase1d.spec.ts e2e/learn-unit1.spec.ts e2e/learn-prototype.spec.ts`: **56 passed, 0 failed**, desktop/mobile. Then strengthened the B failure case to lose acknowledgement AFTER durable start; focused desktop/mobile dev rerun: **2 passed, 0 failed**, same B UUID and no extra writes.
- Same complete six-file suite with `--config e2e/home-compiled.config.ts`: **56 passed, 0 failed**, including the strengthened lost-start-ack fixture. Includes all-four durable lesson resumes, legacy vocabulary Learn, auth/incomplete gating, refresh during B, retake/retry failure, lost start/submission acknowledgements, exact form review, combined history/repeats/contradictions, competing submission, stale/incompatible URL and explicit history recovery. The harness asserts no uncaught browser errors or unhandled backend calls. Existing dev warmup credential-denial/import-protection diagnostics do not access production services.
- Rendered and inspected ignored `screenshots/phase1f/`: Unit before/after A, A check/result, B check/result/combined evidence, same-family-only repeat, A repeat after both forms, contradictory B result, exact A/B reviews, 390px B/combined result and dark 320px B/contradiction. Re-inspected after the polish pass. No horizontal overflow; narrow/dark text and controls remain legible. The mobile B action viewport additionally verifies the scrolled Next button above fixed navigation. Full-page captures can place fixed chrome within the image; viewport/action bounds and actual browser interaction confirm controls remain reachable.

Completed work is limited to assessment content/contracts/history/projection/UI, focused tests/browser fixtures, and this appended Phase 1F section. No architecture contradiction was found. No push, merge, migration or deployment.

## 37. Karta Phase 2A — complete authored Unit 2 (2026-10-06)

Base: approved/pushed Phase 1F `codex/karta-phase1f-alternate-form`, `9e85c1dd6732b30e332a1d3999a93f8d382a30c1`. Work branch: `codex/karta-phase2a-unit2-teaching`. All six repository-local Karta skills were discoverable and read before substantive work. Audited the blueprint, exact registry/graph, four Unit 1 lessons, generic engine/response controls, durable resolver, derived unit helper, Learn/unit routes, Unit 1 assessment boundary/UI and hermetic fixtures. No blueprint contradiction found. Approved architecture documents remain unchanged.

Exact approved metadata is retained:

| Lesson | Title | Focus | Apply outcome |
| --- | --- | --- | --- |
| DE.A1.U02.L01 | Everyday actions and routine | G04/G05/G06/V05/W04 | Produce simple routine statements with different subjects |
| DE.A1.U02.L02 | People, belongings and plurals | G11/G20/R04 | Explain whose objects they are; resolve simple reference |
| DE.A1.U02.L03 | Say what is not true | G17/G18/G19/W05 | Contrast a real/incorrect personal or home detail |
| DE.A1.U02.L04 | Combine and revise statements | G07/G29/R05/W16 | Read a corrected fact and revise own short description |

Verified exhaustive hard prerequisites against source and blueprint: G04←G01; G05←G01,G04; G06←G02,G04,G05; G07←G04,G06; G11←G05,G08,G09; G17←G13; G18←G10,G12; G19←G17,G18; G20←G09,G10; G29←G13; R04←R03,G01,G20; R05←R03,G19; W04←G06,G13,W02; W05←W04,G20,G50; W16←W04,G19,G29; V05←V02. No dependency metadata changed. Guided teaching provides exposure/support; none of the new tasks awards prerequisite assessment credit.

**Content and linguistic review.** `german-a1-unit2.ts` contains original Karta examples and bounded prototype teaching, not borrowed exam items. The adult people/home/study environment reuses people, phones, offices, small/large and identity statements. New lexical inventory is deliberately limited to regular `lernen`/`wohnen`, `das Buch / die Bücher`, and reviewed `lesen`/`schlafen` forms; Deutsch, place/address labels and corrections receive supplied support. Regular/special forms agree with `src/lib/german/verb-conjugation-data.ts`; noun gender/plural agrees with `src/lib/german/examples-data.ts`. Those sources' example sentences are not copied. German examples were reviewed for conjugation, capitals, nominative possessives, lexical plurals, negation scope, coordination/V2 and polite address.

- **L01 — 11 steps:** discover → understand singular → recognize → understand plural/polite → action-sense recognition → unaided du recall → ich-to-wir transformation → ihr recall → polite sentence production → two-subject routine application → formative they-agreement check. Explicitly distinguishes subject, ending and action meaning across ich/du/er-sie-es/wir/ihr/sie/Sie. No general present-tense mastery claim.
- **L02 — 9 steps:** discover learned plurals → understand mein/dein/unser → recognize plural agreement → understand sein/ihr and supplied polite Ihr → plural recall → possessive production → two-person reference reading → owner/reference application → fresh reference check. Nominative phrases only; plural is lexical rather than a universal rule. Reference depends on speaker and preceding noun, not isolated translation.
- **L03 — 10 steps:** discover → understand meaning-based negation → recognize → explicit contrast → action-negation transformation → nominative plural negation recall → bounded description production → two-claim correction → original description → nominative noun-identity check. `nicht` is taught for short actions/predicate adjectives and `kein/keine` for nominative predicate noun phrases. No accusative-negation instruction or `keinen` paradigm. W05 richer production is explicitly unassessed.
- **L04 — 10 steps:** discover specific stem forms → understand complete-clause und → recognize → lesen recall → schlafen recall → coordinated sentence production → read corrected information → revise a supplied erroneous draft using the updated fact and problem-type checklist → original self-revision → bounded new revision check. Checklist never gives the complete corrected sentence before checking. Only the tiny reviewed stem inventory is taught; no general algorithm or subordinate-clause order.

**Minimal generalization.** No response primitive, grader or transition change. Existing choice, text and original controls represent these tasks cleanly. The durable resolver already selects all authored lessons, so content registration extends its reads/writes to eight without changing persistence. Existing unitProgress was already generic and remains based on each unit's own lesson IDs. Added one pure courseLearningAction helper using registry order: next unfinished authored unit before optional repeated practice. This fixes first-unit-only overview navigation and lets a finished Unit 1 lesson lead into Unit 2. Unit content descriptions are optional metadata. Units 3–10 remain unauthored and unactionable.

The one assessment boundary correction preserves the approved eligibility semantics: its old whole-course `length === 4 && every completed` assumption would incorrectly demand all eight lessons. It now selects the registered lesson IDs of the existing Unit 1 assessment's unit, still requiring exactly those four historical completions. Forms A/B, scoring, selection, projection, evidence, attempt paths/schema and submission/concurrency behavior are unchanged. Unit 1 Check remains inside Unit 1; its success does not gate guided Unit 2. Unit 2 completion creates no assessment/evidence event or check button.

**Durability and evaluation.** All new lessons explicitly use resumeContractVersion 1; definition hash remains diagnostic. Existing track/release identity, schema 2, owner-scoped users/{uid}/courseProgress path, expected revisions, receipts, conflict recovery, restart and historical milestones remain unchanged. Reload uses the pinned authored definition. No new root, unit record, migration or hidden read-write. Unit 2 has Not started/In progress/Unit lessons complete derived from its four acknowledgements; three do not complete it, and restart retains historical completion while displaying Practicing again. Unit 1 records/state stay isolated. Bounded tasks accept only declared alternatives under the existing normalizer; they do not evaluate arbitrary grammar or writing. Open text stays ephemeral, is omitted from durable acknowledgements, and remains unassessed after reload. No AI grading or mastery/CEFR credit.

**Visual review and second pass.** First inspected desktop overview (U01 complete/U02 next), Unit 2 fresh/mixed/complete, all four lessons, negation/revision tasks and dark 320px unit/lesson captures. Existing spacing, contrast and native controls remained usable; the revision instruction heading was too dense. Second pass separates the draft/update into the example block, shortens its instruction/checklist, adds explicit next-unit context, and makes completed-course revisit derive from available content. Final desktop/390px/dark-320px and reload/restart screenshots are under ignored screenshots/phase2a. Unit 1 Check/Form B rendering is separately retained in screenshots/phase1f. Full-page fixed chrome can appear midway in captures; actual viewport/interaction checks, focus and target checks are authoritative.

Validation results are recorded after the final source and browser passes below.

**Limits and protected scope.** Original unpublished English-supported content still needs educator/publication review; exact bounded answers do not accept all valid paraphrases or independently certify orthography/free writing. No Unit 2 assessment, psychometric equivalence, audio/speaking, adaptive sequencing or mastery. Live production/backend verification is deferred; tests use real boundary logic with hermetic transaction/storage fakes and mocked verified auth, blank credentials and blocked external APIs. No FSRS/CardProgress, grammarProgress, lesenProgress, Paste, Home or legacy vocabulary-Learn changes. No dependencies, production configuration, deployment, merge, migration or push.

Final validation:

- `node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`: **197 passed, 0 failed** — 46 new Phase 2A cases, 35 retained assessment cases, 50 retained curriculum/persistence cases, 66 legacy/FSRS/review/grammar regressions. New cases cover exact four-lesson metadata/graph/stages, confusable agreement/plural/possessive/negation/reference/stem/coordination/revision answers, all four checked durable resumes, revision receipts/idempotency/stale writes, unit isolation, 3-versus-4 completion, historical restart, open-writing minimization, course sequencing, unavailable future units, and unchanged A/B/projection source hashes.
- `npm run typecheck`: passed on final source. Scoped ESLint across all changed TypeScript/TSX and browser tests: **0 errors, 0 warnings**. `git diff --check`: passed. `npm run build:compile`: passed; generated SSR syntax check passed. Existing bundle-size warnings remain. Normal `build`, migration and deployment commands were not run.
- Development browser coverage: the final broad seven-file Learn run passed **66/68**, including all **56 existing** cases. The two desktop Unit 2 failures were the new strict geometry measurement (`720.25px` after scrolling against a `720px` viewport), corrected to whole CSS pixels. Final focused `npx playwright test e2e/learn-phase2a.spec.ts`: **12 passed, 0 failed**. Together, all 68 cases pass on final application source. An earlier broad run exposed a retained locator matching both newly available unit status labels; it was correctly scoped to the Unit 1 row. No application/data-integrity failure was involved.
- Hermetic desktop/mobile runs exercise actual bounded controls, keyboard advance/focus, incorrect-answer retry, checked reload, completion reload, per-lesson isolation, restart, ephemeral open writing, fresh/mixed/complete Unit 2, Unit 1→Unit 2 without assessment success, future-unit unavailability, all retained assessment/alternate-form/recovery cases and legacy vocabulary Learn. Harness assertions protect against uncaught browser errors and unhandled backend calls; handled intentional-failure and sealed-auth warmup diagnostics are expected. Action bounds and 44px target checks pass, as do no-horizontal-overflow checks.
- Compiled artifact: `npx playwright test --config e2e/home-compiled.config.ts e2e/learn-*.spec.ts`: **68 passed, 0 failed** (3.6 minutes), all seven Learn files on desktop/mobile. This includes the final geometry correction and polished source, all four durable Unit 2 lesson flows and all retained Unit 1/assessment/legacy Learn cases.
- Re-inspected the final compiled screenshots: desktop next-unit overview, fresh/mixed/complete Unit 2, all four lesson starts, actual R04/R05 readings, W16 before/after checking, 390px L01/L03/unit, dark 320px lesson/unit, checked resume and historical restart. No horizontal overflow or illegible controls. The revised W16 heading is shorter, its draft/update are distinct, and no full corrected answer appears before checking. Unit 1 Check/Form B remains legible and unchanged.

Completed scope: Unit 2 authored content/registration; optional unit description metadata; pure guided course navigation and truthful Learn/unit/lesson rendering; the existing Unit 1 eligibility query scoped to its registered lessons; focused tests/browser updates; this append-only handoff section. All pre-existing unrelated untracked files remain excluded. No push, merge, deployment or migration.

## 38. Karta Phase 2B — Unit 2 Check and independent assessment histories (2026-10-06)

Base: approved/pushed `codex/karta-phase2a-unit2-teaching`, exact HEAD `f28f29e32e7878af27a030a09979c8558f599855`. Work branch: `codex/karta-phase2b-unit2-assessment`. Confirmed all six repository-local Karta skills before substantive work and applied architecture, pedagogy, UX, algorithms, governance and engineering guidance. Audit and item plans were reported before creating the branch or implementing. No architecture contradiction found; frozen architecture/blueprint documents and all approved lesson content remain unchanged.

**Audit.** The remaining single-assessment assumptions were: server request/definition lookup accepted only U01; stored attempts resolved through the U01 form helper; eligibility selected U01 lesson IDs and U01 error copy; accepted-history reads mixed every owner attempt; latest and deterministic selection used that global history; projection knew only U01's two forms; exposure/next-form labels used unscoped history and U01 identities; `/learn/check` accepted only an attempt parameter; the screen used U01 eligibility, requests, target projection, copy and review lookup; unit entry/latest result used U01 definition/form labels; the Unit route mounted a check only when its number was 1; browser fixture completion seeded only U01. Existing API auth middleware, owner path, strict classified-result validation, grading, atomic submission/digest, schema-1 interpretation and account deletion were reusable.

**Minimal generalization.** Added one static assessment registry with definition, ordered A/B forms, unit number and the exact unit lesson IDs. It answers assessment-for-unit and exact assessment/form resolution. Content imports assessment types only; UI does not eagerly import server validation/auth modules. The existing five authenticated server functions remain five. Verified owner always comes from auth context, never client input. The old `ASSESSMENT_REQUEST`, default no-assessment intro, default helper calls and schema-1 A interpretation intentionally remain U01 for backwards compatibility; they are not global history scopes. The Phase 2A byte-freeze assertion for the reducer was removed because this phase explicitly generalizes it; the approved U01 content hash assertion and all U01 semantic regressions remain.

**Exact Unit 2 identity.** Assessment `DE.A1.U02.CHECK.PROTOTYPE.1`, assessmentVersion **1**, unit `DE.A1.U02`, track `de-a1-text-practice-v1`, release `DE.A1.CURRICULUM.PROTOTYPE.1B`. A: `U02.FORM.A` / `U02.FAMILY.A`; B: `U02.FORM.B` / `U02.FAMILY.B`; compatibilityVersion **1** for each. Item IDs are `U02.A.C01`–`U02.A.C08` and `U02.B.C01`–`U02.B.C08`, distinct from U01. Original Karta authoring, unpublished prototype, pending educator review. Definition hash is diagnostic; changes to response/grading contracts, item identity/order or target meaning require compatibility/version review. Copy-only edits do not invalidate an attempt.

Six functional targets are the smallest defensible grouping for these tasks. These are assessment outcome IDs, not new canonical skills, and no exact essential/supporting classification is invented. Mapping names only genuinely elicited use, never all forms of a grammar atom or unrestricted writing:

| Functional target | Bounded observation | Relevant blueprint handles, limited to actual elicitation |
| --- | --- | --- |
| U02.routine | Two intended-action/subject-agreement statements | G04/G05/G06, V05 and W04 where elicited; not every subject form |
| U02.belongings | Familiar books, possessive and plural agreement | G11/G20 in the requested nominative statement |
| U02.reference | Resolve whose object(s) a two-speaker text refers to | R04, actual reference comprehension |
| U02.negation | Both noun-category and predicate correction | G17/G18/G19; only this bounded W05 correction, not general description |
| U02.corrected-information | Retrieve a corrected fact from an unseen message | R05, actual corrected-information reading |
| U02.revision | Changed fact + diagnosed verb error + complete clauses with und | G07/G29/W16 only in the requested reviewed lexical frame and bounded revision |

Both forms have **8 items**, the same target order and the same required counts: routine 2, belongings 1, reference 1, negation 2, corrected-information 1, revision 1. All required items must be correct for that family's observation of a target.

| Item | Form A task/type | Form B task/type | Target |
| --- | --- | --- | --- |
| 1 | Labelled study intent → statement / construction | Two-person study dialogue → shared reply / bounded-text | routine |
| 2 | Select group note and transform subject to ihr / bounded-text | Repair named subject's finite verb in a note / construction | routine |
| 3 | Shared books → possessive plural statement / construction | Repair another person's ownership and plural agreement / bounded-text | belongings |
| 4 | Resolve plural Sie after two speakers / reading-extraction | Resolve singular Es after speaker change / choice | reference |
| 5 | Select meaningful noun-category denial / choice | Reject visitor's proposed object category / construction | negation |
| 6 | Produce denial of an untrue phone detail / construction | Repair office predicate negation by meaning / bounded-text | negation |
| 7 | Corrected phone notice → current adjective / reading-extraction | Correction exchange → speaker's current office adjective / reading-extraction | corrected-information |
| 8 | Changed office fact + du reading error, retain coordination / bounded-text | Replace changed action, repair first-person reading and combine sentences / bounded-text | revision |

A totals: 3 construction, 2 bounded-text, 2 reading-extraction, 1 choice. B totals: 2 construction, 4 bounded-text, 1 reading-extraction, 1 choice. B changes task/stimulus arrangement, not merely names/nouns/options. Whole prompts/stimuli are held out from the lessons; familiar linguistic forms recur necessarily. Lexical scope remains lernen/wohnen, familiar books/phones/offices, small/large and reviewed lesen/schlafen frames plus taught Unit 1 language. Negation stays with nicht in taught predicate/action patterns and kein/keine in nominative predicate noun phrases. No accusative keinen, focus-negation G54, new irregular verbs or inferred stem-change algorithm. Reading answers depend on their texts; revision checklists describe problems without giving the corrected German sentence. Existing deterministic normalizer/declaration-based grader is unchanged; these are narrow responses, not keyword grading of free writing.

**Eligibility and separation.** Starting a check requires historical completion of that registered unit's own four lesson IDs, including compatible available durable records. Unit 2 needs no Unit 1 lesson/check success, alternate confirmation, mastery or FSRS condition. No courseProgress writes or new completion rule. Lesson completion creates no assessment evidence. Assessment is not mastery, CEFR certification or a unit-passing gate. Guided course traversal stays independent.

**History, selection and projection.** A history/latest read scans `users/{verifiedUid}/assessmentAttempts`, filters the requested assessment ID, validates matching records against the exact stored form and verified owner, then retains only compatible submitted records matching track, release, assessment ID/version, unit, known form/family and compatibility. Foreign assessment documents, even malformed ones, cannot poison the requested assessment; malformed/stale matching documents fail closed rather than producing a combined claim. Pure history reducers apply the same identity scope; exposure is additionally bound to the attempt owner, and UI projections/next-form labels bind the loaded attempt owner. Drafts never advance selection or become evidence.

Each assessment independently selects no accepted history → A, latest accepted family A → B, latest family B → A, with existing finishedAt/document-ID tie-breaking preserved. Existing UUID retains its assigned form; cross-assessment UUID reuse/start/submission is rejected without writes. New concurrent UUIDs may receive the same family, including overlapping starts. Start/submission transaction and retry semantics remain unchanged. Accepted result plus eight deterministic embedded events is still one atomic final write; identical retry is read-only, changed competing submission returns the immutable winner.

Projection uses only the latest accepted observation per known family. No observation → no evidence; any latest-family failure → needs more evidence; one successful family → demonstrated in one observation; latest A+B both succeed → confirmed in an alternate form. Both routine/negation items are mandatory within each family. Latest repeats update that family, never create a third independent observation; contradictions are not averaged. Older exact attempt reviews remain separate. Exposure wording is First observation / Additional independent observation / Repeated observation. A retake offers the alternate form; after both families, future retakes are explicitly repeats. This is authoring independence, not validated parallel-test equivalence or empirical educational efficacy.

**Routing and UX.** `/learn/check?assessment=DE.A1.U02.CHECK.PROTOTYPE.1` opens the Unit 2 intro; `/learn/check` retains the U01 intro. Existing `?attempt={UUID}` URLs continue to work. The read-only attempt API now additionally accepts strict UUID-only requests and resolves the owned stored assessment/form before loading its history; old fully scoped callers remain supported and reject mismatches. An attempt URL with a conflicting U01/U02 assessment query displays the stored attempt's actual unit/items/form, never silently reinterprets it. Start/submit still require strict assessment/compatibility/UUID contracts. Lazy UI/auth boundaries are retained.

Unit 2 has no Check action before all four lessons finish; afterwards its own check and latest score/review appear separately from Unit lessons complete. Results show saved attempt score, exact form, observation type, combined target states, named follow-up gaps and exact item review. Neither success nor A+B says passed/mastered. Accepted review remains available if combined history fails; summary claims and retake are disabled until explicit successful retry. Semantic headings/forms/radios, labelled inputs, focus movement, leave guard, Previous editing, disabled incomplete submit and 44px narrow-screen touch controls remain in use.

**Persistence, privacy and deletion.** No stored schema change: schema 2 already has the necessary identities. Known U01 schema-1 records retain read-only A interpretation and identical retry digest. Path remains `users/{verifiedUid}/assessmentAttempts/{attemptUUID}`; no collection/root, persisted summary, migration, read repair or history rewrite. Persisted data remains classified item outcomes/provenance and submission digest only: no raw answers, prompt/stimulus snapshots, keystrokes, open writing or AI feedback. Account deletion still recursively removes users/{uid}, including both units' A/B attempts and embedded events; explicit four-family deletion test preserves another user's records. No production deletion was performed.

**Unit 1 compatibility.** `german-a1-unit1-check.ts` remains byte-for-byte SHA-256 `8e5699d988a1367dd82808d011f5a83bc2b4f935c2ead4d5bcb795ebfcdbc5cf`. Items/answers/normalization/form/family/version/eligibility/digests and legacy interpretation remain unchanged. Existing Phase 1E/1F tests cover A→B→repeat, cautious projections, two-item targets, races, immutable submissions, owned reads, exact reviews, old URLs and deletion. UI unit identity is now resolved generically; new presentation copy does not alter those semantics. FSRS, vocabulary Learn, grammar, Lesen, Paste, Home, Progress, course progress, dependencies, migrations and production configuration remain untouched.

**Visual review and second polish.** Inspected desktop and 390px Unit 2 before/after A, A intro/start/mid/result, B start/result, A+B confirmation, same-family-only and A-after-B repeats, exact old A/B reviews, U01 A/B reviews, dark 320px check/contradiction and history failure/recovery. Then shortened Unit 2 A1/B1 instructions, made task headings 20px on narrow screens while retaining 24px on wider screens, and added a concise named Follow-up line for combined gaps. Final content review also clarified A1 to omit place information and B5 to deny the proposed phone category without naming the actual object, making the narrow response contract explicit. These are the exact application changes after first screenshot review; grading/compatibility did not change. Re-inspected the polished captures. The screenshot helper returns to page top before full-page captures; fixed mobile navigation can still appear at the first viewport seam in long images. Real scrolling and successful interactions verify reachability. Initial focused dev run's only failure was applying a 44px mobile-touch rule to existing 36px desktop header controls; restricted that test assertion to mobile while retaining all 320px touch checks. No unrelated header redesign.

**Read cost and deferred scaling.** History and latest each scan **N owner attempt documents**, including drafts and both units; new-start selection also reads that collection inside its transaction (in addition to attempt/course reads). There is no production count claim: the measured hermetic case stored **5** assessment documents (3 accepted, 2 drafts), scanned **5** and returned **1** compatible accepted U02 record. Filtering is in memory after reading; no persisted index/summary. Growth in owner attempts increases read cost/latency and shared-query transaction retry pressure. There is no measured numeric scaling threshold yet. Future optimization could use reviewed assessment-scoped accepted-history queries/pagination and latest-per-family reads with appropriate indexes, while retaining exact historical review, deterministic ordering, exposure/repeat semantics, owner isolation and immutable provenance. No optimization was implemented here.

Remaining limits: two unpublished authored families per unit; tiny deterministic samples and English-supported instructions; no psychometric equivalence, reliability, spontaneous free-writing/voice/mastery certification or public course-completion claim. Educator/editorial and publication review remain required. Live production Firestore behavior was not exercised; hermetic fixtures execute the real persistence boundary with optimistic transaction retries and all browser backend calls sealed. No Unit 3, CP1, audio, adaptive scheduling or AI grading.

**Final validation.** Focused `node --import ./scripts/test-register.mjs --test src/lib/curriculum/phase2b.test.ts src/lib/curriculum/assessment*.test.ts`: **116 passed, 0 failed** (81 new Phase 2B + 35 existing assessment tests). Full `node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`: **277 passed, 0 failed**, 18 suites. This retains 196 prior tests and adds 81; the one removed Phase 2A assertion hashed reducer source bytes, which this explicitly authorized generalization necessarily changes. The separate Unit 1 authored-content byte check remains. `npm run typecheck`, scoped ESLint (0 errors, 0 warnings), `git diff --check`, **`npm run build:compile`**, and `node --check .vercel/output/functions/__server.func/_ssr/ssr.mjs` passed. Normal migration-triggering build was not run.

Full dev `npx playwright test e2e/learn-*.spec.ts`: **80 passed, 0 failed**. Full compiled `npx playwright test --config e2e/home-compiled.config.ts e2e/learn-*.spec.ts`: **80 passed, 0 failed**. After the final copy-only A1/B5 clarifications, rebuilt and reran focused/unit/regression/type/lint checks above; final dev `npx playwright test e2e/learn-phase2b.spec.ts`: **12 passed, 0 failed**, and final compiled equivalent: **12 passed, 0 failed**. Both browser projects cover desktop/mobile; captures include dark 320px and were visually inspected, including the final clarified prompts. Browser fixtures seal backend calls and check runtime failures. Validation uses hermetic persistence, not live production credentials. Scope is 15 implementation/test/handoff files; no dependency, migration, production configuration, FSRS/legacy progress or frozen architecture changes. No migration, deployment, merge or push occurred.

## 39. Karta Pre-Merge / Production Readiness

Review date: 2026-10-06. Review branch: `codex/karta-premerge-production-readiness`, based on approved/pushed `codex/karta-phase2b-unit2-assessment` at `8ab9f11fc55293b3700b91747a2c35ead410ca2a`. No new content, product feature, dependency, persistence redesign or production configuration change was needed. One narrow stale availability-copy correction and its browser assertion are included; details below.

### Git integrity and full scope

Fetched origin without pull/rebase/merge. Local Phase 2B and remote Phase 2B both resolve to the exact approved base above. Current `origin/main`: `d6d87d669ecbd284988fc5d8b51c4c933c342bb5`; merge-base is the same. Before this review commit, feature is **12 ahead / 0 behind**. There are no current-main-only commits and therefore no new main drift or expected textual merge conflicts. The linear parent chain contains repository skills (`97510374`), architecture (`26ea7dbb`, `9271cdc3`), Phase 1A (`cb7e2a48`), 1B (`56597b59`), 1C (`855d13ef`) and compatibility hardening (`a9801953`), 1D (`a4edc465`), 1E (`4919a823`), 1F (`9e85c1dd`), 2A (`f28f29e3`) and 2B (`8ab9f11f`). Every milestone is an ancestor; no merge commits, duplicate/cherry-picked milestone copies or accidental reversions were identified. Final source and regression coverage, rather than handoff alone, confirm cumulative behavior.

Full `origin/main...8ab9f11f` diff: **67 files, 13,512 insertions, 6 deletions**. Areas: original curriculum definitions and frozen architecture documents; pure contracts/graph validator/lesson engine; authenticated Learn lesson/unit/overview/check UI; course progress; assessment definitions, grading, immutable attempts, scoped registry/projections; tests/fixtures; generated route tree; repository-local six Karta skills and handoff. Shared approved integration: desktop/mobile Learn link, optional progressbar accessible label, lazy authenticated Learn gate/provider, deletion inventory and compiled test registry discovery. No unexpected runtime change found. Package/lockfile, migrations, Vite/Vercel/Firebase configuration, scheduler/FSRS, CardProgress, StudySet/card CRUD, grammar/Lesen/Paste progress, existing Home recommendations and auth identity/deletion algorithms are unchanged against main. Unrelated untracked local skills, `.codegraph`, `.firebaserc` and `.vercelignore` were preserved and excluded; untracked files are not repository deployment configuration.

### Architecture, storage and security verdict

All 16 requested invariants hold in source and relevant tests: lesson traversal is not evidence; checks are not mastery; repeats do not create independent families; U01/U02 histories and form selection/projections are isolated; guided U02 does not require U01 check success; assessment writes no courseProgress; traversal creates no EvidenceEvents; FSRS/grammar/Lesen/Paste remain independent; open lesson writing remains local/unassessed; raw assessment answers are not stored; unit completion is derived; no A1/CEFR mastery percentage is introduced; Units 3–10 have no authored/actionable lessons. Lesson step percentages are traversal only; existing vocabulary mastery presentation is unrelated.

New durable roots are exclusively `users/{verifiedUid}/courseProgress/{scopedLessonKey}` and `users/{verifiedUid}/assessmentAttempts/{attemptUUID}`. Browser contracts accept no owner. Seven APIs use existing authenticated middleware, which obtains identity from verified Better Auth/session (including existing signed gate identity integration) and enforces same-site/fetch metadata. Learn additionally rejects auth-off shared preview identity before Admin access. Strict runtime validation binds track/release/lesson or assessment/unit/form/family/version/UUID and owner. Assessment UUID-only reads resolve the stored authoritative definition; conflicting URL parameters cannot reinterpret it. No Firebase Admin client import or eager auth/server cycle was introduced; `.server.ts` dynamic boundaries and lazy gates remain intact.

Course schema 2 uses explicit `resumeContractVersion`; full `definitionHash` is diagnostic, never compatibility gating. Structural/grading/response meaning changes require authored compatibility bumps; copy edits do not. Schema 1 course prototypes are explicitly unavailable and left untouched. Revisions/transactions enforce stale-write rejection; up to 64 receipts bind operation ID/digest, evicted retries become stale. Historical completion survives repeat practice. Assessment schema 2 retains two lifetime writes (draft start, atomic accepted submit); immutable classified outcomes and embedded evidence share one record. Identical retries read existing truth; changed concurrent submissions cannot overwrite the winner. Known schema 1 U01 A records are interpreted read-only with legacy retry digests. No raw typed answer, stimulus/prompt snapshot or open writing is persisted in attempts. No new top-level root or hidden data migration.

**Learn requires no SQL migration, Firestore migration or Firestore composite index.** Reads use known document references and owner collection scans without filtered composite queries. Existing single-field owner query for deletion is unchanged. No production data was queried.

### Whole account deletion review

Existing account UI first removes learning data then identity; final identity endpoint independently repeats Firestore cleanup before SQL deletion, so client ordering is not trusted. `deleteLearningData` recursively deletes owner study sets and canonical `users`, `user_streaks`, `grammarProgress`, `lesenProgress` roots. Recursive `users/{uid}` removes orphan-parent subcollections, both new Learn roots, all four assessment families and embedded events; other owners are retained. Any Firestore failure stops identity deletion and permits retry. SQL deletes the verified user by parameter, cascading session/account rows via existing schema; connection-close failure cannot falsely report identity survived. No retention change or production deletion. Hermetic current broader deletion tests cover partial failure, retry ordering, SQL failure after cleanup, roots and nested collections; curriculum tests additionally cover course and both assessments.

### Build, dependencies, deployment and migration audit

`npm run build` = `node scripts/with-app-env.mjs vite build && npm run db:migrate`; **NOT RUN**. `build:compile` = `node scripts/compile-safe.mjs`: only wrapped Vite compilation, blanking database/Firebase/Gemini/Better Auth/XAI credential variables. No migrate/reset/deploy commands executed. Wrapper merges only client-safe `VITE_` app environment entries, explicit process overrides win.

Nitro is gated to build/preview, preset `vercel`, `serverDir: ./server` retains PWA middleware, `traceDeps: ["firebase-admin*"]` externalizes and copies server dependencies. Both repository Vercel configuration and Nitro functions request **fra1**. Produced `.vercel/output/static`, `functions/__server.func/index.mjs`, SSR modules and function metadata are present; runtime `nodejs24.x`, streaming handler `index.mjs`, fra1. Expected Learn/client routes and seven Learn server APIs compile; generated SSR syntax check passes. Client artifact scans find no private-key marker, Firebase Admin imports, Admin accessor or Firebase private-key environment name. No secret values were read or printed; safe compilation is not a proof of live credentials or IAM.

`package.json` and lockfile unchanged throughout approved chain. Local Node **24.20.0**, npm **11.19.0** match engines `>=24.20.0 <25` and packageManager. Installed package versions equal lock entries (no mismatches or missing nonoptional packages; `npm ls --depth=0` exits 0). Vite **8.2.2**, TanStack Start **1.168.60**, Router **1.170.41**, Nitro **3.0.260610-beta**, Firebase Admin **14.3.0** match lock. No install/update/version fix was performed. Existing large lexical-data bundle warnings remain; they are not a Learn regression.

Migration runner enumerates only top-level `.sql` files, records names in `_migrations`, runs each pending file in a transaction, rolls back errors and exits nonzero. Existing `0001_auth.sql` creates auth tables/indexes idempotently; `0002_account_issuer.sql` adds `issuer` with `IF NOT EXISTS`; nested auth source is not separately run. With DATABASE_URL configured, normal build can connect, create bookkeeping, apply either pending auth migration and change SQL schema even though Learn needs none. With no DATABASE_URL it skips. Version tracking/idempotent DDL is present, but no cross-build advisory lock or schema checksum is implemented: avoid simultaneous migration builds and inspect bookkeeping/backup before authorizing production deployment. Migration state was not queried. Choosing whether the normal build may run these existing migrations is an explicit deployment decision item, not a missing Learn migration.

Repository `vercel.json` only specifies fra1; it alone proves no project Git connection, production branch, dashboard build override, environment scope or auto-deploy policy. Subsequent read-only Vercel connector verification identified project `vocabapp-pro` (`prj_4FRfvQvAbEkADLGsrPqNLaLoMx9d`) linked by repository URL, framework Vite and Node **24.x**. Most recent READY production deployment `dpl_DgTq8vvs8rP4fmBmzrgcupd3FYu3` is **source git**, branch **main**, SHA **d6d87d669ecbd284988fc5d8b51c4c933c342bb5**, region **fra1**, production aliases attached and a rollback candidate. This proves a successful main Git production deployment, not the next push policy. Connector project/deployment responses do not expose dashboard build command, root/output overrides, environment scopes or current automatic-deployment toggle; no environment endpoint or value was read. **Vercel project-level deployment settings require live verification after this pre-merge review.** Remaining settings must be confirmed before a production-triggering push. Do not infer auto-deploy from CLAUDE.md. No settings, domains or aliases changed. Firebase repository configuration points to deny-all Firestore rules, covering future subcollections; Admin bypasses rules, therefore server identity/ownership and service-account IAM remain authoritative. No browser Firestore initialization found. Live deployed rules/IAM/project alignment require verification; local files do not prove deployed state.

### Environment contract (names only)

| Names | Classification / production expectation |
| --- | --- |
| `DATABASE_URL` | Required server secret for durable production Better Auth/Postgres; also enables normal-build migration. |
| `BETTER_AUTH_SECRET` | Required stable production server secret; source preview fallback is not production provisioning. |
| `BETTER_AUTH_URL` | Required production origin configuration, server-only but not a credential; verify public canonical URL/callbacks. |
| `VITE_AUTH_ENABLED` | Public client-safe flag; must resolve auth ON for durable Learn and agree client/server. |
| `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Required server-only Admin credentials for durable application data; never client variables. |
| `FIREBASE_STORAGE_BUCKET` | Optional server-side bucket override, not a secret; verify default bucket or override for card images. |
| `GEMINI_API_KEY` | Optional application server secret, required only for existing user-initiated AI features, not Learn. |
| `GEMINI_DAILY_CEILING` | Optional server-side budget override; existing bounded default, not a credential. |
| `GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, `GROK_AUTH_CLIENT_SECRET` | Existing broker configuration; issuer/client ID are nonsecret server config, client secret is server secret. Required per-app values for production broker OAuth; preview defaults do not prove deployment setup. |
| `GROK_PROJECT_ID`, `GROK_GATE_ORIGIN` | Optional existing gate identity integration config; project ID enables that path, origin determines verified gate issuer/JWKS. Not credentials. |
| `GROK_CONNECTORS_URL` | Optional existing server connector endpoint configuration; gated connector feature only. |
| `GROK_CONNECTOR_ACCESS_TOKEN` | Dev-only server secret fallback explicitly ignored in production; production connector token must come from verified gate request context. |
| `VITE_STUN_URLS` | Optional public client-safe STUN configuration for existing connectivity utility. |
| `VITE_PUBLIC_HOSTNAME` | Optional public client-safe PWA host/branding configuration. |
| `NODE_ENV` | Runtime/build mode supplied by tooling; not a secret. |

Browser/preview timeout/external-host environment names belong to local QA scripts, not required deployed app configuration. No environment files changed or values copied. Existing broker/gate behavior is not changed by this review.

### Performance and cost

A mounted authenticated Learn provider issues one deduplicated course request per mount/retry; backend `getAll` reads **eight authored lesson documents**, including missing rows, without writes. Navigating inside the mounted Learn layout reuses state; leaving/re-entering/reloading remounts and reads again. No listener, polling, per-keystroke persistence or hidden Home course read. Explicit bounded check/continue/restart each performs at most one progress-document write under transaction; open writing text never leaves the browser.

Unit entry latest/history each scans **N owner assessment documents**, including both units and drafts, then scopes in memory. New attempt start additionally reads eight course documents, UUID and transaction collection history. Draft start writes one document; final submit writes that same document once atomically with eight classified results/events. No per-answer writes or separate evidence/summary writes. Reads grow O(N), and selection transaction query can experience retry pressure; this is an accepted prototype limitation, not a measured scale guarantee. Future reviewed scoped queries/pagination/latest-family indexes may reduce cost without altering provenance/exact review. No premature optimization.

### Narrow correction and validation findings

Only runtime correction: unavailable/unknown lesson fallback still claimed two Unit 1 lessons despite eight authored lessons. Replaced that stale message with “Eight lessons are available across Units 1 and 2. More units are not yet authored.” Added an assertion to the existing unavailable/unknown browser scenario. No lesson content, grading, compatibility version, route behavior or design change. No wider polish was justified.

Focused curriculum/FSRS/review/foundation/grammar command (`node --import ./scripts/test-register.mjs --test src/lib/curriculum/*.test.ts src/lib/srs/scheduler.test.ts src/lib/review-plan.test.ts src/lib/foundation-hardening.test.ts src/lib/grammar-drills.test.ts`): **277 passed, 0 failed**. Includes course persistence, all U01/U02 assessment/phase tests and deletion isolation. Default `npm test` is inspected safe local Node test runners only: **210 script tests + 1,233 TypeScript tests passed, 0 failed**. Whole deletion partial-failure/SQL retry tests, gate identity tests and hermetic auth invariant script tests are included. `VITE_AUTH_ENABLED=true node scripts/check-auth-invariant.mjs --dev-url http://127.0.0.1:5199` also passes (dev/build sign-in on). Typecheck passes before and after correction. Final compile-only build and generated SSR syntax pass; scoped correction lint passes. `git diff --check` passes.

Full `npm run lint` fails with **6 errors, 42 warnings**. Compared to a read-only isolated archive of fetched current main using the same installed dependencies: **same 6 errors, 41 warnings**. Exact error messages/locations match: Playwright fixture callback named `use` misidentified as a React hook; existing app-data empty catch; two irregular-whitespace examples; two needless regex escapes in learning-signals tests. All are unchanged main files, non-blocking existing lint debt. Feature introduces one Fast Refresh mixed-export warning in Learn session context. Scoped full-feature lint (excluding generated route tree) has **0 errors, 1 warning**. No coverage deleted or lint rules suppressed to manufacture a pass. Installed dependencies were shared read-only with the archive; main was not modified.

Initial full dev `npx playwright test e2e/learn-*.spec.ts`: **79 passed, 1 failed**, 9.2 minutes. The mobile multi-recovery/hard-reload scenario hit its whole-test **30-second** budget while the page was loading; no incorrect persisted result or runtime exception was observed. Reran unchanged with one worker: same scenario passed **desktop 4.3s / mobile 5.1s**. Final corrected unavailable/unknown case passed on both projects. Follow-up command selected recovery, corrected availability and temporary navigation review: **6 passed, 2 failed**, with both failures solely a new temporary probe's incorrect assumption that existing login contains a `main` landmark; captured login already showed the correct Sign in heading and fields. Corrected that probe assertion to visible heading, without changing app: **4/4 temporary navigation probes pass**, covering Home, Grammar, Lesen, vocabulary Learn, 390px overview, back/forward without course writes, and signed-out Learn redirect with zero course reads. The hermetic readiness probe is retained as review regression coverage; generated screenshots/traces are not committed. Classification: original timeout is environment/test-time-budget sensitivity, temporary probe failures are test assumption mistakes; neither is a reproduced functional regression. Keep the timeout history visible rather than calling the initial full run 80/80.

### Conditional future merge/deployment procedure (blocked; not executed)

1. Preserve current main rollback reference `d6d87d669ecbd284988fc5d8b51c4c933c342bb5` and verified previous successful production deployment `dpl_DgTq8vvs8rP4fmBmzrgcupd3FYu3` (re-confirm live immediately before deployment). Confirm a clean tracked tree and fetch origin again. Re-check main and review-branch remote SHAs, merge-base and ahead/behind. This review branch must first be explicitly authorized for push; no push occurs here.
2. If origin/main is still the recorded ancestor, merge `codex/karta-premerge-production-readiness` into main with **fast-forward only**, preserving the approved phase chain and review fix: `git switch main`, `git merge --ff-only origin/main` to align local main, then `git merge --ff-only codex/karta-premerge-production-readiness`. Do not squash the approved milestone history. Any changed/drifted main or failed ff-only requires a fresh diff/integration review; no automatic conflict resolution/rebase. No conflict expected for the currently verified history.
3. Before pushing main, run `npm test`, `npm run typecheck`, full lint with explicitly recorded baseline debt plus zero-error changed-file lint, `git diff --check`, `npm run build:compile`, SSR syntax check, full dev Learn and full compiled Learn Playwright suites. Run sequential browser jobs against hermetic credentials and retain failures; do not invoke ordinary build/migrate during local validation. Verify final HEAD, scoped diff and absence of unrelated local files.
4. Before any main push that could deploy, verify live Vercel Git repository/production branch, build override, Node 24 runtime, fra1, environment scopes, ignored files and auto-deploy setting; verify service-account project/IAM and Firestore deployed deny-all rules. Inspect SQL `_migrations` and backup/recovery plan read-only; explicitly authorize either pending normal-build migrations or a project-level compile-only build choice. Never silently change dashboard build command. A production trigger is a main push **only if** live Git deployment is confirmed; otherwise use a separately authorized deployment. No deployment is presumed configured by repository docs.
5. Immediately after the authorized deployment: check health/SSR logs and sign-in/session reload/logout; complete bounded U01/U02 lessons on a designated disposable test account, reload/resume and check traversal without legacy writes; submit A/B/repeat, reopen exact UUIDs, test U01/U02 isolation and second-account access rejection; verify no raw answers/open writing stored, course/attempt schema/path correctness, mobile/dark focus/nav and legacy vocabulary/Grammar/Lesen/Paste flows. Verify live account deletion only on that explicitly designated disposable account, including both subtrees and auth identity, and inspect no production learner content. Confirm actual deployed rules/IAM, migration result, function region/runtime and costs/log failures. Live tests require their own authorization/environment; none ran during this review.
6. Rollback: retain the previous production deployment for authorized promotion/rollback, and preserve pre-Learn main SHA above. Any source rollback should be a reviewed forward revert, not force-push/reset of shared main. Deployment rollback does not undo SQL migrations or remove Firestore learner records; existing compatible data should be preserved. Stop rollout on auth/data isolation/deletion failure, SSR failure, unexpected migration or missing runtime dependency.


### Final compiled browser findings and decision

**NOT READY TO MERGE.** Final compiled command (`npx playwright test --config e2e/home-compiled.config.ts e2e/learn-*.spec.ts e2e/premerge-readiness-review.spec.ts`) completed with **82 passed, 2 failed**: all 80 Learn scenarios and both signed-out probes passed; desktop and mobile global-navigation probes failed at `/grammar`, whose rendered snapshot contained only the notifications region and no visible main content. The same legacy/navigation probes passed in dev. This is an unresolved compiled legacy-entry validation blocker, not a proven Learn-caused regression and not an assertion that production Grammar is broken. Do not merge until it is classified and resolved or proved to be a hermetic-test artifact. Coverage is retained; no failing assertion was removed.

A practical baseline comparison used an isolated archive of current main and the same installed dependencies, leaving main untouched. Its compile-only build passed, but the compiled preview crashed before the Grammar assertion with missing `_libs/pglite.data` in the blank-DATABASE_URL fallback; browser navigation failed with connection refused. Classification: baseline environment/artifact failure, inconclusive for Grammar regression attribution. Do not call that baseline a pass or claim Grammar is proven pre-existing. No artifact was copied into production output and no database credentials were substituted to bypass the safety seal.

Compiled Learn captures were visually inspected for overview, both units, lesson flows, checks, alternate/result and exact review, including mobile and dark 320px recovery/check states. No demonstrated Learn overflow, keyboard/focus, navigation clearance or exposed diagnostic metadata blocker was found; existing automated target/focus assertions pass. Signed-out Learn redirects before course reads. Existing vocabulary, Grammar and Lesen were rendered and visually inspected in dev; compiled Grammar remains blank in the navigation probe, and that failure prevents the subsequent compiled Lesen/vocabulary assertions. Those required compiled legacy-entry validations remain incomplete. Do not describe dev screenshots as compiled evidence. Prototype labels are intentional existing product wording, not debug IDs.

Smallest blocker-fix plan: (1) make the isolated-main compiled preview viable using the repository's safe hermetic path, investigating the missing PGlite runtime artifact without migrations or production credentials; (2) compare direct Grammar entry, navigation from Home, trailing-slash/index behavior and auth lazy-boundary hydration on main versus this branch; (3) if branch-only, narrowly repair the demonstrated routing/auth fault; if fixture/artifact-only, repair the hermetic harness without weakening assertions and document baseline evidence; (4) rerun the retained navigation probe on dev and compiled desktop/mobile, inspect compiled Grammar/Lesen/vocabulary screenshots, then rerun all 80 Learn compiled scenarios and relevant auth/type/compile checks for any shared-boundary change. Reissue the readiness decision before any merge. No speculative runtime repair was made.

The conditional merge/deploy plan above is prepared for a later passing review and is **not authorized or recommended to execute while this blocker remains**. Existing lint debt (six baseline errors), one new Fast Refresh warning, the initial dev timeout and O(N) assessment history cost are documented separately; they do not excuse the compiled legacy coverage gap. Live Vercel build/Git settings, environment scopes, Firestore rules/IAM and SQL migration bookkeeping remain deployment decision/verification items, not the reason for this local NOT READY decision. Final fetch still records origin/main at `d6d87d669ecbd284988fc5d8b51c4c933c342bb5` with no main-only drift. This review adds one commit, yielding 13 ahead / 0 behind if main remains unchanged. No merge, push, deploy, migration, production data query, environment edit or dependency update occurred.


## 40. Karta Pre-Merge Blocker Resolution — Compiled Grammar

Starting branch `codex/karta-premerge-production-readiness`, exact starting HEAD `c127ae5ba1c11139b6345a3f24ee31b051860a8e`; base Phase 2B remains `8ab9f11fc55293b3700b91747a2c35ead410ca2a`. Current-main baseline is `d6d87d669ecbd284988fc5d8b51c4c933c342bb5`. All six repository-local Karta skills remain discoverable; engineering/production-protection rules apply. No application source, dependencies, curriculum, migrations, persistence, auth identity rules or production configuration changed in this resolution.

### Audit before application changes (none made)

Initial compiled `/grammar` snapshot showed only the notifications region, with no visible hub/main. The same failure reproduced on isolated current main after making its preview viable. Browser page-error capture remained empty; console resource failures were expected blocked external fonts/branding, with no demonstrated lazy import rejection or hydration mismatch. Feature preview had no corresponding server runtime error; isolated main originally crashed on missing `_libs/pglite.data` before reaching the page assertion.

Captured SSR contained three successful route matches: root → `/grammar` parent → `/grammar/` index. Both client route chunks returned 200 and direct diagnostic module imports succeeded. The actual client router remained before hydration commit, with an empty match list and a live preflight; test-only instrumentation located the wait at Grammar index component preload. The only outstanding request was the existing **6,181,590-byte** `verb-conjugation-extended-data-DHVSp5q4.js` asset. Hence the parent/index relationship and Outlet were correct; a suspended preload, not an absent child or auth redirect, kept the hub from mounting. No auth-session request occurred until that preload completed.

The intended historical invariant remains unchanged: `971eb40a` split hub content into `grammar.index.tsx` and made `grammar.tsx` Outlet-only to stop hiding child drills. Root, router and these Grammar files are byte-unchanged from main. Generated route tree only adds Learn routes; Grammar nesting remains intact. Shared feature changes add Learn navigation, optional Progress aria-label and a lazy Learn provider in the established auth chunk. They do not explain a failure reproduced on main. Final actual browser navigation renders Lesen's distinct child content and returns to Grammar, confirming the Outlet invariant rather than merely reviewing its source.

### Root cause, transport proof and baseline packaging

**Classification: hermetic local compiled-preview transport/runtime artifact, not a Learn regression.** Direct localhost HTTP fetched the large compiled asset uncompressed in approximately 17 ms, and gzip in approximately 0.25 seconds. A Brotli-negotiated request (`Accept-Encoding: br`) received zero bytes/no headers before the five-second diagnostic timeout, while a small Grammar chunk with the same negotiation returned 200 in approximately 16 ms. Native compiled browser preload remained unfinished beyond 18 seconds. Disabling trace did not cure it. Forwarding the real compiled HTTP response with gzip completed the preload, caused router hydration to commit, triggered the existing mocked session lookup and visibly rendered the Grammar hub. This isolates the cause to large-asset negotiation/delivery in the local preview; no claim is made about a particular internal Brotli implementation bug or deployed production failure.

Main and feature asset bytes are identical: SHA-256 `342370f77a0720ad8e3d27c370dda404fc2ac8f77b63fb520bce06d886fbebb2`. The fix neither alters them nor substitutes content: compiled-only fixture handling matches this exact localhost asset family, fetches the real preview response with `accept-encoding: gzip`, disallows redirects, enforces a bounded request and status 200, then forwards that response. All API/server-function/off-origin seals and uncaught-error assertions remain. Actual deployment output routes `/assets/*` through the filesystem before the server catch-all; Vercel's static delivery is distinct from this local Vite/Nitro preview. Deployed delivery remains part of the already documented authorized live checks, not inferred proven here.

The separate isolated-main crash was also conclusively diagnosed: Nitro bundles PGlite into `_libs/electric-sql__pglite.mjs`, but its package's runtime data/WASM files are not adjacent to that bundle. Those files exist in the installed package; this is not an archive omission or working-directory/symlink fix. With blank DATABASE_URL, eager server import starts PGlite; successful initialization would then run the fallback's automatic SQL migrations, which this task forbids. No package assets were copied into production output and no fake/real DATABASE_URL was inserted.

`e2e/support/compiled-db-seal.mjs` is loaded only through the compiled Playwright web-server environment. It requires blank credential variables, satisfies the eager bootstrap slot and installs a never-ready fallback-instance sentinel, so no PGlite constructor, database queries or automatic migrations execute. Existing mocked browser sessions/server functions remain authoritative for hermetic QA; application auth checks are not disabled or rewritten. Any accidental SQL-dependent request cannot finish and fails its bounded test. The generated production artifact contains none of this preload or test-session content.

Baseline used the unchanged current-main archive at `/tmp/karta-readiness-main`, the same Node 24.20/npm 11.19 and read-only installed dependencies, equivalent compile/auth flags, blank credentials, preview startup, fixtures, viewport and assertions. Only the repaired QA config/support/new legacy spec were copied into that isolated archive; no main application file or actual main checkout changed. Final baseline legacy suite: **4/4 passed** (desktop and 390px mobile signed-in navigation plus signed-out Grammar). It covers direct `/grammar`, `/grammar/`, hard reload, Home link navigation, back/forward, Grammar → Lesen → Grammar, vocabulary Learn typed answer/check, return through set/Library to Home, and no unclaimed calls/uncaught page errors.

### Scope and validation

Changed files: compiled Playwright config (test-only preload), shared browser fixture (real gzip asset transport and callback renamed `use` → `provide` to avoid the existing false React-hook lint error), new compiled DB seal, new legacy navigation regression spec, and this appended handoff section. Application source is unchanged. The typed vocabulary answer additionally mocks/asserts the existing `updateSetSession` payload; it is not a new production write.

Intermediate new-test failures are retained in the audit history: initial new interaction assumed a multiple-choice control, while the seeded card correctly used typed production; one subsequent run rendered/navigated successfully but its teardown correctly rejected the previously unmocked `updateSetSession` bookkeeping call. The first exploratory navigation run was interrupted after the desktop assumption failure. The following eight-case run had **6 passed / 2 failed**, both missing that specific session mock. Corrected the test to use actual controls and assert the session payload; no product assertion, network seal or failing product coverage was deleted. These are test-assumption/fixture defects, not application regressions.

Final compile-only build passed; `.vercel/output` contains Grammar parent/index and server artifacts, generated SSR syntax passed. Client artifact scans found zero test-preload/session markers, Admin access functions, Firebase private-key names or private-key markers. No output patching, private environment values or test-only routing branches were introduced. Normal build **NOT RUN**; migrations **NOT RUN**; no merge/deploy/push.

Validation completion and readiness decision are recorded below after the final full compiled regression run.


### Final validation, visual evidence and re-decision

Final `npx playwright test --config e2e/home-compiled.config.ts e2e/learn-*.spec.ts e2e/legacy-navigation.spec.ts e2e/premerge-readiness-review.spec.ts`: **88 passed, 0 failed**, 6.1 minutes. This is all **80 compiled Learn scenarios**, four legacy navigation/signed-out Grammar cases and four retained global-navigation/signed-out Learn probes. Both units, A/B checks, exact UUID review, durability, conflicts/idempotency, privacy, unknown IDs and legacy vocabulary regressions remain passing. Final fixtures reject unclaimed API/server-function calls and uncaught browser errors. Main baseline is independently **4/4** as recorded above.

Compiled captures at `screenshots/compiled-legacy/grammar-desktop.png`, `grammar-mobile.png`, `lesen-desktop.png`, `lesen-mobile.png`, `vocabulary-desktop.png`, `vocabulary-mobile.png` were visually inspected. These are final compiled evidence, not earlier dev screenshots. Grammar renders the real hub on desktop/390px mobile; Lesen renders its separate level entry; vocabulary displays its existing typed-answer flow and the interaction test checks a correct answer. Back/forward, fixed mobile navigation, return Home and overflow checks pass. Captures/logs are local ignored QA artifacts and are not staged. Existing Learn mobile/dark/recovery visual and keyboard/target coverage remains passing in the full compiled run.

After final harness changes: focused curriculum/course/assessment/Phase 2A/2B/FSRS/review/foundation/grammar suite **277 passed, 0 failed**; `npm test` **210 script + 1,233 TypeScript tests passed, 0 failed**; `npm run typecheck` passed; changed-file ESLint **0 errors, 0 warnings**; `git diff --check` passed. Full lint retains **5 errors, 42 warnings**, versus recorded unmodified main **6 errors, 41 warnings**: five exact unchanged main errors remain (empty catch, two irregular whitespace, two unnecessary escapes). Callback rename in the touched fixture removes the sixth false hook error; no lint suppression or coverage removal. One pre-existing feature Fast Refresh warning remains. An earlier full-lint invocation overlapped browser trace cleanup and failed reading a disappearing generated trace resource; reran after that browser job stopped to obtain the actual result above. Classification: transient QA-artifact filesystem race, not source regression.

Final `npm run build:compile` and `node --check .vercel/output/functions/__server.func/_ssr/ssr.mjs` pass. Client and server artifact scans find no test preload/session markers; client finds no Admin/private-key markers. Normal build and migrations **NOT RUN**. No production data/service queries, credential values, deployment/settings changes, application fixes or dependency upgrades. Full dev Learn is not rerun in this task because application source is unchanged and the repair is compiled-test-only; prior section 39 records the initial 79/80 dev run, unchanged passing recovery rerun and passing dev navigation probes without concealing that timeout.

**READY TO MERGE — classification A.** The previous sole blocker is cleared: the failure reproduced on current main, was isolated to the hermetic compiled-preview large-asset delivery plus separate baseline fallback packaging, and both main and feature now visibly render Grammar/Lesen/vocabulary with the same safe repaired harness. Full compiled Learn and static/domain regressions pass. No application runtime workaround was introduced.

Final fetch confirms `origin/main` and merge-base remain `d6d87d669ecbd284988fc5d8b51c4c933c342bb5`, approved remote Phase 2B remains `8ab9f11fc55293b3700b91747a2c35ead410ca2a`, and no main-only drift appeared. Starting review HEAD is 13 ahead / 0 behind; this single blocker-resolution commit makes **14 ahead / 0 behind**. Tracked changes are only the five QA/handoff files listed above; all unrelated untracked skills/CodeGraph/Firebase/Vercel files are preserved.

Reuse section 39's conditional **fast-forward-only** strategy after explicit authorization: refresh/verify remote refs, align local main with `git merge --ff-only origin/main`, then `git merge --ff-only codex/karta-premerge-production-readiness`, retaining phase history. Changed main or a failed fast-forward requires a fresh integration review. Before main push, repeat the documented validation, including these compiled legacy probes. Do not run ordinary build/migrate as local validation. Preserve rollback SHA `d6d87d669ecbd284988fc5d8b51c4c933c342bb5` and verified previous production deployment `dpl_DgTq8vvs8rP4fmBmzrgcupd3FYu3`.

READY is a local merge decision, not permission to push/deploy. Section 39's Vercel Git/build/environment scopes, live Firestore rules/IAM and SQL migration-bookkeeping/build-coupling verification items remain. **Vercel project-level deployment settings require live verification after this pre-merge review.** After an authorized deployment, verify actual static delivery of Grammar's large asset plus Grammar/Lesen/vocabulary and the already documented auth/resume/assessment/isolation/deletion checks on a designated disposable account. No merge, push, migration or deployment occurred here.


## 41. Karta Postlaunch Lesson UX

Branch `codex/karta-postlaunch-lesson-ux`, based exactly on deployed main `a77fac171473abc83a80229e0ea7785291ce7a02`. All six repository-local Karta skills are discoverable and applied where relevant. Audited every typed task in all eight authored lessons.

Bounded lesson text now carries explicit `answerLanguage: "de"`; only those inputs use deterministic ä/ae, ö/oe, ü/ue and ß/ss equivalence. NFC, whitespace and terminal punctuation handling remain. Case-sensitive noun tasks still require capitals. Choice answers, other-language/unmarked text, open writing and assessment grading are unchanged. Eleven sentence blanks additionally accept exact completed sentences: Ich bin Emil.; Du bist Lina.; Ich habe ein Telefon.; Du wohnst in Berlin.; Ihr lernt Deutsch.; Sie lernen Deutsch.; Meine Bücher sind groß.; Das sind keine Bücher.; Das ist kein Buch.; Du liest.; Nora schläft. No fuzzy matching, substring grading or AI. Missing-form prompts are explicit; multi-sentence input labels are clarified; the corrected-message field is Adjective and feedback specifies groß/gross.

Guided bounded tasks keep first-failure feedback, expose structural Hint after two failed checks and Show answer after three. Retry returns input focus. Reveal is local, unassessed and visually neutral; it neither changes the learner's wrong response nor writes a synthetic correct answer. The existing server continuation rule permits traversal after three checked failures using existing attempts/checked fields; revisions, receipts, transactions and completion derivation remain unchanged. Reload before continuing restores the real failed response and permits reveal again. No assistance flag or new durable schema/path, collection, migration or index. Authored resume contracts stay stable because old positions/responses remain safely restorable; diagnostic definition hashes naturally change.

The reusable German-character helper inserts/replaces at the cursor/selection, returns focus, supports pointer and keyboard activation and enforces input length. Its four targets are at least 44px. It appears only on relevant lesson text/open-writing controls, never choices, numeric/date fields or Unit Checks. Open writing remains ephemeral/unassessed. Home has one lazy authenticated German A1 start/continue/revisit surface, secondary to Today's work; one owner-scoped course read per Home mount, deduplicated during effect replay, reuses existing course projection/API. Vocabulary recommendation ranking and FSRS are not touched.

Final focused domain validation: 216 passed (lesson/content/normalization, course persistence/receipts, U01/U02 assessment families/privacy). Typecheck passed. Scoped lint: 0 errors, two pre-existing warnings (session-provider Fast Refresh and unused Home cn import). Diff-check, build:compile and generated SSR syntax passed. Final combined compiled UX plus existing U01/U02 assessment smokes: 12/12 passed; additional corrected true-dark-media/44px-target rerun: 2/2 passed. Browser fixtures retain blank credentials, no production database, network seals and migration sealing. Full historical mega-suite, normal build and migrations NOT RUN. No deploy/push.

Visually inspected fresh compiled normal typed, first wrong, structural hint, neutral shown answer, character helper, corrected-message adjective, Home start/continue, 390px mobile and actual dark 320px captures in ignored screenshots/postlaunch-ux. One polish pass removed misleading success coloration from assisted traversal. Capture setup was corrected to wait for hydration and use actual dark media. No demonstrated overflow, target-size or focus issue remains. Remaining debt: deliberately finite accepted sentences, lightweight hints rather than task-authored tutoring, and physical-device/IME/virtual-keyboard behavior not verified. No new proficiency/mastery claim, Unit 3, assessment content or persistence redesign.

Files changed:
- `CODEX_HANDOFF.md`
- `e2e/learn-postlaunch-ux.spec.ts`
- `e2e/support/backend.ts`
- `src/components/home-course-continuation.tsx`
- `src/components/learn/exercise-response.tsx`
- `src/components/learn/german-characters.tsx`
- `src/components/learn/lesson-screen.tsx`
- `src/components/learn/session-context.tsx`
- `src/content/curriculum/german-a1-details.ts`
- `src/content/curriculum/german-a1-entities.ts`
- `src/content/curriculum/german-a1-information.ts`
- `src/content/curriculum/german-a1-lesson.ts`
- `src/content/curriculum/german-a1-unit2.ts`
- `src/lib/auth/gates.tsx`
- `src/lib/curriculum/course-progress.ts`
- `src/lib/curriculum/home-course.ts`
- `src/lib/curriculum/lesson-hint.ts`
- `src/lib/curriculum/lesson-session.ts`
- `src/lib/curriculum/postlaunch-ux.test.ts`
- `src/lib/curriculum/types.ts`
- `src/routes/index.tsx`

## 42. Karta Unit Challenge v1

Base: `c6310dc0363aca03ed3273b4dc28b3ced185ca16` (main). Branch: `codex/karta-unit-challenge-v1`. All six repository-local Karta skills were discoverable and applied where relevant. Scope is authored German A1 Units 1 and 2 only; no Unit 3 content.

Unit pages offer Learn the unit and a secondary Test out of this unit. Challenge purpose is explicitly `unit-challenge`: progression clearance, not lesson completion, Unit Check evidence, mastery or CEFR proficiency. Separate original A/B forms have eight items each. Unit Check items/families and eligibility remain unchanged. Existing authenticated server-function middleware, transaction patterns, bounded German normalization and recursive account deletion are reused; assessment evidence semantics are not overloaded.

Passing rule: **8/8 correct**, so every represented functional outcome must satisfy its deterministic response contract. Existing bounded normalization accepts German keyboard fallbacks, whitespace and terminal punctuation; the Unit 1 article/noun task preserves capitalization. No percentage/mastery language. Failed submissions provide an aggregate count and a link to review the unit's lessons, with no per-item correctness, answer keys or teaching reveals. Server-enforced **24-hour** retry interval, then the next A/B form; an active draft is resumed rather than rerolled. Form B is an alternate arrangement, not a psychometrically calibrated proficiency instrument.

Persistence:
- `users/{verifiedUid}/unitChallenges/{encoded JSON [trackId, releaseId, unitId]}`: strict schemaVersion 1, contractVersion 1, purpose, owner and scope, revision, attemptCount, clearedAt, activeAttemptId, lastAttemptId, retryAfter.
- Nested `attempts/{UUID}`: same validated owner/scope/version/purpose, server-assigned form, draft/submitted state, timestamps, passed, aggregate correctCount and submission digest. **No raw response history**, prompts, keys, lesson steps or evidence persisted.
- Reads create nothing. Start transactions assign one authoritative active attempt even across concurrent tabs or lost acknowledgement. Submission atomically fixes immutable attempt truth and updates the unit summary; identical reordered-payload retries are idempotent, changed-payload retries rejected, competing submissions cannot overwrite the winner. Clearance is not downgraded.
- Material form/grading/response-contract changes require a challenge contractVersion update; copy changes alone do not. This is a new prototype schema, with no migration or alteration of durable lesson progress.
- Course response adds derived `challengeClearances`; persisted course records are untouched. No new root/collection outside the owned user subtree, no composite index. Existing recursive user deletion removes summaries and all nested attempts; the canonical inventory now names unitChallenges. Firestore remains deny-by-default, and every challenge API authenticates the server user without a client owner field.

Coverage (eight items per form, 32 authored items overall):
- U01: identity statement; sein/subject agreement; article+noun capitalization; yes/no question; identity question word; number extraction; date extraction; possession and description.
- U02: regular verb agreement; group/polite forms; plural noun agreement; possessive reference; description negation; noun-identity negation; stem-changing verbs joined by und; reading a corrected detail and revising a sentence.

Guided course/Home progression considers historical completion of the unit's lessons **OR** successful challenge. U01 clearance advances to U02; clearing U02 ends at the last authored unit and does not expose Unit 3. Lessons remain individually Available/In progress/Finished according to actual acknowledgements and can be studied optionally. A failed challenge leaves study available. Challenge success alone does not enable a lesson-gated Unit Check. No lesson traversal, completion, FSRS, vocabulary, grammarProgress, lesenProgress, Paste or existing Unit Check writes.

Validation:
- 243 focused curriculum/foundation tests pass, including 16 challenge tests: scoring/pass/fail, payload validation, reload, concurrent start/submit, idempotency, owner/unit/release isolation, cooldown/alternate retry, mixed historical/challenge navigation, unchanged lesson state and pre-existing legacy/check records, recursive deletion.
- 8 compiled challenge browser tests pass across desktop/mobile: both units, reload, next-unit and Home navigation, unchanged lesson counts and check eligibility, failure without keys, delayed alternate form, lost acknowledgements, 390px mobile and 320px dark viewport. Existing postlaunch UX/check regressions: 8 pass. Browser harness seals backend traffic and credentials and prevents migrations.
- Typecheck, scoped ESLint (0 errors, one existing session-context Fast Refresh warning), build:compile and compiled SSR `node --check` pass. Fresh task/unit/success/failure/mobile/dark captures visually inspected. Task headings receive keyboard focus; mobile targets and horizontal overflow checks pass. Physical-device keyboards/IME and psychometric validity were not assessed.
- An initial new browser assertion expected the unit label Not started on individual lessons; corrected to their existing truthful Available status. A static auth test now expects the additional verified-owner clearance read. Final runs are green.

Files: challenge contracts/API/server/grading; server-only authored forms; challenge screen/route and generated route tree; derived course/Home navigation and Learn provider/overview/unit/lesson integration; user deletion inventory; focused challenge/browser fixtures/tests and one course API wiring assertion; this handoff. No normal build, migration, deploy, push or merge performed.
