/**
 * A1/A2 German reading-comprehension passages — GENERATED CONTENT, not
 * original to this project. See LESEN-ATTRIBUTION.md in this directory for
 * the full license text and the required attribution line.
 *
 * Source:  diprajkadlag/german-exam-trainer
 *          https://github.com/diprajkadlag/german-exam-trainer
 * Files:   content/exams/{a1,a2}-pruefung-0{1..5}/exam.json, `lesen` section
 * License: CC BY 4.0 (content only — see LICENSE-CONTENT in that repo)
 *
 * What's included (deliberately NOT every `lesen` item in the source):
 * - A1 Teil 1 "kurzmitteilungen" (2 short messages/notes per paper) and
 *   Teil 3 "hinweisschilder" (5 signs per paper) — each text's own
 *   richtig/falsch items, mapped to a 2-option quiz.
 * - A2 Teil 1-3 "multiple_choice" (1 passage per paper per teil) — each
 *   passage's own a/b/c multiple-choice items, used as-is.
 * Left out: A1 Teil 2 "wo_finde_ich" and A2 Teil 4 "zuordnung_anzeigen" —
 * both are short-ad/link MATCHING exercises with no single reading passage
 * per question, a different shape than this file's one-passage-many-
 * questions model (see the task's own research report for this count
 * breakdown).
 *
 * 50 passages (35 A1, 15 A2), 125 questions total. Every question, option
 * and explanation is the source's own content, used verbatim — only the
 * nesting/grouping was reshaped (see the extraction note in
 * LESEN-ATTRIBUTION.md for exactly what changed).
 */
import type { LesenPassage } from "./lesen-types";

