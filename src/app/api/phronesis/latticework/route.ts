import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { LatticeworkBuilder } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const latticeworks = await prisma.latticework.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return ok({ latticeworks });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ goal: z.string().min(1), known: z.array(z.string()).default([]) }));
    const out = await LatticeworkBuilder.run({ goal: b.goal, known: b.known });
    const lat = await prisma.latticework.create({ data: { userId, goal: b.goal, blindSpots: out.blindSpots, synergyNote: out.synergy } });
    await prisma.$transaction(out.nodes.map((n) =>
      prisma.latticeworkNode.create({ data: { latticeworkId: lat.id, modelSlug: n.model.toLowerCase().replace(/\s+/g, "-"), modelName: n.model, category: n.category } })));
    if (out.edges.length) await prisma.$transaction(out.edges.map((e) =>
      prisma.latticeworkEdge.create({ data: { latticeworkId: lat.id, fromModel: e.from, toModel: e.to, relation: e.relation } })));
    return created({ latticework: lat, nodes: out.nodes, edges: out.edges });
  });
}
