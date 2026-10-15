import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "./app-shell";
import { Button } from "./ui/button";
import { GrammarDrillRunner } from "./grammar-drill-runner";
import {
  reviewedValencyQuestions,
  type ReviewedExerciseKind,
} from "@/lib/german/reviewed-valency-practice";
import { fetchValencyRemediation, recordValencyRemediation } from "@/lib/grammar-remediation-api";
import { shuffle } from "@/lib/utils";

type Queue = { mistakes: string[]; due: string[] };
export function ValencyPractice({ verb, kind }: { verb?: string; kind?: ReviewedExerciseKind }) {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState(false);
  const [session, setSession] = useState<{
    key: number;
    questions: ReturnType<typeof reviewedValencyQuestions>;
  } | null>(null);
  const questions = reviewedValencyQuestions(verb, kind);
  async function refresh() {
    setError(false);
    try {
      setQueue(await fetchValencyRemediation());
    } catch {
      setError(true);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  function start(ids?: string[]) {
    const pool = ids
      ? questions.filter((q) => ids.includes(q.reviewedValencyItem!.exerciseId))
      : questions;
    if (pool.length)
      setSession({
        key: Date.now(),
        questions: shuffle(pool).map((q) => ({ ...q, options: shuffle(q.options) })),
      });
  }
  if (session)
    return (
      <GrammarDrillRunner<number>
        key={session.key}
        mode="Verb patterns"
        trackProgress={false}
        fetchSample={() => Promise.resolve([1])}
        buildRound={() => session.questions}
        onExit={() => {
          setSession(null);
          void refresh();
        }}
        onAnswer={async (question, answer, operationId) => {
          const result = await recordValencyRemediation({
            data: { operationId, selection: question.reviewedValencyItem!, answer },
          });
          if (!result.ok) throw new Error(result.error);
        }}
      />
    );
  const count = (ids: string[] | undefined) =>
    questions.filter((q) => ids?.includes(q.reviewedValencyItem!.exerciseId)).length;
  return (
    <AppShell>
      <section className="mx-auto max-w-2xl space-y-5 px-4 py-8" aria-label="Verb pattern practice">
        <h1 className="font-display text-3xl font-medium">
          Verb patterns{verb ? ` · ${verb}` : ""}
        </h1>
        <p className="text-muted">
          Choose the case for one marked target in a fixed meaning. Reflexive forms and other
          arguments stay in the sentence. These items have no source CEFR rating and do not count as
          independent mastery.
        </p>
        <nav className="flex flex-wrap gap-2" aria-label="Exercise type">
          <Button asChild variant="outline">
            <Link
              to="/grammar/pronomen"
              search={{ practice: "reviewed", verb, kind: "personal_pronoun_case" }}
            >
              Pronouns
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              to="/grammar/pronomen"
              search={{ practice: "reviewed", verb, kind: "determiner_case" }}
            >
              Articles
            </Link>
          </Button>
        </nav>
        <p>
          {questions.length} exercises ·{" "}
          {new Set(questions.map((q) => q.reviewedValencyItem!.lemma)).size} verbs
        </p>
        {questions.length ? (
          <Button onClick={() => start()}>Start practice</Button>
        ) : (
          <p>No reviewed exercises for this selection.</p>
        )}
        <div className="rounded-card bg-surface p-4 space-y-3">
          <h2 className="font-display text-xl">Practise again</h2>
          {error ? (
            <div role="alert">
              <p>Review history could not be loaded. It has not been cleared.</p>
              <Button variant="outline" onClick={() => void refresh()}>
                Reload review history
              </Button>
            </div>
          ) : !queue ? (
            <p role="status">Loading review history…</p>
          ) : (
            <>
              <p>
                {count(queue.mistakes)} mistakes · {count(queue.due)} due for spaced review
              </p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={!count(queue.mistakes)} onClick={() => start(queue.mistakes)}>
                  Review mistakes
                </Button>
                <Button
                  variant="outline"
                  disabled={!count(queue.due)}
                  onClick={() => start(queue.due)}
                >
                  Due review
                </Button>
              </div>
              {!count(queue.mistakes) && (
                <p className="text-sm text-muted">No saved mistakes in this selection.</p>
              )}
            </>
          )}
          <p className="text-sm text-muted">
            A correct retry removes the item from mistakes. Spaced review becomes due after 24
            hours. Repeating a fixed question does not establish transfer.
          </p>
        </div>
        <Link
          className="tap-target inline-flex items-center text-primary-ink underline"
          to="/grammar/rules"
        >
          Grammar Reference · meanings and sources
        </Link>
      </section>
    </AppShell>
  );
}
