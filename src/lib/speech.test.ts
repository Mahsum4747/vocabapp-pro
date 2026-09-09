import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { pickBestVoice, resolveVoice, type VoiceLike } from "./speech.ts";

function voice(overrides: Partial<VoiceLike> & Pick<VoiceLike, "name" | "lang">): VoiceLike {
  return { voiceURI: overrides.name, localService: true, ...overrides };
}

describe("pickBestVoice", () => {
  it("returns undefined when nothing matches the language, not even by base", () => {
    const voices = [voice({ name: "Alex", lang: "en-US" }), voice({ name: "Anna", lang: "de-DE" })];
    assert.equal(pickBestVoice(voices, "fr-FR"), undefined);
  });

  it("matches by base language when no exact regional match exists", () => {
    const voices = [voice({ name: "Anna", lang: "de-AT" })];
    const picked = pickBestVoice(voices, "de-DE");
    assert.equal(picked?.name, "Anna");
  });

  it("prefers an Enhanced/Premium/Neural/Natural voice over everything else", () => {
    const plainGoogle = voice({ name: "Google Deutsch", lang: "de-DE", localService: false });
    const enhanced = voice({ name: "Anna (Enhanced)", lang: "de-DE", localService: true });
    const picked = pickBestVoice([plainGoogle, enhanced], "de-DE");
    assert.equal(picked?.name, "Anna (Enhanced)");
  });

  it("prefers a Google/Microsoft voice over a plain cloud voice from another provider", () => {
    const otherCloud = voice({ name: "Acme Cloud Deutsch", lang: "de-DE", localService: false });
    const google = voice({ name: "Google Deutsch", lang: "de-DE", localService: true });
    const picked = pickBestVoice([otherCloud, google], "de-DE");
    assert.equal(picked?.name, "Google Deutsch");
  });

  it("prefers a cloud voice (localService: false) over an on-device one of equal standing", () => {
    const onDevice = voice({ name: "Anna", lang: "de-DE", localService: true });
    const cloud = voice({ name: "Anna Cloud", lang: "de-DE", localService: false });
    const picked = pickBestVoice([onDevice, cloud], "de-DE");
    assert.equal(picked?.name, "Anna Cloud");
  });

  it("falls back to any matching voice when none of the quality signals apply", () => {
    const onlyOption = voice({ name: "Compact Deutsch", lang: "de-DE", localService: true });
    const picked = pickBestVoice([onlyOption], "de-DE");
    assert.equal(picked?.name, "Compact Deutsch");
  });

  it("detects quality signals case-insensitively and via voiceURI as well as name", () => {
    const byUri = voice({
      name: "Voice 3",
      lang: "de-DE",
      voiceURI: "com.apple.voice.enhanced.de-DE",
      localService: true,
    });
    const plain = voice({ name: "Voice 4", lang: "de-DE", localService: false });
    assert.equal(pickBestVoice([plain, byUri], "de-DE")?.name, "Voice 3");
  });
});

describe("resolveVoice", () => {
  it("resolves directly when a voice exists for the requested tag", () => {
    const voices = [voice({ name: "Anna", lang: "de-DE" })];
    const resolved = resolveVoice("de-DE", voices);
    assert.equal(resolved?.voice.name, "Anna");
    assert.equal(resolved?.lang, "de-DE");
  });

  it("falls back Kurmanji (ku) to a Turkish voice when no Kurdish voice is installed", () => {
    const voices = [voice({ name: "Yelda", lang: "tr-TR" }), voice({ name: "Alex", lang: "en-US" })];
    const resolved = resolveVoice("ku", voices);
    assert.equal(resolved?.voice.name, "Yelda");
    assert.equal(resolved?.lang, "tr");
  });

  it("falls back Sorani (ckb) to an Arabic voice when no Sorani voice is installed", () => {
    const voices = [voice({ name: "Maged", lang: "ar-SA" }), voice({ name: "Alex", lang: "en-US" })];
    const resolved = resolveVoice("ckb", voices);
    assert.equal(resolved?.voice.name, "Maged");
    assert.equal(resolved?.lang, "ar");
  });

  it("still applies the quality ranking within a fallback language", () => {
    const plainTurkish = voice({ name: "Yelda", lang: "tr-TR", localService: true });
    const enhancedTurkish = voice({ name: "Yelda (Enhanced)", lang: "tr-TR", localService: true });
    const resolved = resolveVoice("ku", [plainTurkish, enhancedTurkish]);
    assert.equal(resolved?.voice.name, "Yelda (Enhanced)");
  });

  it("reports no voice at all when neither the language nor its fallback is installed", () => {
    // Kurdish, and nothing installed for its Turkish fallback either — only
    // an unrelated English voice, which must never be silently substituted.
    const voices = [voice({ name: "Alex", lang: "en-US" })];
    assert.equal(resolveVoice("ku", voices), undefined);
  });

  it("has no fallback chain for a language that isn't Kurdish/Sorani", () => {
    // No de voice, and German has no configured fallback — must not, say,
    // wander to an unrelated Dutch or Danish voice.
    const voices = [voice({ name: "Alex", lang: "en-US" }), voice({ name: "Yelda", lang: "tr-TR" })];
    assert.equal(resolveVoice("de-DE", voices), undefined);
  });
});
