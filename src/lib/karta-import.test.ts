import assert from "node:assert/strict";
import { test } from "node:test";
import { parseKartaJson } from "./karta-import.ts";
import { caseExampleFor } from "./case-forms.ts";

const base = (cards: unknown[]) =>
  JSON.stringify({ title: "Food", pair: "de-en", level: "A1", cards });

const kaffee = {
  term: "Kaffee",
  pos: "noun",
  gender: "der",
  plural: null,
  noPlural: true,
  gloss: "coffee",
  examples: { nom: "Der Kaffee ist heiß.", akk: "Ich trinke den Kaffee.", dat: "Ich gebe dem Kaffee Zeit." },
};

test("valid noun maps to live card fields", () => {
  const r = parseKartaJson(base([kaffee]));
  assert.ok(r.ok);
  const c = r.value.cards[0];
  assert.equal(c.term, "Kaffee");
  assert.equal(c.definition, "coffee");
  assert.equal(c.example, "Der Kaffee ist heiß.");
  assert.deepEqual(c.enrichment, { gender: "m", noPlural: true, source: "user" });
  assert.equal(c.examples?.akk, "Ich trinke den Kaffee.");
});

test("bad JSON / wrong schema returns errors and no cards", () => {
  assert.equal(parseKartaJson("{nope").ok, false);
  const r = parseKartaJson(base([{ ...kaffee, term: "der Kaffee" }, { ...kaffee, extra: 1 }]));
  assert.ok(!r.ok);
  assert.ok(r.errors.length >= 2);
});

test("verb with gender is rejected; noun without gender warns", () => {
  assert.ok(!parseKartaJson(base([{ term: "gehen", pos: "verb", gender: "der", gloss: "go" }])).ok);
  const r = parseKartaJson(base([{ term: "Tisch", pos: "noun", gender: null, gloss: "table" }]));
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].enrichment, null);
  assert.equal(r.value.warnings.length, 1);
});

test("akk sentence without the Akkusativ form is dropped and reported", () => {
  const r = parseKartaJson(
    base([{ ...kaffee, noPlural: false, examples: { nom: null, akk: "Der Kaffee ist heiß.", dat: null } }]),
  );
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].examples, null);
  assert.equal(r.value.warnings.length, 1);
});

test("Cases shows no sentence when no case example exists", () => {
  const card = { term: "Freundin", example: "Meine Freundin studiert in Hamburg.", examples: null };
  assert.equal(caseExampleFor(card, "der", "die", "dativ"), null);
  assert.equal(
    caseExampleFor({ ...card, examples: { dat: "Ich helfe der Freundin." } }, "der", "die", "dativ"),
    "Ich helfe der Freundin.",
  );
});
