import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_LEARNING_PREFS,
  pickExplanation,
  prioritizeByDirection,
  readLearningPrefs,
  shouldPromptForPrefs,
} from "./learning-prefs.ts";

describe("readLearningPrefs", () => {
  it("defaults to en / learn_de for a user with nothing stored", () => {
    assert.deepEqual(readLearningPrefs(undefined), DEFAULT_LEARNING_PREFS);
    assert.deepEqual(readLearningPrefs({}), { explanationLanguage: "en", direction: "learn_de" });
  });
  it("reads valid values and ignores junk field by field", () => {
    assert.deepEqual(readLearningPrefs({ explanationLanguage: "ku", direction: "learn_tr" }), {
      explanationLanguage: "ku",
      direction: "learn_tr",
    });
    assert.deepEqual(readLearningPrefs({ explanationLanguage: "fr", direction: "learn_tr" }), {
      explanationLanguage: "en",
      direction: "learn_tr",
    });
  });
});

describe("pickExplanation", () => {
  it("uses the chosen language when present", () => {
    assert.equal(pickExplanation({ en: "Hello", tr: "Merhaba" }, "tr"), "Merhaba");
  });
  it("falls back to English for a missing or blank KU string — never blank", () => {
    assert.equal(pickExplanation({ en: "Hello", tr: "Merhaba" }, "ku"), "Hello");
    assert.equal(pickExplanation({ en: "Hello", ku: "  " }, "ku"), "Hello");
  });
});

describe("shouldPromptForPrefs", () => {
  it("prompts once after a first session, never before, never again", () => {
    assert.equal(shouldPromptForPrefs({ totalReviews: 0, prefsPrompted: false }), false);
    assert.equal(shouldPromptForPrefs({ totalReviews: 5, prefsPrompted: false }), true);
    assert.equal(shouldPromptForPrefs({ totalReviews: 50, prefsPrompted: true }), false);
  });
});

describe("prioritizeByDirection", () => {
  const sets = [
    { id: "a", term: "de", definition: "en" },
    { id: "b", term: "tr", definition: "ku" },
    { id: "c", term: null, definition: null },
    { id: "d", term: "de", definition: "tr" },
  ];
  const ids = (d: Parameters<typeof prioritizeByDirection>[1]) =>
    prioritizeByDirection(sets, d, (s) => s).map((s) => s.id);

  it("lists matching sets first, stable, hiding nothing", () => {
    assert.deepEqual(ids("learn_de"), ["a", "d", "b", "c"]);
    assert.deepEqual(ids("learn_tr"), ["b", "a", "c", "d"]);
    assert.deepEqual(ids("learn_ku"), ["a", "b", "c", "d"]);
    assert.deepEqual(ids("learn_ku_from_tr"), ["b", "a", "c", "d"]);
  });

  it("persists the new TR/KU directions through readLearningPrefs", () => {
    assert.equal(readLearningPrefs({ direction: "learn_ku_from_tr" }).direction, "learn_ku_from_tr");
    assert.equal(readLearningPrefs({ direction: "learn_tr_from_ku" }).direction, "learn_tr_from_ku");
  });
});
