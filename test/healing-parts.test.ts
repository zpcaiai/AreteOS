import { describe, it, expect } from "vitest";
import { resolvePartsWorkMode, recommendPartsNextSkills, partsPracticeTask } from "../src/lib/healing/parts-logic";
import { PartsWorkCoreSchema } from "../src/lib/domain/parts-work";

describe("parts-work mode gating", () => {
  it("orange forces light_parts_checkin", () => {
    expect(resolvePartsWorkMode("parts_mapping", "orange")).toBe("light_parts_checkin");
  });
  it("green honors requested mode", () => {
    expect(resolvePartsWorkMode("inner_critic_softening", "green")).toBe("inner_critic_softening");
  });
});

const core = PartsWorkCoreSchema.parse({
  partsMap: [
    { partName: "批评者", partType: "inner_critic", voice: "", emotion: "", urge: "", protectionGoal: "", fearIfNotProtected: "", costOfExtremeStrategy: "", whatItNeeds: "" },
    { partName: "逃避者", partType: "avoider", voice: "", emotion: "", urge: "", protectionGoal: "", fearIfNotProtected: "", costOfExtremeStrategy: "", whatItNeeds: "" },
  ],
  internalConflictSummary: { conflictPattern: "", polarizedParts: [], sharedPositiveIntention: "", mainRisk: "" },
  healthyAdultResponse: { stance: "", validationForEachPart: [], integrativeStatement: "" },
  practiceTask: { title: "内在协商", steps: ["谢谢部分"], duration: "10 分钟", safetyStopRule: "淹没就停" },
});

describe("parts-work routing + practice", () => {
  it("orange → stabilization-oriented next skills", () => {
    expect(recommendPartsNextSkills(core, "orange")).toContain("stabilization");
  });
  it("inner critic → core-belief; avoider → exposure", () => {
    const next = recommendPartsNextSkills(core, "green");
    expect(next).toContain("core-belief");
    expect(next).toContain("exposure");
  });
  it("builds a parts-work practice task with a stop rule", () => {
    const task = partsPracticeTask(core, { userId: "u", sessionId: "s", sourceId: "p1" });
    expect(task.sourceType).toBe("parts-work");
    expect(task.description).toContain("停止规则");
  });
});
