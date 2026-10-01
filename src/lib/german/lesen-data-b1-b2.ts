/**
 * B1/B2 German reading-comprehension passages — GENERATED CONTENT, not
 * original to this project. See LESEN-ATTRIBUTION.md in this directory for
 * the full license text and the required attribution line (same license,
 * same source repo as lesen-data.ts's A1/A2 content).
 *
 * Source:  diprajkadlag/german-exam-trainer
 *          https://github.com/diprajkadlag/german-exam-trainer
 * Files:   content/exams/pruefung-0{1..5}/exam.json (B1 — unprefixed in the
 *            source, it's that repo's "default" level)
 *          content/exams/b2-pruefung-0{1..5}/exam.json (B2)
 * License: CC BY 4.0 (content only — see LICENSE-CONTENT in that repo)
 *
 * Unlike A1/A2 (two simple types), B1/B2 use six distinct `lesen` item
 * types — every one of them is included here, reshaped into the three
 * shapes `lesen-types.ts` defines:
 * - "choice" — B1 richtig_falsch, B1/B2 multiple_choice, and B1 ja_nein
 *   (reshaped: each item's `frage` is a person's name, not a question, so
 *   the prompt becomes "Stimmt diese Person der These zu? „<name>“" with
 *   Ja/Nein options, and the shared forum thesis is prepended to the
 *   passage text as "These: ...").
 * - "matching" — B1 zuordnung_anzeigen, B2 zuordnung_person,
 *   zuordnung_aeusserungen, zuordnung_ueberschriften. All four are the same
 *   underlying exercise (drag an option onto its matching target); only
 *   zuordnung_ueberschriften also carries a `referenceText` passage to
 *   read first.
 * - "sentence-insertion" — B2 satz_einfuegen. The source embeds gap
 *   markers as literal `[10]`/`[11]`/... text inside the passage; this
 *   splits that into `segments` + `gaps` once at generation time so the
 *   route never has to parse markers at render time.
 *
 * 30 B1 papers-worth of passages (25 choice + 5 matching) and 30 B2 (5
 * choice + 15 matching + 5 sentence-insertion) = 55 passages total, 300
 * gradable items (145 choice questions + 125 matching targets + 30
 * insertion gaps) — matches the source README's own stated item counts
 * per level (B1 "6/6/7/7/4", B2 "9/6/6/6/3", ×5 papers each = 150 + 150).
 */
import type {
  LesenChoicePassage,
  LesenGap,
  LesenGapOption,
  LesenMatchOption,
  LesenMatchTarget,
  LesenMatchingPassage,
  LesenPassage,
  LesenSentenceInsertionPassage,
} from "./lesen-types";

