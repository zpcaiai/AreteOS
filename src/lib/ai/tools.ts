// Tool-calling layer for the AI coach. Zero-dependency (fetch), works with
// OpenAI function calling, Anthropic tool use, and Ollama tools; the mock
// provider executes a deterministic offline loop so the whole app still runs
// without API keys.
//
// All tools are READ-ONLY views over the user's own data — the model can look
// things up to ground its coaching, but it can never mutate state.

import { prisma } from "../db";
import { recall } from "../memory";
import { reportError } from "../logger";

export interface ToolDef {
  name: string;
  description: string;
  /** JSON schema for the arguments object. */
  parameters: Record<string, unknown>;
  execute: (args: Record<string, unknown>, ctx: { userId: string }) => Promise<unknown>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ToolCallRecord {
  tool: string;
  args: Record<string, unknown>;
}

export interface ChatResult {
  text: string;
  toolCalls: ToolCallRecord[];
}

/** Progress events emitted while the model thinks / calls tools (for SSE). */
export type ChatEvent = { type: "thinking" } | { type: "tool"; tool: string };
export type ChatEventHandler = (event: ChatEvent) => void;

const int = (v: unknown, fallback: number, max: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), max) : fallback;
};

// ───────────────────────── tool definitions ─────────────────────────

export const COACH_TOOLS: ToolDef[] = [
  {
    name: "get_score_history",
    description:
      "Get the user's growth score snapshots (kind + 0..1 value) over the last N days. Use to spot trends, drops, and neglected layers.",
    parameters: {
      type: "object",
      properties: { days: { type: "number", description: "Look-back window in days (default 30, max 180)" } },
      additionalProperties: false,
    },
    async execute(args, { userId }) {
      const days = int(args.days, 30, 180);
      const since = new Date(Date.now() - days * 86_400_000);
      const rows = await prisma.scoreSnapshot.findMany({
        where: { userId, date: { gte: since } },
        orderBy: { date: "asc" },
        select: { kind: true, value: true, date: true },
        take: 400,
      });
      return rows.map((r) => ({ kind: r.kind, value: Number(r.value.toFixed(3)), date: r.date.toISOString().slice(0, 10) }));
    },
  },
  {
    name: "get_recent_decisions",
    description: "List the user's recent decisions with status, quality score, and chosen options. Use before advising on a new decision.",
    parameters: {
      type: "object",
      properties: { limit: { type: "number", description: "Max decisions to return (default 5, max 20)" } },
      additionalProperties: false,
    },
    async execute(args, { userId }) {
      const rows = await prisma.decision.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: int(args.limit, 5, 20),
        include: { options: { select: { label: true, chosen: true } }, reviews: { select: { quality: true, note: true }, take: 1, orderBy: { createdAt: "desc" } } },
      });
      return rows.map((d) => ({
        title: d.title,
        status: d.status,
        quality: d.quality,
        context: d.context.slice(0, 200),
        chosen: d.options.find((o) => o.chosen)?.label ?? null,
        lastReviewNote: d.reviews[0]?.note?.slice(0, 200) ?? null,
        createdAt: d.createdAt.toISOString().slice(0, 10),
      }));
    },
  },
  {
    name: "get_recent_reflections",
    description: "List recent daily reflections (what worked / failed / learned). Use to reference the user's own words and lessons.",
    parameters: {
      type: "object",
      properties: { limit: { type: "number", description: "Max reflections (default 5, max 20)" } },
      additionalProperties: false,
    },
    async execute(args, { userId }) {
      const rows = await prisma.reflection.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: int(args.limit, 5, 20),
        select: { date: true, worked: true, failed: true, learned: true, depth: true },
      });
      return rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        worked: r.worked.slice(0, 200),
        failed: r.failed.slice(0, 200),
        learned: r.learned.slice(0, 200),
        depth: r.depth,
      }));
    },
  },
  {
    name: "get_active_habits",
    description: "List the user's active habits with 30-day completion counts and identity links.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    async execute(_args, { userId }) {
      const since = new Date(Date.now() - 30 * 86_400_000);
      const habits = await prisma.habit.findMany({
        where: { userId, active: true },
        select: {
          name: true,
          identityProof: true,
          targetPerWeek: true,
          _count: { select: { logs: { where: { done: true, date: { gte: since } } } } },
        },
        take: 30,
      });
      return habits.map((h) => ({
        name: h.name,
        identityProof: h.identityProof,
        targetPerWeek: h.targetPerWeek,
        done30d: h._count.logs,
        adherence: Number(Math.min(1, h._count.logs / Math.max(1, (h.targetPerWeek * 30) / 7)).toFixed(2)),
      }));
    },
  },
  {
    name: "get_shadow_patterns",
    description: "List the user's recorded shadow patterns (procrastination, ego, fear, bias…) with event counts. Use to flag likely self-sabotage.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    async execute(_args, { userId }) {
      const rows = await prisma.shadowPattern.findMany({
        where: { userId },
        select: { type: true, rootCause: true, _count: { select: { events: true, interventions: true } } },
        take: 20,
      });
      return rows.map((p) => ({ type: p.type, rootCause: p.rootCause.slice(0, 200), events: p._count.events, interventions: p._count.interventions }));
    },
  },
  {
    name: "recall_memories",
    description:
      "Semantic search over the user's long-term memory (past decisions, reflections, reviews, insights). Use when the user mentions a theme that may have history.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "What to search for" },
        limit: { type: "number", description: "Max memories (default 5, max 10)" },
      },
      required: ["query"],
      additionalProperties: false,
    },
    async execute(args, { userId }) {
      const query = String(args.query ?? "").slice(0, 500);
      if (!query) return [];
      const hits = await recall(userId, query, { limit: int(args.limit, 5, 10) });
      return hits.map((h) => ({ kind: h.kind, title: h.title, content: h.content.slice(0, 300), when: (h.occurredAt ?? h.createdAt).toISOString().slice(0, 10) }));
    },
  },
];

