import { courseProgressFixture } from "./course-progress";
import { USER_ID, NOW } from "./backend";
import {
  readUnitChallenge,
  startChallenge,
  submitChallenge,
  readChallengeClearances,
} from "../../src/lib/curriculum/challenge.server";
import { challengeScopeSchema } from "../../src/lib/curriculum/challenge";
import { courseScopeSchema } from "../../src/lib/curriculum/course-progress";
export function challengeFixture() {
  const course = courseProgressFixture();
  let now = NOW,
    loseStart = false,
    loseSubmit = false;
  return {
    storage: course.storage,
    advanceTime: (ms: number) => {
      now += ms;
    },
    loseNextStartAck: () => {
      loseStart = true;
    },
    loseNextSubmitAck: () => {
      loseSubmit = true;
    },
    handlers: {
      ...course.handlers,
      getCourseProgress: async (input: unknown) => ({
        ...(await course.handlers.getCourseProgress(input)),
        challengeClearances: await readChallengeClearances(
          course.storage.db,
          USER_ID,
          courseScopeSchema.parse(input),
        ),
      }),
      getUnitChallenge: async (input: unknown) =>
        readUnitChallenge(course.storage.db, USER_ID, challengeScopeSchema.parse(input), now),
      startUnitChallenge: async (input: unknown) => {
        const result = await startChallenge(course.storage.db, USER_ID, input, now);
        if (loseStart) {
          loseStart = false;
          throw Error("Lost start ack");
        }
        return result;
      },
      finishUnitChallenge: async (input: unknown) => {
        const result = await submitChallenge(course.storage.db, USER_ID, input, now);
        if (loseSubmit) {
          loseSubmit = false;
          throw Error("Lost submit ack");
        }
        return result;
      },
    },
  };
}
