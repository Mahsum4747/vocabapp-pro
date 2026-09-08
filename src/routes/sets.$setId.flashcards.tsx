import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Shuffle, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { FlashCard } from "@/components/flash-card";
import { StudyChrome } from "@/components/study-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSet, useStudyStore } from "@/lib/store";
import { isCardActive } from "@/lib/types";
import { leitnerBoxOf } from "@/lib/quiz";
import { parseIntSearchParam, shuffle } from "@/lib/utils";
import { logReview } from "@/lib/review-log";

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
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const bumpMastery = useStudyStore((s) => s.bumpMastery);
  const markStudied = useStudyStore((s) => s.markStudied);

  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [done, setDone] = useState(false);
  // Session-only tally of grades given this visit — not persisted, resets on reload.
  const [stillLearningCount, setStillLearningCount] = useState(0);
  const [knowCount, setKnowCount] = useState(0);

  const boxCards = useMemo(() => {
    if (!studySet) return [];
    const active = studySet.cards.filter(isCardActive);
    return box !== undefined ? active.filter((c) => leitnerBoxOf(c) === box) : active;
  }, [studySet, box]);

  const source = useMemo(() => {
    const cards = starredOnly ? boxCards.filter((c) => c.starred) : boxCards;
    return cards.length > 0 ? cards : boxCards;
    // Keyed on the set id (not the studySet object) so starring/mastery
    // updates during a round — which replace `studySet` with a new object —
    // don't re-trigger the reset effect below and snap back to card 0.
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

  function handleGrade(grade: -1 | 1) {
    if (!card || !studySet) return;

    const isCorrect = grade === 1;
    bumpMastery(setId, card.id, isCorrect ? 1 : -1);
    if (isCorrect) setKnowCount((n) => n + 1);
    else setStillLearningCount((n) => n + 1);
    go(1);

    logReview({ setId: studySet.id, cardId: card.id, correct: isCorrect });
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
        <Button variant="outline" onClick={() => handleGrade(-1)}>
          Study again
        </Button>
        <Button onClick={() => handleGrade(1)}>I know it</Button>
      </div>
      <p className="mt-6 text-center text-xs text-subtle">
        Space to flip · arrow keys to move · S to star
      </p>
    </StudyChrome>
  );
}
