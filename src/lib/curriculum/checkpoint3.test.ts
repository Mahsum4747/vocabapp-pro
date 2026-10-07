import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { germanA1 } from "@/content/curriculum/german-a1";
import { cp3Forms } from "@/content/curriculum/german-a1-cp3";
import { assessmentRegistry, assessmentForm } from "./assessment-registry";
import { projectTextPortfolio, CP3_DELAY_MS } from "./checkpoint3";
import { fakeProgressDb } from "./testing/fake-progress-db";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
} from "./assessment.server";
import { saveCourseProgress, readCourseProgress } from "./course-progress.server";
import { COURSE_SCOPE, resumeProgress, type ProgressCommand } from "./course-progress";
import { sessionKey } from "./lesson-session";
import { validateCurriculum } from "./validate";
import { checkpoint3Available } from "./checkpoint-access";
import { gradeAssessment, type AssessmentDefinition } from "./assessment";
const owner = "portfolio-owner";
async function fixture() {
  const storage = fakeProgressDb();
  for (const lesson of germanA1.lessons) {
    let revision = 0;
    for (const step of lesson.steps) {
      const actions: ProgressCommand["action"][] = [];
      if (step.kind !== "explanation")
        actions.push({
          type: "check",
          stepId: step.id,
          ...(step.kind === "original"
            ? {}
            : { response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0] }),
        });
      actions.push({ type: "continue", stepId: step.id });
      for (const action of actions) {
        const result = await saveCourseProgress(
          storage.db,
          owner,
          {
            ...COURSE_SCOPE,
            lessonId: lesson.id,
            resumeContractVersion: 1,
            expectedRevision: revision,
            operationId: randomUUID(),
            action,
          },
          100,
        );
        assert.equal(result.kind, "saved");
        revision++;
      }
    }
  }
  const course = await readCourseProgress(storage.db, owner, COURSE_SCOPE);
  const sessions = Object.fromEntries(
    course.lessons.map((row) => [
      sessionKey(germanA1.id, row.lessonId),
      resumeProgress(
        row.progress!,
        germanA1.lessons.find((l) => l.id === row.lessonId)!,
      ),
    ]),
  );
  async function record(form: AssessmentDefinition, start: number, wrongTarget?: string) {
    const request = { assessmentId: form.id, compatibilityVersion: 1, attemptId: randomUUID() };
    const draft = await createAssessmentAttempt(storage.db, owner, request, start);
    assert.equal(draft.formId, form.formId);
    const payload = {
      ...request,
      responses: form.items.map((i) => ({
        itemId: i.id,
        response:
          i.targetId === wrongTarget
            ? (i.options?.find((x) => !i.acceptedAnswers.includes(x)) ?? "wrong")
            : i.acceptedAnswers[0],
      })),
    };
    const { attempt } = await submitAssessmentAttempt(storage.db, owner, payload, start + 1);
    assert.deepEqual(
      (await submitAssessmentAttempt(storage.db, owner, payload, start + 10)).attempt,
      attempt,
    );
    assert.deepEqual(await readAssessmentAttempt(storage.db, owner, request), attempt);
    return attempt;
  }
  return { storage, sessions, record };
}
let shared: ReturnType<typeof fixture>;
const base = () => (shared ??= fixture());
async function completed() {
  const f = await base();
  // Every test gets separate assessment storage; lesson records are immutable input copies.
  const storage = fakeProgressDb(
    Object.fromEntries([...f.storage.records].filter(([p]) => p.includes("/courseProgress/"))),
  );
  const history = [];
  for (const reg of assessmentRegistry) {
    const forms =
      reg.kind === "checkpoint" && reg.checkpointNumber === 3 ? reg.forms : [reg.forms[0]];
    for (const [n, form] of forms.entries()) {
      const start =
        reg.kind === "checkpoint" && reg.checkpointNumber === 3
          ? 1000 + n * (CP3_DELAY_MS + 10)
          : 200;
      const req = { assessmentId: form.id, compatibilityVersion: 1, attemptId: randomUUID() };
      await createAssessmentAttempt(storage.db, owner, req, start);
      history.push(
        (
          await submitAssessmentAttempt(
            storage.db,
            owner,
            {
              ...req,
              responses: form.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
            },
            start + 1,
          )
        ).attempt,
      );
    }
  }
  return { ...f, storage, history };
}
test("CP3 is two independently authored 14-task families covering seven groups with production", () => {
  assert.deepEqual(validateCurriculum(germanA1), []);
  for (const f of cp3Forms) {
    assert.equal(f.items.length, 14);
    assert.equal(f.targets.length, 7);
    for (const t of f.targets) assert.equal(f.items.filter((i) => i.targetId === t.id).length, 2);
    assert(
      f.items.some((i) => i.type === "choice") ||
        f.items.some((i) => i.type === "reading-extraction"),
    );
    assert(f.items.every((i) => i.acceptedAnswers.every((a) => a.length <= 160)));
    assert(
      gradeAssessment(
        f,
        f.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
      ).every((i) => i.correct),
    );
    for (const i of f.items)
      assert(!germanA1.lessons.some((l) => l.steps.at(-1)!.prompt === i.prompt));
  }
  assert(
    cp3Forms[0].items.every(
      (i) => !cp3Forms[1].items.some((j) => i.prompt === j.prompt && i.stimulus === j.stimulus),
    ),
  );
});
test("No evidence stays insufficient; Challenge access and practice never create portfolio credit", () => {
  const r = projectTextPortfolio([], owner, {});
  assert(!r.complete);
  assert.equal(r.missingLessons.length, 40);
  assert.equal(r.missingChecks.length, 10);
  assert.equal(r.missingCheckpoints.length, 3);
  assert(r.outcomes.every((o) => o.state === "Insufficient evidence"));
  assert(checkpoint3Available({}, [], ["DE.A1.U10"]));
});
test("All reviewed path conditions plus accepted independent delayed evidence complete the text path", async () => {
  const f = await completed();
  const before = structuredClone([...f.storage.records]);
  const r = projectTextPortfolio(f.history, owner, f.sessions, [], CP3_DELAY_MS + 2000);
  assert(r.complete);
  assert.equal(r.status, "A1 text-learning path complete");
  assert.equal(r.delayedFollowup, "Recorded");
  assert(r.outcomes.every((o) => o.state === "Demonstrated"));
  assert.deepEqual([...f.storage.records], before);
  assert.equal(
    (
      await readAssessmentHistory(f.storage.db, "other", {
        assessmentId: cp3Forms[0].id,
        compatibilityVersion: 1,
      })
    ).length,
    0,
  );
});
test("Strong reading cannot average away an essential writing failure or another family's contradiction", async () => {
  const f = await completed();
  const req = { assessmentId: cp3Forms[0].id, compatibilityVersion: 1, attemptId: randomUUID() };
  const a = await createAssessmentAttempt(f.storage.db, owner, req, CP3_DELAY_MS + 2000);
  const form = assessmentForm(a.assessmentId, a.formId);
  const failed = (
    await submitAssessmentAttempt(
      f.storage.db,
      owner,
      {
        ...req,
        responses: form.items.map((i) => ({
          itemId: i.id,
          response: i.targetId === "CP3.message" ? "wrong" : i.acceptedAnswers[0],
        })),
      },
      CP3_DELAY_MS + 2001,
    )
  ).attempt;
  const r = projectTextPortfolio(
    [...f.history, failed],
    owner,
    f.sessions,
    [],
    CP3_DELAY_MS + 3000,
  );
  assert(!r.complete);
  assert.equal(r.outcomes.find((o) => o.id === "CP3.message")!.state, "Follow-up needed");
  assert.equal(r.outcomes.find((o) => o.id === "CP3.reading")!.state, "Demonstrated");
  // A B retry cannot erase the latest failed A. An A retry can address that A gap.
  const bReq = { ...req, attemptId: randomUUID() };
  const b = await createAssessmentAttempt(f.storage.db, owner, bReq, CP3_DELAY_MS + 2100);
  assert(b.formId.endsWith("B"));
  const bOk = (
    await submitAssessmentAttempt(
      f.storage.db,
      owner,
      {
        ...bReq,
        responses: cp3Forms[1].items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
      },
      CP3_DELAY_MS + 2101,
    )
  ).attempt;
  assert(
    !projectTextPortfolio([...f.history, failed, bOk], owner, f.sessions, [], CP3_DELAY_MS + 3000)
      .complete,
  );
  const aReq = { ...req, attemptId: randomUUID() };
  await createAssessmentAttempt(f.storage.db, owner, aReq, CP3_DELAY_MS + 2200);
  const aOk = (
    await submitAssessmentAttempt(
      f.storage.db,
      owner,
      {
        ...aReq,
        responses: cp3Forms[0].items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
      },
      CP3_DELAY_MS + 2201,
    )
  ).attempt;
  assert(
    projectTextPortfolio(
      [...f.history, failed, bOk, aOk],
      owner,
      f.sessions,
      [],
      CP3_DELAY_MS + 3000,
    ).complete,
  );
  assert.deepEqual(await readAssessmentAttempt(f.storage.db, owner, req), failed);
});
test("Same-session A/B, missing B and future timestamps cannot fake delayed retrieval", async () => {
  const f = await completed();
  const cp = f.history.filter((a) => a.assessmentId === cp3Forms[0].id);
  const past = f.history.filter((a) => a.assessmentId !== cp3Forms[0].id);
  assert(
    !projectTextPortfolio([...past, cp[0]], owner, f.sessions, [], CP3_DELAY_MS + 2000).complete,
  );
  const b = {
    ...cp[1],
    startedAt: cp[0].finishedAt! + 1,
    finishedAt: cp[0].finishedAt! + 2,
    evidence: cp[1].evidence.map((e) => ({ ...e, timestamp: cp[0].finishedAt! + 2 })),
  };
  const r = projectTextPortfolio([...past, cp[0], b], owner, f.sessions, [], CP3_DELAY_MS + 2000);
  assert(r.outcomes.every((o) => o.state === "Demonstrated"));
  assert(!r.complete);
  assert.equal(r.delayedFollowup, "Pending");
  assert(!projectTextPortfolio(f.history, owner, f.sessions, [], 1000).complete);
});
test("Missing outcome, lesson, Check or checkpoint each independently blocks final completion", async () => {
  const f = await completed();
  for (const id of [
    "DE.A1.U09.CHECK.PROTOTYPE.1",
    "DE.A1.CP1.PROTOTYPE.1",
    "DE.A1.CP2.PROTOTYPE.1",
    "DE.A1.CP3.PROTOTYPE.1",
  ])
    assert(
      !projectTextPortfolio(
        f.history.filter((a) => a.assessmentId !== id),
        owner,
        f.sessions,
        [],
        CP3_DELAY_MS + 2000,
      ).complete,
    );
  const sessions = { ...f.sessions };
  delete sessions[sessionKey(germanA1.id, germanA1.lessons[35].id)];
  assert(!projectTextPortfolio(f.history, owner, sessions, [], CP3_DELAY_MS + 2000).complete);
  assert(
    !projectTextPortfolio(
      f.history,
      owner,
      f.sessions,
      [germanA1.lessons[0].id],
      CP3_DELAY_MS + 2000,
    ).complete,
  );
});
test("Owner, item order, family and event provenance fail closed; historical records stay immutable", async () => {
  const f = await completed();
  const r = projectTextPortfolio(f.history, "other", f.sessions, [], CP3_DELAY_MS + 2000);
  assert(!r.complete);
  assert(r.outcomes.every((o) => o.state === "Insufficient evidence"));
  const cp = f.history.filter((a) => a.assessmentId === cp3Forms[0].id);
  for (const bad of [
    { ...cp[1], formFamilyId: "CP3.FAMILY.A" },
    { ...cp[1], itemOrder: [...cp[1].itemOrder].reverse() },
    { ...cp[1], evidence: cp[1].evidence.map((e) => ({ ...e, learnerId: "other" })) },
  ])
    assert(
      !projectTextPortfolio(
        [...f.history.filter((a) => a.attemptId !== cp[1].attemptId), bad],
        owner,
        f.sessions,
        [],
        CP3_DELAY_MS + 2000,
      ).complete,
    );
  await assert.rejects(
    readAssessmentAttempt(f.storage.db, "other", {
      assessmentId: cp[0].assessmentId,
      compatibilityVersion: 1,
      attemptId: cp[0].attemptId,
    }),
  );
});
test("Earlier mapped Unit Check gaps stay visible even with perfect CP3; supplemental evidence does not replace full CP3 coverage", async () => {
  const f = await completed();
  const existing = f.history.find((a) => a.assessmentId === "DE.A1.U10.CHECK.PROTOTYPE.1")!;
  const req = {
    assessmentId: existing.assessmentId,
    compatibilityVersion: 1,
    attemptId: randomUUID(),
  };
  const draft = await createAssessmentAttempt(f.storage.db, owner, req, 500);
  const form = assessmentForm(draft.assessmentId, draft.formId);
  const bad = (
    await submitAssessmentAttempt(
      f.storage.db,
      owner,
      {
        ...req,
        responses: form.items.map((i) => ({
          itemId: i.id,
          response: i.targetId === "U10.message" ? "wrong" : i.acceptedAnswers[0],
        })),
      },
      501,
    )
  ).attempt;
  const r = projectTextPortfolio([...f.history, bad], owner, f.sessions, [], CP3_DELAY_MS + 2000);
  assert(!r.complete);
  assert.equal(r.outcomes.find((o) => o.id === "CP3.message")!.state, "Follow-up needed");
});

