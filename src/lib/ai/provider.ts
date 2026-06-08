// Provider-agnostic LLM access. Zero-dependency (uses fetch) so it runs on the
// edge or node. Switch via AI_PROVIDER = openai | anthropic | mock.

export interface CompleteParams {
  system: string;
  user: string;
  /** Ask the model to return strict JSON. */
  json?: boolean;
  temperature?: number;
}

export interface LLMProvider {
  readonly name: string;
  complete(params: CompleteParams): Promise<string>;
}

class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  constructor(private apiKey: string, private model: string) {}
  async complete({ system, user, json, temperature = 0.4 }: CompleteParams): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        temperature,
        ...(json ? { response_format: { type: "json_object" } } : {}),
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
  async complete({ system, user, temperature = 0.4 }: CompleteParams): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        temperature,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
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
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    cached = new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL ?? "gpt-4o");
  } else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    cached = new AnthropicProvider(process.env.ANTHROPIC_API_KEY, process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest");
  } else {
    cached = new MockProvider();
  }
  return cached;
}
