import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Progress } from "./ui/progress";

export function StudyChrome({
  setId,
  title,
  mode,
  index,
  total,
  headerRight,
  children,
}: {
  setId: string;
  title: string;
  mode: string;
  index: number;
  total: number;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const pct = total === 0 ? 0 : Math.round((index / total) * 100);
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
          <Link
            to="/sets/$setId"
            params={{ setId }}
            className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label="Sete dön"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="text-xs text-muted">
              {mode}
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
      <main className="mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
