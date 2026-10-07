import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLearnerGapStates,
  shouldRecommendRemediation,
  type DiagnosticObservation,
} from "./learner-diagnostics";

const at = 1_790_000_000_000;
const obs = (
  id: string,
  independent: boolean,
  confidence = 0.8,
): DiagnosticObservation => ({
  id,
  domain: "grammar",
  category: "lexical_government",
  targetId: "DE.GRAMMAR.LEXICAL.HELFEN_DAT",
  targetLabel: "helfen + Dativ",
  context: independent ? "lesson_independent" : "lesson_guided",
  occurredAt: at + Number(id.replace(/\D/g, "") || 0),
  confidence,
  independent,
  support: independent ? "none" : "hint",
});

test("one narrow error remains a tentative signal", () => {
  const [gap] = buildLearnerGapStates([obs("1", true)]);
  assert.ok(gap);
  assert.equal(gap.observationCount, 1);
  assert.equal(gap.independentObservationCount, 1);
  assert.equal(shouldRecommendRemediation(gap), false);
});

test("repeated independent lexical-government errors can trigger remediation", () => {
  const [gap] = buildLearnerGapStates([obs("1", true), obs("2", true)]);
  assert.ok(gap);
  assert.equal(gap.targetLabel, "helfen + Dativ");
  assert.equal(shouldRecommendRemediation(gap), true);
});

test("guided errors contribute less than independent evidence", () => {
  const [guided] = buildLearnerGapStates([obs("1", false), obs("2", false), obs("3", false)]);
  const [independent] = buildLearnerGapStates([obs("4", true), obs("5", true)]);
  assert.ok(guided && independent);
  assert.ok(independent.confidence > guided.confidence);
});

test("a likely slip needs repeated strong independent evidence before recommendation", () => {
  const base: DiagnosticObservation = {
    ...obs("1", true, 0.9),
    category: "likely_slip",
    targetId: undefined,
    targetLabel: "sentence typing slip",
  };
  const [one] = buildLearnerGapStates([base]);
  assert.ok(one);
  assert.equal(shouldRecommendRemediation(one), false);
  const [two] = buildLearnerGapStates([
    base,
    { ...base, id: "2", occurredAt: at + 2 },
  ]);
  assert.ok(two);
  assert.equal(shouldRecommendRemediation(two), true);
});
