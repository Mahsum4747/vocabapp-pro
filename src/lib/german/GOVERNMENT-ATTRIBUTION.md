# German verb government (Rektion) dataset — attribution

`verb-government-data.ts` in this directory is a small, hand-compiled
dataset — **not** a bulk extraction like `nouns-data.ts`/`examples-data.ts`.
No structured government/Rektion field exists in the wiktextract dump those
two are built from (verified directly against the raw JSONL: the only
`"government"` hits were the noun "Regierung" matching its own English
gloss, nothing grammatical). This dataset was compiled by hand from two
independent pedagogical sources instead, cross-checked entry by entry.

## Sources

| | |
|---|---|
| Source 1 | [IDS Mannheim (Leibniz-Institut für Deutsche Sprache) — "Verben mit Präpositionen: Listen für A1 und A2"](https://grammis.ids-mannheim.de/VmP-Listen), Gahr, Alexander. 2025. DOI: [10.14618/VmP-Listen](https://doi.org/10.14618/VmP-Listen) |
| Source 2 | [Deutschlernerblog.de — "Verben mit Präposition: Liste zum Lernen A1-C2"](https://deutschlernerblog.de/verben-mit-praeposition-dativ-akkusativ-listen-erklaerungen-beispiele-a1-c2/), Andreas Neustein, October 2018 |

## What was extracted, and what wasn't

Only the bare grammatical fact — **which verb takes which fixed
preposition, and which case that preposition governs** — was taken from
either source. Specifically NOT taken from either source and NOT present
anywhere in this dataset or its loader:

- Example sentences (both sources' PDFs are full of them; none were copied)
- Explanatory text, headings, or any prose
- Either source's document structure, section layout, or page organization
- CEFR level, from Deutschlernerblog — it states an overall "A1-C2" range
  for the whole document but never tags individual entries, so none of its
  ~290 entries carry a `level` here (guessing one would violate this
  project's own rule against inventing data a source doesn't support)

The `level` field on 79 of the 370 entries comes from IDS Mannheim, which
does tag every entry it lists with a real, corpus-frequency-backed A1/A2
level — those values were taken directly from that source, the one piece
of source-provided data (beyond the bare fact) reused here.

The two sources were cross-checked against each other for every entry they
had in common; zero case conflicts were found across ~72 overlapping
entries, including the trickier two-way-preposition cases (e.g.
`teilnehmen an + Dativ`, a common point of learner error).

## Why this isn't a copyright concern

A verb-preposition-case triple is a fact about German grammar, not a
creative expression — the same reasoning that lets any dictionary or
grammar reference state the same fact independently. This dataset is
organized in its own schema (a flat array, alphabetized by preposition
then verb — a neutral choice, not a copy of either source's page layout)
and contains none of either source's actual written text.

Deutschlernerblog's PDF carries a notice permitting copying for teaching
use but restricting republishing or altering *their document*; this
dataset is not their document, republished or altered — it's an
independently re-expressed set of grammatical facts, verified against
their text but containing none of it.

## Deferred: user-visible attribution

Same open question `ATTRIBUTION.md` and `EXAMPLES-ATTRIBUTION.md` already
record for the other two German datasets, not decided here either.
