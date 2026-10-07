import { lazy, Suspense } from "react";

import { checkpointAvailable } from "@/lib/curriculum/checkpoint-access";
import { unitAvailable } from "@/lib/curriculum/unit-access";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLearnSession } from "@/components/learn/session-context";
import { sessionKey } from "@/lib/curriculum/lesson-session";
import { courseLearningAction, unitProgress } from "@/lib/curriculum/unit-progress";
import { germanA1 } from "@/content/curriculum/german-a1";

export const Route = createFileRoute("/learn/")({ component: LearnCourse });
function LearnCourse() {
  const { sessions, blockedLessons, clearedUnits } = useLearnSession();
  const action = courseLearningAction(germanA1, sessions, blockedLessons, clearedUnits);
  const complete = action.complete;
  const first = action.lesson;
  const session = sessions[sessionKey(germanA1.id, first?.id ?? "")];
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-primary-ink">Learn · German A1</p>
        <div className="mt-3 max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            A small sentence.
            <br />A first conversation.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Learn to use German, one practical lesson at a time. Start by introducing yourself.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              {complete
                ? clearedUnits.length
                  ? "Available units cleared"
                  : "Available lesson sequences complete"
                : "Your next lesson"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {complete
                ? clearedUnits.length
                  ? "Available units cleared. Study any lessons optionally. More units are not yet authored."
                  : "All available lessons finished. More units are not yet authored."
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
          {complete && !first && action.unit ? (
            <Button asChild className="h-auto min-h-11 shrink-0 whitespace-normal py-3">
              <Link to="/learn/units/$unitId" params={{ unitId: action.unit.id }}>
                Revisit Unit {germanA1.units.indexOf(action.unit) + 1}
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
            10 units · 40 planned lessons. Twenty lessons are authored across Units 1–5. Explore any
            authored unit. Your recommended path follows lesson completion or challenge clearance.
            Your checked steps and lesson completion are saved.
          </p>
          <ol className="mt-5 divide-y divide-border">
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
              return (
                <li key={unit.id} className="py-5">
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm tabular-nums text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{unit.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {progress.authoredCount > 0
                          ? `${progress.authoredCount} lessons available · ${label}${ahead ? ` · Recommended after Unit ${index}` : ""}`
                          : "4 lessons planned · Not yet authored"}
                      </p>
                    </div>
                  </div>
                  {progress.authoredCount > 0 && ready && (
                    <Link
                      to="/learn/units/$unitId"
                      params={{ unitId: unit.id }}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-control text-sm font-medium text-primary-ink focus-visible:ring-2 focus-visible:ring-focus"
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
