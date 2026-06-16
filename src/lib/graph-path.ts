// Knowledge-graph "moat" service. Runs graph-native queries over the user's
// mental-model latticework, Postgres-first (Neo4j optional elsewhere): the
// shortest learning path between two models, predicted (emergent) connections,
// and the most central models.

import { prisma } from "./db";
import { connectedComponents, degreeCentrality, emergentConnections, shortestPath, type EmergentLink, type GraphEdge } from "./graph-path-math";

interface LoadedGraph {
  nodeIds: string[];
  edges: GraphEdge[];
  nameById: Map<string, string>;
  idByLowerName: Map<string, string>;
}

async function loadLatticework(userId: string): Promise<LoadedGraph> {
  const [models, conns] = await Promise.all([
    prisma.mentalModel.findMany({ where: { userId }, select: { id: true, name: true } }),
    prisma.modelConnection.findMany({ where: { fromModel: { userId } }, select: { fromModelId: true, toModelId: true } }),
  ]);
  const nameById = new Map(models.map((m) => [m.id, m.name]));
  const idByLowerName = new Map(models.map((m) => [m.name.toLowerCase(), m.id]));
  return { nodeIds: models.map((m) => m.id), edges: conns.map((c) => ({ from: c.fromModelId, to: c.toModelId })), nameById, idByLowerName };
}

function resolve(g: LoadedGraph, ref: string): string | null {
  if (g.nameById.has(ref)) return ref;
  return g.idByLowerName.get(ref.toLowerCase()) ?? null;
}

function named(g: LoadedGraph, link: EmergentLink) {
  return {
    a: g.nameById.get(link.a) ?? link.a,
    b: g.nameById.get(link.b) ?? link.b,
    sharedModels: link.via.map((id) => g.nameById.get(id) ?? id),
    score: link.score,
  };
}

export interface GraphInsights {
  models: number;
  connections: number;
  path: { from: string; to: string; hops: number; steps: string[] } | null;
  emergent: { a: string; b: string; sharedModels: string[]; score: number }[];
  central: { name: string; degree: number }[];
  components: number;
}

export async function graphPathInsights(
  userId: string,
  opts: { from?: string; to?: string; limit?: number } = {},
): Promise<GraphInsights> {
  const g = await loadLatticework(userId);
  const limit = Math.min(Math.max(opts.limit ?? 8, 1), 50);

  let path: GraphInsights["path"] = null;
  if (opts.from && opts.to) {
    const fromId = resolve(g, opts.from);
    const toId = resolve(g, opts.to);
    if (fromId && toId) {
      const p = shortestPath(g.nodeIds, g.edges, fromId, toId);
      if (p) path = { from: g.nameById.get(fromId)!, to: g.nameById.get(toId)!, hops: p.length - 1, steps: p.map((id) => g.nameById.get(id) ?? id) };
    }
  }

  return {
    models: g.nodeIds.length,
    connections: g.edges.length,
    path,
    emergent: emergentConnections(g.nodeIds, g.edges, limit).map((l) => named(g, l)),
    central: degreeCentrality(g.nodeIds, g.edges).slice(0, limit).map((c) => ({ name: g.nameById.get(c.id) ?? c.id, degree: c.degree })),
    components: connectedComponents(g.nodeIds, g.edges).length,
  };
}
