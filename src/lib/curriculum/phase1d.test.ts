import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { germanA1 } from "@/content/curriculum/german-a1";
import {
  evaluateStep,
  sessionKey,
  startLesson,
  transitionLesson,
  type LessonSessions,
} from "./lesson-session";
import { unitProgress } from "./unit-progress";
import {
  COURSE_SCOPE,
  resumeProgress,
  type ProgressCommand,
  type DurableProgress,
} from "./course-progress";
import {
  readCourseProgress,
  saveCourseProgress,
  courseProgressPath,
} from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
const unit = germanA1.units[0];
const lessons = germanA1.lessons.slice(0, 4);
const blueprint = readFileSync("GERMAN_A1_BLUEPRINT.md", "utf8");
const rows = blueprint.split("\n").map((line) =>
  line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim()),
);
const skillRows = rows.filter((cells) => /^[GRWV]\d{2}$/.test(cells[0] ?? ""));
const handles = new Map(skillRows.map((cells) => [cells[0], cells[1]]));
for (const [index, stages] of [
  [
    2,
    [
      "discover",
      "understand",
      "recognize",
      "recall",
      "understand",
      "read",
      "read",
      "produce",
      "produce",
      "check",
    ],
  ],
  [
    3,
    [
      "discover",
      "understand",
      "recognize",
      "recall",
      "read",
      "produce",
      "apply",
      "apply",
      "apply",
      "apply",
      "check",
    ],
  ],
] as const) {
  const lesson = lessons[index];
  test(`${lesson.id}: exact blueprint metadata, prerequisites, bounded stages and coverage`, () => {
    const row = rows.find((cells) => cells[0] === lesson.id)!;
    assert.equal(lesson.title, row[1]);
    assert.equal(lesson.outcome, row[3]);
    assert.deepEqual(
      lesson.introducedSkillIds,
      row[2].split(",").map((handle) => handles.get(handle)),
    );
    assert.deepEqual(lesson.consolidatedSkillIds, []);
    assert.equal(lesson.unitId, unit.id);
    assert.equal(lesson.resumeContractVersion, 1);
    assert.deepEqual(
      lesson.steps.map((step) => step.stage),
      stages,
    );
    assert.equal(new Set(lesson.steps.map((step) => step.id)).size, lesson.steps.length);
    for (const id of lesson.introducedSkillIds) {
      const skill = germanA1.skills.find((entry) => entry.id === id)!;
      const row = skillRows.find((cells) => cells[1] === id)!;
      assert.deepEqual(
        skill.hardPrerequisites,
        (row[3].match(/[GRWV]\d{2}/g) ?? []).map((handle) => handles.get(handle)),
      );
      assert.ok(lesson.steps.some((step) => step.skillIds.includes(id)));
    }
    assert.ok(lesson.steps.some((step) => step.stage === "read" && step.example));
    assert.equal(lesson.steps.at(-1)?.purpose, "formative-check");
  });
  test(`${lesson.id}: all bounded tasks grade deterministically, open tasks stay unassessed, no skip`, () => {
    let state = startLesson(germanA1.id, lesson);
    for (const step of lesson.steps) {
      if (step.kind !== "explanation") {
        assert.equal(transitionLesson(lesson, state, { type: "continue" }), state);
        assert.equal(evaluateStep(step, " "), null);
        const response =
          step.kind === "choice"
            ? step.correctAnswer
            : step.kind === "text"
              ? step.acceptedAnswers[0]
              : "Ich bin Mira. Das Büro ist klein.";
        assert.equal(
          evaluateStep(step, response)?.outcome,
          step.kind === "original" ? "unassessed" : "correct",
        );
        if (step.kind === "text") {
          assert.equal(evaluateStep(step, "  " + response + "  ")?.outcome, "correct");
          for (const answer of step.acceptedAnswers)
            assert.equal(evaluateStep(step, answer)?.outcome, "correct");
        }
        if (step.kind !== "original")
          assert.equal(evaluateStep(step, "unrelated")?.outcome, "incorrect");
        state = transitionLesson(lesson, state, { type: "respond", value: response });
        state = transitionLesson(lesson, state, { type: "check" });
      }
      state = transitionLesson(lesson, state, { type: "continue" });
    }
    assert.equal(state.status, "finished");
    assert.equal("mastery" in state, false);
    assert.equal("evidence" in state, false);
  });
}
test("new tasks distinguish reversed dates, count/plural, verb and unsupported descriptions", () => {
  const [l03, l04] = lessons.slice(2);
  const check = (index: number, id: string, good: string, bad: string) => {
    const step = lessons[index].steps.find((entry) => entry.id.endsWith(id))!;
    assert.equal(evaluateStep(step, good)?.outcome, "correct");
    assert.equal(evaluateStep(step, bad)?.outcome, "incorrect");
  };
  check(2, ".read-date", "3.12.", "12.03.");
  check(2, ".count", "zwei Telefone", "zwei Telefon");
  check(2, ".produce", "Wer bist du?", "Wer du bist?");
  check(3, ".recall", "habe", "bin");
  check(3, ".produce", "Das Büro ist groß.", "Das Büro ist kleine.");
  assert.notDeepEqual(
    l03.steps.map((s) => s.stage),
    l04.steps.map((s) => s.stage),
  );
});
function command(
  index: number,
  revision: number,
  action: ProgressCommand["action"],
): ProgressCommand {
  return {
    ...COURSE_SCOPE,
    lessonId: lessons[index].id,
    resumeContractVersion: 1,
    expectedRevision: revision,
    operationId: randomUUID(),
    action,
  };
}
test("four durable lesson records derive unit completion; every write is isolated; restart keeps milestone", async () => {
  const f = fakeProgressDb();
  let sessions: LessonSessions = {};
  assert.equal(unitProgress(germanA1, unit, sessions).status, "Not started");
  const read = async () => {
    const rows = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons;
    assert.equal(rows.length, 4);
    sessions = Object.fromEntries(
      rows
        .filter((row) => row.progress)
        .map((row) => [
          sessionKey(germanA1.id, row.lessonId),
          resumeProgress(
            row.progress!,
            lessons.find((l) => l.id === row.lessonId)!,
          ),
        ]),
    );
    return rows;
  };
  for (const [index, lesson] of lessons.entries()) {
    let revision = 0;
    for (const step of lesson.steps) {
      const others = [...f.records.entries()].filter(
        ([path]) => path !== courseProgressPath("u", command(index, 0, { type: "restart" })),
      );
      if (step.kind !== "explanation") {
        await saveCourseProgress(
          f.db,
          "u",
          command(index, revision++, {
            type: "check",
            stepId: step.id,
            ...(step.kind === "original"
              ? {}
              : {
                  response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0],
                }),
          }),
          100,
        );
      }
      await saveCourseProgress(
        f.db,
        "u",
        command(index, revision++, { type: "continue", stepId: step.id }),
        100,
      );
      for (const [path, value] of others) assert.deepEqual(f.records.get(path), value);
    }
    await read();
    assert.equal(unitProgress(germanA1, unit, sessions).finishedCount, index + 1);
    assert.equal(
      unitProgress(germanA1, unit, sessions).status,
      index === 3 ? "Unit lessons complete" : "In progress",
    );
    assert.equal(unitProgress(germanA1, unit, sessions).nextLesson?.id, lessons[index + 1]?.id);
  }
  assert.equal(f.records.size, 4); // No unit-completion document or other root.
  const l04 = (await read())[3].progress!;
  const writesBeforeStale = f.writes.length;
  const stale = await saveCourseProgress(
    f.db,
    "u",
    command(3, l04.revision - 1, { type: "restart" }),
    101,
  );
  assert.equal(stale.kind, "conflict");
  assert.equal(f.writes.length, writesBeforeStale);
  assert.deepEqual((await read())[3].progress, l04);
  assert.equal(unitProgress(germanA1, unit, sessions).status, "Unit lessons complete");
  await saveCourseProgress(f.db, "u", command(3, l04.revision, { type: "restart" }), 101);
  await read();
  const progress = unitProgress(germanA1, unit, sessions);
  assert.equal(progress.status, "Unit lessons complete");
  assert.equal(progress.repeatLesson?.id, lessons[3].id);
  assert.equal(progress.nextLesson, undefined);
  assert.equal(sessions[sessionKey(germanA1.id, lessons[3].id)].historicallyFinished, true);
  assert.ok(f.writes.every((path) => path.startsWith("users/u/courseProgress/")));
  for (const stored of f.records.values()) {
    assert.ok(stored !== null && typeof stored === "object");
    assert.equal("mastery" in stored, false);
    assert.equal("evidence" in stored, false);
  }
  assert.equal(unitProgress(germanA1, unit, sessions, [lessons[3].id]).status, "In progress");
  assert.equal(unitProgress(germanA1, germanA1.units[1], sessions).status, "Not yet authored");
});
for (const index of [2, 3])
  test(`${lessons[index].id}: duplicate retries and stale revisions cannot regress or create legacy writes`, async () => {
    const f = fakeProgressDb();
    const lesson = lessons[index];
    const initial = command(index, 0, { type: "continue", stepId: lesson.steps[0].id });
    await saveCourseProgress(f.db, "u", initial);
    const duplicate = await saveCourseProgress(f.db, "u", initial);
    assert.equal(duplicate.kind, "saved");
    assert.equal(f.writes.length, 1);
    assert.equal(
      (await saveCourseProgress(f.db, "u", command(index, 0, { type: "restart" }))).kind,
      "conflict",
    );
    const path = courseProgressPath("u", initial);
    const previous = f.records.get(path) as DurableProgress;
    assert.equal(previous.currentStepId, lesson.steps[1].id);
    assert.equal(previous.revision, 1);
    assert.equal(f.writes.length, 1);
    assert.equal(
      (
        await saveCourseProgress(f.db, "u", {
          ...command(index, 1, { type: "restart" }),
          resumeContractVersion: 2,
        })
      ).kind,
      "unavailable",
    );
    await assert.rejects(saveCourseProgress(f.db, "u", { ...initial, releaseId: "another" }));
    assert.deepEqual(f.records.get(path), previous);
  });

test("derived completion cannot count missing/unauthored lessons or another release's sessions", () => {
  const sessions = Object.fromEntries(
    lessons.map((lesson) => [
      sessionKey(germanA1.id, lesson.id),
      { ...startLesson(germanA1.id, lesson), status: "finished" as const },
    ]),
  );
  assert.equal(unitProgress(germanA1, unit, sessions).status, "Unit lessons complete");
  const unavailable = {
    ...germanA1,
    lessons: germanA1.lessons.map((lesson) =>
      lesson.id === lessons[3].id
        ? { ...lesson, availability: "not-authored" as const, steps: [] }
        : lesson,
    ),
  };
  assert.equal(unitProgress(unavailable, unit, sessions).status, "In progress");
  assert.notEqual(
    unitProgress(germanA1, { ...unit, lessonIds: [...unit.lessonIds, "missing"] }, sessions).status,
    "Unit lessons complete",
  );
  assert.equal(
    unitProgress({ ...germanA1, id: "another-release" }, unit, sessions).status,
    "Not started",
  );
  assert.notEqual(
    unitProgress(germanA1, { ...unit, lessonIds: [] }, sessions).status,
    "Unit lessons complete",
  );
});
