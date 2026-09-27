/**
 * The prompt a learner pastes into their OWN AI chat (Grok / GPT / Gemini, any)
 * to get a Karta study set as JSON. Karta's own Gemini generate path is not
 * involved: the app only validates and imports what comes back
 * (karta-import.ts). Shown verbatim on the upload dialog; TOPIC / languages /
 * LEVEL / COUNT are left for the learner to fill. The languages are NOT part
 * of the JSON: the learner picks them in the Paste screen.
 */
export const KARTA_RULE =
  "Karta JSON. term/def isn't enough: gender + a sentence per case. At least 8, at most 200 cards.";

export const KARTA_PROMPT = `You write a Karta study set. Karta trains German PRODUCTION:
article, case, then a sentence — not a word list.

Output ONLY valid JSON. No markdown. No commentary.

{
  "title": "string",
  "description": "one short sentence, or null",
  "level": "A1" | "A2",
  "cards": [
    {
      "term": "dictionary form in the TERM language (German: no article in the string)",
      "pos": "noun" | "verb" | "adj" | "other",
      "gender": "der" | "die" | "das" | null,
      "plural": "string or null",
      "noPlural": false,
      "gloss": "meaning in the DEFINITION language",
      "examples": {
        "nom": "Nominativ sentence or null",
        "akk": "Akkusativ sentence using den/die/das + noun, or null",
        "dat": "Dativ sentence using dem/der/dem + noun, or null"
      },
      "sourceNote": "where this entry comes from (dictionary, book), or null"
    }
  ]
}

Rules:
- Card count = COUNT below. Not fixed at 50.
  Minimum 8, maximum 200.
  Topic smaller → fewer cards. Do not pad.
- Real German orthography (ß, umlauts).
- Nouns: gender required. Article not inside term.
- If you cannot write a correct akk or dat sentence, use null.
  Never guess.
- Verbs: gender null. examples may be nom-only.
- Terms in TERM LANGUAGE, glosses in DEFINITION LANGUAGE below.
  Kurdish = Kurmanji, Latin script only.
- Terms not German: gender, plural = null, noPlural = false,
  examples.akk and examples.dat = null. The German rules above
  apply only to German terms.

TOPIC:
TERM LANGUAGE:
DEFINITION LANGUAGE:
LEVEL:
COUNT: `;
