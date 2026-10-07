import assert from "node:assert/strict";
import test from "node:test";
import { buildPersonalGrammarNotePrompt } from "./personal-grammar-note";

test("personal grammar note prompt is grounded in canonical rule content", () => {
  const prompt = buildPersonalGrammarNotePrompt({
    topic: "pronomen",
    explanationLanguage: "Turkish",
    focus: "Why mir instead of mich?",
    learnerExample: "Kannst du mich helfen?",
  });
  assert.match(prompt, /Personal pronouns take different forms/i);
  assert.match(prompt, /Turkish/);
  assert.match(prompt, /Kannst du mich helfen/);
  assert.match(prompt, /source of truth/i);
});

test("unknown grammar topics are rejected by the prompt builder", () => {
  assert.throws(
    () =>
      buildPersonalGrammarNotePrompt({
        topic: "invented-rule",
        explanationLanguage: "English",
      }),
    /Unknown canonical grammar topic/,
  );
});
