import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit9CheckForms } from "@/content/curriculum/german-a1-unit9-check";
import { unit10CheckForms } from "@/content/curriculum/german-a1-unit10-check";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { validateCurriculum } from "./validate";
import { evaluateStep, normalizeLessonAnswer, sessionKey } from "./lesson-session";
import {
  gradeAssessment,
  validateAttempt,
  projectOutcomes,
  type AssessmentDefinition,
} from "./assessment";
import { assessmentForm, assessmentForUnit } from "./assessment-registry";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentHistory,
  readAssessmentAttempt,
} from "./assessment.server";
import {
  startChallenge,
  submitChallenge,
  readChallengeClearances,
  scoreChallenge,
} from "./challenge.server";
import { CHALLENGE_RETRY_MS } from "./challenge";
import { COURSE_SCOPE, type ProgressCommand, resumeProgress } from "./course-progress";
import { saveCourseProgress, readCourseProgress } from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { unitAvailable, unitAheadOfPath } from "./unit-access";
import { courseLearningAction, unitProgress } from "./unit-progress";
import { checkpointAvailable, checkpoint2Available } from "./checkpoint-access";
const owner = "batch-d-owner",
  lessons = germanA1.lessons.slice(32, 40);
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

const responses = (form: AssessmentDefinition, wrong = -1) =>
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

test("U9/U10 exactly preserve frozen titles/outcomes/skills and DAG; all ten units authored", () => {
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
    assert.deepEqual(lesson.introducedSkillIds, []);
    assert.deepEqual(
      lesson.consolidatedSkillIds,
      row[2].split(",").map((id) => ids.get(id)),
    );
    assert(lesson.steps.length >= 9 && lesson.steps.length <= 12);
    assert.equal(lesson.resumeContractVersion, 1);
    for (const skill of lesson.consolidatedSkillIds)
      assert(
        lesson.steps.some((s) => s.skillIds.includes(skill)),
        skill,
      );
    for (const stage of ["recall", "produce", "apply", "check"])
      assert(
        lesson.steps.some((s) => s.stage === stage),
        lesson.id + stage,
      );
    assert(lesson.steps.some((s) => s.stage === "recall" && s.kind === "text"));
    assert(lesson.steps.some((s) => s.stage === "produce" && s.kind === "text"));
    assert.equal(lesson.steps.at(-1)!.purpose, "formative-check");
    assert.equal(lesson.steps.at(-1)!.kind, "text");
  }
  assert.equal(germanA1.lessons.filter((l) => l.availability === "prototype").length, 40);
  assert(germanA1.lessons.slice(32).every((l) => l.availability === "prototype" && l.steps.length));
  for (const id of ["DE.A1.U09", "DE.A1.U10"]) {
    assert(unitAvailable(id));
    assert(unitAheadOfPath(id, {}, [], []));
  }
  assert(!unitAvailable("DE.A1.U11"));
  assert.equal(assessmentForUnit("DE.A1.U11"), undefined);
});
for (const lesson of lessons)
  test(`${lesson.id}: reviewed semantic equivalents, keyboard fallbacks, no nonsense/open-writing credit`, () => {
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
      else if (step.kind === "original") {
        assert.equal(evaluateStep(step, "My own fictional wording.")?.outcome, "unassessed");
        assert.equal(evaluateStep(step, " "), null);
      }
    }
  });
for (const form of [...unit9CheckForms, ...unit10CheckForms])
  test(`${form.formId}: functional scope, key variants, held-out final prompts, independent elicitation`, () => {
    assert.equal(form.items.length, form.unitId === "DE.A1.U09" ? 9 : 10);
    assert.equal(form.id, `${form.unitId}.CHECK.PROTOTYPE.1`);
    assert.equal(form.formFamilyId, form.formId.replace("FORM", "FAMILY"));
    assert.equal(new Set(form.items.map((i) => i.id)).size, form.items.length);
    assert(form.items.some((i) => i.type === "reading-extraction"));
    assert(form.items.some((i) => i.type === "construction"));
    assert(form.targets.every((t) => form.items.some((i) => i.targetId === t.id)));
    assert(form.items.every((i) => i.acceptedAnswers.every((a) => a.length <= 160)));
    for (const item of form.items)
      for (const answer of item.acceptedAnswers) {
        assert(
          gradeAssessment(
            form,
            responses(form).map((r) => (r.itemId === item.id ? { ...r, response: answer } : r)),
          ).every((r) => r.correct),
        );
      }
    assert.equal(
      gradeAssessment(form, responses(form, form.items.length - 1)).at(-1)?.correct,
      false,
    );
    const other = assessmentForm(
      form.id,
      form.formId.endsWith("A") ? form.formId.replace(/A$/, "B") : form.formId.replace(/B$/, "A"),
    );
    assert(
      form.items.every(
        (i) => !other.items.some((j) => j.prompt === i.prompt && j.stimulus === i.stimulus),
      ),
    );
    assert(form.items.every((i) => !lessons.some((l) => l.steps.at(-1)!.prompt === i.prompt)));
  });
