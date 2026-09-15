import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Source-scan regression test, same technique as mc-article-safety.test.ts
 * and card-editor-example-suggestions.test.ts: guards a property of the
 * SOURCE (no browser testing, no component-render harness here), not of any
 * one call's output.
 *
 * The property: the article drill's write path must never be able to touch
 * the main FSRS review pipeline. Getting an article wrong in this drill must
 * never affect a card's scheduling, mastery score, XP, or streak — that is
 * the whole reason this is a separate module with its own tiny schema
 * instead of a new field on CardProgress.
 */

const SOURCE_PATH = "src/lib/article-drill.ts";

function readSource(): string {
  return readFileSync(new URL(`../../${SOURCE_PATH}`, import.meta.url), "utf8");
}

describe("article drill write path never touches the FSRS review pipeline", () => {
  it("never calls recordReview/planReview or imports the scheduler", () => {
    const source = readSource();
    // Matches call/import syntax, not the doc comment's prose mention of
    // `recordReview` (backticked, no call parens) explaining what this file
    // must never reach.
    assert.doesNotMatch(source, /recordReview\(|planReview\(|defaultScheduler|from ["'].\/srs/);
  });

  it("never reads or writes the cardProgress, reviewEvents, or dailyStats collections", () => {
    const source = readSource();
    assert.doesNotMatch(source, /collection\("cardProgress"\)/);
    assert.doesNotMatch(source, /collection\("reviewEvents"\)/);
    assert.doesNotMatch(source, /collection\("dailyStats"\)/);
  });

  it("only ever writes to its own articleDrillProgress collection", () => {
    const source = readSource();
    const writes = [...source.matchAll(/\.set\(/g)];
    // The one write site in the file: recordArticleDrillAttempt's own doc.
    assert.equal(writes.length, 1, `expected exactly one .set( write site, found ${writes.length}`);
    assert.match(source, /\.collection\("articleDrillProgress"\)/);
  });

  it("never references XP, achievements, or streak logic", () => {
    const source = readSource();
    assert.doesNotMatch(source, /applyXp|xpForReview|unlockAchievementsFor|recordStudyActivityFor|Achievement/);
  });

  it("never imports CardProgress, ReviewEvent, or DailyStats types", () => {
    const source = readSource();
    assert.doesNotMatch(source, /\bCardProgress\b|\bReviewEvent\b|\bDailyStats\b/);
  });

  it("the only Firestore write uses FieldValue.increment for counters, never a scheduler-shaped field", () => {
    const source = readSource();
    const start = source.indexOf("await ref.set(");
    const end = source.indexOf("\n    );", start);
    assert.ok(start !== -1 && end !== -1);
    const body = source.slice(start, end);
    assert.doesNotMatch(body, /dueAt|interval|stability|difficulty|masteryScore|scheduler:/);
    assert.match(body, /attempts: FieldValue\.increment/);
    assert.match(body, /correct: FieldValue\.increment/);
  });
});
