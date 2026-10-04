# Karta preproduction foundation hardening

Date: 2026-10-04. Base: `2f3e680e438626e7759162c79f1afeafad229d16`.
Branch: `codex/preprod-foundation-hardening`. Review before merging.

Pre-merge review supersedes the transfer/deletion/UI caveats below. See
`PREPROD_HARDENING_REVIEW.md` for the final contracts and fresh validation.

## 1. Scope and outcome

This phase fixes evidenced identity, concurrency, Paste lifecycle, deletion,
validation and test-environment problems. It preserves the existing feature set,
auth providers and custom scheduler parameters. No production data was queried
or reset, production credentials changed, database migrations run, or deployment
started.

## 2. Clean environment baseline

Node 24.20.0 and npm 11.19.0 were observed and recorded. `npm ci --ignore-scripts`
aligned the installation to the existing dependency lock. No dependency versions
were changed. The lockfile change records the Node engine only.

A fresh archive of the base commit, using the newly installed dependencies,
established the actual baseline before attributing results to code fixes:

| Check | Original stale installation | Base source after npm ci | Hardened branch |
| --- | --- | --- | --- |
| Typecheck | 7 diagnostics | 5 diagnostics | 0 diagnostics |
| Script tests | 195 pass / 13 fail | 195 pass / 13 fail | 210 pass / 0 fail |
| TypeScript tests | 771 pass / 1 failed file | 771 pass / 1 failed file | 819 pass / 0 fail |
| Production compile | Missing dnd-kit | Pass | Pass |
| Playwright | Not run in original audit | First execution found stale mocks | 71 pass / 11 mobile-only desktop skips |

Installing removed the two dnd-kit type failures and production compile failure.
The remaining five diagnostics were OAuth API typing and four unused seed shape
errors. The OAuth popup now invokes the same configured Better Auth HTTP handler,
without assuming a conditional plugin endpoint exists in its inferred API type.
Seed data now carries required ownership/public fields and no obsolete mastery.

Script tests retained their template behavior coverage, with isolated OG fixtures;
project-specific tests now assert Karta's enabled auth and active auth migration.
The TS test runner discovers every `.test.ts` under `src`, including previously
omitted Kurdish and article/case tests. Its small TypeScript loader handles `@/`
and TSX without adding another dependency.

## 3. Card identity

| Operation | Contract |
| --- | --- |
| Create/editor draft | Allocate an opaque ID once; retain it through saving. Missing IDs are allocated server-side. |
| Edit/rename/enrichment/languages | Preserve explicit card ID, progress and independent duplicate-term cards. |
| Duplicate term | Allowed. Each logical card has its own ID. Duplicate IDs are rejected. |
| Copy/public-set copy/import | New identities; no source mastery, stars or exclusion flags carried over by copying. |
| Move | Preserve IDs and flags. Atomically move embedded cards and change vocabulary and article/case progress `setId`. |
| Remove/delete | Remove current cardProgress, article/case counters and session references. Historical review/error events remain until account deletion. |

`indexCardDrafts` replaces the normalized-term matching heuristic. Editors already
send IDs. Omitted imageUrl now retains the prior image, matching note/example
preservation. Create/edit reject IDs already present in the caller's other sets.
Edits detect a concurrently changed set rather than silently overwriting it.
Transfers enforce access/membership, target capacity, unique IDs and distinct sets.
Transfers now accept up to the same 2,000 cards as a valid set; target capacity
stays 2,000. Firestore removed its old 500-write ceiling in 2023. Selected
progress/drill documents are read in groups of 300; all writes remain one atomic
transaction, subject to Firestore document/request byte and time limits.

TodaySummary remains a derived cache. Create/edit/transfer invalidate it inside
the content transaction; the next read rebuilds it. It is never identity or
learning truth. Transfer removes moved IDs and stale membership from both session passes;
the target pass may serve them normally. Late session writes validate current
set membership inside a transaction. The client applies returned memory/session
state, updates library/public content caches and refreshes Today. Historical
event `setId` is provenance,
not rewritten when a card moves.

## 4. Persistence and schema changes

