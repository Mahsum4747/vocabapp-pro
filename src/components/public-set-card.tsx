import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Copy, Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import type { StudySet } from "@/lib/types";
import { useStudyStore } from "@/lib/store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function PublicSetCard({ set }: { set: StudySet }) {
  const copyPublicSet = useStudyStore((s) => s.copyPublicSet);
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  async function addToLibrary(e: React.MouseEvent) {
    e.preventDefault(); // the card itself is a Link to view the set
    e.stopPropagation();
    setCopying(true);
    try {
      const id = await copyPublicSet(set.id);
      if (id) {
        toast.success("Set added to your library.");
        void navigate({ to: "/sets/$setId", params: { setId: id } });
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        toast.error("Sign in to add this set to your library.");
        void navigate({ to: "/login" });
      } else {
        toast.error("Couldn't add this set. Try again.");
      }
    } finally {
      setCopying(false);
    }
  }

  return (
    <Link
      to="/sets/$setId"
      // Prefer the share id so browsing public sets doesn't expose document
      // ids; sets predating the shareId backfill still link by document id.
      params={{ setId: set.shareId ?? set.id }}
      className="group flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge tone="accent">{set.subject}</Badge>
        <div className="flex items-center gap-3">
          {set.copyCount ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
              <Copy className="size-3.5" />
              {set.copyCount} {set.copyCount === 1 ? "copy" : "copies"}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
            <Layers className="size-3.5" />
            {set.cards.length} cards
          </span>
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium tracking-tight group-hover:text-primary">
        {set.title}
      </h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">
        {set.description || "No description"}
      </p>
      <Button className="mt-5 w-full" variant="outline" onClick={addToLibrary} disabled={copying}>
        <Plus />
        Add to my library
      </Button>
    </Link>
  );
}
