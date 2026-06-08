import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { GeniusModeler } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    await getUserId(req);
    const body = await parseBody(req, z.object({ genius: z.string().min(1), focus: z.string().optional() }));
    const m = await GeniusModeler.run({ genius: body.genius, focus: body.focus });

    const genius = await prisma.genius.upsert({
      where: { name: body.genius },
      update: {},
      create: { name: body.genius },
    });
    const strategy = await prisma.geniusStrategy.create({
      data: {
        geniusId: genius.id,
        name: m.strategyName,
        description: m.description,
        repSequence: m.representationalSequence,
        tote: m.tote,
        identity: m.logicalLevels.identity,
        beliefs: m.logicalLevels.beliefs,
        values: m.logicalLevels.values,
        capabilities: m.logicalLevels.capabilities,
        highLeverage: m.highLeverage.join(" · "),
        installProtocol: m.installProtocol,
      },
    });
    return created({ genius, strategy });
  });
}
