/**
 * Pure string-splicing half of the "insert a character at the cursor"
 * problem — the DOM/focus/selection-restoration half lives in the
 * component that calls this, since none of that is meaningfully testable
 * without a browser. Kept here so the actual splice logic (the part that
 * can silently go wrong — off-by-one, wrong fallback when there's no
 * selection) has real unit tests.
 */
export type CursorInsertResult = {
  /** The full string with `insert` spliced in. */
  value: string;
  /** Where the caret should end up afterward — right after the inserted text. */
  cursor: number;
};

/**
 * Insert `insert` into `value` at `start`, replacing the `[start, end)`
 * range if one is selected (end > start). `start`/`end` are clamped into
 * `[0, value.length]` and swapped if given in the wrong order, so a caller
 * passing a raw (possibly `null`, from an unfocused input)
 * `selectionStart`/`selectionEnd` pair can fall back to appending at the
 * end by passing `value.length` for both rather than special-casing null
 * itself.
 */
export function insertAtCursor(
  value: string,
  start: number,
  end: number,
  insert: string,
): CursorInsertResult {
  const len = value.length;
  const clamp = (n: number) => Math.min(Math.max(n, 0), len);
  const a = clamp(start);
  const b = clamp(end);
  const from = Math.min(a, b);
  const to = Math.max(a, b);
  return {
    value: value.slice(0, from) + insert + value.slice(to),
    cursor: from + insert.length,
  };
}
