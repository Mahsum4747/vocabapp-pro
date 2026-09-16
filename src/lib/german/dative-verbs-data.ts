/**
 * Curated list of German verbs that take a fixed dative object with NO
 * preposition — "helfen", "danken", "gefallen" and the like. A closed,
 * genuinely exceptional case-government category (a learner would
 * otherwise default to accusative and be wrong), which is why it's worth
 * a curated dataset the way `verb-government-data.ts` is for prepositional
 * verbs. Plain accusative is deliberately NOT the mirror of this file: it's
 * the default case for German transitive verbs, not an exception, so a
 * sampled list of it would create false negatives (a common accusative verb
 * missing from the sample reading as "doesn't take accusative") rather than
 * teach anything — see DATIVE-ATTRIBUTION.md for the full reasoning.
 *
 * Hand-compiled and cross-checked between two independent pedagogical
 * sources — see DATIVE-ATTRIBUTION.md for exactly what came from where.
 *
 * `level` is set only where easy-deutsch.de's own list tags a real CEFR
 * level (A1-C1). Entries found only in deutsch-mit-anna.de's (unleveled)
 * list carry no `level` rather than guessing one.
 */

export type DativeVerbEntry = {
  verb: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
};

export const DATIVE_VERB_DATA: readonly DativeVerbEntry[] = [
  // Cross-checked — present in both sources; level from easy-deutsch.de.
  { verb: "antworten", level: "A1" },
  { verb: "folgen", level: "A1" },
  { verb: "gefallen", level: "A1" },
  { verb: "gehören", level: "A1" },
  { verb: "glauben", level: "A1" },
  { verb: "helfen", level: "A1" },
  { verb: "raten", level: "A1" },
  { verb: "schmecken", level: "A1" },
  { verb: "zuhören", level: "A1" },
  { verb: "befehlen", level: "A2" },
  { verb: "danken", level: "A2" },
  { verb: "fehlen", level: "A2" },
  { verb: "passen", level: "A2" },
  { verb: "vertrauen", level: "A2" },
  { verb: "vergeben", level: "A2" },
  { verb: "verzeihen", level: "A2" },
  { verb: "widersprechen", level: "A2" },
  { verb: "zusehen", level: "A2" },
  { verb: "zustimmen", level: "A2" },
  { verb: "ähneln", level: "B1" },
  { verb: "begegnen", level: "B1" },
  { verb: "beistehen", level: "B1" },
  { verb: "drohen", level: "B1" },
  { verb: "entgegenkommen", level: "B1" },
  { verb: "gratulieren", level: "B1" },
  // Source conflict, resolved: easy-deutsch.de tags this reflexive ("sich
  // schaden"); deutsch-mit-anna.de has the plain, non-reflexive form, which
  // matches the standard "jemandem schaden" dative pattern — normalized to
  // that. See DATIVE-ATTRIBUTION.md.
  { verb: "schaden", level: "B1" },
  { verb: "einfallen", level: "B2" },
  { verb: "gehorchen", level: "B2" },
  { verb: "nützen", level: "B2" },
  { verb: "ausweichen", level: "B2" },
  { verb: "dienen", level: "C1" },
  { verb: "gelingen", level: "C1" },

  // easy-deutsch.de only.
  { verb: "passieren", level: "A1" },
  { verb: "nachlaufen", level: "A2" },
  { verb: "nachrennen", level: "A2" },
  { verb: "hinterherlaufen", level: "A2" },
  { verb: "hinterherrennen", level: "A2" },
  { verb: "fremdgehen", level: "A2" },
  { verb: "beitreten", level: "B1" },
  { verb: "entgegengehen", level: "B1" },
  { verb: "entgegenfahren", level: "B1" },
  { verb: "sich nähern", level: "B1" },
  { verb: "genügen", level: "B2" },
  { verb: "guttun", level: "B2" },
  { verb: "misslingen", level: "C1" },

  // deutsch-mit-anna.de only — no level (that source doesn't tag one).
  { verb: "abgewöhnen" },
  { verb: "anvertrauen" },
  { verb: "auffallen" },
  { verb: "beantworten" },
  { verb: "beibringen" },
  { verb: "bringen" },
  { verb: "empfehlen" },
  { verb: "geben" },
  { verb: "gewähren" },
  { verb: "gönnen" },
  { verb: "holen" },
  { verb: "schenken" },
  { verb: "versprechen" },
  { verb: "verweigern" },
  { verb: "winken" },
  { verb: "wünschen" },
  { verb: "zuordnen" },
  { verb: "zuschauen" },

  // Added separately from either source's list, not idiom exclusions: both
  // are genuine fixed-dative-object constructions ("jemandem wehtun",
  // "jemandem leidtun") with a Duden-sanctioned single-word infinitive
  // spelling — a real lemma a user would type in the Term field, unlike a
  // verb+noun idiom such as "Angst haben" which has no single-word form at
  // all. `level` on "wehtun" carries over from easy-deutsch.de's "wehtun"
  // entry (A1); "leidtun" has no source-tagged level.
  { verb: "wehtun", level: "A1" },
  { verb: "leidtun" },
];
