import assert from "node:assert/strict";
import { test } from "node:test";
import { caseFormOptions, exampleForCase } from "./case-forms.ts";

test("options are only the asked case's articles", () => {
  assert.deepEqual(caseFormOptions("akkusativ"), ["den", "die", "das"]);
  assert.deepEqual(caseFormOptions("dativ"), ["dem", "der"]);
});

test("example shown only when it uses the asked case form", () => {
  assert.equal(
    exampleForCase("Ich trinke den Kaffee.", "Kaffee", "den", "der", "akkusativ"),
    "Ich trinke den Kaffee.",
  );
  assert.equal(
    exampleForCase("Ich trinke den heißen Kaffee.", "Kaffee", "den", "der", "akkusativ"),
    "Ich trinke den heißen Kaffee.",
  );
  assert.equal(
    exampleForCase("Meine Freundin studiert in Hamburg.", "Freundin", "der", "die", "dativ"),
    null,
  );
  assert.equal(
    exampleForCase("Ich helfe der Freundin.", "Freundin", "der", "die", "dativ"),
    "Ich helfe der Freundin.",
  );
});

test("die/das sentence-initial match is Nominativ, not Akkusativ", () => {
  assert.equal(exampleForCase("Die Freundin lacht.", "Freundin", "die", "die", "akkusativ"), null);
  assert.equal(
    exampleForCase("Ich sehe die Freundin.", "Freundin", "die", "die", "akkusativ"),
    "Ich sehe die Freundin.",
  );
});
