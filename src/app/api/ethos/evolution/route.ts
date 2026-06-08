import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeIdentityProfile } from "@/lib/ethos/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const profile = await computeIdentityProfile(userId);
    return ok({ profile });
  });
}
