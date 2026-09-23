#!/usr/bin/env node
/**
 * Read-only verification for Phase 2 Adım 4's static TR pilot
 * (src/content/a1-german-nouns-tr.ts).
 *
 * Finds the live "CEFR A1 German Nouns" set and checks, for each of the 50
 * map keys, whether it matches a real card's `term` in that set — using the
 * SAME lookup the app uses at review time (bare term, or term with a
 * leading der/die/das stripped), not a raw exact-string compare, so this
 * reports what a learner will actually see.
 *
 * Prints only:
 *   - how many of the 50 keys matched a card
 *   - which keys did NOT match any card (dead weight, not silently fixed)
 *   - any card.term that had ß/umlaut characters worth double-checking the
 *     encoding of (NFC vs NFD), since that's the most likely silent-break
 *     case named in the task
 *
 *   node scripts/verify-a1-nouns-tr-map.mjs
 *
 * Needs FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in the environment.
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = "vocabappmm";

if (!privateKey || !clientEmail) {
  console.error("❌ Error: FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL must be set.");
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

// Keep this list in sync with src/content/a1-german-nouns-tr.ts by hand —
// deliberately not imported (this is a plain Node script, no TS build step).
const A1_NOUNS_TR_KEYS = [
  "Apfel", "Haus", "Frau", "Mann", "Kind", "Mutter", "Vater", "Stadt", "Hund",
  "Katze", "Buch", "Tisch", "Stuhl", "Tasche", "Wasser", "Brot", "Käse",
  "Milch", "Kaffee", "Tee", "Sonne", "Regen", "Schule", "Arbeit", "Name",
  "Freund", "Freundin", "Uhr", "Auto", "Bus", "Zug", "Bahnhof", "Flughafen",
  "Geld", "Schlüssel", "Handy", "Tag", "Nacht", "Woche", "Jahr", "Frage",
  "Antwort", "Arzt", "Zimmer", "Garten", "Straße", "Supermarkt", "Fenster",
  "Tür", "Schuh",
];

const GERMAN_ARTICLES = ["der", "die", "das"];

function stripArticle(term) {
  const trimmed = term.trim();
  const lower = trimmed.toLowerCase();
  for (const word of GERMAN_ARTICLES) {
    const prefix = `${word} `;
    if (lower.startsWith(prefix)) return trimmed.slice(prefix.length).trim();
  }
  return trimmed;
}

async function run() {
  const snapshot = await db
    .collection("study_sets")
    .where("title", "==", "CEFR A1 German Nouns")
    .get();

  if (snapshot.empty) {
    console.error('❌ No set titled "CEFR A1 German Nouns" found.');
    process.exit(1);
  }
  if (snapshot.size > 1) {
    console.warn(`⚠️  ${snapshot.size} sets share that title — checking all of them.`);
  }

  const headwords = new Set();
  const nonAsciiTerms = [];
  for (const doc of snapshot.docs) {
    const cards = doc.data().cards ?? [];
    for (const card of cards) {
      if (!card.term) continue;
      const headword = stripArticle(card.term);
      headwords.add(headword);
      if (/[äöüÄÖÜß]/.test(card.term)) nonAsciiTerms.push(card.term);
    }
  }

  const matched = A1_NOUNS_TR_KEYS.filter((key) => headwords.has(key));
  const unmatched = A1_NOUNS_TR_KEYS.filter((key) => !headwords.has(key));

  console.log(`${matched.length} / ${A1_NOUNS_TR_KEYS.length} map keys matched a card.term.`);
  if (unmatched.length > 0) {
    console.log("Unmatched (dead weight, not fixed here):");
    for (const key of unmatched) console.log(`  - ${key}`);
  }
  if (nonAsciiTerms.length > 0) {
    console.log("\nCard terms with ß/umlaut (spot-check encoding against the map's own keys):");
    for (const term of nonAsciiTerms) console.log(`  - ${term}`);
  }
}

run().catch((error) => {
  console.error("❌ Failed:", error);
  process.exit(1);
});
