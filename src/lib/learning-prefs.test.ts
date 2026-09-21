import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_LEARNING_PREFS,
  pickExplanation,
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
