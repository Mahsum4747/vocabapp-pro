import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Source-scan regression tests for the example-suggestion panel's core
 * promise: the AI call never fires on its own. There is no component-render
 * harness in this repo (`no browser testing`), and the property these
 * guard — "the Gemini call only happens from an explicit click, never from
 * typing, a term change, or an effect" — is a property of the SOURCE's
 * wiring, not of any one render's output. Same technique as
 * mc-article-safety.test.ts, for the same reason: cheap, and it fails
 * loudly if a future edit reintroduces an automatic call as a side effect
 * of something unrelated.
 *
 * Extended to cover the bundled-first flow (checkBundledSuggestions /
 * openExamplePanel / the Definition tap-to-fill chips): the FREE bundled
 * lookup is allowed to run on Term-field blur (no quota to protect), but
 * the AI call must still only ever be reachable from an explicit click —
 * "bundled first, AI only on request" is the property these additions
 * guard, plus the separate, explicitly-required invariant that a bundled
 * result never rewrites the user's own Term casing or touches `example`.
 */

const SOURCE_PATH = "src/components/card-editor.tsx";

function readSource(): string {
  return readFileSync(new URL(`../../${SOURCE_PATH}`, import.meta.url), "utf8");
}

describe("no automatic generation — the component cannot auto-fetch even by accident", () => {
  it("never imports/uses useEffect at all", () => {
    // The strongest possible guarantee: there is no lifecycle hook in this
    // file that COULD fire a request on mount, on a prop change, or on the
    // term changing. Any future "auto-suggest on term change" would have to
    // introduce useEffect first, which this test would catch immediately.
    const source = readSource();
    assert.doesNotMatch(source, /useEffect/);
  });

  it("the Term field's onChange never triggers the AI call — a free autocomplete lookup is fine, Gemini is not", () => {
    const source = readSource();
    const start = source.indexOf(`onChange={(e) => {\n                    update(card.id, { term: e.target.value });`);
    assert.notEqual(start, -1, "expected to find the term input's onChange handler");
    const body = source.slice(start, source.indexOf("}}", start));
    // scheduleTermSuggestions is a debounced, zero-AI-call prefix lookup —
    // allowed here on the same "no quota to protect" grounds
    // checkBundledSuggestions is already allowed to run on blur. Only the
    // paid Gemini path must never be reachable from typing.
    assert.doesNotMatch(body, /fetchExampleSuggestions|suggestExampleSentences/);
    assert.match(body, /scheduleTermSuggestions\(card\.id, e\.target\.value\)/);
  });

  it("fetchExampleSuggestions (the AI call) is only ever reachable from explicit click handlers", () => {
    const source = readSource();
    const callSites = [...source.matchAll(/fetchExampleSuggestions\(/g)];
    // 1 definition + 3 explicit onClick call sites: the Retry button, the
    // "Generate with AI" action shown alongside bundled results, and the
    // one shown alone when nothing is bundled. `toggleExampleSuggestions`
    // (the panel's open/close toggle) no longer calls this directly — it
    // goes through `openExamplePanel`'s bundled-first check instead. None
    // of the four is typing- or term-change-triggered.
    assert.equal(callSites.length, 4, "unexpected number of fetchExampleSuggestions references");
  });

  it("suggestExampleSentences (the server call) is invoked from exactly one place", () => {
    const source = readSource();
    const callSites = [...source.matchAll(/suggestExampleSentences\(\{/g)];
    assert.equal(callSites.length, 1, "the AI call must have exactly one call site: inside fetchExampleSuggestions");
  });

  it("lookupBundledSuggestions (the free, bundled call) is invoked from exactly one place", () => {
    const source = readSource();
    const callSites = [...source.matchAll(/lookupBundledSuggestions\(\{/g)];
    assert.equal(callSites.length, 1, "expected exactly one call site: inside checkBundledSuggestions");
  });

  it("checkBundledSuggestions is gated on hasBundledSuggestions before it does anything else", () => {
    const source = readSource();
    const start = source.indexOf("async function checkBundledSuggestions");
    const body = source.slice(start, start + 200);
    assert.match(body, /if \(!profile\.hasBundledSuggestions\) return null;/);
  });

  it("the Term field's blur checks both the dictionary and the bundled dataset, nothing else", () => {
    const source = readSource();
    const idx = source.indexOf("onBlur={() => {");
    const block = source.slice(idx, idx + 200);
    assert.match(block, /void checkGermanEnrichment\(card\.id\)/);
    assert.match(block, /void checkBundledSuggestions\(card\.id\)/);
  });
});

describe("explicit click triggers generation", () => {
  it('the "Suggest example" button calls toggleExampleSuggestions on click', () => {
    const source = readSource();
    // "Suggest example" appears twice: once in a doc comment (before the
    // JSX in file order), once as the button's visible label. Anchor on
    // the onClick handler itself and confirm the button text sits right
    // next to it, rather than trusting the first text match in the file.
    const onClickIdx = source.indexOf("onClick={() => toggleExampleSuggestions(card.id)}");
    assert.notEqual(onClickIdx, -1, "expected to find the button's onClick handler");
    const nearby = source.slice(onClickIdx, onClickIdx + 200);
    assert.match(nearby, /Suggest example/);
  });

  it("toggleExampleSuggestions checks the bundled dataset FIRST when opening fresh, not the AI call directly", () => {
    const source = readSource();
    const start = source.indexOf("function toggleExampleSuggestions");
    const body = source.slice(start, start + 700);
    assert.match(body, /void openExamplePanel\(id, term\)/);
    assert.doesNotMatch(body, /void fetchExampleSuggestions/);
  });

  it("openExamplePanel decides bundled-vs-AI-only from the lookup result, never fetches AI itself", () => {
    const source = readSource();
    const start = source.indexOf("async function openExamplePanel");
    const end = source.indexOf("\n  async function fetchExampleSuggestions");
    assert.ok(start !== -1 && end !== -1 && end > start);
    const body = source.slice(start, end);
    assert.doesNotMatch(body, /fetchExampleSuggestions/);
    assert.match(body, /status: "bundled"/);
    assert.match(body, /status: "ai-only"/);
  });
});

describe("bundled-first: no automatic AI call, ever, when nothing is bundled", () => {
  it('the "ai-only" panel branch renders the Generate action, not the bundled examples list', () => {
    const source = readSource();
    const idx = source.indexOf('status === "ai-only" ? (');
    assert.notEqual(idx, -1, 'expected an "ai-only" branch in the panel JSX');
    const branch = source.slice(idx, source.indexOf(") : (", idx));
    assert.match(branch, /Generate with AI/);
    assert.doesNotMatch(branch, /\.examples\.map/);
  });

  it('a "Generate with AI" label is actually rendered in exactly two JSX positions', () => {
    const source = readSource();
    // Matches only the rendered text nodes (indented on their own line,
    // right after a <Sparkles /> icon) — not the several doc-comment
    // mentions of the same phrase elsewhere in the file.
    const rendered = [...source.matchAll(/<Sparkles className="size-3\.5" \/>\s*\n\s*Generate with AI/g)];
    // One shown alongside bundled results, one shown alone when there are
    // none. Both sit next to an explicit onClick — checked by the
    // fetchExampleSuggestions call-site count test above.
    assert.equal(rendered.length, 2);
  });
});

describe("bundled Definition chips never touch `term` or `example`", () => {
  it("pickTranslationChip only ever writes definition/definition2, never term or example", () => {
    const source = readSource();
    const start = source.indexOf("function pickTranslationChip");
    const end = source.indexOf("\n  return (", start);
    assert.ok(start !== -1 && end !== -1);
    const body = source.slice(start, end);
    assert.doesNotMatch(body, /\bterm:/);
    assert.doesNotMatch(body, /\bexample:/);
    assert.match(body, /definition: word/);
    assert.match(body, /definition2: word/);
  });

  it("`term` is written from exactly two places: the Term field's own onChange, and picking an autocomplete suggestion", () => {
    const source = readSource();
    const writes = [...source.matchAll(/update\([^,]+,\s*\{[^}]*\bterm:/g)];
    assert.equal(
      writes.length,
      2,
      "expected exactly two `term:` writers — the Term field's onChange, and pickTermSuggestion",
    );
  });

  it("chipWordsFor never echoes the query back — it only ever reads translations off a BundledEntry", () => {
    const source = readSource();
    const start = source.indexOf("function chipWordsFor");
    const body = source.slice(start, start + 400);
    assert.doesNotMatch(body, /card\.term/, "chip words must come from the dictionary entry, not the typed term");
  });
});

describe("existing example is never overwritten automatically", () => {
  it("every write to `example` outside the pre-existing AI-suggest flow happens only in pickExampleSuggestion", () => {
    const source = readSource();
    const writes = [...source.matchAll(/update\([^,]+,\s*\{[^}]*\bexample:/g)].map((m) => m[0]);
    // Expected writers of `example`:
    //  1. the Example field's own onChange (the user typing directly)
    //  2. suggest()'s direct-apply branch (existing AI-suggest, unfilled case)
    //  3. confirmReplace() (existing AI-suggest, confirmed-overwrite case)
    //  4. pickExampleSuggestion (this feature's only writer)
    // None of these is triggered by typing the term or by a term change.
    assert.equal(writes.length, 4, `unexpected number of \`example\` writers: ${writes.length}`);
  });

  it("fetchExampleSuggestions itself never calls update() — only sets local panel state", () => {
    const source = readSource();
    const start = source.indexOf("async function fetchExampleSuggestions");
    const end = source.indexOf("\n  function toggleExampleSuggestions");
    assert.ok(start !== -1 && end !== -1 && end > start);
    const body = source.slice(start, end);
    assert.doesNotMatch(body, /\bupdate\(/);
  });
});

describe("generation failure does not destroy existing input", () => {
  it("the catch block only sets panel error state, never touches `update(`", () => {
    const source = readSource();
    const start = source.indexOf("async function fetchExampleSuggestions");
    const catchStart = source.indexOf("} catch {", start);
    const catchEnd = source.indexOf("\n  }", catchStart);
    assert.ok(catchStart !== -1 && catchEnd !== -1);
    const catchBody = source.slice(catchStart, catchEnd);
    assert.doesNotMatch(catchBody, /\bupdate\(/);
    assert.match(catchBody, /status: "error"/);
  });

  it("the ok:false branch also only sets panel error state, never `update(`", () => {
    const source = readSource();
    const start = source.indexOf("async function fetchExampleSuggestions");
    const okFalseIdx = source.indexOf("if (!result.ok)", start);
    assert.notEqual(okFalseIdx, -1);
    const block = source.slice(okFalseIdx, okFalseIdx + 300);
    assert.doesNotMatch(block, /\bupdate\(/);
    assert.match(block, /status: "error"/);
  });
});

describe("stale-closure hardening: handlers read cardsRef, never a captured `cards` binding", () => {
  // Real bug: a mouse click moving focus away from the Term field right
  // after typing can dispatch `blur` before React has committed the render
  // from the last keystroke. A handler that closes over `cards` directly
  // is then stale — `checkGermanEnrichment`/`checkBundledSuggestions` see
  // the PRE-typing term and silently no-op, even though the input's own
  // live value already shows what was typed. `cardsRef.current` is mutated
  // synchronously every render, before any event dispatched in reaction to
  // that render can run, so it can't go stale the same way.
  it("no handler reads `cards.` directly — only the JSX render's own cards.map", () => {
    const source = readSource();
    const matches = [...source.matchAll(/\bcards\.(?!map\()/g)];
    assert.equal(
      matches.length,
      0,
      "found a direct `cards.` read outside cards.map — should read cardsRef.current instead",
    );
  });

  it("cardsRef is declared and kept in sync every render", () => {
    const source = readSource();
    assert.match(source, /const cardsRef = useRef\(cards\);/);
    assert.match(source, /cardsRef\.current = cards;/);
  });

  it("update(), the single write path, reads cardsRef.current as its base", () => {
    const source = readSource();
    const start = source.indexOf("function update(id");
    const body = source.slice(start, start + 200);
    assert.match(body, /cardsRef\.current\.map/);
  });

  it("every id-lookup helper (checkGermanEnrichment, checkBundledSuggestions, suggest, toggleExampleSuggestions, pickTranslationChip, setEnrichmentField, insertDiacritic) reads cardsRef.current", () => {
    const source = readSource();
    const finds = [...source.matchAll(/cardsRef\.current\.find\(/g)];
    // suggest, checkBundledSuggestions, toggleExampleSuggestions,
    // pickTranslationChip, checkGermanEnrichment, setEnrichmentField,
    // insertDiacritic.
    assert.equal(finds.length, 7, `expected 7 cardsRef.current.find(...) call sites, found ${finds.length}`);
  });

  it("picking a Term autocomplete suggestion fires on mousedown, not click, so it runs before the input's blur", () => {
    const source = readSource();
    // The same race this whole describe block guards against, from a new
    // angle: a <button> click moves focus (and so fires blur on the Term
    // input) BEFORE the button's own onClick runs. If picking a suggestion
    // wrote the term from onClick, checkGermanEnrichment/
    // checkBundledSuggestions would already have fired on blur against the
    // stale, pre-selection term. onMouseDown fires first, so cardsRef.current
    // is updated in time for blur's handlers to see the picked word.
    const idx = source.indexOf("onMouseDown={() => pickTermSuggestion(card.id, word)}");
    assert.notEqual(idx, -1, "expected the suggestion button to use onMouseDown");
    assert.doesNotMatch(
      source,
      /onClick=\{\(\) => pickTermSuggestion/,
      "must not also (or instead) fire from onClick — that runs after blur",
    );
  });
});
