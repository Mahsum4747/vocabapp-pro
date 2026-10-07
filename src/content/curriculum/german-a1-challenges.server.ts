import { unit6ChallengeForms } from "./german-a1-unit6-challenges.server";
import { batchAChallengeForms } from "./german-a1-batch-a-challenges.server";
import type { ChallengeItem } from "@/lib/curriculum/challenge";
// Original challenge arrangements, separate from Unit Check items and evidence families.
// Keys remain server-only; only public prompts/options are returned to the browser.
const text = (
  id: string,
  outcome: string,
  prompt: string,
  answer: string,
  stimulus?: string,
): ChallengeItem => ({ id, outcome, prompt, acceptedAnswers: [answer], stimulus });
const choice = (
  id: string,
  outcome: string,
  prompt: string,
  options: string[],
  answer: string,
  stimulus?: string,
): ChallengeItem => ({ ...text(id, outcome, prompt, answer, stimulus), options });
export const challengeForms: Record<string, Record<"A" | "B", readonly ChallengeItem[]>> = {
  ...batchAChallengeForms,
  ...unit6ChallengeForms,
  "DE.A1.U01": {
    A: [
      text(
        "identity",
        "Identity statement",
        "Introduce Ada. Write ‘I am Ada’ in German.",
        "Ich bin Ada.",
      ),
      text("agreement", "Subject and sein", "Fill only the verb: Du ___ Sami.", "bist"),
      {
        ...text(
          "noun",
          "Article and noun capitalization",
          "Write ‘an office’ in German.",
          "ein Büro",
        ),
        caseSensitive: true,
      },
      text(
        "question",
        "Yes/no question",
        "Ask whether the other person is Ada. Use bist, du and Ada.",
        "Bist du Ada?",
      ),
      text(
        "detail",
        "Question word",
        "Ask who the other person is. Use wer, bist and du.",
        "Wer bist du?",
      ),
      text(
        "number",
        "Number extraction",
        "Enter the registration number, using digits.",
        "3",
        "Name: Ada\nDatum: 12.03.\nNummer: 3",
      ),
      text(
        "date",
        "Date extraction",
        "Copy the date, including leading zeros and the final dot.",
        "03.12.",
        "Name: Sami\nNummer: 12\nDatum: 03.12.",
      ),
      text(
        "description",
        "Possession and description",
        "Write two statements: I have a phone; the office is small. Use Ich, habe, ein Telefon, Das Büro, ist, klein.",
        "Ich habe ein Telefon. Das Büro ist klein.",
      ),
    ],
    B: [
      text(
        "identity",
        "Identity statement",
        "Introduce Sami. Write ‘I am Sami’ in German.",
        "Ich bin Sami.",
      ),
      text("agreement", "Subject and sein", "Fill only the verb: Ich ___ Ada.", "bin"),
      {
        ...text(
          "noun",
          "Article and noun capitalization",
          "Write ‘a woman’ in German.",
          "eine Frau",
        ),
        caseSensitive: true,
      },
      text(
        "question",
        "Yes/no question",
        "Ask whether the other person is Sami. Use du, Sami and bist.",
        "Bist du Sami?",
      ),
      choice(
        "detail",
        "Question word",
        "You need the person's identity, not an object's name. Which question fits?",
        ["Was ist das?", "Wer bist du?"],
        "Wer bist du?",
      ),
      text(
        "number",
        "Number extraction",
        "Enter the registration number, using digits.",
        "2",
        "Datum: 03.12.\nNummer: 2\nName: Sami",
      ),
      text(
        "date",
        "Date extraction",
        "Copy the date, including leading zeros and the final dot.",
        "12.03.",
        "Nummer: 3\nName: Ada\nDatum: 12.03.",
      ),
      text(
        "description",
        "Possession and description",
        "Write two statements: I have a phone; the office is large. Use Ich, habe, ein Telefon, Das Büro, ist, groß.",
        "Ich habe ein Telefon. Das Büro ist groß.",
      ),
    ],
  },
  "DE.A1.U02": {
    A: [
      text(
        "agreement",
        "Regular subject agreement",
        "Write ‘Ada studies German’. Use Ada, lernen and Deutsch.",
        "Ada lernt Deutsch.",
      ),
      text(
        "group",
        "Group and polite forms",
        "Fill only the verb: Ihr ___ in Berlin. Use wohnen.",
        "wohnt",
      ),
      text(
        "plural",
        "Noun plural and agreement",
        "Write ‘Our phones are small’. Use Unsere, Telefone, sind and klein.",
        "Unsere Telefone sind klein.",
      ),
      text(
        "reference",
        "Possessive reference",
        "Write two words: Ada's book. Use the possessive referring to her.",
        "ihr Buch",
      ),
      text(
        "negation",
        "Negation of description",
        "Deny that the book is large. Use Das Buch, ist, nicht and groß.",
        "Das Buch ist nicht groß.",
      ),
      text(
        "identity",
        "Negation of noun identity",
        "Fill only the missing word: Das ist ___ Telefon. It is a book, not a phone.",
        "kein",
      ),
      text(
        "stem",
        "Stem-changing agreement and und",
        "Join ‘Sami reads’ and ‘Ada sleeps’. Use Sami, lesen, und, Ada and schlafen.",
        "Sami liest und Ada schläft.",
      ),
      text(
        "revision",
        "Read correction and revise",
        "Fix this draft using the update; keep und and both subjects.",
        "Mein Büro ist klein und ich wohne in Berlin.",
        "Update: Das Büro ist nicht groß. Es ist klein.\nDraft: Mein Büro ist groß und ich wohnst in Berlin.",
      ),
    ],
    B: [
      text(
        "agreement",
        "Regular subject agreement",
        "Write ‘Sami lives in Berlin’. Use Sami, wohnen and in Berlin.",
        "Sami wohnt in Berlin.",
      ),
      text(
        "group",
        "Group and polite forms",
        "Fill only the verb: Sie ___ Deutsch. Address an adult politely; use lernen.",
        "lernen",
      ),
      text(
        "plural",
        "Noun plural and agreement",
        "Write ‘My books are large’. Use Meine, Bücher, sind and groß.",
        "Meine Bücher sind groß.",
      ),
      text(
        "reference",
        "Possessive reference",
        "Write two words: Sami's phone. Use the possessive referring to him.",
        "sein Telefon",
      ),
      text(
        "negation",
        "Negation of description",
        "Deny that the phone is small. Use Das Telefon, ist, nicht and klein.",
        "Das Telefon ist nicht klein.",
      ),
      text(
        "identity",
        "Negation of noun identity",
        "Fill only the missing word: Das sind ___ Bücher. They are phones, not books.",
        "keine",
      ),
      text(
        "stem",
        "Stem-changing agreement and und",
        "Join ‘Ada reads’ and ‘Sami sleeps’. Use Ada, lesen, und, Sami and schlafen.",
        "Ada liest und Sami schläft.",
      ),
      text(
        "revision",
        "Read correction and revise",
        "Fix this draft using the update; keep und and both subjects.",
        "Mein Büro ist groß und ich lerne Deutsch.",
        "Update: Das Büro ist nicht klein. Es ist groß.\nDraft: Mein Büro ist klein und ich lernt Deutsch.",
      ),
    ],
  },
  "DE.A1.U03": {
    // Original bounded shopping arrangements; no Unit Check items/evidence are reused.
    A: [
      text(
        "need",
        "Needed object",
        "Complete the shopping message. Write ‘I need a pen’ using Ich and brauchen.",
        "Ich brauche einen Stift.",
      ),
      text(
        "negation",
        "Negative purchase",
        "Write ‘We do not buy a bag’. Use Wir, kaufen and the indefinite negative object.",
        "Wir kaufen keine Tasche.",
      ),
      text(
        "reference",
        "Object reference",
        "Reply using only the pronoun for the named object: Ich sehe ___.",
        "ihn",
        "Wo ist der Stift?",
      ),
      text(
        "possession",
        "Possessed object",
        "Write ‘Ada sees my pen’. Use Ada, sehen and mein with the object.",
        "Ada sieht meinen Stift.",
      ),
      text(
        "availability",
        "Stock availability",
        "State the missing item's availability with es gibt. Write one whole sentence.",
        "Es gibt keine Tasche.",
        "Im Laden: ein Buch und ein Telefon. Taschen: keine.",
      ),
      text(
        "price",
        "Price extraction",
        "How much does the phone cost? Type the price using digits and Euro.",
        "12 Euro",
        "Das Buch kostet 3 Euro. Das Telefon kostet 12 Euro.",
      ),
      text(
        "preference",
        "Buying preference",
        "Write ‘We enjoy buying books’. Use Wir, kaufen, gern and Bücher.",
        "Wir kaufen gern Bücher.",
      ),
      text(
        "revision",
        "Practical message revision",
        "Correct only the object articles in this message. Keep both sentences and oder.",
        "Ich brauche einen Stift. Ich kaufe eine Tasche oder ein Buch.",
        "Ich brauche ein Stift. Ich kaufe einen Tasche oder ein Buch.",
      ),
    ],
    B: [
      text(
        "need",
        "Needed object",
        "Repair the object article in this need statement. Write the whole sentence.",
        "Wir brauchen einen Stift.",
        "Wir brauchen eine Stift.",
      ),
      text(
        "negation",
        "Negative purchase",
        "Deny the indefinite phone purchase. Keep subject and action; write the full sentence.",
        "Sami kauft kein Telefon.",
        "Sami kauft ein Telefon.",
      ),
      text(
        "reference",
        "Object reference",
        "Reply with the complete second sentence, replacing the bag with its object pronoun.",
        "Ich sehe sie.",
        "Ada hat die Tasche. Ich sehe die Tasche.",
      ),
      text(
        "possession",
        "Possessed object",
        "Complete the reply with two words for ‘your pen’, addressing a friend as du: Ich sehe ___.",
        "deinen Stift",
      ),
      text(
        "availability",
        "Stock availability",
        "Write ‘There is no book’ using Es gibt and the indefinite negative object.",
        "Es gibt kein Buch.",
      ),
      text(
        "price",
        "Price extraction",
        "Copy only the bag's price using digits and Euro.",
        "8 Euro",
        "Stift: 2 Euro. Tasche: 8 Euro. Telefon: 12 Euro.",
      ),
      text(
        "preference",
        "Buying preference",
        "Revise the statement to say Ada enjoys buying books. Insert gern; preserve the person and action.",
        "Ada kauft gern Bücher.",
        "Ada kauft Bücher.",
      ),
      text(
        "revision",
        "Practical message revision",
        "Correct the indefinite negative object and restore oder between the two purchase alternatives. Write both sentences.",
        "Ich brauche keine Tasche. Ich kaufe ein Buch oder einen Stift.",
        "Ich brauche kein Tasche. Ich kaufe ein Buch und einen Stift.",
      ),
    ],
  },
};
