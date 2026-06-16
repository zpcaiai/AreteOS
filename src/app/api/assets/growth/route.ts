import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { badRequest, created, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { advanceAsset, createAsset, listAssets, planAsset } from "@/lib/asset-growth";
import { ASSET_STAGES, ASSET_TYPES } from "@/lib/asset-growth-math";

const Body = z.object({
  action: z.enum(["create", "advance", "plan"]),
  name: z.string().max(200).optional(),
  type: z.enum(ASSET_TYPES).optional(),
  assetId: z.string().max(60).optional(),
  stage: z.enum(ASSET_STAGES).optional(),
  context: z.string().max(2000).optional(),
});

// GET /api/assets/growth -> portfolio + assets (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok(await listAssets(userId));
  });
}

// POST /api/assets/growth -> create / advance / plan (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "asset_growth");
    const b = await parseBody(req, Body);
    if (b.action === "create") {
      if (!b.name || !b.type) return badRequest("name and type required");
      return created(await createAsset(userId, { name: b.name, type: b.type }));
    }
    if (b.action === "advance") {
      if (!b.assetId || !b.stage) return badRequest("assetId and stage required");
      await advanceAsset(userId, b.assetId, b.stage);
      return ok(await listAssets(userId));
    }
    if (!b.name) return badRequest("name required for plan");
    return ok({ plan: await planAsset(b.name, b.type ?? "", b.context ?? "") });
  });
}
