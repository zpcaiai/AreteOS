import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { assessSpecificKnowledge, latestSpecificKnowledge } from "@/lib/specific-knowledge";

const pct = z.number().min(0).max(1);
const Body = z.object({
  factors: z.object({
    curiosityDepth: pct, experienceDepth: pct, skillRarity: pct, energy: pct, marketRelevance: pct, compoundingPotential: pct,
  }),
  market: pct.optional(),
  context: z.string().max(2000).optional(),
  signals: z.array(z.object({
    label: z.string().min(1).max(80),
    kind: z.enum(["curiosity", "talent", "experience", "obsession", "market"]),
    intensity: pct, rarity: pct,
  })).max(20).optional(),
});

// POST /api/specific-knowledge -> flagship assessment (gated, reuses skill key).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "skill_specific_knowledge");
    const b = await parseBody(req, Body);
    return ok({ result: await assessSpecificKnowledge(userId, b) });
  });
}

// GET /api/specific-knowledge -> latest profile (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ latest: await latestSpecificKnowledge(userId) });
  });
}
