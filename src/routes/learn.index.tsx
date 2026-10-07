import { CP3_ID } from "@/lib/curriculum/checkpoint-identity";
import { lazy, Suspense } from "react";

import {
  checkpointAvailable,
  checkpoint2Available,
  checkpoint3Available,
} from "@/lib/curriculum/checkpoint-access";
import { unitAvailable } from "@/lib/curriculum/unit-access";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Compass,
  MessageCircle,
  Users,
  ShoppingBag,
  Clock,
  MapPin,
  Layers,
  Play,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLearnSession } from "@/components/learn/session-context";
import { sessionKey } from "@/lib/curriculum/lesson-session";
import { courseLearningAction, unitProgress } from "@/lib/curriculum/unit-progress";
import { germanA1 } from "@/content/curriculum/german-a1";

const unitIcons = [MessageCircle, Users, ShoppingBag, Clock, MapPin];

export const Route = createFileRoute("/learn/")({ component: LearnCourse });
function LearnCourse() {
  const { sessions, blockedLessons, clearedUnits } = useLearnSession();
  const action = courseLearningAction(germanA1, sessions, blockedLessons, clearedUnits);
  const complete = action.complete;
  const first = action.lesson;
  const session = sessions[sessionKey(germanA1.id, first?.id ?? "")];
  const nextProgress = action.unit
    ? unitProgress(germanA1, action.unit, sessions, blockedLessons)
    : null;
  const acknowledgedSteps = session?.completedStepIds.length ?? 0;
  const lessonSteps = first?.steps.length ?? 0;
  return (
    <AppShell learnPresentation>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-card border border-primary-ink/10 bg-primary-soft px-5 py-7 sm:px-8 sm:py-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-ink/15 bg-surface px-3 py-1.5 text-xs font-semibold text-primary-ink">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Learn · German A1
          </p>
          <div className="mt-5 max-w-2xl">
            <h1 className="font-serif text-4xl font-medium leading-display tracking-display sm:text-5xl">
              A small sentence.
              <br />A first conversation.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Learn to use German, one practical lesson at a time. Start by introducing yourself.
            </p>
          </div>
        </div>
        <section
          aria-label="Recommended learning action"
          className="relative mt-5 rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-raised)] sm:p-7"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-ink">
              <Play className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-ink">
                {complete
                  ? clearedUnits.length
                    ? "Available units cleared"
                    : "Available lesson sequences complete"
                  : "Your next lesson"}
              </p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug sm:text-2xl">
                {complete
                  ? clearedUnits.length
                    ? "Available units cleared. Continue to the final text portfolio; missing lessons and Checks remain separate."
                    : "All lessons finished. Continue to the final text portfolio."
                  : (first?.title ?? "Saved lessons are currently unavailable")}
              </p>
              {!complete && action.unit && (
                <p className="mt-2 text-sm text-primary-ink">
                  Unit {germanA1.units.indexOf(action.unit) + 1} · {action.unit.title}
                </p>
              )}
              {session?.status === "finished" && (
                <p className="mt-2 text-sm text-primary-ink">Lesson finished</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1 sm:max-w-sm">
              <p className="mb-2 text-sm text-muted">
                {first
                  ? `${acknowledgedSteps} of ${lessonSteps} lesson steps saved`
                  : `${nextProgress?.finishedCount ?? 0} of ${nextProgress?.total ?? 4} lessons finished`}
              </p>
              <Progress
                label={first ? "Saved lesson steps" : "Historical lesson completion"}
                value={
                  first && lessonSteps
                    ? (acknowledgedSteps / lessonSteps) * 100
                    : nextProgress
                      ? (nextProgress.finishedCount / nextProgress.total) * 100
                      : 0
                }
              />
            </div>
            {complete && !first && action.unit ? (
              <Button asChild className="h-auto min-h-11 shrink-0 whitespace-normal py-3">
                <Link to="/learn/check" search={{ assessment: CP3_ID }}>
                  Continue to final portfolio
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              first && (
                <Button asChild className="h-auto min-h-11 shrink-0 whitespace-normal py-3">
                  <Link to="/learn/$lessonId" params={{ lessonId: first.id }}>
                    {complete ? "Continue practice" : session ? "Continue lesson" : "Start lesson"}
                    <ArrowRight />
                  </Link>
                </Button>
              )
            )}
          </div>
        </section>
        {checkpoint3Available(sessions, blockedLessons, clearedUnits) && (
          <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading portfolio…</p>}>
            <CheckpointEntry checkpoint={3} />
          </Suspense>
        )}
        {checkpoint2Available(sessions, blockedLessons, clearedUnits) && (
          <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
            <CheckpointEntry checkpoint={2} />
          </Suspense>
        )}
        {checkpointAvailable(sessions, blockedLessons, clearedUnits) && (
          <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
            <CheckpointEntry />
          </Suspense>
        )}
        <section className="mt-9" aria-labelledby="course-units">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary-ink" aria-hidden="true" />
            <h2 id="course-units" className="text-xl font-semibold">
              The course ahead
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            10 units · 40 authored lessons across Units 1–10. Explore any authored unit. Your
            recommended path follows lesson completion or challenge clearance. Your checked steps
            and lesson completion are saved.
          </p>
          <ol className="mt-5 grid gap-3 lg:grid-cols-2">
            {germanA1.units.map((unit, index) => {
              const progress = unitProgress(germanA1, unit, sessions, blockedLessons);
              const ready = unitAvailable(unit.id);
              const recommended = !action.complete && action.unit?.id === unit.id;
              const ahead =
                !action.complete && !!action.unit && index > germanA1.units.indexOf(action.unit);
              const label = clearedUnits.includes(unit.id)
                ? "Cleared by challenge"
                : progress.status === "Unit lessons complete"
                  ? "Completed"
                  : recommended
                    ? "Recommended"
                    : "Available to explore";
              const Icon = unitIcons[index] ?? Layers;
              return (
                <li
                  key={unit.id}
                  data-unit={unit.id}
                  className={
                    ready
                      ? "group flex flex-col rounded-card border border-border bg-surface p-4 shadow-[var(--elevation-1)] transition-shadow hover:shadow-[var(--elevation-2)] sm:p-5"
                      : "rounded-card border border-border/70 bg-surface-2/50 p-4 sm:p-5"
                  }
                >
                  <div className="mb-4 flex items-start gap-3 sm:gap-4">
                    <span
                      className={
                        ready
                          ? "grid size-11 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-ink"
                          : "grid size-11 shrink-0 place-items-center rounded-control bg-surface-2 text-muted"
                      }
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Unit {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
                        {unit.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {ready
                          ? `${progress.authoredCount} lessons available`
                          : "4 lessons planned"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={
                            ready &&
                            (recommended ||
                              label === "Completed" ||
                              label === "Cleared by challenge")
                              ? "inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-ink"
                              : "inline-flex max-w-full items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted"
                          }
                        >
                          {recommended && (
                            <Compass className="size-3.5 shrink-0" aria-hidden="true" />
                          )}
                          {(label === "Completed" || label === "Cleared by challenge") && ready && (
                            <Check className="size-3.5 shrink-0" aria-hidden="true" />
                          )}
                          {ready ? label : "Not yet authored"}
                        </span>
                        {ready && progress.status === "In progress" && (
                          <span className="text-xs text-muted">
                            In progress · {progress.finishedCount}/4 lessons finished
                          </span>
                        )}
                      </div>
                      {ready && ahead && (
                        <p className="mt-2 text-xs text-muted">Recommended after Unit {index}</p>
                      )}
                    </div>
                  </div>
                  {progress.authoredCount > 0 && ready && (
                    <Link
                      to="/learn/units/$unitId"
                      params={{ unitId: unit.id }}
                      className="mt-auto inline-flex w-full min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-3 text-sm font-medium text-primary-ink transition-colors hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-focus sm:w-fit"
                    >
                      Open Unit {index + 1}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Lesson completion is a learning milestone, not skill mastery or full A1 proficiency.
          Listening and speaking are outside this prototype.
        </p>
      </div>
    </AppShell>
  );
}

const CheckpointEntry = lazy(() =>
  import("@/components/learn/checkpoint-entry").then((module) => ({
    default: module.CheckpointEntry,
  })),
);
