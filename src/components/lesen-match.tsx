import { matchingOptions } from "@/lib/german/lesen-matching-options";
import { Check, X } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LesenMatchingPassage, LesenSentenceInsertionPassage } from "@/lib/german/lesen-types";

/**
 * Real drag-and-drop for Lesen's B1/B2 matching (zuordnung_*) and
 * sentence-insertion (satz_einfuegen) item types — dnd-kit's `DndContext`
 * with pointer, touch and keyboard sensors all active, so the same
 * interaction works with a mouse, a finger, or Tab+Space+Arrows+Enter.
 *
 * Every draggable option is ALSO a plain button: a click selects it, then a
 * click on an empty target places it there. This isn't a fallback bolted on
 * for accessibility box-checking — it's the same `place()` function the
 * drag path calls, so both paths stay in sync by construction, and it gives
 * keyboard/switch users a direct route that doesn't depend on dnd-kit's own
 * (more fiddly, multi-key) keyboard drag sequence.
 *
 * Both boards share one shape: a pool of options, a set of targets/gaps
 * each needing exactly one option, "Check" once every slot is filled, then
 * a one-time correct/incorrect reveal (green/red) with no further edits —
 * same single-attempt-per-round pattern grammar.lesen.tsx's own choice
 * passages use, so `onComplete(correctCount, total)` slots into the exact
 * same round-result/grammarProgress-write flow regardless of question type.
 */

function useDndSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    // delay/tolerance (not distance) so a touch can still scroll the page
    // normally — only a touch that HOLDS roughly still for `delay` ms
    // commits to a drag. A real finger isn't as steady as a mouse, so
    // tolerance is noticeably looser than it needs to be for synthetic
    // test input: too tight and ordinary hand tremor during the hold
    // cancels the drag before it ever starts (root cause of "picks up but
    // never actually drags" on a real phone).
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 12 } }),
    useSensor(KeyboardSensor),
  );
}

/**
 * dnd-kit's default (no `collisionDetection` prop = `rectIntersection`)
 * requires the DRAGGED element's own rect to overlap a droppable's rect —
 * fragile here because the draggable "chip" and the `DropTarget`/`GapSlot`
 * it's dropped on are very different sizes, and because a mobile layout
 * stacks the option pool and its targets in one column (`grid-cols-1`
 * below `sm:`), so a real drag travels much further than it does on a wide
 * desktop viewport. `pointerWithin` checks whether the POINTER itself
 * (finger/cursor) is over a droppable, which is what a user actually
 * perceives as "I dropped it on that box" — this is what fixed a real
 * report of "drag starts but never lands" on an actual phone, not just in
 * a synthetic/desktop-sized test. `rectIntersection` stays as a fallback
 * for the rare case `pointerWithin` finds nothing (e.g. the pointer is a
 * pixel outside every droppable's padding box, even though the chip's
 * rect still visibly overlaps one) — the standard dnd-kit recipe for this,
 * not a guess.
 */
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

function OptionChip({
  id,
  disabled,
  selected,
  onToggleSelect,
  children,
}: {
  id: string;
  disabled?: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });
  const style = {
    touchAction: "none" as const,
    ...(transform
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
      : {}),
  };
  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onToggleSelect}
      className={cn(
        // touch-none (the Tailwind class) sets the SAME touch-action:none,
        // but styles.css has `button { touch-action: manipulation }`
        // deliberately placed outside any @layer specifically so it beats
        // Tailwind utilities on every <button> in the app — including this
        // one. That rule only governs the browser's own native gesture
        // recognizer, which a synthetic/dispatched TouchEvent in a test
        // never goes through (dispatchEvent bypasses it entirely), so this
        // silently broke real-finger vertical dragging on a real phone
        // while every Playwright touch test kept passing. The inline
        // `style` above is what actually wins that cascade; the class
        // stays for readability.
        "w-full touch-none rounded-card border-2 bg-surface px-3 py-2 text-left text-sm shadow-[var(--elevation-1)] transition-[border-color,opacity]",
        selected ? "border-primary" : "border-border",
        isDragging && "opacity-50",
      )}
    >
      {children}
    </button>
  );
}

type SlotState = "empty" | "filled" | "correct" | "wrong";

function slotToneClasses(state: SlotState, isOver: boolean) {
  return cn(
    state === "empty" && "border-dashed border-border text-subtle",
    state === "filled" && "border-solid border-border bg-surface",
    state === "correct" && "border-solid border-success bg-surface",
    state === "wrong" && "border-solid border-danger bg-surface",
    isOver && state === "empty" && "border-primary",
  );
}

function DropTarget({
  id,
  state,
  onClick,
  disabled,
  children,
}: {
  id: string;
  state: SlotState;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <button
      ref={setNodeRef}
      // See OptionChip's own comment: styles.css's global
      // `button { touch-action: manipulation }` (deliberately outside
      // @layer) beats the `touch-none` Tailwind class below, so the inline
      // style is what actually stops a touchend here from being read as a
      // page scroll instead of a drop.
      style={{ touchAction: "none" }}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // min-h-20/p-4 (up from 14/2) so a real fingertip has more margin
        // for error than a mouse pointer does.
        "min-h-20 w-full touch-none rounded-card border-2 p-4 text-left text-sm transition-colors",
        slotToneClasses(state, isOver),
      )}
    >
      {children}
    </button>
  );
}

