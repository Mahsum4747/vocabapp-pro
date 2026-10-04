# Adaptive recommendations quality review

Reviewed on 2026-10-04, starting branch codex/adaptive-recommendations-v1,
HEAD d9f7b02a0b8e3e4b81cabc5a91ab5889a097fcae. Source, both foundation documents,
handoff, engine/tests and route mappings were checked; source takes precedence.

## Policy summary

**APPROVE WITH CAVEATS** for the pure data layer. 65 deterministic scenarios:
65 PASS, 0 QUESTIONABLE, 0 FAIL after tuning. No UI, routing, SRS, persistence,
Firestore reads, AI, migration, push, merge or deployment changed.

Large scheduled backlog wins. One overdue word may yield to a severe, sufficiently
sampled weakness; it remains a high-priority secondary. Owned unseen vocabulary
beats generic new-user exploration. High usefulness is separate from evidence
participation. Reading continues established interest, never infers CEFR. Empty
plan is valid. Diversity is a near-tie preference, not a stronger-work veto.

## Scenario matrix

Inputs are synthetic, fixed at 2026-10-04T12:00:00Z. Counts are not live data.
Expected keys are domain:action:target-or-level; none means empty primary.
Scores below are actual internal candidate values captured by source instrumentation
in the developer-only reviewer helper; the production API exposes no score.
Baseline profiles have 40 reviewed/mastered cards, no due work (scenario-added new/due cards adjust pool totals), daily goal10,
0% goal, eligible fixture-set practice targets; brand-new profiles have no cards.
Grammar entries list accuracy/question sample/evidence/age. Writing lists distinct
affected/latest saved records, not a correctness rate. Lifetime25 can coexist
with window20. Reference/tiny scenarios explicitly represent canonical post-filter
LearningSignals, not a claim that the matrix inserts real Firestore sets.

