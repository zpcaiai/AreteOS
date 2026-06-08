import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeOrgHealth } from "@/lib/praxis/service";
import { Card, ScoreBar, PageHeader, Line, Empty, Scoreboard } from "@/components/ui";

export const metadata = { title: "Organizational Health Dashboard" };

export const dynamic = "force-dynamic";

export default async function SfmDashboard() {
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
      <PageHeader title="Organizational Health Dashboard" subtitle="The full SFM scoreboard — replication readiness and the binding constraints to scaling." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Replication Readiness">
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.replicationReadiness * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
          <Line values={history.map((h) => h.replicationReadiness)} />
        </Card>
        <Card title="Organizational Health">
          <div className="text-5xl font-bold tabular-nums">{Math.round(health.organizationalHealth * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
          <Line values={history.map((h) => h.organizationalHealth)} color="#10b981" />
        </Card>
      </div>

      <Card title="Scoreboard">
        <Scoreboard rows={board} />
      </Card>

      <Card title="Scaling Bottlenecks">
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
        ) : <Empty>No open bottlenecks recorded.</Empty>}
      </Card>

      <Card title="Replication Playbooks">
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
        ) : <Empty>No playbooks generated yet.</Empty>}
      </Card>
    </div>
  );
}
