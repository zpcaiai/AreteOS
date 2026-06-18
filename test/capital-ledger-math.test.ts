import { describe, it, expect } from "vitest";
import { applyEntries, globalLifeCapitalScore, diversification, weakest, CATEGORY_KEYS } from "../src/lib/capital-ledger-math";

describe("life-capital ledger math", () => {
  it("empty ledger → every category at the neutral start (50)", () => {
    const bal = applyEntries([]);
    expect(CATEGORY_KEYS.every((k) => bal[k] === 50)).toBe(true);
  });
  it("a deposit raises one category, leaves others", () => {
    const bal = applyEntries([{ category: "health", entryType: "deposit", amount: 30 }]);
    expect(bal.health).toBe(80);
    expect(bal.skill).toBe(50);
  });
  it("balances clamp to 0..100", () => {
    expect(applyEntries([{ category: "health", entryType: "deposit", amount: 100 }]).health).toBe(100);
    expect(applyEntries([{ category: "health", entryType: "withdrawal", amount: 100 }]).health).toBe(0);
  });
  it("unknown categories are ignored", () => {
    const bal = applyEntries([{ category: "nonsense", entryType: "deposit", amount: 50 }]);
    expect(CATEGORY_KEYS.every((k) => bal[k] === 50)).toBe(true);
  });
  it("all-50 ledger global score is 50; a depleted capital drags it down", () => {
    expect(globalLifeCapitalScore(applyEntries([]))).toBe(50);
    expect(globalLifeCapitalScore(applyEntries([{ category: "health", entryType: "withdrawal", amount: 50 }]))).toBeLessThan(50);
  });
  it("diversification is 1 for a perfectly even ledger", () => {
    expect(diversification(applyEntries([]))).toBe(1);
  });
  it("weakest returns the lowest-balance category", () => {
    expect(weakest(applyEntries([{ category: "relationship", entryType: "withdrawal", amount: 40 }]))).toBe("relationship");
  });
});
