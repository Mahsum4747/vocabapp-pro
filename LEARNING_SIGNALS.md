# LearningSignals foundation

Read-only derived model for future recommendation/progress consumers. Branch:
`codex/learning-signals-foundation`, based on production main `088be3e0`.
No collection, persisted score, migration, UI feature, cache, AI request or SRS
change. No recommendation eligibility/ranking is implemented.

## Entry points and boundary

- `get-learning-signals.ts`: `getLearningSignals()` authenticated GET server
  function, no input. Uses same-site/bearer/session middleware and explicitly
  requires an actual session (rejects auth-off development fallback). Identity and
  current time come from the server. Session and middleware identity must agree.
- `learning-signals.server.ts`: Firestore adapter; projects raw data into input.
  All query failures propagate, rather than returning misleading zero signals.
- `learning-signals.ts`: `buildLearningSignals(input)` pure deterministic
  transformation; injectable time and bundled passage identity for tests.
- `grammar-curriculum.ts`: existing Hub CEFR mapping extracted unchanged, shared
  with the Hub. Display names humanize IDs; they are not guaranteed localized Hub
  titles. Unknown stored fixed-topic IDs are not invented as curriculum topics.

No existing Today/profile/progress API is called: some read-looking helpers
rebuild summaries/prune orphan rows. This adapter contains only document/query
reads and count aggregation. No result is stored. No consumer UI calls this new
server function yet; the existing store module re-exports it so compilation
discovers the server-function transport. Future consumers import the function
directly or through that public API.

## Sources of truth

| Domain | Existing authoritative source | Derivation |
| --- | --- | --- |
| Vocabulary pool | owned `study_sets` embedded cards | `isStudiableSet` + `isCardActive` |
| Memory | `users/{uid}/cardProgress` | existing new/weak/queue/mastery functions |
| Recent reviews | `reviewEvents`, newest 100 by reviewedAt | `isCorrectRating`; historical context retained |
| Article/case | `articleDrillProgress` and cardProgress miss counters | independent attempt/correct/miss counts, not summed together |
| Fixed grammar | `grammarProgress/{uid}` | stored accuracy, lifetime attempts, recentRounds, last practice |
| Grammar Paste | user `grammarPasteTopics` | separate `source: paste`, never curriculum mastery |
| Bundled reading | `lesenProgress/{uid}` + bundled LESEN_PASSAGES | unique valid passage IDs by level |
| Overall reading accuracy | fixed grammar topic `lesen` | no level-specific attribution |
| Lesen Paste | user `lesenPasteTopics` | separate saved-topic accuracy and level |
| Writing | user `aiFeedbackLog` structured errorTags | last 20 persisted feedback entries |
| Activity | `dailyStats`, `user_streaks`, user settings | local day review activity, UTC streak |
| Preferences | user profile | existing `readLearningPrefs` defaults |

## Vocabulary definitions

Pool is the same as library review/Today: owned non-reference sets with at least
2 embedded cards (`isStudiableSet`), then active cards (`isCardActive`, missing
status means active). One-card/reference sets and excluded/archived cards omitted.
Card IDs, not terms, identify memory; duplicate terms remain separate. Only rows
matching current set/card membership contribute; orphan/wrong-set rows are ignored
in memory, never deleted. Moves retain current memory, historical event set IDs
remain historical.

- New/reviewed: `masteryStats` → `hasBeenReviewed` → inverse of canonical `isNew`
  (`totalReviews > 0`). This is not queue's fresh band.
- Due/overdue: `summarizeLibrary` → `reviewSummary`/queue banding. Due includes
  overdue; overdue is strictly more than 24 hours after dueAt. New state/null due
  rows remain fresh-priority under the existing queue policy.
- Weak: `isWeakWord` (two existing weakness signals); not the queue's weak band.
  This includes weak cards also due; Home's cached weak-at-rest count differs by
  design. No new weakness policy introduced.
- Mastered: existing `MASTERED_SCORE` = 80; average is existing rounded
  `masteryStats.percent` over all active pool cards, null for an empty pool.
- Recent accuracy: last 100 persisted user review events, percent, hard/good/easy
  correct and again wrong. Includes the learner's historical/public/deleted-set
  context; not a claim about just current active cards. Window count/time returned.
- Drill misses = attempts minus correct for current active cards, with article
  default kind and independent case kind. `reviewMissCount` separately exposes
  existing vocabulary-row articleMissCount/caseMissCount used by weak routing.
  Never sum these two measurements: they can describe the same miss.

## Evidence, recency and grammar

