import type { LessonStep } from "@/lib/curriculum/types";

type TransferSpec = {
  label: string;
  prompt: string;
  inputLabel: string;
  explanation: string;
  maxLength?: number;
  example?: string;
};

const TRANSFER_SPECS: Record<string, TransferSpec> = {
  "DE.A1.U03.L01": {
    label: "Use the shopping language",
    prompt:
      "Write two short German sentences for a fictional shop visit: say one thing you need and one thing you buy. Use different objects if you can.",
    inputLabel: "Your shopping sentences",
    explanation:
      "Reuse the object frames from this lesson, but choose your own combination of the taught objects. This open response is unassessed practice.",
  },
  "DE.A1.U03.L02": {
    label: "Refer back to an object",
    prompt:
      "Write two short German sentences about a fictional object: name the object in the first sentence, then replace it with the correct object pronoun in the second.",
    inputLabel: "Your two sentences",
    explanation:
      "Choose one familiar object and keep the same meaning when you replace the noun. This open response is unassessed practice.",
  },
  "DE.A1.U03.L03": {
    label: "Give a stock update",
    prompt:
      "Write a short German shop update with one thing that is available and one thing that is not available or one alternative.",
    inputLabel: "Your stock update",
    explanation:
      "Use the es gibt pattern and, if useful, aber or oder. This open response is unassessed practice.",
  },
  "DE.A1.U03.L04": {
    label: "Make and correct a choice",
    prompt:
      "Write a short German shopping note that expresses a preference and then corrects one wrong object choice.",
    inputLabel: "Your shopping note",
    explanation:
      "Keep the preference meaning separate from the object correction. This open response is unassessed practice.",
  },
  "DE.A1.U04.L01": {
    label: "Plan a time",
    prompt:
      "Write two short German sentences for a fictional plan: give a day/time, then change one time detail.",
    inputLabel: "Your plan",
    explanation:
      "Reuse the time chunks and word order from this lesson. This open response is unassessed practice.",
  },
  "DE.A1.U04.L02": {
    label: "Describe two routine actions",
    prompt:
      "Write two short German sentences using two separable verbs from this lesson in your own fictional routine.",
    inputLabel: "Your routine",
    explanation:
      "Keep the finite verb and separated prefix in the taught positions. This open response is unassessed practice.",
  },
  "DE.A1.U04.L03": {
    label: "Ability and request",
    prompt:
      "Write two short German sentences: one saying what a fictional person can do, and one polite request using a modal frame from the lesson.",
    inputLabel: "Your two sentences",
    explanation:
      "Use the modal + infinitive pattern, but choose your own simple situation. This open response is unassessed practice.",
  },
  "DE.A1.U04.L04": {
    label: "State a simple rule",
    prompt:
      "Write two short German sentences for a fictional place: one obligation or prohibition and one permission.",
    inputLabel: "Your rules",
    explanation:
      "Reuse müssen/dürfen and the taught word order. This open response is unassessed practice.",
  },
  "DE.A1.U05.L01": {
    label: "Move through town",
    prompt:
      "Write two short German sentences about a fictional trip in town: say where you are and how or where you are going.",
    inputLabel: "Your town sentences",
    explanation:
      "Use the place/transport chunks from the lesson. This open response is unassessed practice.",
  },
  "DE.A1.U05.L02": {
    label: "Ask for help in your own situation",
    prompt:
      "Write a short polite German request for help in a fictional service situation. Include who needs help and one practical detail such as day or time.",
    inputLabel: "Your help request",
    explanation:
      "Use the taught helfen pattern and polite address where appropriate. This open response is unassessed practice.",
  },
  "DE.A1.U05.L03": {
    label: "Place and destination",
    prompt:
      "Write two short German sentences: say where a fictional person is now and where they are going next.",
    inputLabel: "Your place and destination",
    explanation:
      "Choose the location/destination chunks from this lesson by meaning. This open response is unassessed practice.",
  },
  "DE.A1.U05.L04": {
    label: "Give an instruction and invite",
    prompt:
      "Write two short German lines for a fictional situation: one simple instruction and one invitation or request.",
    inputLabel: "Your two lines",
    explanation:
      "Choose the appropriate familiar or polite form for the person you address. This open response is unassessed practice.",
  },
  "DE.A1.U06.L01": {
    label: "Report two completed activities",
    prompt:
      "Write two short German sentences about fictional activities completed today. Use two past frames from this lesson.",
    inputLabel: "Your completed activities",
    explanation:
      "Keep the auxiliary near the front and the reviewed participle at the end. This open response is unassessed practice.",
  },
  "DE.A1.U06.L02": {
    label: "Tell two past events",
    prompt:
      "Write two short German sentences about fictional past events, using one reviewed haben frame and one reviewed sein frame.",
    inputLabel: "Your past events",
    explanation:
      "Choose the auxiliary with the taught verb/frame rather than by a broad movement rule. This open response is unassessed practice.",
  },
  "DE.A1.U06.L03": {
    label: "Change an arrangement",
    prompt:
      "Write a short German message with an apology, an earlier problem, and a new possibility or proposal.",
    inputLabel: "Your change message",
    explanation:
      "Use short independent sentences. This open response is unassessed practice.",
  },
  "DE.A1.U06.L04": {
    label: "Answer a practical message",
    prompt:
      "Write a short German reply for a fictional friend with three useful facts: one current detail, one earlier event and one next step.",
    inputLabel: "Your practical reply",
    explanation:
      "Choose only information that helps the reader. This open response is unassessed practice.",
  },
  "DE.A1.U07.L01": {
    label: "Make a travel request",
    prompt:
      "Write a short German request for a fictional ticket or journey. Include one date or time detail.",
    inputLabel: "Your travel request",
    explanation:
      "Reuse the ticket/date language from this lesson, but choose your own fictional details. This open response is unassessed practice.",
  },
  "DE.A1.U07.L02": {
    label: "Ask about accommodation",
    prompt:
      "Write a short German accommodation request asking whether something is available and include one simple need or date.",
    inputLabel: "Your accommodation request",
    explanation:
      "Use the availability/request frames from the lesson. This open response is unassessed practice.",
  },
  "DE.A1.U07.L03": {
    label: "Send an arrival update",
    prompt:
      "Write a short German message about a fictional arrival or route change: say what happened and what you will do next.",
    inputLabel: "Your arrival update",
    explanation:
      "Use the place, route and change language from this lesson. This open response is unassessed practice.",
  },
  "DE.A1.U08.L01": {
    label: "Ask about a course",
    prompt:
      "Write a short German question and answer about a fictional course or study offer, using one practical detail.",
    inputLabel: "Your course exchange",
    explanation:
      "Choose a detail the reader actually needs, such as time, place or availability. This open response is unassessed practice.",
  },
  "DE.A1.U08.L02": {
    label: "Explain your schedule",
    prompt:
      "Write two short German sentences about a fictional study/work schedule: one time detail and one obligation or constraint.",
    inputLabel: "Your schedule",
    explanation:
      "Reuse the time and obligation frames from this lesson. This open response is unassessed practice.",
  },
  "DE.A1.U08.L03": {
    label: "Exchange practical information",
    prompt:
      "Write a short German exchange for a fictional practical need: ask one relevant question and give one useful answer.",
    inputLabel: "Your practical exchange",
    explanation:
      "Keep both lines relevant to the same situation. This open response is unassessed practice.",
  },
  "DE.A1.U08.L04": {
    label: "Draft and improve a message",
    prompt:
      "Write a short fictional work/study message, then rewrite it once so the requested information is clearer.",
    inputLabel: "Original and revised message",
    explanation:
      "Check task fulfilment, word order and one targeted detail when revising. This open response is unassessed practice.",
  },
  "DE.A1.U09.L01": {
    label: "Describe a simple need",
    prompt:
      "Write two short German sentences about a fictional health or community need: describe the situation and say what help or next step is needed.",
    inputLabel: "Your need description",
    explanation:
      "Keep the language concrete and A1-level. This open response is unassessed practice.",
  },
  "DE.A1.U09.L02": {
    label: "Act on a notice",
    prompt:
      "Write one short German instruction or response that would fit a fictional public notice or community situation.",
    inputLabel: "Your instruction or response",
    explanation:
      "Use the instruction/rule language from this lesson. This open response is unassessed practice.",
  },
  "DE.A1.U09.L03": {
    label: "Invite and change the plan",
    prompt:
      "Write a short German invitation or plan-change message with a time or place and one clear next step.",
    inputLabel: "Your invitation or change",
    explanation:
      "Make the practical change explicit for the reader. This open response is unassessed practice.",
  },
  "DE.A1.U09.L04": {
    label: "Write a complete short message",
    prompt:
      "Write a short German message to a fictional person with a suitable greeting, two practical points and a closing.",
    inputLabel: "Your short correspondence",
    explanation:
      "Choose the register and information for the imagined recipient. This open response is unassessed practice.",
  },
  "DE.A1.U10.L01": {
    label: "React to an everyday notice",
    prompt:
      "Read the new notice, then write one short German sentence stating the detail that matters if you want to visit tomorrow.",
    inputLabel: "Your relevant detail",
    explanation:
      "Select the useful information rather than copying every word. This open response is unassessed practice.",
    example: "Bibliothek: Heute geschlossen. Morgen geöffnet ab 10 Uhr.",
  },
  "DE.A1.U10.L02": {
    label: "Tell, ask and respond",
    prompt:
      "Write a three-line German mini-dialogue for a fictional everyday situation: give one fact, ask one question and give one response.",
    inputLabel: "Your mini-dialogue",
    explanation:
      "Reuse familiar A1 frames without copying a complete model. This open response is unassessed practice.",
  },
  "DE.A1.U10.L03": {
    label: "Form plus message",
    prompt:
      "Create a fictional one-line form entry and a short German message that uses the same practical information.",
    inputLabel: "Your form entry and message",
    explanation:
      "Keep the form information and message consistent. This open response is unassessed practice.",
  },
  "DE.A1.U10.L04": {
    label: "Final independent transfer",
    prompt:
      "Write a short German message for a new fictional everyday situation using several A1 patterns you have learned. Include at least two practical details and revise once before continuing.",
    inputLabel: "Your revised final message",
    explanation:
      "This is open practice, not the checkpoint and not certification evidence. Focus on clear meaning and task fulfilment.",
    maxLength: 220,
  },
};

export function withPedagogyTransfer(
  lessonId: string,
  steps: readonly LessonStep[],
): readonly LessonStep[] {
  if (steps.some((step) => step.kind === "original")) return steps;
  const spec = TRANSFER_SPECS[lessonId];
  if (!spec) return steps;

  const checkIndex = steps.findIndex((step) => step.purpose === "formative-check");
  const insertAt = checkIndex >= 0 ? checkIndex : steps.length;
  const skillIds = [...new Set(steps.flatMap((step) => step.skillIds))];

  const transfer: LessonStep = {
    id: `${lessonId}.transfer-open`,
    stage: "apply",
    purpose: "practice",
    kind: "original",
    label: spec.label,
    prompt: spec.prompt,
    inputLabel: spec.inputLabel,
    maxLength: spec.maxLength ?? 180,
    explanation: spec.explanation,
    ...(spec.example ? { example: spec.example } : {}),
    skillIds,
  };

  return [...steps.slice(0, insertAt), transfer, ...steps.slice(insertAt)];
}
