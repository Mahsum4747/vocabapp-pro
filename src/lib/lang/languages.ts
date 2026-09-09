/**
 * Canonical language codes for study sets.
 *
 * `StudySet.termLanguage` / `definitionLanguage2` are free text a user typed
 * ("German", "Deutsch", "Almanca", "de"), which is fine to display but
 * useless to branch on. These codes are the stable identity: one code per
 * language, so features can ask "is the term language German?" without
 * string-matching a dozen spellings.
 *
 * The starting set is exactly the languages the app already knew how to
 * speak (see `speech.ts`'s legacy tag map), so nothing that worked before
 * loses its voice.
 *
 * Pure data + pure functions, no imports — importable from tests and from
 * both client and server code.
 */

export type LanguageCode =
  | "de"
  | "en"
  | "tr"
  | "ku"
  | "ckb"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "nl"
  | "ru"
  | "pl"
  | "sv"
  | "nb"
  | "da"
  | "fi"
  | "el"
  | "ar"
  | "ja"
  | "ko"
  | "zh"
  | "hi"
  | "uk"
  | "cs"
  | "ro"
  | "hu";

export type Language = {
  code: LanguageCode;
  /** English name, and what gets sent to Gemini so prompts read naturally. */
  label: string;
  /** The language's own name, for the picker. */
  nativeLabel: string;
};

/** Ordered for the picker: the app's core languages first, then alphabetical. */
export const LANGUAGES: readonly Language[] = [
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe" },
  { code: "ku", label: "Kurmanji Kurdish", nativeLabel: "Kurmancî" },
  { code: "ckb", label: "Sorani Kurdish", nativeLabel: "کوردیی ناوەندی" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština" },
  { code: "da", label: "Danish", nativeLabel: "Dansk" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "el", label: "Greek", nativeLabel: "Ελληνικά" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "hu", label: "Hungarian", nativeLabel: "Magyar" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "nb", label: "Norwegian", nativeLabel: "Norsk bokmål" },
  { code: "pl", label: "Polish", nativeLabel: "Polski" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "ro", label: "Romanian", nativeLabel: "Română" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska" },
  { code: "uk", label: "Ukrainian", nativeLabel: "Українська" },
];

const BY_CODE = new Map<LanguageCode, Language>(LANGUAGES.map((l) => [l.code, l]));

/** The `Language` row for a code, for labels in the UI and in AI prompts. */
export function languageByCode(code: LanguageCode): Language {
  const language = BY_CODE.get(code);
  if (!language) throw new Error(`Unknown language code: ${code}`);
  return language;
}

/**
 * Letters that carry no combining mark to strip, so NFD leaves them alone —
 * they have to be folded by hand or "Fransızca" never matches "fransizca".
 * Turkish's dotless ı is the one that actually matters for this app's users;
 * the rest are here so a future entry in LANGUAGES can't quietly break.
 */
const NON_DECOMPOSING: Record<string, string> = {
  ı: "i",
  ø: "o",
  ł: "l",
  đ: "d",
  ß: "ss",
  æ: "ae",
  œ: "oe",
};

/**
 * Case- and accent-insensitive key for matching user input.
 *
 * NFD + stripping combining marks makes "Türkçe" and "turkce" the same key,
 * and — the reason it matters here — makes Turkish's dotted capital İ behave:
 * "İngilizce".toLowerCase() is "i" plus a combining dot, which would
 * otherwise never match "ingilizce".
 */
function fold(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[\u0131\u00f8\u0142\u0111\u00df\u00e6\u0153]/g,
      (char) => NON_DECOMPOSING[char] ?? char,
    )
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Spellings that aren't a code, English label or native label — every legacy
 * value `speech.ts` accepted, plus the Turkish names users actually type
 * (this app's own UI is Turkish-facing) and the obvious alternates.
 */
const EXTRA_ALIASES: Record<string, LanguageCode> = {
  // Turkish names
  almanca: "de",
  ingilizce: "en",
  turkce: "tr",
  kurtce: "ku",
  kurmanci: "ku",
  "kurmanci kurtcesi": "ku",
  "sorani kurtcesi": "ckb",
  arapca: "ar",
  cince: "zh",
  cekce: "cs",
  danca: "da",
  felemenkce: "nl",
  hollandaca: "nl",
  fince: "fi",
  fransizca: "fr",
  yunanca: "el",
  hintce: "hi",
  macarca: "hu",
  italyanca: "it",
  japonca: "ja",
  korece: "ko",
  norvecce: "nb",
  lehce: "pl",
  polonyaca: "pl",
  portekizce: "pt",
  romence: "ro",
  rusca: "ru",
  ispanyolca: "es",
  isvecce: "sv",
  ukraynaca: "uk",

  // Legacy free text `speech.ts` mapped, not already covered above
  kurdish: "ku",
  sorani: "ckb",
  mandarin: "zh",

  // Alternate codes
  no: "nb", // ISO 639-1 for Norwegian; the app's voice list is bokmål
  nn: "nb",
};

const ALIASES: Record<string, LanguageCode> = (() => {
  const map: Record<string, LanguageCode> = {};
  // Code, English label and native label always resolve to their own code —
  // registering them here (rather than by hand) is what keeps every row in
  // LANGUAGES round-trippable no matter how the list grows.
  for (const language of LANGUAGES) {
    map[fold(language.code)] = language.code;
    map[fold(language.label)] = language.code;
    map[fold(language.nativeLabel)] = language.code;
  }
  for (const [alias, code] of Object.entries(EXTRA_ALIASES)) {
    map[fold(alias)] = code;
  }
  return map;
})();

/** True when `value` is one of the canonical codes — for validating anything read back from Firestore. */
export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && BY_CODE.has(value as LanguageCode);
}

/** A stored value narrowed to a code, or null if it is missing or unrecognized. */
export function asLanguageCode(value: unknown): LanguageCode | null {
  return isLanguageCode(value) ? value : null;
}

/**
 * Resolve free text a user typed — an English name, a Turkish name, the
 * language's own name, or a BCP-47 tag — to a canonical code. Null when
 * nothing matches, which callers treat as "unknown language", never as a
 * guess at a nearby one.
 */
export function normalizeLanguage(input: string): LanguageCode | null {
  if (typeof input !== "string") return null;
  const folded = fold(input);
  if (!folded) return null;

  const direct = ALIASES[folded];
  if (direct) return direct;

  // BCP-47 with a region or script subtag: "de-DE", "pt_BR", "zh-Hans".
  const primary = folded.split(/[-_]/)[0];
  if (primary && primary !== folded) {
    const viaPrimary = ALIASES[primary];
    if (viaPrimary) return viaPrimary;
  }

  return null;
}
