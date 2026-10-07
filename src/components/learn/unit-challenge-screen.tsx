import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckpointEntry } from "./checkpoint-entry";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { germanA1 } from "@/content/curriculum/german-a1";
import { COURSE_SCOPE } from "@/lib/curriculum/course-progress-session";
import type { ChallengeView } from "@/lib/curriculum/challenge";
import {
  getUnitChallenge,
  startUnitChallenge,
  finishUnitChallenge,
} from "@/lib/curriculum/challenge-api";
import { useLearnSession } from "./session-context";

export function UnitChallengeScreen({ unitId }: { unitId: string }) {
  const { clearUnit } = useLearnSession();
  const unit = germanA1.units.find((candidate) => candidate.id === unitId);
  const scope = { ...COURSE_SCOPE, unitId };
  const [view, setView] = useState<ChallengeView | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const taskHeading = useRef<HTMLHeadingElement>(null);
  const taskId = view?.items[index]?.id;
  useEffect(() => {
    taskHeading.current?.focus();
  }, [taskId]);
  const startId = useRef<string | null>(null);
  const submission = useRef<Parameters<typeof finishUnitChallenge>[0] | null>(null);
  const loadRequest = useRef<Promise<ChallengeView> | null>(null);
  async function load() {
    setError("");
    try {
      setView(await getUnitChallenge({ data: scope }));
    } catch {
      setError("Your challenge couldn’t load. Retry loading.");
    }
  }
  useEffect(() => {
    let active = true;
    loadRequest.current ??= getUnitChallenge({ data: { ...COURSE_SCOPE, unitId } });
    void loadRequest.current
      .then((result) => {
        if (active) setView(result);
      })
      .catch(() => {
        if (active) setError("Your challenge couldn’t load. Retry loading.");
      });
    return () => {
      active = false;
    };
  }, [unitId]);
  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    startId.current ??= crypto.randomUUID();
    try {
      const result = await startUnitChallenge({ data: { ...scope, attemptId: startId.current } });
      setView(result);
      setAnswers({});
      setIndex(0);
      submission.current = null;
    } catch {
      setError("The challenge couldn’t start. Try again to resume safely.");
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (busy || !view?.attempt) return;
    setBusy(true);
    setError("");
    submission.current ??= {
      data: {
        ...scope,
        attemptId: view.attempt.attemptId,
        responses: view.items.map((item) => ({
          itemId: item.id,
          response: answers[item.id] ?? "",
        })),
      },
    };
    try {
      const result = await finishUnitChallenge(submission.current);
      setView(result);
      if (result.summary.clearedAt !== null) clearUnit(unitId);
      setAnswers({});
      submission.current = null;
    } catch {
      setError("Your result hasn’t been confirmed. Retry submission with the same answers.");
    } finally {
      setBusy(false);
    }
  }
  const cleared = view?.summary.clearedAt !== null && view?.summary.clearedAt !== undefined;
  const failed = view?.attempt?.status === "submitted" && !cleared;
  const retryAfter = view?.summary.retryAfter;
  const retryAllowed = !retryAfter || (view?.serverNow ?? 0) >= retryAfter;
  const item = view?.items[index];
  const nextUnit =
    unit &&
    germanA1.units
      .slice(germanA1.units.indexOf(unit) + 1)
      .find((candidate) =>
        candidate.lessonIds.some((id) =>
          germanA1.lessons.some(
            (lesson) => lesson.id === id && lesson.availability === "prototype",
          ),
        ),
      );
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          to="/learn/units/$unitId"
          params={{ unitId }}
          className="inline-flex min-h-11 items-center text-sm text-primary-ink"
        >
          Back to unit
        </Link>
        <p className="mt-5 text-sm text-muted">German A1 · Unit challenge</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          {unit?.title ?? "Unit challenge"}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          Eight independent tasks. Answer at least 75% correctly (six of eight) to clear this unit
          for progression. Your lessons stay available for optional study.
        </p>
        {error && (
          <div role="alert" className="mt-5">
            <p>{error}</p>
            {!view && (
              <Button className="mt-3" onClick={() => void load()}>
                Retry loading
              </Button>
            )}
          </div>
        )}
        {!view && !error && (
          <p className="mt-6" role="status">
            Loading your challenge…
          </p>
        )}
        {cleared ? (
          <section className="mt-7 border-t border-border pt-6">
            <h2 className="text-xl font-semibold">Cleared by challenge</h2>
            <p className="mt-3 text-muted">
              Your challenge result is saved. Lesson completion and Unit Check evidence remain
              separate.
            </p>
            {nextUnit ? (
              <Button asChild className="mt-5 h-auto min-h-11 whitespace-normal py-3">
                <Link to="/learn/units/$unitId" params={{ unitId: nextUnit.id }}>
                  Continue to next available unit
                </Link>
              </Button>
            ) : (
              <p className="mt-5">
                You’ve cleared the last available unit. More units are not yet authored.
              </p>
            )}
            {unitId === "DE.A1.U03" && <CheckpointEntry />}
            <Link
              to="/learn/units/$unitId"
              params={{ unitId }}
              className="mt-4 block min-h-11 py-3 text-primary-ink"
            >
              Study these lessons optionally
            </Link>
          </section>
        ) : item ? (
          <section className="mt-7 border-t border-border pt-6" aria-label="Challenge task">
            <p className="text-sm text-muted">
              Task {index + 1} of 8 · {item.outcome}
            </p>
            <h2
              ref={taskHeading}
              tabIndex={-1}
              className="mt-3 scroll-mt-24 text-xl font-medium outline-none"
            >
              {item.prompt}
            </h2>
            {item.stimulus && (
              <p lang="de" className="mt-4 whitespace-pre-line rounded-control bg-surface-2 p-4">
                {item.stimulus}
              </p>
            )}
            {item.options ? (
              <fieldset disabled={busy || !!submission.current} className="mt-5 space-y-2">
                <legend className="sr-only">Choose your answer</legend>
                {item.options.map((option) => (
                  <label
                    key={option}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-control border border-border p-3"
                  >
                    <input
                      type="radio"
                      name={item.id}
                      value={option}
                      checked={answers[item.id] === option}
                      onChange={() =>
                        setAnswers((previous) => ({ ...previous, [item.id]: option }))
                      }
                    />
                    <span lang="de">{option}</span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <label className="mt-5 block">
                Your answer
                <input
                  lang="de"
                  autoComplete="off"
                  maxLength={160}
                  disabled={busy || !!submission.current}
                  className="mt-2 block min-h-12 w-full rounded-control border border-border bg-surface px-3 text-base focus-visible:ring-2 focus-visible:ring-focus"
                  value={answers[item.id] ?? ""}
                  onChange={(event) =>
                    setAnswers((previous) => ({ ...previous, [item.id]: event.target.value }))
                  }
                />
              </label>
            )}
            <p className="mt-3 text-sm text-muted">
              German keyboard fallbacks ae, oe, ue and ss are accepted. Answers stay in this page
              until submission; refreshing clears unfinished answers. No hints or answer key are
              shown.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {index > 0 && (
                <Button
                  variant="outline"
                  disabled={busy || !!submission.current}
                  onClick={() => setIndex(index - 1)}
                >
                  Previous task
                </Button>
              )}
              {index < 7 ? (
                <Button
                  disabled={!answers[item.id]?.trim() || busy}
                  onClick={() => setIndex(index + 1)}
                >
                  Next task
                </Button>
              ) : (
                <Button
                  disabled={busy || view?.items.some((task) => !answers[task.id]?.trim())}
                  onClick={() => void submit()}
                >
                  {busy
                    ? "Saving result…"
                    : submission.current
                      ? "Retry submission"
                      : "Submit challenge"}
                </Button>
              )}
            </div>
          </section>
        ) : (
          view && (
            <section className="mt-7 border-t border-border pt-6">
              {failed && (
                <>
                  <h2 className="text-xl font-semibold">Review these lessons</h2>
                  <p className="mt-3 text-muted">
                    {view.attempt?.correctCount} of 8 answers met the challenge requirements. Study
                    the unit’s major outcomes before trying another form. Individual answers are not
                    revealed.
                  </p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link to="/learn/units/$unitId" params={{ unitId }}>
                      Review these lessons
                    </Link>
                  </Button>
                  <h3 className="mt-5 font-medium">Try again later</h3>
                  {retryAfter && (
                    <p className="mt-2 text-sm text-muted">
                      A new form is available after {new Date(retryAfter).toLocaleString()}. Reload
                      this page when you’re ready.
                    </p>
                  )}
                </>
              )}
              {!failed && (
                <p className="text-muted">
                  You can study first or challenge this unit now. A failed attempt leaves lessons
                  available and allows another attempt after 24 hours.
                </p>
              )}
              {retryAllowed && (
                <Button className="mt-5" disabled={busy} onClick={() => void start()}>
                  {busy ? "Starting…" : "Start unit challenge"}
                </Button>
              )}
            </section>
          )
        )}
      </div>
    </AppShell>
  );
}
