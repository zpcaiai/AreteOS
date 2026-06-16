import { describe, expect, it } from "vitest";
import { compositeConfidence, sampleConfidence, wilsonInterval, withConfidence } from "../src/lib/scoring";

describe("wilsonInterval", () => {
  it("returns full uncertainty for no data", () => {
    expect(wilsonInterval(0, 0)).toEqual({ low: 0, mid: 0, high: 1 });
  });
  it("is ordered, bounded, and narrows with more samples", () => {
    const w = wilsonInterval(8, 10);
    expect(w.low).toBeLessThan(w.mid);
    expect(w.mid).toBeLessThan(w.high);
    expect(wilsonInterval(1, 1).high - wilsonInterval(1, 1).low).toBeGreaterThan(
      wilsonInterval(50, 50).high - wilsonInterval(50, 50).low,
    );
  });
});

describe("sampleConfidence", () => {
  it("is 0 with no samples and 0.5 at n=k", () => {
    expect(sampleConfidence(0)).toBe(0);
    expect(sampleConfidence(10, 10)).toBeCloseTo(0.5, 9);
  });
});

describe("withConfidence", () => {
  it("widens the band when evidence is thin and preserves the value", () => {
    const thin = withConfidence(0.73, 4);
    const thick = withConfidence(0.73, 100);
    expect(thin.high - thin.low).toBeGreaterThan(thick.high - thick.low);
    expect(thin.value).toBe(0.73);
  });
});

describe("compositeConfidence", () => {
  it("is the geometric mean of part confidences", () => {
    expect(compositeConfidence([0.5, 0.5, 0.5])).toBeCloseTo(0.5, 9);
    expect(compositeConfidence([])).toBe(0);
  });
});
