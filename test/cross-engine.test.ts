import { describe, expect, it } from "vitest";
import { deriveBridgeInsights, CROSS_ENGINE_RULE_IDS } from "../src/lib/cross-engine";

describe("cross-engine bridge insights", () => {
  it("returns nothing when there are no signals", () => {
    expect(deriveBridgeInsights({})).toEqual([]);
  });

  it("fires 'pushing execution before steady' when calm is low but habits are high", () => {
    const out = deriveBridgeInsights({ selfReport: { calm: 2 }, habitConsistency: 0.9 });
    expect(out.some((i) => i.id === "calm-vs-execution")).toBe(true);
    const ins = out.find((i) => i.id === "calm-vs-execution")!;
    expect(ins.from).toBe("wellbeing");
    expect(ins.to).toBe("execution");
    expect(ins.href).toBe("/stabilization");
  });

  it("does NOT fire that rule when calm is high", () => {
    const out = deriveBridgeInsights({ selfReport: { calm: 9 }, habitConsistency: 0.9 });
    expect(out.some((i) => i.id === "calm-vs-execution")).toBe(false);
  });

  it("flags say-do gap only past the threshold", () => {
    expect(deriveBridgeInsights({ integrityGap: 0.2 }).some((i) => i.id === "integrity-vs-identity")).toBe(false);
    expect(deriveBridgeInsights({ integrityGap: 0.8 }).some((i) => i.id === "integrity-vs-identity")).toBe(true);
  });

  it("ranks by strength and respects the limit", () => {
    const out = deriveBridgeInsights({
      selfReport: { calm: 1, energy: 1, relationships: 1, clarity: 9, progress: 1, meaning: 1 },
      selfReportDelta: { calm: -4, energy: -4, meaning: -4 },
      habitConsistency: 0.9, reflection: 0.1, integrityGap: 0.9, decisionQuality: 0.9,
    }, 3);
    expect(out.length).toBe(3);
    for (let i = 1; i < out.length; i++) expect(out[i - 1].score).toBeGreaterThanOrEqual(out[i].score);
    for (const i of out) { expect(i.score).toBeGreaterThan(0); expect(i.score).toBeLessThanOrEqual(1); }
  });

  it("every insight carries a bilingual title/action and a valid severity", () => {
    const out = deriveBridgeInsights({ selfReport: { clarity: 9, progress: 1 } });
    for (const i of out) {
      expect(i.title.zh.length).toBeGreaterThan(0);
      expect(i.title.en.length).toBeGreaterThan(0);
      expect(["info", "watch", "act"]).toContain(i.severity);
      expect(CROSS_ENGINE_RULE_IDS).toContain(i.id);
    }
  });
});
