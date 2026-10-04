import test from "node:test";
import assert from "node:assert/strict";
import { qualityScenarios } from "./adaptive-recommendations.review-fixtures";
import { buildAdaptiveStudyPlan } from "./adaptive-recommendations";
const scenarios = qualityScenarios();
for (const c of scenarios)
  test(`quality: ${c.name}`, () => {
    const before = structuredClone(c.signals),
      p = buildAdaptiveStudyPlan(c.signals),
      r = p.primary;
    const key = r
      ? [r.domain, r.action.type, r.action.targetId ?? r.action.level].filter(Boolean).join(":")
      : "none";
    assert.equal(key, c.expected, c.notes);
    assert.deepEqual(c.signals, before);
    assert.equal(
      c.signals.vocabulary.totalActiveCards,
      c.signals.vocabulary.reviewedCards + c.signals.vocabulary.newCards,
    );
    assert.deepEqual(buildAdaptiveStudyPlan(c.signals), p);
    assert.ok(p.recommendations.length <= 4);
    assert.equal(new Set(p.recommendations.map((r) => r.route)).size, p.recommendations.length);
    const reverse = structuredClone(c.signals);
    reverse.grammar.topics.reverse();
    reverse.writing.recentErrorCategories.reverse();
    assert.deepEqual(buildAdaptiveStudyPlan(reverse), p);
    for (const r of p.recommendations) {
      assert.doesNotMatch(r.reason, /score|coefficient/);
      if (r.evidence.sources.includes("reading"))
        assert.equal(r.evidence.metrics.levelAccuracy, null);
    }
  });
const get = (name: string) =>
  buildAdaptiveStudyPlan(scenarios.find((c) => c.name === name)!.signals);
test("review wording makes no new-only or exact session-count promise", () => {
  const r = get("10 new goal empty").primary!;
  assert.equal(r.action.type, "review");
  assert.equal(r.action.count, undefined);
  assert.equal(r.title, "Review your vocabulary");
  assert.match(r.reason, /existing queue selects the session/);
  assert.equal(r.evidence.metrics.suggestedNewWordLimit, 10);
  assert.equal(r.route, "/review");
});
test("reading action and wording require manual level selection", () => {
  const r = get("B1 2 completed").primary!;
  assert.equal(r.action.type, "choose_reading_level");
  assert.equal(r.action.count, undefined);
  assert.match(r.reason, /Open Lesen and select B1/);
  assert.equal(r.route, "/grammar/lesen");
});
test("Write Task instruction appears once after merging", () => {
  const c = structuredClone(
    scenarios.find((c) => c.name === "Repeated missing_leitpunkt")!.signals,
  );
  c.writing.recentErrorCategories.push({
    ...c.writing.recentErrorCategories[0]!,
    category: "register",
  });
  const p = buildAdaptiveStudyPlan(c);
  assert.equal(p.recommendations.length, 1);
  assert.equal(p.primary!.reason.match(/select the Task tab/g)?.length, 1);
  assert.equal(p.primary!.route, "/sets/fixture-set/write");
});
for (const id of ["cases", "articles", "satzbau", "conjugation"])
  test(`merged ${id} keeps separate counts and readable observed evidence`, () => {
    const p = get(`Multi-source ${id}`),
      r = p.primary!;
    assert.equal(p.recommendations.length, 1);
    assert.ok(r.evidence.sources.includes("grammar"));
    assert.ok(r.evidence.sources.includes("writing"));
    assert.equal(r.evidence.metrics["grammar.recentAttempts"], 80);
    assert.match(r.reason, /6 of the last 6/);
    if (id === "cases" || id === "articles") assert.ok(r.evidence.sources.includes("drill"));
    if (id === "satzbau") {
      assert.equal(r.evidence.metrics["verb_position.submissionsWithError"], 6);
      assert.equal(r.evidence.metrics["word_order_other.submissionsWithError"], 6);
    }
    assert.ok(r.reason.length < 500);
  });
test("low writing sample remains low evidence even with high usefulness", () => {
  const r = get("Writing 6 of 6 position").primary!;
  assert.equal(r.priority, "high");
  assert.equal(r.evidence.level, "low");
  assert.match(r.reason, /6 of the last 6/);
});
test("diversity near tie chooses reading second", () => {
  assert.equal(get("Diversity near tie").recommendations[1]!.domain, "reading");
});
test("diversity cannot replace materially stronger second grammar", () => {
  assert.equal(get("Diversity materially stronger grammar").recommendations[1]!.domain, "grammar");
});
test("soft domain cap does not hide third severe weakness behind reading", () => {
  const c = structuredClone(scenarios.find((c) => c.name === "Four equal grammar needs")!.signals);
  c.reading.levels.B1.completedPassages = 2;
  c.reading.levels.B1.lastPracticedAt = c.generatedAt - 2 * 86400000;
  const p = buildAdaptiveStudyPlan(c);
  assert.equal(p.recommendations.filter((r) => r.domain === "grammar").length, 4);
  assert.equal(
    p.recommendations.some((r) => r.domain === "reading"),
    false,
  );
});
test("recent severe weakness survives as high; borderline recent yields", () => {
  assert.equal(get("Severe grammar recency 0d").primary!.priority, "high");
  const c = structuredClone(scenarios.find((c) => c.name === "Severe grammar recency 0d")!.signals);
  c.grammar.topics[0]!.accuracy = 70;
  assert.equal(buildAdaptiveStudyPlan(c).primary!.priority, "low");
});
