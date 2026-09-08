import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Progress } from "./ui/progress";

const BACK_LINK =
  "inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg";

export function StudyChrome({
  setId,
  title,
  mode,
  index,
  total,
  filterLabel,
  headerRight,
  children,
}: {
  /** The set being studied. Omitted for a round that spans the library, which
   *  has no single set to go back to. */
  setId?: string;
  title: string;
  mode: string;
  index: number;
  total: number;
  /** Extra context shown next to the mode name, e.g. "Box 2 · 8 cards". */
  filterLabel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const pct = total === 0 ? 0 : Math.round((index / total) * 100);
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
          {setId ? (
            <Link
              to="/sets/$setId"
              params={{ setId }}
              className={BACK_LINK}
              aria-label="Back to set"
            >
              <ArrowLeft className="size-5" />
            </Link>
          ) : (
            <Link to="/" className={BACK_LINK} aria-label="Back to library">
              <ArrowLeft className="size-5" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="text-xs text-muted">
              {mode}
              {filterLabel ? ` · ${filterLabel}` : null}
              {total > 0 ? (
                <span className="tabular-nums">
                  {" "}
                  · {Math.min(index + 1, total)} / {total}
                </span>
              ) : null}
            </p>
          </div>
          {headerRight}
        </div>
        <Progress value={pct} className="h-1 rounded-none" />
      </header>
      {/* `study-pulse` is the tier-1 celebration's target: the whole study
          surface taps once on a right answer, in every mode. */}
      <main className="study-pulse mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
