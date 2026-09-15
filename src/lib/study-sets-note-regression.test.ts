import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Source-scan regression test, same technique as article-drill.test.ts and
 * mc-article-safety.test.ts — guards a property of `replaceCards`'s SOURCE,
 * not of a live call (it's a createServerFn tied to Firestore, not unit-
 * testable in isolation without mocking that).
 *
 * The property: CLAUDE.md documents `replaceCards` losing fields before
 * (starred/mastery, then status) — a plain field that isn't explicitly
 * carried through its undefined-vs-omitted convention silently vanishes on
 * every edit-page save. This guards `note` specifically, added alongside
 * `example`/`definition2`, whose own three chokepoints this mirrors: the
 * draft type, the per-field ternary, and the returned Card literal.
 */

const SOURCE_PATH = "src/lib/study-sets.ts";

function readSource(): string {
  return readFileSync(new URL(`../../${SOURCE_PATH}`, import.meta.url), "utf8");
}

describe("replaceCards carries `note` through, like example/definition2", () => {
  it("DraftCard's type includes note", () => {
    const source = readSource();
    assert.match(source, /note\?:\s*string\s*\|\s*null/);
  });

  it("has the undefined-vs-omitted fallback for note, not just a blind overwrite", () => {
    const source = readSource();
    // Same shape as the `example`/`definition2` ternaries just above it:
    // an omitted field falls back to what the prior card already had,
    // rather than being wiped whenever an older client doesn't send it.
    assert.match(source, /d\.note !== undefined[\s\S]{0,80}prior\?\.note/);
  });

  it("includes note in the Card object replaceCards actually returns", () => {
    const source = readSource();
    // The returned literal inside `nextCards = data.cards.map(...)` — assert
    // `note` sits alongside `definition2` and `enrichment` in that literal,
    // not merely declared and computed but never attached to the result.
    const returnedCardLiteral = /definition2,\s*note,\s*enrichment,/;
    assert.match(source, returnedCardLiteral);
  });
});
