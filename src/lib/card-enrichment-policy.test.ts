import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveEnrichment,
  resolveEnrichmentOnOmit,
  sanitizeUserEnrichment,
} from "./card-enrichment-policy.ts";
import type { CardEnrichment } from "./types.ts";

/** A fixture dictionary — this module must never need the real 102k-record
 *  one to be exercised. Returns a fixed enrichment for "tisch" and nothing
 *  for anything else, so tests can tell "the dictionary was consulted" from
 *  "it wasn't" by which term they pass. */
const FIXTURE_ENRICHMENT: CardEnrichment = { gender: "m", plural: "Tische", source: "dict" };
function fixtureDict(term: string): CardEnrichment | null {
  return term.toLowerCase() === "tisch" ? FIXTURE_ENRICHMENT : null;
}

function context(isGermanTermLanguage: boolean) {
  return { isGermanTermLanguage, dictLookup: fixtureDict };
}

describe("sanitizeUserEnrichment", () => {
  it("accepts a well-formed user correction", () => {
    assert.deepEqual(sanitizeUserEnrichment({ source: "user", gender: "f", plural: "Türen" }), {
      source: "user",
      gender: "f",
      plural: "Türen",
    });
  });

  it("accepts a user correction with only one field set", () => {
    assert.deepEqual(sanitizeUserEnrichment({ source: "user", gender: "n" }), {
      source: "user",
      gender: "n",
    });
  });

  it("accepts an intentionally-empty user correction (both fields cleared)", () => {
    assert.deepEqual(sanitizeUserEnrichment({ source: "user" }), { source: "user" });
  });

  it("rejects anything not claiming source: user", () => {
    assert.equal(sanitizeUserEnrichment({ source: "dict", gender: "m" }), null);
    assert.equal(sanitizeUserEnrichment({ source: "ai", gender: "m" }), null);
    assert.equal(sanitizeUserEnrichment({}), null);
  });

  it("rejects malformed or hostile input rather than trusting it", () => {
    assert.equal(sanitizeUserEnrichment(null), null);
    assert.equal(sanitizeUserEnrichment(undefined), null);
    assert.equal(sanitizeUserEnrichment("user"), null);
    assert.equal(sanitizeUserEnrichment(42), null);
    assert.equal(sanitizeUserEnrichment([]), null);
  });

  it("drops an invalid gender rather than passing it through", () => {
    // A client cannot smuggle in a value this app doesn't recognize.
    const result = sanitizeUserEnrichment({ source: "user", gender: "x", plural: "Tische" });
    assert.deepEqual(result, { source: "user", plural: "Tische" });
  });

  it("drops a non-string or blank plural", () => {
    assert.deepEqual(sanitizeUserEnrichment({ source: "user", gender: "m", plural: "   " }), {
      source: "user",
      gender: "m",
    });
    assert.deepEqual(sanitizeUserEnrichment({ source: "user", gender: "m", plural: 42 }), {
      source: "user",
      gender: "m",
    });
  });

  it("ignores an inferred flag on a user correction — it isn't a guess anymore", () => {
    const result = sanitizeUserEnrichment({ source: "user", gender: "m", inferred: true });
    assert.equal(result?.inferred, undefined);
  });
});

describe("resolveEnrichment — create, or an edit that sent the field", () => {
  it("a user correction always wins, verbatim, even in a German set", () => {
    const correction = { source: "user" as const, gender: "f" as const };
    assert.deepEqual(resolveEnrichment("Tisch", correction, context(true)), correction);
  });

  it("a user correction wins even when it disagrees with the dictionary", () => {
    const correction = { source: "user" as const, gender: "f" as const, plural: "Tischen" };
    assert.deepEqual(resolveEnrichment("Tisch", correction, context(true)), correction);
  });

  it("fills from the dictionary when no override was sent and the set is German", () => {
    assert.deepEqual(resolveEnrichment("Tisch", undefined, context(true)), FIXTURE_ENRICHMENT);
  });

  it("is null for a non-German set, whatever the dictionary would say", () => {
    // The profile gate: this feature does not exist for other languages yet.
    assert.equal(resolveEnrichment("Tisch", undefined, context(false)), null);
  });

  it("a non-user incoming value is ignored, not trusted — the server recomputes", () => {
    // A client claiming source: "dict" must not be taken at face value; the
    // server is the one source of truth for a non-user-sourced value.
    const claimed = { source: "dict" as const, gender: "f" as const, plural: "made-up" };
    assert.deepEqual(resolveEnrichment("Tisch", claimed, context(true)), FIXTURE_ENRICHMENT);
  });

  it("is null when the dictionary has nothing for the term", () => {
    assert.equal(resolveEnrichment("xyzzyfoo", undefined, context(true)), null);
  });
});

describe("resolveEnrichmentOnOmit — an edit that omitted the field entirely", () => {
  it("preserves a prior user correction untouched", () => {
    const prior = { source: "user" as const, gender: "f" as const };
    assert.deepEqual(resolveEnrichmentOnOmit("Tisch", prior, context(true)), prior);
  });

  it("recomputes from the dictionary when the prior value wasn't a user correction", () => {
    // Self-healing: a dict-sourced value isn't frozen forever just because
    // the editor that saved it didn't resend the field this time.
    const prior = { source: "dict" as const, gender: "n" as const };
    assert.deepEqual(resolveEnrichmentOnOmit("Tisch", prior, context(true)), FIXTURE_ENRICHMENT);
  });

  it("recomputes when there was no prior enrichment at all", () => {
    assert.deepEqual(resolveEnrichmentOnOmit("Tisch", null, context(true)), FIXTURE_ENRICHMENT);
    assert.deepEqual(resolveEnrichmentOnOmit("Tisch", undefined, context(true)), FIXTURE_ENRICHMENT);
  });

  it("is null for a non-German set even with a prior dict value", () => {
    // Covers a set whose language changed away from German after the prior
    // value was recorded — the profile gate still applies on every save.
    const prior = { source: "dict" as const, gender: "n" as const };
    assert.equal(resolveEnrichmentOnOmit("Tisch", prior, context(false)), null);
  });

  it("still preserves a user correction even for a non-German set", () => {
    // The user's own word is never discarded just because the profile gate
    // would otherwise block a fresh dictionary fill.
    const prior = { source: "user" as const, gender: "f" as const };
    assert.deepEqual(resolveEnrichmentOnOmit("Tisch", prior, context(false)), prior);
  });
});
