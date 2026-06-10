import { NextResponse } from "next/server";
import { AGENTS, type AgentName } from "@/lib/agents/registry";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { reportError } from "@/lib/logger";

const MAX_AGENT_BODY_CHARS = Number(process.env.MAX_AGENT_BODY_CHARS ?? "24000");

async function readJson(req: Request) {
  const text = await req.text().catch(() => "");
  if (text.length > MAX_AGENT_BODY_CHARS) {
    throw NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }
}

function wantsStream(req: Request) {
  const url = new URL(req.url);
  return url.searchParams.get("stream") === "1" || req.headers.get("accept")?.includes("text/event-stream");
}

function sse(name: string, run: () => Promise<unknown>) {
  const encoder = new TextEncoder();
  const send = (event: string, data: unknown) => encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  return new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(send("start", { agent: name }));
        controller.enqueue(send("status", { stage: "thinking" }));
        try {
          const output = await run();
          controller.enqueue(send("complete", { agent: name, output }));
        } catch (e) {
          reportError(e, { surface: "agent-stream", agent: name });
          controller.enqueue(send("error", { error: e instanceof Error ? e.message : String(e) }));
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    },
  );
}

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

  const limited = rateLimit({
    key: `agent:${name}:${clientIp(req)}`,
    limit: Number(process.env.AGENT_RATE_LIMIT ?? "30"),
    windowMs: Number(process.env.AGENT_RATE_WINDOW_MS ?? "60000"),
  });
  if (limited) return limited;

  let input: unknown;
  try {
    input = await readJson(req);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
  if (wantsStream(req)) return sse(name, () => agent.run(input as never));

  try {
    const output = await agent.run(input as never);
    return NextResponse.json({ agent: name, output });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    reportError(e, { surface: "agent-route", agent: name });
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
