// Cross-engine "mission control": aggregate the latest state of every engine in
// the growth loop into one overview. Composes existing services; no new tables.

import { latestBottleneck } from "./bottleneck";
import { listPrescriptions } from "./prescription";
import { listAssets } from "./asset-growth";
import { balanceSheet, capitalHistory } from "./capital-ledger";
import { treeProgress } from "./identity-tree";
import { getDashboard } from "./deep-work";
import { listRuns } from "./growth-protocol";
import { latestSpecificKnowledge, specificKnowledgeHistory } from "./specific-knowledge";
import type { Bi } from "./bottleneck-rules";
import { cached } from "./cache";
import { readProjection, writeProjection } from "./projections";

export interface JourneyOverview {
  bottleneck: string | null;
  prescriptions: { count: number; latest: string | null };
  assets: { portfolio: number; published: number; count: number };
  capital: { global: number; weakest: string; spark: number[] };
  identity: { unlocked: number; total: number; active: { name: Bi } | null };
  deepWork: { global: number; minutes: number; sessions: number; spark: number[] };
  protocol: { runs: number; topScore: number; spark: number[] };
  specificKnowledge: { moat: number | null; score: number | null; spark: number[] };
}

async function computeJourneyOverview(userId: string): Promise<JourneyOverview> {
  const [bnR, rxR, assets, capital, tree, dw, runs, skR, skHist, capHist] = await Promise.all([
    latestBottleneck(userId),
    listPrescriptions(userId, 5),
    listAssets(userId),
    balanceSheet(userId),
    treeProgress(userId),
    getDashboard(userId),
    listRuns(userId),
    latestSpecificKnowledge(userId),
    specificKnowledgeHistory(userId),
    capitalHistory(userId),
  ]);
  const bn = bnR as { primary?: string } | null;
  const rx = rxR as { title?: string }[];
  const sk = skR as { moat?: number; score?: number } | null;
  const activeNode = tree.find((n) => n.progress > 0 && !n.unlocked) ?? tree.find((n) => !n.unlocked) ?? null;

  return {
    bottleneck: bn?.primary ?? null,
    prescriptions: { count: rx.length, latest: rx[0]?.title ?? null },
    assets: { portfolio: assets.portfolio, published: assets.published, count: assets.assets.length },
    capital: { global: capital.global, weakest: capital.weakest, spark: capHist },
    identity: { unlocked: tree.filter((n) => n.unlocked).length, total: tree.length, active: activeNode ? { name: activeNode.name } : null },
    deepWork: { global: dw.global, minutes: dw.totalMinutes, sessions: dw.totalSessions, spark: dw.heatmap.map((h) => h.score) },
    protocol: { runs: runs.length, topScore: runs.length ? Math.max(...runs.map((r) => r.score)) : 0, spark: [...runs].reverse().map((r) => r.score) },
    specificKnowledge: { moat: sk?.moat ?? null, score: sk?.score ?? null, spark: skHist },
  };
}

/** Two-tier read: in-process cache (20s) → DB read-model projection (120s) →
 *  recompute + persist. Falls back to a plain recompute if the projection table
 *  has not been migrated yet, so it is safe before and after the migration. */
export function journeyOverview(userId: string): Promise<JourneyOverview> {
  return cached(`journey:${userId}`, 20_000, async () => {
    try {
      const proj = await readProjection<JourneyOverview>(userId, "journey", 120_000);
      if (proj) return proj;
    } catch { /* engine_projections not migrated yet — fall back to compute */ }
    const fresh = await computeJourneyOverview(userId);
    try { await writeProjection(userId, "journey", fresh); } catch { /* ignore */ }
    return fresh;
  });
}
