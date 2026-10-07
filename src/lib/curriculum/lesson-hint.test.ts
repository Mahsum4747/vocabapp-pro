import assert from "node:assert/strict";
import test from "node:test";
import { lessonHint } from "./lesson-hint";
import type { LessonStep } from "./types";

const textStep = (overrides: Partial<Extract<LessonStep, { kind: "text" }>> = {}): Extract<LessonStep, { kind: "text" }> => ({
  id: "hint.test",
  stage: "produce",
  purpose: "practice",
  kind: "text",
  label: "Ask politely",
  prompt: "Ask: Can you help me on Tuesday at six?",
  inputLabel: "German sentence",
  acceptedAnswers: ["Können Sie mir am Dienstag um sechs helfen?"],
  feedback: "Correct.",
  skillIds: [],
  ...overrides,
});

test("does not tell a learner to start with a word they already used", () => {
  const hint = lessonHint(textStep(), "Können Sie am Dienstag um sechs Uhr helfen?");
  assert.doesNotMatch(hint, /Start with/i);
});

test("diagnoses missing dative recipient in helfen pattern without exposing the full answer", () => {
  const hint = lessonHint(textStep(), "Können Sie am Dienstag um sechs helfen?");
  assert.match(hint, /receives the help/i);
  assert.match(hint, /dative person pronoun/i);
  assert.doesNotMatch(hint, /Können Sie mir am Dienstag/i);
});

test("uses a missing-detail cue when one required token is absent", () => {
  const step = textStep({
    prompt: "Say: I live in Berlin today.",
    acceptedAnswers: ["Ich wohne heute in Berlin."],
  });
  const hint = lessonHint(step, "Ich wohne in Berlin.");
  assert.match(hint, /one required detail is missing/i);
});

test("choice hint teaches comparison rather than leaking first-token structure", () => {
  const step: Extract<LessonStep, { kind: "choice" }> = {
    id: "choice",
    stage: "recognize",
    purpose: "practice",
    kind: "choice",
    label: "Choose",
    prompt: "Which one fits?",
    options: ["A", "B"],
    correctAnswer: "B",
    feedback: "Yes",
    skillIds: [],
  };
  assert.match(lessonHint(step, "A"), /meaning/i);
  assert.doesNotMatch(lessonHint(step, "A"), /beginning/i);
});
