import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { unit1Check } from "@/content/curriculum/german-a1-unit1-check";
import { userDocumentPaths } from "../user-data-inventory";
import { readCourseProgress } from "./course-progress.server";
import {
  assessmentRequestSchema,
  attemptRequestSchema,
  submitAssessmentSchema,
  gradeAssessment,
  validateAttempt,
  type AssessmentAttempt,
  type SubmissionResult,
} from "./assessment";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const ASSESSMENT_REQUEST = {
  assessmentId: unit1Check.id,
  compatibilityVersion: unit1Check.compatibilityVersion,
} as const;
function resolveAssessment(input: unknown) {
  const request = assessmentRequestSchema.parse(input);
  if (
    request.assessmentId !== unit1Check.id ||
    request.compatibilityVersion !== unit1Check.compatibilityVersion
  )
    throw Error("Unknown or incompatible check.");
  return unit1Check;
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
  if (
    course.lessons.length !== 4 ||
    !course.lessons.every(
      (row) =>
        !row.unavailable &&
        row.progress?.firstFinishedAt !== null &&
        row.progress?.firstFinishedAt !== undefined,
    )
  )
    throw Error("Finish the four Unit 1 lessons first.");
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw !== undefined) return validateAttempt(raw, definition, ownerId, request.attemptId);
    const attempt: AssessmentAttempt = {
      schemaVersion: 1,
      attemptId: request.attemptId,
      learnerId: ownerId,
      assessmentId: definition.id,
      trackId: definition.trackId,
      releaseId: definition.releaseId,
      unitId: definition.unitId,
      compatibilityVersion: definition.compatibilityVersion,
      definitionHash: hash(definition),
      status: "in-progress",
      startedAt: now,
      finishedAt: null,
      itemOrder: definition.items.map((item) => item.id),
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
  const request = attemptRequestSchema.parse(input);
  const definition = resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const raw = (
    await db.getAll(db.doc(assessmentAttemptPath(ownerId, request.attemptId)))
  )[0].data();
  if (raw === undefined) throw Error("Unknown attempt.");
  return validateAttempt(raw, definition, ownerId, request.attemptId);
}
/** Single supported prototype assessment. Single-field index; implicit document-ID tie-break.
 * Latest means finishedAt descending, then document ID descending for simultaneous finishes.
 */
export async function readLatestAssessment(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<AssessmentAttempt | null> {
  const definition = resolveAssessment(input);
  userDocumentPaths(ownerId);
  const rows = await db
    .collection(`users/${ownerId}/assessmentAttempts`)
    .orderBy("finishedAt", "desc")
    .limit(1)
    .get();
  if (!rows.docs.length) return null;
  const attempt = validateAttempt(rows.docs[0].data(), definition, ownerId, rows.docs[0].id);
  return attempt.status === "submitted" ? attempt : null;
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
  const definition = resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const responses = gradeAssessment(definition, request.responses);
  const ordered = definition.items.map((item) => {
    const response = request.responses.find((r) => r.itemId === item.id)!;
    // Exact trimmed responses, in fixed item order: changed answers cannot disguise themselves as a retry.
    return { itemId: item.id, response: response.response };
  });
  const digest = hash({
    assessmentId: definition.id,
    version: definition.compatibilityVersion,
    responses: ordered,
  });
  const ref = db.doc(assessmentAttemptPath(ownerId, request.attemptId));
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw === undefined) throw Error("Unknown attempt.");
    const previous = validateAttempt(raw, definition, ownerId, request.attemptId);
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
        assessmentVersion: definition.compatibilityVersion,
        timestamp: finishedAt,
        provenance: "assessment",
      })),
    };
    tx.set(ref, attempt);
    return { kind: "accepted", attempt };
  });
}
