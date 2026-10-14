import assert from "node:assert/strict";
import test from "node:test";
import { verbConfirmsCase } from "./verb-case-hint";

test("case hints no longer elevate unreviewed gloss-regex valency", () => {
  assert.equal(verbConfirmsCase("Ich drifte in die Stadt ab.", "die", "Stadt", "akkusativ"), false);
});

test("case hints withhold conflicting sourced government instead of choosing a case", () => {
  assert.equal(verbConfirmsCase("Ich schreibe an die Firma.", "die", "Firma", "akkusativ"), false);
  assert.equal(verbConfirmsCase("Ich schreibe an der Firma.", "der", "Firma", "dativ"), false);
});

test("unambiguous sourced government and independent fixed-preposition facts remain usable", () => {
  assert.equal(verbConfirmsCase("Ich warte auf den Mann.", "den", "Mann", "akkusativ"), true);
  assert.equal(verbConfirmsCase("Ich reise mit dem Mann.", "dem", "Mann", "dativ"), true);
});
