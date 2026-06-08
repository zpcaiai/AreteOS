import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const memories = await prisma.organizationalMemory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
    return ok({ memories });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({
      kind: z.enum(["lesson", "decision", "failure", "success", "experiment", "case_study"]).default("lesson"),
      title: z.string().min(1), detail: z.string().default(""), outcome: z.string().default(""), organizationId: z.string().optional(),
    }));
    const memory = await prisma.organizationalMemory.create({ data: {
      userId, organizationId: b.organizationId ?? null, kind: b.kind, title: b.title, detail: b.detail, outcome: b.outcome,
    } });
    return created({ memory });
  });
}
