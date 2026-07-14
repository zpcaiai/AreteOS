// Data lifecycle: let the user wipe their growth-loop data (the engines added in
// the 2026 build) for a clean restart — without touching the rest of the app.

import { prisma } from "./db";

// Aggregate types emitted by the growth-loop engines (Skill:* matched by prefix).
export const ENGINE_AGGREGATES = [
  "Council", "FutureSelf", "Narrative", "Evidence", "Experiment", "Bottleneck",
  "Prescription", "Protocol", "LoopUpdate", "Boardroom", "SpecificKnowledge",
  "IdentityTree", "Asset", "LifeCapital", "PersonalOS", "DeepWork", "WeeklyCard",
];

/** Delete the user's growth-loop domain events (sample data / fresh start). */
export async function resetGrowthData(userId: string): Promise<{ deleted: number }> {
  const r = await prisma.domainEvent.deleteMany({
    where: { userId, OR: [{ aggregateType: { in: ENGINE_AGGREGATES } }, { aggregateType: { startsWith: "Skill:" } }] },
  });
  return { deleted: r.count };
}

/** Count of AI memories (RAG / personal_memories) stored for this user. */
export async function personalMemoryCount(userId: string): Promise<number> {
  return prisma.personalMemory.count({ where: { userId } });
}

/** Forget the user's AI memory — clears the personal_memories (RAG) store. */
export async function clearPersonalMemory(userId: string): Promise<{ deleted: number }> {
  const r = await prisma.personalMemory.deleteMany({ where: { userId } });
  return { deleted: r.count };
}
