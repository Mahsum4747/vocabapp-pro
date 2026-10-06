import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit1Check as U1, unit1CheckB as U1B } from "@/content/curriculum/german-a1-unit1-check";
import {
  unit2Check as A,
  unit2CheckB as B,
  unit2CheckForms,
} from "@/content/curriculum/german-a1-unit2-check";
import {
  assessmentForUnit,
  assessmentForm,
  registeredAssessment,
  compatibleHistory,
} from "./assessment-registry";
import {
  gradeAssessment,
  validateAttempt,
  type AssessmentDefinition,
  type AssessmentAttempt,
} from "./assessment";
import { projectOutcomes, observationKind, nextFormLabel } from "./assessment-projection";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
  readLatestAssessment,
  assessmentAttemptPath,
} from "./assessment.server";
import { initialProgress } from "./course-progress";
import { courseProgressPath, lessonDefinitionHash } from "./course-progress.server";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { deleteLearningData } from "../account-deletion.server";
const owner = "phase2b-owner";
const request = (f = A, attemptId = randomUUID()) => ({
  assessmentId: f.id,
  compatibilityVersion: f.compatibilityVersion,
  attemptId,
});
const scope = (f = A) => ({ assessmentId: f.id, compatibilityVersion: f.compatibilityVersion });
const answers = (f: AssessmentDefinition) =>
  f.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] }));
