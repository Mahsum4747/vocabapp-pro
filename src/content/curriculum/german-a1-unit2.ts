import type { LessonStep } from "@/lib/curriculum/types";

// Original Karta teaching examples; bounded prototype review, not assessment items.
// Verb forms checked against german/verb-conjugation-data.ts. Noun plurals are
// lexical facts, never inferred from a universal rule. No source examples copied.
const G = "DE.A1.GRAMMAR.";
const R = "DE.A1.READING.";
const W = "DE.A1.WRITING.";
const V = "DE.A1.VOCABULARY.";
const singular = G + "VERBS.REGULAR_SINGULAR";
const plural = G + "VERBS.PLURAL_POLITE";
const agreement = G + "VERBS.SUBJECT_AGREEMENT";
const sentence = W + "SIMPLE_SENTENCE";
const nouns = G + "NOUNS.PLURAL";
const possessive = G + "POSSESSIVES.NOM";
const reference = R + "REFERENCE";
const nicht = G + "NEGATION.NICHT_CLAUSE";
const kein = G + "NEGATION.KEIN_NOM";
const contrast = G + "NEGATION.NICHT_KEIN";
const description = W + "DESCRIPTION";
const stem = G + "VERBS.STEM_CHANGE";
const und = G + "CONNECTORS.UND";
const correction = R + "NEGATED_INFORMATION";
const revision = W + "SELF_REVISION";

export const routineLessonSteps: readonly LessonStep[] = [
  {
    id: "U02.L01.discover",
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "A shared routine",
    prompt: "Same action, different people",
    example: "Ich lerne. Du lernst. Nora lernt. Wir lernen.",
    explanation:
      "lernen means learning or studying. wohnen means living somewhere. Notice who acts before looking at the ending. Nora is one person, like sie (she).",
    skillIds: [singular, agreement, V + "ACTION_SENSE"],
  },
  {
    id: "U02.L01.understand",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "One person",
    prompt: "The subject chooses the ending",
    example: "ich lerne · du lernst · er/sie/es lernt\nich wohne · du wohnst · er/sie/es wohnt",
    explanation:
      "For these two regular verbs, remove -en and add -e, -st or -t. er = he, sie = she, es = it. A name or one person uses the er/sie/es form. Recall Unit 1: the finite verb is second in a statement; German nouns begin with capitals.",
    skillIds: [singular, agreement, sentence],
  },
  {
    id: "U02.L01.recognize",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Who is learning?",
    prompt: "Nora is one person. Choose her statement.",
    options: ["Nora lernt.", "Nora lernst.", "Nora lernen."],
    correctAnswer: "Nora lernt.",
    feedback: "One person takes lernt. The name has the same agreement as she/he.",
    skillIds: [singular, agreement],
  },
  {
    id: "U02.L01.groups",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Together, and politely",
    prompt: "Different subjects can share an ending",
    example: "wir lernen · ihr lernt · sie lernen · Sie lernen",
    explanation:
      "wir = we; ihr = you, a familiar group; sie = they. Capital Sie is polite you, for one or several people. Use -en with wir, they and polite Sie; use -t with ihr. wohnen follows the same pattern. The context tells you whether sie means she or they.",
    skillIds: [plural, agreement],
  },
  {
    id: "U02.L01.action",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Meaning in a routine",
    prompt: "Two people are studying German together. Which statement fits?",
    options: ["Wir lernen Deutsch.", "Wir wohnen in Berlin."],
    correctAnswer: "Wir lernen Deutsch.",
    feedback:
      "lernen is studying here; wohnen describes where someone lives. Deutsch is the supplied language name.",
    skillIds: [V + "ACTION_SENSE", plural],
  },
  {
    id: "U02.L01.recall",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Recall an ending",
    prompt:
      "Complete for familiar you: Du ___ in Berlin. Use wohnen. Type only the missing verb form.",
    inputLabel: "Verb for du",
    acceptedAnswers: ["wohnst", "Du wohnst in Berlin."],
    feedback: "du takes -st: Du wohnst in Berlin. in Berlin is a supplied place phrase.",
    skillIds: [singular],
  },
  {
    id: "U02.L01.transform",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Change the subject",
    prompt: "Change Ich lerne Deutsch. to a statement beginning Wir. Write the whole sentence.",
    inputLabel: "Statement with wir",
    acceptedAnswers: ["Wir lernen Deutsch."],
    feedback: "Wir lernen Deutsch. Changing ich to wir changes lerne to lernen.",
    skillIds: [plural, agreement, sentence],
  },
  {
    id: "U02.L01.familiar-group",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Address two friends",
    prompt: "Complete: Ihr ___ Deutsch. Use lernen. Type only the missing verb form.",
    inputLabel: "Verb for ihr",
    acceptedAnswers: ["lernt", "Ihr lernt Deutsch."],
    feedback: "ihr takes -t: Ihr lernt Deutsch.",
    skillIds: [plural, agreement],
  },
  {
    id: "U02.L01.polite",
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "A polite statement",
    prompt:
      "Tell an adult you address politely that they live in Berlin. Begin with Sie; use wohnen and the supplied phrase in Berlin.",
    inputLabel: "Polite statement",
    acceptedAnswers: ["Sie wohnen in Berlin."],
    feedback: "Sie wohnen in Berlin. Polite Sie takes wohnen, even for one person.",
    skillIds: [plural, agreement, sentence],
  },
  {
    id: "U02.L01.apply",
    stage: "apply",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Two routine statements",
    prompt:
      "Write two sentences: Nora studies German; you and Nora live in Berlin. Use Nora, lernen, Deutsch, Wir, wohnen and in Berlin.",
    inputLabel: "Two German sentences",
    acceptedAnswers: ["Nora lernt Deutsch. Wir wohnen in Berlin."],
    feedback: "Nora lernt Deutsch. Wir wohnen in Berlin. Nora and wir require different endings.",
    skillIds: [singular, plural, agreement, sentence, V + "ACTION_SENSE"],
  },
  {
    id: "U02.L01.check",
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    answerLanguage: "de",
    label: "A new subject",
    prompt:
      "Leo and Mira are learning together. Complete: Sie ___ Deutsch. Here Sie means they at the start of a sentence. Type only the missing verb form.",
    inputLabel: "Verb for they",
    acceptedAnswers: ["lernen", "Sie lernen Deutsch."],
    feedback:
      "Two people: Sie lernen Deutsch. This bounded practice checks this agreement, not general present-tense mastery.",
    skillIds: [plural, agreement],
  },
];

