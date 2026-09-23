import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Type-only, so no firebase-admin code reaches the client bundle.
import type { PartialWithFieldValue } from "firebase-admin/firestore";
import { authMiddleware, optionalAuthMiddleware } from "./auth/middleware";
import { recordStudyActivityFor, type StreakInfo } from "./streak";
import { defaultScheduler as scheduler } from "./srs";
import { planReview } from "./review-plan";
import { missingNounFields } from "./card-completeness";
import { findOrphanProgressIds, foreignSetIds } from "./progress-orphans";
import { isStudiableSet } from "./srs";
import {
  applyCountDelta,
  applyReviewToSummary,
  buildTodaySummary,
  countedCardIds,
  isSummaryFresh,
  needsFullRebuild,
  readTodaySummary,
  refreshClockFields,
  sumCounts,
  type CardCounts,
  type TodaySummary,
} from "./today-summary";
import {
  applyXp,
  MASTERED_SCORE,
  SET_COMPLETION_XP,
  newlyUnlocked,
  nextPerfectRun,
  xpForReview,
  type AchievementId,
  type AchievementStats,
  type UserProfile,
} from "./gamification";
import {
  DEFAULT_TIME_ZONE,
  isDailyGoalOption,
  isTimeZoneName,
  readUserSettings,
  type UserSettings,
} from "./daily-goal";
import {
  freshCardCopy,
  isCardActive,
  isCorrectRating,
  readDailyStats,
  resolveSetLanguages,
} from "./types";
import { asLanguageCode, type LanguageCode } from "./lang/languages";
import { readSoundSettings, type SoundSettings } from "./sound";
import { MAX_SERVED_IDS, readSetSession, type SetSession } from "./session-pass";
import {
  isDirection,
  isExplanationLanguage,
  readLearningPrefs,
  type Direction,
  type ExplanationLanguage,
} from "./learning-prefs";
import { resolveEnrichment, resolveEnrichmentOnOmit } from "./card-enrichment-policy";
import type {
  Card,
  CardEnrichment,
  CardProgress,
  CaseExamples,
  DailyStats,
  StudySet,
} from "./types";

/** Firestore ids and the date key are path segments — keep them tight. */
const idSchema = z.string().trim().min(1).max(200);

/**
 * A local calendar day, "YYYY-MM-DD". Also a document id, and Firestore reads
 * "a/b/c" as a nested path, so an unvalidated string here would let a caller
 * read or write outside the dailyStats collection.
 */
const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

const recordReviewSchema = z.object({
  cardId: idSchema,
  setId: idSchema,
  rating: z.enum(["again", "hard", "good", "easy"]),
  /**
   * The viewer's LOCAL calendar day. The server can't derive it — deriving it
   * from the server clock would file an evening review under tomorrow for
   * anyone east of UTC. The strict shape also keeps it usable as a document
   * id: Firestore reads "a/b/c" as a nested path, so an unvalidated string
   * here would let a caller write outside the dailyStats collection.
   */
  date: dateKeySchema,
  /** Capped at an hour — a longer "response" is a tab left open, not study time. */
  responseTimeMs: z
    .number()
    .int()
    .min(0)
    .max(60 * 60 * 1000)
    .optional(),
  /**
   * Phase 2, Adım 5: which raw miss counter (if any) this review's "again"
   * came from — set only by the article/case drills, which are the only
   * callers that route a MISS through this path (see Decision A). Never
   * read by scheduling/mastery; see the handler for where it's written.
   */
  missKind: z.enum(["article", "case"]).optional(),
});

const cardProgressQuerySchema = z.object({ cardId: idSchema });
const setProgressQuerySchema = z.object({ setId: idSchema });

type DraftCard = {
  term: string;
  definition: string;
  imageUrl?: string | null;
  example?: string | null;
  examples?: CaseExamples | null;
  definition2?: string | null;
  note?: string | null;
  /**
   * Only `source: "user"` is ever trusted verbatim; `null`, an absent
   * field, and a `source: "dict"`/`"ai"` value are all treated the same —
   * the server fills it fresh from the dictionary when the set's term
   * language is German. On an edit-page save specifically, an absent field
   * additionally falls back to whatever the card already had, rather than
   * being recomputed as "no override sent" would otherwise mean — see
   * `replaceCards` and card-enrichment-policy.ts.
   */
  enrichment?: CardEnrichment | null;
};
type DraftCardWithProgress = DraftCard & {
  starred?: boolean;
  status?: Card["status"];
};

/** Trim each case sentence; null when there is nothing left at all. */
function sanitizeExamples(value: CaseExamples | null | undefined): CaseExamples | null {
  if (!value) return null;
  const clean = {
    nom: value.nom?.trim() || null,
    akk: value.akk?.trim() || null,
    dat: value.dat?.trim() || null,
  };
  return clean.nom || clean.akk || clean.dat ? clean : null;
}

