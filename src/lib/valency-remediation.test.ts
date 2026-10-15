import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import {
  saveValencyAttempt,
  valencyReviewQueue,
  type ValencyAttemptRow,
} from "./valency-remediation.server";
import { reviewedValencyQuestions } from "./german/reviewed-valency-practice";
import { fakeProgressDb } from "./curriculum/testing/fake-progress-db";
import { buildLearnerGapStates, type DiagnosticObservation } from "./learner-diagnostics";

test("storage contract: wrong -> refresh queue -> correct retry -> spaced review, atomic and idempotent", async () => {
  const fake = fakeProgressDb(),
    q = reviewedValencyQuestions()[0],
    selection = q.reviewedValencyItem!;
  const wrong = q.options.find((a) => a !== q.correctAnswer)!;
  const input = { operationId: randomUUID(), selection, answer: wrong };
  const now = 1_800_000_000_000;
  const result = await saveValencyAttempt(fake.db, "owner", input, now);
  assert.equal(result.ok, true);
  assert.equal(fake.writes.length, 2);
  assert.deepEqual(await saveValencyAttempt(fake.db, "owner", input, now + 100), result);
  assert.equal(fake.writes.length, 2);
  assert.equal(
    (await saveValencyAttempt(fake.db, "owner", { ...input, answer: q.correctAnswer }, now)).ok,
    false,
  );
  assert.equal(
    (
      await saveValencyAttempt(
        fake.db,
        "owner",
        { ...input, operationId: randomUUID(), selection: { ...selection, version: "stale" } },
        now,
      )
    ).ok,
    false,
  );
  const rows = () =>
    [...fake.records]
      .filter(([path]) => path.startsWith("users/owner/grammarRemediation/"))
      .map(([path, value]) => ({ ...(value as ValencyAttemptRow), id: path.split("/").at(-1)! }));
  assert.deepEqual(valencyReviewQueue(rows(), now + 1), {
    mistakes: [selection.exerciseId],
    due: [],
  });
  assert.deepEqual(
    valencyReviewQueue(
      rows().map((r) => ({
        ...r,
        itemResult: { ...r.itemResult!, selection: { ...selection, senseId: "different" } },
      })),
      now + 1,
    ),
    { mistakes: [], due: [] },
  );
  await saveValencyAttempt(
    fake.db,
    "owner",
    { ...input, operationId: randomUUID(), answer: q.correctAnswer },
    now + 1000,
  );
  assert.deepEqual(valencyReviewQueue(rows(), now + 1001), { mistakes: [], due: [] });
  assert.deepEqual(valencyReviewQueue(rows(), now + 1000 + 24 * 60 * 60 * 1000), {
    mistakes: [],
    due: [selection.exerciseId],
  });
  const diagnostic = fake.records.get(
    `users/owner/learningDiagnostics/${input.operationId}`,
  ) as DiagnosticObservation;
  assert.equal(diagnostic.independent, false);
  assert.equal(diagnostic.support, "choice");
  assert.equal(
    buildLearnerGapStates([{ ...diagnostic, id: input.operationId }])[0]
      .independentObservationCount,
    0,
  );
  assert.ok([...fake.records.keys()].every((path) => path.startsWith("users/owner/")));
});

test("concurrent retries do not duplicate diagnostics or move the spacing anchor", async () => {
  const fake = fakeProgressDb(),
    q = reviewedValencyQuestions().find((q) => q.reviewedValencyItem!.kind === "determiner_case")!;
  const input = {
    operationId: randomUUID(),
    selection: q.reviewedValencyItem!,
    answer: q.options.find((a) => a !== q.correctAnswer)!,
  };
  const results = await Promise.all([
    saveValencyAttempt(fake.db, "owner", input, 1000),
    saveValencyAttempt(fake.db, "owner", input, 2000),
  ]);
  assert.deepEqual(results[0], results[1]);
  assert.equal(fake.writes.length, 2);
});
