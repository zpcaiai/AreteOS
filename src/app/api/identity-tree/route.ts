import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { badRequest, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { generateQuest, recordEvidence, treeProgress } from "@/lib/identity-tree";
import { NODE_BY_KEY } from "@/lib/identity-tree-catalog";

const Body = z.object({
  action: z.enum(["evidence", "quest"]),
  nodeKey: z.string().min(2).max(40),
  kind: z.enum(["habit", "asset", "reflection"]).optional(),
});

// GET /api/identity-tree -> all nodes with progress + unlock state (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ nodes: await treeProgress(userId) });
  });
}

// POST /api/identity-tree -> record evidence or generate a quest (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "identity_tree");
    const b = await parseBody(req, Body);
    const node = NODE_BY_KEY[b.nodeKey];
    if (!node) return badRequest("Unknown node");
    if (b.action === "quest") return ok({ quest: await generateQuest(node.name.en, node.level) });
    if (!b.kind) return badRequest("kind required for evidence");
    await recordEvidence(userId, b.nodeKey, b.kind);
    return ok({ nodes: await treeProgress(userId) });
  });
}
