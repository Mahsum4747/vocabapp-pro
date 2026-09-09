import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudyDeck, type DeckEntry } from "@/components/study-deck";
import { Button } from "@/components/ui/button";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive } from "@/lib/types";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards, weakCards } from "@/lib/srs";
import { parseIntSearchParam } from "@/lib/utils";

type Search = { box?: number; filter?: "weak" };

export const Route = createFileRoute("/sets/$setId/flashcards")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
    filter: search.filter === "weak" ? "weak" : undefined,
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const { setId } = Route.useParams();
  const { box, filter } = Route.useSearch();
  const studySet = useSet(setId);
  const progress = useSetProgress(setId);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const markStudied = useStudyStore((s) => s.markStudied);

  const [starredOnly, setStarredOnly] = useState(false);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    // The weak filter is the same `isWeakWord` the library-wide round uses,
    // scoped to this set. It replaces the box filter rather than stacking with
    // it: "box 2 and also weak" is not a question anyone asks.
    if (filter === "weak") return weakCards(active, progress, { now: Date.now() });
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, filter, progress]);

  const deck = useMemo<DeckEntry[]>(() => {
    if (!studySet) return [];
    const pool = starredOnly ? boxCards.filter((c) => c.starred) : boxCards;
    const cards = pool.length > 0 ? pool : boxCards;
    // Overdue first, then due, then weak, then new — the queue orders, the
    // scheduler decided the due dates it reads. A weak-words round keeps the
    // order it arrived in: worst first, which is the point of asking for it.
    const ordered = filter === "weak" ? cards : queuedCards(cards, progress, { now: Date.now() });
    return ordered.map((card) => ({
      card,
      setId: studySet.id,
      termLanguage: studySet.termLanguage,
      definitionLanguage2: studySet.definitionLanguage2,
    }));
    // Keyed on the set id (not the studySet object, and not `progress`) so a
    // review landing mid-round — which replaces both with new objects — does
    // not rebuild the deck and snap back to card 0. The deck is a snapshot
    // taken when the round starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, box, filter, starredOnly]);

  const cardCount = `${boxCards.length} card${boxCards.length === 1 ? "" : "s"}`;
  const filterLabel =
    filter === "weak"
      ? `Weak words · ${cardCount}`
      : box !== undefined
        ? `Box ${box} · ${cardCount}`
        : undefined;

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  const onToggleStar = useCallback(
    (entry: DeckEntry) => void toggleStar(entry.setId, entry.card.id),
    [toggleStar],
  );

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="These cards no longer exist."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <StudyDeck
      deck={deck}
      title={studySet.title}
      mode="Flashcards"
      filterLabel={filterLabel}
      backToSetId={setId}
      allowShuffle
      onToggleStar={onToggleStar}
      headerRight={
        <Button
          variant={starredOnly ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setStarredOnly((v) => !v)}
          aria-label="Starred only"
        >
          <Star className={starredOnly ? "size-4 fill-fg" : "size-4"} />
        </Button>
      }
      emptyState={
        filter === "weak" ? (
          <EmptyState
            title="Nothing is giving you trouble"
            description="No words in this set are weak right now."
          />
        ) : (
          <EmptyState title="No cards" description="There are no cards to study in this set." />
        )
      }
      doneAction={
        <Button asChild variant="outline">
          <Link to="/sets/$setId" params={{ setId }}>
            Back to set
          </Link>
        </Button>
      }
    />
  );
}
