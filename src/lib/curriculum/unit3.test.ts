import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit3Check as A, unit3CheckB as B } from "@/content/curriculum/german-a1-unit3-check";
import { unit1CheckForms } from "@/content/curriculum/german-a1-unit1-check";
import { unit2CheckForms } from "@/content/curriculum/german-a1-unit2-check";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { COURSE_SCOPE, type ProgressCommand, resumeProgress } from "./course-progress";
import {
  readCourseProgress,
  saveCourseProgress,
  courseProgressPath,
} from "./course-progress.server";
import { gradeAssessment, projectOutcomes, type AssessmentDefinition } from "./assessment";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
} from "./assessment.server";
import { assessmentForUnit, assessmentForm } from "./assessment-registry";
import { startChallenge, submitChallenge, readChallengeClearances } from "./challenge.server";
import { validateCurriculum } from "./validate";
import { evaluateStep, sessionKey, type LessonSessions } from "./lesson-session";
import { unitProgress, courseLearningAction } from "./unit-progress";
import { unitAvailable } from "./unit-access";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { deleteLearningData } from "../account-deletion.server";
import type { LessonDefinition } from "./types";
const lessons = germanA1.lessons.slice(8, 12),
  unit = germanA1.units[2],
  owner = "unit3-owner";
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
  user = owner,
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
async function prior(s: ReturnType<typeof fakeProgressDb>) {
  for (const lesson of germanA1.lessons.slice(4, 8)) await finish(s, lesson);
}
async function sessions(s: ReturnType<typeof fakeProgressDb>): Promise<LessonSessions> {
  const result = await readCourseProgress(s.db, owner, COURSE_SCOPE);
  return Object.fromEntries(
    result.lessons
      .filter((row) => row.progress)
      .map((row) => [
        sessionKey(germanA1.id, row.lessonId),
        resumeProgress(
          row.progress!,
          germanA1.lessons.find((lesson) => lesson.id === row.lessonId)!,
        ),
      ]),
  );
}
const request = () => ({ assessmentId: A.id, compatibilityVersion: 1, attemptId: randomUUID() });
const answers = (form: AssessmentDefinition) =>
  form.items.map((item) => ({ itemId: item.id, response: item.acceptedAnswers[0] }));
async function clear(s: ReturnType<typeof fakeProgressDb>, unitId: string, user = owner) {
  const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  await startChallenge(s.db, user, req, 100);
  await submitChallenge(
    s.db,
    user,
    {
      ...req,
      responses: challengeForms[unitId].A.map((item) => ({
        itemId: item.id,
        response: item.acceptedAnswers[0],
      })),
    },
    101,
  );
}

