import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { unit1Check, unit1CheckForm } from "@/content/curriculum/german-a1-unit1-check";
import { germanA1 } from "@/content/curriculum/german-a1";
import { userDocumentPaths } from "../user-data-inventory";
import { readCourseProgress } from "./course-progress.server";
import {
  assessmentRequestSchema,
  attemptRequestSchema,
  submitAssessmentSchema,
  gradeAssessment,
  validateAttempt,
  type AssessmentAttempt,
  storedAttemptSchema,
  type SubmissionResult,
} from "./assessment";

function validateStored(raw: unknown, ownerId: string, attemptId?: string) {
  const parsed = storedAttemptSchema.parse(raw);
  return validateAttempt(parsed, unit1CheckForm(parsed.formId), ownerId, attemptId);
}
/** Prototype-only history scan: no composite index, persisted score or new root.
 * Reads all attempt records, including drafts, inside selection transactions.
 */
function attemptsCollection(db: Firestore, ownerId: string) {
  userDocumentPaths(ownerId);
  return db.collection(`users/${ownerId}/assessmentAttempts`);
}
export function selectAssessmentForm(history: readonly AssessmentAttempt[]) {
  const latest = [...history]
    .filter((a) => a.status === "submitted")
    .sort((a, b) => b.finishedAt! - a.finishedAt! || b.attemptId.localeCompare(a.attemptId))[0];
  return unit1CheckForm(latest?.formId === unit1Check.formId ? "U01.FORM.B" : unit1Check.formId);
}
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
  const unitLessonIds = germanA1.units.find((unit) => unit.id === unit1Check.unitId)!.lessonIds;
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
    throw Error("Finish the four Unit 1 lessons first.");
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw !== undefined) return validateStored(raw, ownerId, request.attemptId);
    const rows = await tx.get(attemptsCollection(db, ownerId));
    const history = rows.docs.map((row) => validateStored(row.data(), ownerId, row.id));
    const form = selectAssessmentForm(history);
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
  const request = attemptRequestSchema.parse(input);
  resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const raw = (
    await db.getAll(db.doc(assessmentAttemptPath(ownerId, request.attemptId)))
  )[0].data();
  if (raw === undefined) throw Error("Unknown attempt.");
  return validateStored(raw, ownerId, request.attemptId);
}
/** Read-only accepted history, newest first with stable document-ID tie-break. */
export async function readAssessmentHistory(
  db: Firestore,
  ownerId: string,
  input: unknown,
): Promise<AssessmentAttempt[]> {
  resolveAssessment(input);
  const rows = await attemptsCollection(db, ownerId).get();
  return rows.docs
    .map((row) => validateStored(row.data(), ownerId, row.id))
    .filter((a) => a.status === "submitted")
    .sort((a, b) => b.finishedAt! - a.finishedAt! || b.attemptId.localeCompare(a.attemptId));
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
  resolveAssessment({
    assessmentId: request.assessmentId,
    compatibilityVersion: request.compatibilityVersion,
  });
  const ref = db.doc(assessmentAttemptPath(ownerId, request.attemptId));
  return db.runTransaction(async (tx) => {
    const raw = (await tx.get(ref)).data();
    if (raw === undefined) throw Error("Unknown attempt.");
    const previous = validateStored(raw, ownerId, request.attemptId);
    const definition = unit1CheckForm(previous.formId);
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