function uidServer(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * 64 URL-safe characters — a power of two, so taking each random byte modulo
 * the alphabet length introduces no bias.
 */
const SHARE_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const SHARE_ID_LENGTH = 10;

/**
 * A short, unguessable id for share links (~60 bits of entropy). Unlike the
 * document id this is safe to hand out, and unlike a sequential id it can't be
 * walked to enumerate other people's sets.
 */
function shareIdServer(): string {
  const bytes = new Uint8Array(SHARE_ID_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += SHARE_ID_ALPHABET[byte % SHARE_ID_ALPHABET.length];
  return out;
}

/**
 * The dictionary lookup to hand `card-enrichment-policy.ts`, for a set whose
 * resolved term language is (or isn't) German.
 *
 * Dynamically imported, and only when the set actually is German: the
 * German noun dictionary is a 2.9 MB module, and every other set — the vast
 * majority of saves — must not pay to load it. Mirrors how this file
 * already lazy-loads `firebase-admin.server` inside each handler rather
 * than importing it at module scope.
 */
async function germanDictLookup(
  isGermanTermLanguage: boolean,
): Promise<(term: string) => CardEnrichment | null> {
  if (!isGermanTermLanguage) return () => null;
  const { enrichGermanTerm } = await import("./german/enrich.server");
  return enrichGermanTerm;
}

function toCards(
  drafts: DraftCard[],
  context: { isGermanTermLanguage: boolean; dictLookup: (term: string) => CardEnrichment | null },
): Card[] {
  return drafts
    .map((d) => {
      const term = d.term.trim();
      return {
        id: uidServer(),
        term,
        definition: d.definition.trim(),
        starred: false,
        imageUrl: d.imageUrl || null,
        example: d.example?.trim() || null,
        examples: sanitizeExamples(d.examples),
        definition2: d.definition2?.trim() || null,
        note: d.note?.trim() || null,
        enrichment: resolveEnrichment(term, d.enrichment, context),
      };
    })
    .filter((c) => c.term || c.definition);
}

/**
 * Keep the cached Home summary's `new`/`weak`/`due` counters in step with a
 * library edit, by the cards that entered or left Today's pool (active cards of
 * studiable sets — the same pool /review serves).
 *
 * One function for every edit, so the transitions can't drift apart:
 *   - a card enters the pool (set created/copied, card added or un-archived,
 *     set becomes studiable)  -> its own contribution is added
 *   - a card leaves the pool (set deleted, card removed/archived/excluded, set
 *     becomes a reference or drops below 2 cards)  -> it is subtracted
 * Brand-new card ids can't have a progress row, so they cost no read; every
 * other id is read once with `getAll`.
 *
 * `deleteIds` are progress rows to delete because their set is gone for good
 * (only `deleteSet` passes them: never for archived/excluded/reference — those
 * are reversible — nor for a card removal, term edit or move). Best-effort like the streak: the edit
 * is already stored, and a failure here only leaves a badge count slightly off
 * until the weekly full rebuild.
 */
async function syncSummaryForSetChange(change: {
  userId: string;
  before: StudySet | null;
  after: StudySet | null;
  /** Progress rows the caller already read, so they aren't read twice. */
  knownRows?: Map<string, CardProgress>;
  deleteIds?: string[];
}): Promise<void> {
  try {
    const { userId, before, after } = change;
    const beforeIds = countedCardIds(before);
    const afterIds = countedCardIds(after);
    const entered = [...afterIds].filter((id) => !beforeIds.has(id));
    const left = [...beforeIds].filter((id) => !afterIds.has(id));
    const deleteIds = change.deleteIds ?? [];
    if (entered.length === 0 && left.length === 0 && deleteIds.length === 0) return;

    const existingIds = new Set(before?.cards.map((c) => c.id));
    const brandNew = new Set(entered.filter((id) => !existingIds.has(id)));

    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const progressCol = db.collection("users").doc(userId).collection("cardProgress");

    const rows = new Map(change.knownRows ?? []);
    const toRead = [
      ...new Set([...left, ...entered.filter((id) => !brandNew.has(id)), ...deleteIds]),
    ].filter((id) => !rows.has(id));
    for (let i = 0; i < toRead.length; i += 300) {
      const docs = await db.getAll(...toRead.slice(i, i + 300).map((id) => progressCol.doc(id)));
      for (const doc of docs) if (doc.exists) rows.set(doc.id, doc.data() as CardProgress);
    }

    const now = Date.now();
    await applySummaryDelta(userId, {
      added: sumCounts(
        entered.map((id) => (brandNew.has(id) ? undefined : rows.get(id))),
        now,
      ),
      removed: sumCounts(
        left.map((id) => rows.get(id)),
        now,
      ),
    });

    const doomed = deleteIds.filter((id) => rows.has(id));
    for (let i = 0; i < doomed.length; i += 400) {
      const batch = db.batch();
      for (const id of doomed.slice(i, i + 400)) batch.delete(progressCol.doc(id));
      await batch.commit();
    }
  } catch (error) {
    console.error("Failed to sync today summary:", error);
  }
}

/** Apply a counter delta to the stored summary in a transaction (no-op if none is stored). */
async function applySummaryDelta(
  userId: string,
  delta: { added: CardCounts; removed: CardCounts },
): Promise<void> {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const userRef = db.collection("users").doc(userId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) return;
    const next = applyCountDelta(readTodaySummary(snap.data()?.todaySummary), delta, Date.now());
    if (next) tx.update(userRef, { todaySummary: next });
  });
}

export const getMySets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db.collection("study_sets").where("ownerId", "==", context.userId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
  });

/**
 * Fetch a set by id, for both reading and studying it. A signed-out visitor
 * may call this too (`context.userId` is `null` then) — anyone can read a
 * set that's `isPublic: true`; a private set is only returned to its owner.
 * Editing/deleting/toggling-public stay owner-only, checked separately below.
 *
 * `id` is either the document id or the set's `shareId`, so a /sets/{shareId}
 * link resolves through the same page as an owner's own /sets/{docId} link.
 */
export const getSetById = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const collection = db.collection("study_sets");

    let doc = await collection.doc(data.id).get();
    if (!doc.exists) {
      const bySnap = await collection.where("shareId", "==", data.id).limit(1).get();
      if (bySnap.empty) return null;
      doc = bySnap.docs[0];
    }

    const set = { id: doc.id, ...doc.data() } as StudySet;
    if (set.ownerId !== context.userId && !set.isPublic) return null;
    return set;
  });

export const getPublicSets = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const snap = await db.collection("study_sets").where("isPublic", "==", true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
});

export const createSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      description: string;
      subject: string;
      cards: DraftCard[];
      isReference?: boolean;
      termLanguage?: string;
      termLangCode?: LanguageCode;
      defLangCode?: LanguageCode;
      definitionLanguage2?: string;
      defLang2Code?: LanguageCode;
      folder?: string;
      /** The cards came from AI generation: incomplete nouns are refused. */
      aiGenerated?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const id = uidServer();
    const now = Date.now();
    const folder = data.folder?.trim();
    const definitionLanguage2 = data.definitionLanguage2?.trim();
    // Validated rather than trusted: the codes arrive over the wire, and an
    // unrecognized one must not be stored as if it were canonical.
    const termLangCode = asLanguageCode(data.termLangCode);
    const defLangCode = asLanguageCode(data.defLangCode);
    const defLang2Code = asLanguageCode(data.defLang2Code);
    // Resolved from this same request's own language fields — a set being
    // created has no prior document to read them back from.
    const isGermanTermLanguage =
      resolveSetLanguages({ termLanguage: data.termLanguage, termLangCode: termLangCode ?? undefined })
        .term === "de";
    const dictLookup = await germanDictLookup(isGermanTermLanguage);
    const cards = toCards(data.cards, { isGermanTermLanguage, dictLookup });
    // AI output never lands as a thin noun card: a noun needs gender, plural and
    // an example, judged on the enrichment this very save would store. The
    // editor pre-flags these (`checkAiDraftCards`); this is the backstop, so
    // Cloze/Satzbau pools can't be silently fed incomplete AI cards.
    if (data.aiGenerated) {
      const incomplete = cards.filter(
        (card) => missingNounFields(card, isGermanTermLanguage).length > 0,
      );
      if (incomplete.length > 0) {
        throw new Error(
          `${incomplete.length} noun card${incomplete.length === 1 ? " is" : "s are"} missing gender, plural or an example: ${incomplete
            .slice(0, 5)
            .map((c) => c.term)
            .join(", ")}. Complete them to save.`,
        );
      }
    }
    const next: StudySet = {
      id,
      title: data.title.trim() || "Untitled set",
      description: data.description.trim(),
      subject: data.subject.trim() || "General",
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      cards,
      ownerId: context.userId,
      isPublic: false,
      shareId: shareIdServer(),
      copyCount: 0,
      isReference: data.isReference ?? false,
      ...(data.termLanguage ? { termLanguage: data.termLanguage } : {}),
      ...(termLangCode ? { termLangCode } : {}),
      ...(defLangCode ? { defLangCode } : {}),
      ...(definitionLanguage2 ? { definitionLanguage2 } : {}),
      ...(defLang2Code ? { defLang2Code } : {}),
      ...(folder ? { folder } : {}),
    };
    await db.collection("study_sets").doc(id).set(next);
    await syncSummaryForSetChange({ userId: context.userId, before: null, after: next });
    return next;
  });

