import { describe, expect, it } from "vitest";
import { IDENTITY_NODES, isUnlocked, nodeProgress, pathFrom } from "../src/lib/identity-tree-catalog";

describe("identity tree catalog", () => {
  it("has 14 nodes across two paths", () => {
    expect(IDENTITY_NODES).toHaveLength(14);
  });
  it("computes progress as the mean of evidence ratios", () => {
    expect(nodeProgress({ habits: 1, assets: 0, reflections: 0 }, { habits: 2, assets: 1, reflections: 1 })).toBeCloseTo((0.5 + 0 + 0) / 3, 9);
  });
  it("unlocks only when requirements are met", () => {
    expect(isUnlocked(nodeProgress({ habits: 2, assets: 1, reflections: 1 }, { habits: 2, assets: 1, reflections: 1 }))).toBe(true);
    expect(isUnlocked(0.9)).toBe(false);
  });
  it("walks a linear path from a start node", () => {
    expect(pathFrom("explorer")[0]).toBe("explorer");
    expect(pathFrom("explorer")).toContain("mentor");
  });
});
