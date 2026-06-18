import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeWorldview } from "@/lib/cosmos/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import AnalyzeBox from "@/components/AnalyzeBox";
import WorldviewStudio from "./WorldviewStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("世界观 OS", "Worldview OS");

export const dynamic = "force-dynamic";

export default async function WorldviewPage() {
  const { t, locale } = await getDict();
  const en = locale === "en";
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
          <p className="mt-1 text-xs text-slate-400">{en ? "Clarity × Coherence × Assumption-awareness × Meaning × Mission × Identity × Wisdom" : "清晰度 × 连贯性 × 假设觉察 × 意义 × 使命 × 身份 × 智慧"}</p>
          <p className="mt-2 text-sm text-indigo-300">{en ? "Stage" : "阶段"}: {String(health.stage).replace(/_/g, " ")}</p>
        </Card>
        <Card title={t("card.worldview_health")}>
          <ScoreBar label={t("score.clarity")} value={health.clarity} />
          <ScoreBar label={t("score.coherence")} value={health.coherence} />
          <ScoreBar label={t("score.assumption_awareness")} value={health.assumptionAwareness} />
        </Card>
        <Card title={t("card.meaning_wisdom")}>
          <ScoreBar label={t("score.meaning")} value={health.meaningScore} />
          <ScoreBar label={t("score.wisdom")} value={health.wisdom} />
        </Card>
      </div>

      <div className="mt-5"><AnalyzeBox endpoint="/api/cosmos" mode="answers" placeholder="Describe what you believe creates success, what failure means, what you're responsible for…" button="Analyze worldview" /></div>

      {worldview && (
        <Card title={t("card.worldview_profile_dimensions")}>
          {worldview.summary && <p className="mb-3 text-sm text-slate-400">{en ? "Hidden assumptions" : "隐藏假设"}: {worldview.summary}</p>}
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
