# Karta learning architecture v1

Design proposal · 2026-10-05 · German A1 text-learning scope · no implementation authorization.

Audited checkout: `97510374395ab4c859d5ffc98b94b58e36df4d7b`; working branch `codex/karta-learning-architecture-v1`. All six repository-local Karta skills were discoverable in this session and read before design work. This proposal preserves application behavior, dependencies, storage, authentication, scheduling and production configuration.

## 1. Decision and document ownership

Build one original German A1 curriculum that teaches usable vocabulary, grammar, reading and writing through a resumable lesson path, deliberate practice and independent assessment. Keep existing practice features available while adding structured learning in later authorized phases.

- This document owns system boundaries, current-state audit, evidence semantics, compatibility, governance and roadmap.
- [German A1 blueprint](GERMAN_A1_BLUEPRINT.md) owns the skill registry, prerequisite graph, 10 units/40 lessons, exercise mapping and assessment coverage.
- [UX architecture](KARTA_UX_ARCHITECTURE_V1.md) owns navigation, Home hierarchy, screen descriptions and three visual directions.

These are proposals, not a representation of features already shipped. The registry contains 60 grammar, 14 reading, 16 writing and 10 vocabulary-related skills: **100 total**. Vocabulary skills represent abilities, not a word-count inventory. Listening/speaking and future exam competencies are not counted.

The first completion claim is **“German A1 text-learning path complete”**. It must never imply complete CEFR A1 proficiency: listening and spoken interaction/production are outside this release. A full A1 language claim requires those domains later. Within the text scope, completion requires transferable performance, not just lesson traversal.

## 2. Audit method and authority

Read `CODEX_HANDOFF.md`, `LEARNING_SIGNALS.md`, `ADAPTIVE_RECOMMENDATIONS.md`, `ADAPTIVE_RECOMMENDATIONS_REVIEW.md`, and `HOME_RECOMMENDED_NEXT.md`. Queried current indexed source before source follow-ups; inspected route and static-content sections omitted by graph output. Evaluated only static exported reading/rule/writing arrays in an isolated local VM to verify counts and identities; did not invoke application server functions or inspect learner records.

Reviewed source in Home, AppShell/MobileNav, Grammar Hub/rules/Lesen/Write/review routes; grammar curriculum/progress/assessment, reading progress, FSRS/mastery, writing tags, and relevant pure tests. Test inspection covered queue/identity/evidence distinctions, grammar question construction, writing prompt/tag validation and recommendation route honesty. Tests were **read, not run**; no new runtime or browser verification is claimed for unchanged UI. Historical test totals in handoff documents are not fresh results.

The handoff contains chronological updates followed by a superseded baseline. Current source and later hardening/recommendation notes take precedence. For example, immutable card IDs, transactional round writes and saved Paste retry receipts are already implemented; do not propose those as absent. `RTK.md` and `AGENTS.project.md` were not found at repository root in the earlier audit; no claim that their instructions were read.

### Current-state map

