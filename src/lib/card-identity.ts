export const MAX_SET_CARDS = 2000;
/** Opaque ID is identity. Terms/content may change; copies intentionally get new IDs. */
export function indexCardDrafts<T extends { id?: string }>(
  drafts: T[],
  createId: () => string,
): (T & { id: string })[] {
  const seen = new Set<string>();
  return drafts.map((draft) => {
    const id = draft.id ?? createId();
    if (seen.has(id)) throw new Error("Duplicate card ID");
    seen.add(id);
    return { ...draft, id };
  });
}
export function removedCardIds(
  before: readonly { id: string }[],
  after: readonly { id: string }[],
): string[] {
  const kept = new Set(after.map((c) => c.id));
  return before.filter((c) => !kept.has(c.id)).map((c) => c.id);
}

/** Pure content plan shared by transactional copy/move storage and regression tests. */
export function planCardTransfer(
  source: import("./types").Card[],
  target: import("./types").Card[],
  ids: string[],
  move: boolean,
  createId: () => string,
  copy: (card: import("./types").Card, id: string) => import("./types").Card,
) {
  const selectedIds = new Set(ids);
  const sourceIds = new Set(source.map((card) => card.id));
  if (
    !ids.length ||
    ids.length > MAX_SET_CARDS ||
    selectedIds.size !== ids.length ||
    ids.some((id) => !sourceIds.has(id))
  )
    throw new Error("Invalid transferred card IDs");
  const selected = source.filter((card) => selectedIds.has(card.id));
  const added = move ? selected : selected.map((card) => copy(card, createId()));
  const targetCards = [...target, ...added];
  if (
    targetCards.length > MAX_SET_CARDS ||
    new Set(targetCards.map((card) => card.id)).size !== targetCards.length
  )
    throw new Error("Invalid target card collection");
  return {
    sourceCards: move ? source.filter((card) => !selectedIds.has(card.id)) : source,
    targetCards,
    addedCount: added.length,
  };
}