| Scenario | Key signals | Expected | Actual (primary, score/priority) | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 overdue vs severe grammar | totalActiveCards=40; dueCards=1; overdueCards=1; plural 45%/80q/high/30.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | One overdue can yield to severe high-evidence weakness; larger backlog wins. |
| 3 overdue vs severe grammar | totalActiveCards=40; dueCards=3; overdueCards=3; plural 45%/80q/high/30.0d | `review:review` | Review overdue words; `review:review`; **97 / high** | PASS | One overdue can yield to severe high-evidence weakness; larger backlog wins. |
| 5 overdue vs severe grammar | totalActiveCards=40; dueCards=5; overdueCards=5; plural 45%/80q/high/30.0d | `review:review` | Review overdue words; `review:review`; **97 / high** | PASS | One overdue can yield to severe high-evidence weakness; larger backlog wins. |
| 20 overdue vs severe grammar | totalActiveCards=40; dueCards=20; overdueCards=20; plural 45%/80q/high/30.0d | `review:review` | Review overdue words; `review:review`; **112 / urgent** | PASS | One overdue can yield to severe high-evidence weakness; larger backlog wins. |
| 50 overdue vs severe grammar | totalActiveCards=50; dueCards=50; overdueCards=50; plural 45%/80q/high/30.0d | `review:review` | Review overdue words; `review:review`; **112 / urgent** | PASS | One overdue can yield to severe high-evidence weakness; larger backlog wins. |
| 1 due vs grammar | totalActiveCards=40; dueCards=1; plural 45%/80q/high/2.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **88 / high** | PASS | Small due loses to severe evidence; 15 due beats moderate weakness. |
| 3 due vs grammar | totalActiveCards=40; dueCards=3; plural 45%/80q/high/2.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **88 / high** | PASS | Small due loses to severe evidence; 15 due beats moderate weakness. |
| 15 due vs grammar | totalActiveCards=40; dueCards=15; plural 60%/30q/high/2.0d | `review:review` | Review due words; `review:review`; **87 / high** | PASS | Small due loses to severe evidence; 15 due beats moderate weakness. |
| 20 weak words vs severe grammar | totalActiveCards=40; weakCards=20; plural 45%/80q/high/30.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | High-evidence severe grammar outranks aggregate weak pool. |
| Article only | totalActiveCards=40; article 45%/50 attempts/high | `grammar:grammar_practice:articles` | Practice Articles; `grammar:grammar_practice:articles`; **88 / high** | PASS | Eligible owned Article drill. |
| Case only | totalActiveCards=40; case 45%/50 attempts/high | `grammar:grammar_practice:cases` | Practice Cases; `grammar:grammar_practice:cases`; **88 / high** | PASS | Eligible owned Cases drill. |
| Both, case stronger | totalActiveCards=40; article 60%/50 attempts/high; case 40%/50 attempts/high | `grammar:grammar_practice:cases` | Practice Cases; `grammar:grammar_practice:cases`; **88 / high** | PASS | Severity decides. |
| Equal article and case | totalActiveCards=40; article 45%/50 attempts/high; case 45%/50 attempts/high | `grammar:grammar_practice:articles` | Practice Articles; `grammar:grammar_practice:articles`; **88 / high** | PASS | Stable lexical tie. |
| Low article vs high case | totalActiveCards=40; article 30%/5 attempts/low; case 60%/50 attempts/high | `grammar:grammar_practice:cases` | Practice Cases; `grammar:grammar_practice:cases`; **78 / high** | PASS | Low sample cannot diagnose weakness. |
| Writing 6 of 6 position | totalActiveCards=40; writing verb_position 6/6 | `grammar:grammar_practice:satzbau` | Practice Satzbau; `grammar:grammar_practice:satzbau`; **72 / high** | PASS | High usefulness, low sample label retained. |
| Writing 8 of latest20, 25 lifetime | totalActiveCards=40; writing verb_position 8/20 | `grammar:grammar_practice:satzbau` | Practice Satzbau; `grammar:grammar_practice:satzbau`; **72 / high** | PASS | Latest20 records only, not 25 denominator. |
| Writing 1 of 5 | totalActiveCards=40; writing case 1/5 | `none` | null; no score | PASS | No repetition. |
| Repeated missing_leitpunkt | totalActiveCards=40; writing missing_leitpunkt 6/6 | `writing:writing_task:write` | Practice Write Task; `writing:writing_task:write`; **52 / medium** | PASS | Manual Task instruction. |
| Repeated spelling | totalActiveCards=40; writing spelling 6/6 | `none` | null; no score | PASS | No reliable grammar mapping. |
| Repeated word_choice | totalActiveCards=40; writing word_choice 6/6 | `none` | null; no score | PASS | No invented drill. |
| A1 3 completed | totalActiveCards=40; A1 3/35, 2d | `reading:choose_reading_level:A1` | Continue A1 reading; `reading:choose_reading_level:A1`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| A1 30 completed | totalActiveCards=40; A1 30/35, 2d | `reading:choose_reading_level:A1` | Continue A1 reading; `reading:choose_reading_level:A1`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| A1 35 completed | totalActiveCards=40; A1 35/35, 2d | `none` | null; no score | PASS | Continuation requires manual selection; completed level omitted. |
| A2 2 completed | totalActiveCards=40; A2 2/15, 2d | `reading:choose_reading_level:A2` | Continue A2 reading; `reading:choose_reading_level:A2`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| B1 2 completed | totalActiveCards=40; B1 2/30, 2d | `reading:choose_reading_level:B1` | Continue B1 reading; `reading:choose_reading_level:B1`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| B1 20 completed | totalActiveCards=40; B1 20/30, 2d | `reading:choose_reading_level:B1` | Continue B1 reading; `reading:choose_reading_level:B1`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| B2 3 completed | totalActiveCards=40; B2 3/25, 2d | `reading:choose_reading_level:B2` | Continue B2 reading; `reading:choose_reading_level:B2`; **45 / medium** | PASS | Continuation requires manual selection; completed level omitted. |
| A1 untouched established learner | totalActiveCards=40 | `none` | null; no score | PASS | No CEFR inference. |
| B1 complete overall Lesen weak | totalActiveCards=40; B1 30/30, 2d; overall Lesen 45% | `reading:choose_reading_level` | Review reading comprehension; `reading:choose_reading_level`; **88 / high** | PASS | Overall weakness, no fabricated level accuracy. |
| Multiple levels stale B1 vs recent A2 | totalActiveCards=40; A2 3/15, 2d; B1 2/30, 30d | `reading:choose_reading_level:B1` | Continue B1 reading; `reading:choose_reading_level:B1`; **51 / medium** | PASS | Stale existing interest wins, not progression. |
| Only Paste reading | Paste history only | `none` | null; no score | PASS | Paste excluded. |
| Brand new no sets | no learner evidence; bundled content available | `reading:choose_reading_level` | Choose a reading level; `reading:choose_reading_level`; **20 / low** | PASS | Generic content chooser, no level. |
| Owned new vocabulary | totalActiveCards=50; newCards=50 | `vocabulary:review` | Review your vocabulary; `vocabulary:review`; **42 / low** | PASS | Owned actionable content wins generic start. |
| Owned vocabulary plus reading | totalActiveCards=50; newCards=50 | `vocabulary:review` | Review your vocabulary; `vocabulary:review`; **42 / low** | PASS | Owned actionable content wins generic start. |
| Curriculum available no evidence | no learner evidence; bundled content available | `reading:choose_reading_level` | Choose a reading level; `reading:choose_reading_level`; **20 / low** | PASS | No grammar weakness/exploration from availability. |
| Only reference set projected out | no learner evidence; bundled content available | `reading:choose_reading_level` | Choose a reading level; `reading:choose_reading_level`; **20 / low** | PASS | Canonical projection removes reference cards. |
| Tiny non-studiable set projected out | no learner evidence; bundled content available | `reading:choose_reading_level` | Choose a reading level; `reading:choose_reading_level`; **20 / low** | PASS | Canonical projection removes tiny sets. |
| Strong caught up | totalActiveCards=40; articles 95%/50q/high/2.0d; plural 95%/50q/high/2.0d; pronomen 95%/50q/high/2.0d; possessive 95%/50q/high/2.0d; nicht-kein 95%/50q/high/2.0d; cases 95%/50q/high/2.0d; conjugation 95%/50q/high/2.0d; modalverben 95%/50q/high/2.0d; trennbare-verben 95%/50q/high/2.0d; imperativ 95%/50q/high/2.0d; adjektivendungen 95%/50q/high/2.0d; steigerung 95%/50q/high/2.0d; satzbau 95%/50q/high/2.0d; cloze 95%/50q/high/2.0d; diktat 95%/50q/high/2.0d; passiv 95%/50q/high/2.0d; relativsaetze 95%/50q/high/2.0d; konjunktiv 95%/50q/high/2.0d; partizipial 95%/50q/high/2.0d; nominalisierung 95%/50q/high/2.0d; funktionsverbgefuege 95%/50q/high/2.0d; modalpartikeln 95%/50q/high/2.0d; konjunktiv1 95%/50q/high/2.0d; subjektive-modalverben 95%/50q/high/2.0d; passiversatzformen 95%/50q/high/2.0d; lesen 95%/50q/high/2.0d; A1 35/35, 2d; A2 15/15, 2d; B1 30/30, 2d; B2 25/25, 2d; goal=100% | `none` | null; no score | PASS | Empty plan valid. |
| Strong new words goal complete | totalActiveCards=50; newCards=10; articles 95%/50q/high/2.0d; plural 95%/50q/high/2.0d; pronomen 95%/50q/high/2.0d; possessive 95%/50q/high/2.0d; nicht-kein 95%/50q/high/2.0d; cases 95%/50q/high/2.0d; conjugation 95%/50q/high/2.0d; modalverben 95%/50q/high/2.0d; trennbare-verben 95%/50q/high/2.0d; imperativ 95%/50q/high/2.0d; adjektivendungen 95%/50q/high/2.0d; steigerung 95%/50q/high/2.0d; satzbau 95%/50q/high/2.0d; cloze 95%/50q/high/2.0d; diktat 95%/50q/high/2.0d; passiv 95%/50q/high/2.0d; relativsaetze 95%/50q/high/2.0d; konjunktiv 95%/50q/high/2.0d; partizipial 95%/50q/high/2.0d; nominalisierung 95%/50q/high/2.0d; funktionsverbgefuege 95%/50q/high/2.0d; modalpartikeln 95%/50q/high/2.0d; konjunktiv1 95%/50q/high/2.0d; subjektive-modalverben 95%/50q/high/2.0d; passiversatzformen 95%/50q/high/2.0d; lesen 95%/50q/high/2.0d; A1 35/35, 2d; A2 15/15, 2d; B1 30/30, 2d; B2 25/25, 2d; goal=100% | `none` | null; no score | PASS | No extra new work after goal. |
| Strong neglected partial B2 | totalActiveCards=40; articles 95%/50q/high/2.0d; plural 95%/50q/high/2.0d; pronomen 95%/50q/high/2.0d; possessive 95%/50q/high/2.0d; nicht-kein 95%/50q/high/2.0d; cases 95%/50q/high/2.0d; conjugation 95%/50q/high/2.0d; modalverben 95%/50q/high/2.0d; trennbare-verben 95%/50q/high/2.0d; imperativ 95%/50q/high/2.0d; adjektivendungen 95%/50q/high/2.0d; steigerung 95%/50q/high/2.0d; satzbau 95%/50q/high/2.0d; cloze 95%/50q/high/2.0d; diktat 95%/50q/high/2.0d; passiv 95%/50q/high/2.0d; relativsaetze 95%/50q/high/2.0d; konjunktiv 95%/50q/high/2.0d; partizipial 95%/50q/high/2.0d; nominalisierung 95%/50q/high/2.0d; funktionsverbgefuege 95%/50q/high/2.0d; modalpartikeln 95%/50q/high/2.0d; konjunktiv1 95%/50q/high/2.0d; subjektive-modalverben 95%/50q/high/2.0d; passiversatzformen 95%/50q/high/2.0d; lesen 95%/50q/high/2.0d; A1 35/35, 2d; A2 15/15, 2d; B1 30/30, 2d; B2 20/25, 30d; goal=100% | `reading:choose_reading_level:B2` | Continue B2 reading; `reading:choose_reading_level:B2`; **46 / medium** | PASS | Optional meaningful existing interest. |
| Strong untouched low-evidence grammar | totalActiveCards=40 | `none` | null; no score | PASS | Untouched is not neglected. |
| Goal 0% severe weakness | totalActiveCards=40; plural 45%/80q/high/30.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | Goal cannot hide real weakness. |
| Goal 50% severe weakness | totalActiveCards=40; plural 45%/80q/high/30.0d; goal=50% | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | Goal cannot hide real weakness. |
| Goal 100% severe weakness | totalActiveCards=40; plural 45%/80q/high/30.0d; goal=100% | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **92 / high** | PASS | Goal cannot hide real weakness. |
| Goal 150% severe weakness | totalActiveCards=40; plural 45%/80q/high/30.0d; goal=150% | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **92 / high** | PASS | Goal cannot hide real weakness. |
| Severe grammar recency 0d | totalActiveCards=40; plural 45%/80q/high/0.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **72 / high** | PASS | Severe high-evidence weakness survives penalty. |
| Severe grammar recency 2d | totalActiveCards=40; plural 45%/80q/high/2.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **88 / high** | PASS | Severe high-evidence weakness survives penalty. |
| Severe grammar recency 13d | totalActiveCards=40; plural 45%/80q/high/13.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **88 / high** | PASS | Severe high-evidence weakness survives penalty. |
| Severe grammar recency 14d | totalActiveCards=40; plural 45%/80q/high/14.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | Severe high-evidence weakness survives penalty. |
| Severe grammar recency 30d | totalActiveCards=40; plural 45%/80q/high/30.0d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | Severe high-evidence weakness survives penalty. |
| 50 new 0 due | totalActiveCards=90; newCards=50 | `vocabulary:review` | Review your vocabulary; `vocabulary:review`; **42 / low** | PASS | No new-only session promise. |
| 50 new 1 due | totalActiveCards=90; newCards=50; dueCards=1 | `review:review` | Review due words; `review:review`; **62 / medium** | PASS | No new-only session promise. |
| 50 new 10 due | totalActiveCards=90; newCards=50; dueCards=10 | `review:review` | Review due words; `review:review`; **87 / high** | PASS | No new-only session promise. |
| 50 new significant weak pool | totalActiveCards=90; newCards=50; weakCards=20 | `vocabulary:weak_review` | Practice weak words; `vocabulary:weak_review`; **74 / high** | PASS | Weak focus wins. |
| 10 new goal empty | totalActiveCards=50; newCards=10 | `vocabulary:review` | Review your vocabulary; `vocabulary:review`; **42 / low** | PASS | Open review, availability only. |
| Multi-source cases | totalActiveCards=40; cases 60%/80q/high/2.0d; case 45%/50 attempts/high; writing case 6/6 | `grammar:grammar_practice:cases` | Practice Cases; `grammar:grammar_practice:cases`; **88 / high** | PASS | One destination, maximum score, separate source counts. |
| Multi-source articles | totalActiveCards=40; articles 60%/80q/high/2.0d; article 45%/50 attempts/high; writing article_gender 6/6 | `grammar:grammar_practice:articles` | Practice Articles; `grammar:grammar_practice:articles`; **88 / high** | PASS | One destination, maximum score, separate source counts. |
| Multi-source satzbau | totalActiveCards=40; satzbau 60%/80q/high/2.0d; writing verb_position 6/6; writing word_order_other 6/6 | `grammar:grammar_practice:satzbau` | Practice Satzbau; `grammar:grammar_practice:satzbau`; **78 / high** | PASS | One destination, maximum score, separate source counts. |
| Multi-source conjugation | totalActiveCards=40; conjugation 60%/80q/high/2.0d; writing verb_conjugation 6/6 | `grammar:grammar_practice:conjugation` | Practice Conjugation; `grammar:grammar_practice:conjugation`; **78 / high** | PASS | One destination, maximum score, separate source counts. |
| Diversity near tie | totalActiveCards=40; plural 70%/20q/medium/2.0d; pronomen 70%/20q/medium/2.0d; B1 2/30, 30d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **52 / medium** | PASS | Reading second within1 point, primary unchanged. |
| Diversity materially stronger grammar | totalActiveCards=40; plural 45%/80q/high/30.0d; pronomen 60%/80q/high/2.0d; B1 2/30, 2d | `grammar:grammar_practice:plural` | Practice Plural; `grammar:grammar_practice:plural`; **94 / high** | PASS | Grammar second before weaker reading. |
| Four equal grammar needs | totalActiveCards=40; plural 60%/80q/high/2.0d; pronomen 60%/80q/high/2.0d; passiv 60%/80q/high/2.0d; imperativ 60%/80q/high/2.0d | `grammar:grammar_practice:imperativ` | Practice Imperativ; `grammar:grammar_practice:imperativ`; **78 / high** | PASS | Two-per-domain cap; omitted needs documented. |
| No content of any kind | no learner evidence or content | `none` | null; no score | PASS | No fake fallback. |
| Today reading vs owned new words | totalActiveCards=90; newCards=50; B1 2/30, 0d | `vocabulary:review` | Review your vocabulary; `vocabulary:review`; **42 / low** | PASS | Recent reading yields to owned content. |
| Reading continuation vs new words | totalActiveCards=90; newCards=50; B1 2/30, 2d | `reading:choose_reading_level:B1` | Continue B1 reading; `reading:choose_reading_level:B1`; **45 / medium** | PASS | Established reading score45 blocks optional new42. |

