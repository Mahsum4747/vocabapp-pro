import type { ChallengeItem } from "@/lib/curriculum/challenge";
const t = (
  id: string,
  outcome: string,
  prompt: string,
  answers: string[],
  stimulus?: string,
): ChallengeItem => ({
  id,
  outcome,
  prompt,
  acceptedAnswers: answers,
  ...(stimulus ? { stimulus } : {}),
});
const c = (
  id: string,
  outcome: string,
  prompt: string,
  options: string[],
  answer: string,
  stimulus?: string,
): ChallengeItem => ({ ...t(id, outcome, prompt, [answer], stimulus), options });
// Held-out contexts; keys stay server-only. Eight observations per independent family.
export const unit6ChallengeForms: Record<string, Record<"A" | "B", readonly ChallengeItem[]>> = {
  "DE.A1.U06": {
    A: [
      t(
        "past",
        "Completed work",
        "Say Ada worked today. Begin Ada and include heute. Write one full completed-action sentence.",
        ["Ada hat heute gearbeitet."],
      ),
      t(
        "participle",
        "Reviewed form",
        "Complete Ben hat ___. Use the reviewed completed-action form of essen. Type only the participle.",
        ["gegessen"],
      ),
      t(
        "arrival",
        "Auxiliary frame",
        "Say you went to the office. Begin Ich and use ins Büro and gehen. Write one full completed-action sentence. ins Büro = into/to the office.",
        ["Ich bin ins Büro gegangen."],
      ),
      t(
        "sequence",
        "Recent sequence",
        "First you studied German, then you saw Ada. Write two independent completed-action sentences, each starting Ich, in that order.",
        ["Ich habe Deutsch gelernt. Ich habe Ada gesehen."],
      ),
      t(
        "state",
        "Earlier availability",
        "Say that Ada had no time earlier. Begin Ada and use keine Zeit. Write one complete sentence.",
        ["Ada hatte keine Zeit."],
      ),
      c(
        "purpose",
        "Message purpose",
        "What does the message do?",
        ["Offer another meeting time.", "Request a price.", "Report an arrival."],
        "Offer another meeting time.",
        "Ich kann um sieben nicht kommen. Ich kann um zehn kommen.",
      ),
      t(
        "transfer",
        "Future possibility",
        "Ben can study on Wednesday. Write one full statement beginning Ben; include am Mittwoch and lernen. Mittwoch = Wednesday.",
        ["Ben kann am Mittwoch lernen."],
      ),
      t(
        "change",
        "Cancellation and alternative",
        "Apologize, cancel Monday and offer Wednesday. Write three independent sentences: Es tut mir leid; then Am Montag with können, ich and nicht kommen; then Am Mittwoch with können, ich and kommen. Mittwoch = Wednesday.",
        ["Es tut mir leid. Am Montag kann ich nicht kommen. Am Mittwoch kann ich kommen."],
      ),
    ],
    B: [
      t(
        "past",
        "Repair past bracket",
        "Repair word order, keeping every word and starting Gestern. gestern = yesterday.",
        ["Gestern habe ich eingekauft."],
        "Draft: Gestern ich habe eingekauft.",
      ),
      t(
        "participle",
        "Retrieve seeing form",
        "Complete Ich habe Ada ___. Use the reviewed completed-action form of sehen. Type only the form.",
        ["gesehen"],
      ),
      t(
        "arrival",
        "Repair auxiliary",
        "Correct only the auxiliary and preserve the full sentence.",
        ["Ben ist zur Bank gegangen."],
        "Draft: Ben hat zur Bank gegangen.",
      ),
      t(
        "sequence",
        "Restore event order",
        "Shopping was first, eating second. Reorder these two complete sentences.",
        ["Ich habe eingekauft. Ich habe gegessen."],
        "Draft: Ich habe gegessen. Ich habe eingekauft.",
      ),
      t(
        "state",
        "Repair earlier state",
        "The person was tired earlier. Correct only the verb and write the complete sentence. müde = tired.",
        ["Er war müde."],
        "Draft: Er ist müde.",
      ),
      c(
        "purpose",
        "Select a change message",
        "Select the message that cancels one time and offers another.",
        ["A", "B", "C"],
        "C",
        "A: Ich habe gelernt. B: Ich bin am Bahnhof. C: Um neun kann ich nicht kommen. Um elf kann ich kommen.",
      ),
      t(
        "transfer",
        "Report now",
        "The friend needs your location now. Say you are at the bank now, beginning Ich, using bei der Bank. Write one full sentence.",
        ["Ich bin bei der Bank."],
      ),
      t(
        "change",
        "Offer a workable revision",
        "Rewrite the draft with the update: you cannot come tomorrow; you can come Friday at eight. Write two sentences beginning Morgen kann ich and Am Freitag kann ich, respectively. Put um acht before final kommen. Freitag = Friday.",
        ["Morgen kann ich nicht kommen. Am Freitag kann ich um acht kommen."],
        "Draft: Morgen kann ich kommen. Am Freitag kann ich nicht kommen.",
      ),
    ],
  },
};
