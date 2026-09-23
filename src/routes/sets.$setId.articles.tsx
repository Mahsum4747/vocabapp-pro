import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { articleTextClass } from "@/components/articleized-term";
import { EmptyState } from "@/components/empty-state";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { getArticleDrillProgress, recordArticleDrillAttempt } from "@/lib/article-drill";
import { profileFor } from "@/lib/lang/profiles";
import { useSet, useStudyStore } from "@/lib/store";
import {
  isCardActive,
  resolveSetLanguages,
  type ArticleDrillProgress,
  type Card,
  type GrammaticalGender,
} from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/articles")({
  component: ArticleDrillPage,
});

const GENDER_LABEL: Record<GrammaticalGender, string> = {
  m: "masculine",
  f: "feminine",
  n: "neuter",
};

// A round's errors are "concentrated" (worth a callout) only when one gender
// accounts for a clear majority, not just a plurality — three roughly equal
// genders (~33% each) must stay silent. Also require a few errors so 1-of-2
// doesn't read as a pattern.
const CONCENTRATION_MIN_ERRORS = 3;
const CONCENTRATION_MIN_SHARE = 0.5;

/** One line describing this round's dominant error gender, or null if there isn't one. */
function summarizeErrorPattern(
  errors: GrammaticalGender[],
  articleFor: (gender: GrammaticalGender) => string | undefined,
): string | null {
  if (errors.length < CONCENTRATION_MIN_ERRORS) return null;
  const counts = new Map<GrammaticalGender, number>();
  for (const gender of errors) counts.set(gender, (counts.get(gender) ?? 0) + 1);
  const [topGender, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCount / errors.length <= CONCENTRATION_MIN_SHARE) return null;
  const article = articleFor(topGender);
  const genderPhrase = article ? `${GENDER_LABEL[topGender]} words (${article})` : `${GENDER_LABEL[topGender]} words`;
  return `${topCount} of ${errors.length} errors were ${genderPhrase}.`;
}

/**
 * Phase 3C Part B: tests ONLY the article (der/die/das) for a German noun —
 * never the meaning, never the plural, and never the card's own term.
 *
 * Deliberately outside the main study loop: grading here goes through
 * `recordArticleDrillAttempt` (its own tiny counter, see article-drill.ts),
 * never `logReview`/`recordReview` — getting an article wrong must not touch
 * the card's FSRS schedule, mastery score, XP, or streak.
 */
function ArticleDrillPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const termProfile = profileFor(setLanguages.term);
  const markStudied = useStudyStore((s) => s.markStudied);
  const [round, setRound] = useState(0);

  const drillCards = useMemo<Card[]>(() => {
    if (!studySet || !termProfile.hasNounEnrichment) return [];
    return studySet.cards.filter((c) => isCardActive(c) && c.enrichment?.gender);
  }, [studySet, termProfile]);

  // Fetched once per set, not re-read reactively: this is only used to seed
  // the round's order (weakest-first), the same reason flashcards.tsx keeps
  // its deck a snapshot rather than rebuilding it as progress comes in — an
  // attempt landing mid-round must not reshuffle the cards under the user.
  const priorProgressRef = useRef<Record<string, ArticleDrillProgress>>({});
  useEffect(() => {
    let cancelled = false;
    void getArticleDrillProgress({ data: { setId } })
      .then((rows) => {
        if (cancelled) return;
        priorProgressRef.current = Object.fromEntries(rows.map((r) => [r.cardId, r]));
        setRound((n) => n + 1);
      })
      .catch(() => {
        // Best-effort ordering hint only — an empty pool just falls back to
        // "everything untried", which is a fine order too.
      });
    return () => {
      cancelled = true;
    };
  }, [setId]);

  const order = useMemo<Card[]>(() => {
    const prior = priorProgressRef.current;
    // Weakest (or never-attempted) first — a plain sort over already-loaded
    // state, same spirit as `weakCards`, not a new scheduler: nothing here
    // computes a due date or writes anything.
    return shuffle(drillCards).sort((a, b) => {
      const pa = prior[a.id];
      const pb = prior[b.id];
      const accA = pa && pa.attempts > 0 ? pa.correct / pa.attempts : -1;
      const accB = pb && pb.attempts > 0 ? pb.correct / pb.attempts : -1;
      return accA - accB;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drillCards, round]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  // This round's wrong-answer genders, kept only in memory — not a read from
  // articleDrillErrors, just today's `choose()` outcomes, cleared on restart.
  const [roundErrorGenders, setRoundErrorGenders] = useState<GrammaticalGender[]>([]);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    setRoundErrorGenders([]);
    setRound((n) => n + 1);
  }

  const card = order[index];
  const revealed = selected !== null;
  const correctArticle = card?.enrichment?.gender ? termProfile.articleFor?.(card.enrichment.gender) : undefined;

  function choose(option: string) {
    if (!card || !studySet || revealed) return;
    const ok = option === correctArticle;
    setSelected(option);
    if (ok) {
      setCorrectCount((n) => n + 1);
    } else if (card.enrichment?.gender) {
      setRoundErrorGenders((gs) => [...gs, card.enrichment!.gender!]);
    }
    void recordArticleDrillAttempt({
      data: {
        cardId: card.id,
        setId: studySet.id,
        correct: ok,
        selectedArticle: option,
        correctArticle: correctArticle ?? "",
      },
    });
  }

  function next() {
    setSelected(null);
    if (index + 1 >= order.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set not found"
          description="This set doesn't exist."
          action={
            <Button asChild>
              <Link to="/">Back to library</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (order.length === 0) {
    return (
      <StudySessionShell setId={setId} title={studySet.title} mode="Articles" index={0} total={0}>
        <EmptyState
          title="Nothing to drill yet"
          description="This set has no German nouns with a known gender yet."
        />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / order.length) * 100);
    const errorPattern = summarizeErrorPattern(roundErrorGenders, (g) => termProfile.articleFor?.(g));
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Articles"
        index={order.length}
        total={order.length}
      >
        <div className="mx-auto max-w-md rounded-card bg-surface p-8 text-center shadow-[var(--elevation-1)]">
          <p className="text-sm text-muted">Round result</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">
            {pct}%
          </p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {order.length} correct
          </p>
          {errorPattern ? <p className="mt-1 text-xs text-muted">{errorPattern}</p> : null}
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Practice again</Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Back to set
              </Link>
            </Button>
          </div>
        </div>
      </StudySessionShell>
    );
  }

  return (
    <StudySessionShell
      setId={setId}
      title={studySet.title}
      mode="Articles"
      index={index}
      total={order.length}
      primaryAction={revealed ? { label: "Continue", onClick: next } : undefined}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Which article?</p>
      <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-headword text-balance">
        {card.term}
      </h2>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {termProfile.articleWords.map((option) => {
          const isCorrectOption = option === correctArticle;
          const isChosen = selected === option;
          const show = revealed && (isCorrectOption || isChosen);
          // The two options that are neither the pick nor the answer fade
          // out, so the pick (and, if it was wrong, the answer) reads as the
          // only thing that changed. A correct pick is both, so it never dims.
          const dim = revealed && !isChosen && !isCorrectOption;
          // Grammar color (der/die/das) lives ONLY in the label text, always
          // — never in fill or border. Graded-answer color (success/danger)
          // lives ONLY in the outline (+ a Check icon for correct) once
          // revealed. Two separate color systems that can never land on the
          // same swatch: a das (teal) button marked wrong still reads "teal
          // text, danger outline", not a wash of near-identical greens.
          const toneBorder =
            show && isCorrectOption
              ? "border-success"
              : show && isChosen && !isCorrectOption
                ? "border-danger"
                : "border-border";
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => choose(option)}
              className={cn(
                "rounded-card border-2 bg-surface px-4 py-6 text-center text-lg font-semibold shadow-[var(--elevation-1)] transition-[background-color,box-shadow,opacity,transform,border-width,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                toneBorder,
                articleTextClass(option),
                !revealed && "hover:shadow-[var(--elevation-2)]",
                isChosen && "border-4 scale-[1.05]",
                dim && "opacity-30",
              )}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                {option}
                {/* The button's own fill/border never goes success-green —
                    Continue already owns that color as a real action button,
                    and das (teal) sitting near a green fill is exactly the
                    confusion this must avoid. The check is success-colored
                    on its own, independent of the (still article-colored)
                    label next to it. */}
                {show && isCorrectOption ? (
                  <Check className="size-5 text-success" aria-hidden="true" />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </StudySessionShell>
  );
}
