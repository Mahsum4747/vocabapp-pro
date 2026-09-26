import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpDown,
  Copy,
  Download,
  Globe,
  Lock,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ArticleizedTerm } from "@/components/articleized-term";
import { OwnerGate, OwnershipStatus } from "@/components/owner-gate";
import { ModeGrid } from "@/components/mode-grid";
import { SessionLength } from "@/components/session-length";
import { LeitnerBoxes } from "@/components/leitner-boxes";
import { LibraryProgressPanel } from "@/components/library-progress-panel";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { EmptyState } from "@/components/empty-state";
import { ExampleLine } from "@/components/example-line";
import { ReviewCallout } from "@/components/review-status";
import { ShareLink } from "@/components/share-link";
import { SpeakButton } from "@/components/speak-button";
import { TransferCardsDialog, type TransferMode } from "@/components/transfer-cards-dialog";
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
import { clozeBlankForCard } from "@/lib/cloze";
import { satzbauChipsForCard } from "@/lib/satzbau";
import { masteryScoreFor, masteryStats, type ProgressMap } from "@/lib/quiz";
import { reviewSummary } from "@/lib/srs";
import { serializeSetExport } from "@/lib/parse-cards";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, resolveSetLanguages } from "@/lib/types";
import { profileFor } from "@/lib/lang/profiles";
import type { Card, CardStatus, StudySet } from "@/lib/types";
import { cn } from "@/lib/utils";

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

/**
 * Shown instead of the mastery/Leitner/mode block when the viewer hasn't
 * added this set to their own library yet — a signed-in visitor browsing
 * someone else's public set was otherwise shown a real-looking mastery bar
 * and Leitner boxes that were always 0/empty, and a "Start learning" grid
 * that behaved as if this were their own set. Static content only (card
 * count, level, a couple of example cards) plus the same "Add to my
 * library" action PublicSetCard already offers on the Public Sets tab —
 * not a new flow, the same one. Once added, `isOwner` on the newly copied
 * set's own page (a different id, its own ownerId) is true and this page
 * renders the real block instead, same as any other owned set.
 */
