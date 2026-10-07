/**
 * Fixed rule text/tables for the three set-independent grammar drills
 * (plural, nicht/kein, mein/dein/sein). Deliberately static data, not
 * AI-generated — this task's rule text is given verbatim by the product
 * spec, so it lives here as structured content rather than being produced
 * (or re-derived) by any AI call.
 */
export type GrammarRuleTopic =
  | "plural"
  | "nicht-kein"
  | "possessive"
  | "trennbare-verben"
  | "modalverben"
  | "imperativ"
  | "pronomen"
  | "adjektivendungen"
  | "steigerung"
  | "passiv"
  | "konjunktiv"
  | "relativsaetze"
  | "partizipialkonstruktionen"
  | "nominalisierung"
  | "funktionsverbgefuege"
  | "modalpartikeln"
  | "konjunktiv1"
  | "subjektive-modalverben"
  | "passiversatzformen"\n  | "helfen-dativ"\n  | "mit-dativ";

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
  "helfen-dativ": {
    topic: "helfen-dativ",
    title: "helfen + Dativ",
    intro:
      "When helfen names the person receiving help, that person is in the dative: mir, dir, ihm, ihr, uns, euch, Ihnen. Learn helfen together with this pattern rather than as a generic 'Dative rule'.",
    table: {
      headers: ["Person", "Dative with helfen"],
      rows: [
        ["ich", "mir"],
        ["du", "dir"],
        ["er", "ihm"],
        ["sie", "ihr"],
        ["wir", "uns"],
        ["ihr", "euch"],
        ["Sie", "Ihnen"],
      ],
    },
    examples: [
      "Kannst du mir helfen?",
      "Ich helfe dir.",
      "Können Sie uns helfen?",
      "Ich helfe meiner Mutter.",
    ],
  },
  "mit-dativ": {
    topic: "mit-dativ",
    title: "mit + Dativ",
    intro:
      "The preposition mit is followed by the dative. In common A1 chunks, der/das become dem, die becomes der, and plural die becomes den (often with -n on the noun where required).",
    examples: [
      "mit dem Bus",
      "mit der Bahn",
      "mit dem Kind",
      "mit den Freunden",
    ],
  },
  "trennbare-verben": {
    topic: "trennbare-verben",
    title: "Trennbare Verben",
    intro:
      "A separable prefix (an/auf/aus/mit/zu/ab/bei/ein/vor/nach/zurück/weg...) splits off and moves to the end of the main clause in the present tense/Präteritum. With a modal verb, the infinitive stays whole and does not separate. In the Perfekt, ge- is inserted between the prefix and the stem.",
    examples: [
      "anrufen → Ich rufe dich an.",
      "Ich muss dich anrufen. (modal — stays together)",
      "Perfekt: angerufen, aufgestanden",
    ],
  },
  modalverben: {
    topic: "modalverben",
    title: "Modalverben",
    intro:
      "können/müssen/dürfen/wollen/sollen/möchten conjugate irregularly for ich/du/er. The infinitive of the main verb goes to the end of the clause.",
    table: {
      headers: ["Modal", "ich", "du", "er"],
      rows: [
        ["können", "kann", "kannst", "kann"],
        ["müssen", "muss", "musst", "muss"],
        ["dürfen", "darf", "darfst", "darf"],
        ["wollen", "will", "willst", "will"],
        ["sollen", "soll", "sollst", "soll"],
        ["möchten", "möchte", "möchtest", "möchte"],
      ],
    },
    examples: ["Ich kann gut schwimmen."],
  },
  imperativ: {
    topic: "imperativ",
    title: "Imperativ",
    intro:
      "du: the stem (sometimes +e), no subject pronoun. ihr: verb+t. Sie: verb+Sie. A separable verb sends its prefix to the end.",
    examples: ["Komm!", "Kommt!", "Kommen Sie!", "Ruf mich an!"],
  },
  pronomen: {
    topic: "pronomen",
    title: "Pronomen (Akkusativ/Dativ)",
    intro: "Personal pronouns take different forms in the accusative and dative cases.",
    table: {
      headers: ["Nom", "Akk", "Dat"],
      rows: [
        ["ich", "mich", "mir"],
        ["du", "dich", "dir"],
        ["er", "ihn", "ihm"],
        ["sie", "sie", "ihr"],
        ["wir", "uns", "uns"],
        ["ihr", "euch", "euch"],
      ],
    },
  },
  adjektivendungen: {
    topic: "adjektivendungen",
    title: "Adjektivendungen",
    intro:
      "With der/die/das (definite article), the adjective ending is -e everywhere EXCEPT masculine accusative and all dative/plural forms, which take -en. (Simplified: this covers only the der-word pattern, not ein-words or unarticled adjectives.)",
    examples: [
      "der große Hund (Nom.)",
      "den großen Hund (Akk.)",
      "dem großen Hund (Dat.)",
      "die großen Hunde (Plural)",
    ],
  },
  steigerung: {
    topic: "steigerung",
    title: "Steigerung (Comparison)",
    intro:
      "Regular: +er / am +sten (klein → kleiner → am kleinsten). A handful of common adjectives are irregular.",
    table: {
      headers: ["Adjektiv", "Komparativ", "Superlativ"],
      rows: [
        ["groß", "größer", "am größten"],
        ["gut", "besser", "am besten"],
        ["viel", "mehr", "am meisten"],
        ["gern", "lieber", "am liebsten"],
      ],
    },
  },
  passiv: {
    topic: "passiv",
    title: "Passiv",
    intro: "werden + Partizip II builds the passive voice, in whichever tense werden is conjugated.",
    examples: [
      "Präsens: Das Haus wird gebaut.",
      "Präteritum: Das Haus wurde gebaut.",
      "Perfekt: Das Haus ist gebaut worden.",
    ],
  },
  konjunktiv: {
    topic: "konjunktiv",
    title: "Konjunktiv II",
    intro: "hätte / wäre / würde + infinitive express the hypothetical (Konjunktiv II).",
    examples: ["Ich würde gehen.", "Ich hätte Zeit.", "Ich wäre froh."],
  },
  relativsaetze: {
    topic: "relativsaetze",
    title: "Relativsätze",
    intro:
      "The relative pronoun matches the antecedent's gender/number, but takes its case from its own role inside the relative clause. It uses the same forms as the definite article, except dative plural (denen).",
    examples: [
      "der Mann, den ich kenne (Akk.)",
      "die Frau, die ich sehe (Nom.)",
      "der Mann, dem ich helfe (Dat.)",
    ],
  },
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
  partizipialkonstruktionen: {
    topic: "partizipialkonstruktionen",
    title: "Partizipialkonstruktionen",
    intro:
      "Partizip I/II can replace a relative clause, used attributively like an adjective. Partizip I (-end) = an ongoing/active meaning; Partizip II = a completed/passive meaning.",
    examples: [
      "der lesende Mann (= der Mann, der liest)",
      "das geschriebene Buch (= das Buch, das geschrieben wurde)",
    ],
  },
  nominalisierung: {
    topic: "nominalisierung",
    title: "Nominalisierung",
    intro:
      "A verb or adjective turned into a noun — three kinds, mixed in this drill: a real -ung noun from a verb (always feminine, 'die'), the bare infinitive capitalized and used as a noun (always neuter, 'das'), or a -heit/-keit noun from an adjective (always feminine, 'die').",
    examples: [
      "entscheiden → die Entscheidung",
      "lesen → das Lesen",
      "schön → die Schönheit",
    ],
  },
  funktionsverbgefuege: {
    topic: "funktionsverbgefuege",
    title: "Funktionsverbgefüge",
    intro:
      "A semantically weak verb (nehmen, kommen, bringen, stellen, ziehen...) + a noun is used instead of one simple verb — common in formal/written German.",
    examples: ["Rücksicht nehmen (= berücksichtigen)", "zum Ausdruck bringen (= ausdrücken)"],
  },
  modalpartikeln: {
    topic: "modalpartikeln",
    title: "Modalpartikeln",
    intro:
      "Small, usually untranslatable words that color a sentence's tone/attitude rather than its meaning: doch, mal, ja, eben, halt, denn, schon, wohl.",
    examples: ["Komm mal her! (Bitte, freundlich)", "Das ist doch klar! (Betonung)"],
  },
  konjunktiv1: {
    topic: "konjunktiv1",
    title: "Konjunktiv I (indirekte Rede)",
    intro:
      "Used to report someone else's words without a direct quote — signals \"this is what was said\", not necessarily true.",
    examples: ["Er sagt, er komme morgen. (= er hat gesagt, dass er morgen kommt)"],
  },
  "subjektive-modalverben": {
    topic: "subjektive-modalverben",
    title: "Subjektive Modalverben",
    intro:
      "müssen/dürfte/können can express a GUESS about how certain something is, not an obligation/permission: müssen = near-certain, dürfte = probable, können = possible.",
    examples: ["Er muss zu Hause sein. (= wahrscheinlich ist er es)", "Das dürfte stimmen."],
  },
  passiversatzformen: {
    topic: "passiversatzformen",
    title: "Passiversatzformen",
    intro:
      "Ways to express a passive meaning without werden: sich lassen + Infinitiv, or sein + zu + Infinitiv.",
    examples: ["Das lässt sich machen.", "Das ist zu machen."],
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
