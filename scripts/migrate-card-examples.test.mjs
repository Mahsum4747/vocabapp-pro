import { test } from "node:test";
import assert from "node:assert/strict";
import { migrateCard, splitLegacyDefinition } from "./migrate-card-examples.mjs";

test("splits the AI's two-line meaning + quoted example format", () => {
  assert.deepEqual(splitLegacyDefinition('to give back\n"Kannst du mir das Buch zurückgeben?"'), {
    definition: "to give back",
    example: "Kannst du mir das Buch zurückgeben?",
  });
});

test("handles typographic quotes", () => {
  assert.deepEqual(splitLegacyDefinition("geri vermek\n“Bana kitabı geri verir misin?”"), {
    definition: "geri vermek",
    example: "Bana kitabı geri verir misin?",
  });
});

test("keeps multi-line meanings intact, taking only the quoted last line", () => {
  assert.deepEqual(splitLegacyDefinition('to give back\nto return something\n"Gib es zurück!"'), {
    definition: "to give back\nto return something",
    example: "Gib es zurück!",
  });
});

test("leaves a definition with no example alone", () => {
  assert.equal(splitLegacyDefinition("to give back"), null);
  assert.equal(splitLegacyDefinition("to give back\nto return something"), null);
});

test("never empties the definition — a lone quoted line is not migrated", () => {
  assert.equal(splitLegacyDefinition('"Gib es zurück!"'), null);
  assert.equal(splitLegacyDefinition('\n"Gib es zurück!"'), null);
});

test("ignores empty quotes", () => {
  assert.equal(splitLegacyDefinition('to give back\n""'), null);
});

test("migrateCard skips cards that already have an example", () => {
  const card = {
    term: "zurückgeben",
    definition: 'to give back\n"Gib es zurück!"',
    example: "Bitte zurückgeben.",
  };
  assert.equal(migrateCard(card), null);
});

test("migrateCard fills a blank example and preserves the rest of the card", () => {
  const card = {
    id: "abc",
    term: "zurückgeben",
    definition: 'to give back\n"Gib es zurück!"',
    example: "",
    starred: true,
    mastery: 3,
    imageUrl: null,
  };
  assert.deepEqual(migrateCard(card), {
    id: "abc",
    term: "zurückgeben",
    definition: "to give back",
    example: "Gib es zurück!",
    starred: true,
    mastery: 3,
    imageUrl: null,
  });
});
