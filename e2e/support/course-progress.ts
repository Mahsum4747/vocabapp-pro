import { randomUUID } from "node:crypto";
import { germanA1 } from "../../src/content/curriculum/german-a1";
import {
  lessonResumeContractVersion,
  COURSE_SCOPE,
  type ProgressCommand,
} from "../../src/lib/curriculum/course-progress";
import {
  readCourseProgress,
  saveCourseProgress,
} from "../../src/lib/curriculum/course-progress.server";
import { fakeProgressDb } from "../../src/lib/curriculum/testing/fake-progress-db";
import { USER_ID } from "./backend";

/** Real boundary logic, hermetic document fake; survives browser reloads, never real Firebase. */
export function courseProgressFixture() {
  const storage = fakeProgressDb();
  let failLoad = 0;
  let failSave = 0;
  let loseAck = false;
  return {
    storage,
    failNextLoad: () => ++failLoad,
    failNextSave: () => ++failSave,
    loseNextAcknowledgement: () => {
      loseAck = true;
    },
    handlers: {
      getCourseProgress: async (input: unknown) => {
        if (failLoad) {
          --failLoad;
          throw Error("Offline fixture");
        }
        return readCourseProgress(storage.db, USER_ID, input);
      },
      acknowledgeCourseProgress: async (input: unknown) => {
        if (failSave) {
          --failSave;
          throw Error("Offline fixture");
        }
        const result = await saveCourseProgress(storage.db, USER_ID, input);
        if (loseAck) {
          loseAck = false;
          throw Error("Lost acknowledgement fixture");
        }
        return result;
      },
    },
    async advanceLesson(index: number, completedSteps: number) {
      const lesson = germanA1.lessons[index];
      const current = (await readCourseProgress(storage.db, USER_ID, COURSE_SCOPE)).lessons.find(
        (entry) => entry.lessonId === lesson.id,
      )!.progress;
      let revision = current?.revision ?? 0;
      const write = async (action: ProgressCommand["action"]) => {
        const result = await saveCourseProgress(storage.db, USER_ID, {
          ...COURSE_SCOPE,
          lessonId: lesson.id,
          resumeContractVersion: lessonResumeContractVersion(lesson),
          expectedRevision: revision,
          operationId: randomUUID(),
          action,
        });
        if (result.kind !== "saved") throw Error("Fixture seed conflict");
        revision = result.progress.revision;
      };
      for (const step of lesson.steps.slice(
        current?.completedStepIds.length ?? 0,
        completedSteps,
      )) {
        if (step.kind !== "explanation" && !(current?.checked && current.currentStepId === step.id))
          await write({
            type: "check",
            stepId: step.id,
            ...(step.kind !== "original"
              ? { response: step.kind === "choice" ? step.correctAnswer : step.acceptedAnswers[0] }
              : {}),
          });
        await write({ type: "continue", stepId: step.id });
      }
    },
  };
}
