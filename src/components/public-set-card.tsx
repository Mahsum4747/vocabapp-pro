import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import type { StudySet } from "@/lib/types";
import { useStudyStore } from "@/lib/store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function PublicSetCard({ set }: { set: StudySet }) {
  const copyPublicSet = useStudyStore((s) => s.copyPublicSet);
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  async function addToLibrary() {
    setCopying(true);
    try {
      const id = await copyPublicSet(set.id);
      if (id) {
        toast.success("Set kütüphanene eklendi.");
        void navigate({ to: "/sets/$setId", params: { setId: id } });
      }
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between gap-3">
        <Badge>{set.subject}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
          <Layers className="size-3.5" />
          {set.cards.length} kart
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium tracking-tight">{set.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{set.description || "Açıklama yok"}</p>
      <Button className="mt-5 w-full" variant="outline" onClick={addToLibrary} disabled={copying}>
        <Plus />
        Kütüphaneme ekle
      </Button>
    </div>
  );
}
