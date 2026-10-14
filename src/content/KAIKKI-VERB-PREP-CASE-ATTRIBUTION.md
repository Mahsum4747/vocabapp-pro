# kaikki verb preposition+case frame dump — attribution

`karta-kaikki-verb-prep-case.json` in this directory is a third-party data
dump, same situation the other `src/content/`/`src/lib/german/`
attribution files already describe.

## Source

| | |
|---|---|
| Source | kaikki.org — English Wiktionary extraction, German verbs (`pos-verb`) JSONL |
| URL | https://kaikki.org/dictionary/German/pos-verb/kaikki.org-dictionary-German-by-pos-verb.jsonl |
| License | CC BY-SA |
| Retrieved | 2026-09-24 |
| Method | Regex on sense glosses: `PREP (+ case)` and bare "with dative/accusative" |
| Count | 1001 frames, 781 lemmas |

Retrieved outside this project's own sandbox (which blocks `kaikki.org`
directly — confirmed by direct request in an earlier task) and handed in
as a file, the same "offline pipeline, not part of the build" pattern
`nouns-data.ts`/`examples-data.ts`/`verb-conjugation-data.ts` already use
for their own upstream extraction step.

## Known limitation — explicitly NOT a valency gold standard

The file's own header says so: it's a regex extraction over gloss text,
not a curated grammar. It also doesn't disambiguate *Wechselpräposition*
verbs (an/auf/in/... governing either Akkusativ for motion or Dativ for
location, e.g. "wohnen in" vs. "gehen in") — that ambiguity shows up
directly as same-lemma-same-preposition rows with conflicting cases (4
such pairs were found and dropped, see below), and is out of scope for
this task regardless ("Wechsel yön/konum yok").

## Current runtime integration (2026-10-13)

The canonical valency registry reads all 1,001 raw rows directly, including
bare-case and Genitiv evidence, with source-document and `frames[index]`
provenance. Reflexive constructions are linked to their base infinitive while
retaining the full construction. No sense/gloss survives in the bundled JSON;
`sense` is explicitly null. These rows remain reference-only; conflicting
prepositional case alternatives remain conflicted. Bare dat+akk rows alone
are not declared conflicting: the source cannot distinguish ditransitivity
from separate readings. No transitive-category tag produces a case frame.

Neither lesson diagnostics, automatic verb-government enrichment nor case
hints promote gloss-regex rows to verified lexical government. Only
non-conflicting independently sourced curated constructions can do that.
Fixed-preposition case facts and the existing motion/location heuristic are
separate from lexical-valency evidence and remain unchanged.

## Historical generated hint subset (superseded)

`verb-prep-case-frames-data.ts` is retained as a historical generated artifact;
the runtime registry and hints no longer use its lossy subset. The original
filtering history below describes that earlier artifact, not current trust.

Of 1001 raw frames, 572 have a non-null preposition and a non-genitiv
case, collapsing to 566 distinct `(lemma, preposition)` pairs; 4 of those
pairs conflict internally (both `akk` and `dat` appear for the same pair)
and are dropped (all 4 are genuine Wechselpräposition verbs — "fesseln
an", "hängen an", "einziehen in", "picken auf" — confirming the
conflict-drop rule alone is enough to keep Wechsel verbs unlabeled
without any dedicated logic). Of the remaining 562, 16 have a multi-word
`lemma` — kaikki's gloss-regex extraction picked up idiomatic
noun/particle+verb collocations ("Anteil nehmen", "die Weichen stellen",
"aufmerksam machen", "schuld sein", ...), not single conjugatable verbs;
`verb-case-hint.ts`'s matcher reduces a multi-word entry to its last word
the same way it already does for `verb-government-data.ts`'s own
reflexive entries ("sich ergeben" → "ergeben"), but for a full-NP idiom
that would make a common bare verb ("machen", "nehmen", "haben", ...)
falsely match on its own, unrelated uses — so these 16 are dropped rather
than risked. Of the remaining **546** single-word, single-case pairs, 159
already exist in `verb-government-data.ts` and are skipped (hand-curated
wins); **387 are genuinely new prepositional frames** this file adds.

## What CC BY-SA requires of us

Same two obligations the other attribution files already describe:
**attribution** (this file) and **ShareAlike**, attaching to this dumped
file itself, not to the application code that reads it.
