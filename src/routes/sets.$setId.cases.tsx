import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ExampleLine } from "@/components/example-line";
import { StudySessionShell } from "@/components/study-session-shell";
import { Button } from "@/components/ui/button";
import { a1NounTrEntry } from "@/content/a1-german-nouns-tr";
import { getArticleDrillProgress, recordArticleDrillAttempt } from "@/lib/article-drill";
import {
  CASE_LABEL,
  GENDER_LABEL_DE,
  caseFormFor,
  caseFormOptions,
  exampleForCase,
  type NounCase,
} from "@/lib/case-forms";
import { profileFor } from "@/lib/lang/profiles";
import { useReviewLogger } from "@/lib/review-log";
import { useSet, useStudyStore } from "@/lib/store";
import {
  isCardActive,
  resolveSetLanguages,
  type ArticleDrillProgress,
  type Card,
} from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/cases")({
  component: CaseDrillPage,
});

const NOUN_CASES: NounCase[] = ["akkusativ", "dativ"];

type Question = { card: Card; nounCase: NounCase };

/**
 * Phase 2, Adım 2: which inflected article form (den/dem/die/der/das) a
 * noun takes in Akkusativ or Dativ — the case grid. A1 scope: no Genitiv,
 * and Nominativ stays the separate der/die/das drill (sets.$setId.articles).
 *
 * The correct form comes from `caseFormFor` (src/lib/case-forms.ts), a
 * fixed table keyed on the card's own `enrichment.gender` — no new
 * declension field, no guessing. The app picks which case to ask per card
 * (never the learner inferring it from a sentence — that's Adım 3, parked).
 *
 * Grading is the SAME asymmetry as the article drill (Decision A), reusing
 * its exact mechanism rather than a new one: a correct tap only writes
 * `recordArticleDrillAttempt`'s counter (never `logReview`, so it can never
 * graduate a card on its own); a wrong tap writes that counter AND calls
 * `logReview({ rating: "again" })`, so it surfaces as due/weak in Home/Today.
 * This reuses `recordArticleDrillAttempt`/`getArticleDrillProgress` as-is —
 * the same Firestore-backed counter the article drill uses, keyed only by
 * cardId. That means case-form accuracy and article accuracy currently
 * share one ledger (it only affects this drill's own weakest-first
 * ordering, never scheduling/mastery) — a known tradeoff, not a hidden one;
 * see this task's closing note for the reasoning.
 */
function CaseDrillPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const setLanguages = resolveSetLanguages(studySet ?? {});
  const termProfile = profileFor(setLanguages.term);
  const markStudied = useStudyStore((s) => s.markStudied);
  const logReview = useReviewLogger();
  const explanationLanguage = useStudyStore((s) => s.profile?.explanationLanguage);
  const [round, setRound] = useState(0);

  // Same pool as the article drill: known gender required, or there is
  // nothing to decline. A card with no gender never enters this mode.
  const drillCards = useMemo<Card[]>(() => {
    if (!studySet || !termProfile.hasNounEnrichment) return [];
    return studySet.cards.filter((c) => isCardActive(c) && c.enrichment?.gender);
  }, [studySet, termProfile]);

  const priorProgressRef = useRef<Record<string, ArticleDrillProgress>>({});
  useEffect(() => {
    let cancelled = false;
    void getArticleDrillProgress({ data: { setId, kind: "case" } })
      .then((rows) => {
        if (cancelled) return;
        priorProgressRef.current = Object.fromEntries(rows.map((r) => [r.cardId, r]));
        setRound((n) => n + 1);
      })
      .catch(() => {
        // Best-effort ordering hint only — see the article drill's own note.
      });
    return () => {
      cancelled = true;
    };
  }, [setId]);

  // Bug fix: `drillCards` is a `.filter()` result, so it gets a brand new
  // array (and a new `studySet` reference upstream, e.g. from
  // `markStudied`'s `set()` call on mount) even when its actual CONTENT
  // hasn't changed. Keying the `order` memo below on that array directly
  // meant any such unrelated store update re-ran `Math.random()` for every
  // card's `nounCase` mid-round — including for the card currently on
  // screen, after it had already been graded against its old case. The
  // reveal line (and the grid's own correct/incorrect coloring) would then
  // show whatever case the card was RESHUFFLED into, not the one actually
  // asked — for a feminine noun, Nominativ and Akkusativ share the same
  // form ("die"), so a Dativ→Akkusativ reshuffle read as "it fell back to
  // Nominativ." This key is content-stable (same card ids ⇒ same string)
  // even though the array/object references churn.
  const drillCardIds = useMemo(() => drillCards.map((c) => c.id).join(","), [drillCards]);

  const order = useMemo<Question[]>(() => {
    const prior = priorProgressRef.current;
    const cards = shuffle(drillCards).sort((a, b) => {
      const pa = prior[a.id];
      const pb = prior[b.id];
      const accA = pa && pa.attempts > 0 ? pa.correct / pa.attempts : -1;
      const accB = pb && pb.attempts > 0 ? pb.correct / pb.attempts : -1;
      return accA - accB;
    });
    // The app picks the case, once per card per round — stable for the
    // round so re-rendering never swaps the question under the learner.
    return cards.map((card) => ({
      card,
      nounCase: NOUN_CASES[Math.floor(Math.random() * NOUN_CASES.length)],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drillCardIds, round]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const question = order[index];
  const revealed = selected !== null;
  const correctForm = question?.card.enrichment?.gender
    ? caseFormFor(question.card.enrichment.gender, question.nounCase)
    : undefined;
  const gender = question?.card.enrichment?.gender;
  const nominativeArticle = gender ? termProfile.articleFor?.(gender) : undefined;
  // Shown only when the sentence itself uses the asked case's form — a
  // Nominativ sentence under an Akkusativ/Dativ answer would teach the wrong
  // case, so it is hidden instead. Nothing is generated.
  const caseExample =
    question && correctForm
      ? exampleForCase(
          question.card.example,
          question.card.term,
          correctForm,
          nominativeArticle,
          question.nounCase,
        )
      : null;
  // Adım 4: same static TR pilot as the article drill. Missing entry falls
  // through to the card's own English `definition`, never a blank gloss.
  const trEntry =
    question && explanationLanguage === "tr" ? a1NounTrEntry(question.card.term, termProfile) : undefined;

  function choose(option: string) {
    if (!question || !studySet || revealed) return;
    const ok = option === correctForm;
    setSelected(option);
    if (ok) {
      setCorrectCount((n) => n + 1);
    } else {
      // Same reporting path as the article drill's miss: a real signal the
      // card isn't known yet, surfaced through the one mechanism every mode
      // uses for a wrong answer — never a bespoke one for this drill.
      logReview({ setId: studySet.id, cardId: question.card.id, rating: "again", missKind: "case" });
    }
    void recordArticleDrillAttempt({
      data: {
        cardId: question.card.id,
        setId: studySet.id,
        correct: ok,
        selectedArticle: option,
        correctArticle: correctForm ?? "",
        kind: "case",
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
      <StudySessionShell setId={setId} title={studySet.title} mode="Cases" index={0} total={0}>
        <EmptyState
          title="Nothing to decline yet"
          description="This set has no German nouns with a known gender yet."
        />
      </StudySessionShell>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / order.length) * 100);
    return (
      <StudySessionShell
        setId={setId}
        title={studySet.title}
        mode="Cases"
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
      mode="Cases"
      index={index}
      total={order.length}
      primaryAction={revealed ? { label: "Continue", onClick: next } : undefined}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {CASE_LABEL[question.nounCase]}
      </p>
      <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-headword text-balance">
        {question.card.term}
      </h2>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {caseFormOptions(question.nounCase).map((option) => {
          const isCorrectOption = option === correctForm;
          const isChosen = selected === option;
          const isWrongPick = revealed && isChosen && !isCorrectOption;
          const isAnswer = revealed && isCorrectOption;
          const dim = revealed && !isChosen && !isCorrectOption;
          // Same note model as the article drill: the label text stays
          // neutral (no gender color — die/der/das here are case forms, not
          // a gender), and the graded outline is the only frame. Wrong pick
          // = danger outline + "Your answer"; the answer = success outline +
          // Check; everything else fades. Never two loud frames at once.
          return (
            <div key={option} className="flex flex-col items-center gap-1">
              <button
                type="button"
                disabled={revealed}
                onClick={() => choose(option)}
                className={cn(
                  "w-full rounded-card border-2 bg-surface px-4 py-6 text-center text-lg font-semibold text-fg shadow-[var(--elevation-1)] transition-[box-shadow,opacity,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  isAnswer ? "border-success" : isWrongPick ? "border-danger" : "border-border",
                  !revealed && "hover:shadow-[var(--elevation-2)]",
                  dim && "opacity-30",
                )}
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  {option}
                  {isAnswer ? <Check className="size-5 text-success" aria-hidden="true" /> : null}
                </span>
              </button>
              <span className="h-4 text-xs text-muted">{isWrongPick ? "Your answer" : ""}</span>
            </div>
          );
        })}
      </div>
      {revealed && correctForm ? (
        <div className="mt-4">
          {/* One teaching block from fixed templates, no AI:
              nominative → case form · case · gender, then the case-inflected
              headword + gloss. `correctForm` is already the right inflected
              word, so it is placed directly (ArticleizedTerm would derive the
              NOMINATIVE article instead). */}
          <p className="text-sm font-medium text-fg">
            {nominativeArticle ? `${nominativeArticle} → ` : ""}
            {correctForm} · {CASE_LABEL[question.nounCase]}
            {gender ? ` · ${GENDER_LABEL_DE[gender]}` : ""}
          </p>
          <p className="mt-1 text-sm text-fg">
            {correctForm} {question.card.term} — {trEntry?.gloss ?? question.card.definition}
          </p>
          <ExampleLine
            example={caseExample}
            termLanguage={setLanguages.term ?? studySet.termLanguage}
            className="mt-1"
          />
        </div>
      ) : null}
    </StudySessionShell>
  );
}
