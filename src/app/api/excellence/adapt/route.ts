import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, notFound, parseBody, route } from "@/lib/http";
import { PersonaAdapter } from "@/lib/agents/registry";
import { projectExcellenceGraph } from "@/lib/neo4j";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      strategyId: z.string().min(1),
      currentIdentity: z.string().default(""),
      goals: z.string().default(""),
      strengths: z.string().default(""),
      weaknesses: z.string().default(""),
    }));
    const strategy = await prisma.geniusStrategy.findUnique({ where: { id: body.strategyId }, include: { genius: true } });
    if (!strategy) return notFound("Strategy not found");

    const out = await PersonaAdapter.run({
      roleModel: strategy.genius.name,
      blueprint: {
        identity: strategy.identity, beliefs: strategy.beliefs, values: strategy.values,
        decisionRules: typeof strategy.tote === "object" ? JSON.stringify(strategy.tote) : "",
        habits: Array.isArray(strategy.installProtocol) ? (strategy.installProtocol as string[]).join("; ") : "",
        creativeProcess: strategy.creativeProcess,
      },
      user: { currentIdentity: body.currentIdentity, goals: body.goals, strengths: body.strengths, weaknesses: body.weaknesses },
    });

    const adaptation = await prisma.blueprintAdaptation.create({
      data: {
        userId, strategyId: strategy.id, title: out.title,
        identity: out.identity, beliefs: out.beliefs, values: out.values,
        decisionRules: out.decisionRules, habits: out.habits, creativeProcess: out.creativeProcess, summary: out.summary,
      },
    });
    projectExcellenceGraph({ userId, roleModel: strategy.genius.name, identity: out.identity, values: out.values }).catch(() => null);
    return created({ adaptation });
  });
}
