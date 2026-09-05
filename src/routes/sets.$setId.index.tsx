import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Download,
  Globe,
  Lock,
  MoreHorizontal,
  Pencil,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { OwnerGate } from "@/components/owner-gate";
import { ModeGrid } from "@/components/mode-grid";
import { LeitnerBoxes } from "@/components/leitner-boxes";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { masteryPercent } from "@/lib/quiz";
import { serializeSetExport } from "@/lib/parse-cards";
import { useSet, useStudyStore } from "@/lib/store";
import type { Card } from "@/lib/types";

export const Route = createFileRoute("/sets/$setId/")({
  component: SetPage,
});

type SortMode = "original" | "alpha" | "mastery" | "starred";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "original", label: "Original order" },
  { value: "alpha", label: "Alphabetical (A–Z)" },
  { value: "mastery", label: "Mastery: lowest first" },
  { value: "starred", label: "Starred first" },
];

function sortCards(cards: Card[], mode: SortMode): Card[] {
  if (mode === "original") return cards;
  const sorted = [...cards];
  if (mode === "alpha") sorted.sort((a, b) => a.term.localeCompare(b.term));
  else if (mode === "mastery") sorted.sort((a, b) => a.mastery - b.mastery);
  else if (mode === "starred") sorted.sort((a, b) => Number(b.starred) - Number(a.starred));
  return sorted;
}

function SetPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const navigate = useNavigate();
  const deleteSet = useStudyStore((s) => s.deleteSet);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const resetMastery = useStudyStore((s) => s.resetMastery);
  const togglePublic = useStudyStore((s) => s.togglePublic);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("original");

  const visibleCards = useMemo(() => {
    if (!studySet) return [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? studySet.cards.filter(
          (c) => c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q),
        )
      : studySet.cards;
    return sortCards(filtered, sortMode);
  }, [studySet, query, sortMode]);

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="It was deleted or isn't on this device."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const mastery = masteryPercent(studySet.cards);
  const starred = studySet.cards.filter((c) => c.starred).length;

  function exportJson() {
    if (!studySet) return;
    const blob = new Blob([serializeSetExport(studySet)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studySet.title.replace(/\s+/g, "-").toLowerCase()}.karta.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Set downloaded.");
  }

  return (
    <AppShell>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Library
      </Link>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{studySet.subject}</Badge>
            <Badge tone={studySet.isPublic ? "primary" : "muted"}>
              {studySet.isPublic ? "Public" : "Private"}
            </Badge>
            <span className="text-sm text-muted tabular-nums">{studySet.cards.length} cards</span>
            {starred > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Star className="size-3.5 fill-fg" />
                {starred}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
            {studySet.title}
          </h1>
          {studySet.description ? (
            <p className="mt-2 max-w-2xl text-muted">{studySet.description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <OwnerGate ownerId={studySet.ownerId}>
            <Button
              variant="outline"
              disabled={togglingPublic}
              onClick={async () => {
                setTogglingPublic(true);
                try {
                  await togglePublic(setId);
                  toast.success(studySet.isPublic ? "Set made private." : "Set made public.");
                } finally {
                  setTogglingPublic(false);
                }
              }}
            >
              {studySet.isPublic ? <Lock /> : <Globe />}
              {studySet.isPublic ? "Make private" : "Make public"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId/edit" params={{ setId }}>
                <Pencil />
                Edit
              </Link>
            </Button>
          </OwnerGate>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={exportJson}>
                <Download className="size-4" />
                Export
              </DropdownMenuItem>
              <OwnerGate ownerId={studySet.ownerId}>
                <DropdownMenuItem
                  onSelect={() => {
                    resetMastery(setId);
                    toast.success("Progress reset.");
                  }}
                >
                  Reset progress
                </DropdownMenuItem>
                <DropdownMenuItem className="text-danger" onSelect={() => setConfirmDelete(true)}>
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </OwnerGate>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-40 flex-1">
          <div className="flex justify-between text-xs text-muted">
            <span>Mastery</span>
            <span className="tabular-nums">{mastery}%</span>
          </div>
          <Progress value={mastery} className="mt-1.5" />
        </div>
        <LeitnerBoxes cards={studySet.cards} />
      </div>

      <div className="mt-4">
        <ModeGrid setId={setId} disabled={studySet.cards.length < 2} />
        {studySet.cards.length < 2 ? (
          <p className="mt-3 text-sm text-muted">You need at least two cards to study.</p>
        ) : null}
      </div>

      <div className="mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-medium tracking-tight">Cards</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards"
              className="h-9 pl-9 text-sm"
              aria-label="Search cards"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="size-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSortMode(option.value)}
                  className={option.value === sortMode ? "bg-surface-2 font-medium" : undefined}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {visibleCards.length === 0 ? (
        <div className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-[var(--shadow-border)]">
          No cards match your search.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {visibleCards.map((card) => (
            <li key={card.id} className="flex items-start gap-3 px-4 py-3 md:px-5">
              <button
                type="button"
                onClick={() => toggleStar(setId, card.id)}
                className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
                aria-label={card.starred ? "Unstar" : "Star"}
              >
                <Star className={card.starred ? "size-4 fill-fg text-fg" : "size-4"} />
              </button>
              <div className="grid min-w-0 flex-1 gap-1 md:grid-cols-2 md:gap-6">
                <p className="font-medium">{card.term}</p>
                <p className="text-sm whitespace-pre-line text-muted md:text-base">
                  {card.definition}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this set?</AlertDialogTitle>
          <AlertDialogDescription>
            {studySet.title} will be permanently removed. This can't be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSet(setId);
                toast.success("Set deleted.");
                void navigate({ to: "/" });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
