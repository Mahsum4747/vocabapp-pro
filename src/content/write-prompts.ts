/**
 * Static, hand-written Write-mode task bank. Exam-format imitation, not exam
 * text. No Firestore field, no Gemini generation of tasks. B2+ types are
 * added in later waves.
 */
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type WriteTaskType =
  "short_message" | "informal_email" | "forum_post" | "formal_email_short" | "formal_letter";

export type WriteScenario =
  | "arzt"
  | "kita_schule"
  | "vermieter"
  | "jobcenter_amt"
  | "arbeit"
  | "nachbarn"
  | "freunde"
  | "kurs"
  | "einkauf";

export interface WritePrompt {
  id: string;
  level: CefrLevel;
  taskType: WriteTaskType;
  scenario: WriteScenario;
  situationDe: string;
  leitpunkte: string[];
  gloss: { en: string; tr: string; ku?: string };
  minWords: number;
  maxWords: number;
  register: "du" | "Sie";
}

export const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const AVAILABLE_LEVELS: CefrLevel[] = ["A1", "A2", "B1"];

/** Gloss in the learner's explanation language; `ku` (or anything unknown) falls back to `en`, never blank. */
export function promptGloss(
  prompt: WritePrompt,
  explanationLanguage: string | null | undefined,
): string {
  if (explanationLanguage === "tr") return prompt.gloss.tr;
  if (explanationLanguage === "ku") return prompt.gloss.ku || prompt.gloss.en;
  return prompt.gloss.en;
}

type Row = Omit<WritePrompt, "level" | "taskType" | "minWords" | "maxWords"> &
  Partial<Pick<WritePrompt, "taskType" | "minWords" | "maxWords">>;

const a1 = (r: Row): WritePrompt =>
  ({ taskType: "short_message", minWords: 20, maxWords: 40, ...r, level: "A1" }) as WritePrompt;
const a2 = (r: Row): WritePrompt =>
  ({ taskType: "short_message", minWords: 40, maxWords: 70, ...r, level: "A2" }) as WritePrompt;
const b1 = (r: Row): WritePrompt =>
  ({ minWords: 60, maxWords: 100, ...r, level: "B1" }) as WritePrompt;

