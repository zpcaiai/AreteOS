import { describe, it, expect } from "vitest";
import { detectRelapseSignals, recommendRelapseNextSkills, maintenancePracticeTasks } from "../src/lib/healing/relapse-logic";
import { RelapsePreventionCoreSchema } from "../src/lib/domain/relapse-prevention";

describe("relapse signal detection (safety-aware)", () => {
  it("red safety → urgent regardless of signals", () => {
    expect(detectRelapseSignals(undefined, "red").relapseRisk).toBe("urgent");
  });
  it("orange safety → high", () => {
    expect(detectRelapseSignals({}, "orange").relapseRisk).toBe("high");
  });
  it("3+ active signals → high", () => {
    expect(detectRelapseSignals({ sleepWorse: true, avoidanceIncreased: true, ruminationIncreased: true }, "green").relapseRisk).toBe("high");
  });
  it("1-2 signals → moderate; none → low", () => {
    expect(detectRelapseSignals({ practiceStopped: true }, "green").relapseRisk).toBe("moderate");
    expect(detectRelapseSignals({}, "green").relapseRisk).toBe("low");
  });
});

describe("relapse routing prioritizes safety", () => {
  it("urgent → safety + stabilization", () => {
    expect(recommendRelapseNextSkills("urgent")).toEqual(["safety", "stabilization"]);
  });
  it("high → stabilization first", () => {
    expect(recommendRelapseNextSkills("high")).toContain("stabilization");
  });
  it("low → maintenance (timeline/identity)", () => {
    expect(recommendRelapseNextSkills("low")).toContain("timeline");
  });
});

describe("maintenance practice tasks", () => {
  it("builds daily + identity maintenance tasks tagged relapse-prevention", () => {
    const core = RelapsePreventionCoreSchema.parse({
      relapseRiskMap: { riskLevel: "moderate", mainTriggers: [], earlyWarningSignals: [], oldPatternScripts: [] },
      ifThenPlans: [], recoveryProtocol: {}, supportSystemPlan: {},
      identityMaintenance: { oldIdentityWarning: "", newIdentityReminder: "我可以更快回到轨道", minimumEvidenceAction: "做一个5分钟任务", repairStatement: "" },
      practiceMaintenancePlan: { minimumDailyPractice: "每天5分钟任务", weeklyReviewQuestions: [], fallbackWhenLowEnergy: "写一句我注意到了信号" },
      relapseReviewTemplate: { whatHappened: "", whatTriggeredIt: "", whatOldPatternAppeared: "", whatHelpedEvenALittle: "", whatToTryNextTime: "" },
    });
    const tasks = maintenancePracticeTasks(core, { userId: "u", sessionId: "s", sourceId: "r1" });
    expect(tasks).toHaveLength(2);
    expect(tasks.every((t) => t.sourceType === "relapse-prevention")).toBe(true);
  });
});