/** The language-code fields, the only ones where `null` means "clear it". */
const LANGUAGE_CODE_KEYS = ["termLangCode", "defLangCode", "defLang2Code"] as const;

function isLanguageCodeKey(key: string): boolean {
  return (LANGUAGE_CODE_KEYS as readonly string[]).includes(key);
}

/**
 * What `updateSetMeta` accepts. Language codes take `null` as an explicit
 * "clear this", distinct from `undefined`, which continues to mean "leave it
 * alone" for every field.
 */
export type SetMetaPatch = Partial<
  Pick<
    StudySet,
    | "title"
    | "description"
    | "subject"
    | "isReference"
    | "termLanguage"
    | "definitionLanguage2"
    | "folder"
  >
> & {
  termLangCode?: LanguageCode | null;
  defLangCode?: LanguageCode | null;
  defLang2Code?: LanguageCode | null;
};

export const updateSetMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; patch: SetMetaPatch }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore, FieldValue } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to edit this set.");
    }
    const now = Date.now();
    // Firestore's update() rejects an explicit `undefined` field value —
    // drop any patch keys left `undefined` (e.g. a set with no termLanguage)
    // instead of sending them through.
    //
    // The language codes are the one exception, and only they: an explicit
    // `null` there means "this set no longer has a language for this slot",
    // which has to remove the field rather than leave the old code behind.
    // Every other field keeps its existing behavior.
    const cleanPatch = Object.fromEntries(
      Object.entries(data.patch)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) =>
          value === null && isLanguageCodeKey(key) ? [key, FieldValue.delete()] : [key, value],
        ),
    );
    await ref.update({ ...cleanPatch, updatedAt: now });
    // `isReference` decides whether a set counts toward Today at all.
    if ("isReference" in cleanPatch) {
      const before = doc.data() as StudySet;
      await syncSummaryForSetChange({
        userId: context.userId,
        before,
        after: { ...before, isReference: cleanPatch.isReference as boolean | undefined },
      });
    }
    return { ok: true };
  });

export const replaceCards = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; cards: DraftCardWithProgress[] }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to edit this set.");
    }
    const existing = doc.data() as StudySet;
    const previous = new Map(existing.cards.map((c) => [c.term.trim().toLowerCase(), c]));
    // Read from the existing document, not from `data` — replaceCards never
    // touches a set's language fields, so its own language is the only
    // thing that can decide whether enrichment applies here.
    const isGermanTermLanguage = resolveSetLanguages(existing).term === "de";
    const dictLookup = await germanDictLookup(isGermanTermLanguage);
    // Learning progress is keyed by card id, so a card that survives an edit
    // has to keep its id — minting a new one on every save would orphan the
    // user's whole review history for that card.
    const usedIds = new Set<string>();
    const nextCards = data.cards
      .map((d): Card | null => {
        const term = d.term.trim();
        const definition = d.definition.trim();
        if (!term && !definition) return null;
        const prior = previous.get(term.toLowerCase());
        const status = d.status ?? prior?.status;
        // Two cards can share a term; only the first inherits the id.
        const keptId = prior && !usedIds.has(prior.id) ? prior.id : uidServer();
        usedIds.add(keptId);
        // An editor that knows about examples always sends the field (empty
        // string = cleared); one that doesn't omits it, so keep what's there.
        const example =
          d.example !== undefined ? d.example?.trim() || null : (prior?.example ?? null);
        // Same rule for the per-case examples: absent = keep, never dropped.
        const examples =
          d.examples !== undefined ? sanitizeExamples(d.examples) : (prior?.examples ?? null);
        const definition2 =
          d.definition2 !== undefined
            ? d.definition2?.trim() || null
            : (prior?.definition2 ?? null);
        const note = d.note !== undefined ? d.note?.trim() || null : (prior?.note ?? null);
        const enrichmentContext = { isGermanTermLanguage, dictLookup };
        const enrichment =
          d.enrichment !== undefined
            ? resolveEnrichment(term, d.enrichment, enrichmentContext)
            : resolveEnrichmentOnOmit(term, prior?.enrichment, enrichmentContext);
        return {
          id: keptId,
          term,
          definition,
          starred: d.starred ?? prior?.starred ?? false,
          imageUrl: d.imageUrl || null,
          example,
          examples,
          definition2,
          note,
          enrichment,
          ...(status ? { status } : {}),
        };
      })
      .filter((c): c is Card => c !== null);
    const now = Date.now();
    await ref.update({ cards: nextCards, updatedAt: now });
    // No row deletion here: a removed card — or a term edit, which mints a new
    // id — leaves its old progress row in place. Only `deleteSet` deletes rows.
    await syncSummaryForSetChange({
      userId: context.userId,
      before: existing,
      after: { ...existing, cards: nextCards },
    });
    return nextCards;
  });

export const deleteSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to delete this set.");
    }
    const before = doc.data() as StudySet;
    // Read the set's progress rows first: they classify what leaves the
    // counters, and then they are deleted — a deleted set's rows are dead.
    const rowsSnap = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .where("setId", "==", data.id)
      .get();
    const knownRows = new Map(rowsSnap.docs.map((d) => [d.id, d.data() as CardProgress]));
    await ref.delete();
    await syncSummaryForSetChange({
      userId: context.userId,
      before,
      after: null,
      knownRows,
      deleteIds: [...knownRows.keys()],
    });
    return { ok: true };
  });

export const togglePublic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("study_sets").doc(data.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== context.userId) {
      throw new Error("You don't have permission to change this set.");
    }
    const nextIsPublic = !doc.data()?.isPublic;
    await ref.update({ isPublic: nextIsPublic });
    return nextIsPublic;
  });

