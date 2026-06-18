import { describe, it, expect } from "vitest";
import {
  keywordPreScreen,
  applyRiskOverrides,
  conservativeFallback,
  composeTriage,
  derivePolicy,
} from "../src/lib/healing/safety-rules";
import { DEEP_SKILLS_BLOCKED_ON_RISK, type SafetyClassification } from "../src/lib/domain/risk";

const cls = (over: Partial<SafetyClassification> = {}): SafetyClassification => ({
  riskLevel: "green",
  riskDomains: ["none"],
  confidence: 0.8,
  detectedSignals: [],
  ...over,
});

describe("keyword pre-screen (bilingual)", () => {
  it("flags suicidal intent + plan in Chinese", () => {
    const raw = keywordPreScreen("我今晚准备吃很多药结束这一切。");
    expect(raw.some((r) => r.domain === "suicide" && r.kind === "intent")).toBe(true);
    expect(raw.some((r) => r.kind === "plan" || r.domain === "medical_emergency")).toBe(true);
  });
  it("flags suicidal intent + plan in English", () => {
    const raw = keywordPreScreen("I have a plan to end my life tonight with pills.");
    expect(raw.some((r) => r.domain === "suicide" && r.kind === "intent")).toBe(true);
    expect(raw.some((r) => r.kind === "plan")).toBe(true);
  });
  it("ordinary stress produces no high-risk signals", () => {
    expect(keywordPreScreen("我今天有点焦虑，工作很多。")).toHaveLength(0);
  });
});

describe("rule-based overrides are escalate-only", () => {
  it("suicide intent + plan → red, even if model said green", () => {
    const raw = keywordPreScreen("我想死，今晚就跳楼。");
    const { level, forcedDomains, overridden } = applyRiskOverrides("green", raw);
    expect(level).toBe("red");
    expect(forcedDomains).toContain("suicide");
    expect(overridden).toBe(true);
  });
  it("active self-harm → red", () => {
    const raw = keywordPreScreen("I'm cutting myself right now.");
    expect(applyRiskOverrides("yellow", raw).level).toBe("red");
  });
  it("harm-to-others intent → red", () => {
    const raw = keywordPreScreen("我想杀了他，让他们付出代价。");
    expect(applyRiskOverrides("green", raw).level).toBe("red");
  });
  it("psychosis with danger → red", () => {
    const raw = keywordPreScreen("有人监控我，声音让我去做一些事。");
    expect(applyRiskOverrides("green", raw).level).toBe("red");
  });
  it("passive suicidal ideation (no plan) → at least orange", () => {
    const raw = keywordPreScreen("我有时候真的不想活了，但我不会做什么，只是很累。");
    expect(applyRiskOverrides("green", raw).level).toBe("orange");
  });
  it("never DE-escalates a high model level", () => {
    // model says red, no keywords → stays red
    expect(applyRiskOverrides("red", []).level).toBe("red");
  });
});

describe("conservative fallback (invalid model output)", () => {
  it("falls back to orange when danger keywords present, never green", () => {
    const { classification } = conservativeFallback("我想死，今晚就结束。");
    expect(classification.riskLevel).toBe("orange"); // overrides then push to red downstream
    expect(classification.confidence).toBeLessThan(0.5);
  });
  it("falls back to yellow (not green) when no signals", () => {
    expect(conservativeFallback("随便说点什么").classification.riskLevel).toBe("yellow");
  });
});

describe("composeTriage end-to-end (pure)", () => {
  it("GREEN ordinary stress → continue normal flow, nothing blocked", () => {
    const { output } = composeTriage(cls(), keywordPreScreen("我今天有点焦虑，工作很多。"));
    expect(output.riskLevel).toBe("green");
    expect(output.recommendedRoute).toBe("continue_normal_flow");
    expect(output.blockedSkills).toHaveLength(0);
    expect(output.safetyPlan).toBeUndefined();
  });

  it("YELLOW emotional distress → supportive, no deep-skill block", () => {
    const { output } = composeTriage(
      cls({ riskLevel: "yellow", riskDomains: ["none"] }),
      keywordPreScreen("我最近很痛苦，睡不好，觉得自己很失败。"),
    );
    expect(output.riskLevel).toBe("yellow");
    expect(output.recommendedRoute).toBe("use_supportive_response");
    expect(output.blockedSkills).toHaveLength(0);
  });

  it("ORANGE passive ideation → stabilization, blocks deep skills, has safety plan", () => {
    const { output } = composeTriage(
      cls({ riskLevel: "yellow" }),
      keywordPreScreen("我有时候真的不想活了，但我不会做什么，只是很累。"),
    );
    expect(output.riskLevel).toBe("orange");
    expect(output.recommendedRoute).toBe("use_stabilization_protocol");
    for (const s of DEEP_SKILLS_BLOCKED_ON_RISK) expect(output.blockedSkills).toContain(s);
    expect(output.safetyPlan?.groundingExercise).toBeTruthy();
  });

  it("RED suicidal intent with plan → urgent crisis, dilts & identity blocked", () => {
    const { output, overridden } = composeTriage(
      cls({ riskLevel: "green" }), // model under-rates; rules must catch it
      keywordPreScreen("我今晚准备吃很多药结束这一切。"),
    );
    expect(output.riskLevel).toBe("red");
    expect(overridden).toBe(true);
    expect(output.recommendedRoute).toBe("urgent_crisis_response");
    expect(output.blockedSkills).toContain("dilts-map");
    expect(output.blockedSkills).toContain("identity-reconstruction");
    expect(output.safetyPlan?.professionalHelpRecommendation).toBeTruthy();
    expect(output.riskDomains).toContain("suicide");
  });

  it("RED harm-to-others → urgent crisis", () => {
    const { output } = composeTriage(cls(), keywordPreScreen("I'm going to hurt them, make them pay."));
    expect(output.riskLevel).toBe("red");
    expect(output.riskDomains).toContain("harm_to_others");
  });

  it("model's supportive message is used for green/yellow but never for red", () => {
    const green = composeTriage(cls(), [], { supportiveMessage: "MODEL LINE" });
    expect(green.output.userFacingMessage).toBe("MODEL LINE");
    const red = composeTriage(cls(), keywordPreScreen("我想死，今晚就跳楼。"), { supportiveMessage: "MODEL LINE" });
    expect(red.output.userFacingMessage).not.toContain("MODEL LINE");
  });
});

describe("policy locale", () => {
  it("emits Chinese crisis copy for zh locale and English for en", () => {
    const zh = derivePolicy({ level: "red", domains: ["suicide"], locale: "zh-CN" });
    const en = derivePolicy({ level: "red", domains: ["suicide"], locale: "en-US" });
    expect(zh.safetyPlan?.immediateSteps.join("")).toMatch(/[一-鿿]/);
    expect(en.safetyPlan?.immediateSteps.join("")).toMatch(/breath/i);
  });
});
