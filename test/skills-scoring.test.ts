import { describe, expect, it } from "vitest";
import { geoMean01, mean01, ratio01, scoreEngine } from "../src/lib/skills-scoring";

describe("skills-scoring combinators", () => {
  it("mean and geomean agree for equal inputs", () => {
    expect(mean01([0.5, 0.5])).toBeCloseTo(0.5, 9);
    expect(geoMean01([0.5, 0.5])).toBeCloseTo(0.5, 9);
  });
  it("geometric mean collapses on a neglected factor", () => {
    expect(geoMean01([0.9, 0.0001])).toBeLessThan(0.1);
  });
  it("ratio01 is bounded and monotonic in the denominator", () => {
    expect(ratio01([1, 1], 0)).toBe(1);
    expect(ratio01([1, 1], 1)).toBeCloseTo(0.5, 9);
    expect(ratio01([0.8, 0.8], 0)).toBeGreaterThan(ratio01([0.8, 0.8], 0.6));
  });
  it("scoreEngine returns 0..100 per mode", () => {
    expect(scoreEngine([0.6, 0.6, 0.6], "mean")).toBeCloseTo(60, 9);
    const r0 = scoreEngine([0.8, 0.8, 0.8, 0.0], "ratio", 3);
    const r1 = scoreEngine([0.8, 0.8, 0.8, 1.0], "ratio", 3);
    expect(r0).toBeGreaterThan(r1);
    expect(scoreEngine([2, -1], "mean")).toBe(50);
  });
});