export const copyPublicSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const sourceDoc = await db.collection("study_sets").doc(data.id).get();
    if (!sourceDoc.exists || sourceDoc.data()?.isPublic !== true) {
      throw new Error("This set isn't public.");
    }
    const source = sourceDoc.data() as StudySet;
    const id = uidServer();
    const now = Date.now();
    const cloned: StudySet = {
      ...source,
      id,
      ownerId: context.userId,
      isPublic: false,
      // A copy is its own set: fresh share link, its own (zero) copy count,
      // and a pointer back to where it came from.
      shareId: shareIdServer(),
      copyCount: 0,
      copiedFrom: {
        setId: sourceDoc.id,
        ownerId: source.ownerId,
        title: source.title,
      },
      createdAt: now,
      updatedAt: now,
      lastStudiedAt: null,
      // Content only — the copier starts from zero, not from the original
      // owner's mastery, stars, or excluded/archived flags.
      cards: source.cards.map((c) => freshCardCopy(c, uidServer())),
    };
    await db.collection("study_sets").doc(id).set(cloned);
    await syncSummaryForSetChange({ userId: context.userId, before: null, after: cloned });

    // Best-effort: the copy already succeeded, so a failed counter bump must
    // not fail the call. `increment` keeps concurrent copies from racing.
    try {
      const { FieldValue } = await import("./firebase-admin.server");
      await sourceDoc.ref.update({ copyCount: FieldValue.increment(1) });
    } catch (error) {
      console.error("Failed to bump copyCount:", error);
    }

    return cloned;
  });

type TransferCardsInput = { sourceSetId: string; targetSetId: string; cardIds: string[] };

/**
 * Shared by `copyCardsToSet` and `moveCardsToSet`: add the selected cards
 * (as fresh copies, mastery/starred reset) to `targetSetId`, which must be
 * owned by the caller. For a move, the cards are also removed from
 * `sourceSetId`, which must then be owned by the caller too; for a copy the
 * source only needs to be readable (own set, or someone else's public set —
 * same rule as `getSetById`).
 */
async function transferCards(userId: string, data: TransferCardsInput, removeFromSource: boolean) {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const sourceRef = db.collection("study_sets").doc(data.sourceSetId);
  const targetRef = db.collection("study_sets").doc(data.targetSetId);
  const [sourceDoc, targetDoc] = await Promise.all([sourceRef.get(), targetRef.get()]);

  if (!targetDoc.exists || targetDoc.data()?.ownerId !== userId) {
    throw new Error("You don't have permission to add cards to that set.");
  }
  if (!sourceDoc.exists) {
    throw new Error("The source set no longer exists.");
  }
  const source = sourceDoc.data() as StudySet;
  if (removeFromSource && source.ownerId !== userId) {
    throw new Error("You don't have permission to remove cards from that set.");
  }
  if (!removeFromSource && source.ownerId !== userId && !source.isPublic) {
    throw new Error("You don't have permission to read that set.");
  }

  const idSet = new Set(data.cardIds);
  const selected = source.cards.filter((c) => idSet.has(c.id));
  if (selected.length === 0) {
    throw new Error("No matching cards found.");
  }

  const target = targetDoc.data() as StudySet;
  const addedCards: Card[] = selected.map((c) => freshCardCopy(c, uidServer()));
  const now = Date.now();
  const targetCards = [...target.cards, ...addedCards];
  await targetRef.update({ cards: targetCards, updatedAt: now });
  await syncSummaryForSetChange({
    userId,
    before: target,
    after: { ...target, cards: targetCards },
  });

  let sourceCards = source.cards;
  if (removeFromSource) {
    sourceCards = source.cards.filter((c) => !idSet.has(c.id));
    await sourceRef.update({ cards: sourceCards, updatedAt: now });
    // No `deleteIds`: a move mints new card ids in the target and leaves the
    // old progress row where it is. Whether a move should carry progress over
    // is its own decision, not part of the due-count fix.
    await syncSummaryForSetChange({
      userId,
      before: source,
      after: { ...source, cards: sourceCards },
    });
  }

  return { addedCount: addedCards.length, targetCards, sourceCards };
}

export const copyCardsToSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: TransferCardsInput) => input)
  .handler(({ context, data }) => transferCards(context.userId, data, false));

export const moveCardsToSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: TransferCardsInput) => input)
  .handler(({ context, data }) => transferCards(context.userId, data, true));

/**
 * Record one graded review: append the raw event, advance the scheduler, roll
 * the card's counters, and add to the day's totals — one round trip, one
 * transaction.
 *
 * This is the ONLY path that writes learning progress. The three collections
 * live under `users/{userId}/`, where the id always comes from the verified
 * session, never from the request body, so a caller can only ever write their
 * own history.
 *
 * Scheduling happens here rather than on the client: the client can't be
 * trusted to compute a due date, and running it inside the transaction means
 * the next interval is always derived from the state actually stored.
 */
