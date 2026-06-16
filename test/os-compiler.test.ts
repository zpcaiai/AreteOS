import { describe, expect, it } from "vitest";
import { PERSONAL_OS_TEMPLATES, pickTemplate } from "../src/lib/os-compiler-templates";

describe("personal OS compiler templates", () => {
  it("has 10 well-formed templates", () => {
    expect(PERSONAL_OS_TEMPLATES).toHaveLength(10);
    expect(PERSONAL_OS_TEMPLATES.every((t) => t.values.length && t.skills.length && t.habits.length && t.assetRoadmap.length && t.decisionRules.length && t.ninetyDay.m1)).toBe(true);
  });
  it("routes intent to the closest template, with a default", () => {
    expect(pickTemplate("I want to become an AI research entrepreneur").key).toBe("ai_entrepreneur");
    expect(pickTemplate("a world-class systems architect").key).toBe("system_architect");
    expect(pickTemplate("become a disciplined investor").key).toBe("investor");
    expect(pickTemplate("something unrelated").key).toBe("knowledge_creator");
  });
});
