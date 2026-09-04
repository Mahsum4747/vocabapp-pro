import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SetCard } from "@/components/set-card";
import { PublicSetCard } from "@/components/public-set-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUBJECTS } from "@/lib/types";
import { masteryPercent } from "@/lib/quiz";
import { useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const sets = useStudyStore((s) => s.sets);
  const publicSets = useStudyStore((s) => s.publicSets);
  const restoreSeeds = useStudyStore((s) => s.restoreSeeds);
    const fetchSets = useStudyStore((s) => s.fetchSets);
  const fetchPublicSets = useStudyStore((s) => s.fetchPublicSets);

  useEffect(() => {
    fetchSets();
    fetchPublicSets();
  }, [fetchSets, fetchPublicSets]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("Hepsi");
  const [view, setView] = useState<"mine" | "public">("mine");

  // `sets` only ever holds the current user's own sets (getMySets/getSetById
  // are ownership-scoped), so excluding those ids from `publicSets` is the
  // same as excluding "my own public sets" — without pulling the auth client
  // into this route's bundle.
  const otherPublicSets = useMemo(() => {
    const ownIds = new Set(sets.map((s) => s.id));
    return publicSets.filter((set) => !ownIds.has(set.id));
  }, [publicSets, sets]);

  const continueSet = useMemo(() => {
    return [...sets]
      .filter((s) => s.lastStudiedAt)
      .sort((a, b) => (b.lastStudiedAt ?? 0) - (a.lastStudiedAt ?? 0))[0];
  }, [sets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return sets.filter((set) => {
      if (subject !== "Hepsi" && set.subject !== subject) return false;
      if (!q) return true;
      return (
        set.title.toLocaleLowerCase("tr").includes(q) ||
        set.description.toLocaleLowerCase("tr").includes(q) ||
        set.subject.toLocaleLowerCase("tr").includes(q) ||
        set.cards.some(
          (card) =>
            card.term.toLocaleLowerCase("tr").includes(q) ||
            card.definition.toLocaleLowerCase("tr").includes(q),
        )
      );
    });
  }, [sets, query, subject]);

  const subjects = ["Hepsi", ...SUBJECTS.filter((name) => sets.some((s) => s.subject === name))];

  return (
    <AppShell>
      <section className="stagger-in">
        <p className="text-sm font-medium text-muted">Kişisel kütüphane</p>
        <h1 className="mt-2 max-w-xl font-display text-4xl font-medium tracking-tight md:text-5xl">
          Bugün ne çalışacaksın?
        </h1>
        <p className="mt-3 max-w-lg text-muted">
         Kart çevir, öğren, test et, eşleştir. Setlerin tüm cihazlarında senkronize.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/create">
              <Plus />
              Yeni set
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/create" search={{ ai: true }}>
              <Sparkles />
              Konudan oluştur
            </Link>
          </Button>
        </div>
      </section>

      {continueSet ? (
        <Link
          to="/sets/$setId"
          params={{ setId: continueSet.id }}
          className="mt-10 flex flex-col justify-between gap-4 rounded-2xl bg-primary p-6 text-primary-fg shadow-[var(--shadow-card)] md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-medium tracking-wide text-primary-fg/70 uppercase">
              Kaldığın yer
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
              {continueSet.title}
            </h2>
            <p className="mt-1 text-sm text-primary-fg/75">
              {continueSet.cards.length} kart · %{masteryPercent(continueSet.cards)} ilerleme
            </p>
          </div>
          <span className="inline-flex h-11 items-center rounded-md bg-primary-fg px-4 text-sm font-medium text-primary">
            Devam et
          </span>
        </Link>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={() => setView("mine")}>
            <Badge tone={view === "mine" ? "primary" : "muted"}>Kütüphanem</Badge>
          </button>
          <button type="button" onClick={() => setView("public")}>
            <Badge tone={view === "public" ? "primary" : "muted"}>Herkese Açık Setler</Badge>
          </button>
        </div>
        {view === "mine" ? (
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Set veya kart ara"
              className="pl-10"
              aria-label="Ara"
            />
          </div>
        ) : null}
      </div>

      {view === "mine" ? (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {subjects.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSubject(name)}
                className="shrink-0"
              >
                <Badge tone={subject === name ? "primary" : "muted"}>{name}</Badge>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title={sets.length === 0 ? "Kütüphane boş" : "Sonuç yok"}
                description={
                  sets.length === 0
                    ? "İlk setini oluştur veya örnek setleri geri yükle."
                    : "Aramayı veya konuyu değiştir."
                }
                action={
                  sets.length === 0 ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button asChild>
                        <Link to="/create">Set oluştur</Link>
                      </Button>
                      <Button variant="outline" onClick={() => restoreSeeds()}>
                        Örnekleri yükle
                      </Button>
                    </div>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          )}
        </>
      ) : otherPublicSets.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Herkese açık set yok"
            description="Henüz kimse set paylaşmamış."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherPublicSets.map((set) => (
            <PublicSetCard key={set.id} set={set} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
