/* Persona tagging + profile aggregation — TS port of
   emotion-sphere/backend/persona_tag_engine.py. Auto-tags an analysis result
   and aggregates a user's tags into a profile (dominant category + top tags). */

export type TagCategory =
  | "driver" | "belief" | "narrative" | "state" | "distortion" | "value" | "general";

export interface PersonaTag { label: string; category: TagCategory; weight: number; } // weight 0..1

/** Extract tags from a structured psychology agent result (best-effort). */
export function extractTagsFromAnalysis(analysis: Record<string, unknown>): PersonaTag[] {
  const tags: PersonaTag[] = [];
  const push = (label: unknown, category: TagCategory, weight = 0.6) => {
    if (typeof label === "string" && label.trim()) tags.push({ label: label.trim(), category, weight });
  };
  push(analysis.driverCategory, "driver", 0.8);
  push(analysis.distortionType, "distortion", 0.7);
  push(analysis.narrativeType, "narrative", 0.8);
  push(analysis.stateName, "state", 0.6);
  if (analysis.beliefHierarchy && typeof analysis.beliefHierarchy === "object") {
    const core = (analysis.beliefHierarchy as Record<string, unknown>).core as Record<string, unknown> | undefined;
    push(core?.self, "belief", 0.7);
  }
  for (const v of (analysis.coreValues as unknown[]) ?? []) push(v, "value", 0.5);
  for (const t of (analysis.personalityTraits as unknown[]) ?? []) push(t, "driver", 0.5);
  return tags;
}

export interface PersonaProfile {
  dominantCategory: TagCategory | null;
  topTags: { label: string; category: TagCategory; score: number; count: number }[];
  categoryWeights: Record<string, number>;
}

/** Aggregate a flat list of tags (across many entries) into a profile. */
export function computeProfile(tags: PersonaTag[]): PersonaProfile {
  const byLabel = new Map<string, { category: TagCategory; score: number; count: number }>();
  const categoryWeights: Record<string, number> = {};
  for (const t of tags) {
    const key = `${t.category}:${t.label.toLowerCase()}`;
    const cur = byLabel.get(key) ?? { category: t.category, score: 0, count: 0 };
    cur.score += t.weight; cur.count += 1;
    byLabel.set(key, cur);
    categoryWeights[t.category] = (categoryWeights[t.category] ?? 0) + t.weight;
  }
  const topTags = [...byLabel.entries()]
    .map(([key, v]) => ({ label: key.split(":").slice(1).join(":"), category: v.category, score: round(v.score), count: v.count }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  const dominantCategory = (Object.entries(categoryWeights).sort((a, b) => b[1] - a[1])[0]?.[0] as TagCategory) ?? null;
  return { dominantCategory, topTags, categoryWeights };
}

const round = (v: number) => Number(v.toFixed(3));
