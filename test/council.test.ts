import { describe, expect, it } from "vitest";
import { consensusMetrics, jaccard, tokenize } from "../src/lib/council";

describe("council text similarity", () => {
  it("drops stopwords and short tokens", () => {
    const t = tokenize("Take the role if it compounds");
    expect(t.has("the")).toBe(false);
    expect(t.has("if")).toBe(false);
    expect(t.has("compounds")).toBe(true);
  });

  it("jaccard is 1 for identical and 0 for disjoint", () => {
    expect(jaccard(tokenize("compound rare skill"), tokenize("compound rare skill"))).toBeCloseTo(1, 5);
    expect(jaccard(tokenize("alpha beta"), tokenize("gamma delta"))).toBe(0);
  });
});

describe("council consensus metrics", () => {
  it("reports full agreement when recommendations match", () => {
    const m = consensusMetrics([
      { persona: "A", recommendation: "stay an ic and deepen rare skill", confidence: 0.6 },
      { persona: "B", recommendation: "stay an ic and deepen rare skill", confidence: 0.6 },
    ]);
    expect(m.agreement).toBeCloseTo(1, 5);
    expect(m.confidencePolarization).toBe(0);
  });

  it("reports low agreement and high polarization when split", () => {
    const m = consensusMetrics([
      { persona: "A", recommendation: "accept the manager role now", confidence: 0.9 },
      { persona: "B", recommendation: "decline; protect deep focus time", confidence: 0.1 },
    ]);
    expect(m.agreement).toBeLessThan(0.2);
    expect(m.confidencePolarization).toBeGreaterThan(0.5);
  });

  it("handles a single member", () => {
    const m = consensusMetrics([{ persona: "A", recommendation: "wait", confidence: 0.5 }]);
    expect(m.members).toBe(1);
    expect(m.agreement).toBe(1);
    expect(m.dominant).toBe("wait");
  });

  it("picks a medoid recommendation as dominant", () => {
    const m = consensusMetrics([
      { persona: "A", recommendation: "compound rare specific knowledge", confidence: 0.6 },
      { persona: "B", recommendation: "compound rare specific knowledge daily", confidence: 0.6 },
      { persona: "C", recommendation: "buy a sailboat", confidence: 0.6 },
    ]);
    expect(m.dominant.toLowerCase()).toContain("compound");
  });
});
