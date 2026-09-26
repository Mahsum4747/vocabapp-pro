import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WRITE_PROMPTS, promptGloss } from "./write-prompts.ts";

describe("write prompt bank", () => {
  it("every prompt is well-formed", () => {
    const ids = new Set<string>();
    for (const p of WRITE_PROMPTS) {
      assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
      ids.add(p.id);
      assert.ok(p.leitpunkte.length >= 3 && p.leitpunkte.length <= 4, p.id);
      assert.ok(p.minWords < p.maxWords, p.id);
      assert.ok(p.gloss.en && p.gloss.tr, p.id);
    }
  });
  it("ku gloss falls back to en", () => {
    const p = WRITE_PROMPTS[0];
    assert.equal(promptGloss(p, "ku"), p.gloss.en);
    assert.equal(promptGloss(p, "tr"), p.gloss.tr);
  });
});
