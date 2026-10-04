# Karta pre-merge technical review

Date: 2026-10-04. Branch: `codex/preprod-foundation-hardening`.
Review starting HEAD: `e45a9194ea083c2a69c79acc19da8becb940731f`.
Base/main: `2f3e680e438626e7759162c79f1afeafad229d16`.

## 1. Merge recommendation

**APPROVE WITH MINOR CAVEATS**, after the review commits and final validation recorded below.

The five review decisions are resolved. Full-set transfers retain atomic content
and current memory; current client/session references follow a move. The existing
20-round weighted metric is retained. Legacy bit histories are ignored without
fabricating answer order. Account identity deletion now enforces prior learning
cleanup on the server. Concrete UI/accessibility defects and missing behavioral
coverage were fixed.

Caveats: persistence/failure tests use isolated storage fakes, not live Firestore
or Postgres. Maximum transfer deployment latency, request bytes/index overhead and
physical iOS behavior were not measured. Firestore's byte/time limits still apply.
Account deletion is ordered and retryable, not a transaction across databases;
there is no write fence against another authenticated tab deliberately creating
new data during deletion. These are stated limits, not claimed verification.
No production records, migrations, resets, credential changes, merge or deployment occurred.

## 2. 100-card transfer decision

### Previous behavior

`study-sets.ts`'s `transferSchema.cardIds.max(100)` rejected both copy and move
before their handlers. It was a server validator/safety policy, not a UI cap or
Firestore's own 100-card limit. The picker allowed selecting every card.
The prior report justified 100 with an assumed 500-write transaction ceiling:
100 vocabulary rows + up to 200 article/case rows + set/profile writes.

