# Adaptive recommendations v1

## 1. Architecture

Pure `buildAdaptiveStudyPlan(signals: LearningSignals): AdaptiveStudyPlan`. Only
learner input is LearningSignals; the reference time is its generatedAt. No
Firestore, writes, new collection, AI, clock, random ranking, UI or scheduler
changes. No server endpoint added. Paste history now prevents the brand-new fallback. A future authenticated consumer can obtain
`getLearningSignals()` once and pass the result into the builder.

- `src/lib/adaptive-recommendations.ts`: candidate generation, ranking, merging.
- `src/lib/recommendation-targets.ts`: audited destinations and writing mapping.
- `src/lib/learning-signal-targets.ts`: eligible owned set IDs derived from the
  already projected sets using existing German/Hub eligibility predicates.
  Active cards only, reference sets excluded; smallest eligible set ID wins.
- `src/lib/learning-evidence.ts`: unchanged shared evidence bands, re-exported
  by LearningSignals for compatibility. Engine imports the lightweight function.
- `src/lib/learning-signals.ts`: adds vocabulary.practiceTargets. No new reads.
- `src/lib/adaptive-recommendations.fixtures.ts`: synthetic, fixed-time inputs.
- `src/lib/adaptive-recommendations.test.ts`: 52 core tests, plus 77 quality tests
  in adaptive-recommendations.review.test.ts and 65 synthetic policy scenarios.

## 2. Exact public model

EvidenceLevel = none | low | medium | high. Domains distinguish scheduled review,
weak/new vocabulary, grammar, reading, writing. Scores remain internal.
No unmeasured estimatedMinutes is emitted. The action union retains introduce_words/
reading_passage for compatibility; the reviewed engine emits review/
choose_reading_level for those candidates instead.

```ts
export type StudyRecommendation = {
  id: string;
  domain: "vocabulary" | "grammar" | "reading" | "writing" | "review";
  priority: "urgent" | "high" | "medium" | "low";
  title: string;
  reason: string;
  route: string;
  action: {
    type:
      | "review"
      | "weak_review"
      | "introduce_words"
      | "grammar_practice"
      | "reading_passage"
      | "choose_reading_level"
      | "writing_task";
    targetId?: string;
    setId?: string;
    level?: string;
    count?: number;
  };
  evidence: {
    level: EvidenceLevel;
    sources: (
      "schedule" | "vocabulary" | "drill" | "grammar" | "reading" | "writing" | "exploration"
    )[];
    metrics: Record<string, number | string | null>;
  };
};
export type AdaptiveStudyPlan = {
  generatedAt: number;
  recommendations: StudyRecommendation[];
  primary: StudyRecommendation | null;
};
```

## 3. Ranking and conflicts

| Candidate | Eligibility | Base score |
| --- | --- | --- |
| Overdue | exactly1 overdue card | 85 |
| Overdue | 2–5 overdue cards | 95 |
| Overdue | >5 overdue cards | 110 |
| Due only | 1–5 due cards | 60 |
| Due only | >=6 due cards | 85 |
| Weak vocabulary | >=3 existing weak cards, >=10 reviewed, medium/high evidence; no scheduled work | 72 |
| Weak grammar/drill/overall reading | qualifying evidence and accuracy below threshold | 70 |
| Borderline grammar | 65 <= accuracy <80 | 50 |
| Writing → grammar | repeated mapped category | 65 |
| Writing → Task | repeated register/missing_leitpunkt | 45 |
| Reading continuation | incomplete level with prior activity | 45 |
| Grammar exploration | low/no evidence, >0 questions, known practice >=7 days ago | 30 |
| New words | no due/overdue, capacity, no candidate >=45 | 40 |
| Brand-new start | no history, German direction, real bundled content; no other candidate | 20 |

Weak accuracy <50 adds 10; high evidence adds 6. Writing category appearing in
>=5 submissions adds 5. Incomplete daily goal adds 2 to scheduled review, weak
vocabulary, weaknesses, writing and new words. Completion never suppresses
scheduled review/weakness. Reading continuation and grammar exploration instead
lose 5 when goal complete. Brand-new start is unchanged.

Non-urgent topic recency: practiced <24 hours ago loses 16; >=14 days gains 6;
otherwise 0. Unknown timestamps are neutral, future timestamps count as recent.
No recency adjustment to schedule or aggregate weak/new vocabulary.

Priority: score >=100 urgent; >=70 high; >=45 medium; otherwise low.
Scores are rule relevance, not a learner rating. Maximum weakness (94) can beat exactly1 overdue (85); 2–5 overdue (95)
and large overdue (110) win. Severe grammar can also beat 1 due card (60).
Recency can lower a borderline recommendation from medium to low.

