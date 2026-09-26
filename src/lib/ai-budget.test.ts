import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GLOBAL_TRIPWIRE_MESSAGE, ceilingFromEnv, decideSpend } from "./ai-budget.ts";

describe("decideSpend", () => {
  it("global tripwire stops generate at 70% of the ceiling, for everyone", () => {
    assert.equal(decideSpend({ kind: "generate", globalCount: 13, ceiling: 20 }).ok, true);
    const tripped = decideSpend({ kind: "generate", globalCount: 14, ceiling: 20 });
    assert.deepEqual(tripped, {
      ok: false,
      reason: "global_tripwire",
      error: GLOBAL_TRIPWIRE_MESSAGE,
    });
    assert.match(GLOBAL_TRIPWIRE_MESSAGE, /midnight UTC/);
  });
  it("per-card assists keep working past the tripwire, until the ceiling itself", () => {
    assert.equal(decideSpend({ kind: "assist", globalCount: 14, ceiling: 20 }).ok, true);
    assert.equal(decideSpend({ kind: "assist", globalCount: 20, ceiling: 20 }).ok, false);
  });
  it("has no per-user limit — the same caller can spend repeatedly while the pool has room", () => {
    for (let used = 0; used < 20; used++) {
      const d = decideSpend({ kind: "assist", globalCount: used, ceiling: 1000 });
      assert.equal(d.ok, true);
    }
  });
  it("reports what's left in the shared pool", () => {
    const d = decideSpend({ kind: "assist", globalCount: 1, ceiling: 100 });
    assert.equal(d.ok && d.remaining, 98);
  });
});

describe("ceilingFromEnv", () => {
  it("uses the env value, else the documented default", () => {
    assert.equal(ceilingFromEnv("250"), 250);
    assert.equal(ceilingFromEnv(undefined), 1500);
    assert.equal(ceilingFromEnv("nope"), 1500);
  });
});
