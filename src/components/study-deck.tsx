import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layers, Shuffle, Star } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import { FlashCard } from "./flash-card";
import { StudyChrome } from "./study-chrome";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useReviewLogger } from "@/lib/review-log";
import { playSound } from "@/lib/sound";
import type { Card, ReviewRating } from "@/lib/types";
import type { LanguageCode } from "@/lib/lang/languages";
import { cn, shuffle } from "@/lib/utils";

/**
 * One card in a study round, with the context needed to grade it.
 *
 * A round is not necessarily one set's worth of cards — /review draws from the
 * whole library — so each entry carries its own set id rather than the deck
 * having a single one.
 */
export type DeckEntry = {
  card: Card;
  /** The set's DOCUMENT id, which is where this card's review is recorded. */
  setId: string;
  /** Set name, shown under the card when a round spans more than one set. */
  setTitle?: string;
  termLanguage?: string;
  /** The set's resolved term-language code, if known — drives whether the
   *  flashcard front shows a gender article ("der Tisch"). Flashcards is
   *  currently the only mode that passes this; see Phase 3B-UI's Q3. */
  termLangCode?: LanguageCode;
  /** The set's second definition language, if it has one. */
  definitionLanguage2?: string;
  /** Why the queue picked this card now — "Overdue", "Due today", "New". */
  bandLabel?: string;
  /** Tint for the band chip. */
  bandTone?: "danger" | "primary" | "muted";
};

/**
 * The flashcards study loop: order, flipping, keyboard, and the four FSRS
 * ratings that feed `recordReview`.
 *
 * Shared rather than forked, so the set-scoped route and /review grade cards
 * through exactly the same path. Everything set-specific — which cards, the
 * starred filter, starring itself — is decided by the caller and passed in.
 */
export function StudyDeck({
  deck,
  title,
  mode,
  filterLabel,
  backToSetId,
  headerRight,
  allowShuffle = false,
  onToggleStar,
  doneAction,
  emptyState,
}: {
  /** A snapshot of the round. Changing its identity restarts the round. */
  deck: DeckEntry[];
  title: string;
  mode: string;
  filterLabel?: string;
  /** Back link target; falls back to the library when the round isn't one set's. */
  backToSetId?: string;
  headerRight?: ReactNode;
  allowShuffle?: boolean;
  onToggleStar?: (entry: DeckEntry) => void;
  /** Extra button on the round-over card, next to "Start over". */
  doneAction?: ReactNode;
  emptyState?: ReactNode;
}) {
  const logReview = useReviewLogger();

  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flip = useCallback(() => {
    playSound("cardFlip");
    setFlipped((f) => !f);
  }, []);
  const [done, setDone] = useState(false);
  // Session-only tally of grades given this visit — not persisted, resets on reload.
  const [stillLearningCount, setStillLearningCount] = useState(0);
  const [knowCount, setKnowCount] = useState(0);
  // When the current card was first shown, for the scheduler's response time.
  const [shownAt, setShownAt] = useState(() => Date.now());
  // Which order-index was last graded. A ref, not state, so a second click
  // event arriving before React re-renders (a double-click, a fast double-tap
  // on mobile) still sees the update — unlike the other three study modes,
  // flashcards has no "revealed" state to disable the buttons on, so this is
  // the only thing standing between one grade and the same card's review
  // landing twice.
  const lastGradedIndexRef = useRef<number | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, DeckEntry>();
    for (const entry of deck) map.set(entry.card.id, entry);
    return map;
  }, [deck]);

  useEffect(() => {
    setOrder(deck.map((e) => e.card.id));
    setIndex(0);
    setFlipped(false);
    setDone(false);
    lastGradedIndexRef.current = null;
  }, [deck]);

  const entry = byId.get(order[index] ?? "");
  const card = entry?.card;

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
    if (!entry) return;
    // Guards against the same card being graded twice from one action (a
    // double-click, or two rapid taps): once this index has been submitted,
    // it stays blocked until the user actually moves to a different card —
    // including back via "Previous", which must still allow a deliberate
    // re-grade.
    if (lastGradedIndexRef.current === index) return;
    lastGradedIndexRef.current = index;

    if (rating === "again") setStillLearningCount((n) => n + 1);
    else setKnowCount((n) => n + 1);

    logReview({
      setId: entry.setId,
      cardId: entry.card.id,
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
        flip();
      } else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key.toLowerCase() === "s" && entry && onToggleStar) onToggleStar(entry);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, entry, onToggleStar, flip]);

  const chromeRight =
    headerRight || allowShuffle ? (
      <div className="flex items-center gap-1">
        {headerRight}
        {allowShuffle ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Shuffle"
            onClick={() => {
              setOrder(shuffle(order));
              setIndex(0);
              setFlipped(false);
              setDone(false);
              lastGradedIndexRef.current = null;
            }}
          >
            <Shuffle className="size-4" />
          </Button>
        ) : null}
      </div>
    ) : null;

  if (done) {
    return (
      <StudyChrome
        setId={backToSetId}
        title={title}
        mode={mode}
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
                lastGradedIndexRef.current = null;
              }}
            >
              Start over
            </Button>
            {doneAction}
          </div>
        </div>
      </StudyChrome>
    );
  }

  if (!entry || !card) {
    return (
      <StudyChrome
        setId={backToSetId}
        title={title}
        mode={mode}
        index={0}
        total={0}
        filterLabel={filterLabel}
      >
        {emptyState ?? (
          <EmptyState title="No cards" description="There are no cards to study right now." />
        )}
      </StudyChrome>
    );
  }

  return (
    <StudyChrome
      setId={backToSetId}
      title={title}
      mode={mode}
      index={index}
      total={order.length}
      filterLabel={filterLabel}
      headerRight={
        <div className="flex items-center gap-2">
          {/* Why this card is up now. The queue already ordered the round by
              priority; showing the band makes that visible instead of magic. */}
          {entry.bandLabel ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
                entry.bandTone === "danger"
                  ? "bg-danger-soft text-danger"
                  : entry.bandTone === "primary"
                    ? "bg-primary text-primary-fg"
                    : "bg-surface-2 text-muted",
              )}
            >
              {entry.bandLabel}
            </span>
          ) : null}
          {chromeRight}
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
        definition2={card.definition2}
        definitionLanguage2={entry.definitionLanguage2}
        imageUrl={card.imageUrl}
        termLanguage={entry.termLanguage}
        enrichment={card.enrichment}
        termLangCode={entry.termLangCode}
        flipped={flipped}
        onFlip={flip}
      />
      {/* Which set this card came from — a mixed round pulls from the whole
          library, so this is the only thing on screen that says which one. A
          badge rather than a caption: it needs to actually be noticed. */}
      {entry.setTitle ? (
        <div className="mt-3 flex justify-center">
          <Badge className="max-w-full">
            <Layers className="size-3 shrink-0" />
            <span className="truncate">{entry.setTitle}</span>
          </Badge>
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} disabled={index === 0}>
          Previous
        </Button>
        {onToggleStar ? (
          <Button variant="ghost" size="icon" onClick={() => onToggleStar(entry)} aria-label="Star">
            <Star className={card.starred ? "size-5 fill-fg text-fg" : "size-5"} />
          </Button>
        ) : null}
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
        Space to flip · arrow keys to move{onToggleStar ? " · S to star" : ""}
      </p>
    </StudyChrome>
  );
}
