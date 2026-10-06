import assert from "node:assert/strict";
import { test } from "node:test";
import { germanA1 } from "@/content/curriculum/german-a1";
import {
  evaluateStep,
  lessonStatus,
  nextAuthoredLesson,
  sessionKey,
  updateLessonSession,
  type LessonSessions,
} from "./lesson-session";
const [first, second] = germanA1.lessons;
function finish(sessions: LessonSessions, lesson = first) {
  for (const step of lesson.steps) {
    if (step.kind !== "explanation") {
      sessions = updateLessonSession(sessions, germanA1.id, lesson, {
        type: "respond",
        value:
          step.kind === "choice"
            ? step.correctAnswer
            : step.kind === "text"
              ? step.acceptedAnswers[0]
              : "Ich bin Alex.",
      });
      sessions = updateLessonSession(sessions, germanA1.id, lesson, { type: "check" });
    }
    sessions = updateLessonSession(sessions, germanA1.id, lesson, { type: "continue" });
  }
  return sessions;
}
test("L02 exact approved metadata and distinct authored shape", () => {
  assert.equal(second.id, "DE.A1.U01.L02");
  assert.equal(second.title, "Name people and things");
  assert.equal(second.outcome, "Match pictured/labeled entities then write a familiar noun phrase");
  assert.deepEqual(second.introducedSkillIds, [
    "DE.A1.GRAMMAR.NOUNS.GENDER",
    "DE.A1.GRAMMAR.ARTICLES.DEFINITE_NOM",
    "DE.A1.GRAMMAR.ARTICLES.INDEFINITE_NOM",
    "DE.A1.GRAMMAR.CASES.NOMINATIVE_ROLE",
    "DE.A1.VOCABULARY.ENTITY_CATEGORIES",
    "DE.A1.WRITING.ORTHOGRAPHY",
    "DE.A1.READING.PERSON_ENTITIES",
  ]);
  assert.deepEqual(second.consolidatedSkillIds, []);
  assert.deepEqual(
    second.steps.map((s) => s.stage),
    ["discover", "understand", "recognize", "classify", "recall", "read", "produce", "check"],
  );
  assert.notDeepEqual(
    first.steps.map((s) => s.stage),
    second.steps.map((s) => s.stage),
  );
  assert.equal(second.steps.at(-1)?.purpose, "formative-check");
});
test("classification, explicit entity reading, capitalization and bounded phrases", () => {
  for (const [index, correct, wrong] of [
    [3, "A place", "A person"],
    [5, "Nora", "Frau"],
    [4, "eine Frau", "eine frau"],
    [6, "ein Büro", "ein büro"],
  ] as const) {
    assert.equal(evaluateStep(second.steps[index], correct)?.outcome, "correct");
    assert.equal(evaluateStep(second.steps[index], wrong)?.outcome, "incorrect");
  }
  assert.equal(evaluateStep(second.steps[6], "ein Buro")?.outcome, "incorrect");
  assert.equal(evaluateStep(second.steps[6], "ein Büro ist schön")?.outcome, "incorrect");
  assert.equal(evaluateStep(second.steps[6], "  ein   Büro  ")?.outcome, "correct");
  assert.equal(evaluateStep(second.steps[6], " "), null);
});
test("multi-lesson responses, retries, completion and restart are isolated", () => {
  let sessions = updateLessonSession({}, germanA1.id, second, { type: "continue" });
  sessions = updateLessonSession(sessions, germanA1.id, second, { type: "continue" });
  sessions = updateLessonSession(sessions, germanA1.id, second, {
    type: "respond",
    value: "die Telefon",
  });
  sessions = updateLessonSession(sessions, germanA1.id, second, { type: "check" });
  const secondState = sessions[sessionKey(germanA1.id, second.id)];
  sessions = finish(sessions);
  assert.equal(lessonStatus(germanA1.id, first, sessions), "Finished");
  assert.equal(sessions[sessionKey(germanA1.id, second.id)], secondState);
  assert.equal(secondState.status, "in-progress");
  assert.equal(secondState.attempts[second.steps[2].id], 1);
  assert.equal(nextAuthoredLesson(germanA1.lessons, first)?.id, second.id);
  sessions = updateLessonSession(sessions, germanA1.id, first, { type: "restart" });
  assert.equal(sessions[sessionKey(germanA1.id, first.id)].stepIndex, 0);
  assert.equal(sessions[sessionKey(germanA1.id, second.id)], secondState);
  assert.equal(lessonStatus(germanA1.id, first, {}), "Available");
  assert.equal(lessonStatus("another-release", second, sessions), "Available");
});
test("finishing both authored lessons leaves unit incomplete and creates no mastery", () => {
  const sessions = finish(finish({}), second);
  assert.equal(lessonStatus(germanA1.id, second, sessions), "Finished");
  assert.equal(nextAuthoredLesson(germanA1.lessons, second)?.id, germanA1.lessons[2].id);
  assert.equal(lessonStatus(germanA1.id, germanA1.lessons[2], sessions), "Available");
  assert.equal(
    germanA1.units[0].lessonIds.every(
      (id) => sessions[sessionKey(germanA1.id, id)]?.status === "finished",
    ),
    false,
  );
  for (const state of Object.values(sessions)) {
    assert.equal("mastery" in state, false);
    assert.equal("evidence" in state, false);
  }
});
