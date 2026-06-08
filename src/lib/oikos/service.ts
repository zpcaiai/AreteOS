// Management OS — service. Reads engine tables, computes the management scoreboard.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeManagement(userId: string) {
  const [leverage, kw, gov, health, fragility, alignment] = await Promise.all([
    prisma.leverageLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.knowledgeWorkerProfile.findMany({ where: { userId } }),
    prisma.decisionGovernance.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.organizationalHealth.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.fragilityAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.alignmentAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const leverageScore = leverage?.leverageScore ?? 0;
  const knowledge = kw.length ? kw.reduce((a, p) => a + p.effectivenessScore, 0) / kw.length : 0;
  const decisionQuality = gov?.governanceScore ?? 0;
  const healthScore = health?.healthScore ?? 0;
  const resilience = fragility?.resilienceScore ?? 0;
  const dependencyRisk = fragility
    ? S.dependencyRisk(fragility)
    : 0.4;
  const alignmentScore = alignment?.alignmentScore ?? 0;

  const global = S.globalManagementScore({
    leverage: leverageScore, knowledge, alignment: alignmentScore,
    decisionQuality, health: healthScore, resilience, dependencyRisk,
  });

  return { leverageScore, knowledge, alignmentScore, decisionQuality, healthScore, resilience, dependencyRisk, globalManagementScore: global };
}

export type ManagementHealth = Awaited<ReturnType<typeof computeManagement>>;