export const LESEN_PASSAGES: LesenPassage[] = [
  {
    id: "a1-01-text_1_1",
    level: "A1",
    title: "Nachricht an die Nachbarin",
    source: "Zettel im Hausflur",
    text: `Liebe Frau Osterloh,

ich bin ab Montag für eine Woche bei meiner Schwester in Hamburg. Können Sie bitte meine Blumen gießen? Der Schlüssel liegt wie immer bei Frau Pelz im ersten Stock.

Die Post nehme ich nicht mit. Legen Sie sie einfach auf den Tisch in der Küche.

Vielen Dank und bis Sonntag!
Ihre Nadja Sedlmeier`,
    questions: [
      {
        prompt: "Frau Osterloh soll die Blumen gießen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The question is asked directly, in one short sentence.",
      },
      {
        prompt: "Der Schlüssel ist bei Frau Sedlmeier.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Three names appear in this note; only one of them has the key.",
      },
      {
        prompt: "Die Post soll in die Küche.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "You have to carry „die Post“ over from the previous sentence.",
      },
    ],
  },
  {
    id: "a1-01-text_1_2",
    level: "A1",
    title: "Nachricht von Jonas",
    source: "Kurznachricht",
    text: `Hallo Tobias,

wir treffen uns am Samstag um vier vor dem Kino, nicht um drei. Der Film fängt erst um halb fünf an.

Bring bitte das Buch mit, das du dir letzte Woche geliehen hast. Und kannst du Melike anrufen? Ich habe ihre Nummer nicht.

Bis Samstag!
Jonas`,
    questions: [
      {
        prompt: "Jonas und Tobias treffen sich um drei Uhr.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„nicht um drei“ is there because three was the old plan.",
      },
      {
        prompt: "Tobias soll Melike anrufen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "A question with „kannst du“ is a request, not a query.",
      },
    ],
  },
  {
    id: "a1-01-schild_1",
    level: "A1",
    title: "An der Tür der Bäckerei",
    source: "Aushang",
    text: `Wegen Urlaub vom 3. bis 17. August geschlossen.
Ab dem 18. August sind wir wieder für Sie da.`,
    questions: [
      {
        prompt: "Am 20. August hat die Bäckerei geöffnet.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Two dates and one word — „ab“ — decide this.",
      },
    ],
  },
  {
    id: "a1-01-schild_2",
    level: "A1",
    title: "Im Bus",
    source: "Aushang",
    text: `Bitte hinten einsteigen.
Fahrkarten kaufen Sie beim Fahrer vorne.`,
    questions: [
      {
        prompt: "Sie können die Fahrkarte hinten im Bus kaufen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Both directions appear on the sign, each with its own purpose.",
      },
    ],
  },
  {
    id: "a1-01-schild_3",
    level: "A1",
    title: "Am Eingang des Schwimmbads",
    source: "Aushang",
    text: `Hunde müssen draußen bleiben.
Essen und Trinken nur im Café.`,
    questions: [
      {
        prompt: "Sie dürfen Ihren Hund mit ins Schwimmbad nehmen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The first line answers it; the second is about something else.",
      },
    ],
  },
  {
    id: "a1-01-schild_4",
    level: "A1",
    title: "Im Treppenhaus",
    source: "Aushang",
    text: `Der Aufzug wird am Mittwoch repariert.
Bitte benutzen Sie an diesem Tag die Treppe.`,
    questions: [
      {
        prompt: "Am Mittwoch fährt der Aufzug nicht.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Being repaired and being usable are not the same thing — the second line confirms which.",
      },
    ],
  },
  {
    id: "a1-01-schild_5",
    level: "A1",
    title: "In der Bibliothek",
    source: "Aushang",
    text: `Handys bitte ausschalten.
Gespräche führen Sie bitte im Foyer.`,
    questions: [
      {
        prompt: "In der Bibliothek dürfen Sie telefonieren.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The second line offers the place where you may — which is what makes the first line a rule.",
      },
    ],
  },
  {
    id: "a1-02-text_1_1",
    level: "A1",
    title: "Nachricht von Selin",
    source: "Kurznachricht",
    text: `Hallo Amira,

der Deutschkurs fängt nächste Woche an, am Montag um neun. Wir sind im Raum 14, nicht mehr im Raum 8.

Bring bitte ein Heft und einen Stift mit. Das Buch bekommst du am ersten Tag von der Lehrerin.

Bis Montag!
Selin`,
    questions: [
      {
        prompt: "Der Kurs ist im Raum 8.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Both rooms are named; „nicht mehr“ marks the old one.",
      },
      {
        prompt: "Amira soll ein Heft mitbringen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The book is the one thing she does not have to bring.",
      },
      {
        prompt: "Amira muss das Buch selbst kaufen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„bekommen“ and „kaufen“ point in opposite directions.",
      },
    ],
  },
  {
    id: "a1-02-text_1_2",
    level: "A1",
    title: "Antwort der Tanzschule",
    source: "E-Mail",
    text: `Lieber Herr Pflüger,

vielen Dank für Ihre Nachricht. Der Tanzkurs am Donnerstag ist leider schon voll. Am Dienstag um 19 Uhr ist aber noch ein Platz frei.

Bitte bis Freitag Bescheid sagen. Danach gebe ich den Platz weiter.

Mit freundlichen Grüßen
Tanzschule Weidenbach`,
    questions: [
      {
        prompt: "Am Donnerstag ist noch ein Platz frei.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two days, two different answers — read which is which.",
      },
      {
        prompt: "Herr Pflüger soll bis Freitag antworten.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "A deadline is usually followed by its consequence.",
      },
    ],
  },
  {
    id: "a1-02-schild_1",
    level: "A1",
    title: "Am Eingang der Schule",
    source: "Aushang",
    text: `Eltern warten bitte draußen.
Der Unterricht endet um 13 Uhr.`,
    questions: [
      {
        prompt: "Der Unterricht ist um 13 Uhr zu Ende.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Different words, same fact — that is what the item tests.",
      },
    ],
  },
  {
    id: "a1-02-schild_2",
    level: "A1",
    title: "Im Zug",
    source: "Aushang",
    text: `Dieser Wagen ist ein Ruhebereich.
Bitte nicht telefonieren.`,
    questions: [
      {
        prompt: "In diesem Wagen darf man telefonieren.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The first line explains why the second line exists.",
      },
    ],
  },
  {
    id: "a1-02-schild_3",
    level: "A1",
    title: "Am Fahrkartenautomaten",
    source: "Aushang",
    text: `Der Automat nimmt nur Münzen.
Scheine wechseln Sie im Kiosk nebenan.`,
    questions: [
      {
        prompt: "Sie können mit einem Zehneuroschein bezahlen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The second line offers a way round it, which confirms the rule.",
      },
    ],
  },
  {
    id: "a1-02-schild_4",
    level: "A1",
    title: "Im Park",
    source: "Aushang",
    text: `Radfahren ist auf den Wegen erlaubt.
Auf der Wiese bitte schieben.`,
    questions: [
      {
        prompt: "Auf der Wiese darf man nicht Rad fahren.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Paths and grass get different rules, one line each.",
      },
    ],
  },
  {
    id: "a1-02-schild_5",
    level: "A1",
    title: "An der Turnhalle",
    source: "Aushang",
    text: `Bitte Hallenschuhe anziehen.
Straßenschuhe bleiben im Flur.`,
    questions: [
      {
        prompt: "Sie dürfen mit Straßenschuhen in die Halle.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two kinds of shoe, two places — match them the right way round.",
      },
    ],
  },
  {
    id: "a1-03-text_1_1",
    level: "A1",
    title: "Nachricht an den Chef",
    source: "E-Mail",
    text: `Lieber Herr Delfs,

ich kann am Montag nicht arbeiten. Mein Sohn ist krank und muss zu Hause bleiben.

Frau Kortlang kommt für mich. Sie hat schon Ja gesagt. Am Dienstag bin ich wieder da.

Viele Grüße
Amira Ivanovic`,
    questions: [
      {
        prompt: "Frau Ivanovic ist selbst krank.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two people in one sentence — only one of them is ill.",
      },
      {
        prompt: "Frau Kortlang arbeitet am Montag für sie.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„für mich“ is what makes it a substitution.",
      },
      {
        prompt: "Am Dienstag kommt Frau Ivanovic wieder.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "One day is missed, the next is not.",
      },
    ],
  },
  {
    id: "a1-03-text_1_2",
    level: "A1",
    title: "Einladung zum Sommerfest",
    source: "Zettel im Hausflur",
    text: `Hallo zusammen,

unser Sommerfest ist am 12. Juli im Garten hinter dem Haus. Wir fangen um 15 Uhr an.

Bitte bringt etwas zu essen mit. Getränke und Kuchen haben wir schon. Wer einen Grill hat, soll bitte kurz Bescheid sagen.

Bis dann!
Familie Rhode`,
    questions: [
      {
        prompt: "Das Sommerfest beginnt um 15 Uhr.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The date is in the sentence before; the time in this one.",
      },
      {
        prompt: "Die Gäste sollen Getränke mitbringen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The sentence lists exactly what is already covered.",
      },
    ],
  },
  {
    id: "a1-03-schild_1",
    level: "A1",
    title: "In der Kantine",
    source: "Aushang",
    text: `Warmes Essen von 11.30 bis 14 Uhr.
Salate den ganzen Tag.`,
    questions: [
      {
        prompt: "Um 16 Uhr gibt es hier noch Salat.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Two lines, two different rules — read the right one.",
      },
    ],
  },
  {
    id: "a1-03-schild_2",
    level: "A1",
    title: "Am Kopierer",
    source: "Aushang",
    text: `Der Kopierer ist kaputt.
Bitte den Kopierer im zweiten Stock benutzen.`,
    questions: [
      {
        prompt: "Sie können hier kopieren.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Where you can copy is not where you are standing.",
      },
    ],
  },
  {
    id: "a1-03-schild_3",
    level: "A1",
    title: "Im Supermarkt",
    source: "Aushang",
    text: `Heute Pfirsiche im Angebot.
Nur solange der Vorrat reicht.`,
    questions: [
      {
        prompt: "Die Pfirsiche gibt es die ganze Woche billiger.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two limits on one offer, and the statement ignores both.",
      },
    ],
  },
  {
    id: "a1-03-schild_4",
    level: "A1",
    title: "An der Bushaltestelle",
    source: "Aushang",
    text: `Wegen Bauarbeiten hält der Bus hier nicht.
Die nächste Haltestelle ist 200 Meter weiter.`,
    questions: [
      {
        prompt: "Der Bus fährt heute an dieser Haltestelle vorbei.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The second line tells you where to go instead.",
      },
    ],
  },
  {
    id: "a1-03-schild_5",
    level: "A1",
    title: "Am Büro",
    source: "Aushang",
    text: `Heute nur bis 15 Uhr besetzt.
Danach bitte eine E-Mail schreiben.`,
    questions: [
      {
        prompt: "Um 16 Uhr ist jemand im Büro.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„nur bis“ sets the end, and 16 is after it.",
      },
    ],
  },
  {
    id: "a1-04-text_1_1",
    level: "A1",
    title: "Nachricht an die Großmutter",
    source: "Kurznachricht",
    text: `Liebe Oma,

wir kommen am Freitag, nicht am Samstag. Der Zug ist um 14 Uhr in Kirchdorf.

Du musst uns nicht abholen, wir nehmen den Bus. Aber koch bitte nicht so viel — wir essen im Zug schon etwas.

Bis Freitag!
Deine Lena`,
    questions: [
      {
        prompt: "Lena kommt am Samstag.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The correction is the point of the sentence.",
      },
      {
        prompt: "Die Großmutter soll Lena abholen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The second half says what they will do instead.",
      },
      {
        prompt: "Lena und ihre Familie haben im Zug schon gegessen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The request and the reason sit in one sentence.",
      },
    ],
  },
  {
    id: "a1-04-text_1_2",
    level: "A1",
    title: "Antwort vom Hotel",
    source: "E-Mail",
    text: `Guten Tag, Frau Pelz,

Ihr Zimmer ist von Montag bis Mittwoch reserviert, mit Frühstück. Das Frühstück gibt es von 7 bis 10 Uhr.

Wir haben leider keinen Parkplatz mehr frei. Vor dem Haus dürfen Sie aber kostenlos parken.

Freundliche Grüße
Hotel Sonne`,
    questions: [
      {
        prompt: "Das Frühstück ist im Preis dabei.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Two words at the end of the sentence carry it.",
      },
      {
        prompt: "Frau Pelz bekommt einen Parkplatz im Hotel.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The next sentence offers an alternative, which confirms the refusal.",
      },
    ],
  },
  {
    id: "a1-04-schild_1",
    level: "A1",
    title: "Am Strand",
    source: "Aushang",
    text: `Baden nur bei grüner Fahne.
Bei roter Fahne ist Baden verboten.`,
    questions: [
      {
        prompt: "Bei roter Fahne darf man ins Wasser.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two colours, two opposite rules.",
      },
    ],
  },
  {
    id: "a1-04-schild_2",
    level: "A1",
    title: "In der Praxis",
    source: "Aushang",
    text: `Bitte Handy ausschalten.
Kinder bleiben bei den Eltern.`,
    questions: [
      {
        prompt: "Kinder dürfen allein im Wartezimmer bleiben.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The sign says where they stay, which answers whether they may be alone.",
      },
    ],
  },
  {
    id: "a1-04-schild_3",
    level: "A1",
    title: "Am Hoteleingang",
    source: "Aushang",
    text: `Zimmer frei.
Anmeldung an der Rezeption, täglich ab 14 Uhr.`,
    questions: [
      {
        prompt: "Um 12 Uhr können Sie im Hotel einchecken.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„ab“ sets a start, and 12 is before it.",
      },
    ],
  },
  {
    id: "a1-04-schild_4",
    level: "A1",
    title: "Im Zug",
    source: "Aushang",
    text: `Fahrräder nur im ersten Wagen.
Im Sommer bitte vorher reservieren.`,
    questions: [
      {
        prompt: "Im Sommer soll man für das Fahrrad einen Platz reservieren.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The season is part of the rule, not decoration.",
      },
    ],
  },
  {
    id: "a1-04-schild_5",
    level: "A1",
    title: "In der Apotheke",
    source: "Aushang",
    text: `Heute Notdienst bis 22 Uhr.
Bitte an der Nachtklingel läuten.`,
    questions: [
      {
        prompt: "Um 23 Uhr bekommen Sie hier noch ein Medikament.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The bell is how you get in until 22, not after it.",
      },
    ],
  },
  {
    id: "a1-05-text_1_1",
    level: "A1",
    title: "Nachricht von Marek",
    source: "Kurznachricht",
    text: `Hallo Ravi,

unser Fußballtraining ist ab nächster Woche dienstags, nicht mehr donnerstags. Wir fangen um 18 Uhr an.

Der Platz hinter der Schule ist gesperrt. Wir spielen jetzt auf dem Platz am Fluss. Bring bitte Wasser mit, dort gibt es nichts zu kaufen.

Bis Dienstag!
Marek`,
    questions: [
      {
        prompt: "Das Training ist ab nächster Woche am Donnerstag.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„nicht mehr“ marks what is being left behind.",
      },
      {
        prompt: "Der Platz hinter der Schule kann nicht benutzt werden.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The next sentence says where they play instead.",
      },
      {
        prompt: "Am neuen Platz kann man Getränke kaufen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The request and its reason are one sentence.",
      },
    ],
  },
  {
    id: "a1-05-text_1_2",
    level: "A1",
    title: "Nachricht vom Computerservice",
    source: "E-Mail",
    text: `Guten Tag, Frau Sanftleben,

Ihr Computer ist fertig. Die Festplatte war kaputt, wir haben eine neue eingebaut. Ihre Fotos konnten wir retten.

Die Reparatur kostet 180 Euro. Sie können bar oder mit Karte zahlen. Wir haben bis Samstag 13 Uhr geöffnet.

Freundliche Grüße
Computerservice Delfs`,
    questions: [
      {
        prompt: "Die Fotos von Frau Sanftleben sind weg.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The broken disk makes the loss plausible, which is why the sentence is there.",
      },
      {
        prompt: "Man kann die Reparatur mit Karte bezahlen.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„oder“ offers both, not one instead of the other.",
      },
    ],
  },
  {
    id: "a1-05-schild_1",
    level: "A1",
    title: "In der Turnhalle",
    source: "Aushang",
    text: `Die Halle ist am Wochenende geschlossen.
Schlüssel beim Hausmeister.`,
    questions: [
      {
        prompt: "Den Schlüssel bekommt man beim Hausmeister.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Two lines, and the second answers this.",
      },
    ],
  },
  {
    id: "a1-05-schild_2",
    level: "A1",
    title: "Am Automaten",
    source: "Aushang",
    text: `Kein Wechselgeld.
Bitte passend zahlen.`,
    questions: [
      {
        prompt: "Der Automat gibt Geld zurück.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The second line is the consequence of the first.",
      },
    ],
  },
  {
    id: "a1-05-schild_3",
    level: "A1",
    title: "Im Waschsalon",
    source: "Aushang",
    text: `Waschen 4 Euro, Trocknen 2 Euro.
Waschmittel bekommen Sie am Automaten.`,
    questions: [
      {
        prompt: "Waschen und Trocknen kosten zusammen 6 Euro.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The two prices have to be added.",
      },
    ],
  },
  {
    id: "a1-05-schild_4",
    level: "A1",
    title: "Im Hausflur",
    source: "Aushang",
    text: `Fahrräder bitte nicht im Flur abstellen.
Der Keller ist offen.`,
    questions: [
      {
        prompt: "Fahrräder dürfen in den Keller.",
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "One place is ruled out and the other offered.",
      },
    ],
  },
  {
    id: "a1-05-schild_5",
    level: "A1",
    title: "Am Briefkasten",
    source: "Aushang",
    text: `Leerung montags bis freitags um 17 Uhr.
Am Samstag um 11 Uhr.`,
    questions: [
      {
        prompt: "Am Samstag wird der Briefkasten um 17 Uhr geleert.",
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two times, and Saturday has its own.",
      },
    ],
  },
  {
    id: "a2-01-text_1",
    level: "A2",
    title: "Werkzeug für alle auf dem Marktplatz",
    source: "Weidenbacher Wochenblatt",
    text: `Seit Mai steht auf dem Marktplatz in Weidenbach eine kleine Station für Fahrräder. Sie sieht aus wie ein schmaler Schrank aus Holz. Innen hängen Werkzeuge an einer Wand, und außen gibt es eine Luftpumpe.

Die Idee hatte Frau Osterloh vom Stadtteilbüro. „Viele Leute haben zu Hause keine Werkzeuge“, sagt sie. „Und für eine kleine Reparatur will niemand in die Werkstatt fahren.“ Die Station ist kostenlos. Man muss nichts anmelden und nichts bezahlen.

Benutzen darf sie jeder, Tag und Nacht. Nur am Sonntag ist der Schrank geschlossen, weil der Markt dann leer ist und niemand aufpasst. Wer Hilfe braucht, kommt am besten mittwochs: Dann ist von 16 bis 18 Uhr ein Mechaniker da und zeigt, wie man einen Reifen wechselt.

Am Anfang hatte die Stadt Angst, dass Werkzeuge verschwinden. Bis jetzt fehlt aber nur eine einzige Zange. „Damit haben wir nicht gerechnet“, sagt Frau Osterloh und lacht. Im nächsten Jahr soll eine zweite Station am Bahnhof stehen.`,
    questions: [
      {
        prompt: "Was steht seit Mai auf dem Marktplatz?",
        options: ["Ein Geschäft für Fahrräder.", "Ein Schrank mit Werkzeug für Fahrräder.", "Eine Werkstatt mit einem Mechaniker."],
        correctIndex: 1,
        explanation: "A mechanic is there, but only two hours a week — that makes c a detail, not what the station is.",
      },
      {
        prompt: "Was kostet die Benutzung?",
        options: ["Nichts.", "Einen Euro pro Reparatur.", "Nur der Mechaniker kostet Geld."],
        correctIndex: 0,
        explanation: "No price appears anywhere in the article, which is itself the answer.",
      },
      {
        prompt: "Wann kann man die Station nicht benutzen?",
        options: ["Nachts.", "Am Mittwoch.", "Am Sonntag."],
        correctIndex: 2,
        explanation: "Wednesday is the one day with extra help, so b is the opposite of the truth.",
      },
      {
        prompt: "Was passiert mittwochs zwischen 16 und 18 Uhr?",
        options: ["Die Stadt kontrolliert das Werkzeug.", "Jemand hilft und erklärt etwas.", "Man kann ein Fahrrad leihen."],
        correctIndex: 1,
        explanation: "Nothing in the article is ever lent out, only used on the spot.",
      },
      {
        prompt: "Wie ist die Erfahrung mit dem Werkzeug bisher?",
        options: ["Es wurde viel gestohlen.", "Es fehlt fast nichts.", "Es ist schnell kaputtgegangen."],
        correctIndex: 1,
        explanation: "The word „aber“ is doing the work: it turns the expectation in the previous sentence around.",
      },
    ],
  },
  {
    id: "a2-01-text_2",
    level: "A2",
    title: "Stadtbibliothek Weidenbach",
    source: "Aushang im Eingang",
    text: `Stadtbibliothek Weidenbach — Wegweiser

Erdgeschoss: Anmeldung, Zeitungen und Zeitschriften, Rückgabe
1. Stock: Romane, Krimis, Hörbücher
2. Stock: Kinderbücher, Spiele, Leseecke
3. Stock: Sprachkurse, Wörterbücher, Computerplätze

Öffnungszeiten
Montag bis Freitag 10–19 Uhr, Samstag 10–14 Uhr, Sonntag geschlossen

Gut zu wissen
Der Leseausweis ist für Kinder und Jugendliche kostenlos; Erwachsene zahlen 12 Euro im Jahr. Bücher können Sie vier Wochen behalten, Hörbücher zwei Wochen. Eine Verlängerung ist möglich, aber nur telefonisch oder im Internet, nicht per E-Mail. Getränke sind im ganzen Haus erlaubt, Essen nur in der Leseecke im 2. Stock. Der Aufzug ist bis auf Weiteres kaputt.`,
    questions: [
      {
        prompt: "Sie möchten einen Krimi ausleihen. Wohin gehen Sie?",
        options: ["In den 1. Stock.", "In den 2. Stock.", "In den 3. Stock."],
        correctIndex: 0,
        explanation: "The second floor is for children, the third for language courses.",
      },
      {
        prompt: "Sie kommen am Samstag um 15 Uhr. Was ist dann?",
        options: ["Die Bibliothek ist offen.", "Die Bibliothek hat schon zu.", "Nur die Rückgabe ist offen."],
        correctIndex: 1,
        explanation: "The long weekday hours are the trap — Saturday has its own, much shorter line.",
      },
      {
        prompt: "Was zahlt eine 15-jährige Schülerin für den Leseausweis?",
        options: ["12 Euro im Jahr.", "6 Euro im Jahr.", "Nichts."],
        correctIndex: 2,
        explanation: "12 euros is in the text, but it belongs to the other half of the sentence.",
      },
      {
        prompt: "Wie kann man die Leihzeit verlängern?",
        options: ["Per E-Mail.", "Am Telefon oder im Internet.", "Gar nicht."],
        correctIndex: 1,
        explanation: "„nicht per E-Mail“ is stated so directly because it is what most people would try first.",
      },
      {
        prompt: "Wo dürfen Sie Ihr Brot essen?",
        options: ["Überall im Haus.", "In der Leseecke im 2. Stock.", "Nirgends."],
        correctIndex: 1,
        explanation: "a is true — but of drinks, not of food.",
      },
    ],
  },
  {
    id: "a2-01-text_3",
    level: "A2",
    title: "E-Mail von Marek",
    source: "private E-Mail",
    text: `Liebe Nadja,

endlich habe ich Zeit zum Schreiben. Wir sind seit zwei Wochen in der neuen Wohnung, und langsam finde ich meine Sachen wieder.

Die Wohnung ist kleiner als die alte, aber sie hat einen Balkon nach Süden. Morgens sitze ich dort mit meinem Kaffee, und das ist jeden Umzug wert. Leider liegt sie im vierten Stock ohne Aufzug. Beim Einzug haben wir das sehr deutlich gemerkt.

Die Nachbarn sind bis jetzt nett. Frau Pelz von unten hat am ersten Abend geklingelt und uns eine Suppe gebracht. Der Herr aus dem dritten Stock hört abends laut Musik, aber er hat sofort leiser gemacht, als ich ihn gefragt habe.

Kommst du im Juni? Das Zimmer für Gäste ist noch nicht fertig, aber das Sofa ist bequem. Du musst mir nur bis Ende Mai Bescheid sagen, dann nehme ich mir frei.

Viele Grüße
Marek`,
    questions: [
      {
        prompt: "Wie lange wohnt Marek schon in der neuen Wohnung?",
        options: ["Seit zwei Tagen.", "Seit zwei Wochen.", "Seit zwei Monaten."],
        correctIndex: 1,
        explanation: "„langsam finde ich meine Sachen wieder“ fits weeks, not days and not months.",
      },
      {
        prompt: "Was gefällt Marek an der Wohnung am besten?",
        options: ["Sie ist größer als die alte.", "Sie liegt im Erdgeschoss.", "Sie hat einen Balkon."],
        correctIndex: 2,
        explanation: "a is the opposite: the flat is smaller. b contradicts the fourth floor.",
      },
      {
        prompt: "Was ist an der Wohnung unpraktisch?",
        options: ["Es gibt keinen Aufzug.", "Es gibt keinen Balkon.", "Es gibt keine Küche."],
        correctIndex: 0,
        explanation: "The next sentence — noticing it during the move — is what makes the point concrete.",
      },
      {
        prompt: "Was schreibt Marek über den Nachbarn aus dem dritten Stock?",
        options: ["Er hat sich über Marek beschwert.", "Er war nach einer Bitte leiser.", "Er hat eine Suppe gebracht."],
        correctIndex: 1,
        explanation: "Both neighbours appear in the same paragraph, which is what makes c tempting.",
      },
      {
        prompt: "Was soll Nadja tun?",
        options: ["Ein Gästezimmer bezahlen.", "Im Mai kommen.", "Bis Ende Mai antworten."],
        correctIndex: 2,
        explanation: "May and June both appear, and swapping them is the whole point of b.",
      },
    ],
  },
  {
    id: "a2-02-text_1",
    level: "A2",
    title: "Eine Küche auf vier Rädern",
    source: "Kirchdorfer Anzeiger",
    text: `Zweimal in der Woche stellt Herr Sallberg seinen Wagen auf den Parkplatz vor der Turnhalle in Kirchdorf. Es ist kein normaler Wagen, sondern ein alter Bus, und innen ist eine Küche.

Herr Sallberg kocht Suppe. Immer nur eine Sorte, immer frisch, immer für drei Euro. „Mehr Auswahl brauche ich nicht“, sagt er. „Die Leute kommen nicht wegen der Karte, sie kommen, weil es warm ist und schnell geht.“

Angefangen hat er vor vier Jahren, nach einer Krankheit. Vorher hat er in einem Büro gearbeitet, zwanzig Jahre lang. „Ich wollte etwas machen, wo ich am Abend sehe, was ich getan habe.“ Am Anfang kamen fünf Leute, heute sind es an manchen Tagen achtzig.

Reich wird er damit nicht. Der Bus ist alt, und im Winter geht die Heizung oft kaputt. Trotzdem will er nicht aufhören. Nur einen Wunsch hat er: einen zweiten Menschen im Bus. „Allein schneiden, kochen und kassieren — das schaffe ich noch fünf Jahre, aber nicht zehn.“`,
    questions: [
      {
        prompt: "Was verkauft Herr Sallberg?",
        options: ["Jeden Tag eine andere Suppe.", "Immer nur eine Sorte Suppe.", "Suppe und belegte Brote."],
        correctIndex: 1,
        explanation: "The three „immer“s are the point — nothing about the offer changes.",
      },
      {
        prompt: "Warum kommen die Leute, sagt Herr Sallberg?",
        options: ["Weil das Essen warm ist und schnell geht.", "Weil die Karte so groß ist.", "Weil es nichts kostet."],
        correctIndex: 0,
        explanation: "The soup costs three euros, so c contradicts an earlier sentence.",
      },
      {
        prompt: "Was hat Herr Sallberg vorher gemacht?",
        options: ["Er war Koch in einem Restaurant.", "Er hat im Büro gearbeitet.", "Er war Busfahrer."],
        correctIndex: 1,
        explanation: "The bus and the cooking are what he does now; c takes the vehicle for the job.",
      },
      {
        prompt: "Wie viele Leute kommen heute an guten Tagen?",
        options: ["Fünf.", "Vierzig.", "Achtzig."],
        correctIndex: 2,
        explanation: "Both numbers sit in one sentence, separated by „am Anfang“ and „heute“.",
      },
      {
        prompt: "Was wünscht sich Herr Sallberg?",
        options: ["Einen neuen Bus.", "Jemanden, der mitarbeitet.", "Höhere Preise."],
        correctIndex: 1,
        explanation: "The old bus is a problem he names but does not wish away — „Nur einen Wunsch“ allows only one answer.",
      },
    ],
  },
  {
    id: "a2-02-text_2",
    level: "A2",
    title: "Hallenbad Weidenbach",
    source: "Aushang an der Kasse",
    text: `Hallenbad Weidenbach — Preise und Zeiten

Öffnungszeiten
Dienstag bis Freitag 6.30–21 Uhr, Samstag und Sonntag 9–18 Uhr
Montag geschlossen (Reinigung)

Preise
Erwachsene 5,50 € · Kinder bis 14 Jahre 3,00 € · Kinder unter 4 Jahren frei
Zehnerkarte Erwachsene 45,00 € · Abendkarte ab 19 Uhr 3,50 €

Bitte beachten Sie
Dienstags von 6.30 bis 8 Uhr ist das große Becken für den Schwimmverein reserviert. Das kleine Becken ist offen. Eine Badekappe ist nicht nötig. Föhn und Schließfach kosten nichts, Sie brauchen aber ein Zweieurostück als Pfand. Der Sprungturm ist nur am Wochenende geöffnet.`,
    questions: [
      {
        prompt: "Sie wollen am Montag schwimmen. Was ist dann?",
        options: ["Das Bad ist geschlossen.", "Nur das kleine Becken ist offen.", "Es kostet weniger."],
        correctIndex: 0,
        explanation: "b belongs to Tuesday morning — a different line entirely.",
      },
      {
        prompt: "Was zahlt ein zwölfjähriges Kind?",
        options: ["5,50 €", "3,00 €", "nichts"],
        correctIndex: 1,
        explanation: "Three prices, three age bands — read the band, not the first number you see.",
      },
      {
        prompt: "Sie kommen am Dienstag um 7 Uhr. Was können Sie tun?",
        options: ["Im großen Becken schwimmen.", "Im kleinen Becken schwimmen.", "Vom Sprungturm springen."],
        correctIndex: 1,
        explanation: "The diving tower has its own line, and it says weekend.",
      },
      {
        prompt: "Was brauchen Sie für das Schließfach?",
        options: ["Zwei Euro als Pfand.", "Zwei Euro, die Sie bezahlen.", "Eine Badekappe."],
        correctIndex: 0,
        explanation: "The difference between a deposit and a fee is exactly what this item tests.",
      },
      {
        prompt: "Wann ist die Abendkarte günstiger?",
        options: ["Ab 18 Uhr.", "Ab 19 Uhr.", "Ab 20 Uhr."],
        correctIndex: 1,
        explanation: "18 Uhr is the weekend closing time — a different number on a different line.",
      },
    ],
  },
  {
    id: "a2-02-text_3",
    level: "A2",
    title: "E-Mail von Selin",
    source: "private E-Mail",
    text: `Hallo Yusuf,

danke für deine Nachricht! Ja, wir fahren wirklich mit dem Zug nach Hamburg, nicht mit dem Auto. Sieben Stunden klingt lang, aber im Zug kann ich lesen, und Ayla schläft sowieso die halbe Strecke.

Die Fahrkarten habe ich schon im Januar gekauft, deshalb waren sie günstig. Wir müssen einmal umsteigen, in Hannover, und haben dort nur zwölf Minuten. Das macht mir ehrlich gesagt etwas Sorgen.

In Hamburg wohnen wir bei meiner Schwester. Sie hat leider nur ein Gästebett, also schläft Ayla auf einer Matratze auf dem Boden. Sie findet das großartig, ich weniger.

Willst du eigentlich mitkommen? Es ist noch Platz, und meine Schwester hat nichts dagegen. Du musst mir nur bis Freitag Bescheid sagen, dann kaufe ich die Karte noch zum alten Preis.

Liebe Grüße
Selin`,
    questions: [
      {
        prompt: "Wie fährt Selin nach Hamburg?",
        options: ["Mit dem Auto.", "Mit dem Zug.", "Mit dem Bus."],
        correctIndex: 1,
        explanation: "„nicht mit dem Auto“ is there because Yusuf apparently assumed otherwise.",
      },
      {
        prompt: "Warum waren die Fahrkarten günstig?",
        options: ["Weil Kinder nichts zahlen.", "Weil sie früh gekauft wurden.", "Weil sie umsteigen müssen."],
        correctIndex: 1,
        explanation: "Changing trains appears in the next sentence and has nothing to do with the price.",
      },
      {
        prompt: "Was macht Selin Sorgen?",
        options: ["Die kurze Zeit zum Umsteigen.", "Die lange Fahrt.", "Der Preis der Karten."],
        correctIndex: 0,
        explanation: "The seven-hour journey is described as fine — she can read, and Ayla sleeps.",
      },
      {
        prompt: "Wo schläft Ayla in Hamburg?",
        options: ["Im Gästebett.", "Auf einer Matratze auf dem Boden.", "Im Hotel."],
        correctIndex: 1,
        explanation: "„also“ marks the consequence — everything before it is the reason.",
      },
      {
        prompt: "Was soll Yusuf tun?",
        options: ["Eine Fahrkarte kaufen.", "Selins Schwester fragen.", "Bis Freitag antworten."],
        correctIndex: 2,
        explanation: "The sister has already agreed, which is why b is not his job either.",
      },
    ],
  },
  {
    id: "a2-03-text_1",
    level: "A2",
    title: "Ein Geschäft, in dem niemand zahlt",
    source: "Sallberger Rundschau",
    text: `Einmal im Monat wird die Turnhalle der Grundschule in Sallberg zu einem Geschäft ohne Geld. Wer kommt, bringt Kleidung mit, die er nicht mehr trägt, und nimmt dafür etwas anderes mit nach Hause.

Angefangen haben drei Mütter, die sich am Elternabend kennengelernt haben. „Unsere Kinder wachsen so schnell“, sagt Frau Tiedemann. „Nach einem halben Jahr passt nichts mehr, und wegwerfen wollte keine von uns.“

Die Regeln sind einfach. Man bringt höchstens zehn Stücke, und sie müssen sauber und ganz sein. Wer nichts bringt, darf trotzdem etwas mitnehmen — das war den Frauen von Anfang an wichtig. Gezählt wird nicht.

Inzwischen kommen an einem Nachmittag über hundert Menschen, und nicht nur Familien. „Am Anfang dachten wir, das sei etwas für junge Eltern“, sagt Frau Tiedemann. „Heute steht hier auch ein Herr von achtzig und sucht sich ein Hemd aus.“ Was übrig bleibt, geht an ein Sozialkaufhaus in der Nachbarstadt.`,
    questions: [
      {
        prompt: "Was passiert einmal im Monat in der Turnhalle?",
        options: ["Kleidung wird verkauft.", "Kleidung wird getauscht.", "Kleidung wird repariert."],
        correctIndex: 1,
        explanation: "The headline and the first sentence say the same thing twice, in different words.",
      },
      {
        prompt: "Wer hat damit angefangen?",
        options: ["Die Schule.", "Die Stadt.", "Drei Mütter."],
        correctIndex: 2,
        explanation: "A gym in a school is not the same as the school running the event.",
      },
      {
        prompt: "Wie viele Stücke darf man mitbringen?",
        options: ["Höchstens zehn.", "So viele man will.", "Genau so viele, wie man mitnimmt."],
        correctIndex: 0,
        explanation: "„Gezählt wird nicht“ refers to what you take, not to what you bring.",
      },
      {
        prompt: "Was gilt für Menschen, die nichts mitbringen?",
        options: ["Sie müssen zahlen.", "Sie dürfen trotzdem etwas mitnehmen.", "Sie dürfen nicht hinein."],
        correctIndex: 1,
        explanation: "This is the one rule the article marks as deliberate.",
      },
      {
        prompt: "Wer kommt heute zu der Veranstaltung?",
        options: ["Nur junge Eltern.", "Nur Kinder.", "Menschen jeden Alters."],
        correctIndex: 2,
        explanation: "a is what the founders expected, and the quote exists to correct it.",
      },
    ],
  },
  {
    id: "a2-03-text_2",
    level: "A2",
    title: "Bürgeramt Weidenbach",
    source: "Aushang im Eingang",
    text: `Bürgeramt Weidenbach — Was Sie wissen müssen

Öffnungszeiten
Montag, Dienstag, Donnerstag 8–15 Uhr
Mittwoch 8–12 Uhr · Freitag 8–13 Uhr · Samstag geschlossen

Wo Sie hinmüssen
Zimmer 4: Anmeldung und Abmeldung · Zimmer 7: Ausweis und Reisepass
Zimmer 12: Führerschein · Zimmer 15: Kasse

Bitte beachten Sie
Ohne Termin warten Sie oft über eine Stunde. Termine bekommen Sie nur online. Bringen Sie immer Ihren Ausweis mit; ohne Ausweis können wir nichts bearbeiten. Gebühren zahlen Sie in Zimmer 15, und zwar nur mit Karte — Bargeld nehmen wir seit Januar nicht mehr an. Für Fragen zum Kindergeld sind wir nicht zuständig, wenden Sie sich bitte an die Familienkasse.`,
    questions: [
      {
        prompt: "Sie kommen am Mittwoch um 14 Uhr. Was ist dann?",
        options: ["Das Amt ist offen.", "Das Amt hat schon zu.", "Nur die Kasse ist offen."],
        correctIndex: 1,
        explanation: "Three of the five open days end at 15 Uhr, which is the trap.",
      },
      {
        prompt: "Sie brauchen einen neuen Reisepass. Wohin gehen Sie?",
        options: ["Zimmer 4.", "Zimmer 7.", "Zimmer 12."],
        correctIndex: 1,
        explanation: "Room 12 is for driving licences — a different document entirely.",
      },
      {
        prompt: "Wie bekommt man einen Termin?",
        options: ["Am Telefon.", "Im Internet.", "Direkt am Schalter."],
        correctIndex: 1,
        explanation: "The sentence before explains why it matters: an hour of queuing without one.",
      },
      {
        prompt: "Wie zahlt man die Gebühren?",
        options: ["Nur mit Karte.", "Nur bar.", "Bar oder mit Karte."],
        correctIndex: 0,
        explanation: "The change is recent, which is exactly why it is spelled out.",
      },
      {
        prompt: "Sie haben eine Frage zum Kindergeld. Was tun Sie?",
        options: ["Sie gehen in Zimmer 4.", "Sie fragen an der Kasse.", "Sie wenden sich an die Familienkasse."],
        correctIndex: 2,
        explanation: "„Kasse“ appears in the text as room 15 — for paying, not for child benefit.",
      },
    ],
  },
  {
    id: "a2-03-text_3",
    level: "A2",
    title: "E-Mail von Jonas",
    source: "private E-Mail",
    text: `Hallo Amira,

du wolltest wissen, wie die erste Woche im Praktikum war. Kurz gesagt: besser als gedacht.

Am Montag war ich furchtbar nervös. Ich habe drei Stunden nur zugeschaut und dachte, ich bin überflüssig. Ab Dienstag durfte ich dann selbst telefonieren, und seitdem geht es.

Die Kollegen sind in Ordnung, besonders eine Frau aus meinem Zimmer. Sie erklärt alles zweimal, ohne dass ich fragen muss. Nur mein Chef ist schwer einzuschätzen — er sagt fast nichts, weder Gutes noch Schlechtes.

Anstrengend ist der Weg. Ich fahre um Viertel nach sechs los und bin erst um halb sieben abends wieder zu Hause. Das halte ich drei Monate aus, aber keine drei Jahre.

Wollen wir am Samstag etwas trinken gehen? Ich erzähle dir den Rest dann in Ruhe. Ruf mich einfach an.

Bis bald
Jonas`,
    questions: [
      {
        prompt: "Wie war die erste Woche für Jonas?",
        options: ["Schlimmer als erwartet.", "Besser als erwartet.", "Genau wie erwartet."],
        correctIndex: 1,
        explanation: "Everything that follows qualifies this, but never reverses it.",
      },
      {
        prompt: "Was hat Jonas am Montag gemacht?",
        options: ["Er hat telefoniert.", "Er hat nur zugeschaut.", "Er war nicht da."],
        correctIndex: 1,
        explanation: "The two days are contrasted in consecutive sentences.",
      },
      {
        prompt: "Was schreibt Jonas über die Kollegin aus seinem Zimmer?",
        options: ["Sie erklärt ihm Dinge von selbst.", "Sie hat wenig Zeit für ihn.", "Sie ist seine Chefin."],
        correctIndex: 0,
        explanation: "The boss is a separate person, described in the very next sentence.",
      },
      {
        prompt: "Was sagt Jonas über seinen Chef?",
        options: ["Er kritisiert viel.", "Er lobt viel.", "Man weiß nicht, was er denkt."],
        correctIndex: 2,
        explanation: "This is the one item where both a and b are ruled out by the same phrase.",
      },
      {
        prompt: "Was findet Jonas anstrengend?",
        options: ["Die Arbeit selbst.", "Den langen Weg.", "Die Kollegen."],
        correctIndex: 1,
        explanation: "He is explicit that this, and not the work, is what he could not keep up for years.",
      },
    ],
  },
  {
    id: "a2-04-text_1",
    level: "A2",
    title: "Vierzig Katzen und ein Esel",
    source: "Weidenbacher Wochenblatt",
    text: `Im Tierheim Weidenbach leben zurzeit vierzig Katzen, achtzehn Hunde und ein Esel. Der Esel heißt Fridolin, ist seit sechs Jahren da und wird wahrscheinlich bleiben. „Für einen Esel findet man kaum jemanden“, sagt die Leiterin Frau Rhode.

Am schnellsten weg sind junge Katzen. Für sie gibt es oft schon eine Warteliste, bevor sie überhaupt im Internet stehen. Schwer ist es dagegen bei alten Tieren und bei allen, die eine Krankheit haben.

Wer ein Tier mitnehmen möchte, kann das nicht spontan tun. Zuerst kommt ein Gespräch, dann mindestens zwei Besuche, und bei Hunden schaut sich jemand die Wohnung an. „Das ärgert manche Leute“, sagt Frau Rhode. „Aber wir bekommen sonst die Hälfte der Tiere nach vier Wochen zurück.“

Geld ist immer knapp. Die Stadt zahlt einen Teil, den Rest bringen Spenden. Am meisten fehlt es aber an Menschen: Fünfzehn Freiwillige führen jeden Tag die Hunde aus, und im Winter sind es deutlich weniger.`,
    questions: [
      {
        prompt: "Warum bleibt Fridolin wahrscheinlich im Tierheim?",
        options: ["Weil er krank ist.", "Weil kaum jemand einen Esel nimmt.", "Weil er zu alt ist."],
        correctIndex: 1,
        explanation: "Age and illness are named later, but for other animals.",
      },
      {
        prompt: "Welche Tiere finden am schnellsten ein Zuhause?",
        options: ["Junge Katzen.", "Alte Hunde.", "Kranke Tiere."],
        correctIndex: 0,
        explanation: "The next sentence names the opposite group, which is where b and c come from.",
      },
      {
        prompt: "Was muss man tun, bevor man ein Tier mitnehmen darf?",
        options: ["Nur ein Formular ausfüllen.", "Mehrmals kommen.", "Eine Gebühr zahlen."],
        correctIndex: 1,
        explanation: "The sentence before says it cannot be done spontaneously — this one says why.",
      },
      {
        prompt: "Warum macht das Tierheim das so?",
        options: ["Weil die Stadt es verlangt.", "Weil sonst viele Tiere zurückkommen.", "Weil es zu wenige Tiere gibt."],
        correctIndex: 1,
        explanation: "She concedes it annoys people first, then gives the reason she does it anyway.",
      },
      {
        prompt: "Woran fehlt es dem Tierheim am meisten?",
        options: ["An Geld.", "An Platz.", "An Menschen."],
        correctIndex: 2,
        explanation: "The paragraph opens with money precisely so that „aber“ can outrank it.",
      },
    ],
  },
  {
    id: "a2-04-text_2",
    level: "A2",
    title: "Praxis Dr. Weiler",
    source: "Aushang im Wartezimmer",
    text: `Praxis Dr. Weiler — Wichtige Hinweise

Sprechzeiten
Montag, Dienstag, Donnerstag 8–12 und 15–18 Uhr
Mittwoch und Freitag nur 8–12 Uhr

Ohne Termin
Für akute Fälle halten wir täglich von 8 bis 9 Uhr Zeit frei. Rechnen Sie trotzdem mit Wartezeit.

Gut zu wissen
Rezepte für Medikamente, die Sie regelmäßig nehmen, bestellen Sie bitte telefonisch und holen sie am nächsten Werktag ab. Ein Termin ist dafür nicht nötig. Bringen Sie zu jedem Besuch Ihre Versichertenkarte mit. Befunde besprechen wir grundsätzlich nicht am Telefon, sondern nur persönlich. Bei einem Notfall am Wochenende rufen Sie bitte die 116117 an.`,
    questions: [
      {
        prompt: "Sie brauchen am Freitag um 16 Uhr einen Termin. Was ist?",
        options: ["Das geht.", "Die Praxis ist nachmittags zu.", "Nur mit Termin möglich."],
        correctIndex: 1,
        explanation: "Three days do have afternoon hours, which is what makes this worth checking.",
      },
      {
        prompt: "Wann kann man ohne Termin kommen?",
        options: ["Jeden Tag von 8 bis 9 Uhr.", "Nur mittwochs.", "Gar nicht."],
        correctIndex: 0,
        explanation: "The warning about waiting time is not a restriction on when.",
      },
      {
        prompt: "Wie bekommt man ein Rezept für ein Medikament, das man regelmäßig nimmt?",
        options: ["Man braucht einen Termin.", "Man bestellt es am Telefon.", "Man schreibt eine E-Mail."],
        correctIndex: 1,
        explanation: "The practice contradicts a directly, in its own next sentence.",
      },
      {
        prompt: "Wie erfährt man ein Untersuchungsergebnis?",
        options: ["Am Telefon.", "Per Post.", "Nur im Gespräch in der Praxis."],
        correctIndex: 2,
        explanation: "„grundsätzlich“ means there are no exceptions to ask for.",
      },
      {
        prompt: "Was tun Sie bei einem Notfall am Sonntag?",
        options: ["Sie warten bis Montag.", "Sie rufen die 116117 an.", "Sie kommen um 8 Uhr in die Praxis."],
        correctIndex: 1,
        explanation: "The 8–9 slot is on working days only; the practice is shut at weekends.",
      },
    ],
  },
  {
    id: "a2-04-text_3",
    level: "A2",
    title: "E-Mail an die Bibliothekarin",
    source: "private E-Mail",
    text: `Liebe Frau Osterloh,

vielen Dank für Ihre Nachricht und für die Bücher, die Sie mir letzte Woche empfohlen haben.

Den Roman habe ich in drei Abenden gelesen — so etwas ist mir seit Jahren nicht passiert. Das zweite Buch, das über die Nordsee, habe ich nach vierzig Seiten weggelegt. Zu viele Namen, ich kam nicht hinein.

Meine Tochter fragt inzwischen jeden Freitag, ob wir in die Bibliothek gehen. Das hätte ich vor einem Jahr nicht gedacht. Sie sucht sich alles selbst aus, und ich sage nichts dazu, auch wenn es zum dritten Mal dasselbe Buch ist.

Eine Frage noch: Gibt es bei Ihnen einen Lesekreis für Erwachsene? Ich habe einen Aushang gesehen, aber ohne Datum. Wenn ja, würde ich gern einmal vorbeikommen.

Herzliche Grüße
Birgit Sanftleben`,
    questions: [
      {
        prompt: "Wie hat Frau Sanftleben den Roman gefunden?",
        options: ["Sehr gut.", "Zu schwer.", "Zu lang."],
        correctIndex: 0,
        explanation: "She never uses the word „gut“ — the speed is the judgement.",
      },
      {
        prompt: "Was ist mit dem zweiten Buch passiert?",
        options: ["Sie hat es verschenkt.", "Sie hat es nicht zu Ende gelesen.", "Sie hat es zweimal gelesen."],
        correctIndex: 1,
        explanation: "Reading something twice is what her daughter does, one paragraph later.",
      },
      {
        prompt: "Was macht ihre Tochter jetzt jeden Freitag?",
        options: ["Sie liest zu Hause vor.", "Sie fragt nach der Bibliothek.", "Sie geht in einen Lesekreis."],
        correctIndex: 1,
        explanation: "The reading circle in the last paragraph is for adults.",
      },
      {
        prompt: "Was sagt Frau Sanftleben zur Buchauswahl ihrer Tochter?",
        options: ["Sie sucht die Bücher aus.", "Sie lässt die Tochter selbst wählen.", "Die Bibliothekarin hilft dabei."],
        correctIndex: 1,
        explanation: "The „auch wenn“ clause shows she has a view and holds it back on purpose.",
      },
      {
        prompt: "Was möchte Frau Sanftleben wissen?",
        options: ["Ob es einen Lesekreis gibt.", "Wann die Bibliothek öffnet.", "Ob sie das Buch länger behalten darf."],
        correctIndex: 0,
        explanation: "„Eine Frage noch“ tells you there is exactly one thing to look for.",
      },
    ],
  },
  {
    id: "a2-05-text_1",
    level: "A2",
    title: "Die Post neben den Heften",
    source: "Kirchdorfer Anzeiger",
    text: `Seit April gibt es in Kirchdorf wieder eine Post. Sie ist allerdings keine richtige Post mehr, sondern eine Ecke im Schreibwarenladen von Frau Baumhauer.

Zwei Jahre lang mussten die Leute für ein Paket nach Weidenbach fahren, zwölf Kilometer hin und zwölf zurück. „Für ältere Leute ohne Auto war das unmöglich“, sagt Frau Baumhauer. Sie hat sich deshalb bei der Post gemeldet, obwohl ihr Laden eigentlich zu klein ist.

Jetzt steht neben den Heften und Stiften ein Schalter. Briefmarken, Pakete, Einschreiben — alles geht. Nur Geld kann man dort nicht abheben, dafür braucht man weiterhin die Bank im Nachbarort.

Für Frau Baumhauer hat sich das gelohnt, aber anders als gedacht. Sie verdient an der Post fast nichts. „Die Leute kommen aber wegen des Pakets und kaufen dann noch eine Karte oder einen Kalender. Das rechnet sich am Ende doch.“`,
    questions: [
      {
        prompt: "Wo ist die Post in Kirchdorf jetzt?",
        options: ["In einem eigenen Gebäude.", "In einem Schreibwarenladen.", "In der Bank."],
        correctIndex: 1,
        explanation: "The bank appears later and is explicitly somewhere else.",
      },
      {
        prompt: "Was mussten die Leute vorher tun?",
        options: ["In den Nachbarort fahren.", "Auf den Briefträger warten.", "Alles online bestellen."],
        correctIndex: 0,
        explanation: "The distance is given twice — there and back — which is the point.",
      },
      {
        prompt: "Warum hat Frau Baumhauer sich gemeldet?",
        options: ["Weil sie mehr verdienen wollte.", "Weil ihr Laden groß genug ist.", "Weil ältere Leute ohne Auto nicht wegkamen."],
        correctIndex: 2,
        explanation: "The same sentence says her shop is actually too small, which rules out b.",
      },
      {
        prompt: "Was kann man dort nicht machen?",
        options: ["Ein Paket abgeben.", "Geld abheben.", "Briefmarken kaufen."],
        correctIndex: 1,
        explanation: "„Nur“ marks the single exception in a list of things that do work.",
      },
      {
        prompt: "Wie verdient Frau Baumhauer an der Post?",
        options: ["Direkt an den Paketen.", "Gar nicht.", "An dem, was die Leute zusätzlich kaufen."],
        correctIndex: 2,
        explanation: "„fast nichts“ is not „nichts“, and the last sentence says it does add up.",
      },
    ],
  },
  {
    id: "a2-05-text_2",
    level: "A2",
    title: "Volkshochschule Weidenbach",
    source: "Programmheft",
    text: `Volkshochschule Weidenbach — Frühjahrsprogramm

Anmeldung
Online rund um die Uhr · persönlich Montag bis Donnerstag 9–16 Uhr
Telefonisch nur mittwochs von 9 bis 12 Uhr

Kurse und Räume
Sprachen: Räume 101–108 (1. Stock) · Computer: Raum 12 (Erdgeschoss)
Kochen: Lehrküche im Keller · Bewegung: Turnhalle im Nachbargebäude

Gut zu wissen
Ein Kurs beginnt erst ab sechs Anmeldungen. Fällt er aus, bekommen Sie das Geld vollständig zurück. Wenn Sie selbst absagen, geht das kostenlos bis eine Woche vor Kursbeginn; danach behalten wir die Hälfte ein. Ermäßigung erhalten Schülerinnen, Studierende und Arbeitslose gegen Nachweis. Parkplätze gibt es nur im Hof und nur für Kursleitende.`,
    questions: [
      {
        prompt: "Sie möchten am Freitag anrufen und sich anmelden.",
        options: ["Das geht.", "Telefonisch geht das nur mittwochs.", "Anmeldungen sind nur persönlich möglich."],
        correctIndex: 1,
        explanation: "Online registration is open around the clock, which makes c wrong as well.",
      },
      {
        prompt: "Wo findet ein Kochkurs statt?",
        options: ["Im Erdgeschoss.", "Im 1. Stock.", "Im Keller."],
        correctIndex: 2,
        explanation: "Four locations, four floors — match the subject, not the first room you see.",
      },
      {
        prompt: "Wann beginnt ein Kurs?",
        options: ["Immer zum genannten Termin.", "Erst ab sechs Anmeldungen.", "Erst ab zwölf Anmeldungen."],
        correctIndex: 1,
        explanation: "The refund rule only makes sense because of this condition.",
      },
      {
        prompt: "Sie sagen vier Tage vor Kursbeginn ab. Was passiert?",
        options: ["Sie bekommen alles zurück.", "Sie bekommen die Hälfte zurück.", "Sie bekommen nichts zurück."],
        correctIndex: 1,
        explanation: "The full refund in a belongs to a cancelled course, not to a cancelling student.",
      },
      {
        prompt: "Wer darf im Hof parken?",
        options: ["Alle Teilnehmenden.", "Nur die Kursleitenden.", "Niemand."],
        correctIndex: 1,
        explanation: "The two „nur“s do different jobs — do not let the first answer the question.",
      },
    ],
  },
  {
    id: "a2-05-text_3",
    level: "A2",
    title: "E-Mail von Selin",
    source: "private E-Mail",
    text: `Hallo Tobias,

so, das Gartenprojekt läuft. Ich schreibe dir kurz, wie es steht.

Wir sind jetzt neun Leute, das ist genug. Die Stadt hat uns das Grundstück hinter dem Sportplatz für drei Jahre überlassen, kostenlos. Wasser gibt es auch, allerdings nur einen Anschluss für alle.

Das größte Problem ist im Moment nicht die Arbeit, sondern der Boden. Da war früher ein Parkplatz, und unter dem Gras liegt überall Schotter. Wir haben am Samstag zu fünft vier Stunden gegraben und sind zwei Meter weit gekommen.

Willst du nicht doch mitmachen? Du musst nichts können, ich kann ja auch nichts. Und wir treffen uns nur samstags, nicht unter der Woche.

Melde dich einfach, wenn du magst. Der nächste Termin ist am siebzehnten.

Viele Grüße
Selin`,
    questions: [
      {
        prompt: "Wie viele Leute machen mit?",
        options: ["Fünf.", "Neun.", "Siebzehn."],
        correctIndex: 1,
        explanation: "Three numbers in the mail, and two of them are not people in the group.",
      },
      {
        prompt: "Was hat die Stadt gemacht?",
        options: ["Sie hat das Grundstück verkauft.", "Sie hat Geld gegeben.", "Sie hat das Grundstück kostenlos überlassen."],
        correctIndex: 2,
        explanation: "Nothing in the mail mentions money changing hands at all.",
      },
      {
        prompt: "Was ist im Moment das größte Problem?",
        options: ["Der Boden.", "Das Wasser.", "Zu wenige Leute."],
        correctIndex: 0,
        explanation: "Water and numbers are both mentioned — and both as things that are fine.",
      },
      {
        prompt: "Was schreibt Selin über Tobias' Erfahrung?",
        options: ["Er muss sich auskennen.", "Er braucht keine Erfahrung.", "Er soll zuerst einen Kurs machen."],
        correctIndex: 1,
        explanation: "The second half of the sentence is what makes the first half convincing.",
      },
      {
        prompt: "Wann trifft sich die Gruppe?",
        options: ["Jeden Tag.", "Unter der Woche.", "Nur samstags."],
        correctIndex: 2,
        explanation: "She adds the negative half because that is the objection she expects.",
      },
    ],
  },
];