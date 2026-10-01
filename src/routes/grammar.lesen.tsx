import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { LesenChoiceBoard } from "@/components/lesen-choice";
import { LesenMatchBoard, LesenSentenceInsertionBoard } from "@/components/lesen-match";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { LESEN_PASSAGES } from "@/lib/german/lesen-data";
import type { LesenLevel, LesenPassage } from "@/lib/german/lesen-types";
import { recordGrammarRoundResult } from "@/lib/grammar-progress";
import { getLesenPassageProgress, recordLesenPassageCompletion } from "@/lib/lesen-passage-progress";
import type { LesenPassageProgressDoc } from "@/lib/lesen-passage-progress";

export const Route = createFileRoute("/grammar/lesen")({
  component: LesenRoute,
});

const LEVELS: LesenLevel[] = ["A1", "A2", "B1", "B2"];

const TOTAL_PER_LEVEL: Record<LesenLevel, number> = {
  A1: LESEN_PASSAGES.filter((p) => p.level === "A1").length,
  A2: LESEN_PASSAGES.filter((p) => p.level === "A2").length,
  B1: LESEN_PASSAGES.filter((p) => p.level === "B1").length,
  B2: LESEN_PASSAGES.filter((p) => p.level === "B2").length,
};

/**
 * Reading comprehension: one bundled passage per round (lesen-data.ts +
 * lesen-data-b1-b2.ts — real exam content, CC BY 4.0, see
 * LESEN-ATTRIBUTION.md), covering all four levels and the source's three
 * underlying exercise shapes:
 * - "choice": A1/A2 richtig-falsch/multiple-choice, B1's three close-ended
 *   types — `LesenChoiceBoard` (also reused, unchanged, by
 *   grammar.lesen-paste.tsx's AI-generated passages).
 * - "matching" / "sentence-insertion" (B1/B2 only): real drag-and-drop via
 *   dnd-kit — see lesen-match.tsx.
 *
 * `grammarProgress` topicId: everything here, at every level, still writes
 * under the single fixed "lesen" topicId — NOT split per level. Reasoning:
 * grammarProgress is one accuracy/totalAttempts scalar per topicId, and
 * the grammar hub has exactly one "Lesen" tile, not one per level.
 *
 * Per-level PASSAGE completion (which of this level's bundled passages has
 * the learner already finished) is a separate concern, tracked in its own
 * `lesenProgress/{uid}` doc (lesen-passage-progress.ts) — written
 * alongside, never instead of, the `grammarProgress` write. `pickPassage`
 * reads it back to lightly prefer not-yet-completed passages over an
 * already-seen one, without ever fully excluding the completed pool (once
 * everything is done, or by chance before then, a repeat is still fine —
 * see `pickPassage`'s own comment).
 */
function LesenRoute() {
  return (
    <AuthGate>
      <LesenPage />
    </AuthGate>
  );
}

/** Light preference for a not-yet-completed passage (tends to surface
 *  every passage in the pool at least once before repeating), but never a
 *  hard guarantee — occasionally still draws from the whole pool even
 *  when uncompleted ones remain, both for natural variety and so this
 *  never turns into a deterministic "exactly in this order" checklist. */
function pickPassage(level: LesenLevel, completedIds: string[]): LesenPassage {
  const pool = LESEN_PASSAGES.filter((p) => p.level === level);
  const completedSet = new Set(completedIds);
  const uncompleted = pool.filter((p) => !completedSet.has(p.id));
  const source = uncompleted.length > 0 && Math.random() < 0.85 ? uncompleted : pool;
  return source[Math.floor(Math.random() * source.length)]!;
}

