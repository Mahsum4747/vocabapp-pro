import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { unit1Check as definition, unit1CheckB } from "@/content/curriculum/german-a1-unit1-check";
import { germanA1 } from "@/content/curriculum/german-a1";
import { validateCurriculum } from "./validate";
import {
  gradeAssessment,
  projectOutcomes,
  validateAttempt,
  submitAssessmentSchema,
} from "./assessment";
import {
  createAssessmentAttempt,
  readAssessmentAttempt,
  readLatestAssessment,
  submitAssessmentAttempt,
  assessmentAttemptPath,
  ASSESSMENT_REQUEST,
} from "./assessment.server";
import {
  courseProgressPath,
  lessonDefinitionHash,
  requireCourseAuthentication,
  saveCourseProgress,
} from "./course-progress.server";
import { initialProgress, lessonResumeContractVersion } from "./course-progress";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { deleteLearningData } from "../account-deletion.server";
import { USER_SUBCOLLECTIONS } from "../user-data-inventory";

const owner = "assessment-test-owner";
const answers = definition.items.map((item) => ({
  itemId: item.id,
  response: item.acceptedAnswers[0],
}));
function fixture() {
  const initial = Object.fromEntries(
    germanA1.lessons.slice(0, 4).map((lesson) => {
      const value = initialProgress(lesson, lessonDefinitionHash(lesson));
      return [
        courseProgressPath(owner, {
          trackId: definition.trackId,
          releaseId: definition.releaseId,
          lessonId: lesson.id,
        }),
        {
          ...value,
          firstFinishedAt: 10,
          updatedAt: 10,
          currentStepId: null,
          completedStepIds: lesson.steps.map((s) => s.id),
        },
      ];
    }),
  );
  return fakeProgressDb(initial);
}
async function start(storage = fixture(), id = randomUUID()) {
  const request = { ...ASSESSMENT_REQUEST, attemptId: id };
  const attempt = await createAssessmentAttempt(storage.db, owner, request, 100);
  return { storage, request, attempt };
}

