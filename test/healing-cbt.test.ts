import { describe, it, expect } from "vitest";
import { detectCBTMode, recommendCBTNextSkills, behaviorPlanToPracticeTask } from "../src/lib/healing/cbt-logic";
import { CBTCoreSchema } from "../src/lib/domain/cbt";

describe("CBT mode detection", () => {
  it("rumination text → rumination_interrupt", () => {
    expect(detectCBTMode("我一直反复想昨天说错的话，停不下来")).toBe("rumination_interrupt");
  });
  it("procrastination text → procrastination_breakdown", () => {
    expect(detectCBTMode("我论文一直拖，迟迟不敢开始")).toBe("procrastination_breakdown");
  });
  it("explicit mode wins", () => {
    expect(detectCBTMode("随便", "behavioral_activation")).toBe("behavioral_activation");
  });
  it("default is thought_record", () => {
    expect(detectCBTMode("老板没回消息")).toBe("thought_record");
  });
});

const core = CBTCoreSchema.parse({
  cbtMap: { situation: "s", automaticThoughts: [], emotions: [{ name: "焦虑", intensity: 8, function: "" }], behaviors: [], outcomeLoop: "" },
  evidenceCheck: {},
  behaviorPlan: { planType: "behavioral_experiment", title: "跟进", steps: ["等2小时", "简短跟进"], difficulty: "easy", measurement: "是否2小时后跟进" },
});

describe("CBT routing + practice task", () => {
  it("orange → emotion-regulation only", () => {
    expect(recommendCBTNextSkills(core, "orange")).toEqual(["emotion-regulation"]);
  });
  it("high emotion + experiment plan → emotion-regulation + exposure + core-belief", () => {
    const next = recommendCBTNextSkills(core, "green");
    expect(next).toContain("emotion-regulation");
    expect(next).toContain("exposure");
    expect(next).toContain("core-belief");
  });
  it("behavior plan → a cbt practice task with measurement + steps", () => {
    const task = behaviorPlanToPracticeTask(core, { userId: "u", sessionId: "s", sourceId: "c1" });
    expect(task.sourceType).toBe("cbt");
    expect(task.title).toBe("跟进");
    expect(task.steps).toEqual(["等2小时", "简短跟进"]);
    expect(task.completionMetric).toBe("是否2小时后跟进");
  });
});
