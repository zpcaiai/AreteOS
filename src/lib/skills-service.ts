// Skills-Library service. Computes an engine's score from self-rated factors
// (pure scoring core), runs its coach for guidance, and persists each assessment
// as a domain event (event-sourced, no new tables). Dashboard reads the latest.

import { prisma } from "./db";
import { emit } from "./events";
import { SKILL_BY_SLUG, denomIndex } from "./skills-catalog";
import { clamp01, round1, scoreEngine } from "./skills-scoring";
import { coachFor, type SkillCoachOutput } from "./agents/skills-coaches";

export interface AssessResult {
  slug: string;
  score: number; // 0..100
  factors: Record<string, number>; // 0..1
  guidance: SkillCoachOutput;
}

const FALLBACK: SkillCoachOutput = { summary: "", keyInsight: "", topActions: [], risk: "" };

export async function assessSkill(
  userId: string,
  slug: string,
  input: { context?: string; factors?: Record<string, number> },
): Promise<AssessResult | null> {
  const e = SKILL_BY_SLUG[slug];
  if (!e) return null;

  const factors: Record<string, number> = {};
  for (const f of e.factors) factors[f.key] = clamp01(input.factors?.[f.key] ?? 0.5);
  const values = e.factors.map((f) => factors[f.key]);
  const score = round1(scoreEngine(values, e.mode, e.mode === "ratio" ? denomIndex(e) : null));

  const coach = coachFor(slug);
  const guidance = coach ? await coach.run({ context: input.context ?? "", factors }) : FALLBACK;

  await emit({
    userId,
    aggregateType: `Skill:${slug}`,
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `skill_${Date.now()}`,
    type: "SkillAssessed",
    payload: { slug, score, factors, guidance },
  }).catch(() => {});

  return { slug, score, factors, guidance };
}

export async function latestSkill(userId: string, slug: string): Promise<AssessResult | null> {
  if (!SKILL_BY_SLUG[slug]) return null;
  const row = await prisma.domainEvent.findFirst({
    where: { userId, aggregateType: `Skill:${slug}`, type: "SkillAssessed" },
    orderBy: { occurredAt: "desc" },
    select: { payload: true },
  });
  if (!row) return null;
  const p = (row.payload ?? {}) as Record<string, unknown>;
  return {
    slug,
    score: Number(p.score) || 0,
    factors: (p.factors as Record<string, number>) ?? {},
    guidance: (p.guidance as SkillCoachOutput) ?? FALLBACK,
  };
}
