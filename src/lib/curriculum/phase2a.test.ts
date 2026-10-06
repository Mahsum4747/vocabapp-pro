import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import { germanA1 } from "@/content/curriculum/german-a1";
import { evaluateStep, sessionKey, startLesson, type LessonSessions } from "./lesson-session";
import { courseLearningAction, unitProgress } from "./unit-progress";
import { COURSE_SCOPE, resumeProgress, type ProgressCommand } from "./course-progress";
import {
  readCourseProgress,
  saveCourseProgress,
  courseProgressPath,
} from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { ASSESSMENT_REQUEST, createAssessmentAttempt } from "./assessment.server";

const lessons = germanA1.lessons.slice(4, 8);
const unit = germanA1.units[1];
const blueprintRows = readFileSync("GERMAN_A1_BLUEPRINT.md", "utf8")
  .split("\n")
  .map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );
const skillRows = blueprintRows.filter((cells) => /^[GRWV]\d{2}$/.test(cells[0] ?? ""));
const handles = new Map(skillRows.map((cells) => [cells[0], cells[1]]));
for (const lesson of lessons) {
  test(`${lesson.id}: exact metadata, skill focus, graph and original scope`, () => {
    const row = blueprintRows.find((cells) => cells[0] === lesson.id)!;
    assert.equal(lesson.title, row[1]);
    assert.equal(lesson.outcome, row[3]);
    assert.deepEqual(
      lesson.introducedSkillIds,
      row[2].split(",").map((handle) => handles.get(handle)),
    );
    assert.deepEqual(lesson.consolidatedSkillIds, []);
    assert.equal(lesson.unitId, unit.id);
    assert.equal(lesson.resumeContractVersion, 1);
    assert.equal(lesson.availability, "prototype");
    for (const id of lesson.introducedSkillIds) {
      const skill = germanA1.skills.find((skill) => skill.id === id)!;
      const row = skillRows.find((cells) => cells[1] === id)!;
      assert.deepEqual(
        skill.hardPrerequisites,
        (row[3].match(/[GRWV]\d{2}/g) ?? []).map((handle) => handles.get(handle)),
      );
      assert.ok(lesson.steps.some((step) => step.skillIds.includes(id)));
    }
  });
  test(`${lesson.id}: structural progression precedes bounded production and formative check`, () => {
    const stages = lesson.steps.map((step) => step.stage);
    for (const stage of [
      "discover",
      "understand",
      "recognize",
      "recall",
      "produce",
      "apply",
      "check",
    ] as const)
      assert.ok(stages.includes(stage));
    assert.ok(stages.indexOf("recall") < stages.indexOf("produce"));
    assert.ok(stages.indexOf("recognize") < stages.indexOf("recall"));
    assert.equal(lesson.steps.at(-1)?.purpose, "formative-check");
    assert.equal(new Set(lesson.steps.map((step) => step.id)).size, lesson.steps.length);
  });
  test(`${lesson.id}: checked reload, receipts, stale revisions and lesson isolation`, async () => {
    const f = fakeProgressDb();
    const write = (revision: number, action: ProgressCommand["action"]) => ({
      ...COURSE_SCOPE,
      lessonId: lesson.id,
      resumeContractVersion: 1,
      expectedRevision: revision,
      operationId: randomUUID(),
      action,
    });
    await saveCourseProgress(f.db, "u", {
      ...write(0, { type: "continue", stepId: lesson.steps[0].id }),
      lessonId: germanA1.lessons[0].id,
      action: { type: "continue", stepId: germanA1.lessons[0].steps[0].id },
    });
    const before = structuredClone([...f.records.entries()]);
    let revision = 0;
    const index = lesson.steps.findIndex((step) => step.kind !== "explanation");
    for (const step of lesson.steps.slice(0, index))
      await saveCourseProgress(f.db, "u", write(revision++, { type: "continue", stepId: step.id }));
    const step = lesson.steps[index];
    assert.equal(step.kind, "choice");
    if (step.kind !== "choice") throw Error("Expected recognition choice");
    const command = write(revision++, {
      type: "check",
      stepId: step.id,
      response: step.correctAnswer,
    });
    await saveCourseProgress(f.db, "u", command);
    const writes = f.writes.length;
    assert.equal((await saveCourseProgress(f.db, "u", command)).kind, "saved");
    assert.equal(f.writes.length, writes);
    assert.equal(
      (await saveCourseProgress(f.db, "u", write(0, { type: "restart" }))).kind,
      "conflict",
    );
    const saved = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
      (row) => row.lessonId === lesson.id,
    )!;
    const restored = resumeProgress(saved.progress!, lesson);
    assert.equal(restored.stepIndex, index);
    assert.equal(restored.responses[step.id], step.correctAnswer);
    assert.equal(saved.progress!.checked, true);
    for (const [path, record] of before) assert.deepEqual(f.records.get(path), record);
    assert.ok(f.writes.every((path) => path.startsWith("users/u/courseProgress/")));
  });
}

