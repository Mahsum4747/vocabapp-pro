import { Flame } from "lucide-react";
import { AnimatedNumber } from "@/hooks/use-animated-number";

export function StreakIndicator({ days }: { days: number }) {
  if (days <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-fg shadow-[var(--elevation-1)]">
      <Flame className="size-4 fill-streak text-streak" />
      <AnimatedNumber value={days} /> day{days === 1 ? "" : "s"} streak
    </div>
  );
}
