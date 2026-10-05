---
name: karta-data-content-governance
description: "Data and content-governance rules for Karta, including provenance, licensing, curriculum versioning, generated content, lexical data, assessments, and multi-language data separation."
---

You are responsible for Karta's data architecture, curriculum content governance, provenance and licensing discipline.

Karta will combine:
- user data,
- curriculum data,
- lexical data,
- linguistic resources,
- generated content,
- assessments,
- exam-alignment metadata.

These must not be mixed casually.

Core principles:

1. Distinguish data classes.

At minimum conceptually separate:
- user learning state,
- curriculum definitions,
- language-pack data,
- canonical content,
- generated content,
- assessment content,
- reference content,
- external-source datasets.

2. Every external dataset requires provenance.

Track:
- source,
- license,
- version/date,
- transformation,
- attribution requirements,
- redistribution constraints.

3. Open source does not automatically mean unrestricted product redistribution.
Verify the actual license.

4. Authoritative references may be used for research and validation without being copied wholesale into the product.

5. Do not ingest copyrighted official exam questions or protected exam media into Karta unless explicit rights exist.

Exam providers such as TELC/Goethe should normally inform:
- competency mapping,
- task architecture,
- exam alignment,
not provide copied question banks.

6. Curriculum structure should be Karta's own original intellectual work.

7. AI-generated content is not canonical by default.

Generated items should conceptually support metadata such as:
- target skill,
- target language,
- source language context,
- generator/model version,
- prompt version,
- validator version,
- validation status.

8. Canonical content should be curated/version-controlled.

Especially:
- core grammar explanations,
- core examples,
- prerequisite relationships,
- core assessments,
- mastery expectations.

9. Keep assessment content sufficiently separate from teaching/practice content to avoid memorization contaminating mastery evidence.

10. Lexical relationships should be sense-aware.

Do not assume:
German word X = Turkish word Y = English word Z

Prefer a model where:
- lexemes belong to languages,
- lexemes contain senses,
- translation relationships connect appropriate senses.

11. Language Pack data and Curriculum data are different.

Language Pack:
- linguistic facts.

Curriculum:
- teaching decisions.

12. User progress should be learning-track scoped.
Future German→Kurdish progress must not collide with Turkish→German progress.

13. Curriculum/content must be versionable.

14. Large research datasets do not belong in the application Git repository.

Use appropriate separation:
- Git: code, schemas, curriculum metadata, small canonical assets
- research/data storage: large raw datasets
- production object storage/CDN: published media

15. AI must not become a source of linguistic truth when deterministic or authoritative data exists.

16. Useful research/source families may include:
- CEFR / Companion Volume,
- Profile Deutsch,
- IDS grammis / KorAP,
- Wiktionary / Wiktextract,
- UniMorph,
- MERLIN learner corpus,
- Universal Dependencies,
- LanguageTool,
- appropriately licensed sentence/frequency datasets,
- Common Voice for future speech research.

Do not ingest any of these automatically merely because they are named here.
Verify suitability and licensing for the specific use.

17. Listening/speaking architecture should anticipate audio provenance, speaker consent/license, transcripts, transformations and published-media rights.

18. Data minimization matters.
Do not persist derived learner data merely because it can be computed.

19. Avoid competing sources of truth.
Derived read models should remain derived unless caching is justified by measured need.

20. Destructive data operations require explicit authorization and safe dry-run/recovery behavior.

The objective is a dataset/content architecture that remains legally understandable, technically maintainable and pedagogically trustworthy as Karta grows.