| Location | Old → new |
| --- | --- |
| grammarProgress/{uid}/{topic field} | `recentResults: number[]` → `recentRounds: {correct,total}[]` |
| users/{uid}/grammarPasteTopics/{id} | Same round-window change; caller supplies stable save ID |
| users/{uid}/lesenPasteTopics/{id} | Same round-window change; caller supplies stable save ID |
| Each Paste topic / roundReceipts/{roundId} | New immutable completion receipt: correct, total, createdAt |
| lesenProgress/{uid} | Same schema; transactional per-level completion union |
| study_sets/{id}.cards | Same stored shape; ID-based editing and identity-preserving moves |

Accuracy is exactly `round(100 * sum(correct) / sum(total))` over the last 20
**completed rounds**, weighted by question count. It is not the last 20 individual
answers. The server receives counts and cannot truthfully reconstruct answer
order. `totalAttempts` remains lifetime questions, not number of rounds.
Timestamps are epoch milliseconds; local daily review keys and UTC streak keys
retain their existing distinct semantics. No timezone/SRS redesign is included.

Old synthetic bit histories cannot be reconstructed. Resetting disposable test
learning data is recommended for a clean metric baseline, not required to run.
Old history is ignored; the next write starts the new round window. Missing
lifetime counters initialize to zero. No guessed chronological migration runs.
Older counters may
continue until reset, but that mixed metric state is not the recommended rollout.

## 5. Transactions and retry behavior

`learning-progress.server.ts` centralizes the small transaction operations:

- Fixed grammar: read latest topic, advance exact round history/totals, merge just
  that topic. Concurrent different topics and same-topic rounds do not overwrite.
- Bundled Lesen: read and union completion IDs within the transaction; retries do
  not duplicate completion IDs. Submitted passage must belong to the selected level.
- Paste: read topic and durable receipt, write topic and receipt together. The same
  round ID/result is a no-op on retry; the same ID with different counts is rejected.
- Reviews: retain scheduler/event/daily/profile transaction; set access and card
  membership are checked inside it, protecting against concurrent removal/move.
- Article/case counters: access and membership are checked transactionally; the
  existing increment semantics and independent scheduler behavior remain.

Fixed grammar has no exactly-once retry token. Two genuine finished rounds count
separately. Vocabulary review retains its existing append-only event behavior;
this phase does not invent a durable client retry queue or alter scheduler semantics.

## 6. Paste lifecycle

The route explicitly validates, saves, enters saved practice, or displays failure.
The exercise stays closed until a stable topic ID has been persisted. The learner
can retry failed saves; retry reuses the pending ID. Server save is idempotent and
rejects a reused ID with different content. New submissions allocate new IDs.
Stale save responses cannot open a reset/replaced session.

Every opened/reopened round has a new receipt ID. Grammar's Practice again also
starts a new receipt. Progress failure displays a toast and a retry control with
the original topic/round/count payload. Successful retries never double-count.
Deleting a saved topic recursively removes its receipt subtree. Paste never writes
fixed grammarProgress or bundled lesenProgress.

## 7. User-data deletion and reset

Canonical inventory: `src/lib/user-data-inventory.ts`.
Account deletion removes owned study_sets (public included), and recursively:

- users/{uid}: profile/preferences/sound, XP/achievements/completedSets,
  setSessions/TodaySummary, cardProgress, reviewEvents, dailyStats,
  articleDrillProgress/articleDrillErrors, both Paste histories and nested receipts,
  aiFeedbackLog.
- user_streaks/{uid}.
- grammarProgress/{uid}.
- lesenProgress/{uid}.

The existing separate Postgres endpoint deletes Better Auth user identity and
its cascading sessions/accounts, after repeating Firestore cleanup server-side.
A direct final-endpoint request cannot skip learning cleanup. Neither endpoint deletes other users' independent
copies. Global `ai_usage`, generated-set/card/example caches and bundled content
are retained. Firestore and Postgres deletion remain two operations, not a claimed
cross-database transaction. The UI must report partial deletion failures.

Explicit reset command (not run during this task):

