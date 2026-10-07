import { checkpointAvailable } from "./checkpoint-access";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { cp1 } from "@/content/curriculum/german-a1-cp1";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit1CheckForms } from "@/content/curriculum/german-a1-unit1-check";
import { unit2CheckForms } from "@/content/curriculum/german-a1-unit2-check";
import { unit3CheckForms } from "@/content/curriculum/german-a1-unit3-check";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { CP1_REQUEST, projectCheckpoint, checkpointFollowups } from "./checkpoint";
import { gradeAssessment, submitAssessmentSchema, validateAttempt } from "./assessment";
import { nextFormLabel, projectOutcomes } from "./assessment-projection";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
} from "./assessment.server";
import { assessmentForUnit, registeredAssessment } from "./assessment-registry";
import { COURSE_SCOPE } from "./course-progress";
import { startChallenge, submitChallenge, readChallengeClearances } from "./challenge.server";
import { sessionKey } from "./lesson-session";
import { courseLearningAction } from "./unit-progress";
import { deleteLearningData } from "../account-deletion.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { readCourseProgress, saveCourseProgress } from "./course-progress.server";
import type { ProgressCommand } from "./course-progress";
import type { LessonDefinition } from "./types";
const USER_ID = "cp1-test-owner";
const command = (
  lesson: LessonDefinition,
  revision: number,
  action: ProgressCommand["action"],
): ProgressCommand => ({
  ...COURSE_SCOPE,
  lessonId: lesson.id,
  resumeContractVersion: 1,
  expectedRevision: revision,
  operationId: randomUUID(),
  action,
});
async function finish(
  s: ReturnType<typeof fakeProgressDb>,
  lesson: LessonDefinition,
  user = USER_ID,
) {
  const previous = (await readCourseProgress(s.db, user, COURSE_SCOPE)).lessons.find(
    (row) => row.lessonId === lesson.id,
  )?.progress;
  let revision = previous?.revision ?? 0;
  for (const step of lesson.steps.slice(previous?.completedStepIds.length ?? 0)) {
    if (step.kind !== "explanation") {
      const result = await saveCourseProgress(
        s.db,
        user,
        command(lesson, revision, {
          type: "check",
          stepId: step.id,
          ...(step.kind !== "original"
            ? { response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0] }
            : {}),
        }),
        100,
      );
      assert.equal(result.kind, "saved");
      revision++;
    }
    const result = await saveCourseProgress(
      s.db,
      user,
      command(lesson, revision, { type: "continue", stepId: step.id }),
      101,
    );
    assert.equal(result.kind, "saved");
    revision++;
  }
}

function courseProgressFixture() {
  const storage = fakeProgressDb();
  return {
    storage,
    advanceLesson: async (index: number, steps: number) => {
      assert.equal(steps, germanA1.lessons[index].steps.length);
      await finish(storage, germanA1.lessons[index]);
    },
  };
}
const responses = () =>
  cp1.items.map((item) => ({ itemId: item.id, response: item.acceptedAnswers[0] }));
