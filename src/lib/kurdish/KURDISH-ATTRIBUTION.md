# Kurmancî (KU) ↔ Turkish (TR) bundled dataset — attribution

`ku-data.ts` and `tr-data.ts` in this directory are trimmed derivatives of
third-party data, in the same position as `src/lib/german/nouns-data.ts` and
`examples-data.ts` (see those files' own `ATTRIBUTION.md` /
`EXAMPLES-ATTRIBUTION.md`): not original work of this project, and carrying
license obligations that survive being bundled into the application.

## Source

| | |
|---|---|
| Upstream content | [Kurdish Wiktionary](https://ku.wiktionary.org) |
| Redistribution | [Ferheng+ data](https://github.com/zanagamestudios-lgtm/ferhengplus-data), release **v2.5.0**, asset `ferheng_remote.db.gz` |
| Downloaded | 2026-09-28 |
| License | **CC BY-SA 4.0, per ku.wiktionary.org's own terms — NOT independently confirmed against a LICENSE file in the Ferheng+ repository, because that repository does not carry one.** This is stated on the strength of Wiktionary's standard licensing and the Ferheng+ project's own README description of itself as a Wiktionary extraction, not a verified license grant from the Ferheng+ maintainers. Treat this the same way `EXAMPLES-ATTRIBUTION.md` treats its own unresolved TODO: unresolved and to be confirmed before any wider redistribution of this specific derivative. |

The downloaded SQLite database (`ferheng_remote.db`, ~180MB uncompressed) is
**not** committed to this repository — only the filtered, processed output
below is.

## Source schema (as extracted, for anyone regenerating this)

- `entries(id, headword, headword_normalized, language_code, part_of_speech, gender, ...)`
- `senses(id, entry_id, ordinal, section, definition)` — `section` is a
  part-of-speech tag in Kurdish ("Navder" = noun, "Leker" = verb, "Rengder" =
  adjective, "Pasgir"/"Pesgir" = suffix/prefix, "Hoker" = adverb, etc.; 23
  distinct values across the full dataset).
- `translations(id, entry_id, language_code, translation, translation_normalized, source)`
  — **entry-level only, no sense-level foreign key.** A translation belongs
  to the whole entry, not to one of its senses, so a multi-sense entry's
  translations cannot be split back out by sense. This is the reason the
  ambiguity rule below treats "multiple senses" and "multiple translations
  of uncertain origin" the same way: null out rather than guess.

`entries.language_code = 'ku'`: 119,926 rows. `translations.language_code =
'tr'`: 113,561 rows (also present: `en` 97,667, `de` 49,688 — both skipped,
see below). `translations.source` is uniformly `"wiktionary.org"` (no
FreeDict-sourced rows in this release).

## What we changed / kept

Only Kurmancî (`ku`) entries and only their Turkish (`tr`) translations.
**English and German translations, and example sentences, were skipped
entirely** — out of scope for this task (KU↔TR only), and this dataset does
not even carry example sentences as a distinct field the way the German
Wiktionary extraction does.

For every `ku` entry with at least one non-empty `tr` translation
(48,512 of them), we grouped by lowercased headword and classified:

- **`clear`** (36,112 entries) — the headword belongs to exactly one entry
  in the source, all of that entry's senses share one `section` (POS) tag,
  and it has exactly one sense. **Only these are kept in `ku-data.ts`.**
- **`ambiguous_cross_pos`** (3,510) — the single entry's senses span more
  than one `section`.
- **`ambiguous_multi_sense`** (8,890) — one `section`, but more than one
  sense under it.
- **`ambiguous_cross_entry`** (0 in this release — every headword happened
  to map to exactly one source `entries` row) — would be headwords shared
  by two or more distinct entries, the cross-POS-by-different-rows case.

This mirrors `examples.server.ts`'s own stated rule for German ("more than
one row for a lemma -> null, never guess which one") rather than any
embedding/NLP-based sense clustering — deliberately the simplest rule that
fits the data, per this task's own instructions.

For the reverse direction (`tr-data.ts`), we built a Turkish-text -> Kurdish
headword(s) index from the SAME 48,512-entry pool (ambiguous KU entries
included, since a Turkish word can legitimately be the correct translation
of an entry that is itself internally ambiguous — the two ambiguity
questions are independent). A Turkish text is kept only when it maps to
**exactly one** distinct Kurdish headword across every entry that lists it;
42,456 distinct Turkish texts were found this way, of which 17,071 map to
exactly one Kurdish headword (kept) and 25,385 map to two or more different
Kurdish headwords (dropped — the exact "genuinely translates several
different Kurdish words" case this is meant to exclude).

## Known dirty entries in the source data (not corrected, kept as-is)

Per this task's instructions, none of these are hand-fixed — the ambiguity
rule above is relied on to keep them from ever being surfaced as a false
"unambiguous" answer:

- **"şev"** — 3 senses under one `Navder` (noun) section; one of them is an
  "apple tree" sense unrelated to the primary "night" meaning, filed under
  the same POS tag as if it were a nuance of the same word. Classified
  `ambiguous_multi_sense`.
- **"dê"** — 11 senses spanning 6 different `section` tags (Hoker, Navder,
  Pasgir, Paşdaçek, Pesgir, Pirtik) — everything from "mother" to a verbal
  suffix to an interjection, sharing one headword string. Classified
  `ambiguous_cross_pos`.
- **"nan"** — noun ("bread") and verb senses under the same headword.
  Classified `ambiguous_cross_pos`.
- **"dost"** — `Navder` (noun, "friend") and `Pasgir` (suffix) senses under
  the same headword. Classified `ambiguous_cross_pos`.

These are the source data's own tagging, not an artifact of our filtering —
they are left uncorrected because correcting a dictionary's sense
boundaries is out of scope for this task and would require judgment calls
about a language neither of us can independently verify.

## What CC BY-SA 4.0 requires of us

Same two obligations `ATTRIBUTION.md`/`EXAMPLES-ATTRIBUTION.md` already
record for the German datasets:

1. **Attribution** — this file, plus the header comments in `ku-data.ts`
   and `tr-data.ts`, are that credit.
2. **ShareAlike** — the derived dataset (not this project's own code that
   reads it) is offered under the same license terms it was received under.

Same deferred question as the German datasets: whether this credit must
also surface somewhere end users can see it, undecided here, to be resolved
alongside the equivalent German decision.
