// Asset-Based Growth service: assets + stage changes are event-sourced; the
// pipeline + portfolio are projections.

import { prisma } from "./db";
import { emit } from "./events";
import { ASSET_STAGES, pipelineProgress, portfolioScore, publishedCount, type AssetStage } from "./asset-growth-math";
import { AssetBuildPlanner } from "./agents/asset-growth";

const NS = "Asset";

export async function createAsset(userId: string, input: { name: string; type: string }): Promise<{ id: string }> {
  const id = globalThis.crypto?.randomUUID?.() ?? `as_${Date.now()}`;
  await emit({ userId, aggregateType: NS, aggregateId: id, type: "AssetCreated", payload: { name: input.name, type: input.type, stage: "idea" } });
  return { id };
}

export async function advanceAsset(userId: string, assetId: string, stage: AssetStage): Promise<{ ok: true }> {
  await emit({ userId, aggregateType: NS, aggregateId: assetId, type: "AssetStageChanged", payload: { stage } });
  return { ok: true };
}

export async function planAsset(name: string, type: string, context: string) {
  return AssetBuildPlanner.run({ name, type, context });
}

export interface AssetView { id: string; name: string; type: string; stage: AssetStage; progress: number; createdAt: number }

export async function listAssets(userId: string): Promise<{ assets: AssetView[]; portfolio: number; published: number }> {
  const rows = await prisma.domainEvent.findMany({ where: { userId, aggregateType: NS }, orderBy: { occurredAt: "asc" }, select: { aggregateId: true, type: true, payload: true, occurredAt: true } });
  const map = new Map<string, AssetView>();
  for (const r of rows) {
    const p = (r.payload ?? {}) as Record<string, unknown>;
    if (r.type === "AssetCreated") {
      map.set(r.aggregateId, { id: r.aggregateId, name: String(p.name ?? ""), type: String(p.type ?? ""), stage: "idea", progress: 0, createdAt: r.occurredAt.getTime() });
    } else if (r.type === "AssetStageChanged") {
      const a = map.get(r.aggregateId);
      const stage = String(p.stage) as AssetStage;
      if (a && (ASSET_STAGES as readonly string[]).includes(stage)) a.stage = stage;
    }
  }
  const assets = [...map.values()].map((a) => ({ ...a, progress: Math.round(pipelineProgress(a.stage) * 100) })).sort((a, b) => b.createdAt - a.createdAt);
  return { assets, portfolio: portfolioScore(assets), published: publishedCount(assets) };
}
