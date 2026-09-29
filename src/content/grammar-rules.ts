/**
 * Fixed rule text/tables for the three set-independent grammar drills
 * (plural, nicht/kein, mein/dein/sein). Deliberately static data, not
 * AI-generated — this task's rule text is given verbatim by the product
 * spec, so it lives here as structured content rather than being produced
 * (or re-derived) by any AI call.
 */
export type GrammarRuleTopic = "plural" | "nicht-kein" | "possessive";

export interface GrammarRule {
  topic: GrammarRuleTopic;
  title: string;
  /** A short framing sentence shown above the table/examples. For "plural"
   *  this MUST make clear there is no reliable rule — memorization is the
   *  actual skill being drilled, not a pattern to derive. */
  intro: string;
  table?: { headers: string[]; rows: string[][] };
  examples?: string[];
}

export const GRAMMAR_RULES: Record<GrammarRuleTopic, GrammarRule> = {
  plural: {
    topic: "plural",
    title: "Plural endings",
    intro:
      "There's no fixed rule — memorization is expected. These are the common patterns, not guarantees.",
    table: {
      headers: ["Ending", "Example", "Note"],
      rows: [
        ["-e (often + Umlaut)", "der Tisch → die Tische, der Stuhl → die Stühle", "Most common, especially for der/das nouns"],
        ["-er (mostly + Umlaut)", "das Kind → die Kinder, das Buch → die Bücher", "Mostly das nouns"],
        ["-n / -en", "die Frau → die Frauen, die Tasche → die Taschen", "Mostly die nouns"],
        ["-s", "das Auto → die Autos, das Hotel → die Hotels", "Words of foreign origin"],
        ["unchanged", "der Lehrer → die Lehrer, das Mädchen → die Mädchen", "Words ending in -er/-en/-chen/-lein"],
      ],
    },
  },
  "nicht-kein": {
    topic: "nicht-kein",
    title: "nicht or kein",
    intro:
      "kein negates a noun that has no article, or has \"ein\" — nicht negates everything else (verb, adjective, definite noun).",
    examples: [
      "Ich habe ein Auto. → Ich habe kein Auto.",
      "Das ist nicht teuer.",
      "Ich komme nicht.",
      "Das ist nicht der Bus.",
    ],
    table: {
      headers: ["", "der", "die", "das", "Plural"],
      rows: [
        ["Nominativ", "kein", "keine", "kein", "keine"],
        ["Akkusativ", "keinen", "keine", "kein", "keine"],
        ["Dativ", "keinem", "keiner", "keinem", "keinen"],
      ],
    },
  },
  possessive: {
    topic: "possessive",
    title: "mein, dein, sein",
    intro:
      "The endings follow the exact same pattern as kein/ein — only the stem changes: ich→mein-, du→dein-, er/es→sein-, sie→ihr-, wir→unser-, ihr→euer-, sie/Sie→ihr-/Ihr-.",
    examples: ["meine Mutter (Nom./Akk.)", "meiner Mutter (Dat.)"],
    table: {
      headers: ["Pronoun", "Stem"],
      rows: [
        ["ich", "mein-"],
        ["du", "dein-"],
        ["er / es", "sein-"],
        ["sie", "ihr-"],
        ["wir", "unser-"],
        ["ihr", "euer-"],
        ["sie / Sie", "ihr- / Ihr-"],
      ],
    },
  },
};
