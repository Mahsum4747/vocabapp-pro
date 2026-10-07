import { createHash } from "node:crypto";
import type { Firestore, Transaction } from "firebase-admin/firestore";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { userDocumentPaths } from "../user-data-inventory";
import { normalizeLessonAnswer } from "./lesson-session";
import { COURSE_SCOPE } from "./course-progress-session";
import {
  CHALLENGE_RETRY_MS,
  challengeScoreClears,
  challengeScopeSchema,
  challengeStartSchema,
  challengeSubmitSchema,
  challengeSummarySchema,
  challengeAttemptSchema,
  type ChallengeScope,
  type ChallengeSummary,
  type ChallengeAttempt,
  type ChallengeView,
} from "./challenge";

function scopeOf(input: unknown) {
  const scope = challengeScopeSchema.parse(input);
  if (
    scope.trackId !== COURSE_SCOPE.trackId ||
    scope.releaseId !== COURSE_SCOPE.releaseId ||
    !Object.hasOwn(challengeForms, scope.unitId)
  )
    throw Error("Challenge unavailable.");
  return scope;
}
export function challengePath(ownerId: string, scope: ChallengeScope) {
  userDocumentPaths(ownerId);
  scopeOf(scope);
  return `users/${ownerId}/unitChallenges/${encodeURIComponent(JSON.stringify([scope.trackId, scope.releaseId, scope.unitId]))}`;
}
function initial(ownerId: string, scope: ChallengeScope): ChallengeSummary {
  return {
    ...scope,
    ownerId,
    schemaVersion: 1,
    purpose: "unit-challenge",
    contractVersion: 1,
    revision: 0,
    attemptCount: 0,
    clearedAt: null,
    activeAttemptId: null,
    lastAttemptId: null,
    retryAfter: null,
  };
}
function owned<T extends ChallengeScope & { ownerId: string }>(
  value: T,
  ownerId: string,
  scope: ChallengeScope,
): T {
  if (
    value.ownerId !== ownerId ||
    value.trackId !== scope.trackId ||
    value.releaseId !== scope.releaseId ||
    value.unitId !== scope.unitId
  )
    throw Error("Challenge ownership or scope mismatch.");
  return value;
}
function summary(raw: unknown, owner: string, scope: ChallengeScope) {
  return raw === undefined
    ? initial(owner, scope)
    : owned(challengeSummarySchema.parse(raw), owner, scope);
}
function attempt(raw: unknown, owner: string, scope: ChallengeScope, id: string) {
  const value = owned(challengeAttemptSchema.parse(raw), owner, scope);
  if (
    value.attemptId !== id ||
    (value.status === "submitted"
      ? value.submittedAt === null ||
        value.correctCount === null ||
        value.passed === null ||
        // Accepted historical 6/8 and 7/8 failures retain their original verdict.
        (value.passed &&
          !challengeScoreClears(
            value.correctCount,
            challengeForms[scope.unitId][value.formId].length,
          )) ||
        (!value.passed &&
          value.correctCount === challengeForms[scope.unitId][value.formId].length) ||
        value.submissionDigest === null
      : value.submittedAt !== null ||
        value.passed !== null ||
        value.correctCount !== null ||
        value.submissionDigest !== null)
  )
    throw Error("Invalid challenge attempt.");
  return value;
}
/** Read-only projection: earlier qualifying attempts also keep clearance monotonic. */
async function clearanceSummary(
  db: Firestore,
  owner: string,
  scope: ChallengeScope,
  saved: ChallengeSummary,
  tx?: Transaction,
): Promise<ChallengeSummary> {
  if (saved.clearedAt !== null || saved.attemptCount === 0) return saved;
  const collection = db.collection(`${challengePath(owner, scope)}/attempts`);
  const rows = tx ? await tx.get(collection) : await collection.get();
  const qualifying = rows.docs
    .map((row) => attempt(row.data(), owner, scope, row.id))
    .filter(
      (row) =>
        row.status === "submitted" &&
        challengeScoreClears(row.correctCount!, challengeForms[scope.unitId][row.formId].length),
    );
  if (!qualifying.length) return saved;
  return {
    ...saved,
    clearedAt: Math.min(...qualifying.map((row) => row.submittedAt!)),
    retryAfter: null,
  };
}
function view(
  summary: ChallengeSummary,
  attempt: ChallengeAttempt | null,
  serverNow: number,
): ChallengeView {
  const items =
    attempt?.status === "in-progress"
      ? challengeForms[summary.unitId][attempt.formId].map(
          ({ acceptedAnswers: _answers, caseSensitive: _case, ...item }) => item,
        )
      : [];
  return { summary, attempt, items, serverNow };
}
export async function readUnitChallenge(
  db: Firestore,
  owner: string,
  input: ChallengeScope,
  now = Date.now(),
) {
  const scope = scopeOf(input),
    path = challengePath(owner, scope);
  const row = (await db.getAll(db.doc(path)))[0];
  const saved = await clearanceSummary(db, owner, scope, summary(row.data(), owner, scope));
  const id = saved.activeAttemptId ?? saved.lastAttemptId;
  const savedAttempt = id
    ? attempt((await db.getAll(db.doc(`${path}/attempts/${id}`)))[0].data(), owner, scope, id)
    : null;
  return view(saved, savedAttempt, now);
}
export async function readChallengeClearances(
  db: Firestore,
  owner: string,
  scope: Omit<ChallengeScope, "unitId">,
) {
  const results = await Promise.all(
    Object.keys(challengeForms).map(async (unitId) => {
      const requested = scopeOf({ ...scope, unitId });
      const row = (await db.getAll(db.doc(challengePath(owner, requested))))[0];
      return clearanceSummary(db, owner, requested, summary(row.data(), owner, requested));
    }),
  );
  return results.filter((row) => row.clearedAt !== null).map((row) => row.unitId);
}
export async function startChallenge(
  db: Firestore,
  owner: string,
  input: unknown,
  now = Date.now(),
) {
  const request = challengeStartSchema.parse(input);
  const scope = scopeOf({
    trackId: request.trackId,
    releaseId: request.releaseId,
    unitId: request.unitId,
  });
  const path = challengePath(owner, scope);
  return db.runTransaction(async (tx) => {
    const ref = db.doc(path),
      requestedRef = db.doc(`${path}/attempts/${request.attemptId}`);
    const saved = await clearanceSummary(
      db,
      owner,
      scope,
      summary((await tx.get(ref)).data(), owner, scope),
      tx,
    );
    const existing = (await tx.get(requestedRef)).data();
    const authoritativeId =
      saved.activeAttemptId ?? (saved.clearedAt !== null ? saved.lastAttemptId : null);
    if (authoritativeId) {
      const authoritative = attempt(
        (await tx.get(db.doc(`${path}/attempts/${authoritativeId}`))).data(),
        owner,
        scope,
        authoritativeId,
      );
      return view(saved, authoritative, now);
    }
    if (existing !== undefined)
      return view(saved, attempt(existing, owner, scope, request.attemptId), now);
    if (saved.retryAfter !== null && now < saved.retryAfter)
      throw Error("Try again later: challenges have a 24-hour retry interval.");
    const draft: ChallengeAttempt = {
      ...scope,
      ownerId: owner,
      schemaVersion: 1,
      purpose: "unit-challenge",
      contractVersion: 1,
      attemptId: request.attemptId,
      formId: saved.attemptCount % 2 ? "B" : "A",
      status: "in-progress",
      startedAt: now,
      submittedAt: null,
      passed: null,
      correctCount: null,
      submissionDigest: null,
    };
    const next = {
      ...saved,
      revision: saved.revision + 1,
      attemptCount: saved.attemptCount + 1,
      activeAttemptId: draft.attemptId,
    };
    tx.set(ref, next);
    tx.set(requestedRef, draft);
    return view(next, draft, now);
  });
}
export function scoreChallenge(
  scope: ChallengeScope,
  formId: "A" | "B",
  responses: readonly { itemId: string; response: string }[],
) {
  scopeOf(scope);
  const items = challengeForms[scope.unitId][formId];
  if (
    responses.length !== items.length ||
    new Set(responses.map((r) => r.itemId)).size !== items.length ||
    responses.some((r) => !items.some((i) => i.id === r.itemId) || !r.response.trim())
  )
    throw Error("Answer each challenge item exactly once.");
  const ordered = items.map((item) => responses.find((r) => r.itemId === item.id)!);
  const correctCount = items.filter((item, index) =>
    item.options
      ? item.acceptedAnswers.includes(ordered[index].response)
      : item.acceptedAnswers.some(
          (answer) =>
            normalizeLessonAnswer(answer, item.caseSensitive, true) ===
            normalizeLessonAnswer(ordered[index].response, item.caseSensitive, true),
        ),
  ).length;
  return { correctCount, passed: challengeScoreClears(correctCount, items.length), ordered };
}
export async function submitChallenge(
  db: Firestore,
  owner: string,
  input: unknown,
  now = Date.now(),
) {
  const request = challengeSubmitSchema.parse(input);
  const scope = scopeOf({
    trackId: request.trackId,
    releaseId: request.releaseId,
    unitId: request.unitId,
  });
  const path = challengePath(owner, scope);
  return db.runTransaction(async (tx) => {
    const ref = db.doc(path),
      attemptRef = db.doc(`${path}/attempts/${request.attemptId}`);
    const saved = await clearanceSummary(
      db,
      owner,
      scope,
      summary((await tx.get(ref)).data(), owner, scope),
      tx,
    );
    const draft = attempt((await tx.get(attemptRef)).data(), owner, scope, request.attemptId);
    const scored = scoreChallenge(scope, draft.formId, request.responses);
    const digest = createHash("sha256")
      .update(JSON.stringify([scope, draft.attemptId, draft.formId, scored.ordered]))
      .digest("hex");
    if (draft.status === "submitted") {
      if (draft.submissionDigest !== digest)
        throw Error("This challenge was already submitted with different answers.");
      return view(saved, draft, now);
    }
    if (saved.activeAttemptId !== draft.attemptId)
      throw Error("This challenge is no longer active.");
    const finished: ChallengeAttempt = {
      ...draft,
      status: "submitted",
      submittedAt: now,
      passed: scored.passed,
      correctCount: scored.correctCount,
      submissionDigest: digest,
    };
    const next: ChallengeSummary = {
      ...saved,
      revision: saved.revision + 1,
      activeAttemptId: null,
      lastAttemptId: draft.attemptId,
      clearedAt: scored.passed ? (saved.clearedAt ?? now) : saved.clearedAt,
      retryAfter: scored.passed ? null : now + CHALLENGE_RETRY_MS,
    };
    tx.set(attemptRef, finished);
    tx.set(ref, next);
    return view(next, finished, now);
  });
}
