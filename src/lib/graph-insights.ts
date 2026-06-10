// Knowledge-graph insights. When Neo4j is configured these run as graph
// traversals; otherwise they fall back to equivalent PostgreSQL queries, so the
// feature works everywhere and gets faster/deeper with the graph enabled.

import { prisma } from "./db";
import { graphEnabled, readCypher } from "./neo4j";
import { reportError } from "./logger";

export interface ModelRecommendation {
  name: string;
  category: string;
  reason: string;
  /** Models the user already uses that connect to this one. */
  via: string[];
}

export interface LatticeworkGap {
  category: string;
  count: number;
  suggestion: string;
}

export interface IdentityTension {
  a: string;
  b: string;
  context: string;
  resolved: boolean;
}

export interface GraphInsights {
  source: "neo4j" | "postgres";
  recommendations: ModelRecommendation[];
  gaps: LatticeworkGap[];
  tensions: IdentityTension[];
}

const CATEGORY_SUGGESTIONS: Record<string, string> = {
  ECONOMICS: "Opportunity Cost, Incentives, Comparative Advantage",
  PSYCHOLOGY: "Social Proof, Commitment Bias, Reciprocity",
  SYSTEMS_THINKING: "Feedback Loops, Bottlenecks, Second-Order Effects",
  PROBABILITY: "Expected Value, Base Rates, Regression to the Mean",
  PHYSICS: "Critical Mass, Leverage, Entropy",
  BIOLOGY: "Natural Selection, Red Queen Effect, Ecosystems",
  STRATEGY: "Circle of Competence, Moats, Asymmetry",
};

/** Connected-but-unused mental models: the highest-value next reads in the latticework. */
async function recommendationsFromPostgres(userId: string): Promise<ModelRecommendation[]> {
  const models = await prisma.mentalModel.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      category: true,
      usageLogs: { select: { id: true }, take: 1 },
      connectionsFrom: { select: { relation: true, toModel: { select: { id: true, name: true, category: true } } } },
      connectionsTo: { select: { relation: true, fromModel: { select: { id: true, name: true, category: true } } } },
    },
  });

  const used = new Set(models.filter((m) => m.usageLogs.length > 0).map((m) => m.id));
  if (!used.size) return [];

  const candidates = new Map<string, ModelRecommendation & { id: string }>();
  for (const m of models) {
    if (!used.has(m.id)) continue;
    const neighbors = [
      ...m.connectionsFrom.map((c) => ({ node: c.toModel, relation: c.relation })),
      ...m.connectionsTo.map((c) => ({ node: c.fromModel, relation: c.relation })),
    ];
    for (const { node, relation } of neighbors) {
      if (used.has(node.id)) continue;
      const existing = candidates.get(node.id) ?? {
        id: node.id,
        name: node.name,
        category: node.category,
        via: [],
        reason: relation === "contradicts" ? "Creates productive tension with a model you rely on" : "Connects to models you already apply",
      };
      if (!existing.via.includes(m.name)) existing.via.push(m.name);
      candidates.set(node.id, existing);
    }
  }
  return [...candidates.values()]
    .sort((a, b) => b.via.length - a.via.length)
    .slice(0, 6)
    .map(({ id: _id, ...rest }) => rest);
}

async function recommendationsFromNeo4j(userId: string): Promise<ModelRecommendation[] | null> {
  const rows = await readCypher<{ name: string; category: string; via: string[] }>(
    `MATCH (u:User {id:$userId})-[:KNOWS]->(known:MentalModel)-[:CONNECTS_TO]-(rec:MentalModel)
     WHERE NOT (u)-[:KNOWS]->(rec)
     WITH rec, collect(DISTINCT known.name)[..4] AS via
     RETURN rec.name AS name, coalesce(rec.category,'GENERAL') AS category, via
     ORDER BY size(via) DESC LIMIT 6`,
    { userId },
  );
  if (!rows) return null;
  return rows.map((r) => ({ ...r, reason: "Adjacent in your knowledge graph" }));
}

/** Categories where the latticework is thin (Munger: you need models from many disciplines). */
async function latticeworkGaps(userId: string): Promise<LatticeworkGap[]> {
  const counts = await prisma.mentalModel.groupBy({ by: ["category"], where: { userId }, _count: { _all: true } });
  const have = new Map(counts.map((c) => [c.category as string, c._count._all]));
  return Object.entries(CATEGORY_SUGGESTIONS)
    .map(([category, suggestion]) => ({ category, count: have.get(category) ?? 0, suggestion }))
    .filter((g) => g.count < 2)
    .slice(0, 5);
}

/** Unresolved value conflicts — the identity-level tensions worth resolving first. */
async function identityTensions(userId: string): Promise<IdentityTension[]> {
  const conflicts = await prisma.valueConflict.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  if (!conflicts.length) return [];
  const valueIds = [...new Set(conflicts.flatMap((c) => [c.valueAId, c.valueBId]))];
  const values = await prisma.value.findMany({ where: { id: { in: valueIds } }, select: { id: true, name: true } });
  const nameOf = new Map(values.map((v) => [v.id, v.name]));
  return conflicts
    .map((c) => ({
      a: nameOf.get(c.valueAId) ?? "?",
      b: nameOf.get(c.valueBId) ?? "?",
      context: c.context.slice(0, 160),
      resolved: c.resolution.length > 0,
    }))
    .filter((t) => !t.resolved)
    .slice(0, 5);
}

export async function computeGraphInsights(userId: string): Promise<GraphInsights> {
  let source: GraphInsights["source"] = "postgres";
  let recommendations: ModelRecommendation[] = [];

  if (graphEnabled()) {
    try {
      const fromGraph = await recommendationsFromNeo4j(userId);
      if (fromGraph) {
        recommendations = fromGraph;
        source = "neo4j";
      }
    } catch (e) {
      reportError(e, { surface: "graph-insights-neo4j" });
    }
  }
  if (!recommendations.length) recommendations = await recommendationsFromPostgres(userId);

  const [gaps, tensions] = await Promise.all([latticeworkGaps(userId), identityTensions(userId)]);
  return { source, recommendations, gaps, tensions };
}
