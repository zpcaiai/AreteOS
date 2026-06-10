import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeScoresCached } from "@/lib/analytics";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import AnalyzeBox from "@/components/AnalyzeBox";
import WhatIfSimulator from "@/components/WhatIfSimulator";

export const metadata = { title: "Digital Twin" };
export const dynamic = "force-dynamic";

export default async function TwinPage() {
  const userId = await getUserId();
  const [{ scores, stage }, insights, drifts] = await Promise.all([
    computeScoresCached(userId),
    prisma.twinInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.driftPrediction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return (
    <div>
      <PageHeader title="Digital Twin" subtitle="A live model of who you are becoming — drift risk, trajectory, simulation." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Current twin">
          <p className="text-sm text-slate-300">Stage: <span className="font-medium">{stage.current}</span></p>
          <div className="mt-3"><ScoreBar label="Growth" value={scores.growth} /><ScoreBar label="Identity alignment" value={scores.identityAlignment} /><ScoreBar label="Habit consistency" value={scores.habitConsistency} /></div>
        </Card>
        <Card title="Simulate a scenario">
          <AnalyzeBox endpoint="/api/twin" mode="scenario" placeholder="e.g. Take a manager role / move cities / drop the side project…" button="Simulate" />
        </Card>
      </div>
      <div className="mt-5">
        <Card title="What-if projection (deterministic)">
          <p className="mb-3 text-xs text-slate-500">Counterfactual simulation over your real scores using the live scoring math — no AI guesswork. Set the levels you would sustain, then project.</p>
          <WhatIfSimulator />
        </Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title="Drift predictions">
          {drifts.length ? drifts.map((d) => (
            <div key={d.id} className="mb-2"><ScoreBar label={d.towardIdentity || "drift risk"} value={d.risk} />{d.rationale && <p className="text-xs text-slate-400">{d.rationale}</p>}</div>
          )) : <Empty>No drift predictions yet.</Empty>}
        </Card>
        <Card title="Twin insights">
          {insights.length ? <ul className="space-y-2 text-sm text-slate-300">{insights.map((i) => <li key={i.id}>· {i.insight}</li>)}</ul> : <Empty>Run a simulation to generate insights.</Empty>}
        </Card>
      </div>
    </div>
  );
}
