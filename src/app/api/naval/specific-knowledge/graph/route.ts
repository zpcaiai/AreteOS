import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

// A lightweight knowledge graph: profile -> assets, and the rare combination terms.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const profile = await prisma.specificKnowledgeProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { assets: true } });
    const meta = (profile?.metadata ?? {}) as Record<string, unknown>;
    const combo = (meta.rareCombination as string[]) ?? [];
    const nodes = [
      ...(profile ? [{ id: profile.id, type: "profile", label: "Specific knowledge" }] : []),
      ...combo.map((c, i) => ({ id: `combo-${i}`, type: "skill", label: c })),
      ...(profile?.assets ?? []).map((a) => ({ id: a.id, type: "asset", label: a.name })),
    ];
    const edges = [
      ...combo.map((_, i) => ({ from: profile?.id ?? "root", to: `combo-${i}`, rel: "COMBINES_IN_STACK" })),
      ...(profile?.assets ?? []).map((a) => ({ from: profile?.id ?? "root", to: a.id, rel: "CREATES_ASSET" })),
    ];
    return ok({ nodes, edges });
  });
}
