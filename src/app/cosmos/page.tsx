import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeWorldview } from "@/lib/cosmos/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import AnalyzeBox from "@/components/AnalyzeBox";
import WorldviewStudio from "./WorldviewStudio";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Worldview OS" };

export const dynamic = "force-dynamic";

export default async function WorldviewPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [worldview, health, profile] = await Promise.all([
    prisma.worldview.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { dimensions: true } }),
    computeWorldview(userId),
    prisma.worldviewProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader title={t("page.cosmos.title")} subtitle={t("page.cosmos.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_worldview_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.globalWorldviewScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">Clarity × Coherence × Assumption-awareness × Meaning × Mission × Identity × Wisdom</p>
          <p className="mt-2 text-sm text-indigo-300">Stage: {String(health.stage).replace(/_/g, " ")}</p>
        </Card>
        <Card title={t("card.worldview_health")}>
          <ScoreBar label={t("score.clarity")} value={health.clarity} />
          <ScoreBar label={t("score.coherence")} value={health.coherence} />
          <ScoreBar label={t("score.assumption_awareness")} value={health.assumptionAwareness} />
        </Card>
        <Card title={t("card.meaning_wisdom")}>
          <ScoreBar label={t("score.meaning")} value={health.meaningScore} />
          <ScoreBar label={t("score.wisdom")} value={health.wisdom} />
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/cosmos/archetypes" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Archetypes</Link>
            <Link href="/cosmos/dashboard" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Dashboard</Link>
          </div>
        </Card>
      </div>

      <div className="mt-5"><AnalyzeBox endpoint="/api/cosmos" mode="answers" placeholder="Describe what you believe creates success, what failure means, what you're responsible for…" button="Analyze worldview" /></div>

      {worldview && (
        <Card title={t("card.worldview_profile_dimensions")}>
          {worldview.summary && <p className="mb-3 text-sm text-slate-400">Hidden assumptions: {worldview.summary}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {worldview.dimensions.map((d) => (
              <div key={d.id} className="rounded-lg bg-slate-800/60 p-3">
                <div className="text-xs uppercase text-slate-500">{d.dimension}</div>
                <p className="text-sm">{d.stance}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!worldview && !profile && <Empty>{t("empty.no_worldview_profile_yet_analyze_above")}</Empty>}

      <div className="mt-6"><WorldviewStudio /></div>
    </div>
  );
}
