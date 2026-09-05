import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

export type EditorCard = { id: string; term: string; definition: string };

export function CardEditor({
  cards,
  onChange,
}: {
  cards: EditorCard[];
  onChange: (cards: EditorCard[]) => void;
}) {
  function update(id: string, patch: Partial<EditorCard>) {
    onChange(cards.map((card) => (card.id === id ? { ...card, ...patch } : card)));
  }

  function remove(id: string) {
    onChange(cards.length <= 1 ? cards : cards.filter((card) => card.id !== id));
  }

  function add() {
    onChange([...cards, { id: crypto.randomUUID(), term: "", definition: "" }]);
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
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={add}>
        <Plus />
        Add card
      </Button>
    </div>
  );
}
