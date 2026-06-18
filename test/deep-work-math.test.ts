import { describe, it, expect } from "vitest";
import { distractionRate, sessionFocusDepth, sessionScore, deepWorkDashboard, weeklySummary, type SessionTelemetry } from "../src/lib/deep-work-math";

const session = (over: Partial<SessionTelemetry> = {}): SessionTelemetry =>
  ({ durationMin: 60, distractions: 0, difficulty: 0.8, outputQuality: 0.8, at: Date.now(), ...over });

describe("deep-work math", () => {
  it("distraction rate: none → 0, 10/hr → 1 (clamped), 5/hr → 0.5", () => {
    expect(distractionRate(60, 0)).toBe(0);
    expect(distractionRate(60, 10)).toBe(1);
    expect(distractionRate(60, 5)).toBeCloseTo(0.5);
  });
  it("focus depth peaks for hard, distraction-free work", () => {
    expect(sessionFocusDepth(session({ difficulty: 1, distractions: 0 }))).toBe(1);
    expect(sessionFocusDepth(session({ difficulty: 1, distractions: 10 }))).toBeLessThan(1);
  });
  it("session score is within 0..100", () => {
    const s = sessionScore(session());
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(100);
  });
  it("empty dashboard: zeros + full heatmap window", () => {
    const d = deepWorkDashboard([], 28);
    expect(d.totalSessions).toBe(0);
    expect(d.global).toBe(0);
    expect(d.heatmap).toHaveLength(28);
  });
  it("dashboard aggregates sessions (minutes, count, positive global)", () => {
    const now = Date.now();
    const d = deepWorkDashboard([session({ at: now }), session({ at: now - 86_400_000 })], 28, now);
    expect(d.totalSessions).toBe(2);
    expect(d.totalMinutes).toBe(120);
    expect(d.global).toBeGreaterThan(0);
  });
  it("weeklySummary returns N weeks", () => {
    expect(weeklySummary([], 4)).toHaveLength(4);
  });
});