All matrix rows are automated primary/action checks plus output bound, route
uniqueness, input immutability, repeatability and topic/category-order stability.
Further tests check secondary ordering, route wording, low writing evidence,
source merge metrics and soft cap behavior. Scores are reviewer diagnostics only.

## Tuning changes

| Before | After | Reproduced issue | Product decision |
| --- | --- | --- | --- |
| All 1–5 overdue base95 | Exactly1 base85; 2–5 stay95; >5 stay110 | 1 overdue beat 45%/80q/high/30d grammar 94 | Tiny overdue87 may yield to severe94; retains high urgency. Accuracy50 exactly has no severe bonus; intent is <50, not arbitrary tie inflation. |
| Hard2 cards/domain | Target2/domain; allow over-cap when >6 points stronger than best uncapped alternative | Third/fourth grammar78 hidden by reading45 | Preserve better work; keep absolute4 cap, keep all-grammar-only2 when no competing domain. |
| New title Learn new words; introduce_words with count | Review your vocabulary; action review; no action.count; limit only in evidence | /review cannot guarantee exclusive new-word session or exact count | Explain availability and queue; no unsupported routing. |
| Reading action reading_passage/count1 | choose_reading_level + advisory level; no count | /grammar/lesen cannot directly start level/passage | Reason explicitly says Open Lesen and select level. |
| New-user noHistory ignored Paste | Requires both Paste history arrays empty | Paste-only experienced learner got generic brand-new reading start | Presence of history prevents false new-user fallback, Paste still never ranked. |