export const recordReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => recordReviewSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore, FieldValue } = await import("./firebase-admin.server");
    const db = getAdminFirestore();

    // A review only makes sense against a set the caller can actually open —
    // same rule as `getSetById`. Without this, any card/set id pair would be
    // accepted and quietly fill the history with rows for sets that the
    // caller can't see, or that don't exist at all.
    const setDoc = await db.collection("study_sets").doc(data.setId).get();
    if (!setDoc.exists) throw new Error("That set no longer exists.");
    const studySet = setDoc.data() as StudySet;
    if (studySet.ownerId !== context.userId && !studySet.isPublic) {
      throw new Error("You don't have permission to study that set.");
    }

    const now = Date.now();
    const correct = isCorrectRating(data.rating);
    const userRef = db.collection("users").doc(context.userId);
    const progressRef = userRef.collection("cardProgress").doc(data.cardId);
    const eventRef = userRef.collection("reviewEvents").doc();
    const dailyRef = userRef.collection("dailyStats").doc(data.date);

    const outcome = await db.runTransaction(async (tx) => {
      // Both reads first: a Firestore transaction refuses a read after a write.
      // The scheduler needs the state it is advancing from, and a streak of
      // correct answers has to be read before it can be extended or broken.
      const previous = (await tx.get(progressRef)).data() as CardProgress | undefined;
      const user = (await tx.get(userRef)).data() as Partial<UserDoc> | undefined;

      const plan = planReview({
        userId: context.userId,
        cardId: data.cardId,
        setId: data.setId,
        eventId: eventRef.id,
        rating: data.rating,
        date: data.date,
        responseTimeMs: data.responseTimeMs,
        previous: previous ?? null,
        now,
        scheduler,
      });

      // Paid only on a card's first review of the day — the same day-key
      // decision that drives `uniqueWordsReviewed`, so the cap and the counter
      // can never disagree about what "today" means.
      const xpDelta = xpForReview(data.rating, plan.daily.uniqueWordsReviewed > 0);

      /**
       * Did this review just finish the set?
       *
       * Settled inside the transaction, before any write, so the bonus and the
       * "already paid" list move together and a set can never pay twice. The
       * read only happens when this card has itself just reached mastery and
       * the set has not been completed before — on an ordinary review it costs
       * nothing.
       */
      const completedSets = Array.isArray(user?.completedSets) ? user.completedSets : [];
      const activeIds = new Set(studySet.cards.filter(isCardActive).map((card) => card.id));
      let setJustCompleted = false;

      if (
        plan.progress.masteryScore >= MASTERED_SCORE &&
        activeIds.size > 0 &&
        !completedSets.includes(data.setId)
      ) {
        const mastered = await tx.get(
          userRef
            .collection("cardProgress")
            .where("setId", "==", data.setId)
            .where("masteryScore", ">=", MASTERED_SCORE),
        );
        // This card's new score is not stored yet — it is being written by
        // this very transaction — so count it here. Cards no longer in the set
        // are ignored, or a deleted card could "complete" a set on its own.
        const masteredIds = new Set(mastered.docs.map((doc) => doc.id));
        masteredIds.add(data.cardId);
        setJustCompleted = [...activeIds].every((id) => masteredIds.has(id));
      }

      const completionBonus = setJustCompleted ? SET_COMPLETION_XP : 0;

      // The counters are stored as increments so concurrent reviews of
      // different cards can't clobber each other's totals; the resolved values
      // in `plan.progress` are what gets returned to the client.
      const update: PartialWithFieldValue<CardProgress> = {
        ...plan.progress,
        totalReviews: FieldValue.increment(1),
        correctReviews: FieldValue.increment(correct ? 1 : 0),
        // Raw miss-type counters (Adım 5) — written only on an actual miss
        // from the matching drill, never read back by scheduling/mastery/
        // Today/weak. `plan.progress` above is what those all read; these
        // two fields are deliberately outside it.
        ...(data.missKind === "article" && !correct
          ? { articleMissCount: FieldValue.increment(1) }
          : {}),
        ...(data.missKind === "case" && !correct ? { caseMissCount: FieldValue.increment(1) } : {}),
      };
      const daily: PartialWithFieldValue<DailyStats> = {
        date: plan.daily.date,
        reviews: FieldValue.increment(plan.daily.reviews),
        correctReviews: FieldValue.increment(plan.daily.correctReviews),
        studySeconds: FieldValue.increment(plan.daily.studySeconds),
        // 0 for a card already counted today, so grading the same word three
        // times moves `reviews` by 3 and this by 1. The dedup decision is made
        // in `planReview` from the progress row this transaction already read —
        // no extra read, and it is testable without a database.
        uniqueWordsReviewed: FieldValue.increment(plan.daily.uniqueWordsReviewed),
        xpEarned: FieldValue.increment(xpDelta + completionBonus),
      };

      // XP and the lifetime counters are written as resolved values rather
      // than increments: the transaction has just read them, and the total has
      // to be clamped at zero, which `FieldValue.increment` cannot do.
      // Keep the Home summary in step inside the same transaction. Only for
      // cards the summary actually counts (own, studiable set, active card);
      // anything else — or a summary that is stale — is left for the next Home
      // read to rebuild.
      const countsForToday =
        studySet.ownerId === context.userId &&
        isStudiableSet(studySet) &&
        activeIds.has(data.cardId);
      const todaySummary = countsForToday
        ? applyReviewToSummary(readTodaySummary(user?.todaySummary), {
            previous: previous ?? null,
            next: plan.progress as CardProgress,
            now,
          })
        : null;

      const profile: Partial<UserDoc> = {
        id: context.userId,
        totalXP: applyXp(user?.totalXP ?? 0, xpDelta + completionBonus),
        totalReviews: (user?.totalReviews ?? 0) + 1,
        perfectRun: nextPerfectRun(user?.perfectRun ?? 0, data.rating),
        updatedAt: now,
        ...(setJustCompleted ? { completedSets: [...completedSets, data.setId] } : {}),
        ...(todaySummary ? { todaySummary } : {}),
        ...(user === undefined ? { createdAt: now } : {}),
      };

      tx.set(progressRef, update, { merge: true });
      // A fresh document id every time: the log is append-only, never updated.
      tx.set(eventRef, plan.event);
      tx.set(dailyRef, daily, { merge: true });
      tx.set(userRef, profile, { merge: true });

      return {
        progress: plan.progress,
        // The day's deltas, so the client can update the goal ring and the XP
        // bar without re-reading the day — and without re-deriving the
        // first-review-today rule for itself.
        dailyDelta: { ...plan.daily, xpEarned: xpDelta + completionBonus },
        xpDelta: xpDelta + completionBonus,
        setJustCompleted,
        completedSets: profile.completedSets ?? completedSets,
        totalXP: profile.totalXP ?? 0,
        totalReviews: profile.totalReviews ?? 0,
        perfectRun: profile.perfectRun ?? 0,
        achievements: user?.achievements,
        // Already computed (applyReviewToSummary, bandOf-based delta) and
        // already written above — handing it back is free. Without this the
        // client's own todaySummary/`due` only updates on the next explicit
        // fetchTodaySummary() call, which a same-session return to Home does
        // not trigger, so "N due" stayed stale until then. `null` when this
        // review isn't the owner's own studiable/active card (countsForToday
        // false) or there was no prior summary to patch — the client leaves
        // its state alone in that case, same as today.
        todaySummary,
      };
    });
    const progress = outcome.progress;

    // A completed review is the study activity a streak should count — not
    // merely opening a study mode. Best-effort: the review is already stored,
    // so a streak hiccup must not fail the call.
    let streak: StreakInfo | null = null;
    try {
      streak = await recordStudyActivityFor(context.userId);
    } catch (error) {
      console.error("Failed to record streak activity:", error);
    }

    // Achievements are settled after the streak, because one of them asks how
    // long the streak is. Outside the transaction and best-effort for the same
    // reason as the streak: the review is already stored, and a badge is never
    // worth failing a recorded review over.
    let unlocked: AchievementId[] = [];
    try {
      const already = outcome.achievements ?? {};
      // Both mastery badges cost a query, so they are only counted when this
      // review could actually have moved them: a card joins the mastered pile
      // on its own review, and nothing else. An already-earned badge is never
      // re-counted.
      const crossedMastery = progress.masteryScore >= MASTERED_SCORE;

      unlocked = await unlockAchievementsFor({
        userRef,
        stats: {
          currentStreak: streak?.currentStreak ?? 0,
          perfectRun: outcome.perfectRun,
          masteredCards:
            crossedMastery && !("mastered_10" in already) ? await countMasteredCards(userRef) : 0,
          // Already settled inside the transaction — no second query.
          setsCompleted: outcome.completedSets.length,
        },
        already,
        now,
      });
    } catch (error) {
      console.error("Failed to record achievements:", error);
    }

    return {
      ok: true as const,
      progress,
      streak,
      xp: { total: outcome.totalXP, gained: outcome.xpDelta },
      dailyDelta: outcome.dailyDelta,
      unlocked,
      // Only on the review that finished the set, and only ever once per set.
      setCompleted: outcome.setJustCompleted
        ? { setId: data.setId, title: studySet.title, xp: SET_COMPLETION_XP }
        : null,
      // See the comment on `todaySummary` inside the transaction above.
      todaySummary: outcome.todaySummary,
    };
  });

