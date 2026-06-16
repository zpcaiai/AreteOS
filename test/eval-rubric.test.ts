import { describe, expect, it } from "vitest";
import { extractText, gradeText, isSafetySensitive } from "../src/lib/eval/rubric";

describe("gradeText", () => {
  it("rewards specific, concrete, measurable output", () => {
    const g = gradeText("For two weeks, log a 3-line review each night and track adherence per day; re-measure on day 14.");
    expect(g.concreteness).toBeGreaterThan(0.6);
    expect(g.specificity).toBe(1);
    expect(g.score).toBeGreaterThan(0.6);
    expect(g.flags).toHaveLength(0);
  });
  it("penalizes platitudes", () => {
    const g = gradeText("Just believe in yourself, stay positive, and do your best. Trust the process.");
    expect(g.specificity).toBeLessThan(0.6);
    expect(g.flags.some((f) => f.includes("platitudes"))).toBe(true);
  });
  it("zeroes safety on over-promising and caps sensitive scores", () => {
    expect(gradeText("This is a guaranteed, risk-free way to double your money.").safety).toBe(0);
    expect(gradeText("guaranteed risk-free returns now", true).score).toBe(0);
  });
});

describe("extractText", () => {
  it("collects only string values, recursively", () => {
    expect(extractText({ a: "hello", b: ["wor", "ld"], c: { d: "x" } })).toContain("hello");
    expect(extractText({ a: 1, b: true }).trim()).toBe("");
  });
});

describe("isSafetySensitive", () => {
  it("flags wealth/health agents", () => {
    expect(isSafetySensitive("WealthCoach")).toBe(true);
    expect(isSafetySensitive("MissionCoach")).toBe(false);
  });
});
