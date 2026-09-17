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

## Second-pass extension: AI-generated batch (66 entries)

A follow-up batch of 1,605 CSV rows — machine-generated (GPT; the exact
model version wasn't specified by whoever produced the CSV) — was cleaned,
validated, and merged in. Unlike the two-source original 370, **this batch
is single-source**: it was cross-checked only against the pre-existing
370-entry dataset for duplicates, not against any independent second
source. Lower confidence than the rest of the file for that reason — same
caveat already recorded for the E-VALBU/Duden batch in the sibling
dative-verb dataset.

**Cleaning pipeline** (raw CSV → 66 merged entries):

- **Column-order corruption**: 453 of 1,605 rows had `preposition,lemma,case`
  instead of `lemma,preposition,case` (first column a bare preposition like
  "auf"/"von"/"zu", second column clearly a verb infinitive). Detected by
  checking the first column against the 16 known German prepositions this
  dataset covers and swapped back.
- **One typo fixed**: `kämfen` → `kämpfen` (1 occurrence).
- **Heavy duplication**: 1,175 of 1,605 rows were duplicate
  (lemma, preposition, case) triples with only the example sentence
  differing — deduplicated, preferring the CSV's own `confidence: high`
  tag over `medium` when the two disagreed for the same triple, else first
  occurrence. Left 420 unique triples.
- **Cross-check against the existing 370**: 344 of those 420 were already
  present (skipped, not re-added) — left 76.
- **Reflexive ("sich") formatting**: this CSV inconsistently drops "sich"
  from the lemma column even when the example sentence itself is plainly
  reflexive ("...ärgert sich über..."), and occasionally the reverse. 13
  base-verb+preposition+case groups had both a bare and a "sich"-prefixed
  row for what turned out to be the exact same government fact. Each was
  resolved by reading its example sentences and — critically — checking
  which form (if either) the EXISTING 370 entries already use, not by any
  general rule (an early pass assumed a rule like "match the mit+Dativ
  precedent" and got 2 of the 13 backwards until checked against the real
  file; a second automated pass then cross-checked all 76 new entries,
  not just those 13, against the full existing dataset the same way, and
  caught 3 more the in-CSV-only check had missed entirely: bare
  "belaufen"/"ängstigen" and reflexive "verwandeln...in+Akkusativ" were
  each dropped as duplicates of an existing opposite-reflexivity entry
  for the same triple). 9 rows dropped this way. 5 more were judged
  genuine dual-valence pairs — a transitive/inanimate-subject sense
  alongside an existing reflexive sense that really are two different
  facts, not a formatting slip — and both forms were kept:
  `informieren`/`sich informieren` über+Akkusativ,
  `verringern`/`sich verringern` and `steigern`/`sich steigern` um+Akkusativ,
  `überzeugen`/`sich überzeugen` and `befreien`/`sich befreien` von+Dativ
  (the bare form of the last two was already in the original 370; only
  the reflexive counterpart was new).
- **4 rows excluded on manual review**: `zu tun haben,mit,dativ` and
  `tun,mit,dativ` (the same idiom fragment — "(etwas) hat nichts mit X zu
  tun" — twice; no clean single-word infinitive the way `wehtun`/`leidtun`
  have, so excluded the same way "Angst haben"-style idioms are elsewhere
  in this project); `geneigt,zu,dativ` (an adjective/participle, not an
  infinitive verb lemma — already covered by the existing `neigen,zu,dativ`
  entry); `sich auseinandersetzen,über,akkusativ` (its own example sentence
  says "...setzt sich **mit** dem Problem auseinander" — contradicts its
  own über+Akkusativ label; the correctly-labeled `mit,dativ` row for the
  same verb was kept instead).
- **3 rows excluded for a different reason — a real test failure, not a
  data-quality one**: `gehen,um,akkusativ`, `gehen,unter,dativ`, and
  `laufen,unter,dativ` all cleared every check above, but adding them
  broke `enrich.server.test.ts`'s existing "nominalized-infinitive
  collision" regression test, which asserts `gehen`/`laufen` (along with
  `sehen`/`essen`) get **no** enrichment at all — because
  `enrichGermanTerm` tries the government dataset first, giving either
  verb any entry here makes the lookup succeed and short-circuits past
  that guard. Same principle the sibling dative-verb dataset already
  applied when it excluded `gehen`/`kommen`/`sein`/... entirely rather
  than just their marginal senses: `gehen` has 50+ readings, and "es geht
  um X" being genuinely common doesn't make tagging the bare verb safe —
  a learner hits the ordinary "to go" sense first. Flagged here rather
  than weakening the test, since relaxing that invariant is a product
  decision, not a data-cleaning one.

**Final count merged: 66.** 76 rows survived in-CSV cleaning, dedup, and
the cross-check against the original 370 — that already accounts for the
13 in-CSV reflexive-formatting ambiguities (9 resolved as duplicates and
dropped, 4 judged genuine dual-valence pairs and kept, both described
above). Of those 76, 10 more were excluded on further review: 4 for
data-quality reasons (the two idiom-fragment rows, the non-infinitive
`geneigt`, and the self-contradicting `auseinandersetzen` row), 3 more
reflexive duplicates that only a broader check against the *existing*
370 caught — not visible to the in-CSV-only check, since only one side
of each pair (`verwandeln`, `belaufen`, `ängstigen`) appeared in this CSV
at all — and 3 for the `gehen`/`laufen` regression-test reason. 76 − 10 =
**66 entries merged**, dataset total 370 → **436**, verified
duplicate-free by comparing every (verb, preposition, case) triple
directly against the merged file.

`level` was kept only for entries where the CSV's own `cefr_level` was
A1 or A2, matching this field's existing scope (see above) — this
source's B1-C2 tags are real but outside what `level` has ever
represented here, so they weren't persisted. The CSV's `confidence`
column (high/medium) was used only during cleaning (to break ties in
deduplication) and isn't itself stored anywhere in the merged data.

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