```sh
node scripts/reset-karta-test-data.mjs --project PROJECT --uid USER_ID
```

This is a read-only dry-run. It lists only the scoped roots and owned set IDs.
Execution additionally requires `--execute --confirm PROJECT:USER_ID`. Credentials
must be explicitly present in the environment; the script does not load dotenv.
It deletes the selected Firestore test library/profile/history, preserves SQL login
and shared caches, then the same account can recreate/import sets. Do not run it
against another user's data or as part of build/startup. Retrying a partial reset
is safe. Options and exact confirmation are unit-tested without connecting Firebase.

## 8. Runtime validation and diagnostics

Validated document IDs cannot contain path separators. Card arrays have bounded
content/enrichment fields and unique IDs; metadata patches reject unknown fields.
Canonical language validation covers every supported language code. Review ratings,
response time and date shape retain their existing schemas. Round counts must be
integers with `0 <= correct <= total <= 50`. Paste questions have distinct options,
valid indices and the same count/blank rules as the import UI. Transfer identifiers,
permissions and membership are checked before writing.

`diagnostics.ts` emits fixed operation labels and an allowlisted error kind.
It never logs error messages, payloads, UID, tokens, secrets, or AI responses.
Authenticated operation failures and progress transactions are observed server-side.
Review/Paste/grammar/Lesen failures surface actionable client feedback. Gemini and
cache failure logs no longer dump provider response bodies or private prompt data.
No third-party analytics or new durable diagnostic collection was added.

## 9. Browser regressions

Hermetic backend mocks now model current TodaySummary using the real pure summary
function, rather than an obsolete response shape. The old home copy assertion was
updated to the existing due/new label. Server transport mocking remains functional
after dependency alignment. Every unclaimed API/server function and uncaught page
error fails the harness; off-origin requests are blocked and server credentials blank.

New tests cover A1/A2/B1/B2 completion counters, incomplete prioritization (85%
preference preserved), shuffled choices/correct-answer remapping, final Continue,
Back, single/multiple matching, sentence insertion, long-page tap placement, inline
touch-action, pointer dragging and CDP native touch gestures on Pixel 7.
Both Paste modes cover invalid JSON, delayed save, failed save, same-ID retry,
failed progress/retry, completion, history reopen and deletion, and isolation.

Tests found and fixed a real B1 omission: target answer `0` had no selectable option.
`matchingOptions()` supplies “0 — No matching option” only when needed. Matching
chips expose aria-pressed; insertion gaps have stable accessible labels. Review's
flip button and speech buttons are separate native controls. The deck's keyboard
shortcut yields Enter/Space to focused controls, so speaking does not flip. The mobile editor diacritic buttons and no-plural checkbox label
now meet the existing 44px test contract. Session length presets/slider also have
44px coarse-pointer targets; the test waits for profile-dependent controls before
measuring. Desktop/mobile screenshots were visually inspected.

## 10. Future LearningSignals read model

A future read-only aggregate can load the verified learner's existing sources:

| Signal | Existing authoritative source |
| --- | --- |
| Vocabulary memory/mastery, due/overdue/new | cardProgress + current embedded cards + scheduler/queue pure selectors |
| Article/case mistakes | separate articleDrillProgress counters and articleDrillErrors, with review miss counters as historical context |
| Grammar accuracy/recency | grammarProgress; separately labeled user Paste histories |
| Lesen level coverage | bundled lesenProgress + bundled denominators; Paste accuracy remains distinct |
| Writing error categories | aiFeedbackLog structured error tags; provenance/promptId preserved |
| Activity/streak | reviewEvents/dailyStats and user_streaks; local-day vs UTC distinction explicit |
| Learner preferences | user profile explanationLanguage/direction/dailyGoal/timeZone |

LearningSignals should be a query/read model, derive ratios/weakness on demand,
carry provenance and observation time, distinguish no evidence from zero accuracy,
and never write new mastery or competing recommendation metrics. TodaySummary is
a cache, not a truth source. No adaptive engine/dashboard is implemented here.

## 11. SRS assessment