/** How many of this user's cards have reached the mastered score. */
async function countMasteredCards(userRef: FirebaseFirestore.DocumentReference): Promise<number> {
  const snap = await userRef
    .collection("cardProgress")
    .where("masteryScore", ">=", MASTERED_SCORE)
    .count()
    .get();
  return snap.data().count;
}

/**
 * Write any achievements these totals have just earned, and return them.
 *
 * A merge write of only the new ids: Firestore merges maps field by field, so
 * an existing unlock timestamp is never overwritten and a badge keeps the date
 * it was actually earned.
 */
async function unlockAchievementsFor(input: {
  userRef: FirebaseFirestore.DocumentReference;
  stats: AchievementStats;
  already: Record<string, unknown> | undefined;
  now: number;
}): Promise<AchievementId[]> {
  const ids = newlyUnlocked(input.stats, input.already);
  if (ids.length === 0) return [];

  const achievements = Object.fromEntries(ids.map((id) => [id, input.now]));
  await input.userRef.set({ achievements }, { merge: true });
  return ids;
}

/** One card's progress for the signed-in user, or null if never reviewed. */
export const getCardProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => cardProgressQuerySchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .doc(data.cardId)
      .get();
    if (!doc.exists) return null;
    return doc.data() as CardProgress;
  });

/**
 * Every progress row the signed-in user has for one set — the read path the
 * study modes, the Leitner boxes and the mastery bar all run on.
 *
 * Scoped by `setId` rather than fetching the whole collection so opening a set
 * costs one query regardless of how much history the user has elsewhere.
 */
export const getSetProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setProgressQuerySchema.parse(input))
  .handler(async ({ context, data }): Promise<CardProgress[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .where("setId", "==", data.setId)
      .get();
    return snap.docs.map((d) => d.data() as CardProgress);
  });

/**
 * Every progress row the signed-in user has, across all their sets.
 *
 * One query for the whole library grid, instead of one per set card. Bounded
 * by cards actually reviewed, not by cards owned.
 */
export const getAllProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CardProgress[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db.collection("users").doc(context.userId).collection("cardProgress").get();
    return snap.docs.map((d) => d.data() as CardProgress);
  });

/**
 * Forget everything the signed-in user has learned about one set: their
 * progress rows go, the set's content does not.
 *
 * The review event log is deliberately left alone — it is an append-only
 * record of what actually happened, and resetting progress doesn't unhappen it.
 */
export const resetSetProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setProgressQuerySchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const snap = await db
      .collection("users")
      .doc(context.userId)
      .collection("cardProgress")
      .where("setId", "==", data.setId)
      .get();

    // Firestore caps a batch at 500 writes.
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = db.batch();
      for (const doc of snap.docs.slice(i, i + 400)) batch.delete(doc.ref);
      await batch.commit();
    }
    // Cards of this set that count toward Today go back to "new"; their due/weak
    // contributions leave with the rows. Best-effort, like every summary patch.
    try {
      const setDoc = await db.collection("study_sets").doc(data.setId).get();
      if (setDoc.exists && setDoc.data()?.ownerId === context.userId) {
        const counted = countedCardIds({ id: setDoc.id, ...setDoc.data() } as StudySet);
        const rows = snap.docs
          .filter((d) => counted.has(d.id))
          .map((d) => d.data() as CardProgress);
        const gone = sumCounts(rows, Date.now());
        await applySummaryDelta(context.userId, {
          added: { new: rows.length, due: 0, weak: 0 },
          removed: { new: 0, due: gone.due, weak: gone.weak },
        });
      }
    } catch (error) {
      console.error("Failed to sync today summary:", error);
    }
    return { ok: true as const, cleared: snap.size };
  });

/**
 * The signed-in user's settings document.
 *
 * `users/{uid}` was a phantom until now — a path prefix that carried the
 * cardProgress/reviewEvents/dailyStats subcollections and no fields of its
 * own. The daily goal is the first thing that belongs on the user rather than
 * on a set or a card, so the document becomes real here.
 *
 * Note what is NOT duplicated onto it: the streak still lives in
 * `user_streaks/{uid}`, and the day's counters still live in
 * `dailyStats/{date}`. Copying either here would create a second source of
 * truth for something already stored.
 */
type UserDoc = {
  id: string;
  dailyGoal: number;
  timeZone: string;
  /** Lifetime XP, never negative. */
  totalXP: number;
  /** Reviews this user has recorded, ever — what the milestone badges count. */
  totalReviews: number;
  /** Consecutive good/easy answers; any `again` or `hard` resets it to 0. */
  perfectRun: number;
  /** Unlocked achievement id -> the epoch ms it was earned. */
  achievements: Record<string, number>;
  /** Sets whose every active card has reached mastery, so the bonus pays once. */
  completedSets: string[];
  /** Sound preferences, mirrored to the device for instant playback. */
  soundSettings: SoundSettings;
  /**
   * Session length per set (see session-pass.ts): the cap and this pass's
   * served card ids, keyed by set document id. Lives on the user document —
   * no new collection — and works for a set the user doesn't own.
   */
  setSessions?: Record<string, { cap: number | null; served: string[] }>;
  /**
   * Cached Home "Today" counts, kept current by the write paths. Absent =
   * "build from scratch on the next Home read".
   */
  todaySummary: TodaySummary;
  /** The two learning preferences — see learning-prefs.ts. Nothing else is asked for. */
  explanationLanguage: ExplanationLanguage;
  direction: Direction;
  /** Set when the learner saves or dismisses the one-time prefs prompt. */
  prefsPrompted: boolean;
  /** Epoch ms from the server clock, matching every other timestamp we store. */
  createdAt: number;
  updatedAt: number;
};

const updateDailyGoalSchema = z.object({
  goal: z
    .number()
    .int()
    .refine(isDailyGoalOption, { message: "goal must be one of 5, 10, 20 or 30" }),
  /**
   * The viewer's IANA timezone, when the caller knows it (the browser does:
   * `Intl.DateTimeFormat().resolvedOptions().timeZone`). Optional so a goal
   * can be saved without one; stored so the server can eventually work out
   * which local day a review belongs to on its own.
   */
  timeZone: z.string().trim().max(64).refine(isTimeZoneName).optional(),
});

const soundSettingsSchema = z.object({
  enabled: z.boolean(),
  volume: z.number().int().min(0).max(100),
});

const setSessionSchema = z.object({
  setId: idSchema,
  cap: z.number().int().min(1).max(10000).nullable(),
  served: z.array(idSchema).max(MAX_SERVED_IDS),
});

