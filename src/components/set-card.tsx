import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Card, StudySet } from "@/lib/types";
import { MASTERY_MAX } from "@/lib/types";
import { leitnerBoxCounts, masteryPercent } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

/** Glance-level signal: one tiny bar per Leitner box, terracotta (needs review) fading to sage (mastered). */
function MiniLeitner({ cards }: { cards: Card[] }) {
  const counts = leitnerBoxCounts(cards);
  const max = Math.max(1, ...counts);

  return (
    <div className="mt-3 flex h-4 items-end gap-1" aria-hidden="true">
      {counts.map((count, box) => (
        <span
          key={box}
          className={cn(
            "w-full flex-1 rounded-full",
            box <= 1 ? "bg-danger" : box >= MASTERY_MAX - 1 ? "bg-success-soft" : "bg-subtle/40",
            count === 0 && "opacity-25",
          )}
          style={{ height: count === 0 ? 4 : 6 + Math.round((count / max) * 10) }}
        />
      ))}
    </div>
  );
}

export function SetCard({ set }: { set: StudySet }) {
  const mastery = masteryPercent(set.cards);
  const when = set.lastStudiedAt
    ? formatDistanceToNow(set.lastStudiedAt, { addSuffix: true })
    : "Not studied yet";

  return (
    <Link
      to="/sets/$setId"
      params={{ setId: set.id }}
      className="group flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge>{set.subject}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
          <Layers className="size-3.5" />
          {set.cards.length} cards
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium tracking-tight group-hover:text-primary">
        {set.title}
      </h3>
      <MiniLeitner cards={set.cards} />
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{set.description || "No description"}</p>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span className="tabular-nums">{mastery}%</span>
        </div>
        <Progress value={mastery} />
      </div>
      <p className="mt-4 text-xs text-subtle">{when}</p>
    </Link>
  );
}
