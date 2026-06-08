// Worldview OS — service. Computes the worldview scoreboard.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeWorldview(userId: string) {
  const [profile, conflicts, meaning, assumptions, philosophies, principles] = await Promise.all([
    prisma.worldviewProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.assumptionConflict.findMany({ where: { userId } }),
    prisma.meaningProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.assumption.count({ where: { userId } }).catch(() => 0),
    prisma.personalPhilosophy.count({ where: { userId } }),
    prisma.lifePrinciple.count({ where: { userId } }),
  ]);

  const clarity = profile?.clarityScore ?? 0;
  const coherence = S.coherenceScore(conflicts);
  const assumptionAwareness = Math.min(1, assumptions / 8);
  const meaningScore = meaning?.meaningScore ?? 0;
  const wisdom = Math.min(1, (philosophies + principles) / 8);

  const global = S.globalWorldviewScore({
    clarity, coherence, assumptionAwareness, meaning: meaningScore,
    missionAlignment: profile?.purpose ?? clarity, identityAlignment: profile?.purpose ?? clarity, wisdom,
  });

  return { clarity, coherence, assumptionAwareness, meaningScore, wisdom, stage: profile?.stage ?? "QUESTIONED", globalWorldviewScore: global };
}

export type WorldviewHealth = Awaited<ReturnType<typeof computeWorldview>>;