const grading = [
  [0, "recall", "wohnst", "wohne"],
  [0, "transform", "Wir lernen Deutsch.", "Wir lerne Deutsch."],
  [0, "familiar-group", "lernt", "lernen"],
  [0, "polite", "Sie wohnen in Berlin.", "Sie wohnt in Berlin."],
  [
    0,
    "apply",
    "Nora lernt Deutsch. Wir wohnen in Berlin.",
    "Nora lernen Deutsch. Wir wohnt in Berlin.",
  ],
  [0, "check", "lernen", "lernt"],
  [0, "action", "Wir lernen Deutsch.", "Wir wohnen in Berlin."],
  [1, "recall", "Bücher", "Buche"],
  [1, "recognize", "Unsere Bücher sind groß.", "Unser Bücher ist groß."],
  [1, "produce", "Dein Telefon ist klein.", "Deine Telefon ist klein."],
  [1, "read", "Leo", "Nora"],
  [
    1,
    "apply",
    "Ihre Bücher sind groß. Sein Telefon ist klein.",
    "Seine Bücher sind groß. Ihr Telefon ist klein.",
  ],
  [1, "check", "Mira", "Leo"],
  [2, "recall", "Ich lerne nicht.", "Ich lerne kein."],
  [2, "noun", "keine", "nicht"],
  [2, "contrast", "Das ist kein Telefon.", "Das Telefon ist nicht klein."],
  [2, "produce", "Mein Büro ist nicht groß.", "Mein Büro ist kein groß."],
  [
    2,
    "apply",
    "Das ist kein Telefon. Mein Büro ist nicht groß.",
    "Das ist nicht Telefon. Mein Büro ist kein groß.",
  ],
  [2, "check", "kein", "keinen"],
  [3, "read", "groß", "klein"],
  [3, "recall", "liest", "lest"],
  [3, "sleep", "schläft", "schlaft"],
  [3, "produce", "Nora liest und wir lernen Deutsch.", "Nora liest und wir Deutsch lernen."],
  [
    3,
    "revise",
    "Mein Büro ist klein und ich lerne Deutsch.",
    "Mein Büro ist groß und ich lernt Deutsch.",
  ],
  [3, "check", "Leo liest und Mira schläft.", "Leo lest und Mira schlaft."],
] as const;
for (const [index, suffix, good, bad] of grading)
  test(`${lessons[index].id}.${suffix}: accepts intended meaning/form and rejects confusable alternative`, () => {
    const step = lessons[index].steps.find((step) => step.id.endsWith("." + suffix))!;
    assert.equal(evaluateStep(step, good)?.outcome, "correct");
    assert.equal(evaluateStep(step, bad)?.outcome, "incorrect");
  });
test("negation explicitly contrasts meanings; revision checklist does not reveal answer", () => {
  assert.ok(lessons[2].steps.some((step) => step.stage === "classify"));
  const step = lessons[3].steps.find((step) => step.id.endsWith(".revise"))!;
  assert.equal(step.kind, "text");
  if (step.kind !== "text") throw Error("Expected bounded revision");
  assert.ok(
    !JSON.stringify({
      prompt: step.prompt,
      example: step.example,
      explanation: step.explanation,
    }).includes(step.acceptedAnswers[0]),
  );
  assert.match(step.explanation!, /subject–verb agreement/);
});
for (const index of [2, 3])
  test(`${lessons[index].id}: open writing remains unassessed and absent from durable storage`, async () => {
    const lesson = lessons[index];
    const original = lesson.steps.find((step) => step.kind === "original")!;
    assert.equal(evaluateStep(original, "PRIVATE_HOME")?.outcome, "unassessed");
    const f = fakeProgressDb();
    let revision = 0;
    for (const step of lesson.steps.slice(0, lesson.steps.indexOf(original) + 1)) {
      if (step.kind !== "explanation")
        await saveCourseProgress(f.db, "u", {
          ...COURSE_SCOPE,
          lessonId: lesson.id,
          resumeContractVersion: 1,
          expectedRevision: revision++,
          operationId: randomUUID(),
          action: {
            type: "check",
            stepId: step.id,
            ...(step.kind === "original"
              ? {}
              : {
                  response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0],
                }),
          },
        });
      if (step !== original)
        await saveCourseProgress(f.db, "u", {
          ...COURSE_SCOPE,
          lessonId: lesson.id,
          resumeContractVersion: 1,
          expectedRevision: revision++,
          operationId: randomUUID(),
          action: { type: "continue", stepId: step.id },
        });
    }
    assert.ok(!JSON.stringify([...f.records]).includes("PRIVATE_HOME"));
    const stored = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
      (row) => row.lessonId === lesson.id,
    )!.progress!;
    assert.equal(stored.response, null);
    assert.equal(resumeProgress(stored, lesson).feedback?.outcome, "unassessed");
  });

