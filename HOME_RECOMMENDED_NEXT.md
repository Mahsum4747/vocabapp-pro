# Home: Recommended next

## Purpose

One primary adaptive suggestion on Home: what to practice, why, and an honest
navigation action. The existing deterministic engine is authoritative. No other
recommendations, scores, evidence badges, AI, persistence or telemetry.

## Visual audit

Before implementation, mocked desktop and Pixel 7 Home screenshots were inspected.
Home uses warm cream ground, white hairline-first surfaces, 16px card/8px control
radii, 24px card padding, 32px section spacing, Figtree body/Geist headings, forest
green primary actions and 44px buttons. Content max-width 1152px, page gutters 16px.
Dark mode has corresponding CSS tokens. AppShell supplies safe-area gutters and
bottom-nav clearance. Existing loading surfaces use status text/skeletons. Existing
button focus/press transitions respect reduced motion.

## Home placement

After Today and its creation shortcuts, before goal/XP/weak-word stats.
Today retains the strongest dark surface. The recommendation is a quiet decision
aid before progress reporting, Grammar Hub and the library. It does not replace
Today or alter its queue semantics. Empty plans add no gap or fake caught-up card.

## Component anatomy

- RecommendedNextCard: labelled section, discreet domain icon/Recommended next
  eyebrow, h2 action, supporting reason, one Button-asChild TanStack Link.
- HomeRecommendedNext: auth identity supplied by HomeRecommendedNextGate in the
  existing lazy auth module; loading/error/empty/ready state routing,
  local target sanity check, manual retry.
- usePrimaryRecommendation: one request per authenticated mount/refresh/retry;
  owner/version-scoped result and cleanup for late responses.
- primary-recommendation: existing loader→engine composition, audited route
  validation, CTA/copy helpers and local stale-set check. No ranking duplicated.
- recommendation-targets parameter now accepts only the practiceTargets fields it
  uses, avoiding fabricated full LearningSignals objects in route validation.

No new design tokens. Existing primary-soft/primary-ink/fg/muted/card/elevation/button
primitives reused. Only one interactive element; the whole section is not clickable.

## UI states

| State | Behavior |
| --- | --- |
| Loaded | Only primary rendered; no internal priority or evidence label. |
| Loading | Labelled status/skeleton; Home keeps loading its independent sections. Pulse is motion-safe only. |
| Empty | No surface or reserved empty space. |
| Error | Quiet neutral message, 44px retry; no raw error text or toast. |
| Signed out/dev fallback | No private recommendation request or card. |

Real authenticated session remains required by getLearningSignals; no client user
ID sent. Auth client stays inside the existing lazy gates module, matching SSR isolation.
A separate lazy entry containing auth plus this loader caused a reproducible
Nitro/rolldown `ssr_exports` failure despite a successful compile. The main baseline
compiled without that failure. Reusing the existing gate boundary fixes the SSR
chunk graph; getLearningSignals itself is imported when the effect requests it.
Old account/refresh results are never displayed; unmounted requests cannot update UI.
Retry hides prior content while loading. Pull-to-refresh increments the generation
once after existing Home refresh calls settle.

## Navigation semantics

| Recommendation | CTA/destination |
| --- | --- |
| Due/overdue/owned vocabulary | Open Review → /review; queue chooses the session, no new-only promise. |
| Weak vocabulary | Practice weak words → /review?filter=weak |
| Articles/Cases/Satzbau/Conjugation | Practice now → /sets/{setId}/{mode} |
| Standalone grammar | Practice now → actual /grammar/{topic} |
| Reading continuation/chooser | Open Lesen → /grammar/lesen; level selection remains manual. |
| Writing Task | Open Write → /sets/{setId}/write; reason retains manual Task-tab instruction. |

Known deleted/non-studiable/all-inactive set targets disappear using Home's owned
set snapshot, with no new fetch. Unknown/unmatched/external destinations are hidden.
Mode eligibility/ownership is checked again on existing destination pages; a set
changed after this snapshot uses their existing unavailable-content behavior.
No route parser, query or practice-mode behavior changed.

## Desktop design decisions

Desktop: content and CTA form one aligned row, reason constrained to readable prose
width; 137–161px card height for ordinary examples.

## Mobile design decisions

Stacked text and full-width
CTA, fluid height, wrapping/min-width 0; no clipped titles/reasons. Long unbroken terms
can wrap. No fixed-height content. AppShell safe areas/nav clearance reused.
Narrow 320px tested. 640px layout tested as the CSS viewport equivalent of 1280px desktop
at 200% browser zoom; this is not an automated browser chrome zoom command.

## Accessibility

Semantic section labelled by h2; source and screen-reader order match. Decorative
icons aria-hidden. One semantic anchor, keyboard activation and visible focus, no
nested interactive elements. CTA references the title for description. Buttons at
least 44px; responsive bounds/no overflow checked. Actual text/button color contrast
checked in light/dark against WCAG 4.5:1. Existing motion-safe button interaction;
no extra entrance/priority animations. No live priority announcements/no noisy badges.

## Screenshot review

Artifacts: screenshots/home-recommended-next (ignored local QA files). Baseline
before-desktop/mobile inspected after Home data settled; initial screenshots were
retaken because they showed loading rather than the finished Home.

| Before | After | Why |
| --- | --- | --- |
| White recommendation blended with white stats | Existing primary-soft surface | Distinguish the decision aid while Today remains primary. |
| Internal legacy/criteria/feedback-record wording | Copy-only cleanup preserving measured counts/navigation | Avoid technical model terminology. |
| Synthetic overdue 12 vs Today 5 | Coherent overdue fixture + unique card IDs | Screenshot should represent one consistent learner state. |
| Full-page mobile captures shrank text | Viewport captures plus dedicated long/zoom cases | Inspect actual phone hierarchy and wrapping clearly. |