export const WRITE_PROMPTS: WritePrompt[] = [
  a1({
    id: "a1-arzt-termin-absagen",
    scenario: "arzt",
    register: "Sie",
    situationDe:
      "Sie sind krank und können morgen nicht zum Termin in der Praxis kommen. Schreiben Sie eine kurze Nachricht.",
    leitpunkte: [
      "Warum kommen Sie nicht?",
      "Sie möchten einen neuen Termin.",
      "Wann haben Sie Zeit?",
    ],
    gloss: {
      en: "Cancel your doctor's appointment and ask for a new one.",
      tr: "Doktor randevusunu iptal et, yeni randevu iste.",
    },
  }),
  a1({
    id: "a1-kita-kind-krank",
    scenario: "kita_schule",
    register: "Sie",
    situationDe: "Ihr Kind ist krank. Schreiben Sie der Erzieherin in der Kita.",
    leitpunkte: ["Was hat Ihr Kind?", "Es kommt morgen nicht.", "Wann kommt es wieder?"],
    gloss: {
      en: "Tell the daycare your child is sick.",
      tr: "Kreşe çocuğunun hasta olduğunu yaz.",
    },
  }),
  a1({
    id: "a1-nachbarn-party",
    scenario: "nachbarn",
    register: "Sie",
    situationDe:
      "Sie machen am Samstag eine Geburtstagsparty. Schreiben Sie einen Zettel für Ihre Nachbarn.",
    leitpunkte: ["Wann ist die Party?", "Bis wann?", "Laden Sie die Nachbarn ein."],
    gloss: {
      en: "Leave a note for your neighbours about your party.",
      tr: "Komşulara parti notu bırak.",
    },
  }),
  a1({
    id: "a1-freunde-umzug",
    scenario: "freunde",
    register: "du",
    situationDe: "Sie ziehen um. Schreiben Sie einer Freundin eine SMS.",
    leitpunkte: ["Wann ziehen Sie um?", "Bitten Sie um Hilfe.", "Was gibt es zu essen?"],
    gloss: { en: "Ask a friend to help you move.", tr: "Arkadaşından taşınmada yardım iste." },
  }),
  a1({
    id: "a1-arbeit-verspaetung",
    scenario: "arbeit",
    register: "Sie",
    situationDe: "Sie kommen heute später zur Arbeit. Schreiben Sie Ihrer Chefin.",
    leitpunkte: ["Warum kommen Sie später?", "Wann sind Sie da?", "Entschuldigen Sie sich."],
    gloss: { en: "Tell your boss you'll be late for work.", tr: "Şefine işe geç kalacağını yaz." },
  }),
  a1({
    id: "a1-kurs-anmeldung",
    scenario: "kurs",
    register: "Sie",
    situationDe: "Sie möchten einen Deutschkurs machen. Schreiben Sie der Sprachschule.",
    leitpunkte: ["Welchen Kurs möchten Sie?", "Wann haben Sie Zeit?", "Fragen Sie nach dem Preis."],
    gloss: { en: "Write to a language school about a course.", tr: "Dil okuluna kurs için yaz." },
  }),
  a2({
    id: "a2-vermieter-heizung",
    scenario: "vermieter",
    register: "Sie",
    situationDe:
      "In Ihrer Wohnung ist die Heizung kaputt. Schreiben Sie Ihrem Vermieter eine E-Mail.",
    leitpunkte: [
      "Seit wann ist die Heizung kaputt?",
      "Bitten Sie um einen Handwerker.",
      "Wann sind Sie zu Hause?",
    ],
    gloss: {
      en: "Report a broken heater to your landlord.",
      tr: "Ev sahibine kalorifer arızasını bildir.",
    },
  }),
  a2({
    id: "a2-jobcenter-termin",
    scenario: "jobcenter_amt",
    register: "Sie",
    situationDe:
      "Sie haben einen Termin beim Jobcenter, können aber nicht kommen. Schreiben Sie Ihrer Sachbearbeiterin.",
    leitpunkte: [
      "Warum können Sie nicht kommen?",
      "Schlagen Sie einen neuen Termin vor.",
      "Fragen Sie, welche Unterlagen Sie mitbringen sollen.",
    ],
    gloss: { en: "Postpone your Jobcenter appointment.", tr: "Jobcenter randevusunu ertele." },
  }),
  a2({
    id: "a2-freunde-hochzeit",
    scenario: "freunde",
    register: "du",
    situationDe:
      "Ein Freund hat Sie zu seiner Hochzeit eingeladen. Sie können leider nicht kommen.",
    leitpunkte: [
      "Bedanken Sie sich.",
      "Warum können Sie nicht kommen?",
      "Machen Sie einen Vorschlag für ein Treffen.",
    ],
    gloss: {
      en: "Thank a friend for the wedding invitation and decline.",
      tr: "Düğün davetine teşekkür et, katılamayacağını yaz.",
    },
  }),
  a2({
    id: "a2-schule-elternabend",
    scenario: "kita_schule",
    register: "Sie",
    situationDe:
      "Sie können nicht zum Elternabend in der Schule Ihres Sohnes kommen. Schreiben Sie der Lehrerin.",
    leitpunkte: [
      "Entschuldigen Sie sich und nennen Sie den Grund.",
      "Fragen Sie nach den wichtigen Informationen.",
      "Wie kann die Lehrerin Sie erreichen?",
    ],
    gloss: {
      en: "Tell the teacher you can't attend the parents' evening.",
      tr: "Veli toplantısına gelemeyeceğini öğretmene yaz.",
    },
  }),
  a2({
    id: "a2-arbeit-schicht-tauschen",
    scenario: "arbeit",
    register: "du",
    situationDe: "Sie möchten am Freitag nicht arbeiten. Schreiben Sie einem Kollegen.",
    leitpunkte: [
      "Warum brauchen Sie den Tag frei?",
      "Fragen Sie, ob er Ihre Schicht übernimmt.",
      "Bieten Sie einen anderen Tag an.",
    ],
    gloss: { en: "Ask a colleague to swap shifts.", tr: "İş arkadaşınla vardiya değiş." },
  }),
  a2({
    id: "a2-amt-ummeldung",
    scenario: "jobcenter_amt",
    register: "Sie",
    situationDe:
      "Sie sind umgezogen und müssen sich beim Bürgeramt ummelden. Schreiben Sie eine E-Mail.",
    leitpunkte: [
      "Wann sind Sie umgezogen?",
      "Fragen Sie nach einem Termin.",
      "Fragen Sie, welche Dokumente Sie brauchen.",
    ],
    gloss: {
      en: "Email the registration office about your change of address.",
      tr: "Adres değişikliği için Bürgeramt'a yaz.",
    },
  }),
  b1({
    id: "b1-vermieter-laerm",
    taskType: "formal_letter",
    scenario: "vermieter",
    register: "Sie",
    situationDe:
      "Ihre Nachbarn sind seit Wochen nachts sehr laut. Sie haben schon mit ihnen gesprochen. Schreiben Sie an die Hausverwaltung.",
    leitpunkte: [
      "Beschreiben Sie das Problem.",
      "Was haben Sie schon versucht?",
      "Welche Folgen hat das für Sie?",
      "Was soll die Hausverwaltung tun?",
    ],
    gloss: {
      en: "Formal complaint to the property management about noise.",
      tr: "Gürültü için yönetime resmi şikâyet mektubu.",
    },
  }),
  b1({
    id: "b1-kurs-wechseln",
    taskType: "formal_letter",
    scenario: "kurs",
    register: "Sie",
    situationDe:
      "Ihr Deutschkurs findet vormittags statt, aber Sie haben eine neue Arbeit. Schreiben Sie an die Kursleitung.",
    leitpunkte: [
      "Warum schreiben Sie?",
      "Erklären Sie Ihre neue Situation.",
      "Welchen Kurs möchten Sie jetzt besuchen?",
      "Fragen Sie nach den Kosten für den Wechsel.",
    ],
    gloss: {
      en: "Formal letter asking to change your course time.",
      tr: "Kurs saatini değiştirmek için resmi mektup.",
    },
  }),
  b1({
    id: "b1-freunde-neue-arbeit",
    taskType: "informal_email",
    scenario: "freunde",
    register: "du",
    situationDe: "Sie haben eine neue Arbeitsstelle. Schreiben Sie einem Freund in der Türkei.",
    leitpunkte: [
      "Beschreiben Sie Ihre neue Arbeit.",
      "Was gefällt Ihnen, was nicht?",
      "Laden Sie ihn zu einem Besuch ein.",
    ],
    gloss: {
      en: "Tell a friend abroad about your new job.",
      tr: "Türkiye'deki arkadaşına yeni işini anlat.",
    },
  }),
  b1({
    id: "b1-forum-kinder-sprachen",
    taskType: "forum_post",
    scenario: "kita_schule",
    register: "du",
    situationDe:
      "In einem Online-Forum diskutieren Eltern: „Sollen Kinder schon im Kindergarten zwei Sprachen lernen?“ Schreiben Sie Ihre Meinung.",
    leitpunkte: [
      "Ihre Meinung mit Begründung",
      "Ein Beispiel aus Ihrem Leben",
      "Ein Nachteil oder Gegenargument",
    ],
    gloss: {
      en: "Forum post: your opinion on bilingual kids.",
      tr: "Forumda çift dilli çocuk yetiştirme hakkında görüş yaz.",
    },
  }),
  b1({
    id: "b1-chef-termin-absagen",
    taskType: "formal_email_short",
    scenario: "arbeit",
    register: "Sie",
    minWords: 40,
    maxWords: 60,
    situationDe:
      "Sie haben morgen ein Gespräch mit Ihrem Chef, Herrn Weber, können aber nicht kommen.",
    leitpunkte: [
      "Entschuldigen Sie sich höflich.",
      "Nennen Sie den Grund.",
      "Schlagen Sie einen neuen Termin vor.",
    ],
    gloss: {
      en: "Politely cancel a meeting with your boss (short, formal).",
      tr: "Şefinle görüşmeyi kibarca iptal et (kısa, resmi).",
    },
  }),
  b1({
    id: "b1-einkauf-reklamation",
    taskType: "formal_letter",
    scenario: "einkauf",
    register: "Sie",
    situationDe:
      "Sie haben online eine Waschmaschine bestellt. Sie ist zu spät und beschädigt angekommen.",
    leitpunkte: [
      "Was haben Sie wann bestellt?",
      "Beschreiben Sie das Problem.",
      "Was erwarten Sie jetzt?",
      "Bis wann soll die Firma antworten?",
    ],
    gloss: {
      en: "Formal complaint about a late, damaged order.",
      tr: "Hasarlı gelen sipariş için resmi şikâyet.",
    },
  }),
];

/** Random task at `level`, never the same id as `excludeId` (unless it's the only one). */
export function pickPrompt(level: CefrLevel, excludeId?: string | null): WritePrompt | null {
  const pool = WRITE_PROMPTS.filter((p) => p.level === level);
  if (pool.length === 0) return null;
  const candidates = pool.length > 1 ? pool.filter((p) => p.id !== excludeId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getPromptById(id: string): WritePrompt | undefined {
  return WRITE_PROMPTS.find((p) => p.id === id);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Short label for Account's log: level + scenario + first words of the situation. */
export function promptTitle(prompt: WritePrompt): string {
  const words = prompt.situationDe.split(/\s+/).slice(0, 6).join(" ");
  return `${prompt.level} · ${prompt.scenario.replace("_", "/")} · ${words}…`;
}
