import { describe, it, expect } from "vitest";
import { analyzeFormation } from "../src/lib/psychology/formation";
import { discernDecision } from "../src/lib/psychology/discernment";
import { tierFromEnergy, regulate } from "../src/lib/psychology/habit-fsm";
import { computeProfile } from "../src/lib/psychology/persona-tags";

describe("formation engine", () => {
  it("a high-intensity fear session raises fear_reactivity and lowers stability", () => {
    const s = analyzeFormation({ categories: ["fear"], emotionalIntensity: 8 });
    expect(s.dimensions.fear_reactivity.delta).toBeGreaterThan(0);
    expect(s.dimensions.emotional_stability.delta).toBeLessThan(0);
    expect(s.dominantLoop).toBe("control_loop");
  });
  it("a broken loop reverses the fear delta", () => {
    const base = analyzeFormation({ categories: ["fear"], emotionalIntensity: 8 });
    const broken = analyzeFormation({ categories: ["fear"], emotionalIntensity: 8, loopBroken: true });
    expect(broken.dimensions.fear_reactivity.delta).toBeLessThan(base.dimensions.fear_reactivity.delta);
  });
  it("growth improves alignment and keeps scores in band", () => {
    const s = analyzeFormation({ categories: ["growth"], emotionalIntensity: 6 });
    expect(s.alignmentTrend).toBe("improving");
    expect(Object.values(s.stateVector).every((v) => v >= 0.05 && v <= 0.95)).toBe(true);
  });
});

describe("decision discernment", () => {
  it("anxious + fear-driven → fear source", () => {
    const r = discernDecision(
      { emotionalStability: 3, anxietyLevel: 8, stressLevel: 7, fatigueLevel: 5, innerDepletion: 4 },
      { care: 0.2, fear: 0.8, pride: 0.2, desire: 0.3, ambition: 0.2, duty: 0.2 });
    expect(r.primary).toBe("fear");
    expect(r.confidenceScore).toBeGreaterThan(0);
  });
});

describe("habit fsm", () => {
  it("maps energy to tiers", () => {
    expect(tierFromEnergy(5)).toBe("Green");
    expect(tierFromEnergy(1)).toBe("Red");
    expect(regulate("x", 1).selectedTier).toBe("Red");
  });
});

describe("persona profile", () => {
  it("dedupes labels and ranks by score", () => {
    const p = computeProfile([
      { label: "Perfectionism", category: "driver", weight: 0.8 },
      { label: "perfectionism", category: "driver", weight: 0.5 },
    ]);
    expect(p.topTags[0].count).toBe(2);
    expect(p.dominantCategory).toBe("driver");
  });
});
