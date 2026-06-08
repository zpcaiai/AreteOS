import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route, HttpError } from "@/lib/http";
import { computeChild } from "@/lib/genius/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const childId = new URL(req.url).searchParams.get("childId") ?? "";
    const child = await prisma.childProfile.findFirst({ where: { id: childId, userId } });
    if (!child) throw new HttpError(404, "Child not found");
    const [health, questions, projects, creativity, snapshots] = await Promise.all([
      computeChild(childId),
      prisma.curiosityLog.findMany({ where: { childId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.childProject.findMany({ where: { childId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.creativityProject.findMany({ where: { childId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.childIdentitySnapshot.findMany({ where: { childId }, orderBy: { createdAt: "asc" }, take: 60 }),
    ]);
    return ok({ child, health, questions, projects, creativity, snapshots });
  });
}
