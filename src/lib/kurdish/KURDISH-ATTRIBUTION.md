# Kurmancî (KU) ↔ {German (DE), English (EN), Turkish (TR)} bundled dataset — attribution

`ku-data.ts`/`tr-data.ts` (KU↔TR), `de-data.ts` (KU↔DE) and `en-data.ts`
(KU↔EN) in this directory are trimmed derivatives of
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

Only Kurmancî (`ku`) entries, and their Turkish (`tr`), German (`de`) and
English (`en`) translations — **example sentences were skipped entirely**
for all three target languages; this dataset does not carry example
sentences as a distinct field the way the German Wiktionary extraction
does.

The TR pair was built first (see the historical section below); the DE and
EN pairs were added later, from the SAME Ferheng+ v2.5.0 export and the
SAME `ku` entry pool, filtered by `translations.language_code = 'de'` /
`'en'` instead of `'tr'`. Same rule, same cap, same dedupe, same
`ambiguous_cross_entry` exclusion (0 collisions in this release, for every
target language) — see "KU→DE / KU→EN pairs" below for the actual counts.

### KU→DE / KU→EN pairs (added after the TR pair)

`translations.language_code = 'de'`: 49,688 rows; `= 'en'`: 97,667 rows (see
counts above). Same headword pool as the TR pair (48,512 non-cross-entry
`ku` entries), same per-entry dedupe/cap-at-5/source-row-order rule:

- **KU→DE** (`de-data.ts`, `KU_DE_FORWARD_TSV`): 20,611 entries have at
  least one German translation after dedupe/cap; 10,860 resolve to exactly
  one gloss, 9,751 to 2–5.
- **DE→KU** (`de-data.ts`, `DE_KU_REVERSE_TSV`): 21,348 distinct German
  strings translate at least one Kurdish headword; 8,738 map to exactly one
  headword, 12,610 to 2–5.
- **KU→EN** (`en-data.ts`, `KU_EN_FORWARD_TSV`): 36,042 entries have at
  least one English translation after dedupe/cap; 18,121 resolve to exactly
  one gloss, 17,921 to 2–5.
- **EN→KU** (`en-data.ts`, `EN_KU_REVERSE_TSV`): 44,215 distinct English
  strings translate at least one Kurdish headword; 22,931 map to exactly one
  headword, 21,284 to 2–5.

These are smaller than the TR pair's 48,512/42,456 because fewer `ku`
entries in this release happen to carry a `de`/`en` translation at all than
carry a `tr` one (113,561 `tr` rows vs. 49,688 `de` / 97,667 `en` — see the
row counts above), not because of any extra filtering beyond the same
`ambiguous_cross_entry` rule already applied to the TR pair.

## What we changed / kept (original TR-only build)

Only Kurmancî (`ku`) entries and only their Turkish (`tr`) translations.
**English and German translations, and example sentences, were skipped
entirely** at the time — out of scope for that first pass (KU↔TR only); see
"KU→DE / KU→EN pairs" above for how those were later added.

For every `ku` entry with at least one non-empty `tr` translation
(48,512 of them), we grouped by lowercased headword and classified:

- **`clear`** (36,112 entries) — the headword belongs to exactly one entry
  in the source, all of that entry's senses share one `section` (POS) tag,
  and it has exactly one sense.
- **`ambiguous_cross_pos`** (3,510) — the single entry's senses span more
  than one `section`.
- **`ambiguous_multi_sense`** (8,890) — one `section`, but more than one
  sense under it.
- **`ambiguous_cross_entry`** (0 in this release — every headword happened
  to map to exactly one source `entries` row) — would be headwords shared
  by two or more distinct entries, the cross-POS-by-different-rows case.

**Updated rule (superseding the original build):** since `translations` has
no sense-level FK, `ambiguous_cross_pos` and `ambiguous_multi_sense` were
never actually resolvable by picking "the right sense" — a multi-sense
entry's translations were always one undifferentiated list. Excluding them
meant a genuinely multi-meaning word (e.g. "mal" = ev/mal/mülk/emlak) surfaced
nothing at all, which is worse than showing every gloss and letting the
person pick. `ku-data.ts` now keeps **every** entry from `clear` +
`ambiguous_cross_pos` + `ambiguous_multi_sense` (36,112 + 3,510 + 8,890 =
**48,512 entries — all of them**, since `ambiguous_cross_entry` is 0). Only
`ambiguous_cross_entry` would still be excluded (headword collision across
*distinct* source `entries` rows, not distinguishable by picking a sense at
all) — moot in this release since it's 0. For each kept entry, all of its
`tr` translations are deduped and capped at **5**, in source `translations`
row-id order (no relevance ranking invented). 22,497 of the 48,512 entries
have more than one translation after dedupe/cap, and now show all of them as
separate tap-to-fill chips in the card editor instead of nothing.

For the reverse direction (`tr-data.ts`), we built a Turkish-text -> Kurdish
headword(s) index from the SAME 48,512-entry pool (ambiguous KU entries
included, since a Turkish word can legitimately be the correct translation
of an entry that is itself internally ambiguous — the two ambiguity
questions are independent). 42,456 distinct Turkish texts exist in this
pool: 17,071 map to exactly one Kurdish headword and 25,385 map to two or
more different Kurdish headwords.

**Updated rule (superseding the original build):** the old build dropped
all 25,385 multi-headword Turkish texts entirely (the "genuinely translates
several different Kurdish words" case). `tr-data.ts` now keeps **all
42,456** — every Turkish text that translates at least one Kurdish
headword — listing every distinct headword it translates (deduped, capped
at **5**, in source row-id order) instead of requiring exactly one.

## Known multi-sense entries in the source data (not corrected, kept as-is)

These headwords carry several senses (and, in some cases, several parts of
speech) under one headword string. Since translations aren't separable by
sense in the source data (see above), they are now INCLUDED — all their
translations are shown together as chips, and it's up to the person to pick
the right one, rather than being silently excluded as they were before this
change:

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
about a language neither of us can independently verify. Each now resolves
to up to 5 of its (deduped) Turkish translations, capped the same way every
other entry is.

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