const attemptRequest = () => ({ ...CP1_REQUEST, attemptId: randomUUID() });
async function completed() {
  const f = courseProgressFixture();
  for (let i = 0; i < 12; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
  return f;
}
test("CP1 original 14 integrated tasks, seven precise groups, explicit shapes and bounded form/sentences", () => {
  assert.equal(cp1.items.length, 14);
  assert.equal(cp1.targets.length, 7);
  assert.equal(registeredAssessment(cp1.id).kind, "checkpoint");
  assert.equal(assessmentForUnit(cp1.unitId), undefined);
  assert.equal(assessmentForUnit("DE.A1.U03")!.definition.id, unit3CheckForms[0].id);
  assert(cp1.items.some((item) => item.type === "supported-field"));
  assert(cp1.items.filter((item) => item.acceptedAnswers[0].split(". ").length >= 2).length >= 3);
  const checks = [...unit1CheckForms, ...unit2CheckForms, ...unit3CheckForms].flatMap(
    (form) => form.items,
  );
  for (const item of cp1.items) {
    assert(!checks.some((old) => old.prompt === item.prompt && old.stimulus === item.stimulus));
    assert(item.acceptedAnswers.every((answer) => answer.length <= 160));
    assert(/Type|Write|write|Copy/.test(item.prompt));
  }
  for (const target of cp1.targets)
    assert(
      checkpointFollowups[target.id].every((id) =>
        germanA1.lessons.slice(0, 12).some((lesson) => lesson.id === id),
      ),
    );
});
test("deterministic scoring accepts bounded variants/keyboard, rejects wrong meaning, missing duplicate and oversized payloads", () => {
  assert(gradeAssessment(cp1, responses()).every((row) => row.correct));
  const answers = responses();
  answers[2].response = "Ich heiße Mara. Ich wohne in Bonn.";
  answers[11].response = "Ich kaufe gern Buecher.";
  answers[5].response = "Die Buecher sind nicht groß.";
  assert(gradeAssessment(cp1, answers).every((row) => row.correct));
  answers[5].response = "Die Bücher sind nicht gross.";
  assert(gradeAssessment(cp1, answers).every((row) => row.correct));
  answers[8].response = "Ich brauche ein Buch. Ich brauche einen Stift.";
  assert.equal(gradeAssessment(cp1, answers)[8].correct, false);
  assert.throws(() => gradeAssessment(cp1, answers.slice(1)));
  assert.throws(() => gradeAssessment(cp1, [...answers.slice(1), answers[1]]));
  assert.throws(() =>
    submitAssessmentSchema.parse({ ...attemptRequest(), responses: [...answers, ...answers] }),
  );
  assert.throws(() =>
    submitAssessmentSchema.parse({
      ...attemptRequest(),
      responses: [{ itemId: "test", response: "x".repeat(161) }],
    }),
  );
});
test("historical Unit 3 eligibility still requires all four lessons; foreign completion cannot grant access", async () => {
  const f = courseProgressFixture();
  const r = attemptRequest();
  assert.deepEqual(await readAssessmentHistory(f.storage.db, USER_ID, CP1_REQUEST), []);
  assert.equal(f.storage.writes.length, 0);
  await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, r), /Unit 3/);
  for (let i = 0; i < 8; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
  for (let i = 8; i < 11; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
  await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, r), /Unit 3/);
  await f.advanceLesson(11, germanA1.lessons[11].steps.length);
  await createAssessmentAttempt(f.storage.db, USER_ID, r);
  await assert.rejects(
    createAssessmentAttempt(f.storage.db, "other-owner", attemptRequest()),
    /Unit 3/,
  );
});
test("Unit 2 challenge then actual U3 completion permits CP1, without fake U1/U2 lessons or clearing U4", async () => {
  const f = courseProgressFixture();
  for (const unitId of ["DE.A1.U01", "DE.A1.U02"]) {
    const draft = await startChallenge(
      f.storage.db,
      USER_ID,
      { ...COURSE_SCOPE, unitId, attemptId: randomUUID() },
      100,
    );
    await submitChallenge(
      f.storage.db,
      USER_ID,
      {
        ...COURSE_SCOPE,
        unitId,
        attemptId: draft.attempt!.attemptId,
        responses: challengeForms[unitId].A.map((item) => ({
          itemId: item.id,
          response: item.acceptedAnswers[0],
        })),
      },
      101,
    );
  }
  await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, attemptRequest()), /Unit 3/);
  for (let i = 8; i < 12; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
  const before = structuredClone(f.storage.records);
  await createAssessmentAttempt(f.storage.db, USER_ID, attemptRequest());
  for (const [path, value] of before) assert.deepEqual(f.storage.records.get(path), value);
  assert(
    ![...f.storage.records.keys()].some(
      (path) =>
        path.includes("/courseProgress/") &&
        JSON.stringify(f.storage.records.get(path)).includes("U02.L"),
    ),
  );
  const sessionRecords = Object.fromEntries(
    germanA1.lessons.slice(8, 12).map((lesson) => [
      sessionKey(germanA1.id, lesson.id),
      {
        releaseId: germanA1.id,
        lessonId: lesson.id,
        historicallyFinished: true,
        status: "finished",
        stepIndex: lesson.steps.length - 1,
        responses: {},
        attempts: {},
        feedback: null,
      },
    ]),
  ) as Parameters<typeof courseLearningAction>[1];
  assert(checkpointAvailable(sessionRecords, []));
  assert.equal(checkpointAvailable(sessionRecords, []), true);
  assert.equal(
    courseLearningAction(germanA1, sessionRecords, [], ["DE.A1.U01", "DE.A1.U02"]).unit!.id,
    "DE.A1.U04",
  );
});
test("durable submission, exact review, latest result gaps, same-family retry, owner/version/assessment isolation and atomic conflicts", async () => {
  const f = await completed();
  const r = attemptRequest();
  const before = structuredClone(f.storage.records);
  const draft = await createAssessmentAttempt(f.storage.db, USER_ID, r, 1000);
  assert.equal(draft.responses.length, 0);
  assert.deepEqual(await createAssessmentAttempt(f.storage.db, USER_ID, r, 1001), draft);
  const answers = responses();
  answers[9].response = "2 Euro";
  answers[13].response = "wrong";
  const first = await submitAssessmentAttempt(
    f.storage.db,
    USER_ID,
    { ...r, responses: answers },
    1002,
  );
  assert.equal(first.kind, "accepted");
  assert.equal(first.attempt.responses.filter((row) => row.correct).length, 12);
  const groups = projectCheckpoint(first.attempt, USER_ID);
  assert.deepEqual(
    groups.filter((row) => !row.demonstrated).map((row) => row.id),
    ["CP1.details", "CP1.revision"],
  );
  assert.deepEqual(groups.find((row) => row.id === "CP1.revision")!.lessonIds, [
    "DE.A1.U02.L04",
    "DE.A1.U03.L04",
  ]);
  assert.throws(() => projectCheckpoint(first.attempt, "other-owner"));
  await assert.rejects(readAssessmentAttempt(f.storage.db, "other-owner", r), /Unknown/);
  await assert.rejects(
    readAssessmentAttempt(f.storage.db, USER_ID, { ...r, assessmentId: unit1CheckForms[0].id }),
    /another assessment/,
  );
  assert.throws(() => validateAttempt({ ...first.attempt, compatibilityVersion: 2 }, cp1, USER_ID));
  const writes = f.storage.writes.length;
  assert.equal(
    (
      await submitAssessmentAttempt(f.storage.db, USER_ID, {
        ...r,
        responses: [...answers].reverse(),
      })
    ).kind,
    "accepted",
  );
  assert.equal(
    (await submitAssessmentAttempt(f.storage.db, USER_ID, { ...r, responses: responses() })).kind,
    "conflict",
  );
  assert.equal(f.storage.writes.length, writes);
  const retry = attemptRequest();
  await createAssessmentAttempt(f.storage.db, USER_ID, retry, 1003);
  const final = await submitAssessmentAttempt(
    f.storage.db,
    USER_ID,
    { ...retry, responses: responses() },
    1004,
  );
  const history = await readAssessmentHistory(f.storage.db, USER_ID, CP1_REQUEST);
  assert.equal(history.length, 2);
  assert.equal(history[0].attemptId, retry.attemptId);
  assert(projectCheckpoint(final.attempt, USER_ID).every((row) => row.demonstrated));
  assert.equal(projectCheckpoint(history[1], USER_ID).filter((row) => !row.demonstrated).length, 2);
  assert.equal(nextFormLabel(history, cp1, USER_ID).repeated, true);
  assert(
    projectOutcomes(cp1, history, USER_ID).every(
      (row) => row.state !== "confirmed in an alternate form",
    ),
  );
  for (const [path, value] of before) assert.deepEqual(f.storage.records.get(path), value);
  for (const [path, value] of f.storage.records)
    if (path.includes("assessmentAttempts")) {
      assert(!JSON.stringify(value).includes('"response":'));
      assert(!JSON.stringify(value).includes("Mara kauft"));
      assert.equal((value as { schemaVersion: number }).schemaVersion, 2);
    }
  assert(
    f.storage.writes
      .slice(writes)
      .every((path) => path.startsWith(`users/${USER_ID}/assessmentAttempts/`)),
  );
});
test("CP1 cannot contaminate any Unit Check history/projection; account deletion removes owned CP1 attempts only", async () => {
  const f = await completed();
  const r = attemptRequest();
  await createAssessmentAttempt(f.storage.db, USER_ID, r);
  await submitAssessmentAttempt(f.storage.db, USER_ID, { ...r, responses: responses() });
  for (const forms of [unit1CheckForms, unit2CheckForms, unit3CheckForms]) {
    const request = { assessmentId: forms[0].id, compatibilityVersion: 1 };
    assert.deepEqual(await readAssessmentHistory(f.storage.db, USER_ID, request), []);
    assert(
      projectOutcomes(
        forms[0],
        await readAssessmentHistory(f.storage.db, USER_ID, CP1_REQUEST),
        USER_ID,
      ).every((row) => row.state === "no evidence"),
    );
    const check = { ...request, attemptId: randomUUID() };
    await createAssessmentAttempt(f.storage.db, USER_ID, check);
    await submitAssessmentAttempt(f.storage.db, USER_ID, {
      ...check,
      responses: forms[0].items.map((item) => ({
        itemId: item.id,
        response: item.acceptedAnswers[0],
      })),
    });
    assert.equal((await readAssessmentHistory(f.storage.db, USER_ID, request)).length, 1);
  }
  assert.equal((await readAssessmentHistory(f.storage.db, USER_ID, CP1_REQUEST)).length, 1);
  f.storage.records.set("users/other-owner/assessmentAttempts/other", { retained: true });
  await deleteLearningData(f.storage.db, USER_ID);
  assert(![...f.storage.records.keys()].some((path) => path.startsWith(`users/${USER_ID}/`)));
  assert(f.storage.records.has("users/other-owner/assessmentAttempts/other"));
});
test("checkpoint adapters bind CP1 identity; generic assessment APIs authenticate verified owner", () => {
  const api = readFileSync("src/lib/curriculum/assessment-api.ts", "utf8");
  assert.equal((api.match(/\.middleware\(\[authMiddleware\]\)/g) ?? []).length, 5);
  assert.equal((api.match(/context.userId/g) ?? []).length, 5);
  assert(!api.includes("data.userId"));
  const checkpoint = readFileSync("src/components/learn/checkpoint-screen.tsx", "utf8");
  assert(checkpoint.includes("...request"));
  assert(checkpoint.includes("assessmentForm(assessmentId, record.formId)"));
  const screen = readFileSync("src/components/learn/unit-check-screen.tsx", "utf8");
  assert(screen.includes('registeredAssessment(value.assessmentId).kind !== "unit-check"'));
});

