import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { challengeForms } from "@/content/curriculum/german-a1-challenges.server";
import { germanA1 } from "@/content/curriculum/german-a1";
import { COURSE_SCOPE } from "./course-progress-session";
import { CHALLENGE_RETRY_MS, challengeSubmitSchema, challengeScoreClears } from "./challenge";
import {
  challengePath,
  readUnitChallenge,
  readChallengeClearances,
  startChallenge,
  submitChallenge,
  scoreChallenge,
} from "./challenge.server";
import { readCourseProgress } from "./course-progress.server";
import { unitProgress, courseLearningAction } from "./unit-progress";
import { homeCourseAction } from "./home-course";
import { startLesson, sessionKey } from "./lesson-session";
import { fakeProgressDb } from "./testing/fake-progress-db";
import { deleteLearningData } from "../account-deletion.server";
const owner = "challenge-owner",
  now = 1800000000000;
const scope = (unitId = "DE.A1.U01") => ({ ...COURSE_SCOPE, unitId });
const responses = (unitId = "DE.A1.U01", formId: "A" | "B" = "A") =>
  challengeForms[unitId][formId].map((item) => ({
    itemId: item.id,
    response: item.acceptedAnswers[0],
  }));
const start = (unitId = "DE.A1.U01") => ({ ...scope(unitId), attemptId: randomUUID() });
for (const unitId of ["DE.A1.U01", "DE.A1.U02", "DE.A1.U03"])
  for (const formId of ["A", "B"] as const) {
    test(`${unitId} ${formId}: eight major outcomes, 75% progression clearance`, () => {
      const items = challengeForms[unitId][formId];
      assert.equal(items.length, 8);
      assert.equal(new Set(items.map((item) => item.id)).size, 8);
      assert.equal(new Set(items.map((item) => item.outcome)).size, 8);
      for (const correctCount of [5, 6, 7, 8]) {
        const answers = responses(unitId, formId);
        for (let i = correctCount; i < items.length; i++) answers[i].response = "wrong";
        const result = scoreChallenge(scope(unitId), formId, answers);
        assert.equal(result.correctCount, correctCount);
        assert.equal(result.passed, correctCount >= 6);
      }
    });
  }
