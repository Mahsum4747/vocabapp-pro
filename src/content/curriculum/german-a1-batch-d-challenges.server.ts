import type { ChallengeItem } from "@/lib/curriculum/challenge";
// Original held-out progression-only challenge banks.
export const batchDChallengeForms: Record<string, Record<"A" | "B", readonly ChallengeItem[]>> = {
  "DE.A1.U09": {
    A: [
      {
        id: "need",
        outcome: "Ordinary need",
        prompt: "Say you are tired and need help. Use two Ich sentences.",
        acceptedAnswers: ["Ich bin müde. Ich brauche Hilfe."],
      },
      {
        id: "notice",
        outcome: "Notice action",
        prompt: "Copy the instruction only.",
        acceptedAnswers: ["Kommen Sie bitte um zwölf!"],
        stimulus: "Kommen Sie bitte um zwölf! Das Treffen ist im Büro.",
      },
      {
        id: "access",
        outcome: "Permission",
        prompt: "Copy the permitted destination phrase beginning ins.",
        acceptedAnswers: ["ins Büro"],
        stimulus: "Sie dürfen jetzt ins Büro gehen, aber nicht zur Bank.",
      },
      {
        id: "instruction",
        outcome: "Friend instruction",
        prompt: "Tell one friend to wait here politely. Begin Warte, include bitte hier.",
        acceptedAnswers: ["Warte bitte hier!"],
      },
      {
        id: "invite",
        outcome: "Practical invitation",
        prompt:
          "Ask a close friend if they can come Tuesday at fifteen. Write a full Kannst du question. fünfzehn = fifteen.",
        acceptedAnswers: ["Kannst du am Dienstag um fünfzehn kommen?"],
      },
      {
        id: "change",
        outcome: "Changed plan",
        prompt:
          "You cannot come Monday but can come Tuesday to the bank. Write two Ich kann sentences.",
        acceptedAnswers: ["Ich kann am Montag nicht kommen. Ich kann am Dienstag zur Bank kommen."],
      },
      {
        id: "register",
        outcome: "Staff request",
        prompt: "Ask staff to help you tomorrow. Write one Sie question using mir/morgen/helfen.",
        acceptedAnswers: ["Können Sie mir morgen helfen?"],
      },
      {
        id: "reply",
        outcome: "Attendance reply",
        prompt:
          "Tell Ben you will come Saturday at eleven to the station. Begin Hallo Ben!, then Ich komme with all details. Samstag = Saturday.",
        acceptedAnswers: ["Hallo Ben! Ich komme am Samstag um elf zum Bahnhof."],
      },
    ],
    B: [
      {
        id: "need",
        outcome: "Need correction",
        prompt: "You had no time yesterday. Fix ONLY the time frame.",
        acceptedAnswers: ["Gestern hatte ich keine Zeit."],
        stimulus: "Draft: Gestern habe ich keine Zeit.",
      },
      {
        id: "notice",
        outcome: "Required time",
        prompt: "Copy only the new time including Uhr.",
        acceptedAnswers: ["16 Uhr"],
        stimulus: "Bitte um 16 Uhr kommen, nicht um 10 Uhr.",
      },
      {
        id: "access",
        outcome: "Prohibition",
        prompt: "Copy only the prohibited action phrase starting ins.",
        acceptedAnswers: ["ins Büro gehen"],
        stimulus: "Sie dürfen hier warten. Sie dürfen nicht ins Büro gehen.",
      },
      {
        id: "instruction",
        outcome: "Polite instruction",
        prompt:
          "An unfamiliar visitor should come here tomorrow. Write a Sie instruction starting Kommen with bitte/morgen/hierher. hierher = to here.",
        acceptedAnswers: ["Kommen Sie bitte morgen hierher!"],
      },
      {
        id: "invite",
        outcome: "Invitation repair",
        prompt: "One friend is addressed. Change the whole question for du, preserving morgen.",
        acceptedAnswers: ["Kannst du morgen kommen?"],
        stimulus: "Draft: Können Sie morgen kommen?",
      },
      {
        id: "change",
        outcome: "Place change",
        prompt:
          "The new visit is to the office, not the bank. Fix ONLY destination, preserving day/time.",
        acceptedAnswers: ["Ich komme am Freitag um siebzehn ins Büro."],
        stimulus:
          "Draft: Ich komme am Freitag um siebzehn zur Bank. Freitag = Friday; siebzehn = seventeen",
      },
      {
        id: "register",
        outcome: "Friend request",
        prompt:
          "Ask one friend to help you now. Write a full Kannst du question using mir/jetzt/helfen.",
        acceptedAnswers: ["Kannst du mir jetzt helfen?"],
      },
      {
        id: "reply",
        outcome: "Alternative next step",
        prompt:
          "You must work Thursday; ask whether you can come Friday. Write one Ich muss statement and a Kann ich question. Donnerstag = Thursday; Freitag = Friday.",
        acceptedAnswers: ["Ich muss am Donnerstag arbeiten. Kann ich am Freitag kommen?"],
      },
    ],
  },
  "DE.A1.U10": {
    A: [
      {
        id: "relevance",
        outcome: "Read relevance",
        prompt: "Need: Berlin Saturday at nine. Copy the matching label.",
        acceptedAnswers: ["C"],
        stimulus:
          "A: Bonn, Samstag, 9 Uhr. B: Berlin, Samstag, 12 Uhr. C: Berlin, Samstag, 9 Uhr. Samstag = Saturday",
      },
      {
        id: "question",
        outcome: "Missing place",
        prompt: "Ask where the course is. Use a complete Wo question with der Kurs.",
        acceptedAnswers: ["Wo ist der Kurs?"],
      },
      {
        id: "response",
        outcome: "Give time",
        prompt: "Tell a friend you can come at eighteen. Begin Ich kann. achtzehn = eighteen.",
        acceptedAnswers: ["Ich kann um achtzehn kommen."],
      },
      {
        id: "object",
        outcome: "Needed object",
        prompt: "Say you need a chair. Begin Ich, use Stuhl. Stuhl = chair.",
        acceptedAnswers: ["Ich brauche einen Stuhl."],
      },
      {
        id: "transfer",
        outcome: "Earlier event",
        prompt: "Tell Ben you went to the station then worked. Write two Ich sentences.",
        acceptedAnswers: ["Ich bin zum Bahnhof gegangen. Ich habe gearbeitet."],
      },
      {
        id: "form",
        outcome: "Field placement",
        prompt: "Return exactly Ort: …; Name: … from fictional facts.",
        acceptedAnswers: ["Ort: Berlin; Name: Ada"],
        stimulus: "Ada lives in Berlin.",
      },
      {
        id: "message",
        outcome: "Message fulfilment",
        prompt:
          "Write Guten Tag!, say you will come Sunday at fourteen to the bank, then Vielen Dank!. Sonntag = Sunday; vierzehn = fourteen.",
        acceptedAnswers: ["Guten Tag! Ich komme am Sonntag um vierzehn zur Bank. Vielen Dank!"],
      },
      {
        id: "revision",
        outcome: "Targeted revision",
        prompt: "Correct ONLY the day to Tuesday, retaining all other words.",
        acceptedAnswers: ["Ich kann am Dienstag um elf ins Büro kommen."],
        stimulus: "Draft: Ich kann am Montag um elf ins Büro kommen.",
      },
    ],
    B: [
      {
        id: "relevance",
        outcome: "Relevant price",
        prompt: "Copy only the bus price including Euro.",
        acceptedAnswers: ["4 Euro"],
        stimulus: "Zug: 7 Euro. Bus: 4 Euro. Zug = train",
      },
      {
        id: "question",
        outcome: "Missing time",
        prompt: "The course place is known. Correct the question to ask its missing time.",
        acceptedAnswers: ["Wann ist der Kurs?"],
        stimulus: "Draft: Wo ist der Kurs?",
      },
      {
        id: "response",
        outcome: "Give location",
        prompt: "Answer where the meeting is, beginning Das Treffen ist.",
        acceptedAnswers: ["Das Treffen ist am Bahnhof."],
        stimulus: "Treffen: Bahnhof, morgen 15 Uhr.",
      },
      {
        id: "object",
        outcome: "Repair an object",
        prompt: "You need a table, not a chair. Change ONLY the object phrase. Tisch = table.",
        acceptedAnswers: ["Ich brauche einen Tisch."],
        stimulus: "Draft: Ich brauche einen Stuhl.",
      },
      {
        id: "transfer",
        outcome: "Future possibility",
        prompt: "Say you can study tomorrow. Begin Morgen, use ich.",
        acceptedAnswers: ["Morgen kann ich lernen."],
      },
      {
        id: "form",
        outcome: "Repair fields",
        prompt: "Correct reversed values. Return exactly Name: …; Uhrzeit: … .",
        acceptedAnswers: ["Name: Ben; Uhrzeit: 14 Uhr"],
        stimulus: "Fictional person Ben, time 14 Uhr. Draft: Name: 14 Uhr; Uhrzeit: Ben.",
      },
      {
        id: "message",
        outcome: "Friend message",
        prompt:
          "Tell Ada you cannot come Thursday but can come Friday to the station at ten. Write Hallo Ada! and two Ich kann sentences. Donnerstag = Thursday; Freitag = Friday.",
        acceptedAnswers: [
          "Hallo Ada! Ich kann am Donnerstag nicht kommen. Ich kann am Freitag um zehn zum Bahnhof kommen.",
        ],
      },
      {
        id: "revision",
        outcome: "Correct time",
        prompt:
          "Change ONLY the wrong time to sixteen, preserving destination and thanks. sechzehn = sixteen.",
        acceptedAnswers: ["Ich komme um sechzehn zur Bank. Vielen Dank!"],
        stimulus: "Draft: Ich komme um sechs zur Bank. Vielen Dank!",
      },
    ],
  },
};
