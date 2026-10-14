/** Assess source acceptance independently from safe bounded lesson use. No inferred cases. */
export function assessPendingFrame(frame, context, source, tools) {
  const evidence = context.evidence;
  const template = context.senseMetadata.info_templates?.[evidence.templateIndex];
  const argument = template?.args?.['2'] ?? '';
  const exactSlot = frame.prep ? `:${frame.prep}(${frame.case === 'akk' ? 'acc' : frame.case})` : frame.case === 'akk' ? 'acc' : frame.case;
  const checks = {
    validContext: tools.validateContext(context),
    sameSnapshot: context.source.snapshotSha256 === source.snapshotSha256,
    sameLemma: context.source.word.toLocaleLowerCase('de-DE') === frame.lemma,
    explicitSlot: evidence.kind === 'structured-obj-template' && template?.name === '+obj' && template.args['1'] === 'de' && evidence.text === exactSlot,
    nonConflictingSlot: tools.nonConflictingSlot(),
    identifiedSense: Boolean(context.senseId && context.glosses.length),
    reflexivePreserved: Boolean(context.requiredReflexive) === frame.construction.startsWith('sich '),
  };
  const accepted = Object.values(checks).every(Boolean);
  const structural = [];
  if(context.requiredReflexive) structural.push('reflexive-role');
  // Only one slot with an optional role description is handled here. Alternatives,
  // qualifiers, literal arguments and additional slots require their own matcher.
  if(!/^(?:acc|dat|gen|:[a-zäöüß]+\((?:acc|dat|gen)\))(?:<[^<>]+>)?$/.test(argument)) structural.push('compound-or-qualified-template');
  if(context.tags.some(t=>['impersonal','reciprocal','ditransitive'].includes(t))) structural.push('tagged-structural-condition');
  if(!frame.prep && context.tags.includes('transitive')) structural.push('additional-object-role');
  if(frame.case==='gen' || (!frame.prep && frame.case==='akk')) structural.push('case-role-not-supported-by-diagnostic');
  const targets=[];
  if(accepted) {
    for(const example of context.examples) {
      if(example.type!=='example' || typeof example.text!=='string' || example.tags?.length || /[\/()\[\]…]|\.\s+\S/.test(example.text)) continue;
      const tokens=tools.tokens(example.text);
      if(!tools.hasVerifiedVerbForm(tokens,frame.construction)) continue;
      const pronouns=frame.case==='dat'?['mir','dir','ihm']:['mich','dich','ihn'];
      const indices=tokens.flatMap((word,index)=>pronouns.includes(word) && (frame.prep ? tokens[index-1]===tools.tokens(frame.prep)[0] : !tools.isPrepositionToken(tokens[index-1]??''))?[index]:[]);
      // A unique target prevents attributing another object's error to this slot.
      if(indices.length===1) targets.push({answer:tokens.join(' '),index:indices[0]});
    }
  }
  const safeTargets=targets.filter(target=>!tools.competingConstruction(frame,target));
  if(targets.length && !safeTargets.length) structural.push('ambiguous-sourced-verb-recognition');
  const blockers=[];
  if(!accepted) blockers.push('source-integrity-or-extraction-check');
  if(structural.length) blockers.push('structural-condition-missing');
  if(!targets.length) blockers.push('meaning-context-matching-missing');
  // A second source is an escalation for failed source checks, not a blanket gate.
  if(!accepted) blockers.push('additional-source-required');
  return {
    referenceAcceptance:accepted?'accepted':'pending',
    assessment:{policy:'sense-scoped-primary-evidence-v1',checks,templateArgument:argument,
      secondSourceRequired:!accepted,structuralReasons:structural,blockers,
      previousQueueBlockers:[...(!structural.length && targets.length ? ['only-second-source-missing'] : blockers)],
      criterion:accepted?'Exact validated same-sense +obj slot; snapshot/record provenance and full usage argument retained':'Source checks failed; do not promote'},
    ...(safeTargets.length && !structural.length?{review:'eligible',diagnosticConditions:{allowedPronounTargets:safeTargets},
      verification:{referenceURL:context.source.entryURL??context.source.url,checked:source.retrieved,
        criterion:'Validated explicit +obj plus exact same-sense source example, sourced verb form, unique object role; only that answer and token index'}}:{review:'reference-only',pendingReasons:blockers}),
  };
}