No other score or threshold changed. Evidence0/10/30, grammar65/80, drill70,
writing3 affected/5 records, goal+2/-5, recency-16/+6 at24h/14d, reading45,
priority100/70/45 and diversity6 were retained after inspection.

Original source produced 16 primary/action mismatches against final route-honest
expectations (including semantic action mismatches, not 16 ranking failures).
Secondary-order stress exposed the hard-cap issue separately. These are resolved.
The helper can rerun current source or an archived source file without editing
production source:

```sh
node --import ./scripts/test-register.mjs scripts/adaptive-recommendations-review.mjs /tmp/karta-quality.json
# Optional third argument: archived adaptive-recommendations.ts source.
```

The Node stripTypeScriptTypes experimental warning belongs only to this diagnostic
helper. It instruments a temporary module and saves synthetic output only; it
writes no learner state, logs no LearningSignals, and fails if its capture marker
changes. Behavioral tests call the actual uninstrumented builder.

## Policy decisions and boundaries

- Severe high-evidence old grammar94 beats exactly1 overdue87. With 3/5 overdue,
  review97 wins; >5 overdue112 wins. Overdue is already >24h past due in the
  canonical signal, not simply a same-day pending card.
- Tiny due62 loses to severe88; 15 due87 beats moderate grammar78.
- 20 weak vocabulary74 loses to severe old grammar94. Weak-word definition stays
  in existing SRS code. No alternative weakness detector added.
