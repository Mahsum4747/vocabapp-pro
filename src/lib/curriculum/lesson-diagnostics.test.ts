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
