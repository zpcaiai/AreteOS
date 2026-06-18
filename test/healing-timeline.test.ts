import { describe, it, expect } from "vitest";
import { computeProgressMetrics, overallDirection, riskTrend, detectStuckPoints, normalizeTimelineEvents, type HealingEventLite } from "../src/lib/healing/timeline-logic";

const ev = (module: string, type: string, payload: Record<string, unknown> = {}, day = 1): HealingEventLite => ({ module, type, occurredAt: `2026-06-0${day}T00:00:00.000Z`, payload });

describe("risk trend", () => {
  it("falling risk over time → improving", () => {
    expect(riskTrend([ev("safety", "SafetyTriaged", { riskLevel: "orange" }, 1), ev("safety", "SafetyTriaged", { riskLevel: "green" }, 5)])).toBe("improving");
  });
  it("rising risk → declining", () => {
    expect(riskTrend([ev("safety", "SafetyTriaged", { riskLevel: "green" }, 1), ev("safety", "SafetyTriaged", { riskLevel: "orange" }, 5)])).toBe("declining");
  });
  it("single point → insufficient", () => {
    expect(riskTrend([ev("safety", "SafetyTriaged", { riskLevel: "green" })])).toBe("insufficient");
  });
});

describe("progress metrics + direction", () => {
  const events = [
    ev("intake", "MentalStateAssessed"), ev("dilts", "FormulationCreated"), ev("cbt", "CBTSessionCompleted"),
    ev("exposure-attempt", "ExposureAttemptCompleted"), ev("exposure-attempt", "ExposureAttemptCompleted"),
    ev("identity-evidence", "IdentityEvidenceLogged"),
    ev("safety", "SafetyTriaged", { riskLevel: "yellow" }, 1), ev("safety", "SafetyTriaged", { riskLevel: "green" }, 6),
  ];
  it("computes completion rate, exposure + identity counts", () => {
    const m = computeProgressMetrics(events, { total: 7, completed: 5 });
    expect(m.practiceCompletionRate).toBeCloseTo(5 / 7);
    expect(m.exposureCompletionCount).toBe(2);
    expect(m.identityEvidenceCount).toBe(1);
    expect(m.riskTrend).toBe("improving");
  });
  it("good completion + evidence + non-declining risk → improving", () => {
    const m = computeProgressMetrics(events, { total: 7, completed: 5 });
    expect(overallDirection(events, m)).toBe("improving");
  });
  it("a recent red → declining regardless of practice", () => {
    const withRed = [...events, ev("safety", "SafetyTriaged", { riskLevel: "red" }, 7)];
    const m = computeProgressMetrics(withRed, { total: 7, completed: 7 });
    expect(overallDirection(withRed, m)).toBe("declining");
  });
  it("no data → insufficient_data", () => {
    expect(overallDirection([], computeProgressMetrics([], { total: 0, completed: 0 }))).toBe("insufficient_data");
  });
});

describe("stuck points + event normalization", () => {
  it("practice created but none completed → stuck point", () => {
    const m = computeProgressMetrics([], { total: 4, completed: 0 });
    expect(detectStuckPoints([], m).some((s) => s.recommendedSkill === "cbt")).toBe(true);
  });
  it("orange safety event normalizes to a relapse_signal", () => {
    const norm = normalizeTimelineEvents([ev("safety", "SafetyTriaged", { riskLevel: "orange" })]);
    expect(norm[0].eventType).toBe("relapse_signal");
  });
});
