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

## How it's actually used

`verb-case-hint.ts`'s Kaynak A now checks, in this fixed priority order,
never reordered:

1. `dative-verbs-data.ts` (bare dativ verbs) — unchanged, highest priority.
2. `verb-government-data.ts` (hand-curated prepositional frames) — unchanged.
3. **This file** — a `(lemma, preposition)` pair confirms its case only
   when: `prep` is not `null` (a null-preposition row is already covered
   by step 1 or step 4, per the task's own instruction — "onlar zaten 1 ve
   4"); `case` is `akk` or `dat` only (`gen` rows are dropped — out of
   A1/A2 scope, same as `case-forms.ts`'s own scope); the pair has exactly
   ONE case across all its rows (a pair appearing with both `akk` and
   `dat` is treated as unresolved ambiguity, not guessed at — this is
   also what catches the 4 Wechsel-verb pairs above without any
   preposition-specific code); and the pair does NOT already exist in
   `verb-government-data.ts` (hand-curated always wins on conflict, per
   the task's explicit instruction — kaikki is never the sole source for
   a construction the hand-curated list already covers, even when they'd
   agree).
4. The existing default-Akkusativ negative-control rule — unchanged,
   still never consults this file (or the transitiv dump) as a gate,
   still only asks "is there a curated reason to doubt the default", and
   step 3 above is now itself one more thing checked when answering that.

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