test("exact original prototype definition: eight items, five types, six narrow groups", () => {
  assert.equal(definition.id, "DE.A1.U01.CHECK.PROTOTYPE.1");
  assert.equal(definition.status, "prototype");
  assert.equal(definition.compatibilityVersion, 1);
  assert.equal(definition.unitId, "DE.A1.U01");
  assert.equal(definition.releaseId, germanA1.id);
  assert.deepEqual(
    definition.items.map((i) => i.id),
    Array.from({ length: 8 }, (_, i) => `U01.C0${i + 1}`),
  );
  assert.deepEqual(
    definition.items.map((i) => i.type),
    [
      "choice",
      "choice",
      "construction",
      "reading-extraction",
      "reading-extraction",
      "construction",
      "bounded-text",
      "supported-field",
    ],
  );
  assert.deepEqual(
    definition.items.map((i) => i.targetId),
    [
      "U01.person",
      "U01.articles",
      "U01.question",
      "U01.details",
      "U01.details",
      "U01.statements",
      "U01.statements",
      "U01.form",
    ],
  );
  assert.equal(new Set(definition.targets.map((t) => t.id)).size, 6);
});
test("registry/prerequisite graph remains valid with exactly 100 skills and four authored Unit 1 lessons", () => {
  assert.equal(germanA1.skills.length, 100);
  assert.equal(
    germanA1.lessons.filter((l) => l.unitId === "DE.A1.U01" && l.availability === "prototype")
      .length,
    4,
  );
  assert.deepEqual(validateCurriculum(germanA1), []);
});
test("taught German repertoire: only Unit 1 forms, familiar nouns/predicates, numbers and fictional names", () => {
  const allowed = new Set(
    "Anja Omar Sara Ben Timo wer bist du ich bin die Büro der Telefon das Nummer Datum ist groß klein habe zwei Telefone ein 12 1 03 02 2"
      .toLocaleLowerCase("de")
      .split(" "),
  );
  for (const item of definition.items) {
    const german = [item.stimulus ?? "", ...(item.options ?? []), ...item.acceptedAnswers].join(
      " ",
    );
    for (const word of german.toLocaleLowerCase("de").match(/[\p{L}]+|\d+/gu) ?? [])
      assert.ok(allowed.has(word), word);
  }
  assert.ok(
    definition.targets.find((t) => t.id === "U01.form")!.scope.includes("labelled Name field"),
  );
});
test("new exchanges, contrastive details and construction tasks are not copied lesson fixtures", () => {
  const lessonCopy = JSON.stringify(germanA1.lessons.slice(0, 4));
  const tasks = JSON.stringify(definition.items);
  for (const oldName of ["Mira", "Nora", "Leo", "Emil", "Lina"])
    assert.ok(!tasks.includes(oldName));
  for (const item of definition.items) {
    assert.ok(!lessonCopy.includes(item.prompt));
    if (item.stimulus) assert.ok(!lessonCopy.includes(JSON.stringify(item.stimulus).slice(1, -1)));
  }
  assert.ok(definition.items[4].stimulus!.includes("02.12"));
});
test("deterministic grading permits bounded normalization but rejects material mistakes", () => {
  assert.ok(gradeAssessment(definition, answers).every((r) => r.correct));
  const variation = structuredClone(answers);
  variation[2].response = "  Bist  du Sara!  ";
  variation[4].response = "2.12";
  assert.ok(gradeAssessment(definition, variation).every((r) => r.correct));
  variation[5].response = "Ich hat zwei Telefone.";
  variation[6].response = "Das telefon ist klein.";
  assert.deepEqual(
    gradeAssessment(definition, variation).map((r) => r.correct),
    [true, true, true, true, true, false, false, true],
  );
});
test("unknown, repeated, missing items, invalid choices and response/version/owner injection are rejected", () => {
  for (const invalid of [
    answers.slice(1),
    [...answers, answers[0]],
    answers.map((r, i) => (i === 0 ? { ...r, itemId: "unknown" } : r)),
  ])
    assert.throws(() => gradeAssessment(definition, invalid));
  assert.throws(() =>
    gradeAssessment(
      definition,
      answers.map((r, i) => (i === 0 ? { ...r, response: "unlisted" } : r)),
    ),
  );
  assert.throws(() =>
    submitAssessmentSchema.parse({
      ...ASSESSMENT_REQUEST,
      attemptId: randomUUID(),
      responses: answers,
      ownerId: "someone-else",
    }),
  );
  assert.throws(() =>
    submitAssessmentSchema.parse({
      ...ASSESSMENT_REQUEST,
      attemptId: randomUUID(),
      responses: answers.map((r) => ({ ...r, response: "x".repeat(161) })),
    }),
  );
});
test("explicit start writes a draft once; draft has no responses/evidence and duplicate start is read-only", async () => {
  const { storage, request, attempt } = await start();
  assert.equal(attempt.status, "in-progress");
  assert.equal(attempt.startedAt, 100);
  assert.equal(attempt.finishedAt, null);
  assert.deepEqual(
    attempt.itemOrder,
    definition.items.map((i) => i.id),
  );
  assert.deepEqual(attempt.evidence, []);
  assert.deepEqual(attempt.responses, []);
  assert.deepEqual(await createAssessmentAttempt(storage.db, owner, request, 200), attempt);
  assert.equal(storage.writes.length, 1);
});
test("server gates start on historical completion of all four lessons without creating evidence", async () => {
  const storage = fixture();
  const path = [...storage.records.keys()][3];
  storage.records.delete(path);
  await assert.rejects(
    createAssessmentAttempt(storage.db, owner, { ...ASSESSMENT_REQUEST, attemptId: randomUUID() }),
    /four/,
  );
  assert.equal(storage.writes.length, 0);
  assert.equal(await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST), null);
});
test("lesson completion and Unit completion are traversal only; reads create no attempt/evidence", async () => {
  const storage = fixture();
  assert.equal(storage.records.size, 4);
  assert.equal(await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST), null);
  assert.ok([...storage.records.keys()].every((p) => p.includes("/courseProgress/")));
  assert.deepEqual(storage.writes, []);
});
test("successful final submit atomically persists eight immutable events and classified responses", async () => {
  const { storage, request, attempt } = await start();
  const result = await submitAssessmentAttempt(
    storage.db,
    owner,
    { ...request, responses: answers },
    200,
  );
  assert.equal(result.kind, "accepted");
  assert.equal(result.attempt.status, "submitted");
  assert.equal(result.attempt.finishedAt, 200);
  assert.equal(result.attempt.evidence.length, 8);
  assert.equal(result.attempt.responses.length, 8);
  assert.ok(
    result.attempt.evidence.every(
      (e) =>
        e.learnerId === owner &&
        e.timestamp === 200 &&
        e.provenance === "assessment" &&
        e.assessmentAttemptId === attempt.attemptId,
    ),
  );
  assert.equal(new Set(result.attempt.evidence.map((e) => e.id)).size, 8);
  assert.ok(!JSON.stringify(result.attempt).includes("Ich habe zwei Telefone"));
  assert.equal(storage.writes.length, 2);
});
test("identical retries including response order changes are idempotent with no duplicate events/writes", async () => {
  const { storage, request } = await start();
  const submission = { ...request, responses: answers };
  const first = await submitAssessmentAttempt(storage.db, owner, submission, 200);
  assert.deepEqual(
    await submitAssessmentAttempt(
      storage.db,
      owner,
      { ...submission, responses: [...answers].reverse() },
      300,
    ),
    first,
  );
  assert.equal(storage.writes.length, 2);
  assert.equal(storage.records.size, 5);
});
test("two concurrent tabs: one winner; changed retry cannot overwrite or duplicate evidence", async () => {
  const { storage, request } = await start();
  const other = answers.map((r, i) => (i === 3 ? { ...r, response: "12" } : r));
  const results = await Promise.all([
    submitAssessmentAttempt(storage.db, owner, { ...request, responses: answers }, 200),
    submitAssessmentAttempt(storage.db, owner, { ...request, responses: other }, 201),
  ]);
  assert.deepEqual(results.map((r) => r.kind).sort(), ["accepted", "conflict"]);
  assert.deepEqual(results[0].attempt, results[1].attempt);
  assert.equal(storage.writes.length, 2);
  assert.equal(results[0].attempt.evidence.length, 8);
});
test("alternate retake preserves history and classifies each target without averaging", async () => {
  const { storage, request } = await start();
  const first = await submitAssessmentAttempt(
    storage.db,
    owner,
    { ...request, responses: answers },
    200,
  );
  const second = await start(storage);
  assert.notEqual(second.request.attemptId, request.attemptId);
  assert.deepEqual(
    await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST),
    first.attempt,
  );
  const mixed = unit1CheckB.items
    .map((item) => ({ itemId: item.id, response: item.acceptedAnswers[0] }))
    .map((r, i) => ([3, 5].includes(i) ? { ...r, response: "wrong" } : r));
  const next = await submitAssessmentAttempt(
    storage.db,
    owner,
    { ...second.request, responses: mixed },
    300,
  );
  assert.deepEqual(await readAssessmentAttempt(storage.db, owner, request), first.attempt);
  assert.deepEqual(await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST), next.attempt);
  assert.deepEqual(
    projectOutcomes(definition, next.attempt).map((p) => p.state),
    [
      "demonstrated in one observation",
      "demonstrated in one observation",
      "demonstrated in one observation",
      "needs more evidence",
      "needs more evidence",
      "demonstrated in one observation",
    ],
  );
});
test("no observation is no evidence; drafts and incompatible attempts do not project; no mastery/CEFR percentage", async () => {
  const { attempt } = await start();
  for (const a of [null, attempt, { ...attempt, compatibilityVersion: 99 }])
    assert.ok(projectOutcomes(definition, a).every((p) => p.state === "no evidence"));
  assert.ok(!/master|percent|cefr/i.test(JSON.stringify(projectOutcomes(definition, null))));
  assert.ok(
    definition.targets.every(
      (t) =>
        !/(speaking ability|free writing ability|full nominative|gender mastery)/i.test(t.label),
    ),
  );
});
test("reads, successful/duplicate submit and retakes leave every course/legacy document unchanged", async () => {
  const storage = fixture();
  for (const path of [
    `users/${owner}/cardProgress/card`,
    `grammarProgress/${owner}`,
    `lesenProgress/${owner}`,
    `users/${owner}/grammarPasteTopics/topic`,
    `users/${owner}/lesenPasteTopics/topic`,
  ])
    storage.records.set(path, { sentinel: true });
  const before = structuredClone([...storage.records]);
  const { request } = await start(storage);
  await readAssessmentAttempt(storage.db, owner, request);
  await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST);
  assert.equal(storage.writes.length, 1);
  await submitAssessmentAttempt(storage.db, owner, { ...request, responses: answers }, 200);
  await submitAssessmentAttempt(storage.db, owner, { ...request, responses: answers }, 201);
  await start(storage);
  for (const [path, value] of before) assert.deepEqual(storage.records.get(path), value);
  assert.ok(storage.writes.every((p) => p.startsWith(`users/${owner}/assessmentAttempts/`)));
});
test("account deletion removes drafts, accepted attempts and embedded events even without a parent user document", async () => {
  assert.ok(USER_SUBCOLLECTIONS.includes("assessmentAttempts"));
  const { storage, request } = await start();
  await submitAssessmentAttempt(storage.db, owner, { ...request, responses: answers }, 200);
  await start(storage);
  storage.records.set("users/other/assessmentAttempts/keep", { sentinel: true });
  await deleteLearningData(storage.db, owner);
  assert.deepEqual([...storage.records.keys()], ["users/other/assessmentAttempts/keep"]);
});
test("unknown attempt, different owner and invalid/stale compatibility version rejected without writes", async () => {
  const { storage, request } = await start();
  const count = storage.writes.length;
  await assert.rejects(
    readAssessmentAttempt(storage.db, owner, { ...request, attemptId: randomUUID() }),
    /Unknown/,
  );
  await assert.rejects(readAssessmentAttempt(storage.db, "different-owner", request), /Unknown/);
  for (const compatibilityVersion of [0, 2]) {
    await assert.rejects(
      createAssessmentAttempt(storage.db, owner, { ...request, compatibilityVersion }),
    );
    await assert.rejects(
      submitAssessmentAttempt(storage.db, owner, {
        ...request,
        compatibilityVersion,
        responses: answers,
      }),
    );
    await assert.rejects(
      readLatestAssessment(storage.db, owner, { ...ASSESSMENT_REQUEST, compatibilityVersion }),
    );
  }
  assert.equal(storage.writes.length, count);
  assert.throws(() => assessmentAttemptPath("", request.attemptId));
});
test("strict stored contract rejects edited result provenance/order/status and preserves compatibility across copy edits", async () => {
  const { storage, request } = await start();
  const { attempt } = await submitAssessmentAttempt(
    storage.db,
    owner,
    { ...request, responses: answers },
    200,
  );
  assert.deepEqual(
    validateAttempt(
      attempt,
      {
        ...definition,
        items: definition.items.map((i) => ({ ...i, prompt: i.prompt + " Updated wording." })),
      },
      owner,
    ),
    attempt,
  );
  for (const bad of [
    { ...attempt, itemOrder: [...attempt.itemOrder].reverse() },
    { ...attempt, status: "in-progress" },
    { ...attempt, evidence: attempt.evidence.map((e, i) => (i ? e : { ...e, correct: false })) },
  ])
    assert.throws(() => validateAttempt(bad, definition, owner));
});
test("auth-off preview denied; every server API uses verified auth and rejects before Firebase initialization", async () => {
  const previous = process.env.VITE_AUTH_ENABLED;
  process.env.VITE_AUTH_ENABLED = "false";
  try {
    await assert.rejects(requireCourseAuthentication(), /Unauthorized/);
  } finally {
    if (previous === undefined) delete process.env.VITE_AUTH_ENABLED;
    else process.env.VITE_AUTH_ENABLED = previous;
  }
  const source = readFileSync("src/lib/curriculum/assessment-api.ts", "utf8");
  assert.equal((source.match(/middleware\(\[authMiddleware\]\)/g) || []).length, 5);
  assert.equal((source.match(/context.userId/g) || []).length, 5);
  for (const handler of source.split(".handler").slice(1))
    assert.ok(
      handler.indexOf("await requireCourseAuthentication()") <
        handler.indexOf('import("../firebase-admin.server")'),
    );
});
test("lesson restart preserves historical completion and never adds assessment events", async () => {
  const storage = fixture();
  const lesson = germanA1.lessons[0];
  const result = await saveCourseProgress(
    storage.db,
    owner,
    {
      trackId: definition.trackId,
      releaseId: definition.releaseId,
      lessonId: lesson.id,
      resumeContractVersion: lessonResumeContractVersion(lesson),
      expectedRevision: 0,
      operationId: randomUUID(),
      action: { type: "restart" },
    },
    300,
  );
  assert.equal(result.kind, "saved");
  assert.ok(storage.writes.every((p) => p.includes("/courseProgress/")));
  assert.equal(await readLatestAssessment(storage.db, owner, ASSESSMENT_REQUEST), null);
});
