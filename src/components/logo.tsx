import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-fg no-underline", className)}
      aria-label="Karta home"
    >
      <span className="relative grid size-8 place-items-center">
        <span className="absolute top-0.5 left-1.5 size-5 rounded-sm bg-surface-2 shadow-[var(--shadow-border)]" />
        <span className="absolute top-1.5 left-0.5 grid size-5 place-items-center rounded-sm bg-primary text-[10px] font-semibold text-primary-fg">
          K
        </span>
      </span>
      {compact ? null : (
        <span className="font-display text-xl font-medium tracking-tight">Karta</span>
      )}
    </Link>
  );
}
