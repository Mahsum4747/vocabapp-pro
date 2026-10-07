# Karta A1 Pedagogy & Adaptive Learning Hardening

Status: locked implementation direction before A2.

## Product rule

**Lessons teach. Checks assess. Challenges test out. Checkpoints verify transfer.**

Karta must not expose the internal skill graph as the learner experience. Skill IDs, evidence groups and assessment families remain instrumentation. The learner should experience coherent communicative situations and explicit teaching.

## Core learning loop

Teach → Observe → Diagnose → Explain → Personalize → Practice → Space → Verify.

A single wrong answer is a signal, not a mastery judgment.

## Lesson standard v2

A teaching lesson should normally move through:
1. Context / communicative need
2. Model and concise explanation
3. Guided noticing
4. Controlled practice
5. Supported production
6. Independent production
7. Transfer to a fresh situation

A lesson may combine stages when appropriate, but it must never demand a form that has neither been taught earlier nor supported in the current lesson.

Hints are teaching-only. Checks, Challenges and Checkpoints do not reveal answers or use lesson hints.

## Diagnostic model

Prefer the narrowest supported diagnosis. Examples:
- lexical government: `helfen + Dativ`
- case selection
- case form
- pronoun form
- word order
- agreement / conjugation
- vocabulary gap
- reading detail
- reading negation / correction
- task fulfilment
- register
- spelling / likely slip
- uncertain diagnosis

Never infer a broad weakness ("bad at Dativ") from one narrow observation.

Each observation carries confidence, context, independence/support information and recency. Recommendations require repeated or sufficiently strong evidence.

## Grammar reference

Karta maintains reviewed canonical grammar/reference entries. AI-generated notes never replace the canonical source.

Reference hierarchy can include:
- broad concept: Dativ
- sub-concept: Dative pronouns
- lexical pattern: `helfen + Dativ`
- prepositional pattern: `mit + Dativ`

Each reference should answer:
- What does it mean?
- When is it used?
- How is it formed?
- What mistakes are common?
- What related patterns matter?

## Personal AI grammar notes

A learner may create a personal note from:
- a diagnosed mistake,
- a canonical reference topic,
- or an explicit question/confusion.

AI receives the canonical topic, CEFR scope, learner support language, known context and optional learner error. It may personalize explanation and examples, but must not invent mastery evidence or alter canonical rules.

Personal notes can lead to targeted practice and later review.

## Adaptive practice

Karta chooses the target. AI may create fresh examples/tasks within constraints.

Generated practice must specify:
- target skill/pattern
- CEFR ceiling
- allowed/known vocabulary where practical
- task type
- expected grammatical relation
- deterministic grading constraints for bounded items

AI-generated open writing is practice, not completion evidence.

## Reading teaching

Reading lessons explicitly teach strategies such as:
- identify purpose
- scan for time/date/price
- locate requested detail
- notice negation
- notice changed/corrected information
- select the relevant text
- distinguish current from superseded information

## Writing teaching

Writing lessons explicitly teach:
- identify required points
- choose register
- select useful structures
- compose the message
- verify all requested points are present
- revise a targeted error

## Spaced remediation

Grammar patterns, lexical constructions, reading weaknesses and writing weaknesses can reappear after delay. Review scheduling remains separate from vocabulary FSRS unless a future reviewed design unifies them.

## Explainability

Every adaptive recommendation should make the reason understandable, e.g.:
"You recently omitted the person receiving help with `helfen`. Review `helfen + Dativ`."

## A1 lock criteria before A2

- 40 A1 lessons reviewed against Lesson Standard v2
- error-aware lesson hints/feedback for authored bounded tasks
- diagnostic observation model implemented
- learner recommendations can target narrow grammar/reference patterns
- canonical Grammar Reference separated from practice
- Personal AI Grammar Notes available
- targeted remediation entry point available
- reading/writing instruction standards applied
- delayed review path defined and wired for diagnosed gaps
- product shell no longer presents Karta primarily as a flashcard app
- cross-browser smoke: Chromium, Firefox, WebKit; mobile Chrome + iPhone/WebKit
- build has no implicit migration side effect
- production auth/SSL warning handling reviewed

Do not start A2 until the above is accepted or explicitly deferred.
