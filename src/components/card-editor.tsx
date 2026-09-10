import { useState } from "react";
import { HelpCircle, ImagePlus, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadCardImage } from "@/lib/card-images";
import { suggestCardContent } from "@/lib/suggest-card";
import { suggestExampleSentences } from "@/lib/example-suggestions";
import { previewGermanEnrichment } from "@/lib/german/preview-enrichment";
import { profileFor } from "@/lib/lang/profiles";
import type { LanguageCode } from "@/lib/lang/languages";
import type { CardEnrichment, GrammaticalGender } from "@/lib/types";
import { Button } from "./ui/button";
import { Input, Select, Textarea } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tooltip } from "./ui/tooltip";

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
  /** Gender/plural for a noun in a language that has them (German today).
   *  See CardEnrichment in lib/types.ts. */
  enrichment?: CardEnrichment | null;
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
  termLangCode,
  definitionLanguage2,
  topic,
}: {
  cards: EditorCard[];
  onChange: (cards: EditorCard[]) => void;
  /** The set's term language, if known — passed to the AI suggestion so its
   *  example sentence is written in the right language. */
  termLanguage?: string;
  /** The set's resolved term-language code. Drives whether the
   *  gender/plural row shows at all — `profileFor` is the single place
   *  that decision is made, so this stays in sync with the server's own
   *  gate in card-enrichment-policy.ts without a second `=== 'de'` check
   *  here. */
  termLangCode?: LanguageCode;
  /** The set's second definition language, if it has one — shows a "Second
   *  definition" field per card, with its own AI suggestion. */
  definitionLanguage2?: string;
  /** The set's subject/topic ("Family", "Travel", ...), if meaningfully
   *  set — passed to example suggestions as prompt flavour only (never
   *  part of the cache key; see example-suggestions.ts). The default
   *  "General" subject is treated as no topic. */
  topic?: string;
}) {
  const profile = profileFor(termLangCode);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  // Keyed `${cardId}:${field}` rather than just the card id: a card's primary
  // and second-definition suggestions are independent requests and can
  // genuinely overlap, same reasoning as two different cards overlapping.
  const [suggestingKeys, setSuggestingKeys] = useState<ReadonlySet<string>>(new Set());
  // Track pending suggestion awaiting user confirmation
  const [confirmDialog, setConfirmDialog] = useState<{
    cardId: string;
    field: "primary" | "second";
    suggestion: { definition: string; example: string };
  } | null>(null);
  // Per-card inline example-suggestion panel: never written to except by
  // the explicit actions below (open the panel, retry, pick a suggestion,
  // close it) — nothing here is triggered by typing or by the term
  // changing. Keyed by card id; a card not present here has never opened
  // its panel.
  const [exampleSuggestions, setExampleSuggestions] = useState<
    Record<
      string,
      {
        open: boolean;
        status: "loading" | "ready" | "error";
        examples: string[];
        error?: string;
        /** The term this result is for — a stale result from before an
         *  edit is never shown as current; toggling back open re-fetches
         *  instead. */
        fetchedForTerm: string;
      }
    >
  >({});

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
   * the term, one Gemini call per field. An explicit "ask again" action.
   *
   * If the field is already filled, shows a confirmation dialog before replacing.
   * If empty, applies the suggestion directly.
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

    // Check if field is already filled
    const currentValue = field === "primary" ? card?.definition : card?.definition2;
    const isFilled = currentValue?.trim();

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

      // If field is filled, ask for confirmation; otherwise apply directly
      if (isFilled) {
        setConfirmDialog({ cardId: id, field, suggestion: result });
      } else {
        if (field === "primary") {
          update(id, { definition: result.definition, example: result.example });
        } else {
          update(id, { definition2: result.definition });
        }
      }
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

  function confirmReplace() {
    if (!confirmDialog) return;
    const { cardId, field, suggestion } = confirmDialog;
    if (field === "primary") {
      update(cardId, { definition: suggestion.definition, example: suggestion.example });
    } else {
      update(cardId, { definition2: suggestion.definition });
    }
    setConfirmDialog(null);
  }

  /**
   * Fetch 2–3 example-sentence candidates for one card and open its panel —
   * called ONLY from the "Suggest example" button's click and its inline
   * Retry action, never from typing or a term change. Errors leave the
   * card's `example` field completely untouched; they only set this panel's
   * own error state, which the compact retry action reads.
   */
  async function fetchExampleSuggestions(id: string, term: string) {
    setExampleSuggestions((prev) => ({
      ...prev,
      [id]: { open: true, status: "loading", examples: [], fetchedForTerm: term },
    }));
    const otherTerms = cards
      .filter((c) => c.id !== id && c.term.trim())
      .map((c) => c.term.trim())
      .slice(0, 5);
    const topicText =
      topic?.trim() && topic.trim().toLowerCase() !== "general" ? topic.trim() : undefined;
    try {
      const result = await suggestExampleSentences({
        data: {
          term,
          ...(termLanguage ? { termLanguage } : {}),
          ...(termLangCode ? { termLangCode } : {}),
          definitionLanguage: DEFAULT_DEFINITION_LANGUAGE,
          ...(topicText ? { topic: topicText } : {}),
          ...(otherTerms.length > 0 ? { existingTerms: otherTerms } : {}),
        },
      });
      if (!result.ok) {
        setExampleSuggestions((prev) => ({
          ...prev,
          [id]: { open: true, status: "error", examples: [], error: result.error, fetchedForTerm: term },
        }));
        return;
      }
      setExampleSuggestions((prev) => ({
        ...prev,
        [id]: { open: true, status: "ready", examples: result.examples, fetchedForTerm: term },
      }));
    } catch {
      setExampleSuggestions((prev) => ({
        ...prev,
        [id]: {
          open: true,
          status: "error",
          examples: [],
          error: "Couldn't get suggestions, try again.",
          fetchedForTerm: term,
        },
      }));
    }
  }

  /**
   * The "Suggest example" button's click handler — the ONLY place besides
   * Retry that fetches. Toggles the panel closed if already open (whatever
   * its state); otherwise reuses an already-fetched, still-current result
   * without a network call, and only fetches fresh when there's nothing
   * usable yet for this exact term.
   */
  function toggleExampleSuggestions(id: string) {
    const term = cards.find((c) => c.id === id)?.term.trim();
    if (!term) return;
    const state = exampleSuggestions[id];
    if (state?.open) {
      setExampleSuggestions((prev) => ({ ...prev, [id]: { ...state, open: false } }));
      return;
    }
    if (state?.status === "ready" && state.fetchedForTerm === term) {
      setExampleSuggestions((prev) => ({ ...prev, [id]: { ...state, open: true } }));
      return;
    }
    void fetchExampleSuggestions(id, term);
  }

  function closeExampleSuggestions(id: string) {
    setExampleSuggestions((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], open: false } } : prev,
    );
  }

  /** The only place a suggestion ever reaches the Example field — an
   *  explicit click on one specific sentence. Closes the panel afterward
   *  so focus returns to the (now-filled) field, ready to edit. */
  function pickExampleSuggestion(id: string, sentence: string) {
    update(id, { example: sentence });
    closeExampleSuggestions(id);
  }

  /**
   * Fill a card's gender/plural from the dictionary — automatic (fired on
   * blurring the Term field), not a button, and never asks for confirmation:
   * dictionary-or-nothing, silent either way. Never overwrites a value the
   * user has already corrected themselves (`source: "user"`) — that check
   * happens before the request is even sent, the same "don't ask, just
   * don't clobber" rule the server enforces on save in
   * card-enrichment-policy.ts. A failed or empty lookup is a silent no-op:
   * the server still computes the authoritative value at save time
   * regardless of whether this preview ran or succeeded.
   */
  async function checkGermanEnrichment(id: string) {
    if (!profile.hasNounEnrichment) return;
    const card = cards.find((c) => c.id === id);
    const term = card?.term.trim();
    if (!term || card?.enrichment?.source === "user") return;
    try {
      const result = await previewGermanEnrichment({ data: { term } });
      update(id, { enrichment: result });
    } catch {
      // Best-effort preview only.
    }
  }

  /** A user typing directly into the gender/plural row always wins, and
   *  always starts from what's currently shown (dictionary guess or not)
   *  so correcting one field doesn't blank out the other. */
  function setEnrichmentField(id: string, field: "gender" | "plural", value: string) {
    const current = cards.find((c) => c.id === id)?.enrichment;
    const gender: GrammaticalGender | undefined =
      field === "gender" ? (value as GrammaticalGender) || undefined : current?.gender;
    const plural = field === "plural" ? value.trim() || undefined : current?.plural;
    update(id, {
      enrichment: { source: "user", ...(gender ? { gender } : {}), ...(plural ? { plural } : {}) },
    });
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
                onBlur={() => void checkGermanEnrichment(card.id)}
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
          {profile.hasNounEnrichment ? (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor={`gender-${card.id}`}>Gender &amp; plural (optional)</Label>
                {card.enrichment?.inferred ? (
                  <Tooltip content="Guessed from a compound word — check it">
                    <Badge tone="accent" className="gap-1 px-1.5 py-0.5">
                      <HelpCircle className="size-3" />
                      guess
                    </Badge>
                  </Tooltip>
                ) : null}
              </div>
              <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                <Select
                  id={`gender-${card.id}`}
                  value={card.enrichment?.gender ?? ""}
                  onChange={(e) => setEnrichmentField(card.id, "gender", e.target.value)}
                  aria-label="Gender"
                >
                  <option value="">—</option>
                  <option value="m">der (m)</option>
                  <option value="f">die (f)</option>
                  <option value="n">das (n)</option>
                </Select>
                <Input
                  value={card.enrichment?.plural ?? ""}
                  onChange={(e) => setEnrichmentField(card.id, "plural", e.target.value)}
                  placeholder="Plural, e.g. Tische"
                  aria-label="Plural"
                />
              </div>
            </div>
          ) : null}
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
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`example-${card.id}`}>Example sentence (optional)</Label>
              {profile.hasExampleSuggestions ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0.5"
                  disabled={!card.term.trim()}
                  onClick={() => toggleExampleSuggestions(card.id)}
                >
                  <Sparkles className="size-3.5" />
                  Suggest example
                </Button>
              ) : null}
            </div>
            <Input
              id={`example-${card.id}`}
              value={card.example ?? ""}
              onChange={(e) => update(card.id, { example: e.target.value })}
              placeholder="A sentence using the term"
            />
            {/* Inline, optional, non-destructive: opened only by the button
                above, never by typing or by the term changing. Selecting a
                row is the only path that writes to `example`. */}
            {exampleSuggestions[card.id]?.open ? (
              <div className="space-y-1.5 rounded-lg bg-surface-2 p-2.5">
                {exampleSuggestions[card.id]?.status === "loading" ? (
                  <div className="flex items-center gap-2 py-1 text-sm text-muted">
                    <Loader2 className="size-3.5 animate-spin" />
                    Loading suggestions…
                  </div>
                ) : exampleSuggestions[card.id]?.status === "error" ? (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-danger">
                      {exampleSuggestions[card.id]?.error ?? "Couldn't get suggestions."}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void fetchExampleSuggestions(card.id, card.term.trim())}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    {exampleSuggestions[card.id]?.examples.map((sentence, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => pickExampleSuggestion(card.id, sentence)}
                        className="block w-full rounded-md bg-surface px-2.5 py-2 text-left text-sm text-fg shadow-[var(--shadow-border)] hover:bg-border"
                      >
                        {sentence}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => closeExampleSuggestions(card.id)}
                      className="px-0.5 text-xs text-muted hover:text-fg"
                    >
                      Hide suggestions
                    </button>
                  </>
                )}
              </div>
            ) : null}
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

      <Dialog open={confirmDialog !== null} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent title="Replace existing content?">
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted">
              This field already has content. Replace it with the AI suggestion?
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button className="flex-1" onClick={confirmReplace}>
                  Replace
                </Button>
                <DialogClose asChild>
                  <Button className="flex-1" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
