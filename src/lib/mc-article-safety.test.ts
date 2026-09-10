import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Guards a risk that was investigated, found dormant, and must STAY
 * dormant: 3B-UI flagged that a multiple-choice option showing an article
 * while its distractors don't would be a visible "this one's correct" tell.
 * Step 0 of 3B.5 confirmed it wasn't live (display was gated to set-detail
 * list / flashcard front only), and this step deliberately keeps it that
 * way by never touching MC rendering.
 *
 * A source scan rather than a rendered-DOM test — there is no
 * component-test harness in this repo (`no browser testing`), and the
 * property this guards ("no article-related code near MC option
 * rendering") is a property of the SOURCE, not of any one render's output.
 * It intentionally fails loudly if a future change adds an enrichment
 * reference to either file, forcing a deliberate look rather than letting
 * it slip in as a side effect of an unrelated edit.
 */

const ROUTES = [
  "src/routes/sets.$setId.learn.tsx",
  "src/routes/sets.$setId.test.tsx",
] as const;

function read(path: string): string[] {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8").split("\n");
}

describe("MC rendering never references article/enrichment logic", () => {
  for (const path of ROUTES) {
    it(`${path}: every articleizedTerm/.enrichment line is in the written-answer path, never near MC`, () => {
      const lines = read(path);
      const flagged = lines.filter(
        (line) => line.includes("articleizedTerm") || line.includes(".enrichment"),
      );
      // The import line plus the lines this feature actually added — a
      // stable, small count. A new line here means new code was added that
      // touches this; the assertions below say what it's allowed to say.
      assert.ok(flagged.length > 0, "expected the feature's own lines to be present");
      for (const line of flagged) {
        // None of the MC option-rendering vocabulary (options, selected,
        // picked, chosen, onClick's option/value bindings) appears on any
        // line that also mentions enrichment or the article-rendering call.
        assert.doesNotMatch(
          line,
          /\b(options|selected|picked|chosen|mc)\b/,
          `MC-related line references article/enrichment logic: ${line.trim()}`,
        );
      }
    });

    it(`${path}: the mc-branch options.map block contains no article/enrichment reference`, () => {
      const source = read(path).join("\n");
      const mcBlockStart = source.indexOf("options.map((option)");
      assert.notEqual(mcBlockStart, -1, "expected to find the MC options.map block");
      // The MC block is short; 800 chars comfortably covers it up to the
      // closing of the .map callback in both files without reaching into
      // the written-answer form that follows it.
      const mcBlock = source.slice(mcBlockStart, mcBlockStart + 800);
      assert.doesNotMatch(mcBlock, /articleizedTerm|\.enrichment/);
    });
  }
});
