import { describe, it, expect } from "vitest";
import { classifyTraumaArousal, classifyOrientation, stabilizationPriority, selectStabilizationProtocol, blockedStabilizationSkills } from "../src/lib/healing/stabilization-logic";
import type { TraumaStabilizationInput } from "../src/lib/domain/trauma-stabilization";

const base: TraumaStabilizationInput = { userId: "u", sessionId: "s", currentExperience: "", safetyContext: { riskLevel: "orange" } };

describe("trauma arousal + protocol", () => {
  it("panic/flashback symptoms → hyperarousal", () => {
    expect(classifyTraumaArousal({ ...base, symptoms: { panic: true, flashback: true } })).toBe("hyperarousal");
  });
  it("numbness/shutdown → hypoarousal", () => {
    expect(classifyTraumaArousal({ ...base, symptoms: { numbness: true } })).toBe("hypoarousal");
  });
  it("flashback → orienting priority + flashback protocol", () => {
    const input = { ...base, symptoms: { flashback: true } };
    const arousal = classifyTraumaArousal(input);
    expect(stabilizationPriority(arousal, input)).toBe("orienting");
    expect(selectStabilizationProtocol(input, arousal)).toBe("flashback_protocol");
  });
  it("dissociation → body activation protocol", () => {
    const input = { ...base, symptoms: { dissociation: true } };
    expect(selectStabilizationProtocol(input, classifyTraumaArousal(input))).toBe("body_activation");
  });
});

describe("orientation", () => {
  it("knows date+location, feels present → oriented", () => {
    expect(classifyOrientation({ ...base, orientation: { knowsCurrentDate: true, knowsCurrentLocation: true, feelsPresent: true } })).toBe("oriented");
  });
  it("mostly unknown → disoriented", () => {
    expect(classifyOrientation({ ...base, orientation: { knowsCurrentDate: false, knowsCurrentLocation: false } })).toBe("disoriented");
  });
});

describe("deep work is always blocked during stabilization", () => {
  it("blocks exposure, deep trauma processing, identity deep dive, memory regression", () => {
    const blocked = blockedStabilizationSkills();
    for (const s of ["deep-trauma-processing", "exposure", "identity-deep-dive", "memory-regression", "intensive-core-belief"]) {
      expect(blocked).toContain(s);
    }
  });
});
