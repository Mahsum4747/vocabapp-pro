import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit6CheckForms } from "@/content/curriculum/german-a1-unit6-check";
import { cp2Forms, cp2 } from "@/content/curriculum/german-a1-cp2";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { validateCurriculum } from "./validate";
import { evaluateStep, normalizeLessonAnswer, sessionKey } from "./lesson-session";
import { gradeAssessment, validateAttempt, projectOutcomes } from "./assessment";
import { assessmentForm, assessmentForUnit } from "./assessment-registry";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentHistory,
  readAssessmentAttempt,
} from "./assessment.server";
import { startChallenge, submitChallenge, readChallengeClearances } from "./challenge.server";
import { CHALLENGE_RETRY_MS } from "./challenge";
import { COURSE_SCOPE, type ProgressCommand, resumeProgress } from "./course-progress";
import { saveCourseProgress, readCourseProgress } from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { unitAvailable } from "./unit-access";
import { courseLearningAction, unitProgress } from "./unit-progress";
import { checkpointAvailable, checkpoint2Available } from "./checkpoint-access";
import { CP2_REQUEST, projectCheckpoint2 } from "./checkpoint2";
import { nextFormLabel } from "./assessment-projection";
const owner = "batch-b-owner",
  lessons = germanA1.lessons.slice(20, 24);