export const belongingsLessonSteps: readonly LessonStep[] = [
  {
    id: "U02.L02.discover",
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "A shared desk",
    prompt: "One object, several objects",
    example:
      "Das Telefon ist klein. Die Telefone sind klein.\nDas Buch ist groß. Die Bücher sind groß.",
    explanation:
      "Reuse das Telefon from Unit 1. Add das Buch = book. Learn each plural with its noun: Telefone, Bücher. Plural subjects use sind, not ist. There is no single plural ending for all German nouns.",
    skillIds: [nouns],
  },
  {
    id: "U02.L02.understand",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Whose book?",
    prompt: "The owner and the object are different clues",
    example: "mein Buch · dein Buch · unser Buch\nmeine Bücher · deine Bücher · unsere Bücher",
    explanation:
      "mein = my; dein = your (one familiar person); unser = our. These are nominative subject phrases. With this neuter singular noun use mein/dein/unser; with these plurals use meine/deine/unsere. Recall the subject pronouns and ist/sind from Unit 1. Do not extend these forms to object phrases.",
    skillIds: [possessive, nouns],
  },
  {
    id: "U02.L02.recognize",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Several books",
    prompt: "Choose the statement about our books.",
    options: ["Unsere Bücher sind groß.", "Unser Bücher ist groß.", "Unsere Buch sind groß."],
    correctAnswer: "Unsere Bücher sind groß.",
    feedback: "Bücher is the learned plural. Use unsere and sind with this plural subject.",
    skillIds: [nouns, possessive],
  },
  {
    id: "U02.L02.owners",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Follow the owner",
    prompt: "sein and ihr point back to a person",
    example: "Leo: sein Buch, seine Bücher\nNora: ihr Buch, ihre Bücher",
    explanation:
      "sein points to a male owner; ihr here points to a female owner. Their ending follows the object noun, not the owner's gender. In a polite conversation, Ihr Buch means your book: Herr Braun, Ihr Buch ist hier. Herr Braun is a supplied polite address; hier means here. Capital Ihr marks polite address. We practice only these nominative phrases.",
    skillIds: [possessive, reference],
  },
  {
    id: "U02.L02.recall",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Recall the noun",
    prompt:
      "Complete with the learned plural of Buch: Meine ___ sind groß. Type only the missing word.",
    inputLabel: "Plural noun",
    acceptedAnswers: ["Bücher", "Meine Bücher sind groß."],
    feedback: "Buch → Bücher. The umlaut and -er belong to this learned noun.",
    skillIds: [nouns],
  },
  {
    id: "U02.L02.produce",
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Your belongings",
    prompt: "Tell one friend that their phone is small. Begin Dein; use Telefon, ist and klein.",
    inputLabel: "German sentence about your friend's phone",
    acceptedAnswers: ["Dein Telefon ist klein."],
    feedback: "Dein Telefon ist klein. Telefon is a neuter singular subject here.",
    skillIds: [possessive],
  },
  {
    id: "U02.L02.read",
    stage: "read",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Two people, two objects",
    prompt: "Whose book is large? Write the person's name.",
    example: "Nora: Mein Telefon ist klein.\nLeo: Mein Buch ist hier. Es ist groß.",
    explanation:
      "Each line is spoken by the named person. In Leo's line, Es points back to his Buch, not Nora's Telefon.",
    inputLabel: "Owner of the large book",
    acceptedAnswers: ["Leo"],
    feedback: "Leo says Mein Buch and then Es ist groß. Es refers to his book.",
    skillIds: [reference, possessive],
  },
  {
    id: "U02.L02.apply",
    stage: "apply",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Explain the reference",
    prompt:
      "Write two sentences naming each owner's objects: Nora's books are large; Leo's phone is small. Begin Ihre Bücher, then Sein Telefon.",
    example:
      "Nora: Meine Bücher sind hier. Sie sind groß.\nLeo: Mein Telefon ist hier. Es ist klein.",
    inputLabel: "Two German sentences",
    acceptedAnswers: ["Ihre Bücher sind groß. Sein Telefon ist klein."],
    feedback:
      "Ihre refers to Nora; Sein refers to Leo. Sie in Nora's line refers to Bücher, which requires sind.",
    skillIds: [reference, possessive, nouns],
  },
  {
    id: "U02.L02.check",
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    answerLanguage: "de",
    label: "A fresh reference",
    prompt: "Whose phones does Sie refer to in Mira's line? Write the person's name.",
    example: "Leo: Mein Buch ist klein.\nMira: Meine Telefone sind hier. Sie sind groß.",
    inputLabel: "Owner of the phones",
    acceptedAnswers: ["Mira"],
    feedback:
      "Mira's Sie refers to her plural Telefone. This is a reference check, not vocabulary translation.",
    skillIds: [reference, nouns],
  },
];