const learningPrefsSchema = z.object({
  explanationLanguage: z.string().refine(isExplanationLanguage, "unknown explanation language"),
  direction: z.string().refine(isDirection, "unknown direction"),
});

const profileQuerySchema = z.object({ date: dateKeySchema });
const dailyStatsRangeSchema = z.object({ dates: z.array(dateKeySchema).min(1).max(31) });

function readSetSessions(stored: unknown): Record<string, SetSession> {
  if (!stored || typeof stored !== "object") return {};
  return Object.fromEntries(
    Object.entries(stored as Record<string, unknown>).map(([id, value]) => [id, readSetSession(value)]),
  );
}

/** Turn a stored `users/{uid}` document into the profile the UI reads. */
function readProfile(stored: unknown, masteredCards: number): UserProfile {
  const doc = (stored ?? {}) as Record<string, unknown>;
  const settings = readUserSettings(doc);
  const count = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  const achievements =
    doc.achievements && typeof doc.achievements === "object"
      ? (doc.achievements as Record<string, number>)
      : {};

  return {
    dailyGoal: settings.dailyGoal,
    timeZone: settings.timeZone,
    totalXP: count(doc.totalXP),
    totalReviews: count(doc.totalReviews),
    perfectRun: count(doc.perfectRun),
    masteredCards,
    achievements,
    soundSettings: readSoundSettings(doc.soundSettings),
    setSessions: readSetSessions(doc.setSessions),
    ...readLearningPrefs(doc),
    prefsPrompted: doc.prefsPrompted === true,
  };
}

/**
 * Store the signed-in user's sound preferences.
 *
 * Kept on the profile rather than only on the device, so a learner who mutes
 * the app on their phone does not get chimed at on their laptop.
 */
export const updateSoundSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => soundSettingsSchema.parse(input))
  .handler(async ({ context, data }): Promise<SoundSettings> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("users").doc(context.userId);
    const now = Date.now();
    const existing = await ref.get();

    const patch: Partial<UserDoc> = {
      id: context.userId,
      soundSettings: data,
      updatedAt: now,
      ...(existing.exists ? {} : { createdAt: now }),
    };
    await ref.set(patch, { merge: true });
    return data;
  });

/**
 * Store one set's session length state (cap + this pass's served ids) on the
 * user document. Preference/bookkeeping only: never touches scheduling, due
 * dates or the Home summary.
 */
export const updateSetSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => setSessionSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("users").doc(context.userId);
    const now = Date.now();
    const existing = await ref.get();
    await ref.set(
      {
        id: context.userId,
        setSessions: { [data.setId]: { cap: data.cap, served: data.served } },
        updatedAt: now,
        ...(existing.exists ? {} : { createdAt: now }),
      },
      { merge: true },
    );
    return { ok: true };
  });

/**
 * Store the two learning preferences. Saving from the one-time prompt and from
 * the Account tab go through here; either way the prompt is marked as seen.
 */
export const updateLearningPrefs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => learningPrefsSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("users").doc(context.userId);
    const now = Date.now();
    const existing = await ref.get();
    await ref.set(
      {
        id: context.userId,
        explanationLanguage: data.explanationLanguage,
        direction: data.direction,
        prefsPrompted: true,
        updatedAt: now,
        ...(existing.exists ? {} : { createdAt: now }),
      },
      { merge: true },
    );
    return {
      explanationLanguage: data.explanationLanguage as ExplanationLanguage,
      direction: data.direction as Direction,
      prefsPrompted: true as const,
    };
  });

/** The learner dismissed the one-time prompt without changing anything. */
export const dismissLearningPrefsPrompt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const ref = getAdminFirestore().collection("users").doc(context.userId);
    const now = Date.now();
    const existing = await ref.get();
    await ref.set(
      {
        id: context.userId,
        prefsPrompted: true,
        updatedAt: now,
        ...(existing.exists ? {} : { createdAt: now }),
      },
      { merge: true },
    );
    return { prefsPrompted: true as const };
  });

/**
 * Everything the home cards and the account page read about the signed-in
 * user: the daily goal, the XP totals, the unlocked achievements, and today.
 *
 * One call rather than one per card. `date` is the viewer's local day for the
 * same reason `recordReview` takes one — the server cannot work out which
 * calendar day an evening review belongs to.
 *
 * Never fails for a user who has no settings document, which is every user who
 * has not set a goal: it returns defaults and zeroes instead.
 */
export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => profileQuerySchema.parse(input))
  .handler(async ({ context, data }): Promise<{ profile: UserProfile; today: DailyStats }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(context.userId);

    const [userDoc, todayDoc, mastered] = await Promise.all([
      userRef.get(),
      userRef.collection("dailyStats").doc(data.date).get(),
      countMasteredCards(userRef),
    ]);

    return {
      profile: readProfile(userDoc.exists ? userDoc.data() : null, mastered),
      today: readDailyStats(data.date, todayDoc.exists ? todayDoc.data() : null),
    };
  });

/**
 * Home's "Today" numbers: the cached summary when it can be trusted, otherwise
 * a recompute.
 *
 * The cache lies in exactly two ways with no write event to fix it — the UTC
 * day rolled, or `nextDueAt` passed (cards go due overnight while nobody
 * reviews) — and `isSummaryFresh` checks both. The trusted path is one
 * document read.
 *
 * `due`/`nextDueAt` are ONLY ever set from `buildTodaySummary` (bandOf-based,
 * same definition `reviewSummary`/the set-card badges use: reviewed, active,
 * studiable-set cards only) — never from a raw Firestore `count()` over
 * `dueAt <= now`. That raw count used to serve as a "cheap ~2-read" refresh
 * for exactly this path, but it isn't filtered by `isCardActive`/
 * `isStudiableSet`/`state !== "new"` the way `bandOf` is, so it could show
 * Home a higher "N due" than every set card's own badge summed to. There is
 * no cheap approximation of the real definition, so a stale `due`/
 * `nextDueAt` now costs the same sets+progress read regardless of whether
 * `needsFullRebuild`'s weekly threshold has also been crossed — see this
 * function's own comment below on what that changes.
 *
 * The weekly orphan sweep (rows whose card is provably gone) still runs only
 * inside `needsFullRebuild`, not on every due-refresh — dropping a `cardId`
 * mid-scan does not change the `due` number that scan already includes it
 * correctly in (an orphan row is either due or not, same as any other row,
 * until the sweep removes it for good).
 */
// One-time recount marker for the raw-count() `due` fix above (see
// `getTodaySummary`'s `dueGhostSuspect` check): any summary built before this
// ships is treated as stale exactly once, so its `due` gets recomputed via
// `buildTodaySummary` instead of being served as cached. Never bump this
// again for the same reason — a real cache-format change gets its own guard.
const DUE_RECOUNT_EPOCH = 1790184588700; // this fix's deploy time

