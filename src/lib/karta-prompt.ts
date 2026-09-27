/**
 * The prompt a learner pastes into their OWN AI chat (Grok / GPT / Gemini, any)
 * to get a Karta study set as JSON. Karta's own Gemini generate path is not
 * involved: the app only validates and imports what comes back
 * (karta-import.ts). Shown verbatim on the upload dialog; TOPIC / TARGET
 * LANGUAGE / LEVEL are left for the learner to fill.
 */
export const KARTA_RULE =
  "Karta JSON. term/def isn't enough: gender + a sentence per case. At least 8, at most 200 cards.";

export const KARTA_PROMPT = `You write a Karta study set. Karta trains German PRODUCTION:
article, case, then a sentence — not a word list.

Output ONLY valid JSON. No markdown. No commentary.

{
  "title": "string",
  "description": "one short sentence, or null",
  "pair": "de-en" | "de-tr" | "tr-ku" | "ku-tr",
  "level": "A1" | "A2",
  "cards": [
    {
      "term": "dictionary form in the SOURCE language (German: no article in the string)",
      "pos": "noun" | "verb" | "adj" | "other",
      "gender": "der" | "die" | "das" | null,
      "plural": "string or null",
      "noPlural": false,
      "gloss": "meaning in the TARGET language",
      "examples": {
        "nom": "Nominativ sentence or null",
        "akk": "Akkusativ sentence using den/die/das + noun, or null",
        "dat": "Dativ sentence using dem/der/dem + noun, or null"
      }
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
- Gloss language = TARGET below.
- pair = "<source>-<target>": "de-en" / "de-tr" German terms;
  "tr-ku" Turkish terms, Kurdish glosses; "ku-tr" Kurdish terms,
  Turkish glosses. Kurdish = Kurmanji, Latin script only.
- Non-German pairs (tr-ku, ku-tr): gender, plural = null,
  noPlural = false, examples.akk and examples.dat = null.
  The German rules above apply only to de-en / de-tr.

TOPIC: 
SOURCE LANGUAGE: German | Turkish | Kurdish (Kurmanji)
TARGET LANGUAGE: 
LEVEL: 
COUNT: `;
