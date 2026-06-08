// Leadership Leverage — service. Reads engine tables and computes the leadership scoreboard.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeLeadership(userId: string) {
  const [leverage, belonging, assessment, vision, alignment, profile] = await Promise.all([
    prisma.leadershipLeverageMap.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.belongingAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.leadershipAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.visionStatement.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
    prisma.alignmentAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.leadershipProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const leverageScore = leverage ? S.leverageScore(leverage) : 0;
  const belongingScore = belonging?.belongingScore ?? 0;
  const maturity = assessment?.maturityScore ?? 0;
  const visionAlignment = vision?.alignmentScore ?? 0;
  const missionAlignment = alignment?.mission ?? 0;
  const identityAlignment = alignment?.identity ?? 0;
  const blindSpotLoad = profile ? Math.min(1, profile.blindSpots.length / 5) : 0.4;

  const global = S.globalLeadershipScore({
    missionAlignment: missionAlignment || visionAlignment,
    identityAlignment: identityAlignment || belongingScore,
    visionAlignment, belonging: belongingScore, readiness: maturity, blindSpotLoad,
  });

  return {
    leverageScore, belongingScore, maturity, visionAlignment,
    missionAlignment, identityAlignment, alignmentScore: alignment ? S.alignmentScore(alignment) : 0,
    globalLeadershipScore: global,
  };
}

export type LeadershipHealth = Awaited<ReturnType<typeof computeLeadership>>;
