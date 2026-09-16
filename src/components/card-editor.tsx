import { useRef, useState } from "react";
import { HelpCircle, ImagePlus, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadCardImage } from "@/lib/card-images";
import { suggestCardContent } from "@/lib/suggest-card";
import { suggestExampleSentences } from "@/lib/example-suggestions";
import { previewGermanEnrichment } from "@/lib/german/preview-enrichment";
import { lookupBundledSuggestions } from "@/lib/german/bundled-suggestions";
import { suggestTermPrefix } from "@/lib/german/term-suggestions";
import { profileFor } from "@/lib/lang/profiles";
import type { LanguageCode } from "@/lib/lang/languages";
import type { CardEnrichment, GrammaticalGender } from "@/lib/types";
import type { BundledEntry } from "@/lib/german/types";
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
  /** Free-text personal memory aid — 100% user-authored, never suggested. */
  note?: string | null;
};

// Card images need Firebase Storage on a paid plan, which we're not on yet.
// The upload/display code stays in place (card-images.ts, FlashCard, the
// learn/test question renderers) — this just hides the editor's upload
// control until Storage billing is sorted out. Flip back to `true` then.
const IMAGE_UPLOAD_ENABLED = false;

const MAX_IMAGE_MB = MAX_IMAGE_BYTES / (1024 * 1024);

/** How long to wait after the last Term keystroke before asking for
 *  autocomplete suggestions — short enough to feel live, long enough that a
 *  fast typist doesn't fire a lookup per letter. */
const TERM_SUGGESTION_DEBOUNCE_MS = 200;

