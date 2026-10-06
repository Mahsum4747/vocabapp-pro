import { lessonHint } from "./lesson-hint";
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { germanA1 } from "@/content/curriculum/german-a1";
import {
  evaluateStep,
  normalizeLessonAnswer,
  startLesson,
  transitionLesson,
  type LessonSession,
} from "./lesson-session";
import {
  applyProgressCommand,
  initialProgress,
  COURSE_SCOPE,
  type DurableProgress,
} from "./course-progress";
import { homeCourseAction } from "./home-course";
import type { LessonStep } from "./types";

const step = (id: string) =>
  germanA1.lessons.flatMap((l) => l.steps).find((s) => s.id.endsWith(id))!;
test("German bounded keyboard fallbacks preserve intentional capitalization and meaning", () => {
  for (const [a, b] of [
    ["groß", "gross"],
    ["für", "fuer"],
    ["Büro", "Buero"],
    ["schläft", "schlaeft"],
    ["schön", "schoen"],
  ])
    assert.equal(normalizeLessonAnswer(a, false, true), normalizeLessonAnswer(b, false, true));
  assert.notEqual(normalizeLessonAnswer("für"), normalizeLessonAnswer("fuer"));
  assert.equal(evaluateStep(step("U01.L02.produce"), "ein Buero")?.outcome, "correct");
  assert.equal(evaluateStep(step("U01.L02.produce"), "ein buero")?.outcome, "incorrect");
  assert.equal(evaluateStep(step("U02.L04.read"), "gross")?.outcome, "correct");
  assert.equal(
    evaluateStep({ ...step("U02.L04.read"), answerLanguage: undefined } as LessonStep, "gross")
      ?.outcome,
    "incorrect",
  );
  assert.equal(evaluateStep(step("U02.L04.read"), "klein")?.outcome, "incorrect");
});
test("each reviewed sentence blank accepts only its exact taught sentence equivalent", () => {
  const blanks = germanA1.lessons
    .flatMap((l) => l.steps)
    .filter(
      (s): s is LessonStep & { kind: "text" } => s.kind === "text" && s.prompt.includes("___"),
    );
  assert.equal(blanks.length, 11);
  for (const s of blanks) {
    assert.ok(s.prompt.includes("Type only the missing"), s.id);
    assert.equal(s.acceptedAnswers.length, 2, s.id);
    assert.equal(evaluateStep(s, s.acceptedAnswers[1])?.outcome, "correct", s.id);
    assert.equal(evaluateStep(s, s.acceptedAnswers[1] + " Heute.")?.outcome, "incorrect", s.id);
  }
  assert.equal(evaluateStep(step("U02.L04.recall"), "Du liest.")?.outcome, "correct");
  assert.equal(evaluateStep(step("U02.L04.recall"), "Er liest.")?.outcome, "incorrect");
  const adjective = step("U02.L04.read");
  assert.equal(adjective.kind === "text" && adjective.inputLabel, "Adjective");
});
test("reveal requires three failures, keeps the wrong response and is unassessed; durable traversal uses existing fields", () => {
  const lesson = germanA1.lessons[7];
  const index = lesson.steps.findIndex((s) => s.id.endsWith(".recall"));
  const current = lesson.steps[index];
  let state: LessonSession = {
    ...startLesson(germanA1.id, lesson),
    stepIndex: index,
    completedStepIds: lesson.steps.slice(0, index).map((s) => s.id),
  };
  let progress: DurableProgress = {
    ...initialProgress(lesson, "0".repeat(64)),
    currentStepId: current.id,
    completedStepIds: [...state.completedStepIds],
  };
  const command = (
    action:
      { type: "check"; stepId: string; response: string } | { type: "continue"; stepId: string },
  ) => ({
    ...COURSE_SCOPE,
    lessonId: lesson.id,
    resumeContractVersion: lesson.resumeContractVersion!,
    expectedRevision: progress.revision,
    operationId: randomUUID(),
    action,
  });
  for (let i = 1; i <= 3; i++) {
    state = transitionLesson(lesson, state, { type: "respond", value: "wrong" });
    state = transitionLesson(lesson, state, { type: "check" });
    const result = applyProgressCommand(
      progress,
      command({ type: "check", stepId: current.id, response: "wrong" }),
      lesson,
      String(i).repeat(64),
      i,
    );
    assert.equal(result.kind, "saved");
    if (result.kind !== "saved") throw Error();
    progress = result.progress;
    if (i < 3) {
      assert.equal(transitionLesson(lesson, state, { type: "reveal" }), state);
      assert.throws(() =>
        applyProgressCommand(
          progress,
          command({ type: "continue", stepId: current.id }),
          lesson,
          "4".repeat(64),
          4,
        ),
      );
    }
  }
  state = transitionLesson(lesson, state, { type: "reveal" });
  assert.equal(state.feedback?.outcome, "unassessed");
  assert.equal(state.responses[current.id], "wrong");
  assert.equal(transitionLesson(lesson, state, { type: "continue" }).stepIndex, index + 1);
  const advanced = applyProgressCommand(
    progress,
    command({ type: "continue", stepId: current.id }),
    lesson,
    "5".repeat(64),
    5,
  );
  assert.equal(advanced.kind, "saved");
  if (advanced.kind === "saved") {
    assert.equal(advanced.progress.currentStepId, lesson.steps[index + 1].id);
    assert.equal(advanced.progress.response, null);
  }
});
test("Home derives start/continue/blocked from existing scoped course progress", () => {
  const lesson = germanA1.lessons[0];
  const base = { ...COURSE_SCOPE, lessons: [] };
  assert.equal(homeCourseAction(base).started, false);
  assert.equal(homeCourseAction(base).lesson?.id, lesson.id);
  const descriptor = {
    lessonId: lesson.id,
    resumeContractVersion: 1,
    definitionHash: "0".repeat(64),
    unavailable: false,
    progress: initialProgress(lesson, "0".repeat(64)),
  };
  assert.equal(homeCourseAction({ ...base, lessons: [descriptor] }).started, true);
  assert.equal(
    homeCourseAction({ ...base, lessons: [{ ...descriptor, unavailable: true }] }).lesson?.id,
    germanA1.lessons[1].id,
  );
});

test("structural hints remain confined to bounded teaching tasks", () => {
  assert.match(lessonHint(step("U02.L04.sleep")), /subject/);
  assert.match(lessonHint(step("U02.L04.read")), /adjective/);
  assert.equal(lessonHint(step("U02.L04.original")), "");
});
