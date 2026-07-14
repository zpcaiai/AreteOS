import { describe, expect, it } from "vitest";
import { approach } from "../src/lib/whatif-math";

describe("what-if approach curve", () => {
  it("starts at the current value", () => {
    expect(approach(0.4, 0.9, 0, 90)).toBeCloseTo(0.4, 5);
  });

  it("converges close to the target by the horizon", () => {
    const v = approach(0.4, 0.9, 90, 90);
    expect(v).toBeGreaterThan(0.85);
    expect(v).toBeLessThanOrEqual(0.9);
  });

  it("is monotonic toward the target", () => {
    let prev = approach(0.2, 0.8, 0, 90);
    for (let day = 5; day <= 90; day += 5) {
      const next = approach(0.2, 0.8, day, 90);
      expect(next).toBeGreaterThanOrEqual(prev);
      prev = next;
    }
  });

  it("decays toward a lower target too", () => {
    expect(approach(0.8, 0.2, 90, 90)).toBeLessThan(0.3);
  });

  it("clamps outputs to [0,1]", () => {
    expect(approach(0.5, 2, 90, 90)).toBeLessThanOrEqual(1);
    expect(approach(0.5, -1, 90, 90)).toBeGreaterThanOrEqual(0);
  });
});
