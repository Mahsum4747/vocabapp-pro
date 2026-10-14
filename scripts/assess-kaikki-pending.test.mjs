import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import './test-register.mjs';
import {valencySourceContextSchema} from '../src/lib/german/valency-source-context.ts';
import {valencyDiagnosticTokens,hasVerifiedVerbForm} from '../src/lib/curriculum/lesson-diagnostics.ts';
import {isPrepositionToken,lookupAcceptedValencyReferences} from '../src/lib/german/verb-valency-index.ts';
import {assessPendingFrame} from './assess-kaikki-pending.mjs';
const pack=JSON.parse(readFileSync(new URL('../src/content/karta-kaikki-valency-2026-10-03.json',import.meta.url),'utf8'));
const frame=pack.frames[37], context=pack.contexts['37'];
const tools={validateContext:c=>valencySourceContextSchema.safeParse(c).success,tokens:valencyDiagnosticTokens,hasVerifiedVerbForm,isPrepositionToken,competingConstruction:()=>false,nonConflictingSlot:()=>true};
const assess=(c=context,f=frame,t=tools)=>assessPendingFrame(f,c,pack.source,t);
test('explicit primary source is sufficient only with validated traceability, sense and bounded role',()=>{
 assert.equal(assess().referenceAcceptance,'accepted');assert.equal(assess().review,'eligible');
 for(const c of [ {...context,senseId:null}, {...context,glosses:[]}, {...context,source:{...context.source,snapshotSha256:'0'.repeat(64)}}, {...context,evidence:{...context.evidence,offset:1}}, {...context,requiredReflexive:true} ]) {
  assert.equal(assess(c).referenceAcceptance,'pending');assert.equal(assess(c).review,'reference-only');
 }
 assert.equal(assess(context,{...frame,case:'dat'}).referenceAcceptance,'pending');
 assert.equal(assess(context,frame,{...tools,nonConflictingSlot:()=>false}).referenceAcceptance,'pending');
});
test('gloss and examples alone cannot substitute for explicit grammar, while absent safe examples only withholds diagnosis',()=>{
 assert.equal(assess({...context,evidence:{kind:'explicit-gloss-grammar',glossIndex:0,offset:0,text:context.glosses[0]}}).referenceAcceptance,'pending');
 const noExample=assess({...context,examples:[]});assert.equal(noExample.referenceAcceptance,'accepted');assert.equal(noExample.review,'reference-only');assert.equal(noExample.assessment.secondSourceRequired,false);
});
test('all 606 queue records retain independent, potentially overlapping assessment results',()=>{
 const rows=pack.frames.filter(f=>f.assessment);
 assert.equal(rows.length,606);
 for(const f of rows){assert.ok(Object.values(f.assessment.checks).every(Boolean));assert.equal(f.referenceAcceptance,'accepted');assert.equal(f.assessment.secondSourceRequired,false);}
 assert.ok(rows.some(f=>f.assessment.blockers.includes('structural-condition-missing')&&f.assessment.blockers.includes('meaning-context-matching-missing')));
 assert.ok(lookupAcceptedValencyReferences('sehen').some(f=>f.review==='reference-only'));
});
