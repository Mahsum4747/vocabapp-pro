import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { deleteLearningData } from "../account-deletion.server";
import { USER_SUBCOLLECTIONS } from "../user-data-inventory";
import {
  COURSE_SCOPE,
  lessonResumeContractVersion,
  durableProgressSchema,
  progressCommandSchema,
  resumeProgress,
  type ProgressCommand,
  type DurableProgress,
} from "./course-progress";
import {
  lessonDefinitionHash,
  readCourseProgress,
  saveCourseProgress,
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
  resumeContractVersion: lessonResumeContractVersion(lesson),
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
  assert.equal(durableProgressSchema.safeParse({ schemaVersion: 3 }).success, false);
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
    (await saveCourseProgress(f.db, "u", { ...command(), resumeContractVersion: 2 })).kind,
    "unavailable",
  );
  await saveCourseProgress(f.db, "u", command());
  const path = courseProgressPath("u", command());
  const old = f.records.get(path) as DurableProgress;
  f.records.set(path, { ...old, resumeContractVersion: 2 });
  assert.equal((await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0].unavailable, true);
  assert.equal((await saveCourseProgress(f.db, "u", command(first, 1))).kind, "unavailable");
  assert.deepEqual(f.records.get(path), { ...old, resumeContractVersion: 2 });
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

// Simulate a reviewed authored-definition edit without changing the storage adapter.
async function withLesson(lesson: LessonDefinition, run: () => Promise<void>) {
  const original = germanA1.lessons;
  germanA1.lessons = original.map((entry) => (entry.id === lesson.id ? lesson : entry));
  try {
    await run();
  } finally {
    germanA1.lessons = original;
  }
}
async function checkedChoice(lesson: LessonDefinition) {
  const f = fakeProgressDb();
  await saveCourseProgress(f.db, "u", command(lesson));
  await saveCourseProgress(
    f.db,
    "u",
    command(lesson, 1, { type: "continue", stepId: lesson.steps[1].id }),
  );
  const step = lesson.steps[2];
  assert.equal(step.kind, "choice");
  if (step.kind !== "choice") throw Error("Fixture needs a choice");
  const check = command(lesson, 2, {
    type: "check",
    stepId: step.id,
    response: step.correctAnswer,
  });
  await saveCourseProgress(f.db, "u", check);
  return { f, check, step };
}
for (const lesson of [first, second])
  test(`${lesson.id}: copy and feedback edits preserve checked resume, completion and receipt retries`, async () => {
    const { f, check, step } = await checkedChoice(lesson);
    const completed = fakeProgressDb();
    await finish(completed, lesson);
    const previous = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
      (entry) => entry.lessonId === lesson.id,
    )!.progress!;
    const edited: LessonDefinition = {
      ...lesson,
      title: `${lesson.title}!`,
      description: "A clearer learner-facing subtitle.",
      steps: lesson.steps.map((entry) =>
        entry.kind === "choice" || entry.kind === "text"
          ? {
              ...entry,
              label: `${entry.label}.`,
              prompt: `${entry.prompt} `,
              feedback: `${entry.feedback} Take your time.`,
            }
          : entry,
      ),
    };
    assert.notEqual(lessonDefinitionHash(edited), lessonDefinitionHash(lesson));
    assert.equal(lessonResumeContractVersion(edited), lessonResumeContractVersion(lesson));
    await withLesson(edited, async () => {
      const descriptor = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
        (entry) => entry.lessonId === lesson.id,
      )!;
      assert.equal(descriptor.unavailable, false);
      assert.equal(descriptor.definitionHash, lessonDefinitionHash(edited));
      assert.deepEqual(descriptor.progress, previous); // A diagnostic hash mismatch never rewrites a read.
      const restored = resumeProgress(descriptor.progress!, edited);
      assert.equal(restored.responses[step.id], step.correctAnswer);
      assert.equal(restored.feedback?.outcome, "correct");
      assert.ok(restored.feedback?.message.includes("Take your time."));
      const finished = (await readCourseProgress(completed.db, "u", COURSE_SCOPE)).lessons.find(
        (entry) => entry.lessonId === lesson.id,
      )!;
      assert.equal(finished.unavailable, false);
      assert.equal(resumeProgress(finished.progress!, edited).status, "finished");
      assert.equal(finished.progress!.firstFinishedAt, 100);
      const writes = f.writes.length;
      const duplicate = await saveCourseProgress(f.db, "u", check);
      assert.equal(duplicate.kind, "saved");
      assert.equal(f.writes.length, writes);
      const advanced = await saveCourseProgress(
        f.db,
        "u",
        command(lesson, 3, { type: "continue", stepId: step.id }),
      );
      assert.ok(advanced.kind === "saved");
      assert.equal(advanced.progress.revision, previous.revision + 1);
      assert.deepEqual(advanced.progress.receipts.slice(0, -1), previous.receipts);
      assert.equal(advanced.progress.definitionHash, lessonDefinitionHash(edited));
    });
  });

