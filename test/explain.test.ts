import { describe, expect, it } from "vitest";
import { explainGrowth } from "../src/lib/explain";
import { growthScore } from "../src/lib/scoring";

const factors = {
  mission: 0.7, identity: 0.7, values: 0.7, mentalModels: 0.7, firstPrinciples: 0.7,
  decisions: 0.7, habits: 0.2, reflection: 0.7, mastery: 0.7,
};

describe("explainGrowth", () => {
  it("identifies the weakest layer as the biggest lever", () => {
    const e = explainGrowth(factors);
    expect(e.weakest).toBe("habits");
    expect(e.biggestLever).toBe("habits");
    expect(e.contributions[0].factor).toBe("habits");
  });
  it("matches growthScore and has drag shares summing to 1", () => {
    const e = explainGrowth(factors);
    expect(e.value).toBeCloseTo(growthScore(factors), 9);
    expect(e.contributions.reduce((s, c) => s + c.dragShare, 0)).toBeCloseTo(1, 9);
  });
  it("shows raising the weakest beats raising the strongest (geometric mean)", () => {
    const e = explainGrowth(factors);
    const gainStrong = growthScore({ ...factors, mission: factors.mission + 0.1 }) - e.value;
    expect(e.gainFromLever).toBeGreaterThan(gainStrong);
  });
});
