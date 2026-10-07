import assert from "node:assert/strict";
import test from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { auditLessonPedagogy } from "./lesson-pedagogy";

test("all 40 A1 lessons satisfy the locked teaching-model baseline", () => {
  assert.equal(germanA1.lessons.length, 40);
  for (const lesson of germanA1.lessons) {
    const audit = auditLessonPedagogy(lesson);
    assert.deepEqual(audit.flags, [], lesson.id);
    assert.ok(audit.teachingStepCount >= 1, lesson.id);
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