async function finish(f: ReturnType<typeof fakeProgressDb>, index: number) {
  const lesson = germanA1.lessons[index];
  let revision = 0;
  for (const step of lesson.steps) {
    const command = (action: ProgressCommand["action"]) => ({
      ...COURSE_SCOPE,
      lessonId: lesson.id,
      resumeContractVersion: 1,
      expectedRevision: revision++,
      operationId: randomUUID(),
      action,
    });
    if (step.kind !== "explanation")
      await saveCourseProgress(
        f.db,
        "u",
        command({
          type: "check",
          stepId: step.id,
          ...(step.kind === "original"
            ? {}
            : { response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0] }),
        }),
      );
    await saveCourseProgress(f.db, "u", command({ type: "continue", stepId: step.id }));
  }
}
async function sessions(f: ReturnType<typeof fakeProgressDb>): Promise<LessonSessions> {
  return Object.fromEntries(
    (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons
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
test("three Unit 2 lessons are incomplete; four finish only Unit 2; restart retains milestone", async () => {
  const f = fakeProgressDb();
  assert.equal(unitProgress(germanA1, unit, {}).status, "Not started");
  for (const index of [4, 5, 6]) await finish(f, index);
  assert.equal(unitProgress(germanA1, unit, await sessions(f)).status, "In progress");
  assert.equal(unitProgress(germanA1, germanA1.units[0], await sessions(f)).status, "Not started");
  await finish(f, 7);
  assert.equal(unitProgress(germanA1, unit, await sessions(f)).status, "Unit lessons complete");
  const before = structuredClone([...f.records]);
  const stored = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[7].progress!;
  await saveCourseProgress(f.db, "u", {
    ...COURSE_SCOPE,
    lessonId: lessons[3].id,
    resumeContractVersion: 1,
    expectedRevision: stored.revision,
    operationId: randomUUID(),
    action: { type: "restart" },
  });
  const state = unitProgress(germanA1, unit, await sessions(f));
  assert.equal(state.status, "Unit lessons complete");
  assert.equal(state.repeatLesson?.id, lessons[3].id);
  assert.equal(
    (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[7].progress!.firstFinishedAt,
    stored.firstFinishedAt,
  );
  for (const [path, record] of before.filter(
    ([path]) => path !== courseProgressPath("u", { ...COURSE_SCOPE, lessonId: lessons[3].id }),
  ))
    assert.deepEqual(f.records.get(path), record);
  assert.equal(f.records.size, 4);
  assert.ok(f.writes.every((path) => path.startsWith("users/u/courseProgress/")));
  assert.ok(
    !JSON.stringify([...f.records]).match(
      /EvidenceEvent|mastery|assessmentAttempts|grammarProgress|lesenProgress|CardProgress|pasteProgress/,
    ),
  );
});
test("next guided action follows Unit 1 then Unit 2, independently of assessment; Units 3–10 unavailable", async () => {
  const f = fakeProgressDb();
  assert.equal(courseLearningAction(germanA1, {}).lesson?.id, germanA1.lessons[0].id);
  for (const index of [0, 1, 2, 3]) await finish(f, index);
  const states = await sessions(f);
  assert.equal(courseLearningAction(germanA1, states).lesson?.id, lessons[0].id);
  assert.equal(unitProgress(germanA1, germanA1.units[0], states).status, "Unit lessons complete");
  assert.equal(f.records.size, 4);
  const attempt = await createAssessmentAttempt(f.db, "u", {
    ...ASSESSMENT_REQUEST,
    attemptId: randomUUID(),
  });
  assert.equal(attempt.formId, "U01.FORM.A");
  assert.equal(courseLearningAction(germanA1, states).lesson?.id, lessons[0].id);
  assert.ok(
    germanA1.lessons
      .slice(8)
      .every((lesson) => lesson.availability === "not-authored" && !lesson.steps.length),
  );
  assert.throws(() => startLesson(germanA1.id, germanA1.lessons[8]));
});
test("Unit 2 completion does not unlock Unit 1 check or generate assessment evidence", async () => {
  const f = fakeProgressDb();
  for (const index of [4, 5, 6, 7]) await finish(f, index);
  const before = structuredClone([...f.records]);
  await assert.rejects(
    createAssessmentAttempt(f.db, "u", { ...ASSESSMENT_REQUEST, attemptId: randomUUID() }),
    /four Unit 1/,
  );
  assert.deepEqual([...f.records], before);
  assert.equal(f.records.size, 4);
});
test("reviewed verb inventory agrees with authoritative repository forms", () => {
  const source = readFileSync("src/lib/german/verb-conjugation-data.ts", "utf8");
  for (const row of [
    'infinitive: "lernen", ich: "lerne", du: "lernst", er: "lernt"',
    'infinitive: "wohnen", ich: "wohne", du: "wohnst", er: "wohnt"',
    'infinitive: "lesen", ich: "lese", du: "liest", er: "liest"',
    'infinitive: "schlafen", ich: "schlafe", du: "schläfst", er: "schläft"',
  ])
    assert.ok(source.includes(row));
});

for (const [path, hash] of [
  [
    "src/content/curriculum/german-a1-unit1-check.ts",
    "8e5699d988a1367dd82808d011f5a83bc2b4f935c2ead4d5bcb795ebfcdbc5cf",
  ],
])
  test(`${path}: approved Forms A/B and evidence projection remain byte-for-byte unchanged`, () => {
    assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex"), hash);
  });
