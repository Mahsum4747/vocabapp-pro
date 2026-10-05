# Karta UX architecture v1

Conceptual design · 2026-10-05 · German A1 · no UI implementation.

[System architecture](KARTA_LEARNING_ARCHITECTURE_V1.md) defines truthful evidence/compatibility. [German A1 blueprint](GERMAN_A1_BLUEPRINT.md) defines the 10 units, 40 lessons and 100 skills. These counts are curriculum scope, not visible navigation labels. Current-state observations are based on source and existing screenshot-review documentation; this task does not claim a fresh rendered UI audit.

## 1. Product decision: five primary intents

Choose **Home, Learn, Practice, Library, Progress**. Account/settings move to a utility entry. Exam Prep becomes a future optional destination only when it offers real supported tasks; no permanent sixth tab or disabled teaser today. This separates doing the course, deliberate reinforcement and managing personal material. It avoids the current Home/My Library split on the same route and the accidental classification of Lesen as grammar.

| Area | User intent and contents | Exclusions | Structured-learning relation | Mobile | Desktop |
| --- | --- | --- | --- | --- | --- |
| Home | “What should I do now?” One primary next action, one secondary, restrained daily summary and optional recent item | Full catalogue, set management, every progress metric, creation-first hierarchy | Entry to resume/next lesson or urgent Review; remediation explains why | Single column, primary CTA visible early; five-item bottom navigation | Readable main column; small optional supporting summary, never dashboard grid |
| Learn | “Follow the German A1 course.” Units, lessons, next step, prerequisite help, checks/revisits | Unbounded user/Paste curriculum, all advanced drills | Canonical published path and resume | Ordered unit rows; selected unit expands; no giant skill graph | Ordered path with current-unit detail and restrained context panel |
| Practice | “Reinforce something intentionally.” Vocabulary Review/Weak Words, grammar/mixed review, reading, writing | Editing sets, lesson-order management, exam certification | Optional targeted practice linked back to explanations/lessons | Domain selector/list, one drill session at a time | Domain sections and focused workspace; A1 default scope clearly stated |
| Library | “Manage my material and look things up.” Sets, folders, public copies, saved/custom/generated/Paste content and Reference | Canonical course order, progress dashboards, automatic course credit from imports | Personalization/resource support; visibly distinct from curated course | Search/list, create/import menu, reachable Organize, contextual bulk mode | List/detail or set workspace, folder organization, searchable resources |
| Progress | “Understand what I can do and what needs attention.” Course milestones, domain evidence, memory, assessments | Global fake CEFR score, activity leaderboard, evidence coefficients | Explain finished versus independently demonstrated versus revisit | Course summary then domain sections; tap for details | Domain comparison without collapsing them; drill-down in a readable detail panel |
| Exam Prep (future optional) | “Prepare for this provider's format.” Versioned competency/task map, coverage gaps and original/licensed format practice | Provider question copies, replacing Learn, automatic pass claim | Consumes curriculum evidence plus listening/speaking and format assessment | Discover from Learn/Progress only when enabled; own focused subflow | Optional secondary navigation item; provider-specific overview, not a new course silo |

Listening and speaking eventually appear as real Practice/Progress/Learn domain entries within the same structure. Do not add empty tiles or a target-language-specific navigation architecture that requires a rebuild. The active track is a compact human label (“German · supported in Turkish”, for example); primary source, support-language preference and future track switch are utility controls, not five competing curricula.

### Navigation contract

Mobile bottom bar: five equal destinations with visible text, semantic links, selected state beyond color, comfortable targets and safe-area clearance. At narrow widths prefer short labels; do not truncate the active destination into ambiguity. Account/avatar is top-right utility. Desktop uses a compact left navigation or header rail with the same order, selected intent and account utility. Persistent New set leaves the global header and lives in Library; course lessons use a focused shell with return-to-unit and progress instead of global creation controls.

For virtual keyboard and small heights, keep response/Check reachable without overlapping navigation; reuse current safe-area/keyboard reasoning and test actual behavior later. Do not hide core destinations based on mastery or use color as the only active marker.

These are **future** destination contracts. Existing URLs remain usable until redirects/aliases are deliberately implemented. Current `/` and `/?view=mine`, `/grammar`, `/review` and set-mode deep links are compatibility surfaces, not instantly rewritten by this document. Proposed `/learn`, `/practice`, `/library`, `/progress` are conceptual future routes, not working links. Preserve share IDs, query semantics, owned-set access and auth lazy boundaries through rollout.

