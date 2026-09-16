import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { insertAtCursor } from "./insert-at-cursor.ts";

describe("insertAtCursor", () => {
  it("inserts at a collapsed cursor position (no selection)", () => {
    // "Ubung" with the cursor after "U" (index 1) -> "Uübung"
    assert.deepEqual(insertAtCursor("Ubung", 1, 1, "ü"), { value: "Uübung", cursor: 2 });
  });

  it("inserts in the middle of a word", () => {
    assert.deepEqual(insertAtCursor("Ubng", 2, 2, "u"), { value: "Ubung", cursor: 3 });
  });

  it("appends at the end", () => {
    assert.deepEqual(insertAtCursor("gro", 3, 3, "ß"), { value: "groß", cursor: 4 });
  });

  it("replaces a selected range instead of inserting alongside it", () => {
    // "Uebung" with "e" (index 1..2) selected, replaced by "ü"
    assert.deepEqual(insertAtCursor("Uebung", 1, 2, "ü"), { value: "Uübung", cursor: 2 });
  });

  it("swaps start/end when given in reverse order", () => {
    assert.deepEqual(insertAtCursor("Uebung", 2, 1, "ü"), insertAtCursor("Uebung", 1, 2, "ü"));
  });

  it("clamps negative and out-of-range positions", () => {
    assert.deepEqual(insertAtCursor("ab", -5, -5, "x"), { value: "xab", cursor: 1 });
    assert.deepEqual(insertAtCursor("ab", 50, 50, "x"), { value: "abx", cursor: 3 });
  });

  it("handles inserting into an empty string", () => {
    assert.deepEqual(insertAtCursor("", 0, 0, "ä"), { value: "ä", cursor: 1 });
  });

  it("handles an empty insert (no-op splice, cursor stays put)", () => {
    assert.deepEqual(insertAtCursor("abc", 1, 1, ""), { value: "abc", cursor: 1 });
  });
});