for (const lesson of lessons)
  test(`${lesson.id}: durable ahead study, owned reload/restart and no prior-unit or assessment fabrication`, async () => {
    const f = courseProgressFixture();
    assert.equal(f.storage.writes.length, 0);
    await f.advanceLesson(germanA1.lessons.indexOf(lesson), lesson.steps.length);
    const state = await sessions(f);
    const progress = (await readCourseProgress(f.storage.db, owner, COURSE_SCOPE)).lessons.find(
      (l) => l.lessonId === lesson.id,
    )!.progress!;
    assert(progress.firstFinishedAt !== null);
    assert.equal(progress.completedStepIds.length, lesson.steps.length);
    assert.equal(
      unitProgress(
        germanA1,
        germanA1.units.find((u) => u.id === lesson.unitId)!,
        state,
      ).finishedCount,
      1,
    );
    assert.equal(courseLearningAction(germanA1, state).unit?.id, "DE.A1.U01");
    assert(!checkpointAvailable(state, []));
    assert(!checkpoint2Available(state, []));
    assert.deepEqual(await readChallengeClearances(f.storage.db, owner, COURSE_SCOPE), []);
    assert(f.storage.writes.every((p) => p.includes("/courseProgress/")));
    await assert.rejects(
      createAssessmentAttempt(f.storage.db, owner, {
        assessmentId: assessmentForUnit(lesson.unitId)!.definition.id,
        compatibilityVersion: 1,
        attemptId: randomUUID(),
      }),
      /four Unit/,
    );
    await saveCourseProgress(f.storage.db, owner, {
      ...COURSE_SCOPE,
      lessonId: lesson.id,
      resumeContractVersion: 1,
      expectedRevision: progress.revision,
      operationId: randomUUID(),
      action: { type: "restart" },
    });
    const restarted = (await readCourseProgress(f.storage.db, owner, COURSE_SCOPE)).lessons.find(
      (l) => l.lessonId === lesson.id,
    )!.progress!;
    assert.equal(restarted.firstFinishedAt, progress.firstFinishedAt);
    assert.equal(restarted.completedStepIds.length, 0);
    assert.equal(
      (await readCourseProgress(f.storage.db, "other", COURSE_SCOPE)).lessons.filter(
        (l) => l.progress,
      ).length,
      0,
    );
  });
for (const [unitNumber, forms] of [
  [9, unit9CheckForms],
  [10, unit10CheckForms],
] as const)
  test(`U${unitNumber}: actual four-lesson gate, immutable A/B/A results, owner isolation and no raw history`, async () => {
    const f = courseProgressFixture();
    for (let n = (unitNumber - 1) * 4; n < unitNumber * 4; n++) {
      await assert.rejects(
        createAssessmentAttempt(f.storage.db, owner, {
          assessmentId: forms[0].id,
          compatibilityVersion: 1,
          attemptId: randomUUID(),
        }),
        /four Unit/,
      );
      await f.advanceLesson(n, germanA1.lessons[n].steps.length);
    }
    const before = structuredClone([...f.storage.records.entries()]);
    const writes = f.storage.writes.length;
    const attempts = [];
    for (let trial = 0; trial < 3; trial++) {
      const req = { assessmentId: forms[0].id, compatibilityVersion: 1, attemptId: randomUUID() };
      const draft = await createAssessmentAttempt(f.storage.db, owner, req, 100 + trial * 2);
      const form = forms[trial === 1 ? 1 : 0];
      assert.equal(draft.formId, form.formId);
      const payload = { ...req, responses: responses(form) };
      const { attempt } = await submitAssessmentAttempt(
        f.storage.db,
        owner,
        payload,
        101 + trial * 2,
      );
      attempts.push(attempt);
      assert.deepEqual(
        (await submitAssessmentAttempt(f.storage.db, owner, payload, 200)).attempt,
        attempt,
      );
      assert.deepEqual(await readAssessmentAttempt(f.storage.db, owner, req), attempt);
      assert.equal(attempt.evidence.length, form.items.length);
      assert.equal(attempt.schemaVersion, 2);
      assert.throws(() => validateAttempt(attempt, form, "other"));
      await assert.rejects(readAssessmentAttempt(f.storage.db, "other", req));
      assert(!JSON.stringify(attempt).includes(form.items.at(-1)!.acceptedAnswers[0]));
    }
    assert(
      projectOutcomes(forms[0], attempts, owner).every(
        (g) => g.state === "confirmed in an alternate form" && g.repeatedForms === 1,
      ),
    );
    assert.equal(
      (
        await readAssessmentHistory(f.storage.db, "other", {
          assessmentId: forms[0].id,
          compatibilityVersion: 1,
        })
      ).length,
      0,
    );
    for (const [p, value] of before) assert.deepEqual(f.storage.records.get(p), value);
    assert(f.storage.writes.slice(writes).every((p) => p.includes("/assessmentAttempts/")));
  });
