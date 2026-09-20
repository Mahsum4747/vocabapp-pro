import { Link } from "@tanstack/react-router";
import { BookOpen, Check, Layers } from "lucide-react";
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
import { AnimatedNumber } from "@/hooks/use-animated-number";

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

export function SetCard({
  set,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  set: StudySet;
  /** Bulk-organize mode: clicking the card toggles selection instead of
   *  opening the set. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  // Whatever progress the library page has already loaded; an unstudied set
  // simply reads as 0.
  const progress = useProgress();
  const { percent: mastery, notStarted } = masteryStats(set.cards, progress);
  // Derived from the progress the library page already loaded — no extra read.
  const summary = reviewSummary(set.cards, progress, { now: Date.now() });
  const when = set.lastStudiedAt
    ? formatDistanceToNow(set.lastStudiedAt, { addSuffix: true })
    : "Not studied yet";

  const className = cn(
    "group relative flex flex-col rounded-card bg-surface p-card text-left shadow-[var(--elevation-1)] transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-standard)]",
    selectable
      ? cn("w-full", selected ? "ring-2 ring-primary" : "hover:shadow-[var(--elevation-2)]")
      : "hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)]",
  );

  const content = (
    <>
      {selectable ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-3 left-3 z-10 flex size-6 items-center justify-center rounded-full border-2 bg-surface",
            selected ? "border-primary bg-primary text-primary-fg" : "border-border",
          )}
        >
          {selected ? <Check className="size-3.5" /> : null}
        </span>
      ) : null}
      <div className="flex min-h-7 items-center justify-between gap-3">
        {set.folder?.trim() ? <Badge>{set.folder.trim()}</Badge> : <span />}
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
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-slate/10 px-2 py-1 text-2xs font-medium text-slate">
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
              <AnimatedNumber value={mastery} />%
              {notStarted > 0 ? ` · ${notStarted} not started` : ""}
            </span>
          </div>
          <Progress value={mastery} tone="mastery" />
        </div>
      )}
      <p className="mt-4 text-xs text-subtle">{when}</p>
    </>
  );

  if (selectable) {
    return (
      <button type="button" onClick={onToggleSelect} aria-pressed={selected} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to="/sets/$setId" params={{ setId: set.id }} className={className}>
      {content}
    </Link>
  );
}
