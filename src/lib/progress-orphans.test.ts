import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findOrphanProgressIds, foreignSetIds } from "./progress-orphans.ts";
import type { StudySet } from "./types.ts";

const set = (id: string, cardIds: string[]) =>
  ({ id, cards: cardIds.map((c) => ({ id: c })) }) as unknown as StudySet;

describe("findOrphanProgressIds", () => {
  const ownerSets = [set("s1", ["a", "b"])];
  it("keeps rows whose card still exists in the owner's set", () => {
    assert.deepEqual(
      findOrphanProgressIds({
        ownerSets,
        rows: { a: { setId: "s1" }, b: { setId: "s1" } },
        existingForeignSetIds: new Set(),
      }),
      [],
    );
  });
  it("drops a row whose card left its set (removed or renamed)", () => {
    assert.deepEqual(
      findOrphanProgressIds({
        ownerSets,
        rows: { a: { setId: "s1" }, gone: { setId: "s1" } },
        existingForeignSetIds: new Set(),
      }),
      ["gone"],
    );
  });
  it("keeps progress on someone else's set that still exists, drops it if the set is gone", () => {
    const rows = { x: { setId: "theirs" }, y: { setId: "deleted" } };
    assert.deepEqual(
      findOrphanProgressIds({ ownerSets, rows, existingForeignSetIds: new Set(["theirs"]) }),
      ["y"],
    );
  });
  it("lists only foreign set ids for the existence check", () => {
    assert.deepEqual(
      foreignSetIds(ownerSets, { a: { setId: "s1" }, x: { setId: "t" }, y: { setId: "t" } }).sort(),
      ["t"],
    );
  });
});