export const getTodaySummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ summary: TodaySummary; dailyGoal: number }> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(context.userId);
    const userDoc = await userRef.get();
    const stored = userDoc.exists ? userDoc.data() : undefined;
    const { dailyGoal } = readUserSettings(stored);
    const now = Date.now();

    const cached = readTodaySummary(stored?.todaySummary);
    // One-time: a summary built before DUE_RECOUNT_EPOCH may still carry the
    // over-counted `due` the old raw-count() path wrote (ghost, e.g. 17 vs
    // 12) — `isSummaryFresh` alone can't see that, since dayKey/nextDueAt are
    // still genuinely fresh. Treating anything built before the epoch as not
    // fresh forces exactly one real recount through the existing paths below
    // (which already only ever set `due` from `buildTodaySummary`); every
    // summary built after this deploys has `builtAt >= DUE_RECOUNT_EPOCH` and
    // skips this check as before.
    const dueGhostSuspect = cached !== null && cached.builtAt < DUE_RECOUNT_EPOCH;
    if (cached && !dueGhostSuspect && isSummaryFresh(cached, now)) {
      return { summary: cached, dailyGoal };
    }

    const progressCol = userRef.collection("cardProgress");

    try {
      // Both branches below need the real due/nextDueAt, and both need it
      // from the same bandOf-based definition — so both read the whole
      // library + progress now. This is the read-cost change from before:
      // a due-refresh that ISN'T also a weekly rebuild used to cost ~2
      // indexed reads (the raw count + the limit-1 query); it now costs the
      // same sets+progress scan a full rebuild does, just without the
      // orphan sweep.
      const [setsSnap, progressSnap] = await Promise.all([
        db.collection("study_sets").where("ownerId", "==", context.userId).get(),
        progressCol.get(),
      ]);
      const sets = setsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudySet[];
      const progress: Record<string, CardProgress> = {};
      for (const doc of progressSnap.docs) progress[doc.id] = doc.data() as CardProgress;

      if (needsFullRebuild(cached, now)) {
        // The weekly pass sees every row and every card at once, so it is the
        // one place that can safely drop rows whose card is provably gone (a
        // due count would otherwise carry them forever). Not a reaction
        // to any single edit — a comparison against the library as it is now.
        // Skipped if the library came back empty while rows exist: that looks
        // like a failed read, not a user who deleted everything.
        if (sets.length > 0) {
          const foreignIds = foreignSetIds(sets, progress);
          const existingForeign = new Set<string>();
          for (let i = 0; i < foreignIds.length; i += 300) {
            const docs = await db.getAll(
              ...foreignIds.slice(i, i + 300).map((id) => db.collection("study_sets").doc(id)),
            );
            for (const doc of docs) if (doc.exists) existingForeign.add(doc.id);
          }
          const orphanIds = findOrphanProgressIds({
            ownerSets: sets,
            rows: progress,
            existingForeignSetIds: existingForeign,
          });
          for (let i = 0; i < orphanIds.length; i += 400) {
            const batch = db.batch();
            for (const id of orphanIds.slice(i, i + 400)) batch.delete(progressCol.doc(id));
            await batch.commit();
          }
          for (const id of orphanIds) delete progress[id];
        }

        const summary: TodaySummary = buildTodaySummary(sets, progress, now);
        await userRef.set(
          {
            todaySummary: summary,
            ...(userDoc.exists ? {} : { id: context.userId, createdAt: now, updatedAt: now }),
          },
          { merge: true },
        );
        return { summary, dailyGoal };
      }

      // Not old enough for the weekly rebuild+orphan-sweep, but due/nextDueAt
      // still needs the same real recount — same bandOf-based numbers, no
      // orphan sweep this time.
      const recomputed = buildTodaySummary(sets, progress, now);
      // Merge onto whatever is stored NOW, so a review that landed since the
      // read above keeps its `new`/`weak`/`studiedToday` patch.
      const summary = await db.runTransaction(async (tx) => {
        const snap = await tx.get(userRef);
        const current = readTodaySummary(snap.data()?.todaySummary) ?? cached!;
        const next = refreshClockFields(
          current,
          { due: recomputed.due, nextDueAt: recomputed.nextDueAt },
          now,
        );
        if (snap.exists && readTodaySummary(snap.data()?.todaySummary)) {
          tx.update(userRef, {
            "todaySummary.due": next.due,
            "todaySummary.nextDueAt": next.nextDueAt,
            "todaySummary.dayKey": next.dayKey,
            "todaySummary.studiedToday": next.studiedToday,
          });
        }
        return next;
      });
      return { summary, dailyGoal };
    } catch (error) {
      console.error("Failed to store today summary:", error);
      // No raw-count fallback anymore (that was the over-counted number this
      // change removes). With a stored summary, serving it stale beats
      // showing an over-counted "N due"; without one there is nothing true
      // to serve, so this fails and the client falls back to computing
      // locally.
      if (!cached) throw error;
      return { summary: cached, dailyGoal };
    }
  });

/**
 * Named days of history, for the account page's chart.
 *
 * The caller passes the day keys it wants because only the client knows its
 * own calendar; days with no document come back as zeroes rather than gaps, so
 * a chart can plot them without deciding what a missing day means.
 */
export const getDailyStatsRange = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => dailyStatsRangeSchema.parse(input))
  .handler(async ({ context, data }): Promise<DailyStats[]> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const collection = db.collection("users").doc(context.userId).collection("dailyStats");

    const docs = await db.getAll(...data.dates.map((date) => collection.doc(date)));
    return data.dates.map((date, i) =>
      readDailyStats(date, docs[i]?.exists ? docs[i].data() : null),
    );
  });

/**
 * Set the signed-in user's daily goal, creating their settings document the
 * first time.
 *
 * A merge write, so the fields this call doesn't mention — `timeZone` when it
 * wasn't supplied, and `createdAt` — survive untouched.
 */
export const updateDailyGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => updateDailyGoalSchema.parse(input))
  .handler(async ({ context, data }): Promise<UserSettings> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const ref = db.collection("users").doc(context.userId);
    const existing = await ref.get();
    const now = Date.now();

    const patch: Partial<UserDoc> = {
      id: context.userId,
      dailyGoal: data.goal,
      updatedAt: now,
      ...(data.timeZone !== undefined ? { timeZone: data.timeZone } : {}),
      // Only on creation: a merge write would otherwise reset the original
      // date every time the goal changes.
      ...(existing.exists ? {} : { createdAt: now, timeZone: data.timeZone ?? DEFAULT_TIME_ZONE }),
    };

    await ref.set(patch, { merge: true });
    return readUserSettings({ ...existing.data(), ...patch });
  });