export const negationLessonSteps: readonly LessonStep[] = [
  {
    id: "U02.L03.discover",
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "Correct a detail",
    prompt: "Two ways to say no",
    example: "Das Büro ist nicht groß.\nDas ist kein Büro.",
    explanation:
      "The first denies a description: the office is not large. The second denies what the place is: it is not an office. Both use the statement frame from Unit 1.",
    skillIds: [nicht, kein, contrast],
  },
  {
    id: "U02.L03.understand",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Meaning before form",
    prompt: "Negate a predicate or a noun phrase",
    example:
      "Ich lerne nicht.\nMein Telefon ist nicht groß.\nDas ist kein Telefon.\nDas sind keine Bücher.",
    explanation:
      "In these taught patterns, nicht follows the simple action or comes before the predicate adjective. kein replaces ein with a neuter/masculine nominative noun; keine is used with feminine or plural nominative nouns. Recall: ein Telefon, an office/phone as a noun phrase, and singular ist versus plural sind. Here Telefon and Bücher are predicate nouns after sein. We do not teach negated accusative objects in this lesson.",
    skillIds: [nicht, kein, contrast, description],
  },
  {
    id: "U02.L03.recognize",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "An incorrect description",
    prompt: "The office is small. Choose the sentence denying that it is large.",
    options: ["Das Büro ist nicht groß.", "Das ist kein Büro."],
    correctAnswer: "Das Büro ist nicht groß.",
    feedback: "The office exists; its size is being corrected. nicht negates groß in this pattern.",
    skillIds: [nicht, contrast],
  },
  {
    id: "U02.L03.contrast",
    stage: "classify",
    purpose: "practice",
    kind: "choice",
    label: "Contrast the meaning",
    prompt: "You are pointing at a book, not a phone. Which correction names what it is not?",
    options: ["Das ist kein Telefon.", "Das Telefon ist nicht klein."],
    correctAnswer: "Das ist kein Telefon.",
    feedback: "kein Telefon denies the noun identity. nicht klein would deny a phone's size.",
    skillIds: [kein, contrast],
  },
  {
    id: "U02.L03.recall",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Deny the routine",
    prompt: "Rewrite Ich lerne. to say that you are not studying. Write the whole sentence.",
    inputLabel: "Negative routine statement",
    acceptedAnswers: ["Ich lerne nicht."],
    feedback:
      "Ich lerne nicht. In this short taught action pattern, nicht follows the finite verb.",
    skillIds: [nicht],
  },
  {
    id: "U02.L03.noun",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Several objects",
    prompt:
      "Complete: Das sind ___ Bücher. Deny that these objects are books. Type only the missing word.",
    inputLabel: "Nominative plural negation",
    acceptedAnswers: ["keine", "Das sind keine Bücher."],
    feedback: "Das sind keine Bücher. Use keine with this plural predicate noun phrase.",
    skillIds: [kein, contrast],
  },
  {
    id: "U02.L03.produce",
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "A home detail",
    prompt:
      "Write that your office is not large. Use Mein Büro, ist, groß and the appropriate negation.",
    inputLabel: "Negative office description",
    acceptedAnswers: ["Mein Büro ist nicht groß."],
    feedback: "Mein Büro ist nicht groß. The size, not the existence of an office, is denied.",
    skillIds: [nicht, contrast, description],
  },
  {
    id: "U02.L03.apply",
    stage: "apply",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Correct two claims",
    prompt:
      "Someone calls this object a phone and says your office is large. It is a book, and your office is small. Write two denials beginning Das ist and Mein Büro ist.",
    inputLabel: "Two corrections",
    acceptedAnswers: ["Das ist kein Telefon. Mein Büro ist nicht groß."],
    feedback:
      "Das ist kein Telefon. Mein Büro ist nicht groß. A predicate noun phrase takes kein; the size description takes nicht.",
    skillIds: [nicht, kein, contrast, description],
  },
  {
    id: "U02.L03.original",
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: "Your own contrast",
    prompt:
      "Describe a fictional home or routine in two short German sentences. Correct one imaginary claim using nicht or kein/keine.",
    explanation:
      "Choose your own details. You can reuse mein/unser, klein/groß, lernen and the familiar nouns. This description is unassessed and stays in this session. Its meaning is not certified by the bounded tasks.",
    inputLabel: "Your fictional description",
    maxLength: 160,
    skillIds: [description, contrast],
  },
  {
    id: "U02.L03.check",
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    answerLanguage: "de",
    label: "Choose by meaning",
    prompt:
      "Complete: Das ist ___ Buch. You are denying that the object is a book. Type only the missing word.",
    inputLabel: "Noun identity negation",
    acceptedAnswers: ["kein", "Das ist kein Buch."],
    feedback:
      "Das ist kein Buch. This is a neuter nominative predicate noun phrase, not an accusative object.",
    skillIds: [kein, contrast],
  },
];

