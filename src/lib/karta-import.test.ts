import assert from "node:assert/strict";
import { test } from "node:test";
import { parseKartaJson } from "./karta-import.ts";

const DE = { germanTerms: true };
const NON_DE = { germanTerms: false };
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
  examples: {
    nom: "Der Kaffee ist heiß.",
    akk: "Ich trinke den Kaffee.",
    dat: "Ich gebe dem Kaffee Zeit.",
  },
};

test("valid noun maps to live card fields", () => {
  const r = parseKartaJson(base([kaffee, ...pad(7)]), DE);
  assert.ok(r.ok);
  const c = r.value.cards[0];
  assert.equal(c.term, "Kaffee");
  assert.equal(c.definition, "coffee");
  assert.equal(c.example, "Der Kaffee ist heiß.");
  assert.deepEqual(c.enrichment, { gender: "m", noPlural: true, source: "user" });
  assert.equal(c.examples?.akk, "Ich trinke den Kaffee.");
});

test("bad JSON / wrong schema returns errors and no cards", () => {
  assert.equal(parseKartaJson("{nope", DE).ok, false);
  const r = parseKartaJson(
    base([{ ...kaffee, term: "der Kaffee" }, { ...kaffee, extra: 1 }, ...pad(6)]),
    DE,
  );
  assert.ok(!r.ok);
  assert.ok(r.errors.length >= 2);
});

test("verb with gender is rejected; noun without gender warns", () => {
  assert.ok(
    !parseKartaJson(
      base([{ term: "gehen", pos: "verb", gender: "der", gloss: "go" }, ...pad(7)]),
      DE,
    ).ok,
  );
  const r = parseKartaJson(
    base([{ term: "Tisch", pos: "noun", gender: null, gloss: "table" }, ...pad(7)]),
    DE,
  );
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].enrichment, null);
  assert.equal(r.value.warnings.length, 1);
});

test("akk sentence without the Akkusativ form is dropped and reported", () => {
  const r = parseKartaJson(
    base([
      {
        ...kaffee,
        noPlural: false,
        examples: { nom: null, akk: "Der Kaffee ist heiß.", dat: null },
      },
      ...pad(7),
    ]),
    DE,
  );
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].examples, null);
  assert.equal(r.value.warnings.length, 1);
});

test("count bounds: 7 and 201 rejected, 8 and 200 accepted", () => {
  assert.ok(!parseKartaJson(base(pad(7)), DE).ok);
  assert.ok(!parseKartaJson(base(pad(201)), DE).ok);
  assert.ok(parseKartaJson(base(pad(8)), DE).ok);
  assert.ok(parseKartaJson(base(pad(200)), DE).ok);
});

test("Cases shows no sentence when no case example exists", () => {
  const card = { term: "Freundin", example: "Meine Freundin studiert in Hamburg.", examples: null };
  assert.equal(caseExampleFor(card, "der", "die", "dativ"), null);
  assert.equal(
    caseExampleFor(
      { ...card, examples: { dat: "Ich helfe der Freundin." } },
      "der",
      "die",
      "dativ",
    ),
    "Ich helfe der Freundin.",
  );
});

// Infrastructure check only: "test1".."test8" are placeholders, NOT real
// Turkish/Kurdish content.
const placeholders = (extra: Record<string, unknown> = {}, root: Record<string, unknown> = {}) =>
  JSON.stringify({
    title: "placeholder",
    level: "A1",
    ...root,
    cards: Array.from({ length: 8 }, (_, i) => ({
      term: `test${i + 1}`,
      pos: "noun",
      gloss: `gloss${i + 1}`,
      ...extra,
    })),
  });

test("non-German term language (e.g. ku/tr from the picker) imports without a pair field", () => {
  const r = parseKartaJson(placeholders(), NON_DE);
  assert.ok(r.ok);
  assert.equal(r.value.cards.length, 8);
  assert.ok(r.value.cards.every((c) => c.enrichment === null));
  assert.deepEqual(r.value.warnings, []);
  assert.ok(!("pair" in r.value));
});

test("legacy pair field is tolerated and ignored", () => {
  assert.ok(parseKartaJson(placeholders({}, { pair: "tr-ku" }), NON_DE).ok);
  assert.ok(parseKartaJson(placeholders({}, { pair: "whatever" }), NON_DE).ok);
});

test("non-German term language rejects German-only grammar fields", () => {
  assert.ok(!parseKartaJson(placeholders({ gender: "der" }), NON_DE).ok);
  assert.ok(
    !parseKartaJson(placeholders({ examples: { nom: null, akk: "x", dat: null } }), NON_DE).ok,
  );
});

test("non-German term language accepts the simplified singular \"example\" field", () => {
  const r = parseKartaJson(placeholders({ example: "  Ez kawa vedixwim.  " }), NON_DE);
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].example, "Ez kawa vedixwim.");
  assert.deepEqual(r.value.cards[0].examples, {
    nom: "Ez kawa vedixwim.",
    akk: null,
    dat: null,
  });
});

test("\"examples.nom\" wins when both \"example\" and \"examples\" are given", () => {
  const r = parseKartaJson(
    placeholders({ example: "singular", examples: { nom: "plural-nom", akk: null, dat: null } }),
    NON_DE,
  );
  assert.ok(r.ok);
  assert.equal(r.value.cards[0].example, "plural-nom");
});

test("sourceNote populates enrichment.sourceNote; non-string rejected", () => {
  const r = parseKartaJson(placeholders({ sourceNote: "  Zend dictionary  " }), NON_DE);
  assert.ok(r.ok);
  assert.deepEqual(r.value.cards[0].enrichment, { sourceNote: "Zend dictionary", source: "user" });
  const de = parseKartaJson(
    placeholders({ term: "Tisch", gender: "der", sourceNote: "Duden" }),
    DE,
  );
  assert.ok(de.ok);
  assert.deepEqual(de.value.cards[0].enrichment, {
    gender: "m",
    sourceNote: "Duden",
    source: "user",
  });
  assert.ok(!parseKartaJson(placeholders({ sourceNote: 3 }), NON_DE).ok);
});
