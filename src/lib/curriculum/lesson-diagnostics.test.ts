import assert from "node:assert/strict";
import test from "node:test";
import { diagnoseLessonResponse } from "./lesson-diagnostics";
import type { LessonDefinition, LessonStep } from "./types";

const lesson: LessonDefinition = {
  id: "DE.A1.U05.L02",
  unitId: "DE.A1.U05",
  title: "Ask for help",
  outcome: "Ask for help",
  introducedSkillIds: [],
  consolidatedSkillIds: [],
  availability: "prototype",
  steps: [],
};

const helpStep: Extract<LessonStep, { kind: "text" }> = {
  id: "help",
  stage: "produce",
  purpose: "practice",
  kind: "text",
  answerLanguage: "de",
  label: "Ask",
  prompt: "Ask a member of staff to help you.",
  inputLabel: "German question",
  acceptedAnswers: ["Können Sie mir helfen?"],
  feedback: "Use the taught help frame.",
  skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE", "DE.A1.GRAMMAR.VERBS.DATIVE_FRAMES"],
};

test("classifies omitted helfen recipient as lexical government, not broad Dative", () => {
  const result = diagnoseLessonResponse(lesson, helpStep, "Können Sie helfen?");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "helfen + Dativ");
  assert.equal(result?.independent, true);
});

test("hint-supported attempts are not marked independent", () => {
  const result = diagnoseLessonResponse(lesson, helpStep, "Können Sie helfen?", { hintUsed: true });
  assert.equal(result?.independent, false);
  assert.equal(result?.support, "hint");
});

test("correct responses create no diagnostic signal", () => {
  assert.equal(diagnoseLessonResponse(lesson, helpStep, "Können Sie mir helfen?"), null);
});

test("mit article mismatch maps to narrow mit + Dativ pattern", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep,
    id: "mit",
    prompt: "Write by bus.",
    acceptedAnswers: ["mit dem Bus"],
    skillIds: ["DE.A1.GRAMMAR.CASES.DATIVE_ARTICLES"],
  };
  const result = diagnoseLessonResponse(lesson, step, "mit der Bus");
  assert.equal(result?.category, "case_form");
  assert.equal(result?.targetLabel, "mit + Dativ");
});

test("diagnoses a bounded object-pronoun substitution without broad case claims", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep,
    id: "pronoun",
    prompt: "Complete the taught sentence.",
    acceptedAnswers: ["Ich sehe ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich sehe mich");
  assert.equal(result?.category, "pronoun_form");
  assert.equal(result?.targetLabel, "Object pronoun in this sentence");
});

test("detects a word-order permutation only on an authored V2 target", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep,
    id: "v2",
    prompt: "State the time first.",
    acceptedAnswers: ["Heute gehe ich einkaufen"],
    skillIds: ["DE.A1.GRAMMAR.ORDER.FRONTED_TIME"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Heute ich gehe einkaufen")?.category, "word_order");
  assert.equal(diagnoseLessonResponse(lesson, { ...step, skillIds: [] }, "Heute ich gehe einkaufen"), null);
});

test("does not infer a narrow diagnosis from an unrelated wrong sentence", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep,
    id: "unrelated",
    acceptedAnswers: ["Ich sehe ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Ich kaufe Brot"), null);
});


test("curated dative government diagnoses a verified infinitive frame", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich will ihm helfen"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich will ihn helfen");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "helfen + Dativ");
});

test("curated prepositional government diagnoses a verified infinitive frame", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich will mit ihm sprechen"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich will mit ihn sprechen");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "sprechen + mit + Dativ");
});

test("unknown verb is not assigned a case rule from expected-answer contrast", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich blorfe ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Ich blorfe ihm"), null);
});


test("unrelated response containing helfen does not masquerade as omitted dative", () => {
  assert.equal(diagnoseLessonResponse(lesson, helpStep, "Ich helfe heute"), null);
});

test("mit rule does not diagnose unrelated changes as an article error", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["mit dem Bus"],
    skillIds: ["DE.A1.GRAMMAR.CASES.DATIVE_ARTICLES"],
  };
  const result = diagnoseLessonResponse(lesson, step, "mit der Bahn");
  assert.notEqual(result?.targetId, "DE.GRAMMAR.PREPOSITION.MIT_DAT");
});


test("recognizes curated dative case from a conjugated verb", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich helfe ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich helfe ihn");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "helfen + Dativ");
});

test("recognizes conjugated prepositional government", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich spreche mit ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich spreche mit ihn");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "sprechen + mit + Dativ");
});

test("does not treat unrelated person substitution as a case error", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich helfe ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  assert.notEqual(diagnoseLessonResponse(lesson, step, "Ich helfe mich")?.category, "lexical_government");
});

test("a dative verb elsewhere does not govern a fixed-preposition phrase", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich helfe mit ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  assert.notEqual(diagnoseLessonResponse(lesson, step, "Ich helfe mit ihn")?.targetLabel, "helfen + Dativ");
});

test("unverified case substitution remains unclassified for lexical government", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich sehe ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Ich sehe ihm"), null);
});


test("antworten is not mistaken for a separable an-prefix verb", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich antworte ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich antworte ihn");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "antworten + Dativ");
});

test("stripped separable-prefix verb is not accepted without its prefix", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Er geht ihm fremd"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Er geht ihn fremd");
  // The current diagnostic has no dependency parser for the split prefix.
  // It must not invent a different government frame from a bare 'geht'.
  assert.notEqual(result?.targetLabel, "gehen + Dativ");
});

test("diagnoses sourced dative verbs beyond the previous nine-verb allowlist", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich danke ihm"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  const result = diagnoseLessonResponse(lesson, step, "Ich danke ihn");
  assert.equal(result?.category, "lexical_government");
  assert.equal(result?.targetLabel, "danken + Dativ");
});

test("diagnoses separated dative verbs only when the prefix is present", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich stimme ihm zu"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Ich stimme ihn zu")?.targetLabel, "zustimmen + Dativ");
  assert.notEqual(diagnoseLessonResponse(lesson, { ...step, acceptedAnswers: ["Ich stimme ihm"] },
    "Ich stimme ihn")?.category, "lexical_government");
});

test("matches sourced reflexive government only with the reflexive pronoun", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich erinnere mich an ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  assert.equal(diagnoseLessonResponse(lesson, step, "Ich erinnere mich an ihm")?.targetLabel,
    "sich erinnern + an + Akkusativ");
  assert.notEqual(diagnoseLessonResponse(lesson, { ...step, acceptedAnswers: ["Ich erinnere an ihn"] },
    "Ich erinnere an ihm")?.category, "lexical_government");
});

test("conflicting curated cases for the same lemma and preposition abstain", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich schreibe an ihn"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE"],
  };
  assert.notEqual(diagnoseLessonResponse(lesson, step, "Ich schreibe an ihm")?.category,
    "lexical_government");
});

test("untagged ditransitive frames are not automatically promoted to diagnostics", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    ...helpStep, acceptedAnswers: ["Ich gebe ihm das Buch"],
    skillIds: ["DE.A1.GRAMMAR.PRONOUNS.DATIVE"],
  };
  assert.notEqual(diagnoseLessonResponse(lesson, step, "Ich gebe ihn das Buch")?.category,
    "lexical_government");
});
