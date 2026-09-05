import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { useSet, useStudyStore } from "@/lib/store";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/match")({
  component: MatchPage,
});

type Tile = {
  id: string;
  cardId: string;
  text: string;
  kind: "term" | "definition";
};

function MatchPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const bumpMastery = useStudyStore((s) => s.bumpMastery);
  const markStudied = useStudyStore((s) => s.markStudied);
  const [round, setRound] = useState(0);

  const tiles = useMemo<Tile[]>(() => {
    if (!studySet) return [];
    const picked = shuffle(studySet.cards.filter((c) => c.term && c.definition)).slice(0, 6);
    const both: Tile[] = picked.flatMap((card) => [
      { id: `${card.id}-t`, cardId: card.id, text: card.term, kind: "term" as const },
      { id: `${card.id}-d`, cardId: card.id, text: card.definition, kind: "definition" as const },
    ]);
    return shuffle(both);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, round]);

  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const totalPairs = tiles.length / 2;
  const done = totalPairs > 0 && matched.size === tiles.length;

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  useEffect(() => {
    if (!running || done) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running, done]);

  useEffect(() => {
    if (done) setRunning(false);
  }, [done]);

  function restart() {
    setMatched(new Set());
    setSelected(null);
    setWrong([]);
    setSeconds(0);
    setRunning(true);
    setRound((n) => n + 1);
  }

  function onTile(tile: Tile) {
    if (matched.has(tile.id) || wrong.length) return;
    if (!selected) {
      setSelected(tile);
      return;
    }
    if (selected.id === tile.id) {
      setSelected(null);
      return;
    }
    const ok = selected.cardId === tile.cardId && selected.kind !== tile.kind;
    if (ok) {
      setMatched((prev) => new Set([...prev, selected.id, tile.id]));
      bumpMastery(setId, tile.cardId, 1);
      setSelected(null);
    } else {
      setWrong([selected.id, tile.id]);
      bumpMastery(setId, selected.cardId, -1);
      window.setTimeout(() => {
        setWrong([]);
        setSelected(null);
      }, 450);
    }
  }

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="Match can't open."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (tiles.length < 4) {
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Match" index={0} total={0}>
        <EmptyState title="Not enough cards" description="Match needs at least two cards." />
      </StudyChrome>
    );
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Match"
      index={matched.size / 2}
      total={totalPairs}
      headerRight={<span className="text-sm tabular-nums text-muted">{mm}:{ss}</span>}
    >
      {done ? (
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <h2 className="font-display text-3xl font-medium tracking-tight">Done</h2>
          <p className="mt-2 text-sm text-muted">
            {totalPairs} matches · {mm}:{ss}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Restart</Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Back to set
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {tiles.map((tile) => {
            const isOn = selected?.id === tile.id;
            const isMatch = matched.has(tile.id);
            const isWrong = wrong.includes(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                disabled={isMatch}
                onClick={() => onTile(tile)}
                className={cn(
                  "min-h-24 rounded-lg px-3 py-3 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,opacity,transform] duration-150",
                  tile.kind === "term" ? "bg-primary text-primary-fg" : "bg-surface text-fg",
                  isOn && "ring-2 ring-ring ring-offset-2 ring-offset-bg",
                  isMatch && "opacity-35",
                  isWrong && "bg-danger-soft text-danger",
                )}
              >
                <span className="mb-1 block text-xs font-medium tracking-wide uppercase opacity-70">
                  {tile.kind === "term" ? "Term" : "Definition"}
                </span>
                {tile.text}
              </button>
            );
          })}
        </div>
      )}
    </StudyChrome>
  );
}
