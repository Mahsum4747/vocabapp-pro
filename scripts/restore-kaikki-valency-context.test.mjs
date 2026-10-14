import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { contextsFromEntry, frameEvidence } from "./restore-kaikki-valency-context.mjs";

const source = { url: "https://kaikki.org/source.jsonl", retrieved: "2026-09-24", license: "fixture-only", snapshotSha256: "a".repeat(64) };
const row = { lemma: "erinnern", prep: "an", case: "akk" };

test("preserves per-sense glosses, examples, labels, upstream IDs and reflexive scope", () => {
  const entry = { word: "erinnern", pos: "verb", lang_code: "de", id: "entry-1", senses: [
    { id: "sense-1", senseid: ["fixture-sense-id"], glosses: ["with an + accusative"], raw_glosses: ["raw"], tags: ["reflexive"], raw_tags: ["label"], examples: [{ text: "fixture example", ref: "fixture reference" }] },
    { id: "sense-2", glosses: ["different meaning without government"], tags: [] },
  ] };
  const matches = contextsFromEntry(entry, 3, JSON.stringify(entry), [row], source);
  assert.equal(matches.length, 1);
  const context = matches[0].context;
  assert.equal(context.senseId, "sense-1");
  assert.deepEqual(context.senseMetadata.senseid, ["fixture-sense-id"]);
  assert.equal(context.source.entryId, "entry-1");
  assert.equal(context.source.line, 3);
  assert.deepEqual(context.examples, entry.senses[0].examples);
  assert.deepEqual(context.rawTags, ["label"]);
  assert.equal(context.requiredReflexive, true);
  assert.equal(context.diagnosticEligible, false);
});

test("plain gloss presence, wrong case and substring prepositions do not establish a frame", () => {
  assert.equal(frameEvidence("think about a person", row), null);
  assert.equal(frameEvidence("an + dative", row), null);
  assert.equal(frameEvidence("Roman + accusative", row), null);
  assert.equal(frameEvidence("an + accusative", row)?.text, "an + accusative");
  assert.equal(frameEvidence("with genitive", { lemma: "gedenken", prep: null, case: "gen" })?.text, "with genitive");
});

test("does not borrow evidence across senses or generalize reflexivity from a sibling sense", () => {
  const entry = { word: "erinnern", pos: "verb", senses: [
    { glosses: ["an + accusative"] },
    { glosses: ["a reflexive meaning"], tags: ["reflexive"] },
  ] };
  assert.equal(contextsFromEntry(entry, 1, "raw", [{ ...row, lemma: "sich erinnern" }], source).length, 0);
  assert.equal(contextsFromEntry({ ...entry, pos: "noun" }, 1, "raw", [row], source).length, 0);
});

test("CLI seals source snapshot, retains pending rows and refuses overwrites", async () => {
  const dir = await mkdtemp(join(tmpdir(), "karta-context-test-"));
  try {
    const raw = JSON.stringify({ word: "erinnern", pos: "verb", lang_code: "de", senses: [{ glosses: ["an (+ accusative)"], tags: ["reflexive"] }] }) + "\n";
    const rawPath = join(dir, "raw.jsonl"), legacyPath = join(dir, "legacy.json"), manifestPath = join(dir, "manifest.json"), outputPath = join(dir, "output.json");
    await writeFile(rawPath, raw);
    await writeFile(legacyPath, JSON.stringify({ frames: [row, { lemma: "fehlen", prep: null, case: "dat" }] }));
    await writeFile(manifestPath, JSON.stringify({ ...source, snapshotSha256: createHash("sha256").update(raw).digest("hex") }));
    const args = ["scripts/restore-kaikki-valency-context.mjs", rawPath, legacyPath, manifestPath, outputPath];
    const result = JSON.parse(execFileSync(process.execPath, args, { encoding: "utf8" }));
    assert.deepEqual(result, { completed: 1, pending: 1, diagnosticPromotions: 0 });
    const output = JSON.parse(await readFile(outputPath, "utf8"));
    assert.equal(output.frames[0].context[0].senseId, null);
    assert.deepEqual(output.frames[1].context, []);
    assert.throws(() => execFileSync(process.execPath, args, { stdio: "pipe" }), /Command failed/);
    await writeFile(manifestPath, JSON.stringify(source));
    assert.throws(() => execFileSync(process.execPath, [...args.slice(0, -1), join(dir, "bad.json")], { stdio: "pipe" }), /Command failed/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});


test("entry-wide reflexive tag is preserved but cannot impose reflexivity on every sense", () => {
  const entry = { word: "erinnern", pos: "verb", tags: ["reflexive"], senses: [{ glosses: ["an + accusative"] }] };
  const contexts = contextsFromEntry(entry, 1, "raw", [row], source);
  assert.equal(contexts[0].context.requiredReflexive, null);
  assert.deepEqual(contexts[0].context.entryTags, ["reflexive"]);
  assert.equal(contextsFromEntry(entry, 1, "raw", [{ ...row, lemma: "sich erinnern" }], source).length, 0);
});
