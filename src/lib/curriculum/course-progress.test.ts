import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { deleteLearningData } from "../account-deletion.server";
import { USER_SUBCOLLECTIONS } from "../user-data-inventory";
import {
  COURSE_SCOPE,
  durableProgressSchema,
  progressCommandSchema,
  resumeProgress,
  type ProgressCommand,
  type DurableProgress,
} from "./course-progress";
import {
  readCourseProgress,
  saveCourseProgress,
  lessonContentVersion,
  courseProgressPath,
  requireCourseAuthentication,
} from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import type { LessonDefinition } from "./types";
const [first, second] = germanA1.lessons;
const command = (
  lesson = first,
  revision = 0,
  action: ProgressCommand["action"] = { type: "continue", stepId: lesson.steps[0].id },
): ProgressCommand => ({
  ...COURSE_SCOPE,
  lessonId: lesson.id,
  lessonVersion: lessonContentVersion(lesson),
  expectedRevision: revision,
  operationId: randomUUID(),
  action,
});
async function finish(f: ReturnType<typeof fakeProgressDb>, lesson: LessonDefinition) {
  let revision = 0;
  for (const step of lesson.steps) {
    if (step.kind !== "explanation") {
      const result = await saveCourseProgress(
        f.db,
        "u",
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
      ++revision;
    }
    const result = await saveCourseProgress(
      f.db,
      "u",
      command(lesson, revision, { type: "continue", stepId: step.id }),
      100,
    );
    assert.equal(result.kind, "saved");
    ++revision;
  }
  return revision;
}
test("shape validation rejects UI/mastery/owner fields, huge payloads and invalid actions", () => {
  const valid = command();
  assert.ok(progressCommandSchema.safeParse(valid).success);
  for (const extra of [
    { userId: "victim" },
    { mastery: 100 },
    { title: "copy" },
    { action: { type: "check", stepId: first.steps[2].id, response: "x".repeat(161) } },
  ])
    assert.equal(progressCommandSchema.safeParse({ ...valid, ...extra }).success, false);
  assert.equal(durableProgressSchema.safeParse({ schemaVersion: 2 }).success, false);
});
test("reads are reads, empty documents are not created, owner isolation and auth wiring", async () => {
  const f = fakeProgressDb();
  assert.equal((await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0].progress, null);
  assert.equal(f.writes.length, 0);
  await saveCourseProgress(f.db, "u", command());
  assert.equal((await readCourseProgress(f.db, "victim", COURSE_SCOPE)).lessons[0].progress, null);
  await assert.rejects(readCourseProgress(f.db, "", COURSE_SCOPE));
  await assert.rejects(saveCourseProgress(f.db, "u", { ...command(), userId: "victim" }));
  const api = readFileSync("src/lib/curriculum/course-progress-api.ts", "utf8");
  assert.equal((api.match(/middleware\(\[authMiddleware\]\)/g) ?? []).length, 2);
  assert.equal((api.match(/context.userId/g) ?? []).length, 2);
  assert.equal((api.match(/await requireCourseAuthentication\(\)/g) ?? []).length, 2);
});
for (const lesson of [first, second])
  test(`${lesson.id}: checked-answer reload resume, retry count and exact position`, async () => {
    const f = fakeProgressDb();
    await saveCourseProgress(f.db, "u", command(lesson));
    await saveCourseProgress(
      f.db,
      "u",
      command(lesson, 1, { type: "continue", stepId: lesson.steps[1].id }),
    );
    await saveCourseProgress(
      f.db,
      "u",
      command(lesson, 2, { type: "check", stepId: lesson.steps[2].id, response: "wrong" }),
    );
    const loaded = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
      (entry) => entry.lessonId === lesson.id,
    )!.progress!;
    const resumed = resumeProgress(loaded, lesson);
    assert.equal(resumed.stepIndex, 2);
    assert.equal(resumed.responses[lesson.steps[2].id], "wrong");
    assert.equal(resumed.attempts[lesson.steps[2].id], 1);
    assert.equal(resumed.feedback?.outcome, "incorrect");
    assert.equal(resumed.completedStepIds.length, 2);
    assert.equal(
      (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
        (entry) => entry.lessonId !== lesson.id,
      )!.progress,
      null,
    );
  });
for (const lesson of [first, second])
  test(`${lesson.id}: completion reload and restart preserve historical truth`, async () => {
    const f = fakeProgressDb();
    const revision = await finish(f, lesson);
    const loaded = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
      (entry) => entry.lessonId === lesson.id,
    )!.progress!;
    assert.equal(resumeProgress(loaded, lesson).status, "finished");
    assert.equal(loaded.firstFinishedAt, 100);
    const restarted = await saveCourseProgress(
      f.db,
      "u",
      command(lesson, revision, { type: "restart" }),
      101,
    );
    assert.ok(restarted.kind === "saved");
    assert.equal(restarted.progress.firstFinishedAt, 100);
    assert.equal(restarted.progress.currentStepId, lesson.steps[0].id);
    assert.equal(resumeProgress(restarted.progress, lesson).historicallyFinished, true);
    assert.equal(resumeProgress(restarted.progress, lesson).status, "in-progress");
  });
