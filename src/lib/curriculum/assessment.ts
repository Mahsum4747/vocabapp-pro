import { z } from "zod";

export type AssessmentItem = {
  id: string;
  type: "choice" | "bounded-text" | "reading-extraction" | "construction" | "supported-field";
  targetId: string;
  prompt: string;
  stimulus?: string;
  options?: readonly string[];
  acceptedAnswers: readonly string[];
  caseSensitive?: boolean;
};
export type AssessmentDefinition = {
  id: string;
  assessmentVersion: number;
  formId: string;
  formFamilyId: string;
  trackId: string;
  releaseId: string;
  unitId: string;
  compatibilityVersion: number;
  status: "prototype";
  provenance: "Original Karta authoring; pending pedagogical review";
  targets: readonly { id: string; label: string; scope: string }[];
  items: readonly AssessmentItem[];
};
export const assessmentRequestSchema = z
  .object({
    assessmentId: z.string().min(1).max(100),
    compatibilityVersion: z.number().int().positive(),
  })
  .strict();
export const attemptRequestSchema = assessmentRequestSchema
  .extend({ attemptId: z.string().uuid() })
  .strict();
/** UUID-only reads resolve the authoritative stored assessment. Existing scoped callers
 * remain supported and reject cross-assessment requests. Owner always comes from auth. */
export const readAttemptRequestSchema = z.union([
  attemptRequestSchema,
  z.object({ attemptId: attemptRequestSchema.shape.attemptId }).strict(),
]);
export const responseSchema = z
  .object({ itemId: z.string().min(1).max(100), response: z.string().trim().min(1).max(160) })
  .strict();
export type AssessmentResponse = z.infer<typeof responseSchema>;
export const submitAssessmentSchema = attemptRequestSchema
  .extend({ responses: z.array(responseSchema).min(6).max(16) })
  .strict();
const resultSchema = z
  .object({ itemId: z.string(), targetId: z.string(), correct: z.boolean() })
  .strict();
const legacyEventSchema = resultSchema
  .extend({
    id: z.string(),
    learnerId: z.string(),
    assessmentAttemptId: z.string(),
    assessmentId: z.string(),
    assessmentVersion: z.number().int().positive(),
    timestamp: z.number().int().nonnegative(),
    provenance: z.literal("assessment"),
  })
  .strict();
const formIdentity = {
  assessmentVersion: z.number().int().positive(),
  formId: z.string().min(1),
  formFamilyId: z.string().min(1),
};
const eventSchema = legacyEventSchema
  .extend({
    formId: formIdentity.formId,
    formFamilyId: formIdentity.formFamilyId,
    compatibilityVersion: z.number().int().positive(),
  })
  .strict();
export type EvidenceEvent = z.infer<typeof eventSchema>;
const legacyAttemptSchema = z
  .object({
    schemaVersion: z.literal(1),
    attemptId: z.string().uuid(),
    learnerId: z.string().min(1),
    assessmentId: z.string(),
    trackId: z.string(),
    releaseId: z.string(),
    unitId: z.string(),
    compatibilityVersion: z.number().int().positive(),
    definitionHash: z.string().regex(/^[a-f0-9]{64}$/),
    status: z.enum(["in-progress", "submitted"]),
    startedAt: z.number().int().nonnegative(),
    finishedAt: z.number().int().nonnegative().nullable(),
    itemOrder: z.array(z.string()).min(6).max(10),
    submissionDigest: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .nullable(),
    // Correct/incorrect classes suffice for result review; raw typed answers are not stored.
    responses: z.array(resultSchema).max(10),
    evidence: z.array(legacyEventSchema).max(10),
  })
  .strict();
const currentAttemptSchema = legacyAttemptSchema
  .extend({
    schemaVersion: z.literal(2),
    ...formIdentity,
    itemOrder: z.array(z.string()).min(6).max(16),
    responses: z.array(resultSchema).max(16),
    evidence: z.array(eventSchema).max(16),
  })
  .strict();