Central `evidenceLevel(n)`: none=0, low=1–9, medium=10–29, high=30+.
These are transparent participation bands: one short session supplies low evidence,
multiple question rounds supply more. They are not calibrated confidence,
mastery thresholds or recommendation eligibility. Exact sample counts travel with
signals so the future engine can make its own documented selection rule.

Vocabulary uses reviewed-card count, drill evidence uses attempts, reading uses
unique completed passages, writing uses recent submissions with valid structured
errors. Grammar/Paste uses recent question count when valid recentRounds exists;
otherwise lifetime participation is explicitly labeled as legacy fallback evidence.
`accuracy` remains the stored authoritative summary. Last up-to-20 complete rounds
provide `recentAttempts`/`recentRounds`; lifetime attempts are never its denominator.
Legacy recentResults is not reconstructed. Corrupt history yields unavailable
recent evidence, not a data repair. Missing lifetime count means 0, not a guess.

Grammar lists 26 fixed topics (including overall Lesen), plus separate Paste topics.
There are no weakest/strongest arrays or arbitrary confidence-weighted scores.
Accuracy, evidence, sample counts, source, CEFR and lastPracticedAt allow future
ranking to distinguish 100%/1 question from 90%/100 questions. No time-decay score.

## Reading and writing limitations

Bundled level completion intersects persisted IDs with that level's actual bundled
IDs and deduplicates them; unknown/obsolete IDs cannot inflate completion.
A1/A2/B1/B2 denominators come from source, never hard-coded. Accuracy is null at
every level: only generic `lesen` accuracy is stored. Completion denotes finished
passages, not necessarily correct answers. Lesen Paste never changes these counts.

Writing window = latest 20 persisted feedback records by createdAt; ties in the
pure model break by ID. TotalReviewedSubmissions is count of saved feedback rows,
not all drafts/submissions or every successful feedback call (logging best-effort).
Counts include valid category/severity pairs only: raw occurrences, distinct
submissions, minor/major breakdown and lastSeenAt. No excerpt/text inference.
Categories are the existing nine ERROR_CATEGORIES; unknown/malformed tags ignored.

`submissionRate` deliberately null. Missing errorTags cannot distinguish old rows,
WriteIt, tagless correct feedback, or unstructured feedback; a truthful denominator
of fully categorized submissions is not persisted. Counts/evidence reflect observed
categorized errors, not proof that untagged submissions were correct. No dominant
ranking or AI is used. Older history beyond this window is not analyzed.

## Activity and unavailable metrics

Use profile timeZone (existing readUserSettings default UTC) to choose today's local
calendar key and previous 29 calendar keys; DST handled with calendar-day arithmetic.
Invalid runtime IANA name falls back to UTC and reports the effective zone. These
keys index dailyStats written using the browser's local-day key. Profile timezone
may differ from the browser timezone used for historical writes; old keys cannot be
reconstructed. No silent timezone migration/unification.

Active day means dailyStats.reviews > 0, not every grammar/reading/writing interaction:
those domains do not persist a unified daily activity ledger. reviewsToday and
uniqueWordsToday come from that local-day row. Goal ratio clamped 0..1; counts retain
actual overachievement. Current streak reuses readStreak with todayUTC. Streak day
remains UTC. **longestStreak=null**: authoritative streak data doesn't store an
all-time maximum; 30 local-day docs cannot establish an all-time UTC maximum.

## Read pattern and performance

One profile document read, then 12 parallel read operations (no card/topic N+1):

- five scans: owned sets, current progress, article/case progress, both Paste histories;
- bounded reviewEvents (100), bounded projected aiFeedbackLog (20);
- three single docs: grammarProgress, lesenProgress, user_streaks;
- one getAll of 30 dailyStats document refs;
- one feedback count aggregate.

Conceptually 34 fixed document reads, all returned documents from the five scans,
at most 120 history documents, plus count aggregation billing. Empty queries/missing
docs still cost reads; this is a conceptual shape, not a billing estimate. Paste
projections omit question/text payload, writing projection omits learner sentences,
feedback and excerpts from the returned model. No new indexes/config were added;
queries use existing owner/single-field history ordering and count.

Largest scaling risks: embedded set docs, library/progress and unbounded saved Paste
history scans, and feedback aggregate count over long history. Derivation uses
existing queue sorting, O(cards log cards), other scans linear. Thousands of cards
need bounded query count rather than thousands of network calls. No persistent
summary cache is justified yet. Parallel reads are not one cross-document atomic
snapshot; concurrent learning/moves can yield a transient mixed observation. The
read never repairs/cleans data; retry obtains a new observation.

