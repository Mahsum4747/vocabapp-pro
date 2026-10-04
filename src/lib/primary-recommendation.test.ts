import test from "node:test";
import assert from "node:assert/strict";
import {
  loadPrimaryRecommendation,
  recommendationCta,
  hasSafeRecommendationRoute,
  isKnownStaleRecommendation,
} from "./primary-recommendation";
import {
  recommendationExamples,
  experiencedSignals,
  fixtureTopic,
} from "./adaptive-recommendations.fixtures";
import { buildAdaptiveStudyPlan } from "./adaptive-recommendations";
const r = () => buildAdaptiveStudyPlan(recommendationExamples().grammarWeak!).primary!;
test("one read and actual engine primary, no duplicate rules", async () => {
  let reads = 0;
  const signals = recommendationExamples().overdue!;
  assert.deepEqual(
    await loadPrimaryRecommendation(async () => {
      reads++;
      return signals;
    }),
    buildAdaptiveStudyPlan(signals).primary,
  );
  assert.equal(reads, 1);
});
test("empty plan remains null", async () => {
  assert.equal(await loadPrimaryRecommendation(async () => recommendationExamples().strong!), null);
});
test("read failure propagates to quiet component error boundary", async () => {
  await assert.rejects(
    loadPrimaryRecommendation(async () => {
      throw new Error("read failure");
    }),
  );
});
test("route validation accepts real targets and rejects external or mismatch", () => {
  const item = r();
  assert.equal(hasSafeRecommendationRoute(item), true);
  assert.equal(hasSafeRecommendationRoute({ ...item, route: "https://example.test" }), false);
  assert.equal(hasSafeRecommendationRoute({ ...item, route: "/sets/another/cases" }), false);
  assert.equal(
    hasSafeRecommendationRoute({
      ...item,
      action: { type: "grammar_practice", targetId: "unknown" },
    }),
    false,
  );
});
test("review and weak search remain exact", () => {
  const item = buildAdaptiveStudyPlan(recommendationExamples().overdue!).primary!;
  assert.equal(hasSafeRecommendationRoute(item), true);
  assert.equal(hasSafeRecommendationRoute({ ...item, route: "/review?new=10" }), false);
  assert.equal(
    hasSafeRecommendationRoute({
      ...item,
      route: "/review?filter=weak",
      action: { type: "weak_review" },
    }),
    true,
  );
  assert.equal(recommendationCta(item), "Open Review");
});
test("known deleted set hidden, unresolved snapshot allowed", () => {
  assert.equal(isKnownStaleRecommendation(r(), [], true), true);
  assert.equal(isKnownStaleRecommendation(r(), [], false), false);
});
test("generic chooser never promises direct level launch", () => {
  const item = buildAdaptiveStudyPlan(recommendationExamples().brandNew!).primary!;
  assert.equal(recommendationCta(item), "Open Lesen");
  assert.equal(hasSafeRecommendationRoute(item), true);
  assert.equal(isKnownStaleRecommendation(item, [], true), false);
});
test("all curriculum targets validate through shared registry", () => {
  const s = experiencedSignals();
  for (const id of ["plural", "cases", "articles", "conjugation", "satzbau", "cloze", "passiv"]) {
    s.grammar.topics = [fixtureTopic(id, { accuracy: 60, recentAttempts: 50, evidence: "high" })];
    assert.equal(hasSafeRecommendationRoute(buildAdaptiveStudyPlan(s).primary!), true);
  }
});
test("copy cleanup keeps numbers and avoids internal evidence jargon", async () => {
  const { recommendationReason, recommendationTitle } = await import("./primary-recommendation");
  const item = r();
  assert.equal(
    recommendationTitle({ ...item, action: { type: "writing_task" } }),
    "Practice writing",
  );
  const reason =
    "Your Cases accuracy is 60% with 50 lifetime questions (legacy evidence). case errors appeared in 6 of the last 6 saved writing feedback records.";
  assert.equal(
    recommendationReason({ ...item, reason }),
    "Your Cases accuracy is 60% with 50 questions recorded so far. case errors appeared in 6 of the last 6 writing feedback entries.",
  );
});
