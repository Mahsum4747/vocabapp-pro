import assert from "node:assert/strict";
import test from "node:test";
import { approvalFor } from "./build-current-kaikki-valency-pack.mjs";
const candidate={lemma:"test",construction:"test",prep:null,case:"dat"};
const source={snapshotSha256:"a"};
const context={source:{recordSha256:"b"},senseId:"sense-1",senseMetadata:{info_templates:[{name:"+obj",args:{"1":"de","2":"dat"}}]},evidence:{kind:"structured-obj-template",templateIndex:0}};
const approval={...candidate,snapshotSha256:"a",recordSha256:"b",senseId:"sense-1",templateArgument:"dat",referenceURL:"https://example.test/reference",checked:"2026-10-14"};
test("approval is specific to snapshot, record, sense and explicit grammar argument",()=>{
 assert.ok(approvalFor(candidate,context,source,[approval]));
 assert.equal(approvalFor(candidate,context,{snapshotSha256:"other"},[approval]),null);
 assert.equal(approvalFor(candidate,{...context,senseId:"other"},source,[approval]),null);
 assert.equal(approvalFor(candidate,{...context,evidence:{kind:"explicit-gloss-grammar"}},source,[approval]),null);
 assert.equal(approvalFor({...candidate,construction:"sich test"},context,source,[approval]),null);
});

test("structured corroboration is accepted only for the exact construction and unambiguous current-snapshot pair",async()=>{
 const {buildPack}=await import('./build-current-kaikki-valency-pack.mjs');
 const make=c=>({...c,context:[{...context,glosses:['fixture'],rawGlosses:[],tags:[],rawTags:[],entryTags:[],examples:[],requiredReflexive:null,senseIndex:0,diagnosticEligible:false}]});
 const report={source,keyCount:1,matchedLemmas:['test'],unmatchedLemmas:[],lexicalSenses:1,candidates:[make(candidate)],legacyRowsWithContext:0,legacyAssociations:[]};
 const corroboration=[{construction:'test',preposition:null,case:'dativ',sourceDocument:'source-attribution'}];
 assert.equal(buildPack(report,[],corroboration).summary.approvedFrames,1);
 assert.equal(buildPack({...report,candidates:[make({...candidate,construction:'sich test'})]},[],corroboration).summary.approvedFrames,0);
 assert.equal(buildPack({...report,candidates:[make(candidate),make({...candidate,case:'akk'})]},[],corroboration).summary.approvedFrames,0);
});
