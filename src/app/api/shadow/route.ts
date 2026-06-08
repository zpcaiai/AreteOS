import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { ShadowDetector } from "@/lib/agents/registry";

const TYPES = ["PROCRASTINATION","COMFORT_ADDICTION","STATUS_ADDICTION","CONFIRMATION_BIAS","SUNK_COST_BIAS","EGO","FEAR","AVOIDANCE","DISTRACTION"] as const;
type ShadowT = typeof TYPES[number];
const asType = (s: string): ShadowT => (TYPES as readonly string[]).includes(s.toUpperCase()) ? (s.toUpperCase() as ShadowT) : "AVOIDANCE";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [patterns, events] = await Promise.all([
      prisma.shadowPattern.findMany({ where: { userId }, include: { interventions: true } }),
      prisma.shadowEvent.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 30 }),
    ]);
    return ok({ patterns, events });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ recentBehaviors: z.array(z.string()).min(1) }));
    const out = await ShadowDetector.run(body);
    // One nested create per pattern (pattern + event + interventions), in parallel.
    await Promise.all(
      out.patterns.map((p) => {
        const type = asType(p.type);
        return prisma.shadowPattern.create({
          data: {
            userId, type, rootCause: p.rootCause,
            events: { create: [{ userId, type, severity: p.severity }] },
            interventions: { create: out.interventions.map((action) => ({ userId, action })) },
          },
        });
      }),
    );
    return created({ patterns: out.patterns, warnings: out.warnings, interventions: out.interventions });
  });
}
