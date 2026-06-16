// Specific Knowledge flagship agents: analyze the rare combination, then generate
// asset opportunities from it. Exports ONLY agents (registry spreads `...sk`).

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const RareCombinationAnalyzer = defineAgent({
  name: "RareCombinationAnalyzer",
  description: "Find the user's rare, hard-to-replicate intersection from their signals.",
  system: `${BASE_TONE} Specific knowledge is a rare INTERSECTION of curiosity, experience, talent, and market — not a job title. Name the unfair, hard-to-replicate combination. Avoid generic career advice.`,
  inputSchema: z.object({
    signals: z.array(z.object({ label: z.string(), kind: z.string() })).default([]),
    market: z.number().min(0).max(1).default(0.5),
    context: z.string().default(""),
  }),
  outputSchema: z.object({
    rareCombinationStatement: z.string(),
    unfairAdvantage: z.string(),
    primaryDomain: z.string(),
    topIntersections: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Signals: ${i.signals.map((s) => `${s.label} (${s.kind})`).join("; ") || "(none)"}\nMarket relevance: ${Math.round(i.market * 100)}%\nContext: ${i.context || "(none)"}\nName the rare combination, the unfair advantage, the primary domain, and the top 2-3 intersections.`,
  example: {
    input: { signals: [{ label: "systems thinking", kind: "talent" }, { label: "hands-on teaching", kind: "experience" }], market: 0.7, context: "" },
    output: {
      rareCombinationStatement: "You can both design a complex system and teach it simply — most people do one or the other.",
      unfairAdvantage: "Translation between deep systems and beginners, at speed.",
      primaryDomain: "Technical education / developer tools",
      topIntersections: ["systems design × teaching", "architecture × writing"],
    },
  },
});

export const AssetOpportunityGenerator = defineAgent({
  name: "AssetOpportunityGenerator",
  description: "Turn a rare combination into concrete, compounding asset opportunities.",
  system: `${BASE_TONE} Convert the rare combination into 3-5 durable assets that compound (article, software, course, agent, framework). Each must have a leverage type and a first step shippable this week.`,
  inputSchema: z.object({
    rareCombination: z.string(),
    primaryDomain: z.string().default(""),
    context: z.string().default(""),
  }),
  outputSchema: z.object({
    assets: z.array(z.object({ name: z.string(), type: z.string(), leverageType: z.string(), firstStep: z.string() })).min(1),
    ninetyDayTarget: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Rare combination: ${i.rareCombination}\nPrimary domain: ${i.primaryDomain || "(unknown)"}\nContext: ${i.context || "(none)"}\nPropose 3-5 compounding assets (name, type, leverageType, firstStep) and a 90-day target.`,
  example: {
    input: { rareCombination: "Design complex systems and teach them simply.", primaryDomain: "Developer tools", context: "" },
    output: {
      assets: [
        { name: "Systems-for-beginners teardown series", type: "media", leverageType: "media", firstStep: "Outline and draft teardown #1 this week." },
        { name: "Architecture explainer toolkit", type: "framework", leverageType: "code", firstStep: "Template one diagram + checklist." },
      ],
      ninetyDayTarget: "Publish 6 teardowns and one reusable toolkit; 500 readers.",
    },
  },
});
