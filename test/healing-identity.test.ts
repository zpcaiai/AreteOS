import { describe, it, expect } from "vitest";
import { resolveIdentityMode, recommendIdentityNextSkills, identityPracticeTask, evidencePlaceholders } from "../src/lib/healing/identity-logic";
import { IdentityReconstructionCoreSchema } from "../src/lib/domain/identity-rebuild";

const core = IdentityReconstructionCoreSchema.parse({
  identityMap: {
    oldIdentityNarratives: [],
    transitionIdentities: [{ oldNarrative: "失败者", transitionIdentity: "正在恢复的人", whyThisIsBelievable: "", whatItAllowsUserToDo: "" }],
    newIdentitySeeds: [{ identitySeed: "可以积累能力的人", groundedEvidence: ["完成3次练习"], requiredPractices: ["每天小任务"], riskOfOverstatement: "" }],
  },
  missionRecovery: {},
  dailyEvidencePlan: {
    identityStatement: "我是一个可以通过小行动积累能力的人",
    sevenDayEvidenceActions: [
      { day: 1, action: "完成一个20分钟任务", evidenceQuestion: "?", difficulty: "easy" },
      { day: 2, action: "温和说一次不", evidenceQuestion: "?", difficulty: "medium" },
    ],
    minimumViableAction: "记录一个小进展",
    fallbackAction: "写一句我照顾了自己",
  },
  identityPracticeTask: { title: "身份证据", description: "", steps: [], completionMetric: "" },
  integrationSummary: "s",
});

describe("identity mode + routing", () => {
  it("orange → light_identity_stabilization", () => {
    expect(resolveIdentityMode("identity_mapping", "orange")).toBe("light_identity_stabilization");
  });
  it("green routes to timeline + relapse-prevention; seeds with practices → exposure", () => {
    const next = recommendIdentityNextSkills(core, "green");
    expect(next).toContain("timeline-progress");
    expect(next).toContain("relapse-prevention");
    expect(next).toContain("exposure");
  });
});

describe("identity → practice + evidence seeding", () => {
  it("builds an identity practice task that falls back to the 7-day actions", () => {
    const task = identityPracticeTask(core, { userId: "u", sessionId: "s", sourceId: "i1" });
    expect(task.sourceType).toBe("identity");
    expect(task.steps.some((s) => s.includes("Day 1"))).toBe(true);
  });
  it("seeds one IdentityEvidence row per planned day, carrying the statement", () => {
    const rows = evidencePlaceholders(core, { userId: "u", sessionId: "s", sourceId: "i1" });
    expect(rows).toHaveLength(2);
    expect(rows[0].identityStatement).toBe("我是一个可以通过小行动积累能力的人");
    expect(rows[0].identitySessionId).toBe("i1");
  });
});
