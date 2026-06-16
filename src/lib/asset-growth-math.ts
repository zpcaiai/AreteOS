// Asset-Based Growth — pure pipeline + scoring. Growth is measured by durable,
// compounding outputs, not activity. No I/O imports; unit-testable.

import { clamp01, geoMean01, mean01, round1 } from "./skills-scoring";

export const ASSET_STAGES = ["idea", "clarified", "planned", "draft", "built", "published", "feedback", "improved", "repurposed", "compounding"] as const;
export type AssetStage = (typeof ASSET_STAGES)[number];

export const ASSET_TYPES = ["knowledge", "code", "product", "media", "brand", "community", "decision", "learning", "business", "ai"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export function stageIndex(stage: AssetStage): number {
  const i = ASSET_STAGES.indexOf(stage);
  return i < 0 ? 0 : i;
}

/** 0..1 progress through the pipeline. */
export function pipelineProgress(stage: AssetStage): number {
  return stageIndex(stage) / (ASSET_STAGES.length - 1);
}

export interface CompoundingFactors {
  durability: number;
  reusability: number;
  distribution: number;
  feedback: number;
  improvementRate: number;
}

export function assetCompoundingScore(f: CompoundingFactors): number {
  return round1(geoMean01([f.durability, f.reusability, f.distribution, f.feedback, f.improvementRate]) * 100);
}

/** Portfolio score 0..100: how far the portfolio's assets have advanced. */
export function portfolioScore(assets: { stage: AssetStage }[]): number {
  if (assets.length === 0) return 0;
  return round1(mean01(assets.map((a) => pipelineProgress(a.stage))) * 100);
}

export function publishedCount(assets: { stage: AssetStage }[]): number {
  const published = new Set<AssetStage>(["published", "feedback", "improved", "repurposed", "compounding"]);
  return assets.filter((a) => published.has(a.stage)).length;
}

export const clamp = clamp01;
