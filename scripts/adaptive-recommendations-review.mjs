import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { stripTypeScriptTypes } from "node:module";
import { pathToFileURL } from "node:url";
// Developer-only synthetic matrix. Instrument a temporary module to record actual
// internal candidate scores without adding scores/logging to the production API.
const root = process.cwd();
const { qualityScenarios } = await import(
  pathToFileURL(root + "/src/lib/adaptive-recommendations.review-fixtures.ts")
);
let source = readFileSync(process.argv[3] ?? root + "/src/lib/adaptive-recommendations.ts", "utf8");
if (!source.includes("const recommendations = selected.map"))
  throw new Error("Score capture marker changed; update reviewer helper.");
source = source.replace(
  "const recommendations = selected.map",
  "globalThis.__qualityScores = Object.fromEntries([...merged.values()].map(c => [c.recommendation.id,c.score])); const recommendations = selected.map",
);
source = stripTypeScriptTypes(source).replace(
  /from "\.\/(.*?)"/g,
  (_, p) => `from "${pathToFileURL(root + "/src/lib/" + p + ".ts")}"`,
);
const { buildAdaptiveStudyPlan } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
const { buildAdaptiveStudyPlan: uninstrumented } = await import(
  pathToFileURL(root + "/src/lib/adaptive-recommendations.ts")
);
const rows = qualityScenarios().map((c) => {
  const plan = buildAdaptiveStudyPlan(c.signals),
    r = plan.primary;
  if (!process.argv[3]) assert.deepEqual(plan, uninstrumented(c.signals));
  const key = r
    ? [r.domain, r.action.type, r.action.targetId ?? r.action.level].filter(Boolean).join(":")
    : "none";
  return {
    ...c,
    signals: undefined,
    key,
    actual: r,
    plan,
    scores: globalThis.__qualityScores,
    result: key === c.expected ? "PASS" : "FAIL",
  };
});
writeFileSync(process.argv[2], JSON.stringify(rows, null, 2));
console.log(
  rows.length,
  rows.filter((r) => r.result === "FAIL").map((r) => [r.name, r.expected, r.key]),
);

if (rows.some((r) => r.result === "FAIL")) process.exitCode = 1;
