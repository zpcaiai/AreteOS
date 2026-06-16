import { describe, expect, it } from "vitest";
import { nextStage, PROTOCOL_STAGES, protocolProgress, scoreProtocol } from "../src/lib/protocol-scoring";

describe("protocol scoring", () => {
  it("has 7 stages", () => expect(PROTOCOL_STAGES).toHaveLength(7));
  it("scores ~80 when every stage is 0.8", () => {
    const full = Object.fromEntries(PROTOCOL_STAGES.map((s) => [s, 0.8]));
    expect(scoreProtocol(full)).toBeCloseTo(80, 0);
  });
  it("tanks an incomplete loop (geometric mean)", () => {
    expect(scoreProtocol({ observe: 0.9 })).toBeLessThan(20);
  });
  it("tracks progress and next stage", () => {
    expect(protocolProgress(["observe", "diagnose"])).toBe(Math.round((2 / 7) * 100));
    expect(nextStage(["observe"])).toBe("diagnose");
    expect(nextStage([...PROTOCOL_STAGES])).toBeNull();
  });
});
