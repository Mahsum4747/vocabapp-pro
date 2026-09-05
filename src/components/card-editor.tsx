import { useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadCardImage } from "@/lib/card-images";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

export type EditorCard = { id: string; term: string; definition: string; imageUrl?: string | null };

const MAX_IMAGE_MB = MAX_IMAGE_BYTES / (1024 * 1024);

export function CardEditor({
  cards,
  onChange,
}: {
  cards: EditorCard[];
  onChange: (cards: EditorCard[]) => void;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function update(id: string, patch: Partial<EditorCard>) {
    onChange(cards.map((card) => (card.id === id ? { ...card, ...patch } : card)));
  }

  function remove(id: string) {
    onChange(cards.length <= 1 ? cards : cards.filter((card) => card.id !== id));
  }

  function add() {
    onChange([...cards, { id: crypto.randomUUID(), term: "", definition: "" }]);
  }

  async function uploadImage(id: string, file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      toast.error("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`Image is larger than ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await uploadCardImage({ data: formData });
      update(id, { imageUrl: url });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted tabular-nums">{index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(card.id)}
              aria-label="Delete card"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`term-${card.id}`}>Term</Label>
              <Input
                id={`term-${card.id}`}
                value={card.term}
                onChange={(e) => update(card.id, { term: e.target.value })}
                placeholder="e.g. mitochondria"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`def-${card.id}`}>Definition</Label>
              <Textarea
                id={`def-${card.id}`}
                value={card.definition}
                onChange={(e) => update(card.id, { definition: e.target.value })}
                placeholder="A short, clear definition"
                className="min-h-11 md:min-h-20"
              />
            </div>
          </div>
          <div className="mt-3">
            {card.imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={card.imageUrl}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover shadow-[var(--shadow-border)]"
                />
                <button
                  type="button"
                  onClick={() => update(card.id, { imageUrl: null })}
                  aria-label="Remove image"
                  className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-danger text-primary-fg shadow-[var(--shadow-border)]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <Label
                htmlFor={`image-${card.id}`}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-surface-2 px-3 text-sm font-medium text-fg hover:bg-border"
              >
                {uploadingId === card.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
                {uploadingId === card.id ? "Uploading…" : "Add image"}
                <input
                  id={`image-${card.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadingId !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadImage(card.id, file);
                  }}
                />
              </Label>
            )}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={add}>
        <Plus />
        Add card
      </Button>
    </div>
  );
}