test("Unit 3 exact frozen blueprint, ten steps each, meaningful recall/read/production and original scope", () => {
  assert.deepEqual(validateCurriculum(germanA1), []);
  const rows = readFileSync("GERMAN_A1_BLUEPRINT.md", "utf8")
    .split("\n")
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  const handles = new Map(
    rows
      .filter((row) => row.length === 5 && /^[GRWV]\d{2}$/.test(row[0] ?? ""))
      .map((row) => [row[0], row[1]]),
  );
  const ids = new Set<string>();
  for (const lesson of lessons) {
    const row = rows.find((row) => row[0] === lesson.id)!;
    assert.equal(lesson.title, row[1]);
    assert.equal(lesson.outcome, row[3]);
    assert.deepEqual(
      lesson.introducedSkillIds,
      row[2].split(",").map((handle) => handles.get(handle)),
    );
    assert.deepEqual(lesson.consolidatedSkillIds, []);
    assert.equal(lesson.availability, "prototype");
    assert.equal(lesson.resumeContractVersion, 1);
    assert.equal(lesson.steps.length, 10);
    for (const step of lesson.steps) {
      assert.ok(!ids.has(step.id));
      ids.add(step.id);
      assert.ok(step.skillIds.every((id) => lesson.introducedSkillIds.includes(id)));
      if (step.kind === "text") {
        assert.equal(step.answerLanguage, "de");
        assert.ok(step.inputLabel);
        assert.ok(step.acceptedAnswers.length);
        assert.equal(evaluateStep(step, step.acceptedAnswers[0])?.outcome, "correct");
        assert.equal(evaluateStep(step, "wrong")?.outcome, "incorrect");
      }
    }
    for (const skill of lesson.introducedSkillIds)
      assert.ok(lesson.steps.some((step) => step.skillIds.includes(skill)));
    assert.ok(lesson.steps.some((step) => step.kind === "text" && step.stage === "recall"));
    assert.ok(lesson.steps.some((step) => step.kind === "text" && step.stage === "produce"));
    assert.ok(lesson.steps.some((step) => step.kind === "text" && step.stage === "apply"));
    assert.equal(lesson.steps.at(-1)?.stage, "check");
  }
  assert.ok(
    lessons.some((lesson) => lesson.steps.some((step) => step.stage === "read" && step.example)),
  );
  assert.ok(
    germanA1.lessons
      .slice(40)
      .every((lesson) => lesson.availability === "not-authored" && lesson.steps.length === 0),
  );
  assert.equal(assessmentForUnit("DE.A1.U11"), undefined);
});
test("Unit 3 typed answer shapes accept full-sentence equivalents and German keyboard fallback without changing meaning", () => {
  const article = lessons[0].steps.find((step) => step.id.endsWith(".known"))!;
  assert.equal(evaluateStep(article, "Ich kaufe den Stift.")?.outcome, "correct");
  assert.equal(evaluateStep(article, "der")?.outcome, "incorrect");
  const correction = lessons[3].steps.find((step) => step.id.endsWith(".correct"))!;
  assert.equal(
    evaluateStep(
      correction,
      "Ich kaufe gern Buecher. Ich kaufe nicht den Stift. Ich kaufe das Buch.",
    )?.outcome,
    "correct",
  );
  assert.equal(
    evaluateStep(
      correction,
      "Ich kaufe sehr Bücher. Ich kaufe nicht den Stift. Ich kaufe das Buch.",
    )?.outcome,
    "incorrect",
  );
});
for (const lesson of lessons)
  test(`${lesson.id}: independent bounded checked reload, durable completion and historical repeat`, async () => {
    const s = fakeProgressDb();
    await prior(s);
    const before = structuredClone([...s.records.entries()]);
    let revision = 0;
    for (const step of lesson.steps) {
      if (step.kind !== "explanation") {
        const response =
          step.kind === "choice"
            ? step.correctAnswer
            : step.kind === "text"
              ? step.acceptedAnswers[0].replaceAll("ü", "ue")
              : undefined;
        const saved = await saveCourseProgress(
          s.db,
          owner,
          command(lesson, revision, {
            type: "check",
            stepId: step.id,
            ...(response ? { response } : {}),
          }),
          100,
        );
        assert.equal(saved.kind, "saved");
        revision++;
        const reloaded = (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.find(
          (row) => row.lessonId === lesson.id,
        )!.progress!;
        assert.equal(reloaded.currentStepId, step.id);
        assert.equal(reloaded.checked, true);
        assert.equal(resumeProgress(reloaded, lesson).stepIndex, lesson.steps.indexOf(step));
      }
      const moved = await saveCourseProgress(
        s.db,
        owner,
        command(lesson, revision, { type: "continue", stepId: step.id }),
        101,
      );
      assert.equal(moved.kind, "saved");
      revision++;
    }
    const saved = (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.find(
      (row) => row.lessonId === lesson.id,
    )!.progress!;
    assert.equal(saved.currentStepId, null);
    assert.equal(saved.firstFinishedAt, 101);
    await saveCourseProgress(s.db, owner, command(lesson, revision, { type: "restart" }), 102);
    assert.equal(
      (await sessions(s))[sessionKey(germanA1.id, lesson.id)].historicallyFinished,
      true,
    );
    for (const [path, value] of before) assert.deepEqual(s.records.get(path), value);
    assert.equal(
      (await readCourseProgress(s.db, "another-owner", COURSE_SCOPE)).lessons.find(
        (row) => row.lessonId === lesson.id,
      )!.progress,
      null,
    );
    assert.ok(s.writes.every((path) => path.startsWith(`users/${owner}/courseProgress/`)));
  });
test("Unit 3 allows ahead study without fabricating prior completion or Check eligibility", async () => {
  const s = fakeProgressDb(),
    lesson = lessons[0],
    input = command(lesson, 0, { type: "continue", stepId: lesson.steps[0].id });
  assert.equal(unitAvailable("DE.A1.U03"), true);
  assert.equal(s.writes.length, 0);
  await clear(s, "DE.A1.U02", "another-owner");
  assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), []);
  const result = await saveCourseProgress(s.db, owner, input, 102);
  assert.equal(result.kind, "saved");
  const loaded = await readCourseProgress(s.db, owner, COURSE_SCOPE);
  assert.ok(
    loaded.lessons
      .filter((row) => row.lessonId.startsWith("DE.A1.U02"))
      .every((row) => row.progress === null),
  );
  await assert.rejects(createAssessmentAttempt(s.db, owner, request(), 103), /four Unit 3/);
});
test("Unit 3 stale revisions/idempotency preserve the existing durable schema and receipts", async () => {
  const s = fakeProgressDb();
  await prior(s);
  const lesson = lessons[0],
    input = command(lesson, 0, { type: "continue", stepId: lesson.steps[0].id });
  await saveCourseProgress(s.db, owner, input, 100);
  const count = s.writes.length;
  await saveCourseProgress(s.db, owner, input, 101);
  assert.equal(s.writes.length, count);
  assert.equal(
    (await saveCourseProgress(s.db, owner, { ...input, operationId: randomUUID() }, 101)).kind,
    "conflict",
  );
  const row = s.records.get(courseProgressPath(owner, input)) as Record<string, unknown>;
  assert.equal(row.schemaVersion, 2);
  assert.equal(row.resumeContractVersion, 1);
  assert.ok(Array.isArray(row.receipts));
});
test("challenge-cleared Units 1/2 guide Unit 3; all four lessons finish truthfully, Unit 4 is next, CP1 has separate identity", async () => {
  const s = fakeProgressDb();
  await clear(s, "DE.A1.U01");
  await clear(s, "DE.A1.U02");
  const cleared = await readChallengeClearances(s.db, owner, COURSE_SCOPE);
  assert.equal(courseLearningAction(germanA1, {}, [], cleared).lesson?.id, lessons[0].id);
  assert.equal(unitAvailable("DE.A1.U03"), true);
  for (const lesson of lessons) await finish(s, lesson);
  const local = await sessions(s);
  assert.equal(unitProgress(germanA1, unit, local).status, "Unit lessons complete");
  assert.equal(unitProgress(germanA1, germanA1.units[1], local).finishedCount, 0);
  assert.equal(courseLearningAction(germanA1, local, [], cleared).complete, false);
  assert.equal(courseLearningAction(germanA1, local, [], cleared).unit?.id, "DE.A1.U04");
  assert.equal(assessmentForUnit("DE.A1.U11"), undefined);
  assert.throws(() => assessmentForm("DE.A1.CP1", "U03.FORM.A"));
});
test("U03 A/B IDs, eight narrow targets, distinct elicitation structures and deterministic bounded grading", () => {
  assert.equal(A.id, "DE.A1.U03.CHECK.PROTOTYPE.1");
  assert.deepEqual(
    [A.formId, A.formFamilyId, B.formId, B.formFamilyId],
    ["U03.FORM.A", "U03.FAMILY.A", "U03.FORM.B", "U03.FAMILY.B"],
  );
  assert.deepEqual(A.targets, B.targets);
  assert.equal(A.targets.length, 8);
  assert.deepEqual(assessmentForUnit(unit.id)?.lessonIds, unit.lessonIds);
  for (const form of [A, B]) {
    assert.equal(form.items.length, 8);
    assert.equal(new Set(form.items.map((item) => item.id)).size, 8);
    assert.ok(
      form.targets.every((target) => form.items.some((item) => item.targetId === target.id)),
    );
    assert.ok(gradeAssessment(form, answers(form)).every((result) => result.correct));
    const wrong = answers(form);
    wrong[0].response = "private wrong answer";
    assert.equal(gradeAssessment(form, wrong)[0].correct, false);
    assert.throws(() => gradeAssessment(form, wrong.slice(1)));
  }
  assert.ok(A.items.filter((item, index) => item.type !== B.items[index].type).length >= 4);
  const ascii = answers(A).map((response) => ({
    ...response,
    response: response.response.replaceAll("ü", "ue"),
  }));
  assert.ok(gradeAssessment(A, ascii).every((result) => result.correct));
  // Protected families continue to grade their approved authored keys identically.
  for (const form of [...unit1CheckForms, ...unit2CheckForms])
    assert.ok(gradeAssessment(form, answers(form)).every((result) => result.correct));
});
test("own lesson completion gates U03 A/B; exact review, independent families and repeat failure preserve truth/privacy", async () => {
  const s = fakeProgressDb();
  await prior(s);
  await assert.rejects(createAssessmentAttempt(s.db, owner, request(), 200), /Unit 3/);
  for (const lesson of lessons) await finish(s, lesson);
  const savedCourse = structuredClone([...s.records.entries()]);
  const completed = [];
  for (let index = 0; index < 3; index++) {
    const req = request(),
      draft = await createAssessmentAttempt(s.db, owner, req, 200 + index * 2);
    const form = assessmentForm(draft.assessmentId, draft.formId);
    assert.equal(form.formId, index === 1 ? B.formId : A.formId);
    const responses = answers(form);
    if (index === 2) responses[0].response = "PRIVATE_WRONG_ANSWER";
    const result = await submitAssessmentAttempt(
      s.db,
      owner,
      { ...req, responses },
      201 + index * 2,
    );
    assert.equal(result.kind, "accepted");
    completed.push(result.attempt);
    const before = s.writes.length;
    await submitAssessmentAttempt(s.db, owner, { ...req, responses }, 202 + index * 2);
    assert.equal(s.writes.length, before);
    assert.deepEqual(
      await readAssessmentAttempt(s.db, owner, { attemptId: req.attemptId }),
      result.attempt,
    );
  }
  assert.ok(
    projectOutcomes(A, completed.slice(0, 1), owner).every(
      (target) => target.state === "demonstrated in one observation",
    ),
  );
  assert.ok(
    projectOutcomes(A, completed.slice(0, 2), owner).every(
      (target) => target.state === "confirmed in an alternate form",
    ),
  );
  assert.equal(projectOutcomes(A, completed, owner)[0].state, "needs more evidence");
  assert.equal(projectOutcomes(A, completed, owner)[0].repeatedForms, 1);
  assert.equal(
    (await readAssessmentHistory(s.db, owner, { assessmentId: A.id, compatibilityVersion: 1 }))
      .length,
    3,
  );
  await assert.rejects(
    readAssessmentAttempt(s.db, "another-owner", { attemptId: completed[0].attemptId }),
  );
  for (const [path, value] of savedCourse) assert.deepEqual(s.records.get(path), value);
  const stored = JSON.stringify(
    [...s.records.entries()].filter(([path]) => path.includes("/assessmentAttempts/")),
  );
  assert.ok(!stored.includes("PRIVATE_WRONG_ANSWER"));
  assert.ok(!stored.includes("acceptedAnswers"));
  assert.ok(!stored.includes("Ben braucht einen Stift"));
  assert.ok(
    s.writes.every(
      (path) => path.includes("/courseProgress/") || path.includes("/assessmentAttempts/"),
    ),
  );
  await deleteLearningData(s.db, owner);
  assert.equal(s.records.size, 0);
});
