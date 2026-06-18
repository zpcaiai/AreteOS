import { describe, it, expect } from "vitest";
import { classifyArousalState, selectEmotionRegulationSkill, recommendERNextSkills, erPracticeTask } from "../src/lib/healing/emotion-logic";
import { EmotionRegulationCoreSchema } from "../src/lib/domain/emotion-regulation";

describe("arousal classification", () => {
  it("anxiety + racing heart → hyperarousal", () => {
    expect(classifyArousalState({ currentEmotionText: "我现在很焦虑，心跳很快，脑子停不下来。" })).toBe("hyperarousal");
  });
  it("numbness / disconnection → hypoarousal", () => {
    expect(classifyArousalState({ currentEmotionText: "我什么感觉都没有，整个人像断开了一样。" })).toBe("hypoarousal");
  });
  it("both activation and shutdown → mixed", () => {
    expect(classifyArousalState({ currentEmotionText: "我心跳很快但又感觉很麻木。" })).toBe("mixed");
  });
  it("plain emotion with no markers → within_window", () => {
    expect(classifyArousalState({ currentEmotionText: "我有点难过。" })).toBe("within_window");
  });
});

describe("skill selection", () => {
  it("hyperarousal + anger → check_the_facts", () => {
    expect(selectEmotionRegulationSkill({ currentEmotionText: "我特别生气", arousal: "hyperarousal" })).toBe("check_the_facts");
  });
  it("hyperarousal + impulse urge → urge_surfing", () => {
    expect(selectEmotionRegulationSkill({ currentEmotionText: "我很激动", urges: ["想马上发消息骂他"], arousal: "hyperarousal" })).toBe("urge_surfing");
  });
  it("hypoarousal → body_scan", () => {
    expect(selectEmotionRegulationSkill({ currentEmotionText: "麻木", arousal: "hypoarousal" })).toBe("body_scan");
  });
  it("shame within window → self_validation", () => {
    expect(selectEmotionRegulationSkill({ currentEmotionText: "我觉得自己很没用，特别羞耻", arousal: "within_window" })).toBe("self_validation");
  });
});

const core = EmotionRegulationCoreSchema.parse({
  emotionalStateMap: { dominantEmotions: [{ name: "羞耻", intensity: 7, likelyFunction: "", associatedUrge: "" }], arousalState: "within_window", bodySignals: [], triggerSummary: "", immediateRiskNotes: [] },
  recommendedSkillSet: { primarySkill: "self_validation", reason: "", contraindications: [] },
  interventionPlan: { sixtySecondVersion: ["呼吸"], fiveMinuteVersion: [], twentyMinuteVersion: [] },
  practiceTask: { title: "自我确认", steps: ["写下事实而非标签"], suggestedTiming: "羞耻升高时", completionMetric: "强度下降" },
  reflectionQuestions: [],
});

describe("ER routing + practice", () => {
  it("orange → relapse-prevention only", () => {
    expect(recommendERNextSkills(core, "orange")).toEqual(["relapse-prevention"]);
  });
  it("shame → routes to core-belief; always cbt", () => {
    const next = recommendERNextSkills(core, "green");
    expect(next).toContain("core-belief");
    expect(next).toContain("cbt");
  });
  it("builds an emotion-regulation practice task", () => {
    const task = erPracticeTask(core, { userId: "u", sessionId: "s", sourceId: "e1" });
    expect(task.sourceType).toBe("emotion-regulation");
    expect(task.steps).toEqual(["写下事实而非标签"]);
  });
});