const CHOICE_PASSAGES: LesenChoicePassage[] = [
  {
    kind: "choice",
    id: "b1-01-blog_landleben",
    level: "B1",
    title: "Vom Großstadtbüro aufs Dorf – mein erstes Jahr im Homeoffice",
    source: "aus dem Blog „Umgezogen“",
    text: `Vor genau einem Jahr habe ich Hamburg verlassen. Meine Freunde haben damals gesagt, ich sei verrückt. Ich hatte eine gute Stelle in einer Werbeagentur, eine kleine Wohnung in einem beliebten Viertel und jeden Abend die Wahl zwischen zehn Restaurants. Trotzdem war ich unzufrieden. Jeden Morgen stand ich fünfzig Minuten in der überfüllten S-Bahn, und abends war ich zu müde, um noch etwas zu unternehmen.

Als meine Firma ankündigte, dass alle Mitarbeiter dauerhaft von zu Hause arbeiten dürfen, habe ich nicht lange überlegt. Innerhalb von drei Monaten habe ich ein altes Bauernhaus in einem Dorf in Mecklenburg gemietet – für weniger als die Hälfte meiner Hamburger Miete. Der Garten allein ist größer als meine ganze alte Wohnung.

Ehrlich gesagt war der Anfang schwieriger als erwartet. Das Internet fiel in den ersten Wochen ständig aus, und ich musste eine teure Spezialantenne installieren lassen. Außerdem hatte ich die Stille unterschätzt. In der Stadt hatte ich mich nie einsam gefühlt, aber hier saß ich plötzlich allein am Küchentisch und sprach den ganzen Tag nur mit meinem Laptop.

Geholfen hat mir schließlich der Sportverein. Ich spiele jetzt jeden Donnerstag Volleyball, obwohl ich das früher nie getan hätte. Dort habe ich die meisten Leute kennengelernt, die ich heute meine Nachbarn nenne.

Würde ich es wieder tun? Auf jeden Fall. Aber ich sage inzwischen niemandem mehr, dass das Landleben automatisch entspannter ist. Man tauscht nur die einen Probleme gegen andere. Wer glaubt, er könne allen Schwierigkeiten davonlaufen, wird auch auf dem Dorf enttäuscht.`,
    questions: [
      {
        prompt: `Die Freunde des Autors hielten seinen Umzug für eine vernünftige Entscheidung.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„verrückt“ (crazy) is the opposite of „vernünftig“ (sensible), so the statement is false. Note the Konjunktiv I „sei“ — reported speech, not the author's own view.",
      },
      {
        prompt: `Der Autor war mit seiner Arbeitsstelle in Hamburg unzufrieden.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "A classic trap: the word „unzufrieden“ does appear in the text, but it refers to his life overall, not his job. The job is described as „eine gute Stelle“.",
      },
      {
        prompt: `Der Autor zahlt auf dem Land weniger Miete als in Hamburg.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„die Hälfte“ = half. Less than half of the old rent is clearly less.",
      },
      {
        prompt: `Die Internetverbindung funktionierte von Anfang an gut.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„ausfallen“ = to fail / break down. „ständig“ = constantly. He also had to install an expensive antenna, further proof it did not work.",
      },
      {
        prompt: `Über den Sportverein hat der Autor neue Leute kennengelernt.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The pronoun „Dort“ refers back to the sports club mentioned in the previous sentence. Tracking such references is a core B1 reading skill.",
      },
      {
        prompt: `Der Autor empfiehlt allen Menschen, aufs Land zu ziehen.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "He is happy for himself but explicitly refuses to generalise. „niemandem mehr“ = to nobody any more. The final sentence reinforces this.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-01-artikel_fahrradstrassen",
    level: "B1",
    title: "Wenn die Straße den Radfahrern gehört",
    source: "Lindenauer Anzeiger",
    text: `In immer mehr deutschen Städten entstehen sogenannte Fahrradstraßen. Auf ihnen haben Radfahrer Vorrang, Autos dürfen nur ausnahmsweise fahren und höchstens dreißig Stundenkilometer schnell. Die Stadt Freiburg hat inzwischen über zwanzig solcher Straßen eingerichtet, Bremen und Münster ziehen nach.

Der Verkehrsforscher Dr. Andreas Wieland hält die Entwicklung für richtig, warnt aber vor zu großen Erwartungen. „Eine einzelne Fahrradstraße bringt fast nichts“, sagt er. „Erst wenn daraus ein durchgehendes Netz wird, steigen die Menschen wirklich um.“ In Städten, in denen nur einzelne Abschnitte umgebaut wurden, sei die Zahl der Radfahrer kaum gestiegen.

Kritik kommt vor allem von Gewerbetreibenden. Viele Ladenbesitzer befürchten, dass ihnen Kunden verloren gehen, wenn Parkplätze wegfallen. Untersuchungen aus den Niederlanden zeigen allerdings das Gegenteil: Dort geben Kunden, die mit dem Rad kommen, pro Monat mehr Geld aus als Autofahrer, weil sie häufiger einkaufen.

Unklar ist bislang, wie die Regeln durchgesetzt werden sollen. In der Praxis halten sich viele Autofahrer nicht an das Tempolimit, und Kontrollen sind selten. Die Stadt Freiburg setzt deshalb auf bauliche Lösungen: Wo Poller und Blumenkübel stehen, muss niemand kontrollieren.`,
    questions: [
      {
        prompt: `Was sagt der Verkehrsforscher Dr. Wieland über Fahrradstraßen?`,
        options: ["Sie wirken erst, wenn sie miteinander verbunden sind.", "Sie sind für kleinere Städte nicht geeignet.", "Sie müssten deutlich breiter gebaut werden."],
        correctIndex: 0,
        explanation: "✗ b — the article never mentions city size; Freiburg, Bremen and Münster are all named without any size argument. ✗ c — width is never discussed at all. Watch for options that sound plausible but appear nowhere in the text.",
      },
      {
        prompt: `Was zeigen die Untersuchungen aus den Niederlanden?`,
        options: ["Radfahrer kaufen seltener ein als Autofahrer.", "Kunden mit dem Rad geben insgesamt mehr Geld aus.", "Ladenbesitzer verlieren durch Fahrradstraßen Kunden."],
        correctIndex: 1,
        explanation: "✗ a — the exact reverse: they shop MORE often („häufiger“). ✗ c — that is what shopkeepers FEAR („befürchten“), and the Dutch study shows „das Gegenteil“. Distinguishing what someone fears from what is actually the case is the whole point of this item.",
      },
      {
        prompt: `Wie geht die Stadt Freiburg mit dem Problem der Kontrolle um?`,
        options: ["Sie beschäftigt mehr Polizisten.", "Sie erhöht die Strafen für zu schnelles Fahren.", "Sie baut Hindernisse auf die Straße."],
        correctIndex: 2,
        explanation: "You do not need to know „Poller“ (bollard) or „Blumenkübel“ (planter): „bauliche Lösungen“ (structural solutions) in the sentence before tells you it is something physical. ✗ a and ✗ b both describe enforcement, which is exactly what the text says Freiburg is avoiding.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-01-artikel_repaircafe",
    level: "B1",
    title: "Reparieren statt wegwerfen",
    source: "Lindenauer Anzeiger",
    text: `An jedem zweiten Samstag im Monat verwandelt sich das Gemeindehaus in Ostheim in eine Werkstatt. Zwischen Kaffeetassen liegen Schraubenzieher, Lötkolben und kaputte Toaster. Das Repair-Café Ostheim gibt es seit sechs Jahren, und es ist jedes Mal voll.

Gegründet hat es die Elektrotechnikerin Berit Sanders. Ihr ging es allerdings nie in erster Linie um die Umwelt. „Mich hat geärgert, dass die Leute das Gefühl verloren haben, selbst etwas reparieren zu können“, erzählt sie. Deshalb gilt bei ihr eine strenge Regel: Die Helfer nehmen den Besuchern das Werkzeug nicht aus der Hand. Wer kommt, muss mitarbeiten.

Etwa zwei Drittel der mitgebrachten Geräte werden wieder funktionsfähig. Am häufigsten scheitern die Reparaturen nicht an den Helfern, sondern an fehlenden Ersatzteilen. Manche Hersteller verkaufen einzelne Bauteile grundsätzlich nicht.

Der Erfolg hat auch die Stadtverwaltung überzeugt. Sie stellt seit zwei Jahren die Räume kostenlos zur Verfügung. Geld für Material bekommt das Café dagegen nicht; es finanziert sich ausschließlich über Spenden. Berit Sanders stört das nicht. „Sobald Geld fließt, kommen Vorschriften“, meint sie. „Bisher sind wir gut ohne ausgekommen.“`,
    questions: [
      {
        prompt: `Warum hat Berit Sanders das Repair-Café gegründet?`,
        options: ["Sie wollte in erster Linie Müll vermeiden.", "Sie wollte, dass Menschen wieder selbst reparieren.", "Sie suchte nach dem Berufsende eine neue Aufgabe."],
        correctIndex: 1,
        explanation: "✗ a — explicitly ruled out: „Ihr ging es allerdings nie in erster Linie um die Umwelt.“ The word „nie“ negates it. ✗ c — she is described as an active „Elektrotechnikerin“; retirement is never mentioned.",
      },
      {
        prompt: `Woran scheitern die Reparaturen am häufigsten?`,
        options: ["Es fehlen Ersatzteile.", "Die Helfer haben zu wenig Zeit.", "Die Geräte sind zu alt."],
        correctIndex: 0,
        explanation: "The „nicht … sondern …“ construction does the work: it rules out b and states a. Learn to read „nicht A, sondern B“ as a signpost — it almost always marks the key sentence.",
      },
      {
        prompt: `Wie finanziert sich das Repair-Café?`,
        options: ["Die Stadtverwaltung bezahlt das Material.", "Die Besucher zahlen einen festen Beitrag.", "Es lebt von freiwilligen Spenden."],
        correctIndex: 2,
        explanation: "✗ a is the trap: the city does help, but with rooms, not money — „Geld für Material bekommt das Café dagegen nicht“. The word „dagegen“ signals the contrast. ✗ b — a fixed fee is never mentioned.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-01-forum_vier_tage",
    level: "B1",
    title: "Lesermeinungen: Vier Tage arbeiten – reicht das?",
    source: "Online-Forum",
    text: `These: Immer mehr Betriebe diskutieren über die Vier-Tage-Woche: Sollen Unternehmen ihren Beschäftigten anbieten, bei gleichem Lohn nur an vier Tagen pro Woche zu arbeiten?

Beispiel: Jürgen, 44 — Ich arbeite seit acht Monaten vier Tage und würde nie wieder zurückwechseln. Man ist am Montag wirklich ausgeruht.

20. Tanja, 34 — Wir haben es ein Jahr lang ausprobiert. Am Anfang war ich skeptisch, weil ich dachte, wir schaffen die Arbeit gar nicht. Inzwischen sind bei uns weniger Leute krank als vorher, und niemand möchte zurück.

21. Werner, 58 — Schön für Büroangestellte. Ich arbeite in der Pflege. Wenn ich einen Tag weniger da bin, muss jemand anderes diesen Tag übernehmen – und diesen Jemand gibt es nicht. Solange das nicht geklärt ist, halte ich die ganze Diskussion für Träumerei.

22. Ayla, 29 — Man darf nicht so tun, als wäre das ein Geschenk. Die gleiche Arbeit in weniger Zeit bedeutet einfach mehr Druck an den übrigen Tagen. Meine Mittagspause habe ich seitdem gestrichen. So kann die Lösung nicht aussehen.

23. Milan, 41 — Als Arbeitgeber war ich lange dagegen. Dann haben wir es getestet, weil wir keine Bewerber mehr fanden. Heute bekomme ich auf jede Stelle dreimal so viele Bewerbungen. Rein wirtschaftlich hat es sich für uns gelohnt.

24. Steffi, 47 — Ich verstehe die Begeisterung ehrlich gesagt nicht ganz. Mir persönlich ist wichtiger, wann ich arbeite, nicht an wie vielen Tagen. Aber wenn Kollegen dadurch mehr Zeit für ihre Kinder haben, soll man es ihnen ermöglichen. Warum denn nicht?

25. Hendrik, 36 — Vier Tage, fünf Tage – entscheidend ist doch, dass am Ende genug Geld auf dem Konto ist. Bei uns hieß es zuerst vier Tage, und ein halbes Jahr später wurde der Lohn gesenkt. Auf so ein Angebot würde ich nie wieder eingehen.

26. Bea, 52 — Bei uns läuft es seit zwei Jahren, und die Kundschaft merkt gar nichts davon, weil wir die Tage untereinander aufteilen. Man muss es eben ordentlich organisieren. Andere Betriebe sollten sich das ruhig abschauen.`,
    questions: [
      {
        prompt: `Stimmt diese Person der These zu?
„Tanja, 34“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The opening „ich war skeptisch“ is a decoy. B1 opinion texts very often begin with the opposite view before turning. Read to the end: „niemand möchte zurück“ is the verdict.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Werner, 58“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„Träumerei“ = wishful thinking. The opening „Schön für …“ is ironic, not approving — a common German rhetorical move you should learn to spot.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Ayla, 29“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "She rejects it not in principle but because of how it works in practice — still a „nein“. The task asks whether she is for or against, not why.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Milan, 41“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„war lange dagegen“ is past tense. The tense change signals he has changed his mind. Present-tense evidence („Heute bekomme ich …“) carries the answer.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Steffi, 47“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The hardest item in this part. She is personally indifferent, yet she supports offering it („soll man es ihnen ermöglichen“, „Warum denn nicht?“). Always check the answer against the exact proposition, which here is whether companies should OFFER it.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Hendrik, 36“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„nie wieder“ = never again. The proposition specifies „bei gleichem Lohn“ (same pay), but his experience was a pay cut, and he generalises from it to reject the offer.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Bea, 52“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„sich etwas abschauen“ = to copy / learn from someone. Recommending that others copy it is unambiguous support.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-01-ordnung_buecherei",
    level: "B1",
    title: "Benutzungsordnung der Stadtbücherei Lindenau",
    source: "Aushang",
    text: `§ 1 Anmeldung
Die Benutzung der Stadtbücherei ist kostenlos. Für die Ausleihe wird ein Büchereiausweis benötigt. Diesen erhalten Sie bei der Anmeldung gegen Vorlage eines gültigen Personalausweises. Personen unter 18 Jahren benötigen zusätzlich die Unterschrift eines Erziehungsberechtigten.

§ 2 Leihfristen
Bücher und Zeitschriften können vier Wochen ausgeliehen werden, DVDs und Spiele zwei Wochen. Neuerscheinungen, die mit einem roten Punkt gekennzeichnet sind, sind von der Ausleihe ausgenommen und dürfen nur in den Räumen der Bücherei gelesen werden.

§ 3 Verlängerung
Die Leihfrist kann zweimal um jeweils zwei Wochen verlängert werden, sofern das Medium nicht von einer anderen Person vorgemerkt wurde. Verlängerungen sind persönlich, telefonisch oder über unsere Internetseite möglich.

§ 4 Versäumnisgebühren
Wird ein Medium zu spät zurückgegeben, wird für jedes Medium und jede angefangene Woche eine Gebühr von 0,50 Euro erhoben. Eine Mahnung wird nicht verschickt; die Leihfristen sind selbst zu beachten.

§ 5 Internetplätze
Die vier Internetplätze im Lesesaal stehen angemeldeten Benutzern täglich für eine Stunde kostenlos zur Verfügung. Eine Reservierung ist nur für denselben Tag möglich.

§ 6 Verhalten in den Räumen
Essen ist in allen Räumen untersagt. Getränke dürfen nur in verschließbaren Flaschen mitgebracht werden. Mobiltelefone sind stumm zu schalten; Gespräche führen Sie bitte im Eingangsbereich.`,
    questions: [
      {
        prompt: `Was muss eine erwachsene Person zur Anmeldung mitbringen?`,
        options: ["einen gültigen Personalausweis", "eine Gebühr von 0,50 Euro", "die Unterschrift einer zweiten Person"],
        correctIndex: 0,
        explanation: "✗ c applies only to under-18s („Personen unter 18 Jahren benötigen zusätzlich …“) and the question says „eine erwachsene Person“. ✗ b — the 0.50 € in § 4 is a late fee, not a registration charge. Regulations reward careful reading of who a rule applies to.",
      },
      {
        prompt: `Was gilt für Bücher mit einem roten Punkt?`,
        options: ["Sie dürfen nur zwei Wochen ausgeliehen werden.", "Sie müssen in der Bücherei bleiben.", "Für sie wird eine zusätzliche Gebühr verlangt."],
        correctIndex: 1,
        explanation: "„ausgenommen von“ = excluded from. ✗ a takes the two-week figure from the DVD rule in the same paragraph — a very typical distractor built from a real number in the wrong place.",
      },
      {
        prompt: `Was passiert, wenn ein Buch zu spät zurückgebracht wird?`,
        options: ["Man erhält zuerst eine schriftliche Mahnung.", "Man zahlt für jede angefangene Woche.", "Der Büchereiausweis wird gesperrt."],
        correctIndex: 1,
        explanation: "✗ a is explicitly denied in the very next sentence: „Eine Mahnung wird nicht verschickt.“ ✗ c is never mentioned. „angefangene Woche“ = any week begun, so even one day late costs a full 0.50 €.",
      },
      {
        prompt: `Was ist in den Räumen der Bücherei erlaubt?`,
        options: ["Getränke in verschließbaren Flaschen", "eine Kleinigkeit im Lesesaal essen", "am Internetplatz telefonieren"],
        correctIndex: 0,
        explanation: "✗ b — „Essen ist in allen Räumen untersagt“; „untersagt“ = forbidden. ✗ c — calls must be taken „im Eingangsbereich“. Note the question asks what IS allowed, while the paragraph mostly lists prohibitions.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-02-blog_zucker",
    level: "B1",
    title: "Drei Monate ohne Zucker – mein Selbstversuch",
    source: "aus dem Blog „Halbwegs vernünftig“",
    text: `Angefangen hat alles mit einer Wette. Mein Bruder behauptete beim Abendessen, ich würde keine zwei Wochen ohne Süßigkeiten durchhalten. Ich habe daraufhin gesagt: drei Monate. So etwas sollte man nie mit vollem Magen versprechen.

Die erste Woche war überraschend leicht. Ich hatte mir vorgestellt, dass ich ständig an Schokolade denken würde, aber das Gegenteil war der Fall: Ich war einfach nur stolz. Richtig schwierig wurde es erst in der dritten Woche, und zwar nicht wegen der Süßigkeiten. Sondern weil Zucker fast überall drin ist. In meinem Lieblingsbrot, im Joghurt, sogar in der Gemüsesuppe aus dem Glas. Ich stand plötzlich zwanzig Minuten im Supermarkt und las Verpackungen, statt einzukaufen.

Geholfen hat mir am Ende, dass ich wieder selbst gekocht habe. Das klingt nach viel Aufwand, war es aber nicht. Sonntags habe ich für drei Tage vorgekocht, und unter der Woche musste ich nur noch aufwärmen. Nebenbei habe ich dabei deutlich weniger Geld ausgegeben als vorher.

Und das Ergebnis? Abgenommen habe ich kaum, gerade einmal zwei Kilo. Aber ich schlafe seitdem besser und bin am Nachmittag nicht mehr so müde. Ob das wirklich am Zucker lag, kann ich nicht beweisen.

Inzwischen esse ich wieder Kuchen, wenn ich Lust darauf habe. Der Unterschied ist, dass ich es merke. Vorher habe ich nebenbei eine ganze Tafel gegessen, ohne es zu bemerken. Wer mich fragt, ob er das auch machen soll, dem sage ich: Probier es aus, aber erwarte kein Wunder.`,
    questions: [
      {
        prompt: `Die Idee zu dem Selbstversuch kam vom Autor selbst.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The brother started it („Angefangen hat alles mit einer Wette“). The author only raised the stakes afterwards — „daraufhin“ marks the reaction.",
      },
      {
        prompt: `Am schwierigsten war für den Autor die erste Woche.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„erst in der dritten Woche“ — „erst“ means not until. The first week is explicitly called „überraschend leicht“.",
      },
      {
        prompt: `Der Autor war überrascht, in wie vielen Produkten Zucker enthalten ist.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The word „sogar“ (even) before „in der Gemüsesuppe“ signals surprise, and the twenty minutes spent reading labels shows it.",
      },
      {
        prompt: `Durch das Selberkochen wurde das Essen für ihn teurer.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„weniger … als vorher“ is the opposite of the statement. Watch for comparisons: the direction is what is being tested, not the topic.",
      },
      {
        prompt: `Der Autor hat während des Versuchs viel Gewicht verloren.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„kaum“ = hardly, and „gerade einmal“ = only just. Two small words carry the whole answer; both play down the number that follows.",
      },
      {
        prompt: `Der Autor empfiehlt den Versuch, warnt aber vor zu hohen Erwartungen.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Both halves of the statement must hold. „Probier es aus“ is the recommendation; „erwarte kein Wunder“ is the warning.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-02-artikel_hofautomat",
    level: "B1",
    title: "Einkaufen, wenn alle anderen schlafen",
    source: "Lindenauer Anzeiger",
    text: `Wer nachts um zwei Uhr Eier braucht, findet in Ostheim inzwischen eine Lösung. Am Ortsrand steht seit anderthalb Jahren ein beleuchteter Automat, gefüllt mit Eiern, Kartoffeln, Marmelade und Nudeln von vier Höfen aus der Umgebung. Bezahlt wird mit Karte, geöffnet ist rund um die Uhr.

Aufgestellt hat ihn der Landwirt Ernst Bühler. Sein Grund war weder Technikbegeisterung noch der Wunsch nach mehr Umsatz. „Unser Hofladen hatte an vier Nachmittagen geöffnet, und trotzdem musste immer jemand dasitzen und warten“, sagt er. „Diese Zeit fehlte uns auf dem Feld.“

Dass der Automat auch mehr einbringen würde, hatte er nicht erwartet. Inzwischen verkauft er darüber etwa ein Drittel mehr als früher im Laden. Die meisten Kunden kommen allerdings nicht nachts, sondern zwischen sechs und acht Uhr morgens, auf dem Weg zur Arbeit.

Nicht alles funktioniert reibungslos. Frische Milch nimmt Bühler nicht mehr in den Automaten, weil sie sich zu schlecht hielt. Und zweimal wurde versucht, das Gerät aufzubrechen. Seitdem hängt eine Kamera darüber. „Damit hatte ich am Anfang wirklich nicht gerechnet“, sagt er.`,
    questions: [
      {
        prompt: `Warum hat Ernst Bühler den Automaten aufgestellt?`,
        options: ["Er wollte mehr Ware verkaufen.", "Er wollte Arbeitszeit im Laden sparen.", "Er interessiert sich sehr für neue Technik."],
        correctIndex: 1,
        explanation: "The sentence „Sein Grund war weder Technikbegeisterung noch der Wunsch nach mehr Umsatz“ rules out a and c explicitly. „weder … noch“ is worth learning as a signpost — it eliminates two options at once.",
      },
      {
        prompt: `Wann kaufen die meisten Kunden am Automaten ein?`,
        options: ["am frühen Morgen", "in der Nacht", "am späten Nachmittag"],
        correctIndex: 0,
        explanation: "The article opens with a two-in-the-morning image, which makes b tempting. „nicht nachts, sondern …“ corrects exactly that impression.",
      },
      {
        prompt: `Welches Problem gab es mit dem Automaten?`,
        options: ["Die Karte funktionierte oft nicht.", "Es gab Versuche, ihn aufzubrechen.", "Die Kunden beschwerten sich über die Preise."],
        correctIndex: 1,
        explanation: "Milk keeping badly is also a problem, but it is not offered as an option. Neither a nor c appears anywhere in the text.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-02-artikel_facharzt",
    level: "B1",
    title: "Warten auf den Termin",
    source: "Lindenauer Anzeiger",
    text: `Bis zu einem Termin beim Facharzt vergehen im Landkreis Lindenau durchschnittlich siebenunddreißig Tage. Bei Hautärzten sind es sogar über zwei Monate. Das geht aus einer Auswertung der Kassenärztlichen Vereinigung hervor, die vergangene Woche vorgestellt wurde.

Überraschend ist ein anderes Ergebnis der Untersuchung: Die Zahl der Ärztinnen und Ärzte ist im Landkreis in den letzten zehn Jahren nicht gesunken, sondern leicht gestiegen. Gleichzeitig hat sich die Zahl der Behandlungen deutlich erhöht. „Die Menschen werden älter und kommen häufiger“, erklärt Dr. Petra Lindqvist von der Vereinigung.

Wer schnell einen Termin braucht, kann die Terminservicestelle anrufen. Sie vermittelt innerhalb weniger Wochen einen Platz, allerdings nicht unbedingt bei der Praxis, die man sich gewünscht hat. Genau daran scheitert es oft: Viele Patienten lehnen ab, weil sie ihre Ärztin nicht wechseln möchten, und warten dann doch wieder.

Einige Praxen versuchen es anders. In Ostheim halten drei Gemeinschaftspraxen jeden Morgen eine Stunde ohne Termine frei. Wer kommt, wird behandelt. Die Wartezimmer sind in dieser Stunde voll, aber die Sprechstunde danach läuft ruhiger als früher.`,
    questions: [
      {
        prompt: `Was ist an dem Ergebnis der Untersuchung überraschend?`,
        options: ["Es gibt heute mehr Ärzte als vor zehn Jahren.", "Die Wartezeit bei Hautärzten ist besonders kurz.", "Es werden weniger Patienten behandelt als früher."],
        correctIndex: 0,
        explanation: "✗ b — dermatologists have the longest wait, over two months. ✗ c — treatments have risen („deutlich erhöht“), not fallen. Both invert what the text says.",
      },
      {
        prompt: `Warum hilft die Terminservicestelle vielen Patienten nicht?`,
        options: ["Sie ist telefonisch kaum zu erreichen.", "Sie vermittelt oft eine andere Praxis.", "Sie verlangt eine zusätzliche Gebühr."],
        correctIndex: 1,
        explanation: "The service works; people decline it. Read on to „Genau daran scheitert es oft“ — „daran“ points back to the previous sentence.",
      },
      {
        prompt: `Was machen die drei Gemeinschaftspraxen in Ostheim anders?`,
        options: ["Sie öffnen jeden Morgen eine Stunde ohne Termine.", "Sie behandeln nur noch Patienten aus dem Ort.", "Sie haben ihre Sprechstunde verlängert."],
        correctIndex: 0,
        explanation: "✗ c is the trap: the hour is kept free within the existing day, not added to it. The text says the surgery afterwards runs more calmly, not longer.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-02-forum_bonus",
    level: "B1",
    title: "Lesermeinungen: Bonus von der Krankenkasse – sinnvoll oder nicht?",
    source: "Online-Forum",
    text: `These: Viele Krankenkassen zahlen Geld oder geben Gutscheine, wenn Versicherte regelmäßig zur Vorsorgeuntersuchung gehen oder Sport treiben. Sollen Krankenkassen solche Bonusprogramme anbieten?

Beispiel: Rainer, 51 — Ich sammle seit Jahren Punkte für Vorsorge und Sport und bekomme jedes Jahr etwas zurück. Warum sollte man das abschaffen?

20. Jasmin, 33 — Ohne das Programm wäre ich mit Sicherheit nicht zur Vorsorge gegangen. Beim ersten Mal ging es mir wirklich nur um den Gutschein. Inzwischen gehe ich von allein, weil ich gesehen habe, wie schnell das geht. Genau so soll es doch funktionieren.

21. Ottmar, 64 — Bezahlt wird das alles aus unseren Beiträgen. Man nimmt allen Versicherten Geld ab und gibt es denen zurück, die ohnehin schon fit sind und Zeit für Sport haben. Als Idee mag das nett klingen, gerecht ist es nicht.

22. Nurten, 41 — Ich arbeite in der Pflege im Schichtdienst. Mein Fitnessstudio hat zu, wenn ich Feierabend habe, und einen Vorsorgetermin bekomme ich nur vormittags. Für Leute wie mich sind diese Punkte praktisch nicht erreichbar. So etwas sollte man nicht Bonus nennen.

23. Frederik, 29 — Klar ist das nur ein kleiner Betrag, darüber muss man sich nichts vormachen. Aber es kostet mich nichts, und wer einmal beim Arzt war, geht beim nächsten Mal leichter hin. Solange niemand einen Nachteil hat, spricht überhaupt nichts dagegen.

24. Elisabeth, 57 — Mich stört vor allem, dass die Kasse dabei erfährt, wie oft ich ins Schwimmbad gehe. Am Anfang sind es Punkte, und irgendwann zahlt man mehr, wenn man nicht mitmacht. Diesen Weg möchte ich gar nicht erst einschlagen.

25. Youssef, 46 — Bei uns im Betrieb hat die Kasse einen Gesundheitstag organisiert, und über die Punkte sind wirklich fast alle hingegangen. Ein paar Kollegen haben dabei erfahren, dass ihr Blutdruck zu hoch ist. Wenn ein Gutschein das schafft, soll man ihn ruhig weiter verteilen.

26. Doro, 38 — Statt Punkte zu verteilen, könnte man die Beiträge einfach für alle senken. Der ganze Aufwand mit Heften, Stempeln und Anträgen kostet doch auch wieder Geld. Ich halte das für die falsche Stelle, an der gespart wird.`,
    questions: [
      {
        prompt: `Stimmt diese Person der These zu?
„Jasmin, 33“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„nur um den Gutschein“ sounds like a criticism, but she is describing herself, and the last sentence approves of the outcome.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Ottmar, 64“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„mag … klingen, … ist es nicht“ is a concession followed by a rejection. In German opinion texts the clause after the comma usually carries the verdict.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Nurten, 41“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "She rejects it because of who it excludes, not because the idea is bad in principle. The task asks whether she is for or against, not why.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Frederik, 29“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The hardest item here. He plays the benefit down („nur ein kleiner Betrag“) but still supports it. Weak support is still support.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Elisabeth, 57“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„gar nicht erst“ = not even to begin with. She is objecting to the direction, which is a rejection of the programme itself.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Youssef, 46“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„ruhig“ here is a modal particle meaning „by all means“, not „quietly“. It marks permission or approval.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Doro, 38“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "Proposing an alternative („Statt … könnte man …“) is a rejection of the thing it replaces.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-02-ordnung_hallenbad",
    level: "B1",
    title: "Benutzungsordnung des Hallenbads Lindenau",
    source: "Aushang am Eingang",
    text: `§ 1 Eintritt
Der Eintritt gilt für zwei Stunden ab dem Betreten der Umkleide. Für jede weitere angefangene halbe Stunde wird beim Verlassen ein Zuschlag von 1,50 Euro fällig. Zehnerkarten sind drei Jahre gültig und übertragbar.

§ 2 Kinder
Kinder unter sieben Jahren dürfen das Bad nur in Begleitung einer erwachsenen Person betreten, die selbst schwimmen kann. Für Kinder ab sieben Jahren ist der Besuch ohne Begleitung erlaubt, sofern ein Schwimmabzeichen vorgelegt wird.

§ 3 Schließfächer
Wertsachen gehören in die Schließfächer im Eingangsbereich. Der Schlüssel wird gegen ein Pfand von 5 Euro ausgegeben. Für Gegenstände, die in den Umkleiden zurückgelassen werden, übernehmen wir keine Haftung.

§ 4 Kurse
Während der Kurszeiten sind die Bahnen eins und zwei gesperrt. Die übrigen Bahnen stehen weiterhin allen Gästen zur Verfügung. Die aktuellen Kurszeiten hängen an der Kasse aus und ändern sich in den Schulferien.

§ 5 Verhalten
Vor dem Schwimmen ist zu duschen. Springen ist nur vom Beckenrand der Bahn sechs erlaubt. Essen und Trinken sind ausschließlich im Bistro gestattet; Glasflaschen dürfen nicht mitgebracht werden.`,
    questions: [
      {
        prompt: `Was passiert, wenn ein Gast länger als die bezahlte Zeit bleibt?`,
        options: ["Er zahlt beim Verlassen einen Zuschlag.", "Er muss beim nächsten Besuch mehr bezahlen.", "Die Zehnerkarte verliert ihre Gültigkeit."],
        correctIndex: 0,
        explanation: "„angefangene halbe Stunde“ means any half-hour begun, so even five minutes over costs the full 1.50 €. The three-year validity in the same paragraph belongs to the ten-visit card, not to this rule.",
      },
      {
        prompt: `Ein achtjähriges Kind möchte allein ins Bad. Was gilt?`,
        options: ["Das ist grundsätzlich nicht erlaubt.", "Es braucht ein Schwimmabzeichen.", "Es braucht die Unterschrift der Eltern."],
        correctIndex: 1,
        explanation: "Regulations reward checking who a rule applies to. „unter sieben“ and „ab sieben“ are two different groups, and eight falls in the second.",
      },
      {
        prompt: `Was gilt während der Kurszeiten?`,
        options: ["Das ganze Becken ist gesperrt.", "Zwei Bahnen sind für Kurse reserviert.", "Gäste zahlen einen ermäßigten Eintritt."],
        correctIndex: 1,
        explanation: "✗ a overstates it — the very next sentence says the other lanes stay open to everyone. Distractors often exaggerate a real restriction.",
      },
      {
        prompt: `Was ist im Hallenbad erlaubt?`,
        options: ["am Beckenrand der Bahn sechs springen", "eine Glasflasche mit ins Bad nehmen", "am Beckenrand eine Kleinigkeit essen"],
        correctIndex: 0,
        explanation: "✗ b — glass bottles „dürfen nicht mitgebracht werden“. ✗ c — eating is allowed „ausschließlich im Bistro“. Note the question asks what IS allowed, while the paragraph mostly lists prohibitions.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-03-blog_offline",
    level: "B1",
    title: "Zwölf Monate ohne soziale Netzwerke",
    source: "aus dem Blog „Zweite Reihe“",
    text: `Ich hatte mir das als Experiment vorgestellt, mit Tabelle und Auswertung. Herausgekommen ist etwas anderes.

Der Anlass war banal. Ich saß an einem Dienstagabend auf dem Sofa, wollte kurz eine Nachricht beantworten und stellte vierzig Minuten später fest, dass ich Fotos von Menschen betrachtete, die ich zuletzt in der Schule gesehen hatte. Am nächsten Morgen habe ich alle Konten deaktiviert. Gelöscht habe ich sie bewusst nicht, denn ich wollte mir den Weg zurück offenlassen.

Die ersten zwei Wochen waren unangenehm, aber anders als erwartet. Mir fehlten nicht die Inhalte. Mir fehlte die Bewegung des Daumens. Ich griff weiter zum Telefon, fand aber nichts mehr, was sich hätte nach unten schieben lassen.

Was mich wirklich überrascht hat, kam später. Ich hatte angenommen, ich würde die viele Zeit zum Lesen nutzen. Tatsächlich habe ich in diesem Jahr genau vier Bücher gelesen, kaum mehr als sonst. Die Zeit ist einfach in andere kleine Dinge geflossen, ohne dass ich es gemerkt habe.

Ein Nachteil ist geblieben, und er wiegt schwerer, als ich zugeben möchte. Zwei Geburtstagsfeiern und ein Umzug sind an mir vorbeigegangen, weil sie ausschließlich in einer Gruppe angekündigt wurden, in der ich nicht mehr war. Niemand hatte mich vergessen. Man hatte nur vergessen, dass ich dort nicht mehr mitlese.

Seit vier Wochen habe ich ein Konto wieder aktiviert, allerdings nur auf dem Rechner, nicht auf dem Telefon. Das klingt nach einem Kompromiss, und genau das ist es auch.`,
    questions: [
      {
        prompt: `Der Autor hat seine Konten endgültig gelöscht.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„deaktivieren“ and „löschen“ are deliberately contrasted in the same paragraph, and „bewusst nicht“ makes the choice explicit.",
      },
      {
        prompt: `Am Anfang vermisste der Autor vor allem die Inhalte.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Two short sentences in sequence, the first negative and the second positive, are a common German way of correcting an expectation. The second one carries the answer.",
      },
      {
        prompt: `Der Autor hat in diesem Jahr deutlich mehr gelesen als sonst.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "He expected to read more („Ich hatte angenommen“) and did not. „Tatsächlich“ signals that what follows corrects the expectation.",
      },
      {
        prompt: `Der Autor hat Einladungen verpasst, weil er nicht mehr in bestimmten Gruppen war.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„an jemandem vorbeigehen“ here means to pass someone by, not physically to walk past. The „weil“ clause gives the reason the item asks about.",
      },
      {
        prompt: `Seine Freunde haben ihn absichtlich nicht eingeladen.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The paper's subtlest reading item. „vergessen“ appears twice with different objects — they did not forget *him*, they forgot *that he no longer reads there*. Absicht (intent) is explicitly ruled out.",
      },
      {
        prompt: `Der Autor benutzt inzwischen wieder ein Konto, aber nur eingeschränkt.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„eingeschränkt“ = restricted. Both halves must hold: he is back, but only under a limit he sets himself.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-03-artikel_bibliothek",
    level: "B1",
    title: "Wo man reden darf",
    source: "Lindenauer Anzeiger",
    text: `In der Stadtbibliothek Lindenau ist es lauter geworden, und das ist so gewollt. Vor zwei Jahren wurde das Erdgeschoss umgebaut: weniger Regale, dafür Sessel, Arbeitstische mit Steckdosen und ein Bereich, in dem Gruppen ausdrücklich sprechen dürfen. Die Ausleihzahlen sind seitdem leicht gesunken, die Besucherzahlen dagegen um vierzig Prozent gestiegen.

„Wir haben nicht aufgehört, eine Bibliothek zu sein“, sagt die Leiterin Marion Delbrück. „Wir haben nur akzeptiert, dass die meisten Leute nicht mehr wegen der Bücher kommen.“ Rund die Hälfte der Besucher leihe nichts aus, sondern arbeite, lerne oder treffe sich einfach.

Geplant war der Umbau ursprünglich anders. Vorgesehen war ein Café, das jedoch am Widerstand der Gastwirte in der Nachbarschaft scheiterte. Stattdessen stehen nun zwei Automaten im Foyer. Delbrück sagt heute, das sei der bessere Weg gewesen, weil ein Café Personal gebunden hätte, das an anderer Stelle fehlt.

Nicht alle Stammgäste waren einverstanden. Es gab Beschwerden über den Lärm, vor allem von älteren Nutzern. Die Bibliothek hat darauf reagiert und das gesamte Obergeschoss zur Ruhezone erklärt. Dort gilt, was früher überall galt. Beschwerden gebe es seitdem kaum noch, sagt Delbrück, und fügt hinzu: „Die Trennung war die eigentliche Lösung, nicht der Umbau.“`,
    questions: [
      {
        prompt: `Was hat sich durch den Umbau verändert?`,
        options: ["Es kommen mehr Besucher, aber es wird weniger ausgeliehen.", "Es kommen weniger Besucher, die aber länger bleiben.", "Die Ausleihzahlen sind stark gestiegen."],
        correctIndex: 0,
        explanation: "„dagegen“ marks the contrast between the two figures. Track which number goes which way — the distractors simply swap them.",
      },
      {
        prompt: `Warum gibt es in der Bibliothek kein Café?`,
        options: ["Es war nie geplant.", "Die Gastwirte in der Nähe waren dagegen.", "Die Besucher hatten kein Interesse daran."],
        correctIndex: 1,
        explanation: "✗ a is contradicted by „Vorgesehen war ein Café“. The staffing argument comes later and is the reason she is now *content* with the outcome, not the reason it failed.",
      },
      {
        prompt: `Wie hat die Bibliothek auf die Beschwerden reagiert?`,
        options: ["Sie hat die Öffnungszeiten geändert.", "Sie hat den Gruppenbereich wieder abgeschafft.", "Sie hat eine ruhige Etage eingerichtet."],
        correctIndex: 2,
        explanation: "✗ b would undo the whole redesign, and the closing quotation says the separation, not a reversal, was what worked.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-03-artikel_verein",
    level: "B1",
    title: "Der Verein und das teure Feld",
    source: "Lindenauer Anzeiger",
    text: `Der TSV Ostheim hat im Sommer seinen zweiten Sportplatz verloren. Der Eigentümer, ein landwirtschaftlicher Betrieb, hatte den Pachtvertrag nach dreißig Jahren nicht verlängert. Für den Verein mit seinen sechshundert Mitgliedern bedeutet das ein Problem, das größer ist, als es zunächst aussah.

Denn nicht die Zahl der Trainingsplätze ist entscheidend, sondern deren Verfügbarkeit am frühen Abend. Zwischen siebzehn und zwanzig Uhr wollen fast alle Mannschaften trainieren. Der verbliebene Platz reicht für vier Gruppen gleichzeitig; angemeldet sind elf.

Der Vorsitzende Ralf Zieger hat deshalb einen Vorschlag gemacht, der im Verein umstritten ist: Die Erwachsenenmannschaften sollen künftig nach zwanzig Uhr trainieren, damit die Kinder die besseren Zeiten bekommen. „Wer berufstätig ist, kommt sowieso selten vor halb acht“, argumentiert er.

Widerspruch kommt von den Übungsleitern. Sie befürchten, dass gerade die Erwachsenen aufhören, wenn das Training zu spät liegt. Eine Umfrage unter den Mitgliedern läuft noch. Zieger rechnet damit, dass die Entscheidung erst im Winter fällt — und dass sie ohnehin nur eine Übergangslösung sein wird, bis die Stadt über einen Kunstrasenplatz entschieden hat.`,
    questions: [
      {
        prompt: `Worin besteht das eigentliche Problem des Vereins?`,
        options: ["Es fehlen Trainingszeiten am frühen Abend.", "Der Verein hat zu wenige Mitglieder.", "Der verbliebene Platz ist in schlechtem Zustand."],
        correctIndex: 0,
        explanation: "The „nicht … sondern …“ construction names the real problem and rules out the obvious one. ✗ b is the reverse: six hundred members are part of the pressure.",
      },
      {
        prompt: `Was schlägt der Vorsitzende vor?`,
        options: ["Die Kinder sollen später trainieren.", "Die Erwachsenen sollen später trainieren.", "Einige Mannschaften sollen aufgelöst werden."],
        correctIndex: 1,
        explanation: "The „damit“ clause tells you who benefits, so the two groups cannot be confused. ✗ a simply swaps them.",
      },
      {
        prompt: `Was befürchten die Übungsleiter?`,
        options: ["dass die Kinder zu spät nach Hause kommen", "dass die Stadt kein Geld mehr gibt", "dass erwachsene Mitglieder aufhören"],
        correctIndex: 2,
        explanation: "Note who fears what: the chairman argues working adults come late anyway; the coaches fear the opposite. Attribute the worry to the right group.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-03-forum_handy",
    level: "B1",
    title: "Lesermeinungen: Handyverbot an Schulen — richtig oder falsch?",
    source: "Online-Forum",
    text: `These: Immer mehr Schulen verbieten Handys nicht nur im Unterricht, sondern während des ganzen Schultags, auch in den Pausen. Sollen Schulen ein solches Verbot einführen?

Beispiel: Karin, 49 — An der Schule meiner Tochter gilt das seit einem Jahr. Auf dem Hof wird wieder gespielt statt gestarrt. Ich würde es sofort wieder so machen.

20. Bastian, 36 — Ich habe drei Jahre lang unterrichtet und jede Stunde damit begonnen, Geräte einzusammeln. Diese Zeit fehlt am Ende irgendwo. Eine klare Regel für den ganzen Tag nimmt allen die tägliche Diskussion ab, den Lehrkräften genauso wie den Schülern.

21. Merve, 27 — Man tut so, als läge das Problem im Gerät. Es liegt im Unterricht. Wo es spannend zugeht, schaut niemand auf sein Telefon. Ein Verbot verschiebt die Sache nur bis nach der Schule und löst überhaupt nichts.

22. Ulf, 55 — Als Elternteil möchte ich mein Kind im Notfall erreichen können. Man sagt uns dann, wir sollten im Sekretariat anrufen. Wer das einmal um halb zwei versucht hat, weiß, wie gut das klappt. Solange es hier keine verlässliche Lösung gibt, bin ich dagegen.

23. Annika, 31 — Ich war anfangs skeptisch, weil ich Verbote grundsätzlich nicht mag. In der Schule meines Sohnes ist es aber tatsächlich ruhiger geworden, und die Streitereien wegen heimlicher Aufnahmen haben aufgehört. Das war mir am Ende wichtiger als mein Prinzip.

24. Timo, 44 — Wir bereiten junge Leute auf eine Welt vor, in der diese Geräte überall sind. Wegsperren ist keine Vorbereitung. Man müsste ihnen beibringen, wann man das Ding weglegt — aber genau das kostet Mühe, und deshalb macht man lieber ein Verbot.

25. Pia, 39 — Ich unterrichte an einer Berufsschule. Bei uns sind die Schüler achtzehn und älter, da wäre ein Verbot für den ganzen Tag absurd. An Grundschulen sehe ich das völlig anders; dort spricht meiner Meinung nach alles dafür.

26. Georg, 62 — Vierzig Jahre Schule, und ich habe selten etwas erlebt, das so schnell gewirkt hat. Nach zwei Monaten kannten sich Kinder wieder mit Namen, die vorher nebeneinander gesessen und geschwiegen haben. Man sollte das an jeder Schule versuchen.`,
    questions: [
      {
        prompt: `Stimmt diese Person der These zu?
„Bastian, 36“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„jemandem etwas abnehmen“ = to take something off someone's hands. He is describing a benefit, so this is support.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Merve, 27“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„Man tut so, als …“ introduces a premise she rejects. Spotting that opening saves you reading the rest twice.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Ulf, 55“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "A conditional rejection is still a rejection. „Solange …“ tells you what would change his mind, not that he currently agrees.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Annika, 31“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The opening „Ich war anfangs skeptisch“ is a decoy — B1 opinion texts very often begin with the opposite view. Read to the end.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Timo, 44“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„Man müsste ihnen beibringen …“ in Konjunktiv II describes what is *not* happening. The closing clause accuses schools of taking the easy route.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Pia, 39“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "The hardest item in this part: she is for it in one setting and against it in her own. When a writer splits like this, weight the case they speak about with authority — here, „Ich unterrichte an einer Berufsschule“ and „Bei uns“.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Georg, 62“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "Recommending that others adopt something is unambiguous support, and it is the safest signal to look for in this task type.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-03-ordnung_sporthalle",
    level: "B1",
    title: "Nutzungsordnung der Sporthalle Ostheim",
    source: "Aushang im Eingangsbereich",
    text: `§ 1 Zutritt
Die Halle darf nur in Begleitung einer verantwortlichen Übungsleiterin oder eines Übungsleiters betreten werden. Der Schlüssel wird jeweils für eine Saison ausgegeben und darf nicht weitergegeben werden. Wer als Letzter geht, prüft Fenster und Licht.

§ 2 Schuhe
In der Halle sind ausschließlich Hallenschuhe mit heller Sohle erlaubt. Schuhe, die draußen getragen wurden, dürfen auch dann nicht benutzt werden, wenn sie sauber erscheinen. Barfußsport ist nur nach Absprache mit der Hausmeisterei zulässig.

§ 3 Geräte
Großgeräte werden ausschließlich von eingewiesenen Personen auf- und abgebaut. Nach dem Training gehören alle Geräte an ihren gekennzeichneten Platz zurück. Schäden sind unverzüglich im Hallenbuch einzutragen, auch wenn sie geringfügig erscheinen.

§ 4 Zeiten
Die zugeteilte Zeit schließt Auf- und Abbau ein. Wird eine Trainingszeit dreimal in Folge nicht genutzt, fällt sie an den Verein zurück und wird neu vergeben. Absagen sind bis achtundvierzig Stunden vorher im Sekretariat zu melden.

§ 5 Zuschauer
Zuschauer halten sich ausschließlich auf der Tribüne auf. Essen und Trinken sind dort gestattet, in der Halle selbst jedoch nicht; ausgenommen sind Wasserflaschen der Aktiven.`,
    questions: [
      {
        prompt: `Was gilt für den Hallenschlüssel?`,
        options: ["Er darf nicht an andere weitergegeben werden.", "Er muss nach jedem Training abgegeben werden.", "Er wird nur an Vereinsmitglieder ausgegeben."],
        correctIndex: 0,
        explanation: "✗ b contradicts „für eine Saison“ — if it had to be returned after every session, a season-long issue would make no sense.",
      },
      {
        prompt: `Welche Schuhe sind in der Halle erlaubt?`,
        options: ["saubere Straßenschuhe", "Hallenschuhe mit heller Sohle", "alle Sportschuhe"],
        correctIndex: 1,
        explanation: "The regulation anticipates the objection behind ✗ a and answers it directly: „auch dann nicht … wenn sie sauber erscheinen“.",
      },
      {
        prompt: `Was muss bei einem kleinen Schaden an einem Gerät geschehen?`,
        options: ["Er muss sofort eingetragen werden.", "Er muss erst am Saisonende gemeldet werden.", "Er muss von der Übungsleitung repariert werden."],
        correctIndex: 0,
        explanation: "„geringfügig“ = minor, and the clause exists precisely to close the loophole ✗ b relies on. „unverzüglich“ is standard officialese for „without delay“.",
      },
      {
        prompt: `Was passiert, wenn eine Trainingszeit mehrfach nicht genutzt wird?`,
        options: ["Sie wird verkürzt.", "Sie wird neu vergeben.", "Es wird eine Gebühr fällig."],
        correctIndex: 1,
        explanation: "„dreimal in Folge“ = three times in a row, not three times in total. Regulations are precise about this, and so are the items about them.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-04-blog_generationen",
    level: "B1",
    title: "Drei Generationen, ein Haus — und eine Waschmaschine",
    source: "aus dem Blog „Wir vier plus zwei“",
    text: `Als meine Eltern vorschlugen, das Haus umzubauen und gemeinsam einzuziehen, habe ich zwei Wochen lang nichts geantwortet. Nicht weil ich dagegen war, sondern weil ich wusste, dass ich schlecht Nein sagen kann.

Heute wohnen wir seit anderthalb Jahren zu sechst unter einem Dach: meine Eltern unten, wir mit den Kindern oben. Gefragt werde ich meistens nach dem Streit. Den gibt es, aber nicht dort, wo alle ihn vermuten. Über Erziehung sind wir uns erstaunlich einig. Gestritten wird über Technik: darüber, wann die Waschmaschine laufen darf, und ob man abends die Heizung herunterdreht.

Was wirklich hilft, ist nichts Großes. Wir haben von Anfang an vereinbart, dass niemand ohne Anmeldung in die andere Wohnung geht. Meine Mutter fand das am Anfang albern und hält sich heute strenger daran als ich.

Ehrlich gesagt hatte ich vor allem Angst vor einem Punkt, über den vorher niemand redet: dem Geld. Wer bezahlt das neue Dach? Wir haben es nach Wohnfläche aufgeteilt und alles aufgeschrieben. Das klingt kalt, hat uns aber wahrscheinlich mehr gerettet als jedes Gespräch über Gefühle.

Würde ich es wieder tun? Ja, aber nicht wegen der eingesparten Miete. Sondern weil meine Tochter jeden Nachmittag eine Treppe hinunterläuft und dort jemanden findet. Das war vorher eine Autofahrt von vierzig Minuten.

Wem ich davon abraten würde? Allen, die hoffen, dass sich alte Konflikte durch Nähe von selbst lösen. Sie werden dadurch nur täglich.`,
    questions: [
      {
        prompt: `Die Autorin war von der Idee ihrer Eltern sofort begeistert.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„Nicht weil ich dagegen war“ rules out opposition, but silence is not enthusiasm either. Both halves of her sentence matter.",
      },
      {
        prompt: `Die Familie streitet vor allem über die Erziehung der Kinder.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The text explicitly names what people assume („nicht dort, wo alle ihn vermuten“) before correcting it. That construction almost always signals an item.",
      },
      {
        prompt: `Die Familie hat eine Regel, dass man sich vor einem Besuch ankündigt.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„vereinbaren“ = to agree on. The mother's change of heart in the next sentence confirms the rule is real and in force.",
      },
      {
        prompt: `Die Kosten für den Umbau wurden mündlich geregelt.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„aufgeschrieben“ is the opposite of „mündlich“ (verbally). She adds that writing it down probably saved them, so the detail is emphasised, not incidental.",
      },
      {
        prompt: `Der wichtigste Grund für die Autorin ist, dass sie Miete spart.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "Money is mentioned twice in this text and is the right answer neither time. „nicht wegen … Sondern weil …“ names the real reason.",
      },
      {
        prompt: `Die Autorin rät Familien mit alten Konflikten von einem solchen Umzug ab.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The last sentence is short and easy to skip. „Sie werden dadurch nur täglich“ means the conflicts become daily — a warning, not a reassurance.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-04-artikel_baeume",
    level: "B1",
    title: "Der teuerste Schatten der Stadt",
    source: "Lindenauer Anzeiger",
    text: `Vierzig neue Bäume hat die Stadt Lindenau im vergangenen Jahr in der Innenstadt gepflanzt. Achtzehn davon sind bereits wieder eingegangen. Das klingt nach einem Misserfolg, ist aber laut Gartenamt eingeplant gewesen.

„Ein Straßenbaum steht in einem Loch von wenigen Kubikmetern, unter Asphalt, neben Leitungen“, erklärt die Leiterin Ines Grabowski. „Er hat es schwerer als jeder Baum im Wald.“ Entscheidend sei nicht die Zahl der gepflanzten Bäume, sondern das, was unter der Oberfläche passiert. In der Fußgängerzone wurde deshalb erstmals ein sogenanntes Pflanzsubstrat eingebaut, das Wasser speichert und trotzdem befahrbar bleibt.

Die Kosten überraschen viele. Ein einzelner Baum kostet in der Anschaffung wenige hundert Euro; die Vorbereitung des Standorts kann das Zehnfache verschlingen. Zusätzlich muss in den ersten drei Jahren regelmäßig gewässert werden, im Sommer wöchentlich.

Hilfe kommt inzwischen von Anwohnern. Rund neunzig Haushalte haben eine Patenschaft für einen Baum übernommen und gießen selbst. Grabowski ist zurückhaltend optimistisch: „Das entlastet uns spürbar. Aber wir dürfen die Verantwortung nicht auf Freiwillige abschieben. Wenn jemand in Urlaub fährt, vertrocknet der Baum trotzdem.“`,
    questions: [
      {
        prompt: `Wie bewertet das Gartenamt, dass viele Bäume eingegangen sind?`,
        options: ["Es hatte damit gerechnet.", "Es war ein unerwarteter Rückschlag.", "Es lag am zu späten Pflanzen."],
        correctIndex: 0,
        explanation: "„Das klingt nach …, ist aber …“ sets up exactly the wrong reading before correcting it. The correction is the answer.",
      },
      {
        prompt: `Was ist nach Aussage von Frau Grabowski entscheidend?`,
        options: ["die Zahl der gepflanzten Bäume", "die Bedingungen im Boden", "die Wahl der richtigen Baumart"],
        correctIndex: 1,
        explanation: "Note the Konjunktiv I „sei“ — this is reported speech, so it is her view, which is what the question asks for. ✗ c is never mentioned.",
      },
      {
        prompt: `Was sagt Frau Grabowski über die Baumpatenschaften?`,
        options: ["Sie helfen, ersetzen aber die Stadt nicht.", "Sie funktionieren in der Praxis kaum.", "Sie sind teurer als die eigene Bewässerung."],
        correctIndex: 0,
        explanation: "„zurückhaltend optimistisch“ prepares you for a two-sided answer. Both halves must be in the option, which is why a fits and b overstates the criticism.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-04-artikel_tierheim",
    level: "B1",
    title: "Ein Zuhause auf Zeit",
    source: "Lindenauer Anzeiger",
    text: `Das Tierheim Ostheim sucht seit dem Frühjahr keine dauerhaften Besitzer mehr für seine Katzen, sondern zusätzlich etwas anderes: Menschen, die ein Tier für einige Wochen bei sich aufnehmen. Pflegestellen heißt das im Fachjargon.

Ausgelöst hat die Umstellung ein praktisches Problem. Junge Katzen, die im Heim aufwachsen, kennen weder Staubsauger noch Türklingel und tun sich später in einer Wohnung schwer. „Wir haben Tiere zweimal zurückbekommen, weil sie sich versteckt haben, sobald jemand die Tür öffnete“, sagt der Leiter Hendrik Palm.

Wer eine Pflegestelle übernimmt, zahlt nichts. Futter und Tierarztkosten trägt das Heim, das Tier bleibt rechtlich in dessen Verantwortung. Erwartet wird lediglich, dass man erreichbar ist und die Tiere zu vereinbarten Terminen vorstellt.

Die größte Sorge der Interessenten ist immer dieselbe. „Alle fragen, ob man das Tier am Ende wieder hergeben kann“, sagt Palm. Er antwortet dann ehrlich: Für etwa jede fünfte Pflegestelle sei genau das der Grund, es kein zweites Mal zu tun. Andere behalten das Tier einfach — auch das komme vor und sei ausdrücklich erlaubt.`,
    questions: [
      {
        prompt: `Warum sucht das Tierheim Pflegestellen?`,
        options: ["Im Heim ist zu wenig Platz.", "Tiere aus dem Heim kennen den Alltag einer Wohnung nicht.", "Es fehlt Geld für Futter und Tierarzt."],
        correctIndex: 1,
        explanation: "✗ c is contradicted directly: the shelter itself pays for food and the vet. Lack of space is never mentioned at all.",
      },
      {
        prompt: `Welche Kosten hat eine Pflegestelle?`,
        options: ["nur die Kosten für Futter", "einen monatlichen Beitrag", "gar keine"],
        correctIndex: 2,
        explanation: "The sentence answering this is short and blunt, and the following sentence lists what the shelter covers — read both before choosing a.",
      },
      {
        prompt: `Was sagt Herr Palm über das Abgeben des Tieres am Ende?`,
        options: ["Für manche ist es so schwer, dass sie es nicht wiederholen.", "Die meisten Pflegestellen behalten das Tier.", "Es ist vertraglich verboten, das Tier zu behalten."],
        correctIndex: 0,
        explanation: "„jede fünfte“ = one in five, so ✗ b („die meisten“) overstates it badly. ✗ c is the reverse: keeping the animal is „ausdrücklich erlaubt“.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-04-forum_hunde",
    level: "B1",
    title: "Lesermeinungen: Hunde im Lokal — willkommen oder nicht?",
    source: "Online-Forum",
    text: `These: In vielen Lokalen hängt ein Schild: Hunde willkommen. Andere verbieten Tiere im Gastraum ganz. Sollen Hunde in Cafés und Restaurants erlaubt sein?

Beispiel: Uwe, 58 — Ich sitze seit dreißig Jahren mit meinem Hund im Café um die Ecke, und noch nie hat sich jemand beschwert. Das soll ruhig so bleiben.

20. Fenja, 34 — Ich bin selbst Hundehalterin und trotzdem dagegen. Nicht wegen der Hunde, sondern wegen der Menschen. Zwei Tische weiter sitzt jemand mit einer echten Angst, und der geht dann eben nach Hause. Ein Lokal muss für alle da sein, nicht nur für die, die am lautesten sind.

21. Bernd, 47 — Ich betreibe ein kleines Restaurant. Seit wir Hunde erlauben, sind unsere Mittage voll, weil wir die Einzigen in der Fußgängerzone sind. Probleme gab es in vier Jahren zweimal, und beide Male lag es am Halter. Ich würde die Entscheidung sofort wieder so treffen.

22. Sanja, 29 — Ich habe eine Tierhaarallergie, die nicht harmlos ist. Mir wird gesagt, ich solle mir eben ein anderes Lokal suchen. Nur gibt es in unserem Ort inzwischen kaum noch eines ohne Hunde. Für mich ist das keine Wahlfreiheit mehr.

23. Kolja, 41 — Man muss doch nicht alles regeln. Wer sein Lokal für Hunde öffnen will, macht das, und wer nicht, hängt ein Schild an die Tür. Genau so funktioniert es bei uns seit Jahren, und ich sehe keinen Grund, daran etwas zu ändern.

24. Almut, 62 — Als Kellnerin sage ich Ihnen: Das Problem ist nicht das Tier, das unter dem Tisch schläft. Das Problem ist die Leine quer durch den Gang, wenn ich mit vier Tellern komme. Solange das niemand ernst nimmt, halte ich Hunde im Gastraum für keine gute Idee.

25. Ravi, 36 — Ich war anfangs skeptisch, ehrlich gesagt vor allem aus hygienischen Gründen. Dann habe ich gelesen, dass in vielen Ländern Tiere im Lokal völlig normal sind, ohne dass dort jemand krank wird. Seitdem finde ich meine damalige Sorge übertrieben.

26. Steffen, 51 — Wir haben zu Hause zwei Hunde und lassen sie beim Essengehen trotzdem daheim. Nicht weil ich es anderen verbieten möchte — es soll jeder selbst wissen. Aber ein Restaurant ist für mich der eine Ort, an dem ich mich einmal um nichts kümmern will.`,
    questions: [
      {
        prompt: `Stimmt diese Person der These zu?
„Fenja, 34“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "She states her position in the first sentence, which is unusual in this task and makes the rest an explanation rather than a turn.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Bernd, 47“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„Probleme gab es … zweimal“ sounds negative in isolation, but he immediately attributes them to owners and confirms his decision.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Sanja, 29“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "She never uses the word „dagegen“. The rejection is in the closing sentence, which says the supposed free choice does not exist for her.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Kolja, 41“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The subtlest item here. He argues against *regulation*, which in practice means keeping permission — the proposition asks whether dogs should be allowed, and he says yes, per venue.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Almut, 62“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "She distinguishes the sleeping dog from the lead across the aisle. The concession does not soften the verdict in the last sentence.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Ravi, 36“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„Ich war anfangs skeptisch“ is a decoy opening. „damalig“ marks the worry as belonging to the past.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Steffen, 51“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "Personal preference and position on the rule point in opposite directions. Always check the answer against the exact proposition — here, whether dogs should be *allowed*.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-04-ordnung_garten",
    level: "B1",
    title: "Gartenordnung des Kleingartenvereins Sonnenhang",
    source: "Aushang am Vereinshaus",
    text: `§ 1 Nutzung
Jede Parzelle ist zu mindestens einem Drittel gärtnerisch zu nutzen, das heißt für Obst, Gemüse oder Kräuter. Reine Rasenflächen zählen dabei nicht mit. Die Vorstandschaft prüft dies einmal jährlich im Juni.

§ 2 Arbeitseinsätze
Jedes Mitglied leistet vier Arbeitseinsätze zu je drei Stunden pro Jahr. Wer nicht teilnehmen kann, zahlt für jeden versäumten Einsatz fünfundzwanzig Euro. Eine Vertretung durch Familienangehörige ist zulässig und muss vorher nicht angemeldet werden.

§ 3 Ruhezeiten
Motorgeräte dürfen werktags von neun bis zwölf und von fünfzehn bis achtzehn Uhr betrieben werden. An Sonn- und Feiertagen sind sie ganztägig untersagt. Handbetriebene Geräte sind von dieser Regelung nicht betroffen.

§ 4 Tiere
Hunde sind auf den Wegen an der Leine zu führen. Die Haltung von Tieren auf der Parzelle ist nicht gestattet; ausgenommen sind Bienenvölker nach Absprache mit der Vorstandschaft.

§ 5 Wasser
Die Wasserleitung wird jeweils Anfang April geöffnet und Ende Oktober geschlossen. Das Sammeln von Regenwasser ist ausdrücklich erwünscht. Das Befüllen von Planschbecken über die Vereinsleitung ist nicht erlaubt.`,
    questions: [
      {
        prompt: `Was passiert, wenn ein Mitglied einen Arbeitseinsatz versäumt?`,
        options: ["Es muss einen Ersatztermin nachholen.", "Es zahlt einen Betrag pro versäumtem Einsatz.", "Es verliert die Parzelle."],
        correctIndex: 1,
        explanation: "Note „für jeden“ — the amount is per missed session, not a single flat fee. Regulations are precise about this and so are the items.",
      },
      {
        prompt: `Wann darf am Sonntag der Rasen mit einem Motormäher gemäht werden?`,
        options: ["vormittags zwischen neun und zwölf", "gar nicht", "nur nach Absprache mit dem Vorstand"],
        correctIndex: 1,
        explanation: "✗ a takes the times from the previous sentence, which is explicitly limited to „werktags“. Reusing a real number from the wrong sentence is the standard distractor here.",
      },
      {
        prompt: `Welche Tiere darf man auf der Parzelle halten?`,
        options: ["keine, außer Bienen nach Absprache", "Hunde, wenn sie angeleint sind", "alle Kleintiere"],
        correctIndex: 0,
        explanation: "✗ b confuses two different things: the lead rule is about walking a dog on the paths, not about keeping animals on a plot.",
      },
      {
        prompt: `Was gilt für das Wasser?`,
        options: ["Die Leitung ist das ganze Jahr geöffnet.", "Regenwasser darf nicht gesammelt werden.", "Planschbecken dürfen nicht aus der Leitung befüllt werden."],
        correctIndex: 2,
        explanation: "✗ b inverts the text („ausdrücklich erwünscht“). ✗ a ignores the April-to-October window. Both distractors here are simple reversals — check the direction of each statement.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-05-blog_tandem",
    level: "B1",
    title: "Sechs Monate Sprachtandem — und was mich daran überrascht hat",
    source: "aus dem Blog „Zwischen zwei Sprachen“",
    text: `Angemeldet habe ich mich aus einem einzigen Grund: Ich wollte endlich flüssiger sprechen. Nach zwei Jahren Kurs verstand ich fast alles und brachte trotzdem keinen Satz heraus, ohne ihn vorher im Kopf zu bauen.

Mein Tandempartner heißt Robert, ist siebenundfünfzig und lernt Portugiesisch, weil seine Tochter nach Lissabon gezogen ist. Wir treffen uns jeden Dienstag, eine Stunde Deutsch, eine Stunde Portugiesisch. Vermittelt hat uns die Stadtbibliothek, kostenlos.

Die erste Überraschung kam sofort. Ich hatte erwartet, dass mich vor allem die Grammatik bremst. Tatsächlich sind es die kleinen Wörter: doch, halt, eben, mal. In keinem Lehrbuch stand, dass „Setz dich doch mal“ freundlich klingt und „Setz dich“ wie ein Befehl.

Die zweite Überraschung war unangenehmer. Robert korrigiert mich fast nie. Am Anfang fand ich das höflich, nach zwei Monaten hat es mich geärgert. Als ich es angesprochen habe, sagte er, er verstehe mich ja, und wolle mich nicht ständig unterbrechen. Wir haben uns dann auf eine Regel geeinigt: Er notiert Fehler und wir gehen sie am Ende gemeinsam durch. Seitdem funktioniert es.

Hat es geholfen? Mein Wortschatz ist kaum größer geworden, meine Aussprache auch nicht wesentlich besser. Aber ich denke beim Sprechen nicht mehr an die Satzstellung, und das war ja der Punkt.

Eines sollte man wissen, bevor man anfängt: Ein Tandem ersetzt keinen Kurs. Wer die Grundlagen noch nicht hat, sitzt eine Stunde da und nickt. Das habe ich bei zwei Leuten erlebt, die nach drei Wochen nicht mehr gekommen sind.`,
    questions: [
      {
        prompt: `Der Autor hatte vor dem Tandem Probleme, Deutsch zu verstehen.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "The sentence contrasts the two skills directly. „trotzdem“ tells you the second half runs against the first.",
      },
      {
        prompt: `Für die Vermittlung des Tandems musste der Autor bezahlen.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "A single word at the end of the sentence answers the item. Short additions after a comma are easy to skip and often carry the key.",
      },
      {
        prompt: `Am schwierigsten war für den Autor die Grammatik.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 1,
        explanation: "„Ich hatte erwartet …“ followed by „Tatsächlich …“ is the standard way German sets up an expectation and then corrects it.",
      },
      {
        prompt: `Der Autor und Robert haben eine gemeinsame Lösung für das Korrigieren gefunden.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "The paragraph opens with a complaint and closes with the fix. Stopping at the complaint gives the opposite answer.",
      },
      {
        prompt: `Beim Sprechen muss der Autor nicht mehr über die Satzstellung nachdenken.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "Two things did not improve and one did. The „Aber“ marks the switch, and the closing clause says this was the goal all along.",
      },
      {
        prompt: `Der Autor hält ein Tandem für Anfänger ohne Vorkenntnisse für ungeeignet.`,
        options: ["Richtig", "Falsch"],
        correctIndex: 0,
        explanation: "„da sitzen und nicken“ is a vivid way of saying you understand nothing. The two people who stopped coming confirm the judgement.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-05-artikel_amtsbus",
    level: "B1",
    title: "Das Amt kommt jetzt vorbei",
    source: "Lindenauer Anzeiger",
    text: `Seit acht Monaten fährt ein umgebauter Bus durch die Dörfer im Kreis Lindenau. An Bord: zwei Mitarbeiterinnen des Bürgerbüros, ein Drucker und ein Gerät für Passfotos. Wer einen Ausweis verlängern oder eine Meldebescheinigung braucht, muss nicht mehr in die Kreisstadt.

Der Anlass war keine Bürgerbeschwerde, sondern eine Rechnung. Nach der Schließung von vier kleinen Außenstellen fielen die Mietkosten weg, die Fahrten der Bürgerinnen und Bürger aber nicht. „Uns wurde vorgerechnet, dass die Menschen zusammen achtzigtausend Kilometer im Jahr fahren, um zu uns zu kommen“, sagt Amtsleiterin Bettina Sorge. „Da fährt der Bus günstiger.“

Genutzt wird das Angebot anders als gedacht. Erwartet hatte man vor allem ältere Menschen. Tatsächlich sind die meisten Kundinnen und Kunden berufstätig und kommen, weil der Bus bis achtzehn Uhr bleibt — länger als das Büro in der Kreisstadt geöffnet hat.

Eine Sache funktioniert bislang nicht. Anträge, die eine Unterschrift von zwei Behörden brauchen, kann der Bus nicht abschließen. Diese Fälle werden aufgenommen und später per Post erledigt, was die Sache eher verlängert. Sorge räumt das offen ein: „Wir haben es versprochen und können es nicht halten. Das nehmen uns die Leute übel, und zwar zu Recht.“`,
    questions: [
      {
        prompt: `Warum wurde der Bus eingeführt?`,
        options: ["Bürger hatten sich über die weiten Wege beschwert.", "Er war günstiger als die bisherige Lösung.", "Die Kreisstadt hatte kein Bürgerbüro mehr."],
        correctIndex: 1,
        explanation: "✗ a is named and rejected in the same sentence — „keine Bürgerbeschwerde, sondern eine Rechnung“. ✗ c is wrong: the town office still exists and has shorter hours.",
      },
      {
        prompt: `Wer nutzt den Bus vor allem?`,
        options: ["ältere Menschen", "Familien mit Kindern", "Berufstätige"],
        correctIndex: 2,
        explanation: "Same pattern as the blog in Teil 1: „Erwartet hatte man …“ then „Tatsächlich …“. Once you spot it, the answer is always in the second half.",
      },
      {
        prompt: `Wie geht die Amtsleiterin mit dem Problem der komplizierten Anträge um?`,
        options: ["Sie gibt den Fehler offen zu.", "Sie hält das Problem für unwichtig.", "Sie gibt der Post die Schuld."],
        correctIndex: 0,
        explanation: "„jemandem etwas übelnehmen“ = to hold something against someone. „und zwar zu Recht“ means she agrees they are right to — that is the admission.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-05-artikel_kleidertausch",
    level: "B1",
    title: "Volle Schränke, leere Regale",
    source: "Lindenauer Anzeiger",
    text: `Viermal im Jahr verwandelt sich die Turnhalle in Rehberg in einen Kleiderladen ohne Kasse. Wer kommt, bringt Kleidung mit, die er nicht mehr trägt, und nimmt mit, was ihm gefällt. Gezählt wird nichts, gezahlt wird nichts.

Organisiert wird die Tauschbörse von Meike Vandenberg, die eigentlich Physiotherapeutin ist. Angefangen hat sie aus Ärger über den eigenen Schrank. „Ich hatte vierzig Oberteile und trug sechs davon“, sagt sie. „Wegwerfen wollte ich sie nicht, verkaufen war mir zu mühsam.“

Die größte Schwierigkeit ist nicht der Andrang, sondern das, was übrig bleibt. Rund ein Drittel der abgegebenen Stücke findet keinen neuen Besitzer, meist Herrenkleidung in großen Größen und Winterjacken im Frühjahr. Der Rest geht an eine Kleiderkammer, die allerdings nicht alles annehmen kann.

Vandenberg hat deshalb eine Regel eingeführt, die zunächst unbeliebt war: Pro Person höchstens zwei Taschen. „Vorher kamen Leute mit dem Kofferraum voll und haben uns ihren Keller überlassen“, sagt sie. Seit der Begrenzung ist die Qualität der Sachen spürbar besser geworden, und die Halle ist abends fast leer.`,
    questions: [
      {
        prompt: `Warum hat Frau Vandenberg die Tauschbörse gegründet?`,
        options: ["Sie wollte Geld verdienen.", "Sie ärgerte sich über ihren eigenen vollen Schrank.", "Sie suchte einen Ausgleich zu ihrem Beruf."],
        correctIndex: 1,
        explanation: "Her profession is mentioned only to note it is unrelated („die eigentlich Physiotherapeutin ist“), which is what makes ✗ c tempting.",
      },
      {
        prompt: `Worin besteht die größte Schwierigkeit?`,
        options: ["Es kommen zu viele Menschen.", "Die Halle ist zu klein.", "Ein Teil der Kleidung bleibt übrig."],
        correctIndex: 2,
        explanation: "„der Andrang“ = the crowd, and it is explicitly ruled out. „nicht … sondern …“ once more marks the key sentence.",
      },
      {
        prompt: `Was hat die Begrenzung auf zwei Taschen bewirkt?`,
        options: ["Es kommen weniger Menschen.", "Die mitgebrachten Sachen sind besser.", "Die Kleiderkammer nimmt jetzt alles an."],
        correctIndex: 1,
        explanation: "The rule was unpopular at first, which sets you up to expect a downside. The result reported is entirely positive.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-05-forum_sprache",
    level: "B1",
    title: "Lesermeinungen: Formulare in einfacher Sprache — nötig oder nicht?",
    source: "Online-Forum",
    text: `These: Viele Ämter schreiben ihre Formulare inzwischen zusätzlich in einfacher Sprache: kurze Sätze, bekannte Wörter, keine Fachbegriffe. Sollen alle Behörden das anbieten müssen?

Beispiel: Regine, 45 — Ich habe drei Jahre in einer Beratungsstelle gearbeitet. Die Hälfte meiner Zeit ging fürs Vorlesen und Erklären drauf. Das könnte man sich sparen.

20. Ferhat, 38 — Ich lebe seit sechs Jahren hier und spreche gut Deutsch. Trotzdem habe ich beim Wohngeldantrag dreimal nachfragen müssen. Wenn ein Formular selbst mich überfordert, dann liegt das nicht an mir. Es kostet den Staat übrigens auch Geld, wenn alles falsch ausgefüllt zurückkommt.

21. Hanna, 52 — Ich arbeite in einem Amt und schreibe solche Texte. Was dabei entsteht, ist rechtlich oft nicht mehr dasselbe. Wenn ich „Sie müssen das bis zum 1. März machen“ schreibe, fehlt genau die Ausnahme, die für zwanzig Prozent der Fälle gilt. Dann klagt jemand, und zwar zu Recht.

22. Momo, 26 — Es geht doch gar nicht nur um Menschen mit anderer Muttersprache. Meine Großmutter ist hier geboren und versteht diese Sätze auch nicht. Ein Formular soll gelesen und nicht bewundert werden. Ich verstehe nicht, warum das überhaupt eine Diskussion ist.

23. Egon, 67 — Klar klingt das gut. Nur kenne ich diese Versprechen: Erst wird ein neues Amt gegründet, dann werden Stellen geschaffen, und am Ende ist das Formular noch immer unverständlich, nur doppelt so lang. Ich glaube nicht, dass eine Pflicht daran etwas ändert.

24. Lisbeth, 33 — Ich bin Logopädin und arbeite mit Menschen nach einem Schlaganfall. Für viele von ihnen ist ein normales Amtsschreiben eine unüberwindbare Mauer. Dass so etwas freiwillig sein soll, verstehe ich bis heute nicht.

25. Aleksandar, 44 — Sinnvoll wäre es schon. Nur würde ich nicht bei den Formularen anfangen, sondern bei den Bescheiden, die man hinterher bekommt. Das Formular füllt man einmal aus; den Bescheid muss man verstehen, sonst weiß man nicht, wogegen man Widerspruch einlegen könnte.

26. Ute, 59 — Wir haben es in unserer Behörde vor zwei Jahren eingeführt, zuerst nur bei drei Formularen. Die Zahl der Rückfragen ist um mehr als die Hälfte gesunken. Ich hätte nicht gedacht, dass der Unterschied so deutlich ausfällt.`,
    questions: [
      {
        prompt: `Stimmt diese Person der These zu?
„Ferhat, 38“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "He establishes his own competence first („spreche gut Deutsch“) so that the criticism lands on the form. That structure signals support.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Hanna, 52“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "Her objection is practical rather than hostile, but it is still a rejection. Note she is the one *writing* these texts — an insider's warning.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Momo, 26“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„Ich verstehe nicht, warum das überhaupt eine Diskussion ist“ is strong agreement expressed as puzzlement.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Egon, 67“`,
        options: ["Ja", "Nein"],
        correctIndex: 1,
        explanation: "„Klar klingt das gut“ is a concession, not agreement. The proposition asks about an obligation, and that is precisely what he rejects.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Lisbeth, 33“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The sentence is phrased as incomprehension at the status quo. Rejecting „freiwillig“ means supporting the obligation.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Aleksandar, 44“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "The hardest item here. Proposing a different starting point is not opposition — he never questions the idea itself, only the order.",
      },
      {
        prompt: `Stimmt diese Person der These zu?
„Ute, 59“`,
        options: ["Ja", "Nein"],
        correctIndex: 0,
        explanation: "„Ich hätte nicht gedacht, dass …“ signals a pleasant surprise, which reinforces rather than qualifies the positive result.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b1-05-ordnung_wohnanlage",
    level: "B1",
    title: "Hausordnung der Wohnanlage Lindenhof",
    source: "Aushang im Treppenhaus",
    text: `§ 1 Ruhezeiten
Von zweiundzwanzig bis sieben Uhr sowie sonntags ganztägig ist Zimmerlautstärke einzuhalten. Musizieren ist werktags für höchstens zwei Stunden täglich gestattet, jedoch nicht zwischen dreizehn und fünfzehn Uhr.

§ 2 Treppenhaus und Flure
Flure und Treppenhäuser sind Fluchtwege und daher freizuhalten. Kinderwagen dürfen im Erdgeschoss unter der Treppe abgestellt werden, Fahrräder ausschließlich im Fahrradkeller. Schuhe und Schränke vor der Wohnungstür sind nicht zulässig.

§ 3 Waschküche
Die Waschküche wird über den Plan an der Tür belegt. Jede Partei darf höchstens zwei Termine im Voraus eintragen. Wer einen eingetragenen Termin dreimal nicht nutzt, verliert für den laufenden Monat das Recht auf Vorausbuchung.

§ 4 Müll
Papier, Verpackungen und Restmüll werden getrennt. Sperrmüll gehört nicht in den Hof; die Abholung ist bei der Stadt anzumelden. Wer Sperrmüll unangemeldet abstellt, trägt die Kosten der Entsorgung.

§ 5 Grillen und Garten
Grillen ist auf den Balkonen untersagt, im Gemeinschaftsgarten dagegen erlaubt, sofern die Nachbarn zwei Tage vorher informiert werden. Die Gartenmöbel stehen allen Parteien zur Verfügung und sind nach der Nutzung zu reinigen.`,
    questions: [
      {
        prompt: `Wann darf ein Bewohner Klavier üben?`,
        options: ["sonntags am Nachmittag", "werktags um sechzehn Uhr", "werktags um vierzehn Uhr"],
        correctIndex: 1,
        explanation: "Three conditions have to hold at once: a weekday, outside 13–15, and not Sunday. ✗ c falls inside the forbidden window, ✗ a on the quiet day.",
      },
      {
        prompt: `Was darf im Treppenhaus abgestellt werden?`,
        options: ["Fahrräder", "Kinderwagen im Erdgeschoss", "Schuhe vor der Wohnungstür"],
        correctIndex: 1,
        explanation: "The paragraph gives the reason first — these are escape routes — and then one narrow exception. Everything else in the list is forbidden.",
      },
      {
        prompt: `Was passiert, wenn jemand gebuchte Waschtermine mehrfach nicht nutzt?`,
        options: ["Er zahlt eine Gebühr.", "Er darf einen Monat lang nicht vorausbuchen.", "Er darf die Waschküche gar nicht mehr benutzen."],
        correctIndex: 1,
        explanation: "✗ c overstates the consequence — a very common distractor in regulations. Only the advance booking right is withdrawn, and only for that month.",
      },
      {
        prompt: `Was gilt für das Grillen?`,
        options: ["Es ist überall verboten.", "Es ist auf dem Balkon erlaubt.", "Es ist im Garten nach Ankündigung erlaubt."],
        correctIndex: 2,
        explanation: "„sofern“ = provided that, and it introduces the condition that makes c right rather than merely „im Garten erlaubt“. Conditions matter as much as permissions.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b2-01-text_3",
    level: "B2",
    title: "Die Stadt dreht sich leiser",
    source: "Weidenbacher Wochenblatt",
    text: `Zwei Jahre lang hat die Stadt Weidenbach gemessen, wie laut sie ist. An 42 Punkten hingen Sensoren, die rund um die Uhr aufzeichneten; parallel dazu konnten Anwohnerinnen und Anwohner über eine App melden, wann sie sich gestört fühlten. Das Ergebnis, das nun vorliegt, hat die Verwaltung selbst überrascht.

Die lautesten Straßen sind nämlich nicht die, über die am meisten geklagt wird. Entlang der vierspurigen Ostumgehung, wo die Sensoren die höchsten Dauerwerte registrierten, gingen kaum Meldungen ein. Die große Mehrheit der Beschwerden kam aus zwei vergleichsweise ruhigen Wohnvierteln.

„Das klingt widersprüchlich, ist aber gut erklärbar“, sagt die Akustikerin Ines Falkner, die das Projekt begleitet hat. „An gleichmäßigen Lärm gewöhnen wir uns erstaunlich gut. Wach hält uns das einzelne Ereignis — ein Container, der um halb sechs geleert wird, eine Tür, die um zwei Uhr nachts zuschlägt.“ In den Mittelwerten, mit denen Lärmschutz üblicherweise geplant wird, verschwinden solche Spitzen fast vollständig.

Weidenbach hat daraus zunächst die billigsten Konsequenzen gezogen. Glascontainer wurden aus zwei Innenhöfen verlegt, für die Müllabfuhr gilt in Wohngebieten eine früheste Startzeit, und Lieferfahrzeuge dürfen bestimmte Straßen erst ab sieben Uhr befahren. Gekostet hat das einen niedrigen fünfstelligen Betrag. Die Zahl der nächtlichen Meldungen ging im Folgejahr um gut ein Drittel zurück.

Die teuren Maßnahmen stehen dagegen noch aus. Der sogenannte Flüsterasphalt, über den für die Ostumgehung diskutiert wird, würde mehrere Millionen kosten und die Dauerwerte um wenige Dezibel senken — also ausgerechnet dort, wo sich ohnehin kaum jemand beschwert. Im Stadtrat ist der Vorschlag umstritten. Falkner selbst hält sich zurück: Messwerte allein sagten nichts darüber, was einer Stadt wichtig sein solle.

Kritik kommt von anderer Seite. Der Mieterverein weist darauf hin, dass die App vor allem dort genutzt wurde, wo die Menschen ohnehin gut organisiert sind. Wer an einer Ausfallstraße wohnt und nachts arbeitet, meldet selten etwas. Wird künftig nach Beschwerden geplant, könnte ausgerechnet die am stärksten belastete Gruppe leer ausgehen.

Die Verwaltung hat diesen Einwand aufgenommen und will die Sensoren weitere zwei Jahre hängen lassen — diesmal ergänzt um Messungen in Wohnungen, deren Bewohner sich nie gemeldet haben.`,
    questions: [
      {
        prompt: `Was war für die Verwaltung an den Ergebnissen überraschend?`,
        options: ["Gerade die lautesten Straßen führten kaum zu Beschwerden.", "Die Sensoren maßen insgesamt niedrigere Werte als erwartet.", "Die App wurde entlang der Ostumgehung besonders häufig benutzt."],
        correctIndex: 0,
        explanation: "c inverts the finding — the app was barely used there. b is never stated: the text compares where the noise is with where the complaints are, not the levels with a forecast.",
      },
      {
        prompt: `Warum bilden Mittelwerte die Belastung laut Falkner schlecht ab?`,
        options: ["Sie werden überwiegend am Tag erhoben.", "Kurze, einzelne Ereignisse fallen in ihnen kaum ins Gewicht.", "Sie erfassen vierspurige Straßen nicht zuverlässig."],
        correctIndex: 1,
        explanation: "The sensors ran round the clock, so a is contradicted by the first paragraph. c confuses the road with the method.",
      },
      {
        prompt: `Nach welchem Gesichtspunkt hat die Stadt ihre ersten Maßnahmen ausgewählt?`,
        options: ["Sie waren preiswert.", "Sie senkten die gemessenen Dauerwerte am stärksten.", "Sie waren im Stadtrat unumstritten."],
        correctIndex: 0,
        explanation: "b describes what the expensive measure would do, and the text says it would help where nobody complains. The dispute in the council (c) concerns the later, costly proposal.",
      },
      {
        prompt: `Wie äußert sich Ines Falkner zum Flüsterasphalt?`,
        options: ["Sie hält ihn für überflüssig.", "Sie empfiehlt ihn trotz der Kosten.", "Sie sieht die Entscheidung nicht als eine Frage von Messwerten."],
        correctIndex: 2,
        explanation: "Declining to judge is not the same as judging against it, which is what a claims. The article, not Falkner, points out that the money would go where nobody complains.",
      },
      {
        prompt: `Was kritisiert der Mieterverein?`,
        options: ["Die App habe technisch unzuverlässig gearbeitet.", "Wer sich nicht meldet, könnte bei der Planung übergangen werden.", "Es sei an zu wenigen Punkten gemessen worden."],
        correctIndex: 1,
        explanation: "The objection is about who uses the app, not whether it works (a) or how many sensors there were (c).",
      },
      {
        prompt: `Wie geht die Verwaltung mit diesem Einwand um?`,
        options: ["Sie weist ihn als unbegründet zurück.", "Sie erweitert die Untersuchung um zusätzliche Messungen.", "Sie stellt das Projekt vorerst ein."],
        correctIndex: 1,
        explanation: "The sensors stay up for two more years, which rules out c; „aufgenommen“ rules out a.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b2-02-text_3",
    level: "B2",
    title: "Die Halle ist voll, der Verein ist leer",
    source: "Sallberger Rundschau",
    text: `Wer die Zahlen des Kreissportbunds liest, könnte den Eindruck bekommen, die Menschen bewegten sich immer weniger. Achtzehn Prozent weniger Mitglieder in zehn Jahren, in einigen Sparten mehr. Nur stimmt der Eindruck nicht: Gelaufen, geschwommen und geklettert wird heute mehr als je zuvor. Was zurückgeht, ist nicht der Sport, sondern die Mitgliedschaft.

„Die Leute wollen trainieren, nicht beitreten“, sagt Ute Fahrenkamp, die den Bund seit sechs Jahren führt. Ihre Erhebung unter zweitausend Menschen zwischen zwanzig und vierzig zeigt ein deutliches Bild: Nicht der Jahresbeitrag schreckt ab — er liegt bei den meisten Vereinen unter dem Preis eines Monats im Fitnessstudio. Abschreckend wirken die Bindung an feste Trainingszeiten und die unausgesprochene Erwartung, irgendwann ein Amt zu übernehmen.

Genau dort liegt aber das Problem der Vereine, denn ohne Ämter gibt es sie nicht. Ein Verein braucht einen Vorstand, eine Kasse, eine Person, die die Halle aufschließt. In Weidenbach mussten im vergangenen Jahr zwei Vereine aufgeben, nicht aus Geldmangel, sondern weil sich für den Vorstand niemand fand.

Einige Vereine haben reagiert und die Mitgliedschaft aufgebrochen. Der TSV Nordwiese verkauft seit zwei Jahren Zehnerkarten fürs Hallentraining, ohne Beitritt und ohne Kündigungsfrist. Das Ergebnis überraschte den Vorstand: Die Zahl der Trainierenden verdoppelte sich, und etwa jeder fünfte Kartenkäufer trat nach einigen Monaten doch ein. Der Weg führte also über das Ausprobieren, nicht über die Überzeugung.

Nicht alle halten das für den richtigen Weg. Der Landesverband warnt, ein Verein sei kein Dienstleister; wer nur Leistungen verkaufe, züchte sich Kundschaft heran statt einer Gemeinschaft, und in fünf Jahren fehlten die Ehrenamtlichen erst recht. Fahrenkamp widerspricht dem nicht grundsätzlich, hält den Einwand aber für zu spät: Wer heute niemanden mehr in die Halle bekomme, brauche über den Vorstand von übermorgen nicht zu reden.

Einig sind sich beide Seiten in einem Punkt, und er hat mit Sport wenig zu tun: Ämter müssen kleiner werden. Ein Vorstandsposten, der zehn Stunden pro Woche kostet, findet niemanden mehr. Drei Posten mit je drei Stunden finden ihre Leute.`,
    questions: [
      {
        prompt: `Was zeigen die Zahlen des Kreissportbunds bei genauerem Hinsehen?`,
        options: ["Die Menschen treiben insgesamt weniger Sport.", "Sport wird getrieben, aber seltener im Verein.", "Vor allem ältere Mitglieder treten aus."],
        correctIndex: 1,
        explanation: "a is the impression the article sets up in order to refute it — reading only the first two sentences produces exactly that answer.",
      },
      {
        prompt: `Was schreckt laut der Erhebung von einem Beitritt ab?`,
        options: ["Der Jahresbeitrag im Vergleich zum Fitnessstudio.", "Feste Zeiten und die Erwartung, ein Amt zu übernehmen.", "Das Fehlen geeigneter Sportstätten."],
        correctIndex: 1,
        explanation: "The fee is named only to rule it out, and the comparison with the gym is what rules it out.",
      },
      {
        prompt: `Warum mussten in Weidenbach zwei Vereine aufgeben?`,
        options: ["Es fand sich niemand für den Vorstand.", "Die Beiträge deckten die Kosten nicht mehr.", "Ihnen wurde die Halle gekündigt."],
        correctIndex: 0,
        explanation: "Money is mentioned precisely to exclude it, which is why b is offered.",
      },
      {
        prompt: `Was hat der TSV Nordwiese mit seinen Zehnerkarten erreicht?`,
        options: ["Die Beiträge der bestehenden Mitglieder sanken.", "Doppelt so viele Trainierende, und ein Teil trat später bei.", "Die Zahl der Ehrenamtlichen stieg deutlich."],
        correctIndex: 1,
        explanation: "c is what the Landesverband doubts will happen — the article never reports it.",
      },
      {
        prompt: `Was befürchtet der Landesverband?`,
        options: ["Dass die Vereine finanziell überfordert werden.", "Dass aus Mitgliedern Kundschaft wird und später Ehrenamtliche fehlen.", "Dass die Angebote qualitativ schlechter werden."],
        correctIndex: 1,
        explanation: "The objection is about what the club becomes, not about money or quality.",
      },
      {
        prompt: `Worin sind sich beide Seiten am Ende einig?`,
        options: ["Dass Ämter in kleinere Aufgaben geteilt werden müssen.", "Dass Zehnerkarten überall eingeführt werden sollten.", "Dass die Beiträge steigen müssen."],
        correctIndex: 0,
        explanation: "The ten-session pass is exactly what they disagree about, so b inverts the paragraph.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b2-03-text_3",
    level: "B2",
    title: "Lieber nicht wissen",
    source: "Nordwieser Zeitung",
    text: `Etwa jede vierte erwachsene Person in Deutschland will Nachrichten inzwischen gezielt aus dem Weg gehen — nicht aus Desinteresse, sondern weil sie den Umgang damit nicht mehr aushält. Die Fachwelt nennt das Nachrichtenvermeidung, und sie beobachtet den Anstieg seit gut zehn Jahren.

„Der erste Reflex ist, den Leuten Gleichgültigkeit vorzuwerfen“, sagt die Medienforscherin Rebekka Ohlwein. „Unsere Daten zeigen fast das Gegenteil.“ In ihren Befragungen sind es nicht die Uninteressierten, die abschalten, sondern überdurchschnittlich häufig Menschen, die sich vorher intensiv informiert haben. Wer nichts erwartet, wird auch nicht enttäuscht; wer viel erwartet hat, schon.

Als Hauptgrund nennen die Befragten nicht die Menge, sondern das Gefühl, nichts tun zu können. Ohnmacht ist in ihren Zahlen der stärkste Einzelfaktor, deutlich vor Zeitmangel und deutlich vor politischem Misstrauen. Wer einen Bericht liest, in dem eine Katastrophe geschildert und keine Handlungsmöglichkeit genannt wird, schaltet beim nächsten Mal eher ab.

Einige Redaktionen haben darauf reagiert und berichten zusätzlich über Lösungsversuche — was funktioniert hat, wo, unter welchen Bedingungen. Die Wirkung ist messbar, aber kleiner, als die Verfechter dieses Ansatzes gern behaupten: In kontrollierten Studien lesen die Versuchspersonen anschließend etwas länger weiter, ihre Einschätzung der Lage verändert sich jedoch kaum.

Ohlwein warnt vor der naheliegenden Schlussfolgerung. Der Ausweg könne nicht darin bestehen, unangenehme Nachrichten wegzulassen; eine Redaktion, die nur noch berichte, was aushaltbar sei, gebe ihre Aufgabe auf. „Wir haben es nicht mit einem Problem der Nachricht zu tun, sondern mit einem Problem der Dosis und des Rahmens.“

Praktisch heißt das: feste Zeiten statt ständiger Meldungen, Einordnung statt Eilmeldung. In einer Untersuchung mit zweihundert Teilnehmenden führte allein die Umstellung auf zweimal täglich statt dauerhaft dazu, dass sich die Betroffenen besser informiert fühlten — bei objektiv gleichem Wissensstand.`,
    questions: [
      {
        prompt: `Wer meidet laut den Daten von Rebekka Ohlwein besonders häufig Nachrichten?`,
        options: ["Menschen, die sich vorher intensiv informiert haben.", "Menschen, die sich noch nie für Politik interessiert haben.", "Vor allem jüngere Menschen unter dreißig."],
        correctIndex: 0,
        explanation: "b is the „erster Reflex“ the article quotes precisely in order to contradict it.",
      },
      {
        prompt: `Was nennen die Befragten als Hauptgrund?`,
        options: ["Die schiere Menge an Meldungen.", "Das Gefühl, ohnehin nichts ändern zu können.", "Misstrauen gegenüber der Politik."],
        correctIndex: 1,
        explanation: "a and c both appear in the same sentence — as the factors that come second and third.",
      },
      {
        prompt: `Wie fällt die Wirkung des lösungsorientierten Berichtens aus?`,
        options: ["Sie ist nachweisbar, aber geringer als behauptet.", "Sie lässt sich bisher nicht nachweisen.", "Sie verändert die Einschätzung der Lage deutlich."],
        correctIndex: 0,
        explanation: "The sentence contains both halves of the answer, and each half rules out one distractor.",
      },
      {
        prompt: `Wovor warnt Ohlwein?`,
        options: ["Davor, unangenehme Nachrichten wegzulassen.", "Davor, zu viele Lösungsvorschläge zu bringen.", "Davor, Nachrichten nur noch zu festen Zeiten zu senden."],
        correctIndex: 0,
        explanation: "c inverts her recommendation — fixed times are what she suggests, not what she warns against.",
      },
      {
        prompt: `Worin sieht sie das eigentliche Problem?`,
        options: ["In den Themen der Berichterstattung.", "In der Menge und in der Art der Einordnung.", "In der Ausbildung der Journalistinnen und Journalisten."],
        correctIndex: 1,
        explanation: "The metaphor is the answer: dose and frame, not the substance.",
      },
      {
        prompt: `Was ergab die Untersuchung mit zweihundert Teilnehmenden?`,
        options: ["Die Teilnehmenden wussten hinterher messbar mehr.", "Die Teilnehmenden fühlten sich besser informiert, wussten aber nicht mehr.", "Die Teilnehmenden lasen insgesamt seltener Nachrichten."],
        correctIndex: 1,
        explanation: "Feeling and knowing are separated in one sentence — a is exactly the half the sentence denies.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b2-04-text_3",
    level: "B2",
    title: "Die Praxis, die keiner übernehmen will",
    source: "Hohenroder Anzeiger",
    text: `Als Dr. Almut Riedesel im Frühjahr ihre Praxis in Hohenrode abgab, hatte sie vier Jahre lang eine Nachfolge gesucht. Gefunden hat sie am Ende keine einzelne Person, sondern eine Lösung, die vor zehn Jahren noch niemand vorgeschlagen hätte: Die Gemeinde kaufte die Praxis und stellt nun zwei Ärztinnen in Teilzeit an.

Dass Praxen auf dem Land schwer zu besetzen sind, ist bekannt. Weniger bekannt ist, woran es tatsächlich liegt. „Alle reden über das Geld“, sagt Riedesel, „dabei war das nie mein Problem.“ In den Gesprächen mit möglichen Nachfolgerinnen sei es fast immer um etwas anderes gegangen: um die wirtschaftliche Verantwortung für eine eigene Praxis und um die Arbeitszeiten. Wer eine Praxis übernimmt, übernimmt einen Betrieb mit Personal, Miete und Kredit — und ist damit an einen Ort gebunden.

Das Modell, das Hohenrode nun gefunden hat, dreht genau diesen Punkt um. Die Gemeinde trägt die Räume und das Risiko, die Ärztinnen bringen ihre Arbeit mit und teilen sich die Stelle. Beide arbeiten an drei Tagen, beide haben Kinder im Schulalter, und beide hätten die Praxis allein nach eigener Aussage nicht übernommen.

Bezahlt hat die Gemeinde dafür rund vierhunderttausend Euro, verteilt über zehn Jahre. Bürgermeister Kai Übelacker rechnet trotzdem mit einem Gewinn: „Ein Dorf ohne Arzt verliert danach den Kindergarten und dann die jungen Familien. Das kostet uns ein Vielfaches.“

Ob sich das Modell übertragen lässt, ist offen. Die Kassenärztliche Vereinigung sieht es zurückhaltend und verweist darauf, dass nicht jede Gemeinde vierhunderttausend Euro aufbringen könne; wo das Geld fehle, entstehe am Ende ein Gefälle zwischen reichen und armen Gemeinden. Riedesel hält dagegen, dass ihre Gemeinde nicht reich sei, sondern nur früh angefangen habe.

Einig sind sich beide Seiten immerhin darin, dass die Teilzeit kein Randthema ist. Von den Medizinstudierenden, die in diesem Jahr ihren Abschluss machen, wollen nach einer Befragung der Universität Weidenbach zwei Drittel nicht in Vollzeit arbeiten — unabhängig davon, ob sie aufs Land gehen oder in die Stadt.`,
    questions: [
      {
        prompt: `Wie wurde die Nachfolge in Hohenrode gelöst?`,
        options: ["Die Gemeinde kaufte die Praxis und beschäftigt zwei Ärztinnen.", "Eine junge Ärztin übernahm die Praxis allein.", "Die Praxis wurde mit einer Klinik zusammengelegt."],
        correctIndex: 0,
        explanation: "b is what the article says did not happen — she looked for one person for four years and did not find one.",
      },
      {
        prompt: `Was war laut Riedesel nicht der Hauptgrund für die Schwierigkeiten?`,
        options: ["Die Arbeitszeiten.", "Das Einkommen.", "Die wirtschaftliche Verantwortung."],
        correctIndex: 1,
        explanation: "a and c are the two reasons she gives in the following sentence — the question asks for the one she rules out.",
      },
      {
        prompt: `Was ändert sich für die beiden Ärztinnen durch das Modell?`,
        options: ["Sie verdienen mehr als in einer eigenen Praxis.", "Sie tragen das wirtschaftliche Risiko nicht selbst.", "Sie müssen keine Sprechstunden mehr anbieten."],
        correctIndex: 1,
        explanation: "The article never compares earnings, which is what makes a sound plausible.",
      },
      {
        prompt: `Womit begründet der Bürgermeister die Ausgabe?`,
        options: ["Die Praxis werde sich in zehn Jahren selbst tragen.", "Ohne Arzt verliere das Dorf weitere Einrichtungen und Familien.", "Das Land habe die Hälfte der Kosten übernommen."],
        correctIndex: 1,
        explanation: "The four hundred thousand is spread over ten years, which is what makes a sound like the argument. It is not.",
      },
      {
        prompt: `Was wendet die Kassenärztliche Vereinigung ein?`,
        options: ["Die medizinische Qualität leide unter der Teilzeit.", "Ärmere Gemeinden könnten sich das Modell nicht leisten.", "Gemeinden dürften rechtlich keine Praxen betreiben."],
        correctIndex: 1,
        explanation: "The objection is about which municipalities can afford it, not about whether it is allowed or any good.",
      },
      {
        prompt: `Was zeigt die Befragung der Universität Weidenbach?`,
        options: ["Zwei Drittel der künftigen Ärztinnen und Ärzte wollen keine Vollzeitstelle.", "Zwei Drittel wollen nach dem Abschluss aufs Land gehen.", "Zwei Drittel halten eine eigene Praxis für erstrebenswert."],
        correctIndex: 0,
        explanation: "The sentence anticipates b and rules it out in its second half.",
      },
    ],
  },
  {
    kind: "choice",
    id: "b2-05-text_3",
    level: "B2",
    title: "Abends noch die Schulbank",
    source: "Weidenbacher Wochenblatt",
    text: `Rund jede vierte erwerbstätige Person in Deutschland hat im vergangenen Jahr an einer beruflichen Weiterbildung teilgenommen. Diese Zahl klingt zunächst ordentlich. Sieht man genauer hin, zerfällt sie in zwei sehr ungleiche Hälften.

Denn wer teilnimmt, hat meist ohnehin schon einen Abschluss. Unter Beschäftigten mit Hochschulabschluss liegt der Anteil bei über vierzig Prozent, unter Beschäftigten ohne abgeschlossene Ausbildung bei unter zehn. „Weiterbildung verstärkt bestehende Unterschiede, statt sie auszugleichen“, sagt die Bildungsforscherin Petra Sudmann, die diese Zahlen seit Jahren erhebt.

Als Grund vermuten viele die Kosten. Sudmanns Befragungen zeigen etwas anderes: Genannt werden zuerst die Zeit und, mit deutlichem Abstand dahinter, die Sorge, sich zu blamieren. Wer dreißig Jahre nicht in einem Kursraum gesessen hat, meldet sich nicht leichtfertig zu einem Kurs an, in dem alle anderen jünger sind und schneller mitschreiben.

Einige Betriebe haben darauf reagiert, und zwar mit erstaunlich schlichten Mitteln. Die Sallberger Kunststoffwerke haben ihre Kurse aus dem Abend in die Arbeitszeit verlegt und die Gruppen nach Vorkenntnissen getrennt. Die Teilnahme unter angelernten Beschäftigten stieg innerhalb von zwei Jahren von acht auf einunddreißig Prozent.

Übertragbar ist das nur bedingt. Ein Betrieb mit vierhundert Beschäftigten kann Kurse selbst anbieten; ein Handwerksbetrieb mit sechs kann das nicht, und für ihn bedeutet jede Freistellung eine spürbare Lücke. Die Handwerkskammer fordert deshalb einen Ausgleich für kleine Betriebe und verweist darauf, dass es genau dort am meisten fehle.

Sudmann sieht das ähnlich, warnt aber vor zu viel Hoffnung auf Geld allein: „Wir haben Programme gesehen, die vollständig finanziert waren und trotzdem leer blieben. Wer nicht hingeht, geht meistens nicht wegen des Preises nicht hin.“`,
    questions: [
      {
        prompt: `Was zeigt sich, wenn man die Teilnahmezahl genauer betrachtet?`,
        options: ["Sie ist in Wirklichkeit deutlich höher.", "Sie verteilt sich sehr ungleich auf verschiedene Gruppen.", "Sie ist seit Jahren rückläufig."],
        correctIndex: 1,
        explanation: "The article never gives a trend over time, which is what makes c sound plausible.",
      },
      {
        prompt: `Was sagt Petra Sudmann über die Wirkung von Weiterbildung?`,
        options: ["Sie gleicht Unterschiede zwischen den Gruppen aus.", "Sie hat auf die Unterschiede keinen Einfluss.", "Sie verstärkt bestehende Unterschiede."],
        correctIndex: 2,
        explanation: "a is in the same sentence — after „statt“, which is what marks it as the thing that does not happen.",
      },
      {
        prompt: `Was nennen die Befragten als wichtigsten Grund für eine Nichtteilnahme?`,
        options: ["Die fehlende Zeit.", "Die Kosten.", "Das fehlende Interesse."],
        correctIndex: 0,
        explanation: "„Als Grund vermuten viele die Kosten“ is the assumption the next sentence corrects.",
      },
      {
        prompt: `Was haben die Sallberger Kunststoffwerke verändert?`,
        options: ["Sie zahlen den Teilnehmenden eine Prämie.", "Sie schicken alle Beschäftigten verpflichtend in Kurse.", "Sie bieten die Kurse in der Arbeitszeit und nach Vorkenntnissen getrennt an."],
        correctIndex: 2,
        explanation: "The article calls the measures „erstaunlich schlicht“, which rules out anything as heavy-handed as b.",
      },
      {
        prompt: `Was fordert die Handwerkskammer?`,
        options: ["Einen Ausgleich für kleine Betriebe.", "Eine Pflicht zur Weiterbildung für alle Betriebe.", "Kürzere Kurse für Handwerksberufe."],
        correctIndex: 0,
        explanation: "The demand follows from the gap between a firm of four hundred and one of six.",
      },
      {
        prompt: `Wovor warnt Sudmann am Ende?`,
        options: ["Davor, Kurse in die Arbeitszeit zu legen.", "Davor, sich allein von Geld eine Lösung zu erhoffen.", "Davor, kleine Betriebe zu unterstützen."],
        correctIndex: 1,
        explanation: "„Sudmann sieht das ähnlich“ rules out c — she agrees with the chamber and adds a caveat.",
      },
    ],
  },
];

const MATCHING_PASSAGES: LesenMatchingPassage[] = [
  {
    kind: "matching",
    id: "b1-01-zuordnung-anzeigen",
    level: "B1",
    title: "Anzeigen zuordnen",
    source: "Kleinanzeigen",
    instruction: `Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige. Schreiben Sie in diesem Fall 0.`,
    options: [
      { id: "a", title: "Sprachcafé Español", text: `Jeden Dienstag ab 19 Uhr treffen wir uns in der Stadtbibliothek und unterhalten uns auf Spanisch – über Reisen, Filme, das Leben. Kein Unterricht, kein Lehrbuch, keine Anmeldung, keine Gebühr. Grundkenntnisse ab Niveau A2 sollten Sie mitbringen. Einfach vorbeikommen.` },
      { id: "b", title: "Gitarrenunterricht für Erwachsene", text: `Sie wollten schon immer Gitarre spielen? Einzelunterricht bei erfahrenem Musiklehrer, auch für absolute Anfänger. Termine flexibel nach Absprache, auf Wunsch auch bei Ihnen zu Hause. Erste Stunde kostenlos zum Kennenlernen. Leihinstrument vorhanden.` },
      { id: "c", title: "Offene Nähwerkstatt", text: `Samstags von 10 bis 16 Uhr steht unsere Werkstatt allen offen. Zehn Maschinen und Schnittmuster sind vorhanden, Stoffe bringen Sie bitte selbst mit. Materialkosten werden nach Verbrauch abgerechnet. Anmeldung bis Donnerstag erforderlich, da die Plätze begrenzt sind.` },
      { id: "d", title: "Smartphone und Tablet – Kurs für Senioren", text: `Schritt für Schritt und in aller Ruhe: Wir zeigen Ihnen, wie Sie Nachrichten schreiben, Fotos verschicken und Apps installieren. Acht Vormittagstermine, Gruppen mit höchstens sechs Personen. Bringen Sie Ihr eigenes Gerät mit. Kursgebühr 40 Euro.` },
      { id: "e", title: "Laufgruppe Waldstadt", text: `Jeden Sonntag um 9 Uhr, Treffpunkt Parkplatz am Waldrand. Wir laufen in zwei Gruppen, damit wirklich alle mitkommen – von Anfängern bis Fortgeschrittenen. Die Teilnahme ist kostenlos, eine Anmeldung ist nicht nötig. Bei Dauerregen fällt der Termin aus.` },
      { id: "f", title: "Bewerbungstraining", text: `Wie schreibe ich einen überzeugenden Lebenslauf? Wie verhalte ich mich im Vorstellungsgespräch? An zwei Tagen üben wir beides, mit Videoaufnahme und persönlicher Rückmeldung. Für Arbeitssuchende kostenlos. Anmeldung über die Agentur für Arbeit.` },
      { id: "g", title: "Kochkurs Indische Küche", text: `Vier Freitagabende lang kochen wir gemeinsam: Currys, Brot, Süßspeisen. Alle Zutaten sind im Preis enthalten, gegessen wird zusammen am großen Tisch. Höchstens zehn Personen. 95 Euro für alle vier Termine.` },
      { id: "h", title: "Fahrradwerkstatt zum Selbermachen", text: `Mittwochs von 16 bis 20 Uhr können Sie bei uns Ihr Rad selbst reparieren. Werkzeug leihen wir Ihnen, und wenn Sie nicht weiterwissen, helfen unsere Ehrenamtlichen. Ersatzteile gibt es günstig vor Ort. Wir bitten um eine kleine Spende.` },
      { id: "i", title: "Yoga in der Mittagspause", text: `30 Minuten Übungen für Rücken und Nacken, jeden Werktag von 12.00 bis 12.30 Uhr, mitten in der Innenstadt. Duschen sind vorhanden, Matten stellen wir. Zehnerkarte 75 Euro, Einzelstunde 9 Euro. Bitte bequeme Kleidung mitbringen.` },
      { id: "j", title: "Hundebetreuung Sonnenhof", text: `Sie müssen beruflich verreisen? Wir betreuen Ihren Hund tageweise oder über das ganze Wochenende, mit großem Auslauf und täglich zwei langen Spaziergängen. Auch kurzfristige Anfragen sind meist möglich. Preise auf Anfrage.` },
    ],
    targets: [
      {
        id: "t13",
        prompt: `Frau Özdemir hat früher in Spanien gelebt und möchte ihr Spanisch nicht verlernen. Sie sucht eine Möglichkeit, regelmäßig zu sprechen, ohne dafür zu bezahlen.`,
        correctOptionId: "a",
        explanation: "Two conditions must both be met: speaking practice and free of charge. Ad a satisfies both, and her prior experience covers the A2 requirement.",
      },
      {
        id: "t14",
        prompt: `Herr Klein ist seit drei Monaten ohne Arbeit. Er möchte üben, wie man sich in einem Gespräch bei einer Firma richtig vorstellt.`,
        correctOptionId: "f",
        explanation: "„sich vorstellen“ in the situation and „Vorstellungsgespräch“ in the ad are the same idea. His unemployment also matches „Für Arbeitssuchende kostenlos“.",
      },
      {
        id: "t15",
        prompt: `Ihre Kollegin sitzt den ganzen Tag am Schreibtisch und hat Rückenschmerzen. In der Mittagspause hat sie höchstens eine halbe Stunde Zeit.`,
        correctOptionId: "i",
        explanation: "Three details line up exactly: back, 30 minutes, lunchtime. When an ad matches on three points it is almost certainly the key.",
      },
      {
        id: "t16",
        prompt: `Ein Freund hat ein altes Fahrrad geschenkt bekommen und möchte es gern selbst wieder in Ordnung bringen. Werkzeug besitzt er allerdings nicht.`,
        correctOptionId: "h",
        explanation: "„selbst wieder in Ordnung bringen“ = repair it himself. The missing tools are the second condition, and the ad lends them.",
      },
      {
        id: "t17",
        prompt: `Ihre Mutter ist 72 Jahre alt und hat zum Geburtstag ein Smartphone bekommen. Sie kommt damit überhaupt nicht zurecht und traut sich nicht, es auszuprobieren.`,
        correctOptionId: "d",
        explanation: "Her age matches „für Senioren“, and „in aller Ruhe“ plus groups of six answers her lack of confidence.",
      },
      {
        id: "t18",
        prompt: `Herr Brandt sucht für seine achtjährige Tochter einen Schwimmkurs, der am Nachmittag stattfindet.`,
        correctOptionId: "0",
        explanation: "Every paper has exactly one situation with no matching ad. Two things rule out all ten ads here: swimming, and a child. Do not force a near-match — if nothing fits, 0 is the answer.",
      },
      {
        id: "t19",
        prompt: `Sie möchten am Wochenende gemeinsam mit anderen etwas für Ihre Kondition tun und dabei kein Geld ausgeben.`,
        correctOptionId: "e",
        explanation: "Sunday satisfies „am Wochenende“, running satisfies „Kondition“ (fitness/stamina), and it is free. Ad i also involves exercise but costs money and runs on weekdays.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b1-02-zuordnung-anzeigen",
    level: "B1",
    title: "Anzeigen zuordnen",
    source: "Kleinanzeigen",
    instruction: `Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige. Schreiben Sie in diesem Fall 0.`,
    options: [
      { id: "a", title: "Ferienwohnung am Bodensee", text: `Helle Zweizimmerwohnung für zwei bis vier Personen, fünf Minuten zu Fuß zum Ufer. Küche, Balkon, Waschmaschine. In der Nebensaison deutlich günstiger. Nichtraucherwohnung; Haustiere können wir leider nicht aufnehmen. Mindestaufenthalt drei Nächte.` },
      { id: "b", title: "Geführte Wanderwoche in den Alpen", text: `Sieben Tage von Hütte zu Hütte, täglich vier bis fünf Stunden Gehzeit. Mittlere Kondition genügt, technische Erfahrung ist nicht nötig. Ihr großes Gepäck wird jeden Tag zur nächsten Unterkunft gebracht. Kleine Gruppen, deutschsprachige Leitung.` },
      { id: "c", title: "Rückenschule für Erwachsene", text: `Zehn Termine, dienstags und donnerstags abends, Übungen für Rücken und Nacken in kleinen Gruppen. Der Kurs ist von den Krankenkassen anerkannt: Die meisten erstatten achtzig Prozent der Gebühr. Bitte Sportkleidung und ein Handtuch mitbringen.` },
      { id: "d", title: "Fahrradverleih und Werkstatt am Bahnhof", text: `Räder für einen Tag, ein Wochenende oder eine ganze Woche, auch Kinderanhänger und E-Bikes. Kleine Reparaturen erledigen wir während Sie warten. Täglich von 7 bis 20 Uhr geöffnet, Abgabe außerhalb der Öffnungszeiten nach Absprache möglich.` },
      { id: "e", title: "Sprachreise Italienisch", text: `Zwei Wochen Unterricht am Vormittag, nachmittags Ausflüge und Kochkurse. Sie wohnen bei einer Gastfamilie und sprechen auch abends Italienisch. Für Erwachsene ab achtzehn Jahren, alle Niveaus von Anfängern bis Fortgeschrittenen.` },
      { id: "f", title: "Stadtführung „Verborgenes Lindenau“", text: `Jeden Sonntag um elf Uhr zeigen wir Ihnen Höfe, Treppen und Gassen, an denen Sie sonst vorbeigehen. Dauer etwa neunzig Minuten. Die Teilnahme kostet nichts; über eine Spende am Ende freuen wir uns. Treffpunkt ist der Brunnen am Marktplatz.` },
      { id: "g", title: "Ernährungsberatung Grünewald", text: `Einzeltermine zu Ernährung bei Allergien, hohem Blutdruck oder einfach zum Abnehmen. Auf Wunsch auch als Videogespräch von zu Hause aus. Mit ärztlicher Bescheinigung übernimmt Ihre Krankenkasse häufig einen Teil der Kosten.` },
      { id: "h", title: "Campingplatz Seeblick", text: `Stellplätze für Zelte, Wohnwagen und Wohnmobile, direkt am Wasser. Sanitärgebäude neu gebaut, Stromanschluss an jedem Platz. Hunde sind bei uns ausdrücklich willkommen und dürfen an der eigenen Wiese frei laufen. Von April bis Oktober geöffnet.` },
      { id: "i", title: "Schwimmkurs für Erwachsene", text: `Nie schwimmen gelernt oder viel zu lange nicht mehr im Wasser gewesen? In acht Abenden nehmen wir Ihnen in einer kleinen Gruppe die Angst. Dienstags ab neunzehn Uhr im Hallenbad. Höchstens sechs Personen pro Kurs.` },
      { id: "j", title: "Reisemedizinische Beratung", text: `Vor Fernreisen beraten wir Sie zu Impfungen, Malariaschutz und der richtigen Reiseapotheke. Bitte kommen Sie mindestens sechs Wochen vor der Abreise und bringen Sie Ihren Impfpass mit. Termine nur nach vorheriger Vereinbarung.` },
    ],
    targets: [
      {
        id: "t13",
        prompt: `Frau Hoffmann sitzt beruflich viel und hat oft Rückenschmerzen. Sie möchte etwas dagegen tun, aber nicht die vollen Kosten selbst tragen.`,
        correctOptionId: "c",
        explanation: "Two conditions: the back, and not paying the full price. Ad g also involves a health insurance contribution but is about nutrition, not backs.",
      },
      {
        id: "t14",
        prompt: `Ein Kollege will im Sommer zwei Wochen lang Italienisch lernen und dabei bei einer Familie wohnen, um auch außerhalb des Unterrichts zu sprechen.`,
        correctOptionId: "e",
        explanation: "Three details line up: Italian, two weeks, and a host family. When an ad matches on three points it is almost certainly the key.",
      },
      {
        id: "t15",
        prompt: `Ihre Nachbarn möchten mit dem Wohnwagen und ihrem Hund verreisen und suchen einen Platz am Wasser.`,
        correctOptionId: "h",
        explanation: "The dog is what decides it. Ad a is also by the water but says „Haustiere können wir leider nicht aufnehmen“ — always check the exclusions.",
      },
      {
        id: "t16",
        prompt: `Herr Vollmer fliegt in zwei Monaten beruflich nach Indien und weiß nicht, welche Impfungen er braucht.`,
        correctOptionId: "j",
        explanation: "The timing is a second check, not decoration: the ad asks for six weeks' notice, and he has two months.",
      },
      {
        id: "t17",
        prompt: `Sie möchten am Sonntag Ihre eigene Stadt einmal anders kennenlernen und dabei kein Geld ausgeben.`,
        correctOptionId: "f",
        explanation: "„über eine Spende freuen wir uns“ is a request, not a price. Free plus Sunday plus your own city: all three match.",
      },
      {
        id: "t18",
        prompt: `Eine Freundin sucht für sich und ihren Mann einen Tanzkurs am Wochenende.`,
        correctOptionId: "0",
        explanation: "Every paper has exactly one situation with no matching ad. Courses do appear (c, e, i), but none of them is dancing. Do not force a near-match.",
      },
      {
        id: "t19",
        prompt: `Ihre Eltern wollen eine Woche in den Bergen wandern. Schwere Rucksäcke möchten sie aber nicht mehr tragen.`,
        correctOptionId: "b",
        explanation: "The luggage transfer is the deciding detail. „mittlere Kondition genügt“ also fits older walkers, which supports the same answer.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b1-03-zuordnung-anzeigen",
    level: "B1",
    title: "Anzeigen zuordnen",
    source: "Kleinanzeigen",
    instruction: `Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige. Schreiben Sie in diesem Fall 0.`,
    options: [
      { id: "a", title: "Klavierunterricht für Späteinsteiger", text: `Sie wollten es immer schon, hatten aber nie Zeit? Einzelstunden von dreißig oder sechzig Minuten, Termine auch spät am Abend. Ein Instrument zum Üben ist nicht nötig: In den ersten Monaten dürfen Sie in unseren Räumen kostenlos üben. Erste Stunde unverbindlich.` },
      { id: "b", title: "Handy-Reparatur Sofortdienst", text: `Display gebrochen, Akku leer nach zwei Stunden? Die häufigsten Reparaturen erledigen wir in unter einer Stunde, während Sie warten. Auf jede Reparatur geben wir zwölf Monate Garantie. Kostenvoranschlag vorab und kostenlos, auch wenn Sie sich dagegen entscheiden.` },
      { id: "c", title: "Computerhilfe bei Ihnen zu Hause", text: `Drucker verbindet sich nicht, WLAN reicht nicht bis ins Schlafzimmer, das Update will nicht? Wir kommen zu Ihnen, erklären in Ruhe und ohne Fachwörter. Besonders geeignet für Menschen, die ungern telefonisch beraten werden. Abrechnung nach angefangenen halben Stunden.` },
      { id: "d", title: "Kammerchor Lindenau sucht Stimmen", text: `Wir proben mittwochs von neunzehn bis einundzwanzig Uhr und geben vier Konzerte im Jahr. Noten lesen müssen Sie nicht können, ein sicheres Gehör sollten Sie mitbringen. Vor der Aufnahme singen Sie kurz allein vor. Zwei Probeabende sind kostenlos.` },
      { id: "e", title: "Volkslauf Ostheim", text: `Fünf und zehn Kilometer, Start am Sportplatz um zehn Uhr. Anmeldung bis Freitag online oder am Morgen vor Ort. Startgebühr zwölf Euro, für Vereinsmitglieder acht. Jeder Teilnehmer bekommt Verpflegung unterwegs und ein Getränk im Ziel. Bei Gewitter fällt die Veranstaltung aus.` },
      { id: "f", title: "Fotokurs: Mit dem Handy fotografieren", text: `Sie brauchen keine teure Kamera. An drei Abenden zeigen wir Ihnen Bildaufbau, Licht und die wichtigsten Einstellungen, die jedes Telefon mitbringt. Bringen Sie einfach Ihr eigenes Gerät mit. Für alle Systeme geeignet, kleine Gruppen bis acht Personen.` },
      { id: "g", title: "Theater am Markt — Abonnement", text: `Sechs Vorstellungen pro Spielzeit, immer am selben Wochentag und auf demselben Platz. Sie sparen gegenüber Einzelkarten rund ein Drittel. Können Sie einmal nicht, tauschen wir den Termin kostenlos um. Für Menschen unter siebenundzwanzig zum halben Preis.` },
      { id: "h", title: "Repair-Treff im Gemeindehaus", text: `Jeden dritten Samstag reparieren wir gemeinsam, was noch zu retten ist: Toaster, Lampen, Radios. Wir helfen, machen es aber nicht für Sie. Ersatzteile müssen Sie selbst besorgen. Werkzeug ist vorhanden, die Teilnahme kostet nichts.` },
      { id: "i", title: "TSV Ostheim — Probetraining", text: `Volleyball, Basketball und Turnen für Erwachsene. Sie dürfen dreimal unverbindlich mittrainieren, bevor Sie sich entscheiden. Sportkleidung genügt, Hallenschuhe leihen wir. Trainingszeiten und Hallenplan finden Sie auf unserer Internetseite.` },
      { id: "j", title: "Stadtarchiv — Beratung zur Familienforschung", text: `Sie möchten wissen, woher Ihre Familie kommt? Wir zeigen Ihnen, welche Bücher und Register es gibt und wie man sie liest. Beratung donnerstags nach Anmeldung, jeweils eine Stunde. Bringen Sie mit, was Sie schon haben, auch alte Fotos.` },
    ],
    targets: [
      {
        id: "t13",
        prompt: `Herr Nowak ist sechzig und möchte endlich ein Instrument lernen. Ein eigenes Klavier hat er nicht und will vorerst auch keines kaufen.`,
        correctOptionId: "a",
        explanation: "The missing instrument is the deciding condition, and the ad addresses it directly rather than merely offering lessons.",
      },
      {
        id: "t14",
        prompt: `Ihre Tante bekommt ihren neuen Drucker nicht zum Laufen. Am Telefon versteht sie die Erklärungen nicht und wünscht sich jemanden vor Ort.`,
        correctOptionId: "c",
        explanation: "The printer is only half of it. The ad matches the second condition too, and that is what makes it the key rather than a near miss.",
      },
      {
        id: "t15",
        prompt: `Eine Kollegin singt gern, kann aber keine Noten lesen. Sie sucht eine Gruppe, die regelmäßig auftritt.`,
        correctOptionId: "d",
        explanation: "„auftreten“ = to perform, which the four concerts satisfy. Watch the modal verbs: „müssen … nicht“ (need not) versus „sollten“ (ought to) separate the requirement from the recommendation.",
      },
      {
        id: "t16",
        prompt: `Ein Freund möchte im Sommer einen Halbmarathon laufen und sucht vorher einen kürzeren Wettkampf zum Ausprobieren.`,
        correctOptionId: "e",
        explanation: "You need to know a half marathon is about 21 km to see that five or ten is shorter. Numbers in situations often require this kind of everyday knowledge.",
      },
      {
        id: "t17",
        prompt: `Ihre Nachbarin hat einen alten Radioapparat geerbt, der nicht mehr funktioniert. Sie möchte ihn nicht wegwerfen und selbst Hand anlegen.`,
        correctOptionId: "h",
        explanation: "„selbst Hand anlegen“ = to do it yourself. The ad's rule that helpers assist but do not take over is exactly what she wants.",
      },
      {
        id: "t18",
        prompt: `Herr Baumann sucht einen Sprachkurs für Französisch am Abend.`,
        correctOptionId: "0",
        explanation: "Every paper has exactly one situation with no matching ad. Courses do appear (a, f, i), which makes the temptation real — but none of them teaches a language.",
      },
      {
        id: "t19",
        prompt: `Sie möchten regelmäßig ins Theater gehen, wissen aber nie lange vorher, an welchem Abend Sie Zeit haben.`,
        correctOptionId: "g",
        explanation: "A subscription with fixed dates looks like the wrong answer for someone with an unpredictable diary — until you reach the free exchange clause. Read the whole ad before rejecting it.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b1-04-zuordnung-anzeigen",
    level: "B1",
    title: "Anzeigen zuordnen",
    source: "Kleinanzeigen",
    instruction: `Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige. Schreiben Sie in diesem Fall 0.`,
    options: [
      { id: "a", title: "Leihgroßeltern gesucht", text: `Sie haben Zeit und Lust auf Kinder, aber keine eigenen Enkel in der Nähe? Wir bringen Familien und ältere Menschen zusammen. Ein Nachmittag pro Woche genügt. Wir begleiten das erste Kennenlernen und bleiben Ansprechpartner, falls es einmal nicht passt.` },
      { id: "b", title: "Hundeschule Wiesengrund", text: `Gruppenkurse für junge Hunde und Einzelstunden bei Problemen wie Ziehen an der Leine oder Bellen an der Tür. Wir arbeiten ohne Strafen. Das erste Gespräch führen wir am Telefon und kostenlos, damit Sie den passenden Kurs finden.` },
      { id: "c", title: "Kleingartenverein Sonnenhang", text: `Zwei Parzellen mit je dreihundert Quadratmetern werden frei. Laube und Wasseranschluss vorhanden. Vier Arbeitseinsätze im Jahr sind Pflicht. Bewerbungen bitte schriftlich; die Warteliste ist lang, kurzfristig können wir leider nichts anbieten.` },
      { id: "d", title: "Ferienbetreuung in den Sommerferien", text: `Zwei Wochen Programm für Kinder von sechs bis zwölf Jahren, täglich von acht bis sechzehn Uhr. Ausflüge, Werkstatt, viel draußen. Mittagessen inklusive. Anmeldung nur für ganze Wochen möglich, Ermäßigung für Geschwisterkinder.` },
      { id: "e", title: "Tierpension Am Waldrand", text: `Wir betreuen Katzen und Kleintiere, während Sie verreist sind. Jedes Tier hat einen eigenen Raum mit Fenster. Bitte bringen Sie das gewohnte Futter mit. Buchung in den Ferienmonaten möglichst drei Monate im Voraus.` },
      { id: "f", title: "Nachbarschaftshilfe Lindenau", text: `Einkaufen, ein Formular ausfüllen, eine Glühbirne wechseln: Für kleine Handgriffe vermitteln wir Freiwillige aus dem eigenen Viertel. Kostenlos, aber nur für Dinge, die höchstens eine Stunde dauern. Erreichbar montags bis freitags vormittags.` },
      { id: "g", title: "Erste Hilfe am Kind", text: `Ein Kurs für Eltern, Großeltern und alle, die regelmäßig auf Kinder aufpassen. An einem Samstag lernen Sie, was bei Fieberkrampf, Verschlucken und Stürzen zu tun ist. Keine Vorkenntnisse nötig, Wiederholung nach zwei Jahren empfohlen.` },
      { id: "h", title: "Straßenfest Rehberg — Helfer gesucht", text: `Am zweiten Septemberwochenende feiert unser Viertel. Wir suchen Leute für Aufbau, Kuchentheke und Abbau, jeweils in Schichten von zwei Stunden. Wer mitmacht, bekommt Essen und Getränke frei. Bitte melden Sie sich bis Ende Juli.` },
      { id: "i", title: "Baumpatenschaft übernehmen", text: `Übernehmen Sie einen jungen Straßenbaum vor Ihrer Tür. Sie gießen von Mai bis September etwa einmal pro Woche; Gießsäcke und eine kurze Einweisung stellen wir. Wer in Urlaub fährt, sucht sich bitte eine Vertretung in der Nachbarschaft.` },
      { id: "j", title: "Repair-Werkstatt für Fahrräder und Kinderwagen", text: `Jeden zweiten Donnerstag von sechzehn bis zwanzig Uhr. Werkzeug und Rat sind kostenlos, Ersatzteile berechnen wir zum Einkaufspreis. Auch Anhänger und Roller reparieren wir gern. Kommen Sie ohne Anmeldung vorbei.` },
    ],
    targets: [
      {
        id: "t13",
        prompt: `Frau Talberg ist siebzig, ihre Enkel wohnen weit weg. Sie hätte gern regelmäßig Kontakt zu einem Kind in ihrer Nähe.`,
        correctOptionId: "a",
        explanation: "The ad's opening question restates her situation almost word for word — the clearest kind of match in this task.",
      },
      {
        id: "t14",
        prompt: `Ein Kollege hat einen jungen Hund, der an der Leine stark zieht. Er möchte vorher wissen, welcher Kurs überhaupt sinnvoll wäre.`,
        correctOptionId: "b",
        explanation: "Both conditions again: the specific problem, and wanting advice before committing. Only one ad offers both.",
      },
      {
        id: "t15",
        prompt: `Berufstätige Eltern suchen für ihre neunjährige Tochter eine Betreuung in den Sommerferien, tagsüber und mit Essen.`,
        correctOptionId: "d",
        explanation: "Check the age band against the child's age: nine falls inside six to twelve. Ads often exclude on exactly that detail.",
      },
      {
        id: "t16",
        prompt: `Sie fahren drei Wochen weg und suchen jemanden, der Ihre beiden Katzen versorgt. Zu Hause soll das nicht passieren.`,
        correctOptionId: "e",
        explanation: "„Zu Hause soll das nicht passieren“ is the condition that decides it: a pension takes the animals in, which is what she wants.",
      },
      {
        id: "t17",
        prompt: `Ein frisch gebackener Großvater möchte lernen, was er tun muss, wenn sich sein Enkel verschluckt.`,
        correctOptionId: "g",
        explanation: "„frisch gebacken“ is an idiom meaning newly minted. The ad names both the audience (grandparents) and the exact emergency.",
      },
      {
        id: "t18",
        prompt: `Herr Kestner sucht kurzfristig einen Schrebergarten, den er noch in dieser Saison übernehmen kann.`,
        correctOptionId: "0",
        explanation: "The hardest item here, and a deliberate near miss: the topic matches perfectly and the ad still rules him out. When an ad excludes the deciding condition, the answer is 0 — not that ad.",
      },
      {
        id: "t19",
        prompt: `Ihre Nachbarn möchten etwas für das Grün in der Straße tun, sind im August aber drei Wochen verreist.`,
        correctOptionId: "i",
        explanation: "Compare with item 18: there the holiday would have been a blocker, here the ad has a rule for exactly that case. Read the small print in both directions.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b1-05-zuordnung-anzeigen",
    level: "B1",
    title: "Anzeigen zuordnen",
    source: "Kleinanzeigen",
    instruction: `Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige. Schreiben Sie in diesem Fall 0.`,
    options: [
      { id: "a", title: "Sprachtandem der Stadtbibliothek", text: `Wir bringen Menschen zusammen, die die Sprache des anderen lernen möchten. Sie treffen sich selbstständig, wann und wo Sie wollen. Voraussetzung sind Grundkenntnisse ab Niveau A2 — ganz ohne Vorkenntnisse funktioniert ein Tandem erfahrungsgemäß nicht. Die Vermittlung ist kostenlos.` },
      { id: "b", title: "Änderungsschneiderei Kaya", text: `Hosen kürzen, Reißverschlüsse erneuern, Jacken enger machen. Kleinere Arbeiten sind innerhalb von zwei Tagen fertig, bei Bedarf auch am selben Tag gegen Aufpreis. Wir ändern auch Kleidung, die Sie nicht bei uns gekauft haben. Kostenvoranschlag beim Anprobieren.` },
      { id: "c", title: "Begleitung zu Ämtern", text: `Sie haben einen Termin bei einer Behörde und sind unsicher, ob Sie alles verstehen? Ehrenamtliche begleiten Sie und erklären danach in Ruhe, was besprochen wurde. Wir übersetzen nicht, aber wir sprechen langsam und einfach. Anmeldung eine Woche vorher.` },
      { id: "d", title: "Selbstbehauptungskurs für Frauen", text: `An zwei Samstagen üben wir Stimme, Haltung und einfache Techniken. Kein Sport, keine Vorkenntnisse, jedes Alter. Die Gruppe ist auf zwölf Personen begrenzt. Der Kurs findet in der Sporthalle statt; bequeme Kleidung genügt, Schuhe mit heller Sohle bitte mitbringen.` },
      { id: "e", title: "Schlüsseldienst Lindenau — Notdienst", text: `Tür zugefallen, Schlüssel drinnen? Wir sind rund um die Uhr erreichbar und in der Regel innerhalb von dreißig Minuten da. Festpreis am Telefon, keine versteckten Zuschläge. Bitte halten Sie einen Ausweis bereit, wir öffnen nur, wenn Sie dort wohnen.` },
      { id: "f", title: "Kleidertauschbörse Rehberg", text: `Viermal im Jahr, samstags von zehn bis sechzehn Uhr in der Turnhalle. Bringen Sie mit, was Sie nicht mehr tragen, und nehmen Sie mit, was Ihnen gefällt. Höchstens zwei Taschen pro Person. Alles kostenlos, keine Anmeldung nötig.` },
      { id: "g", title: "Seminar: Den Tag in den Griff bekommen", text: `Ein Abend für alle, die abends das Gefühl haben, nichts geschafft zu haben. Wir arbeiten mit Ihrem eigenen Kalender und Ihren echten Aufgaben, nicht mit Beispielen. Bringen Sie also mit, womit Sie tatsächlich arbeiten. Höchstens fünfzehn Teilnehmende.` },
      { id: "h", title: "Vorlesepaten gesucht", text: `Einmal pro Woche eine Stunde in einer Kita oder Grundschule vorlesen. Wichtig ist nicht perfektes Deutsch, sondern Freude am Erzählen. Wir schulen Sie an einem Nachmittag und stellen die Bücher. Auch Menschen, die eine zweite Sprache mitbringen, sind ausdrücklich willkommen.` },
      { id: "i", title: "Fahrsicherheitstraining", text: `Bremsen auf nasser Fahrbahn, Ausweichen, Schleudern: Auf unserem Übungsplatz erleben Sie Situationen, die Sie im Straßenverkehr nie üben können. Mit dem eigenen Auto, ganzer Tag. Viele Versicherungen erstatten einen Teil der Gebühr.` },
      { id: "j", title: "Passbilder sofort", text: `Biometrische Fotos für Ausweis, Reisepass und Führerschein, fertig in fünf Minuten. Wir prüfen die Vorgaben und fotografieren notfalls kostenlos noch einmal, falls das Amt etwas beanstandet. Ohne Termin, montags bis samstags.` },
    ],
    targets: [
      {
        id: "t13",
        prompt: `Frau Ibrahimi lernt seit einem Jahr Deutsch und versteht schon einiges. Sie sucht jemanden, mit dem sie regelmäßig frei sprechen kann.`,
        correctOptionId: "a",
        explanation: "The A2 requirement is the condition to check. After a year of study she meets it — which is why the ad fits her and would not fit a beginner.",
      },
      {
        id: "t14",
        prompt: `Ein Kollege hat eine Hose geerbt, die ihm zu lang ist. Er möchte sie ändern lassen, hat sie aber nicht in einem Geschäft gekauft.`,
        correctOptionId: "b",
        explanation: "Two conditions again. The second one — clothes bought elsewhere — is exactly the sentence a careless reader skips.",
      },
      {
        id: "t15",
        prompt: `Herr Osei hat nächste Woche einen Termin beim Amt und hat Angst, dass er die Formulare nicht versteht.`,
        correctOptionId: "c",
        explanation: "Note what the ad does *not* offer: „Wir übersetzen nicht“. It still fits, because he asks for understanding, not translation.",
      },
      {
        id: "t16",
        prompt: `Ihre Schwester möchte lernen, in unangenehmen Situationen selbstbewusster aufzutreten. Sportlich ist sie nicht.`,
        correctOptionId: "d",
        explanation: "„Selbstbehauptung“ is about asserting yourself, not fighting. The ad rules out the sporting concern in three words.",
      },
      {
        id: "t17",
        prompt: `Sie haben abends oft das Gefühl, den ganzen Tag beschäftigt gewesen zu sein und trotzdem nichts erledigt zu haben.`,
        correctOptionId: "g",
        explanation: "The ad restates the situation almost word for word — the clearest kind of match, and worth taking when you see it.",
      },
      {
        id: "t18",
        prompt: `Ein Freund sucht einen Deutschkurs mit Prüfung am Ende, den er neben der Arbeit besuchen kann.`,
        correctOptionId: "0",
        explanation: "The near miss is deliberate: language does appear (a, c, h), but none of them is a course leading to an exam. Do not settle for the same topic when the deciding feature is missing.",
      },
      {
        id: "t19",
        prompt: `Ihre Nachbarin ist vor zwei Jahren aus Syrien gekommen, spricht gern und möchte etwas mit Kindern machen. Perfekt ist ihr Deutsch noch nicht.`,
        correctOptionId: "h",
        explanation: "The ad anticipates her exact worry and answers it, then goes further by welcoming a second language. Both halves of her situation are covered.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-01-zuordnung-person",
    level: "B2",
    title: "Personen zuordnen",
    source: "Forenbeiträge",
    instruction: `Sie lesen in einem Forum, wie vier Menschen über die Vier-Tage-Woche denken. Auf welche der vier Personen treffen die Aussagen 1 bis 9 zu? Die Personen können mehrmals gewählt werden.`,
    options: [
      { id: "a", title: "Marlene Sturm, Pflegedienstleitung", text: `Bei uns lief ein Jahr lang ein Versuch mit vier Tagen, und ich würde ihn jederzeit wiederholen — aber nur unter einer Bedingung. Ohne zusätzliche Stellen ist das Modell in der Pflege schlicht nicht zu machen; wir haben drei Kolleginnen eingestellt, sonst wäre der Dienstplan zusammengebrochen.

Genau davor hatte ich am Anfang Angst: dass am Ende dieselbe Arbeit einfach auf weniger Tage gedrückt wird und alle noch erschöpfter nach Hause gehen. Das ist zum Glück ausgeblieben.

Was mich selbst überrascht hat: Der größte Gewinn war gar nicht der freie Tag. Es war die Tatsache, dass die Pläne endlich sechs Wochen im Voraus standen und nicht mehr ständig umgeworfen wurden. Meine Kolleginnen sagen fast alle dasselbe — sie konnten zum ersten Mal seit Jahren etwas verbindlich verabreden, ohne drei Tage vorher wieder absagen zu müssen.` },
      { id: "b", title: "Tobias Reinhardt, Geschäftsführer einer Softwarefirma", text: `Wir haben die Vier-Tage-Woche vor zwei Jahren eingeführt, freiwillig und ohne Lohnkürzung, und ich habe es keine Woche bereut.

Dass die Leistung nicht eingebrochen ist, liegt vor allem an einer unspektakulären Maßnahme: Wir haben die Hälfte unserer Besprechungen ersatzlos gestrichen, und genau diese gewonnene Zeit gleicht den fehlenden Tag aus. Es war also keine Frage von härterem Arbeiten, sondern von weniger Unsinn.

Schwierig war etwas ganz anderes. Unsere Kunden gingen selbstverständlich davon aus, dass freitags jemand ans Telefon geht, und dieser Druck von außen war das eigentliche Hindernis — nicht die Technik und nicht die Organisation. Ein halbes Jahr hat es gedauert, bis wir das offen genug kommuniziert hatten. Heute nehmen es fast alle hin.` },
      { id: "c", title: "Yvonne Kessler, Einzelhandel", text: `Ich lese diese Diskussion seit Monaten mit und ärgere mich zunehmend. Geführt wird sie von Leuten am Schreibtisch, über Modelle, die in einem Supermarkt nie funktionieren werden — der Laden muss geöffnet sein, ob wir nun vier oder fünf Tage arbeiten. Diese Einseitigkeit stört mich, weil dabei so getan wird, als spräche man für sämtliche Beschäftigten.

Bekämpfen will ich die Vier-Tage-Woche deswegen nicht. Nur stehen bei uns andere Dinge weiter oben auf der Liste: ein Dienstplan, der nicht drei Tage vorher kommt, und ein Lohn, von dem man in dieser Stadt eine Wohnung bezahlen kann.

Solange das ungelöst bleibt, wirkt die Debatte über den freien Freitag auf mich seltsam abgehoben.` },
      { id: "d", title: "Halil Ergün, Arbeitsmarktforscher", text: `Als jemand, der die Studienlage beruflich verfolgt, rate ich zu etwas mehr Nüchternheit. Die Datengrundlage ist deutlich dünner, als die Lautstärke der Debatte vermuten lässt: Die meisten Versuche liefen über sechs Monate, und zwar mit Betrieben, die sich freiwillig gemeldet hatten. Aus solchen Pilotprojekten Schlüsse für eine ganze Volkswirtschaft zu ziehen, halte ich für unseriös.

Hinzu kommt, dass sich die Ergebnisse kaum vergleichen lassen, weil sie sehr stark davon abhängen, in welcher Branche gemessen wurde — in der Softwareentwicklung sieht die Rechnung anders aus als in einem Krankenhaus.

Interessant finde ich das Modell trotzdem, allerdings aus einem anderen Grund: Wo Betriebe um Fachkräfte konkurrieren, ist eine kürzere Woche inzwischen ein Argument, das Bewerbungen bringt.` },
    ],
    targets: [
      {
        id: "t1",
        prompt: `Diese Person hält die öffentliche Debatte für einseitig geführt.`,
        correctOptionId: "c",
        explanation: "d also urges caution, but about the evidence base, not about who is allowed to speak. a and b report their own experience without judging the debate.",
      },
      {
        id: "t2",
        prompt: `Diese Person berichtet, dass weniger Besprechungen den Ausfall an Arbeitszeit ausgeglichen haben.`,
        correctOptionId: "b",
        explanation: "a compensated with extra staff, not with fewer meetings — the classic mix-up here. c and d describe no workplace of their own.",
      },
      {
        id: "t3",
        prompt: `Diese Person warnt davor, die Ergebnisse einzelner Versuche zu verallgemeinern.`,
        correctOptionId: "d",
        explanation: "c doubts the debate's fairness, not its statistics. a reports one trial without drawing conclusions for anyone else.",
      },
      {
        id: "t4",
        prompt: `Diese Person nennt zusätzliche Einstellungen als Bedingung dafür, dass das Modell überhaupt funktioniert.`,
        correctOptionId: "a",
        explanation: "b explicitly says the gap was closed without more people, by cutting meetings — the opposite solution.",
      },
      {
        id: "t5",
        prompt: `Diese Person sieht den größten Gewinn nicht in der freien Zeit, sondern in verlässlicher Planung.`,
        correctOptionId: "a",
        explanation: "c also wants reliable rosters, but as something she does not have and demands — not as a gain she has already experienced.",
      },
      {
        id: "t6",
        prompt: `Diese Person beschreibt Erwartungen von außen als das eigentliche Hindernis.`,
        correctOptionId: "b",
        explanation: "For a the obstacle was internal (staffing and rosters); the customers never appear in her post.",
      },
      {
        id: "t7",
        prompt: `Diese Person hält andere Verbesserungen für dringlicher als eine kürzere Woche.`,
        correctOptionId: "c",
        explanation: "She is not against the four-day week — the sentence before says so. Reading her as an opponent is the trap here.",
      },
      {
        id: "t8",
        prompt: `Diese Person verweist darauf, dass die Wirkung stark von der Branche abhängt.`,
        correctOptionId: "d",
        explanation: "c argues from one sector, but never claims that results differ measurably between sectors — that is d's point about the data.",
      },
      {
        id: "t9",
        prompt: `Diese Person hatte anfangs befürchtet, dass sich dieselbe Arbeit nur auf weniger Tage verteilt.`,
        correctOptionId: "a",
        explanation: "The fear is reported and then withdrawn. Treating it as her current position — that the model failed — inverts the paragraph.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-01-zuordnung-aeusserungen",
    level: "B2",
    title: "Aussagen zuordnen",
    source: "Interviews",
    instruction: `Sie lesen in einer Zeitschrift Meinungsäußerungen zum Thema Kleidung leihen statt kaufen. Welche Äußerung a bis h passt zu welcher Überschrift 22 bis 27? Eine Äußerung dient als Beispiel, eine weitere passt zu keiner Überschrift.`,
    options: [
      { id: "a", title: "Rieke Sandmann", text: `Ein Jahr lang habe ich alles geliehen, vom Mantel bis zur Bluse. Für den Alltag war mir das am Ende zu umständlich — was ich morgens brauchte, war oft noch nicht zurück. Aufgegeben habe ich es trotzdem nicht: Für Hochzeiten, Vorstellungsgespräche und Feiern nutze ich es weiter, und dort möchte ich es nicht mehr missen.` },
      { id: "b", title: "Jonas Wehrle", text: `Alle rechnen den Verleih gegen Neuware, und dann sieht er natürlich gut aus. Ich habe ihn ein halbes Jahr lang gegen das gerechnet, was ich sonst tue, nämlich gebraucht kaufen. Das Ergebnis war eindeutig: Auf zwölf Monate gesehen zahle ich beim Leihen ungefähr das Doppelte. Für meinen Geldbeutel bleibt der Secondhandladen die bessere Wahl.` },
      { id: "c", title: "Selma Aydın", text: `Ich habe eine kleine Änderungsschneiderei mit zwei Angestellten. Seit die Verleihdienste in der Stadt sind, hat sich meine Auftragslage spürbar verändert: Die Firmen schicken mir Stücke, die enger, kürzer oder wieder heil werden müssen, und zwar regelmäßig. Ich hatte diesen Trend nicht kommen sehen, aber er ernährt inzwischen eine halbe Stelle mit.` },
      { id: "d", title: "Peter Nowotny", text: `Dass Leihen automatisch umweltfreundlich sei, glaube ich schlicht nicht. Jedes Stück fährt zwischen zwei Trägerinnen einmal quer durch das Land und wird dazwischen chemisch gereinigt. Ob das am Ende besser ist, als eine Jacke acht Jahre lang selbst zu tragen, hat mir noch niemand vorgerechnet. Ich hätte gern Zahlen, bevor ich mitmache.` },
      { id: "e", title: "Marit Löwe", text: `Mit dem Klima hat meine Entscheidung wenig zu tun, das gebe ich offen zu. Ich wohne auf 38 Quadratmetern, und mein einziger Schrank ist einen Meter breit. Was ich nicht besitze, muss ich auch nicht unterbringen. Seit ich leihe, ist die Wohnung benutzbar — das war der ganze Grund, und er reicht mir völlig.` },
      { id: "f", title: "Ingo Brehm", text: `Wir haben das Geschäftsmodell zwei Jahre lang getestet. Bei Abendgarderobe und teuren Jacken trägt es sich problemlos, weil eine einzelne Miete gleich einen erheblichen Teil des Einkaufspreises deckt. Bei T-Shirts und einfachen Hosen fressen Versand und Reinigung die Marge sofort auf. Wer damit in die Breite gehen will, rechnet sich das schön.` },
      { id: "g", title: "Hannah Zeller", text: `Für mich ist es vor allem ein Spielplatz. Ich trage vier Wochen lang Farben und Schnitte, die ich mir nie gekauft hätte, und lerne dabei ziemlich viel darüber, was mir eigentlich steht. Zwei Sachen habe ich danach doch neu gekauft — aber diesmal wusste ich vorher, dass ich sie wirklich anziehe.` },
      { id: "h", title: "Dr. Karin Mehnert", text: `Soziologisch ist daran interessant, dass sich der Begriff des Eigentums verschiebt: Zugang wird wichtiger als Besitz. Man sollte die Reichweite aber nüchtern sehen. Unsere Erhebungen zeigen eine gut ausgebildete, städtische Minderheit von wenigen Prozent. Für die große Mehrheit ändert sich vorläufig gar nichts, und daran wird auch die nächste Werbekampagne nichts ändern.` },
    ],
    targets: [
      {
        id: "t22",
        prompt: `Ein Nebeneffekt, von dem mein Betrieb profitiert`,
        correctOptionId: "c",
        explanation: "f is also a business voice, but reports where the model fails, not what his firm gains from someone else's.",
      },
      {
        id: "t23",
        prompt: `Nur bei teuren Stücken geht die Rechnung auf`,
        correctOptionId: "f",
        explanation: "b also does arithmetic, but from a customer's budget, not from a margin — and his conclusion is about second-hand, not about price categories.",
      },
      {
        id: "t24",
        prompt: `Nicht die Umwelt hat mich überzeugt, sondern der Platz`,
        correctOptionId: "e",
        explanation: "d also detaches the practice from ecology, but by doubting the claim, not by naming a different motive of his own.",
      },
      {
        id: "t25",
        prompt: `Solange mir niemand Zahlen vorlegt, bleibe ich skeptisch`,
        correctOptionId: "d",
        explanation: "h is also cautious, but about how many people take part, not about the environmental balance.",
      },
      {
        id: "t26",
        prompt: `Gebraucht zu kaufen ist für mich günstiger geblieben`,
        correctOptionId: "b",
        explanation: "The comparison is the point: measured against new clothes renting looks good, and he says so before rejecting that yardstick.",
      },
      {
        id: "t27",
        prompt: `Eine kleine Gruppe verändert, was Besitz bedeutet`,
        correctOptionId: "h",
        explanation: "Only h speaks about society as a whole; every other voice reports a personal or a business case.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-01-zuordnung-ueberschriften",
    level: "B2",
    title: "Benutzungsordnung der Offenen Werkstatt — Volkshochschule Weidenbach",
    source: "Ordnung",
    instruction: `Sie möchten die Offene Werkstatt der Volkshochschule nutzen und lesen die Benutzungsordnung. Welche der Überschriften a bis h aus dem Inhaltsverzeichnis passen zu den Paragraphen 28 bis 30? Vier Überschriften passen zu keinem der Paragraphen.`,
    referenceText: `§ 1 Geltungsbereich
Diese Ordnung gilt für sämtliche Räume der Offenen Werkstatt einschließlich Lager, Hof und Maschinenraum. Sie ist für alle verbindlich, die die Werkstatt betreten, unabhängig davon, ob sie an einem Kurs teilnehmen oder frei arbeiten.

§ 2 [28]
Wer die Maschinen benutzen will, muss zuvor an einer Sicherheitsunterweisung teilgenommen haben. Diese wird schriftlich bestätigt und behält 24 Monate ihre Gültigkeit; danach ist sie zu wiederholen. Der Schlüssel wird erst nach der Unterweisung ausgegeben und ist nicht übertragbar. Wer ohne gültige Bestätigung an einer Maschine angetroffen wird, muss die Werkstatt für den betreffenden Tag verlassen.

§ 3 [29]
Für mitgebrachtes Material und eigenes Werkzeug übernimmt die Volkshochschule keine Gewähr. Schäden an den Maschinen sind unverzüglich dem Werkstattteam zu melden, auch dann, wenn kein Fremdverschulden vorliegt. Angemeldete Nutzerinnen und Nutzer sind während der Öffnungszeiten über die Einrichtung unfallversichert; bei grober Fahrlässigkeit entfällt dieser Schutz.

§ 4 [30]
Jeder Arbeitsplatz ist besenrein zu hinterlassen; Werkzeug gehört an den dafür vorgesehenen Platz zurück. Holzreste kommen in den Behälter neben der Bandsäge, Metallspäne in die verschließbare Tonne im Hof. Lacke, Öle und Lösungsmittel dürfen keinesfalls über das Waschbecken entsorgt werden, sondern werden im Gefahrstoffschrank gesammelt.`,
    options: [
      { id: "a", text: `Geltungsbereich` },
      { id: "b", text: `Zugang und Sicherheitsunterweisung` },
      { id: "c", text: `Haftung und Versicherungsschutz` },
      { id: "d", text: `Gebühren und Zahlungsweise` },
      { id: "e", text: `Nutzung durch Minderjährige` },
      { id: "f", text: `Sauberkeit und Entsorgung` },
      { id: "g", text: `Beschwerden und Ansprechpartner` },
      { id: "h", text: `Öffnungszeiten und Anmeldung` },
    ],
    targets: [
      {
        id: "t28",
        prompt: `Welche Überschrift passt zu § 2?`,
        correctOptionId: "b",
        explanation: "The last sentence sends offenders home for the day, which tempts you towards a heading about exclusion — but that is one consequence inside the rule, not its subject.",
      },
      {
        id: "t29",
        prompt: `Welche Überschrift passt zu § 3?`,
        correctOptionId: "c",
        explanation: "The word Öffnungszeiten appears here, which is exactly the kind of hook that pulls you to h. It only fixes when the cover applies.",
      },
      {
        id: "t30",
        prompt: `Welche Überschrift passt zu § 4?`,
        correctOptionId: "f",
        explanation: "Two ideas, one heading: leaving the bench clean and sorting the waste are both covered by Sauberkeit und Entsorgung.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-02-zuordnung-person",
    level: "B2",
    title: "Personen zuordnen",
    source: "Forenbeiträge",
    instruction: `Sie lesen in einem Forum, wie vier Menschen über regionale Lebensmittel denken. Auf welche der vier Personen treffen die Aussagen 1 bis 9 zu? Die Personen können mehrmals gewählt werden.`,
    options: [
      { id: "a", title: "Ruth Salzmann, Marktbeschickerin", text: `Ich stehe seit achtzehn Jahren mit Gemüse aus dem Umland auf dem Wochenmarkt, und ich könnte ganze Abende damit füllen, was mir Leute an meinem Stand erzählen. Fast alle sagen, ihnen sei Herkunft wichtig. Was dann im Korb landet, sieht regelmäßig anders aus — spätestens im Februar, wenn es bei mir nur noch Kohl, Rüben und Äpfel gibt.

Am Preis liegt das übrigens seltener, als alle glauben. Mein größtes Problem ist, dass ich dienstags und freitags bis vierzehn Uhr da bin und die meisten Berufstätigen genau dann arbeiten. Wer erst um achtzehn Uhr einkaufen kann, landet zwangsläufig im Supermarkt, ganz gleich, wie überzeugt er ist.

Zwei Kolleginnen liefern inzwischen abends in Kisten aus. Das funktioniert erstaunlich gut, und ich überlege ernsthaft mitzumachen.` },
      { id: "b", title: "Dr. Milan Prohaska, Agrarökonom", text: `Regional und klimafreundlich werden fast immer gleichgesetzt, und das ist in dieser Allgemeinheit falsch. Beim Transport entsteht bei den meisten Lebensmitteln nur ein kleiner Teil der gesamten Klimabelastung; entscheidend ist, wie und wo etwas angebaut wurde, nicht die Entfernung zum Teller.

Das anschaulichste Beispiel sind Tomaten. Eine im beheizten Gewächshaus vor der Haustür gezogene Tomate schneidet in unseren Rechnungen schlechter ab als eine, die im Freiland gewachsen und anschließend mit dem Schiff transportiert worden ist. Bei Äpfeln aus dem Kühllager im Juni sieht es ähnlich aus.

Missverstehen Sie mich nicht: Für kurze Wege sprechen gute Gründe — frische Ware, Geld, das in der Gegend bleibt, Höfe, die es sonst nicht mehr gäbe. Nur sollte man sie nennen, statt sich eine Klimabilanz herbeizureden, die die Zahlen nicht hergeben.` },
      { id: "c", title: "Ines Botterweck, Kantinenleiterin", text: `Wir haben unsere Kantine mit sechshundert Essen am Tag vor drei Jahren umgestellt, und ich hatte mit ganz anderen Schwierigkeiten gerechnet als denen, die dann kamen. Teurer wurde es kaum — das hatte ich befürchtet und es traf nicht ein.

Die eigentliche Schwierigkeit war die Verlässlichkeit. Ein Großhändler liefert, was auf der Bestellung steht, jeden Tag, in gleicher Qualität. Vier kleine Höfe liefern, was gewachsen ist, und melden sich am Vorabend, wenn der Hagel etwas anderes entschieden hat.

Gelöst haben wir es, indem wir den Speiseplan nicht mehr im Voraus festlegen, sondern der Saison folgen und erst freitags für die kommende Woche entscheiden. Das war eine größere Umstellung für mein Team als jede Preisfrage.` },
      { id: "d", title: "Tarek Ünal, Verbraucherschützer", text: `Der wichtigste Satz in dieser Debatte lautet: „Regional“ ist kein geschützter Begriff. Anders als bei „Bio“ steht dahinter keine Verordnung, keine Kontrolle und keine Mindestanforderung. Wer ein Glas Honig mit einem Fachwerkhaus beklebt und „aus der Region“ darauf schreibt, tut nichts Verbotenes, auch wenn der Honig aus drei Ländern stammt.

Deshalb dringen wir seit Jahren auf eine verbindliche Kennzeichnung: Wie weit ist die Ware gereist, und wo wurde sie verarbeitet? Beides gehört auf die Packung, in Kilometern und Ortsnamen, nicht in Bildern.

Solange das fehlt, verkaufen viele Anbieter kein Lebensmittel, sondern ein Gefühl — und die ehrlichen Betriebe, die tatsächlich vor Ort produzieren, haben davon am wenigsten.` },
    ],
    targets: [
      {
        id: "t1",
        prompt: `Diese Person weist darauf hin, dass der Begriff rechtlich nicht geschützt ist.`,
        correctOptionId: "d",
        explanation: "b criticises the same label, but for being climatically overrated — not for being legally empty.",
      },
      {
        id: "t2",
        prompt: `Diese Person hält die Einkaufszeiten für ein größeres Hindernis als den Preis.`,
        correctOptionId: "a",
        explanation: "c also finds cost was not the problem — but for her the obstacle was supply reliability, not opening hours.",
      },
      {
        id: "t3",
        prompt: `Diese Person erklärt, dass der Transport nur einen kleinen Teil der Klimabelastung ausmacht.`,
        correctOptionId: "b",
        explanation: "d also wants distance on the label, but as consumer information, not as a claim about how much it matters.",
      },
      {
        id: "t4",
        prompt: `Diese Person hat den Speiseplan an die Jahreszeiten angepasst.`,
        correctOptionId: "c",
        explanation: "a mentions the seasons too, but as what her stall happens to offer in February — not as a change she made.",
      },
      {
        id: "t5",
        prompt: `Diese Person beobachtet einen Unterschied zwischen dem, was Kundschaft sagt, und dem, was sie kauft.`,
        correctOptionId: "a",
        explanation: "d says shoppers are sold a feeling, which is about the sellers; a is reporting what her own customers do.",
      },
      {
        id: "t6",
        prompt: `Diese Person fordert verbindliche Regeln für die Kennzeichnung.`,
        correctOptionId: "d",
        explanation: "Only d asks for a rule. The others describe what they do, not what the law should require.",
      },
      {
        id: "t7",
        prompt: `Diese Person nennt die Verlässlichkeit der Lieferungen als eigentliche Schwierigkeit.`,
        correctOptionId: "c",
        explanation: "„Die eigentliche“ marks it as the one that mattered, against the cost she had wrongly expected.",
      },
      {
        id: "t8",
        prompt: `Diese Person hält die Art des Anbaus für wichtiger als die Entfernung.`,
        correctOptionId: "b",
        explanation: "He is not against short distances — the last paragraph lists good reasons for them. Reading him as an opponent is the trap.",
      },
      {
        id: "t9",
        prompt: `Diese Person nennt ein Beispiel, in dem heimische Ware schlechter abschneidet als importierte.`,
        correctOptionId: "b",
        explanation: "The comparison runs the way round most readers do not expect, which is the point of the example.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-02-zuordnung-aeusserungen",
    level: "B2",
    title: "Aussagen zuordnen",
    source: "Interviews",
    instruction: `Sie lesen in einer Zeitschrift Meinungsäußerungen zum Thema Urlaub ohne Flugzeug. Welche Äußerung a bis h passt zu welcher Überschrift 22 bis 27? Eine Äußerung dient als Beispiel, eine weitere passt zu keiner Überschrift.`,
    options: [
      { id: "a", title: "Gesa Wendtland", text: `Seit vier Jahren fliege ich nicht mehr in den Urlaub, und ich will ehrlich sein: Bequemer ist es nicht geworden. Nach Südfrankreich sitze ich vierzehn Stunden statt zwei. Dafür habe ich meine Reisen entschleunigt und komme deutlich erholter an, weil das Ankommen nicht mehr in einer Warteschlange beginnt.` },
      { id: "b", title: "Rüdiger Kohlmey", text: `Ich vermittle seit zwanzig Jahren Reisen, und die Nachfrage ist eindeutig da — sie scheitert an der Technik. Für eine Bahnfahrt über drei Länder brauche ich vier Buchungssysteme, die sich gegenseitig nicht kennen. Bei einer Verspätung haftet dann niemand für den Anschluss. So lange das so bleibt, verkaufe ich Zugreisen nur an Überzeugte.` },
      { id: "c", title: "Neele Barsig", text: `Ich habe es zweimal ausgerechnet, für dieselbe Strecke und dieselbe Woche: Der Nachtzug kostete für uns zu zweit knapp das Dreifache des Flugs. Ich verstehe jedes Argument für die Bahn, aber solange der Preisunterschied so aussieht, ist das keine Entscheidung zwischen Bequemlichkeit und Haltung, sondern eine zwischen Haltung und Haushaltsbuch.` },
      { id: "d", title: "Familie Trautwein", text: `Mit zwei kleinen Kindern hatten wir das Schlimmste erwartet und das Gegenteil erlebt. Im Zug dürfen sie aufstehen, essen, wann sie wollen, und aus dem Fenster sehen. Inzwischen fragen sie nach der Fahrt, nicht nach dem Ziel. Die Anreise ist bei uns von einem notwendigen Übel zum besten Teil der Ferien geworden.` },
      { id: "e", title: "Prof. Aylin Kestner", text: `Man sollte die Wirkung realistisch einordnen. Wer einmal im Jahr in den Urlaub fliegt und nun mit dem Zug fährt, spart weniger ein, als die meisten annehmen. Die wirklich großen Effekte liegen bei der kleinen Gruppe, die sechs- oder achtmal jährlich fliegt. Über die redet in dieser Debatte allerdings kaum jemand, weil es unangenehmer ist.` },
      { id: "f", title: "Bernd Oswald", text: `Was mir an dieser Debatte gegen den Strich gehen kann, ist der Ton. Ich fahre selbst Zug, aber ich käme nicht auf die Idee, jemandem den Urlaub vorzurechnen. Meine Nachbarin fliegt einmal im Jahr zu ihrer Schwester nach Portugal, und niemand hat ihr dazu etwas zu sagen. Wer andere belehrt, gewinnt keine Verbündeten, sondern verliert sie.` },
      { id: "g", title: "Milena Frowein", text: `Mein Kompromiss sieht so aus, dass ich das Land, in dem ich wohne, endlich kennenlerne. Ich hätte nie gedacht, wie wenig ich davon gesehen habe. Vier Tage im Harz, im Herbst eine Woche an der Ostsee — das ist erreichbar, bezahlbar und ich brauche dafür keine Diskussion über Flugscham.` },
      { id: "h", title: "Jörn Aschenbrenner", text: `Beruflich geht es nicht, und ich sage das ohne schlechtes Gewissen. Ich betreue Kunden in Finnland und Portugal und habe montags in Helsinki und mittwochs in Lissabon zu sein. Privat fliege ich seit Jahren nicht mehr, und das fällt mir leicht. Aber die Debatte tut so, als sei jeder Flug dieselbe Entscheidung, und das ist sie nicht.` },
    ],
    targets: [
      {
        id: "t22",
        prompt: `Nicht der Wille fehlt, sondern die Buchung`,
        correctOptionId: "b",
        explanation: "c also reports a practical obstacle, but hers is the price, not the booking.",
      },
      {
        id: "t23",
        prompt: `Am Ende entscheidet der Preis`,
        correctOptionId: "c",
        explanation: "She does not argue against the train — the sentence before concedes every argument for it.",
      },
      {
        id: "t24",
        prompt: `Die Anreise ist zum Ziel geworden`,
        correctOptionId: "d",
        explanation: "a values the arrival, not the journey — the distinction is what separates the two.",
      },
      {
        id: "t25",
        prompt: `Wer viel fliegt, fällt am meisten ins Gewicht`,
        correctOptionId: "e",
        explanation: "h also distinguishes between kinds of flight, but from his own situation rather than from a measured effect.",
      },
      {
        id: "t26",
        prompt: `Belehren bringt niemanden auf die eigene Seite`,
        correctOptionId: "f",
        explanation: "Reading him as an opponent of train travel inverts his second sentence.",
      },
      {
        id: "t27",
        prompt: `Urlaub vor der eigenen Haustür`,
        correctOptionId: "g",
        explanation: "Everyone else swaps the means of travel; only g swaps the destination.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-02-zuordnung-ueberschriften",
    level: "B2",
    title: "Satzung des TSV Nordwiese — Auszug",
    source: "Ordnung",
    instruction: `Sie möchten einem Sportverein beitreten und lesen dessen Satzung. Welche der Überschriften a bis h aus dem Inhaltsverzeichnis passen zu den Paragraphen 28 bis 30? Vier Überschriften passen zu keinem der Paragraphen.`,
    referenceText: `§ 1 Zweck des Vereins
Der Verein verfolgt ausschließlich gemeinnützige Zwecke. Er fördert den Breitensport, insbesondere für Kinder, Jugendliche und ältere Menschen, und unterhält zu diesem Zweck Übungsgruppen, Sportstätten und Geräte. Ein wirtschaftlicher Geschäftsbetrieb ist ausgeschlossen.

§ 2 [28]
Mitglied kann jede natürliche Person werden. Der Antrag ist schriftlich zu stellen; über die Aufnahme entscheidet der Vorstand innerhalb von vier Wochen. Bei Minderjährigen ist die Unterschrift einer sorgeberechtigten Person erforderlich. Ein Anspruch auf Aufnahme besteht nicht; eine Ablehnung muss nicht begründet werden.

§ 3 [29]
Der Beitrag wird jährlich im Voraus erhoben und zum 15. Januar abgebucht. Die Höhe setzt die Mitgliederversammlung fest. Wer im laufenden Jahr eintritt, zahlt für jeden angefangenen Monat ein Zwölftel. In begründeten Fällen — insbesondere bei Arbeitslosigkeit — kann der Vorstand auf Antrag stunden oder ermäßigen.

§ 4 [30]
Die Mitgliedschaft endet durch Austritt, Ausschluss oder Tod. Der Austritt ist schriftlich zu erklären und nur zum Ende eines Kalenderjahres möglich; die Erklärung muss bis zum 30. September vorliegen. Ein Ausschluss ist nur bei grobem Verstoß gegen die Satzung möglich und setzt eine vorherige Anhörung voraus.`,
    options: [
      { id: "a", text: `Zweck des Vereins` },
      { id: "b", text: `Erwerb der Mitgliedschaft` },
      { id: "c", text: `Beiträge` },
      { id: "d", text: `Beendigung der Mitgliedschaft` },
      { id: "e", text: `Vorstand und Wahlen` },
      { id: "f", text: `Mitgliederversammlung` },
      { id: "g", text: `Haftung und Versicherung` },
      { id: "h", text: `Benutzung der Sportstätten` },
    ],
    targets: [
      {
        id: "t28",
        prompt: `Welche Überschrift passt zu § 2?`,
        correctOptionId: "b",
        explanation: "The Vorstand appears here, which pulls towards e — but it is the body deciding, not the subject of the rule.",
      },
      {
        id: "t29",
        prompt: `Welche Überschrift passt zu § 3?`,
        correctOptionId: "c",
        explanation: "The Mitgliederversammlung is named as the body that sets the amount, which is the hook towards f.",
      },
      {
        id: "t30",
        prompt: `Welche Überschrift passt zu § 4?`,
        correctOptionId: "d",
        explanation: "Symmetrical with § 2: one paragraph for joining, one for leaving.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-03-zuordnung-person",
    level: "B2",
    title: "Personen zuordnen",
    source: "Forenbeiträge",
    instruction: `Sie lesen in einem Forum, wie vier Menschen über Dialekt denken. Auf welche der vier Personen treffen die Aussagen 1 bis 9 zu? Die Personen können mehrmals gewählt werden.`,
    options: [
      { id: "a", title: "Hannes Grubmüller, Grundschullehrer", text: `Ich unterrichte seit vierzehn Jahren in einem Dorf, in dem zu Hause fast ausschließlich Dialekt gesprochen wird, und ich habe irgendwann aufgehört, meine Kinder beim Sprechen zu verbessern. Das war keine bequeme Entscheidung, sondern eine, die mir zwei Kolleginnen jahrelang übel genommen haben.

Das Ergebnis hat mich selbst überrascht: Seit ich das Reden in Ruhe lasse, sind die Aufsätze besser geworden, nicht schlechter. Meine Erklärung ist einfach. Wer beim Sprechen ständig unterbrochen wird, meldet sich seltener, und wer sich seltener meldet, übt weniger.

Worauf ich streng achte, ist das Schreiben. Im Heft gilt Standarddeutsch, ohne Ausnahme, und die Kinder verstehen das sofort, wenn man es ihnen als zwei verschiedene Werkzeuge erklärt. Reden und Schreiben sind bei uns getrennte Baustellen, und genau deshalb funktionieren beide.` },
      { id: "b", title: "Dr. Silke Ottmann, Soziolinguistin", text: `Wir haben vor zwei Jahren untersucht, wie Dialekt in Bewerbungsgesprächen wirkt. Dieselben Bewerbungen, dieselben Texte, einmal in Standardsprache eingesprochen und einmal gefärbt — bewertet von vierhundert Personalverantwortlichen.

Ich hatte vorher erwartet, dass wir einen kleinen, aber einheitlichen Nachteil finden würden. Herausgekommen ist etwas anderes: Der Effekt hängt fast vollständig davon ab, um welchen Dialekt es geht. Manche werden als warm und vertrauenswürdig gehört, andere kosten den Bewerber messbar Punkte bei der fachlichen Einschätzung. Meine eigene Vermutung war damit widerlegt, und das gehört zu diesem Beruf.

Daraus einen Rat abzuleiten, fällt mir schwer. Ich sage den Leuten nur: Es ist keine Frage von richtig und falsch, sondern eine von Erwartungen, die andere mitbringen und die Sie nicht ändern können.` },
      { id: "c", title: "Ayla Demirtaş, Personalleiterin", text: `Bei uns im Betrieb ist das schlicht kein Thema, und ich sage das ohne jede Schönfärberei. Wir stellen jedes Jahr rund achtzig Leute ein, und ich kann mich an keinen einzigen Fall erinnern, in dem die Aussprache eine Rolle gespielt hätte.

Worauf ich achte, ist etwas anderes: Unsere Teams sitzen in vier Städten, und die Hälfte der Kollegschaft ist nicht hier aufgewachsen. Wenn in einer Besprechung die eine Hälfte die andere nicht versteht, ist das ein Problem — unabhängig davon, ob es an Dialekt, an Fachbegriffen oder am Tempo liegt.

Verständlich zu sein ist das einzige Kriterium, das ich anlege. Wer das schafft, darf von mir aus klingen, wie er will. Und ehrlich gesagt klingt in unserer Kantine sowieso längst niemand mehr wie das Lehrbuch.` },
      { id: "d", title: "Gero Wiechert, Sprachverein Nordwiese", text: `Was hier verloren geht, merkt man erst, wenn es weg ist. In meinem Heimatort habe ich als Kind Wörter gehört, die heute kein Kind mehr kennt, und mit jedem dieser Wörter verschwindet ein Stück Wissen über die Gegend — über Wetter, Handwerk, Landschaft.

Schuld daran ist meiner Überzeugung nach vor allem das Fernsehen. Seit in jedem Wohnzimmer den ganzen Tag Standarddeutsch läuft, hören Kinder ihre eigene Sprache nur noch von den Großeltern, und das reicht nicht. Der Rückgang ist keine Naturgewalt, er hat eine Ursache.

Deshalb fordere ich seit Jahren, dass Dialekt in der Schule seinen Platz bekommt — nicht als Freizeitangebot, sondern als Fach mit Stunden im Plan. Andere Länder machen das längst, und niemand hat dort schlechter Deutsch gelernt.` },
    ],
    targets: [
      {
        id: "t1",
        prompt: `Diese Person hat untersucht, wie Dialekt in Bewerbungsgesprächen wirkt.`,
        correctOptionId: "b",
        explanation: "c hires eighty people a year but reports experience, not a study.",
      },
      {
        id: "t2",
        prompt: `Diese Person behandelt Sprechen und Schreiben nach unterschiedlichen Regeln.`,
        correctOptionId: "a",
        explanation: "He is strict about one and deliberately loose about the other, which is the whole point of his post.",
      },
      {
        id: "t3",
        prompt: `Für diese Person zählt allein, ob man verstanden wird.`,
        correctOptionId: "c",
        explanation: "„das einzige Kriterium“ is what separates her from b, who says the effect exists but is not hers to judge.",
      },
      {
        id: "t4",
        prompt: `Diese Person macht das Fernsehen für den Rückgang verantwortlich.`,
        correctOptionId: "d",
        explanation: "„meiner Überzeugung nach“ marks it as his position rather than a finding — nobody in the forum has measured this.",
      },
      {
        id: "t5",
        prompt: `Diese Person hat eine Verbesserung beobachtet, seit sie etwas nicht mehr korrigiert.`,
        correctOptionId: "a",
        explanation: "„nicht schlechter“ anticipates the objection, which is what makes the sentence worth quoting.",
      },
      {
        id: "t6",
        prompt: `Diese Person betont, dass die Wirkung je nach Dialekt sehr verschieden ist.`,
        correctOptionId: "b",
        explanation: "The differentiation is her actual finding; a single uniform disadvantage is what she expected and did not find.",
      },
      {
        id: "t7",
        prompt: `Diese Person fordert Dialekt als eigenes Fach im Stundenplan.`,
        correctOptionId: "d",
        explanation: "a works with dialect in class every day but never asks for it to be taught as a subject.",
      },
      {
        id: "t8",
        prompt: `Diese Person sagt, im eigenen Betrieb spiele die Frage überhaupt keine Rolle.`,
        correctOptionId: "c",
        explanation: "b's four hundred recruiters say otherwise — the two are not talking about the same set of employers, which is the tension in this forum.",
      },
      {
        id: "t9",
        prompt: `Diese Person räumt ein, dass ihre eigene Vermutung widerlegt wurde.`,
        correctOptionId: "b",
        explanation: "a is also surprised by his result, but his expectation is never called wrong — it simply was not his.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-03-zuordnung-aeusserungen",
    level: "B2",
    title: "Aussagen zuordnen",
    source: "Interviews",
    instruction: `Sie lesen in einer Zeitschrift Meinungsäußerungen zum Thema mieten oder kaufen. Welche Äußerung a bis h passt zu welcher Überschrift 22 bis 27? Eine Äußerung dient als Beispiel, eine weitere passt zu keiner Überschrift.`,
    options: [
      { id: "a", title: "Kerstin Lubowitz", text: `Wir haben vor zwölf Jahren gekauft, und ich würde es wieder tun — allerdings nicht wegen des Geldes. Ob sich das gerechnet hat, weiß ich bis heute nicht genau. Was ich weiß: Uns kann niemand kündigen, und wir mussten in zwölf Jahren nicht ein einziges Mal über einen Umzug nachdenken.` },
      { id: "b", title: "Dr. Amir Solouki", text: `In den Rechnungen, die man überall liest, fehlt fast immer derselbe Posten. Verglichen wird die Miete mit der Rate — aber Instandhaltung, Rücklagen und Kaufnebenkosten tauchen nicht auf. Rechnet man sie mit, verschiebt sich der Punkt, ab dem sich Kaufen lohnt, je nach Stadt um sieben bis fünfzehn Jahre nach hinten.` },
      { id: "c", title: "Jonna Wieprecht", text: `Mich hat der Kauf beweglich gemacht — allerdings anders herum, als alle denken. Ich habe eine kleine Wohnung in meiner Heimatstadt gekauft und vermiete sie. Damit kann ich hinziehen, wohin ich will, und habe trotzdem etwas, worauf ich zurückfallen kann. Besitz und Beweglichkeit schließen sich für mich nicht aus.` },
      { id: "d", title: "Ehepaar Kastner", text: `Wir haben gekauft, weil wir Angst vor der Miete im Alter hatten. Heute sind wir siebzig, das Haus ist abbezahlt, und wir merken, dass wir das falsche Problem gelöst haben. Zwei Etagen, ein Garten, eine Treppe ohne Geländer — pflegeleicht ist etwas anderes. Wir hätten früher über das Danach nachdenken sollen.` },
      { id: "e", title: "Timo Grasnick", text: `Für mich war es schlicht keine Entscheidung. Ich verdiene ordentlich, aber das Eigenkapital, das die Bank sehen will, hat in meiner Familie nie jemand gehabt. Wer erbt, kauft; wer nicht erbt, mietet. Das ist die ehrlichste Zusammenfassung dieses Themas, und mit persönlicher Leistung hat sie wenig zu tun.` },
      { id: "f", title: "Marlis Steenbeck", text: `Ich miete seit dreißig Jahren dieselbe Wohnung und habe nie bereut, nicht gekauft zu haben. Wenn die Heizung ausfällt, rufe ich an. Was ich dadurch nicht ausgegeben habe, liegt angelegt und arbeitet für mich — ohne dass ich am Wochenende auf einer Leiter stehe.` },
      { id: "g", title: "Nuri Baltacı", text: `Was mich an der Debatte stört, ist, dass immer nur über Zahlen geredet wird. In meiner Straße kenne ich die Leute, die seit Jahrzehnten mieten, deutlich besser als die, die gekauft haben und nach fünf Jahren weiterziehen. Eine Nachbarschaft entsteht nicht durch Grundbucheinträge.` },
      { id: "h", title: "Prof. Renate Kilb", text: `Man muss das Bild vom sicheren Eigentum etwas relativieren. Eine Immobilie ist ein Klumpenrisiko: Das gesamte Vermögen hängt an einem einzigen Objekt an einem einzigen Ort. Zieht die Arbeit weg oder verliert die Gegend an Wert, trifft beides dieselbe Familie gleichzeitig. Streuung sieht anders aus.` },
    ],
    targets: [
      {
        id: "t22",
        prompt: `In den üblichen Rechnungen fehlen wichtige Posten`,
        correctOptionId: "b",
        explanation: "h also warns about buying, but about concentration of risk, not about arithmetic.",
      },
      {
        id: "t23",
        prompt: `Gekauft — und trotzdem frei umzuziehen`,
        correctOptionId: "c",
        explanation: "„allerdings anders herum, als alle denken“ signals the reversal the heading names.",
      },
      {
        id: "t24",
        prompt: `Im Alter passt das Haus nicht mehr`,
        correctOptionId: "d",
        explanation: "The house is paid off, so this is not about money — which is what separates it from b.",
      },
      {
        id: "t25",
        prompt: `Ob man kauft, entscheidet sich in der Familie`,
        correctOptionId: "e",
        explanation: "He earns well — the sentence before rules out income as the explanation.",
      },
      {
        id: "t26",
        prompt: `Beim Mieten bleibt Geld und Zeit übrig`,
        correctOptionId: "f",
        explanation: "b makes a similar arithmetic point in the abstract; she reports having lived it for thirty years.",
      },
      {
        id: "t27",
        prompt: `Das ganze Vermögen hängt an einem einzigen Ort`,
        correctOptionId: "h",
        explanation: "Only h talks about risk in the financial sense; the others talk about cost, freedom or community.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-03-zuordnung-ueberschriften",
    level: "B2",
    title: "Praktikumsordnung der Hochschule Nordwiese — Auszug",
    source: "Ordnung",
    instruction: `Sie möchten ein Praktikum machen und lesen die Praktikumsordnung Ihrer Hochschule. Welche der Überschriften a bis h aus dem Inhaltsverzeichnis passen zu den Paragraphen 28 bis 30? Vier Überschriften passen zu keinem der Paragraphen.`,
    referenceText: `§ 1 Ziel des Praktikums
Das Praktikum soll die im Studium erworbenen Kenntnisse in der beruflichen Praxis erproben und die Berufsorientierung unterstützen. Es ist Bestandteil des Studiums und wird mit fünfzehn Leistungspunkten angerechnet.

§ 2 [28]
Das Praktikum kann erst nach bestandener Zwischenprüfung angetreten werden. Es umfasst mindestens zwölf zusammenhängende Wochen in Vollzeit; eine Aufteilung auf zwei Abschnitte ist zulässig, wenn kein Abschnitt kürzer als sechs Wochen ist. Tätigkeiten im eigenen Familienbetrieb werden nicht anerkannt.

§ 3 [29]
Die Praktikumsstelle ist vor Antritt beim Praktikumsbüro anzuzeigen. Der Anzeige sind die Stellenbeschreibung und der Name der betreuenden Person im Betrieb beizufügen. Über die Eignung entscheidet das Praktikumsbüro innerhalb von drei Wochen; eine nachträgliche Anerkennung ist ausgeschlossen.

§ 4 [30]
Nach Abschluss ist innerhalb von acht Wochen ein Bericht von mindestens zwanzig Seiten einzureichen, der Tätigkeiten, Arbeitsabläufe und eigene Erfahrungen darstellt. Der Bericht ist von der betreuenden Person im Betrieb gegenzuzeichnen. Wer die Frist ohne wichtigen Grund versäumt, muss das Praktikum wiederholen.`,
    options: [
      { id: "a", text: `Ziel des Praktikums` },
      { id: "b", text: `Voraussetzungen und Dauer` },
      { id: "c", text: `Anmeldung und Genehmigung` },
      { id: "d", text: `Bericht und Nachweis` },
      { id: "e", text: `Vergütung und Versicherung` },
      { id: "f", text: `Praktikum im Ausland` },
      { id: "g", text: `Betreuung durch die Hochschule` },
      { id: "h", text: `Widerspruch und Beschwerde` },
    ],
    targets: [
      {
        id: "t28",
        prompt: `Welche Überschrift passt zu § 2?`,
        correctOptionId: "b",
        explanation: "The family business is excluded here, which tempts towards a heading about what counts — but that is one condition inside the rule, not its subject.",
      },
      {
        id: "t29",
        prompt: `Welche Überschrift passt zu § 3?`,
        correctOptionId: "c",
        explanation: "„Über die Eignung entscheidet …“ is the approval half; the notification is the registration half.",
      },
      {
        id: "t30",
        prompt: `Welche Überschrift passt zu § 4?`,
        correctOptionId: "d",
        explanation: "The countersignature by the company mentor makes it a Nachweis as well as a Bericht — which is why the heading names both.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-04-zuordnung-person",
    level: "B2",
    title: "Personen zuordnen",
    source: "Forenbeiträge",
    instruction: `Sie lesen in einem Forum, wie vier Menschen über Fitness-Apps und das Messen der eigenen Gesundheit denken. Auf welche der vier Personen treffen die Aussagen 1 bis 9 zu? Die Personen können mehrmals gewählt werden.`,
    options: [
      { id: "a", title: "Britta Hoheisel, Physiotherapeutin", text: `In meiner Praxis sehe ich täglich, was diese Apps bewirken, und mein Urteil fällt zwiespältig aus. Für Menschen, die sich zu wenig bewegen, sind sie oft der Anstoß, der jahrelang gefehlt hat. Zehntausend Schritte sind eine willkürliche Zahl, aber sie ist eine Zahl, und das hilft vielen mehr als jeder gut gemeinte Rat von mir.

Problematisch wird es bei einer kleinen Gruppe, die ich inzwischen sofort erkenne. Diese Patientinnen und Patienten trainieren weiter, obwohl der Körper längst Pause verlangt, weil die App sonst eine Lücke anzeigt. Zwei von ihnen sind mit Ermüdungsbrüchen zu mir gekommen.

Ich verbiete niemandem das Gerät. Ich bitte nur darum, es an Tagen mit Schmerzen abzulegen, und ehrlich gesagt fällt das erstaunlich vielen schwer.` },
      { id: "b", title: "Ortwin Zeisig, Rentner", text: `Meine Tochter hat mir zum siebzigsten Geburtstag so eine Uhr geschenkt, und ich habe sie ein halbes Jahr in der Schublade liegen lassen. Heute trage ich sie jeden Tag.

Der Grund ist nicht die Gesundheit, sondern die Gewohnheit. Früher bin ich gelaufen, wenn das Wetter schön war, also selten. Jetzt laufe ich, weil abends eine Zahl dasteht, und das ist offenbar Motivation genug für einen erwachsenen Mann. Ein bisschen albern finde ich das schon.

Was mich stört, ist etwas anderes: Die Uhr misst angeblich meinen Schlaf und behauptet regelmäßig, ich hätte schlecht geschlafen, obwohl ich mich ausgeruht fühle. Inzwischen schaue ich morgens absichtlich nicht mehr hin. Ein Gerät soll mir nicht erzählen, wie ich mich fühle.` },
      { id: "c", title: "Dr. Sanela Mirković, Sportmedizinerin", text: `Über die Messgenauigkeit dieser Geräte wird viel geschrieben, meist ungenau. Schritte zählen sie zuverlässig, das ist unstrittig. Beim Puls hängt es stark von der Bewegung ab, und beim Schlaf werden Werte ausgegeben, die im Vergleich zur Messung im Labor bestenfalls grob zutreffen.

Das dürfte für den Alltag kein Beinbruch sein, solange man weiß, welche Zahl was wert ist. Kritisch wird es dort, wo Menschen aus solchen Werten medizinische Schlüsse ziehen und mit einem ausgedruckten Diagramm in die Sprechstunde kommen.

Mein Rat lautet deshalb nicht, die Geräte wegzulegen, sondern sie als das zu nehmen, was sie sind: Anzeigen für Trends über Wochen, nicht Messwerte für einen einzelnen Tag.` },
      { id: "d", title: "Levent Akbulut, Softwareentwickler", text: `Mich interessiert weniger, ob die Zahlen stimmen, als wer sie bekommt. Ich habe mir die Bedingungen von drei bekannten Anbietern durchgelesen — das dauert länger, als man denkt — und bei zweien steht ausdrücklich, dass Daten an Partnerunternehmen weitergegeben werden dürfen.

Wo ich schlafe, wie oft mein Herz schlägt und wann ich das Haus verlasse: Das sind für mich keine Fitnessdaten, das sind Gesundheitsdaten. Wer sie einmal abgibt, bekommt sie nicht zurück.

Benutzen tue ich trotzdem eine App, allerdings eine, die alles auf dem Gerät behält und nichts überträgt. Sie kann weniger und sieht schlechter aus. Damit kann ich gut leben.` },
    ],
    targets: [
      {
        id: "t1",
        prompt: `Diese Person hat sich die Nutzungsbedingungen mehrerer Anbieter angesehen.`,
        correctOptionId: "d",
        explanation: "Only d talks about the terms and conditions at all; the others discuss what the devices measure.",
      },
      {
        id: "t2",
        prompt: `Diese Person berichtet von Menschen, die trotz Beschwerden weitertrainieren.`,
        correctOptionId: "a",
        explanation: "c warns about medical conclusions drawn from the numbers, not about people training through pain.",
      },
      {
        id: "t3",
        prompt: `Diese Person hat das Gerät zunächst gar nicht benutzt.`,
        correctOptionId: "b",
        explanation: "The drawer and the half year are stated plainly in the opening paragraph.",
      },
      {
        id: "t4",
        prompt: `Diese Person hält die Schrittzählung für zuverlässig, die Schlafmessung dagegen nicht.`,
        correctOptionId: "c",
        explanation: "b also doubts the sleep figures, but from how he feels in the morning rather than from a comparison with laboratory measurement.",
      },
      {
        id: "t5",
        prompt: `Diese Person benutzt bewusst eine App, die keine Daten überträgt.`,
        correctOptionId: "d",
        explanation: "He is not a refuser — the last paragraph says he uses one, which is the turn the item tests.",
      },
      {
        id: "t6",
        prompt: `Diese Person findet ihre eigene Motivation etwas lächerlich.`,
        correctOptionId: "b",
        explanation: "He judges himself, not the device — which is what separates this from the other three posts.",
      },
      {
        id: "t7",
        prompt: `Diese Person warnt davor, aus den Werten medizinische Schlüsse zu ziehen.`,
        correctOptionId: "c",
        explanation: "a also sees harm, but physical — people training on an injury, not misreading a chart.",
      },
      {
        id: "t8",
        prompt: `Diese Person hält die Geräte für einen sinnvollen Anstoß bei Bewegungsmangel.`,
        correctOptionId: "a",
        explanation: "b describes exactly this effect on himself, but as his own story — a states it as a general observation from practice.",
      },
      {
        id: "t9",
        prompt: `Diese Person schaut bestimmte Anzeigen absichtlich nicht mehr an.`,
        correctOptionId: "b",
        explanation: "„absichtlich“ is the word: he has not stopped wearing it, he has stopped looking at one screen.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-04-zuordnung-aeusserungen",
    level: "B2",
    title: "Aussagen zuordnen",
    source: "Interviews",
    instruction: `Sie lesen in einer Zeitschrift Meinungsäußerungen zum Thema Erreichbarkeit nach Feierabend. Welche Äußerung a bis h passt zu welcher Überschrift 22 bis 27? Eine Äußerung dient als Beispiel, eine weitere passt zu keiner Überschrift.`,
    options: [
      { id: "a", title: "Doris Wallenhorst", text: `Bei uns gilt seit zwei Jahren, dass zwischen zwanzig und sieben Uhr keine Mails zugestellt werden. Sie werden nicht gelöscht, nur gehalten. Ich hatte mit Protest gerechnet und stattdessen Erleichterung erlebt: Viele hatten abends nur geschrieben, weil andere abends schrieben.` },
      { id: "b", title: "Emre Yildirim", text: `Für mich wäre so eine Regel eine Zumutung. Ich hole meine Kinder um halb vier ab, bin von vier bis acht nicht ansprechbar und arbeite dafür später am Abend weiter. Wer mir das verbietet, nimmt mir nicht Arbeit ab, sondern die einzige Einteilung, mit der mein Tag funktioniert.` },
      { id: "c", title: "Prof. Ruth Simoneit", text: `Unsere Messungen zeigen etwas, das die meisten unterschätzen. Nicht das Beantworten der Nachricht kostet die Erholung, sondern die Erwartung, dass eine kommen könnte. Wer den ganzen Abend damit rechnet, erholt sich messbar schlechter — auch an Abenden, an denen gar nichts eintrifft.` },
      { id: "d", title: "Jannis Prellwitz", text: `Wir haben es mit einer Betriebsvereinbarung versucht und sind daran gescheitert, dass niemand sie durchsetzen wollte. Auf dem Papier steht seitdem alles richtig. In der Praxis schreibt die Geschäftsführung weiter um zweiundzwanzig Uhr, und solange das so ist, liest jeder mit, ganz gleich, was in der Vereinbarung steht.` },
      { id: "e", title: "Familie Osterkamp", text: `Wir haben uns zu Hause auf etwas geeinigt, das kein Unternehmen verordnen kann: Das Diensthandy liegt ab dem Abendessen in einer Schublade im Flur. Anfangs war das schwer, inzwischen fragt niemand mehr danach. Manche Regeln muss man eben selbst machen, weil sie sonst niemand macht.` },
      { id: "f", title: "Wiebke Thalmann", text: `Ich arbeite mit Kolleginnen in drei Zeitzonen, und wer da eine feste Sperre einführt, legt die Zusammenarbeit lahm. Was bei uns funktioniert, ist eine andere Vereinbarung: Man darf jederzeit schreiben, aber niemand muss außerhalb seiner Arbeitszeit antworten. Die Trennung von Senden und Antworten hat mehr gebracht als jedes Verbot.` },
      { id: "g", title: "Dr. Malte Sonnborn", text: `Rechtlich ist die Lage klarer, als viele glauben. Wer außerhalb der vereinbarten Arbeitszeit tätig wird, leistet Arbeitszeit, und die ist zu erfassen und zu vergüten. Das gilt auch für die Mail, die man kurz vor dem Einschlafen beantwortet. Dass dieses Recht selten in Anspruch genommen wird, ändert daran nichts.` },
      { id: "h", title: "Nora Bechtluft", text: `Mich stört, dass immer über Mails geredet wird und nie über die Ursache. In meiner Abteilung sind zwei Stellen seit einem Jahr unbesetzt. Die Arbeit verschwindet dadurch nicht, sie wandert in den Abend. Eine Sperre um zwanzig Uhr würde daran genau nichts ändern, sie würde es nur unsichtbar machen.` },
    ],
    targets: [
      {
        id: "t22",
        prompt: `Eine feste Sperre würde meinen Tag zerstören`,
        correctOptionId: "b",
        explanation: "f also rejects a blanket block, but because of time zones at work rather than because of her own day.",
      },
      {
        id: "t23",
        prompt: `Schon das Warten auf eine Nachricht kostet Erholung`,
        correctOptionId: "c",
        explanation: "The „nicht … sondern“ is the whole finding, and the closing clause proves it is not about the messages at all.",
      },
      {
        id: "t24",
        prompt: `Eine Regel nützt nichts, wenn die Leitung sie selbst bricht`,
        correctOptionId: "d",
        explanation: "The agreement exists and is correct — his point is about who ignores it, not about how it is worded.",
      },
      {
        id: "t25",
        prompt: `Wir haben die Grenze zu Hause selbst gezogen`,
        correctOptionId: "e",
        explanation: "Everyone else describes what an employer, a law or a study says; only e describes a household rule.",
      },
      {
        id: "t26",
        prompt: `Schreiben ja, antworten müssen nein`,
        correctOptionId: "f",
        explanation: "b also opposes a block, but proposes nothing in its place — f is the one with an alternative rule.",
      },
      {
        id: "t27",
        prompt: `Das eigentliche Problem sind die fehlenden Stellen`,
        correctOptionId: "h",
        explanation: "d also reports a rule that fails, but blames the people ignoring it; h says the rule addresses the wrong thing entirely.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-04-zuordnung-ueberschriften",
    level: "B2",
    title: "Benutzungsordnung der Stadtbibliothek Hohenrode — Auszug",
    source: "Ordnung",
    instruction: `Sie möchten die Stadtbibliothek nutzen und lesen die Benutzungsordnung. Welche der Überschriften a bis h aus dem Inhaltsverzeichnis passen zu den Paragraphen 28 bis 30? Vier Überschriften passen zu keinem der Paragraphen.`,
    referenceText: `§ 1 Öffnungszeiten
Die Bibliothek ist dienstags bis freitags von zehn bis neunzehn Uhr und samstags von zehn bis vierzehn Uhr geöffnet. An gesetzlichen Feiertagen bleibt sie geschlossen. Abweichungen werden am Haupteingang und auf der Internetseite bekannt gegeben.

§ 2 [28]
Zur Benutzung ist ein Ausweis erforderlich. Er wird auf Antrag gegen Vorlage eines amtlichen Lichtbildausweises ausgestellt und gilt zwölf Monate. Für Personen unter achtzehn Jahren ist die Unterschrift einer sorgeberechtigten Person erforderlich. Der Ausweis ist nicht übertragbar; bei Verlust ist die Bibliothek unverzüglich zu benachrichtigen.

§ 3 [29]
Bücher werden für vier Wochen ausgeliehen, Zeitschriften und Filme für eine Woche. Zweimal kann verlängert werden, sofern keine Vormerkung vorliegt; die Verlängerung ist auch telefonisch möglich. Wer die Frist überschreitet, zahlt je Medium und angefangener Woche fünfzig Cent, höchstens jedoch zehn Euro.

§ 4 [30]
Medien sind pfleglich zu behandeln. Bereits vorhandene Beschädigungen sind vor der Ausleihe anzuzeigen, andernfalls haftet die entleihende Person. Bei Verlust oder starker Beschädigung ist Ersatz in Höhe des Wiederbeschaffungswertes zu leisten; die Bibliothek entscheidet, ob stattdessen ein gleichwertiges Exemplar angenommen wird.`,
    options: [
      { id: "a", text: `Öffnungszeiten` },
      { id: "b", text: `Anmeldung und Ausweis` },
      { id: "c", text: `Leihfristen und Gebühren` },
      { id: "d", text: `Behandlung der Medien und Ersatz` },
      { id: "e", text: `Internetplätze und WLAN` },
      { id: "f", text: `Veranstaltungen und Führungen` },
      { id: "g", text: `Verhalten in den Räumen` },
      { id: "h", text: `Hausrecht und Ausschluss` },
    ],
    targets: [
      {
        id: "t28",
        prompt: `Welche Überschrift passt zu § 2?`,
        correctOptionId: "b",
        explanation: "The paragraph ends with what to do if you lose it, which tempts towards a heading about exclusion — that is one consequence inside the rule, not its subject.",
      },
      {
        id: "t29",
        prompt: `Welche Überschrift passt zu § 3?`,
        correctOptionId: "c",
        explanation: "Two ideas, one heading: how long you may keep it, and what it costs if you keep it longer.",
      },
      {
        id: "t30",
        prompt: `Welche Überschrift passt zu § 4?`,
        correctOptionId: "d",
        explanation: "The word „haftet“ points towards a liability heading, but the paragraph is about the media themselves, not about who is liable in general.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-05-zuordnung-person",
    level: "B2",
    title: "Personen zuordnen",
    source: "Forenbeiträge",
    instruction: `Sie lesen in einem Forum, wie vier Menschen über Reparieren statt Wegwerfen denken. Auf welche der vier Personen treffen die Aussagen 1 bis 9 zu? Die Personen können mehrmals gewählt werden.`,
    options: [
      { id: "a", title: "Kunigunde Perlbach, Elektrikermeisterin", text: `Ich repariere seit dreißig Jahren Haushaltsgeräte und höre seit dreißig Jahren denselben Satz: Das lohnt sich nicht mehr. Meistens stimmt er sogar, nur liegt es nicht an mir. Eine Stunde Arbeit kostet bei mir sechzig Euro, und viele Geräte kosten neu hundertzwanzig.

Woran es tatsächlich hakt, sind die Ersatzteile. Für eine Waschmaschine von zweitausendzehn bekomme ich meist noch alles. Bei einem Gerät von vor drei Jahren stehe ich regelmäßig vor der Auskunft, das Teil werde nicht mehr geführt — bei einer Maschine, die technisch tadellos ist bis auf ein Kunststoffteil für vier Euro.

Das ärgert mich mehr als die Kundschaft, die neu kauft. Die entscheidet ja vernünftig. Unvernünftig ist, dass ich ihr nichts anderes anbieten kann.` },
      { id: "b", title: "Dr. Ansgar Wollenweber, Ökonom", text: `Die Diskussion wird fast immer moralisch geführt, und das halte ich für einen Fehler. Wer neu kauft, handelt nicht gedankenlos, sondern reagiert auf Preise, die genau so gesetzt sind. Reparieren ist teuer, weil Arbeit hier teuer ist; Neuware ist billig, weil Arbeit anderswo billig ist.

Wollte man das ändern, müsste man an den Preisen ansetzen, nicht an der Einstellung. Ein niedrigerer Steuersatz auf Reparaturleistungen ist in mehreren Ländern erprobt, und die Wirkung ist bescheiden, aber messbar.

Eines sollte man dabei allerdings nicht verschweigen: Auch die längere Nutzung hat Grenzen. Ein zwanzig Jahre alter Kühlschrank verbraucht so viel Strom, dass ein neuer ökologisch die bessere Wahl ist. Pauschale Regeln taugen hier nichts.` },
      { id: "c", title: "Mareike Lohsträter, Repair-Café", text: `Bei uns kommen samstags zwischen dreißig und fünfzig Leute vorbei, und wir bekommen ungefähr die Hälfte der Geräte wieder zum Laufen. Was mich nach vier Jahren immer noch überrascht: Die meisten kommen gar nicht wegen des Geldes.

Sie kommen mit Dingen, die kaputt sind und an denen etwas hängt — die Lampe der Großmutter, das erste eigene Radio. Und sie bleiben oft zwei Stunden, obwohl die Reparatur zwanzig Minuten dauert.

Was mir Sorgen macht, ist unser Nachwuchs. Unsere Reparierenden sind im Schnitt über sechzig. Sie haben ihr Wissen in Berufen erworben, die es so nicht mehr gibt. Wenn wir in zehn Jahren niemanden nachgezogen haben, nützt uns das beste Recht auf Reparatur nichts.` },
      { id: "d", title: "Ferdi Osterloh, Student", text: `Ich habe mein Handy letztes Jahr selbst repariert, mit einer Anleitung aus dem Netz und einem Werkzeugsatz für neun Euro. Der Akku hat achtzehn gekostet, ein neues Gerät hätte sechshundert gekostet. Gedauert hat es vierzig Minuten und ich habe zweimal geflucht.

Was mich daran am meisten geärgert hat, war nicht die Technik, sondern der Klebstoff. Man merkt beim Öffnen genau, dass niemand wollte, dass ich da hineinschaue. Das ist eine Entscheidung, die jemand am Reißbrett getroffen hat.

Seitdem schaue ich vor jedem Kauf nach, wie leicht sich ein Gerät öffnen lässt. Das ist mir inzwischen wichtiger als die Bildschirmgröße, und ich bin damit unter meinen Freunden ziemlich allein.` },
    ],
    targets: [
      {
        id: "t1",
        prompt: `Diese Person nennt fehlende Ersatzteile als eigentliches Hindernis.`,
        correctOptionId: "a",
        explanation: "She names the labour cost first and then sets it aside — „tatsächlich“ marks the real obstacle.",
      },
      {
        id: "t2",
        prompt: `Diese Person hält es für falsch, die Frage moralisch zu stellen.`,
        correctOptionId: "b",
        explanation: "a says something similar about her customers, but as an observation from the counter, not as a criticism of the debate.",
      },
      {
        id: "t3",
        prompt: `Diese Person hat ein Gerät mit einer Anleitung aus dem Internet repariert.`,
        correctOptionId: "d",
        explanation: "Only d repairs something himself as a private person; the others repair professionally or organise a café.",
      },
      {
        id: "t4",
        prompt: `Diese Person sorgt sich darum, wer künftig reparieren soll.`,
        correctOptionId: "c",
        explanation: "a is a professional who could train people, but she worries about parts, not about successors.",
      },
      {
        id: "t5",
        prompt: `Diese Person sagt, dass ein sehr altes Gerät nicht immer die bessere Wahl ist.`,
        correctOptionId: "b",
        explanation: "He is arguing for repair overall — this is the qualification he insists on adding, not a change of side.",
      },
      {
        id: "t6",
        prompt: `Diese Person beobachtet, dass es den Leuten selten ums Geld geht.`,
        correctOptionId: "c",
        explanation: "b argues the exact opposite about buyers in general, which is what the pair of posts is built on.",
      },
      {
        id: "t7",
        prompt: `Diese Person achtet beim Kauf darauf, ob sich ein Gerät öffnen lässt.`,
        correctOptionId: "d",
        explanation: "„Seitdem“ ties it back to the glue — the repair changed how he shops.",
      },
      {
        id: "t8",
        prompt: `Diese Person schlägt eine Änderung bei den Steuern vor.`,
        correctOptionId: "b",
        explanation: "He is the only one proposing a policy; the others describe what they do or see.",
      },
      {
        id: "t9",
        prompt: `Diese Person ärgert sich über eine Entscheidung der Hersteller, nicht über die Kundschaft.`,
        correctOptionId: "a",
        explanation: "d is also annoyed at a manufacturer's decision — the glue — but he never contrasts it with customers.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-05-zuordnung-aeusserungen",
    level: "B2",
    title: "Aussagen zuordnen",
    source: "Interviews",
    instruction: `Sie lesen in einer Zeitschrift Meinungsäußerungen zum Thema Bargeld oder Karte. Welche Äußerung a bis h passt zu welcher Überschrift 22 bis 27? Eine Äußerung dient als Beispiel, eine weitere passt zu keiner Überschrift.`,
    options: [
      { id: "a", title: "Sigrun Delfs", text: `Ich zahle seit vier Jahren fast alles mit Karte und wollte das eigentlich nicht. Angefangen hat es damit, dass ich im Ausland war und es dort nicht anders ging. Zurück in Deutschland habe ich gemerkt, dass ich die Umstellung gar nicht rückgängig machen möchte — obwohl ich vorher ziemlich laut gegen das bargeldlose Bezahlen gewettert hatte.` },
      { id: "b", title: "Hussein Kassab", text: `In meinem Imbiss kostet mich jede Kartenzahlung eine Gebühr, und bei einem Kaffee für zwei Euro fünfzig ist das spürbar. Ich biete Karte trotzdem an, weil ich sonst Gäste verliere. Ich sage aber jedem, der es hören will: Wer bar zahlt, will dem kleinen Laden einen Gefallen tun, und dem Konzern ist es egal.` },
      { id: "c", title: "Prof. Ilona Wrasmann", text: `In unseren Versuchen geben dieselben Menschen mit Karte durchschnittlich zwischen zehn und zwanzig Prozent mehr aus als mit Bargeld — bei gleichem Einkommen und gleichem Einkaufszettel. Der Grund ist vermutlich, dass das Weggeben von Scheinen körperlich spürbar ist und das Auflegen einer Karte nicht.` },
      { id: "d", title: "Reinhold Achterberg", text: `Meine Mutter ist siebenundachtzig und kommt mit dem Kartenlesegerät nicht zurecht. Sie hat es zweimal versucht, sich beide Male vor einer Schlange geschämt und benutzt seitdem nur noch Bargeld. Wenn der Bäcker im Ort irgendwann keins mehr nimmt, kauft sie dort nicht mehr ein. So einfach ist das, und so wenig kommt es in dieser Debatte vor.` },
      { id: "e", title: "Yannic Störmer", text: `Mich stört an dieser Diskussion die Übertreibung auf beiden Seiten. Die einen tun so, als stünde die Überwachung vor der Tür, die anderen, als sei ein Geldschein ein Zeichen von Rückständigkeit. Tatsächlich benutzen die meisten Menschen längst beides, je nach Betrag und Situation, und kommen damit gut zurecht.` },
      { id: "f", title: "Dr. Beate Kienzler", text: `Was in einer solchen Debatte leicht zu kurz kommen kann, ist die Frage nach dem Ausfall. Ein Kartensystem hängt an Strom und Netz. Als bei uns im Winter für neun Stunden der Strom weg war, konnte in der ganzen Innenstadt niemand mehr etwas kaufen — außer in zwei Läden, die Bargeld nahmen und Wechselgeld in der Schublade hatten.` },
      { id: "g", title: "Malte Grönebaum", text: `Für mich ist es eine reine Frage der Übersicht. Seit ich alles mit Karte zahle, sehe ich am Monatsende, wohin das Geld geht — vorher war das Bargeld einfach weg und ich wusste nicht, wofür. Dass ich dabei angeblich mehr ausgebe, glaube ich nicht; bei mir ist es seitdem eher weniger geworden.` },
      { id: "h", title: "Tanja Ruppersberg", text: `Ich arbeite in der Schuldnerberatung, und ich sehe die andere Seite. Wer den Überblick verloren hat, dem empfehlen wir als Erstes, für vier Wochen nur mit Bargeld zu zahlen und sich das Wochenbudget abzuheben. Das klingt altmodisch und wirkt zuverlässiger als jede App, die ich bisher gesehen habe.` },
    ],
    targets: [
      {
        id: "t22",
        prompt: `Jede Kartenzahlung kostet meinen Laden Geld`,
        correctOptionId: "b",
        explanation: "He is not refusing cards; the heading is about what they cost him, which is exactly what he says.",
      },
      {
        id: "t23",
        prompt: `Mit Karte geben dieselben Leute mehr aus`,
        correctOptionId: "c",
        explanation: "g disputes exactly this finding from his own experience, which is what the pair is built on.",
      },
      {
        id: "t24",
        prompt: `Ältere Menschen fallen dabei hinten herunter`,
        correctOptionId: "d",
        explanation: "The shame in the queue, not the technology, is what settled it — which is the observation the heading names.",
      },
      {
        id: "t25",
        prompt: `Beide Seiten übertreiben`,
        correctOptionId: "e",
        explanation: "Only e comments on the debate itself; everyone else takes a position within it.",
      },
      {
        id: "t26",
        prompt: `Ohne Strom geht plötzlich gar nichts mehr`,
        correctOptionId: "f",
        explanation: "Her argument is about resilience, not about cost, privacy or age — the only one on that ground.",
      },
      {
        id: "t27",
        prompt: `Bei Geldproblemen raten wir zum Umstieg auf Bargeld`,
        correctOptionId: "h",
        explanation: "g uses cards precisely to keep an overview — h recommends the opposite, for people who have lost it.",
      },
    ],
  },
  {
    kind: "matching",
    id: "b2-05-zuordnung-ueberschriften",
    level: "B2",
    title: "Hausordnung des Studentenwohnheims Weidenbach — Auszug",
    source: "Ordnung",
    instruction: `Sie ziehen in ein Studentenwohnheim und lesen die Hausordnung. Welche der Überschriften a bis h aus dem Inhaltsverzeichnis passen zu den Paragraphen 28 bis 30? Vier Überschriften passen zu keinem der Paragraphen.`,
    referenceText: `§ 1 Geltung
Diese Hausordnung gilt für alle Bewohnerinnen und Bewohner sowie für deren Gäste. Sie ist Bestandteil des Mietvertrages; mit dem Einzug wird sie anerkannt.

§ 2 [28]
In der Zeit von zweiundzwanzig bis sieben Uhr sowie sonntags ganztägig ist Lärm zu vermeiden, der außerhalb des eigenen Zimmers zu hören ist. Musikinstrumente dürfen werktags zwischen zehn und zwanzig Uhr höchstens zwei Stunden gespielt werden. Feiern in den Gemeinschaftsräumen sind bis Mitternacht möglich und drei Tage vorher der Verwaltung anzuzeigen.

§ 3 [29]
Küche, Bad und Aufenthaltsraum sind nach der Benutzung gereinigt zu hinterlassen. Geschirr ist unverzüglich zu spülen und wegzuräumen; stehen gelassenes Geschirr wird nach achtundvierzig Stunden entfernt. Der Reinigungsplan im Flur ist verbindlich, die Verteilung regelt die Etage selbst.

§ 4 [30]
Besuch ist willkommen und bis zu drei Nächte im Monat ohne Anmeldung möglich. Wer länger bleibt, ist der Verwaltung zu melden; eine dauerhafte Aufnahme weiterer Personen ist ausgeschlossen. Für das Verhalten der Gäste haftet die einladende Person.`,
    options: [
      { id: "a", text: `Geltung` },
      { id: "b", text: `Ruhezeiten und Musik` },
      { id: "c", text: `Gemeinschaftsräume und Reinigung` },
      { id: "d", text: `Besuch und Übernachtungen` },
      { id: "e", text: `Miete und Kaution` },
      { id: "f", text: `Fahrräder und Keller` },
      { id: "g", text: `Kündigung und Auszug` },
      { id: "h", text: `Internet und Fernsehen` },
    ],
    targets: [
      {
        id: "t28",
        prompt: `Welche Überschrift passt zu § 2?`,
        correctOptionId: "b",
        explanation: "The last sentence is about parties in the common rooms, which pulls towards c — but it is there as a noise rule.",
      },
      {
        id: "t29",
        prompt: `Welche Überschrift passt zu § 3?`,
        correctOptionId: "c",
        explanation: "Two ideas, one heading: which rooms are shared and in what state they are left.",
      },
      {
        id: "t30",
        prompt: `Welche Überschrift passt zu § 4?`,
        correctOptionId: "d",
        explanation: "„haftet“ appears here too, which is the standard hook towards a liability heading that this list does not offer.",
      },
    ],
  },
];

const SENTENCE_INSERTION_PASSAGES: LesenSentenceInsertionPassage[] = [
  {
    kind: "sentence-insertion",
    id: "b2-01-satz-einfuegen",
    level: "B2",
    title: "Als das Licht in die Städte kam",
    source: "Hohenrode Magazin für Stadtgeschichte",
    instruction: `Sie lesen in einer Zeitschrift einen Artikel über die Geschichte der Straßenbeleuchtung. Welche der Sätze a bis h passen in die Lücken 10 bis 15? Ein Satz steht bereits als Beispiel im Text, ein weiterer Satz passt in keine Lücke.`,
    segments: [
      `Wer heute nach Einbruch der Dunkelheit durch eine europäische Innenstadt geht, nimmt die Beleuchtung kaum noch wahr. Vor vierhundert Jahren war das Gegenteil selbstverständlich: Nach Sonnenuntergang lag die Stadt im Dunkeln, und wer sich dennoch hinauswagte, trug eine Laterne bei sich. Wer ohne Licht unterwegs war, geriet rasch in Verdacht, etwas im Schilde führen zu wollen.

Die ersten Versuche einer geordneten Beleuchtung stammen aus dem 17. Jahrhundert. Städte verpflichteten ihre Bürger, an bestimmten Abenden Öllampen vor die Fenster zu hängen, und stellten später eigenes Personal dafür ein. `,
      ` Zuverlässig war dieses Licht allerdings nicht: Es rauchte, es roch, und bei Wind ging es aus.

Erst das Gaslicht veränderte im 19. Jahrhundert die Größenordnung. `,
      ` Innerhalb weniger Jahrzehnte wurden ganze Straßenzüge an ein Leitungsnetz angeschlossen, das sich zentral steuern ließ.

Begeisterung löste das keineswegs überall aus. `,
      ` Ärzte warnten vor Schäden für die Augen, Geistliche vor einem Leben, das sich immer weiter in die Nacht verschob, und manche Zeitgenossen hielten die ganze Erleuchtung schlicht für Verschwendung.

Mit dem elektrischen Bogenlicht setzte sich ab den 1880er-Jahren durch, was die Kritiker befürchtet hatten. `,
      ` Zeitungen sprachen vom künstlichen Tag, und tatsächlich verschob sich das gesellschaftliche Leben.

Die Folgen reichten weit über die Straße hinaus. Geschäfte öffneten länger, Fabriken führten Nachtschichten ein, und die Frage, wie sicher eine beleuchtete Stadt tatsächlich ist, beschäftigt die Forschung bis heute. `,
      `

Inzwischen hat sich die Richtung der Debatte gedreht. `,
      ` Kommunen dimmen ihre Lampen nach Mitternacht, tauschen kaltes gegen warmes Licht und lassen einzelne Straßen zeitweise dunkel — aus Gründen, die vor hundert Jahren niemand für denkbar gehalten hätte.`,
    ],
    gaps: [
      {
        id: "10",
        correctOptionId: "b",
        explanation: "The demonstrative „So“ needs something in the preceding sentence to refer back to, and only the hired staff fits. d would also mention light, but there is no gas yet at this point in the text.",
      },
      {
        id: "11",
        correctOptionId: "d",
        explanation: "The comparative chain heller/länger/gleichmäßiger answers the claim made immediately before. Sentence a would introduce opposition, which the text only does two paragraphs later.",
      },
      {
        id: "12",
        correctOptionId: "a",
        explanation: "The gap sits between a statement of resistance and a list of who resisted; only a bridges the two. Without it the list has nothing to be a list of.",
      },
      {
        id: "13",
        correctOptionId: "e",
        explanation: "„Die Nacht hörte auf, eine natürliche Grenze zu sein“ is the content of the fear announced before and the reason for the newspapers' phrase after. c also concerns today, not the 1880s.",
      },
      {
        id: "14",
        correctOptionId: "f",
        explanation: "The pronoun settles it: there is exactly one feminine singular noun in reach, and it is die Forschung.",
      },
      {
        id: "15",
        correctOptionId: "c",
        explanation: "„Nicht mehr … sondern“ is itself the reversal announced in the previous sentence, and it makes sense of dimming lamps in the next one.",
      },
    ],
    options: [
      { id: "a", text: `Gegen die neue Helligkeit regte sich von Anfang an Widerstand, und zwar aus ganz unterschiedlichen Richtungen.` },
      { id: "b", text: `So entstand ein Beruf, den es bis weit ins 20. Jahrhundert gab: der Laternenanzünder, der jeden Abend seine Runde drehte.` },
      { id: "c", text: `Nicht mehr zu wenig Licht gilt heute als Problem, sondern zu viel.` },
      { id: "d", text: `Es brannte heller, länger und vor allem gleichmäßiger als jede Flamme zuvor.` },
      { id: "e", text: `Die Nacht hörte auf, eine natürliche Grenze zu sein.` },
      { id: "f", text: `Eindeutige Antworten liefert sie dabei bis heute nicht.` },
      { id: "g", text: `Vergleichbare Entwicklungen lassen sich auch beim Ausbau der Wasserversorgung beobachten.` },
      { id: "h", text: `Wer ohne Licht unterwegs war, geriet rasch in Verdacht, etwas im Schilde führen zu wollen.` },
    ],
  },
  {
    kind: "sentence-insertion",
    id: "b2-02-satz-einfuegen",
    level: "B2",
    title: "Wie die Kartoffel auf den Teller kam",
    source: "Weidenbacher Blätter für Kulturgeschichte",
    instruction: `Sie lesen in einer Zeitschrift einen Artikel über die Geschichte der Kartoffel in Europa. Welche der Sätze a bis h passen in die Lücken 10 bis 15? Ein Satz steht bereits als Beispiel im Text, ein weiterer Satz passt in keine Lücke.`,
    segments: [
      `Kaum ein Nahrungsmittel gilt heute als so selbstverständlich deutsch wie die Kartoffel. Dabei kannte sie in Europa vor knapp fünfhundert Jahren niemand. Sie stammt aus den Anden, wo sie seit Jahrtausenden angebaut wurde, und kam im 16. Jahrhundert mit spanischen Schiffen über den Atlantik. Ihre Karriere begann sie allerdings nicht als Nahrung, sondern als Zierpflanze in botanischen Gärten.

Dass daraus ein Grundnahrungsmittel wurde, hat gedauert. `,
      ` Die Knolle wächst unter der Erde, sie gehört zu einer Pflanzenfamilie mit giftigen Verwandten, und wer versehentlich die grünen Früchte aß, wurde tatsächlich krank.

Erst der Hunger änderte das. `,
      ` Getreide verdirbt auf dem Feld, wenn ein Sommer verregnet; die Kartoffel liegt geschützt im Boden und liefert auf derselben Fläche deutlich mehr Kalorien.

Die Obrigkeit half nach, teils mit erstaunlichen Mitteln. `,
      ` Überliefert ist die Geschichte von Feldern, die tagsüber auffällig bewacht und nachts unbewacht gelassen wurden — weil bewachte Ware begehrenswert wirkt.

Im 19. Jahrhundert war die Umstellung abgeschlossen, mit allen Folgen. `,
      ` Als in den 1840er-Jahren eine aus Amerika eingeschleppte Pilzkrankheit die Ernten vernichtete, traf das Irland mit voller Wucht: Eine Million Menschen starben, zwei Millionen wanderten aus.

Daraus hat die Landwirtschaft gelernt, wenn auch langsam. `,
      ` Weltweit sind heute mehreretausend Sorten beschrieben, von denen im Handel allerdings nur eine Handvoll auftaucht.

Und die Zierpflanze von einst? Ihre Blüte steckte sich einst der französische Hof ans Revers. `,
      ` Wer heute im Frühsommer über ein blühendes Kartoffelfeld schaut, sieht denselben Zierwert — er denkt nur nicht mehr daran.`,
    ],
    gaps: [
      {
        id: "10",
        correctOptionId: "b",
        explanation: "The gap sits between a claim that it took time and a list of why. Only b bridges the two.",
      },
      {
        id: "11",
        correctOptionId: "d",
        explanation: "The sentence after the gap explains why the new crop was more reliable, so the gap has to claim it was.",
      },
      {
        id: "12",
        correctOptionId: "f",
        explanation: "„nämlich“ marks it as the explanation of the sentence before, and the guarded fields are the illustration after.",
      },
      {
        id: "13",
        correctOptionId: "e",
        explanation: "a makes a similar point but about varieties, which the text only raises two paragraphs later.",
      },
      {
        id: "14",
        correctOptionId: "a",
        explanation: "Both a and e are about dependence, but only a is about varieties, which is what the following sentence counts.",
      },
      {
        id: "15",
        correctOptionId: "c",
        explanation: "The closing sentence contradicts it gently — the ornamental value is still there, unnoticed — which only works if the gap asserts it has gone.",
      },
    ],
    options: [
      { id: "a", text: `Wer nur eine einzige Sorte anbaut, verliert bei einer einzigen Krankheit alles.` },
      { id: "b", text: `Zwei Jahrhunderte lang blieb sie den Menschen unheimlich, und dafür gab es Gründe.` },
      { id: "c", text: `Heute erinnert an diese Herkunft nichts mehr.` },
      { id: "d", text: `Wo die Ernte ausfiel, überstand die neue Frucht das Wetter zuverlässiger als alles Bisherige.` },
      { id: "e", text: `Denn wer sich vollständig auf eine Pflanze verlässt, hängt auch von ihren Krankheiten ab.` },
      { id: "f", text: `Befehle allein wirkten nämlich wenig.` },
      { id: "g", text: `Auch der Kaffee brauchte in Europa mehrere Jahrzehnte, bis er akzeptiert wurde.` },
      { id: "h", text: `Ihre Karriere begann sie allerdings nicht als Nahrung, sondern als Zierpflanze in botanischen Gärten.` },
    ],
  },
  {
    kind: "sentence-insertion",
    id: "b2-03-satz-einfuegen",
    level: "B2",
    title: "Als die Straße dem Rad gehörte",
    source: "Sallberger Blätter für Stadtgeschichte",
    instruction: `Sie lesen in einer Zeitschrift einen Artikel über die Geschichte des Fahrrads. Welche der Sätze a bis h passen in die Lücken 10 bis 15? Ein Satz steht bereits als Beispiel im Text, ein weiterer Satz passt in keine Lücke.`,
    segments: [
      `Wer heute für einen Radweg kämpft, hat selten im Kopf, dass das Fahrrad schon einmal gewonnen hatte. Um 1900 war es in europäischen Städten das schnellste Verkehrsmittel für Einzelne, und die Straßen gehörten ihm in einem Maß, das aus heutiger Sicht kaum vorstellbar ist. Was wir für einen modernen Konflikt halten, ist in Wahrheit die zweite Runde eines alten.

Der Anfang war allerdings mühsam. `,
      ` Erst als in den 1880er-Jahren gleich große Räder, eine Kette und der luftgefüllte Reifen zusammenkamen, wurde daraus ein Gerät für den Alltag.

Danach ging es schnell, und zwar aus einem Grund, den man leicht übersieht. `,
      ` Ein Arbeiter konnte sich ein gebrauchtes Rad leisten, ein Pferd nie; damit war zum ersten Mal ein Verkehrsmittel nicht an Vermögen gebunden.

Die Folgen reichten weit über den Verkehr hinaus. `,
      ` Zeitgenössische Berichte beschreiben empört, dass junge Frauen ohne Begleitung aus der Stadt hinausfuhren — und beiläufig, dass sie dafür ihre Kleidung änderten.

Sogar die Straßen selbst verdanken dem Rad mehr, als das Auto zugeben mag. `,
      ` Radfahrervereine forderten glatte Beläge lange bevor es nennenswerten Autoverkehr gab, und in mehreren Ländern gingen die ersten Asphaltstrecken auf ihre Eingaben zurück.

Dann kippte das Verhältnis. `,
      ` Zwischen 1920 und 1960 wurde der Straßenraum in fast ganz Westeuropa neu aufgeteilt, und das Rad verlor dabei fast alles, was es gewonnen hatte.

Heute dreht sich die Entwicklung wieder. `,
      ` Dabei geht es allerdings selten um Nostalgie: Wer Radwege plant, rechnet mit Fläche, mit Lärm und mit Gesundheitskosten — und kommt aus ganz anderen Gründen zu ganz ähnlichen Ergebnissen wie die Vereine vor hundert Jahren.`,
    ],
    gaps: [
      {
        id: "10",
        correctOptionId: "b",
        explanation: "„Erst als …“ in the next sentence requires a stated period that it brings to an end; only b supplies one.",
      },
      {
        id: "11",
        correctOptionId: "a",
        explanation: "The sentence after the gap is about affordability, so the gap has to name affordability as the reason.",
      },
      {
        id: "12",
        correctOptionId: "d",
        explanation: "„ohne jemanden um Erlaubnis zu fragen“ is precisely what the outraged reports are about.",
      },
      {
        id: "13",
        correctOptionId: "f",
        explanation: "The gap sits between a claim and its evidence, and f restates the claim in the form the evidence answers.",
      },
      {
        id: "14",
        correctOptionId: "c",
        explanation: "„Dann kippte das Verhältnis“ needs an agent, and the years 1920 to 1960 in the next sentence confirm which one.",
      },
      {
        id: "15",
        correctOptionId: "e",
        explanation: "The following sentence pushes back against a nostalgic reading, which only makes sense if the gap describes cities taking something back.",
      },
    ],
    options: [
      { id: "a", text: `Es war schlicht das erste bezahlbare Fahrzeug.` },
      { id: "b", text: `Vierzig Jahre lang war das Rad ein teures und gefährliches Spielzeug für sportliche Männer.` },
      { id: "c", text: `Mit dem Auto kam ein Mitbewerber, der mehr Platz brauchte und ihn auch bekam.` },
      { id: "d", text: `Wer plötzlich zwanzig Kilometer weit reisen konnte, ohne jemanden um Erlaubnis zu fragen, lebte anders.` },
      { id: "e", text: `Immer mehr Städte holen zurück, was sie damals abgegeben haben.` },
      { id: "f", text: `Ohne die Radfahrer gäbe es die befestigte Landstraße in ihrer heutigen Form vermutlich später.` },
      { id: "g", text: `Auch die Eisenbahn veränderte in dieser Zeit das Reisen grundlegend.` },
      { id: "h", text: `Was wir für einen modernen Konflikt halten, ist in Wahrheit die zweite Runde eines alten.` },
    ],
  },
  {
    kind: "sentence-insertion",
    id: "b2-04-satz-einfuegen",
    level: "B2",
    title: "Warum die Stadt schwimmen lernte",
    source: "Hohenrode Magazin für Stadtgeschichte",
    instruction: `Sie lesen in einer Zeitschrift einen Artikel über die Geschichte des Schwimmbads. Welche der Sätze a bis h passen in die Lücken 10 bis 15? Ein Satz steht bereits als Beispiel im Text, ein weiterer Satz passt in keine Lücke.`,
    segments: [
      `Ein Schwimmbad wirkt heute wie eine Selbstverständlichkeit, ungefähr so wie eine Turnhalle oder eine Bushaltestelle. Tatsächlich ist es eine vergleichsweise junge Einrichtung, und sie entstand nicht aus Freude am Wasser. Sie entstand aus zwei sehr nüchternen Gründen: Hygiene und Unfallzahlen.

Der erste Grund ist heute schwer vorstellbar. `,
      ` In den wachsenden Städten des 19. Jahrhunderts hatten die wenigsten Wohnungen ein Bad, und so wurden Volksbäder gebaut, in denen man vor allem eines tat: sich waschen.

Das Schwimmen kam erst danach dazu. `,
      ` Wer am Fluss badete, tat das ohne Aufsicht und ohne es gelernt zu haben, und die Zahl der Ertrunkenen war entsprechend hoch.

Bemerkenswert ist, wer den Bau durchsetzte. `,
      ` Ärzte, Turnvereine und Versicherungen mussten dafür an einem Strang ziehen, wenn auch aus ganz unterschiedlichen Motiven — die einen aus Sorge um die Gesundheit, die anderen um die Kosten.

Im 20. Jahrhundert kehrte sich die Nutzung um. `,
      ` Wohnungen bekamen eigene Bäder, das Waschbecken im Volksbad wurde überflüssig, und aus der Wascheinrichtung wurde ein Sportbad und später ein Freizeitbad mit Rutsche.

Heute stehen viele dieser Häuser wieder zur Debatte, und zwar aus Gründen, die mit dem Schwimmen wenig zu tun haben. `,
      ` Ein Hallenbad gehört zu den teuersten Gebäuden, die eine Gemeinde unterhalten kann, weil Wasser geheizt und Luft getrocknet werden muss.

Was dabei leicht untergeht, ist der Ausgangspunkt. `,
      ` Jede Schließung eines Bades verlängert den Weg zum nächsten, und mit dem Weg sinkt die Zahl der Kinder, die dort das Schwimmen lernen.`,
    ],
    gaps: [
      {
        id: "10",
        correctOptionId: "b",
        explanation: "The paragraph after the gap is about washing, so the gap has to introduce washing rather than swimming.",
      },
      {
        id: "11",
        correctOptionId: "d",
        explanation: "The drownings in the next sentence only make sense if the gap has just named deaths as the motive.",
      },
      {
        id: "12",
        correctOptionId: "c",
        explanation: "The paragraph opens by asking who pushed it through, and the gap has to answer that with a group.",
      },
      {
        id: "13",
        correctOptionId: "e",
        explanation: "„kehrte sich die Nutzung um“ needs the gap to say what it turned from and into.",
      },
      {
        id: "14",
        correctOptionId: "h",
        explanation: "Short and blunt, and the next sentence is entirely about running costs — the gap has to name money.",
      },
      {
        id: "15",
        correctOptionId: "a",
        explanation: "„nicht … sondern“ ties the closing paragraph back to the opening motive, which is what „der Ausgangspunkt“ points at.",
      },
    ],
    options: [
      { id: "a", text: `Nicht der Bedarf ist gesunken, sondern die Bereitschaft, dafür zu zahlen.` },
      { id: "b", text: `Baden diente ursprünglich der Sauberkeit, nicht dem Vergnügen.` },
      { id: "c", text: `Der Anstoß kam von einem ungewöhnlichen Bündnis.` },
      { id: "d", text: `Das Ziel war zunächst nicht der Sport, sondern die Vermeidung von Todesfällen.` },
      { id: "e", text: `Was als Notwendigkeit begonnen hatte, wurde zum Vergnügen.` },
      { id: "f", text: `Auch die Turnhallen dieser Zeit wurden aus ähnlichen Erwägungen errichtet.` },
      { id: "g", text: `Sie entstand aus zwei sehr nüchternen Gründen: Hygiene und Unfallzahlen.` },
      { id: "h", text: `Es geht fast immer ums Geld.` },
    ],
  },
  {
    kind: "sentence-insertion",
    id: "b2-05-satz-einfuegen",
    level: "B2",
    title: "Der Montag, den es nicht mehr gibt",
    source: "Sallberger Blätter für Kulturgeschichte",
    instruction: `Sie lesen in einer Zeitschrift einen Artikel über die Geschichte der Waschmaschine. Welche der Sätze a bis h passen in die Lücken 10 bis 15? Ein Satz steht bereits als Beispiel im Text, ein weiterer Satz passt in keine Lücke.`,
    segments: [
      `Fragt man ältere Menschen, woran sie die Woche ihrer Kindheit erinnern, kommt erstaunlich oft der Montag. Montag war Waschtag, und das war kein Ausdruck, sondern eine Tatsache: Ein ganzer Tag, manchmal zwei, gingen für eine einzige Aufgabe drauf.

Die Zahlen dazu sind heute schwer zu glauben. `,
      ` Kochen, Einweichen, Schrubben, Spülen, Wringen, Aufhängen — Untersuchungen aus den zwanziger Jahren kommen für einen Haushalt auf bis zu zwanzig Stunden pro Woche allein für die Wäsche.

Die ersten Maschinen änderten daran weniger, als man denkt. `,
      ` Sie mussten von Hand gefüllt, beheizt und entleert werden, und wer sie bediente, stand trotzdem den halben Tag daneben.

Der eigentliche Sprung kam später und hatte zwei Voraussetzungen. `,
      ` Ohne Strom in jeder Wohnung und ohne Wasseranschluss im Haus blieb die Maschine ein Gerät für wenige.

Was dann geschah, ist gut dokumentiert und wird trotzdem selten erzählt. `,
      ` Zwischen 1950 und 1970 sank die Zeit für Hausarbeit in westeuropäischen Haushalten um etwa die Hälfte, und zwar fast vollständig zugunsten von Erwerbsarbeit von Frauen.

Ganz so einfach ist die Rechnung allerdings nicht. `,
      ` Mit den Maschinen stiegen nämlich die Ansprüche: Was früher zweimal im Monat gewaschen wurde, wurde nun zweimal in der Woche gewaschen, und aus einer Tischdecke für Gäste wurde eine für jeden Tag.

Heute ist die Maschine so selbstverständlich, dass sie erst auffällt, wenn sie stehen bleibt. `,
      ` Wer sie repariert bekommt, gewinnt ein Gerät zurück, das einmal einen ganzen Wochentag abgeschafft hat.`,
    ],
    gaps: [
      {
        id: "10",
        correctOptionId: "b",
        explanation: "The list of six verbs is the evidence, so the gap has to announce that there were many steps.",
      },
      {
        id: "11",
        correctOptionId: "d",
        explanation: "The paragraph says the first machines changed less than expected; only d says in what way.",
      },
      {
        id: "12",
        correctOptionId: "e",
        explanation: "„Beide“ needs two things already announced, and „zwei Voraussetzungen“ is what announces them.",
      },
      {
        id: "13",
        correctOptionId: "g",
        explanation: "The paragraph promises something well documented and rarely told; the gap has to state the claim itself.",
      },
      {
        id: "14",
        correctOptionId: "a",
        explanation: "„Ganz so einfach ist die Rechnung nicht“ sets up a qualification, and only a states what was lost again.",
      },
      {
        id: "15",
        correctOptionId: "c",
        explanation: "The closing sentence is about getting it repaired, so the gap has to turn from noticing the breakdown to not replacing it.",
      },
    ],
    options: [
      { id: "a", text: `Ein Teil der gewonnenen Zeit ging sofort wieder verloren.` },
      { id: "b", text: `Waschen war körperlich schwere Arbeit, und sie bestand aus vielen Schritten.` },
      { id: "c", text: `Vielleicht ist das der beste Grund, sie nicht gleich zu ersetzen.` },
      { id: "d", text: `Sie nahmen den schwersten Handgriff ab, aber nicht die Aufsicht.` },
      { id: "e", text: `Beide hatten mit der Maschine selbst nichts zu tun.` },
      { id: "f", text: `Auch der Kühlschrank setzte sich in dieser Zeit in den Haushalten durch.` },
      { id: "g", text: `Kaum eine Erfindung hat den Alltag so verändert wie diese.` },
      { id: "h", text: `Montag war Waschtag, und das war kein Ausdruck, sondern eine Tatsache.` },
    ],
  },
];

export const LESEN_PASSAGES_B1_B2: LesenPassage[] = [
  ...CHOICE_PASSAGES,
  ...MATCHING_PASSAGES,
  ...SENTENCE_INSERTION_PASSAGES,
];