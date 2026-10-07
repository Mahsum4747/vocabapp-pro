import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { germanA1 } from "@/content/curriculum/german-a1";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { courseLearningAction, unitProgress } from "./unit-progress";
import { unitAvailable, unitAheadOfPath } from "./unit-access";
import { COURSE_SCOPE, type ProgressCommand } from "./course-progress";
import { readCourseProgress, saveCourseProgress } from "./course-progress.server";
import { readChallengeClearances, startChallenge, submitChallenge } from "./challenge.server";
import { createAssessmentAttempt } from "./assessment.server";
import { assessmentForUnit } from "./assessment-registry";
import { checkpointAvailable } from "./checkpoint-access";
import { sessionKey, startLesson, type LessonSessions } from "./lesson-session";
import { resumeProgress } from "./course-progress-session";
import { fakeProgressDb } from "./testing/fake-progress-db";
const USER_ID = "open-navigation-owner";
function courseProgressFixture() {
  const storage = fakeProgressDb();
  return {
    storage,
    async advanceLesson(index: number, completedSteps: number) {
      const lesson = germanA1.lessons[index];
      let revision = 0;
      const write = async (action: ProgressCommand["action"]) => {
        const result = await saveCourseProgress(
          storage.db,
          USER_ID,
          {
            ...COURSE_SCOPE,
            lessonId: lesson.id,
            resumeContractVersion: lesson.resumeContractVersion,
            expectedRevision: revision,
            operationId: randomUUID(),
            action,
          },
          100,
        );
        assert.equal(result.kind, "saved");
        if (result.kind === "saved") revision = result.progress.revision;
      };
      for (const step of lesson.steps.slice(0, completedSteps)) {
        if (step.kind !== "explanation")
          await write({
            type: "check",
            stepId: step.id,
            ...(step.kind !== "original"
              ? { response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0] }
              : {}),
          });
        await write({ type: "continue", stepId: step.id });
      }
    },
  };
}

async function sessions(f: ReturnType<typeof courseProgressFixture>) {
  const course = await readCourseProgress(f.storage.db, USER_ID, COURSE_SCOPE);
  return Object.fromEntries(
    course.lessons
      .filter((row) => row.progress)
      .map((row) => {
        const lesson = germanA1.lessons.find((candidate) => candidate.id === row.lessonId)!;
        return [sessionKey(germanA1.id, lesson.id), resumeProgress(row.progress!, lesson)];
      }),
  );
}
async function clear(f: ReturnType<typeof courseProgressFixture>, unitId: string, correct = 6) {
  const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  await startChallenge(f.storage.db, USER_ID, req, 100);
  await submitChallenge(
    f.storage.db,
    USER_ID,
    {
      ...req,
      responses: challengeForms[unitId].A.map((item, index) => ({
        itemId: item.id,
        response:
          index < correct
            ? item.acceptedAnswers[0]
            : (item.options?.find((option) => !item.acceptedAnswers.includes(option)) ?? "wrong"),
      })),
    },
    101,
  );
}
test("authored access is independent of sequential recommendation; planned units stay closed", () => {
  for (const unit of germanA1.units.slice(0, 8)) assert.equal(unitAvailable(unit.id), true);
  for (const unit of germanA1.units.slice(8)) assert.equal(unitAvailable(unit.id), false);
  assert.equal(unitAvailable("missing"), false);
  assert.equal(unitAheadOfPath("DE.A1.U04", {}, [], []), true);
  assert.equal(unitAheadOfPath("DE.A1.U05", {}, [], []), true);
  assert.equal(unitAheadOfPath("DE.A1.U09", {}, [], []), false);
  assert.equal(courseLearningAction(germanA1, {}).unit?.id, "DE.A1.U01");
});
test("opening and fully studying U4/U5 ahead creates only actual lesson milestones", async () => {
  const f = courseProgressFixture();
  await sessions(f);
  assert.equal(f.storage.writes.length, 0);
  for (const index of [12, 16]) await f.advanceLesson(index, germanA1.lessons[index].steps.length);
  const local = await sessions(f);
  assert.equal(courseLearningAction(germanA1, local).unit?.id, "DE.A1.U01");
  for (const unit of germanA1.units.slice(0, 3))
    assert.equal(unitProgress(germanA1, unit, local).finishedCount, 0);
  for (const unit of germanA1.units.slice(3, 5)) {
    assert.equal(unitProgress(germanA1, unit, local).finishedCount, 1);
    const assessment = assessmentForUnit(unit.id)!;
    await assert.rejects(
      createAssessmentAttempt(f.storage.db, USER_ID, {
        compatibilityVersion: assessment.definition.compatibilityVersion,
        assessmentId: assessment.definition.id,
        attemptId: randomUUID(),
      }),
      /four Unit/,
    );
  }
  assert.deepEqual(await readChallengeClearances(f.storage.db, USER_ID, COURSE_SCOPE), []);
  assert(f.storage.writes.every((path) => path.includes("/courseProgress/")));
  assert.equal(checkpointAvailable(local, [], []), false);
});
test("6/8 U3 then U4 changes recommendation to U4 then U5 without lesson or Check evidence", async () => {
  const f = courseProgressFixture();
  for (const id of ["DE.A1.U01", "DE.A1.U02"]) await clear(f, id);
  const action = async () =>
    courseLearningAction(
      germanA1,
      await sessions(f),
      [],
      await readChallengeClearances(f.storage.db, USER_ID, COURSE_SCOPE),
    );
  assert.equal((await action()).unit?.id, "DE.A1.U03");
  await clear(f, "DE.A1.U03");
  assert.equal((await action()).unit?.id, "DE.A1.U04");
  assert.equal(
    checkpointAvailable({}, [], await readChallengeClearances(f.storage.db, USER_ID, COURSE_SCOPE)),
    true,
  );
  await clear(f, "DE.A1.U04");
  assert.equal((await action()).unit?.id, "DE.A1.U05");
  assert.deepEqual(await sessions(f), {});
  assert(f.storage.writes.every((path) => path.includes("/unitChallenges/")));
});
test("four historical completions advance recommendation; restarts preserve history and blocked rows do not count", () => {
  const local: LessonSessions = {};
  const cleared = ["DE.A1.U01", "DE.A1.U02"];
  for (const lesson of germanA1.lessons.slice(8, 12)) {
    Object.assign(local, {
      [sessionKey(germanA1.id, lesson.id)]: {
        ...startLesson(germanA1.id, lesson),
        historicallyFinished: true,
      },
    });
  }
  assert.equal(courseLearningAction(germanA1, local, [], cleared).unit?.id, "DE.A1.U04");
  assert.equal(
    courseLearningAction(germanA1, local, ["DE.A1.U03.L01"], cleared).unit?.id,
    "DE.A1.U03",
  );
  assert.equal(unitAvailable("DE.A1.U04"), true);
});