Each of these final local artifacts was opened and visually inspected:

| Screenshot | Review / issue / change |
| --- | --- |
| final-desktop-overdue.png | Strong title and right-aligned CTA; soft surface keeps Today dominant. Coherent 12-word fixture. |
| final-desktop-cases.png | Balanced heading/reason widths and aligned CTA; white-to-soft surface polish retained. |
| final-mobile-overdue.png | 16px gutters, full-width CTA, consistent section spacing; no collision. |
| final-mobile-cases.png | Clear stacked hierarchy and comfortable touch action; no overflow. |
| final-desktop-reading.png | Manual B1 selection is explicit; reason stays readable. |
| final-mobile-reading.png | Two-sentence copy wraps cleanly; full-width Open Lesen. |
| final-desktop-write.png | Replaced technical missing-leitpunkt wording and title with Practice writing; Task instruction retained. |
| final-mobile-write.png | Same concise copy and clear action; fits the phone layout. |
| final-desktop-empty.png | No recommendation gap; original Home hierarchy preserved. |
| final-mobile-empty.png | No fake congratulations or reserved surface; safe bottom-nav clearance. |
| final-desktop-loading.png | Existing restrained skeleton; independent stats remain visible. |
| final-mobile-loading.png | Calm skeleton with bounded minimum height; no spinner or blocking overlay. |
| final-desktop-error.png | Neutral retry surface integrates with Home; no private/raw error. |
| final-mobile-error.png | Message wraps and retry stays reachable; no scary alert styling. |
| final-desktop-dark.png | Muted dark surface and visible keyboard focus; contrast checked. |
| final-mobile-dark.png | Action remains clear in dark mode; reduced motion respected. |
| final-desktop-long.png | 320px stress layout: German compound wraps; no clipping, fluid height. |
| final-mobile-long.png | Long multilingual reason remains readable; scroll capture positions the whole CTA above nav. |
| final-desktop-zoom.png | 640px CSS zoom-equivalent layout: inspect wrapping and CTA alignment; capture repositioned below sticky header. |
| final-mobile-zoom.png | Same zoom-equivalent stress case with phone rendering; no horizontal overflow. |

Baseline before-desktop.png/before-mobile.png and initial first-desktop-overdue.png,
first-desktop-cases.png, first-mobile-overdue.png, first-mobile-cases.png and
first-mobile-long.png were also inspected. A second measured polish pass was needed;
changes are in the Before/After table above. Long/zoom captures use normal page
scrolling so the sticky header does not obscure the card during visual inspection.

## Validation

- `node --import ./scripts/test-register.mjs --test src/lib/primary-recommendation.test.ts src/components/recommended-next-card.test.ts`: 11 passed.
- `npm run typecheck`: exit 0.
- `npm test`: 210 script tests + 1022 TypeScript tests passed (1232 total).
- `npm run test:e2e`: 115 passed, 11 existing mobile-only desktop skips; 42 Home recommendation cases included (21 per project).
- `VITE_AUTH_ENABLED=true npm run build:compile`: exit 0, safe compile helper blanks production credentials and never runs migrations. Auth flag is process-local and matches the committed app flag.
- `npm run test:e2e -- --config e2e/home-compiled.config.ts e2e/home-recommended-next.spec.ts`: 42 passed (21 desktop + 21 Pixel 7), no uncaught browser errors.
- `git diff --check`: clean.

Compiled config resolves production function IDs from the generated registry into
existing explicit mock handlers; unhandled calls still fail, never fall through.
Test-only mapping variable is supplied to the runner/workers, not production.
Browser page errors are asserted absent; actual CTA destinations were visited.
An initial signed-out test expected a nonexistent sign-in button and was corrected
to await the signed-out public library. Initial compiled QA caught the SSR boundary
failure described above; subsequent hash-ID failures required the explicit mock map.

Existing compile warnings: browser externalization of node:crypto in
example-suggestions and large generated chunks. Deliberate error tests produce
sanitized operation-failure diagnostics; no raw learner state logged. No migrations,
resets, deployment, real learner data access or persisted environment changes.

## Performance

One additional authenticated getLearningSignals HTTP call per Home mount, one builder
execution per successful response; refresh/retry intentionally make one new call.
No fetch when signed out/dev fallback. Home shell/Today/stats do not await it.
No new Firestore path: existing LearningSignals loader unchanged (profile read,
then 12 parallel operations). This still adds read cost and overlaps Home's existing
set/progress/profile reads. Those cannot substitute for the complete bounded grammar,
drill, reading, writing model without duplicating/reworking the foundation. No cache or
heavy synchronization introduced. Local owned-set state reused only for stale targets.

## Known limitations

English copy; wrapping allows future localization but no translation system added.
Global CEFR/per-level reading accuracy remain unavailable. Aggregate weakness may
route to an eligible set different from the one contributing most errors. No impression
history, live data synchronization, dismissal or offline caching. Long reasons require
normal page scrolling on narrow phones. Typography 200% at 320px is not equivalent to
normal desktop browser zoom and existing unrelated Home controls are not redesigned.

## Future opportunities

Localization; explicit supported level/Task selection; compact merged-reason copy;
profile-aware cache/freshness if needed. Any richer/multi-card UI requires separate
product review. No hidden debug page, AI call or recommendation persistence added.
