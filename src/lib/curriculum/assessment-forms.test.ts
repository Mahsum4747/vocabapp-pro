import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { test } from "node:test";
import {
  unit1Check as A,
  unit1CheckB as B,
  unit1CheckForms,
  unit1CheckForm,
} from "@/content/curriculum/german-a1-unit1-check";
import { germanA1 } from "@/content/curriculum/german-a1";
import { gradeAssessment, validateAttempt, type AssessmentDefinition } from "./assessment";
import { projectOutcomes, observationKind, nextFormLabel } from "./assessment-projection";
import {
  ASSESSMENT_REQUEST,
  assessmentAttemptPath,
  createAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
  submitAssessmentAttempt,
} from "./assessment.server";
import { courseProgressPath, lessonDefinitionHash } from "./course-progress.server";
import { initialProgress } from "./course-progress";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { deleteLearningData } from "../account-deletion.server";
const owner = "form-test-owner";
const answers = (form: AssessmentDefinition) =>
  form.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] }));
function fixture() {
  return fakeProgressDb(
    Object.fromEntries(
      germanA1.lessons.slice(0, 4).map((lesson) => [
        courseProgressPath(owner, {
          trackId: A.trackId,
          releaseId: A.releaseId,
          lessonId: lesson.id,
        }),
        {
          ...initialProgress(lesson, lessonDefinitionHash(lesson)),
          firstFinishedAt: 10,
          updatedAt: 10,
          currentStepId: null,
          completedStepIds: lesson.steps.map((s) => s.id),
        },
      ]),
    ),
  );
}
const request = (id = randomUUID()) => ({ ...ASSESSMENT_REQUEST, attemptId: id });
async function accept(storage: ReturnType<typeof fixture>, now: number, wrong: number[] = []) {
  const input = request();
  const draft = await createAssessmentAttempt(storage.db, owner, input, now);
  const form = unit1CheckForm(draft.formId);
  const responses = answers(form).map((r, i) =>
    wrong.includes(i)
      ? {
          ...r,
          response:
            form.items[i].options?.find((o) => !form.items[i].acceptedAnswers.includes(o)) ??
            "wrong",
        }
      : r,
  );
  const result = await submitAssessmentAttempt(storage.db, owner, { ...input, responses }, now + 1);
  return { input, draft, form, responses, attempt: result.attempt };
}
test("A and B are explicit distinct families: eight globally unique IDs and exactly the same six groups", () => {
  assert.equal(unit1CheckForms.length, 2);
  assert.deepEqual(
    unit1CheckForms.map((f) => [
      f.formId,
      f.formFamilyId,
      f.assessmentVersion,
      f.compatibilityVersion,
    ]),
    [
      ["U01.FORM.A", "U01.FAMILY.A", 1, 1],
      ["U01.FORM.B", "U01.FAMILY.B", 1, 1],
    ],
  );
  assert.equal(new Set(unit1CheckForms.flatMap((f) => f.items.map((i) => i.id))).size, 16);
  assert.equal(A.items.length, 8);
  assert.equal(B.items.length, 8);
  assert.deepEqual(
    B.items.map((i) => i.id),
    Array.from({ length: 8 }, (_, i) => `U01.B.C0${i + 1}`),
  );
  assert.deepEqual(
    B.items.map((i) => i.type),
    [
      "choice",
      "bounded-text",
      "construction",
      "reading-extraction",
      "choice",
      "bounded-text",
      "construction",
      "supported-field",
    ],
  );
  assert.deepEqual(
    B.items.map((i) => i.targetId),
    A.items.map((i) => i.targetId),
  );
  assert.deepEqual(B.targets, A.targets);
  assert.throws(() => unit1CheckForm("unknown"));
});
test("B repertoire is limited to taught Unit 1 forms; English role/field labels do not introduce German grammar", () => {
  const allowed = new Set(
    "visitor kai wer bist du ich bin er ist die telefon der büro das ada nummer 12 habe zwei telefone 2 datum 03 02 name eva hat groß".split(
      " ",
    ),
  );
  for (const item of B.items)
    for (const token of [item.stimulus ?? "", ...(item.options ?? []), ...item.acceptedAnswers]
      .join(" ")
      .toLocaleLowerCase("de")
      .match(/[\p{L}]+|\d+/gu) ?? [])
      assert.ok(allowed.has(token), token);
  assert.ok(gradeAssessment(B, answers(B)).every((r) => r.correct));
});
test("B alternation is structural rather than renamed A: role choice, article repair, word assembly, quantity, date layout, third-person facts and dialogue field", () => {
  for (let i = 0; i < 8; i++) {
    assert.notEqual(B.items[i].prompt, A.items[i].prompt);
    if (A.items[i].stimulus) assert.notEqual(B.items[i].stimulus, A.items[i].stimulus);
  }
  assert.equal(A.items[1].type, "choice");
  assert.equal(B.items[1].type, "bounded-text");
  assert.ok(B.items[2].stimulus?.includes("·"));
  assert.equal(A.items[2].stimulus, undefined);
  assert.ok(B.items[3].stimulus?.includes("habe zwei"));
  assert.equal(B.items[4].type, "choice");
  assert.equal(A.items[4].type, "reading-extraction");
  assert.ok(B.items[5].acceptedAnswers[0].includes("hat"));
  assert.ok(B.items[6].stimulus?.includes("·"));
  assert.ok(B.items[7].stimulus?.includes("Wer bist du?"));
  const lessonCopy = JSON.stringify(germanA1.lessons.slice(0, 4));
  for (const i of B.items) {
    assert.ok(!lessonCopy.includes(i.prompt));
    if (i.stimulus) assert.ok(!lessonCopy.includes(JSON.stringify(i.stimulus).slice(1, -1)));
  }
});
test("server selects A then B then A repeat; events preserve exact version/form/family provenance", async () => {
  const s = fixture();
  const a = await accept(s, 100);
  const b = await accept(s, 200);
  const repeat = await accept(s, 300);
  assert.deepEqual(
    [a, b, repeat].map((r) => r.attempt.formId),
    [A.formId, B.formId, A.formId],
  );
  for (const r of [a, b, repeat]) {
    assert.equal(r.attempt.schemaVersion, 2);
    assert.equal(r.attempt.assessmentVersion, 1);
    assert.ok(
      r.attempt.evidence.every(
        (e) =>
          e.assessmentId === A.id &&
          e.assessmentVersion === 1 &&
          e.compatibilityVersion === 1 &&
          e.formId === r.form.formId &&
          e.formFamilyId === r.form.formFamilyId &&
          e.assessmentAttemptId === r.attempt.attemptId &&
          e.timestamp === r.attempt.finishedAt,
      ),
    );
  }
  const history = await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST);
  assert.deepEqual(
    history.map((r) => r.attemptId),
    [repeat, b, a].map((r) => r.attempt.attemptId),
  );
  assert.equal(observationKind(a.attempt, history), "First observation");
  assert.equal(observationKind(b.attempt, history), "Additional independent observation");
  assert.equal(observationKind(repeat.attempt, history), "Repeated observation");
  assert.deepEqual(nextFormLabel(history), { formId: B.formId, repeated: true });
});
test("same UUID concurrent start has one immutable form and one write; refresh preserves B even after newer acceptance", async () => {
  const s = fixture();
  await accept(s, 100);
  const input = request();
  const [first, second] = await Promise.all([
    createAssessmentAttempt(s.db, owner, input, 200),
    createAssessmentAttempt(s.db, owner, input, 201),
  ]);
  assert.deepEqual(first, second);
  assert.equal(first.formId, B.formId);
  const before = s.writes.length;
  await accept(s, 300);
  assert.deepEqual(await createAssessmentAttempt(s.db, owner, input, 400), first);
  assert.deepEqual(await readAssessmentAttempt(s.db, owner, input), first);
  assert.equal(s.writes.length, before + 2);
});
test("concurrent distinct draft starts before A acceptance stay A; neither becomes alternate evidence", async () => {
  const s = fixture();
  const one = request();
  const two = request();
  const drafts = await Promise.all([
    createAssessmentAttempt(s.db, owner, one, 100),
    createAssessmentAttempt(s.db, owner, two, 100),
  ]);
  assert.ok(drafts.every((a) => a.formId === A.formId));
  const results = await Promise.all([
    submitAssessmentAttempt(s.db, owner, { ...one, responses: answers(A) }, 200),
    submitAssessmentAttempt(s.db, owner, { ...two, responses: answers(A) }, 201),
  ]);
  const history = await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST);
  assert.ok(
    projectOutcomes(A, history).every(
      (p) => p.state === "demonstrated in one observation" && p.repeatedForms === 1,
    ),
  );
  assert.deepEqual(
    results.map((r) => observationKind(r.attempt, history)),
    ["First observation", "Repeated observation"],
  );
});
test("selection racing A submission serializes safely and never changes an already assigned form", async () => {
  const s = fixture();
  const a = request();
  const next = request();
  await createAssessmentAttempt(s.db, owner, a, 100);
  // Hold both transaction snapshots before either operation can commit.
  const original = s.db.runTransaction.bind(s.db);
  let entered = 0;
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  s.db.runTransaction = (action, options) =>
    original(async (tx) => {
      if (entered < 2) {
        if (++entered === 2) release();
        await barrier;
      }
      return action(tx);
    }, options);
  const [, draft] = await Promise.all([
    submitAssessmentAttempt(s.db, owner, { ...a, responses: answers(A) }, 200),
    createAssessmentAttempt(s.db, owner, next, 201),
  ]);
  assert.ok([A.formId, B.formId].includes(draft.formId));
  assert.deepEqual(await readAssessmentAttempt(s.db, owner, next), draft);
  assert.deepEqual(await createAssessmentAttempt(s.db, owner, next, 300), draft);
  assert.equal(s.writes.length, 3);
  assert.ok(s.retries() > 0);
});
test("B duplicate submit/lost acknowledgement is idempotent; competing answers return the same eight winning events", async () => {
  const s = fixture();
  await accept(s, 100);
  const b = request();
  await createAssessmentAttempt(s.db, owner, b, 200);
  const payload = { ...b, responses: answers(B) };
  const changed = {
    ...payload,
    responses: answers(B).map((r, i) => (i === 3 ? { ...r, response: "12" } : r)),
  };
  const [first, other] = await Promise.all([
    submitAssessmentAttempt(s.db, owner, payload, 300),
    submitAssessmentAttempt(s.db, owner, changed, 301),
  ]);
  assert.equal(first.kind, "accepted");
  assert.equal(other.kind, "conflict");
  assert.deepEqual(first.attempt, other.attempt);
  const count = s.writes.length;
  assert.deepEqual(
    await submitAssessmentAttempt(
      s.db,
      owner,
      { ...payload, responses: [...payload.responses].reverse() },
      400,
    ),
    first,
  );
  assert.equal(s.writes.length, count);
  assert.equal(new Set(first.attempt.evidence.map((e) => e.id)).size, 8);
});
test("one-form success is one observation; A+B success confirms alternate form; repeats do not create additional independent families", async () => {
  const s = fixture();
  const a = await accept(s, 100);
  assert.ok(
    projectOutcomes(A, [a.attempt]).every((p) => p.state === "demonstrated in one observation"),
  );
  await accept(s, 200);
  let history = await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST);
  assert.ok(
    projectOutcomes(A, history).every(
      (p) => p.state === "confirmed in an alternate form" && p.repeatedForms === 0,
    ),
  );
  const repeat = await accept(s, 300);
  history = await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST);
  assert.ok(
    projectOutcomes(A, history).every(
      (p) => p.state === "confirmed in an alternate form" && p.repeatedForms === 1,
    ),
  );
  assert.equal(observationKind(repeat.attempt, history), "Repeated observation");
});
test("contradictory A/B evidence is never averaged; either item failure invalidates that form's two-item target", async () => {
  for (const wrong of [3, 4, 5, 6]) {
    const s = fixture();
    await accept(s, 100);
    await accept(s, 200, [wrong]);
    const projection = projectOutcomes(
      A,
      await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST),
    );
    assert.equal(
      projection.find((p) => p.targetId === B.items[wrong].targetId)!.state,
      "needs more evidence",
    );
    assert.equal(projection.filter((p) => p.state === "confirmed in an alternate form").length, 5);
  }
});
test("latest PER family overrides its earlier result but retains other family's contradiction and exact prior review", async () => {
  const s = fixture();
  const a = await accept(s, 100);
  const b = await accept(s, 200, [3]);
  const repeat = await accept(s, 300, [5]);
  const history = await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST);
  const projection = projectOutcomes(A, history);
  assert.equal(projection.find((p) => p.targetId === "U01.details")!.state, "needs more evidence");
  assert.equal(
    projection.find((p) => p.targetId === "U01.statements")!.state,
    "needs more evidence",
  );
  for (const r of [a, b, repeat])
    assert.deepEqual(await readAssessmentAttempt(s.db, owner, r.input), r.attempt);
  await accept(s, 400); // latest B succeeds, but A's latest failure still prevents statements confirmation
  const updated = projectOutcomes(A, await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST));
  assert.equal(
    updated.find((p) => p.targetId === "U01.details")!.state,
    "confirmed in an alternate form",
  );
  assert.equal(updated.find((p) => p.targetId === "U01.statements")!.state, "needs more evidence");
});
test("stale URL, incompatible B version, forged form/family/event/order and A answers on B are rejected read-only", async () => {
  const s = fixture();
  await accept(s, 100);
  const b = await accept(s, 200);
  const count = s.writes.length;
  await assert.rejects(readAssessmentAttempt(s.db, owner, request()), /Unknown/);
  await assert.rejects(createAssessmentAttempt(s.db, owner, { ...request(), formId: A.formId }));
  await assert.rejects(submitAssessmentAttempt(s.db, owner, { ...b.input, responses: answers(A) }));
  for (const bad of [
    { ...b.attempt, formId: A.formId },
    { ...b.attempt, formFamilyId: A.formFamilyId },
    { ...b.attempt, compatibilityVersion: 2 },
    { ...b.attempt, assessmentVersion: 2 },
    { ...b.attempt, itemOrder: [...b.attempt.itemOrder].reverse() },
    { ...b.attempt, evidence: b.attempt.evidence.map((e) => ({ ...e, formId: A.formId })) },
  ])
    assert.throws(() => validateAttempt(bad, B, owner));
  assert.deepEqual(
    validateAttempt(
      b.attempt,
      { ...B, items: B.items.map((i) => ({ ...i, prompt: i.prompt + " Copy edit." })) },
      owner,
    ),
    b.attempt,
  );
  assert.throws(() => validateAttempt(b.attempt, { ...B, compatibilityVersion: 2 }, owner));
  assert.equal(s.writes.length, count);
});
test("known schema-1 A is interpreted without migration; its identical retry digest and next B selection survive", async () => {
  const s = fixture();
  const a = await accept(s, 100);
  const { assessmentVersion: _version, formId: _form, formFamilyId: _family, ...rest } = a.attempt;
  const old = {
    ...rest,
    schemaVersion: 1,
    submissionDigest: createHash("sha256")
      .update(JSON.stringify({ assessmentId: A.id, version: 1, responses: answers(A) }))
      .digest("hex"),
    evidence: a.attempt.evidence.map(
      ({ formId: _f, formFamilyId: _ff, compatibilityVersion: _c, ...event }) => event,
    ),
  };
  const path = assessmentAttemptPath(owner, a.input.attemptId);
  s.records.set(path, old);
  const before = s.writes.length;
  const read = await readAssessmentAttempt(s.db, owner, a.input);
  assert.equal(read.formId, A.formId);
  assert.equal(read.schemaVersion, 1);
  assert.deepEqual(s.records.get(path), old);
  assert.equal(s.writes.length, before);
  const retry = await submitAssessmentAttempt(
    s.db,
    owner,
    { ...a.input, responses: answers(A) },
    500,
  );
  assert.equal(retry.kind, "accepted");
  assert.equal(s.writes.length, before);
  assert.equal((await createAssessmentAttempt(s.db, owner, request(), 600)).formId, B.formId);
});
test("A/B/draft deletion includes embedded evidence without user parent; another owner is retained", async () => {
  const s = fixture();
  const a = await accept(s, 100);
  const b = await accept(s, 200);
  await createAssessmentAttempt(s.db, owner, request(), 300);
  s.records.set(`users/another/assessmentAttempts/${a.attempt.attemptId}`, a.attempt);
  s.records.set(`users/another/assessmentAttempts/${b.attempt.attemptId}`, b.attempt);
  const other = [...s.records].filter(([p]) => p.startsWith("users/another/"));
  await deleteLearningData(s.db, owner);
  assert.deepEqual([...s.records], other);
});
test("both forms leave course/FSRS/grammar/Lesen/Paste unchanged; no persisted score/mastery/projection", async () => {
  const s = fixture();
  for (const p of [
    `users/${owner}/cardProgress/card`,
    `grammarProgress/${owner}`,
    `lesenProgress/${owner}`,
    `users/${owner}/grammarPasteTopics/x`,
    `users/${owner}/lesenPasteTopics/x`,
  ])
    s.records.set(p, { sentinel: p });
  const before = structuredClone([...s.records]);
  assert.deepEqual(await readAssessmentHistory(s.db, owner, ASSESSMENT_REQUEST), []);
  assert.ok(projectOutcomes(A, []).every((p) => p.state === "no evidence"));
  assert.equal(s.writes.length, 0);
  await accept(s, 100);
  await accept(s, 200);
  await accept(s, 300);
  for (const [p, v] of before) assert.deepEqual(s.records.get(p), v);
  assert.equal(s.writes.length, 6);
  assert.ok(s.writes.every((p) => p.includes("/assessmentAttempts/")));
  for (const [p, v] of s.records)
    if (p.includes("/assessmentAttempts/")) {
      const serialized = JSON.stringify(v);
      assert.ok(
        !/mastery|percentage|confidence|prompt|stimulus|keystroke|feedback/.test(serialized),
      );
      assert.ok(!serialized.includes("Eva hat zwei Telefone"));
      assert.ok(!serialized.includes("Ich habe zwei Telefone"));
    }
});
