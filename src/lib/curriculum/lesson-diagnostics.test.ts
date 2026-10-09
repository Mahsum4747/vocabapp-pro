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
  assert.match(result?.targetLabel ?? "", /Dativ object with helfen/);
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
