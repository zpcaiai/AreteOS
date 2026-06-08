import { getUserId } from "@/lib/auth";
import { ok, badRequest, route } from "@/lib/http";
import { WORKFLOWS, runWorkflow } from "@/lib/ai/graph";

export async function GET() {
  return ok({ workflows: Object.values(WORKFLOWS).map((w) => ({ name: w.name, description: w.description, steps: w.steps.map((s) => s.agent) })) });
}

export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  return route(async () => {
    await getUserId(req);
    const { name } = await ctx.params;
    const wf = WORKFLOWS[name];
    if (!wf) return badRequest(`Unknown workflow: ${name}`);
    const initial = await req.json().catch(() => ({}));
    const result = await runWorkflow(wf, initial as Record<string, unknown>);
    return ok({ workflow: name, ...result });
  });
}
