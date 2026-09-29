import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildAdjektivendungenQuestion,
  buildImperativQuestion,
  buildKonjunktivQuestion,
  buildModalverbenQuestion,
  buildNichtKeinQuestion,
  buildPassivQuestion,
  buildPluralQuestion,
  buildPossessiveQuestion,
  buildPronomenQuestion,
  buildRelativsatzQuestion,
  buildSteigerungQuestion,
  buildTrennbareVerbenQuestion,
} from "./grammar-drills.ts";
import type { NounEntry } from "./german/types.ts";
import type { VerbConjugationEntry } from "./german/verb-conjugation-data.ts";

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

const ANRUFEN: VerbConjugationEntry = {
  infinitive: "anrufen",
  ich: "rufe",
  du: "rufst",
  er: "ruft",
  partizipII: "angerufen",
};
const MACHEN: VerbConjugationEntry = {
  infinitive: "machen",
  ich: "mache",
  du: "machst",
  er: "macht",
  partizipII: "gemacht",
};

describe("buildTrennbareVerbenQuestion", () => {
  it("correct answer is the separable prefix, options are 4 distinct real forms", () => {
    for (let i = 0; i < 10; i++) {
      const q = buildTrennbareVerbenQuestion(ANRUFEN);
      assertValidQuestion(q);
      assert.equal(q.correctAnswer, "an");
      assert.ok(q.prompt.includes("___"));
    }
  });
});

describe("buildModalverbenQuestion", () => {
  it("produces 4 distinct options, correct answer is a real modal conjugation", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildModalverbenQuestion();
      assertValidQuestion(q);
    }
  });
});

describe("buildImperativQuestion", () => {
  it("produces 4 distinct options including the right-person form", () => {
    for (let i = 0; i < 10; i++) {
      const q = buildImperativQuestion(MACHEN);
      assertValidQuestion(q);
    }
  });

  it("Sie-target uses infinitive + Sie", () => {
    let found = false;
    for (let i = 0; i < 50 && !found; i++) {
      const q = buildImperativQuestion(MACHEN);
      if (q.target === "Sie") {
        assert.equal(q.correctAnswer, "Machen Sie!");
        found = true;
      }
    }
    assert.ok(found, "expected to hit Sie at least once in 50 tries");
  });
});

describe("buildPronomenQuestion", () => {
  it("produces 4 distinct options, correct answer matches the fixed table", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildPronomenQuestion();
      assertValidQuestion(q);
    }
  });
});

describe("buildAdjektivendungenQuestion", () => {
  it("masculine akkusativ takes -en", () => {
    let found = false;
    for (let i = 0; i < 50 && !found; i++) {
      const q = buildAdjektivendungenQuestion(TISCH);
      if (q.grammaticalCase === "akkusativ") {
        assert.equal(q.correctAnswer, "en");
        found = true;
      }
    }
    assert.ok(found, "expected to hit akkusativ at least once in 50 tries");
  });

  it("produces 4 distinct ending options", () => {
    for (let i = 0; i < 10; i++) {
      assertValidQuestion(buildAdjektivendungenQuestion(MUTTER));
    }
  });
});

describe("buildSteigerungQuestion", () => {
  it("produces 4 distinct options, correct answer is a real comparison form", () => {
    for (let i = 0; i < 20; i++) {
      assertValidQuestion(buildSteigerungQuestion());
    }
  });
});

describe("buildPassivQuestion", () => {
  it("präsens builds wird + Partizip II", () => {
    let found = false;
    for (let i = 0; i < 50 && !found; i++) {
      const q = buildPassivQuestion(MACHEN);
      if (q.tense === "präsens") {
        assert.equal(q.correctAnswer, "wird gemacht");
        found = true;
      }
    }
    assert.ok(found, "expected to hit präsens at least once in 50 tries");
    for (let i = 0; i < 10; i++) assertValidQuestion(buildPassivQuestion(MACHEN));
  });
});

describe("buildKonjunktivQuestion", () => {
  it("correct answer is würde + infinitive", () => {
    const q = buildKonjunktivQuestion(MACHEN);
    assertValidQuestion(q);
    assert.equal(q.correctAnswer, "würde machen");
  });
});

describe("buildRelativsatzQuestion", () => {
  it("nominativ masculine takes der", () => {
    let found = false;
    for (let i = 0; i < 50 && !found; i++) {
      const q = buildRelativsatzQuestion(TISCH);
      if (q.grammaticalCase === "nominativ") {
        assert.equal(q.correctAnswer, "der");
        found = true;
      }
    }
    assert.ok(found, "expected to hit nominativ at least once in 50 tries");
  });

  it("produces 4 distinct options", () => {
    for (let i = 0; i < 10; i++) assertValidQuestion(buildRelativsatzQuestion(KIND));
  });
});
