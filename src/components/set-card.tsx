import { Link } from "@tanstack/react-router";
import { BookOpen, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Card, StudySet } from "@/lib/types";
import { MASTERY_MAX } from "@/lib/types";
import { leitnerBoxCounts, masteryStats, type ProgressMap } from "@/lib/quiz";
import { useProgress } from "@/lib/store";
import { reviewSummary } from "@/lib/srs";
import { DueBadge } from "./review-status";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

/**
 * Glance-level signal: one tiny bar per Leitner box, terracotta (needs review)
 * fading to sage (mastered), plus a neutral bar for cards not started yet.
 *
 * The unstarted bar is deliberately not terracotta: a set you have never
 * opened is not a set you are failing.
 */
function MiniLeitner({ cards, progress }: { cards: Card[]; progress: ProgressMap }) {
  const { boxes, notStarted } = leitnerBoxCounts(cards, progress);
  const max = Math.max(1, ...boxes, notStarted);
  const height = (count: number) => (count === 0 ? 4 : 6 + Math.round((count / max) * 10));

  return (
    <div className="mt-3 flex h-4 items-end gap-1" aria-hidden="true">
      {boxes.map((count, box) => (
        <span
          key={box}
          className={cn(
            "w-full flex-1 rounded-full",
            box <= 1 ? "bg-danger" : box >= MASTERY_MAX - 1 ? "bg-success-soft" : "bg-subtle/40",
            count === 0 && "opacity-25",
          )}
          style={{ height: height(count) }}
        />
      ))}
      <span
        className={cn("w-full flex-1 rounded-full bg-border", notStarted === 0 && "opacity-25")}
        style={{ height: height(notStarted) }}
      />
    </div>
  );
}

export function SetCard({ set }: { set: StudySet }) {
  // Whatever progress the library page has already loaded; an unstudied set
  // simply reads as 0.
  const progress = useProgress();
  const { percent: mastery, notStarted } = masteryStats(set.cards, progress);
  // Derived from the progress the library page already loaded — no extra read.
  const summary = reviewSummary(set.cards, progress, { now: Date.now() });
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
        <div className="flex items-center gap-2">
          {set.isReference ? null : <DueBadge summary={summary} />}
          <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
            <Layers className="size-3.5" />
            {set.cards.length} cards
          </span>
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium tracking-tight group-hover:text-primary">
        {set.title}
      </h3>
      {set.isReference ? (
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-slate/10 px-2 py-1 text-[11px] font-medium text-slate">
          <BookOpen className="size-3" />
          Reference
        </span>
      ) : (
        <MiniLeitner cards={set.cards} progress={progress} />
      )}
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">
        {set.description || "No description"}
      </p>
      {set.isReference ? null : (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Progress</span>
            <span className="tabular-nums">
              {mastery}%{notStarted > 0 ? ` · ${notStarted} not started` : ""}
            </span>
          </div>
          <Progress value={mastery} />
        </div>
      )}
      <p className="mt-4 text-xs text-subtle">{when}</p>
    </Link>
  );
}
