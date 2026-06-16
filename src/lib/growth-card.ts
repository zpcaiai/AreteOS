// Weekly growth card service: compose a shareable summary from the cross-engine
// overview + growth score, persist as a domain event, and read the latest one.

import { prisma } from "./db";
import { emit } from "./events";
import { journeyOverview } from "./journey";
import { computeScoresCached } from "./analytics";
import { composeCardText, type GrowthCardText } from "./growth-card-text";

export interface WeeklyCard extends GrowthCardText {
  score: number;
  generatedAt: number;
}

export async function generateWeeklyCard(userId: string): Promise<WeeklyCard> {
  const [overview, analytics] = await Promise.all([journeyOverview(userId), computeScoresCached(userId)]);
  const text = composeCardText({
    growth: analytics.scores.growth * 100,
    protocol: overview.protocol.topScore,
    bottleneck: overview.bottleneck,
    deepWorkMinutes: overview.deepWork.minutes,
    assetsPublished: overview.assets.published,
    capital: overview.capital.global,
    identityUnlocked: overview.identity.unlocked,
    identityTotal: overview.identity.total,
  });
  const card: WeeklyCard = { ...text, score: Math.round(analytics.scores.growth * 100), generatedAt: Date.now() };
  await emit({
    userId,
    aggregateType: "WeeklyCard",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `wc_${Date.now()}`,
    type: "WeeklyCardGenerated",
    payload: card,
  }).catch(() => {});
  return card;
}

export async function latestWeeklyCard(userId: string): Promise<WeeklyCard | null> {
  const row = await prisma.domainEvent.findFirst({
    where: { userId, aggregateType: "WeeklyCard", type: "WeeklyCardGenerated" },
    orderBy: { occurredAt: "desc" },
    select: { payload: true },
  });
  return row ? (row.payload as unknown as WeeklyCard) : null;
}


/** Generate a weekly card for every user (batched). Used by the weekly script
 *  and the secret-protected cron endpoint. */
export async function runWeeklyForAllUsers(concurrency = 8): Promise<{ users: number; generated: number; failed: number }> {
  const users = await prisma.user.findMany({ select: { id: true } });
  const c = Math.max(1, concurrency);
  let generated = 0;
  let failed = 0;
  for (let i = 0; i < users.length; i += c) {
    const batch = users.slice(i, i + c);
    const results = await Promise.allSettled(batch.map((u) => generateWeeklyCard(u.id)));
    for (const r of results) (r.status === "fulfilled" ? (generated += 1) : (failed += 1));
  }
  return { users: users.length, generated, failed };
}