function fixture(indices = [4, 5, 6, 7]) {
  return fakeProgressDb(
    Object.fromEntries(
      indices.map((index) => {
        const lesson = germanA1.lessons[index];
        return [
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
        ];
      }),
    ),
  );
}
async function accept(s: ReturnType<typeof fixture>, f = A, now = 100, wrong: number[] = []) {
  const input = request(f);
  const draft = await createAssessmentAttempt(s.db, owner, input, now);
  const form = assessmentForm(draft.assessmentId, draft.formId);
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
  const result = await submitAssessmentAttempt(s.db, owner, { ...input, responses }, now + 1);
  return { input, form, responses, attempt: result.attempt };
}
test("U02 exact identity, initial versions, two families and registry lesson gates", () => {
  assert.deepEqual(
    [A.id, A.assessmentVersion, A.unitId, A.trackId, A.releaseId],
    [
      "DE.A1.U02.CHECK.PROTOTYPE.1",
      1,
      "DE.A1.U02",
      "de-a1-text-practice-v1",
      "DE.A1.CURRICULUM.PROTOTYPE.1B",
    ],
  );
  assert.deepEqual(
    unit2CheckForms.map((f) => [f.formId, f.formFamilyId, f.compatibilityVersion]),
    [
      ["U02.FORM.A", "U02.FAMILY.A", 1],
      ["U02.FORM.B", "U02.FAMILY.B", 1],
    ],
  );
  assert.deepEqual(assessmentForUnit(A.unitId)?.lessonIds, germanA1.units[1].lessonIds);
  assert.equal(assessmentForUnit("DE.A1.U04"), undefined);
  assert.throws(() => registeredAssessment("unknown"));
  assert.throws(() => assessmentForm(U1.id, A.formId));
});
for (const f of [A, B]) {
  test(`${f.formId}: blueprint range, productive tasks and genuine R04/R05 reading`, () => {
    assert.equal(f.items.length, 8);
    assert.deepEqual(
      f.items.map((i) => i.targetId),
      [
        "U02.routine",
        "U02.routine",
        "U02.belongings",
        "U02.reference",
        "U02.negation",
        "U02.negation",
        "U02.corrected-information",
        "U02.revision",
      ],
    );
    assert.ok(
      f.items.filter((i) => i.type === "construction" || i.type === "bounded-text").length >= 5,
    );
    assert.ok(f.items[3].stimulus?.includes("Ada:") && f.items[3].stimulus.includes("Ben:"));
    assert.ok(f.items[6].stimulus?.includes("nicht") && f.items[6].stimulus.includes("Nein"));
    assert.equal(f.items[6].type, "reading-extraction");
    assert.ok(f.items[7].prompt.includes("und"));
    assert.ok(
      ![f.items[7].prompt, f.items[7].stimulus].join(" ").includes(f.items[7].acceptedAnswers[0]),
    );
  });
  for (const [i, item] of f.items.entries()) {
    test(`${item.id}: deterministic intended response, NFC/spacing and conservative answer meaning`, () => {
      const rows = answers(f);
      assert.ok(gradeAssessment(f, rows).every((r) => r.correct));
      if (!item.options)
        rows[i].response = `  ${item.acceptedAnswers[0].normalize("NFD").replaceAll(" ", "  ")}  `;
      assert.equal(gradeAssessment(f, rows)[i].correct, true);
      assert.equal(gradeAssessment(f, rows)[i].targetId, item.targetId);
      assert.deepEqual(gradeAssessment(f, rows), gradeAssessment(f, rows));
    });
    const bad =
      f === A
        ? [
            "Ada wohnt in Berlin.",
            "Ihr wohnen in Berlin.",
            "Unser Bücher ist klein.",
            "Ada",
            "Die Bücher sind nicht klein.",
            "Mein Telefon ist kein groß.",
            "klein",
            "Mein Büro ist klein und du lest.",
          ][i]
        : [
            "Wir wohnen in Berlin.",
            "Ben wohnst in Berlin.",
            "Seine Bücher sind klein.",
            "Ben",
            "Das Telefon ist nicht klein.",
            "Das Büro ist kein klein.",
            "groß",
            "Ich liest und Ada lernt Deutsch.",
          ][i];
    test(`${item.id}: rejects confusable action/agreement/owner/negation/fact/revision`, () => {
      const rows = answers(f);
      rows[i].response = bad;
      const results = gradeAssessment(f, rows);
      assert.equal(results[i].correct, false);
      assert.equal(results.filter((r) => r.correct).length, 7);
    });
  }
}
test("families structurally alternate rather than renamed stimuli, same narrow groups", () => {
  assert.deepEqual(A.targets, B.targets);
  assert.equal(new Set([A, B, U1, U1B].flatMap((f) => f.items.map((i) => i.id))).size, 32);
  assert.equal(A.items[4].type, "choice");
  assert.equal(B.items[4].type, "construction");
  assert.equal(A.items[3].type, "reading-extraction");
  assert.equal(B.items[3].type, "choice");
  assert.ok(B.items[0].stimulus?.includes("for both"));
  assert.ok(B.items[2].prompt.includes("Repair"));
  assert.ok(B.items[7].prompt.includes("two complete clauses"));
  const teaching = JSON.stringify(germanA1.lessons.slice(4, 8));
  for (const f of [A, B])
    for (const item of f.items) {
      assert.notEqual(item.prompt, (f === A ? B : A).items[f.items.indexOf(item)].prompt);
      assert.ok(!teaching.includes(item.prompt));
      if (item.stimulus) assert.ok(!teaching.includes(JSON.stringify(item.stimulus).slice(1, -1)));
    }
});
test("negation excludes accusative/later focus; only reviewed lexical frames and supplied familiar scope", () => {
  const germanAnswers = [A, B]
    .flatMap((f) => f.items.flatMap((i) => [...i.acceptedAnswers, ...(i.options ?? [])]))
    .join(" ");
  assert.ok(!/keinen|kaufe|brauche|sehe|kann|muss|gestern|heute/.test(germanAnswers));
  const allowed = new Set(
    "büro ada ben lernt deutsch ihr wohnt in berlin unsere bücher sind klein ihre mein telefon ist nicht groß das keine die kein wir lernen hier liest du ich lese und schläft".split(
      " ",
    ),
  );
  for (const token of germanAnswers.toLocaleLowerCase("de").match(/[\p{L}]+/gu) ?? [])
    assert.ok(allowed.has(token), token);
  assert.ok(
    B.items[7].acceptedAnswers[0].includes("lese") &&
      B.items[7].acceptedAnswers[0].includes("schläft"),
  );
  assert.ok(A.items[7].acceptedAnswers[0].includes("liest"));
});
for (const indices of [[], [0, 1, 2, 3], [4, 5, 6], [4, 5, 7], [4, 6, 7], [5, 6, 7]])
  test(`U02 eligibility rejects incomplete own lessons: ${indices.join(",") || "none"}`, async () => {
    const s = fixture(indices);
    const before = structuredClone([...s.records]);
    await assert.rejects(createAssessmentAttempt(s.db, owner, request()), /four Unit 2/);
    assert.deepEqual([...s.records], before);
    assert.equal(s.writes.length, 0);
  });