| Existing capability | Verified implementation / limit | Classification and future decision |
| --- | --- | --- |
| React/TanStack Start + Router, TypeScript, Tailwind/Radix, Zustand | File routes and server functions; shared study chrome; in-memory client store | KEEP stack; REUSE transport, UI primitives, session shell; no Next.js or replacement platform |
| Identity and learning storage | Better Auth with SQL identity; authenticated server-side Firestore learning records | KEEP security boundaries; design new domain contracts without changing storage now |
| Vocabulary sets, sharing, enrichment | Embedded cards; immutable opaque IDs; active/reference eligibility; German and Kurdish resources | KEEP Library; REUSE linguistic lookups; preserve user corrections and attribution |
| Memory review | Custom FSRS-shaped scheduler, not upstream fitted FSRS; stability-derived display score; due/overdue/weak policy | KEEP scheduler exactly; REPOSITION review under Practice and Home urgency |
| Articles/Cases | Separate drill counters; misses can affect vocabulary memory; completed rounds affect grammar aggregate | REUSE existing standalone behavior; REFACTOR LATER through a new curriculum adapter that prevents accidental scheduler writes |
| Conjugation/Satzbau/Cloze | Set-scoped typed/form/order/context practice; existing memory logging in modes | REUSE interactions and eligibility, not unchanged scoring inside lessons |
| Grammar Hub | Broad A1–C1-labelled practice catalogue; five set-scoped modes plus standalone drills | REPOSITION as Practice; REFACTOR LATER scope filters and skill adapters |
| Grammar progress | Topic-level rolling 20-round question-weighted accuracy, lifetime attempts, last practice | KEEP legacy statistics; MISSING fine-grained, assistance-aware skill evidence |
| Rule browser | 19 structured static rules, shared table/example renderer, search and categories | KEEP content/reference entry; REUSE renderer; extend missing A1 explanations after editorial review |
| Bundled Lesen | 35 A1 choice passages: 10 messages/emails and 25 signs; 15 A2, 30 B1, 25 B2 | REPOSITION reading under Practice; REUSE renderer; existing A1 exposure is not independent mastery |
| Reading progress | Unique completed passage IDs per level; generic `lesen` round accuracy across levels | KEEP historical completion; MISSING per-item reading skill evidence and independent assessment |
| Write | Set words and Task tabs; A1/A2/B1 bank; starts Words, Task default A2; six A1 tasks | REPOSITION writing under Practice; REUSE editor/feedback; MISSING form completion and calibrated success rubric |
| Writing feedback | Nine structured error categories; optional AI; best-effort saved logs | KEEP support feedback; REFACTOR LATER outcome contract; missing tags do not prove correctness |
| WriteIt | Inflected-phrase relevance checking inside Articles/Cases, optional AI assistance | REUSE controlled-production interaction separately from free Write grading |
| Grammar/Lesen Paste | External-AI prompt/import, runtime validation, saved owned content, separate progress and retry receipts | KEEP Library tools; never promote automatically to canonical curriculum/assessment |
| LearningSignals | Authenticated read-only derived model; source/evidence/recency; null unavailable metrics | REUSE adapter boundary; extend later; never backfill invented skill mastery |
| Adaptive recommendations | Pure deterministic bounded engine and actual route registry; synthetic regression tests | KEEP current policy; REUSE remediation choices; later combine with course continuation at one explicit decision boundary |
| Home | Today CTA; creation shortcuts; recommendation; stats; Grammar entry; recent set; own/public Library | REPOSITION into next action; DEPRECATE EVENTUALLY duplicated feature-directory blocks after navigation rollout |
| Navigation/Organize | Mobile Home/My Library/Account; header New set; folders and public content inside Home | REPOSITION intent navigation; KEEP Organize as Library action; preserve old links |
| Structured units/lessons, mixed grammar, held-out assessments | No canonical fine-grained path/evidence/resume contracts found in inspected areas | MISSING; add incrementally, not a full-repository rewrite |

### Semantics that must survive

Card ID is memory identity; mutable text is not. Moves preserve current memory and retain historical set context. Reference sets, archived/excluded cards and unsuitable tiny sets remain outside current review eligibility. Due includes overdue; overdue has the current >24-hour boundary. Scheduler state “mastered” and the product display threshold differ. Neither is a CEFR skill certificate.

Grammar accuracy is a rolling question-weighted measure, not lifetime correctness. Participation bands none/low/medium/high are sample bands, not calibrated mastery/confidence. Reading completion measures finishing a passage, not correct interpretation. Per-level reading accuracy remains unavailable. Writing logs cannot yield a truthful error-free submission rate. Local-day vocabulary goals and UTC streak semantics remain explicit; do not reinterpret them as all-domain learning activity.

## 3. Source discipline and scope decisions

Sources were opened on 2026-10-05. Summaries below are deliberately short; the original curriculum, prerequisite choices and proposed rubrics are Karta design decisions rather than reproduced source material.

