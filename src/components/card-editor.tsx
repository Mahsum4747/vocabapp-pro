import { useState } from "react";
import { ImagePlus, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadCardImage } from "@/lib/card-images";
import { suggestCardContent } from "@/lib/suggest-card";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

/** The language a card's primary definition is written in — fixed, not a
 *  per-set setting; matches the default already used in Generate-from-topic. */
const DEFAULT_DEFINITION_LANGUAGE = "English";

export type EditorCard = {
  id: string;
  term: string;
  definition: string;
  imageUrl?: string | null;
  example?: string | null;
  definition2?: string | null;
};

// Card images need Firebase Storage on a paid plan, which we're not on yet.
// The upload/display code stays in place (card-images.ts, FlashCard, the
// learn/test question renderers) — this just hides the editor's upload
// control until Storage billing is sorted out. Flip back to `true` then.
const IMAGE_UPLOAD_ENABLED = false;

const MAX_IMAGE_MB = MAX_IMAGE_BYTES / (1024 * 1024);

export function CardEditor({
  cards,
  onChange,
  termLanguage,
  definitionLanguage2,
}: {
  cards: EditorCard[];
  onChange: (cards: EditorCard[]) => void;
  /** The set's term language, if known — passed to the AI suggestion so its
   *  example sentence is written in the right language. */
  termLanguage?: string;
  /** The set's second definition language, if it has one — shows a "Second
   *  definition" field per card, with its own AI suggestion. */
  definitionLanguage2?: string;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  // Keyed `${cardId}:${field}` rather than just the card id: a card's primary
  // and second-definition suggestions are independent requests and can
  // genuinely overlap, same reasoning as two different cards overlapping.
  const [suggestingKeys, setSuggestingKeys] = useState<ReadonlySet<string>>(new Set());

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

  /**
   * Fill a card's definition (and, for the primary field, its example) from
   * the term, one Gemini call per field. Overwrites whatever was there — an
   * explicit "ask again" action, not something that fires on its own.
   *
   * The second-definition suggestion reuses this same call, parameterized on
   * `definitionLanguage2` instead of the fixed primary language — it still
   * gets an `example` back (the prompt always asks for one), but discards
   * it: there is only one example field, already filled by the primary
   * suggestion, and it wouldn't make sense to overwrite it from a request
   * whose language wasn't even the term's.
   */
  async function suggest(id: string, field: "primary" | "second") {
    const card = cards.find((c) => c.id === id);
    const term = card?.term.trim();
    if (!term) return;
    if (field === "second" && !definitionLanguage2?.trim()) return;
    const key = `${id}:${field}`;
    setSuggestingKeys((prev) => new Set(prev).add(key));
    try {
      const result = await suggestCardContent({
        data: {
          term,
          ...(termLanguage ? { termLanguage } : {}),
          definitionLanguage: field === "primary" ? DEFAULT_DEFINITION_LANGUAGE : definitionLanguage2!.trim(),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (field === "primary") update(id, { definition: result.definition, example: result.example });
      else update(id, { definition2: result.definition });
    } catch {
      toast.error("Couldn't get a suggestion, try again.");
    } finally {
      setSuggestingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
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
              tabIndex={-1}
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
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!card.term.trim() || suggestingKeys.has(`${card.id}:primary`)}
              onClick={() => void suggest(card.id, "primary")}
            >
              {suggestingKeys.has(`${card.id}:primary`) ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              {suggestingKeys.has(`${card.id}:primary`) ? "Suggesting…" : "Suggest with AI"}
            </Button>
          </div>
          <div className="mt-1 space-y-1.5">
            <Label htmlFor={`example-${card.id}`}>Example sentence (optional)</Label>
            <Input
              id={`example-${card.id}`}
              value={card.example ?? ""}
              onChange={(e) => update(card.id, { example: e.target.value })}
              placeholder="A sentence using the term"
            />
          </div>
          {definitionLanguage2?.trim() ? (
            <div className="mt-3 space-y-1.5">
              <Label htmlFor={`def2-${card.id}`}>Second definition ({definitionLanguage2})</Label>
              <Textarea
                id={`def2-${card.id}`}
                value={card.definition2 ?? ""}
                onChange={(e) => update(card.id, { definition2: e.target.value })}
                placeholder={`The definition in ${definitionLanguage2}`}
                className="min-h-11"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!card.term.trim() || suggestingKeys.has(`${card.id}:second`)}
                  onClick={() => void suggest(card.id, "second")}
                >
                  {suggestingKeys.has(`${card.id}:second`) ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  {suggestingKeys.has(`${card.id}:second`) ? "Suggesting…" : "Suggest with AI"}
                </Button>
              </div>
            </div>
          ) : null}
          {IMAGE_UPLOAD_ENABLED && (
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
          )}
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={add}>
        <Plus />
        Add card
      </Button>
    </div>
  );
}
