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

On the repair checkout, all 36 targeted lexicon, source-audit and diagnostic tests passed. The broad test run passed 212 script tests and 1,389 of 1,461 TypeScript tests; 72 curriculum tests failed. Many still send resume contract version 1 while the authored lessons use version 2. Other fixtures assume removed step IDs, old accepted responses or earlier curriculum boundaries. Resolve each mismatch against the current content and persistence contracts, retaining legacy rejection tests; do not downgrade the content version or weaken release gates to obtain green CI.

The build regenerated the missing `/grammar/notes` route entry; typecheck then passed. Five pre-existing lint errors were corrected without changing data values or authentication behavior; remaining lint warnings are not errors. Compile-only production build passed. Local runtime is Node 24.19.0, one patch below the repository's 24.20.0 requirement; the final CI run on the declared version remains authoritative.

Production currently points to `78f4b41ac6cd7901d4bdcaabcfdcbe58c6ab8b42`, not PR #16. The latest PR preview deployments are canceled. Before merge: repair the 72 failing curriculum tests, require honest CI success, create one preview for the final commit, and verify diagnostic feedback/remediation plus authenticated persistence there. A1 remains prototype; this PR does not finish issue #17 or the full linguistic review.

Of 104 curated dative entries, 46 with an explicit source CEFR tag are candidates for tightly bounded diagnostics; 58 untagged entries remain context-required. This is an operational gate, not a claim that a CEFR tag proves every sense is correct. Curated prepositional frames are gated on unique case per lemma+preposition. At least two pairs have contradictory curated cases and are withheld: `schreiben + an`, `sich berufen + auf`. Kaikki-extracted frames remain reference-only.

Remaining before a full release: sense-level linguistic review, Akkusativ/Dativ+Accusativ role modeling, resolving conflicting cases, more sentence structure support, complete A1 linguistic acceptance tests, source-license review and production verification. Do **not** mark issue #17 completed or describe this as a complete 6,659-verb valency model.
