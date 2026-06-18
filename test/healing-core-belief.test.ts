import { describe, it, expect } from "vitest";
import { recommendBeliefNextSkills, experimentsToPracticeTasks } from "../src/lib/healing/belief-logic";
import { CoreBeliefCoreSchema } from "../src/lib/domain/belief";

const core = CoreBeliefCoreSchema.parse({
  extractedBeliefs: [
    { belief: "如果我说错就被否定", type: "conditional_belief", evidence: "", emotionalImpact: ["焦虑"], protectionFunction: "避免羞耻", longTermCost: "回避表达" },
    { belief: "我是不能表达的人", type: "identity_belief", evidence: "", protectionFunction: "", longTermCost: "" },
  ],
  primaryBeliefPattern: { name: "p", summary: "", oldLoop: "", keyFear: "", keyProtection: "", keyCost: "" },
  behavioralExperiments: [
    { experimentName: "30秒观点", targetOldBelief: "说错被否定", newBeliefToTest: "不完美也可被接受", actionStep: "说一个观点", predictedFear: "被否定", measurableOutcome: "记录结果", reflectionQuestions: ["发生了什么？"], difficulty: "medium" },
  ],
});

describe("core-belief next-skill routing", () => {
  it("orange → emotion-regulation only (stabilization)", () => {
    expect(recommendBeliefNextSkills(core, "orange")).toEqual(["emotion-regulation"]);
  });
  it("identity belief → routes to identity-reconstruction", () => {
    expect(recommendBeliefNextSkills(core, "green")).toContain("identity-reconstruction");
  });
  it("having experiments → routes to exposure; always offers cbt", () => {
    const next = recommendBeliefNextSkills(core, "green");
    expect(next).toContain("exposure");
    expect(next).toContain("cbt");
  });
});

describe("experiments → practice tasks", () => {
  it("maps each experiment to a measurable core-belief practice task", () => {
    const tasks = experimentsToPracticeTasks(core, { userId: "u", sessionId: "s", sourceId: "rec1" });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].sourceType).toBe("core-belief");
    expect(tasks[0].sourceId).toBe("rec1");
    expect(tasks[0].completionMetric).toBe("记录结果");
    expect(tasks[0].steps[0]).toBe("说一个观点");
    expect(tasks[0].difficulty).toBe("medium");
  });
});
