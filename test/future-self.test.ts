import { describe, expect, it } from "vitest";
import { percentile, simulateFutureSelf, weakestFactor, type FactorSet } from "../src/lib/future-self-math";

const base: FactorSet = {
  mission: 0.5, identity: 0.5, values: 0.5, mentalModels: 0.5, firstPrinciples: 0.5,
  decisions: 0.5, habits: 0.4, reflection: 0.4, mastery: 0.5,
};

describe("percentile", () => {
  it("returns the median", () => expect(percentile([1, 2, 3, 4, 5], 0.5)).toBe(3));
  it("interpolates", () => expect(percentile([0, 10], 0.1)).toBeCloseTo(1, 9));
});

describe("future-self Monte Carlo", () => {
  it("is deterministic given a seed", () => {
    const a = simulateFutureSelf({ factors: base, policy: { habits: 0.9 }, runs: 800, volatility: 0.06, seed: 42 });
    const b = simulateFutureSelf({ factors: base, policy: { habits: 0.9 }, runs: 800, volatility: 0.06, seed: 42 });
    expect(a.p50).toBe(b.p50);
    expect(a.probAboveThreshold).toBe(b.probAboveThreshold);
  });

  it("orders percentiles and bounds probability", () => {
    const r = simulateFutureSelf({ factors: base, policy: { habits: 0.9 }, runs: 800, volatility: 0.06, seed: 7 });
    expect(r.p10).toBeLessThanOrEqual(r.p50);
    expect(r.p50).toBeLessThanOrEqual(r.p90);
    expect(r.probAboveThreshold).toBeGreaterThanOrEqual(0);
    expect(r.probAboveThreshold).toBeLessThanOrEqual(1);
  });

  it("collapses to the expected projection at zero volatility", () => {
    const z = simulateFutureSelf({ factors: base, policy: { habits: 0.9, reflection: 0.9 }, runs: 200, volatility: 0, seed: 1 });
    expect(z.p10).toBeCloseTo(z.p90, 9);
    expect(z.p50).toBeCloseTo(z.expectedGrowth, 9);
  });

  it("lifts expected growth when weak layers are raised", () => {
    const r = simulateFutureSelf({ factors: base, policy: { habits: 0.9, reflection: 0.9 }, runs: 400, volatility: 0.05, seed: 3 });
    expect(r.expectedGrowth).toBeGreaterThan(r.baselineGrowth);
  });
});

describe("weakestFactor", () => {
  it("finds the lowest layer", () => {
    expect(["habits", "reflection"]).toContain(weakestFactor(base));
  });
});