// Domain fixture exercises the real owner-scoped persistence boundary, independently of browser helpers.
function courseProgressFixture() {
  const storage = fakeProgressDb();
  return {
    storage,
    async advanceLesson(index: number, completedSteps: number) {
      const lesson = germanA1.lessons[index];
      const previous = (await readCourseProgress(storage.db, owner, COURSE_SCOPE)).lessons.find(
        (r) => r.lessonId === lesson.id,
      )?.progress;
      let revision = previous?.revision ?? 0;
      const write = async (action: ProgressCommand["action"]) => {
        const result = await saveCourseProgress(storage.db, owner, {
          ...COURSE_SCOPE,
          lessonId: lesson.id,
          resumeContractVersion: 1,
          expectedRevision: revision,
          operationId: randomUUID(),
          action,
        });
        assert.equal(result.kind, "saved");
        if (result.kind === "saved") revision = result.progress.revision;
      };
      for (const step of lesson.steps.slice(
        previous?.completedStepIds.length ?? 0,
        completedSteps,
      )) {
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

const responses = (form: typeof cp2, wrong = -1) =>
  form.items.map((item, n) => ({
    itemId: item.id,
    response:
      n === wrong
        ? (item.options?.find((s) => !item.acceptedAnswers.includes(s)) ?? "wrong")
        : item.acceptedAnswers[0],
  }));
async function sessions(f: ReturnType<typeof courseProgressFixture>) {
  const course = await readCourseProgress(f.storage.db, owner, COURSE_SCOPE);
  return Object.fromEntries(
    course.lessons
      .filter((l) => l.progress)
      .map((row) => [
        sessionKey(germanA1.id, row.lessonId),
        resumeProgress(
          row.progress!,
          germanA1.lessons.find((l) => l.id === row.lessonId)!,
        ),
      ]),
  );
}
async function clear(
  storage: ReturnType<typeof fakeProgressDb>,
  unitId: string,
  correct = 6,
  now = 100,
) {
  const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  const view = await startChallenge(storage.db, owner, req, now);
  const form = challengeForms[unitId][view.attempt!.formId];
  const result = await submitChallenge(
    storage.db,
    owner,
    {
      ...req,
      responses: form.map((i, n) => ({
        itemId: i.id,
        response:
          n < correct
            ? i.acceptedAnswers[0]
            : (i.options?.find((o) => !i.acceptedAnswers.includes(o)) ?? "wrong"),
      })),
    },
    now + 1,
  );
  return { req, result };
}
test("U6 frozen blueprint, skill membership, prerequisite DAG and truthful authored boundary", () => {
  assert.deepEqual(validateCurriculum(germanA1), []);
  const rows = readFileSync("GERMAN_A1_BLUEPRINT.md", "utf8")
    .split("\n")
    .map((l) =>
      l
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    );
  const ids = new Map(
    rows.filter((r) => r.length === 5 && /^[GRWV]\d{2}$/.test(r[0] ?? "")).map((r) => [r[0], r[1]]),
  );
  for (const lesson of lessons) {
    const row = rows.find((r) => r[0] === lesson.id)!;
    assert.equal(lesson.title, row[1]);
    assert.equal(lesson.outcome, row[3]);
    assert(lesson.steps.length >= 9 && lesson.steps.length <= 12);
    assert.equal(lesson.resumeContractVersion, 1);
    const named = row[2].split(",").map((id) => ids.get(id));
    assert.deepEqual([...lesson.introducedSkillIds, ...lesson.consolidatedSkillIds], named);
    for (const id of named)
      assert(
        lesson.steps.some((s) => s.skillIds.includes(id!)),
        id,
      );
    for (const stage of ["recall", "produce", "apply", "check"])
      assert(
        lesson.steps.some((s) => s.stage === stage && (stage === "apply" || s.kind === "text")),
        lesson.id + stage,
      );
    assert.equal(lesson.steps.at(-1)!.stage, "check");
  }
  assert.equal(germanA1.lessons.filter((l) => l.availability === "prototype").length, 24);
  assert(
    germanA1.lessons.slice(24).every((l) => l.availability === "not-authored" && !l.steps.length),
  );
  assert(unitAvailable("DE.A1.U06"));
  assert(!unitAvailable("DE.A1.U07"));
  assert.equal(assessmentForUnit("DE.A1.U07"), undefined);
});
for (const lesson of lessons)
  test(`${lesson.id}: reviewed answers, mixed keyboard equivalence and wrong-answer rejection`, () => {
    for (const step of lesson.steps) {
      if (step.kind === "text") {
        for (const answer of step.acceptedAnswers) {
          assert.equal(evaluateStep(step, answer)?.outcome, "correct");
          assert.equal(
            evaluateStep(step, normalizeLessonAnswer(answer, true, true))?.outcome,
            "correct",
          );
        }
        assert.equal(evaluateStep(step, "wrong")?.outcome, "incorrect");
      } else if (step.kind === "choice")
        assert.equal(evaluateStep(step, step.correctAnswer)?.outcome, "correct");
    }
  });
for (const form of [...unit6CheckForms, ...cp2Forms])
  test(`${form.formId}: bounded functional evidence, fair keys and distinct alternate tasks`, () => {
    assert.equal(form.items.length, form.id === cp2.id ? 16 : 10);
    assert.equal(new Set(form.items.map((i) => i.id)).size, form.items.length);
    assert(form.items.some((i) => i.type === "reading-extraction"));
    assert(form.items.some((i) => i.type === "construction"));
    assert(
      form.items.every(
        (i) => i.acceptedAnswers.length && i.acceptedAnswers.every((a) => a.length <= 160),
      ),
    );
    assert(form.targets.every((t) => form.items.some((i) => i.targetId === t.id)));
    for (const item of form.items)
      for (const answer of item.acceptedAnswers) {
        const graded = gradeAssessment(
          form,
          responses(form).map((r) => (r.itemId === item.id ? { ...r, response: answer } : r)),
        );
        assert(graded.every((r) => r.correct));
      }
    assert(gradeAssessment(form, responses(form, form.items.length - 1)).at(-1)?.correct === false);
    const other = assessmentForm(
      form.id,
      form.formId.endsWith("A") ? form.formId.replace(/A$/, "B") : form.formId.replace(/B$/, "A"),
    );
    assert(
      form.items.every(
        (i) => !other.items.some((j) => j.prompt === i.prompt && j.stimulus === i.stimulus),
      ),
    );
  });
test("U6 ahead study persists only actual milestones; all four historical lessons gate Check and CP2", async () => {
  const f = courseProgressFixture();
  assert.equal((await sessions(f))[lessons[0].id], undefined);
  assert.equal(f.storage.writes.length, 0);
  const check = {
    assessmentId: unit6CheckForms[0].id,
    compatibilityVersion: 1,
    attemptId: randomUUID(),
  };
  for (let index = 20; index < 24; index++) {
    await assert.rejects(createAssessmentAttempt(f.storage.db, owner, check), /four Unit 6/);
    await assert.rejects(
      createAssessmentAttempt(f.storage.db, owner, { ...CP2_REQUEST, attemptId: randomUUID() }),
      /Unit 6/,
    );
    await f.advanceLesson(index, germanA1.lessons[index].steps.length);
    const state = await sessions(f);
    assert.equal(unitProgress(germanA1, germanA1.units[5], state).finishedCount, index - 19);
    assert.equal(courseLearningAction(germanA1, state).unit?.id, "DE.A1.U01");
    assert.equal(checkpoint2Available(state, []), index === 23);
  }
  const state = await sessions(f);
  assert.equal(checkpoint2Available(state, [lessons[0].id]), false);
  assert.equal(checkpointAvailable(state, []), false);
  assert.deepEqual(await readChallengeClearances(f.storage.db, owner, COURSE_SCOPE), []);
  assert(f.storage.writes.every((p) => p.includes("/courseProgress/")));
  for (const definition of [unit6CheckForms[0], cp2]) {
    const req = { assessmentId: definition.id, compatibilityVersion: 1, attemptId: randomUUID() };
    const a = await createAssessmentAttempt(f.storage.db, owner, req, 100);
    const result = await submitAssessmentAttempt(
      f.storage.db,
      owner,
      { ...req, responses: responses(definition) },
      101,
    );
    assert.equal(result.attempt.status, "submitted");
    assert.equal(a.status, "in-progress");
  }
  const first = (await readCourseProgress(f.storage.db, owner, COURSE_SCOPE)).lessons.find(
    (l) => l.lessonId === lessons[0].id,
  )!.progress!;
  await saveCourseProgress(
    f.storage.db,
    owner,
    {
      ...COURSE_SCOPE,
      lessonId: lessons[0].id,
      resumeContractVersion: 1,
      expectedRevision: first.revision,
      operationId: randomUUID(),
      action: { type: "restart" },
    },
    200,
  );
  assert(checkpoint2Available(await sessions(f), []));
  await createAssessmentAttempt(f.storage.db, owner, { ...check, attemptId: randomUUID() }, 201);
  assert.equal(
    (await readCourseProgress(f.storage.db, "other", COURSE_SCOPE)).lessons.filter(
      (l) => l.progress,
    ).length,
    0,
  );
});
for (const count of [5, 6, 7, 8])
  test(`U6 ${count}/8 threshold, alternate challenge, CP2 eligibility and no Check/lesson fabrication`, async () => {
    const s = fakeProgressDb();
    const { result } = await clear(s, "DE.A1.U06", count);
    assert.equal(result.summary.clearedAt !== null, count >= 6);
    const cleared = await readChallengeClearances(s.db, owner, COURSE_SCOPE);
    assert.equal(checkpoint2Available({}, [], cleared), count >= 6);
    assert.equal(checkpointAvailable({}, [], cleared), false);
    assert.deepEqual(await readChallengeClearances(s.db, "other", COURSE_SCOPE), []);
    assert.equal(
      (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.filter((l) => l.progress)
        .length,
      0,
    );
    assert(s.writes.every((p) => p.includes("/unitChallenges/")));
    await assert.rejects(
      createAssessmentAttempt(s.db, owner, {
        assessmentId: unit6CheckForms[0].id,
        compatibilityVersion: 1,
        attemptId: randomUUID(),
      }),
      /four Unit 6/,
    );
    if (count >= 6)
      await createAssessmentAttempt(s.db, owner, { ...CP2_REQUEST, attemptId: randomUUID() }, 102);
    else
      await assert.rejects(
        createAssessmentAttempt(s.db, owner, { ...CP2_REQUEST, attemptId: randomUUID() }),
        /Unit 6/,
      );
    if (count === 5) {
      const b = await clear(s, "DE.A1.U06", 6, 100 + CHALLENGE_RETRY_MS + 10);
      assert.equal(b.result.attempt!.formId, "B");
      assert(b.result.summary.clearedAt);
    }
  });
test("U5 clearance recommends U6; clearing all authored units never opens planned U7", async () => {
  const s = fakeProgressDb();
  for (const unit of germanA1.units.slice(0, 4)) await clear(s, unit.id);
  assert.equal(
    courseLearningAction(germanA1, {}, [], await readChallengeClearances(s.db, owner, COURSE_SCOPE))
      .unit?.id,
    "DE.A1.U05",
  );
  await clear(s, "DE.A1.U05");
  assert.equal(
    courseLearningAction(germanA1, {}, [], await readChallengeClearances(s.db, owner, COURSE_SCOPE))
      .unit?.id,
    "DE.A1.U06",
  );
  await clear(s, "DE.A1.U06");
  const next = courseLearningAction(
    germanA1,
    {},
    [],
    await readChallengeClearances(s.db, owner, COURSE_SCOPE),
  );
  assert(next.complete);
  assert.notEqual(next.unit?.id, "DE.A1.U07");
  assert(!unitAvailable("DE.A1.U07"));
});
test("CP2 exact persistence, message gap remains separate, A/B/repeat families, owner isolation", async () => {
  const s = fakeProgressDb();
  await clear(s, "DE.A1.U06");
  const before = structuredClone([...s.records.entries()]);
  const writes = s.writes.length;
  assert(projectCheckpoint2(null, owner).every((g) => g.state === "Insufficient evidence"));
  const attempts = [];
  for (let n = 0; n < 3; n++) {
    const req = { ...CP2_REQUEST, attemptId: randomUUID() };
    const draft = await createAssessmentAttempt(s.db, owner, req, 200 + n * 2);
    const form = assessmentForm(cp2.id, draft.formId);
    assert.equal(draft.formId, n === 1 ? "CP2.FORM.B" : "CP2.FORM.A");
    assert(projectCheckpoint2(draft, owner).every((g) => g.state === "Insufficient evidence"));
    const submit = { ...req, responses: responses(form, n === 0 ? 15 : -1) };
    const { attempt } = await submitAssessmentAttempt(s.db, owner, submit, 201 + n * 2);
    attempts.push(attempt);
    assert.deepEqual((await submitAssessmentAttempt(s.db, owner, submit, 300)).attempt, attempt);
    assert.deepEqual(await readAssessmentAttempt(s.db, owner, req), attempt);
    assert.throws(() => validateAttempt(attempt, form, "other"));
    await assert.rejects(readAssessmentAttempt(s.db, "other", req));
    assert.equal(attempt.responses.length, 16);
    assert.equal(attempt.evidence.length, 16);
    assert.equal(attempt.schemaVersion, 2);
    assert(!JSON.stringify(attempt).includes(form.items[15].acceptedAnswers[0]));
    const groups = projectCheckpoint2(attempt, owner);
    assert.equal(groups.length, 9);
    assert.equal(
      groups.find((g) => g.id === "CP2.message")?.state,
      n === 0 ? "Follow-up needed" : "Demonstrated",
    );
    assert.equal(groups.filter((g) => g.demonstrated).length, n === 0 ? 8 : 9);
  }
  const history = await readAssessmentHistory(s.db, owner, CP2_REQUEST);
  assert.equal(history.length, 3);
  assert.equal((await readAssessmentHistory(s.db, "other", CP2_REQUEST)).length, 0);
  assert.equal(nextFormLabel(history, cp2, owner).formId, "CP2.FORM.B");
  assert(nextFormLabel(history, cp2, owner).repeated);
  assert(
    projectOutcomes(cp2, attempts.slice(0, 2), owner).find((g) => g.targetId === "CP2.message")
      ?.state === "needs more evidence",
  );
  assert(
    projectOutcomes(cp2, history, owner).every(
      (g) => g.state === "confirmed in an alternate form" && g.repeatedForms === 1,
    ),
  );
  for (const [path, value] of before) assert.deepEqual(s.records.get(path), value);
  assert(s.writes.slice(writes).every((p) => p.includes("/assessmentAttempts/")));
});
