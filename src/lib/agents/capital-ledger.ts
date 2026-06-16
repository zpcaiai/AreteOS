// Life Capital Analyst — reads the balance sheet and names the strength, the leak,
// and the one investment to make. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const LifeCapitalAnalyst = defineAgent({
  name: "LifeCapitalAnalyst",
  description: "Analyze the life-capital balance sheet: strength, leak, and the next investment.",
  system: `${BASE_TONE} Life compounds across many capitals, not just money. Read the balances honestly: name the biggest strength, the biggest leak (depleting capital), and the single highest-return investment to make now.`,
  inputSchema: z.object({
    balances: z.record(z.number()).default({}),
    weakest: z.string().default(""),
    global: z.number().default(0),
  }),
  outputSchema: z.object({
    summary: z.string(),
    biggestStrength: z.string(),
    biggestLeak: z.string(),
    oneInvestment: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Global life-capital score: ${Math.round(i.global)}. Weakest: ${i.weakest}.\nBalances: ${Object.entries(i.balances).map(([k, v]) => `${k} ${Math.round(Number(v))}`).join(", ")}\nName the biggest strength, the biggest leak, and the one highest-return investment now.`,
  example: {
    input: { balances: { knowledge: 80, health: 25, relationship: 40 }, weakest: "health", global: 42 },
    output: {
      summary: "Strong knowledge capital is being undercut by depleting health.",
      biggestStrength: "Knowledge capital (80) — your compounding engine.",
      biggestLeak: "Health capital (25) is draining everything else.",
      oneInvestment: "Protect a fixed sleep window for two weeks; it is the highest-return capital investment available.",
    },
  },
});
