import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(a: string, b: string) {
  return normalizeAnswer(a) === normalizeAnswer(b) && normalizeAnswer(a).length > 0;
}

/** Parse a route search param that should be a whole number (e.g. `?box=2`) — query strings arrive as strings, a client-side Link `search` object as a number. */
export function parseIntSearchParam(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

/**
 * Today as YYYY-MM-DD in the viewer's own timezone, for keying per-day stats.
 * Deliberately not `toISOString().slice(0, 10)`, which is UTC: that files an
 * evening review under tomorrow's date for anyone east of UTC.
 */
/**
 * The last `days` local day keys, oldest first, ending with today.
 *
 * Built by stepping a local Date rather than subtracting milliseconds, so the
 * days either side of a daylight-saving change are still one calendar day
 * apart.
 */
export function recentDateKeys(days: number, from = new Date()): string[] {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(from.getFullYear(), from.getMonth(), from.getDate() - i);
    keys.push(localDateKey(day));
  }
  return keys;
}

export function localDateKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