test("duplicate acknowledgements, delayed retries and changed payloads never replay", async () => {
  const f = fakeProgressDb();
  const input = command();
  const result = await saveCourseProgress(f.db, "u", input, 100);
  assert.equal(result.kind, "saved");
  await saveCourseProgress(f.db, "u", input, 101);
  assert.equal(f.writes.length, 1);
  await saveCourseProgress(
    f.db,
    "u",
    command(first, 1, { type: "continue", stepId: first.steps[1].id }),
    102,
  );
  const delayed = await saveCourseProgress(f.db, "u", input, 103);
  assert.ok(delayed.kind === "saved");
  assert.equal(delayed.progress.revision, 2);
  assert.equal(f.writes.length, 2);
  await assert.rejects(saveCourseProgress(f.db, "u", { ...input, action: { type: "restart" } }));
});
test("two tabs, stale restart and out-of-order writes cannot silently regress", async () => {
  const f = fakeProgressDb();
  const results = await Promise.all([
    saveCourseProgress(f.db, "u", command()),
    saveCourseProgress(f.db, "u", command()),
  ]);
  assert.deepEqual(results.map((result) => result.kind).sort(), ["conflict", "saved"]);
  assert.equal(f.writes.length, 1);
  assert.ok(f.retries() > 0);
  const stale = await saveCourseProgress(f.db, "u", command(first, 0, { type: "restart" }));
  assert.ok(stale.kind === "conflict");
  assert.equal(stale.progress.currentStepId, first.steps[1].id);
  await assert.rejects(
    saveCourseProgress(
      f.db,
      "u",
      command(first, 1, { type: "continue", stepId: first.steps[3].id }),
    ),
  );
});
test("release/track/lesson rejection and changed/withdrawn content keep old records", async () => {
  const f = fakeProgressDb();
  for (const extra of [
    { releaseId: "unknown" },
    { trackId: "another" },
    { lessonId: "DE.A1.U01.L03" },
    { lessonId: "unknown" },
  ])
    await assert.rejects(saveCourseProgress(f.db, "u", { ...command(), ...extra }));
  assert.equal(f.writes.length, 0);
  assert.equal(
    (await saveCourseProgress(f.db, "u", { ...command(), lessonVersion: "0".repeat(64) })).kind,
    "unavailable",
  );
  await saveCourseProgress(f.db, "u", command());
  const path = courseProgressPath("u", command());
  const old = f.records.get(path) as DurableProgress;
  f.records.set(path, { ...old, lessonVersion: "0".repeat(64) });
  assert.equal((await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0].unavailable, true);
  assert.equal((await saveCourseProgress(f.db, "u", command(first, 1))).kind, "unavailable");
  assert.deepEqual(f.records.get(path), { ...old, lessonVersion: "0".repeat(64) });
});
test("skips/forged completed states rejected, bounded answers pruned, open text never stored", async () => {
  const f = fakeProgressDb();
  await assert.rejects(
    saveCourseProgress(
      f.db,
      "u",
      command(first, 0, { type: "continue", stepId: first.steps[3].id }),
    ),
  );
  await finish(f, first);
  const stored = f.records.get(courseProgressPath("u", command())) as DurableProgress;
  assert.equal(stored.response, null);
  assert.equal(stored.attempts, 0);
  assert.equal(JSON.stringify(stored).includes("Ich bin Alex"), false);
  assert.equal("mastery" in stored, false);
  assert.equal("results" in stored, false);
  const changed = { ...stored, completedStepIds: [first.steps[1].id] };
  f.records.set(courseProgressPath("u", command()), changed);
  await assert.rejects(readCourseProgress(f.db, "u", COURSE_SCOPE));
});
test("course writes never touch FSRS, grammar, Lesen, Paste or profile; deletion covers subtree", async () => {
  const f = fakeProgressDb({
    "users/other/courseProgress/private": { retained: true },
    "grammarProgress/u": { untouched: true },
  });
  await finish(f, first);
  await finish(f, second);
  assert.ok(f.writes.every((path) => path.startsWith("users/u/courseProgress/")));
  assert.deepEqual(f.records.get("grammarProgress/u"), { untouched: true });
  const before = f.writes.length;
  await readCourseProgress(f.db, "u", COURSE_SCOPE);
  assert.equal(f.writes.length, before);
  assert.ok(USER_SUBCOLLECTIONS.includes("courseProgress"));
  await deleteLearningData(f.db, "u");
  assert.equal(
    [...f.records.keys()].some((path) => path.startsWith("users/u/")),
    false,
  );
  assert.ok(f.records.has("users/other/courseProgress/private"));
});

test("receipt window is bounded; an evicted retry conflicts without replay or regression", async () => {
  const f = fakeProgressDb();
  const oldest = command();
  await saveCourseProgress(f.db, "u", oldest);
  for (let revision = 1; revision <= 65; revision++) {
    await saveCourseProgress(f.db, "u", command(first, revision, { type: "restart" }));
  }
  const before = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0].progress!;
  assert.equal(before.receipts.length, 64);
  assert.equal(before.revision, 66);
  const writes = f.writes.length;
  const result = await saveCourseProgress(f.db, "u", oldest);
  assert.equal(result.kind, "conflict");
  assert.equal(f.writes.length, writes);
  assert.deepEqual((await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0].progress, before);
});

test("auth-off preview fallback is rejected before any durable course access", async () => {
  const previous = process.env.VITE_AUTH_ENABLED;
  try {
    process.env.VITE_AUTH_ENABLED = "false";
    await assert.rejects(
      requireCourseAuthentication(),
      (error: unknown) => error instanceof Error && "status" in error && error.status === 401,
    );
  } finally {
    if (previous === undefined) delete process.env.VITE_AUTH_ENABLED;
    else process.env.VITE_AUTH_ENABLED = previous;
  }
});