test("U02 eligibility uses own historical milestones, no U01 course/check/mastery prerequisite", async () => {
  const s = fixture();
  const first = await createAssessmentAttempt(s.db, owner, request());
  assert.equal(first.formId, A.formId);
  await assert.rejects(createAssessmentAttempt(s.db, owner, request(U1)), /four Unit 1/);
  assert.equal([...s.records].filter(([p]) => p.includes("/assessmentAttempts/")).length, 1);
});
test("A → B → A per unit; first/additional/repeat exposure and exact immutable reviews", async () => {
  const s = fixture();
  const a = await accept(s, A, 100);
  const b = await accept(s, A, 200);
  const r = await accept(s, A, 300);
  const history = await readAssessmentHistory(s.db, owner, scope());
  assert.deepEqual(
    [a, b, r].map((x) => x.form.formId),
    [A.formId, B.formId, A.formId],
  );
  assert.deepEqual(
    [a, b, r].map((x) => observationKind(x.attempt, history)),
    ["First observation", "Additional independent observation", "Repeated observation"],
  );
  assert.deepEqual(nextFormLabel(history, A), { formId: B.formId, repeated: true });
  for (const x of [a, b, r])
    assert.deepEqual(await readAssessmentAttempt(s.db, owner, x.input), x.attempt);
  assert.equal((await readLatestAssessment(s.db, owner, scope()))?.attemptId, r.attempt.attemptId);
});
test("one success remains one observation, A+B confirms, repeats remain two independent families", async () => {
  const s = fixture();
  const a = await accept(s);
  assert.ok(
    projectOutcomes(A, [a.attempt]).every((p) => p.state === "demonstrated in one observation"),
  );
  await accept(s, A, 200);
  await accept(s, A, 300);
  assert.ok(
    projectOutcomes(A, await readAssessmentHistory(s.db, owner, scope())).every(
      (p) => p.state === "confirmed in an alternate form" && p.repeatedForms === 1,
    ),
  );
});
for (const wrong of [0, 1, 4, 5])
  test(`two-item targets require BOTH observations within each form; failure index ${wrong}`, async () => {
    const s = fixture();
    await accept(s);
    await accept(s, A, 200, [wrong]);
    const p = projectOutcomes(A, await readAssessmentHistory(s.db, owner, scope()));
    assert.equal(
      p.find((p) => p.targetId === B.items[wrong].targetId)?.state,
      "needs more evidence",
    );
    assert.equal(p.filter((p) => p.state === "confirmed in an alternate form").length, 5);
  });
test("latest family failure wins over older success; older review stays exact without averaging", async () => {
  const s = fixture();
  const a = await accept(s);
  await accept(s, A, 200);
  await accept(s, A, 300, [2]);
  assert.equal(
    projectOutcomes(A, await readAssessmentHistory(s.db, owner, scope())).find(
      (p) => p.targetId === "U02.belongings",
    )?.state,
    "needs more evidence",
  );
  assert.deepEqual(await readAssessmentAttempt(s.db, owner, a.input), a.attempt);
});
test("cross-unit history, latest, selection, projection and observation labels are isolated both ways", async () => {
  const s = fixture([0, 1, 2, 3, 4, 5, 6, 7]);
  const u1 = await accept(s, U1, 100);
  const u2 = await accept(s, A, 200);
  const u1b = await accept(s, U1, 300);
  const h1 = await readAssessmentHistory(s.db, owner, scope(U1));
  const h2 = await readAssessmentHistory(s.db, owner, scope(A));
  assert.deepEqual(
    h1.map((a) => a.assessmentId),
    [U1.id, U1.id],
  );
  assert.deepEqual(h2, [u2.attempt]);
  assert.equal(
    (await readLatestAssessment(s.db, owner, scope(A)))?.attemptId,
    u2.attempt.attemptId,
  );
  assert.equal(
    (await readLatestAssessment(s.db, owner, scope(U1)))?.attemptId,
    u1b.attempt.attemptId,
  );
  const mixed = [u1.attempt, u2.attempt, u1b.attempt];
  assert.equal(nextFormLabel(mixed, A).formId, B.formId);
  assert.equal(nextFormLabel(mixed, U1).formId, U1.formId);
  assert.ok(projectOutcomes(A, mixed).every((p) => p.state === "demonstrated in one observation"));
  assert.ok(projectOutcomes(U1, mixed).every((p) => p.state === "confirmed in an alternate form"));
  assert.equal(observationKind(u2.attempt, mixed), "First observation");
  assert.equal(observationKind(u1b.attempt, mixed), "Additional independent observation");
});
for (const [field, value] of Object.entries({
  assessmentId: U1.id,
  assessmentVersion: 2,
  trackId: "other",
  releaseId: "other",
  unitId: U1.unitId,
  formId: U1.formId,
  formFamilyId: U1.formFamilyId,
  compatibilityVersion: 2,
  status: "in-progress",
  learnerId: "other",
}))
  test(`history scope excludes ${field} mismatch`, async () => {
    const s = fixture();
    const a = await accept(s);
    const bad = { ...a.attempt, [field]: value } as AssessmentAttempt;
    assert.deepEqual(compatibleHistory(A, [bad], owner), []);
    {
      assert.ok(projectOutcomes(A, [bad], owner).every((p) => p.state === "no evidence"));
      assert.deepEqual(nextFormLabel([bad], A, owner), { formId: A.formId, repeated: false });
    }
    assert.equal(
      observationKind(a.attempt, [{ ...bad, attemptId: randomUUID(), finishedAt: 0 }]),
      "First observation",
    );
  });
