import { describe, it, expect } from "vitest";
import { detectMaintainingLoops, recommendNextSkills } from "../src/lib/healing/intake-logic";

describe("maintaining-loop detection", () => {
  it("detects anxiety–avoidance from checkbox", () => {
    expect(detectMaintainingLoops({ checkboxes: { avoidance: true } }).some((l) => l.kind === "anxiety_avoidance")).toBe(true);
  });
  it("detects perfectionism–procrastination from free text", () => {
    expect(detectMaintainingLoops({ freeText: "我总想做到完美，所以迟迟不开始" }).some((l) => l.kind === "perfectionism_procrastination")).toBe(true);
  });
  it("detects shame–hiding from a high shame rating", () => {
    expect(detectMaintainingLoops({ ratings: { shame: 8 } }).some((l) => l.kind === "shame_hiding")).toBe(true);
  });
  it("detects depression–inactivity from low energy", () => {
    expect(detectMaintainingLoops({ ratings: { energy: 2 } }).some((l) => l.kind === "depression_inactivity")).toBe(true);
  });
  it("detects people-pleasing from free text", () => {
    expect(detectMaintainingLoops({ freeText: "我不敢拒绝别人，总是答应" }).some((l) => l.kind === "people_pleasing_resentment")).toBe(true);
  });
  it("each detected loop carries a short-term reward and long-term cost", () => {
    const loops = detectMaintainingLoops({ checkboxes: { avoidance: true, procrastination: true, rumination: true } });
    expect(loops.length).toBeGreaterThanOrEqual(3);
    for (const l of loops) {
      expect(l.shortTermReward).toBeTruthy();
      expect(l.longTermCost).toBeTruthy();
    }
  });
});

describe("next-skill routing (risk-aware)", () => {
  it("red → stabilization only", () => {
    expect(recommendNextSkills({}, [], "red")).toEqual(["stabilization"]);
  });
  it("orange → stabilization, never deep skills", () => {
    const next = recommendNextSkills({}, [], "orange");
    expect(next).toContain("stabilization");
    expect(next).not.toContain("dilts-map");
    expect(next).not.toContain("core-belief");
  });
  it("green high-anxiety → leads with emotion-regulation, includes structure", () => {
    const next = recommendNextSkills({ ratings: { anxiety: 9 } }, [], "green");
    expect(next[0]).toBe("emotion-regulation");
    expect(next).toContain("dilts-map");
    expect(next).toContain("case-formulation");
  });
  it("avoidance loop → routes to exposure", () => {
    const loops = detectMaintainingLoops({ checkboxes: { avoidance: true } });
    expect(recommendNextSkills({ checkboxes: { avoidance: true } }, loops, "yellow")).toContain("exposure");
  });
  it("returns no duplicates", () => {
    const loops = detectMaintainingLoops({ checkboxes: { avoidance: true, procrastination: true } });
    const next = recommendNextSkills({ ratings: { anxiety: 8 } }, loops, "green");
    expect(new Set(next).size).toBe(next.length);
  });
});
