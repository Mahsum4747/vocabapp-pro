import { test } from "node:test";
import assert from "node:assert/strict";
import { makeShareId, needsShareId } from "./migrate-share-ids.mjs";

test("generates a 10-character URL-safe id", () => {
  const id = makeShareId();
  assert.equal(id.length, 10);
  assert.match(id, /^[A-Za-z0-9_-]{10}$/);
});

test("generated ids differ", () => {
  const ids = new Set(Array.from({ length: 200 }, () => makeShareId()));
  assert.equal(ids.size, 200);
});

test("maps bytes onto the alphabet without bias at the wrap point", () => {
  // 64-char alphabet: byte 0 and byte 64 must land on the same character.
  assert.equal(makeShareId(new Uint8Array([0])), makeShareId(new Uint8Array([64])));
  assert.equal(makeShareId(new Uint8Array([0])), "A");
});

test("flags sets that have no usable shareId", () => {
  assert.equal(needsShareId({}), true);
  assert.equal(needsShareId({ shareId: "" }), true);
  assert.equal(needsShareId({ shareId: "   " }), true);
  assert.equal(needsShareId(undefined), true);
});

test("leaves sets that already have a shareId alone", () => {
  assert.equal(needsShareId({ shareId: "aB3-xY_9Qz" }), false);
});