test("foreign malformed documents cannot poison own history or advance selection", async () => {
  const s = fixture();
  s.records.set(`users/${owner}/assessmentAttempts/${randomUUID()}`, {
    assessmentId: U1.id,
    malformed: true,
  });
  assert.deepEqual(await readAssessmentHistory(s.db, owner, scope()), []);
  assert.equal((await createAssessmentAttempt(s.db, owner, request())).formId, A.formId);
});
test("concurrent U02 distinct starts stay A; submitted same-family results never confirm", async () => {
  const s = fixture();
  const inputs = [request(), request()];
  const drafts = await Promise.all(inputs.map((r) => createAssessmentAttempt(s.db, owner, r, 100)));
  assert.ok(drafts.every((a) => a.formId === A.formId));
  await Promise.all(
    inputs.map((r, i) =>
      submitAssessmentAttempt(s.db, owner, { ...r, responses: answers(A) }, 200 + i),
    ),
  );
  assert.ok(
    projectOutcomes(A, await readAssessmentHistory(s.db, owner, scope())).every(
      (p) => p.state === "demonstrated in one observation" && p.repeatedForms === 1,
    ),
  );
});
test("simultaneous U01/U02 starts select independently; shared UUID collision rejects reinterpretation", async () => {
  const s = fixture([0, 1, 2, 3, 4, 5, 6, 7]);
  const inputs = [request(U1), request(A)];
  const results = await Promise.all(
    inputs.map((r) => createAssessmentAttempt(s.db, owner, r, 100)),
  );
  assert.deepEqual(
    results.map((a) => a.formId),
    [U1.formId, A.formId],
  );
  await assert.rejects(
    createAssessmentAttempt(s.db, owner, request(A, inputs[0].attemptId)),
    /another assessment/,
  );
  assert.equal(s.writes.length, 2);
});
test("duplicate start/lost acknowledgement and B refresh preserve assigned form", async () => {
  const s = fixture();
  await accept(s);
  const input = request();
  const [one, two] = await Promise.all([
    createAssessmentAttempt(s.db, owner, input, 200),
    createAssessmentAttempt(s.db, owner, input, 201),
  ]);
  assert.deepEqual(one, two);
  assert.equal(one.formId, B.formId);
  const count = s.writes.length;
  assert.deepEqual(await createAssessmentAttempt(s.db, owner, input, 300), one);
  assert.deepEqual(await readAssessmentAttempt(s.db, owner, { attemptId: input.attemptId }), one);
  assert.equal(s.writes.length, count);
});
test("duplicate/competing submit: one immutable result, eight events, retry read-only", async () => {
  const s = fixture();
  const input = request();
  await createAssessmentAttempt(s.db, owner, input);
  const payload = { ...input, responses: answers(A) };
  const changed = {
    ...payload,
    responses: answers(A).map((r, i) => (i === 0 ? { ...r, response: "wrong" } : r)),
  };
  const [one, two] = await Promise.all([
    submitAssessmentAttempt(s.db, owner, payload),
    submitAssessmentAttempt(s.db, owner, changed),
  ]);
  assert.equal(one.kind, "accepted");
  assert.equal(two.kind, "conflict");
  assert.deepEqual(one.attempt, two.attempt);
  const count = s.writes.length;
  assert.deepEqual(
    await submitAssessmentAttempt(s.db, owner, {
      ...payload,
      responses: [...payload.responses].reverse(),
    }),
    one,
  );
  assert.equal(s.writes.length, count);
  assert.equal(new Set(one.attempt.evidence.map((e) => e.id)).size, 8);
});
test("UUID-only owned reads resolve both units; scoped cross-unit reads/submits reject read-only", async () => {
  const s = fixture([0, 1, 2, 3, 4, 5, 6, 7]);
  for (const f of [U1, A]) {
    const a = await accept(s, f);
    assert.deepEqual(
      await readAssessmentAttempt(s.db, owner, { attemptId: a.input.attemptId }),
      a.attempt,
    );
    const foreign = f === A ? U1 : A;
    await assert.rejects(
      readAssessmentAttempt(s.db, owner, request(foreign, a.input.attemptId)),
      /another assessment/,
    );
    await assert.rejects(
      submitAssessmentAttempt(s.db, owner, {
        ...request(foreign, a.input.attemptId),
        responses: a.responses,
      }),
      /another assessment/,
    );
    await assert.rejects(
      readAssessmentAttempt(s.db, "other", { attemptId: a.input.attemptId }),
      /Unknown/,
    );
  }
  assert.equal(s.writes.length, 4);
});
for (const bad of [
  { compatibilityVersion: 2 },
  { assessmentVersion: 2 },
  { formFamilyId: U1.formFamilyId },
  { unitId: U1.unitId },
  { learnerId: "other" },
  { itemOrder: ["fake"] },
])
  test(`forged/incompatible saved U02 rejected: ${Object.keys(bad)[0]}`, async () => {
    const s = fixture();
    const a = await accept(s);
    const invalid = { ...a.attempt, ...bad };
    assert.throws(() => validateAttempt(invalid, A, owner));
    s.records.set(assessmentAttemptPath(owner, a.input.attemptId), invalid);
    const count = s.writes.length;
    await assert.rejects(readAssessmentAttempt(s.db, owner, a.input));
    await assert.rejects(readAssessmentHistory(s.db, owner, scope()));
    assert.equal(s.writes.length, count);
  });
