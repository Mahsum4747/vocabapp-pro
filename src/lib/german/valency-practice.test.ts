import assert from "node:assert/strict";
import test from "node:test";
import {
  acceptedValencyVerbs,
  acceptedValencySearchTerms,
  sourceValencyPronounQuestions,
  valencyPracticeFeedback,
} from "./valency-practice";
import { lookupAcceptedValencyReferences } from "./verb-valency-index";

test("all fifteen sentence-scoped constructions are reachable through source-context pronoun practice", () => {
  const questions = sourceValencyPronounQuestions();
  assert.equal(questions.length, 15);
  assert.equal(new Set(questions.map((q) => q.valencyExample.term)).size, 15);
  for (const q of questions) {
    assert.equal(sourceValencyPronounQuestions(q.valencyExample.term).length, 1);
    assert.equal(q.prompt.split("___").length, 2);
    assert.equal(valencyPracticeFeedback(q, q.correctAnswer), null);
    const wrong = q.options.find((option) => option !== q.correctAnswer)!;
    assert.ok(valencyPracticeFeedback(q, wrong)?.startsWith(q.valencyExample.term + " +"));
    assert.equal(valencyPracticeFeedback(q, "uns"), null);
    assert.ok(q.valencyExample.meaning);
    assert.ok(q.valencyExample.sourceURL.startsWith("https://en.wiktionary.org/wiki/"));
  }
});
test("reference-only accepted meanings are discoverable but do not create exercises", () => {
  assert.ok(acceptedValencyVerbs().includes("sehen"));
  assert.ok(
    lookupAcceptedValencyReferences("sehen").some(
      (frame) => frame.referenceAcceptance === "accepted" && frame.review === "reference-only",
    ),
  );
  assert.deepEqual(sourceValencyPronounQuestions("sehen"), []);
  assert.deepEqual(sourceValencyPronounQuestions("sich nähern"), []);
  assert.ok(
    lookupAcceptedValencyReferences("sich nähern").every(
      (frame) => frame.construction === "sich nähern",
    ),
  );
});

test("reflexive constructions remain directly discoverable with their full scope", () => {
  assert.ok(acceptedValencySearchTerms().includes("sich ärgern"));
  const frames = lookupAcceptedValencyReferences("sich ärgern");
  assert.ok(frames.length);
  assert.ok(
    frames.every(
      (frame) => frame.construction === "sich ärgern" && frame.context[0].requiredReflexive,
    ),
  );
});
