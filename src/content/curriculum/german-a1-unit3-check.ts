import type { AssessmentDefinition, AssessmentItem } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";
// Only this new form's authored answer set adds keyboard equivalents. Existing grading,
// Unit 1/2 keys, compatibility versions and assessment schemas remain unchanged.
const keyboard = (value: string) =>
  value
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("Ä", "Ae")
    .replaceAll("Ö", "Oe")
    .replaceAll("Ü", "Ue")
    .replaceAll("ß", "ss");
const item = (
  id: string,
  type: AssessmentItem["type"],
  targetId: string,
  prompt: string,
  answers: string[],
  stimulus?: string,
  options?: string[],
): AssessmentItem => ({
  id,
  type,
  targetId: `U03.${targetId}`,
  prompt,
  acceptedAnswers: [...new Set(answers.flatMap((answer) => [answer, keyboard(answer)]))],
  caseSensitive: type !== "choice",
  ...(stimulus ? { stimulus } : {}),
  ...(options ? { options } : {}),
});
/** Original held-out shopping samples; bounded functional observations, not certification of
 * every mapped skill or unrestricted writing. A/B differ in task/stimulus structure; authoring
 * independence has not been psychometrically calibrated. */
export const unit3Check: AssessmentDefinition = {
  id: "DE.A1.U03.CHECK.PROTOTYPE.1",
  assessmentVersion: 1,
  compatibilityVersion: 1,
  formId: "U03.FORM.A",
  formFamilyId: "U03.FAMILY.A",
  unitId: "DE.A1.U03",
  trackId: "de-a1-text-practice-v1",
  releaseId: germanA1.id,
  status: "prototype",
  provenance: "Original Karta authoring; pending pedagogical review",
  targets: [
    {
      id: "U03.object",
      label: "Identify a needed object",
      scope:
        "One bounded need/purchase statement with the correct masculine indefinite object; not every accusative frame.",
    },
    {
      id: "U03.negation",
      label: "Negate an object purchase",
      scope: "Negate a feminine indefinite object while preserving the buying action.",
    },
    {
      id: "U03.reference",
      label: "Replace a familiar object",
      scope:
        "Retrieve the neuter accusative pronoun for a named phone; no claim about every object pronoun.",
    },
    {
      id: "U03.possession",
      label: "Reply about a possessed object",
      scope: "Preserve the interlocutor's ownership in one masculine accusative phrase.",
    },
    {
      id: "U03.availability",
      label: "Read and state availability",
      scope:
        "One complete negative phone-availability statement derived from a short stock message.",
    },
    {
      id: "U03.alternative",
      label: "Communicate both purchase alternatives",
      scope:
        "Two complete clauses joined by oder, including both specified feminine/neuter objects.",
    },
    {
      id: "U03.preference-focus",
      label: "Keep preference and correct the object",
      scope:
        "Two bounded buying statements: gern for enjoyment and nicht before a particular rejected object.",
    },
    {
      id: "U03.context",
      label: "Read a price word in context",
      scope:
        "Resolve kosten as price in a short supplied shopping context, not broad lexical inference.",
    },
  ],
  items: [
    item(
      "U03.A.C01",
      "construction",
      "object",
      "Ben needs a pen. Write one full German sentence about Ben using brauchen and the indefinite object.",
      ["Ben braucht einen Stift."],
    ),
    item(
      "U03.A.C02",
      "bounded-text",
      "negation",
      "Ada does not buy a bag. Negate the supplied indefinite object; preserve Ada and the action. Write the whole German sentence.",
      ["Ada kauft keine Tasche."],
      "Ada kauft eine Tasche.",
    ),
    item(
      "U03.A.C03",
      "bounded-text",
      "reference",
      "Complete the second statement with the phone's object pronoun. Type only that pronoun.",
      ["es", "Ben sieht es."],
      "Ben hat das Telefon. Ben sieht ___.",
    ),
    item(
      "U03.A.C04",
      "construction",
      "possession",
      "Reply to Ada: say you see her pen, using the possessive for ‘your’. Write one full sentence with ich and sehen.",
      ["Ich sehe deinen Stift."],
      "Ada: Du siehst meinen Stift.",
    ),
    item(
      "U03.A.C05",
      "reading-extraction",
      "availability",
      "Read the stock note. State only the phone's availability in one full German sentence with es gibt.",
      ["Es gibt kein Telefon."],
      "Es gibt eine Tasche und einen Stift. Es gibt kein Telefon.",
    ),
    item(
      "U03.A.C06",
      "construction",
      "alternative",
      "Address a friend as du. Say ‘You buy a bag or you buy a book’. Write two full clauses joined by oder, in that order.",
      ["Du kaufst eine Tasche oder du kaufst ein Buch."],
    ),
    item(
      "U03.A.C07",
      "construction",
      "preference-focus",
      "Ben enjoys buying books but is not buying the particular phone. Write two sentences about Ben: first his enjoyment; then deny that particular phone purchase using focused nicht. Do not name a replacement purchase.",
      ["Ben kauft gern Bücher. Ben kauft nicht das Telefon."],
    ),
    item(
      "U03.A.C08",
      "choice",
      "context",
      "Which meaning of kostet is supported by this statement?",
      ["Costs"],
      "Der Stift kostet 2 Euro.",
      ["Costs", "Tastes"],
    ),
  ],
};
export const unit3CheckB: AssessmentDefinition = {
  ...unit3Check,
  formId: "U03.FORM.B",
  formFamilyId: "U03.FAMILY.B",
  items: [
    item(
      "U03.B.C01",
      "bounded-text",
      "object",
      "The shopping note names the right need but its object article is wrong. Repair it; keep the person and verb. Write the whole sentence.",
      ["Ada braucht einen Stift."],
      "Ada braucht ein Stift.",
    ),
    item(
      "U03.B.C02",
      "choice",
      "negation",
      "The requested correction is: Ben does not buy a bag. Choose the correction that denies the indefinite object and keeps Ben's action.",
      ["Ben kauft keine Tasche."],
      "Ben kauft eine Tasche.",
      ["Ben kauft keine Tasche.", "Ben kauft kein Tasche.", "Die Tasche ist nicht klein."],
    ),
    item(
      "U03.B.C03",
      "construction",
      "reference",
      "Rewrite the seeing statement using an object pronoun for the phone. Preserve Ada as subject. Write one complete sentence.",
      ["Ada sieht es."],
      "Ada hat ein Telefon. Ada sieht das Telefon.",
    ),
    item(
      "U03.B.C04",
      "bounded-text",
      "possession",
      "You wrote the wrong owner. Ben owns the pen; you are speaking directly to Ben. Correct only the possessive in your draft. Write the whole sentence.",
      ["Ich brauche deinen Stift."],
      "Ben: Das ist mein Stift.\nYour draft: Ich brauche meinen Stift.",
    ),
    item(
      "U03.B.C05",
      "bounded-text",
      "availability",
      "Keep the stock note's true phone detail, but express it as availability using es gibt. Write one complete negative sentence about phones only.",
      ["Es gibt kein Telefon."],
      "Die Tasche ist groß. Ein Telefon ist nicht verfügbar.\nverfügbar = available",
    ),
    item(
      "U03.B.C06",
      "bounded-text",
      "alternative",
      "The note should offer alternatives, not contrast. Replace only the connector so both purchases remain alternatives. Write the whole sentence.",
      ["Ich kaufe eine Tasche oder ich kaufe ein Buch."],
      "Ich kaufe eine Tasche, aber ich kaufe ein Buch.",
    ),
    item(
      "U03.B.C07",
      "bounded-text",
      "preference-focus",
      "Correct both mismatches. You address a friend as du: they enjoy buying books, and the particular book shown is not their purchase. Keep both subjects and objects; write two full corrected German sentences.",
      ["Du kaufst gern Bücher. Du kaufst nicht das Buch."],
      "Draft: Du kaufst sehr Bücher. Du kaufst das Buch.",
    ),
    item(
      "U03.B.C08",
      "reading-extraction",
      "context",
      "Which verb in the message expresses a price? Type only that German verb.",
      ["kostet"],
      "Die Tasche ist klein. Die Tasche kostet 3 Euro.",
    ),
  ],
};
export const unit3CheckForms = [unit3Check, unit3CheckB] as const;
