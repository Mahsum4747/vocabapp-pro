# Verb valency coverage baseline (2026-10-12)

Measured against the existing Karta source files. Reproduce with `node scripts/audit-verb-valency.mjs`.

| Source | Records |
| --- | ---: |
| UniMorph conjugation source records | 6,659 |
| Normalized conjugation lemmas | 6,658 |
| Curated dative lemmas | 104 |
| Curated verb + preposition + case frames | 436 (340 lemmas) |
| Raw Kaikki gloss-extracted frames | 1,001 (781 lemmas) |
| Wiktionary transitive-category lemmas | 3,833 |
| Conjugation lemmas present in at least one valency-related source | 2,384 |
| Conjugation lemmas absent from all those sources | 4,274 |

**Source presence is not verified case-government coverage.** The Wiktionary transitive category is incomplete and includes noisy lemmas; the Kaikki records are automatically extracted from glosses, not reviewed grammar. Absence does not imply intransitivity, and presence does not prove coverage of every sense.

The new `verb-valency-index.ts` combines the **runtime** curated dative, curated prepositional and generated Kaikki prepositional records while retaining provenance and review state. The raw Kaikki bare-case records and Wiktionary transitive list are covered by the audit, not used as diagnostic evidence.

`verb-lexicon.ts` now retains source membership from all four families, including the raw Kaikki records and Wiktionary transitive category, separately from diagnostic frames. Category-only entries are `evidence-needs-review`, with no invented case rule. Both the runtime registry and audit normalize spelling identically: `recht haben` and `Recht haben` share one lookup key, explaining the 6,659 source records versus 6,658 canonical entries. Original source records remain intact.

Runtime status counts: 250 diagnostic-eligible, 2,134 evidence-needs-review, 4,274 unresolved. Diagnostic eligibility only means an existing bounded frame passed the operational gate; it does not verify every sense of a verb or make the entire lexicon release-ready.

CI acceptance requires actual nonzero failures to propagate through log pipelines. The workflow explicitly selects Bash with pipefail; previously a successful `tee` could conceal failing checks. Cross-browser compatibility uses a local development server and mocked authentication/backend, not authenticated production persistence.

## Validation and remaining PR gates

The 72 curriculum failures were stale fixtures: hard-coded resume version 1, fixed step offsets and IDs, old stage snapshots, and an obsolete twenty-lesson boundary. Fixtures now use each current lesson's declared version and locate the relevant task, while retaining incorrect-response, incompatible-version, owner-isolation, retry and persistence assertions. No migration or data deletion was needed.

After those repairs, all 212 script tests and 1,461 TypeScript tests passed locally; typecheck passed and lint reported zero errors (43 existing warnings). A subsequent real diagnostic defect was fixed: sourced verb forms now use the same German keyboard normalization as answers, so `gehört` / `gehoert` correctly match. Its new regression test passed. The compatibility suite now exercises an incorrect dative answer, diagnostic transport, correction, reload and lesson completion using real course boundary logic with a hermetic document fake. This does not claim live Firebase verification.

The final GitHub CI run on Node 24.20.0 is the release gate; local Node is 24.19.0. The build also retains the regenerated `/grammar/notes` route and the earlier lint fixes. A1 remains prototype. Full linguistic validation of every verb sense remains separate from this engineering repair.

Of 104 curated dative entries, 46 with an explicit source CEFR tag are candidates for tightly bounded diagnostics; 58 untagged entries remain context-required. This is an operational gate, not a claim that a CEFR tag proves every sense is correct. Curated prepositional frames are gated on unique case per lemma+preposition. At least two pairs have contradictory curated cases and are withheld: `schreiben + an`, `sich berufen + auf`. Kaikki-extracted frames remain reference-only.

Remaining before a full release: sense-level linguistic review, Akkusativ/Dativ+Accusativ role modeling, resolving conflicting cases, more sentence structure support, complete A1 linguistic acceptance tests, source-license review and production verification. Do **not** mark issue #17 completed or describe this as a complete 6,659-verb valency model.
