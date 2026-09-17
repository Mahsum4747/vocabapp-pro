import { Link } from "@tanstack/react-router";
import { leitnerBoxCounts, type ProgressMap } from "@/lib/quiz";
import { weakCards } from "@/lib/srs";
import type { Card } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/hooks/use-animated-number";

/**
 * The Leitner boxes for one set, plus the cards that are in no box at all.
 *
 * Box 0 means "reviewed and still weak". A card you have never seen has not
 * earned that, so it is counted apart as New — and is not a filter, because
 * there is no `?box=` value that means "unstarted".
 */
export function LeitnerBoxes({
  cards,
  progress,
  setId,
  selectedBox,
  onSelectBox,
}: {
  cards: Card[];
  progress: ProgressMap;
  /** The set these boxes belong to, for the weak-words link. */
  setId: string;
  selectedBox: number | null;
  onSelectBox: (box: number | null) => void;
}) {
  const { boxes, notStarted } = leitnerBoxCounts(cards, progress);
  // The same `isWeakWord` the weak-words rounds filter on — read from the
  // progress this page already holds, so the chip and the round agree.
  const weak = weakCards(cards, progress, { now: Date.now() }).length;

  return (
    <div className="flex gap-1.5">
      {boxes.map((count, box) => {
        const clickable = count > 0;
        const isSelected = selectedBox === box;
        // Higher boxes read as more mastered, so the row itself shows
        // progress at a glance: B0-B1 stay neutral, B2-B3 pick up a light
        // success tint, and B4-B5 (near/at MASTERY_MAX) get the fuller tint
        // plus a small glow — all from the existing success tokens, nothing
        // new. Selection always wins, same as before.
        const tier = box <= 1 ? "low" : box <= 3 ? "mid" : "high";
        return (
          <button
            key={box}
            type="button"
            disabled={!clickable}
            aria-pressed={isSelected}
            aria-label={`Box ${box}, ${count} card${count === 1 ? "" : "s"}${clickable ? "" : ", empty"}`}
            onClick={() => onSelectBox(isSelected ? null : box)}
            className={cn(
              "flex min-w-10 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors",
              isSelected
                ? "bg-primary text-primary-fg"
                : tier === "high"
                  ? "bg-success-strong shadow-[var(--glow-success)]"
                  : tier === "mid"
                    ? "bg-tier-mid"
                    : "bg-tier-neutral",
              clickable && !isSelected && tier === "low" && "hover:bg-border",
              !clickable && "cursor-not-allowed opacity-50",
            )}
          >
            <p
              className={cn(
                "text-3xs font-medium tracking-wide uppercase",
                isSelected ? "text-primary-fg/70" : tier === "high" ? "text-success" : "text-muted",
              )}
            >
              B{box}
            </p>
            <p
              className={cn(
                "text-xs font-medium tabular-nums",
                !isSelected && tier === "high" && "text-success",
              )}
            >
              <AnimatedNumber value={count} />
            </p>
          </button>
        );
      })}
      {/* Weak is a different question from a box — it cuts across them — so it
          opens a round rather than filtering this row. */}
      {weak > 0 ? (
        <Link
          to="/sets/$setId/flashcards"
          params={{ setId }}
          search={{ filter: "weak" as const }}
          aria-label={`Study ${weak} weak word${weak === 1 ? "" : "s"}`}
          className="flex min-w-10 flex-col items-center gap-0.5 rounded-lg bg-danger-soft px-2 py-1.5 transition-opacity hover:opacity-80"
        >
          <p className="text-3xs font-medium tracking-wide text-danger uppercase">Weak</p>
          <p className="text-xs font-medium text-danger tabular-nums">
            <AnimatedNumber value={weak} />
          </p>
        </Link>
      ) : null}
      {notStarted > 0 ? (
        <span
          className="flex min-w-10 flex-col items-center gap-0.5 rounded-lg bg-streak/10 px-2 py-1.5"
          aria-label={`${notStarted} card${notStarted === 1 ? "" : "s"} not started`}
        >
          <p className="text-3xs font-medium tracking-wide text-streak uppercase">New</p>
          <p className="text-xs font-medium text-streak tabular-nums">
            <AnimatedNumber value={notStarted} />
          </p>
        </span>
      ) : null}
    </div>
  );
}
