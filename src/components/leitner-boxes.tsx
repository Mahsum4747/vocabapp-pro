import { leitnerBoxCounts } from "@/lib/quiz";
import type { Card } from "@/lib/types";

export function LeitnerBoxes({ cards }: { cards: Card[] }) {
  const counts = leitnerBoxCounts(cards);

  return (
    <div className="flex gap-1.5">
      {counts.map((count, box) => (
        <div
          key={box}
          className="flex min-w-10 flex-col items-center gap-0.5 rounded-lg bg-surface-2 px-2 py-1.5"
        >
          <p className="text-[9px] font-medium tracking-wide text-muted uppercase">B{box}</p>
          <p className="text-xs font-medium tabular-nums">{count}</p>
        </div>
      ))}
    </div>
  );
}
