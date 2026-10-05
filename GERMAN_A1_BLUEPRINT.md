# German A1 blueprint

Original curriculum design · v1 proposal · 2026-10-05 · source audit at `97510374395ab4c859d5ffc98b94b58e36df4d7b`.

This document specifies outcomes and authoring contracts, not implemented curriculum or generated exercises. [System architecture](KARTA_LEARNING_ARCHITECTURE_V1.md) owns layer/evidence/version/governance decisions; [UX architecture](KARTA_UX_ARCHITECTURE_V1.md) owns screens. Listening and speaking are reserved domains without skill definitions here. Exam adapters and A2–C2 detail are excluded.

## 1. Scope, sources and design assumptions

The completion label is **German A1 text-learning path complete**, covering this curriculum's vocabulary-use, grammar, reading and writing outcomes. It does not establish complete CEFR A1 or exam readiness.

[CEFR Companion Volume](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4) supplies functional level boundaries, not a German grammar syllabus. [Goethe's A1 test-description/inventory](https://www.goethe.de/pro/relaunch/prf/sr/Pruefungsziele_Testbeschreibung_A1_SD1.pdf), especially printed pp. 100–106, supports the bounded grammar coverage check. [Goethe's adult A1 lexical inventory](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf) informs everyday domain coverage. Neither tasks nor examples are copied. The canonical sequence, skill granularity and evidence profiles below are original Karta design judgments, pending German pedagogical review.

