import { matchingOptions } from "../src/lib/german/lesen-matching-options";
import { expect, test } from "./support/app";
import { LESEN_PASSAGES } from "../src/lib/german/lesen-data";
import type { LesenLevel, LesenPassage } from "../src/lib/german/lesen-types";
import type { ServerFnHandler } from "./support/serverfn";
import { NOW } from "./support/backend";
import { mkdirSync } from "node:fs";

async function openPassage(
  page: import("@playwright/test").Page,
  launch: (seed: any) => Promise<any>,
  passage: LesenPassage,
) {
  await page.addInitScript(() => {
    Math.random = () => 0.1;
  });
  const ids = LESEN_PASSAGES.filter((p) => p.level === passage.level && p.id !== passage.id).map(
    (p) => p.id,
  );
  const completions: any[] = [];
  const harness = await launch({
    sets: [],
    handlers: {
      getLesenPassageProgress: () => ({
        [passage.level]: { completedPassageIds: ids, lastPracticedAt: NOW },
      }),
      recordGrammarRoundResult: (d: any) => ({
        ...d,
        accuracy: Math.round((d.correctInRound / d.totalInRound) * 100),
        totalAttempts: d.totalInRound,
        lastPracticedAt: NOW,
      }),
      recordLesenPassageCompletion: (d: any) => {
        completions.push(d);
        return { completedPassageIds: [...ids, d.passageId] };
      },
    },
  });
  await page.goto("/grammar/lesen");
  const start = page.getByRole("button", { name: new RegExp(`Start ${passage.level}`) });
  await expect(start).toContainText(`${ids.length}/${ids.length + 1} completed`);
  await start.click();
  return { ...harness, completions };
}
for (const level of ["A1", "A2", "B1", "B2"] as LesenLevel[]) {
  test(`Lesen ${level}: incomplete prioritization, shuffled choices, final Continue and Back`, async ({
    page,
    launch,
  }) => {
    const passage = LESEN_PASSAGES.find((p) => p.level === level && p.kind === "choice")!;
    if (passage.kind !== "choice") throw Error("fixture");
    const harness = await openPassage(page, launch, passage);
    await expect(page.getByText(passage.title, { exact: false }).first()).toBeVisible();
    for (const q of passage.questions) {
      await page.getByRole("button", { name: q.options[q.correctIndex], exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
    await expect.poll(() => harness.completions.length).toBe(1);
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(page.getByRole("button", { name: new RegExp(`Start ${level}`) })).toContainText(
      `${LESEN_PASSAGES.filter((p) => p.level === level).length}/${LESEN_PASSAGES.filter((p) => p.level === level).length} completed`,
    );
  });
}
for (const allowMultiple of [false, true]) {
  test(`Lesen matching: tap fallback, allowMultiple=${allowMultiple}, long scrolling and complete`, async ({
    page,
    launch,
    isMobile,
  }, testInfo) => {
    const passage = LESEN_PASSAGES.find(
      (p) => p.kind === "matching" && !!p.allowMultiple === allowMultiple,
    )!;
    if (passage.kind !== "matching") throw Error("fixture");
    await openPassage(page, launch, passage);
    const pool = page.getByTestId("lesen-match-pool");
    const targets = page.getByTestId("lesen-match-targets").getByRole("button");
    for (const [index, target] of passage.targets.entries()) {
      const option = matchingOptions(passage).find((o) => o.id === target.correctOptionId)!;
      const chip = pool.getByRole("button", { name: option.shortLabel, exact: false });
      await expect(chip).toHaveCSS("touch-action", "none");
      if ((await chip.getAttribute("aria-pressed")) !== "true") {
        if (isMobile) await chip.tap();
        else await chip.click();
      }
      if (isMobile) await targets.nth(index).tap();
      else await targets.nth(index).click();
      await expect(targets.nth(index)).toContainText(option.shortLabel);
      if (allowMultiple) await expect(chip).toBeVisible();
    }
    await page.getByRole("button", { name: "Check matches", exact: true }).click();
    mkdirSync("screenshots", { recursive: true });
    await page.screenshot({
      path: `screenshots/lesen-match-${testInfo.project.name}-${allowMultiple}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Practice again", exact: true }).click();
    await expect(page.getByText("Round result", { exact: true })).toHaveCount(0);
  });
}
test("Lesen sentence insertion: tap placement, reset, complete", async ({
  page,
  launch,
  isMobile,
}) => {
  const passage = LESEN_PASSAGES.find((p) => p.kind === "sentence-insertion")!;
  if (passage.kind !== "sentence-insertion") throw Error("fixture");
  await openPassage(page, launch, passage);
  for (const gap of passage.gaps) {
    const option = passage.options.find((o) => o.id === gap.correctOptionId)!;
    const chip = page
      .getByTestId("lesen-insertion-pool")
      .getByRole("button", { name: option.text, exact: true });
    if (isMobile) await chip.tap();
    else await chip.click();
    const slot = page.getByRole("button", { name: `Gap ${gap.id}`, exact: true });
    if (isMobile) await slot.tap();
    else await slot.click();
    await expect(slot).toContainText(option.text.slice(0, 24));
  }
  await page.getByRole("button", { name: "Check sentences", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
});
test("Lesen actual drag: mouse or CDP touch gesture", async ({ page, launch, isMobile }) => {
  const passage = LESEN_PASSAGES.find((p) => p.kind === "matching" && !p.allowMultiple)!;
  if (passage.kind !== "matching") throw Error("fixture");
  await openPassage(page, launch, passage);
  const target = passage.targets[0];
  const option = matchingOptions(passage).find((o) => o.id === target.correctOptionId)!;
  const chip = page
    .getByTestId("lesen-match-pool")
    .getByRole("button", { name: option.shortLabel, exact: true });
  const slot = page.getByTestId("lesen-match-targets").getByRole("button").first();
  // On a narrow phone, clear the later answer chips by tap so both drag
  // endpoints fit the viewport. This also exercises genuine page scrolling.
  if (isMobile)
    for (const [index, later] of passage.targets.entries()) {
      if (index === 0) continue;
      const nextOption = matchingOptions(passage).find((o) => o.id === later.correctOptionId)!;
      await page
        .getByTestId("lesen-match-pool")
        .getByRole("button", { name: nextOption.shortLabel, exact: true })
        .tap();
      await page.getByTestId("lesen-match-targets").getByRole("button").nth(index).tap();
    }
  await chip.scrollIntoViewIfNeeded();
  const from = await chip.boundingBox();
  const to = await slot.boundingBox();
  if (!from || !to) throw Error("No bounds");
  const x = from.x + from.width / 2,
    y = from.y + from.height / 2;
  const tx = to.x + to.width / 2,
    ty = to.y + Math.min(to.height / 2, 20);
  if (isMobile) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await page.waitForTimeout(200);
    for (let i = 1; i <= 12; i++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + ((tx - x) * i) / 12, y: y + ((ty - y) * i) / 12 }],
      });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(tx, ty, { steps: 12 });
    await page.mouse.up();
  }
  await expect(slot).toContainText(option.shortLabel);
});

const question = {
  prompt: "Ich ___ heute.",
  options: ["lerne", "lernst", "lernen", "lernt"],
  correctIndex: 0,
  explanation: null,
};
for (const kind of ["Grammar", "Lesen"] as const) {
  const route = kind === "Grammar" ? "/grammar/paste" : "/grammar/lesen-paste";
  const payload =
    kind === "Grammar"
      ? {
          topic: "Retry topic",
          ruleExplanation: "Eine Regel.",
          questions: Array(10).fill(question),
        }
      : {
          title: "Retry passage",
          text: "Ich lerne heute Deutsch zu Hause.",
          questions: Array(5).fill(question),
        };
  test(`${kind} Paste: validate, save failure, same-ID retry, completion, reopen and delete`, async ({
    page,
    launch,
  }) => {
    const topics = new Map<string, any>();
    const receipts = new Set<string>();
    let saveCalls = 0;
    let progressCalls = 0;
    const handlers: Record<string, ServerFnHandler> = {};
    handlers[`list${kind}PasteTopics`] = () => [...topics.values()];
    handlers[`get${kind}PasteTopic`] = (d: any) => topics.get(d.id) ?? null;
    handlers[`delete${kind}PasteTopic`] = (d: any) => {
      topics.delete(d.id);
      return { ok: true };
    };
    handlers[`save${kind}PasteTopic`] = async (d: any) => {
      saveCalls++;
      if (saveCalls === 1) throw Error("simulated storage failure");
      await new Promise((resolve) => setTimeout(resolve, 250));
      topics.set(d.id, {
        ...d,
        createdAt: NOW,
        questionCount: d.questions.length,
        accuracy: null,
        lastPracticedAt: null,
        totalAttempts: 0,
      });
      return { id: d.id };
    };
    handlers[`record${kind}PasteTopicRoundResult`] = (d: any) => {
      progressCalls++;
      if (progressCalls === 1) throw Error("simulated progress failure");
      const stored = topics.get(d.id);
      if (!receipts.has(d.roundId)) {
        receipts.add(d.roundId);
        stored.totalAttempts += d.totalInRound;
        stored.accuracy = 100;
      }
      return stored;
    };
    const h = await launch({ sets: [], handlers });
    await page.goto(route);
    const input = page.getByLabel("Paste the JSON here");
    await input.fill("{");
    await page.getByRole("button", { name: "Start practice round", exact: true }).click();
    await expect(page.getByText(/Not valid JSON/)).toBeVisible();
    expect(saveCalls).toBe(0);
    await input.fill(JSON.stringify(payload));
    await page.getByRole("button", { name: "Start practice round", exact: true }).click();
    await expect(page.getByRole("button", { name: "Retry saving", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "lerne", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Retry saving", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Saving to your history" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "lerne", exact: true })).toHaveCount(0);
    async function finish() {
      for (let i = 0; i < payload.questions.length; i++) {
        await page.getByRole("button", { name: "lerne", exact: true }).click();
        await page.getByRole("button", { name: "Continue", exact: true }).click();
      }
    }
    await finish();
    await expect(
      page.getByRole("button", { name: "Retry progress save", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Retry progress save", exact: true }).click();
    await expect.poll(() => [...topics.values()][0]?.totalAttempts).toBe(payload.questions.length);
    const saves = h.serverFns.callsTo(`save${kind}PasteTopic`).map((c: any) => c.data.id);
    expect(saves[0]).toBe(saves[1]);
    expect(topics.size).toBe(1);
    await page.goto(route);
    await page
      .getByRole("button", {
        name: kind === "Grammar" ? /Retry topic.*questions/ : /Retry passage.*questions/,
      })
      .click();
    await finish();
    await expect
      .poll(() => [...topics.values()][0]?.totalAttempts)
      .toBe(payload.questions.length * 2);
    await page.goto(route);
    await page
      .getByRole("button", {
        name: `Delete ${kind === "Grammar" ? "Retry topic" : "Retry passage"}`,
        exact: true,
      })
      .click();
    await expect.poll(() => topics.size).toBe(0);
    expect(h.serverFns.callsTo("recordGrammarRoundResult")).toHaveLength(0);
    expect(h.serverFns.callsTo("recordLesenPassageCompletion")).toHaveLength(0);
  });
}
