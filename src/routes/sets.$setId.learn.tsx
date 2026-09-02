import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { multipleChoice, writtenQuestion, type McQuestion, type WrittenQuestion } from "@/lib/quiz";
import { useSet, useStudyStore } from "@/lib/store";
import { answersMatch, shuffle, cn } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/learn")({
  component: LearnPage,
});

type Item = McQuestion | WrittenQuestion;

function LearnPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const bumpMastery = useStudyStore((s) => s.bumpMastery);
  const markStudied = useStudyStore((s) => s.markStudied);
  const [round, setRound] = useState(0);

  const items = useMemo<Item[]>(() => {
    if (!studySet) return [];
    const cards = shuffle(studySet.cards.filter((c) => c.term && c.definition));
    return cards.map((card) =>
      card.mastery >= 2 ? writtenQuestion(card) : multipleChoice(studySet.cards, card),
    );
    // round forces a fresh shuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet?.id, round]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [written, setWritten] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    markStudied(setId);
  }, [setId, markStudied]);

  function restart() {
    setIndex(0);
    setSelected(null);
    setWritten("");
    setRevealed(false);
    setCorrectCount(0);
    setDone(false);
    setRound((n) => n + 1);
  }

  const item = items[index];

  function grade(ok: boolean) {
    if (!item) return;
    setRevealed(true);
    if (ok) setCorrectCount((n) => n + 1);
    bumpMastery(setId, item.cardId, ok ? 1 : -1);
  }

  function next() {
    setSelected(null);
    setWritten("");
    setRevealed(false);
    if (index + 1 >= items.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set bulunamadı"
          action={
            <Button asChild>
              <Link to="/">Kütüphaneye dön</Link>
            </Button>
          }
          description="Bu set yok."
        />
      </AppShell>
    );
  }

  if (items.length === 0) {
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Öğren" index={0} total={0}>
        <EmptyState title="Kart yok" description="Öğrenmek için kart ekle." />
      </StudyChrome>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / items.length) * 100);
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Öğren" index={items.length} total={items.length}>
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted">Tur sonucu</p>
          <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{pct}%</p>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {items.length} doğru
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart}>Tekrar öğren</Button>
            <Button asChild variant="outline">
              <Link to="/sets/$setId" params={{ setId }}>
                Sete dön
              </Link>
            </Button>
          </div>
        </div>
      </StudyChrome>
    );
  }

  if (!item) return null;

  const isMc = item.type === "mc";
  const isCorrect = isMc ? selected === item.answer : answersMatch(written, item.answer);

  return (
    <StudyChrome setId={setId} title={studySet.title} mode="Öğren" index={index} total={items.length}>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">Tanımı karşılayan terim</p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance">{item.prompt}</h2>

      {isMc ? (
        <div className="mt-8 grid gap-2">
          {item.options.map((option) => {
            const chosen = selected === option;
            const show = revealed && (option === item.answer || chosen);
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setSelected(option);
                  grade(option === item.answer);
                }}
                className={cn(
                  "rounded-lg bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-150",
                  !revealed && "hover:shadow-[var(--shadow-border-hover)]",
                  show && option === item.answer && "bg-success-soft text-success",
                  show && chosen && option !== item.answer && "bg-danger-soft text-danger",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!revealed) grade(answersMatch(written, item.answer));
            else next();
          }}
        >
          <Input
            value={written}
            onChange={(e) => setWritten(e.target.value)}
            placeholder="Terimi yaz"
            disabled={revealed}
            autoFocus
          />
          {revealed ? (
            <p className={cn("text-sm", isCorrect ? "text-success" : "text-danger")}>
              {isCorrect ? "Doğru" : `Doğrusu: ${item.answer}`}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            {revealed ? "Devam" : "Kontrol et"}
          </Button>
        </form>
      )}

      {revealed && isMc ? (
        <Button className="mt-6 w-full" onClick={next}>
          Devam
        </Button>
      ) : null}
    </StudyChrome>
  );
}