## 2. Home: one decision, restrained context

Current source places Today, New set/Generate shortcuts, the primary recommendation, progress stats, Grammar entry, recent set and own/public sets on one screen. Today and recent-set panels compete visually with the decision aid; Library management dominates navigation effort. Retain useful facts, simplify hierarchy.

Desired order:

1. Quiet greeting/active German text path context.
2. **One primary action**: resume valid current lesson, start next eligible lesson, or address substantial scheduled vocabulary urgency under an approved course-aware action policy.
3. **One secondary action**: due Review or a strong, well-evidenced remediation suggestion, deduplicated against primary. If no meaningful secondary, omit it.
4. Modest daily activity summary; distinguish existing word-review goal from lesson work. Do not pretend current dailyStats measures all learning.
5. Optional single recently active personal item with a Library link below the principal decision; omit if redundant with the primary.

Weak skill is part of the selected recommendation, not an additional compulsory card. “Continue current lesson” includes clear unit/title and short stage context. Primary is not duplicated elsewhere. Zero due words alone does not mean course complete. Low/no evidence offers “Start German A1” or a learner-chosen practice task, not a weakness diagnosis.

Future arbitration uses one explicit resolver composed with the existing recommendation engine. Large scheduled urgency can lead; otherwise valid course continuation leads; severe remediation may be promoted only through an approved, tested policy. Exact thresholds are not UI constants and are not changed in this blueprint. A learner may deliberately choose Learn even with a backlog; no punitive course lock.

Remove prominence from New set/Generate, standalone Grammar-directory tile, public-set browsing, XP/achievement blocks and several competing statistics. Move them to Library/Practice/Progress or utilities. Preserve Today queue truth and current recommendation copy/stale-target checks. Keep goal/streak as small optional context; preserve their distinct timezone meanings. Avoid guilt copy about overdue work.

Home states: loading primary without blocking shell; empty course history means a clear start; private-data error offers a quiet retry and valid Learn entry; signed-out users see public welcome/library access and sign-in; no private request using dev fallback. Stale target disappears or falls back safely. Offline/saving failures explicitly distinguish answered work from acknowledged progress.

## 3. Learn, units and visible progress

Present German A1 as an ordered list of ten meaningful units. Each row has outcome, compact lesson milestone count and at most one useful status. Current unit expands to its four lessons. Show next recommended lesson; completed work stays reachable; a revisit indicator is subordinate. Never render a 100-node graph as the main path.

Progress labels use separate meanings: “2 of 4 lessons finished”, “Unit check needs follow-up”, “Use independently demonstrated”. A lesson finish icon is not a mastered icon. Locked **evaluation** explains prerequisites with one actionable link; content previews/reference remain accessible. Guided learning can continue while weaker skills get repair work. No opaque padlock maze.

Selecting a future level shows its availability honestly; don't expose a detailed empty A2–C2 tree. Future languages switch curriculum releases through target-track context, not duplicate top-level nav. German A1 remains one path regardless of explanation language.

## 4. Focused lesson experience

Hierarchy: return-to-unit → outcome/title → stage label/short step progress → content/explanation → one task → primary action. Stage names describe learner purpose (“Try it yourself”, “Use it in a message”) rather than internal taxonomy everywhere. A collapsible “Why this works” or Reference drawer holds deeper tables/contrasts. The task owns visual attention, not badges/XP.

Flow follows blueprint stages with mandatory independent use for productive skills and reading-specific retrieval for comprehension. 8–15-minute initial chunks are a design target; no artificial timer or forced speed. Reading and writing enter early in short forms, not as disconnected end-of-course modes. Lesson checks follow teaching; unit/checkpoint assessment is explicitly labelled independent work with different help rules.

Persistent Check/Continue footer uses semantic controls, safe-area space, correct disabled explanation and keyboard activation. Success/error feedback appears adjacent to the response; no automatic advance after reading feedback. “Try again” preserves context, marks assistance/retries and offers a helpful explanation. Use normal page flow for long text; a progress rail never steals the reading width.

Resume surfaces show “Continue: short message” and return to the pinned incomplete task/draft. A saved milestone is visually different from saving/unacknowledged work. On retry, reuse the attempt identity; no UI success claim before required save. With withdrawn content, explain a replacement and keep historic completion. Exit confirmation is only for unsaved response that would actually be lost; avoid habitual confirmation dialogs.