export const revisionLessonSteps: readonly LessonStep[] = [
  {
    id: "U02.L04.discover",
    stage: "discover",
    purpose: "teach",
    kind: "explanation",
    label: "A quiet routine",
    prompt: "Two familiar actions, two special forms",
    example: "Ich lese. Du liest. Nora liest.\nIch schlafe. Du schläfst. Leo schläft.",
    explanation:
      "lesen = read; schlafen = sleep. Learn these specific forms: e → ie in du/er/sie/es of lesen, a → ä in du/er/sie/es of schlafen. They are a tiny lexical inventory, not an algorithm for every verb.",
    skillIds: [stem],
  },
  {
    id: "U02.L04.understand",
    stage: "understand",
    purpose: "teach",
    kind: "explanation",
    label: "Keep two statements",
    prompt: "und joins complete clauses",
    example: "Nora liest und Leo schläft.\nWir lesen und wir lernen Deutsch.",
    explanation:
      "und = and. Each complete clause keeps subject then finite verb. und sits between the clauses and does not move the verb to the end. wir/ihr/sie/Sie forms of these verbs use lesen/lest/lesen/lesen and schlafen/schlaft/schlafen/schlafen; only the taught du/er/sie/es forms change the stem. Recall nicht/kein by the meaning you deny.",
    skillIds: [stem, und, revision],
  },
  {
    id: "U02.L04.recognize",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Two people",
    prompt: "Choose two correctly joined statements.",
    options: [
      "Leo liest und Nora schläft.",
      "Leo lest und Nora schlaft.",
      "Leo liest und Nora schlafen.",
    ],
    correctAnswer: "Leo liest und Nora schläft.",
    feedback: "One person takes liest or schläft. Both clauses keep their subject before the verb.",
    skillIds: [stem, und],
  },
  {
    id: "U02.L04.recall",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Recall a special form",
    prompt: "Complete for familiar you: Du ___. Use lesen. Type only the missing verb form.",
    inputLabel: "Reading verb for du",
    acceptedAnswers: ["liest", "Du liest."],
    feedback: "Du liest. Recall this specific reviewed form, not a general stem-change rule.",
    skillIds: [stem],
  },
  {
    id: "U02.L04.sleep",
    stage: "recall",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Another special form",
    prompt: "Complete: Nora ___. Use schlafen. Type only the missing verb form.",
    inputLabel: "Sleeping verb for Nora",
    acceptedAnswers: ["schläft", "Nora schläft."],
    feedback: "Nora schläft. A singular name takes the er/sie/es form.",
    skillIds: [stem],
  },
  {
    id: "U02.L04.produce",
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Combine the routine",
    prompt: "Join Nora liest. and Wir lernen Deutsch. with und. Keep both subjects.",
    inputLabel: "Joined statements",
    acceptedAnswers: ["Nora liest und wir lernen Deutsch."],
    feedback:
      "Nora liest und wir lernen Deutsch. und leaves each complete clause's finite verb second.",
    skillIds: [und, stem],
  },
  {
    id: "U02.L04.read",
    stage: "read",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "A corrected message",
    prompt: "Which office description is now denied? Write the adjective.",
    example: "Nora: Mein Büro ist groß.\nNora: Korrektur: Mein Büro ist nicht groß. Es ist klein.",
    explanation:
      "Korrektur is a supplied label meaning correction. Use the later message to identify the changed fact.",
    inputLabel: "Adjective",
    acceptedAnswers: ["groß"],
    feedback:
      "Write only groß (or gross), the adjective denied by nicht. The correction states klein; the owner and office have not changed.",
    skillIds: [correction],
  },
  {
    id: "U02.L04.revise",
    stage: "apply",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Revise your note",
    prompt:
      "Nora's update describes your office too. Revise your draft; keep both subjects and und.",
    example:
      "Nora: Das Büro ist nicht groß. Es ist klein.\nYour draft: Mein Büro ist groß und ich lernt Deutsch.",
    explanation:
      "Checklist: check the updated fact, subject–verb agreement, and the order in each clause. Write your revision before checking.",
    inputLabel: "Revised office and routine note",
    acceptedAnswers: ["Mein Büro ist klein und ich lerne Deutsch."],
    feedback:
      "Mein Büro ist klein und ich lerne Deutsch. The new fact is klein; ich requires lerne. Both clauses keep their own subject and finite verb.",
    skillIds: [revision, correction, und],
  },
  {
    id: "U02.L04.original",
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: "Revise a detail of your own",
    prompt:
      "Write a short fictional description. Change one detail, then check agreement, negation choice and word order in your new version.",
    explanation:
      "Use a detail of your choice, not the previous corrected sentence. This open revision remains unassessed and ephemeral. Self-reflection and lesson traversal do not create mastery evidence.",
    inputLabel: "Your revised fictional description",
    maxLength: 160,
    skillIds: [revision, und],
  },
  {
    id: "U02.L04.check",
    stage: "check",
    purpose: "formative-check",
    kind: "text",
    answerLanguage: "de",
    label: "Correct a new routine",
    prompt:
      "Revise Leo lest und Mira schlaft. Check the two singular verb forms; preserve the subjects and und.",
    inputLabel: "Revised routine",
    acceptedAnswers: ["Leo liest und Mira schläft."],
    feedback:
      "Leo liest und Mira schläft. This checks the two taught forms in a bounded revision, not unrestricted writing proficiency.",
    skillIds: [stem, und, revision],
  },
];
