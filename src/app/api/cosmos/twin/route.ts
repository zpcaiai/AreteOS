import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { WorldviewTwinArchitect } from "@/lib/agents/registry";
import { computeWorldview } from "@/lib/cosmos/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ recentBehavior: z.array(z.string()).default([]) }));
    const snapshot = await computeWorldview(userId);
    const out = await WorldviewTwinArchitect.run({ snapshot: snapshot as unknown as Record<string, unknown>, recentBehavior: b.recentBehavior });
    const twin = await prisma.worldviewTwin.create({ data: {
      userId, snapshot: snapshot as unknown as import("@prisma/client").Prisma.InputJsonValue,
      driftDetected: out.driftDetected, evolutionSuggestions: out.evolutionSuggestions,
    } });
    return created({ twin, drift: out.drift });
  });
}