function PublicSetPreview({ studySet }: { studySet: StudySet }) {
  const navigate = useNavigate();
  const copyPublicSet = useStudyStore((s) => s.copyPublicSet);
  const [copying, setCopying] = useState(false);
  const previewCards = studySet.cards.filter(isCardActive).slice(0, 2);

  async function addToLibrary() {
    setCopying(true);
    try {
      const id = await copyPublicSet(studySet.id);
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
    <div className="mt-6 rounded-card bg-surface p-4 shadow-[var(--elevation-1)]">
      <p className="text-sm text-muted">
        Add this set to your library to start tracking mastery and reviews.
      </p>
      <p className="mt-2 text-sm font-medium text-fg">
        {studySet.cards.length} card{studySet.cards.length === 1 ? "" : "s"}
        {studySet.folder ? ` · ${studySet.folder}` : ""}
      </p>
      {previewCards.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {previewCards.map((card) => (
            <li key={card.id} className="rounded-control bg-surface-2 px-3 py-2">
              <p className="font-medium">{card.term}</p>
              <p className="text-sm text-muted">{card.definition}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <Button className="mt-4 w-full sm:w-auto" onClick={addToLibrary} disabled={copying}>
        <Plus />
        Add to my library
      </Button>
    </div>
  );
}

function sortCards(cards: Card[], mode: SortMode, progress: ProgressMap): Card[] {
  if (mode === "original") return cards;
  const sorted = [...cards];
  const score = (card: Card) => masteryScoreFor(progress, card.id);
  if (mode === "alpha") sorted.sort((a, b) => a.term.localeCompare(b.term));
  else if (mode === "mastery") sorted.sort((a, b) => score(a) - score(b));
  else if (mode === "starred") sorted.sort((a, b) => Number(b.starred) - Number(a.starred));
  return sorted;
}

function SetPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const termProfile = profileFor(setLanguages.term);
  // Gates the Articles drill tile (Phase 3C Part B) — only when the set has
  // at least one German card with a known gender. Non-German sets and
  // ungendered German cards never see it.
  const hasArticleDrillCards =
    termProfile.hasNounEnrichment &&
    (studySet?.cards.some((card) => card.enrichment?.gender) ?? false);
  // Thin cards are allowed when written by hand; the set page says which ones
  // have no example, since Cloze and Satzbau are built from examples.
  const cardsWithoutExample =
    studySet && !studySet.isReference
      ? studySet.cards.filter((card) => isCardActive(card) && !card.example?.trim())
      : [];
  // Gates the Cloze tile — only when at least one active card's own example
  // can actually be blanked (not German-specific, unlike the article drill).
  const hasClozeCards =
    studySet?.cards.some((card) => isCardActive(card) && clozeBlankForCard(card) !== null) ?? false;
  // Gates the Satzbau tile — only when at least one active card's example is
  // in the 4-12 word range this mode is scoped to (not language-specific,
  // same as Cloze).
  const hasSatzbauCards =
    studySet?.cards.some((card) => isCardActive(card) && satzbauChipsForCard(card) !== null) ??
    false;
  const progress = useSetProgress(setId);
  const navigate = useNavigate();
  const deleteSet = useStudyStore((s) => s.deleteSet);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const resetProgress = useStudyStore((s) => s.resetProgress);
  const togglePublic = useStudyStore((s) => s.togglePublic);
  const setCardStatus = useStudyStore((s) => s.setCardStatus);
  // LibraryProgressPanel (goal/XP/weak-words row above the mastery row) reads
  // sets/progress/profile from the store but doesn't fetch them itself — by
  // contract, whichever page renders it is responsible for that (see
  // useLibraryReview's doc comment). Home always fetches these on mount, but
  // a set page reached directly (deep link, refresh, bookmark) without ever
  // visiting Home left the panel stuck showing its loading skeleton forever.
  const libraryIsLoaded = useStudyStore((s) => s.isLoaded);
  const profile = useStudyStore((s) => s.profile);
  const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchAllProgress = useStudyStore((s) => s.fetchAllProgress);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const fetchSetById = useStudyStore((s) => s.fetchSetById);
  const fetchSetProgress = useStudyStore((s) => s.fetchSetProgress);
  // Pull-to-refresh re-requests just this set and its progress — not the
  // whole-library fetches above, those are a one-time "make sure the shared
  // panel isn't stuck loading" fallback, not this page's own data.
  function refreshSet() {
    return Promise.all([fetchSetById(setId), fetchSetProgress(setId)]);
  }
  useEffect(() => {
    if (!libraryIsLoaded) {
      fetchSets();
      fetchAllProgress();
    }
    if (!profile) fetchProfile();
    // Only fires the fetches this page's first render found missing —
    // deliberately not re-running on every libraryIsLoaded/profile change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("original");
  const [cardView, setCardView] = useState<"active" | "archived">("active");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [transferMode, setTransferMode] = useState<TransferMode | null>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const visibleCards = useMemo(() => {
    if (!studySet) return [];
    const base = studySet.cards.filter((c) =>
      cardView === "archived" ? c.status === "archived" : c.status !== "archived",
    );
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter(
          (c) =>
            c.term.toLowerCase().includes(q) ||
            c.definition.toLowerCase().includes(q) ||
            (c.example ?? "").toLowerCase().includes(q) ||
            (c.definition2 ?? "").toLowerCase().includes(q),
        )
      : base;
    return sortCards(filtered, sortMode, progress);
  }, [studySet, query, sortMode, cardView, progress]);

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

  const { percent: mastery, notStarted } = masteryStats(studySet.cards, progress);
  // Same progress rows the mastery bar and Leitner boxes read — no extra query.
  const summary = reviewSummary(studySet.cards, progress, { now: Date.now() });
  const starred = studySet.cards.filter((c) => c.starred).length;
  const archivedCount = studySet.cards.filter((c) => c.status === "archived").length;

  function switchView(view: "active" | "archived") {
    setCardView(view);
    setSelectedIds(new Set());
  }

  function toggleSelect(cardId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(visibleCards.map((c) => c.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

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
      <PullToRefresh onRefresh={refreshSet}>
        <Link
          to="/"
          className="tap-target inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
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
              {studySet.isReference ? <Badge tone="accent">Reference</Badge> : null}
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
                  {!studySet.isReference ? (
                    <DropdownMenuItem
                      onSelect={() => {
                        void resetProgress(setId);
                        toast.success("Progress reset.");
                      }}
                    >
                      Reset progress
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem className="text-danger" onSelect={() => setConfirmDelete(true)}>
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </OwnerGate>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {studySet.isPublic && studySet.shareId ? (
          <OwnerGate ownerId={studySet.ownerId}>
            <ShareLink shareId={studySet.shareId} />
          </OwnerGate>
        ) : null}

        {/* Same account-wide streak/goal/XP/weak-words block as Home and
          Account, directly under the header here too. `showReview={false}`
          because this page already has its own per-set `ReviewCallout`
          below — showing the account-wide due count again right above it
          would just repeat the same kind of prompt at a different scope. */}
        <LibraryProgressPanel className="mt-6" showReview={false} />

        {!studySet.isReference ? (
          <OwnershipStatus ownerId={studySet.ownerId}>
            {(isOwner) =>
              isOwner ? (
                <>
                  <div className="mt-6 flex flex-col gap-4 rounded-card bg-surface p-4 shadow-[var(--elevation-1)] sm:flex-row sm:items-center sm:gap-6">
                    <div className="min-w-40 flex-1">
                      <div className="flex justify-between text-xs text-muted">
                        <span>Mastery</span>
                        <span className="tabular-nums">
                          {mastery}%{notStarted > 0 ? ` · ${notStarted} not started` : ""}
                        </span>
                      </div>
                      <Progress value={mastery} tone="mastery" className="mt-1.5" />
                    </div>
                    <LeitnerBoxes
                      cards={studySet.cards}
                      progress={progress}
                      setId={studySet.id}
                      selectedBox={selectedBox}
                      onSelectBox={setSelectedBox}
                    />
                  </div>

                  {studySet.cards.length >= 2 ? (
                    <ReviewCallout setId={studySet.id} summary={summary} className="mt-4" />
                  ) : null}

                  <div className="mt-4">
                    {selectedBox !== null ? (
                      <p className="mb-2 flex items-center gap-2 text-sm text-muted">
                        Studying Box {selectedBox} only
                        <button
                          type="button"
                          onClick={() => setSelectedBox(null)}
                          className="tap-target text-primary-ink underline-offset-2 hover:underline"
                        >
                          Clear
                        </button>
                      </p>
                    ) : null}
                    <SessionLength studySet={studySet} className="mb-4" />
                    <ModeGrid
                      setId={setId}
                      box={selectedBox ?? undefined}
                      disabled={studySet.cards.length < 2}
                      showArticleDrill={hasArticleDrillCards}
                      showCloze={hasClozeCards}
                      showSatzbau={hasSatzbauCards}
                      showCaseDrill={hasArticleDrillCards}
                    />
                    {studySet.cards.length < 2 ? (
                      <p className="mt-3 text-sm text-muted">
                        You need at least two cards to study.
                      </p>
                    ) : null}
                    {cardsWithoutExample.length > 0 ? (
                      <p className="mt-3 text-sm text-muted">
                        {cardsWithoutExample.length} card
                        {cardsWithoutExample.length === 1 ? " has" : "s have"} no example sentence:{" "}
                        {cardsWithoutExample
                          .slice(0, 5)
                          .map((c) => c.term)
                          .join(", ")}
                        {cardsWithoutExample.length > 5
                          ? `, +${cardsWithoutExample.length - 5} more`
                          : ""}
                        .
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <PublicSetPreview studySet={studySet} />
              )
            }
          </OwnershipStatus>
        ) : null}

        <OwnershipStatus ownerId={studySet.ownerId}>
          {(isOwner) => (
            <>
              <div className="mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => switchView("active")}
                  >
                    <Badge tone={cardView === "active" ? "primary" : "muted"}>Cards</Badge>
                  </button>
                  {isOwner ? (
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => switchView("archived")}
                    >
                      <Badge tone={cardView === "archived" ? "primary" : "muted"}>
                        Archived{archivedCount > 0 ? ` (${archivedCount})` : ""}
                      </Badge>
                    </button>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search cards"
                      className="h-9 pl-9 text-sm pointer-coarse:h-11"
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
                          className={
                            option.value === sortMode ? "bg-surface-2 font-medium" : undefined
                          }
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {visibleCards.length > 0 ? (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      type="button"
                      className="-m-3 p-3 text-muted underline-offset-2 hover:text-fg hover:underline"
                      onClick={selectAll}
                    >
                      Select all
                    </button>
                    {selectedIds.size > 0 ? (
                      <button
                        type="button"
                        className="-m-3 p-3 text-muted underline-offset-2 hover:text-fg hover:underline"
                        onClick={clearSelection}
                      >
                        Clear selection
                      </button>
                    ) : null}
                  </div>
                  {selectedIds.size > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted tabular-nums">
                        {selectedIds.size} card{selectedIds.size === 1 ? "" : "s"} selected
                      </span>
                      <Button size="sm" variant="outline" onClick={() => setTransferMode("copy")}>
                        <Copy className="size-4" />
                        {isOwner ? "Copy to set…" : "Copy to my set…"}
                      </Button>
                      {isOwner ? (
                        <Button size="sm" variant="outline" onClick={() => setTransferMode("move")}>
                          <ArrowRightLeft className="size-4" />
                          Move to set…
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {visibleCards.length === 0 ? (
                <div className="rounded-card bg-surface px-4 py-8 text-center text-sm text-muted shadow-[var(--elevation-1)]">
                  {cardView === "archived" ? "No archived cards." : "No cards match your search."}
                </div>
              ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-card bg-surface shadow-[var(--elevation-1)]">
                  {visibleCards.map((card) => {
                    const isExcluded = card.status === "excluded";
                    return (
                      <li
                        key={card.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 md:px-5",
                          studySet.isReference && "py-4 md:py-5",
                          isExcluded && "opacity-50",
                        )}
                      >
                        {/* On touch the label grows the hit area to 44px; the negative
                          margins cancel the padding, so the layout does not move. */}
                        <label className="mt-3.5 shrink-0 pointer-coarse:-mx-3.5 pointer-coarse:-mb-3.5 pointer-coarse:mt-0 pointer-coarse:p-3.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(card.id)}
                            onChange={() => toggleSelect(card.id)}
                            aria-label={`Select ${card.term || "card"}`}
                            className="block size-4 rounded border-border accent-primary-ink"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleStar(setId, card.id)}
                          className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-control text-muted hover:bg-surface-2 hover:text-fg"
                          aria-label={card.starred ? "Unstar" : "Star"}
                        >
                          <Star className={card.starred ? "size-4 fill-fg text-fg" : "size-4"} />
                        </button>
                        <div
                          className={cn(
                            "grid min-w-0 flex-1 gap-1 md:grid-cols-2",
                            studySet.isReference ? "md:gap-8" : "md:gap-6",
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-1">
                            <p
                              className={cn(
                                "min-w-0 break-words font-medium",
                                studySet.isReference && "text-base md:text-lg",
                              )}
                            >
                              <ArticleizedTerm
                                term={card.term}
                                enrichment={card.enrichment}
                                profile={termProfile}
                              />
                            </p>
                            <SpeakButton
                              text={card.term}
                              language={setLanguages.term ?? studySet.termLanguage}
                            />
                            {isExcluded ? (
                              <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-2xs font-medium tracking-wide text-muted uppercase">
                                Excluded
                              </span>
                            ) : null}
                          </div>
                          <div className="min-w-0 space-y-1">
                            <p className="text-sm whitespace-pre-line break-words text-muted md:text-base">
                              {card.definition}
                            </p>
                            <ExampleLine
                              example={card.example}
                              termLanguage={setLanguages.term ?? studySet.termLanguage}
                            />
                          </div>
                        </div>
                        {isOwner ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Card status"
                                className="mt-0.5 shrink-0"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(
                                [
                                  { value: "active", label: "Active" },
                                  { value: "excluded", label: "Exclude from study" },
                                  { value: "archived", label: "Archive" },
                                ] satisfies { value: CardStatus; label: string }[]
                              ).map((option) => {
                                const current = card.status ?? "active";
                                return (
                                  <DropdownMenuItem
                                    key={option.value}
                                    onSelect={() => setCardStatus(setId, card.id, option.value)}
                                    className={
                                      current === option.value
                                        ? "bg-surface-2 font-medium"
                                        : undefined
                                    }
                                  >
                                    {option.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </OwnershipStatus>
      </PullToRefresh>

      {transferMode ? (
        <TransferCardsDialog
          mode={transferMode}
          sourceSetId={setId}
          cardIds={Array.from(selectedIds)}
          onOpenChange={(open) => {
            if (!open) setTransferMode(null);
          }}
          onDone={() => {
            setTransferMode(null);
            clearSelection();
          }}
        />
      ) : null}

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
