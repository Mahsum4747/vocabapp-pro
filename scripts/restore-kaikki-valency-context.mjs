/** Offline context transfer. Never downloads data or enables diagnostics. */
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalize = (value) => value.trim().toLocaleLowerCase("de-DE");
const strings = (value) => Array.isArray(value) ? value.filter((s) => typeof s === "string") : [];
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const caseLabels = { akk: "(?:accusative|Akkusativ)", dat: "(?:dative|Dativ)", gen: "(?:genitive|Genitiv)" };

/** Explicit grammatical span only; ordinary gloss prose is not frame evidence. */
export function frameEvidence(gloss, row) {
  const nounCase = caseLabels[row.case];
  if (!nounCase) return null;
  const pattern = row.prep === null
    ? `\\bwith\\s+${nounCase}\\b`
    : `(?<![\\p{L}])${escape(row.prep)}\\s*(?:\\(\\s*)?\\+\\s*${nounCase}\\b`;
  const match = new RegExp(pattern, "iu").exec(gloss);
  return match ? { text: match[0], offset: match.index, kind: "explicit-gloss-grammar" } : null;
}

export function templateTriples(lemma, argument) {
  if (typeof argument !== "string") return [];
  const found = [];
  for (const m of argument.matchAll(/:([a-zäöüß]+)\((acc|dat|gen)\)/giu))
    found.push({ lemma, prep: normalize(m[1]), case: m[2].toLowerCase() === "acc" ? "akk" : m[2].toLowerCase(), text: m[0], offset: m.index });
  for (const m of argument.matchAll(/(?<![\w(:])(acc|dat|gen)(?=<|[;,| ]|$)/gu))
    found.push({ lemma, prep: null, case: m[1] === "acc" ? "akk" : m[1], text: m[0], offset: m.index });
  return found;
}

export function contextsFromEntry(entry, line, rawLine, rows, source) {
  if (entry.pos !== "verb" || (entry.lang_code && entry.lang_code !== "de")) return [];
  const word = typeof entry.word === "string" ? normalize(entry.word) : "";
  const result = [];
  for (const [senseIndex, sense] of (entry.senses ?? []).entries()) {
    const glosses = strings(sense.glosses);
    const rawGlosses = strings(sense.raw_glosses);
    const tags = strings(sense.tags);
    const entryTags = strings(entry.tags);
    const reflexive = word.startsWith("sich ") || tags.includes("reflexive");
    for (const [index, row] of rows.entries()) {
      const lemma = normalize(row.lemma);
      if (lemma !== word && !(lemma.startsWith("sich ") && lemma.slice(5) === word && reflexive)) continue;
      const evidences = [];
      for (const [sourceField, texts] of [["glosses", glosses], ["raw_glosses", rawGlosses]]) {
        for (const [glossIndex, gloss] of texts.entries()) {
          const evidence = frameEvidence(gloss, row);
          if (evidence) evidences.push({ ...evidence, sourceField, glossIndex });
        }
      }
      for (const [templateIndex, template] of (sense.info_templates ?? []).entries()) {
        if (template.name !== "+obj" || template.args?.["1"] !== "de") continue;
        for (const frame of templateTriples(row.lemma, template.args?.["2"])) {
          if (frame.prep === row.prep && frame.case === row.case)
            evidences.push({ kind: "structured-obj-template", sourceField: "info_templates",
              templateIndex, argument: "2", text: frame.text, offset: frame.offset });
        }
      }
      for (const evidence of evidences) {
        result.push({ index, context: {
          source: { ...source, line, recordSha256: hash(rawLine), word: entry.word,
            entryId: typeof entry.id === "string" ? entry.id : null },
          // Preserve upstream identifier/label variants without guessing their schema.
          senseMetadata: Object.fromEntries(Object.entries(sense).filter(([key]) =>
            !["glosses", "raw_glosses", "tags", "raw_tags", "examples"].includes(key))),
          senseIndex, senseId: typeof sense.id === "string" ? sense.id : null,
          glosses, rawGlosses, tags, rawTags: strings(sense.raw_tags), entryTags,
          examples: Array.isArray(sense.examples) ? sense.examples : [],
          requiredReflexive: reflexive ? true : null,
          evidence,
          // Context association is not independent linguistic validation.
          diagnosticEligible: false,
        } });
      }
    }
  }
  return result;
}

async function main() {
  const [rawPath, legacyPath, manifestPath, outputPath] = process.argv.slice(2);
  if (!outputPath) throw Error("usage: node scripts/restore-kaikki-valency-context.mjs RAW.jsonl LEGACY.json SOURCE-MANIFEST.json NEW-OUTPUT.json");
  const legacyText = await readFile(legacyPath, "utf8");
  const legacy = JSON.parse(legacyText);
  const source = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const field of ["url", "retrieved", "license", "snapshotSha256"])
    if (typeof source[field] !== "string" || !source[field].trim()) throw Error(`Missing source manifest field: ${field}`);
  if (!/^[a-f0-9]{64}$/.test(source.snapshotSha256)) throw Error("Invalid source snapshot SHA256");
  const frames = legacy.frames.map((row) => ({ ...row, context: [] }));
  const byWord = new Map();
  for (const [index, row] of frames.entries()) {
    const word = normalize(row.lemma).replace(/^sich\s+/, "");
    if (!byWord.has(word)) byWord.set(word, []);
    byWord.get(word).push({ index, row });
  }
  const streamHash = createHash("sha256");
  // Hash the exact input bytes, not reserialized entries or gloss strings.
  for await (const chunk of createReadStream(rawPath)) streamHash.update(chunk);
  if (streamHash.digest("hex") !== source.snapshotSha256) throw Error("Source snapshot hash mismatch");
  let line = 0;
  for await (const rawLine of createInterface({ input: createReadStream(rawPath), crlfDelay: Infinity })) {
    line++;
    if (!rawLine.trim()) continue;
    const entry = JSON.parse(rawLine);
    const candidates = typeof entry.word === "string"
      ? byWord.get(normalize(entry.word).replace(/^sich\s+/, "")) ?? [] : [];
    for (const match of contextsFromEntry(entry, line, rawLine, candidates.map((candidate) => candidate.row), source))
      frames[candidates[match.index].index].context.push(match.context);
  }
  const completed = frames.filter((row) => row.context.length).length;
  const output = { ...legacy, contextTransfer: { version: 1, legacySha256: hash(legacyText), source,
    completed, pending: frames.length - completed,
    note: "Explicit gloss association only; not diagnostic approval. Missing/ambiguous matches remain pending." }, frames };
  // Never overwrite the legacy source or an earlier output.
  await writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({ completed, pending: frames.length - completed, diagnosticPromotions: 0 }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
