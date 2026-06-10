import { getUserId } from "@/lib/auth";
import { ok, badRequest, route } from "@/lib/http";
import { WORKFLOWS, GRAPH_WORKFLOWS, runWorkflow, runGraph } from "@/lib/ai/graph";

export async function GET() {
  return ok({
    workflows: [
      ...Object.values(WORKFLOWS).map((w) => ({ name: w.name, description: w.description, kind: "sequential", steps: w.steps.map((s) => s.agent) })),
      ...Object.values(GRAPH_WORKFLOWS).map((w) => ({ name: w.name, description: w.description, kind: "graph", steps: Object.keys(w.nodes) })),
    ],
  });
}

export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  return route(async () => {
    await getUserId(req);
    const { name } = await ctx.params;
    const initial = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const graph = GRAPH_WORKFLOWS[name];
    if (graph) return ok({ workflow: name, ...(await runGraph(graph, initial)) });

    const wf = WORKFLOWS[name];
    if (!wf) return badRequest(`Unknown workflow: ${name}`);
    return ok({ workflow: name, ...(await runWorkflow(wf, initial)) });
  });
}
