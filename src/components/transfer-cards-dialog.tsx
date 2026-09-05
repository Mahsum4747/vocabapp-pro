import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { toast } from "sonner";
import type { StudySet } from "@/lib/types";
import { useStudyStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

export type TransferMode = "copy" | "move";

export function TransferCardsDialog({
  mode,
  sourceSetId,
  cardIds,
  onOpenChange,
  onDone,
}: {
  mode: TransferMode;
  sourceSetId: string;
  cardIds: string[];
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const navigate = useNavigate();
  const fetchMySetsForTransfer = useStudyStore((s) => s.fetchMySetsForTransfer);
  const copyCardsToSet = useStudyStore((s) => s.copyCardsToSet);
  const moveCardsToSet = useStudyStore((s) => s.moveCardsToSet);
  const [mySets, setMySets] = useState<StudySet[] | null>(null);
  const [busyTargetId, setBusyTargetId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMySetsForTransfer().then((result) => {
      if (cancelled) return;
      if (result === null) {
        toast.error("Sign in to copy cards to your library.");
        onOpenChange(false);
        void navigate({ to: "/login" });
        return;
      }
      setMySets(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const targets = (mySets ?? []).filter((s) => s.id !== sourceSetId);

  async function pick(targetId: string) {
    setBusyTargetId(targetId);
    try {
      const addedCount =
        mode === "copy"
          ? await copyCardsToSet(sourceSetId, targetId, cardIds)
          : await moveCardsToSet(sourceSetId, targetId, cardIds);
      toast.success(
        `${addedCount} card${addedCount === 1 ? "" : "s"} ${mode === "copy" ? "copied" : "moved"}.`,
      );
      onOpenChange(false);
      onDone();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusyTargetId(null);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        title={mode === "copy" ? "Copy to set…" : "Move to set…"}
        className="space-y-4"
      >
        <p className="text-sm text-muted">
          {cardIds.length} card{cardIds.length === 1 ? "" : "s"} selected. Choose a set.
        </p>
        {mySets === null ? (
          <p className="py-6 text-center text-sm text-muted">Loading your sets…</p>
        ) : targets.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            You don't have another set yet — create one first.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1.5 overflow-y-auto">
            {targets.map((target) => (
              <li key={target.id}>
                <button
                  type="button"
                  disabled={busyTargetId !== null}
                  onClick={() => pick(target.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-border disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="min-w-0 truncate font-medium">{target.title}</span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted tabular-nums">
                    <Layers className="size-3.5" />
                    {target.cards.length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
