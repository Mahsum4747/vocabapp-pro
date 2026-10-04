import assert from "node:assert/strict";
import test from "node:test";
import { resetOptions } from "./reset-karta-test-data.mjs";
test("reset defaults to dry run with exact scoped inventory", () => {
  const plan = resetOptions(["--project", "test", "--uid", "u"]);
  assert.equal(plan.execute, false);
  assert.deepEqual(plan.paths, [
    "users/u",
    "user_streaks/u",
    "grammarProgress/u",
    "lesenProgress/u",
  ]);
});
test("reset refuses missing identity, path injection and unconfirmed execution", () => {
  for (const args of [
    [],
    ["--project", "test"],
    ["--project", "test", "--uid", "u/other"],
    ["--project", "test", "--uid", "u", "--execute"],
  ])
    assert.throws(() => resetOptions(args));
  assert.equal(
    resetOptions(["--project", "test", "--uid", "u", "--execute", "--confirm", "test:u"]).execute,
    true,
  );
});
