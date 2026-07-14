import { describe, expect, it } from "vitest";
import { NAV_GROUPS, NAV_MODES, PINNED, ALL_NAV, type NavMode } from "../src/lib/nav";

const MODES = NAV_MODES.map((m) => m.id);

describe("progressive-disclosure nav modes", () => {
  it("every group declares at least one valid mode", () => {
    for (const g of NAV_GROUPS) {
      expect(g.modes.length).toBeGreaterThan(0);
      for (const m of g.modes) expect(MODES).toContain(m);
    }
  });

  it("'explore' is the superset — it contains every group", () => {
    const explore = NAV_GROUPS.filter((g) => g.modes.includes("explore"));
    expect(explore.length).toBe(NAV_GROUPS.length);
  });

  it("each mode surfaces at least one group", () => {
    for (const mode of MODES as NavMode[]) {
      expect(NAV_GROUPS.some((g) => g.modes.includes(mode))).toBe(true);
    }
  });

  it("'do' is narrower than 'explore' (reduces overload)", () => {
    const doCount = NAV_GROUPS.filter((g) => g.modes.includes("do")).length;
    expect(doCount).toBeLessThan(NAV_GROUPS.length);
    expect(doCount).toBeGreaterThan(0);
  });

  it("daily entry points are pinned and the flat list is de-duplicated", () => {
    expect(PINNED.some((i) => i.href === "/today")).toBe(true);
    const hrefs = ALL_NAV.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs).toContain("/outcomes");
  });
});
