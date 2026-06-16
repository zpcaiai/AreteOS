import { describe, expect, it } from "vitest";
import { cohensD, mean, normalCdf, readout, variance } from "../src/lib/experiments-math";

describe("descriptive stats", () => {
  it("mean and sample variance", () => {
    expect(mean([2, 4, 6])).toBe(4);
    expect(variance([2, 4, 6])).toBe(4);
  });
  it("normal CDF", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 3);
    expect(normalCdf(2)).toBeGreaterThan(0.97);
    expect(normalCdf(-2)).toBeLessThan(0.03);
  });
});

describe("N-of-1 readout", () => {
  it("flags a strong, increasing effect", () => {
    const r = readout([5, 5, 5, 5], [8, 8, 8, 8]);
    expect(r.direction).toBe("increase");
    expect(r.verdict).toBe("strong");
  });
  it("flags a noisy real increase as strong/promising", () => {
    const r = readout([5, 6, 4, 5, 6], [8, 7, 9, 8, 8]);
    expect(r.cohensD).toBeGreaterThan(0);
    expect(["strong", "promising"]).toContain(r.verdict);
  });
  it("reports no effect when distributions overlap", () => {
    expect(readout([5, 6, 4, 5, 6], [5, 4, 6, 5, 6]).verdict).toBe("no-effect");
  });
  it("needs at least 3 per phase", () => {
    expect(readout([5, 5], [8]).verdict).toBe("insufficient-data");
  });
  it("has zero effect size for identical samples", () => {
    expect(cohensD([1, 2, 3], [1, 2, 3])).toBe(0);
  });
});
