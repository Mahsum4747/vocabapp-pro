import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { germanA1 } from "@/content/curriculum/german-a1";
import { validateCurriculum } from "./validate";
import { evaluateStep, startLesson, transitionLesson } from "./lesson-session";
import type { CurriculumRelease } from "./types";
const lesson = germanA1.lessons[0];
const clone = (): CurriculumRelease => structuredClone(germanA1);

test("approved registry remains exact and valid, including all 40 lesson references", () => {
  assert.deepEqual(validateCurriculum(germanA1), []);
  assert.equal(germanA1.skills.length, 100);
  assert.equal(germanA1.units.length, 10);
  assert.equal(germanA1.lessons.length, 40);
  const blueprint = readFileSync("GERMAN_A1_BLUEPRINT.md", "utf8");
  const rows = blueprint.split("\n").map((l) =>
    l
      .split("|")
      .slice(1, -1)
      .map((s) => s.trim()),
  );
  const skills = rows.filter((c) => c.length === 5 && /^[GRWV]\d{2}$/.test(c[0]));
  const handles = new Map(skills.map((c) => [c[0], c[1]]));
  assert.deepEqual(
    germanA1.skills.map((s) => s.id),
    skills.map((c) => c[1]),
  );
  for (const [index, row] of skills.entries())
    assert.deepEqual(
      germanA1.skills[index].hardPrerequisites,
      (row[3].match(/[GRWV]\d{2}/g) ?? []).map((h) => handles.get(h)),
    );
  const lessons = rows.filter((c) => /^DE\.A1\.U\d{2}\.L\d{2}$/.test(c[0]));
  assert.deepEqual(
    germanA1.lessons.map((l) => l.id),
    lessons.map((c) => c[0]),
  );
  for (const [index, row] of lessons.entries())
    assert.deepEqual(
      [
        ...germanA1.lessons[index].introducedSkillIds,
        ...germanA1.lessons[index].consolidatedSkillIds,
      ].sort(),
      (row[2].match(/[GRWV]\d{2}/g) ?? []).map((h) => handles.get(h)).sort(),
    );
});
test("validator rejects skill, unit, lesson and cross-entity duplicate IDs", () => {
  for (const key of ["skills", "units", "lessons"] as const) {
    const c = clone();
    if (key === "skills") c.skills = [...c.skills, c.skills[0]];
    else if (key === "units") c.units = [...c.units, c.units[0]];
    else c.lessons = [...c.lessons, c.lessons[0]];
    assert.ok(
      validateCurriculum(c).some((e) =>
        e.includes(
          `Duplicate ${key === "skills" ? "skill" : key === "units" ? "unit" : "lesson"} ID`,
        ),
      ),
    );
  }
  const c = clone();
  c.units[0].id = c.skills[0].id;
  assert.ok(validateCurriculum(c).some((e) => e.includes("across entities")));
});
test("validator reports cycles and self-dependencies deterministically without mutating input", () => {
  const c = clone();
  c.skills[0].hardPrerequisites = [c.skills[1].id];
  const before = JSON.stringify(c);
  const result = validateCurriculum(c);
  assert.ok(result.some((e) => e.includes("Hard prerequisite cycle:")));
  assert.deepEqual(validateCurriculum(c), result);
  assert.equal(JSON.stringify(c), before);
  c.skills[0].hardPrerequisites = [c.skills[0].id];
  assert.ok(validateCurriculum(c).some((e) => e.includes("Self-dependency")));
});
test("validator reports unresolved prerequisite and lesson/step skills", () => {
  const c = clone();
  c.skills[0].hardPrerequisites = ["missing"];
  c.lessons[0].introducedSkillIds = ["missing"];
  c.lessons[0].steps[0].skillIds = ["missing"];
  const result = validateCurriculum(c);
  for (const text of [
    "Unresolved prerequisite",
    "Unresolved lesson skill",
    "Unresolved step skill",
  ])
    assert.ok(result.some((e) => e.includes(text)));
});
test("validator rejects missing, duplicate, mismatched and orphan unit membership", () => {
  const c = clone();
  c.units[0].lessonIds = ["missing", c.lessons[4].id, c.lessons[4].id];
  const result = validateCurriculum(c);
  for (const text of [
    "Invalid lesson reference",
    "Invalid unit→lesson membership",
    "Duplicate lesson membership",
    "exactly one unit",
  ])
    assert.ok(result.some((e) => e.includes(text)));
  c.lessons[0].unitId = "missing";
  assert.ok(validateCurriculum(c).some((e) => e.includes("Unresolved unit")));
});
test("U01.L01 retains its authored and its bounded content/stage contract is complete", () => {
  assert.equal(lesson.id, "DE.A1.U01.L01");
  assert.deepEqual(lesson.introducedSkillIds, [
    "DE.A1.GRAMMAR.PRONOUNS.SUBJECT",
    "DE.A1.GRAMMAR.VERBS.SEIN_PRESENT",
    "DE.A1.GRAMMAR.ORDER.DECLARATIVE_V2",
    "DE.A1.VOCABULARY.PERSONAL_CORE",
    "DE.A1.WRITING.PERSONAL_FACT",
  ]);
  assert.deepEqual(
    lesson.steps.map((s) => s.stage),
    ["discover", "understand", "recognize", "recall", "produce", "apply", "check"],
  );
  assert.equal(lesson.steps.at(-1)?.purpose, "formative-check");
  assert.equal(lesson.steps[5].kind, "original");
  assert.ok(
    germanA1.lessons.slice(2).every((l) => l.availability === "not-authored" && !l.steps.length),
  );
  assert.throws(() => startLesson(germanA1.id, germanA1.lessons[2]));
  const c = clone();
  c.lessons[2].steps = lesson.steps;
  assert.ok(validateCurriculum(c).some((e) => e.includes("Unauthored lesson")));
});
test("bounded evaluation distinguishes blank, incorrect, equivalent and unassessed writing", () => {
  assert.equal(evaluateStep(lesson.steps[3], " "), null);
  assert.equal(evaluateStep(lesson.steps[3], "bist")?.outcome, "incorrect");
  assert.equal(evaluateStep(lesson.steps[4], "  Ich   bin Leo. ")?.outcome, "correct");
  assert.equal(evaluateStep(lesson.steps[4], "Du bist Leo")?.outcome, "incorrect");
  assert.equal(
    evaluateStep(lesson.steps[5], "This meaning has not been judged")?.outcome,
    "unassessed",
  );
  assert.equal(evaluateStep(lesson.steps[5], "x".repeat(161))?.outcome, "incorrect");
});
test("session cannot skip tasks; retry, completion and restart never imply mastery", () => {
  let state = startLesson(germanA1.id, lesson);
  const initial = state;
  for (const step of lesson.steps) {
    if (step.kind !== "explanation") {
      assert.equal(transitionLesson(lesson, state, { type: "continue" }), state);
      assert.equal(transitionLesson(lesson, state, { type: "check" }), state);
      if (step.kind === "text") {
        state = transitionLesson(lesson, state, { type: "respond", value: "wrong" });
        state = transitionLesson(lesson, state, { type: "check" });
        assert.equal(transitionLesson(lesson, state, { type: "continue" }), state);
      }
      state = transitionLesson(lesson, state, {
        type: "respond",
        value:
          step.kind === "choice"
            ? step.correctAnswer
            : step.kind === "text"
              ? step.acceptedAnswers[0]
              : "Ich bin Ada.",
      });
      state = transitionLesson(lesson, state, { type: "check" });
      assert.equal(transitionLesson(lesson, state, { type: "check" }), state);
    }
    state = transitionLesson(lesson, state, { type: "continue" });
  }
  assert.equal(state.status, "finished");
  assert.deepEqual(
    state.completedStepIds,
    lesson.steps.map((s) => s.id),
  );
  assert.equal(state.results[lesson.steps[5].id].outcome, "unassessed");
  assert.equal(state.attempts[lesson.steps[3].id], 2);
  assert.equal("mastery" in state, false);
  assert.equal(transitionLesson(lesson, state, { type: "continue" }), state);
  assert.deepEqual(startLesson(germanA1.id, lesson), initial);
});
