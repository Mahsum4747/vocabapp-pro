import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  /** "mastery" fills with a gray-to-success gradient across the FULL 0-100
   *  range (see backgroundSize below) so the bar's own color, not just its
   *  length, reflects how far along it is. Default stays the flat primary
   *  fill used by XP/level and in-session progress bars. */
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "mastery";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-[var(--duration-base)] ease-[var(--ease-standard)]",
          tone === "primary" && "bg-primary",
        )}
        style={
          tone === "mastery"
            ? {
                width: `${clamped}%`,
                backgroundImage: "var(--gradient-mastery)",
                // The gradient's two stops always span the full 0-100 track,
                // even though this div is only `clamped`% wide — scaling the
                // background up by 100/clamped and clipping to this element's
                // own width shows just the [0, clamped] slice of it, so a 20%
                // bar reads as early/gray and an 80% bar reads as near-green.
                backgroundSize: clamped > 0 ? `${(10000 / clamped).toFixed(2)}% 100%` : "100% 100%",
              }
            : { width: `${clamped}%` }
        }
      />
    </div>
  );
}
