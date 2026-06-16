import { describe, expect, it } from "vitest";
import { applyEntries, CAPITAL_CATEGORIES, diversification, globalLifeCapitalScore, weakest } from "../src/lib/capital-ledger-math";

describe("life capital ledger math", () => {
  it("has 12 capital categories", () => expect(CAPITAL_CATEGORIES).toHaveLength(12));
  it("applies deposits/withdrawals from a neutral 50 and clamps", () => {
    const b = applyEntries([{ category: "knowledge", entryType: "deposit", amount: 30 }, { category: "health", entryType: "withdrawal", amount: 40 }]);
    expect(b.knowledge).toBe(80);
    expect(b.health).toBe(10);
    expect(b.skill).toBe(50);
    expect(applyEntries([{ category: "health", entryType: "withdrawal", amount: 999 }]).health).toBe(0);
  });
  it("scores global by geometric mean and finds the weakest", () => {
    const full = Object.fromEntries(CAPITAL_CATEGORIES.map((c) => [c.key, 100]));
    expect(globalLifeCapitalScore(full)).toBe(100);
    const b = applyEntries([{ category: "health", entryType: "withdrawal", amount: 40 }]);
    expect(weakest(b)).toBe("health");
    expect(diversification(Object.fromEntries(CAPITAL_CATEGORIES.map((c) => [c.key, 50])))).toBeCloseTo(1, 9);
  });
});
