import { describe, expect, it } from "vitest";
import { cardBody, composeCardText } from "../src/lib/growth-card-text";

describe("growth card text", () => {
  it("composes a full card with all signals", () => {
    const c = composeCardText({ growth: 64.4, protocol: 72, bottleneck: "asset", deepWorkMinutes: 150, assetsPublished: 2, capital: 55, identityUnlocked: 3, identityTotal: 14 });
    expect(c.headline).toContain("64");
    expect(c.lines[0]).toBe("Growth score: 64");
    expect(c.lines.some((l) => l.includes("asset"))).toBe(true);
    expect(c.lines.some((l) => l.includes("150 min"))).toBe(true);
    expect(c.lines.some((l) => l.includes("3/14"))).toBe(true);
  });
  it("omits empty/zero fields", () => {
    const c = composeCardText({ growth: 10, protocol: 0, bottleneck: null, deepWorkMinutes: 0, assetsPublished: 0, capital: 50, identityUnlocked: 0, identityTotal: 14 });
    expect(c.lines.some((l) => l.startsWith("Protocol"))).toBe(false);
    expect(c.lines.some((l) => l.startsWith("Focus"))).toBe(false);
    expect(c.lines.some((l) => l.startsWith("Deep work"))).toBe(false);
  });
  it("cardBody joins the lines", () => {
    const c = composeCardText({ growth: 50, protocol: 0, bottleneck: null, deepWorkMinutes: 0, assetsPublished: 0, capital: 50, identityUnlocked: 1, identityTotal: 14 });
    expect(cardBody(c)).toContain(" · ");
  });
});
