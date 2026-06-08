// Cognitive OS — service. Computes the cognitive scoreboard from the user's data.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeCognitive(userId: string) {
  const [judgment, biasEvents, journals, reviews, unc, insights, principles, profile] = await Promise.all([
    prisma.judgmentAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.biasEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.decisionJournal.count({ where: { userId } }),
    prisma.cogDecisionReview.count({ where: { userId } }),
    prisma.uncertaintyAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.wisdomInsight.count({ where: { userId } }),
    prisma.personalPrinciple.count({ where: { userId } }),
    prisma.cognitiveProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  // model diversity from the user's latticeworks
  const userLat = await prisma.latticework.findMany({ where: { userId }, select: { id: true } });
  const nodes = userLat.length
    ? await prisma.latticeworkNode.findMany({ where: { latticeworkId: { in: userLat.map((l) => l.id) } }, select: { category: true } })
    : [];
  const distinctCats = new Set(nodes.map((n) => n.category).filter(Boolean)).size;

  const judgmentScore = judgment?.judgmentScore ?? 0;
  const modelDiversity = S.modelDiversityScore(distinctCats);
  const biasResistance = S.biasResistanceScore(biasEvents);
  const decisionQuality = S.decisionQualityScore({ reviewed: reviews, total: Math.max(journals, reviews) });
  const reflection = S.reflectionScore({ reviews, journals: Math.max(journals, 1) });
  const wisdom = S.wisdomScore({ insights, principles });
  const blindSpotLoad = profile ? Math.min(1, profile.weaknesses.length / 5) : 0.4;

  const global = S.globalCognitiveScore({
    modelDiversity, judgment: judgmentScore, decisionQuality, biasResistance, reflection, wisdom, blindSpotLoad,
  });

  return {
    judgmentScore, modelDiversity, biasResistance, decisionQuality, reflection, wisdom,
    uncertaintyScore: unc?.uncertaintyScore ?? 0, globalCognitiveScore: global,
  };
}

export type CognitiveHealth = Awaited<ReturnType<typeof computeCognitive>>;
