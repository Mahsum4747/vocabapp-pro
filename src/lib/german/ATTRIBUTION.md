# German noun dictionary — attribution

`nouns-data.ts` in this directory is a trimmed derivative of a third-party
dataset. It is **not** original work of this project, and it carries license
obligations that survive being bundled into the application.

## Source

| | |
|---|---|
| Original source | [German Wiktionary](https://de.wiktionary.org) (`dewiktionary`) |
| Extraction project | [gambolputty/german-nouns](https://github.com/gambolputty/german-nouns) by Gregor Weichbrodt |
| Upstream commit | `da71a2bc519b952b28c9b0b80971cff6efb508f6` |
| Upstream file | `german_nouns/nouns.csv` |
| License | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

German Wiktionary's text is contributed under CC BY-SA (and GFDL); the
`german-nouns` project distributes its extraction of that text under CC BY-SA
4.0, which is the license this derivative inherits.

## What we changed

`scripts/build-german-nouns.mjs` reads the upstream 79-column CSV and keeps four
fields per record — lemma, genus, nominative plural, part-of-speech tags —
dropping the genitive/dative/accusative forms, the singular forms, and the
declension variants. No values were edited, corrected, or invented; the trim is
column selection only. Re-running the script against the same upstream commit
reproduces `nouns-data.ts` byte for byte.

## What CC BY-SA 4.0 requires of us

1. **Attribution** — credit the source. This file, plus the header comment
   generated into `nouns-data.ts`, is that credit.
2. **ShareAlike** — the *derived dataset* is offered under CC BY-SA 4.0.

ShareAlike attaches to the dataset, not to the application code that reads it:
`nouns.server.ts`, `compound.ts` and everything else in this repository are
unaffected and keep this project's own license. The obligation is on
`nouns-data.ts` itself and on any redistribution of it.

## Deferred: user-visible attribution

Whether the attribution above must *also* appear somewhere a user of the app can
see it — a credit line in Settings, or next to a gender/plural hint on a card —
is a UI question, deliberately **not decided here**. It belongs with the step
that first surfaces this data in the interface (3B-UI). Recorded so it is not
lost: shipping dictionary-derived data into the UI without deciding this would
leave the obligation half-discharged.