- Writing6/6 produces score72/high but evidence low; reason exposes6 of last6.
  Writing8/latest20 is also low participation; lifetime25 is not its denominator.
  Unsupported spelling/word_choice omitted. Evidence never inflated.
- Reading45 remains medium after2d,29/low today,51/medium at14+d. Engaged reading
  may suppress new42; recently practiced reading29 permits owned new42 instead.
  Full levels omitted unless generic reading evidence really indicates weakness.
- Goal0/50% give equal weakness+2,100/>100% give0: modest modifier, no percentage
  farming. >100% is a synthetic defensive case; real LearningSignals clamps to1.
- Severe high-evidence recency0/2/13/14/30d scores72/88/88/94/94. Today severe
  weakness remains high, recent borderline falls low. No recency tuning needed.
- Near-tie grammar52 and reading51 can diversify second position. Materially
  stronger grammar78 stays ahead of reading45, including a third over-cap topic.
  Absolute4 can still omit weaker needs; this is intentional list bounding.
- New users with actionable owned cards open vocabulary review first. No owned
  content permits generic level choice, no invented A1 recommendation. Reference
  and one-card sets do not count as actionable LearningSignals vocabulary.
- Strong fully caught-up users produce empty plan. Neglected partial existing
  B2 can produce optional score46/medium even with daily goal complete; no forced
  progression or untouched-grammar exploration.

