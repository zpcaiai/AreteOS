// Coach agents for the 20 Skills-Library engines, built from one factory so they
// share a single input/output contract (the UI renders them uniformly) while each
// carries an engine-specific system prompt + mock example. Exposed as a record
// (not spread into the global AGENTS map, to keep AgentName a precise union).

import { z } from "zod";
import { defineAgent, type Agent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { SKILLS, featureKey, type SkillEngine } from "../skills-catalog";

export const skillCoachInput = z.object({
  context: z.string().default(""),
  factors: z.record(z.number()).default({}),
});

export const skillCoachOutput = z.object({
  summary: z.string(),
  keyInsight: z.string(),
  topActions: z.array(z.string()).default([]),
  risk: z.string(),
});

export type SkillCoachOutput = z.infer<typeof skillCoachOutput>;

function makeCoach(e: SkillEngine) {
  return defineAgent({
    name: `SkillCoach_${e.slug.replace(/-/g, "_")}`,
    description: `Skills-Library coach: ${e.title.en}.`,
    system: `${BASE_TONE} ${e.system} Respond with: a one-line summary, the single key insight, exactly 3 concrete topActions, and the main risk to watch.`,
    inputSchema: skillCoachInput,
    outputSchema: skillCoachOutput,
    buildUserPrompt: (i) => {
      const factors = Object.entries(i.factors).map(([k, v]) => `${k}: ${Math.round((Number(v) || 0) * 100)}%`).join(", ") || "(none)";
      return `Engine: ${e.title.en}\nContext: ${i.context || "(none)"}\nSelf-rated factors: ${factors}\nGive summary, keyInsight, 3 topActions, and the main risk.`;
    },
    example: { input: { context: "", factors: {} }, output: e.example },
    temperature: 0.5,
  });
}

/** Keyed by feature key (e.g. "skill_specific_knowledge") for direct lookup. */
export const SKILL_COACHES: Record<string, Agent<z.input<typeof skillCoachInput>, SkillCoachOutput>> = Object.fromEntries(
  SKILLS.map((e) => [featureKey(e.slug), makeCoach(e)]),
);

export function coachFor(slug: string) {
  return SKILL_COACHES[featureKey(slug)] ?? null;
}