function LesenPage() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<LesenLevel | null>(null);
  const [passage, setPassage] = useState<LesenPassage | null>(null);
  const [progressDoc, setProgressDoc] = useState<LesenPassageProgressDoc>({});

  const [done, setDone] = useState(false);
  const [resultCorrect, setResultCorrect] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);

  useEffect(() => {
    getLesenPassageProgress()
      .then(setProgressDoc)
      .catch(() => {});
  }, []);

  // The level-picker screen and an active round/result both render via
  // `StudyChrome` (through `StudySessionShell`), which by default always
  // points its back arrow at "/" (library home) — correct for a mode tied
  // to one set, wrong here: Lesen has its OWN internal "step back" (an
  // active passage -> the level picker), and skipping straight to app Home
  // from either state was reported as a bug. One step at a time instead:
  // mid-round (or on the result screen) back to the level picker; from the
  // level picker itself, back to the Grammar hub it was opened from.
  function backOneStep() {
    if (level) {
      setLevel(null);
      setPassage(null);
      setDone(false);
    } else {
      void navigate({ to: "/grammar" });
    }
  }

  function start(chosenLevel: LesenLevel) {
    setLevel(chosenLevel);
    setPassage(pickPassage(chosenLevel, progressDoc[chosenLevel]?.completedPassageIds ?? []));
    setDone(false);
  }

  function finishRound(correctCount: number, total: number) {
    setResultCorrect(correctCount);
    setResultTotal(total);
    setDone(true);
    // Two independent writes, both fire-and-forget, both one-per-round
    // (never per question) — see each helper's own doc comment. A failed
    // write here must never block or degrade the (purely session-local)
    // score screen.
    void recordGrammarRoundResult({
      data: { topicId: "lesen", correctInRound: correctCount, totalInRound: total },
    }).catch(() => {});
    if (passage && level) {
      recordLesenPassageCompletion({ data: { level, passageId: passage.id } })
        .then(({ completedPassageIds }) => {
          setProgressDoc((prev) => ({
            ...prev,
            [level]: { completedPassageIds, lastPracticedAt: Date.now() },
          }));
        })
        .catch(() => {});
    }
  }

  if (!level || !passage) {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={0} onBack={backOneStep}>
        <p className="text-sm text-muted">
          Short German reading passages with real comprehension questions — pick a level to start.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {LEVELS.map((lvl) => {
            const completedCount = progressDoc[lvl]?.completedPassageIds.length ?? 0;
            const total = TOTAL_PER_LEVEL[lvl];
            return (
              <Button
                key={lvl}
                onClick={() => start(lvl)}
                variant={lvl === "A1" ? "default" : "outline"}
                className="justify-between"
              >
                <span>Start {lvl}</span>
                <span className="text-xs font-normal tabular-nums opacity-80">
                  {completedCount}/{total} completed
                </span>
              </Button>
            );
          })}
        </div>
        <Button asChild variant="ghost" className="mt-4 w-full">
          <Link to="/grammar/lesen-paste">Practice your own topic (AI-generated)</Link>
        </Button>
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((resultCorrect / resultTotal) * 100);
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={resultTotal} total={resultTotal} onBack={backOneStep}>
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{pct}%</p>
          <p className="mt-2 text-sm text-muted">
            {resultCorrect} / {resultTotal} correct
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => start(level)}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/grammar">Back to Grammar</Link>
            </Button>
          </div>
        </div>
      </StudySessionShell>
    );
  }

  if (passage.kind === "matching") {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={1} onBack={backOneStep}>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium text-subtle">
            {passage.title} · {passage.source}
          </p>
          <LesenMatchBoard key={passage.id} passage={passage} onComplete={finishRound} />
        </div>
      </StudySessionShell>
    );
  }

  if (passage.kind === "sentence-insertion") {
    return (
      <StudySessionShell title="Lesen" mode="Lesen" index={0} total={1} onBack={backOneStep}>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium text-subtle">
            {passage.title} · {passage.source}
          </p>
          <LesenSentenceInsertionBoard key={passage.id} passage={passage} onComplete={finishRound} />
        </div>
      </StudySessionShell>
    );
  }

  return (
    <StudySessionShell title="Lesen" mode="Lesen" index={0} total={1} onBack={backOneStep}>
      <LesenChoiceBoard key={passage.id} passage={passage} onComplete={finishRound} />
    </StudySessionShell>
  );
}
