import assert from "node:assert/strict";
import test from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { auditLessonPedagogy } from "./lesson-pedagogy";

test("U1L1 satisfies the locked teaching-model baseline", () => {
  const lesson = germanA1.lessons.find((item) => item.id === "DE.A1.U01.L01");
  assert.ok(lesson);
  const audit = auditLessonPedagogy(lesson);
  assert.deepEqual(audit.flags, []);
  assert.ok(audit.teachingStepCount >= 3);
  assert.ok(audit.practiceStepCount >= 4);
  assert.equal(audit.hasOriginalTransfer, true);
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