export function LesenMatchBoard({
  passage,
  onComplete,
}: {
  passage: LesenMatchingPassage;
  onComplete: (correctCount: number, total: number) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(passage.targets.map((t) => [t.id, null])),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const sensors = useDndSensors();

  const allowMultiple = passage.allowMultiple ?? false;
  const placedOptionIds = new Set(Object.values(placements).filter((v): v is string => v !== null));
  // Single-use (the default): an option disappears from the pool once
  // placed, same as a real exam letter being "used up". Multi-use
  // (zuordnung_person's "mehrmals gewählt werden" only): the pool never
  // shrinks — the same person can be the right answer for several targets.
  const options = matchingOptions(passage);
  const pool = allowMultiple ? options : options.filter((o) => !placedOptionIds.has(o.id));
  const allFilled = passage.targets.every((t) => placements[t.id] !== null);

  function place(targetId: string, optionId: string) {
    if (checked) return;
    setPlacements((prev) => {
      const next = { ...prev };
      if (!allowMultiple) {
        for (const tid of Object.keys(next)) {
          if (next[tid] === optionId) next[tid] = null;
        }
      }
      next[targetId] = optionId;
      return next;
    });
    // Multi-use: keep the option selected so placing it into several
    // targets in a row (click-to-place) doesn't need re-selecting each time.
    if (!allowMultiple) setSelected(null);
  }

  function clear(targetId: string) {
    if (checked) return;
    setPlacements((prev) => ({ ...prev, [targetId]: null }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    place(String(over.id), String(active.id));
  }

  function check() {
    setChecked(true);
  }

  function finish() {
    const correctCount = passage.targets.filter(
      (t) => placements[t.id] === t.correctOptionId,
    ).length;
    onComplete(correctCount, passage.targets.length);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
      {passage.referenceText ? (
        <div className="rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-1)]">
          <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-fg">
            {passage.referenceText}
          </p>
        </div>
      ) : null}
      {passage.referenceItems ? (
        <div className="space-y-3 rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-1)]">
          {passage.referenceItems.map((r) => (
            <div key={r.id}>
              <p className="text-sm font-semibold text-fg">
                {r.id.toUpperCase()} — {r.label}
              </p>
              <p className="mt-1 font-serif text-sm leading-relaxed text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      ) : null}
      <p
        className={cn(
          "text-sm text-muted",
          (passage.referenceText || passage.referenceItems) && "mt-4",
        )}
      >
        {passage.instruction}
      </p>

      <div className="mt-4 rounded-card border border-border bg-surface-2 p-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">Options</p>
            <div className="mt-2 space-y-2" data-testid="lesen-match-pool">
              {pool.map((o) => {
                const useCount = allowMultiple
                  ? Object.values(placements).filter((v) => v === o.id).length
                  : 0;
                return (
                  <OptionChip
                    key={o.id}
                    id={o.id}
                    disabled={checked}
                    selected={selected === o.id}
                    onToggleSelect={() => setSelected((cur) => (cur === o.id ? null : o.id))}
                  >
                    {o.shortLabel}
                    {useCount > 0 ? (
                      <span className="ml-1.5 text-xs text-subtle">({useCount}×)</span>
                    ) : null}
                  </OptionChip>
                );
              })}
              {pool.length === 0 ? (
                <p className="text-sm text-subtle">All options placed.</p>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">Targets</p>
            <div className="mt-2 space-y-3" data-testid="lesen-match-targets">
              {passage.targets.map((t) => {
                const placedId = placements[t.id];
                const placedOption = placedId ? options.find((o) => o.id === placedId) : undefined;
                const state: SlotState = !checked
                  ? placedId
                    ? "filled"
                    : "empty"
                  : placedId === t.correctOptionId
                    ? "correct"
                    : "wrong";
                return (
                  <div key={t.id}>
                    <p className="text-sm text-fg">{t.prompt}</p>
                    <DropTarget
                      id={t.id}
                      state={state}
                      disabled={checked}
                      onClick={() => {
                        // A pending selection always wins — clicking any
                        // target (empty or already filled) places it there,
                        // overwriting a previous placement. With nothing
                        // selected, clicking a filled target clears it.
                        if (selected) {
                          place(t.id, selected);
                        } else if (placedOption) {
                          clear(t.id);
                        }
                      }}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span>
                          {placedOption
                            ? placedOption.shortLabel
                            : selected
                              ? "Tap to place here"
                              : "Drag an option here"}
                        </span>
                        {checked ? (
                          placedId === t.correctOptionId ? (
                            <Check className="size-4 shrink-0 text-success" />
                          ) : (
                            <X className="size-4 shrink-0 text-danger" />
                          )
                        ) : null}
                      </span>
                    </DropTarget>
                    {checked && placedId !== t.correctOptionId ? (
                      <p className="mt-1 text-xs text-subtle">{t.explanation}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {!checked ? (
        <Button type="button" className="mt-6 w-full" disabled={!allFilled} onClick={check}>
          Check matches
        </Button>
      ) : (
        <Button type="button" className="mt-6 w-full" onClick={finish}>
          Continue
        </Button>
      )}
    </DndContext>
  );
}

function GapSlot({
  gapId,
  state,
  placedText,
  disabled,
  onClick,
}: {
  gapId: string;
  state: SlotState;
  placedText: string | null;
  disabled?: boolean;
  onClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: gapId });
  const truncated =
    placedText && placedText.length > 24 ? `${placedText.slice(0, 24)}…` : placedText;
  return (
    <button
      ref={setNodeRef}
      // Same cascade issue as OptionChip/DropTarget — see OptionChip's own
      // comment for why this has to be an inline style, not just the
      // `touch-none` class.
      style={{ touchAction: "none" }}
      aria-label={`Gap ${gapId}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Padding bumped slightly (py-0.5 -> py-1.5) for a bit more
        // fingertip margin without breaking the inline reading flow.
        "mx-1 inline-flex min-w-16 touch-none items-center gap-1 rounded-control border-2 px-2 py-1.5 align-middle text-xs font-medium",
        slotToneClasses(state, isOver),
      )}
    >
      {truncated ?? `[${gapId}]`}
      {state === "correct" ? <Check className="size-3 shrink-0 text-success" /> : null}
      {state === "wrong" ? <X className="size-3 shrink-0 text-danger" /> : null}
    </button>
  );
}

export function LesenSentenceInsertionBoard({
  passage,
  onComplete,
}: {
  passage: LesenSentenceInsertionPassage;
  onComplete: (correctCount: number, total: number) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(passage.gaps.map((g) => [g.id, null])),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const sensors = useDndSensors();

  const placedOptionIds = new Set(Object.values(placements).filter((v): v is string => v !== null));
  const pool = passage.options.filter((o) => !placedOptionIds.has(o.id));
  const allFilled = passage.gaps.every((g) => placements[g.id] !== null);

  function place(gapId: string, optionId: string) {
    if (checked) return;
    setPlacements((prev) => {
      const next = { ...prev };
      for (const gid of Object.keys(next)) {
        if (next[gid] === optionId) next[gid] = null;
      }
      next[gapId] = optionId;
      return next;
    });
    setSelected(null);
  }

  function clear(gapId: string) {
    if (checked) return;
    setPlacements((prev) => ({ ...prev, [gapId]: null }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    place(String(over.id), String(active.id));
  }

  function check() {
    setChecked(true);
  }

  function finish() {
    const correctCount = passage.gaps.filter((g) => placements[g.id] === g.correctOptionId).length;
    onComplete(correctCount, passage.gaps.length);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
      <p className="text-sm text-muted">{passage.instruction}</p>
      <div className="mt-4 rounded-card border border-border bg-surface p-5 font-serif text-sm leading-relaxed text-fg shadow-[var(--elevation-1)]">
        {passage.segments.map((segment, i) => {
          const gap = passage.gaps[i];
          const placedId = gap ? placements[gap.id] : undefined;
          const placedOption = placedId
            ? passage.options.find((o) => o.id === placedId)
            : undefined;
          const state: SlotState | undefined = !gap
            ? undefined
            : !checked
              ? placedId
                ? "filled"
                : "empty"
              : placedId === gap.correctOptionId
                ? "correct"
                : "wrong";
          return (
            <span key={i}>
              <span className="whitespace-pre-line">{segment}</span>
              {gap && state ? (
                <GapSlot
                  gapId={gap.id}
                  state={state}
                  placedText={placedOption?.text ?? null}
                  disabled={checked}
                  onClick={() =>
                    placedOption ? clear(gap.id) : selected && place(gap.id, selected)
                  }
                />
              ) : null}
            </span>
          );
        })}
      </div>

      <div className="mt-4 rounded-card border border-border bg-surface-2 p-4">
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">Sentences</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" data-testid="lesen-insertion-pool">
          {pool.map((o) => (
            <OptionChip
              key={o.id}
              id={o.id}
              disabled={checked}
              selected={selected === o.id}
              onToggleSelect={() => setSelected((cur) => (cur === o.id ? null : o.id))}
            >
              {o.text}
            </OptionChip>
          ))}
          {pool.length === 0 ? (
            <p className="text-sm text-subtle sm:col-span-2">All sentences placed.</p>
          ) : null}
        </div>
      </div>

      {checked ? (
        <div className="mt-4 space-y-1">
          {passage.gaps
            .filter((g) => placements[g.id] !== g.correctOptionId)
            .map((g) => (
              <p key={g.id} className="text-xs text-subtle">
                [{g.id}]: {g.explanation}
              </p>
            ))}
        </div>
      ) : null}

      {!checked ? (
        <Button type="button" className="mt-6 w-full" disabled={!allFilled} onClick={check}>
          Check sentences
        </Button>
      ) : (
        <Button type="button" className="mt-6 w-full" onClick={finish}>
          Continue
        </Button>
      )}
    </DndContext>
  );
}
