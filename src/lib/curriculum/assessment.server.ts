import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { unit1Check } from "@/content/curriculum/german-a1-unit1-check";
import { assessmentForm, registeredAssessment, compatibleHistory } from "./assessment-registry";
import { nextFormLabel } from "./assessment-projection";
import { userDocumentPaths } from "../user-data-inventory";
import { readCourseProgress } from "./course-progress.server";
import {
  assessmentRequestSchema,
  attemptRequestSchema,
  readAttemptRequestSchema,
  submitAssessmentSchema,
  gradeAssessment,
  validateAttempt,
  type AssessmentAttempt,
  storedAttemptSchema,
  type SubmissionResult,
} from "./assessment";

function assertRequestedAssessment(
  attempt: AssessmentAttempt,
  definition: ReturnType<typeof resolveAssessment>,
) {
  if (
    attempt.assessmentId !== definition.id ||
    attempt.compatibilityVersion !== definition.compatibilityVersion
  )
    throw Error("Saved check belongs to another assessment or compatibility version.");
}
function validateStored(raw: unknown, ownerId: string, attemptId?: string) {
  const parsed = storedAttemptSchema.parse(raw);
  return validateAttempt(
    parsed,
    assessmentForm(parsed.assessmentId, parsed.formId),
    ownerId,
    attemptId,
  );
}
/** Unrelated assessment documents cannot poison this assessment's history. Matching IDs
 * are validated fail-closed, including stale compatibility and forged provenance. */
function scopedRows(
  rows: { docs: { id: string; data(): unknown }[] },
  definition: ReturnType<typeof resolveAssessment>,
  ownerId: string,
) {
  return compatibleHistory(
    definition,
    rows.docs
      .filter(
        (row) =>
          (row.data() as { assessmentId?: unknown } | undefined)?.assessmentId === definition.id,
      )
      .map((row) => validateStored(row.data(), ownerId, row.id)),
    ownerId,
  );
}
/** Prototype-only history scan: no composite index, persisted score or new root.
 * Reads all attempt records, including drafts, inside selection transactions.
 */
