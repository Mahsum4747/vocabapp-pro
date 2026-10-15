/** Deterministic source-bound clozes, not lexical promotion. No downloads or model calls. */
import "./test-register.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const { lookupVerbConjugation } = await import("../src/lib/german/verb-conjugation-data.ts");
const { lookupVerbConjugationExtended } =
  await import("../src/lib/german/verb-conjugation-extended-data.ts");
const { lookupNoun } = await import("../src/lib/german/nouns.server.ts");
const { valencyDiagnosticTokens, hasVerifiedVerbForm } =
  await import("../src/lib/curriculum/lesson-diagnostics.ts");
const { isPrepositionToken } = await import("../src/lib/german/verb-valency-index.ts");
const hash = (x) =>
  createHash("sha256")
    .update(typeof x === "string" ? x : JSON.stringify(x))
    .digest("hex");
const pack = JSON.parse(await readFile("src/content/karta-kaikki-valency-2026-10-03.json", "utf8"));
const prior = JSON.parse(
  await readFile("src/content/kaikki-fixed-item-review-2026-10-14.json", "utf8"),
);
const old = new Map(prior.records.map((r) => [r.contextId, r]));
const allCases = new Map();
for (const f of pack.frames) {
  const c = pack.contexts[f.contextId];
  const k = [c.source.recordSha256, c.senseId, f.construction, f.prep].join("|");
  if (!allCases.has(k)) allCases.set(k, new Set());
  allCases.get(k).add(f.case);
}
function finite(text, construction) {
  const tokens = valencyDiagnosticTokens(text),
    verb = construction
      .replace(/^sich /, "")
      .split(" ")
      .at(-1),
    p = lookupVerbConjugation(verb),
    e = lookupVerbConjugationExtended(verb);
  const forms = [p?.ich, p?.du, p?.er, ...(e?.imperative ?? [])]
    .filter(Boolean)
    .map((f) => valencyDiagnosticTokens(f).join(" "));
  return (
    hasVerifiedVerbForm(tokens, construction) &&
    (forms.some((f) => tokens.includes(f)) ||
      tokens.some((t) =>
        [
          "ist",
          "sind",
          "war",
          "waren",
          "hat",
          "haben",
          "habe",
          "hast",
          "hatte",
          "kann",
          "kannst",
          "koennen",
          "muss",
          "muessen",
          "soll",
          "sollen",
          "will",
          "wollen",
          "darf",
          "duerfen",
        ].includes(t),
      ))
  );
}
const casePronouns = {
  dat: { mir: "mich", dir: "dich", ihm: "ihn" },
  akk: { mich: "mir", dich: "dir", ihn: "ihm" },
};
const records = [];
// Manual inspection of every candidate: reject subject slots and an absent required argument.
const rejectedCandidates = {
  129: "target-is-subject-not-governed-object",
  821: "target-is-subject-not-governed-object",
  1073: "target-is-subject-not-governed-object",
  700: "source-example-omits-specified-prepositional-argument",
};
for (const f of pack.frames) {
  if (f.review === "eligible") continue;
  const previous = old.get(f.contextId);
  if (previous && previous.review.decision !== "hold") continue;
  const c = pack.contexts[f.contextId];
  const identity = {
    snapshotSha256: c.source.snapshotSha256,
    recordSha256: c.source.recordSha256,
    senseId: c.senseId,
    senseIndex: c.senseIndex,
    lemma: f.lemma,
    construction: f.construction,
    preposition: f.prep,
    case: f.case,
    evidence: c.evidence,
  };
  // Existing held IDs are immutable; new IDs use a source-bound content identity.
  const recordId = previous?.recordId ?? "kaikki-valency:" + hash(identity);
  const templates = c.senseMetadata.info_templates ?? [];
  const template =
    c.evidence.kind === "structured-obj-template" ? templates[c.evidence.templateIndex] : null;
  const arg = template?.args?.["2"] ?? null;
  const usage = {
    requiredReflexive: c.requiredReflexive,
    argumentSpecificationVerbatim: arg,
    tags: c.tags,
    rawTags: c.rawTags,
    entryTags: c.entryTags,
    structuralReasons: f.assessment?.structuralReasons ?? [],
  };
  const reasons = [],
    examined = [];
  if (rejectedCandidates[f.contextId]) reasons.push(rejectedCandidates[f.contextId]);
  const key = [c.source.recordSha256, c.senseId, f.construction, f.prep].join("|");
  if (!c.senseId) reasons.push("missing-sense-identity");
  if (c.evidence.kind !== "structured-obj-template")
    reasons.push("gloss-only-grammar-requires-structured-or-independent-verification");
  if (allCases.get(key).size > 1) reasons.push("same-sense-slot-has-alternative-cases");
  if (c.tags.some((t) => ["archaic", "obsolete", "dated", "rare"].includes(t)))
    reasons.push("historical-or-rare-usage-needs-current-register-review");
  if (f.case === "gen") reasons.push("genitive-contrast-needs-whole-noun-phrase-validation");
  let chosen = null;
  if (!reasons.length)
    for (const example of c.examples) {
      const rejected = [];
      const text = example?.text;
      if (example?.type !== "example" || typeof text !== "string") continue;
      if (example.tags?.length) rejected.push("example-has-additional-usage-conditions");
      if (/[/()[\]…]|\.\s+\S/.test(text))
        rejected.push("fragment-alternative-or-multiple-sentences");
      if (!finite(text, f.construction)) rejected.push("no-verified-finite-construction");
      const words = [...text.matchAll(/[\p{L}ß]+/gu)];
      const norm = words.map((m) => valencyDiagnosticTokens(m[0])[0]);
      if (
        c.requiredReflexive &&
        !norm.some((w) => ["mich", "dich", "sich", "uns", "euch"].includes(w))
      )
        rejected.push("reflexive-condition-not-visible");
      const slots = [];
      if (!rejected.length)
        for (let i = 0; i < words.length; i++) {
          const word = norm[i],
            adjacent = f.prep
              ? norm[i - 1] === valencyDiagnosticTokens(f.prep)[0]
              : !isPrepositionToken(norm[i - 1] ?? "");
          if (!adjacent) continue;
          const pronounWrong = casePronouns[f.case]?.[word];
          if (
            pronounWrong &&
            !(c.requiredReflexive && f.prep === null && ["mich", "dich"].includes(word))
          )
            slots.push({ i, wrong: pronounWrong, kind: "personal_pronoun_case", noun: null });
          // Determiners only when the adjacent head's singular gender is unanimous in the existing noun source.
          if (["dem", "den", "das", "die", "der"].includes(word) && words[i + 1]) {
            const noun = words[i + 1][0];
            const entries = lookupNoun(noun).filter(
              (n) => n.lemma === noun && n.genus.length === 1 && !n.plural.includes(noun),
            );
            const genders = new Set(entries.flatMap((n) => n.genus));
            if (entries.length && genders.size === 1) {
              const g = [...genders][0],
                correct = {
                  dat: { m: "dem", n: "dem", f: "der" },
                  akk: { m: "den", n: "das", f: "die" },
                }[f.case]?.[g];
              const wrong = {
                dat: { m: "den", n: "das", f: "die" },
                akk: { m: "dem", n: "dem", f: "der" },
              }[f.case]?.[g];
              if (word === correct)
                slots.push({
                  i,
                  wrong,
                  kind: "determiner_case",
                  noun: { lemma: noun, gender: g, source: "src/lib/german/nouns-data.ts" },
                });
            }
          }
        }
      if (slots.length !== 1)
        rejected.push(
          slots.length
            ? "multiple-possible-targets"
            : "no-unique-case-marked-target-with-source-supported-gender",
        );
      examined.push({ text: text ?? null, rejected });
      if (rejected.length) continue;
      const slot = slots[0],
        m = words[slot.i],
        start = m.index,
        end = start + m[0].length;
      if (m[0][0] === m[0][0].toUpperCase())
        slot.wrong = slot.wrong[0].toUpperCase() + slot.wrong.slice(1);
      chosen = {
        example,
        slot,
        start: [...text.slice(0, start)].length,
        end: [...text.slice(0, end)].length,
        utfStart: start,
        utfEnd: end,
      };
      break;
    }
  if (!chosen && !reasons.length)
    reasons.push(
      c.examples.length
        ? "no-safe-target-in-existing-source-examples"
        : "no-source-example-for-this-sense",
    );
  const exercise = chosen
    ? (() => {
        const { example, slot, start, end, utfStart: a, utfEnd: b } = chosen;
        const text = example.text,
          correct = text.slice(a, b);
        return {
          exerciseId: "kaikki-source-fixed-" + f.contextId,
          contentClass: "source_example_cloze",
          authorship:
            "Existing Wiktionary/Kaikki example; only the marked slot is blanked. No sentence generated.",
          sourceQuotation: true,
          validationStatus: "source_slot_context_checked",
          canonicalAssessmentItem: false,
          kind: slot.kind,
          instructionTr:
            "Belirtilen anlamı ve cümlenin diğer ögelerini koruyarak yalnız boş bırakılan hedefi seç.",
          meaningContextTr: c.glosses.join("; "),
          sentenceWithTargetMarked: text.slice(0, a) + "[" + correct + "]" + text.slice(b),
          prompt: text.slice(0, a) + "____" + text.slice(b),
          correctSentence: text,
          target: {
            startCodePoint: start,
            endCodePoint: end,
            case: f.case,
            preposition: f.prep,
            reference: null,
          },
          options: [correct, slot.wrong],
          acceptedAnswers: [correct],
          wrongCaseAnswers: [slot.wrong],
          wrongCaseSentenceFixture: text.slice(0, a) + slot.wrong + text.slice(b),
          feedbackTr: `Bu sabit anlam ve hedefte ${f.prep ? f.prep + " + " : ""}${f.case === "dat" ? "Dativ" : "Akkusativ"} gerekir: ${correct}.`,
          alternativeReadingWarning:
            "Yalnız bu kaynak anlamı, cümle sürümü ve işaretli hedef için geçerlidir. Başka bir anlam veya serbest cümleye genellenmez.",
          activationPrerequisites: [],
          testFixtures: [],
          sourceExample: example,
          nounEvidence: slot.noun,
        };
      })()
    : null;
  const review = {
    decision: exercise ? "recommend_fixed_item_diagnosis" : "hold",
    linguisticScopeTr: c.glosses.join("; "),
    basis:
      "Explicit same-sense +obj and unchanged source example; non-target arguments remain fixed.",
    sourceCase: f.case,
    recommendedCase: exercise ? f.case : null,
    requiredUsageConditionsVerbatim: usage,
    registerLabelsToDisplay: c.tags.filter(
      (t) =>
        ![
          "strong",
          "weak",
          "transitive",
          "intransitive",
          "reflexive",
          "irregular",
          "ditransitive",
          "impersonal",
        ].includes(t) && !t.startsWith("class-"),
    ),
    sourceSenseMustRemainBound: true,
    automaticFreeTextDiagnosisAllowed: false,
    runtimeEnabledByThisReview: false,
    exercise,
    sourceCorrection: null,
  };
  records.push({
    recordId,
    contextId: f.contextId,
    lemma: f.lemma,
    construction: f.construction,
    preposition: f.prep,
    sourceCase: f.case,
    senseId: c.senseId,
    snapshotSha256: c.source.snapshotSha256,
    recordSha256: c.source.recordSha256,
    usageConditions: usage,
    review,
    exerciseVersion: exercise ? hash({ recordId, senseId: c.senseId, exercise }) : null,
    assessment: {
      reasons,
      examined,
      previousHoldReason: previous?.review.linguisticScopeTr ?? null,
      cefrLevel: null,
    },
  });
}
if (records.length !== 702) throw Error("Expected 686 plus 16: " + records.length);
const out = process.argv[2] ?? "src/content/kaikki-remaining-fixed-review-2026-10-15.json";
await writeFile(
  out,
  JSON.stringify({
    sourceSnapshot: pack.source.snapshotSha256,
    policy: "explicit-slot-unchanged-source-example-v1",
    records,
  }) + "\n",
  { flag: "wx" },
);
console.log(
  JSON.stringify({
    examined: records.length,
    enabled: records.filter((r) => r.review.exercise).length,
    held: records.filter((r) => !r.review.exercise).length,
    reasons: records.reduce(
      (a, r) => (r.assessment.reasons.forEach((k) => (a[k] = (a[k] ?? 0) + 1)), a),
      {},
    ),
  }),
);
