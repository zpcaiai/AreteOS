import { describe, expect, it } from "vitest";
import { connectedComponents, degreeCentrality, emergentConnections, shortestPath, type GraphEdge } from "../src/lib/graph-path-math";

const nodes = ["A", "B", "C", "D", "E", "X"];
const edges: GraphEdge[] = [
  { from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "A", to: "C" },
];

describe("shortestPath", () => {
  it("finds the fewest-hop path", () => expect(shortestPath(nodes, edges, "A", "D")).toEqual(["A", "C", "D"]));
  it("returns null when disconnected", () => expect(shortestPath(nodes, edges, "A", "X")).toBeNull());
  it("returns a single node for self", () => expect(shortestPath(nodes, edges, "A", "A")).toEqual(["A"]));
});

describe("connectedComponents", () => {
  it("counts components", () => expect(connectedComponents(nodes, edges)).toHaveLength(3));
});

describe("emergentConnections", () => {
  it("predicts links from shared neighbors and excludes adjacent pairs", () => {
    const em = emergentConnections(nodes, edges, 10);
    expect(em.length).toBeGreaterThan(0);
    expect(em[0].via.length).toBe(em[0].score);
    expect(em.some((e) => e.a === "A" && e.b === "B")).toBe(false);
  });
});

describe("degreeCentrality", () => {
  it("ranks the hub first", () => {
    const cen = degreeCentrality(nodes, edges);
    expect(cen[0].id).toBe("C");
    expect(cen[0].degree).toBe(3);
  });
});
