import type { LessonStep } from "@/lib/curriculum/types";

// Original Karta A1 lesson, revised to the locked Lesson Standard v2.
// Publication still requires expert linguistic review.
const G01 = "DE.A1.GRAMMAR.PRONOUNS.SUBJECT";
const G02 = "DE.A1.GRAMMAR.VERBS.SEIN_PRESENT";
const G13 = "DE.A1.GRAMMAR.ORDER.DECLARATIVE_V2";
const V01 = "DE.A1.VOCABULARY.PERSONAL_CORE";
const W01 = "DE.A1.WRITING.PERSONAL_FACT";
const id = "DE.A1.U01.L01";

export const identityLessonSteps: readonly LessonStep[] = [
  {
    id: `${id}.context`,
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "Your first introduction",
    prompt: "You meet someone in a German course. You want to say your name.",
    example: "Ich bin Mira.",
    explanation:
      "This one sentence is enough for the situation: Ich bin Mira. It means ‘I am Mira.’ First you will notice the pattern, then practise it with support, and finally make your own introduction.",
    skillIds: [V01, W01],
  },
  {
    id: `${id}.model`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Notice the pattern",
    prompt: "The person changes, so the form of sein changes too.",
    example: "Ich bin Mira.\nDu bist Leo.\nSie ist Nora.\nEr ist Emil.",
    explanation:
      "ich = I; du = you (one person, informal); sie = she; er = he. With sein, use ich bin, du bist, and er/sie ist. In these simple statements, the person comes first and the verb comes second. Today you only need these forms.",
    skillIds: [G01, G02, G13, V01],
  },
  {
    id: `${id}.notice`,
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Who is speaking?",
    prompt: "Nora is introducing herself. Which sentence means ‘I am Nora’?",
    options: ["Du bist Nora.", "Ich bin Nora.", "Sie ist Nora."],
    correctAnswer: "Ich bin Nora.",
    feedback:
      "Ich refers to the speaker. When Nora introduces herself, she says Ich bin Nora.",
    skillIds: [G01, G02, V01],
  },
  {
    id: `${id}.controlled-bin`,
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Complete the taught frame",
    prompt: "Complete the sentence: Ich ___ Emil.",
    inputLabel: "Missing German word",
    acceptedAnswers: ["bin", "Ich bin Emil."],
    feedback: "With ich, use bin: Ich bin Emil.",
    skillIds: [G02],
  },
  {
    id: `${id}.supported-build`,
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Build with support",
    prompt: "Use these words to write the sentence ‘I am Leo’: Ich · bin · Leo",
    inputLabel: "Your German sentence",
    acceptedAnswers: ["Ich bin Leo."],
    feedback:
      "Exactly: Ich bin Leo. The person is first, the verb is second, then the name.",
    skillIds: [G01, G02, G13, W01],
  },
  {
    id: `${id}.contrast-du`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Change the person",
    prompt: "Now compare talking about yourself with talking to one person.",
    example: "Ich bin Mira.\nDu bist Leo.",
    explanation:
      "When you say who you are, use ich bin. When you speak informally to one person, use du bist. The verb changes because the person changes.",
    skillIds: [G01, G02],
  },
  {
    id: `${id}.independent`,
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Try without word tiles",
    prompt: "Leo introduces himself. Write ‘I am Leo’ in German without copying a model.",
    inputLabel: "Your German sentence",
    acceptedAnswers: ["Ich bin Leo."],
    feedback:
      "Ich bin Leo. You selected the speaker pronoun, the matching sein form, and the simple statement order.",
    skillIds: [G01, G02, G13, W01],
  },
  {
    id: `${id}.transfer`,
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: "Make it yours",
    prompt: "You meet a new classmate. Introduce yourself in one German sentence using a name you choose.",
    inputLabel: "Your introduction",
    maxLength: 160,
    explanation:
      "Use a fictional name if you like. Aim for the pattern you learned, but this open response is practice and remains unassessed.",
    skillIds: [G01, G02, G13, V01, W01],
  },
  {
    id: `${id}.check`,
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    answerLanguage: "de",
    label: "Quick lesson check",
    prompt: "You are talking to Lina. Complete: Du ___ Lina. Type only the missing verb form.",
    inputLabel: "Missing German word",
    acceptedAnswers: ["bist", "Du bist Lina."],
    feedback:
      "With du, use bist: Du bist Lina. This checks the lesson content; it does not establish mastery or A1 proficiency.",
    skillIds: [G01, G02],
  },
];
