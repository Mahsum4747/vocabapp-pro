/** Compare every canonical key to a separately versioned, real Kaikki snapshot. */
import { createReadStream, createWriteStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { contextsFromEntry, templateTriples } from "./restore-kaikki-valency-context.mjs";
const norm = (s) => s.trim().toLocaleLowerCase("de-DE");
const preps = "ab|an|auf|aus|außer|bei|bis|durch|entlang|für|gegen|gegenüber|hinter|in|mit|nach|neben|ohne|seit|über|um|unter|von|vor|zu|zwischen|wegen|trotz|während|innerhalb|außerhalb";
const cases = { accusative: "akk", akkusativ: "akk", dative: "dat", dativ: "dat", genitive: "gen", genitiv: "gen" };
export function candidateTriples(lemma, sense) {
  if (sense.form_of || sense.tags?.includes("form-of")) return [];
  const found = new Map();
  for (const gloss of [...(sense.glosses ?? []), ...(sense.raw_glosses ?? [])]) {
    const prepRE = new RegExp(`(?<![\\p{L}])(${preps})\\s*(?:\\(\\s*)?\\+\\s*(accusative|akkusativ|dative|dativ|genitive|genitiv)\\b`, "giu");
    for (const m of gloss.matchAll(prepRE)) {
      const row = { lemma, prep: norm(m[1]), case: cases[norm(m[2])] };
      found.set(`${row.prep}|${row.case}`, row);
    }
    for (const m of gloss.matchAll(/\bwith\s+(accusative|akkusativ|dative|dativ|genitive|genitiv)\b/giu)) {
      const row = { lemma, prep: null, case: cases[norm(m[1])] };
      found.set(`bare|${row.case}`, row);
    }
  }
  for (const template of sense.info_templates ?? []) {
    if (template.name !== "+obj" || template.args?.["1"] !== "de") continue;
    for (const frame of templateTriples(lemma, template.args?.["2"])) {
      const row = { lemma, prep: frame.prep, case: frame.case };
      found.set(`${row.prep ?? "bare"}|${row.case}`, row);
    }
  }
  return [...found.values()];
}
export async function extractCurrent(rawPath, source, keys, legacy, senseOutput) {
  const h = createHash("sha256");
  for await (const chunk of createReadStream(rawPath)) h.update(chunk);
  if (h.digest("hex") !== source.snapshotSha256) throw Error("Source snapshot hash mismatch");
  const wanted = new Set(keys.map(norm)), matched = new Set(), candidates = [];
  const meanings = new Map();
  const out = senseOutput ? createWriteStream(senseOutput, { flags: "wx" }) : null;
  let line = 0, lexicalSenses = 0;
  for await (const rawLine of createInterface({ input: createReadStream(rawPath), crlfDelay: Infinity })) {
    line++;
    if (!rawLine.trim()) continue;
    const entry = JSON.parse(rawLine), lemma = typeof entry.word === "string" ? norm(entry.word) : "";
    if (entry.pos !== "verb" || entry.lang_code !== "de" || !wanted.has(lemma)) continue;
    const valid = (entry.senses ?? []).filter(s => !s.form_of && !s.tags?.includes("form-of") && s.glosses?.length);
    if (!valid.length) continue;
    matched.add(lemma); lexicalSenses += valid.length;
    meanings.set(lemma, (meanings.get(lemma) ?? 0) + valid.length);
    if (out && !out.write(JSON.stringify({ lemma, line, recordSha256: createHash("sha256").update(rawLine).digest("hex"), sourceVersion: source.snapshotSha256, senses: valid }) + "\n"))
      await new Promise(resolve => out.once("drain", resolve));
    for (const [senseIndex, sense] of (entry.senses ?? []).entries()) {
      for (const row of candidateTriples(lemma, sense)) {
        // Keep the upstream sense index; never borrow tags/examples from siblings.
        const single = { ...entry, senses: [sense] };
        const contexts = contextsFromEntry(single, line, rawLine, [row], source).map(m => ({ ...m.context, senseIndex }));
        if (!contexts.length) continue;
        candidates.push({ ...row, construction: sense.tags?.includes("reflexive") ? `sich ${lemma}` : lemma,
          context: contexts, review: "candidate", diagnosticEligible: false });
      }
    }
  }
  if (out) await new Promise((resolve, reject) => { out.on("error", reject); out.end(resolve); });
  const oldRows = legacy.frames.map((row, index) => ({ index, row, associations: candidates.filter(c =>
    c.lemma === norm(row.lemma).replace(/^sich\s+/, "") && c.prep === row.prep && c.case === row.case &&
    (!norm(row.lemma).startsWith("sich ") || c.construction.startsWith("sich "))).map(c => ({ sourceVersion: source.snapshotSha256, contexts: c.context })) }));
  return { source, keyCount: wanted.size, matchedLemmas: [...matched].sort(),
    unmatchedLemmas: [...wanted].filter(k=>!matched.has(k)).sort(), lexicalSenses,
    meaningCountByLemma: Object.fromEntries(meanings), candidates,
    legacyVersion: { retrieved: legacy.retrieved, source: legacy.source },
    legacyAssociations: oldRows, legacyRowsWithContext: oldRows.filter(r=>r.associations.length).length };
}
async function main() {
  const [raw, manifest, keyFile, legacy, output, senses] = process.argv.slice(2);
  if (!output) throw Error("usage: extract-current-kaikki-valency.mjs RAW MANIFEST KEYS LEGACY NEW-REPORT [NEW-SENSES-JSONL]");
  const report = await extractCurrent(raw, JSON.parse(await readFile(manifest,"utf8")), JSON.parse(await readFile(keyFile,"utf8")), JSON.parse(await readFile(legacy,"utf8")), senses);
  await writeFile(output, JSON.stringify(report,null,2)+"\n",{flag:"wx"});
  console.log(JSON.stringify({ keys: report.keyCount, matched: report.matchedLemmas.length, unmatched: report.unmatchedLemmas.length, lexicalSenses:report.lexicalSenses, candidates:report.candidates.length, legacyRowsWithContext:report.legacyRowsWithContext }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
