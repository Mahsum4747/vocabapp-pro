import assert from 'node:assert/strict';
import test from 'node:test';
import pack from '../../content/karta-kaikki-valency-2026-10-03.json' with {type:'json'};
import { diagnoseLessonResponse } from './lesson-diagnostics';
import type {LessonDefinition,LessonStep} from './types';
const lesson={id:'scope-test',unitId:'scope',title:'scope',outcome:'scope',introducedSkillIds:[],consolidatedSkillIds:[],availability:'prototype',steps:[]} as LessonDefinition;
const step=(answer:string):LessonStep=>({id:'scope',kind:'text',stage:'produce',purpose:'practice',answerLanguage:'de',label:'scope',prompt:'Complete the authored answer.',inputLabel:'German',acceptedAnswers:[answer],feedback:'scope',skillIds:[]});
const opposite:Record<string,string>={mir:'mich',dir:'dich',ihm:'ihn',mich:'mir',dich:'dir',ihn:'ihm'};
const fresh=pack.frames.filter(f=>'assessment' in f && f.review==='eligible');
test('every newly accepted primary-source construction detects only its bounded source target',()=>{
 assert.equal(fresh.length,15);
 for(const frame of fresh){
  const conditions='diagnosticConditions' in frame ? frame.diagnosticConditions : undefined;
  const targets=conditions && 'allowedPronounTargets' in conditions ? conditions.allowedPronounTargets : undefined;
  assert.ok(targets);
  for(const target of targets){
   const words=target.answer.split(' '); const wrong=[...words];wrong[target.index]=opposite[words[target.index]];
   const result=diagnoseLessonResponse(lesson,step(target.answer),wrong.join(' '));
   assert.equal(result?.category,'lexical_government',JSON.stringify({frame,target,result}));
   assert.ok(result?.targetLabel?.startsWith(frame.construction+' +'),JSON.stringify({frame,target,result}));
   assert.equal(diagnoseLessonResponse(lesson,step(target.answer),target.answer),null);
   // Keeping the verb and case contrast does not authorize a different sense/context.
   const other=['heute',...words];const otherWrong=['heute',...wrong];
   const outside=diagnoseLessonResponse(lesson,step(other.join(' ')),otherWrong.join(' '));
   assert.ok(!outside?.targetLabel?.startsWith(frame.construction+' +'),JSON.stringify({frame,outside}));
   const unrelated=[...words];unrelated[target.index]=words[target.index]==='mir'?'ihn':'mich';
   if(!opposite[words[target.index]] || unrelated[target.index]!==opposite[words[target.index]])
    assert.equal(diagnoseLessonResponse(lesson,step(target.answer),unrelated.join(' ')),null);
  }
 }
});
test('another object in the same source example cannot borrow the prepositional target proof',()=>{
 assert.equal(diagnoseLessonResponse(lesson,step('Ich habe ihn gegrüßt, aber er hat einfach an mir vorbeigeschaut.'),'Ich habe ihm gegrüßt, aber er hat einfach an mir vorbeigeschaut.'),null);
});
test('reference acceptance does not promote reflexive or compound templates',()=>{
 const structural=pack.frames.filter(f=>'assessment' in f && f.assessment?.structuralReasons.length);
 assert.ok(structural.length>300);
 for(const f of structural){assert.equal(f.referenceAcceptance,'accepted');assert.equal(f.review,'reference-only');}
 assert.ok(!diagnoseLessonResponse(lesson,step('Ich gehe auf ihn zu.'),'Ich gehe auf ihm zu.')?.targetLabel?.startsWith('gehen +')); 
});
