import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CardEditor, type EditorCard } from "@/components/card-editor";
import { EmptyState } from "@/components/empty-state";
import { GenerateDialog } from "@/components/generate-dialog";
import { ImportDialog } from "@/components/import-dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECTS } from "@/lib/types";
import { useSet, useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/sets/$setId/edit")({
  component: EditPage,
});

function EditPage() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const navigate = useNavigate();
  const updateSetMeta = useStudyStore((s) => s.updateSetMeta);
  const replaceCards = useStudyStore((s) => s.replaceCards);

  const [title, setTitle] = useState(studySet?.title ?? "");
  const [description, setDescription] = useState(studySet?.description ?? "");
  const [subject, setSubject] = useState(studySet?.subject ?? "Genel");
  const [cards, setCards] = useState<EditorCard[]>(
    studySet?.cards.map((c) => ({ id: c.id, term: c.term, definition: c.definition })) ?? [],
  );

  useEffect(() => {
    if (!studySet) return;
    setTitle(studySet.title);
    setDescription(studySet.description);
    setSubject(studySet.subject);
    setCards(studySet.cards.map((c) => ({ id: c.id, term: c.term, definition: c.definition })));
  }, [studySet]);

  if (!studySet) {
    return (
      <AppShell>
        <EmptyState
          title="Set bulunamadı"
          description="Düzenlenecek bir set yok."
          action={
            <Button asChild>
              <Link to="/">Kütüphaneye dön</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  function save() {
    const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
    if (!title.trim()) {
      toast.error("Başlık gerekli.");
      return;
    }
    if (filled.length < 2) {
      toast.error("En az iki kart ekle.");
      return;
    }
    updateSetMeta(setId, { title, description, subject });
    replaceCards(setId, filled);
    toast.success("Değişiklikler kaydedildi.");
    void navigate({ to: "/sets/$setId", params: { setId } });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-muted">Düzenle</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">{studySet.title}</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          <GenerateDialog
            onGenerated={(generated) => {
              setTitle(generated.title);
              setDescription(generated.description ?? "");
              setSubject(generated.subject || subject);
              setCards(
                generated.cards.map((card) => ({
                  id: crypto.randomUUID(),
                  term: card.term,
                  definition: card.definition,
                })),
              );
            }}
          />
          <ImportDialog
            onImport={(incoming) =>
              setCards((prev) => [...prev.filter((c) => c.term || c.definition), ...incoming])
            }
          />
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Başlık</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Açıklama</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((name) => (
              <Button
                key={name}
                type="button"
                size="sm"
                variant={subject === name ? "default" : "secondary"}
                onClick={() => setSubject(name)}
              >
                {name}
              </Button>
            ))}
          </div>
          <CardEditor cards={cards} onChange={setCards} />
          <div className="sticky bottom-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" asChild>
              <Link to="/sets/$setId" params={{ setId }}>
                Vazgeç
              </Link>
            </Button>
            <Button type="submit" size="lg">
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