Primary is highest score, then lexical destination key. Subsequent choices may
prefer the least represented domain among candidates within 6 points of the
highest remaining eligible score. Maximum 4 total, target 2 per domain. The cap yields if an over-cap candidate
is >6 points better than the best uncapped alternative. No
padding. Empty plan has primary null. Topic/category inputs are sorted before
merging so array order does not change output.

## 4. Evidence thresholds

Shared participation bands unchanged: 0 none, 1–9 low, 10–29 medium, >=30 high.
Grammar, drills and overall Lesen weakness require medium/high AND at least 10
questions/attempts. This avoids claiming weakness from two answers even if an
inconsistent evidence label says high. Grammar/reading weakness <65%; grammar
65–79% borderline; >=80% omitted. Drill accuracy <70% plus >=3 misses.

Writing uses a different repetition gate: >=3 distinct affected submissions in
at least 5 recent saved feedback records (LearningSignals window capped at 20).
The evidence label still uses affected-submission bands, so 6 repeated errors
can produce a high-priority card with low participation evidence. This is an
explicit repetition rule, not a claim of high statistical confidence. No
submission error rate or correctness denominator is inferred from missing tags.

## 5. Domain behavior

See ADAPTIVE_RECOMMENDATIONS_REVIEW.md for the focused policy review.

Vocabulary uses existing due/overdue and isWeakWord-derived counts. Scheduled
review replaces aggregate weak review, avoiding redundant vocabulary cards.
Review/weak action counts are capped at 20. New count = min(new cards, remaining
unique-word daily capacity, 20); stronger pressure blocks new content. Scheduling
and actual session selection remain authoritative.

Fixed grammar only, Paste excluded. Recent question count preferred, otherwise
legacy lifetime evidence; reasons name the basis and do not assert stored accuracy
was calculated over lifetime attempts. Low evidence revisits only previously
practiced stale topics; never infers a learner CEFR or chooses unattempted levels.

Reading chooses one incomplete level with real prior activity. Recency score,
then latest activity, then lexical level break ties. No A1→B2 progression policy.
Fully completed levels excluded from continuation; actual overall weak reading
can still recommend the level chooser. Per-level accuracy remains null.
Bundled reading only; Lesen Paste excluded. New users may get one level chooser.

Writing uses structured categories only; no empty-history “write more” prompt.
Activity changes relevance modestly using daily goal, and history gates new-user
fallback. No streak farming or recommendation solely to fill the goal.

## 6. Deduplication

Destination identity is topic+set ID for set modes, topic ID for standalone
curriculum, and lesen for bundled reading. Merge grammar/drill/writing evidence
for the same destination: maximum score and evidence band, unique sources,
unique reasons, namespaced metrics. Scores/counts are not added across overlapping
sources. Strongest candidate supplies action/title/domain. Writing Task instruction
is appended once after merging. Existing grammar/writing model has one entry per
category/topic. Different practice destinations remain separate.

## 7. Every route

| Target | Actual route |
| --- | --- |
| Scheduled/new vocabulary | `/review` |
| Existing weak review | `/review?filter=weak` |
| Articles | `/sets/{encodedSetId}/articles` |
| Cases | `/sets/{encodedSetId}/cases` |
| Conjugation | `/sets/{encodedSetId}/conjugation` |
| Satzbau | `/sets/{encodedSetId}/satzbau` |
| Cloze | `/sets/{encodedSetId}/cloze` |
| Write Task | `/sets/{encodedSetId}/write` |
| Bundled Lesen/level chooser | `/grammar/lesen` |
| plural | `/grammar/plural` |
| pronomen | `/grammar/pronomen` |
| possessive | `/grammar/possessive` |
| nicht-kein | `/grammar/nicht-kein` |
| modalverben | `/grammar/modalverben` |
| trennbare-verben | `/grammar/trennbare-verben` |
| imperativ | `/grammar/imperativ` |
| adjektivendungen | `/grammar/adjektivendungen` |
| steigerung | `/grammar/steigerung` |
| diktat | `/grammar/diktat` |
| passiv | `/grammar/passiv` |
| relativsaetze | `/grammar/relativsaetze` |
| konjunktiv | `/grammar/konjunktiv` |
| partizipial | `/grammar/partizipial` |
| nominalisierung | `/grammar/nominalisierung` |
| funktionsverbgefuege | `/grammar/funktionsverbgefuege` |
| modalpartikeln | `/grammar/modalpartikeln` |
| konjunktiv1 | `/grammar/konjunktiv1` |
| subjektive-modalverben | `/grammar/subjektive-modalverben` |
| passiversatzformen | `/grammar/passiversatzformen` |