/** Read-only interpretation of known Phase 1E records. Never writes/migrates legacy data. */
export const storedAttemptSchema = z.union([
  currentAttemptSchema,
  currentAttemptSchema
    .extend({
      schemaVersion: z.literal(1),
      formId: z.literal("U01.FORM.A"),
      formFamilyId: z.literal("U01.FAMILY.A"),
      assessmentVersion: z.literal(1),
    })
    .strict(),
  legacyAttemptSchema.transform((a) => ({
    ...a,
    assessmentVersion: 1,
    formId: "U01.FORM.A",
    formFamilyId: "U01.FAMILY.A",
    evidence: a.evidence.map((e) => ({
      ...e,
      formId: "U01.FORM.A",
      formFamilyId: "U01.FAMILY.A",
      compatibilityVersion: a.compatibilityVersion,
    })),
  })),
]);
export type AssessmentAttempt = z.infer<typeof storedAttemptSchema>;
export type SubmissionResult = { kind: "accepted" | "conflict"; attempt: AssessmentAttempt };

export function normalizeAssessmentResponse(value: string, caseSensitive = false) {
  const normalized = value
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]$/, "");
  return caseSensitive ? normalized : normalized.toLocaleLowerCase("de");
}
export function gradeAssessment(
  definition: AssessmentDefinition,
  responses: readonly AssessmentResponse[],
) {
  if (
    responses.length !== definition.items.length ||
    new Set(responses.map((r) => r.itemId)).size !== responses.length
  )
    throw Error("Every known item needs exactly one response.");
  const byId = new Map(responses.map((r) => [r.itemId, r.response]));
  return definition.items.map((item) => {
    const value = byId.get(item.id);
    if (value === undefined || !value.trim() || value.length > 160)
      throw Error("Unknown or missing item.");
    if (item.options && !item.options.includes(value)) throw Error("Unknown choice.");
    return {
      itemId: item.id,
      targetId: item.targetId,
      correct: item.acceptedAnswers.some(
        (answer) =>
          normalizeAssessmentResponse(answer, item.caseSensitive) ===
          normalizeAssessmentResponse(value, item.caseSensitive),
      ),
    };
  });
}
export { projectOutcomes, type OutcomeProjection } from "./assessment-projection";
export function validateAttempt(
  raw: unknown,
  definition: AssessmentDefinition,
  learnerId: string,
  attemptId?: string,
): AssessmentAttempt {
  const a = storedAttemptSchema.parse(raw);
  if (
    a.learnerId !== learnerId ||
    (attemptId && a.attemptId !== attemptId) ||
    a.assessmentId !== definition.id ||
    a.assessmentVersion !== definition.assessmentVersion ||
    a.formId !== definition.formId ||
    a.formFamilyId !== definition.formFamilyId ||
    a.trackId !== definition.trackId ||
    a.releaseId !== definition.releaseId ||
    a.unitId !== definition.unitId ||
    a.compatibilityVersion !== definition.compatibilityVersion ||
    JSON.stringify(a.itemOrder) !== JSON.stringify(definition.items.map((i) => i.id))
  )
    throw Error("Saved check is incompatible.");
  if (a.status === "in-progress") {
    if (
      a.finishedAt !== null ||
      a.submissionDigest !== null ||
      a.responses.length ||
      a.evidence.length
    )
      throw Error("Invalid unfinished attempt.");
  } else {
    if (
      a.finishedAt === null ||
      a.finishedAt < a.startedAt ||
      !a.submissionDigest ||
      a.responses.length !== definition.items.length ||
      a.evidence.length !== definition.items.length
    )
      throw Error("Invalid submitted attempt.");
    definition.items.forEach((item, index) => {
      const response = a.responses[index];
      const e = a.evidence[index];
      if (
        response.itemId !== item.id ||
        response.targetId !== item.targetId ||
        e.id !== `${a.attemptId}:${item.id}` ||
        e.itemId !== item.id ||
        e.targetId !== item.targetId ||
        e.correct !== response.correct ||
        e.learnerId !== learnerId ||
        e.assessmentAttemptId !== a.attemptId ||
        e.assessmentId !== definition.id ||
        e.assessmentVersion !== definition.assessmentVersion ||
        e.compatibilityVersion !== definition.compatibilityVersion ||
        e.formId !== definition.formId ||
        e.formFamilyId !== definition.formFamilyId ||
        e.timestamp !== a.finishedAt
      )
        throw Error("Invalid evidence provenance.");
    });
  }
  return a;
}
