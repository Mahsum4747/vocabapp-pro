import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AI_DAILY_CAP_PER_USER,
  USER_CAP_MESSAGE,
  ceilingFromEnv,
  decideSpend,
  readAiActionsToday,
} from "./ai-budget.ts";

const NOW = Date.UTC(2026, 8, 21, 12);

describe("decideSpend", () => {
  it("allows until the per-user cap, then hard-fails with the friendly message", () => {
    for (let used = 0; used < AI_DAILY_CAP_PER_USER; used++) {
      const d = decideSpend({ kind: "assist", userCount: used, globalCount: 0, ceiling: 1000 });
      assert.equal(d.ok, true);
    }
    const capped = decideSpend({
      kind: "generate",
      userCount: AI_DAILY_CAP_PER_USER,
      globalCount: 0,
      ceiling: 1000,
    });
    assert.deepEqual(capped, { ok: false, reason: "user_cap", error: USER_CAP_MESSAGE });
    assert.match(USER_CAP_MESSAGE, /midnight UTC/);
  });
  it("global tripwire stops generate at 70% of the ceiling, for everyone", () => {
    assert.equal(decideSpend({ kind: "generate", userCount: 0, globalCount: 13, ceiling: 20 }).ok, true);
    const tripped = decideSpend({ kind: "generate", userCount: 0, globalCount: 14, ceiling: 20 });
    assert.equal(tripped.ok, false);
    if (!tripped.ok) assert.equal(tripped.reason, "global_tripwire");
  });
  it("per-card assists keep working past the tripwire, until the ceiling itself", () => {
    assert.equal(decideSpend({ kind: "assist", userCount: 0, globalCount: 14, ceiling: 20 }).ok, true);
    assert.equal(decideSpend({ kind: "assist", userCount: 0, globalCount: 20, ceiling: 20 }).ok, false);
  });
  it("reports what's left", () => {
    const d = decideSpend({ kind: "assist", userCount: 1, globalCount: 0, ceiling: 100 });
    assert.equal(d.ok && d.remaining, AI_DAILY_CAP_PER_USER - 2);
  });
});

describe("readAiActionsToday", () => {
  it("reads today's count and resets a previous day's to zero", () => {
    assert.equal(readAiActionsToday({ dayKey: "2026-09-21", count: 3 }, NOW).count, 3);
    assert.equal(readAiActionsToday({ dayKey: "2026-09-20", count: 5 }, NOW).count, 0);
    assert.equal(readAiActionsToday(undefined, NOW).count, 0);
  });
});

describe("ceilingFromEnv", () => {
  it("uses the env value, else the documented default", () => {
    assert.equal(ceilingFromEnv("250"), 250);
    assert.equal(ceilingFromEnv(undefined), 20);
    assert.equal(ceilingFromEnv("nope"), 20);
  });
});