test("German keyboard fallback preserves noun case and semantic requirements", () => {
  const answers = responses();
  answers[2].response = "ein Buero";
  assert.equal(scoreChallenge(scope(), "A", answers).passed, true);
  answers[2].response = "ein buero";
  assert.equal(scoreChallenge(scope(), "A", answers).correctCount, 7);
  const unit2 = responses("DE.A1.U02");
  unit2[6].response = "Sami liest und Ada schlaeft.";
  assert.equal(scoreChallenge(scope("DE.A1.U02"), "A", unit2).passed, true);
});
test("submission rejects missing, duplicate, foreign, empty and overlong responses", () => {
  const payload = { ...start(), responses: responses() };
  assert.throws(() => challengeSubmitSchema.parse({ ...payload, ownerId: "someone" }));
  assert.throws(() => scoreChallenge(scope(), "A", payload.responses.slice(1)));
  for (const change of [
    { itemId: "unknown", response: "x" },
    payload.responses[1],
    { itemId: payload.responses[0].itemId, response: " " },
  ]) {
    const changed = [...payload.responses];
    changed[0] = change;
    assert.throws(() => scoreChallenge(scope(), "A", changed));
  }
  assert.throws(() =>
    challengeSubmitSchema.parse({
      ...payload,
      responses: payload.responses.map((r) => ({ ...r, response: "x".repeat(161) })),
    }),
  );
});
test("draft reload, simultaneous starts and lost start acknowledgement share one active form", async () => {
  const s = fakeProgressDb();
  await readUnitChallenge(s.db, owner, scope(), now);
  assert.equal(s.writes.length, 0);
  const request = start();
  const drafts = await Promise.all([
    startChallenge(s.db, owner, request, now),
    startChallenge(s.db, owner, start(), now),
  ]);
  assert.equal(drafts[0].attempt?.attemptId, drafts[1].attempt?.attemptId);
  assert.equal(drafts[0].summary.attemptCount, 1);
  assert.equal(
    (await startChallenge(s.db, owner, request, now)).attempt?.attemptId,
    drafts[0].attempt?.attemptId,
  );
  const reloaded = await readUnitChallenge(s.db, owner, scope(), now);
  assert.equal(reloaded.items.length, 8);
  assert.equal("acceptedAnswers" in reloaded.items[0], false);
  assert.equal(s.records.size, 2);
});
test("submitted truth is immutable, idempotent and never stores responses or lesson evidence", async () => {
  const s = fakeProgressDb();
  const request = start();
  await startChallenge(s.db, owner, request, now);
  const payload = { ...request, responses: responses() };
  const saved = await submitChallenge(s.db, owner, payload, now + 1);
  assert.equal(saved.summary.clearedAt, now + 1);
  assert.equal(saved.items.length, 0);
  const writes = s.writes.length;
  await submitChallenge(
    s.db,
    owner,
    { ...payload, responses: [...payload.responses].reverse() },
    now + 2,
  );
  assert.equal(s.writes.length, writes);
  const changed = structuredClone(payload);
  changed.responses[0].response = "wrong";
  await assert.rejects(submitChallenge(s.db, owner, changed, now + 2), /different answers/);
  assert.equal((await readUnitChallenge(s.db, owner, scope(), now + 2)).summary.clearedAt, now + 1);
  assert.equal(
    (await readCourseProgress(s.db, owner, COURSE_SCOPE)).lessons.every((l) => l.progress === null),
    true,
  );
  assert.equal(
    s.writes.every((path) => path.startsWith(`users/${owner}/unitChallenges/`)),
    true,
  );
  const persisted = JSON.stringify([...s.records.values()]);
  for (const forbidden of [
    "responses",
    "acceptedAnswers",
    "Ich bin Ada",
    "completedStepIds",
    "skillEvidence",
    "grammarProgress",
    "lesenProgress",
    "FSRS",
  ])
    assert.equal(persisted.includes(forbidden), false);
});
test("concurrent competing submissions cannot overwrite the winner", async () => {
  const s = fakeProgressDb(),
    request = start();
  await startChallenge(s.db, owner, request, now);
  const good = { ...request, responses: responses() },
    bad = structuredClone(good);
  bad.responses[0].response = "wrong";
  const results = await Promise.allSettled([
    submitChallenge(s.db, owner, good, now + 1),
    submitChallenge(s.db, owner, bad, now + 1),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await readUnitChallenge(s.db, owner, scope(), now + 2)).attempt?.passed, true);
});
test("failed result allows study, enforces interval, rotates form and permits later clearance", async () => {
  const s = fakeProgressDb(),
    request = start();
  await startChallenge(s.db, owner, request, now);
  const wrong = responses();
  for (const answer of wrong.slice(0, 3)) answer.response = "wrong";
  const failed = await submitChallenge(s.db, owner, { ...request, responses: wrong }, now + 1);
  assert.equal(failed.summary.clearedAt, null);
  assert.equal(failed.items.length, 0);
  assert.equal(failed.summary.retryAfter, now + 1 + CHALLENGE_RETRY_MS);
  assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), []);
  await assert.rejects(startChallenge(s.db, owner, start(), now + CHALLENGE_RETRY_MS), /24-hour/);
  const retry = start();
  const draft = await startChallenge(s.db, owner, retry, now + 1 + CHALLENGE_RETRY_MS);
  assert.equal(draft.attempt?.formId, "B");
  await submitChallenge(
    s.db,
    owner,
    { ...retry, responses: responses("DE.A1.U01", "B") },
    now + 2 + CHALLENGE_RETRY_MS,
  );
  const cleared = await startChallenge(s.db, owner, start(), now + 3 + CHALLENGE_RETRY_MS);
  assert.equal(cleared.summary.attemptCount, 2);
  assert.equal(cleared.attempt?.passed, true);
});
test("owners, units, release and stored ownership are isolated", async () => {
  const s = fakeProgressDb(),
    request = start();
  await startChallenge(s.db, owner, request, now);
  await assert.rejects(
    submitChallenge(s.db, "another-owner", { ...request, responses: responses() }, now),
  );
  assert.equal((await readUnitChallenge(s.db, "another-owner", scope(), now)).attempt, null);
  assert.equal((await readUnitChallenge(s.db, owner, scope("DE.A1.U02"), now)).attempt, null);
  for (const altered of [
    { ...scope(), unitId: "DE.A1.U09" },
    { ...scope(), releaseId: "other" },
    { ...scope(), trackId: "other" },
  ])
    await assert.rejects(readUnitChallenge(s.db, owner, altered, now), /unavailable/);
  const path = challengePath(owner, scope());
  const saved = s.records.get(path) as Record<string, unknown>;
  saved.ownerId = "another-owner";
  s.records.set(path, saved);
  await assert.rejects(readUnitChallenge(s.db, owner, scope(), now), /ownership/);
});
test("Unit 1 and 2 clearance moves guided progression without lesson completion", async () => {
  const s = fakeProgressDb();
  for (const unitId of ["DE.A1.U01", "DE.A1.U02"]) {
    const request = start(unitId);
    await startChallenge(s.db, owner, request, now);
    await submitChallenge(s.db, owner, { ...request, responses: responses(unitId) }, now + 1);
    const clearances = await readChallengeClearances(s.db, owner, COURSE_SCOPE);
    const action = courseLearningAction(germanA1, {}, [], clearances);
    assert.equal(action.unit?.id, unitId === "DE.A1.U01" ? "DE.A1.U02" : "DE.A1.U03");
    assert.equal(action.complete, false);
    assert.equal(unitProgress(germanA1, germanA1.units[0], {}).finishedCount, 0);
    assert.equal(unitProgress(germanA1, germanA1.units[0], {}).status, "Not started");
    const progress = await readCourseProgress(s.db, owner, COURSE_SCOPE);
    assert.equal(
      homeCourseAction({ ...progress, challengeClearances: clearances }).complete,
      action.complete,
    );
  }
});
test("account deletion removes summaries and nested attempts, preserves another owner", async () => {
  const s = fakeProgressDb();
  for (const user of [owner, "another-owner"])
    for (const unitId of ["DE.A1.U01", "DE.A1.U02", "DE.A1.U03"])
      await startChallenge(s.db, user, start(unitId), now);
  await deleteLearningData(s.db, owner);
  assert.equal(
    [...s.records.keys()].some((path) => path.startsWith(`users/${owner}/`)),
    false,
  );
  assert.equal(s.records.size, 6);
});
test("all API entry points use verified middleware and no client owner", () => {
  const api = readFileSync(new URL("./challenge-api.ts", import.meta.url), "utf8");
  assert.equal((api.match(/middleware\(\[authMiddleware\]\)/g) ?? []).length, 3);
  assert.equal((api.match(/context.userId/g) ?? []).length, 3);
  assert.equal((api.match(/await requireCourseAuthentication\(\)/g) ?? []).length, 3);
});

