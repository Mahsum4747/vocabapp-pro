import assert from "node:assert/strict";
import { test } from "node:test";
import {
  effectiveCap,
  markServed,
  passRemaining,
  takeSession,
  type SetSession,
} from "./session-pass.ts";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `c${i}`);
const cards = (n: number) => ids(n).map((id) => ({ id }));

test("default cap is min(20, size); clamped to 1..size", () => {
  assert.equal(effectiveCap(undefined, 50), 20);
  assert.equal(effectiveCap(undefined, 12), 12);
  assert.equal(effectiveCap(500, 50), 50);
  assert.equal(effectiveCap(0, 50), 1);
});

test("50 cards, cap 10: 10 served, then a different 10", () => {
  let session: SetSession = { cap: 10, served: [] };
  const first = takeSession(cards(50), session, 50);
  assert.equal(first.length, 10);
  for (const c of first) session = markServed(session, c.id, ids(50));
  const second = takeSession(cards(50), session, 50);
  assert.equal(second.length, 10);
  assert.ok(second.every((c) => !first.some((f) => f.id === c.id)));
});

test("after 5 sessions the pass resets and old cards return, queue order first", () => {
  let session: SetSession = { cap: 10, served: [] };
  for (let s = 0; s < 5; s += 1) {
    for (const c of takeSession(cards(50), session, 50)) {
      session = markServed(session, c.id, ids(50));
    }
  }
  assert.deepEqual(session.served, []);
  assert.equal(takeSession(cards(50), session, 50)[0]?.id, "c0");
});

test("fewer left than cap serves the remainder only; remaining counts down", () => {
  const session: SetSession = { cap: 10, served: ids(50).slice(0, 45) };
  assert.equal(takeSession(cards(50), session, 50).length, 5);
  assert.equal(passRemaining(session, ids(50)), 5);
});

test("a fully served subset pool falls back to itself; stale ids ignored", () => {
  const session: SetSession = { cap: 10, served: ["c0", "c1", "gone"] };
  assert.equal(takeSession(cards(2), session, 50).length, 2);
  assert.equal(passRemaining(session, ids(50)), 48);
});
