import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createRouter,
  createRootRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { RecommendedNextCard, RecommendedNextLoading } from "./recommended-next-card";
import { buildAdaptiveStudyPlan } from "../lib/adaptive-recommendations";
import { recommendationExamples } from "../lib/adaptive-recommendations.fixtures";
test("card renders a semantic heading, reason and one real destination link", async () => {
  const r = buildAdaptiveStudyPlan(recommendationExamples().overdue!).primary!;
  const root = createRootRoute({
    component: () => createElement(RecommendedNextCard, { recommendation: r }),
  });
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  const html = renderToStaticMarkup(createElement(RouterProvider, { router }));
  assert.match(html, /Recommended next/);
  assert.match(html, /<h2/);
  assert.match(html, /You have 12 overdue words/);
  assert.match(html, /href="\/review"/);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.doesNotMatch(html, /urgent|evidence|score|<button/);
});
test("loading is accessible and respects reduced motion utility", () => {
  const html = renderToStaticMarkup(createElement(RecommendedNextLoading));
  assert.match(html, /role="status"/);
  assert.match(html, /Loading recommendation/);
  assert.match(html, /motion-safe:animate-pulse/);
});
