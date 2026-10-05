import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLearnSession } from "@/components/learn/session-context";
import { germanA1 } from "@/content/curriculum/german-a1";

export const Route = createFileRoute("/learn/")({ component: LearnCourse });
function LearnCourse() {
  const { session } = useLearnSession();
  const first = germanA1.lessons[0];
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
            <p className="font-medium">Your first lesson</p>
            <p className="mt-1 text-sm text-muted">{first.title}</p>
            {session?.status === "finished" && (
              <p className="mt-2 text-sm text-primary-ink">Lesson finished in this session</p>
            )}
          </div>
          <Button asChild className="shrink-0">
            <Link to="/learn/$lessonId" params={{ lessonId: first.id }}>
              {session?.status === "finished"
                ? "View finished lesson"
                : session
                  ? "Continue lesson"
                  : "Start lesson"}
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <section className="mt-9" aria-labelledby="course-units">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary-ink" aria-hidden="true" />
            <h2 id="course-units" className="text-xl font-semibold">
              The course ahead
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            10 units · 40 planned lessons. This is an unpublished prototype: only the first lesson
            is available. Progress lasts while you stay in Learn and resets on reload or leaving
            Learn.
          </p>
          <ol className="mt-5 divide-y divide-border">
            {germanA1.units.map((unit, index) => (
              <li key={unit.id} className="py-5">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{unit.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {index === 0
                        ? "1 prototype lesson available · 3 not yet authored"
                        : "4 lessons planned · Not yet authored"}
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <ul className="mt-4 space-y-2 sm:ml-8">
                    {unit.lessonIds.map((id) => {
                      const lesson = germanA1.lessons.find((l) => l.id === id)!;
                      return (
                        <li key={id}>
                          {lesson.availability === "prototype" ? (
                            <Link
                              to="/learn/$lessonId"
                              params={{ lessonId: id }}
                              className="flex min-h-11 items-center justify-between gap-3 rounded-control bg-primary-soft px-3 py-3 text-sm font-medium text-primary-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            >
                              {lesson.title}
                              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                            </Link>
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted">
                              {lesson.title}
                              <span className="mt-1 block text-xs">Not yet authored</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
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
