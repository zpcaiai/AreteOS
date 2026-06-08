import { NextResponse } from "next/server";
import { AGENTS, type AgentName } from "@/lib/agents/registry";

// GET /api/agents            -> list agent names + descriptions
// POST /api/agents/:name     -> run an agent with the request body as input
export async function GET() {
  return NextResponse.json({
    agents: Object.values(AGENTS).map((a) => ({ name: a.name, description: a.spec.description })),
  });
}

export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const agent = AGENTS[name as AgentName];
  if (!agent) return NextResponse.json({ error: `Unknown agent: ${name}` }, { status: 404 });
  const input = await req.json().catch(() => ({}));
  try {
    const output = await agent.run(input as never);
    return NextResponse.json({ agent: name, output });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
