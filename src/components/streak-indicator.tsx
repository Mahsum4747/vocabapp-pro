import { Flame } from "lucide-react";

export function StreakIndicator({ days }: { days: number }) {
  if (days <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-fg shadow-[var(--shadow-border)]">
      <Flame className="size-4 fill-danger text-danger" />
      {days} day{days === 1 ? "" : "s"} streak
    </div>
  );
}
