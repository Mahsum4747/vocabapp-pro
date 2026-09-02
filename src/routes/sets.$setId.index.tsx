import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ModeGrid } from "@/components/mode-grid";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { masteryPercent } from "@/lib/quiz";
import { serializeSetExport } from "@/lib/parse-cards";
import { useSet, useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/sets/$setId/")({
  component: SetPage,
});

function SetPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const navigate = useNavigate();
  const deleteSet = useStudyStore((s) => s.deleteSet);
  const toggleStar = useStudyStore((s) => s.toggleStar);
  const resetMastery = useStudyStore((s) => s.resetMastery);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set bulunamadı"
          description="Silinmiş veya bu cihazda yok."
          action={
            <Button asChild>
              <Link to="/">Kütüphaneye dön</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const mastery = masteryPercent(studySet.cards);
  const starred = studySet.cards.filter((c) => c.starred).length;

  function exportJson() {
    if (!studySet) return;
    const blob = new Blob([serializeSetExport(studySet)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studySet.title.replace(/\s+/g, "-").toLowerCase()}.karta.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Set indirildi.");
  }

  return (
    <AppShell>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Kütüphane
      </Link>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{studySet.subject}</Badge>
            <span className="text-sm text-muted tabular-nums">{studySet.cards.length} kart</span>
            {starred > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Star className="size-3.5 fill-fg" />
                {starred}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{studySet.title}</h1>
          {studySet.description ? (
            <p className="mt-2 max-w-2xl text-muted">{studySet.description}</p>
          ) : null}
          <div className="mt-5 max-w-sm space-y-2">
            <div className="flex justify-between text-xs text-muted">
              <span>Ustalık</span>
              <span className="tabular-nums">{mastery}%</span>
            </div>
            <Progress value={mastery} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/sets/$setId/edit" params={{ setId }}>
              <Pencil />
              Düzenle
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Diğer">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={exportJson}>
                <Download className="size-4" />
                Dışa aktar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  resetMastery(setId);
                  toast.success("İlerleme sıfırlandı.");
                }}
              >
                İlerlemeyi sıfırla
              </DropdownMenuItem>
              <DropdownMenuItem className="text-danger" onSelect={() => setConfirmDelete(true)}>
                <Trash2 className="size-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h2 className="mt-10 mb-4 font-display text-2xl font-medium tracking-tight">Çalış</h2>
      <ModeGrid setId={setId} disabled={studySet.cards.length < 2} />
      {studySet.cards.length < 2 ? (
        <p className="mt-3 text-sm text-muted">Çalışmak için en az iki kart gerekir.</p>
      ) : null}

      <h2 className="mt-12 mb-4 font-display text-2xl font-medium tracking-tight">Kartlar</h2>
      <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
        {studySet.cards.map((card) => (
          <li key={card.id} className="flex items-start gap-3 px-4 py-3 md:px-5">
            <button
              type="button"
              onClick={() => toggleStar(setId, card.id)}
              className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
              aria-label={card.starred ? "Yıldızı kaldır" : "Yıldızla"}
            >
              <Star className={card.starred ? "size-4 fill-fg text-fg" : "size-4"} />
            </button>
            <div className="grid min-w-0 flex-1 gap-1 md:grid-cols-2 md:gap-6">
              <p className="font-medium">{card.term}</p>
              <p className="text-sm text-muted md:text-base">{card.definition}</p>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogTitle>Set silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>
            {studySet.title} kalıcı olarak kalkar. Bu işlem geri alınamaz.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSet(setId);
                toast.success("Set silindi.");
                void navigate({ to: "/" });
              }}
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
