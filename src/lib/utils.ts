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

/**
 * Whether a typed answer `a` matches the expected `b` — exact (modulo case,
 * accents, and punctuation) by default, so every existing call with no third
 * argument behaves byte-for-byte as before this option existed.
 *
 * `ignorableLeadingWords` is a language-agnostic escape hatch for one
 * specific case: a language whose nouns carry a leading article the
 * learner might reasonably include or omit ("der Tisch" for "Tisch").
 * Nothing German-specific lives here — the actual word list ("der"/"die"/
 * "das") comes from the caller, normally a `LanguageProfile.articleWords`
 * (see lang/profiles.ts), which is also where the decision to offer this
 * leniency at all belongs: whether a language has such words, and whether a
 * given card's word is even known well enough to say one applies.
 *
 * When such a word list is given and the exact match fails, this also
 * accepts `a` with exactly one of those words prefixed (case/accent/
 * punctuation-insensitive, same as the exact check) — deliberately ANY of
 * them, not just the "right" one for whatever the caller might consider the
 * correct choice: judging which is correct is a different, harder question
 * this function has no opinion on, and isn't what it's asked here.
 */
export function answersMatch(
  a: string,
  b: string,
  options?: { ignorableLeadingWords?: readonly string[] },
): boolean {
  const normA = normalizeAnswer(a);
  const normB = normalizeAnswer(b);
  if (normA.length === 0) return false;
  if (normA === normB) return true;

  for (const word of options?.ignorableLeadingWords ?? []) {
    const prefix = `${normalizeAnswer(word)} `;
    if (normA.startsWith(prefix) && normA.slice(prefix.length) === normB) return true;
  }
  return false;
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
