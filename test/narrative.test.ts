import { describe, expect, it } from "vitest";
import { activitySummary, assembleNarrativeSignals, detectTurningPoints, summarizeTrajectory } from "../src/lib/narrative-math";

const P = (value: number, at: number) => ({ at, value });

describe("summarizeTrajectory", () => {
  it("detects rising momentum and net change", () => {
    const t = summarizeTrajectory([P(0.4, 1), P(0.45, 2), P(0.5, 3), P(0.6, 4), P(0.7, 5)]);
    expect(t.momentum).toBe("rising");
    expect(t.change).toBeCloseTo(0.3, 9);
    expect(t.peak.value).toBe(0.7);
    expect(t.trough.value).toBe(0.4);
  });
  it("detects falling and handles empty", () => {
    expect(summarizeTrajectory([P(0.8, 1), P(0.7, 2), P(0.6, 3)]).momentum).toBe("falling");
    expect(summarizeTrajectory([]).momentum).toBe("flat");
  });
});

describe("detectTurningPoints", () => {
  it("flags deltas at/above the threshold with direction", () => {
    const tp = detectTurningPoints([P(0.4, 1), P(0.41, 2), P(0.5, 3), P(0.42, 4)], 0.05);
    expect(tp).toHaveLength(2);
    expect(tp[0].direction).toBe("up");
    expect(tp[1].direction).toBe("down");
  });
});

describe("activitySummary", () => {
  it("counts events and finds the top engine", () => {
    const a = activitySummary([{ aggregateType: "Decision" }, { aggregateType: "Decision" }, { aggregateType: "Habit" }]);
    expect(a.total).toBe(3);
    expect(a.topEngine).toBe("Decision");
    expect(a.byAggregate.Habit).toBe(1);
  });
});

describe("assembleNarrativeSignals", () => {
  it("bundles trajectory, turning points, activity and transitions", () => {
    const sig = assembleNarrativeSignals({
      points: [P(0.4, 1), P(0.6, 2)],
      events: [{ aggregateType: "Decision" }],
      transitions: [{ fromStage: "BUILDER", toStage: "OPERATOR", at: 2 }],
    });
    expect(sig.trajectory.change).toBeCloseTo(0.2, 9);
    expect(sig.transitions).toHaveLength(1);
  });
});
