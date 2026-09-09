import { normalizeLanguage, type LanguageCode } from "./lang/languages.ts";

// Browser-only text-to-speech via the Web Speech API — no external service,
// no API key. `termLanguage` on a set is a free-text language name (e.g.
// "German", picked in the Generate-from-topic dialog), so we map the common
// ones to a BCP-47 tag for `SpeechSynthesisUtterance.lang`; anything we don't
// recognize (or no language at all) just uses the browser's default voice.
const LANGUAGE_TAGS: Record<string, string> = {
  english: "en-US",
  german: "de-DE",
  deutsch: "de-DE",
  turkish: "tr-TR",
  türkçe: "tr-TR",
  french: "fr-FR",
  français: "fr-FR",
  spanish: "es-ES",
  español: "es-ES",
  italian: "it-IT",
  italiano: "it-IT",
  portuguese: "pt-PT",
  dutch: "nl-NL",
  russian: "ru-RU",
  polish: "pl-PL",
  swedish: "sv-SE",
  norwegian: "nb-NO",
  danish: "da-DK",
  finnish: "fi-FI",
  greek: "el-GR",
  arabic: "ar-SA",
  japanese: "ja-JP",
  korean: "ko-KR",
  chinese: "zh-CN",
  mandarin: "zh-CN",
  hindi: "hi-IN",
  ukrainian: "uk-UA",
  czech: "cs-CZ",
  romanian: "ro-RO",
  hungarian: "hu-HU",
  kurdish: "ku",
  kurmanci: "ku",
  kurmancî: "ku",
  kürtçe: "ku",
  sorani: "ckb",
  soranî: "ckb",
};

/**
 * When no OS/browser ships a voice for a language at all, falling back to
 * the closest-sounding language beats the alternative: with no matching
 * voice, engines pick *some* installed voice (usually English) and read the
 * text with ITS phonetics, which for e.g. Kurdish text is badly wrong, not
 * just accented.
 *  - Kurmanji (`ku`): Latin alphabet and phonetically close to Turkish —
 *    a `tr` voice reads it far more faithfully than an English one.
 *  - Sorani (`ckb`): written in Arabic script, so a generic Arabic voice at
 *    least reads the right alphabet correctly.
 * Tried in order until one resolves to a real installed voice; if none of
 * them do either, `resolveVoice` reports no voice at all rather than let the
 * engine guess (see its docstring).
 */
const LANGUAGE_FALLBACKS: Record<string, string[]> = {
  ku: ["tr"],
  ckb: ["ar"],
};

/**
 * The tag to speak each canonical code with. Regions are spelled out because
 * a voice list is region-flavoured — asking for "de-DE" finds a German voice
 * more reliably than bare "de" on some engines, and `pickBestVoice` still
 * falls back to a base-language match either way.
 */
const CODE_TAGS: Record<LanguageCode, string> = {
  de: "de-DE",
  en: "en-US",
  tr: "tr-TR",
  ku: "ku",
  ckb: "ckb",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  nl: "nl-NL",
  ru: "ru-RU",
  pl: "pl-PL",
  sv: "sv-SE",
  nb: "nb-NO",
  da: "da-DK",
  fi: "fi-FI",
  el: "el-GR",
  ar: "ar-SA",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  hi: "hi-IN",
  uk: "uk-UA",
  cs: "cs-CZ",
  ro: "ro-RO",
  hu: "hu-HU",
};

/**
 * Resolve whatever a caller has — a canonical code, or the free text a set
 * was saved with years ago — to a speech tag.
 *
 * The canonical code comes first: it is the one identity that can't be spelled
 * six ways. `normalizeLanguage` also absorbs the free text (it knows every
 * legacy spelling and raw BCP-47 form), so the two paths below only catch what
 * it genuinely doesn't recognize — a tag-shaped string for a language with no
 * code yet, then the original legacy map, kept so a public or long-untouched
 * set doesn't lose the voice it had.
 */
