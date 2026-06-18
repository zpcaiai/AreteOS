import { describe, it, expect } from "vitest";
import { checkExposureContraindications, clampHierarchy, isSelectedDifficultyAllowed, recommendExposureNextSkills } from "../src/lib/healing/exposure-logic";
import { ExposureCoreSchema, type ExposureInput } from "../src/lib/domain/exposure";

const inp = (over: Partial<ExposureInput>): ExposureInput => ({ userId: "u", sessionId: "s", avoidanceProblem: "", safetyContext: { riskLevel: "green" }, ...over });

describe("exposure contraindication gate (deterministic)", () => {
  it("blocks trauma exposure requests", () => {
    expect(checkExposureContraindications(inp({ avoidanceProblem: "我想强迫自己回忆那次创伤直到不害怕" })).blocked).toBe(true);
  });
  it("blocks dangerous / self-harm requests", () => {
    expect(checkExposureContraindications(inp({ avoidanceProblem: "我想去对峙施害者", targetBehavior: "报复" })).blocked).toBe(true);
  });
  it("blocks OCD-ERP substitution", () => {
    expect(checkExposureContraindications(inp({ avoidanceProblem: "我的强迫症反复检查，想做 ERP" })).blocked).toBe(true);
  });
  it("allows ordinary social-expression avoidance", () => {
    expect(checkExposureContraindications(inp({ avoidanceProblem: "我开会不敢说话，怕被觉得蠢" })).blocked).toBe(false);
  });
});

describe("graded ladder invariants", () => {
  const core = ExposureCoreSchema.parse({
    avoidanceLoop: { trigger: "会议", fearPrediction: "被否定", emotion: "焦虑", avoidanceBehavior: "沉默", safetyBehaviors: [], shortTermRelief: "降低焦虑", longTermCost: "强化我不行" },
    exposureType: "social_expression",
    hierarchy: [
      { level: 3, title: "c", action: "c", predictedDistress: 9, difficulty: "hard", safetyNotes: "", successCriteria: "做了即可" },
      { level: 1, title: "a", action: "a", predictedDistress: 2, difficulty: "easy", safetyNotes: "", successCriteria: "做了即可" },
    ],
    selectedExperiment: { title: "a", oldPrediction: "", newLearningTarget: "可被接受", actionSteps: ["说一句"], duration: "一次", measurement: { beforeDistress: "", peakDistress: "", afterDistress: "", actualOutcome: "记录", learningStatement: "" }, stopRules: ["不安全就停"] },
    reflectionTemplate: { beforeQuestions: [], duringQuestions: [], afterQuestions: [] },
  });
  it("caps auto-generated predicted distress at 7 and sorts by level", () => {
    const clamped = clampHierarchy(core);
    expect(Math.max(...clamped.hierarchy.map((h) => h.predictedDistress))).toBeLessThanOrEqual(7);
    expect(clamped.hierarchy[0].level).toBe(1);
  });
  it("never allows a 'hard' first experiment", () => {
    expect(isSelectedDifficultyAllowed("hard")).toBe(false);
    expect(isSelectedDifficultyAllowed("medium")).toBe(true);
  });
  it("orange → emotion-regulation only (route also blocks, defense-in-depth)", () => {
    expect(recommendExposureNextSkills(core, "orange")).toEqual(["emotion-regulation"]);
  });
});
