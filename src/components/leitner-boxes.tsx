import { leitnerBoxCounts } from "@/lib/quiz";
import type { Card } from "@/lib/types";

export function LeitnerBoxes({ cards }: { cards: Card[] }) {
  const counts = leitnerBoxCounts(cards);

  return (
    <div className="flex flex-wrap gap-2">
      {counts.map((count, box) => (
        <div
          key={box}
          className="min-w-28 flex-1 rounded-lg bg-surface px-3 py-2.5 text-center shadow-[var(--shadow-border)]"
        >
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Box {box}</p>
          <p className="mt-0.5 text-sm font-medium tabular-nums">
            {count} {count === 1 ? "word" : "words"}
          </p>
        </div>
      ))}
    </div>
  );
}