## 5. Practice and Library distinction

Practice reinforces already introduced or deliberately selected skills. Learn gives recommended teaching order and coherent lessons. Show these short explanations once at entry, not as algorithm vocabulary. Practice has:

- Vocabulary Review and Weak Words, preserving current pool/queue/miss routing.
- Grammar Practice with A1-first curated scope; advanced topics remain reachable through explicit level/category filters.
- Mixed Grammar Review for eligible learned skills, when implemented.
- Reading Practice, including current bundled Lesen and later original skill-tagged text.
- Writing Practice with clear “Use set words” and “Respond to a task”; later forms/guided/free writing.

No fake Listening/Speaking availability. Targeted practice can show the associated lesson/reference; it need not force restart of the entire lesson. Assessment is an explicit separate entry/check mode, not the random Practice again button.

Library owns creation/import/Generate/Paste and material organization. Group “My sets”, “Saved practice” and “Reference”; retain public discovery/copy as a separate view. Label personal/generated/reference material clearly. Imported content never silently becomes core course work. Organize is a persistent secondary action; bulk controls appear only during selection with clear cancel and selected count. Do not mix course locks into custom set browsing.

### Grammar Reference placement decision

Choose **Library → Reference → Grammar**, with direct contextual access from Learn and Practice and a stable direct reference URL. A sixth primary navigation destination would over-weight rules and crowd mobile; burying rules inside personal sets would make lookup difficult. A global search shortcut and direct lesson/drill links resolve discoverability without a new tab. Library's Reference is curated, read-only and visually distinguished from editable personal assets.

Reference page fields: topic title/plain-language summary; optional compact table; original reviewed examples; contrasted forms/meanings; common errors; related skill IDs presented as human outcomes; related verbs/prepositions/senses; “Learn this” and “Practice this” links respecting eligibility. Search supports rule names and meaningful learner terms. Reference browsing grants no course/mastery credit.

### Map all 19 existing rules

| Existing rule ID | Future Reference role | A1 linkage / boundary |
| --- | --- | --- |
| plural | Noun plural lookup and lexical patterns | G11/V04; memorize reviewed forms, not a universal suffix rule |
| nicht-kein | Negation contrasts | G17–G19,G24,G54 |
| possessive | Possessive noun phrases | G20,G28; bound taught cases |
| trennbare-verben | Prefix meaning/clause placement | G37–G39; later G56 participle support |
| modalverben | Modal meaning/forms/bracket | G32–G36; advanced meanings filtered |
| imperativ | Instructions/address | G40–G42 |
| pronomen | Pronoun roles/forms | G01,G25,G46; don't present every paradigm as mastered |
| adjektivendungen | Deeper declension reference | Not core A1; G50 links predicative distinction without the full drill |
| steigerung | Comparison reference | Later curriculum; common lexical comparison may be glossed, no core gate |
| passiv | Passive reference | Outside core A1, retain for advanced practice |
| konjunktiv | Konjunktiv II reference | Outside core A1; G35 teaches selected request chunks only |
| relativsaetze | Relative-clause reference | Outside core A1 |
| partizipialkonstruktionen | Participial construction reference | Outside core A1; not equivalent to G56/G57 participle recall |
| nominalisierung | Nominalization reference | Outside core A1 |
| funktionsverbgefuege | Functional verb combinations | Outside core A1; no automatic equivalence to V07 |
| modalpartikeln | Modal-particle reference | Later language nuance; incidental chunks not an A1 gate |
| konjunktiv1 | Reported-speech reference | Outside core A1 |
| subjektive-modalverben | Advanced modal meanings | Not G32–G36 everyday modal use |
| passiversatzformen | Passive alternatives | Outside core A1 |

The current structure lacks dedicated articles, nominative/accusative foundations, basic V2/questions, sein/haben and bounded Perfekt reference entries. Add reviewed A1 content later using the shared renderer, not AI filler. Rule IDs and practice route/topic IDs differ in places; use a reviewed mapping, never derive IDs by label normalization.

## 6. Progress: truthful domain views