The custom scheduler uses FSRS concepts: difficulty/stability, a power forgetting
curve, target retention, grade-conditioned stability growth and lapse handling.
Its weight object, growth formulas, interval ceiling, learning transitions and
mastered state are custom. Product masteryScore/Leitner boxes are additional
presentation policies, distinct from the scheduler's mastered state.

Current `CardProgress` stores state, stability, difficulty, intervalDays, dueAt,
reps/lapses, lastReviewedAt and scheduler name. `ReviewEvent` stores identifiers,
rating, server reviewedAt and optional responseTimeMs; it does **not** snapshot
prior/next memory state or the parameter version. Chronological events can support
replay where complete, but exact old parameter sets and deleted/reset card history
cannot be recovered from current progress alone. Additional provenance would be
needed for reliable model comparison/tuning; none is fabricated in this phase.

No weights, retention, intervals or scheduler behavior changed. Existing fields
are useful but not proof of drop-in ts-fsrs compatibility. Future migration needs
explicit field/state/rating mapping, timestamp precision/unit checks, handling of
custom mastered state, replay/comparison on historical events, scheduler/version
provenance, and a policy for existing scheduled due dates. Model tuning needs
chronological per-card actual timestamps, grades, elapsed time, prior state and
lapses (including first encounters); elapsed reconstructed from dueAt/interval is
not equivalent to a full upstream review log. More representative users/history
are needed before fitting parameters. Pin upstream version and evaluate retention
calibration before making any migration.

## 12. Validation results

| Command | Exact result |
| --- | --- |
| `npm ci --ignore-scripts` | Exit 0; installed committed versions |
| `npm ls --depth=0` | Exit 0; no missing/invalid direct dependencies |
| `npm run typecheck` | Exit 0; zero diagnostics |
| `npm test` | Exit 0; 210 script tests + 819 TS tests, all pass |
| `npm run build:compile` | Exit 0; client/SSR/Nitro Vercel production compilation |
| `npm run test:e2e` | Exit 0; 71 pass, 11 intentionally skipped, zero fail |
| Desktop project | 30 pass; 11 mobile-only tests skipped |
| Pixel 7 mobile project | 41 pass; zero skipped/fail |
| `git diff --check` | Exit 0 |

The browser suite contains 82 project/test combinations. There were no unhandled
backend mocks or uncaught page errors. Expected simulated failures emit only safe
operation diagnostics. Desktop/mobile full-page matching screenshots were inspected.
Playwright dev-server warmup intentionally has no authenticated session and can
emit Unauthorized diagnostics; test pages use the hermetic authenticated harness.
Build retains existing large-chunk warnings for dictionary/content bundles; no
migration or deployment is part of compilation.

Validation logs are local `/tmp/codex-hardening-final-*.log`; screenshots are
ignored under `screenshots/`. No credentials or real Firebase data are in fixtures.

## 13. Remaining limits / review before merge

- All Firestore transaction tests are hermetic. No destructive/live Firebase test
  or live OAuth broker/production auth check was authorized or performed.
- Existing vocabulary reviews remain fire-and-forget with visible failure feedback,
  not an offline durable queue or exactly-once retry architecture.
- Cross-store account deletion is retryable but not atomic across SQL/Firestore.
- Native CDP touch regression exercises Chromium's touch pipeline; physical iOS
  Safari behavior is not inferred from that result.
- Review the changed round accuracy meaning, move-preserved learning state, tighter
  Paste server payloads, full-set atomic transfers and scoped reset plan before merge.

## 14. Git/review status

Work is committed only on `codex/preprod-foundation-hardening`. The branch is not
pushed, and main is not merged or modified. The original six logical commits cover validation,
identity/validation, progress/Paste, deletion/diagnostics, browser/unit regressions
and documentation. Existing `.agents`, `.codegraph`, `.firebaserc`, `.vercelignore`
and local credentials are preserved; they were not staged. `.env.local` is ignored.

Before merge, review the accuracy metric/reset plan, move-preserved learning state,
tighter Paste validation, transfer cap and complete deletion scope. Execute no
reset/deployment until separately authorized.
