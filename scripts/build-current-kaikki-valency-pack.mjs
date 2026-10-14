/** Small application slice; full sense/quotation records stay in research output. */
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
export function approvalFor(candidate, context, source, approvals) {
  if (context.evidence.kind !== "structured-obj-template") return null;
  const template = context.senseMetadata.info_templates?.[context.evidence.templateIndex];
  return approvals.find(a=>a.lemma===candidate.lemma && a.construction===candidate.construction &&
    a.prep===candidate.prep && a.case===candidate.case && a.snapshotSha256===source.snapshotSha256 &&
    a.recordSha256===context.source.recordSha256 && a.senseId===context.senseId &&
    a.templateArgument===template?.args?.["2"] && a.referenceURL && a.checked) ?? null;
}
import { assessPendingFrame } from "./assess-kaikki-pending.mjs";
export function buildPack(report, approvals, corroboratingFrames = [], assessmentTools) {
  const cases = { akk: "akkusativ", dat: "dativ", gen: "genitiv" };
  const currentCases=new Map();
  for(const c of report.candidates){const key=`${c.construction}|${c.prep}`;if(!currentCases.has(key))currentCases.set(key,new Set());currentCases.get(key).add(c.case);}
  const contexts={}, frames=[];
  for (const [index,candidate] of report.candidates.entries()) {
    const context=candidate.context.find(c=>c.evidence.kind==="structured-obj-template") ?? candidate.context[0];
    let approval=approvalFor(candidate,context,report.source,approvals);
    const support=corroboratingFrames.find(f=>f.construction===candidate.construction && f.preposition===candidate.prep && f.case===cases[candidate.case]);
    const restricted=context.tags.some(t=>["obsolete","archaic","dated","rare"].includes(t));
    if(!approval && support && context.evidence.kind==="structured-obj-template" && context.senseId && !restricted && currentCases.get(`${candidate.construction}|${candidate.prep}`).size===1)
      approval={referenceURL:support.sourceDocument,checked:report.source.retrieved,
        reason:"Explicit same-sense +obj, exact independently source-curated eligible construction/case, no within-version case conflict or obsolete label",diagnosticConditions:{}};
    contexts[index]={...context,
      source:{...Object.fromEntries(["url","retrieved","license","snapshotSha256","line","recordSha256","word","entryId"].map(k=>[k,context.source[k]])),entryURL:`https://en.wiktionary.org/wiki/${encodeURIComponent(candidate.lemma)}#German`},
      senseMetadata:Object.fromEntries(Object.entries(context.senseMetadata).filter(([k])=>["id","senseid","info_templates","topics"].includes(k))),
      examples:context.examples.filter(e=>e.type==="example")};
    frames.push({lemma:candidate.lemma,construction:candidate.construction,prep:candidate.prep,case:candidate.case,
      contextId:String(index),review:approval?"eligible":"reference-only",
      ...(approval?{referenceAcceptance:"accepted"}:{}),
      ...(!approval?{pendingReason:context.evidence.kind!=="structured-obj-template"?"gloss-only-evidence":restricted?"register-or-historical-review":currentCases.get(`${candidate.construction}|${candidate.prep}`).size>1?"sense-selection-required":"independent-verification-or-context-check-needed"}:{}),
      ...(approval?{verification:{referenceURL:approval.referenceURL,checked:approval.checked,criterion:approval.reason},diagnosticConditions:approval.diagnosticConditions}:{})});
  }
  if(assessmentTools) for(const frame of frames) {
    if(frame.pendingReason!=="independent-verification-or-context-check-needed") continue;
    const decision=assessPendingFrame(frame,contexts[frame.contextId],report.source,{...assessmentTools,nonConflictingSlot:()=>currentCases.get(`${frame.construction}|${frame.prep}`).size===1});
    delete frame.pendingReason;
    Object.assign(frame,decision);
  }
  const contextKeys=report.candidates.map(c=>JSON.stringify(c.context));
  const associations=report.legacyAssociations.filter(r=>r.associations.length).map(r=>{
    const keys=new Set(r.associations.map(a=>JSON.stringify(a.contexts)));
    return {legacyRow:r.index,currentContextIds:contextKeys.flatMap((key,index)=>keys.has(key)?[String(index)]:[])};
  });
  return {source:report.source,matchedLemmas:report.matchedLemmas,unmatchedLemmas:report.unmatchedLemmas,
    summary:{keys:report.keyCount,matched:report.matchedLemmas.length,lexicalSenses:report.lexicalSenses,
      candidateSenseFrames:frames.length,candidateStructures:new Set(frames.map(f=>`${f.lemma}|${f.construction}|${f.prep}|${f.case}`)).size,
      candidateLemmas:new Set(frames.map(f=>f.lemma)).size,legacyRowsAssociated:report.legacyRowsWithContext,
      approvedFrames:frames.filter(f=>f.review==="eligible").length},contexts,frames,
    legacyAssociations:associations};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  const [reportPath,reviewPath,out,corroborationPath]=process.argv.slice(2);
  if(!out)throw Error("usage: build-current-kaikki-valency-pack.mjs REPORT REVIEWS NEW-OUTPUT");
  let corroboration;
  if(corroborationPath) corroboration=JSON.parse(await readFile(corroborationPath,"utf8"));
  else {
    await import("./test-register.mjs");
    const {listVerbLexicon}=await import("../src/lib/german/verb-lexicon.ts");
    corroboration=listVerbLexicon().flatMap(e=>e.frames.filter(f=>f.review==="eligible" &&
      ["curated-dative","curated-government"].includes(f.source)).map(f=>({construction:f.construction,preposition:f.preposition,case:f.case,sourceDocument:f.provenance.document})));
  }
  await import("./test-register.mjs");
  const {valencySourceContextSchema}=await import("../src/lib/german/valency-source-context.ts");
  const {valencyDiagnosticTokens,hasVerifiedVerbForm}=await import("../src/lib/curriculum/lesson-diagnostics.ts");
  const {isPrepositionToken,eligiblePrepositionalFrames,eligibleBareDativeFrames}=await import("../src/lib/german/verb-valency-index.ts");
  const competingConstruction=(frame,target)=>{
    const choices=frame.prep?eligiblePrepositionalFrames(frame.prep,{akk:"akkusativ",dat:"dativ",gen:"genitiv"}[frame.case]):eligibleBareDativeFrames();
    return choices.some(other=>other.construction!==frame.construction && hasVerifiedVerbForm(target.answer.split(" "),other.construction) &&
      (!other.diagnosticConditions?.allowedNormalizedAnswers || other.diagnosticConditions.allowedNormalizedAnswers.includes(target.answer)) &&
      (!other.diagnosticConditions?.allowedPronounTargets || other.diagnosticConditions.allowedPronounTargets.some(t=>t.answer===target.answer&&t.index===target.index)));
  };
  const assessmentTools={competingConstruction,validateContext:c=>valencySourceContextSchema.safeParse(c).success,tokens:valencyDiagnosticTokens,hasVerifiedVerbForm,isPrepositionToken};
  const pack=buildPack(JSON.parse(await readFile(reportPath,"utf8")),JSON.parse(await readFile(reviewPath,"utf8")),corroboration,assessmentTools);
  await writeFile(out,JSON.stringify(pack)+"\n",{flag:"wx"});
  console.log(JSON.stringify(pack.summary));
}
