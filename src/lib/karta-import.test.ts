import assert from "node:assert/strict";
import { test } from "node:test";
import { kartaPairLanguages, parseKartaJson } from "./karta-import.ts";
import { caseExampleFor } from "./case-forms.ts";

const base = (cards: unknown[]) =>
  JSON.stringify({ title: "Food", pair: "de-en", level: "A1", cards });
const pad = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ term: `Wort${i}`, pos: "other", gloss: "w" }));

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
  const r = parseKartaJson(base([kaffee, ...pad(7)]));
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
  const r = parseKartaJson(base([{ ...kaffee, term: "der Kaffee" }, { ...kaffee, extra: 1 }, ...pad(6)]));
  assert.ok(!r.ok);
  assert.ok(r.errors.length >= 2);
});

test("verb with gender is rejected; noun without gender warns", () => {
  assert.ok(!parseKartaJson(base([{ term: "gehen", pos: "verb", gender: "der", gloss: "go" }, ...pad(7)])).ok);
  const r = parseKartaJson(base([{ term: "Tisch", pos: "noun", gender: null, gloss: "table" }, ...pad(7)]));
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].enrichment, null);
  assert.equal(r.value.warnings.length, 1);
});

test("akk sentence without the Akkusativ form is dropped and reported", () => {
  const r = parseKartaJson(
    base([{ ...kaffee, noPlural: false, examples: { nom: null, akk: "Der Kaffee ist heiß.", dat: null } }, ...pad(7)]),
  );
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].examples, null);
  assert.equal(r.value.warnings.length, 1);
});

test("count bounds: 7 and 201 rejected, 8 and 200 accepted", () => {
  assert.ok(!parseKartaJson(base(pad(7))).ok);
  assert.ok(!parseKartaJson(base(pad(201))).ok);
  assert.ok(parseKartaJson(base(pad(8))).ok);
  assert.ok(parseKartaJson(base(pad(200))).ok);
});

test("Cases shows no sentence when no case example exists", () => {
  const card = { term: "Freundin", example: "Meine Freundin studiert in Hamburg.", examples: null };
  assert.equal(caseExampleFor(card, "der", "die", "dativ"), null);
  assert.equal(
    caseExampleFor({ ...card, examples: { dat: "Ich helfe der Freundin." } }, "der", "die", "dativ"),
    "Ich helfe der Freundin.",
  );
});

// Infrastructure check only: "test1".."test8" are placeholders, NOT real
// Turkish/Kurdish content.
const placeholders = (pair: string, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    title: "placeholder",
    pair,
    level: "A1",
    cards: Array.from({ length: 8 }, (_, i) => ({
      term: `test${i + 1}`,
      pos: "noun",
      gloss: `gloss${i + 1}`,
      ...extra,
    })),
  });

test("tr-ku / ku-tr pairs import and derive term/definition languages", () => {
  const r = parseKartaJson(placeholders("tr-ku"));
  assert.ok(r.ok);
  assert.equal(r.value.pair, "tr-ku");
  assert.deepEqual(kartaPairLanguages(r.value.pair), { term: "tr", definition: "ku" });
  assert.equal(r.value.cards.length, 8);
  assert.ok(r.value.cards.every((c) => c.enrichment === null));
  assert.deepEqual(r.value.warnings, []);
  assert.deepEqual(kartaPairLanguages("ku-tr"), { term: "ku", definition: "tr" });
  assert.deepEqual(kartaPairLanguages("de-en"), { term: "de", definition: "en" });
  assert.deepEqual(kartaPairLanguages("de-tr"), { term: "de", definition: "tr" });
});

test("non-German pairs reject German-only grammar fields; unknown pair rejected", () => {
  assert.ok(!parseKartaJson(placeholders("tr-ku", { gender: "der" })).ok);
  assert.ok(!parseKartaJson(placeholders("ku-tr", { examples: { nom: null, akk: "x", dat: null } })).ok);
  assert.ok(!parseKartaJson(placeholders("en-ku")).ok);
});
