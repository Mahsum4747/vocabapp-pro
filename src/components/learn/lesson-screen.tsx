import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input, Textarea } from "@/components/ui/input";
import { startLesson, transitionLesson, type LessonAction } from "@/lib/curriculum/lesson-session";
import type { LessonDefinition } from "@/lib/curriculum/types";
import { useLearnSession } from "./session-context";

export function LessonScreen({
  releaseId,
  lesson,
}: {
  releaseId: string;
  lesson: LessonDefinition;
}) {
  const { session, setSession } = useLearnSession();
  // SSR can render a form before its handlers hydrate. Prevent native submission
  // from reloading the page and destroying the in-memory prototype session.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
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
    setSession((previous) =>
      transitionLesson(
        lesson,
        previous?.lessonId === lesson.id && previous.releaseId === releaseId
          ? previous
          : startLesson(releaseId, lesson),
        action,
      ),
    );
  }
  const explaining = step.kind === "explanation";
  const complete = state.status === "finished";
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border pt-safe-top">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-page-safe py-4">
          <Link
            to="/learn"
            className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm font-medium text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Learn
          </Link>
          <p className="text-sm text-muted">German A1 · Unit 1</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-page-safe pt-8 pb-section-safe sm:pt-12">
        <p className="text-sm font-medium text-primary-ink">
          {complete
            ? "Lesson finished · Session only"
            : `Lesson 1 · Step ${state.stepIndex + 1} of ${lesson.steps.length}`}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Introduce yourself with one simple German sentence.
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
              You finished your first lesson.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              You practiced a short introduction, recalled a verb form and built a sentence. Your
              original response was not assessed. This lesson milestone does not establish skill
              mastery or A1 proficiency.
            </p>
            <p className="mt-4 text-sm text-muted">
              This progress stays only while you remain in Learn. Reloading or leaving Learn resets
              it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link to="/learn">Return to Learn</Link>
              </Button>
              <Button
                variant="secondary"
                disabled={!ready}
                onClick={() => setSession(startLesson(releaseId, lesson))}
              >
                Practice lesson again
              </Button>
            </div>
          </section>
        ) : (
          <section className="mt-8 sm:mt-10" aria-labelledby="lesson-task">
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
                className="mt-6 whitespace-pre-line border-l-2 border-primary pl-5 text-xl leading-relaxed"
              >
                {step.example}
              </blockquote>
            )}
            {step.explanation && (
              <p className="mt-5 whitespace-pre-line leading-relaxed text-muted">
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
              {step.kind === "choice" && (
                <fieldset disabled={!ready || !!passed}>
                  <legend className="sr-only">Choose a German sentence</legend>
                  <div className="space-y-3">
                    {step.options.map((option) => (
                      <label
                        key={option}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-control border px-4 py-3 ${answer === option ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-surface text-fg"}`}
                      >
                        <input
                          type="radio"
                          name={step.id}
                          value={option}
                          checked={answer === option}
                          onChange={() => dispatch({ type: "respond", value: option })}
                          className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                        />
                        <span lang="de">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {(step.kind === "text" || step.kind === "original") && (
                <div>
                  <label htmlFor="lesson-answer" className="mb-2 block text-sm font-medium">
                    {step.inputLabel}
                  </label>
                  {step.kind === "original" ? (
                    <Textarea
                      id="lesson-answer"
                      lang="de"
                      value={answer}
                      onChange={(event) => dispatch({ type: "respond", value: event.target.value })}
                      maxLength={step.maxLength}
                      disabled={!ready || !!passed}
                      aria-describedby="response-help lesson-feedback"
                      autoComplete="off"
                    />
                  ) : (
                    <Input
                      id="lesson-answer"
                      lang="de"
                      value={answer}
                      onChange={(event) => dispatch({ type: "respond", value: event.target.value })}
                      maxLength={160}
                      disabled={!ready || !!passed}
                      aria-describedby="lesson-feedback"
                      aria-invalid={state.feedback?.outcome === "incorrect"}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  )}
                  {step.kind === "original" && (
                    <p id="response-help" className="mt-2 text-sm text-muted">
                      One short sentence · {answer.length}/{step.maxLength} characters · Unassessed
                    </p>
                  )}
                </div>
              )}
              <div
                id="lesson-feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={
                  state.feedback
                    ? `mt-5 rounded-control p-4 text-sm leading-relaxed ${state.feedback.outcome === "incorrect" ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary-ink"}`
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
            <p className="mt-7 text-sm leading-relaxed text-muted">
              Unpublished lesson prototype · Progress is session only.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
