import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Source-scan regression tests for the example-suggestion panel's core
 * promise: it never fires on its own. There is no component-render harness
 * in this repo (`no browser testing`), and the property these guard —
 * "the network call only happens from an explicit click, never from typing,
 * a term change, or an effect" — is a property of the SOURCE's wiring, not
 * of any one render's output. Same technique as mc-article-safety.test.ts,
 * for the same reason: cheap, and it fails loudly if a future edit
 * reintroduces an automatic call as a side effect of something unrelated.
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

  it("the Term field's onChange only updates the term, never triggers a fetch", () => {
    const source = readSource();
    const match = source.match(/onChange=\{\(e\) => update\(card\.id, \{ term: e\.target\.value \}\)\}/);
    assert.ok(match, "expected to find the term input's onChange handler");
    assert.doesNotMatch(match![0], /fetchExampleSuggestions|suggestExampleSentences/);
  });

  it("fetchExampleSuggestions is only ever called from two explicit click handlers", () => {
    const source = readSource();
    const callSites = [...source.matchAll(/fetchExampleSuggestions\(/g)];
    // 1 definition + 1 internal call from toggle (first open) + 1 from the
    // Retry button's onClick. Three total, none of them typing- or
    // term-change-triggered.
    assert.equal(callSites.length, 3, "unexpected number of fetchExampleSuggestions references");
  });

  it("suggestExampleSentences (the server call) is invoked from exactly one place", () => {
    const source = readSource();
    const callSites = [...source.matchAll(/suggestExampleSentences\(\{/g)];
    assert.equal(callSites.length, 1, "the AI call must have exactly one call site: inside fetchExampleSuggestions");
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

  it("toggleExampleSuggestions calls fetchExampleSuggestions when opening fresh", () => {
    const source = readSource();
    const start = source.indexOf("function toggleExampleSuggestions");
    const body = source.slice(start, start + 700);
    assert.match(body, /void fetchExampleSuggestions\(id, term\)/);
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