export function toBcp47(language?: string): string | undefined {
  const trimmed = language?.trim();
  if (!trimmed) return undefined;
  const code = normalizeLanguage(trimmed);
  if (code) return CODE_TAGS[code];
  // Already looks like a BCP-47 tag (e.g. "de", "de-DE") — use as-is.
  if (/^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/.test(trimmed)) return trimmed;
  return LANGUAGE_TAGS[trimmed.toLowerCase()];
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Slightly slower than the API's 1.0 default: for learning a word, clearer
 *  per-syllable pronunciation matters more than natural conversational pace. */
const SPEECH_RATE = 0.9;

// ── Voice selection ─────────────────────────────────────────────────────────
//
// The Web Speech API exposes no quality/MOS score for a voice, so we rank by
// what actually correlates with quality on today's browsers/OSes: whether the
// name advertises itself as a premium tier, which company's engine backs it,
// and whether it's cloud- or device-rendered.

/** The subset of `SpeechSynthesisVoice` the picker needs — lets tests supply
 *  plain objects instead of constructing real voices (which browsers don't
 *  let you do anyway; the constructor is engine-only). */
export type VoiceLike = Pick<SpeechSynthesisVoice, "name" | "lang" | "voiceURI" | "localService">;

function langBase(tag: string): string {
  return tag.toLowerCase().split("-")[0]!;
}

/**
 * Suitability rank for a voice already known to match the requested
 * language, highest first:
 *   1. Name/voiceURI advertises Enhanced/Premium/Neural/Natural — macOS/iOS's
 *      "Enhanced"/"Premium" tiers and Edge's "Natural" voices are a clear
 *      step up from the compact default installed alongside them.
 *   2. Google or Microsoft as the underlying provider — their standard
 *      voices are still generally clearer than other bundled system voices.
 *   3. Cloud-backed (`localService === false`) over on-device — where a
 *      browser offers both for a language, the cloud one is typically the
 *      higher-quality tier.
 * Ties keep the browser's own reported order (`pickBestVoice` does a stable
 * scan, not a sort).
 */
function voiceScore(voice: VoiceLike): number {
  const signature = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = 0;
  if (/enhanced|premium|neural|natural/.test(signature)) score += 100;
  if (/google|microsoft/.test(signature)) score += 50;
  if (voice.localService === false) score += 10;
  return score;
}

/**
 * Best available voice for a BCP-47 tag among `voices`, or `undefined` if
 * none match even by base language (e.g. no "de-*" voice at all for "de-DE").
 * A pure function over an explicit voice list, so voice-picking logic is
 * testable without a real `speechSynthesis`.
 */
export function pickBestVoice(voices: readonly VoiceLike[], tag: string): VoiceLike | undefined {
  const wanted = tag.toLowerCase();
  const wantedBase = langBase(tag);
  const candidates = voices.filter((voice) => {
    const voiceLang = voice.lang.toLowerCase();
    return voiceLang === wanted || langBase(voiceLang) === wantedBase;
  });
  if (candidates.length === 0) return undefined;
  return candidates.reduce((best, voice) => (voiceScore(voice) > voiceScore(best) ? voice : best));
}

/**
 * The voice (and the language it was actually resolved for) to speak `tag`
 * with: `tag` itself if any installed voice matches, else the next entry in
 * `LANGUAGE_FALLBACKS[tag]`, tried in order. `undefined` means genuinely no
 * voice exists for this language or any of its fallbacks — the caller's job
 * is to stay silent rather than let the engine mispronounce it in a random
 * installed voice.
 */
export function resolveVoice(
  tag: string,
  voices: readonly VoiceLike[],
): { voice: VoiceLike; lang: string } | undefined {
  const chain = [tag, ...(LANGUAGE_FALLBACKS[tag.toLowerCase()] ?? [])];
  for (const candidate of chain) {
    const voice = pickBestVoice(voices, candidate);
    if (voice) return { voice, lang: candidate };
  }
  return undefined;
}

// ── Runtime voice loading + per-language cache ──────────────────────────────

/** `getVoices()` is frequently empty on first call — most browsers populate
 *  the list asynchronously and fire `voiceschanged` once it's ready. Resolves
 *  as soon as a non-empty list shows up, or after a short grace period (some
 *  browsers/environments never fire the event when there's truly nothing to
 *  load). Memoized so concurrent callers share one wait. */
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
let clearOnChangeRegistered = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;

  // Once the engine reports a change, our cached results (an empty voice list
  // resolved by the grace-period timeout, or a stale "no voice" verdict) may
  // no longer be accurate — drop them so the next call re-reads the list.
  if (!clearOnChangeRegistered) {
    clearOnChangeRegistered = true;
    synth.addEventListener("voiceschanged", () => {
      voicesPromise = null;
      voiceCache.clear();
    });
  }

  if (voicesPromise) return voicesPromise;
  voicesPromise = new Promise((resolve) => {
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, 1000);
  });
  return voicesPromise;
}

/** Resolved voice per BCP-47 tag (lower-cased), including `null` for "looked
 *  it up, there truly isn't one" so repeat calls don't re-scan the list. */
const voiceCache = new Map<string, { voice: SpeechSynthesisVoice; lang: string } | null>();

/** Resolve (and cache) the best voice for `language` — a free-text name or a
 *  BCP-47 tag. `undefined` means either the language wasn't recognized (the
 *  caller should fall back to the browser's own default voice) or, once
 *  recognized, no installed voice (nor fallback) can speak it at all. */
export async function findVoice(
  language?: string,
): Promise<{ voice: SpeechSynthesisVoice; lang: string } | undefined> {
  const tag = toBcp47(language);
  if (!tag) return undefined;
  const cacheKey = tag.toLowerCase();
  if (voiceCache.has(cacheKey)) return voiceCache.get(cacheKey) ?? undefined;
  const voices = await loadVoices();
  const resolved = resolveVoice(tag, voices) as
    { voice: SpeechSynthesisVoice; lang: string } | undefined;
  voiceCache.set(cacheKey, resolved ?? null);
  return resolved;
}

/**
 * Whether `speak(text, language)` would actually be heard correctly: either
 * `language` isn't one we map (so the browser's own default voice handles
 * it, same as before this module picked voices explicitly), or a real
 * installed voice — possibly a fallback language — was found for it. False
 * only for a recognized language with no matching voice anywhere (Kurdish on
 * most systems today), where speaking would silently mispronounce it.
 */
export async function canSpeak(language?: string): Promise<boolean> {
  if (!speechSupported()) return false;
  const tag = toBcp47(language);
  if (!tag) return true;
  return (await findVoice(language)) !== undefined;
}

/** Speak `text` aloud, in `language` (a free-text name or BCP-47 tag) if
 *  recognized, using the best-available voice for it. No-op if unsupported,
 *  empty, or (once a language is recognized) no voice exists for it at all —
 *  callers that show a speaker button should gate it on `canSpeak` first so
 *  it never appears for a language this would silently no-op or mispronounce. */
export async function speak(text: string, language?: string): Promise<void> {
  if (!speechSupported() || !text.trim()) return;
  const tag = toBcp47(language);
  const resolved = tag ? await findVoice(language) : undefined;
  if (tag && !resolved) return; // Recognized language, nothing can speak it — stay silent.

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = SPEECH_RATE;
  if (resolved) {
    utterance.voice = resolved.voice;
    utterance.lang = resolved.lang;
  }
  window.speechSynthesis.speak(utterance);
}
