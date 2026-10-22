// LLM access on Node.js. Switch via AI_PROVIDER = gateway | openai | anthropic | ollama | mock.
import { generateText } from "ai";

export interface CompleteParams {
  system: string;
  user: string;
  /** Ask the model to return strict JSON. */
  json?: boolean;
  responseSchema?: {
    name: string;
    schema: unknown;
  };
  temperature?: number;
}

export interface LLMProvider {
  readonly name: string;
  complete(params: CompleteParams): Promise<string>;
}

class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  constructor(private apiKey: string, private model: string) {}
  async complete({ system, user, json, responseSchema, temperature = 0.4 }: CompleteParams): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        temperature,
        ...(responseSchema
          ? {
              response_format: {
                type: "json_schema",
                json_schema: {
                  name: responseSchema.name,
                  strict: true,
                  schema: responseSchema.schema,
                },
              },
            }
          : json
            ? { response_format: { type: "json_object" } }
            : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  constructor(private apiKey: string, private model: string) {}
  async complete({ system, user, responseSchema, temperature = 0.4 }: CompleteParams): Promise<string> {
    // Native structured output: when a schema is provided, force a single tool
    // whose input IS the schema — the model must emit valid JSON for it.
    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: 2048,
      temperature,
      system,
      messages: [{ role: "user", content: user }],
    };
    if (responseSchema) {
      body.tools = [{
        name: "emit_result",
        description: "Emit the final structured result.",
        input_schema: responseSchema.schema,
      }];
      body.tool_choice = { type: "tool", name: "emit_result" };
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (responseSchema) {
      const toolUse = (data.content ?? []).find((b: { type: string }) => b.type === "tool_use");
      if (toolUse?.input) return JSON.stringify(toolUse.input);
    }
    const text = (data.content ?? []).find((b: { type: string }) => b.type === "text");
    return text?.text ?? "";
  }
}

class OllamaProvider implements LLMProvider {
  readonly name = "ollama";
  constructor(private baseUrl: string, private model: string) {}
  async complete({ system, user, json, responseSchema, temperature = 0.4 }: CompleteParams): Promise<string> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: { temperature },
        // Ollama structured outputs: `format` accepts a JSON schema (or "json").
        ...(responseSchema ? { format: responseSchema.schema } : json ? { format: "json" } : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.message?.content ?? "";
  }
}

/** Vercel AI Gateway. Uses short-lived Vercel OIDC on deployments by default. */
class VercelGatewayProvider implements LLMProvider {
  readonly name = "gateway";
  constructor(private model: string) {}
  async complete({ system, user, json, responseSchema, temperature = 0.4 }: CompleteParams): Promise<string> {
    const structured = responseSchema
      ? `\nReturn only JSON matching this JSON Schema exactly:\n${JSON.stringify(responseSchema.schema)}`
      : json
        ? "\nReturn only a valid JSON object with no Markdown fence."
        : "";
    const result = await generateText({
      model: this.model,
      system: `${system}${structured}`,
      prompt: user,
      temperature,
    });
    return result.text;
  }
}

/** Mock provider: returns the sentinel so agents fall back to their example output. */
class MockProvider implements LLMProvider {
  readonly name = "mock";
  async complete(): Promise<string> {
    return "__MOCK__";
  }
}

export const MOCK_SENTINEL = "__MOCK__";

let cached: LLMProvider | null = null;
export function getProvider(): LLMProvider {
  if (cached) return cached;
  const production = process.env.NODE_ENV === "production";
  const provider = (process.env.AI_PROVIDER ?? (production ? "" : "mock")).trim().toLowerCase();
  if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) throw new Error("OpenAI credentials require OPENAI_API_KEY");
    cached = new OpenAIProvider(key, process.env.OPENAI_MODEL ?? "gpt-4o");
  } else if (provider === "anthropic") {
    const key = process.env.ANTHROPIC_API_KEY?.trim();
    if (!key) throw new Error("Anthropic credentials require ANTHROPIC_API_KEY");
    cached = new AnthropicProvider(key, process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest");
  } else if (provider === "gateway") {
    if (!process.env.VERCEL_OIDC_TOKEN?.trim() && !process.env.AI_GATEWAY_API_KEY?.trim() && process.env.VERCEL !== "1") {
      throw new Error("AI Gateway authentication requires Vercel OIDC or AI_GATEWAY_API_KEY");
    }
    cached = new VercelGatewayProvider(process.env.AI_GATEWAY_MODEL ?? "openai/gpt-5.4");
  } else if (provider === "ollama") {
    cached = new OllamaProvider(process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434", process.env.OLLAMA_MODEL ?? "llama3.1");
  } else if (provider === "mock" && !production) {
    cached = new MockProvider();
  } else {
    throw new Error("A supported real AI_PROVIDER is required in production; mock is only available outside production");
  }
  return cached;
}
