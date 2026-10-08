import assert from "node:assert/strict";
import test from "node:test";
import { evaluateStep } from "./lesson-session";
import type { LessonStep } from "./types";

test("incorrect lesson feedback gives a diagnostic cue without revealing the authored answer", () => {
  const step: Extract<LessonStep, { kind: "text" }> = {
    id: "help",
    stage: "produce",
    purpose: "practice",
    kind: "text",
    answerLanguage: "de",
    label: "Help request",
    prompt: "Ask politely whether someone can helfen.",
    inputLabel: "German sentence",
    acceptedAnswers: ["Können Sie mir helfen?"],
    feedback: "Correct: Können Sie mir helfen? uses mir with helfen.",
    skillIds: [],
  };
  const incorrect = evaluateStep(step, "Können Sie helfen?");
  assert.equal(incorrect?.outcome, "incorrect");
  assert.match(incorrect?.message ?? "", /dative person pronoun/i);
  assert.doesNotMatch(incorrect?.message ?? "", /Können Sie mir helfen/);
  const correct = evaluateStep(step, "Können Sie mir helfen?");
  assert.equal(correct?.outcome, "correct");
  assert.match(correct?.message ?? "", /uses mir with helfen/);
});

test("incorrect multiple-choice feedback does not expose the correct option", () => {
  const step: Extract<LessonStep, { kind: "choice" }> = {
    id: "meaning",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Read",
    prompt: "What is meant?",
    options: ["A", "B"],
    correctAnswer: "B",
    feedback: "The correct option is B.",
    skillIds: [],
  };
  assert.doesNotMatch(evaluateStep(step, "A")?.message ?? "", /correct option is B/i);
  assert.match(evaluateStep(step, "B")?.message ?? "", /correct option is B/i);
});