test("Delayed interval uses sitting start, with an exact real 24-hour boundary", async () => {
  const f = await completed();
  const cp = f.history.filter((a) => a.assessmentId === cp3Forms[0].id);
  const others = f.history.filter((a) => a.assessmentId !== cp3Forms[0].id);
  for (const offset of [-1, 0]) {
    const startedAt = cp[0].finishedAt! + CP3_DELAY_MS + offset,
      finishedAt = startedAt + 1;
    const b = {
      ...cp[1],
      startedAt,
      finishedAt,
      evidence: cp[1].evidence.map((e) => ({ ...e, timestamp: finishedAt })),
    };
    const result = projectTextPortfolio(
      [...others, cp[0], b],
      owner,
      f.sessions,
      [],
      CP3_DELAY_MS + 3000,
    );
    assert.equal(result.delayedFollowup, offset === 0 ? "Recorded" : "Pending");
    assert.equal(result.complete, offset === 0);
  }
});
test("Fresh portfolio grading rejects lost practical points, swapped fields and unrelated event frames", () => {
  const cases = [
    [cp3Forms[0], 0, "Name: Bonn; Ort: Ada; Uhrzeit: 17 Uhr"],
    [cp3Forms[0], 8, "Hallo Ben! Ja, ich kann am Samstag ins Büro kommen. Bis bald!"],
    [cp3Forms[0], 11, "Ich komme am Sonntag um dreizehn ins Büro."],
    [
      cp3Forms[1],
      8,
      "Guten Tag! Ich kann am Donnerstag um zwanzig zum Bahnhof kommen. Vielen Dank!",
    ],
    [cp3Forms[1], 10, "Ich kann mit dem Bus kommen. Ich kann lernen."],
    [cp3Forms[1], 13, "Der Tisch ist groß. Ich brauche einen Tisch."],
  ] as const;
  for (const [form, index, response] of cases)
    assert.equal(
      gradeAssessment(
        form,
        form.items.map((i, n) => ({
          itemId: i.id,
          response: n === index ? response : i.acceptedAnswers[0],
        })),
      )[index].correct,
      false,
    );
});
