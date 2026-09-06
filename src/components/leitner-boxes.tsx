import { leitnerBoxCounts } from "@/lib/quiz";
import type { Card } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LeitnerBoxes({
  cards,
  selectedBox,
  onSelectBox,
}: {
  cards: Card[];
  selectedBox: number | null;
  onSelectBox: (box: number | null) => void;
}) {
  const counts = leitnerBoxCounts(cards);

  return (
    <div className="flex gap-1.5">
      {counts.map((count, box) => {
        const clickable = count > 0;
        const isSelected = selectedBox === box;
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
              isSelected ? "bg-primary text-primary-fg" : "bg-surface-2",
              clickable && !isSelected && "hover:bg-border",
              !clickable && "cursor-not-allowed opacity-50",
            )}
          >
            <p
              className={cn(
                "text-[9px] font-medium tracking-wide uppercase",
                isSelected ? "text-primary-fg/70" : "text-muted",
              )}
            >
              B{box}
            </p>
            <p className="text-xs font-medium tabular-nums">{count}</p>
          </button>
        );
      })}
    </div>
  );
}
