# German example/translation dataset — attribution

`examples-data.ts` in this directory is a trimmed derivative of third-party
data. It is **not** original work of this project, and it carries license
obligations that survive being bundled into the application — the same
situation `nouns-data.ts` is in (see `ATTRIBUTION.md`), for the same reason:
both ultimately come from German Wiktionary content.

## Source

| | |
|---|---|
| Original source | [German Wiktionary](https://de.wiktionary.org) (`dewiktionary`) |
| Extraction project | [kaikki.org](https://kaikki.org) — Tatu Ylonen's `wiktextract` |
| License | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

German Wiktionary's text is contributed under CC BY-SA (and GFDL); kaikki.org
distributes its wiktextract JSON extraction of that text, and this project's
own further filtering of that extraction inherits the same CC BY-SA 4.0
obligations `nouns-data.ts` already carries.

**TODO before this data ships to production**: the exact kaikki.org dataset
edition/date and its own stated license terms should be confirmed and
recorded here (mirroring the noun dictionary's recorded upstream commit),
once the real `dataset.jsonl` this file is built from is in hand. This
placeholder file (0 records — see its own header) does not yet need that,
but the real one must not be committed without it.

## What we changed

Two stages, both offline, neither part of `npm run build`:

1. `measure.mjs` (the offline measurement kit, not part of this repository's
   source tree) filtered the raw wiktextract JSONL down to noun/verb/
   adjective entries with at least one example sentence surviving a
   conservative quality filter (word-count bounds, no citation markup, uses
   the lemma or a listed inflected form) and up to 4 cleaned, sense-ordered
   translations per language (EN/TR/KU), then further restricted to a
   frequency-bounded vocabulary (a standard, non-Wiktionary-specific German
   frequency list) rather than the whole corpus, and applied a three-layer
   filter against offensive/wrong-sense translations (a Wiktionary tag
   check, primary-sense restriction, and a small hard blocklist for a
   real observed failure category). Full history of what was tried, what
   broke, and how each fix was verified lives in that kit's own README.txt.
2. `scripts/build-german-examples.mjs` (in this repository) takes that
   filtered dataset's JSONL output and re-encodes it as the single TSV
   string `examples-data.ts` holds — column selection and format only, no
   values edited, corrected, or invented at this stage.

## What CC BY-SA 4.0 requires of us

1. **Attribution** — credit the source. This file, plus the header comment
   generated into `examples-data.ts`, is that credit.
2. **ShareAlike** — the *derived dataset* is offered under CC BY-SA 4.0.

ShareAlike attaches to the dataset, not to the application code that reads
it: `examples.server.ts` and everything else in this repository are
unaffected and keep this project's own license. The obligation is on
`examples-data.ts` itself and on any redistribution of it.

## Deferred: user-visible attribution

Same open question `ATTRIBUTION.md` already records for the noun
dictionary, not decided here either: whether this credit must also appear
somewhere a user of the app can see it. Belongs with whichever step first
ships this data into the visible UI.
