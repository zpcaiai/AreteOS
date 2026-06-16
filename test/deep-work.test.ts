import { describe, expect, it } from "vitest";
import { deepWorkDashboard, distractionRate, sessionFocusDepth, sessionScore, type SessionTelemetry } from "../src/lib/deep-work-math";

const clean: SessionTelemetry = { durationMin: 90, distractions: 0, difficulty: 0.8, outputQuality: 0.8, at: Date.now() };
const noisy: SessionTelemetry = { durationMin: 90, distractions: 15, difficulty: 0.8, outputQuality: 0.8, at: Date.now() };

describe("deep work math", () => {
  it("normalizes distraction rate", () => {
    expect(distractionRate(60, 0)).toBe(0);
    expect(distractionRate(60, 10)).toBeCloseTo(1, 9);
  });
  it("penalizes distractions in focus depth and session score", () => {
    expect(sessionFocusDepth(clean)).toBeGreaterThan(sessionFocusDepth(noisy));
    expect(sessionScore(clean)).toBeGreaterThan(sessionScore(noisy));
  });
  it("builds a 28-day dashboard with heatmap and bounded global", () => {
    const now = Date.UTC(2026, 5, 15);
    const d = deepWorkDashboard([{ ...clean, at: now }, { durationMin: 60, distractions: 0, difficulty: 0.7, outputQuality: 0.9, at: now - 86_400_000 }], 28, now);
    expect(d.totalSessions).toBe(2);
    expect(d.totalMinutes).toBe(150);
    expect(d.heatmap).toHaveLength(28);
    expect(d.heatmap[d.heatmap.length - 1].minutes).toBe(90);
    expect(d.global).toBeGreaterThan(0);
    expect(deepWorkDashboard([], 28, now).global).toBe(0);
  });
});
