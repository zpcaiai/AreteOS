import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeLeadership } from "@/lib/archon/service";
import { Card, ScoreBar, PageHeader, Line, Empty, Scoreboard } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Leadership Dashboard" };

export const dynamic = "force-dynamic";

export default async function LeadershipDashboard() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [health, pipeline, growth, vision, visionHistory, blueprint] = await Promise.all([
    computeLeadership(userId),
    prisma.futureLeaderProfile.findMany({ where: { userId }, orderBy: { readinessScore: "desc" }, take: 12 }),
    prisma.leadershipGrowthPlan.findMany({ where: { userId, active: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.visionStatement.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
    prisma.visionAlignmentSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
    prisma.cultureBlueprint.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const board: [string, number][] = [
    ["Global leadership", health.globalLeadershipScore],
    ["Leverage", health.leverageScore],
    ["Vision alignment", health.visionAlignment],
    ["Belonging", health.belongingScore],
    ["Leadership maturity", health.maturity],
    ["Org alignment", health.alignmentScore],
  ];

  return (
    <div>
      <PageHeader title={t("page.archon.dashboard.title")} subtitle={t("page.archon.dashboard.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.global_leadership_score")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.globalLeadershipScore * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
        </Card>
        <Card title={t("card.vision_alignment_over_time")}>
          {visionHistory.length > 1 ? <Line values={visionHistory.map((v) => v.alignmentScore)} color="#10b981" /> : <Empty>{t("empty.not_enough_vision_snapshots_yet")}</Empty>}
          {vision && <p className="mt-2 text-sm text-slate-300">{vision.statement}</p>}
        </Card>
      </div>

      <Card title={t("card.scoreboard")}>
        <Scoreboard rows={board} />
      </Card>

      <Card title={t("card.future_leader_pipeline")}>
        {pipeline.length ? (
          <div className="mt-2 space-y-2 text-sm">
            {pipeline.map((p) => (
              <div key={p.id} className="border-t border-slate-800 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{p.candidate}</span>
                  <span className="tabular-nums text-emerald-400">{Math.round(p.readinessScore * 100)}</span>
                </div>
                <ScoreBar label={t("score.readiness")} value={p.readinessScore} />
              </div>
            ))}
          </div>
        ) : <Empty>{t("empty.no_candidates_assessed_yet")}</Empty>}
      </Card>

      <Card title={t("card.role_transformation_plans")}>
        {growth.length ? (
          <ul className="space-y-2 text-sm text-slate-300">
            {growth.map((g) => (
              <li key={g.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-white">{g.fromRole} → {g.toRole}</span>
                <div className="text-xs text-slate-500">{g.steps.join(" · ")}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_role_transformation_plans_yet")}</Empty>}
      </Card>

      {blueprint && (
        <Card title={t("card.culture_blueprint")}>
          <div className="text-sm text-slate-300">
            <p><span className="text-slate-500">Values:</span> {blueprint.values.join(", ")}</p>
            <p><span className="text-slate-500">Rituals:</span> {blueprint.rituals.join(", ")}</p>
            <p className="mt-1 text-xs text-slate-500">{blueprint.replicationPlaybook}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