| View | User sees | Internal only / unavailable until implemented |
| --- | --- | --- |
| Vocabulary memory | Due/overdue, reviewed/new and existing memory trend/score clearly labelled | Stability/difficulty/weights unless in optional technical details; not general language mastery |
| Grammar use | Human skill families, developing/independent/revisit plus concrete next task | Opportunity counts, family/evaluator/assistance details; legacy topic accuracy remains labelled practice accuracy |
| Reading | Capabilities and independent text evidence; existing passage completion separately | No invented A1 accuracy from generic Lesen rounds |
| Writing | Communicative abilities, recently demonstrated task functions, specific next improvement | No percentage correct derived from missing error tags; unassessed AI output stays unassessed |
| Course | Lessons/units/checkpoints finished, with unresolved checks visible | Release/graph IDs and rubric internals |
| Assessment | Independent domain demonstrations and remaining gaps; text-only scope | No automatic Goethe/telc readiness or global CEFR level |
| Activity | Review goal and optional streak, clearly activity | Current local-day/UTC distinction does not become proficiency |

No single rainbow radar/global score. An empty domain says “Not assessed yet” and links to an appropriate first task. Sparse evidence avoids categorical weakness. “Demonstrated in guided work” differs from independent ability. Future listening/speaking appear when meaningful data exists, with explicit scope rather than misleading zeros.

## 7. Text wireframes for the nine core screens

Descriptions are layout intent, not generated UI mocks or code.

### Home

Top priority: one next meaningful action. Hierarchy: compact identity/track header; large readable next-action title with unit/stage or actual review count; one-sentence reason; primary CTA; optional secondary action; small activity strip; one recent item. Main CTA: Continue lesson / Start German A1 / Open Review according to the resolver. Secondary: the strongest nonduplicate practice action; Library link. Mobile: single column, primary within the initial viewport when ordinary content fits; flexible wrapping and bottom-bar clearance. Desktop: centered main column, optional narrow activity context; never three equal hero cards.

### Learn

Top priority: understand position and next step. Hierarchy: German A1 text-path title and scope; continuation banner; ordered ten-unit list; current unit expanded; understated completed/check/revisit status. Main CTA: Continue current lesson. Secondary: unit details, Reference, optional supported prerequisite help. Mobile: sequential rows with four lessons inside current unit, no horizontal tree. Desktop: list with selected unit details adjacent, clear reading order and no unnecessary full-screen graph.

### Unit view

Top priority: understand the unit outcome. Hierarchy: breadcrumb; unit purpose; four lesson rows with stage/finish status; vocabulary preview; unit-check entry when appropriate; explanation of any follow-up. Main CTA: next/resumed lesson, or unit check after learning work. Secondary: revisit lesson, relevant Reference, targeted Practice. Mobile: stacked rows and expandable vocabulary preview; footer CTA stays clear of nav. Desktop: main lesson list plus small outcome/lexical context panel. Prerequisites show specific repair links; no decorative lock-only state.

### Lesson

Top priority: perform one learning step. Hierarchy: back/unit; outcome; step progress; short model/explanation or text; one response; adjacent feedback; Check/Continue. Main CTA changes with response state and never auto-advances. Secondary: help/Reference, save/exit, intentional retry. Mobile: one column, input visible above keyboard, footer within safe usable viewport, long content scrolls. Desktop: readable task width, optional help drawer; no giant left card and wasted whitespace. Check is accessible by form/keyboard; screen reader receives concise feedback, not every animation.

### Practice

Top priority: pick intentional reinforcement. Hierarchy: recent/targeted suggestion if useful; domain selector; Review/Weak Words; grammar with scope/filter; mixed review availability; reading/writing entries. Main CTA: start selected task with honest destination. Secondary: related lesson/reference, change level/set or browse all topics. Mobile: domain list/tabs with local selection, no six-tile carousel. Desktop: organized sections and a focused selected task description. During sessions use the same study shell where compatible; no mixed review pretending to exist before implementation.

### Library

Top priority: find/manage personal material. Hierarchy: search + create/import action; My sets/Saved practice/Reference views; folder/list filters; result list; selected item detail. Main CTA: Create/import when empty, open selected material when populated. Secondary: Organize, public discovery/copy, Generate/Paste via explicit menu, export where already supported. Mobile: search/list first; item detail opens a full page; bulk selection has fixed reachable cancel/action region without overlaying content. Desktop: split list/detail where helpful; folders are labels, not invented nested structure.

### Grammar Reference

Top priority: answer a specific language question. Hierarchy: search/topic list; selected title/summary; focused table/examples; contrast/mistakes; linked skills and verbs/prepositions; Learn/Practice links. Main CTA: Practice this only if supported/eligible; otherwise Learn relevant lesson or browse. Secondary: related rule, copy/open a reference link; no edit/import for curated content. Mobile: table overflow handled accessibly or stacked small paradigms; no whole-page horizontal scrolling. Desktop: left topic navigation and readable article width. Full advanced rules remain findable but clearly outside the A1 path.

