import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeCognitive } from "@/lib/phronesis/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, profile, judgment] = await Promise.all([
      computeCognitive(userId),
      prisma.cognitiveProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.judgmentProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ health, profile, judgment });
  });
}
