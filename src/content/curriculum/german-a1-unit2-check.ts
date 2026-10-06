import type { AssessmentDefinition } from "@/lib/curriculum/assessment";
import { germanA1 } from "./german-a1";

/** Original held-out prototype tasks, pending pedagogical review. These six functional
 * samples do not certify every constituent skill or unrestricted writing. A/B independence
 * is an authoring boundary, not measured psychometric equivalence. Compatibility changes
 * only for changed IDs/order, grading/response contracts or target meanings; hash is diagnostic.
 */
export const unit2Check: AssessmentDefinition = {
  id: "DE.A1.U02.CHECK.PROTOTYPE.1",
  assessmentVersion: 1,
  formId: "U02.FORM.A",
  formFamilyId: "U02.FAMILY.A",
  trackId: "de-a1-text-practice-v1",
  releaseId: germanA1.id,
  unitId: "DE.A1.U02",
  compatibilityVersion: 1,
  status: "prototype",
  provenance: "Original Karta authoring; pending pedagogical review",
  targets: [
    {
      id: "U02.routine",
      label: "Describe a simple routine",
      scope: "Two bounded statements: intended action and subject–verb agreement.",
    },
    {
      id: "U02.belongings",
      label: "Describe familiar belongings",
      scope: "One possessive plural statement about familiar books.",
    },
    {
      id: "U02.reference",
      label: "Resolve a reference",
      scope: "Identify whose familiar objects a short unseen text refers to.",
    },
    {
      id: "U02.negation",
      label: "Correct an untrue detail",
      scope: "Both noun-category and predicate negation in taught patterns; no object negation.",
    },
    {
      id: "U02.corrected-information",
      label: "Read a corrected fact",
      scope: "Retrieve one corrected detail from an unseen message.",
    },
    {
      id: "U02.revision",
      label: "Revise a short description",
      scope: "Update a supplied faulty draft: one changed fact, reviewed verb agreement and und.",
    },
  ],
  items: [
    {
      id: "U02.A.C01",
      type: "construction",
      targetId: "U02.routine",
      prompt:
        "Write one German sentence about Ada studying German. Use only the person and action; leave out the place.",
      stimulus: "Person: Ada\nAction: study German\nPlace: Berlin",
      acceptedAnswers: ["Ada lernt Deutsch."],
      caseSensitive: true,
    },
    {
      id: "U02.A.C02",
      type: "bounded-text",
      targetId: "U02.routine",
      prompt:
        "Two notes describe Ada and a group. Rewrite only the group’s statement for people you address as ihr.",
      stimulus: "Ada: Ich lerne Deutsch.\nGroup: Wir wohnen in Berlin.",
      acceptedAnswers: ["Ihr wohnt in Berlin."],
      caseSensitive: true,
    },
    {
      id: "U02.A.C03",
      type: "construction",
      targetId: "U02.belongings",
      prompt:
        "You and a friend own the books. Describe them as small in one German sentence, using the possessive for both of you.",
      acceptedAnswers: ["Unsere Bücher sind klein."],
      caseSensitive: true,
    },
    {
      id: "U02.A.C04",
      type: "reading-extraction",
      targetId: "U02.reference",
      prompt: "Whose objects does the final Sie refer to? Enter the person's name.",
      stimulus: "Ada: Mein Telefon ist groß.\nBen: Meine Bücher sind klein. Sie sind hier.",
      acceptedAnswers: ["Ben"],
    },
    {
      id: "U02.A.C05",
      type: "choice",
      targetId: "U02.negation",
      prompt:
        "The objects are phones, not books. Which statement corrects the claim that they are books?",
      stimulus: "Das sind Bücher.",
      options: ["Das sind keine Bücher.", "Die Bücher sind nicht klein.", "Das sind kein Bücher."],
      acceptedAnswers: ["Das sind keine Bücher."],
    },
    {
      id: "U02.A.C06",
      type: "construction",
      targetId: "U02.negation",
      prompt:
        "Your phone exists, but the claim that it is large is false. Deny only that claim in one German sentence, using mein.",
      acceptedAnswers: ["Mein Telefon ist nicht groß."],
      caseSensitive: true,
    },
    {
      id: "U02.A.C07",
      type: "reading-extraction",
      targetId: "U02.corrected-information",
      prompt: "What is the corrected description of the phone? Enter the German adjective.",
      stimulus: "Mein Telefon ist klein.\nNein. Mein Telefon ist nicht klein. Es ist groß.",
      acceptedAnswers: ["groß"],
    },
    {
      id: "U02.A.C08",
      type: "bounded-text",
      targetId: "U02.revision",
      prompt:
        "Update your draft: the office is now large. Also repair the reading verb for du. Keep both subjects and und; write the whole revised sentence.",
      stimulus:
        "Your draft: Mein Büro ist klein und du lest.\nCheck: changed office detail · verb agrees with du · two clauses joined by und",
      acceptedAnswers: ["Mein Büro ist groß und du liest."],
      caseSensitive: true,
    },
  ],
};

