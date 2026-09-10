import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, cacheKeyFor } from "./example-suggestions.ts";

/**
 * Only the pure logic — cache-key computation and prompt building — is
 * tested here. The handler itself needs Firestore and a live/mocked Gemini
 * call, neither of which this project's `test:ts` runner wires up (same
 * reasoning `suggest-card.ts` and `generate-set.ts` have no handler test of
 * their own). What matters most about this feature IS the pure part: the
 * cache key is the entire mechanism that turns "one Gemini call, shared by
 * everyone" into reality against a 20-request/day quota, so it gets the
 * most scrutiny.
 */

function input(overrides: Partial<Parameters<typeof cacheKeyFor>[0]> = {}) {
  return {
    term: "Sohn",
    termLanguage: "German",
    definitionLanguage: "English",
    ...overrides,
  };
}

describe("cacheKeyFor — the cache key is the lemma, not the card or the set", () => {
  it("is deterministic for identical input", async () => {
    const a = await cacheKeyFor(input(), "de");
    const b = await cacheKeyFor(input(), "de");
    assert.equal(a, b);
  });

  it("does NOT vary with topic — the whole point of the cache", async () => {
    const noTopic = await cacheKeyFor(input(), "de");
    const withTopic = await cacheKeyFor(input({ topic: "Family" }), "de");
    const differentTopic = await cacheKeyFor(input({ topic: "Travel" }), "de");
    assert.equal(noTopic, withTopic);
    assert.equal(withTopic, differentTopic);
  });

  it("does NOT vary with existingTerms — same reasoning as topic", async () => {
    const bare = await cacheKeyFor(input(), "de");
    const withContext = await cacheKeyFor(
      input({ existingTerms: ["Vater", "Mutter", "Tochter"] }),
      "de",
    );
    assert.equal(bare, withContext);
  });

  it("varies with the term itself", async () => {
    const sohn = await cacheKeyFor(input({ term: "Sohn" }), "de");
    const vater = await cacheKeyFor(input({ term: "Vater" }), "de");
    assert.notEqual(sohn, vater);
  });

  it("varies with the definition language", async () => {
    const en = await cacheKeyFor(input({ definitionLanguage: "English" }), "de");
    const tr = await cacheKeyFor(input({ definitionLanguage: "Turkish" }), "de");
    assert.notEqual(en, tr);
  });

  it("is case- and whitespace-insensitive on the term", async () => {
    const a = await cacheKeyFor(input({ term: "Sohn" }), "de");
    const b = await cacheKeyFor(input({ term: "  sohn  " }), "de");
    const c = await cacheKeyFor(input({ term: "SOHN" }), "de");
    assert.equal(a, b);
    assert.equal(b, c);
  });
});

describe("cacheKeyFor — German article normalization (amendment 2)", () => {
  it('"der Sohn" and "Sohn" resolve to the same cache entry', async () => {
    const withArticle = await cacheKeyFor(input({ term: "der Sohn" }), "de");
    const bare = await cacheKeyFor(input({ term: "Sohn" }), "de");
    assert.equal(withArticle, bare);
  });

  it("works for all three articles", async () => {
    const bare = await cacheKeyFor(input({ term: "Tür" }), "de");
    assert.equal(await cacheKeyFor(input({ term: "die Tür" }), "de"), bare);

    const bareHaus = await cacheKeyFor(input({ term: "Haus" }), "de");
    assert.equal(await cacheKeyFor(input({ term: "das Haus" }), "de"), bareHaus);
  });

  it("is case-insensitive about the article too", async () => {
    const bare = await cacheKeyFor(input({ term: "Sohn" }), "de");
    assert.equal(await cacheKeyFor(input({ term: "DER Sohn" }), "de"), bare);
    assert.equal(await cacheKeyFor(input({ term: "Der Sohn" }), "de"), bare);
  });

  it("does not strip an article for a non-German language code", async () => {
    // "der" isn't an article word for any other profile, so a term that
    // happens to start with it in another language must not be mangled.
    const withWord = await cacheKeyFor(input({ term: "der Sohn", termLanguage: "English" }), "en");
    const withoutWord = await cacheKeyFor(input({ term: "Sohn", termLanguage: "English" }), "en");
    assert.notEqual(withWord, withoutWord);
  });

  it("does not falsely strip a real word starting with an article (Derby)", async () => {
    const derby = await cacheKeyFor(input({ term: "Derby" }), "de");
    const by = await cacheKeyFor(input({ term: "by" }), "de");
    assert.notEqual(derby, by);
  });
});

describe("buildPrompt — topic and context are prompt flavour only", () => {
  it("includes the topic when provided (amendment: topic passed into generation context)", () => {
    const prompt = buildPrompt(input({ topic: "Family" }));
    assert.match(prompt, /Family/);
  });

  it("omits any topic mention when none is provided — topic is never required", () => {
    const prompt = buildPrompt(input());
    assert.doesNotMatch(prompt, /topic/i);
  });

  it("ignores a blank/whitespace-only topic the same as no topic", () => {
    const prompt = buildPrompt(input({ topic: "   " }));
    assert.doesNotMatch(prompt, /topic/i);
  });

  it("includes existing set terms as context when provided", () => {
    const prompt = buildPrompt(input({ existingTerms: ["Vater", "Mutter"] }));
    assert.match(prompt, /Vater/);
    assert.match(prompt, /Mutter/);
  });

  it("always includes the term itself and asks for short, natural sentences", () => {
    const prompt = buildPrompt(input({ term: "Sohn" }));
    assert.match(prompt, /Sohn/);
    assert.match(prompt, /natural/i);
    assert.match(prompt, /short/i);
  });
});
