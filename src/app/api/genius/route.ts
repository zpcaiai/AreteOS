import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { requireGuardianConsent } from "@/lib/guardian-consent";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireGuardianConsent(userId);
    const children = await prisma.childProfile.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return ok({ children });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const consent = await requireGuardianConsent(userId);
    const b = await parseBody(req, z.object({ name: z.string().min(1), age: z.number().int().min(0).max(25).default(0), interests: z.array(z.string()).default([]) }));
    const child = await prisma.childProfile.create({ data: { userId, guardianConsentId: consent.id, name: b.name, age: b.age, interests: b.interests } });
    return created({ child });
  });
}
