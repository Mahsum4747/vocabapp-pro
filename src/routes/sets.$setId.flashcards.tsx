import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Shuffle, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { FlashCard } from "@/components/flash-card";
import { StudyChrome } from "@/components/study-chrome";
import { Button } from "@/components/ui/button";
import { useSet, useStudyStore } from "@/lib/store";
import { shuffle } from "@/lib/utils";

export const Route = createFileRoute("/sets/$setId/flashcards")({
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const bumpMastery = useStudyStore((s) => s.bumpMastery);
  const markStudied = useStudyStore((s) => s.markStudied);

  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [done, setDone] = useState(false);

  const source = useMemo(() => {
    if (!studySet) return [];
    const cards = starredOnly ? studySet.cards.filter((c) => c.starred) : studySet.cards;
    return cards.length > 0 ? cards : studySet.cards;
  }, [studySet, starredOnly]);

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
          title="Set bulunamadı"
          description="Bu kartlar artık yok."
          action={
            <Button asChild>
              <Link to="/">Kütüphaneye dön</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (done) {
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Kartlar" index={order.length} total={order.length}>
        <div className="mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <h2 className="font-display text-3xl font-medium tracking-tight">Tur bitti</h2>
          <p className="mt-2 text-sm text-muted">{order.length} kartı çevirdin.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={() => {
                setIndex(0);
                setFlipped(false);
                setDone(false);
              }}
            >
              Baştan
            </Button>
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

  if (!card) {
    return (
      <StudyChrome setId={setId} title={studySet.title} mode="Kartlar" index={0} total={0}>
        <EmptyState title="Kart yok" description="Bu sette çalışacak kart bulunmuyor." />
      </StudyChrome>
    );
  }

  return (
    <StudyChrome
      setId={setId}
      title={studySet.title}
      mode="Kartlar"
      index={index}
      total={order.length}
      headerRight={
        <div className="flex items-center gap-1">
          <Button
            variant={starredOnly ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setStarredOnly((v) => !v)}
            aria-label="Yalnız yıldızlılar"
          >
            <Star className={starredOnly ? "size-4 fill-fg" : "size-4"} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Karıştır"
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
      <FlashCard
        term={card.term}
        definition={card.definition}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} disabled={index === 0}>
          Önceki
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleStar(setId, card.id)}
          aria-label="Yıldızla"
        >
          <Star className={card.starred ? "size-5 fill-fg text-fg" : "size-5"} />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            bumpMastery(setId, card.id, -1);
            go(1);
          }}
        >
          Tekrar
        </Button>
        <Button
          onClick={() => {
            bumpMastery(setId, card.id, 1);
            go(1);
          }}
        >
          Biliyorum
        </Button>
      </div>
      <p className="mt-6 text-center text-xs text-subtle">
        Boşluk çevirir · ok tuşları gezer · S yıldızlar
      </p>
    </StudyChrome>
  );
}
