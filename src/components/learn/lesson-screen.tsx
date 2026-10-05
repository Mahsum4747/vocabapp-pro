import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExerciseResponse } from "./exercise-response";
import {
  startLesson,
  updateLessonSession,
  sessionKey,
  nextAuthoredLesson,
  type LessonAction,
} from "@/lib/curriculum/lesson-session";
import type { CurriculumRelease, LessonDefinition } from "@/lib/curriculum/types";
import { useLearnSession } from "./session-context";

export function LessonScreen({
  release,
  lesson,
}: {
  release: CurriculumRelease;
  lesson: LessonDefinition;
}) {
  const { sessions, setSessions } = useLearnSession();
  const releaseId = release.id;
  const session = sessions[sessionKey(releaseId, lesson.id)];
  const unit = release.units.find((candidate) => candidate.id === lesson.unitId)!;
  const lessonNumber = unit.lessonIds.indexOf(lesson.id) + 1;
  const unitNumber = release.units.indexOf(unit) + 1;
  const next = nextAuthoredLesson(release.lessons, lesson);
  // SSR can render a form before its handlers hydrate. Prevent native submission
  // from reloading the page and destroying the in-memory prototype session.
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
    setSessions((previous) => updateLessonSession(previous, releaseId, lesson, action));
  }
  const explaining = step.kind === "explanation";
  const complete = state.status === "finished";
  return (
    <div className="min-h-dvh bg-bg text-fg">
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
            ? "Lesson finished · Session only"
            : `Lesson ${lessonNumber} · Step ${state.stepIndex + 1} of ${lesson.steps.length}`}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {lesson.description ?? lesson.outcome}
        </p>
        <Progress
          label="Lesson steps completed"
          value={(state.completedStepIds.length / lesson.steps.length) * 100}
          className="mt-6 h-1.5"
        />
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
              This progress stays only while you remain in Learn. Reloading or leaving Learn resets
              it.
            </p>
            {next ? (
              <Button asChild className="mt-6 h-auto min-h-11 whitespace-normal py-3">
                <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                  Next lesson: {next.title}
                </Link>
              </Button>
            ) : (
              <p className="mt-6 font-medium">
                The next lesson is not yet authored. This unit is still in progress.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link to="/learn/units/$unitId" params={{ unitId: unit.id }}>
                  Return to Unit {unitNumber}
                </Link>
              </Button>
              <Button
                variant="secondary"
                disabled={!ready}
                onClick={() =>
                  setSessions((previous) =>
                    updateLessonSession(previous, releaseId, lesson, { type: "restart" }),
                  )
                }
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
                dispatch({ type: explaining || passed ? "continue" : "check" });
              }}
            >
              <ExerciseResponse
                step={step}
                answer={answer}
                disabled={!ready || !!passed}
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
                    ? `mt-5 rounded-control px-4 py-3 text-sm leading-relaxed ${state.feedback.outcome === "incorrect" ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary-ink"}`
                    : "sr-only"
                }
              >
                {state.feedback?.message}
              </div>
              {state.feedback?.outcome === "incorrect" && (
                <p className="mt-3 text-sm text-muted">Change your answer, then check again.</p>
              )}
              <Button
                type="submit"
                className="mt-7 w-full sm:w-auto sm:min-w-40"
                disabled={
                  !ready || (!explaining && !passed && (!answer.trim() || !!state.feedback))
                }
              >
                {explaining || passed
                  ? state.stepIndex === lesson.steps.length - 1
                    ? "Finish lesson"
                    : "Continue"
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