That ceiling is obsolete. Firestore removed the commit/transaction write-count
limit on 2023-03-29. The installed Admin dependency is `@google-cloud/firestore`
8.7.1; its write-batch implementation has no 500-write guard. See the official
[release notes](https://docs.cloud.google.com/firestore/docs/release-notes).
Document size remains 1 MiB, API request size 10 MiB, transaction time 270 seconds
with 60-second idle expiry. The separate 500 **field transforms per document**
quota is not a count of documents; a transfer deletes one cache field and updates
ordinary fields. See [Firestore quotas](https://firebase.google.com/docs/firestore/quotas).

### Limit inventory and final behavior

| Surface                            | Limit and enforcement                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create/edit/plain text card import | Server `cardsSchema`: 2,000 cards, bounded card fields, unique IDs. Plain text parser/editor adds no 100-card cap.                                                        |
| Karta JSON import                  | `karta-import.ts`: 2–200 cards; submitting goes through the same create validator. Thus even a valid 200-card import previously could not transfer in full.               |
| AI-generated vocabulary            | Generate request 6–50; response 4–50. This is its separate generation budget.                                                                                             |
| Copy selected cards                | 1–2,000 unique single-segment IDs; owned target; owned/public readable source. Target after append ≤2,000. Fresh IDs/owner flags.                                         |
| Move selected cards                | Same cardinality; both sets owned. Identity, flags and current memory stay together in one commit.                                                                        |
| Copy a public set                  | Copies the source's whole embedded card array with new IDs; no separate 100-card cap. Existing persisted source/document limits apply.                                    |
| Session passes                     | Up to 2,000 served IDs; cap schema ceiling 10,000, effective cap always clamped to current set size. Session size is not set/transfer size.                               |
| Existing cleanup chunking          | Summary reads 300; progress/reset/orphan deletion batches 400; removed references 100 cards × 3 rows. These conservative batch sizes are internal implementation choices. |
| Grammar/Lesen Paste                | 10/15/20 grammar questions; 5 reading questions. Separate exercises, not vocabulary-card transfers.                                                                       |

`MAX_SET_CARDS` is shared by create/edit, transfer validation and the transfer
planner. Transfers reject same source/target, duplicate or absent IDs and target
collisions/overflow before writes. The service reads only the selected card's
three possible current rows (vocabulary, article, case), in groups of 300, rather
than every historical progress row for the source set. Copy does not read progress.

A move writes source and target documents, up to 6,000 existing current rows
(`setId` only), and one user cache/session patch. Copy writes target + user patch.
All reads precede writes. **One atomic commit**, not a series of partial moves:
write chunking is unnecessary under the actual Firestore contract and would break
identity consistency. Oversized document/request or timeout failures remain atomic
failures; 2,000 is a count ceiling, not a guarantee that arbitrarily large card text
fits a Firestore document. No schema/layout migration was introduced.

### Tests

The actual storage service transfers 2,000 cards with all 6,000 progress/drill rows
in one commit, reads ≤300 references at a time, preserves counters and rejects
2,001 IDs/target overflow. A separate maximum-copy test mints 2,000 distinct fresh
identities and leaves source progress intact. Commit failure rolls every change
back. Concurrent overlapping moves retry membership and succeed exactly once.
These are storage-boundary tests, not a live maximum-size benchmark.

## 3. Move identity/progress decision

**Same logical card, current owner memory follows it. Historical context stays historical.**

| Data                                                   | Move behavior                                                                                                  | Reason                                                                                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embedded card ID/content/enrichment/note/flags         | Remove selected ID from A, append same card to B atomically                                                    | A rename/duplicate term cannot substitute for identity.                                                                                               |
| `cardProgress` / scheduler / mastery / miss counters   | Preserve every field, update existing caller row `setId` to B                                                  | The same learner keeps memory, due dates, reviews and article/case miss counts. Missing row stays fresh.                                              |
| `articleDrillProgress/{cardId}` and `{cardId}:case`    | Preserve counters/kind/time; update `setId` to B                                                               | These are current independent practice counters, not historical event context.                                                                        |
| `reviewEvents`                                         | Leave old event `setId` as A                                                                                   | The event happened in A. Future reviews use B.                                                                                                        |
| `articleDrillErrors`                                   | Leave old error `setId` as A                                                                                   | Append-only mistake provenance.                                                                                                                       |
| Source `setSessions`                                   | Remove moved and no-longer-member served IDs, retain cap                                                       | Removed cards cannot remain in A's pass.                                                                                                              |
| Target `setSessions`                                   | Retain cap/other current served IDs; clear moved IDs and stale membership                                      | Newly arriving cards can be served in B even after A→B→A→B.                                                                                           |
| Late session write / deleted set                       | Transaction checks readable current set and filters served IDs to membership; missing/inaccessible set rejects | A stale round cannot repopulate moved references after the move.                                                                                      |
| Server TodaySummary                                    | Delete derived cache inside content transaction; rebuild on next read                                          | Pool eligibility can change when source/target crosses the two-card threshold. No post-commit delta can double-apply after a concurrent rebuild.      |
| Client TodaySummary                                    | Clear then refresh via existing store action; failed refresh uses the existing local-derived fallback          | No stale Home count after a successful move/copy.                                                                                                     |
| Client loaded progress                                 | Replace selected rows with committed returned rows, discard selected stale rows absent on server               | Already-loaded B does not hide carried memory; cached A references do not survive.                                                                    |
| Client library/public-set cache                        | Apply returned source/target cards and timestamp                                                               | Own/public views reflect the same committed content.                                                                                                  |
| `loadedProgressSetIds`                                 | Keep load markers; returned moved rows are installed directly                                                  | A loaded destination does not need a second query to discover memory.                                                                                 |
| Weak routing / library/mastery summaries               | Derive using current embedded membership and card-ID memory; moved card resolves B                             | `buildLibrarySession`, `summarizeLibrary`, `masteryStats` need no competing index.                                                                    |
| Orphan cleanup                                         | Current moved row points to current B membership, so it is kept                                                | Changing only content would otherwise mark it as an orphan under A.                                                                                   |
| Frozen open route/review/drill snapshot in another tab | May still display its snapshot; stale A review/drill persistence rejects transactionally                       | Do not silently write a historical A response into B or reset scheduling. Reload opens current membership. No cross-tab realtime transport was added. |
| Set IDs / share IDs / languages / folder               | Set metadata stays with each set; card acquires destination context                                            | A card is moved, not the set or its public route. No new provenance field is fabricated.                                                              |
| `completedSets`, XP/achievements/daily stats/streak    | Historical paid/earned ledger stays unchanged                                                                  | Movement is not a new review and does not revoke previously paid awards. Existing once-per-set completion policy is unchanged.                        |
| Other learners' progress on a public source            | Not rewritten into the owner's destination                                                                     | Learners do not gain access to a private destination; their historical context remains. Copies have independent IDs.                                  |
| Grammar/Lesen/Paste/writing histories                  | Unchanged                                                                                                      | No current card membership references requiring relocation.                                                                                           |

Tests exercise persisted A→B memory, both drill rows, unchanged history, duplicate
terms moving only selected ID, source membership rejection and target acceptance,
weak review entry resolving B, library target B, mastery from retained memory,
orphan retention, target pass availability and late source pass filtering. Client
projection is the production helper called by the store, not a copied test algorithm.
No backward ID or historical event migration is needed.

## 4. Accuracy model

Keep **last 20 completed rounds**, weighted by question count:

```text
window = append({correct,total}).slice(-20)
accuracy = round(100 × sum(window.correct) / sum(window.total))
totalAttempts = previous lifetime questions + this round.total
```

The denominator belongs to the retained rounds, not to lifetime attempts or an
invented sequence of 20 answers. Round boundaries stay complete. Tests cover:

| Example                                   | Calculation                         | Result                                 |
| ----------------------------------------- | ----------------------------------- | -------------------------------------- |
| A: 20 × 5, each 4 correct                 | 80/100                              | 80%, 20 stored rounds                  |
| B: 20 × 20, each 19 correct               | 380/400                             | 95%, 20 stored rounds                  |
| C: 5/5, 5/10, 10/15, 10/20                | 30/50                               | 60%; not mean of per-round percentages |
| D: perfect 20 then failed 20              | 20/40                               | 50%                                    |
| D: perfect 20 then failed 5               | 20/25                               | 80%; a shorter failure weighs less     |
| E: oldest 0/20 + nineteen 5/5, append 0/5 | Drop the entire 0/20; retain 95/100 | 95%, exactly 20 rounds                 |

Inputs: integer `0 ≤ correct ≤ total`, integer `1 ≤ total ≤ 50`; stored new-round
history is checked for the same bounds. Lifetime counts are safe nonnegative
integers; an absent legacy count starts at zero. Corrupt present counters/new
round history still produce an explicit operation error, not guessed data repair.
Fixed grammar and both Paste services use the same fold. Paste verifies saved
question count and durable round receipt.

The AI assessment previously said accuracy was “over” lifetime questions. It now
labels rolling accuracy and lifetime participation separately, with the up-to-20
completed-round denominator explained. The formatter has a regression test.
Grammar hub/Paste summaries read stored accuracy and lifetime count, not raw history;
no alternative accuracy computation was found in their read paths.

## 5. Legacy/reset behavior

For normal old fixed/Paste records with `recentResults` but no `recentRounds`:

1. GET summary/full-topic/AI assessment reads still return existing stored summary
   fields and content. The old stored accuracy remains visible before any new round.
   They never parse/convert the old history array, so its absence of new history
   does not crash the UI.
2. First new completed round ignores `recentResults`, starts `recentRounds` from
   empty and calculates accuracy solely from that new round. Existing lifetime
   attempts remain; missing attempts now start from zero. Fixed topic identity is
   stamped from the submitted validated topic key.
3. Merge leaves the old inert `recentResults` field physically present until reset.
   It never contributes to new accuracy. Tests cover both service families, including
   history-only learning state with a missing lifetime counter.

This is **safe ignore + graceful initialization**, not migration. Old stored
accuracy may be synthetic until the first new write, so **reset is recommended
for a clean disposable-test baseline, not required for application compatibility**.
A document missing its exercise content is not made into a usable Paste exercise;
no questions are fabricated. Invalid present new-history/counter fields are
reported as save failures. No automatic clearing of real data occurs.

The reset entrypoint defaults to dry-run, requires explicit project and validated
UID, lists four recursive roots (`users`, `user_streaks`, `grammarProgress`,
`lesenProgress`) and owned `study_sets` IDs, and executes only with the exact
project:UID confirmation. `users` recursion includes progress/events/drills/Paste
and nested receipts/feedback/preferences. SQL identity, other users and global
AI caches/`ai_usage` are retained. It is not wired into startup/build and loads no
dotenv file; credentials are supplied privately in the operator's environment.
The two reset option tests pass. No dry-run or execution connected to Firestore here.

Owner command for later, after separately selecting the disposable test account:

```sh
node scripts/reset-karta-test-data.mjs --project PROJECT_ID --uid TEST_USER_ID
# Inspect the dry-run inventory first. Actual deletion is a separate explicit action:
node scripts/reset-karta-test-data.mjs --project PROJECT_ID --uid TEST_USER_ID --execute --confirm PROJECT_ID:TEST_USER_ID
```

## 6. Account deletion robustness

UI order remains learning cleanup → final account endpoint → local sign-out.
The final endpoint **also calls the shared idempotent learning cleanup before
issuing SQL DELETE**, so a client cannot reverse the order by calling it directly.
The direct `pg` pool avoids importing the complex shared db/migration module;
server-only lazy boundaries and production compilation still pass.

| Failure                                                      | Behavior and recovery                                                                                                                                                                                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firestore query/recursive deletion fails, possibly partially | Propagate failure; no SQL deletion. Login survives; explicit retry repeats owned-set and all root/subtree cleanup.                                                                                                                           |
| Firestore completes, SQL fails                               | App data gone, auth survives unless the database committed despite a lost response; UI reports partial failure and offers retry. No success is silently claimed.                                                                             |
| SQL-first then Firestore failure                             | Previous final endpoint permitted direct SQL-first calls. Now prevented: the server runs cleanup first.                                                                                                                                      |
| SQL deletion succeeds, pool close fails                      | Safe diagnostic; connection-close failure does not claim account deletion failed.                                                                                                                                                            |
| Account deletion acknowledged, local sign-out fails          | UI says account was removed and sign-out failed, rather than asking to repeat auth deletion.                                                                                                                                                 |
| Cleanup repeats after partial/full cleanup                   | Missing parents/subtrees are harmless; nested orphan subcollections are still recursively removed. SQL DELETE of a missing ID is harmless. After successful auth removal, a new authenticated retry is normally unavailable and unnecessary. |

The storage-boundary tests inject Firestore failure, verify SQL was not called,
then retry to completion; inject SQL failure after all app roots/owned sets are
gone, then repeat cleanup safely. They include a receipt under absent parent
documents and confirm foreign sets/global caches survive. Actual SQL cascade to
session/account rows was inspected in `migrations/auth/0001_auth.sql`, not run.

No cross-system atomicity is claimed. If a response is lost after SQL commit,
the client cannot distinguish success from failure; cleanup has already run.
Concurrent creation from another tab between cleanup and SQL is not fenced; the
owner should close other sessions before deliberately deleting the account.
No distributed transaction or job queue was introduced.

## 7. Additional defects found

- Transfer policy used an obsolete platform limit and prevented full valid imports.
- Loaded client memory, public content and Today cache were not updated with moved
  references; target served history could hide a card moved back into that set.
- A late source session write could reinsert moved IDs; it lacked current membership
  validation. Transfer's post-commit summary deltas could double-count if a reader
  rebuilt the invalidated cache before those deltas ran.
- Calling the final account endpoint directly could delete auth before cleanup.
  Post-delete sign-out/pool-close failures were liable to be mislabeled as deletion
  failure.
- Replacing a nested button with `div role=button` still put speech controls under
  a button role; the deck shortcut also swallowed their Enter/Space activation.
  Native sibling controls fix both valid structure and activation semantics.
- Session preset/slider targets were too small on mobile. The old test could measure
  before profile-dependent controls appeared; it now waits for that slider.
- An absent legacy lifetime counter rejected the first new completed round.
- AI assessment wording incorrectly used lifetime questions as the rolling denominator.

B1 no-match injection is correct and general: add `0` only when some target
requires it and it is absent. Existing option labels/content remain. Every bundled
matching target is reachable, and both option-reuse cases pass actual tap tests.
No B1-specific rewrite was needed. Mobile editor diacritics/no-plural label already
meet the coarse-pointer 44px contract and were retained.

## 8. Changes made during review

| File                                                               | Review change                                                                                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/card-identity.ts`                                         | Shared 2,000-card ceiling; bounded/nonempty transfer planner and indexed membership lookup.                                                        |
| `src/lib/input-schemas.ts`                                         | Shared transfer validator aligned with full set capacity.                                                                                          |
| `src/lib/card-transfer.server.ts`                                  | Extract actual atomic storage operation; bounded selected-row reads; both pass patches/current membership session writes; return committed memory. |
| `src/lib/study-sets.ts`                                            | Wire tested service/validator/session writer; return committed state; rely on cache invalidation/rebuild rather than post-transfer deltas.         |
| `src/lib/transfer-client.ts`                                       | Production client projection of current content, memory, passes and cache invalidation.                                                            |
| `src/lib/store.ts`                                                 | Apply committed move projection/public cache; clear and refresh Today on copy/move.                                                                |
| `src/lib/account-deletion.server.ts`                               | Shared recursive inventory cleanup and enforced learning-before-identity orchestration.                                                            |
| `src/lib/delete-account.ts`                                        | Use shared learning cleanup without scope change.                                                                                                  |
| `src/lib/delete-auth-account.ts`                                   | Server cleanup gate before SQL; safe pool-close diagnostics.                                                                                       |
| `src/routes/account.tsx`                                           | Distinguish acknowledged deletion from subsequent sign-out failure.                                                                                |
| `src/lib/learning-progress.server.ts`                              | Initialize absent legacy attempt count; stamp fixed topic key; share tested idempotent Paste save transaction.                                     |
| `src/lib/grammar-paste-topics.ts`, `src/lib/lesen-paste-topics.ts` | Call actual shared save transaction; retain validators/content/retry contracts.                                                                    |
| `src/lib/progress-window.ts`                                       | Accuracy evidence formatter separates rolling accuracy and lifetime attempts; formula unchanged.                                                   |
| `src/lib/grammar-assessment.ts`                                    | Correct rolling/lifetime evidence wording and denominator explanation.                                                                             |
| `src/components/flash-card.tsx`                                    | Native sibling flip/speech controls with keyboard focus indicator.                                                                                 |
| `src/components/study-deck.tsx`                                    | Yield activation keys to focused native controls.                                                                                                  |
| `src/components/session-length.tsx`                                | 44px coarse-pointer preset/slider hit areas.                                                                                                       |
| `src/lib/premerge-review.test.ts`                                  | Behavioral storage/client/selector/maximum transfer/concurrency/rollback/window/legacy/deletion/Paste-save regressions.                            |
| `e2e/review-grading.spec.ts`                                       | Observe card container; exercise native flip/speech focus and Enter/Space independently; desktop/mobile screenshots.                               |
| `e2e/review-queue.spec.ts`                                         | Observe visible card content independent of flip-control markup.                                                                                   |
| `e2e/touch-targets.spec.ts`                                        | Wait for profile-dependent session slider before hit-testing.                                                                                      |
| `PREPROD_HARDENING.md`, `CODEX_HANDOFF.md`                         | Supersede obsolete transfer/deletion/accessibility/legacy review notes.                                                                            |
| `PREPROD_HARDENING_REVIEW.md`                                      | This review and final recommendation.                                                                                                              |

Test quality: earlier identity/planner tests are valid pure tests but did not exercise
persistence/current references. The new suite calls production services over a
storage-boundary fake with read-before-write checks, recursive semantics, atomic
rollback, map merge and optimistic retries. It does not implement transfer or
learning algorithms in mocks. It also calls the actual client projection and
routing/mastery/orphan selectors. Paste save tests now call the actual shared
save transaction, including concurrent retries, content collision and preserving
already-earned learning state. Existing receipt concurrency tests remain.

Browser backend mocks intentionally isolate real services; they prove UI lifecycle,
transport payloads and retries, while server transaction tests prove persistence
semantics. Native CDP touch gestures and real tap placement remain; no synthetic
DOM event dispatch replaced them. Existing source-text assertions provide guardrail
coverage only and are not used as evidence of transactional behavior. No good test
was rewritten wholesale.

## 9. Validation

All results below were executed against the final source. Node 24.20.0, npm 11.19.0.
No dependency reinstall/version change was necessary during this review.

| Exact command                                                                                                           | Final result                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ls --depth=0`                                                                                                      | Exit 0; no invalid/missing direct dependency. Additional read-only installed-package/lockfile version comparison: 0 mismatches.                                           |
| `npm run typecheck`                                                                                                     | Exit 0; zero TypeScript diagnostics.                                                                                                                                      |
| `npm test`                                                                                                              | Exit 0; 210 script tests + 836 TS tests = **1,046 pass**, zero fail/skip.                                                                                                 |
| `npm run build:compile`                                                                                                 | Exit 0; client, SSR and Nitro/Vercel production compilation. No migration/deployment; existing large-content chunk warnings remain.                                       |
| `node --import ./scripts/test-register.mjs --test src/lib/premerge-review.test.ts src/lib/foundation-hardening.test.ts` | Exit 0; **28 pass**, zero fail/skip. Covers all five decisions, source/target selectors, maximum transfer, concurrency, rollback and actual Paste save/receipt semantics. |
| `node --test scripts/reset-karta-test-data.test.mjs`                                                                    | Exit 0; **2 pass**, zero fail/skip; no Firebase initialization/network.                                                                                                   |
| Targeted Playwright command below                                                                                       | Independent targeted run: exit 0; **18 pass, 10 desktop touch-only skips**, zero fail, 28 combinations.                                                                   |
| `npm run test:e2e`                                                                                                      | Final frozen-source run: exit 0; **73 pass, 11 desktop mobile-only skips**, zero fail; 84 combinations. Desktop: 31 pass/11 skip; Pixel 7 mobile: 42 pass/0 skip.         |
| `git diff --check` and `git diff --cached --check`                                                                      | Exit 0; no whitespace errors.                                                                                                                                             |

Exact independent targeted command:

```sh
npm run test:e2e -- e2e/review-grading.spec.ts e2e/touch-targets.spec.ts e2e/learning-foundation.spec.ts --grep 'flips|native flip|every control|menus and dialogs|matching: tap'
```

An intermediate targeted browser run found the small session controls (1 failed,
17 passed, 10 skips); those controls and the test's readiness condition were fixed.
The independent final targeted run above was clean before the full suite. Earlier
passing full runs were followed by one more complete run after all source edits,
so final results are not attributed to an older build or partially edited source.

Desktop/mobile native-control screenshots were inspected together:
`screenshots/premerge-review-desktop.png`, `screenshots/premerge-review-mobile.png`.
Both show readable content, no overlap and valid touch layout. The browser harness
reports no uncaught page errors/unclaimed server functions or API calls. It blocks
off-origin requests and runs with backend credentials blank in the child test
process; project environment files were not modified. Expected injected failure
and unauthenticated warm-up diagnostics are not production incidents.

Final local logs: `/tmp/codex-review-dependencies-final.log`,
`/tmp/codex-review-type-final.log`, `/tmp/codex-review-tests-final.log`,
`/tmp/codex-review-build-latest.log`, `/tmp/codex-review-targeted-final.log`,
`/tmp/codex-review-reset-final.log`, `/tmp/codex-review-browser-targeted-final.log`,
`/tmp/codex-review-browser-completed.log`. Screenshots/test traces remain ignored.
`npm run build` was never used: that script includes `db:migrate`.

## 10. Final Git state

- Branch: `codex/preprod-foundation-hardening` throughout.
- Validated implementation HEAD: `8143577082dc09f9197c1595a8f1f82bed2accdb`.
- Review commits: `81435770 fix: resolve pre-merge transfer, deletion and accessibility defects`,
  followed by `docs: record pre-merge hardening review and validation` containing this
  report and the two updated handoff documents. The final HEAD is that documentation
  commit (direct child of the validated implementation); its exact hash is recorded
  in the delivery message. This avoids putting an impossible self-referential commit
  hash into its own committed file.
- Tracked working tree is clean after the report commit. Overall status is **not
  empty**: pre-existing `.agents/`, `.codegraph/`, `.firebaserc`, `.vercelignore`
  remain untracked and untouched. Local `.env.local` remains ignored, never staged.
- No push; no squash; original six hardening commits remain.
- `main` remains `2f3e680e438626e7759162c79f1afeafad229d16`; no merge or modification.

## 11. Merge checklist

- [ ] Approve move-preserved memory, historical event/award provenance and current
      session/cache behavior; set completion remains the existing once-per-set policy.
- [ ] Approve full valid-set transfers (up to 2,000 cards, target capacity and actual
      Firestore byte/time constraints still apply).
- [ ] Approve the question-weighted last-20-completed-round metric.
- [ ] Decide whether to reset the disposable test account for a clean metric baseline;
      reset is optional for compatibility and must be a separately authorized manual action.
- [ ] Accept hermetic validation/physical-iOS/live-backend limitations and inspect the
      review commits. Merge/deploy require a separate explicit instruction.