test("historical lesson completion OR challenge clearance advances the authored path", () => {
  const finished = Object.fromEntries(
    germanA1.lessons
      .filter((lesson) => lesson.unitId === "DE.A1.U01")
      .map((lesson) => [
        sessionKey(germanA1.id, lesson.id),
        { ...startLesson(germanA1.id, lesson), historicallyFinished: true },
      ]),
  );
  assert.equal(courseLearningAction(germanA1, finished).unit?.id, "DE.A1.U02");
  assert.equal(courseLearningAction(germanA1, finished, [], ["DE.A1.U02"]).unit?.id, "DE.A1.U03");
  assert.equal(unitProgress(germanA1, germanA1.units[1], finished).finishedCount, 0);
});
test("challenge submissions preserve existing course, Unit Check and legacy records byte for byte", async () => {
  const existing = Object.fromEntries(
    [
      "users/challenge-owner/courseProgress/existing",
      "users/challenge-owner/assessmentAttempts/existing",
      "users/challenge-owner/cardProgress/existing",
      "grammarProgress/challenge-owner",
      "lesenProgress/challenge-owner",
      "users/challenge-owner/grammarPasteTopics/existing",
    ].map((path) => [path, { sentinel: path }]),
  );
  const s = fakeProgressDb(existing),
    request = start();
  await startChallenge(s.db, owner, request, now);
  await submitChallenge(s.db, owner, { ...request, responses: responses() }, now + 1);
  for (const [path, value] of Object.entries(existing))
    assert.deepEqual(s.records.get(path), value);
});

