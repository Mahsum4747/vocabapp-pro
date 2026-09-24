# German transitive-verb category dump — attribution

`karta-wiktionary-transitiv-de.json` in this directory is a third-party
data dump, same situation `src/lib/german/ATTRIBUTION.md`,
`EXAMPLES-ATTRIBUTION.md` and `UNIMORPH-ATTRIBUTION.md` already describe.

## Source

| | |
|---|---|
| Source | de.wiktionary.org — `Kategorie:Verb transitiv (Deutsch)` |
| License | CC BY-SA 4.0 |
| Retrieved | 2026-09-24 |
| Count | 3833 lemmas |

Retrieved outside this project's own sandbox (which blocks
`de.wiktionary.org` directly — confirmed by direct request) and handed in
as a file, the same "offline pipeline, not part of the build" pattern
`nouns-data.ts`/`examples-data.ts` already use for their own upstream
extraction step.

## Known limitation — NOT used as a gate

Wiktionary's own `transitiv` tagging is incomplete: common, unambiguously
transitive verbs like **sehen, rufen, helfen** (dative, not even
accusative-transitive) and **geben** are missing from the category (see
the file's own `holes_not_in_category`). Because of this, the file is
**not used as a positive gate** ("in the list → tag Akkusativ, not in the
list → don't") anywhere in this codebase — that logic would silently keep
failing on exactly the common verbs it's meant to help with, which is the
same failure this data was fetched to fix.

## How it's actually used

`verb-case-hint.ts`'s default-Akkusativ path is a **negative-control
rule** that does not consult this file at all: a case span confirms
Akkusativ when the immediately preceding word is present, is not a listed
`dative-verbs-data.ts` verb, and is not a listed `verb-government-data.ts`
verb — i.e. nothing in the curated, hand-checked datasets contradicts a
plain accusative reading. This file is kept here purely as attributed
reference material (and available for a future, better-scoped use, e.g.
cross-checking a *positive* hit against `verb-government-data.ts`/
`dative-verbs-data.ts` for consistency), not as an input to that decision.

## What CC BY-SA 4.0 requires of us

Same two obligations the other attribution files already describe:
**attribution** (this file) and **ShareAlike**, attaching to this dumped
file itself, not to the application code that may someday read it.
