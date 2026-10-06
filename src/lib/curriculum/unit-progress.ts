import { lessonStatus, sessionKey, type LessonSessions } from "./lesson-session";
import type { CurriculumRelease, LessonDefinition, UnitDefinition } from "./types";

/** Registry order is the guided path; traversal never supplies assessment credit. */
export function courseLearningAction(
  release: CurriculumRelease,
  sessions: LessonSessions,
  blockedLessons: readonly string[] = [],
) {
  const units = release.units.map((unit) => ({
    unit,
    progress: unitProgress(release, unit, sessions, blockedLessons),
  }));
  const unfinished = units.find(
    ({ progress }) => progress.authoredCount > 0 && progress.status !== "Unit lessons complete",
  );
  // An unavailable saved lesson must not silently skip an unfinished earlier unit.
  if (unfinished)
    return { unit: unfinished.unit, lesson: unfinished.progress.nextLesson, complete: false };
  const repeat = units.find(({ progress }) => progress.repeatLesson);
  const lastAuthored = units.filter(({ progress }) => progress.authoredCount > 0).at(-1);
  return {
    unit: repeat?.unit ?? lastAuthored?.unit,
    lesson: repeat?.progress.repeatLesson,
    complete: true,
  };
}

/** Historical traversal only, derived from lesson acknowledgements; no unit record or mastery. */
export function unitProgress(
  release: CurriculumRelease,
  unit: UnitDefinition,
  sessions: LessonSessions,
  blockedLessons: readonly string[] = [],
) {
  const lessons = unit.lessonIds.map((id) => release.lessons.find((lesson) => lesson.id === id));
  const authored = lessons.filter(
    (lesson): lesson is LessonDefinition => lesson?.availability === "prototype",
  );
  const available = authored.filter((lesson) => !blockedLessons.includes(lesson.id));
  const finishedCount = available.filter(
    (lesson) => lessonStatus(release.id, lesson, sessions) === "Finished",
  ).length;
  const complete = lessons.length > 0 && finishedCount === lessons.length;
  const started =
    finishedCount > 0 || available.some((lesson) => sessions[sessionKey(release.id, lesson.id)]);
  return {
    status: complete
      ? "Unit lessons complete"
      : !authored.length
        ? "Not yet authored"
        : started
          ? "In progress"
          : "Not started",
    authoredCount: authored.length,
    finishedCount,
    total: lessons.length,
    nextLesson: available.find(
      (lesson) => lessonStatus(release.id, lesson, sessions) !== "Finished",
    ),
    repeatLesson: available.find((lesson) => {
      const state = sessions[sessionKey(release.id, lesson.id)];
      return state?.historicallyFinished && state.status === "in-progress";
    }),
  };
}