for (const count of [6, 7])
  test(`historical ${count}/8 derives clearance without rewriting history or cooldown`, async () => {
    const s = fakeProgressDb(),
      request = start();
    await startChallenge(s.db, owner, request, now);
    const answers = responses();
    for (const answer of answers.slice(count)) answer.response = "wrong";
    await submitChallenge(s.db, owner, { ...request, responses: answers }, now + 1);
    const path = challengePath(owner, scope());
    const accepted = s.records.get(`${path}/attempts/${request.attemptId}`) as Record<
      string,
      unknown
    >;
    accepted.passed = false; // Original perfect-score policy's accepted verdict.
    const saved = s.records.get(path) as Record<string, unknown>;
    saved.clearedAt = null;
    saved.retryAfter = now + 1 + CHALLENGE_RETRY_MS;
    const before = structuredClone(s.records),
      writes = s.writes.length;
    const projected = await readUnitChallenge(s.db, owner, scope(), now + 2);
    assert.equal(projected.summary.clearedAt, now + 1);
    assert.equal(projected.summary.retryAfter, null);
    assert.equal(projected.attempt!.passed, false);
    assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), ["DE.A1.U01"]);
    const resumed = await startChallenge(s.db, owner, start(), now + 2);
    assert.equal(resumed.summary.clearedAt, now + 1);
    assert.equal(resumed.summary.attemptCount, 1);
    assert.deepEqual(s.records, before);
    assert.equal(s.writes.length, writes);
    const clearances = await readChallengeClearances(s.db, owner, COURSE_SCOPE);
    assert.equal(courseLearningAction(germanA1, {}, [], clearances).unit!.id, "DE.A1.U02");
    assert.equal(
      homeCourseAction({
        ...(await readCourseProgress(s.db, owner, COURSE_SCOPE)),
        challengeClearances: clearances,
      }).lesson!.id,
      "DE.A1.U02.L01",
    );
    assert.equal(unitProgress(germanA1, germanA1.units[0], {}).finishedCount, 0);
  });

test("earlier historical qualifying attempt clears even when the latest attempt failed", async () => {
  const s = fakeProgressDb(),
    first = start();
  await startChallenge(s.db, owner, first, now);
  const answers = responses();
  for (const answer of answers.slice(0, 3)) answer.response = "wrong";
  await submitChallenge(s.db, owner, { ...first, responses: answers }, now + 1);
  const second = start();
  await startChallenge(s.db, owner, second, now + 1 + CHALLENGE_RETRY_MS);
  const retryAnswers = responses("DE.A1.U01", "B");
  for (const answer of retryAnswers.slice(0, 3)) answer.response = "wrong";
  await submitChallenge(
    s.db,
    owner,
    { ...second, responses: retryAnswers },
    now + 2 + CHALLENGE_RETRY_MS,
  );
  const path = challengePath(owner, scope());
  // Model two accepted attempts under the previous policy: 6/8 then 5/8.
  const earlier = s.records.get(`${path}/attempts/${first.attemptId}`) as Record<string, unknown>;
  earlier.correctCount = 6;
  const before = structuredClone(s.records),
    writes = s.writes.length;
  assert.equal(
    (await readUnitChallenge(s.db, owner, scope(), now + 3 + CHALLENGE_RETRY_MS)).summary.clearedAt,
    now + 1,
  );
  assert.deepEqual(await readChallengeClearances(s.db, owner, COURSE_SCOPE), ["DE.A1.U01"]);
  assert.deepEqual(s.records, before);
  assert.equal(s.writes.length, writes);
  earlier.ownerId = "foreign-owner";
  await assert.rejects(readChallengeClearances(s.db, owner, COURSE_SCOPE), /ownership/);
});

test("clearance uses the ratio, with valid counts rather than a fixed six-item cutoff", () => {
  assert.equal(challengeScoreClears(9, 12), true);
  assert.equal(challengeScoreClears(8, 12), false);
  for (const [correct, total] of [
    [0, 0],
    [-1, 8],
    [9, 8],
    [6.5, 8],
    [6, 8.5],
  ])
    assert.equal(challengeScoreClears(correct, total), false);
});