test("explanatory wording edits remain resume-compatible and do not write on reload", async () => {
  const f = fakeProgressDb();
  await saveCourseProgress(f.db, "u", command());
  const edited = {
    ...first,
    steps: first.steps.map((step) =>
      step.kind === "explanation"
        ? { ...step, explanation: `${step.explanation}\nTake your time reading this example.` }
        : step,
    ),
  };
  assert.notEqual(lessonDefinitionHash(edited), lessonDefinitionHash(first));
  await withLesson(edited, async () => {
    const read = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0];
    assert.equal(read.unavailable, false);
    assert.equal(resumeProgress(read.progress!, edited).stepIndex, 1);
    assert.equal(f.writes.length, 1);
    assert.equal(
      (
        await saveCourseProgress(
          f.db,
          "u",
          command(first, 1, { type: "continue", stepId: first.steps[1].id }),
        )
      ).kind,
      "saved",
    );
  });
});

const incompatibleEdits: [string, LessonDefinition][] = [
  [
    "step IDs",
    { ...first, steps: first.steps.map((step) => ({ ...step, id: `${step.id}.changed` })) },
  ],
  ["step order", { ...first, steps: [first.steps[1], first.steps[0], ...first.steps.slice(2)] }],
  [
    "choice grading",
    {
      ...first,
      steps: first.steps.map((step) =>
        step.kind === "choice"
          ? {
              ...step,
              correctAnswer: step.options.find((answer) => answer !== step.correctAnswer)!,
            }
          : step,
      ),
    },
  ],
  [
    "text grading",
    {
      ...second,
      steps: second.steps.map((step) =>
        step.kind === "text"
          ? { ...step, acceptedAnswers: ["different"], caseSensitive: !step.caseSensitive }
          : step,
      ),
    },
  ],
  [
    "response kind",
    {
      ...first,
      steps: first.steps.map((step) =>
        step.kind === "text" ? { ...step, kind: "original" as const, maxLength: 80 } : step,
      ),
    },
  ],
  [
    "task meaning",
    {
      ...second,
      steps: second.steps.map((step) =>
        step.kind === "text" ? { ...step, prompt: "Write a different kind of information." } : step,
      ),
    },
  ],
];
for (const [reason, definition] of incompatibleEdits)
  test(`${reason}: an authored compatibility bump rejects old resume and old/new commands without writes`, async () => {
    const baseline = definition.id === first.id ? first : second;
    const { f } = await checkedChoice(baseline);
    // Semantic changes require an explicit editorial bump; a hash cannot decide task meaning.
    const edited = {
      ...definition,
      resumeContractVersion: lessonResumeContractVersion(baseline) + 1,
    };
    const before = structuredClone([...f.records.entries()]);
    const writes = f.writes.length;
    await withLesson(edited, async () => {
      const read = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons.find(
        (entry) => entry.lessonId === baseline.id,
      )!;
      assert.equal(read.unavailable, true);
      assert.equal(read.progress, null);
      assert.equal((await saveCourseProgress(f.db, "u", command(baseline, 3))).kind, "unavailable");
      assert.equal((await saveCourseProgress(f.db, "u", command(edited, 3))).kind, "unavailable");
    });
    assert.equal(f.writes.length, writes);
    assert.deepEqual([...f.records.entries()], before);
  });

test("schema-1 prototype records stay unavailable and untouched; authored contracts must be explicit", async () => {
  const f = fakeProgressDb();
  await finish(f, first);
  const path = courseProgressPath("u", command());
  const current = f.records.get(path) as DurableProgress;
  const { resumeContractVersion: _version, definitionHash, ...retained } = current;
  const legacy = { ...retained, schemaVersion: 1, lessonVersion: definitionHash };
  f.records.set(path, legacy);
  const writes = f.writes.length;
  const read = (await readCourseProgress(f.db, "u", COURSE_SCOPE)).lessons[0];
  assert.equal(read.unavailable, true);
  assert.equal(read.progress, null);
  assert.equal(
    (await saveCourseProgress(f.db, "u", command(first, current.revision))).kind,
    "unavailable",
  );
  assert.equal(f.writes.length, writes);
  assert.deepEqual(f.records.get(path), legacy);
  assert.throws(() => lessonResumeContractVersion({ ...first, resumeContractVersion: undefined }));
  assert.throws(() => lessonResumeContractVersion({ ...first, resumeContractVersion: 0 }));
});
