import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
const UnitCheckEntry = lazy(() =>
  import("@/components/learn/unit-check-entry").then((module) => ({
    default: module.UnitCheckEntry,
  })),
);
import { AppShell } from "@/components/app-shell";
import { useLearnSession } from "@/components/learn/session-context";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unitProgress } from "@/lib/curriculum/unit-progress";
import { Button } from "@/components/ui/button";
import { lessonStatus, sessionKey } from "@/lib/curriculum/lesson-session";

export const Route = createFileRoute("/learn/units/$unitId")({ component: LearnUnit });
function LearnUnit() {
  const { unitId } = Route.useParams();
  const { sessions, blockedLessons } = useLearnSession();
  const unit = germanA1.units.find((candidate) => candidate.id === unitId);
  const progress = unit ? unitProgress(germanA1, unit, sessions, blockedLessons) : null;
  const next = progress?.nextLesson ?? progress?.repeatLesson;
  const number = unit ? germanA1.units.indexOf(unit) + 1 : 0;
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/learn"
          className="inline-flex min-h-11 items-center gap-2 rounded-control text-sm text-muted focus-visible:ring-2 focus-visible:ring-focus"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Learn overview
        </Link>
        <p className="mt-5 text-sm font-medium text-primary-ink">
          German A1 · Unit {number || "—"}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {unit?.title ?? "Unit not found"}
        </h1>
        {unit && (
          <>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {number === 1
                ? "Introduce yourself, name people and things, ask for details, and give basic information."
                : "This unit is planned. Its lessons are not yet authored."}
            </p>
            {progress && progress.authoredCount > 0 && (
              <section
                className="mt-6 border-t border-border pt-5"
                aria-label="Unit lesson progress"
              >
                <p className="font-medium">{progress.status}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {progress.finishedCount} of {progress.total} lessons finished
                  {progress.status === "Unit lessons complete" && ". Unit 2 is not yet available."}
                </p>
                {next && (
                  <Button asChild className="mt-4 h-auto min-h-11 whitespace-normal py-3">
                    <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                      {progress.nextLesson ? "Next lesson" : "Continue practice"}: {next.title}
                      <ArrowRight />
                    </Link>
                  </Button>
                )}
              </section>
            )}
            {number === 1 && progress?.status === "Unit lessons complete" && (
              <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading your check…</p>}>
                <UnitCheckEntry />
              </Suspense>
            )}
            <ol className="mt-7 divide-y divide-border border-y border-border">
              {unit.lessonIds.map((id, index) => {
                const lesson = germanA1.lessons.find((candidate) => candidate.id === id)!;
                const status = blockedLessons.includes(id)
                  ? "Saved lesson unavailable"
                  : lessonStatus(germanA1.id, lesson, sessions);
                const content = (
                  <>
                    <span className="text-sm tabular-nums text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{lesson.title}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {status}
                        {status === "Finished" &&
                        sessions[sessionKey(germanA1.id, id)]?.status === "in-progress"
                          ? " · Practicing again"
                          : ""}
                      </span>
                    </span>
                    {lesson.availability === "prototype" && (
                      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                    )}
                  </>
                );
                return (
                  <li key={id}>
                    {lesson.availability === "prototype" ? (
                      <Link
                        to="/learn/$lessonId"
                        params={{ lessonId: id }}
                        className="flex min-h-12 items-center gap-4 rounded-control py-5 focus-visible:ring-2 focus-visible:ring-focus hover:text-primary-ink"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 py-5 text-muted">{content}</div>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Finishing these lessons records practice completion, not mastery or A1 proficiency.
              Open writing stays in the current session and is unassessed.
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}
