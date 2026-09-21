import type { Page } from "@playwright/test";

/**
 * Interactive elements on the current page whose tappable area is under 44x44.
 *
 * "Tappable area" is measured by hit-testing, not by the element's box: a small
 * control passes when a 44px square centred on it still lands on it (the
 * `tap-target` utility and label wrappers grow the hit area without changing
 * layout). Elements behind a modal (aria-hidden) are skipped.
 */
export async function undersizedTargets(page: Page, min = 44): Promise<string[]> {
  return page.evaluate((MIN) => {
    const sel =
      'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [role=option], summary';
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
      if (el.closest('[aria-hidden="true"]') && !el.closest("nav")) continue;
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === "hidden" || cs.display === "none") continue;
      let box = r;
      const label = el.closest("label");
      if (label) {
        const lr = label.getBoundingClientRect();
        if (lr.width * lr.height > r.width * r.height) box = lr;
      }
      if (box.width >= MIN - 0.6 && box.height >= MIN - 0.6) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const inView = cx > 0 && cy > 0 && cx < innerWidth && cy < innerHeight;
      const hits = (dx: number, dy: number) => {
        const t = document.elementFromPoint(cx + dx, cy + dy);
        return !!t && (t === el || el.contains(t) || !!(label && label.contains(t)));
      };
      if (inView && [[-21, -21], [21, -21], [-21, 21], [21, 21]].every(([dx, dy]) => hits(dx, dy))) continue;
      const name = (el.getAttribute("aria-label") || el.innerText || el.getAttribute("placeholder") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 32);
      out.push(`${el.tagName.toLowerCase()} "${name}" ${Math.round(box.width)}x${Math.round(box.height)}`);
    }
    return out;
  }, min);
}
