import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { IdentitySponsorAgent } from "@/lib/agents/registry";

async function ownChild(userId: string, childId: string) {
  const c = await prisma.childProfile.findFirst({ where: { id: childId, userId } });
  if (!c) throw new HttpError(404, "Child not found");
  return c;
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), observations: z.array(z.string()).default([]) }));
    const child = await ownChild(userId, b.childId);
    const out = await IdentitySponsorAgent.run({ observations: b.observations, age: child.age });
    const identity = await prisma.childIdentity.create({ data: {
      childId: child.id, kind: out.primaryIdentity, strengths: out.strengths, opportunities: out.opportunities, sponsorship: out.sponsorship.join(" · "),
    } });
    await prisma.childProfile.update({ where: { id: child.id }, data: { primaryIdentity: out.primaryIdentity, emergingIdentity: out.emergingIdentity } });
    await prisma.childIdentitySnapshot.create({ data: { childId: child.id, kind: out.primaryIdentity, note: "Identity sponsored" } });
    return created({ identity, primaryIdentity: out.primaryIdentity, emergingIdentity: out.emergingIdentity, sponsorship: out.sponsorship });
  });
}
