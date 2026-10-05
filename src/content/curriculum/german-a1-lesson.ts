import type { LessonStep } from "@/lib/curriculum/types";

// Original prototype content. Publication still requires expert linguistic review.
const G01 = "DE.A1.GRAMMAR.PRONOUNS.SUBJECT";
const G02 = "DE.A1.GRAMMAR.VERBS.SEIN_PRESENT";
const G13 = "DE.A1.GRAMMAR.ORDER.DECLARATIVE_V2";
const V01 = "DE.A1.VOCABULARY.PERSONAL_CORE";
const W01 = "DE.A1.WRITING.PERSONAL_FACT";
const id = "DE.A1.U01.L01";
export const identityLessonSteps: readonly LessonStep[] = [
  {
    id: `${id}.discover`,
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "Meet someone",
    prompt: "A small sentence starts a conversation.",
    example: "Ich bin Mira.",
    explanation:
      "Mira introduces herself: ‘I am Mira.’ You will build a sentence like hers, then introduce yourself using a name you choose.",
    skillIds: [V01, W01],
  },
  {
    id: `${id}.understand`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "See how it works",
    prompt: "Who are you talking about?",
    example: "Ich bin Mira.\nDu bist Leo.\nSie ist Nora.\nEr ist Emil.",
    explanation:
      "ich = I; du = you (one person, informal); sie = she; er = he.\nThe word for ‘am / are / is’ changes: ich bin, du bist, sie/er ist.\nIn these statements, the person comes first and the verb comes second. Capitalize the first word and finish with a full stop.\nWe are using just these forms today, not the full verb table.",
    skillIds: [G01, G02, G13, V01],
  },
  {
    id: `${id}.recognize`,
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Choose the meaning",
    prompt: "Nora says ‘I am Nora.’ Which sentence fits?",
    options: ["Du bist Nora.", "Ich bin Nora.", "Sie ist Nora."],
    correctAnswer: "Ich bin Nora.",
    feedback: "Ich refers to the speaker. Ich bin Nora means ‘I am Nora.’",
    skillIds: [G01, G02, V01],
  },
  {
    id: `${id}.recall`,
    stage: "recall",
    purpose: "practice",
    kind: "text",
    label: "Try without choices",
    prompt: "Emil introduces himself: Ich ___ Emil.",
    inputLabel: "Missing German word",
    acceptedAnswers: ["bin"],
    feedback: "With ich, use bin: Ich bin Emil.",
    skillIds: [G02],
  },
  {
    id: `${id}.produce`,
    stage: "produce",
    purpose: "practice",
    kind: "text",
    label: "Build a sentence",
    prompt: "Leo introduces himself. Write ‘I am Leo’ in German.",
    inputLabel: "Your German sentence",
    acceptedAnswers: ["Ich bin Leo."],
    feedback:
      "Ich bin Leo. The person comes first, bin second, then the name. Start with a capital and add a full stop.",
    skillIds: [G01, G02, G13, W01],
  },
  {
    id: `${id}.apply`,
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: "Make it yours",
    prompt: "Introduce yourself in one German sentence using a name you choose.",
    inputLabel: "Your introduction",
    maxLength: 160,
    explanation:
      "Use a fictional name if you like. Your writing stays in this practice session and is unassessed.",
    skillIds: [G01, G02, G13, V01, W01],
  },
  {
    id: `${id}.check`,
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    label: "One last try",
    prompt: "You are talking to Lina. Complete: Du ___ Lina.",
    inputLabel: "Missing word for this sentence",
    acceptedAnswers: ["bist"],
    feedback:
      "With du, use bist: Du bist Lina. This is a lesson check, not a proficiency assessment.",
    skillIds: [G01, G02],
  },
];
