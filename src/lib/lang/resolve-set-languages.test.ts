import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveSetLanguages, type StudySet } from "../types.ts";

/** Only the fields the resolver reads — the rest of StudySet is irrelevant here. */
function set(fields: Partial<StudySet>): Parameters<typeof resolveSetLanguages>[0] {
  return fields as Parameters<typeof resolveSetLanguages>[0];
}

describe("resolveSetLanguages", () => {
  it("prefers a stored code over the free text", () => {
    const resolved = resolveSetLanguages(set({ termLanguage: "English", termLangCode: "de" }));
    assert.equal(resolved.term, "de");
  });

  it("falls back to normalizing the free text when no code is stored", () => {
    // The pre-existing-set case: written before codes existed.
    assert.equal(resolveSetLanguages(set({ termLanguage: "German" })).term, "de");
    assert.equal(resolveSetLanguages(set({ termLanguage: "Almanca" })).term, "de");
    assert.equal(resolveSetLanguages(set({ termLanguage: "Deutsch" })).term, "de");
    assert.equal(resolveSetLanguages(set({ termLanguage: "de-DE" })).term, "de");
  });

  it("resolves the second definition language the same way", () => {
    assert.equal(resolveSetLanguages(set({ definitionLanguage2: "Turkish" })).definition2, "tr");
    assert.equal(
      resolveSetLanguages(set({ definitionLanguage2: "English", defLang2Code: "tr" })).definition2,
      "tr",
    );
  });

  it("resolves the primary definition language from its code alone", () => {
    // It never had a free-text field, so there is nothing to fall back to.
    assert.equal(resolveSetLanguages(set({ defLangCode: "en" })).definition, "en");
    assert.equal(resolveSetLanguages(set({})).definition, null);
  });

  it("returns null for a set with no language information at all", () => {
    assert.deepEqual(resolveSetLanguages(set({})), {
      term: null,
      definition: null,
      definition2: null,
    });
  });

  it("returns null for free text it cannot place, rather than guessing", () => {
    const resolved = resolveSetLanguages(
      set({ termLanguage: "Klingon", definitionLanguage2: "Hebrew" }),
    );
    assert.equal(resolved.term, null);
    assert.equal(resolved.definition2, null);
  });

  it("ignores a stored code that isn't a real code", () => {
    // Firestore documents are untyped: a stale or hand-edited value must not
    // slip through as if it were canonical.
    const resolved = resolveSetLanguages(
      set({
        termLangCode: "de-DE" as never,
        termLanguage: "Turkish",
        defLangCode: "nonsense" as never,
      }),
    );
    assert.equal(resolved.term, "tr", "falls back to the free text");
    assert.equal(resolved.definition, null);
  });

  it("resolves all three independently", () => {
    const resolved = resolveSetLanguages(
      set({
        termLanguage: "German",
        defLangCode: "en",
        definitionLanguage2: "Kurmancî",
      }),
    );
    assert.deepEqual(resolved, { term: "de", definition: "en", definition2: "ku" });
  });
});
