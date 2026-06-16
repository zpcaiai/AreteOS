import { describe, expect, it } from "vitest";
import { BOTTLENECKS, diagnose, SIGNAL_RULES } from "../src/lib/bottleneck-rules";

describe("bottleneck rule engine", () => {
  it("defines 16 bottleneck types and a signal rule map", () => {
    expect(BOTTLENECKS).toHaveLength(16);
    expect(SIGNAL_RULES.length).toBeGreaterThanOrEqual(14);
  });
  it("maps 'consume but no output' to asset/shadow/focus", () => {
    const r = diagnose(["consumesNoOutput"]);
    expect(r.map((x) => x.key).sort()).toEqual(["asset", "focus", "shadow"]);
  });
  it("ranks mission first when goals change and the why is unclear", () => {
    const r = diagnose(["changesGoalsOften", "unclearWhy"]);
    expect(r[0].key).toBe("mission");
    expect(r[0].score).toBe(2);
  });
  it("returns nothing for no signals", () => {
    expect(diagnose([])).toEqual([]);
  });
});