Set targets must exist in vocabulary.practiceTargets or are omitted. Set modes
use existing German eligibility except Write, which works for any owned active
studiable set. Unknown targets are omitted. No unsupported query parameters.

Writing mapping: article_gender→articles; case→cases;
verb_position/word_order_other→satzbau; verb_conjugation→conjugation;
register/missing_leitpunkt→write; spelling/word_choice→no recommendation.
There is no reliably dedicated drill for the latter two categories.

Lesen has no level query parser: action.type is choose_reading_level, action.level is advisory, and reason
explicitly instructs manual level selection.
Write defaults to Words: reason explicitly instructs selection of Task tab.
Review has no new-only query parser: new-word candidate now uses review action with no count; its reason explains
the queue. suggestedNewWordLimit is advisory evidence, not a session promise. No route parsing changed.

## 8. Exact synthetic fixture outputs

Generated by recommendationExamples() and buildAdaptiveStudyPlan(). Fixed
reference time 2026-10-04T12:00:00Z. No live learner data. These are the complete
returned plans including primary, not illustrative manually written cards.

### overdue

```json
{
  "generatedAt": 1791115200000,
  "recommendations": [
    {
      "domain": "review",
      "title": "Review overdue words",
      "reason": "You have 12 overdue words.",
      "route": "/review",
      "action": {
        "type": "review",
        "count": 12
      },
      "evidence": {
        "level": "high",
        "sources": [
          "schedule"
        ],
        "metrics": {
          "overdueCards": 12,
          "dueCards": 12
        }
      },
      "id": "adaptive:scheduled-review",
      "priority": "urgent"
    }
  ],
  "primary": {
    "domain": "review",
    "title": "Review overdue words",
    "reason": "You have 12 overdue words.",
    "route": "/review",
    "action": {
      "type": "review",
      "count": 12
    },
    "evidence": {
      "level": "high",
      "sources": [
        "schedule"
      ],
      "metrics": {
        "overdueCards": 12,
        "dueCards": 12
      }
    },
    "id": "adaptive:scheduled-review",
    "priority": "urgent"
  }
}
```

### grammarWeak

```json
{
  "generatedAt": 1791115200000,
  "recommendations": [
    {
      "domain": "grammar",
      "title": "Practice Cases",
      "reason": "Your Cases accuracy is 60% with 50 questions in recent rounds.",
      "route": "/sets/fixture-set/cases",
      "action": {
        "type": "grammar_practice",
        "targetId": "cases",
        "setId": "fixture-set"
      },
      "evidence": {
        "level": "high",
        "sources": [
          "grammar"
        ],
        "metrics": {
          "grammar.topicId": "cases",
          "grammar.accuracy": 60,
          "grammar.lifetimeAttempts": 50,
          "grammar.recentAttempts": 50,
          "grammar.evidenceBasis": "recentQuestions",
          "grammar.cefrLevel": "A1.2",
          "grammar.lastPracticedAt": 1789819200000
        }
      },
      "id": "adaptive:cases:fixture-set",
      "priority": "high"
    }
  ],
  "primary": {
    "domain": "grammar",
    "title": "Practice Cases",
    "reason": "Your Cases accuracy is 60% with 50 questions in recent rounds.",
    "route": "/sets/fixture-set/cases",
    "action": {
      "type": "grammar_practice",
      "targetId": "cases",
      "setId": "fixture-set"
    },
    "evidence": {
      "level": "high",
      "sources": [
        "grammar"
      ],
      "metrics": {
        "grammar.topicId": "cases",
        "grammar.accuracy": 60,
        "grammar.lifetimeAttempts": 50,
        "grammar.recentAttempts": 50,
        "grammar.evidenceBasis": "recentQuestions",
        "grammar.cefrLevel": "A1.2",
        "grammar.lastPracticedAt": 1789819200000
      }
    },
    "id": "adaptive:cases:fixture-set",
    "priority": "high"
  }
}
```

### writingError