### Progress

Top priority: understand ability and next work. Hierarchy: text-path milestones; domain sections; recent independent evidence and unfinished assessment needs; concrete follow-up. Main CTA: selected next learning/practice action. Secondary: assessment detail, activity history, optional evidence detail in human language. Mobile: stacked domain sections, expand one; no tiny dashboards. Desktop: separate domain rows/columns with aligned labels, readable detail. Finished lessons can coexist with “Writing not assessed”; no generic 100% celebration masking it.

### Exam Prep (future)

Top priority: understand supported provider coverage. Hierarchy: provider/level/adapter version; prerequisites and missing domain coverage; competency map; format practice; independent readiness checks. Main CTA: supported format practice or address a missing prerequisite. Secondary: Learn/Practice, provider official information. Mobile: focused provider overview with no sixth compulsory tab. Desktop: optional secondary nav and competency detail. Before listening/speaking/evaluation coverage exists, say readiness cannot be established; never substitute text-path completion for it. No official questions copied.

## 8. Three visual directions (unimplemented)

Colors below are design candidates, not verified contrast results. Audit actual text/control state contrast during implementation; do not treat a palette as accessibility proof.

| Aspect | A — Quiet Editorial (recommended) | B — Precise Studio | C — Warm Library |
| --- | --- | --- | --- |
| Mood | Calm language workspace, confident and readable | Focused modern tool, precise and restrained | Welcoming adult learning notebook, composed |
| Color philosophy | Warm off-white ground, deep ink, one restrained teal action; muted semantic warnings | Cool neutral ground, charcoal ink, subdued indigo action | Soft parchment ground, dark brown ink, restrained moss action |
| Candidate palette | Ground #F7F7F2; ink #182522; action #215E55 | Ground #F5F6F8; ink #1B2230; action #3C4C8A | Ground #FAF7F0; ink #2C2923; action #465B43 |
| Typography | Legible sans body; slightly expressive headings or compatible editorial serif after rendering audit | One high-quality sans family with disciplined size/weight; tabular details sparingly | Humanist sans body, modest serif lesson headings; never textbook density |
| Surfaces | Mostly flat; one subtle raised primary study surface | Tonal panels with fine separators, limited shadow | Paper-like tonal separation, no fake texture required |
| Cards | Sparse action cards; lesson/unit lists use rows | Functional grouped lists; one action panel | Low-contrast groupings; avoid a card for every metric |
| Navigation | Quiet selected rail and readable mobile labels | Compact aligned rail/header, explicit selected marker | Understated section labels, friendly short copy |
| Lesson UI | Wide reading comfort, strong prompt/response separation, restrained annotations | Clear task geometry, disciplined toolbar/footer, precise form states | Gentle model/example presentation, strong single response area |
| Mobile feel | Airy single column, clear touch feedback, fluid content | Efficient spacing without tiny touch targets, stable keyboard layout | Comfortable text and generous reading rhythm; no ornamental clutter |
| Dark mode | Deep green-neutral ground, softened bright text, muted teal accent | Charcoal-blue neutral ground, controlled indigo emphasis | Warm dark neutral surfaces, gentle cream text, subdued moss |

Recommend Quiet Editorial for adult text-first learning because it gives explanations and writing space without making Home a dashboard. This is a proposal; existing colors are not binding. Any option must unify surrounding pages; a spectacular lesson isolated from incoherent navigation is insufficient.

System principles for all options: consistent type scale and reading width, spacing rhythm, radii and semantic state tokens; restrained shadows; one clear CTA per task; color reserved for meaning; no rainbow categories or excessive gradients. Distinct error/warning/status roles include text/icon meaning, never color alone. Motion is brief purposeful feedback; respect reduced motion, avoid celebratory interruption of a writing task. Dark mode needs deliberate hierarchy and contrast for each state, not inversion.

## 9. Full current-feature migration map

No deletion or route change is performed now. “Merge” below refers to future entry organization, not Git merging or forced data consolidation.

