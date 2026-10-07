import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit4CheckForms } from "@/content/curriculum/german-a1-unit4-check";
import { unit5CheckForms } from "@/content/curriculum/german-a1-unit5-check";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { validateCurriculum } from "./validate";
import { evaluateStep, normalizeLessonAnswer } from "./lesson-session";
import { unitAvailable } from "./unit-access";
import { gradeAssessment } from "./assessment";
import { assessmentForUnit, assessmentForm, registeredAssessment } from "./assessment-registry";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentHistory,
  readAssessmentAttempt,
} from "./assessment.server";
import {
  scoreChallenge,
  startChallenge,
  submitChallenge,
  readChallengeClearances,
} from "./challenge.server";
import { COURSE_SCOPE, type ProgressCommand, resumeProgress } from "./course-progress";
import { saveCourseProgress, readCourseProgress } from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";

import { checkpointAvailable } from "./checkpoint-access";
import { courseLearningAction, unitProgress } from "./unit-progress";
const owner = "batch-a-owner",
  lessons = germanA1.lessons.slice(12, 20);
const ascii = (s: string) => normalizeLessonAnswer(s, true, true);
async function clear(
  s: ReturnType<typeof fakeProgressDb>,
  unitId: string,
  correct = 8,
  now = 100,
  user = owner,
) {
  const input = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  const view = await startChallenge(s.db, user, input, now);
  const items = challengeForms[unitId][view.attempt!.formId];
  const result = await submitChallenge(
    s.db,
    user,
    {
      ...input,
      responses: items.map((i, n) => ({
        itemId: i.id,
        response:
          n < correct
            ? i.acceptedAnswers[0]
            : (i.options?.find((o) => !i.acceptedAnswers.includes(o)) ?? "wrong"),
      })),
    },
    now + 1,
  );
  return { result, input };
}
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
test("Batch A exactly preserves the frozen registry, prerequisite DAG and skill membership", () => {
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
    assert.deepEqual(
      lesson.introducedSkillIds,
      row[2].split(",").map((h) => ids.get(h)),
    );
    assert.deepEqual(lesson.consolidatedSkillIds, []);
    assert.equal(lesson.resumeContractVersion, 1);
    assert(lesson.steps.length >= 9 && lesson.steps.length <= 12);
    for (const skill of lesson.introducedSkillIds)
      assert(
        lesson.steps.some((s) => s.skillIds.includes(skill)),
        skill,
      );
    for (const stage of ["recall", "produce", "apply", "check"])
      assert(
        lesson.steps.some((s) => s.kind === "text" && s.stage === stage),
        `${lesson.id}: ${stage}`,
      );
    assert.equal(lesson.steps.at(-1)!.stage, "check");
  }
  assert.equal(germanA1.lessons.filter((l) => l.availability === "prototype").length, 40);
  assert(
    germanA1.lessons.slice(40).every((l) => l.availability === "not-authored" && !l.steps.length),
  );
  assert.equal(assessmentForUnit("DE.A1.U11"), undefined);
  assert.throws(() => registeredAssessment("DE.A1.CP2"));
});
for (const lesson of lessons)
  test(`${lesson.id}: all deliberate answers grade, bounded equivalence and nonsense rejection`, () => {
    for (const step of lesson.steps) {
      if (step.kind === "text") {
        for (const answer of step.acceptedAnswers) {
          assert.equal(evaluateStep(step, answer)?.outcome, "correct");
          assert.equal(evaluateStep(step, ascii(answer))?.outcome, "correct");
        }
        assert.equal(evaluateStep(step, "unrelated answer")?.outcome, "incorrect");
        assert.equal(evaluateStep(step, " "), null);
        assert(step.feedback.trim());
        assert.equal(step.answerLanguage, "de");
      } else if (step.kind === "choice") {
        assert.equal(evaluateStep(step, step.correctAnswer)?.outcome, "correct");
        assert.equal(
          evaluateStep(
            step,
            step.options.find((o) => o !== step.correctAnswer)!,
          )?.outcome,
          "incorrect",
        );
      }
    }
  });