test("stale URL, client-selected form/owner, incomplete/foreign item contracts rejected", async () => {
  const s = fixture();
  await assert.rejects(readAssessmentAttempt(s.db, owner, request()), /Unknown/);
  for (const extra of [{ formId: B.formId }, { learnerId: "other" }, { assessmentVersion: 1 }])
    await assert.rejects(createAssessmentAttempt(s.db, owner, { ...request(), ...extra }));
  assert.throws(() => gradeAssessment(A, answers(B)));
  assert.throws(() => gradeAssessment(A, answers(A).slice(1)));
  assert.throws(() => gradeAssessment(A, [...answers(A).slice(0, 7), answers(A)[0]]));
  assert.equal(s.writes.length, 0);
});
test("two units' four families recursively deleted; another owner's records preserved", async () => {
  const s = fixture([0, 1, 2, 3, 4, 5, 6, 7]);
  for (const f of [U1, A]) {
    await accept(s, f, 100);
    await accept(s, f, 200);
  }
  assert.equal(
    [...s.records.values()].filter((r) => (r as AssessmentAttempt).assessmentId).length,
    4,
  );
  s.records.set("users/another/assessmentAttempts/sentinel", { private: true });
  await deleteLearningData(s.db, owner);
  assert.deepEqual(
    [...s.records],
    [["users/another/assessmentAttempts/sentinel", { private: true }]],
  );
});
test("lesson completion has no evidence; assessment never writes course/FSRS/grammar/Lesen/Paste or raw answers", async () => {
  const s = fixture();
  for (const p of [
    `users/${owner}/cardProgress/x`,
    `grammarProgress/${owner}`,
    `lesenProgress/${owner}`,
    `users/${owner}/grammarPasteTopics/x`,
    `users/${owner}/lesenPasteTopics/x`,
  ])
    s.records.set(p, { sentinel: p });
  const before = structuredClone([...s.records]);
  assert.deepEqual(await readAssessmentHistory(s.db, owner, scope()), []);
  assert.ok(projectOutcomes(A, []).every((p) => p.state === "no evidence"));
  assert.equal(s.writes.length, 0);
  await accept(s);
  await accept(s, A, 200);
  for (const [p, v] of before) assert.deepEqual(s.records.get(p), v);
  assert.equal(s.writes.length, 4);
  assert.ok(s.writes.every((p) => p.startsWith(`users/${owner}/assessmentAttempts/`)));
  for (const [p, v] of s.records)
    if (p.includes("/assessmentAttempts/")) {
      const serialized = JSON.stringify(v);
      assert.ok(!/prompt|stimulus|keystroke|feedback|mastery|percentage/.test(serialized));
      for (const f of [A, B])
        for (const item of f.items) assert.ok(!serialized.includes(item.acceptedAnswers[0]));
    }
});
test("U01 authored A/B bytes remain approved and legacy vocabulary Learn route unchanged", () => {
  assert.equal(
    createHash("sha256")
      .update(readFileSync("src/content/curriculum/german-a1-unit1-check.ts"))
      .digest("hex"),
    "8e5699d988a1367dd82808d011f5a83bc2b4f935c2ead4d5bcb795ebfcdbc5cf",
  );
  assert.equal(U1.assessmentVersion, 1);
  assert.equal(U1B.assessmentVersion, 1);
  assert.ok(!readFileSync("src/routes/sets.$setId.learn.tsx", "utf8").includes("assessment"));
});

