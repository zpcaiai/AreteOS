import { describe, it, expect } from "vitest";
import { recommendInterventionPath, buildCausalLoop } from "../src/lib/healing/dilts-logic";
import { DiltsMapSchema, FivePSchema, DiltsClinicalFormulationOutputSchema } from "../src/lib/domain/dilts";

const meetingMap = DiltsMapSchema.parse({
  environment: [{ item: "会议、上级", evidence: "一开会就紧张" }],
  behavior: [{ item: "沉默回避", evidence: "总是沉默", shortTermFunction: "降低焦虑", longTermCost: "强化'我不行'" }],
  capability: [{ item: "公开表达", currentGap: "压力下表达", trainableSkill: "结构化表达" }],
  beliefAndValues: [{ belief: "说错就会被否定", type: "conditional_belief", evidence: "怕说错话", impact: "回避表达" }],
  identity: [{ narrative: "我不够有能力", evidence: "觉得自己很没用", cost: "不敢表达", alternativeIdentitySeed: "正在练习表达的人" }],
  mission: [{ blockedCalling: "承担表达性角色", fear: "被否定", growthDirection: "低风险练习" }],
});
const meetingFiveP = FivePSchema.parse({
  presentingProblems: ["会议焦虑"],
  perpetuatingFactors: ["回避带来短期安全感"],
  protectiveFactors: ["有觉察", "愿意改变"],
});

describe("intervention path", () => {
  it("is ordered 1..n with no gaps", () => {
    const path = recommendInterventionPath(meetingMap, meetingFiveP, { dominantEmotions: ["焦虑", "羞耻"] });
    expect(path.length).toBeGreaterThan(0);
    path.forEach((p, i) => expect(p.order).toBe(i + 1));
  });
  it("regulates emotion first when affect is high, and reaches identity work", () => {
    const path = recommendInterventionPath(meetingMap, meetingFiveP, { dominantEmotions: ["焦虑"] });
    expect(path[0].skill).toBe("emotion-regulation");
    expect(path.some((p) => p.skill === "identity-reconstruction")).toBe(true);
  });
  it("routes avoidance behavior to exposure and a conditional belief to core-belief", () => {
    const skills = recommendInterventionPath(meetingMap, meetingFiveP).map((p) => p.skill);
    expect(skills).toContain("exposure");
    expect(skills).toContain("core-belief");
  });
  it("falls back to a CBT step when nothing else fires", () => {
    const bare = DiltsMapSchema.parse({});
    const five = FivePSchema.parse({ protectiveFactors: ["有支持"] });
    expect(recommendInterventionPath(bare, five).map((p) => p.skill)).toContain("cbt");
  });
});

describe("causal loop", () => {
  it("has at least 3 edges and climbs toward identity/mission", () => {
    const loop = buildCausalLoop(meetingMap, meetingFiveP);
    expect(loop.length).toBeGreaterThanOrEqual(3);
    const tos = loop.map((e) => e.to);
    expect(tos).toContain("我不够有能力");
    expect(loop.every((e) => e.from && e.to && e.explanation)).toBe(true);
  });
});

describe("full formulation output validates against the contract", () => {
  it("composes a schema-valid DiltsClinicalFormulationOutput", () => {
    const out = {
      diltsMap: meetingMap,
      fiveP: meetingFiveP,
      causalLoop: buildCausalLoop(meetingMap, meetingFiveP),
      formulationSummary: "summary",
      recommendedInterventionPath: recommendInterventionPath(meetingMap, meetingFiveP, { dominantEmotions: ["焦虑"] }),
      cautions: ["不是诊断"],
    };
    expect(() => DiltsClinicalFormulationOutputSchema.parse(out)).not.toThrow();
  });
  it("rejects a 5P with no protective factors (resource is mandatory)", () => {
    expect(() => FivePSchema.parse({ presentingProblems: ["x"] })).toThrow();
  });
});