## Next layer

Consumers call `getLearningSignals()` instead of querying Firestore, and can test
recommendation logic with typed LearningSignals fixtures. Preserve domain units,
source/evidence/recency and null unavailable metrics. No global score, ranking,
adaptive navigation, AI plan, recommendation UI, notifications or FSRS tuning.

## Final model (TypeScript)

The types below are the exported model; input and deterministic helpers live in
`src/lib/learning-signals.ts`. All accuracies/mastery/completion are 0..100,
goalProgress is 0..1, times epoch milliseconds.

```ts
export type AccuracySignal = {
  accuracy: number | null;
  lifetimeAttempts: number;
  recentAttempts: number | null;
  recentRounds: number | null;
  evidence: EvidenceLevel;
  evidenceBasis: "recentQuestions" | "lifetimeQuestions";
  lastPracticedAt: number | null;
};
export type GrammarTopicSignal = AccuracySignal & {
  topicId: string;
  source: "curriculum" | "paste";
  displayName: string;
  cefrLevel: string | null;
};
export type ReadingLevelSignal = {
  totalPassages: number;
  completedPassages: number;
  completionPercent: number;
  lastPracticedAt: number | null;
  accuracy: null;
  evidence: EvidenceLevel;
};
export type WritingErrorSignal = {
  category: ErrorCategory;
  count: number;
  submissionsWithError: number;
  submissionRate: number | null;
  severity: { minor: number; major: number };
  lastSeenAt: number | null;
};
export type DrillSignal = {
  /** Existing vocabulary-row miss counter; independent of drill attempts. */
  reviewMissCount: number;
  attempts: number;
  correct: number;
  misses: number;
  accuracy: number | null;
  lastPracticedAt: number | null;
  evidence: EvidenceLevel;
};
export type LearningSignals = {
  generatedAt: number;
  vocabulary: {
    totalActiveCards: number;
    reviewedCards: number;
    newCards: number;
    dueCards: number;
    overdueCards: number;
    weakCards: number;
    masteredCards: number;
    averageMastery: number | null;
    evidence: EvidenceLevel;
    recentAccuracy: number | null;
    recentReviewCount: number;
    lastReviewedAt: number | null;
    dominantWeaknesses: { article: DrillSignal; case: DrillSignal };
  };
  grammar: { topics: GrammarTopicSignal[]; pasteTopics: GrammarTopicSignal[] };
  reading: {
    levels: Record<ReadingLevel, ReadingLevelSignal>;
    overallBundledAccuracy: AccuracySignal;
    pasteTopics: (GrammarTopicSignal & { level: ReadingLevel })[];
  };
  writing: {
    totalReviewedSubmissions: number;
    recentReviewedSubmissions: number;
    recentTaggedSubmissions: number;
    windowSize: number;
    evidence: EvidenceLevel;
    recentErrorCategories: WritingErrorSignal[];
    lastReviewedAt: number | null;
  };
  activity: {
    currentStreak: number;
    longestStreak: null;
    reviewsToday: number;
    uniqueWordsToday: number;
    dailyGoal: number;
    goalProgress: number;
    activeDays7: number;
    activeDays30: number;
    localDay: string;
    timeZone: string;
    utcDay: string;
  };
  preferences: LearningPrefs;
};
```

## Validation (2026-10-04)

- `npm run typecheck`: exit 0.
- `npm test`: 210 script + 882 TypeScript tests = **1,092 passed**, 0 failed.
- `node --import ./scripts/test-register.mjs --test src/lib/learning-signals.test.ts`:
  **46 passed**, 0 failed (also included in npm test).
- `npm run build:compile`: exit 0, client/SSR/Nitro Vercel output generated.
  Checked compiled SSR manifest and both get-learning-signals / learning-signals.server
  chunks: new function is included despite no UI invocation. No migration command.
- `git diff --check`: exit 0.
- Browser tests not run: no user-facing behavior changed. Hub CEFR mapping moved
  unchanged; public store export does not call the API. Full UI tests unnecessary
  for this foundation. Unit/storage/auth contract tests use no live services.

Existing compilation warnings remain: node:crypto externalization in unrelated
example-suggestions, large bundled-data chunks, and local darwin-arm64 dependency
tracing advisory. Compilation is verified; no deployment or live authenticated
transport/Firestore integration test is claimed. Safe compiler blanks credentials
only in its child process. Environment files/production configuration unchanged.

Git scope: one isolated feature commit; not pushed, merged or deployed. Tracked
working tree clean after commit; pre-existing untracked local assets retained.