```json
{
  "generatedAt": 1791115200000,
  "recommendations": [
    {
      "domain": "grammar",
      "title": "Practice Satzbau",
      "reason": "verb position errors appeared in 6 of the last 6 saved writing feedback records.",
      "route": "/sets/fixture-set/satzbau",
      "action": {
        "type": "grammar_practice",
        "targetId": "satzbau",
        "setId": "fixture-set"
      },
      "evidence": {
        "level": "low",
        "sources": [
          "writing"
        ],
        "metrics": {
          "verb_position.submissionsWithError": 6,
          "verb_position.occurrences": 6,
          "verb_position.major": 4,
          "verb_position.minor": 2,
          "verb_position.lastSeenAt": 1790942400000,
          "writingWindow": 6
        }
      },
      "id": "adaptive:satzbau:fixture-set",
      "priority": "high"
    }
  ],
  "primary": {
    "domain": "grammar",
    "title": "Practice Satzbau",
    "reason": "verb position errors appeared in 6 of the last 6 saved writing feedback records.",
    "route": "/sets/fixture-set/satzbau",
    "action": {
      "type": "grammar_practice",
      "targetId": "satzbau",
      "setId": "fixture-set"
    },
    "evidence": {
      "level": "low",
      "sources": [
        "writing"
      ],
      "metrics": {
        "verb_position.submissionsWithError": 6,
        "verb_position.occurrences": 6,
        "verb_position.major": 4,
        "verb_position.minor": 2,
        "verb_position.lastSeenAt": 1790942400000,
        "writingWindow": 6
      }
    },
    "id": "adaptive:satzbau:fixture-set",
    "priority": "high"
  }
}
```

### brandNew

```json
{
  "generatedAt": 1791115200000,
  "recommendations": [
    {
      "domain": "reading",
      "title": "Choose a reading level",
      "reason": "Bundled reading passages are available. Choose a level you want to try.",
      "route": "/grammar/lesen",
      "action": {
        "type": "choose_reading_level"
      },
      "evidence": {
        "level": "none",
        "sources": [
          "exploration"
        ],
        "metrics": {
          "availablePassages": 105,
          "learnerCefrLevel": null
        }
      },
      "id": "adaptive:lesen",
      "priority": "low"
    }
  ],
  "primary": {
    "domain": "reading",
    "title": "Choose a reading level",
    "reason": "Bundled reading passages are available. Choose a level you want to try.",
    "route": "/grammar/lesen",
    "action": {
      "type": "choose_reading_level"
    },
    "evidence": {
      "level": "none",
      "sources": [
        "exploration"
      ],
      "metrics": {
        "availablePassages": 105,
        "learnerCefrLevel": null
      }
    },
    "id": "adaptive:lesen",
    "priority": "low"
  }
}
```

### strong

```json
{
  "generatedAt": 1791115200000,
  "recommendations": [],
  "primary": null
}
```

## 9. Validation

- `npm run typecheck`: 0 diagnostics.
- `npm test`: 210 script tests + 1011 TypeScript tests = 1221 passing.
- `node --import ./scripts/test-register.mjs --test src/lib/adaptive-recommendations.test.ts`: 52 core tests passing; combined with review.test.ts: 129 passing.
- `npm run build:compile`: successful safe compile, credentials blanked by
  existing helper; no migration entry point executed.
- `git diff --check`: clean.

Coverage includes new/no-set users, new-only capacity, small/huge due/overdue,
mastered/strong profiles, grammar missing/low/high/borderline/legacy evidence,
recency, goal complete/incomplete, reading absent/partial/complete/overall,
writing empty/repeated/unmapped, combined article/case/writing, valid actual
routes, deterministic immutable input, diversity and output bounds.
No browser tests: no UI changed. Existing compilation warnings: node:crypto in
example-suggestions externalized for browser compatibility; >500kB chunks;
Nitro/Rolldown timing/platform tracing notices. No compilation failure.

## 10. Limits

No trustworthy global CEFR; no per-level Lesen accuracy; no writing error rate.
Aggregate evidence may come from several sets: routing picks a deterministic
eligible owned set, not necessarily the one responsible for most errors.
Read snapshot can become stale if a set changes after loading. Existing destination
ownership/eligibility checks still apply. Reasons currently English. Recency is
practice recency, not impression history; no recommendation tracking/persistence.
Current constants are explainable heuristics, not validated learning efficacy.
Malformed input is outside the typed API contract; errors propagate to callers.
The pure engine does not log signals or private content. Future server/UI caller
must use existing privacy-safe operation diagnostics on failure.

## 11. Home next step

After review, integrate through existing authenticated LearningSignals loader,
fetch once, generate once, render bounded cards with explanation/evidence and
empty/error states. Preserve loading/auth boundaries, escape text, follow audited
routes; do not log LearningSignals. Support level/Task/new-word preselection only
in a separate deliberate routing/UI change with tests. Verify fresh set eligibility,
mobile accessibility and end-to-end behavior before rollout. No Home UI added here.

## 12. Git boundary

LearningSignals `395e504024b545a18e67a73633216bf38564c898` was not merged into
main (`088be3e0a508275f5e68d8c7d168c455720abfbe`). Branch
`codex/adaptive-recommendations-v1` starts directly from the foundation SHA.
Changes committed locally; no push, merge, deploy, production configuration,
migration or disposable-user reset. Existing untracked local files preserved.
