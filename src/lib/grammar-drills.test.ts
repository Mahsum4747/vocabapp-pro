import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildNichtKeinQuestion,
  buildPluralQuestion,
  buildPossessiveQuestion,
} from "./grammar-drills.ts";
import type { NounEntry } from "./german/types.ts";

const TISCH: NounEntry = { lemma: "Tisch", genus: ["m"], plural: ["Tische"], pos: ["Substantiv"] };
const MUTTER: NounEntry = { lemma: "Mutter", genus: ["f"], plural: ["Mütter"], pos: ["Substantiv"] };
const KIND: NounEntry = { lemma: "Kind", genus: ["n"], plural: ["Kinder"], pos: ["Substantiv"] };

function assertValidQuestion(q: { options: string[]; correctAnswer: string }): void {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4, "options must be distinct");
  assert.ok(q.options.includes(q.correctAnswer));
}

describe("buildPluralQuestion", () => {
  it("produces 4 distinct options including the real plural", () => {
    for (const entry of [TISCH, MUTTER, KIND]) {
      const q = buildPluralQuestion(entry);
      assertValidQuestion(q);
      assert.equal(q.correctAnswer, entry.plural[0]);
    }
  });

  it("is deterministic given a fixed rng", () => {
    const rng = () => 0;
    const a = buildPluralQuestion(TISCH, rng);
    const b = buildPluralQuestion(TISCH, rng);
    assert.deepEqual(a.options.slice().sort(), b.options.slice().sort());
  });
});

describe("buildNichtKeinQuestion", () => {
  it("produces 4 distinct options, correct answer is nicht or a kein form", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildNichtKeinQuestion(TISCH);
      assertValidQuestion(q);
      assert.ok(q.correctAnswer === "nicht" || q.correctAnswer.startsWith("kein"));
      assert.ok(q.prompt.includes("___"));
    }
  });

  it("never puts nicht as a distractor equal to the correct answer twice", () => {
    const q = buildNichtKeinQuestion(MUTTER);
    assert.equal(q.options.filter((o) => o === q.correctAnswer).length, 1);
  });
});

describe("buildPossessiveQuestion", () => {
  it("produces 4 distinct real possessive-stem options", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildPossessiveQuestion(KIND);
      assertValidQuestion(q);
      assert.ok(q.prompt.includes(KIND.lemma));
    }
  });

  it("correct answer matches the fixed ending table for der (masculine, dativ)", () => {
    // ich + dativ + masculine noun -> mein + "em" = "meinem"
    let found = false;
    for (let i = 0; i < 200 && !found; i++) {
      const q = buildPossessiveQuestion(TISCH);
      if (q.person === "ich" && q.grammaticalCase === "dativ") {
        assert.equal(q.correctAnswer, "meinem");
        found = true;
      }
    }
    assert.ok(found, "expected to hit ich+dativ at least once in 200 tries");
  });
});