| Source | Verified use | Limit / release implication |
| --- | --- | --- |
| [CEFR Companion Volume 2020](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4), printed pp. 54–60, 66–68, 82–84, 132 | A1 receptive/production boundaries; very short familiar texts, simple personal writing, basic repertoire | Framework, not a mandatory German grammar sequence or a numeric mastery formula |
| [Goethe A1 test-description/inventory](https://www.goethe.de/pro/relaunch/prf/sr/Pruefungsziele_Testbeschreibung_A1_SD1.pdf), printed pp. 100–106 (PDF indexes one higher) | Bounded grammar coverage check: selected past forms, basic cases, clause frames and everyday functions | Receptive inventory is broader than mandatory productive perfection; no copied tasks, examples or answer keys |
| [Goethe Start Deutsch 1 word list](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf), printed pp. 3–5 | Everyday lexical domains; roughly 650 entries, about half active as that exam's orientation | Coverage comparison only; not a universal CEFR quota and not a copied Karta lexicon |
| [telc Start Deutsch 1 / Deutsch A1](https://www.telc.net/sprachpruefungen/zertifikatspruefung/deutsch/start-deutsch-1-/-telc-deutsch-a1/) | Exam includes receptive and productive work, including listening/speaking | Supports separate future exam adapter; text-only course cannot imply complete exam readiness |
| [Goethe: Profile Deutsch](https://www.goethe.de/de/spr/sbp/prd.html) | Confirms a German-specific curriculum planning/resource framework | Full book/database not accessed; detailed level-inventory alignment remains an editorial release gate |
| [IDS: Perfekt](https://grammis.ids-mannheim.de/vggf/2227?termini=term) | Auxiliary plus participle linguistic validation | Grammatical fact, not proof of a teaching level/order |
| [IDS: Wechselpräpositionen](https://grammis.ids-mannheim.de/progr@mm/6858) | Location versus destination distinction; movement alone is not the case rule; page targets A2 | A1 uses selected everyday chunks/contrasts, not full two-way-preposition generalization |
| Repository linguistic resources and attribution files | Bundled lookup, verb morphology/government, rule and reading resource compatibility | Existing data availability does not establish appropriate A1 frequency, sense or license for every new use |

### A1 boundaries

Core includes present tense; basic clause/question/negation patterns; nominative/accusative; a bounded dative repertoire; modals including common `sollen` instructions; separable verbs; basic imperatives; predicative adjectives; everyday time/location phrases; selected Perfekt and `war/hatte` uses. Limited destination/location contrasts serve practical comprehension.

Full adjective-declension paradigms, unrestricted two-way-preposition drills, general Präteritum, productive genitive paradigms, comparative systems, subordinate `weil/dass` clauses, relative clauses, passive and general Konjunktiv are **not core mastery gates**. Common fixed expressions or incidental receptive forms can be glossed. An A1-labelled text may contain an untaught form: label receptive exposure, supply support and never silently assess its production. The inspected exam inventory and IDS teaching level differ in granularity; this proposal resolves that by narrowing productive scope, with expert review before publishing.

## 4. Logical architecture and contracts

Keep one application. Introduce conceptual layers, not new services/frameworks. No physical collections/tables or migration scripts are chosen in this design.

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| Karta Core | Lesson/session orchestration; exercise delivery; versioned evidence; progress projection; assessment/recommendation interfaces | Hard-code German morphology, translate curricula, infer mastery from an opened screen |
| German Language Pack | Sense-aware lexicon, morphology, accepted forms, syntax facts, orthography and validators | Decide teaching order or learner unlocks |
| German A1 Curriculum | Published units, lessons, skill graph, stages, content purposes, completion/rubric requirements | Modify FSRS, depend on owning a custom vocabulary set |
| Source-language support | Reviewed explanations/contrasts for primary and support languages | Alter canonical target skill or outcome standard |
| Personal Library | Owned sets/Paste content, imports, user modifications and optional lexical links | Overwrite canonical assets or grant curriculum credit merely through import |
| Learning evidence | Observable attempts and context; immutable historical outcome records | Treat every task as a memory-card review or count one attempt several times |
| Read models | Current course progress and multidimensional skill summaries | Hidden writes/cleanup or a competing persistent truth without measured cache need |
| Exam adapter (future) | Versioned Karta-skill → provider competency/task mapping | Replace curriculum with exam banks or certify readiness without uncovered modalities |

### Entity contracts (logical, not database schemas)

| Entity | Required information and invariants |
| --- | --- |
| LearningTrack | Immutable opaque track identity, learner identity from verified session, primary source code, target code, optional support-language codes; German curriculum selected by target, not duplicated per source |
| CurriculumRelease | Stable curriculum identity, immutable release ID, level/domain scope, ordered units, referenced skill/content/rubric versions, review/publication status; only published releases enroll learners |
| SkillDefinition | Immutable canonical ID, domain, outcome, productive/receptive scope, hard/soft/related edges, reference links, evidence profile; display labels editable |
| Unit / Lesson | Immutable IDs; order belongs to release; outcome, introduced/consolidated skills, lexical targets, stage plan, prerequisite expression, lesson-check specification |
| LanguagePackEntry | Language, lexeme ID, sense ID, forms/frames, provenance; translation links connect senses, not text equality |
| ContentItem | Immutable item ID + version, purpose teach/practice/review/assessment, primary/secondary skills, accepted responses or rubric, language/support metadata, difficulty constraints, source/license, review status, family ID |
| ExerciseTemplate | Response modality, instruction/answer contract, permitted assistance, grading adapter, accessibility needs; no rendering-specific persistence assumption |
| EvidenceEvent | Opaque event/attempt identity; owner + track + release; session/item/version/family; skill links; purpose/type; timestamps; first response, outcome/unknown, hint/reveal/retry context; evaluator/rubric version; optional lexical sense links |
| LessonSession | Owner + track + release; lesson/version; stage/item sequence snapshot; resumable response/draft state; acknowledgement state and revision; pinned content prevents mid-session reshuffle |
| AssessmentAttempt | Purpose, release/blueprint version, held-out families, attempt state, accommodations, support policy, per-domain results; official evidence only after required records acknowledged |
| SkillProjection | Derived multidimensional evidence status; provenance/window, supporting event IDs/counts; no single mandatory global percentage |

Use BCP-47-compatible language metadata while retaining existing `de/tr/en/ku` values through adapters. `ku` currently denotes the product's Kurmanji support; distinguish dialect/script metadata before wider Kurdish support. Primary source, explanation preference and target language are separate fields: current preference `direction` is useful compatibility input, not an authoritative track ID. Existing `CefrLevel` aliases represent different scopes; future contracts must avoid conflating Hub sublevels with curriculum/reading levels.

Skill IDs initially minted under `DE.A1.*` stay immutable even when an A2 lesson revisits them. `A1` identifies origin scope, not a prohibition on reuse. Moving a skill's teaching point updates release metadata; materially changing its meaning creates a new ID with explicit supersession. Family area labels are groupings and are not counted evidence skills.

### End-to-end lesson boundary

Authenticated learner selects curriculum/lesson → resolver pins published release and eligible stage plan → pack/curated content supplies a snapshot → renderer captures response/assistance → domain evaluator produces outcome or “unassessed” → owner-scoped idempotent acknowledgement → projections update → resolver offers continuation/revisit.

A future curriculum exercise reusing Cases or Conjugation UI must use a separate orchestration adapter. It must **not** mount an existing route that writes FSRS just to harvest grammar evidence. Current standalone routes keep their behavior; no changed semantics are implied here. Explicit vocabulary-memory review remains the only normal course-to-SRS entry; automatic ratings from writing quality are forbidden. Shared item attempts can support several skill dimensions without creating duplicate memory reviews.

## 5. Progress, mastery and compatibility

Maintain separate states:

- Path traversal: not started / in progress / lesson finished / unit checked / text path complete.
- Skill evidence: not enough evidence / developing / demonstrated in guided work / demonstrated independently / revisit suggested.
- Memory: current scheduler facts and existing display metric, labelled vocabulary memory.
- Assessment: not attempted / in progress / incomplete / demonstrated / follow-up needed.

An assessment need can coexist with finished lessons. “Revisit” is a new recommendation, not erasure of completion. A past result retains its release/rubric meaning even when the active course evolves.

### Evidence dimensions

Keep recognition, unaided recall, controlled production, communicative production, held-out transfer and later retention separate. Each carries actual opportunity counts, item-family diversity, assistance/retries, task/purpose, time, prerequisite exposure and evaluator reliability. A failed hint-assisted item and an independently corrected second attempt are distinguishable. No weighted formula, calibrated threshold or FSRS adaptation is implemented or claimed.

Legacy topic scores only support broad remediation suggestions. Never allocate one historical topic accuracy to several new micro-skills. Existing per-card article/case counters and generic `lesen` accuracy can be displayed with their current meaning. Tagless writing, missing logs, low samples and AI outages produce **unknown**, not success/zero mastery. Repeated same-family attempts are practice history, not multiple independent assessment observations.

### Language Use Evidence

A card can be recalled while its sense/collocation/frame is used incorrectly. For example, knowing a gloss for `warten` does not demonstrate `warten auf` in context. Store or derive use evidence linked to skill + lexeme sense + frame when explicitly assessed; do not reset card stability. The example illustrates a data distinction, not a mandatory A1 lexical entry. Likewise noun gender-memory and selecting an accusative article are related but not the same task.

### Recommendations and Home decision boundary

Keep `buildAdaptiveStudyPlan` and its current LearningSignals input/policy authoritative for existing practice. A later course-aware action resolver composes its primary with resume/next-lesson eligibility. It does not copy due/weak thresholds into UI components.

For the proposed product: substantial scheduled urgency receives primary placement; otherwise valid lesson continuation/next lesson does; a strong existing remediation recommendation can occupy the one secondary slot. Exact course-vs-remediation arbitration is a later approved policy change with regression scenarios. UX specifies hierarchy and honesty, not covert new weights. A stale or unauthorized target is rejected; fall back to valid course navigation or the real chooser, never an invented query parameter. Reading and Task deep launch need explicit new route contracts before CTAs promise them.

### Version transitions and resumed work

Pin a release on enrollment/session. Minor copy changes create item versions but preserve meaning; changed prerequisites/rubrics create a release. Continue a supported pinned session; if withdrawn for correctness/rights, explain and offer a replacement without silently grading a new item against an old answer. Maintain a reviewed old→new equivalence map for comparable outcomes; historical events remain unchanged. Do not award new skills automatically from display-label matches or legacy topics.

Before future persistence implementation, approve: track scoping, deletion/retention coverage, revision/idempotency receipts, partial-save recovery and indexes/read-cost budget. Preserve transactional writes, immutable IDs and authenticated owner checks. Derived progress recomputation must be explicitly initiated server work, not an incidental read mutation.

## 6. Assessment and completion contract

The detailed blueprint defines formative lesson checks, held-out unit checks, three checkpoints and a final text-capability portfolio. Lesson checks guide next work; they are not high-stakes certificates. Assessments select independent content families and include unaided production, not shuffled old options.

Proposed launch evidence requirement: each core skill has recognition or comprehension coverage where applicable plus its designated independent-use evidence; integrated tasks can support several skills with separately judged outcomes. Two independent families across separated sessions support a “demonstrated independently” claim; writing additionally needs reviewed successful communicative work. These are conservative **product criteria to pilot**, not empirically calibrated educational thresholds. No perfect grammar or zero-error demand at A1. Failures identify specific follow-up work; overall averages cannot hide a missing production/reading domain.

Text-path completion requires the 40 lessons finished or equivalently demonstrated through a future reviewed placement route; all 10 unit checks and three checkpoints recorded; unresolved essential comprehension/task-fulfilment gaps addressed; final independent reading, form, message and short-description performance; delayed follow-up evidence. Do not require all personal vocabulary to be “mastered” or every bundled reading passage completed. Duration and lesson word-count targets are planning aids, not proof of proficiency.

Full-language A1/exam readiness remains unavailable until listening and speaking are assessed. A future provider adapter maps these Karta outcomes to separately versioned competencies/task types, identifies coverage gaps and tests format familiarity using original/licensed content. It never issues a Goethe/telc certificate or promises a pass.

## 7. Content and data governance

Canonical release assets are editorially reviewed, version-controlled and purpose-labelled. German linguistic facts belong to the pack; teaching decisions to curriculum; translations/contrastive notes to support content. User material and generated practice are separate sources. Assessment families cannot double as visible teaching examples; authoring/review tools may see them, learners see them only during their assigned attempt.

Each external asset records source URL/identifier, retrieved version/date, license and attribution, redistribution/transformation constraints, editor/reviewer and modification history. Static repository attribution is evidence of declared provenance, not a new legal clearance. Large raw research corpora stay outside application Git; only small published curriculum metadata/assets belong here. Preserve sense-aware lexical identity and original user text rights.

The existing Lesen attribution states CC BY 4.0 and upstream generated originality **not independently verified**. Keep existing behavior unchanged in this task. Later reuse requires asset-level license/originality/linguistic review and visible attribution; do not designate this set as unseen assessment. Prefer newly authored original held-out material. Existing morphology/Wiktionary/Kurdish data requires source-specific review for new redistribution; do not collapse licenses into one permissive umbrella.

Generated practice, if approved later, requires skill, language/track context, generator/model and prompt versions, validator version, family/provenance, review status and allowed purpose. AI output is untrusted variation, never linguistic truth or canonical by default. No generation is performed for this blueprint. A prompt validator's syntactic success is not pedagogical or linguistic validation.

Future writing evaluation should first use deterministic checks for bounded form/grammar tasks; optional AI supports feedback on open text but must return assessed/unknown outcomes with rubric/version and no hidden inferred correctness. Human review/calibration is required before AI alone can gate path completion. Collect minimal evidence; avoid persisting full draft keystrokes or raw texts in aggregate signals. Define owner deletion across future roots, limited assessment retention and consent before adding storage. Audio later needs speaker rights, transformations, transcripts and publication provenance; no speech datasets are acquired now.

## 8. Gaps and reuse boundaries

| Missing capability | Concrete first increment | Reuse boundary |
| --- | --- | --- |
| Canonical curriculum contract | Published release with 10 units, 40 lessons, 100 skill definitions and validated edges | Current `grammar-curriculum.ts` badges remain display-only |
| Lesson engine/resume | One vertical U01 lesson with stage snapshot, assistance flags, explicit save status | REUSE shell/buttons; do not inherit route-level memory writes |
| Exercise breadth | Unaided cloze, sentence transformation, guided message and short-answer reading | Existing MC/form/order boards are interaction primitives, not all evidence types |
| Skill evidence | Event opportunity/outcome contract and one pure projection with unknown states | Legacy LearningSignals remains available and truthful |
| Reading metadata | Item-level primary skill and text-family tags; new original forms/instructions | Passage completion is not retroactively converted into comprehension mastery |
| Writing outcomes | Bounded rubric, full evaluated opportunity status and communicative function mapping | Nine tags remain compatible; add versioned new categories later |
| Mixed review | Eligibility manifest for introduced/independently used skills, interleaved item families | Existing queue continues handling memory only |
| Unseen assessment | Held-out authoring registry, exposure checks, purpose/version separation | Never simply replay bundled/Paste items |
| Contrastive support | Reviewed en/tr/ku support overlay with explicit fallback | Existing English/Turkish glosses help; do not claim complete Kurmanji coverage |
| Intent navigation | Five destinations with compatibility links and task-oriented lesson chrome | REUSE AppShell safe areas and auth lazy boundaries; no route changes now |

## 9. Implementation roadmap (later authorization required)

| Phase | Goal and affected areas | Dependencies and exit evidence | Risks | Explicit exclusions |
| --- | --- | --- | --- | --- |
| 0 — Editorial and product review | Approve scope, text-only claim, rubric/evidence criteria, lexical coverage and provenance plan | Expert German review; rights review for reused assets; select visual direction; settle open questions | Overclaiming A1; licensing and assessment staffing | No product code, curriculum generation or dataset ingestion |
| 1 — Contracts + one safe vertical slice | Versioned curriculum/skill/content contracts, graph validator, course resolver; proposed Learn shell and U01.01 prototype | Phase 0; approved storage design in separate task before durable resume; fixtures show owner/track/release separation and unknown evidence | Accidental SRS coupling; framework SSR/auth imports | No broad UI rewrite, legacy backfill, production migrations or extra languages |
| 2 — German A1 path and grammar interactions | Curate U01–U06, then U07–U10; stage engine, reference links, bounded vocabulary and early short reading/form/writing tasks | Stable slice; content review; prerequisite/lesson checks; desktop/mobile accessible flow including errors/resume | Content volume, misleading unlocks, dictionary outside A1 | No hundreds-item generation sprint, FSRS tuning or advanced grammar expansion |
| 3 — Integrated reading/writing | Add form/short-answer reading, guided/free writing rubrics and original context families | Tested stage engine; independent item metadata; evaluator calibration; Task routes supported explicitly | AI reliability; missing tags; licensing | No speech curriculum or provider exam question banks |
| 4 — Evidence + mixed review + Progress | Approved idempotent skill evidence, pure projections, domain progress and interleaved practice; course-aware Home arbitration | Assessed opportunity contract; repeated-family rules; regression matrix for sparse/conflicting signals and concurrency | Legacy contamination, read cost, opaque scores | No global mastery formula, hidden data repair or scheduler replacement |
| 5 — Held-out assessments and controlled release | Unit/checkpoint/final text portfolio; delayed verification, revision policy and rollout | Reviewed independent families; fair accommodations; graded writing rubric; expose text-scope claim accurately | Assessment leakage, false completion, insufficient evaluator capacity | No full CEFR certification, exam pass guarantees or detailed A2–C2 curriculum |

Release implementation in reversible increments with existing practice always reachable. Future storage/migrations/deployment are separate explicit authorizations; this roadmap does not grant them.

### Future verification obligations

Graph validation: unique immutable IDs, resolved edges, no hard/soft prerequisite cycles, target/release consistency, lesson ordering or explicit supported exposure, complete evidence-profile coverage. Content validation: licensed purpose, accepted alternatives, linguistic correctness, suitable lexical prerequisites, separate item families. Behavior: no hidden SRS changes, correct auth owner/track scope, idempotent acknowledgements and recoverable partial saves. Policy: sparse histories remain unknown; large schedule backlog versus severe weakness; high MC versus weak production; stale/withdrawn content; account/track switches; no duplicate evidence. UX: desktop/mobile screenshots, keyboard/touch/zoom/long-text, safe-area/keyboard behavior, loading/error/resume; production-compiled SSR flow with hermetic services. Educational effectiveness requires real learner studies later, not synthetic test claims.

## 10. Risks and real open decisions

Risks are content review capacity, broad receptive inventories leaking into productive gates, exam/full-A1 overclaim, historic aggregates being overinterpreted, leaked item families, SRS coupling when reusing routes, AI feedback uncertainty, track/version isolation, and incremental read costs. None requires production access to resolve this blueprint.

Unresolved decisions requiring product/pedagogical review before implementation:

1. Which trained evaluator/human-review process can validate open writing for completion, and what turnaround is acceptable? Until resolved, open writing remains unassessed for official completion.
2. Should initial course entry offer reviewed placement/equivalence immediately or ship sequential entry first? This blueprint defaults to sequential entry; free Practice remains unrestricted.
3. Which independently reviewed lexical sense list and active/receptive balance best fits Karta's adult learners? The proposed coverage envelope is not a final word bank.
4. How many separated observations/delay days justify “demonstrated independently” across task types? Proposed minima are pilot criteria; calibrate with learner evidence.
5. Are existing third-party Lesen assets cleared and pedagogically suitable for canonical lessons, or should they remain practice-only? Default: practice-only pending review.
6. Which visual direction should be approved? The UX document recommends Quiet Editorial as the baseline.

No unresolved stack choice, authentication rebuild, database migration or future-language curriculum is manufactured here.

## 11. Scope and validation record

Only the three requested Markdown documents are deliverables. Validation is documentation-only: registry counts, unique IDs, resolved prerequisites, hard and combined hard/soft cycle/order checks, lesson coverage, relative links, Markdown table structure, source-status review and diff boundaries. No application suite/build/server/migration was run; `npm run build` includes migration behavior and is unnecessary here. Existing untracked work remains untouched. Commit records the blueprint only; no push, merge or deploy is authorized.