Include selected Perfekt, everyday dative frames and basic clause linking. Productive full adjective declension, general subordinate clauses, unrestricted preposition paradigms, passive, general Konjunktiv and productive genitive are deferred. Incidental receptive chunks are explicitly supported rather than made mastery gates. [IDS Perfekt](https://grammis.ids-mannheim.de/vggf/2227?termini=term) validates the linguistic structure; [IDS location/destination material](https://grammis.ids-mannheim.de/progr@mm/6858) targets A2, so only selected everyday location/destination chunks enter this A1 path. “Movement means accusative” must never be taught as a general rule.

The [Profile Deutsch overview](https://www.goethe.de/de/spr/sbp/prd.html) was reviewed, but its full database/book was not accessed. Final inventory alignment is a release gate, not a completed validation claim. [telc A1 scope](https://www.telc.net/sprachpruefungen/zertifikatspruefung/deutsch/start-deutsch-1-/-telc-deutsch-a1/) is a coverage check for future exam adaptation, not a source question bank.

## 2. Registry conventions and counts

| Domain | Count | Meaning |
| --- | ---: | --- |
| Grammar | 60 | Fine-grained target-language structural/use outcomes |
| Reading | 14 | Comprehension abilities across text types |
| Writing | 16 | Communicative and form/accuracy outcomes |
| Vocabulary-related | 10 | Lexical understanding/use abilities, not individual words |
| Total | **100** | Unique canonical skills; stages/tasks/families are not extra skills |

`G01`–`G60`, `R01`–`R14`, `W01`–`W16`, `V01`–`V10` are document-local handles for the **exact canonical IDs** in the registry, never persisted IDs. `DE.A1.GRAMMAR.CASES.ACCUSATIVE` is an area grouping: counted evidence belongs to its specific children. IDs survive release/order/label changes. Cross-domain dependency references resolve through these handles.

Each row states an observable outcome, hard prerequisites and an evidence profile. Hard prerequisites govern entry to **unassisted evaluation**; instruction can explain them on demand. None requires a global perfect score. The blueprint's later sections define supported soft edges and exposure exceptions. All skills are core within their explicitly bounded repertoire; advanced material is not hidden in these counts.

### Evidence profiles (authoring requirements, not algorithms)

| Profile | Required progression and evidence | Scope of successful performance |
| --- | --- | --- |
| F — form/use | Understand → recognition → unaided recall/form → controlled sentence → fresh context | Produces target form for familiar lexical material; distinguishes nearby alternatives; assistance recorded |
| S — syntax/function | Understand → ordering/manipulation → contrast → unaided sentence → communicative use | Correct clause structure serves intended meaning in a new everyday context |
| L — bounded lexical frame | Notice form/meaning → match → recall → constrained phrase → contextual production | Uses the published limited frame inventory; no claim of general paradigm knowledge |
| C — comprehension | Supported reading → specific question → independent retrieval → new text family | Answers correctly about the relevant text meaning; can identify supporting phrase, not just guess a choice |
| P — production | Model analysis → guided response → independent original response → changed context | Meets a specified communicative purpose; targeted language evaluated separately from general polish |
| O — orthographic/form | Notice → edit/fill → unaided short text/form → independent item | Produces readable target detail accurately in the applicable field/format |
| X — integration | Previously learned components → contrast → unfamiliar composite task → later repeat | Selects appropriate learned structures without a topic cue; per-skill outcomes remain separate |

“Independent” requires no revealed answer, translation of the answer, completion template or target-form hint. Instructions can be explained accessibly. Familiar situation plus new entities/wording/task family is transfer at A1; do not equate transfer with advanced vocabulary. Each profile needs at least two independent content families on separated sessions before an independent-use claim; exact counts/delay are provisional pilot criteria.

## 3. Grammar skill registry and hard edges

Hard prerequisites are exhaustive in this table. A dash means no prerequisite skill gate; it does not mean no teaching support. Entry checks use prerequisite exposure/guided demonstration; assessment uses independent evidence. The base graphic-free path introduces grammar before its unaided dependent use.

| Handle | Canonical skill ID | Observable micro-skill within published A1 scope | Hard prerequisites | Profile |
| --- | --- | --- | --- | --- |
| G01 | DE.A1.GRAMMAR.PRONOUNS.SUBJECT | Choose subject person/number including polite Sie | — | F |
| G02 | DE.A1.GRAMMAR.VERBS.SEIN_PRESENT | Produce present sein for personal statements | G01 | F |
| G03 | DE.A1.GRAMMAR.VERBS.HABEN_PRESENT | Produce present haben for possession/basic needs | G01 | F |
| G04 | DE.A1.GRAMMAR.VERBS.REGULAR_SINGULAR | Produce regular ich/du/er-sie-es present forms | G01 | F |
| G05 | DE.A1.GRAMMAR.VERBS.PLURAL_POLITE | Produce wir/ihr/sie/Sie present forms | G01,G04 | F |
| G06 | DE.A1.GRAMMAR.VERBS.SUBJECT_AGREEMENT | Match finite verb to noun/pronoun subject | G02,G04,G05 | F |
| G07 | DE.A1.GRAMMAR.VERBS.STEM_CHANGE | Use a reviewed small set of common stem-changing verbs | G04,G06 | L |
| G08 | DE.A1.GRAMMAR.NOUNS.GENDER | Retrieve lexical gender, accepting unresolved/ambiguous senses | — | L |
| G09 | DE.A1.GRAMMAR.ARTICLES.DEFINITE_NOM | Select der/die/das/die in subject noun phrases | G08 | F |
| G10 | DE.A1.GRAMMAR.ARTICLES.INDEFINITE_NOM | Choose ein/eine/zero for familiar noun phrases | G08,G09 | F |
| G11 | DE.A1.GRAMMAR.NOUNS.PLURAL | Use learned noun plural with appropriate agreement context | G05,G08,G09 | L |
| G12 | DE.A1.GRAMMAR.CASES.NOMINATIVE_ROLE | Identify who/what is the clause subject, without “first noun” shortcut | G01,G02,G09 | S |
| G13 | DE.A1.GRAMMAR.ORDER.DECLARATIVE_V2 | Build a simple subject-first main clause with finite verb second | G01,G02 | S |
| G14 | DE.A1.GRAMMAR.QUESTIONS.YES_NO | Build a yes/no question with finite verb first | G13 | S |
| G15 | DE.A1.GRAMMAR.QUESTIONS.WH | Ask who/what/where/how with question word plus finite verb | G14 | S |
| G16 | DE.A1.GRAMMAR.ORDER.FRONTED_TIME | Keep V2 after a taught time phrase, moving subject after verb | G06,G13,G31 | S |
| G17 | DE.A1.GRAMMAR.NEGATION.NICHT_CLAUSE | Negate simple predicates/actions with nicht in taught patterns | G13 | S |
| G18 | DE.A1.GRAMMAR.NEGATION.KEIN_NOM | Negate indefinite/zero-article subject or predicate noun phrase | G10,G12 | F |
| G19 | DE.A1.GRAMMAR.NEGATION.NICHT_KEIN | Select noun-phrase versus predicate negation by meaning | G17,G18 | S |
| G20 | DE.A1.GRAMMAR.POSSESSIVES.NOM | Use mein/dein/sein/ihr/unser/Ihr in bounded nominative phrases | G09,G10 | F |
| G21 | DE.A1.GRAMMAR.CASES.ACCUSATIVE_ROLE | Identify a direct object in familiar reviewed verb frames | G12,G13 | S |
| G22 | DE.A1.GRAMMAR.CASES.ACCUSATIVE_DEFINITE | Produce accusative definite article, including masculine den | G09,G21 | F |
| G23 | DE.A1.GRAMMAR.CASES.ACCUSATIVE_INDEFINITE | Produce accusative ein/eine/einen in object phrases | G10,G21 | F |
| G24 | DE.A1.GRAMMAR.CASES.ACCUSATIVE_KEIN | Produce kein/keine/keinen for negated object phrases | G18,G23 | F |
| G25 | DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE | Replace familiar objects with mich/dich/ihn/sie/es/uns/euch | G01,G21 | F |
| G26 | DE.A1.GRAMMAR.CASES.NOM_ACC_CONTRAST | Distinguish subject/object function when both nouns are present | G12,G22,G23 | S |
| G27 | DE.A1.GRAMMAR.VERBS.ACCUSATIVE_FRAMES | Use reviewed kaufen/brauchen/sehen/besuchen-type object frames | G03,G04,G22,G23 | L |
| G28 | DE.A1.GRAMMAR.POSSESSIVES.ACC | Inflect taught possessives in accusative noun phrases | G20,G23 | F |
| G29 | DE.A1.GRAMMAR.CONNECTORS.UND | Link words/simple complete clauses without changing V2 | G13 | S |
| G30 | DE.A1.GRAMMAR.CONNECTORS.ABER_ODER | Express simple contrast/alternatives in independent clauses | G29 | S |
| G31 | DE.A1.GRAMMAR.PREPOSITIONS.TIME | Use reviewed am/um/im/von-bis time chunks | G13 | L |
| G32 | DE.A1.GRAMMAR.MODALS.KOENNEN | Express ability/possibility with present können forms | G06 | F |
| G33 | DE.A1.GRAMMAR.MODALS.MUESSEN | Express necessity with present müssen forms | G06 | F |
| G34 | DE.A1.GRAMMAR.MODALS.DUERFEN | Express permission/prohibition with present dürfen | G06,G17 | F |
| G35 | DE.A1.GRAMMAR.MODALS.WANTS_REQUESTS | Distinguish wollen intent, möchten requests and sollen instructions | G06 | L |
| G36 | DE.A1.GRAMMAR.ORDER.MODAL_BRACKET | Use finite modal plus final infinitive, including questions | G14,G32,G35 | S |
| G37 | DE.A1.GRAMMAR.VERBS.SEPARABLE_MEANING | Recognize reviewed separable verb and its intended meaning | G04 | L |
| G38 | DE.A1.GRAMMAR.ORDER.SEPARABLE_MAIN | Produce finite verb plus final prefix in main clauses | G13,G37 | S |
| G39 | DE.A1.GRAMMAR.ORDER.SEPARABLE_QUESTION | Keep prefix placement in yes/no and wh questions | G14,G15,G38 | S |
| G40 | DE.A1.GRAMMAR.IMPERATIVE.DU | Give a familiar singular instruction using reviewed du forms | G04,G07 | L |
| G41 | DE.A1.GRAMMAR.IMPERATIVE.IHR | Address a familiar group with ihr imperative | G05,G40 | F |
| G42 | DE.A1.GRAMMAR.IMPERATIVE.SIE | Make a polite instruction with verb plus Sie/bitte | G05,G14 | S |
| G43 | DE.A1.GRAMMAR.PREPOSITIONS.PLACE_CHUNKS | Understand/produce selected im/am/bei/nach/zu location/destination chunks | G13,G31 | L |
| G44 | DE.A1.GRAMMAR.PREPOSITIONS.DATIVE_FRAMES | Use selected mit/von/zu/aus/bei frames, not every preposition | G21,G43 | L |
| G45 | DE.A1.GRAMMAR.CASES.DATIVE_ARTICLES | Produce dem/der/den plus required noun form in taught phrases | G09,G11,G44 | F |
| G46 | DE.A1.GRAMMAR.PRONOUNS.DATIVE | Use mir/dir/uns/euch/Ihnen in selected personal/service frames | G01,G45 | L |
| G47 | DE.A1.GRAMMAR.VERBS.DATIVE_FRAMES | Use selected helfen/danken/gehören/es-geht frames by meaning | G04,G46 | L |
| G48 | DE.A1.GRAMMAR.PREPOSITIONS.LOCATION_DESTINATION | Distinguish taught im/in-die, am/an-den, nach/zu uses by relation | G22,G43,G45 | L |
| G49 | DE.A1.GRAMMAR.CONSTRUCTIONS.ES_GIBT | Describe available things with es gibt plus accusative | G22,G23 | L |
| G50 | DE.A1.GRAMMAR.ADJECTIVES.PREDICATIVE | Describe people/things after sein without adjective declension | G02,G13 | S |
| G51 | DE.A1.GRAMMAR.ADVERBS.GERN_SEHR | Express preference/intensity in reviewed simple predicates | G04,G13,G50 | L |
| G52 | DE.A1.GRAMMAR.QUANTITY.NUMBER_NOUN | Use familiar count expressions with supplied noun forms; distinguish one/several | G09,G10 | L |
| G53 | DE.A1.GRAMMAR.TIME.PRESENT_PLANS | Distinguish present habit/plan via taught time expressions | G16,G31 | S |
| G54 | DE.A1.GRAMMAR.NEGATION.FOCUS | Place nicht for a taught correction/contrast without changing intent | G19,G26,G30 | S |
| G55 | DE.A1.GRAMMAR.PAST.PERFEKT_FRAME | Identify auxiliary/participle and produce simple Perfekt bracket | G02,G03,G13,G36 | S |
| G56 | DE.A1.GRAMMAR.PAST.REGULAR_PARTICIPLE | Produce reviewed regular participles including known prefix patterns | G37,G55 | F |
| G57 | DE.A1.GRAMMAR.PAST.COMMON_PARTICIPLE | Recall a limited reviewed inventory of common irregular participles | G07,G55 | L |
| G58 | DE.A1.GRAMMAR.PAST.AUXILIARY_CHOICE | Choose haben/sein for taught senses/frames; avoid “all motion” rule | G55,G56,G57 | L |
| G59 | DE.A1.GRAMMAR.PAST.WAR_HATTE | Use selected ich/er-sie war/hatte chunks for earlier states | G02,G03,G31 | L |
| G60 | DE.A1.GRAMMAR.TRANSFER.CLAUSE_FRAMES | Choose present/modal/Perfekt frame from an unfamiliar simple intention | G17,G26,G36,G38,G55,G58,G59 | X |

G08 and V04 support one another as related skills rather than hard cyclic prerequisites. G13 builds from a minimal sein statement before regular inflection; it does not require mastering every verb. G16's time dependency is taught earlier inside U04. G44 provides known dative chunks before G45 names/generalizes the articles. G48 tests selected phrases, not general placement/motion predicates. G35 includes sollen as a bounded instruction frame; general Konjunktiv morphology is not inferred from möchten.

## 4. Reading skill registry

Reading prerequisite fields require exposure/guided use, not all grammar mastered in advance. Vocabulary needed to understand a task is supplied or already introduced; intentional incidental forms are not scored. Re-reading is allowed. Independent assessment avoids answer translation and full-text translation; accommodations remain recorded.

| Handle | Canonical skill ID | Text type / observable outcome | Hard prerequisites | Profile |
| --- | --- | --- | --- | --- |
| R01 | DE.A1.READING.PERSON_ENTITIES | Labels/simple personal descriptions: identify name/person/place | V01 | C |
| R02 | DE.A1.READING.NUMERIC_DETAILS | Signs/timetables/prices: retrieve dates, times, prices or numbers | R01,V03 | C |
| R03 | DE.A1.READING.EXPLICIT_FACT | Very short familiar text: retrieve an explicitly stated fact | R01,G13 | C |
| R04 | DE.A1.READING.REFERENCE | Short description/message: resolve an unambiguous subject/possessive reference | R03,G01,G20 | C |
| R05 | DE.A1.READING.NEGATED_INFORMATION | Message/sign: distinguish a negated or corrected fact | R03,G19 | C |
| R06 | DE.A1.READING.SHORT_MESSAGE | Note/SMS: identify sender purpose and requested action | R02,R03 | C |
| R07 | DE.A1.READING.CONTEXT_WORD | Familiar sentence: select a contextually supported word sense | R03,V06 | C |
| R08 | DE.A1.READING.TIME_SEQUENCE | Schedule/message: distinguish before/after and a simple changed plan | R02,G31 | C |
| R09 | DE.A1.READING.PERMISSION_NOTICE | Notice/sign: identify permitted, required or forbidden action | R05,G34,G36 | C |
| R10 | DE.A1.READING.SIMPLE_INSTRUCTION | Short familiar instruction: identify required concrete action | R03,G43 | C |
| R11 | DE.A1.READING.FORM_FIELDS | Simple form: identify which requested detail belongs in each field | R01,R02 | C |
| R12 | DE.A1.READING.SHORT_EMAIL | Simple email: retrieve purpose, arrangement and explicit constraint | R06,R08 | C |
| R13 | DE.A1.READING.MAIN_PURPOSE | Very short message/notice: identify overall purpose without broad inference | R06,R12 | C |
| R14 | DE.A1.READING.SELECT_RELEVANT_TEXT | Small set of simple ads/signs: choose text satisfying a stated need | R02,R05,R13 | C |

No abstract argument/inference or B2 sentence-insertion mastery is required. R14 concerns straightforward fit/constraints rather than hidden implication. A rationale/evidence-span selection is useful during practice; inability to explain in the source language must not negate otherwise correct German comprehension.

### Bundled A1 Lesen mapping (candidate practice tags, not validated mastery)

Source array inspected: `src/lib/german/lesen-data.ts`; 35 A1 passages with two-option choice questions. Exact groups below cover all 35 identities. All mappings are editorial candidates requiring item-level review; passage-level tags alone are too coarse for evidence.

| Existing IDs | Count | Candidate skill coverage | Reuse / limitation |
| --- | ---: | --- | --- |
| a1-01-text_1_1, a1-01-text_1_2 | 2 | R03,R04,R06,R08 | Neighbour/personal notes; verify incidental lexical/syntactic load |
| a1-02-text_1_1, a1-02-text_1_2 | 2 | R02,R05,R06,R12 | Course arrangements; factual correction and available time |
| a1-03-text_1_1, a1-03-text_1_2 | 2 | R02,R03,R04,R06,R12 | Work absence/invitation; communicative purpose not separately graded |
| a1-04-text_1_1, a1-04-text_1_2 | 2 | R02,R05,R06,R12 | Arrival/hotel arrangements; past/modal phrases may need support |
| a1-05-text_1_1, a1-05-text_1_2 | 2 | R02,R05,R06,R08,R12 | Changed activity/service message; distinguish reading from grammar recall |
| a1-01-schild_1 through a1-01-schild_5 | 5 | R02,R03,R09,R10 | Everyday signs: opening, ticket/instruction/prohibition; tag each item |
| a1-02-schild_1 through a1-02-schild_5 | 5 | R02,R03,R09,R10 | School/transport/payment/activity instructions |
| a1-03-schild_1 through a1-03-schild_5 | 5 | R02,R03,R05,R10 | Timed services, alternatives and unavailable service |
| a1-04-schild_1 through a1-04-schild_5 | 5 | R02,R03,R09,R10 | Safety/health/hotel/transport notices |
| a1-05-schild_1 through a1-05-schild_5 | 5 | R02,R03,R05,R10 | Payment/access/schedule signs; occasional combined numerical detail |

Current content has no form-field reading tasks (R11), no A1 matching-to-needed-ad tasks (R14), no systematic context-sense isolation (R07), and no separately scored main-purpose/reference taxonomy. Existing choices can contribute practice observations for a reviewed primary skill, but cannot distinguish independent recall from chance reliably on their own. New short-answer detail extraction and relevant-text matching are required. Per-level completion and generic `lesen` accuracy cannot be decomposed historically into these 14 skills.

Source `LESEN-ATTRIBUTION.md` declares generated third-party CC BY 4.0 material and explicitly unverified upstream originality. Do not copy official exam content or relabel this pool canonical/held-out. Newly authored original assessment families are preferred; retain attribution for authorized reuse.

## 5. Writing skill registry

Grammar skills describe target structures; writing skills describe using them to communicate. One task may support both with separate outcomes. Required points and communicative success come before stylistic polish. Orthographic slips can coexist with successful A1 communication; persistent meaning-changing structural problems generate targeted follow-up.

| Handle | Canonical skill ID | Observable outcome / task | Hard prerequisites | Profile |
| --- | --- | --- | --- | --- |
| W01 | DE.A1.WRITING.PERSONAL_FACT | Write own name/basic identity phrase independently | V01,G02 | P |
| W02 | DE.A1.WRITING.ORTHOGRAPHY | Use basic sentence capitals, noun capitals and readable spelling in short phrases | W01,G09 | O |
| W03 | DE.A1.WRITING.FORM_COMPLETION | Fill simple identity/contact/date fields from a new scenario | W01,R02 | O |
| W04 | DE.A1.WRITING.SIMPLE_SENTENCE | Produce a simple statement with subject/finite verb agreement | G06,G13,W02 | P |
| W05 | DE.A1.WRITING.DESCRIPTION | Write simple personal/home/routine description, not a memorized paragraph | W04,G20,G50 | P |
| W06 | DE.A1.WRITING.OBJECT_PHRASE | Use article/case and vocabulary appropriately in a needed object phrase | W04,G26,G28 | P |
| W07 | DE.A1.WRITING.TASK_FULFILMENT | Communicate all requested basic details without copying a template | W04,R06 | P |
| W08 | DE.A1.WRITING.TIME_PLACE | State a practical time/place arrangement unambiguously | W04,G31,G43 | P |
| W09 | DE.A1.WRITING.REQUEST_INFORMATION | Ask a simple relevant question/request about a service or plan | W04,G15,G35,G36 | P |
| W10 | DE.A1.WRITING.GIVE_INFORMATION | Respond with needed detail and a simple constraint or alternative | W07,G30,G36 | P |
| W11 | DE.A1.WRITING.REGISTER | Use suitable du/Sie address, greeting and closing in a short message | W07,G20,G42 | P |
| W12 | DE.A1.WRITING.SHORT_MESSAGE | Compose a short original practical note/SMS for a stated recipient | W07,W08 | P |
| W13 | DE.A1.WRITING.INVITATION_RESPONSE | Invite/accept/decline with needed time/place, using simple taught forms | W09,W10,W12 | P |
| W14 | DE.A1.WRITING.SEQUENCE | Convey simple order/past-versus-plan across short independent sentences | W04,G53,G55,G58 | P |
| W15 | DE.A1.WRITING.APOLOGY_CHANGE | Apologize/cancel/change an arrangement and offer a relevant next step | W10,W11,W12 | P |
| W16 | DE.A1.WRITING.SELF_REVISION | Improve an identified error using a bounded checklist without copying the answer | W04,G19,G29 | X |

W03 is introduced with a supported form before R11 teaches independent form interpretation. W08's location phrases are provided as chunk support in U04; its independent evidence waits for G43. W11's polite request/closing is modelled in U05; independent grammatical instruction evaluation waits for G42. These are explicit exposure exceptions, not cyclic prerequisites.

### Existing writing tasks and error tags

Six A1 tasks exist in `src/content/write-prompts.ts`, each short_message, default 20–40 words. These word targets are existing product settings, not universal A1 rules.

| Existing prompt ID | Candidate writing outcomes | Required adaptation before course use |
| --- | --- | --- |
| a1-arzt-termin-absagen | W07,W08,W09,W11,W15 | Bound lexical/grammar load; separate unseen counterpart |
| a1-kita-kind-krank | W07,W10,W11,W12 | Allow alternative learner-relevant family/service scenario |
| a1-nachbarn-party | W07,W08,W11,W13 | Evaluate actual invitation/time/place, not template match |
| a1-freunde-umzug | W07,W08,W09,W12 | Keep familiar register; support required vocabulary |
| a1-arbeit-verspaetung | W07,W08,W11,W15 | Judge understandable change/apology; don't require subordinate clause |
| a1-kurs-anmeldung | W07,W08,W09,W11 | Original independent service-request counterpart |

Existing task bank cannot assess form completion, very early one-sentence composition or systematic self-revision. `WritePage` requires a set, defaults Words and A2 Task, uses optional AI feedback and does not advance FSRS. Future course writing needs set-independent curated lexical support and explicit task/level launch contracts; do not pretend current URL launches A1 Task directly. WriteIt supplies controlled phrase use and relevance checks; it is not a free-message scorer.

| Existing tag | Candidate skills and limitation |
| --- | --- |
| article_gender | G08–G10,W06; needs noun sense and location, not a generic mastery decrement |
| case | G21–G28,G44–G48,W06; case kind/frame context needed for micro-skill attribution |
| verb_position | G13–G16,G36,G38–G39,G55,W04; distinguish relevant clause construction |
| verb_conjugation | G02–G07,G32–G35,G40–G42,W04; unknown specific form stays broad |
| register | W11; context/recipient and accepted alternatives needed |
| missing_leitpunkt | W07; map to a specific missing communicative requirement |
| word_choice | R07,V06–V09; sense/frame must be known before attribution |
| spelling | W02; don't conflate typo with forgotten vocabulary |
| word_order_other | W04,W14,G29–G30; broad legacy signal, not a new micro-skill verdict |

Proposed **later** structured categories: `negation_scope`, `lexical_frame`, `time_place_detail`, `form_field`, `punctuation_capitalization`, `communicative_function`, `reference_coherence`. Add only if the rubric requires them and a validator/evaluator can distinguish them. Keep legacy categories; version new outcome contracts. Track successful assessed opportunities, partial/unknown outcomes, assistance and evaluator identity as well as errors. Empty/missing tags are never a zero-error verdict.

Writing rubric dimensions: purpose/task points; relevant factual details; comprehensibility; targeted grammar and lexical use; recipient/register; orthographic readability. Judge each separately with met/partly met/not met/unassessed and a short anchored explanation. A1 tolerates errors when communication works; course remediation still targets repeated errors. Open-text AI feedback alone cannot certify completion without calibration and the reviewed evaluation process described in the primary architecture.

## 6. Vocabulary integration and registry

Proposed authoring coverage envelope: around 600–700 high-utility **sense/chunk targets**, roughly 300–350 prioritized for active use, compared with—not copied from—the Goethe inventory. This is a planning range, not a compulsory exact quota or a one-to-one match with its entries. Final list, frequency, register, senses and active/receptive assignments require editorial review. Introduce a small cluster per lesson, revisit across units, and supply non-target incidental words without grading them. Core coverage extends beyond noun cards.

| Handle | Canonical skill ID | Outcome | Hard prerequisites | Profile |
| --- | --- | --- | --- | --- |
| V01 | DE.A1.VOCABULARY.PERSONAL_CORE | Understand/use a reviewed core of identity/greeting/contact senses | — | L |
| V02 | DE.A1.VOCABULARY.ENTITY_CATEGORIES | Recognize person/place/object meanings in familiar language | V01 | L |
| V03 | DE.A1.VOCABULARY.NUMERIC_TIME | Understand/use taught numbers, prices, dates and everyday time labels | V01 | L |
| V04 | DE.A1.VOCABULARY.NOUN_BUNDLE | Retrieve taught noun sense with gender/plural metadata when relevant | V02 | L |
| V05 | DE.A1.VOCABULARY.ACTION_SENSE | Choose taught everyday action sense rather than translation alone | V02 | L |
| V06 | DE.A1.VOCABULARY.CONTEXT_SENSE | Distinguish familiar competing senses/glosses in a concrete context | V05 | C |
| V07 | DE.A1.VOCABULARY.COLLOCATION | Use a reviewed common word partnership/chunk appropriately | V04,V05 | L |
| V08 | DE.A1.VOCABULARY.FRAME_USE | Supply a taught verb/preposition/object frame for a needed meaning | V06,V07 | L |
| V09 | DE.A1.VOCABULARY.ACTIVE_RETRIEVAL | Recall taught lexical material without visible choices/answer hints | V03,V04,V05 | F |
| V10 | DE.A1.VOCABULARY.TRANSFER_SELECTION | Choose relevant familiar words in a new situation and avoid distracting senses | V06,V08,V09 | X |

Theme labels organize lexical coverage, not separate mastery domains: identity/family; home/objects; food/shopping/payment; time/routine; places/transport; work/study; health/services; leisure/weather; short practical communication. Every unit uses earlier vocabulary as well as its local cluster. Track productive/receptive intent at sense level. A lemma may contribute several senses/chunks; don't count duplicate cards as new canonical coverage.

Memory review keeps existing FSRS-shaped scheduling, card identity, eligibility and queue exactly. Core lessons must work without custom sets. Future optional “save these words” creates/links ordinary owned cards through existing contracts only after user action; canonical lexeme/sense links do not replace card IDs. User vocabulary may personalize eligible practice but cannot insert unreviewed language into assessment or redefine core coverage.

Language Use Evidence is separate from memory. A successful translation rating says little about appropriate article, collocation or governed case. Context use may link V08 plus a grammar skill and a sense/frame; it must not emit a synthetic FSRS rating. Core practice adapters suppress current route-level scheduling side effects; explicit Review remains unchanged.

## 7. Units, lessons and coverage

Ten units with four lesson containers each: **40 lessons**. IDs are `DE.A1.U01`–`DE.A1.U10`, lessons `DE.A1.U01.L01` etc. A container supports brief chunks/resume and later revisits; it is not one exposure followed by permanent mastery. Planned session feel is 8–15 minutes for an initial lesson chunk, 3–6 minutes for review and 15–25 minutes for a unit check. These are UX hypotheses, not validated A1 acquisition-hour estimates. Repeated and delayed practice means total learning time is not 40 × one session.

Within rows, handles denote introduced or actively consolidated skills, not automatic credit. Productive dependent tasks wait for hard prerequisites. Newly introduced items in U01–U06 have supported stages; U07–U10 deliberately consolidate across unfamiliar contexts rather than adding advanced grammar. An independently demonstrated prerequisite can permit guided continuation without perfect performance; planned unit checks identify gaps.

| Lesson ID | Unit / lesson outcome | Skill focus | Apply task / evidence purpose |
| --- | --- | --- | --- |
| DE.A1.U01.L01 | Meet and identify: introduce yourself | G01,G02,G13,V01,W01 | One original identity statement; guided production |
| DE.A1.U01.L02 | Name people and things | G08,G09,G10,G12,V02,W02,R01 | Match pictured/labeled entities then write a familiar noun phrase |
| DE.A1.U01.L03 | Ask for personal details | G14,G15,G52,V03,R02 | Ask a new person's detail and extract number/date |
| DE.A1.U01.L04 | Give basic information | G03,G50,V04,W03,R03 | Supported registration form and simple description |
| DE.A1.U02.L01 | Everyday actions and routine | G04,G05,G06,V05,W04 | Produce simple routine statements with different subjects |
| DE.A1.U02.L02 | People, belongings and plurals | G11,G20,R04 | Explain whose objects they are; resolve simple reference |
| DE.A1.U02.L03 | Say what is not true | G17,G18,G19,W05 | Contrast a real/incorrect personal or home detail |
| DE.A1.U02.L04 | Combine and revise statements | G07,G29,R05,W16 | Read a corrected fact and revise own short description |
| DE.A1.U03.L01 | Shopping: identify what is needed | G21,G22,G23,G27,V06 | Unaided object phrases for a concrete purchase |
| DE.A1.U03.L02 | Replace, negate and possess objects | G24,G25,G26,G28,W06,R06 | Interpret a short request, then answer with appropriate forms |
| DE.A1.U03.L03 | Availability and alternatives | G30,G49,V07,W07 | State what's available and communicate required details |
| DE.A1.U03.L04 | Preference and focused correction | G51,G54,V08,R07 | Contrast intended meaning and choose word sense in context |
| DE.A1.U04.L01 | Time and plans | G31,G16,G53,V09,R08 | Read changed times and write a main clause with a time opener |
| DE.A1.U04.L02 | Daily actions with prefixes | G37,G38,G39,V10,W08 | Ask about an activity and state time/place with supported place chunks |
| DE.A1.U04.L03 | Ability, wants and requests | G32,G35,G36,W09 | Ask a simple service question using a taught modal/request frame |
| DE.A1.U04.L04 | Necessity and permission | G33,G34,W10,R09 | Interpret a rule and give a relevant alternative plan |
| DE.A1.U05.L01 | Around town: place and transport | G43,G44,G45,R10 | Follow simple directions; produce reviewed location/dative phrases |
| DE.A1.U05.L02 | Personal help and service interaction | G46,G47,W11 | Ask/give help; greeting/closing supported until G42 review |
| DE.A1.U05.L03 | Location, destination and forms | G48,R11,W12 | Read field labels; send a short arrival/place note |
| DE.A1.U05.L04 | Polite instructions and invitations | G40,G41,G42,W13 | Give a practical instruction and accept/decline an invitation |
| DE.A1.U06.L01 | Recent experiences: the past frame | G55,G56,R12 | Interpret short email detail; controlled past statement |
| DE.A1.U06.L02 | Familiar past actions and auxiliaries | G57,G58,W14 | Sequence two short events with reviewed participles |
| DE.A1.U06.L03 | Earlier states and changed arrangements | G59,G60,R13,W15 | Original cancellation/change using independent simple clauses |
| DE.A1.U06.L04 | Choose the useful message | R14,G60,V10,W07 | Match a concrete need to short texts; original response |
| DE.A1.U07.L01 | Travel: dates and tickets | R02,R08,G31,G36,V03 | New timetable/price retrieval and ticket request |
| DE.A1.U07.L02 | Accommodation: availability | R12,G49,G45,W09,V07 | Read room/service detail and ask a relevant question |
| DE.A1.U07.L03 | Arrival and route changes | R05,R09,G39,G48,W08,W12 | Correct a changed plan, with explicit location/destination |
| DE.A1.U07.L04 | A travel message in your own words | W07,W11,W12,W14,G60 | Guided → free original practical message in new context |
| DE.A1.U08.L01 | Work/study: course information | R11,R14,W03,G15,V06 | Select suitable short course information and fill a form |
| DE.A1.U08.L02 | Schedule and obligations | R08,G16,G33,G36,W10 | State a constraint and suggest an alternative time |
| DE.A1.U08.L03 | Ask and give practical information | W09,W10,W11,G35,V08 | New service enquiry/reply; no canned email template |
| DE.A1.U08.L04 | Read, act, then revise | R06,R12,W07,W16,G54 | Respond to a new note and revise a targeted error |
| DE.A1.U09.L01 | Health/community: describe a need | W05,G03,G50,G59,V04 | Describe a basic problem; no medical knowledge grading |
| DE.A1.U09.L02 | Notices and simple instructions | R09,R10,G34,G40,G42 | Interpret everyday notices and produce a polite instruction |
| DE.A1.U09.L03 | Invitation and change | W13,W15,W08,G30,V10 | Invite or change a plan with all necessary details |
| DE.A1.U09.L04 | Independent short correspondence | W07,W11,W12,W15,R13 | Read an unfamiliar simple message and communicate next step |
| DE.A1.U10.L01 | Independent everyday reading | R02,R03,R05,R07,R14 | Held-out practice families, not final-assessment bank |
| DE.A1.U10.L02 | Tell, ask and respond | W04,W06,W09,W10,G60,V09 | Select structures without topic names or answer templates |
| DE.A1.U10.L03 | A form and a message | W03,W07,W11,W12,W14,V10 | Independent practice portfolio with separate outcomes |
| DE.A1.U10.L04 | Reflect and prepare for checkpoint | W16,G60,R13,V10 | Explain next practice need in plain copy; no mastery from reflection |

U01 Foundations/identity → U02 people/home/routine → U03 shopping/objects → U04 time/plans → U05 town/services → U06 recent experiences → U07 travel → U08 work/study → U09 community/health → U10 independent communication.

Each unit contains reading/writing, though early tasks are phrases/forms rather than long texts. Unit metadata owns outcomes and lexical themes; grammar rules do not dictate unit names. Skills recur across units; no compulsory skill completion percentage is copied from topic badges.

### Soft and related edges

| Dependent / area | Soft prerequisite or related link | Why it is not a hard gate |
| --- | --- | --- |
| G08 ↔ V04 | Related lexical noun bundle | Gender recall and noun-use metadata reinforce each other; requiring each first is cyclic |
| G21 | Soft V05 familiar actions | Object-role teaching can supply curated action vocabulary |
| G27 | Soft V06 contextual senses | Initial object frames can use one explicitly given sense |
| G31 | Soft V03 numeric/time vocabulary | A small supplied time phrase allows instruction before broad retrieval |
| G36 | Soft G33,G34 | Bracket learned with können/möchten before additional modal meanings |
| G45 | Soft G26 accusative contrast | Dative phrases can be taught independently; contrasts help but don't require complete acc mastery |
| G48 | Related R10,G54 | Instructions/contrasts reinforce meaning; no reverse dependency |
| G55 | Soft G38 | Separable verbs help participles; simple past bracket can start with non-separable forms |
| R12 | Soft G55 | Text can avoid or gloss past forms; reading skill is not a past-tense quiz |
| W07 | Related W11 | Task fulfilment precedes independent register work; supplied conventions are support, not a prerequisite |
| W14 | Soft G29,G30 | Sequencing may use separate sentences; connectors aren't mandatory |
| R14 | Related W09 | Finding relevant information and asking a service question are distinct |

Soft prerequisites guide sequencing/support, never silently lock the learner. Related links recommend adjacent practice; they never create eligibility edges. Hard graph is the union of registry dependencies. Soft edges are one-way advisory dependencies; related arrows are not prerequisite edges. Proposed order respects hard prerequisites except the declared supported exposure exceptions; no hard or combined hard/soft cycle is permitted.

### Unlock and support policy

Start U01 immediately. Sequential recommended order; preview any unit description/reference. Enter next lesson after finishing preceding learning work or supported prerequisite demonstration, not after perfect mastery. Revisit markers do not re-lock learned content. A unit check needing follow-up offers a focused repair plus independent recheck before later **assessment credit**, while guided learning can continue. Free Practice remains available, including advanced topics clearly outside the A1 path. Optional placement is a later reviewed product decision; no invented exemption algorithm here.

## 8. Lesson stage contract and resume

For a new structural skill, **Understand + an unaided Recall/Manipulate task + Produce/Apply + a formative check** are mandatory. A brief Discover context normally introduces intent; it may be merged with explanation. Recognition is useful early support but cannot alone finish a new productive skill. Contrast is mandatory when a published lesson targets confusable alternatives (case, negation, modal meaning, temporal change); otherwise optional. Review is scheduled follow-up, not necessarily the final slide. Comprehension lessons use text interpretation and unaided retrieval in place of forced grammatical production; form lessons use completion plus new field/context rather than an unnecessary free essay.

- Discover: an original tiny situation with a clear communicative need.
- Understand: short explanation, annotated examples and optional deeper Reference. Source-language overlay may help; target meaning stays fixed.
- Recognize: a few low-load discrimination tasks; low evidence strength.
- Recall: remove answer choices, retrieve a form/detail independently.
- Manipulate: transform one statement/person/time while preserving meaning.
- Contrast: choose between competing learned structures from the situation.
- Produce: one constrained phrase/sentence with accepted alternatives.
- Apply: short reading→response or original practical writing using learned material.
- Check: new formative item without immediate answer hints; a lesson-progress milestone, not certification.
- Review later: independent family on a later session, then mixed practice where eligible.

A lesson is complete when its required stages and check are acknowledged; mastery may still be developing. Learning correction/retry is welcome and stored as assisted/retried evidence. A wrong formative check gives explanation/retry and a revisit flag; it does not erase lesson work or fake independent success.

Resume pins lesson/content/release, stage and exercise-order snapshot, draft, assistance and acknowledgement state. Return to exactly the incomplete task; don't reshuffle an answer away. Local feedback must distinguish “answered” from “saved”. Failed save retains response with same-attempt retry; no duplicate opportunities. If content is withdrawn, explain and offer compatible replacement under the version policy. Existing Write drafts are component-local, so durable course resume is a missing capability, not already available.

## 9. Exercise taxonomy

Evidence labels describe what an exercise *can* support when correctly authored; choice tasks do not become recall merely because choices were shuffled.

| Exercise type | Stage / skill example | Recognition / recall / production / transfer | Specific evidence and authoring constraint |
| --- | --- | --- | --- |
| Multiple choice | Recognize G22 versus G09 | Recognition | Choice discrimination; distractors isolate case, not unrelated vocabulary |
| True/false | Recognize R05 corrected fact | Recognition/comprehension | Meaning judgement; follow with detail retrieval to reduce guessing |
| Classification | Understand G12/G21 subject/object | Recognition | Functional-role classification; avoid “first noun” shortcut |
| Matching | Discover/Recognize V02 or R14 text-to-need | Recognition/comprehension | Pairing of meaning/constraint; new text families enable modest transfer |
| Cloze with options | Recognize G24 | Recognition | Negated object-form discrimination in a known frame |
| Cloze without options | Recall G23/G24 | Recall | Accepted form generation, hints tracked, incidental words supplied |
| Form generation | Recall G07/G57 | Recall | Correct requested form and lexical sense; no general-use claim |
| Sentence ordering | Manipulate G13/G36/G38 | Controlled syntax reconstruction | Visible chips reduce lexical recall; ordering alone is not free production |
| Sentence transformation | Manipulate G16/G25 | Controlled production | Preserve original meaning under defined subject/object/time change |
| Error correction | Contrast G19/G54 | Recognition + controlled production | Correct a diagnosed mismatch; cannot prove spontaneous avoidance alone |
| Sentence building | Produce G26/W06 | Controlled production | Given intent/lexical support, independently construct phrase/clause |
| Guided production | Produce W09/W13 | Production | Fulfil intent using supplied factual/lexical support, not a full answer model |
| Free production | Apply W12/W15 | Production + transfer | Unseen everyday need; rubric judges communication and targets separately |
| Short reading comprehension | Recall/Apply R02/R12 | Comprehension + retrieval/transfer | Short answer or evidence-span retrieval; accept equivalent detail expressions |
| Form completion | Apply W03/R11 | Production + comprehension | Correct field/detail; use fictional scenario option for privacy |
| Dictation (future curriculum) | Later orthographic/listening evidence | Recall/production conditional on audio comprehension | Reserve transcript/audio-rights metadata; existing Diktat remains free practice, no new audio curriculum |
| Speaking response (future) | Later spoken communication | Production/transfer | Reserve response modality/evaluation; no skill content or scoring implementation here |

Existing question builders, cloze, Satzbau and choice boards can support interactions, after scope/effect adapters. Additional unaided cloze, transformations, short-answer comprehension and form/production rubrics are concrete gaps. No hundreds-item bank is produced in this design.

### Worked lesson specification: U03.L02

Intent: correctly answer a short object request when possession/negation changes. Primary skills G24–G26,G28; W06 integrates production and R06 interprets the note. Hard dependencies introduced in U01–U03.L01. Explain accusative by function using familiar objects, then two recognition contrasts; require an unaided negative object phrase and a person/object substitution; use a possessive transformation; conclude with a newly authored short note and an original response. Accepted grammar/sense alternatives come from reviewed item metadata. Record recognition, recall, assisted manipulation and independent response separately. One success does not master the whole Cases topic. Later interleave with G13/G19/G36 without the “accusative” cue; assess using a separate family.

The micro-skill's multiple stages are evidence dimensions, not separate skill IDs. Full lesson content must be written/reviewed later, so this specification deliberately contains no generated exercise bank.

## 10. Mixed Grammar Review

Entry: skill introduced, learner has at least one guided production/unaided recall observation in its bounded scope, and a reviewed practice pool can support independent questioning. Never add unseen prerequisites simply to diversify. Membership does not require the final mastery label.

Assemble short interleaved sessions across introduced structures, e.g. object case, V2, negation and modal bracket. State the communicative instruction without announcing each tested topic. Mix response types: unaided cloze, transformation and brief sentence building; use MC mainly for a diagnostic distinction. Maintain lexical familiarity so failures measure target grammar rather than unknown words. The composition policy remains conceptual; no selection weights are prescribed here.

Review errors preserve per-skill/per-family/context identity; a repeated pattern offers targeted Practice or the relevant Learn explanation. A single miss offers feedback/retry, not “you are weak”. Later independent attempts can confirm improvement. A recent severe weakness remains meaningful while large overdue memory backlog may take urgency precedence; recommendations use one approved policy boundary. No generic grammar review due date or FSRS stability is invented.

## 11. Assessment blueprint

Separate content purpose and exposure family. New names/options alone are not an unseen task if the same answer pattern/text was taught. Log family exposure across lessons, Practice and prior assessments; reserve alternate families for retakes. Assess target skills with learned/familiar vocabulary and fair accommodations. Prompt-instruction support must not supply the answer. Grammar/reference hints invalidate independence for that observation; learners may leave assessment to study and return via a fresh attempt.

| Assessment | Timing / proposed size | Coverage and evidence | Result meaning |
| --- | --- | --- | --- |
| Lesson check | End of each lesson; 2–4 brief fresh items | Primary introduced/consolidated skills; at least one unaided target response | Formative guidance + finished-lesson milestone |
| Unit check | After four lessons; 6–10 short items plus a form/brief writing task where relevant | Each new core outcome covered; at least one reading and productive observation; separate rubric dimensions | Demonstrated unit outcomes or named follow-up gaps |
| CP1 | After U03; 12–16 short items and a form + 2–3 original sentences | Only skills introduced in U01–U03: grammar foundations/object/negation work (excludes G16,G31–G48,G53,G55–G60), R01–R07, W01–W07/W16,V01–V08 | Foundational text capability, not full A1 |
| CP2 | After U06; 16–20 short/integrated items plus short original message | All newly introduced domains, with targeted grammar gap sampling; place/time/form/request/past integration | Independent use across the taught A1 repertoire |
| CP3 / final text portfolio | After U10; two independent sittings plus delayed follow-up | New short notices, personal/service message, relevant-text selection, form, practical message, short description; cumulative per-skill matrix | Text-path completion only when evidence coverage and unresolved gaps satisfy the reviewed criterion |

Sizes are authoring estimates; a session may split/resume. Sixteen items cannot independently measure 60 grammar skills. The final result consumes cumulative independent evidence plus targeted coverage tasks, not one tiny omnibus accuracy score. Maintain a coverage matrix listing skill ID → acceptable task profiles → independent family observations → remaining gap. Integrated writing supports several structural outcomes only when each was actually elicited/judged; absence of an error is not proof a construction was used.

Proposed evidence gate: at least two independent families on separated sessions for each designated core outcome, with a later retrieval/transfer observation; essential task/comprehension outcomes demonstrated without answer support; reviewed writing meets communicative rubric; unresolved repeated meaning-changing errors receive remediation/recheck. Pilot the counts/delay and rubric before launch; do not assert calibrated efficacy. Early low-level form skills can be witnessed in later integrated work rather than endless isolated tests. Productive perfection across all inflections is not required for A1 communication.

Assessments report each domain as demonstrated / follow-up needed / insufficient evidence. A missing writing assessment cannot be averaged away by vocabulary success. A completed path remains historically complete for its release; later recency flags suggest review. Active skill readiness may change without rewriting historical achievements.

## 12. Source-language support and future scaling

Single German target skill, e.g. G22. Overlay may vary explanation language, reviewed contrastive analogy, contextual names/examples, common-error warning, translation hints and selected practice distractors. Keep German correctness, target sense, task purpose, assistance standard, required skill outcome and assessment meaning invariant. Assessments offer equivalent instructional accessibility, not easier target demands for one source group.

Primary source and additional support languages are distinct. Turkish, English and Kurmanji overlays require qualified linguistic review; do not infer all speakers share a mistake or publish unverified structural comparisons. Fallback to a reviewed available language with visible indication and learner choice. Changing explanation language does not create a separate German curriculum or move skill history to another target track.

Future A2–C2 releases reuse stable foundational IDs while adding their own outcomes/requirements; do not draft their skill graphs now. Other target languages use their own curriculum and pack, not translations of this German sequence. Reserve listening/speaking modality and evidence contracts, but no disabled imitation lessons. Future provider exam maps consume these skills and reveal uncovered listening/speaking/format competencies separately.

## 13. Authoring acceptance and verification record

Before implementation content is publishable: German educator reviews bounded outcomes and order; IDs/dependencies/lesson focus resolve; course lexical prerequisites are explicit; hard graph is acyclic; every new skill has a lesson and evidence profile; assessments have independent families and coverage plans; rights/attribution recorded; sensitive personal facts can be replaced by fictional scenarios; semantic accepted answers avoid one-string grading of free language; source overlays are reviewed; wording accurately limits completion to text learning.

Documentation validation checks all 100 IDs, all 40 lesson IDs, dependency existence/cycles, first-introduction order and declared support exceptions, counts, links, and lesson coverage. No mastery algorithm, scheduler change, application schema, migration, generated content bank, speech data, deployment or production test is part of this deliverable.
