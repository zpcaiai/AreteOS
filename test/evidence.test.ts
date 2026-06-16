import { describe, expect, it } from "vitest";
import { aggregateEvidence, decayWeight, gapReport, identityBehaviorGap, overallIntegrity, type EvidenceSignal } from "../src/lib/evidence-math";

describe("decayWeight", () => {
  it("is 1 at age 0 and 0.5 at one half-life", () => {
    expect(decayWeight(0, 21)).toBeCloseTo(1, 9);
    expect(decayWeight(21, 21)).toBeCloseTo(0.5, 9);
  });
});

describe("aggregateEvidence", () => {
  const now = Date.UTC(2026, 0, 31);
  const signals: EvidenceSignal[] = [
    { source: "journal", kind: "reflection", value: 1, at: now },
    { source: "journal", kind: "reflection", value: 0, at: now - 21 * 86_400_000 },
    { source: "git", kind: "habits", value: 0.8, at: now },
  ];
  it("weights recent signals more", () => {
    const agg = aggregateEvidence(signals, now, 21);
    expect(agg.reflection.samples).toBe(2);
    expect(agg.reflection.enacted).toBeGreaterThan(0.6);
    expect(agg.reflection.enacted).toBeLessThan(0.7);
    expect(agg.habits.enacted).toBeCloseTo(0.8, 9);
  });
});

describe("identity-behavior gap", () => {
  it("computes gap and integrity", () => {
    const g = identityBehaviorGap(0.8, 0.4);
    expect(g.gap).toBeCloseTo(0.4, 9);
    expect(g.integrity).toBeCloseTo(0.6, 9);
  });
  it("sorts overclaims first and bounds overall integrity", () => {
    const rep = gapReport({ reflection: 0.8, habits: 0.5 }, { reflection: { enacted: 0.3, samples: 5, weight: 5 }, habits: { enacted: 0.5, samples: 2, weight: 2 } });
    expect(rep[0].domain).toBe("reflection");
    expect(overallIntegrity(rep)).toBeGreaterThanOrEqual(0);
    expect(overallIntegrity(rep)).toBeLessThanOrEqual(1);
  });
});