## Route-semantics review

Source audit: Review.validateSearch accepts weak/set only and builds existing
mixed library session with current newCardLimit. New-word candidate now opens
Review with honest queue wording; suggestedNewWordLimit is advisory evidence,
not action count or navigation state. Review/weak counts remain planning hints.
Lesen uses a local chooser, no level query: explicit manual selection plus action
choose_reading_level. Write defaults to words, no Task query: existing instruction
Open Write and select the Task tab stays once after merged reasons. No routes/UI
changed; no browser tests required. Existing set eligibility and ownership remain.

## Reason audit

Every template checked: schedule states count; weak vocabulary names existing
criteria; drills state errors/attempts; grammar states stored accuracy and recent
question participation or explicit legacy lifetime evidence (not invented accuracy
denominator); exploration says little evidence; writing states observed affected
records; reading states completed/available and manual selection; overall Lesen
says accuracy not level-specific; new vocabulary names availability and queue;
new-user fallback lets learner choose. No internal weights or weakness diagnosis
from absent data. Three independent Satzbau signals/categories stay below500
characters in the tested fixture; counts remain namespaced, never summed.

## Validation

- Targeted engine + quality tests: 129 passing (52 retained, 77 new).
- npm run typecheck: 0 diagnostics.
- npm test: 210 scripts + 1011 TypeScript = 1221 passing.
- npm run build:compile: successful, safe credential-blanking helper, no migration.
- git diff --check: clean.
- Synthetic matrix: 65 PASS; 0 QUESTIONABLE; 0 FAIL.

Existing compilation notices (node:crypto browser externalization in
example-suggestions, large chunks, Nitro/Rolldown platform/timing) remain.
No UI/routing behavior changed, so browser tests were not run.

## Remaining limitations

No trustworthy global CEFR; per-level reading accuracy unavailable; writing
error rates unavailable. Aggregate grammar/drill evidence can concern multiple
sets while navigation chooses the first eligible owned set. Future UI must check
freshness and tolerate changed/deleted content. Reading/Task selection is manual.
Reasons are English and combined evidence can be longer than a future card UI
should render without expansion. Recency reflects practice, not recommendation
impressions. Heuristics have synthetic regression coverage, not efficacy evidence.

## Git boundary

Stay on codex/adaptive-recommendations-v1, based on original d9f7b02a.
Review/tuning commit added locally. main remains088be3e0a508275f5e68d8c7d168c455720abfbe.
No push, merge, deployment, migration, reset or environment/config changes.
