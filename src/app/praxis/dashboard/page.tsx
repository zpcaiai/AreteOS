import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeOrgHealth } from "@/lib/praxis/service";
import { Card, ScoreBar, PageHeader, Line, Empty, Scoreboard } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("组织健康仪表盘", "Organizational Health Dashboard");

export const dynamic = "force-dynamic";

export default async function SfmDashboard() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [health, bottlenecks, playbooks, history] = await Promise.all([
    computeOrgHealth(userId),
    prisma.scalingBottleneck.findMany({ where: { userId, resolved: false }, orderBy: { severity: "desc" } }),
    prisma.replicationPlaybook.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.organizationalHealthSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
  ]);

  const board: [string, number][] = [
    ["Founder independence", 1 - health.founderDependency],
    ["Repeatability", health.repeatability],
    ["Scalability", health.scalability],
    ["Values alignment", health.valuesAlignment],
    ["Decision consistency", health.decisionConsistency],
    ["Collaboration quality", health.collaborationQuality],
    ["Leadership maturity", health.leadershipMaturity],
    ["Resilience", health.resilience],
  ];

  return (
    <div>
      <PageHeader title={t("page.praxis.dashboard.title")} subtitle={t("page.praxis.dashboard.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.replication_readiness")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.replicationReadiness * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
          <Line values={history.map((h) => h.replicationReadiness)} />
        </Card>
        <Card title={t("card.organizational_health")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.organizationalHealth * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
          <Line values={history.map((h) => h.organizationalHealth)} color="#10b981" />
        </Card>
      </div>

      <Card title={t("card.scoreboard")}>
        <Scoreboard rows={board} />
      </Card>

      <Card title={t("card.scaling_bottlenecks")}>
        {bottlenecks.length ? (
          <ul className="space-y-2 text-sm">
            {bottlenecks.map((b) => (
              <li key={b.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-amber-400">{b.bottleneckType.replace(/_/g, " ")}</span>
                <span className="ml-2 text-xs text-slate-500">severity {Math.round(b.severity * 100)}</span>
                <div className="text-slate-300">{b.rootCause}</div>
                <div className="text-xs text-slate-500">Fix: {b.intervention}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_open_bottlenecks_recorded")}</Empty>}
      </Card>

      <Card title={t("card.replication_playbooks")}>
        {playbooks.length ? (
          <ul className="space-y-2 text-sm text-slate-300">
            {playbooks.map((p) => (
              <li key={p.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-white">{p.title}</span>
                <span className="ml-2 text-xs text-emerald-400">readiness {Math.round(p.readinessScore * 100)}</span>
                <div className="text-xs text-slate-500">Transfer: {p.transferPlan}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_playbooks_generated_yet")}</Empty>}
      </Card>
    </div>
  );
}
