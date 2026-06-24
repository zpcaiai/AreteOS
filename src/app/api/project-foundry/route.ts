import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { createProjectBlueprint, listProjectBlueprints, listProjectWorkspaces, projectFoundryCatalog } from "@/lib/project-foundry";

const Body = z.object({
  title: z.string().trim().min(2).max(120),
  problem: z.string().trim().min(10).max(2000),
  audience: z.string().trim().min(2).max(500),
  projectType: z.enum(["personal", "learning", "creator", "founder", "team", "wellbeing", "family", "research"]),
  selectedIds: z.array(z.string().min(1).max(80)).max(40),
  constraints: z.string().trim().max(1000).optional(),
});

/** Catalog and prior blueprints. The catalog is intentionally open to all signed-in users. */
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [blueprints, workspaces] = await Promise.all([listProjectBlueprints(userId), listProjectWorkspaces(userId)]);
    return ok({ ...projectFoundryCatalog(), blueprints, workspaces });
  });
}

/** Create a durable, exportable implementation blueprint from selected modules. */
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const input = await parseBody(req, Body);
    return ok({ blueprint: await createProjectBlueprint(userId, input) });
  });
}
