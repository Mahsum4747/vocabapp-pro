import {
  createAssessmentAttempt,
  readAssessmentAttempt,
  readLatestAssessment,
  submitAssessmentAttempt,
} from "../../src/lib/curriculum/assessment.server";
import { courseProgressFixture } from "./course-progress";
import { germanA1 } from "../../src/content/curriculum/german-a1";
import { USER_ID } from "./backend";
export async function assessmentFixture(complete = true) {
  const course = courseProgressFixture();
  if (complete)
    for (let index = 0; index < 4; index++)
      await course.advanceLesson(index, germanA1.lessons[index].steps.length);
  let failLoad = false;
  let failSubmit = false;
  let loseAck = false;
  let failStart = false;
  return {
    course,
    storage: course.storage,
    failNextLoad: () => {
      failLoad = true;
    },
    failNextSubmit: () => {
      failSubmit = true;
    },
    loseNextAck: () => {
      loseAck = true;
    },
    failNextStart: () => {
      failStart = true;
    },
    handlers: {
      ...course.handlers,
      getLatestUnitCheck: async (input: unknown) =>
        readLatestAssessment(course.storage.db, USER_ID, input),
      getUnitCheckAttempt: async (input: unknown) => {
        if (failLoad) {
          failLoad = false;
          throw Error("Fixture offline");
        }
        return readAssessmentAttempt(course.storage.db, USER_ID, input);
      },
      startUnitCheck: async (input: unknown) => {
        if (failStart) {
          failStart = false;
          throw Error("Fixture offline");
        }
        return createAssessmentAttempt(course.storage.db, USER_ID, input);
      },
      finishUnitCheck: async (input: unknown) => {
        if (failSubmit) {
          failSubmit = false;
          throw Error("Fixture offline");
        }
        const result = await submitAssessmentAttempt(course.storage.db, USER_ID, input);
        if (loseAck) {
          loseAck = false;
          throw Error("Fixture lost acknowledgement");
        }
        return result;
      },
    },
  };
}
