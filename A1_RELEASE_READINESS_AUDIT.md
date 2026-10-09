# A1 release-readiness audit (2026-10-09)

## Decision: prototype retained — release gate NOT passed

The existing 40-lesson structural audit verifies teaching/practice/formative-check presence and original transfer, but does not verify grammatical correctness, semantic adequacy, CEFR scope, reading comprehension quality, or writing-task authenticity. Do not relabel the curriculum as reviewed or release-ready on structural tests alone.

## Implemented in this branch
- Narrow, deterministic diagnostic recognition for object-pronoun substitutions when the rest of the authored sentence is unchanged.
- Word-order permutations on explicitly tagged V2 lesson items.
- Positive and negative regression tests; uncertain or unrelated responses remain unclassified.
- Existing narrow helfen + Dativ and mit + Dativ rules remain in place.
- No diagnostic is mastery evidence; Check, Challenge, and Checkpoint assessment semantics remain unchanged.

## Required for actual A1 release approval
- Linguistic review of the German prompts, accepted answers, feedback and examples for **each** of the 40 lessons, with reviewer notes and corrected items.
- Separate reading review: answerable details, negation, corrected information and genuine new-text transfer.
- Separate writing review: communicative purpose, register, required points, supported drafting and revision.
- Verify canonical skill inventory and prerequisite order against GERMAN_A1_BLUEPRINT.md.
- Authenticated production end-to-end verification of note persistence and remediation; do not wipe Firestore without inspection.
- Keep status `prototype` until all release gates are evidenced. The blueprint itself states that final inventory alignment is pending.

This audit is a gap register, **not** a claim that the above review has occurred.
