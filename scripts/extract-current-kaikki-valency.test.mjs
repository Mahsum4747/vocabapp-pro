import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { candidateTriples, extractCurrent } from "./extract-current-kaikki-valency.mjs";

test("extracts explicit case spans only, never converts transitivity into government", () => {
  assert.deepEqual(candidateTriples("sehen", { tags: ["transitive"], glosses: ["to see"] }), []);
  assert.deepEqual(candidateTriples("helfen", { form_of: [{word:"helfen"}], glosses: ["with dative"] }), []);
  assert.deepEqual(candidateTriples("abwarten", {glosses:["with auf (+ accusative)"]}), [{lemma:"abwarten",prep:"auf",case:"akk"}]);
});
test("compares every key, preserves source-version separation and sense-level reflexivity", async () => {
  const dir=await mkdtemp(join(tmpdir(),"karta-current-test-"));
  try {
    const raw=[{word:"neu",pos:"verb",lang_code:"de",senses:[{id:"sense-A",glosses:["with an (+ dative)"],tags:["reflexive"]}]},
      {word:"plain",pos:"verb",lang_code:"de",senses:[{glosses:["to do"],tags:["transitive"]}]},
      {word:"form",pos:"verb",lang_code:"de",senses:[{glosses:["a form"],tags:["form-of"],form_of:[{word:"plain"}]}]}].map(JSON.stringify).join("\n")+"\n";
    const path=join(dir,"raw.jsonl"), senses=join(dir,"senses.jsonl");await writeFile(path,raw);
    const source={url:"https://kaikki.org/test",retrieved:"2026-10-14",license:"fixture",snapshotSha256:createHash("sha256").update(raw).digest("hex")};
    const result=await extractCurrent(path,source,["neu","plain","form","missing"],{retrieved:"2026-09-24",source:"legacy",frames:[{lemma:"neu",prep:"an",case:"akk"}]},senses);
    assert.deepEqual(result.matchedLemmas,["neu","plain"]);
    assert.deepEqual(result.unmatchedLemmas,["form","missing"]);
    assert.equal(result.candidates[0].construction,"sich neu");
    assert.equal(result.candidates[0].context[0].senseId,"sense-A");
    assert.equal(result.candidates[0].diagnosticEligible,false);
    assert.equal(result.legacyRowsWithContext,0); // New dat vs old akk is not marked a conflict.
    assert.equal(result.legacyVersion.retrieved,"2026-09-24");
    assert.equal((await readFile(senses,"utf8")).trim().split("\n").length,2);
    await assert.rejects(extractCurrent(path,{...source,snapshotSha256:"a".repeat(64)},[],{frames:[]}),/hash mismatch/);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("keeps raw gloss and structured +obj evidence removed from cleaned gloss",()=>{
 const sense={glosses:["to wait"],raw_glosses:["to wait [with auf (+ accusative)]"],info_templates:[{name:"+obj",args:{"1":"de","2":":auf(acc)"}}]};
 assert.deepEqual(candidateTriples("warten",sense),[{lemma:"warten",prep:"auf",case:"akk"}]);
 assert.deepEqual(candidateTriples("geben",{glosses:["to give"],info_templates:[{name:"+obj",args:{"1":"de","2":"dat<recipient>; acc<thing>"}}]}),[{lemma:"geben",prep:null,case:"dat"},{lemma:"geben",prep:null,case:"akk"}]);
});
