import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const stack = await prisma.talentStack.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    const meta = (stack?.metadata ?? {}) as Record<string, unknown>;
    return ok({ identityStack: stack?.identityStack ?? "", monetizationPaths: (meta.monetizationPaths as string[]) ?? [] });
  });
}
