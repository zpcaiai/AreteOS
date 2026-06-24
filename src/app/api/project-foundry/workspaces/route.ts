import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { saveProjectWorkspace } from "@/lib/project-foundry";

const Body = z.object({
  id: z.string().uuid().optional(),
  templateId: z.string().min(1).max(80).optional(),
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
    const userId = await getUserId(req);
    const input = await parseBody(req, Body);
    return ok({ workspace: await saveProjectWorkspace(userId, input) });
  });
}
