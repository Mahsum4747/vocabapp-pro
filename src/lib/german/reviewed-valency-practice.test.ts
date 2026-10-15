import assert from "node:assert/strict";
import test from "node:test";
import reviews from "../../content/kaikki-fixed-item-review-2026-10-14.json" with { type: "json" };
import {
  reviewedValencyQuestions,
  evaluateReviewedValencyAnswer,
  reviewedSourceCorrection,
} from "./reviewed-valency-practice";
import { sourceValencyPronounQuestions } from "./valency-practice";
import { diagnoseValencyCaseContrast } from "../curriculum/lesson-diagnostics";
import { lookupAcceptedValencyReferences } from "./verb-valency-index";

test("all recommendations are wired into fixed practice while held records stay out", () => {
  const questions = reviewedValencyQuestions();
  assert.equal(questions.length, 256);
  assert.equal(
    questions.filter((q) => q.reviewedValencyItem?.kind === "personal_pronoun_case").length,
    95,
  );
  assert.equal(
    questions.filter((q) => q.reviewedValencyItem?.kind === "determiner_case").length,
    161,
  );
  assert.ok(new Set(questions.map((q) => q.reviewedValencyItem!.lemma)).size >= 174);
  const ids = new Set(questions.map((q) => q.reviewedValencyItem!.recordId));
  for (const record of reviews.records) {
    if (record.review.decision !== "hold") assert.ok(ids.has(record.recordId));
  }
  for (const q of questions) {
    const item = q.reviewedValencyItem!;
    assert.ok(
      reviewedValencyQuestions(
        item.lemma,
        item.kind as "personal_pronoun_case" | "determiner_case",
      ).some((other) => other.reviewedValencyItem!.recordId === item.recordId),
    );
    assert.equal(q.prompt.split("___").length, 2);
    assert.equal(q.checkAnswer!(q, q.correctAnswer)?.outcome, "correct");
    const wrong = q.options.find((a) => a !== q.correctAnswer)!;
    assert.equal(q.checkAnswer!(q, wrong)?.outcome, "wrong_case_for_this_item");
    assert.ok(q.checkAnswer!(q, wrong)?.feedback);
    assert.equal(q.checkAnswer!(q, "different person or object"), null);
    assert.equal(evaluateReviewedValencyAnswer(item, item.sentence), null);
    for (const alteration of [
      { exerciseId: "unselected-item" },
      { version: "changed" },
      { recordId: "unknown-record" },
      { senseId: "other-sense" },
      { sentence: "Heute " + item.sentence },
    ]) {
      assert.equal(evaluateReviewedValencyAnswer({ ...item, ...alteration }, wrong), null);
      assert.equal(
        q.checkAnswer!({ ...q, reviewedValencyItem: { ...item, ...alteration } }, wrong),
        null,
      );
    }
    assert.equal(q.checkAnswer!({ ...q, prompt: "Another context ___" }, wrong), null);
  }
});
test("AI-authored review exercises cannot pass as sourced examples or open free-text diagnoses", () => {
  assert.equal(sourceValencyPronounQuestions().length, 15);
  assert.deepEqual(sourceValencyPronounQuestions("sehen"), []);
  assert.equal(
    diagnoseValencyCaseContrast("Ich sehe heute nach ihm.", "Ich sehe heute nach ihn."),
    null,
  );
  const record = reviews.records.find((r) => r.lemma === "sehen")!;
  assert.ok(
    record.review.exercise &&
      record.review.exercise.contentClass === "ai_authored_source_grounded_practice",
  );
  assert.equal(record.review.exercise.sourceQuotation, false);
  assert.equal(record.review.automaticFreeTextDiagnosisAllowed, false);
});
test("passen correction uses a separate bound exercise and preserves the disputed original", () => {
  const r = reviews.records.find((r) => r.review.sourceCorrection)!;
  assert.equal(r.sourceCase, "dat");
  assert.equal(r.review.recommendedCase, "akk");
  const original = lookupAcceptedValencyReferences("passen").find(
    (f) => f.context[0].senseId === r.senseId && f.preposition === "auf",
  )!;
  assert.equal(original.case, "dativ");
  assert.equal(original.review, "reference-only");
  assert.equal(reviewedSourceCorrection(r.senseId, r.recordSha256)?.proposedCase, "akk");
  const q = reviewedValencyQuestions("passen").find(
    (q) => q.reviewedValencyItem!.recordId === r.recordId,
  )!;
  assert.equal(q.correctAnswer, "ihn");
  assert.equal(q.checkAnswer!(q, "ihm")?.outcome, "wrong_case_for_this_item");
  assert.ok(
    !diagnoseValencyCaseContrast(
      "Die Beschreibung passt auf ihn.",
      "Die Beschreibung passt auf ihm.",
    )?.targetLabel?.startsWith("passen +"),
  );
});

test("remaining source clozes retain their full sentence, target and conditions; unsafe subjects stay held", async () => {
  const { default: data } = await import(
    "../../content/kaikki-remaining-fixed-review-2026-10-15.json",
    { with: { type: "json" } }
  );
  assert.equal(data.records.length, 702);
  assert.equal(data.records.filter((r) => r.review.exercise).length, 45);
  for (const r of data.records) {
    const e = r.review.exercise;
    const q = reviewedValencyQuestions().find(
      (q) => q.reviewedValencyItem!.recordId === r.recordId,
    );
    if (!e) {
      assert.ok(r.assessment.reasons.length);
      assert.equal(q, undefined);
      continue;
    }
    assert.ok(q);
    assert.equal(e.correctSentence, e.sourceExample.text);
    assert.equal(e.prompt.replace("____", e.acceptedAnswers[0]), e.correctSentence);
    assert.equal(e.sourceQuotation, true);
    assert.ok(r.senseId);
    assert.ok(r.usageConditions.argumentSpecificationVerbatim);
    assert.equal(r.assessment.cefrLevel, null);
    assert.equal(q.reviewedValencyItem!.sourceQuotation, true);
    assert.equal(r.review.automaticFreeTextDiagnosisAllowed, false);
  }
  for (const id of ["129", "821", "1073", "700"])
    assert.equal(data.records.find((r) => r.contextId === id)!.review.exercise, null);
});