for (const id of ["DE.A1.U09", "DE.A1.U10"])
  for (const count of [5, 6, 7, 8])
    test(`${id} ${count}/8 threshold, truthful clearance and independent B retry`, async () => {
      const s = fakeProgressDb();
      const { result } = await clear(s, id, count);
      assert.equal(result.attempt!.passed, count >= 6);
      assert.equal(result.attempt!.correctCount, count);
      const cleared = await readChallengeClearances(s.db, owner, COURSE_SCOPE);
      assert.equal(cleared.includes(id), count >= 6);
      assert.equal(
        (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.filter((l) => l.progress)
          .length,
        0,
      );
      await assert.rejects(
        createAssessmentAttempt(s.db, owner, {
          assessmentId: assessmentForUnit(id)!.definition.id,
          compatibilityVersion: 1,
          attemptId: randomUUID(),
        }),
        /four Unit/,
      );
      assert(s.writes.every((p) => p.includes("/unitChallenges/")));
      assert.deepEqual(await readChallengeClearances(s.db, "other", COURSE_SCOPE), []);
      for (const formId of ["A", "B"] as const) {
        const items = challengeForms[id][formId];
        assert.equal(items.length, 8);
        assert(items.some((i) => i.stimulus));
        assert(items.some((i) => !i.options));
        assert(items.every((i) => i.acceptedAnswers.every((a) => a.length <= 160)));
        for (const item of items)
          for (const answer of item.acceptedAnswers) {
            const rows = items.map((i) => ({
              itemId: i.id,
              response: i.id === item.id ? answer : i.acceptedAnswers[0],
            }));
            assert(scoreChallenge({ ...COURSE_SCOPE, unitId: id }, formId, rows).passed);
          }
      }
      if (count === 5) {
        const retry = await clear(s, id, 6, 100 + CHALLENGE_RETRY_MS + 10);
        assert.equal(retry.result.attempt!.formId, "B");
        assert(retry.result.attempt!.passed);
      }
    });

test("U8 -> U9 -> U10 recommendation by Challenges; no Unit 11", async () => {
  const s = fakeProgressDb();
  for (const u of germanA1.units.slice(0, 7)) await clear(s, u.id);
  const action = async () =>
    courseLearningAction(
      germanA1,
      {},
      [],
      await readChallengeClearances(s.db, owner, COURSE_SCOPE),
    );
  assert.equal((await action()).unit?.id, "DE.A1.U08");
  await clear(s, "DE.A1.U08");
  assert.equal((await action()).unit?.id, "DE.A1.U09");
  await clear(s, "DE.A1.U09");
  assert.equal((await action()).unit?.id, "DE.A1.U10");
  await clear(s, "DE.A1.U10");
  assert((await action()).complete);
  assert.equal((await action()).unit?.id, "DE.A1.U10");
  assert((await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.every((l) => !l.progress));
});
test("U8/U9 historical lessons recommend U9/U10 without Challenge evidence", async () => {
  const f = courseProgressFixture();
  const cleared = germanA1.units.slice(0, 7).map((u) => u.id);
  for (let n = 28; n < 32; n++) await f.advanceLesson(n, germanA1.lessons[n].steps.length);
  assert.equal(
    courseLearningAction(germanA1, await sessions(f), [], cleared).unit?.id,
    "DE.A1.U09",
  );
  for (let n = 32; n < 36; n++) await f.advanceLesson(n, germanA1.lessons[n].steps.length);
  assert.equal(
    courseLearningAction(germanA1, await sessions(f), [], cleared).unit?.id,
    "DE.A1.U10",
  );
});
