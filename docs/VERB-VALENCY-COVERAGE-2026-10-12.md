# Verb valency coverage baseline (2026-10-12)

Measured against the existing Karta source files. Reproduce with `node scripts/audit-verb-valency.mjs`.

| Source | Records |
| --- | ---: |
| UniMorph conjugation lemmas | 6,659 |
| Curated dative lemmas | 104 |
| Curated verb + preposition + case frames | 436 (340 lemmas) |
| Raw Kaikki gloss-extracted frames | 1,001 (781 lemmas) |
| Wiktionary transitive-category lemmas | 3,833 |
| Conjugation lemmas present in at least one valency-related source | 2,384 |
| Conjugation lemmas absent from all those sources | 4,275 |

**Source presence is not verified case-government coverage.** The Wiktionary transitive category is incomplete and includes noisy lemmas; the Kaikki records are automatically extracted from glosses, not reviewed grammar. Absence does not imply intransitivity, and presence does not prove coverage of every sense.

The new `verb-valency-index.ts` combines the **runtime** curated dative, curated prepositional and generated Kaikki prepositional records while retaining provenance and review state. The raw Kaikki bare-case records and Wiktionary transitive list are covered by the audit, not used as diagnostic evidence.

Of 104 curated dative entries, 46 with an explicit source CEFR tag are candidates for tightly bounded diagnostics; 58 untagged entries remain context-required. This is an operational gate, not a claim that a CEFR tag proves every sense is correct. Curated prepositional frames are gated on unique case per lemma+preposition. At least two pairs have contradictory curated cases and are withheld: `schreiben + an`, `sich berufen + auf`. Kaikki-extracted frames remain reference-only.

Remaining before a full release: sense-level linguistic review, Akkusativ/Dativ+Accusativ role modeling, resolving conflicting cases, more sentence structure support, complete A1 linguistic acceptance tests, source-license review and production verification. Do **not** mark issue #17 completed or describe this as a complete 6,659-verb valency model.
