import { z } from "zod";

/** Exact upstream text and source location; association never grants diagnostic trust. */
export const valencySourceContextSchema = z.object({
  source: z.object({
    url: z.string().url(), retrieved: z.string().min(1), license: z.string().min(1),
    snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/),
    line: z.number().int().positive(), recordSha256: z.string().regex(/^[a-f0-9]{64}$/),
    word: z.string().min(1), entryId: z.string().nullable(),
  }).passthrough(),
  senseMetadata: z.record(z.string(), z.unknown()),
  senseIndex: z.number().int().nonnegative(), senseId: z.string().nullable(),
  glosses: z.array(z.string()), rawGlosses: z.array(z.string()),
  tags: z.array(z.string()), rawTags: z.array(z.string()), entryTags: z.array(z.string()),
  examples: z.array(z.unknown()), requiredReflexive: z.literal(true).nullable(),
  evidence: z.object({
    kind: z.literal("explicit-gloss-grammar"), text: z.string().min(1),
    offset: z.number().int().nonnegative(), glossIndex: z.number().int().nonnegative(),
  }),
  diagnosticEligible: z.literal(false),
}).superRefine((context, ctx) => {
  const gloss = context.glosses[context.evidence.glossIndex];
  if (!gloss || gloss.slice(context.evidence.offset, context.evidence.offset + context.evidence.text.length) !== context.evidence.text)
    ctx.addIssue({ code: "custom", message: "Evidence must point to exact source gloss text" });
});
export type ValencySourceContext = z.infer<typeof valencySourceContextSchema>;
export function readValencySourceContext(row: { lemma: string; context?: unknown }): readonly ValencySourceContext[] {
  return row.context === undefined ? [] : z.array(valencySourceContextSchema).parse(row.context);
}
