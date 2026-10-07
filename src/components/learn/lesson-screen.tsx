import { checkpointAvailable, checkpoint2Available } from "@/lib/curriculum/checkpoint-access";
import { lessonHint } from "@/lib/curriculum/lesson-hint";
import { courseLearningAction, unitProgress } from "@/lib/curriculum/unit-progress";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExerciseResponse } from "./exercise-response";
import {
  startLesson,
  sessionKey,
  nextAuthoredLesson,
  type LessonAction,
} from "@/lib/curriculum/lesson-session";
import type { CurriculumRelease, LessonDefinition } from "@/lib/curriculum/types";
import { useLearnSession } from "./session-context";

export function LessonScreen({
  release,
  lesson,
  aheadOfPath = false,
}: {
  release: CurriculumRelease;
  lesson: LessonDefinition;
  aheadOfPath?: boolean;
}) {
  const {
    sessions,
    setSessions,
    dispatch: dispatchProgress,
    retry,
    acceptSaved,
    saves,
    blockedLessons,
    clearedUnits,
  } = useLearnSession();
  const releaseId = release.id;
  const session = sessions[sessionKey(releaseId, lesson.id)];
  const unit = release.units.find((candidate) => candidate.id === lesson.unitId)!;
  const lessonNumber = unit.lessonIds.indexOf(lesson.id) + 1;
  const unitNumber = release.units.indexOf(unit) + 1;
  const progress = unitProgress(release, unit, sessions, blockedLessons);
  const following = nextAuthoredLesson(release.lessons, lesson);
  const courseNext = courseLearningAction(release, sessions, blockedLessons, clearedUnits);
  const next =
    following && !blockedLessons.includes(following.id)
      ? following
      : (progress.nextLesson ??
        (progress.status === "Unit lessons complete" && courseNext.unit?.id !== unit.id
          ? courseNext.lesson
          : undefined));
  // SSR can render a form before its handlers hydrate. Prevent native submission
  // from reloading the page before an answer can be acknowledged.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    const key = sessionKey(releaseId, lesson.id);
    setSessions((previous) =>
      previous[key] ? previous : { ...previous, [key]: startLesson(releaseId, lesson) },
    );
  }, [releaseId, lesson, setSessions]);
  const state =
    session?.lessonId === lesson.id && session.releaseId === releaseId
      ? session
      : startLesson(releaseId, lesson);
  const step = lesson.steps[state.stepIndex];
  const answer = state.responses[step.id] ?? "";
  const [hint, setHint] = useState<string | null>(null);
  const bounded = step.kind === "text" || step.kind === "choice";
  const attempts = state.attempts[step.id] ?? 0;
  const revealed = bounded && state.feedback?.outcome === "unassessed";
  const passed = state.feedback && state.feedback.outcome !== "incorrect";
  const heading = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(state.stepIndex);
  useEffect(() => {
    if (previousIndex.current !== state.stepIndex || state.status === "finished") {
      heading.current?.focus();
      previousIndex.current = state.stepIndex;
    }
  }, [state.stepIndex, state.status]);
  function dispatch(action: LessonAction) {
    dispatchProgress(lesson, action);
  }
  const save = saves[lesson.id];
  const saving = save?.phase === "saving";
  const blocked = ["failed", "conflict", "unavailable"].includes(save?.phase ?? "");
  const explaining = step.kind === "explanation";
  const complete = state.status === "finished";
  return (
    <div className="min-h-dvh bg-bg text-fg">
      {aheadOfPath && (
        <p className="mx-auto max-w-3xl px-page-safe pt-4 text-sm text-muted">
          You're studying ahead of your recommended path.
        </p>
      )}
      <header className="border-b border-border pt-safe-top">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-page-safe py-4">
          <Link
            to="/learn/units/$unitId"
            params={{ unitId: unit.id }}
            className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm font-medium text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Unit {unitNumber}
          </Link>
          <p className="text-sm text-muted">
            {release.title} · Lesson {lessonNumber}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-page-safe pt-6 pb-section-safe sm:pt-8">
        <p className="text-sm font-medium text-primary-ink">
          {complete
            ? "Lesson finished"
            : `Lesson ${lessonNumber} · Step ${state.stepIndex + 1} of ${lesson.steps.length}`}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {lesson.description ?? lesson.outcome}
        </p>
        <Progress
          label="Lesson steps completed"
          value={(state.completedStepIds.length / lesson.steps.length) * 100}
          className="mt-6 h-1.5"
        />
        {save && (
          <div className="mt-4 text-sm" aria-live="polite">
            {save.phase === "saving" && <p className="text-muted">Saving progress…</p>}
            {save.phase === "saved" && <p className="text-muted">Progress saved</p>}
            {save.phase === "unsaved" && (
              <p className="text-muted">Your answer is here. Check it to save this step.</p>
            )}
            {save.phase === "failed" && (
              <div className="rounded-control bg-danger-soft p-4 text-danger">
                <p>Your answer is still here, but it hasn’t saved. Try again.</p>
                <Button variant="secondary" className="mt-3" onClick={() => retry(lesson)}>
                  Retry saving
                </Button>
              </div>
            )}
            {save.phase === "conflict" && (
              <div className="rounded-control bg-surface-2 p-4 text-fg">
                <p>
                  Another tab saved newer progress. Your answer is still here. Load saved progress
                  to replace it.
                </p>
                <Button variant="secondary" className="mt-3" onClick={() => acceptSaved(lesson)}>
                  Load saved progress
                </Button>
              </div>
            )}
            {save.phase === "unavailable" && (
              <p className="text-danger">
                This lesson has changed. Your response is still here, but it cannot be saved against
                new content. Return to the unit for availability.
              </p>
            )}
          </div>
        )}
        {complete ? (
          <section className="mt-10" aria-labelledby="lesson-finished">
            <Check className="size-7 text-primary-ink" aria-hidden="true" />
            <h2
              id="lesson-finished"
              ref={heading}
              tabIndex={-1}
              className="mt-4 text-2xl font-semibold outline-none"
            >
              Lesson finished.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              You completed this lesson’s practice. This does not establish skill mastery or A1
              proficiency.
              {lesson.steps.some((candidate) => candidate.kind === "original") &&
                " Your open writing remains unassessed."}
            </p>
            <p className="mt-4 text-sm text-muted">
              Your lesson completion is saved. Practicing again keeps that milestone.
            </p>
            {next ? (
              <Button asChild className="mt-6 h-auto min-h-11 whitespace-normal py-3">
                <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                  Next lesson: {next.title}
                </Link>
              </Button>
            ) : (
              <p className="mt-6 font-medium">
                {progress.status === "Unit lessons complete"
                  ? `Unit ${unitNumber} lessons complete. More units are not yet authored.`
                  : "This lesson is finished. Return to the unit to see your remaining lessons."}
              </p>
            )}
            {lesson.unitId === "DE.A1.U06" &&
              checkpoint2Available(sessions, blockedLessons, clearedUnits) && (
                <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
                  <CheckpointEntry checkpoint={2} />
                </Suspense>
              )}
            {lesson.unitId === "DE.A1.U03" &&
              checkpointAvailable(sessions, blockedLessons, clearedUnits) && (
                <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
                  <CheckpointEntry />
                </Suspense>
              )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link to="/learn/units/$unitId" params={{ unitId: unit.id }}>
                  Return to Unit {unitNumber}
                </Link>
              </Button>
              <Button
                variant="secondary"
                disabled={!ready || saving || blocked}
                onClick={() => dispatchProgress(lesson, { type: "restart" })}
              >
                Practice lesson again
              </Button>
            </div>
          </section>
        ) : (
          <section className="mt-6 sm:mt-8" aria-labelledby="lesson-task">
            <p className="text-sm text-muted">{step.label}</p>
            <h2
              id="lesson-task"
              ref={heading}
              tabIndex={-1}
              className="mt-3 text-xl font-semibold leading-snug outline-none"
            >
              {step.prompt}
            </h2>
            {step.example && (
              <blockquote
                lang="de"
                className="mt-4 whitespace-pre-line border-l-2 border-primary pl-5 text-xl leading-relaxed"
              >
                {step.example}
              </blockquote>
            )}
            {step.explanation && (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                {step.explanation}
              </p>
            )}
            <form
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (state.feedback?.outcome === "incorrect") {
                  dispatch({ type: "respond", value: answer });
                  document
                    .querySelector<HTMLInputElement>("#lesson-answer, input[type=radio]")
                    ?.focus();
                } else dispatch({ type: explaining || passed ? "continue" : "check" });
              }}
            >
              <ExerciseResponse
                step={step}
                answer={answer}
                disabled={!ready || !!passed || saving || blocked}
                incorrect={state.feedback?.outcome === "incorrect"}
                onRespond={(value) => dispatch({ type: "respond", value })}
              />
              <div
                id="lesson-feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={
                  state.feedback
                    ? `mt-5 rounded-control px-4 py-3 text-sm leading-relaxed ${state.feedback.outcome === "incorrect" ? "bg-danger-soft text-danger" : revealed ? "bg-surface-2 text-fg" : "bg-primary-soft text-primary-ink"}`
                    : "sr-only"
                }
              >
                {state.feedback?.message}
              </div>
              {state.feedback?.outcome === "incorrect" && (
                <p className="mt-3 text-sm text-muted">Change your answer, then check again.</p>
              )}
              {bounded && hint === step.id && !revealed && (
                <p className="mt-3 text-sm text-muted" role="note">
                  Hint: {lessonHint(step, answer)}
                </p>
              )}
              {revealed && (
                <p className="mt-3 text-base font-medium" lang="de">
                  Answer:{" "}
                  {step.kind === "text"
                    ? step.acceptedAnswers[0]
                    : step.kind === "choice"
                      ? step.correctAnswer
                      : ""}
                </p>
              )}
              {bounded && !passed && attempts >= 2 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={saving || blocked}
                    onClick={() => setHint(step.id)}
                  >
                    Hint
                  </Button>
                  {attempts >= 3 && state.feedback?.outcome === "incorrect" && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={saving || blocked}
                      onClick={() => dispatch({ type: "reveal" })}
                    >
                      Show answer
                    </Button>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="mt-4 w-full sm:w-auto sm:min-w-40"
                disabled={!ready || saving || blocked || (!explaining && !passed && !answer.trim())}
              >
                {explaining || passed
                  ? state.stepIndex === lesson.steps.length - 1
                    ? "Finish lesson"
                    : "Continue"
                  : state.feedback?.outcome === "incorrect"
                    ? "Retry"
                    : step.kind === "original"
                      ? "Record response"
                      : "Check"}
              </Button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

const CheckpointEntry = lazy(() =>
  import("@/components/learn/checkpoint-entry").then((module) => ({
    default: module.CheckpointEntry,
  })),
);
