import type { LessonStep } from "@/lib/curriculum/types";

// Original, controlled workplace labels. Expert publication review remains deferred.
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
    id: `${id}.discover`,
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "Look around the office",
    prompt: "People, a place, a useful object.",
    example:
      "der Mann — the man\ndie Frau — the woman\ndas Büro — the office\ndas Telefon — the telephone",
    explanation:
      "Four labels for one workplace. Mann and Frau name people, Büro names a place, and Telefon names an object. Learn each German noun together with its article.",
    skillIds: [G08, V02],
  },
  {
    id: `${id}.understand`,
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Notice the small words",
    prompt: "Keep the article with the noun.",
    example:
      "der Mann → ein Mann\ndie Frau → eine Frau\ndas Büro → ein Büro\ndas Telefon → ein Telefon\n\nDie Frau ist Nora.",
    explanation:
      "der, die and das mean ‘the’. Learn each noun’s gender with its article, including places and objects.\nUse eine Frau and ein Mann/Büro/Telefon for ‘a’. Capitalize the noun.\n‘Die Frau ist Nora’ means ‘The woman is Nora’. Die Frau names who the sentence is about: its subject. These are simple subject forms.",
    skillIds: [G08, G09, G10, G12, W02],
  },
  {
    id: `${id}.recognize`,
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Recognize a label",
    prompt: "Which label means ‘the telephone’?",
    options: ["der Telefon", "die Telefon", "das Telefon"],
    correctAnswer: "das Telefon",
    feedback: "Learn Telefon with das: das Telefon.",
    skillIds: [G08, G09],
  },
  {
    id: `${id}.classify`,
    stage: "classify",
    purpose: "practice",
    kind: "choice",
    label: "Sort by meaning",
    prompt: "The label is das Büro. What does it name?",
    options: ["A person", "A place", "An object"],
    correctAnswer: "A place",
    feedback: "Büro means office, a place where people work.",
    skillIds: [V02],
  },
  {
    id: `${id}.recall`,
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Try without choices",
    prompt: "Write ‘a woman’ using the phrase you learned.",
    inputLabel: "German phrase for a woman",
    acceptedAnswers: ["eine Frau"],
    caseSensitive: true,
    feedback: "Use eine Frau, with a capital F on the noun.",
    skillIds: [G10, W02],
  },
  {
    id: `${id}.read`,
    stage: "read",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Read a short name label",
    prompt: "Who is named in this label? Write the name.",
    example: "Die Frau ist Nora.",
    inputLabel: "Name from the label",
    acceptedAnswers: ["Nora"],
    feedback: "The label explicitly names Nora.",
    skillIds: [R01],
  },
  {
    id: `${id}.produce`,
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Write a familiar phrase",
    prompt: "Label an office: write ‘an office’ in German.",
    inputLabel: "Your German noun phrase",
    acceptedAnswers: ["ein Büro"],
    caseSensitive: true,
    feedback: "Use ein Büro. Keep the capital B. You can type ü or ue.",
    skillIds: [G08, G10, W02],
  },
  {
    id: `${id}.check`,
    stage: "check",
    purpose: "formative-check",
    kind: "choice",
    label: "One last look",
    prompt: "In ‘Die Frau ist Nora’, which phrase names the subject?",
    options: ["Die Frau", "ist", "Nora"],
    correctAnswer: "Die Frau",
    feedback:
      "Die Frau names who the sentence is about. This is a practice check, not a mastery assessment.",
    skillIds: [G09, G12, R01],
  },
];