test("Critical semantic reversals are rejected, not just approximate strings", () => {
  const probes: [number, string, string][] = [
    [0, "reply", "Am Montag ich komme später."],
    [1, "yes-no", "Kaufst ein du?"],
    [2, "apply", "Will ich morgen kommen?"],
    [3, "prohibit", "Du darfst hier essen."],
    [4, "friends", "Ich fahre mit den Freunde."],
    [5, "message", "Guten Tag! Kannst du mir helfen? Vielen Dank!"],
    [6, "sms", "Ich gehe an den Bahnhof. Um zwölf komme ich."],
    [7, "accept", "Ja, ich komme um zehn ins Zentrum."],
  ];
  for (const [index, id, wrong] of probes) {
    const step = lessons[index].steps.find((s) => s.id.endsWith("." + id))!;
    assert.equal(evaluateStep(step, wrong)?.outcome, "incorrect");
  }
});
for (const forms of [unit4CheckForms, unit5CheckForms]) {
  const unitId = forms[0].unitId;
  for (const f of forms)
    test(`${f.formId}: independent functional targets, reading/production and bounded grading`, () => {
      assert.equal(f.items.length, 8);
      assert.equal(f.targets.length, 8);
      assert.equal(f.formFamilyId, f.formId.replace("FORM", "FAMILY"));
      assert(f.items.some((i) => i.type === "reading-extraction" && i.stimulus));
      assert(f.items.some((i) => i.type === "construction"));
      const responses = f.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] }));
      assert(gradeAssessment(f, responses).every((i) => i.correct));
      for (const item of f.items) {
        assert(item.acceptedAnswers.every((a) => a.length <= 160));
        assert(f.targets.some((t) => t.id === item.targetId));
        if (!item.options)
          for (const answer of item.acceptedAnswers) {
            assert(
              gradeAssessment(
                f,
                responses.map((r) =>
                  r.itemId === item.id ? { ...r, response: ascii(answer) } : r,
                ),
              ).every((i) => i.correct),
            );
          }
        assert(!lessons.flatMap((l) => l.steps).some((s) => s.prompt === item.prompt));
      }
      assert.throws(() => gradeAssessment(f, responses.slice(1)));
      const wrong = responses.map((r, n) => ({
        ...r,
        response:
          f.items[n].options?.find((o) => !f.items[n].acceptedAnswers.includes(o)) ?? "wrong",
      }));
      assert(gradeAssessment(f, wrong).every((i) => !i.correct));
      assert.deepEqual(
        assessmentForUnit(unitId)?.lessonIds,
        germanA1.units.find((u) => u.id === unitId)!.lessonIds,
      );
    });
  test(`${unitId}: durable Check A/B, actual lesson gate, owned evidence without raw answers`, async () => {
    const f = courseProgressFixture();
    const USER_ID = owner;
    const input = () => ({
      assessmentId: forms[0].id,
      compatibilityVersion: 1,
      attemptId: randomUUID(),
    });
    await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, input()), /four Unit/);
    const previous = Number(unitId.slice(-2)) - 1;
    await clear(f.storage, `DE.A1.U0${previous}`, 8, 100, USER_ID);
    // Challenge clearance for the tested unit itself cannot supply Check eligibility.
    await clear(f.storage, unitId, 8, 100, USER_ID);
    await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, input()), /four Unit/);
    const start = (Number(unitId.slice(-2)) - 1) * 4;
    for (let n = start; n < start + 3; n++)
      await f.advanceLesson(n, germanA1.lessons[n].steps.length);
    await assert.rejects(createAssessmentAttempt(f.storage.db, USER_ID, input()), /four Unit/);
    await f.advanceLesson(start + 3, germanA1.lessons[start + 3].steps.length);
    for (const form of forms) {
      const req = input();
      const draft = await createAssessmentAttempt(f.storage.db, USER_ID, req, 200);
      assert.equal(draft.formId, form.formId);
      assert.deepEqual(draft.responses, []);
      const def = assessmentForm(draft.assessmentId, draft.formId);
      const result = await submitAssessmentAttempt(
        f.storage.db,
        USER_ID,
        {
          ...req,
          responses: def.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
        },
        201,
      );
      assert(result.attempt.responses.every((r) => r.correct));
      assert.equal(result.attempt.evidence.length, 8);
      assert(result.attempt.responses.every((r) => !Object.hasOwn(r, "response")));
      assert(result.attempt.evidence.every((e) => e.formFamilyId === form.formFamilyId));
      assert.deepEqual(await readAssessmentAttempt(f.storage.db, USER_ID, req), result.attempt);
      await assert.rejects(readAssessmentAttempt(f.storage.db, "other", req));
    }
    assert.equal(
      (
        await readAssessmentHistory(f.storage.db, USER_ID, {
          assessmentId: forms[0].id,
          compatibilityVersion: 1,
        })
      ).length,
      2,
    );
    assert(
      f.storage.writes.every(
        (p) =>
          p.includes("/courseProgress/") ||
          p.includes("/unitChallenges/") ||
          p.includes("/assessmentAttempts/"),
      ),
    );
  });
}
for (const unitId of ["DE.A1.U04", "DE.A1.U05"]) {
  for (const form of ["A", "B"] as const)
    test(`${unitId} challenge ${form}: every key, keyboard equivalence, 6/8 and 5/8 boundary`, () => {
      const items = challengeForms[unitId][form];
      const answers = items.map((i) => ({
        itemId: i.id,
        response: i.options ? i.acceptedAnswers[0] : ascii(i.acceptedAnswers[0]),
      }));
      const scope = { ...COURSE_SCOPE, unitId };
      assert.equal(scoreChallenge(scope, form, answers).correctCount, 8);
      for (const count of [5, 6]) {
        const responses = answers.map((r, n) =>
          n < count
            ? r
            : {
                ...r,
                response:
                  items[n].options?.find((o) => !items[n].acceptedAnswers.includes(o)) ?? "wrong",
              },
        );
        const score = scoreChallenge(scope, form, responses);
        assert.equal(score.correctCount, count);
        assert.equal(score.passed, count === 6);
      }
      assert.throws(() => scoreChallenge(scope, form, answers.slice(1)));
    });
}
for (const unitId of ["DE.A1.U04", "DE.A1.U05"]) {
  test(`${unitId}: challenge 5/8 fails, alternate 6/8 clears, no fabricated completion/evidence`, async () => {
    const s = fakeProgressDb();
    const first = await clear(s, unitId, 5);
    assert.equal(first.result.attempt?.passed, false);
    assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), []);
    const next = await clear(s, unitId, 6, 100 + 24 * 60 * 60 * 1000 + 2);
    assert.equal(next.result.attempt?.formId, "B");
    assert.equal(next.result.attempt?.passed, true);
    assert(
      !/acceptedAnswers|responses|stimulus|prompt/.test(JSON.stringify([...s.records.values()])),
    );
    assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), [unitId]);
    assert.equal(
      (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.filter((l) => l.progress)
        .length,
      0,
    );
    assert(
      ![...s.records.keys()].some(
        (p) => p.includes("/courseProgress/") || p.includes("/assessmentAttempts/"),
      ),
    );
    assert.deepEqual(await readChallengeClearances(s.db, "other", COURSE_SCOPE), []);
    for (const form of ["A", "B"] as const) {
      const bank = challengeForms[unitId][form];
      assert.equal(bank.length, 8);
      assert.equal(new Set(bank.map((i) => i.id)).size, 8);
      assert(bank.some((i) => i.stimulus));
      assert(bank.some((i) => !i.options));
      assert(bank.every((i) => i.acceptedAnswers.every((a) => a.length <= 160)));
    }
  });
}
test("Authored U4/U5 are open regardless of clearance; U7 remains planned", () => {
  for (const unitId of ["DE.A1.U04", "DE.A1.U05"]) {
    const index = Number(unitId.slice(-2)) - 1;
    assert.equal(unitAvailable(unitId), true);
    assert.equal(unitProgress(germanA1, germanA1.units[index], {}).finishedCount, 0);
  }
  assert.equal(unitAvailable("DE.A1.U11"), false);
  assert.equal(checkpointAvailable({}, [], ["DE.A1.U03"]), true);
  assert.equal(checkpointAvailable({}, [], ["DE.A1.U04"]), false);
  assert.equal(
    courseLearningAction(
      germanA1,
      {},
      [],
      germanA1.units.slice(0, 5).map((u) => u.id),
    ).complete,
    false,
  );
  assert.equal(
    courseLearningAction(
      germanA1,
      {},
      [],
      germanA1.units.slice(0, 5).map((u) => u.id),
    ).unit?.id,
    "DE.A1.U06",
  );
});
test("All eight lessons save and reload through existing owned contracts; ahead study stays owner-scoped", async () => {
  const f = courseProgressFixture();
  const USER_ID = owner;
  for (const lesson of [lessons[0], lessons[4]]) {
    const input: ProgressCommand = {
      ...COURSE_SCOPE,
      lessonId: lesson.id,
      resumeContractVersion: 1,
      expectedRevision: 0,
      operationId: randomUUID(),
      action: { type: "continue", stepId: lesson.steps[0].id },
    };
    assert.equal((await saveCourseProgress(f.storage.db, USER_ID, input)).kind, "saved");
  }
  await clear(f.storage, "DE.A1.U03", 8, 100, USER_ID);
  for (let n = 12; n < 20; n++) await f.advanceLesson(n, germanA1.lessons[n].steps.length);
  const saved = await readCourseProgress(f.storage.db, USER_ID, COURSE_SCOPE);
  for (const lesson of lessons) {
    const row = saved.lessons.find((r) => r.lessonId === lesson.id)!;
    assert(row.progress?.firstFinishedAt);
    assert.equal(row.progress!.completedStepIds.length, lesson.steps.length);
    assert.equal(resumeProgress(row.progress!, lesson).status, "finished");
  }
  assert(
    (await readCourseProgress(f.storage.db, "other", COURSE_SCOPE)).lessons.every(
      (r) => r.progress === null,
    ),
  );
  assert(!f.storage.writes.some((p) => p.includes("/assessmentAttempts/")));
});
