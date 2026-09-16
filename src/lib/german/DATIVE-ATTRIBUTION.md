# German fixed-dative-object verb dataset — attribution

`dative-verbs-data.ts` in this directory is a small, hand-compiled dataset,
same shape and reasoning as `verb-government-data.ts`/`GOVERNMENT-ATTRIBUTION.md`
but for a different fact: verbs whose own direct object is fixed to the
dative case with **no preposition involved** ("helfen", "danken",
"gefallen", "gehören", "gratulieren", ...). This is a genuinely exceptional,
closed pedagogical category in German — a learner would otherwise default
to accusative (the ordinary case for a direct object) and be wrong — which
is why it's worth curating the same way prepositional government is.

## Sources checked

- **IDS Mannheim (grammis.ids-mannheim.de)** — checked and ruled out. Their
  only relevant resource is E-VALBU, a ~700-verb searchable valency
  *dictionary* (tags complements as Kdat/Kakk/etc. per entry), not a
  browsable list page; there is no separate static "verbs with dative
  object" list to extract from, beyond the VmP-Listen (prepositional verbs)
  already used for `verb-government-data.ts`.
- **Deutschlernerblog.de** — checked and ruled out. No "Verben mit Dativ"
  page exists on the site; it only publishes prepositional-verb lists
  (wrong category — governed by a preposition, not a bare dative object).
- **Source 1 (used)**: [easy-deutsch.de — "Liste: Verben mit Dativ (Die 45
  wichtigsten)"](https://easy-deutsch.de/liste-verben-mit-dativ/), leveled
  A1-C1 per entry.
- **Source 2 (used)**: [deutsch-mit-anna.de — "Verben mit Dativ
  Liste"](https://deutsch-mit-anna.de/lektion/verben-mit-dativ-liste/), not
  leveled.

## What was extracted, and what wasn't

Only the bare fact — **this verb takes a fixed dative object** — plus
easy-deutsch.de's own per-entry CEFR level where it gives one. Not taken
from either source: example sentences, explanatory prose, or either site's
own page layout/grouping (this file is a flat array, alphabetized within
each provenance group, not a copy of either source's structure).

deutsch-mit-anna.de does not tag individual verbs with a CEFR level, so
none of the 18 entries found only there carry a `level` — guessing one
would violate this project's own rule against inventing data a source
doesn't support.

## Cross-check results

- **32 verbs** appear in both sources (no plain-count conflicts).
- **13 verbs** appear only in easy-deutsch.de (kept, with its level).
- **18 verbs** appear only in deutsch-mit-anna.de (kept, no level).
- **One conflict, resolved**: easy-deutsch.de lists "**sich schaden**"
  (reflexive, B1); deutsch-mit-anna.de lists plain "**schaden**". The
  standard pattern is *jemandem schaden* (non-reflexive — the person
  harmed is the dative object), so the dataset keeps the plain form and
  treats easy-deutsch.de's "sich" as that source's own annotation quirk
  rather than a genuine second, reflexive sense.

**Excluded**: verb+noun idiom constructions that aren't a single verb
lemma at all (the same rule that excludes "Angst haben"/"Abschied nehmen"
elsewhere in this project) — with one exception below.

**Added separately, not from either list**: "**wehtun**" and "**leidtun**".
These are fixed dative constructions ("jemandem wehtun", "jemandem
leidtun") but, unlike a true verb+noun idiom, Duden gives each a real
single-word infinitive lemma (the fused spelling is standard/preferred,
not this project inventing one) — exactly the form a user would type into
the Term field. "wehtun" carries easy-deutsch.de's A1 level (its own list
spells the verb this same fused way); "leidtun" has no source-tagged
level.

**Total: 65 entries** (32 + 13 + 18 + 2).

## What this dataset deliberately is NOT

No parallel plain-accusative dataset exists, and none is planned from a
general "verbs with accusative" list. Accusative is the *default* case for
a German transitive direct object, not an exception — "isst + Akkusativ"
teaches a learner nothing, while a necessarily-sampled list of it creates
false negatives: a common accusative verb absent from the sample (because
no source happened to include it) would read as "this verb doesn't take
accusative," which is worse than showing nothing. A plain-accusative
dataset was considered and rejected for this reason; a future dataset
covering a genuinely closed accusative-exception category (e.g.
double-accusative verbs like *lehren*, *kosten*, *nennen*) would not have
this problem and could be added on the same footing as this file, but is
out of scope here.

## Why this isn't a copyright concern

Same reasoning as `GOVERNMENT-ATTRIBUTION.md`: which case a verb's object
takes is a fact about German grammar, not creative expression. This
dataset contains none of either source's actual written text or page
structure.

## User-visible framing (if ever surfaced)

The dataset contains 65 dative-governing verb lemmas/constructions
identified from the selected pedagogical source sets. This is not intended
as an exhaustive inventory of all German verbs that can govern a dative
object.
