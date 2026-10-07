import assert from "node:assert/strict";
import test from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { auditLessonPedagogy } from "./lesson-pedagogy";

test("Units 1 and 2 satisfy the locked teaching-model baseline", () => {
  const lessons = germanA1.lessons.filter((item) => ["DE.A1.U01", "DE.A1.U02"].includes(item.unitId));
  assert.equal(lessons.length, 8);
  for (const lesson of lessons) {
    const audit = auditLessonPedagogy(lesson);
    assert.deepEqual(audit.flags, [], lesson.id);
    assert.ok(audit.teachingStepCount >= 2, lesson.id);
    assert.ok(audit.practiceStepCount >= 4, lesson.id);
    assert.equal(audit.hasOriginalTransfer, true, lesson.id);
  }
});

test("audit flags assessment-shaped lessons that teach nothing", () => {
  const lesson = structuredClone(germanA1.lessons[0]);
  lesson.steps = lesson.steps
    .filter((step) => step.purpose !== "teach")
    .map((step) => ({ ...step, purpose: "practice" as const }));
  const audit = auditLessonPedagogy(lesson);
  assert.ok(audit.flags.includes("missing_teaching"));
  assert.ok(audit.flags.includes("practice_before_teaching"));
});
