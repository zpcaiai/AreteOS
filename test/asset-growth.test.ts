import { describe, expect, it } from "vitest";
import { ASSET_STAGES, assetCompoundingScore, pipelineProgress, portfolioScore, publishedCount } from "../src/lib/asset-growth-math";

describe("asset growth math", () => {
  it("has a 10-stage pipeline from 0 to 1", () => {
    expect(ASSET_STAGES).toHaveLength(10);
    expect(pipelineProgress("idea")).toBe(0);
    expect(pipelineProgress("compounding")).toBeCloseTo(1, 9);
  });
  it("scores compounding by geometric mean", () => {
    expect(assetCompoundingScore({ durability: 0.6, reusability: 0.6, distribution: 0.6, feedback: 0.6, improvementRate: 0.6 })).toBeCloseTo(60, 0);
  });
  it("scores the portfolio by mean progress and counts published", () => {
    expect(portfolioScore([])).toBe(0);
    expect(portfolioScore([{ stage: "idea" }, { stage: "compounding" }])).toBeGreaterThan(40);
    expect(publishedCount([{ stage: "draft" }, { stage: "published" }, { stage: "compounding" }])).toBe(2);
  });
});
