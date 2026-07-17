import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { persistentRateLimit } from "@/lib/rate-limit";
import { saveProjectWorkspace } from "@/lib/project-foundry";
import { track } from "@/lib/telemetry";
import { WORKSPACE_TEMPLATE_VERSION } from "@/lib/project-foundry-catalog";

const Body = z.object({
  id: z.string().uuid().optional(),
  templateId: z.string().min(1).max(80).optional(),
  templateVersion: z.number().int().min(1).max(WORKSPACE_TEMPLATE_VERSION).optional(),
  teamId: z.string().min(1).max(100).nullable().optional(),
  title: z.string().trim().min(2).max(120),
  problem: z.string().trim().min(10).max(2000),
  audience: z.string().trim().min(2).max(500),
  projectType: z.enum(["personal", "learning", "creator", "founder", "team", "wellbeing", "family", "research"]),
  selectedIds: z.array(z.string().min(1).max(80)).min(1).max(40),
  constraints: z.string().trim().max(1000).optional(),
});

/** Save a new workspace or append a revised state to an existing workspace's history. */
export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `foundry-save:${userId}`, limit: 60, windowMs: 60_000 });
    if (limited) return limited;
    const input = await parseBody(req, Body);
    const workspace = await saveProjectWorkspace(userId, input);
    await track({ userId, name: "foundry_workspace_saved", props: { templateId: workspace.templateId, templateVersion: workspace.templateVersion, revision: workspace.revision } });
    return ok({ workspace });
  });
}
