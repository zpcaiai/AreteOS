import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [projects, mentees, assets] = await Promise.all([
      prisma.legacyProject.findMany({ where: { userId } }),
      prisma.mentee.findMany({ where: { userId } }),
      prisma.knowledgeAsset.findMany({ where: { userId } }),
    ]);
    return ok({ projects, mentees, assets });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      kind: z.enum(["project", "mentee", "asset"]),
      title: z.string().min(1), detail: z.string().optional(),
    }));
    if (body.kind === "mentee") return created({ mentee: await prisma.mentee.create({ data: { userId, name: body.title, focus: body.detail ?? "" } }) });
    if (body.kind === "asset") return created({ asset: await prisma.knowledgeAsset.create({ data: { userId, title: body.title, type: body.detail ?? "ARTICLE" } }) });
    return created({ project: await prisma.legacyProject.create({ data: { userId, title: body.title, impact: body.detail ?? "" } }) });
  });
}
