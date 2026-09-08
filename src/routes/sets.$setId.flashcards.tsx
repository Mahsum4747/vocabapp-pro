import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Shuffle, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { FlashCard } from "@/components/flash-card";
import { StudyChrome } from "@/components/study-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSet, useSetProgress, useStudyStore } from "@/lib/store";
import { isCardActive, type ReviewRating } from "@/lib/types";
import { leitnerBoxOf } from "@/lib/quiz";
import { queuedCards } from "@/lib/srs";
import { parseIntSearchParam, shuffle } from "@/lib/utils";
import { useReviewLogger } from "@/lib/review-log";

type Search = { box?: number };

export const Route = createFileRoute("/sets/$setId/flashcards")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    box: parseIntSearchParam(search.box),
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const { setId } = Route.useParams();
  const { box } = Route.useSearch();
  const studySet = useSet(setId);
  const progress = useSetProgress(setId);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();

  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [done, setDone] = useState(false);
  // Session-only tally of grades given this visit — not persisted, resets on reload.
  const [stillLearningCount, setStillLearningCount] = useState(0);
  const [knowCount, setKnowCount] = useState(0);
  // When the current card was first shown, for the scheduler's response time.
  const [shownAt, setShownAt] = useState(() => Date.now());

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c, progress) === box) : active;
  }, [studySet, box, progress]);

  const source = useMemo(() => {
    const pool = starredOnly ? boxCards.filter((c) => c.starred) : boxCards;
    const cards = pool.length > 0 ? pool : boxCards;
    // Overdue first, then due, then weak, then new — the queue orders, the
    // scheduler decided the due dates it reads.
    return queuedCards(cards, progress, { now: Date.now() });
    // Keyed on the set id (not the studySet object, and not `progress`) so a
    // review landing mid-round — which replaces both with new objects — does
    // not rebuild the queue and snap back to card 0. The queue is a snapshot
    // taken when the round starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, box, starredOnly]);

  const filterLabel =
    box !== undefined
      ? `Box ${box} · ${boxCards.length} card${boxCards.length === 1 ? "" : "s"}`
      : undefined;

  useEffect(() => {
    setOrder(source.map((c) => c.id));
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }, [source]);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  const card = studySet?.cards.find((c) => c.id === order[index]);

  const go = useCallback(
    (delta: number) => {
      setFlipped(false);
      setIndex((i) => {
        const next = i + delta;
        if (next >= order.length) {
          setDone(true);
          return i;
        }
        return Math.max(0, next);
      });
    },
    [order.length],
  );

  function handleGrade(rating: ReviewRating) {
    if (!card || !studySet) return;

    if (rating === "again") setStillLearningCount((n) => n + 1);
    else setKnowCount((n) => n + 1);

    logReview({
      setId: studySet.id,
      cardId: card.id,
      rating,
      responseTimeMs: Date.now() - shownAt,
    });
    setShownAt(Date.now());
    go(1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key.toLowerCase() === "s" && card) toggleStar(setId, card.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, card, setId, toggleStar]);

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

  if (done) {
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Flashcards"
        index={order.length}
        total={order.length}
        filterLabel={filterLabel}
      >
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <h2 className="font-display text-3xl font-medium tracking-tight">Round over</h2>
          <p className="mt-2 text-sm text-muted">You flipped {order.length} cards.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={() => {
                setIndex(0);
                setFlipped(false);
                setDone(false);
              }}
            >
              Start over
            </Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Back to set
              </Link>
            </Button>
          </div>
        </div>
      </StudyChrome>
    );
  }

  if (!card) {
    return (
      <StudyChrome
        setId={setId}
        title={studySet.title}
        mode="Flashcards"
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        <EmptyState title="No cards" description="There are no cards to study in this set." />
      </StudyChrome>
    );
  }

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Flashcards"
      index={index}
      total={order.length}
      filterLabel={filterLabel}
      headerRight={
        <div className="flex items-center gap-1">
          <Button
            variant={starredOnly ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setStarredOnly((v) => !v)}
            aria-label="Starred only"
          >
            <Star className={starredOnly ? "size-4 fill-fg" : "size-4"} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Shuffle"
            onClick={() => {
              setOrder(shuffle(order));
              setIndex(0);
              setFlipped(false);
              setDone(false);
            }}
          >
            <Shuffle className="size-4" />
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex items-center justify-center gap-2">
        <Badge tone="primary">Still learning: {stillLearningCount}</Badge>
        <Badge tone="success">Know: {knowCount}</Badge>
      </div>
      <FlashCard
        term={card.term}
        definition={card.definition}
        example={card.example}
        imageUrl={card.imageUrl}
        termLanguage={studySet.termLanguage}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} disabled={index === 0}>
          Previous
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleStar(setId, card.id)}
          aria-label="Star"
        >
          <Star className={card.starred ? "size-5 fill-fg text-fg" : "size-5"} />
        </Button>
      </div>
      {/* The four FSRS ratings. How hard the recall felt is real information —
          it is what lets the scheduler separate "barely remembered" from
          "instant", so it is worth the extra buttons here. */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button variant="outline" onClick={() => handleGrade("again")}>
          Again
        </Button>
        <Button variant="outline" onClick={() => handleGrade("hard")}>
          Hard
        </Button>
        <Button variant="secondary" onClick={() => handleGrade("good")}>
          Good
        </Button>
        <Button onClick={() => handleGrade("easy")}>Easy</Button>
      </div>
      <p className="mt-6 text-center text-xs text-subtle">
        Space to flip · arrow keys to move · S to star
      </p>
    </StudyChrome>
  );
}
