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
};

function toBcp47(language?: string): string | undefined {
  const trimmed = language?.trim();
  if (!trimmed) return undefined;
  // Already looks like a BCP-47 tag (e.g. "de", "de-DE") — use as-is.
  if (/^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/.test(trimmed)) return trimmed;
  return LANGUAGE_TAGS[trimmed.toLowerCase()];
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak `text` aloud, in `language` (a free-text name or BCP-47 tag) if recognized. No-op if unsupported or empty. */
export function speak(text: string, language?: string): void {
  if (!speechSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const tag = toBcp47(language);
  if (tag) utterance.lang = tag;
  window.speechSynthesis.speak(utterance);
}
