import { checkpointAvailable, checkpoint2Available } from "@/lib/curriculum/checkpoint-access";
import { unitAheadOfPath, unitAvailable } from "@/lib/curriculum/unit-access";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  ClipboardCheck,
  LockKeyhole,
  Info,
  ChevronRight,
} from "lucide-react";
import { lazy, Suspense } from "react";
const UnitCheckEntry = lazy(() =>
  import("@/components/learn/unit-check-entry").then((module) => ({
    default: module.UnitCheckEntry,
  })),
);
import { AppShell } from "@/components/app-shell";
import { useLearnSession } from "@/components/learn/session-context";
import { germanA1 } from "@/content/curriculum/german-a1";
import { assessmentForUnit } from "@/lib/curriculum/assessment-registry";
import { unitProgress } from "@/lib/curriculum/unit-progress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { lessonStatus, sessionKey } from "@/lib/curriculum/lesson-session";

export const Route = createFileRoute("/learn/units/$unitId")({ component: LearnUnit });
function LearnUnit() {
  const { unitId } = Route.useParams();
  const { sessions, blockedLessons, clearedUnits } = useLearnSession();
  const unit = germanA1.units.find((candidate) => candidate.id === unitId);
  const progress = unit ? unitProgress(germanA1, unit, sessions, blockedLessons) : null;
  const next = progress?.nextLesson ?? progress?.repeatLesson;
  const assessment = unit ? assessmentForUnit(unit.id) : undefined;
  const cleared = clearedUnits.includes(unitId);
  const nextUnit =
    unit &&
    germanA1.units
      .slice(germanA1.units.indexOf(unit) + 1)
      .find((candidate) => unitAvailable(candidate.id));
  const number = unit ? germanA1.units.indexOf(unit) + 1 : 0;
  const ahead = unitAheadOfPath(unitId, sessions, blockedLessons, clearedUnits);
  const statusLabel = cleared
    ? "Cleared by challenge"
    : progress?.status === "Unit lessons complete"
      ? "Completed"
      : (progress?.status ?? "Not started");
  return (
    <AppShell learnPresentation>
      <div className="mx-auto max-w-4xl">
        <Link
          to="/learn"
          className="inline-flex min-h-11 items-center gap-2 rounded-control text-sm text-muted focus-visible:ring-2 focus-visible:ring-focus"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Learn overview
        </Link>
        <div className="mt-4 rounded-card border border-primary-ink/10 bg-primary-soft p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-primary-ink">
              German A1 · Unit {number || "—"}
            </span>
            {unit && (
              <span className="rounded-full border border-primary-ink/20 px-3 py-1 text-xs font-medium text-primary-ink">
                {statusLabel}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-serif text-3xl font-medium leading-display tracking-display sm:text-4xl">
            {unit?.title ?? "Unit not found"}
          </h1>
          {unit && (
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {unit.description ?? "This unit is planned. Its lessons are not yet authored."}
            </p>
          )}
          {progress && progress.authoredCount > 0 && (
            <p className="mt-3 text-sm text-primary-ink">
              Lessons finished: {progress.finishedCount} / {progress.total}
            </p>
          )}
          {ahead && (
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <Compass className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              You're studying ahead of your recommended path.
            </p>
          )}
        </div>
        {unit && (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {progress && progress.authoredCount > 0 && (
                <section
                  className={`flex flex-col rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-raised)] sm:p-6 ${!next ? "self-start" : ""}`}
                  aria-label="Unit lesson progress"
                >
                  <span className="mb-4 grid size-11 place-items-center rounded-control bg-primary-soft text-primary-ink">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-xl font-semibold">Learn the unit</h2>
                  <p className="mt-2 text-sm text-muted">{progress.status}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {progress.finishedCount} of {progress.total} lessons finished
                    {progress.status === "Unit lessons complete" &&
                      ". This lesson sequence is finished."}
                  </p>
                  <Progress
                    className="mt-4"
                    label="Unit lesson completion"
                    value={(progress.finishedCount / progress.total) * 100}
                  />
                  {next && (
                    <p className="mb-5 mt-4 text-sm leading-relaxed text-muted">
                      Next lesson: <span className="font-medium text-fg">{next.title}</span>
                    </p>
                  )}
                  {next && (
                    <Button
                      asChild
                      className="mt-auto h-auto min-h-11 w-full whitespace-normal py-3"
                    >
                      <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                        {progress.nextLesson
                          ? progress.status === "Not started"
                            ? "Start Unit"
                            : "Continue Unit"
                          : "Continue practice"}
                        <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </section>
              )}
              {progress && progress.authoredCount > 0 && !!assessment && (
                <section
                  className="flex flex-col rounded-card border border-border bg-surface-2/50 p-5 sm:p-6"
                  aria-label="Unit challenge"
                >
                  <span className="mb-4 grid size-11 place-items-center rounded-control bg-surface text-primary-ink">
                    <ClipboardCheck className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-xl font-semibold">Unit Challenge</h2>
                  <p className="mt-2 font-medium">Test out of this unit</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-muted">
                    <span className="rounded-full border border-border bg-surface px-3 py-1">
                      8 questions
                    </span>
                    <span className="rounded-full border border-border bg-surface px-3 py-1">
                      75% threshold
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    No lesson completion required. Clearance updates your recommended path; it does
                    not mark lessons complete or create Unit Check evidence.
                  </p>
                  {cleared ? (
                    <>
                      <p className="mt-3 font-medium">Cleared by challenge</p>
                      <p className="mt-2 text-sm text-muted">
                        Lessons remain available for optional study.
                      </p>
                      {nextUnit ? (
                        <Button
                          asChild
                          variant="outline"
                          className="mt-4 h-auto min-h-11 whitespace-normal py-3"
                        >
                          <Link to="/learn/units/$unitId" params={{ unitId: nextUnit.id }}>
                            Continue to next available unit
                          </Link>
                        </Button>
                      ) : (
                        <p className="mt-3 text-sm text-muted">More units are not yet authored.</p>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-4 h-auto min-h-11 whitespace-normal py-3"
                      >
                        <Link to="/learn/challenge" search={{ unitId }}>
                          Take Unit Challenge
                        </Link>
                      </Button>
                      <p className="mt-2 text-sm text-muted">
                        At least 75% of answers must meet the requirements (six of eight).
                      </p>
                    </>
                  )}
                </section>
              )}
            </div>
            <section className="mt-8" aria-labelledby="unit-lessons">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="size-5 text-primary-ink" aria-hidden="true" />
                <h2 id="unit-lessons" className="text-xl font-semibold">
                  Lessons in this unit
                </h2>
              </div>
              <ol className="grid gap-3">
                {unit.lessonIds.map((id, index) => {
                  const lesson = germanA1.lessons.find((candidate) => candidate.id === id)!;
                  const status = blockedLessons.includes(id)
                    ? "Saved lesson unavailable"
                    : lessonStatus(germanA1.id, lesson, sessions);
                  const content = (
                    <>
                      <span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary-soft text-sm font-medium tabular-nums text-primary-ink">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{lesson.title}</span>
                        <span className="mt-1 block text-sm text-muted">
                          {status === "Finished" ? "Completed" : status}
                          {status === "Finished" &&
                          sessions[sessionKey(germanA1.id, id)]?.status === "in-progress"
                            ? " · Practicing again"
                            : ""}
                        </span>
                      </span>
                      {lesson.availability === "prototype" &&
                        (status === "Finished" ? (
                          <Check className="size-5 shrink-0 text-primary-ink" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden="true" />
                        ))}
                    </>
                  );
                  return (
                    <li key={id}>
                      {lesson.availability === "prototype" ? (
                        <Link
                          to="/learn/$lessonId"
                          params={{ lessonId: id }}
                          className="flex min-h-12 items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-[var(--elevation-1)] transition-colors hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-focus sm:gap-4"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 rounded-card border border-border bg-surface-2/50 p-4 text-muted">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
            {assessment && progress?.status === "Unit lessons complete" && (
              <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading your check…</p>}>
                <UnitCheckEntry
                  key={assessment.definition.id}
                  assessmentId={assessment.definition.id}
                  unitNumber={number}
                />
              </Suspense>
            )}
            {unitId === "DE.A1.U06" &&
              checkpoint2Available(sessions, blockedLessons, clearedUnits) && (
                <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
                  <CheckpointEntry checkpoint={2} />
                </Suspense>
              )}
            {unitId === "DE.A1.U03" &&
              checkpointAvailable(sessions, blockedLessons, clearedUnits) && (
                <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading checkpoint…</p>}>
                  <CheckpointEntry />
                </Suspense>
              )}
            {assessment && progress?.status !== "Unit lessons complete" && (
              <section
                aria-label="Unit Check unavailable"
                className="mt-6 rounded-card border border-border bg-surface-2/50 p-5 sm:p-6"
              >
                <h2 className="flex items-center gap-2 font-medium">
                  <LockKeyhole className="size-4 text-muted" aria-hidden="true" />
                  Unit Check
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Complete all 4 lessons to unlock the Unit Check.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Challenge clearance does not replace lesson completion.
                </p>
              </section>
            )}
            <p className="mt-6 flex items-start gap-3 rounded-card border border-border bg-surface-2/50 p-4 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Finishing these lessons records practice completion, not mastery or A1 proficiency.
                Open writing stays in the current session and is unassessed.
              </span>
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}

const CheckpointEntry = lazy(() =>
  import("@/components/learn/checkpoint-entry").then((module) => ({
    default: module.CheckpointEntry,
  })),
);
