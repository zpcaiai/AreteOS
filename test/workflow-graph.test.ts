import { describe, expect, it } from "vitest";
import { runGraph, decisionGraphWorkflow, type GraphWorkflow } from "../src/lib/ai/graph";

// Under AI_PROVIDER=mock every agent returns its example output, so graph
// execution is fully deterministic and offline.

describe("graph workflow runner", () => {
  it("runs the decision graph end-to-end offline", async () => {
    const { context, trace } = await runGraph(decisionGraphWorkflow, {
      title: "Accept the new role?",
      context: "Offer in hand",
      options: ["accept", "decline"],
    });
    expect(trace.length).toBeGreaterThanOrEqual(1);
    expect(trace[0].node).toBe("score");
    expect(context.decision).toBeDefined();
  });

  it("follows conditional edges and respects the step bound", async () => {
    const wf: GraphWorkflow = {
      name: "loop-test",
      description: "intentionally cyclic",
      entry: "a",
      nodes: {
        a: { agent: "ReflectionGuide", as: "r", input: () => ({ worked: "x", failed: "y", learned: "z", wrongAssumptions: "" }), next: () => "a" },
      },
    };
    const { trace } = await runGraph(wf, {});
    expect(trace.length).toBeLessThanOrEqual(8); // MAX_GRAPH_STEPS guard
  });

  it("throws on unknown nodes", async () => {
    const wf: GraphWorkflow = {
      name: "broken",
      description: "bad edge",
      entry: "missing",
      nodes: {},
    };
    await expect(runGraph(wf, {})).rejects.toThrow(/unknown node/);
  });
});
