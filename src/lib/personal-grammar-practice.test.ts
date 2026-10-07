import assert from "node:assert/strict";
import test from "node:test";
import { buildPersonalGrammarPracticePrompt } from "./personal-grammar-practice";

test("practice generation stays grounded in the canonical narrow rule", () => {
  const prompt = buildPersonalGrammarPracticePrompt({
    topic: "helfen-dativ",
    count: 5,
    focus: "I keep using mich instead of mir",
  });
  assert.match(prompt, /helfen \+ Dativ/);
  assert.match(prompt, /exactly 5 multiple-choice items/);
  assert.match(prompt, /mich instead of mir/);
  assert.match(prompt, /source of truth/);
  assert.match(prompt, /practice only/i);
});
