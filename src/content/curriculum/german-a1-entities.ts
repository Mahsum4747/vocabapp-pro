import type { LessonStep } from "@/lib/curriculum/types";

// Original Karta workplace-label lesson revised to Lesson Standard v2.
// Expert publication review remains deferred.
const G08 = "DE.A1.GRAMMAR.NOUNS.GENDER";
const G09 = "DE.A1.GRAMMAR.ARTICLES.DEFINITE_NOM";
const G10 = "DE.A1.GRAMMAR.ARTICLES.INDEFINITE_NOM";
const G12 = "DE.A1.GRAMMAR.CASES.NOMINATIVE_ROLE";
const V02 = "DE.A1.VOCABULARY.ENTITY_CATEGORIES";
const W02 = "DE.A1.WRITING.ORTHOGRAPHY";
const R01 = "DE.A1.READING.PERSON_ENTITIES";
const id = "DE.A1.U01.L02";

export const entityLessonSteps: readonly LessonStep[] = [
  {
    id: `${id}.context`,
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "Name what you see",
    prompt: "You enter an office and want to name a person, a place and an object.",
    example: "der Mann\ndie Frau\ndas Büro\ndas Telefon",
    explanation:
      "German nouns are learned together with their article. For these four words, use der Mann, die Frau, das Büro and das Telefon. The article is part of what you need to remember.",
    skillIds: [G08, V02],
  },
  {
    id: `${id}.model`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "From ‘the’ to ‘a’",
    prompt: "Notice how the article changes when you mean ‘a’.",
    example: "der Mann → ein Mann\ndie Frau → eine Frau\ndas Büro → ein Büro\ndas Telefon → ein Telefon",
    explanation:
      "Use eine with Frau. Use ein with Mann, Büro and Telefon in these simple subject phrases. German nouns begin with a capital letter, so write Frau, Büro and Telefon with capitals.",
    skillIds: [G08, G09, G10, W02],
  },
  {
    id: `${id}.subject`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Who is the sentence about?",
    prompt: "Look at one complete sentence.",
    example: "Die Frau ist Nora.",
    explanation:
      "Die Frau names who the sentence is about. In this sentence it is the subject. For now, notice the role rather than memorizing case terminology: the person named before ist is the one being identified.",
    skillIds: [G09, G12, R01],
  },
  {
    id: `${id}.notice`,
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Recognize the noun with its article",
    prompt: "Which phrase means ‘the telephone’?",
    options: ["der Telefon", "die Telefon", "das Telefon"],
    correctAnswer: "das Telefon",
    feedback: "Telefon is learned here as das Telefon.",
    skillIds: [G08, G09],
  },
  {
    id: `${id}.classify`,
    stage: "classify",
    purpose: "practice",
    kind: "choice",
    label: "Connect form and meaning",
    prompt: "What kind of thing is das Büro?",
    options: ["A person", "A place", "An object"],
    correctAnswer: "A place",
    feedback: "Büro means office, so it names a place.",
    skillIds: [V02],
  },
  {
    id: `${id}.controlled`,
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Complete a familiar phrase",
    prompt: "Write ‘a woman’ using the pattern you just learned.",
    inputLabel: "German noun phrase",
    acceptedAnswers: ["eine Frau"],
    caseSensitive: true,
    feedback: "Use eine Frau. Keep the capital F because Frau is a noun.",
    skillIds: [G10, W02],
  },
  {
    id: `${id}.supported`,
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Build with support",
    prompt: "Use these two parts to label an office: ein · Büro",
    inputLabel: "German noun phrase",
    acceptedAnswers: ["ein Büro"],
    caseSensitive: true,
    feedback: "ein Büro is the taught phrase. Keep the capital B.",
    skillIds: [G08, G10, W02],
  },
  {
    id: `${id}.read`,
    stage: "read",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Read a name label",
    prompt: "Who is the woman? Write only the name.",
    example: "Die Frau ist Nora.",
    inputLabel: "Name",
    acceptedAnswers: ["Nora"],
    feedback: "The sentence identifies the woman as Nora.",
    skillIds: [R01, G12],
  },
  {
    id: `${id}.transfer`,
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: "Label your own mini-scene",
    prompt: "Write two German noun phrases from this lesson: one person and one place or object.",
    inputLabel: "Two German phrases",
    maxLength: 120,
    explanation:
      "For example, choose from the words you learned and include the correct article. This open response is unassessed practice.",
    skillIds: [G08, G09, G10, V02, W02],
  },
  {
    id: `${id}.check`,
    stage: "check",
    purpose: "formative-check",
    kind: "choice",
    label: "Quick lesson check",
    prompt: "In ‘Die Frau ist Nora’, which phrase names who the sentence is about?",
    options: ["Die Frau", "ist", "Nora"],
    correctAnswer: "Die Frau",
    feedback:
      "Die Frau is the subject phrase here. This checks the lesson content, not mastery or A1 proficiency.",
    skillIds: [G09, G12, R01],
  },
];