function attemptsCollection(db: Firestore, ownerId: string) {
  userDocumentPaths(ownerId);
  return db.collection(`users/${ownerId}/assessmentAttempts`);
}
export function selectAssessmentForm(
  history: readonly AssessmentAttempt[],
  definition = unit1Check,
) {
  return assessmentForm(definition.id, nextFormLabel(history, definition).formId);
}
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const ASSESSMENT_REQUEST = {
  assessmentId: unit1Check.id,
  compatibilityVersion: unit1Check.compatibilityVersion,
} as const;
function resolveAssessment(input: unknown) {
  const request = assessmentRequestSchema.parse(input);
  if (
    request.compatibilityVersion !==
    registeredAssessment(request.assessmentId).definition.compatibilityVersion
  )
    throw Error("Unknown or incompatible check.");
  return registeredAssessment(request.assessmentId).definition;
}
export function assessmentAttemptPath(ownerId: string, attemptId: string) {
  userDocumentPaths(ownerId);
  attemptRequestSchema.shape.attemptId.parse(attemptId);
  return `users/${ownerId}/assessmentAttempts/${attemptId}`;
}
/** Two lifetime writes: explicit start, then atomic final submission. No projection/index writes. */
export async function createAssessmentAttempt(
  db: Firestore,
  ownerId: string,
  input: unknown,
  now = Date.now(),
): Promise<AssessmentAttempt> {
  const request = attemptRequestSchema.parse(input);
  const definition = resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const ref = db.doc(assessmentAttemptPath(ownerId, request.attemptId));
  const course = await readCourseProgress(db, ownerId, {
    trackId: definition.trackId,
    releaseId: definition.releaseId,
  });
  const unitLessonIds = registeredAssessment(definition.id).lessonIds;
  const unitLessons = course.lessons.filter((lesson) => unitLessonIds.includes(lesson.lessonId));
  if (
    unitLessons.length !== unitLessonIds.length ||
    !unitLessons.every(
      (row) =>
        !row.unavailable &&
        row.progress?.firstFinishedAt !== null &&
        row.progress?.firstFinishedAt !== undefined,
    )
  )
    throw Error(
      `Finish the four Unit ${registeredAssessment(definition.id).unitNumber} lessons first.`,
    );
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw !== undefined) {
      const existing = validateStored(raw, ownerId, request.attemptId);
      assertRequestedAssessment(existing, definition);
      return existing;
    }
    const rows = await tx.get(attemptsCollection(db, ownerId));
    const form = selectAssessmentForm(scopedRows(rows, definition, ownerId), definition);
    const attempt: AssessmentAttempt = {
      schemaVersion: 2,
      assessmentVersion: form.assessmentVersion,
      formId: form.formId,
      formFamilyId: form.formFamilyId,
      attemptId: request.attemptId,
      learnerId: ownerId,
      assessmentId: definition.id,
      trackId: definition.trackId,
      releaseId: definition.releaseId,
      unitId: definition.unitId,
      compatibilityVersion: form.compatibilityVersion,
      definitionHash: hash(form),
      status: "in-progress",
      startedAt: now,
      finishedAt: null,
      itemOrder: form.items.map((item) => item.id),
      submissionDigest: null,
      responses: [],
      evidence: [],
    };
    tx.set(ref, attempt);
    return attempt;
  });
}
export async function readAssessmentAttempt(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<AssessmentAttempt> {
  const request = readAttemptRequestSchema.parse(input);
  const requested =
    "assessmentId" in request
      ? resolveAssessment({
          assessmentId: request.assessmentId,
          compatibilityVersion: request.compatibilityVersion,
        })
      : null;
  const raw = (
    await db.getAll(db.doc(assessmentAttemptPath(ownerId, request.attemptId)))
  )[0].data();
  if (raw === undefined) throw Error("Unknown attempt.");
  const attempt = validateStored(raw, ownerId, request.attemptId);
  if (requested) assertRequestedAssessment(attempt, requested);
  return attempt;
}
/** Read-only accepted history, newest first with stable document-ID tie-break. */
export async function readAssessmentHistory(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<AssessmentAttempt[]> {
  const definition = resolveAssessment(input);
  const rows = await attemptsCollection(db, ownerId).get();
  return scopedRows(rows, definition, ownerId);
}
export async function readLatestAssessment(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<AssessmentAttempt | null> {
  return (await readAssessmentHistory(db, ownerId, input))[0] ?? null;
}
/** The entire accepted truth + deterministic events land in ONE transaction/document.
 * Subsequent identical submissions are reads; changed submissions return the winning result.
 */
export async function submitAssessmentAttempt(
  db: Firestore,
  ownerId: string,
  input: unknown,
  now = Date.now(),
): Promise<SubmissionResult> {
  const request = submitAssessmentSchema.parse(input);
  const requested = resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const ref = db.doc(assessmentAttemptPath(ownerId, request.attemptId));
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw === undefined) throw Error("Unknown attempt.");
    const previous = validateStored(raw, ownerId, request.attemptId);
    assertRequestedAssessment(previous, requested);
    const definition = assessmentForm(previous.assessmentId, previous.formId);
    const responses = gradeAssessment(definition, request.responses);
    const ordered = definition.items.map((item) => ({
      itemId: item.id,
      response: request.responses.find((r) => r.itemId === item.id)!.response,
    }));
    // Keep legacy A retry digests stable; new digests bind the explicit form identity.
    const digest = hash({
      assessmentId: definition.id,
      version: definition.compatibilityVersion,
      ...(previous.schemaVersion === 2
        ? {
            assessmentVersion: definition.assessmentVersion,
            formId: definition.formId,
            formFamilyId: definition.formFamilyId,
          }
        : {}),
      responses: ordered,
    });
    if (previous.status === "submitted")
      return {
        kind: previous.submissionDigest === digest ? "accepted" : "conflict",
        attempt: previous,
      };
    const finishedAt = Math.max(now, previous.startedAt);
    const attempt: AssessmentAttempt = {
      ...previous,
      status: "submitted",
      finishedAt,
      submissionDigest: digest,
      responses,
      evidence: responses.map((response) => ({
        ...response,
        id: `${previous.attemptId}:${response.itemId}`,
        learnerId: ownerId,
        assessmentAttemptId: previous.attemptId,
        assessmentId: definition.id,
        assessmentVersion: definition.assessmentVersion,
        compatibilityVersion: definition.compatibilityVersion,
        formId: definition.formId,
        formFamilyId: definition.formFamilyId,
        timestamp: finishedAt,
        provenance: "assessment",
      })),
    };
    tx.set(ref, attempt);
    return { kind: "accepted", attempt };
  });
}