| Current feature | Future role | Keep/Move/Merge/Refactor | Notes |
| --- | --- | --- | --- |
| Home | Next action and restrained context | Refactor | Keep Today/recommendation semantics; remove full directory prominence |
| Review | Practice → Vocabulary Review and urgency action | Keep/Move | FSRS/queue/session logic unchanged |
| Weak Words | Practice → Vocabulary needs attention | Keep/Move | Preserve miss routing and eligibility; don't invent a new weakness detector |
| Grammar Hub | Practice → Grammar catalogue | Move/Refactor | A1 scope first, full catalogue still available; not Learn curriculum |
| Articles | Targeted noun-gender practice plus possible lesson interaction | Keep/Reuse/Refactor | Existing memory miss effects preserved standalone; course adapter separates evidence |
| Cases | Targeted bounded case practice and future lesson tasks | Keep/Reuse/Refactor | Existing full grid is not an A1 learning path; limit curriculum content |
| Conjugation | Practice and form-generation interaction | Keep/Reuse/Refactor | Taught verbs only in course; don't inherit scheduling writes implicitly |
| Satzbau | Controlled sentence ordering | Keep/Reuse | Chip visibility means recognition/manipulation, not independent production |
| Cloze | Context reinforcement and future unaided cloze variants | Keep/Reuse/Refactor | Separate choice/typed evidence and course write effects |
| Standalone grammar drills | Grammar Practice, level-filtered | Keep/Move | Advanced catalogue kept outside core; adapt content before curriculum use |
| Diktat | Existing optional Practice | Keep/Move | No new listening curriculum or audio ingestion |
| Grammar Rules | Library → Reference, contextual direct links | Keep/Move/Extend later | 19-rule infrastructure reused; add missing reviewed A1 foundations |
| Grammar Paste | Library → Saved practice/custom grammar | Keep/Move | User AI material labelled generated; separate progress and save retries |
| Lesen | Practice → Reading; reviewed future lesson rendering | Keep/Move/Refactor | Level chooser remains actual launch until route supports explicit selection |
| Lesen Paste | Library → Saved reading practice | Keep/Move | No canonical completion/assessment credit by import |
| Write | Practice → Writing: Set words / Task | Keep/Move/Refactor | Set-independent course tasks and A1 launch need later contracts |
| WriteIt | Controlled production within compatible practice/lessons | Keep/Reuse | Preserve relevance semantics separately from free writing |
| Organize | Library management action | Keep/Move | Single-level folders and existing bulk behavior retained |
| Library/set pages | Personal content workspace and mode launch | Keep/Move | Preserve card identity/sharing/reference/ownership, public discovery |
| Adaptive recommendation card | Home selected secondary or primary action context | Keep/Reuse/Refactor | One engine, one arbitration boundary, no ranking copied into UI |
| LearningSignals | Progress/recommendation source adapter | Keep/Extend later | Preserve null/unavailable metrics and no-write reads |
| New set/Generate shortcuts | Library creation menu | Move | Explicit user action; no hidden AI calls |
| Recent set block | Optional single Home recent item; full list in Library | Move/Reduce prominence | Remove competition with lesson continuation |
| XP/achievements/streak | Optional activity/account detail | Move/Reduce prominence | Do not treat as learning goals or mastery |

Eventually deprecate duplicated Home-directory entry groups and compatibility labels after users have replacement paths. Keep old deep links through explicit compatibility routing; historical records and unsupported advanced content are not purged. Never automatically merge personal Paste topics into canonical skill definitions by text similarity.

## 10. Acceptance and rollout constraints

Before a later UI implementation is complete, inspect desktop/mobile screenshots and perform a second polish pass where needed. Review the whole page, not one component. Validate keyboard/reading order, semantic controls, visible focus, sufficiently contrasted states, >=44px practical touch targets, 390px and narrower layout, long/localized text, 200% zoom, safe areas and keyboard response. Avoid brittle fixed heights and horizontal overflow. Large tables need deliberate accessible behavior. Motion/reduced-motion and dark-mode states are included.

Loading, empty, error, unavailable, signed-out, saving/retry, withdrawn content and long-copy states are designed for every main flow. Preserve current auth lazy boundaries and test compiled SSR later. Screenshot review is a future implementation acceptance requirement; no production redesign or screen generation is performed in this task.

Rollout aligns with the primary roadmap: first one reviewed lesson slice; then Learn coverage; integrated Practice/Library links; truthful Progress/evidence; finally independent assessments and Home arbitration. Preserve existing practice during every increment. Open product choices are visual direction, initial placement policy and writing evaluation capacity—not whether to keep reference, memory scheduling or existing user content.
