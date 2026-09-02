import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { StudySet } from "@/lib/types";
import { masteryPercent } from "@/lib/quiz";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function SetCard({ set }: { set: StudySet }) {
  const mastery = masteryPercent(set.cards);
  const when = set.lastStudiedAt
    ? formatDistanceToNow(set.lastStudiedAt, { addSuffix: true, locale: tr })
    : "Henüz çalışılmadı";

  return (
    <Link
      to="/sets/$setId"
      params={{ setId: set.id }}
      className="group flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge>{set.subject}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
          <Layers className="size-3.5" />
          {set.cards.length} kart
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium tracking-tight group-hover:text-primary">
        {set.title}
      </h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{set.description || "Açıklama yok"}</p>
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>İlerleme</span>
          <span className="tabular-nums">{mastery}%</span>
        </div>
        <Progress value={mastery} />
      </div>
      <p className="mt-4 text-xs text-subtle">{when}</p>
    </Link>
  );
}