export function CardEditor({
  cards,
  onChange,
  termLanguage,
  termLangCode,
  defLangCode,
  definitionLanguage2,
  definitionLanguage2Code,
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
  /** The set's resolved PRIMARY definition-language code, if known. Used
   *  only to decide whether the bundled Definition tap-to-fill chips have
   *  anything to show (en/tr/ku) — unrelated to `suggest()`'s AI path,
   *  which is hardcoded to `DEFAULT_DEFINITION_LANGUAGE` regardless of this
   *  value (a pre-existing, out-of-scope behavior, left untouched here). */
  defLangCode?: LanguageCode;
  /** The set's second definition language, if it has one — shows a "Second
   *  definition" field per card, with its own AI suggestion. */
  definitionLanguage2?: string;
  /** Resolved code for `definitionLanguage2`, same purpose as `defLangCode`
   *  but for the second definition field's chip row. */
  definitionLanguage2Code?: LanguageCode;
  /** The set's subject/topic ("Family", "Travel", ...), if meaningfully
   *  set — passed to example suggestions as prompt flavour only (never
   *  part of the cache key; see example-suggestions.ts). The default
   *  "General" subject is treated as no topic. */
  topic?: string;
}) {
  const profile = profileFor(termLangCode);
  // Every handler below that needs "the current card/term" but might run
  // asynchronously (an onBlur-triggered network call, a promise
  // continuation) reads THIS, not the `cards` prop directly. A plain
  // closure over `cards` is only ever as fresh as the render that created
  // it — if a browser dispatches blur before React has committed the
  // render from the last keystroke (observed, reproducibly, when blur is
  // triggered by a mouse click to another field right after typing), the
  // handler's own `cards` closure can still be the PRE-typing snapshot
  // even though the input's live value and this ref both already show the
  // typed term. A ref's `.current` is mutated synchronously on every
  // render, before the browser can dispatch any event reacting to that
  // render, so dereferencing it here is never stale in the way a captured
  // `cards` binding can be. `update()` writes through it too, so a patch
  // computed from a stale closure can never clobber a newer one.
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  // Keyed `${cardId}:${field}` rather than just the card id: a card's primary
  // and second-definition suggestions are independent requests and can
  // genuinely overlap, same reasoning as two different cards overlapping.
  const [suggestingKeys, setSuggestingKeys] = useState<ReadonlySet<string>>(new Set());
  // Track pending suggestion awaiting user confirmation. `example` is
  // optional: an AI suggestion always includes one, a bundled-translation
  // chip pick never does (there's only one example field, already
  // independent of which language's translation was tapped) — confirmReplace
  // must not treat a missing `example` as "clear the field".
  const [confirmDialog, setConfirmDialog] = useState<{
    cardId: string;
    field: "primary" | "second";
    suggestion: { definition: string; example?: string };
  } | null>(null);
  // Per-card cache of the bundled (offline, zero-AI-call) lookup — checked
  // once per term change (Term field blur), feeding BOTH the example
  // panel's bundled-first step and the Definition field's tap-to-fill
  // chips from the same network call. `entry: null` means "checked, found
  // nothing bundled" — distinct from "not checked for this term yet"
  // (no key present, or `term` doesn't match the card's current term).
  const [bundled, setBundled] = useState<Record<string, { term: string; entry: BundledEntry | null }>>(
    {},
  );
  // Term-field autocomplete: an independent trigger (debounced onChange) and
  // independent state from the blur-triggered `bundled`/enrichment lookups
  // above, so the two can never race or duplicate each other. Same
  // term-matches-current-value staleness gate as `bundled` — a response for
  // an older keystroke is simply never shown once the term has moved on,
  // no separate cancellation needed.
  const [termSuggestions, setTermSuggestions] = useState<
    Record<string, { term: string; options: string[] }>
  >({});
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const suggestionTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Per-card inline example-suggestion panel: never written to except by
  // the explicit actions below (open the panel, retry, pick a suggestion,
  // close it) — nothing here is triggered by typing or by the term
  // changing. Keyed by card id; a card not present here has never opened
  // its panel.
  //
  // Statuses: "checking" (bundled lookup in flight, right after opening) ->
  // either "bundled" (examples found, shown alongside a "Generate with AI"
  // action) or "ai-only" (nothing bundled — the panel shows ONLY that AI
  // action, never auto-fetches); clicking it moves to "loading-ai" -> "ready"
  // or "error", exactly like the pre-bundled flow did.
  const [exampleSuggestions, setExampleSuggestions] = useState<
    Record<
      string,
      {
        open: boolean;
        status: "checking" | "bundled" | "ai-only" | "loading-ai" | "ready" | "error";
        examples: string[];
        error?: string;
        /** The term this result is for — a stale result from before an
         *  edit is never shown as current; toggling back open re-checks
         *  instead. */
        fetchedForTerm: string;
      }
    >
  >({});

  function update(id: string, patch: Partial<EditorCard>) {
    onChange(cardsRef.current.map((card) => (card.id === id ? { ...card, ...patch } : card)));
  }

  function remove(id: string) {
    const current = cardsRef.current;
    onChange(current.length <= 1 ? current : current.filter((card) => card.id !== id));
  }

  function add() {
    onChange([...cardsRef.current, { id: crypto.randomUUID(), term: "", definition: "" }]);
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
    const card = cardsRef.current.find((c) => c.id === id);
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
      // `example` is only ever present for an AI suggestion (see
      // `confirmDialog`'s doc comment) — omitting the key entirely when
      // it's absent, rather than passing `undefined`, so a translation
      // chip's confirm-replace can never blank out an existing example.
      update(cardId, {
        definition: suggestion.definition,
        ...(suggestion.example !== undefined ? { example: suggestion.example } : {}),
      });
    } else {
      update(cardId, { definition2: suggestion.definition });
    }
    setConfirmDialog(null);
  }

  /**
   * The bundled (offline, zero-AI-call) lookup for one card — fired on
   * blurring the Term field, alongside `checkGermanEnrichment`, and reused
   * by the example panel's opening step below rather than re-fetched. Feeds
   * two independent consumers from one network call: the example panel's
   * bundled-first step, and the Definition field's tap-to-fill chips.
   *
   * A failed lookup degrades to "nothing bundled" (`entry: null`) rather
   * than surfacing an error — same "best-effort preview only" reasoning
   * `checkGermanEnrichment` already applies: nothing here is load-bearing,
   * the AI/manual paths are always still available regardless.
   *
   * Returns the entry too (not just caching it in state), because a
   * caller that needs the value immediately after awaiting this — the
   * example panel's opening step — cannot rely on reading `bundled` back
   * out of the same render's stale closure.
   */
  async function checkBundledSuggestions(id: string): Promise<BundledEntry | null> {
    if (!profile.hasBundledSuggestions) return null;
    const card = cardsRef.current.find((c) => c.id === id);
    const term = card?.term.trim();
    if (!term) return null;
    let entry: BundledEntry | null = null;
    try {
      entry = await lookupBundledSuggestions({ data: { term } });
    } catch {
      entry = null;
    }
    setBundled((prev) => ({ ...prev, [id]: { term, entry } }));
    return entry;
  }

  /** The cached bundled entry for a card, or `null` if there isn't one YET
   *  for its current term — distinct from "checked, found nothing", which
   *  callers get by awaiting `checkBundledSuggestions` instead. Used by the
   *  Definition chip rows, which only ever want to read the cache, never
   *  trigger a fetch themselves (blurring the Term field already did). */
  function bundledEntryFor(card: EditorCard): BundledEntry | null {
    const term = card.term.trim();
    const cached = bundled[card.id];
    return cached && cached.term === term ? cached.entry : null;
  }

  /**
   * Debounced Term-field autocomplete — fires on every keystroke, unlike
   * checkGermanEnrichment/checkBundledSuggestions above (blur-only): a
   * genuinely different trigger, writing to its own `termSuggestions`
   * state, so it can never race or duplicate those lookups.
   */
  function scheduleTermSuggestions(id: string, term: string) {
    if (!profile.hasTermAutocomplete) return;
    const timers = suggestionTimers.current;
    if (timers[id] !== undefined) clearTimeout(timers[id]);
    const trimmed = term.trim();
    if (!trimmed) return;
    timers[id] = setTimeout(() => {
      void fetchTermSuggestions(id, trimmed);
    }, TERM_SUGGESTION_DEBOUNCE_MS);
  }

  async function fetchTermSuggestions(id: string, term: string) {
    let options: string[] = [];
    try {
      options = await suggestTermPrefix({ data: { prefix: term } });
    } catch {
      options = [];
    }
    setTermSuggestions((prev) => ({ ...prev, [id]: { term, options } }));
  }

  /** The cached suggestion list for a card's CURRENT term, or `[]` — same
   *  staleness gate as `bundledEntryFor`: a response that arrives after the
   *  term has moved on again is cached under its own (now-old) key and
   *  simply never matches, no separate cancellation needed. */
  function termSuggestionsFor(card: EditorCard): string[] {
    const term = card.term.trim();
    const cached = termSuggestions[card.id];
    return cached && cached.term === term ? cached.options : [];
  }

  /**
   * Fill the Term field from a picked suggestion — nothing else. The
   * existing blur-triggered `checkGermanEnrichment`/`checkBundledSuggestions`
   * do the rest naturally, exactly as they would for a hand-typed term:
   * this fires on `onMouseDown`, not `onClick`, specifically so it runs
   * BEFORE the input's blur — by the time those handlers read
   * `cardsRef.current`, it already reflects the picked term, the same
   * ref-freshness guarantee documented on `cardsRef` above. Not a new
   * fill mechanism, just the existing one given a moment to see the update.
   */
  function pickTermSuggestion(id: string, word: string) {
    update(id, { term: word });
    setActiveSuggestionId(null);
  }

  /** en/tr/ku words from a bundled entry for one resolved definition-
   *  language code, or `[]` for anything else (no entry yet, no code
   *  resolved, or a language this dataset doesn't cover) — the same "no
   *  data, no panel" rule the example side already follows. */
  function chipWordsFor(entry: BundledEntry | null, code: LanguageCode | undefined): string[] {
    if (!entry || !code) return [];
    if (code === "en" || code === "tr" || code === "ku") return entry.translations[code];
    return [];
  }

  /**
   * Opens the example panel for a card, checking the bundled dataset FIRST
   * — reusing an already-fresh `bundled` cache entry (the common case,
   * since the Term field's blur already ran this) rather than fetching
   * again. Bundled examples found -> shown immediately, zero AI calls.
   * Nothing bundled -> the panel shows ONLY the "Generate with AI" action;
   * it never auto-fetches from Gemini on its own.
   */
  async function openExamplePanel(id: string, term: string) {
    setExampleSuggestions((prev) => ({
      ...prev,
      [id]: { open: true, status: "checking", examples: [], fetchedForTerm: term },
    }));
    const cachedFresh = bundled[id]?.term === term;
    const entry = cachedFresh ? (bundled[id]?.entry ?? null) : await checkBundledSuggestions(id);
    if (entry && entry.examples.length > 0) {
      setExampleSuggestions((prev) => ({
        ...prev,
        [id]: { open: true, status: "bundled", examples: entry.examples, fetchedForTerm: term },
      }));
    } else {
      setExampleSuggestions((prev) => ({
        ...prev,
        [id]: { open: true, status: "ai-only", examples: [], fetchedForTerm: term },
      }));
    }
  }

  /**
   * Fetch 2–3 AI example-sentence candidates for one card — called ONLY
   * from the panel's "Generate with AI" action (shown alongside bundled
   * results, or alone when there are none) and the inline Retry action,
   * never from typing or a term change. Errors leave the card's `example`
   * field completely untouched; they only set this panel's own error
   * state, which the compact retry action reads.
   */
  async function fetchExampleSuggestions(id: string, term: string) {
    setExampleSuggestions((prev) => ({
      ...prev,
      [id]: { open: true, status: "loading-ai", examples: [], fetchedForTerm: term },
    }));
    const otherTerms = cardsRef.current
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
   * the panel's own actions (Generate with AI, Retry) that fetches or
   * checks anything. Toggles the panel closed if already open (whatever
   * its state); otherwise reuses an already-settled, still-current result
   * without any network call, and only re-checks when there's nothing
   * usable yet for this exact term. "checking"/"loading-ai" are
   * deliberately excluded from the reusable set: reopening mid-flight
   * should never be mistaken for a finished result.
   */
  function toggleExampleSuggestions(id: string) {
    const term = cardsRef.current.find((c) => c.id === id)?.term.trim();
    if (!term) return;
    const state = exampleSuggestions[id];
    if (state?.open) {
      setExampleSuggestions((prev) => ({ ...prev, [id]: { ...state, open: false } }));
      return;
    }
    const settled = state && state.status !== "checking" && state.status !== "loading-ai";
    if (settled && state.fetchedForTerm === term) {
      setExampleSuggestions((prev) => ({ ...prev, [id]: { ...state, open: true } }));
      return;
    }
    void openExamplePanel(id, term);
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
   * A tap on a bundled Definition/Definition2 translation chip — the ONLY
   * writer of `definition`/`definition2` outside `suggest()`'s own AI flow.
   * Same fill-or-confirm shape as `suggest()`: applies directly when the
   * field is empty, otherwise opens the existing confirm dialog (reused as-
   * is; `suggestion.example` is simply omitted, which `confirmReplace`
   * treats as "don't touch the example field").
   */
  function pickTranslationChip(id: string, field: "primary" | "second", word: string) {
    const card = cardsRef.current.find((c) => c.id === id);
    const currentValue = field === "primary" ? card?.definition : card?.definition2;
    if (currentValue?.trim()) {
      setConfirmDialog({ cardId: id, field, suggestion: { definition: word } });
      return;
    }
    if (field === "primary") {
      update(id, { definition: word });
    } else {
      update(id, { definition2: word });
    }
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
    const card = cardsRef.current.find((c) => c.id === id);
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
    const current = cardsRef.current.find((c) => c.id === id)?.enrichment;
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
              <div className="relative">
                <Input
                  id={`term-${card.id}`}
                  value={card.term}
                  onChange={(e) => {
                    update(card.id, { term: e.target.value });
                    scheduleTermSuggestions(card.id, e.target.value);
                    setActiveSuggestionId(card.id);
                  }}
                  onFocus={() => setActiveSuggestionId(card.id)}
                  onBlur={() => {
                    void checkGermanEnrichment(card.id);
                    void checkBundledSuggestions(card.id);
                    setActiveSuggestionId(null);
                  }}
                  placeholder="e.g. mitochondria"
                  autoComplete="off"
                />
                {profile.hasTermAutocomplete &&
                activeSuggestionId === card.id &&
                termSuggestionsFor(card).length > 0 ? (
                  <div className="absolute z-10 mt-1 w-full space-y-0.5 rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]">
                    {termSuggestionsFor(card).map((word) => (
                      <button
                        key={word}
                        type="button"
                        onMouseDown={() => pickTermSuggestion(card.id, word)}
                        className="block w-full rounded-md px-2.5 py-1.5 text-left text-sm text-fg hover:bg-surface-2"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
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
              {/* Quizlet-style tap-to-fill: bundled translations only, never
                  AI-generated. Nothing renders when there's no bundled hit
                  for this term/language — same "no empty state" rule the
                  example panel follows. */}
              {chipWordsFor(bundledEntryFor(card), defLangCode).length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {chipWordsFor(bundledEntryFor(card), defLangCode).map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => pickTranslationChip(card.id, "primary", word)}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg hover:bg-border"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              ) : null}
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
          {card.enrichment?.governs?.length ? (
            <div className="mt-2 space-y-1.5">
              <Label>Verb + preposition</Label>
              <div className="flex flex-wrap gap-1.5">
                {card.enrichment.governs.map((g) => (
                  <span
                    key={`${g.preposition}-${g.case}`}
                    className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg"
                  >
                    {card.term.trim()} <strong>{g.preposition}</strong> +{" "}
                    {g.case === "akkusativ" ? "Akkusativ" : "Dativ"}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {card.enrichment?.directCase ? (
            <div className="mt-2 space-y-1.5">
              <Label>Direct object</Label>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg">
                  {card.term.trim()} + <strong>jemandem</strong> (Dativ)
                </span>
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
                {exampleSuggestions[card.id]?.status === "checking" ? (
                  <div className="flex items-center gap-2 py-1 text-sm text-muted">
                    <Loader2 className="size-3.5 animate-spin" />
                    Checking…
                  </div>
                ) : exampleSuggestions[card.id]?.status === "loading-ai" ? (
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
                ) : exampleSuggestions[card.id]?.status === "ai-only" ? (
                  // Nothing bundled for this term — the AI action is the
                  // ONLY thing shown, and it is never fired automatically.
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void fetchExampleSuggestions(card.id, card.term.trim())}
                  >
                    <Sparkles className="size-3.5" />
                    Generate with AI
                  </Button>
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
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => closeExampleSuggestions(card.id)}
                        className="px-0.5 text-xs text-muted hover:text-fg"
                      >
                        Hide suggestions
                      </button>
                      {exampleSuggestions[card.id]?.status === "bundled" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto py-0.5"
                          onClick={() => void fetchExampleSuggestions(card.id, card.term.trim())}
                        >
                          <Sparkles className="size-3.5" />
                          Generate with AI
                        </Button>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
          <div className="mt-3 space-y-1.5">
            <Label htmlFor={`note-${card.id}`}>Personal note (optional)</Label>
            <Textarea
              id={`note-${card.id}`}
              value={card.note ?? ""}
              onChange={(e) => update(card.id, { note: e.target.value })}
              placeholder="Your own memory aid, mnemonic, or reminder"
              className="min-h-11"
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
              {chipWordsFor(bundledEntryFor(card), definitionLanguage2Code).length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {chipWordsFor(bundledEntryFor(card), definitionLanguage2Code).map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => pickTranslationChip(card.id, "second", word)}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg hover:bg-border"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              ) : null}
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