export const unit2CheckB: AssessmentDefinition = {
  ...unit2Check,
  formId: "U02.FORM.B",
  formFamilyId: "U02.FAMILY.B",
  items: [
    {
      id: "U02.B.C01",
      type: "bounded-text",
      targetId: "U02.routine",
      prompt:
        "Reply as Ada for both people: write one sentence about your shared study action, using wir.",
      stimulus: "Ada: Ich lerne Deutsch.\nBen: Ich lerne Deutsch.\nAda, for both: …",
      acceptedAnswers: ["Wir lernen Deutsch."],
      caseSensitive: true,
    },
    {
      id: "U02.B.C02",
      type: "construction",
      targetId: "U02.routine",
      prompt:
        "Repair the note's finite verb for its named subject. Keep the person and place unchanged.",
      stimulus: "Ben wohnst in Berlin.",
      acceptedAnswers: ["Ben wohnt in Berlin."],
      caseSensitive: true,
    },
    {
      id: "U02.B.C03",
      type: "bounded-text",
      targetId: "U02.belongings",
      prompt:
        "Ada owns the small books; Ben owns the phone. Repair the ownership and plural agreement in Ben's note about Ada's books. Write the corrected whole sentence.",
      stimulus: "Ben's note: Seine Bücher ist klein.",
      acceptedAnswers: ["Ihre Bücher sind klein."],
      caseSensitive: true,
    },
    {
      id: "U02.B.C04",
      type: "choice",
      targetId: "U02.reference",
      prompt: "After the speaker changes, whose object does the final Es refer to?",
      stimulus: "Ben: Meine Bücher sind groß.\nAda: Mein Telefon ist klein. Es ist hier.",
      options: ["Ada", "Ben"],
      acceptedAnswers: ["Ada"],
    },
    {
      id: "U02.B.C05",
      type: "construction",
      targetId: "U02.negation",
      prompt:
        "You point to a book. Deny that it is a phone, without naming the actual object. Begin your German sentence with Das ist.",
      stimulus: "Visitor: Das ist ein Telefon.",
      acceptedAnswers: ["Das ist kein Telefon."],
      caseSensitive: true,
    },
    {
      id: "U02.B.C06",
      type: "bounded-text",
      targetId: "U02.negation",
      prompt:
        "The office is real and large. Repair the negation in this note to deny that it is small; keep das Büro as the subject.",
      stimulus: "Das Büro ist kein klein.",
      acceptedAnswers: ["Das Büro ist nicht klein."],
      caseSensitive: true,
    },
    {
      id: "U02.B.C07",
      type: "reading-extraction",
      targetId: "U02.corrected-information",
      prompt: "What is Ben's corrected office description? Enter the German adjective.",
      stimulus: "Ada: Dein Büro ist groß.\nBen: Nein. Mein Büro ist nicht groß. Es ist klein.",
      acceptedAnswers: ["klein"],
    },
    {
      id: "U02.B.C08",
      type: "bounded-text",
      targetId: "U02.revision",
      prompt:
        "Rewrite Ben's draft as two complete clauses joined by und. New information: Ada is sleeping, not studying. Keep Ben's reading action, repair its verb and replace Ada's action. Write one sentence.",
      stimulus:
        "Ben's draft: Ich liest. Ada lernt Deutsch.\nCheck: first-person reading verb · changed action for Ada · complete clauses with und",
      acceptedAnswers: ["Ich lese und Ada schläft."],
      caseSensitive: true,
    },
  ],
};
export const unit2CheckForms = [unit2Check, unit2CheckB] as const;
