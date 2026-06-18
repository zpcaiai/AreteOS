import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeScoresCached } from "@/lib/analytics";
import { Card, ScoreBar, PageHeader } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";
import JourneyTiles from "@/components/JourneyTiles";
import WeeklyCardBanner from "@/components/WeeklyCardBanner";
import NextActionBanner from "@/components/NextActionBanner";

export const generateMetadata = titleMeta("总览", "Dashboard");

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await getUserId();
  const { t } = await getDict();
  const { scores, stage } = await computeScoresCached(userId);
  const timeline = await prisma.scoreSnapshot.findMany({
    where: { userId, kind: "GROWTH" },
    orderBy: { date: "asc" },
    take: 60,
  });

  const growthPct = Math.round(scores.growth * 100);

  return (
    <div className="space-y-6">
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />

      {/* 1 — the one thing to do now */}
      <NextActionBanner />

      {/* 2 — status at a glance */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("dashboard.globalScore")}>
          <div className="flex items-end gap-3">
            <div className="text-5xl font-bold tabular-nums">{growthPct}</div>
            <div className="pb-2 text-sm text-slate-400">{t("dashboard.globalScoreHint")}</div>
          </div>
          <Sparkline values={timeline.map((s) => s.value)} emptyLabel={t("dashboard.notEnoughHistory")} />
        </Card>

        <Card title={t("dashboard.stage")}>
          <div className="text-2xl font-semibold">{stage.current}</div>
          <p className="mt-1 text-sm text-slate-400">{t("dashboard.stageGoal")}: {stage.goal}</p>
          <div className="mt-3">
            <ScoreBar label={`${t("dashboard.stageProgress")} → ${stage.next ?? "—"}`} value={stage.progress} />
          </div>
          {stage.shouldAdvance && (
            <p className="mt-2 text-sm text-emerald-400">{t("dashboard.stageReady")} {stage.next}.</p>
          )}
        </Card>

        <Card title={t("dashboard.thisWeek")}>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>{t("dashboard.decisionQuality")}: {Math.round(scores.decisionQuality * 100)}</li>
            <li>{t("dashboard.habitConsistency")}: {Math.round(scores.habitConsistency * 100)}</li>
            <li>{t("dashboard.reflection")}: {Math.round(scores.reflection * 100)}</li>
          </ul>
        </Card>
      </div>

      {/* 3 — where each engine in the loop stands */}
      <JourneyTiles />

      {/* 4 — this week's shareable card */}
      <WeeklyCardBanner />

      {/* 5 — the detail, last */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.direction_thinking")}>
          <ScoreBar label={t("score.mission_alignment")} value={scores.missionAlignment} />
          <ScoreBar label={t("score.identity_alignment")} value={scores.identityAlignment} />
          <ScoreBar label={t("score.value_integrity")} value={scores.valueIntegrity} />
          <ScoreBar label={t("score.mental_model_usage")} value={scores.mentalModelUsage} />
          <ScoreBar label={t("score.first_principle")} value={scores.firstPrinciple} />
          <ScoreBar label={t("score.decision_quality")} value={scores.decisionQuality} />
        </Card>
        <Card title={t("card.execution_contribution")}>
          <ScoreBar label={t("score.habit_consistency")} value={scores.habitConsistency} />
          <ScoreBar label={t("score.mastery")} value={scores.mastery} />
          <ScoreBar label={t("score.leadership")} value={scores.leadership} />
          <ScoreBar label={t("score.legacy")} value={scores.legacy} />
          <ScoreBar label={t("score.reflection")} value={scores.reflection} />
          <ScoreBar label={t("score.growth")} value={scores.growth} />
        </Card>
      </div>
    </div>
  );
}

function Sparkline({ values, emptyLabel }: { values: number[]; emptyLabel: string }) {
  if (values.length < 2) return <p className="mt-3 text-xs text-slate-500">{emptyLabel}</p>;
  const w = 280, h = 48, max = 1, min = 0;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full">
      <polyline points={pts} fill="none" stroke="#6366f1" strokeWidth="2" />
    </svg>
  );
}