for (const correctCount of [5, 6, 7, 8])
  test(`Unit 3 ${correctCount}/8 challenge controls CP1 without changing lessons, Checks or legacy evidence`, async () => {
    const s = fakeProgressDb({
      [`users/${USER_ID}/assessmentAttempts/existing-check`]: { sentinel: "Unit Check evidence" },
      [`users/${USER_ID}/cardProgress/existing`]: { sentinel: "FSRS" },
      [`grammarProgress/${USER_ID}`]: { sentinel: "legacy" },
    });
    const unitId = "DE.A1.U03",
      request = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
    await startChallenge(s.db, USER_ID, request, 1000);
    const answers = challengeForms[unitId].A.map((item, index) => ({
      itemId: item.id,
      response: index < correctCount ? item.acceptedAnswers[0] : "wrong",
    }));
    await submitChallenge(s.db, USER_ID, { ...request, responses: answers }, 1001);
    const before = structuredClone(s.records),
      writes = s.writes.length;
    const clearances = await readChallengeClearances(s.db, USER_ID, COURSE_SCOPE);
    assert.equal(checkpointAvailable({}, [], clearances), correctCount >= 6);
    assert.equal(checkpointAvailable({}, [], ["DE.A1.U01", "DE.A1.U02"]), false);
    assert.equal(checkpointAvailable({}, [], []), false);
    if (correctCount >= 6) {
      await createAssessmentAttempt(s.db, USER_ID, attemptRequest());
      assert.equal(s.writes.length, writes + 1);
      assert(s.writes.at(-1)!.includes("/assessmentAttempts/"));
    } else {
      await assert.rejects(createAssessmentAttempt(s.db, USER_ID, attemptRequest()), /Unit 3/);
      assert.equal(s.writes.length, writes);
    }
    await assert.rejects(createAssessmentAttempt(s.db, "other-owner", attemptRequest()), /Unit 3/);
    for (const [path, record] of before) assert.deepEqual(s.records.get(path), record);
    assert(
      (await readCourseProgress(s.db, USER_ID, COURSE_SCOPE)).lessons.every(
        (row) => row.progress === null,
      ),
    );
    assert.equal(
      courseLearningAction(germanA1, {}, [], ["DE.A1.U01", "DE.A1.U02", ...clearances]).unit?.id,
      correctCount >= 6 ? "DE.A1.U04" : "DE.A1.U03",
    );
    assert.notEqual(courseLearningAction(germanA1, {}, [], clearances).unit?.id, "DE.A1.U04");
    // Challenge clearance never bypasses Unit Check's historical traversal gate.
    await assert.rejects(
      createAssessmentAttempt(s.db, USER_ID, {
        assessmentId: unit3CheckForms[0].id,
        compatibilityVersion: 1,
        attemptId: randomUUID(),
      }),
      /four Unit 3 lessons/,
    );
  });
