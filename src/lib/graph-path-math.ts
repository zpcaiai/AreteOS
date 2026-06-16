// Graph-native primitives for the mental-model latticework. Pure algorithms over
// a node/edge list (no DB, no Neo4j) so the "moat" features — shortest learning
// path, emergent (predicted) connections, central models — work Postgres-first
// and are fully unit-testable. Edges are treated as undirected for the lattice.

export interface GraphEdge {
  from: string;
  to: string;
}

export function buildAdjacency(nodeIds: string[], edges: GraphEdge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  for (const id of nodeIds) adj.set(id, new Set());
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, new Set());
    if (!adj.has(e.to)) adj.set(e.to, new Set());
    if (e.from === e.to) continue;
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }
  return adj;
}

/** BFS shortest path (fewest hops). Returns the node-id path, or null if none. */
export function shortestPath(nodeIds: string[], edges: GraphEdge[], from: string, to: string): string[] | null {
  const adj = buildAdjacency(nodeIds, edges);
  if (!adj.has(from) || !adj.has(to)) return null;
  if (from === to) return [from];
  const prev = new Map<string, string>();
  const seen = new Set<string>([from]);
  const queue: string[] = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nxt of adj.get(cur) ?? []) {
      if (seen.has(nxt)) continue;
      seen.add(nxt);
      prev.set(nxt, cur);
      if (nxt === to) {
        const path = [to];
        let p = to;
        while (prev.has(p)) { p = prev.get(p)!; path.push(p); }
        return path.reverse();
      }
      queue.push(nxt);
    }
  }
  return null;
}

export function connectedComponents(nodeIds: string[], edges: GraphEdge[]): string[][] {
  const adj = buildAdjacency(nodeIds, edges);
  const seen = new Set<string>();
  const comps: string[][] = [];
  for (const id of nodeIds) {
    if (seen.has(id)) continue;
    const comp: string[] = [];
    const stack = [id];
    seen.add(id);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const nxt of adj.get(cur) ?? []) if (!seen.has(nxt)) { seen.add(nxt); stack.push(nxt); }
    }
    comps.push(comp.sort());
  }
  return comps;
}

export interface EmergentLink {
  a: string;
  b: string;
  score: number; // # of shared neighbors (common-neighbors link prediction)
  via: string[];
}

/** Predict latent latticework links: non-adjacent pairs with shared neighbors. */
export function emergentConnections(nodeIds: string[], edges: GraphEdge[], k = 10): EmergentLink[] {
  const adj = buildAdjacency(nodeIds, edges);
  const ids = [...adj.keys()].sort();
  const out: EmergentLink[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const a = ids[i];
      const b = ids[j];
      const na = adj.get(a)!;
      if (na.has(b)) continue; // already connected
      const nb = adj.get(b)!;
      const via: string[] = [];
      for (const x of na) if (nb.has(x)) via.push(x);
      if (via.length > 0) out.push({ a, b, score: via.length, via: via.sort() });
    }
  }
  out.sort((x, y) => y.score - x.score || (x.a + x.b).localeCompare(y.a + y.b));
  return out.slice(0, k);
}

export interface Centrality {
  id: string;
  degree: number;
}

export function degreeCentrality(nodeIds: string[], edges: GraphEdge[]): Centrality[] {
  const adj = buildAdjacency(nodeIds, edges);
  return [...adj.entries()]
    .map(([id, set]) => ({ id, degree: set.size }))
    .sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
}