const toolByName = new Map(COACH_TOOLS.map((t) => [t.name, t]));

async function executeTool(name: string, args: Record<string, unknown>, ctx: { userId: string }) {
  const tool = toolByName.get(name);
  if (!tool) return { error: `Unknown tool: ${name}` };
  try {
    return await tool.execute(args, ctx);
  } catch (e) {
    reportError(e, { surface: "coach-tool", tool: name });
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

// ───────────────────────── provider loops ─────────────────────────

const MAX_TOOL_TURNS = 4;

interface LoopParams {
  system: string;
  messages: ChatMessage[];
  userId: string;
  temperature?: number;
  onEvent?: ChatEventHandler;
}

async function openaiLoop({ system, messages, userId, temperature = 0.5, onEvent }: LoopParams, baseUrl: string, apiKey: string | undefined, model: string): Promise<ChatResult> {
  const toolCalls: ToolCallRecord[] = [];
  const convo: Record<string, unknown>[] = [
    { role: "system", content: system },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
  const tools = COACH_TOOLS.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }));

  for (let turn = 0; turn <= MAX_TOOL_TURNS; turn++) {
    onEvent?.({ type: "thinking" });
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify({ model, temperature, messages: convo, tools, tool_choice: turn === MAX_TOOL_TURNS ? "none" : "auto" }),
    });
    if (!res.ok) throw new Error(`Chat ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const msg = data.choices?.[0]?.message;
    if (!msg) throw new Error("Empty chat completion");

    const calls = (msg.tool_calls ?? []) as { id: string; function: { name: string; arguments: string } }[];
    if (!calls.length) return { text: msg.content ?? "", toolCalls };

    convo.push(msg);
    for (const call of calls) {
      let args: Record<string, unknown> = {};
      try { args = JSON.parse(call.function.arguments || "{}"); } catch { /* tolerate */ }
      toolCalls.push({ tool: call.function.name, args });
      onEvent?.({ type: "tool", tool: call.function.name });
      const result = await executeTool(call.function.name, args, { userId });
      convo.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result).slice(0, 8000) });
    }
  }
  return { text: "", toolCalls };
}

async function anthropicLoop({ system, messages, userId, temperature = 0.5, onEvent }: LoopParams, apiKey: string, model: string): Promise<ChatResult> {
  const toolCalls: ToolCallRecord[] = [];
  const convo: Record<string, unknown>[] = messages.map((m) => ({ role: m.role, content: m.content }));
  const tools = COACH_TOOLS.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters }));

  for (let turn = 0; turn <= MAX_TOOL_TURNS; turn++) {
    onEvent?.({ type: "thinking" });
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        temperature,
        system,
        messages: convo,
        ...(turn === MAX_TOOL_TURNS ? {} : { tools }),
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const blocks = (data.content ?? []) as { type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }[];
    const toolUses = blocks.filter((b) => b.type === "tool_use");

    if (data.stop_reason !== "tool_use" || !toolUses.length) {
      return { text: blocks.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n").trim(), toolCalls };
    }

    convo.push({ role: "assistant", content: blocks });
    const results: Record<string, unknown>[] = [];
    for (const use of toolUses) {
      const args = (use.input ?? {}) as Record<string, unknown>;
      toolCalls.push({ tool: use.name ?? "", args });
      onEvent?.({ type: "tool", tool: use.name ?? "" });
      const result = await executeTool(use.name ?? "", args, { userId });
      results.push({ type: "tool_result", tool_use_id: use.id, content: JSON.stringify(result).slice(0, 8000) });
    }
    convo.push({ role: "user", content: results });
  }
  return { text: "", toolCalls };
}

/** Deterministic offline loop: pull the most relevant data directly, then compose a grounded reply. */
async function mockLoop({ messages, userId, onEvent }: LoopParams): Promise<ChatResult> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  onEvent?.({ type: "thinking" });
  const toolCalls: ToolCallRecord[] = [
    { tool: "get_score_history", args: { days: 30 } },
    { tool: "recall_memories", args: { query: lastUser.slice(0, 200) } },
  ];
  for (const call of toolCalls) onEvent?.({ type: "tool", tool: call.tool });
  const [scores, memories] = await Promise.all([
    executeTool("get_score_history", { days: 30 }, { userId }),
    executeTool("recall_memories", { query: lastUser.slice(0, 200) }, { userId }),
  ]);

  const scoreRows = Array.isArray(scores) ? (scores as { kind: string; value: number }[]) : [];
  const latestByKind = new Map<string, number>();
  for (const row of scoreRows) latestByKind.set(row.kind, row.value);
  const weakest = [...latestByKind.entries()].sort((a, b) => a[1] - b[1])[0];
  const memoryLines = Array.isArray(memories)
    ? (memories as { title: string; when: string }[]).slice(0, 3).map((m) => `- ${m.title} (${m.when})`)
    : [];

  const parts = [
    `Here is what I see in your data right now:`,
    weakest ? `Your weakest tracked layer is **${weakest[0]}** at ${(weakest[1] * 100).toFixed(0)}%. One small consistent action there compounds fastest.` : `No score history yet — log a reflection or decision so I can ground my advice in your data.`,
  ];
  if (memoryLines.length) parts.push(`Related history I found:\n${memoryLines.join("\n")}`);
  parts.push(`Tell me the specific situation you're facing, and I'll work through it with you step by step.`);
  return { text: parts.join("\n\n"), toolCalls };
}

/**
 * Run a multi-turn chat with read-only tool access to the user's data.
 * Provider chosen via AI_PROVIDER (openai | anthropic | ollama | mock).
 */
export async function chatWithTools(params: LoopParams): Promise<ChatResult> {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return openaiLoop(params, "https://api.openai.com/v1", process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL ?? "gpt-4o");
  }
  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return anthropicLoop(params, process.env.ANTHROPIC_API_KEY, process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest");
  }
  if (provider === "ollama") {
    // Ollama exposes an OpenAI-compatible endpoint with tool support.
    return openaiLoop(params, `${(process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "")}/v1`, undefined, process.env.OLLAMA_MODEL ?? "llama3.1");
  }
  return mockLoop(params);
}