test("owner collection scan reads all documents including drafts, returns only scoped accepted attempts", async () => {
  const s = fixture([0, 1, 2, 3, 4, 5, 6, 7]);
  await accept(s, U1);
  await accept(s, U1, 200);
  await accept(s, A, 300);
  await createAssessmentAttempt(s.db, owner, request(U1), 400);
  await createAssessmentAttempt(s.db, owner, request(A), 400);
  const collection = s.db.collection.bind(s.db);
  let scanned = 0;
  s.db.collection = ((path: string) => {
    const ref = collection(path);
    return {
      ...ref,
      get: async () => {
        const rows = await ref.get();
        scanned = rows.docs.length;
        return rows;
      },
    };
  }) as typeof s.db.collection;
  const history = await readAssessmentHistory(s.db, owner, scope());
  assert.equal(scanned, 5);
  assert.equal(history.length, 1);
  assert.equal(history[0].assessmentId, A.id);
  assert.equal(s.writes.length, 8);
});
test("private wrong text is classified only; free writing/AI payloads are rejected, not stored", async () => {
  const s = fixture();
  const input = request();
  await createAssessmentAttempt(s.db, owner, input);
  const rows = answers(A);
  rows[0].response = "PRIVATE_HOME_FACT_829";
  const result = await submitAssessmentAttempt(s.db, owner, { ...input, responses: rows });
  assert.equal(result.attempt.responses[0].correct, false);
  assert.ok(!JSON.stringify([...s.records]).includes("PRIVATE_HOME_FACT_829"));
  await assert.rejects(
    submitAssessmentAttempt(s.db, owner, { ...input, responses: rows, openWriting: "private" }),
  );
  await assert.rejects(
    submitAssessmentAttempt(s.db, owner, { ...input, responses: rows, aiFeedback: "pass" }),
  );
  assert.equal(s.writes.length, 2);
});
test("U02 selection racing acceptance serializes and never mutates the assigned family", async () => {
  const s = fixture();
  const first = request();
  const next = request();
  await createAssessmentAttempt(s.db, owner, first, 100);
  const original = s.db.runTransaction.bind(s.db);
  let entered = 0;
  let release!: () => void;
  const barrier = new Promise<void>((r) => {
    release = r;
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
    submitAssessmentAttempt(s.db, owner, { ...first, responses: answers(A) }, 200),
    createAssessmentAttempt(s.db, owner, next, 201),
  ]);
  assert.ok([A.formId, B.formId].includes(draft.formId));
  assert.deepEqual(await createAssessmentAttempt(s.db, owner, next, 300), draft);
  assert.ok(s.retries() > 0);
  assert.equal(s.writes.length, 3);
});
