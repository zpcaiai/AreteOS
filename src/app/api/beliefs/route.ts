import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { BeliefCoach } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const beliefs = await prisma.belief.findMany({
      where: { userId }, orderBy: { createdAt: "desc" },
      include: { limiting: true, empowering: true, reframes: true },
    });
    return ok({ beliefs });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ text: z.string().min(1) }));
    const out = await BeliefCoach.run({ text: body.text });
    await prisma.$transaction(
      out.beliefs.map((b) =>
        prisma.belief.create({
          data: {
            userId, statement: b.statement, type: b.type,
            limiting: b.type === "LIMITING" ? { create: { cost: b.cost } } : undefined,
            empowering: b.type === "EMPOWERING" ? { create: { evidence: b.empowering } } : undefined,
            reframes: b.reframe ? { create: { reframedText: b.reframe, empoweringText: b.empowering, action: b.action } } : undefined,
          },
        }),
      ),
    );
    return created({ beliefs: out.beliefs, beliefHealth: out.beliefHealth });
  });
}
