import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeManagement } from "@/lib/oikos/service";
import { Card, ScoreBar, PageHeader, Line, Empty, Scoreboard } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Management Dashboard" };

export const dynamic = "force-dynamic";

export default async function ManagementDashboard() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [health, assets, governance, fragility, designs, healthHistory] = await Promise.all([
    computeManagement(userId),
    prisma.mgmtKnowledgeAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.decisionGovernance.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.fragilityAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.organizationDesign.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.organizationalHealth.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
  ]);

  const board: [string, number][] = [
    ["Global management", health.globalManagementScore],
    ["Leverage", health.leverageScore],
    ["Knowledge effectiveness", health.knowledge],
    ["Alignment", health.alignmentScore],
    ["Decision governance", health.decisionQuality],
    ["Org health", health.healthScore],
    ["Resilience", health.resilience],
  ];

  return (
    <div>
      <PageHeader title={t("page.oikos.dashboard.title")} subtitle={t("page.oikos.dashboard.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.global_management_score")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.globalManagementScore * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
          <p className="mt-1 text-xs text-slate-400">Dependency risk: {Math.round(health.dependencyRisk * 100)}</p>
        </Card>
        <Card title={t("card.org_health_over_time")}>
          {healthHistory.length > 1 ? <Line values={healthHistory.map((h) => h.healthScore)} color="#10b981" /> : <Empty>Not enough health snapshots yet.</Empty>}
        </Card>
      </div>

      <Card title={t("card.scoreboard")}>
        <Scoreboard rows={board} />
      </Card>

      <Card title={t("card.knowledge_assets")}>
        {assets.length ? (
          <ul className="space-y-2 text-sm">
            {assets.map((a) => (
              <li key={a.id} className="border-t border-slate-800 pt-2">
                <span className="font-medium text-slate-200">{a.title}</span>
                <span className="ml-2 text-xs text-indigo-300">{a.kind.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        ) : <Empty>No knowledge captured yet.</Empty>}
      </Card>

      {fragility && (
        <Card title={t("card.fragility_map")}>
          <div className="mt-1 space-y-2">
            <ScoreBar label="Founder dependency" value={fragility.founderDependency} />
            <ScoreBar label="Key-person dependency" value={fragility.keyPersonDependency} />
            <ScoreBar label="Customer concentration" value={fragility.customerConcentration} />
            <ScoreBar label="Knowledge concentration" value={fragility.knowledgeConcentration} />
            <ScoreBar label="Product concentration" value={fragility.productConcentration} />
          </div>
          {fragility.stressTest && <p className="mt-2 text-sm text-amber-400">{fragility.stressTest}</p>}
        </Card>
      )}

      {governance && (
        <Card title={t("card.decision_governance")}>
          <div className="mt-1 space-y-2">
            <ScoreBar label="Quality" value={governance.quality} />
            <ScoreBar label="Consistency" value={governance.consistency} />
            <ScoreBar label="Speed" value={governance.speed} />
            <ScoreBar label="Ownership" value={governance.ownership} />
            <ScoreBar label="Learning" value={governance.learning} />
          </div>
          {governance.notes && <p className="mt-2 text-sm text-slate-400">{governance.notes}</p>}
        </Card>
      )}

      <Card title={t("card.organization_blueprints")}>
        {designs.length ? (
          <ul className="space-y-2 text-sm text-slate-300">
            {designs.map((d) => (
              <li key={d.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-white">{d.title}</span>
                <span className="ml-2 text-xs text-emerald-400">design {Math.round(d.designScore * 100)}</span>
                <div className="text-xs text-slate-500">{d.structure}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>No organization designs yet.</Empty>}
      </Card>
    </div>
  );
}
