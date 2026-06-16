import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { notFound, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { assessSkill, latestSkill } from "@/lib/skills-service";
import { SKILL_BY_SLUG, featureKey } from "@/lib/skills-catalog";

const Body = z.object({
  context: z.string().max(4000).optional(),
  factors: z.record(z.number().min(0).max(1)).optional(),
});

// POST /api/skills/:engine -> assess one Skills-Library engine (membership-gated).
export async function POST(req: Request, ctx: { params: Promise<{ engine: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { engine } = await ctx.params;
    if (!SKILL_BY_SLUG[engine]) return notFound("Unknown skill engine");
    await requireFeature(userId, featureKey(engine));
    const b = await parseBody(req, Body);
    const assessment = await assessSkill(userId, engine, b);
    return assessment ? ok({ assessment }) : notFound("Unknown skill engine");
  });
}

// GET /api/skills/:engine -> latest assessment (open to any signed-in user).
export async function GET(req: Request, ctx: { params: Promise<{ engine: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { engine } = await ctx.params;
    if (!SKILL_BY_SLUG[engine]) return notFound("Unknown skill engine");
    return ok({ latest: await latestSkill(userId, engine) });
  });
}
