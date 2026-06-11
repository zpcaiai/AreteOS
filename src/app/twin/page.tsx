import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeScoresCached } from "@/lib/analytics";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import AnalyzeBox from "@/components/AnalyzeBox";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Digital Twin" };
export const dynamic = "force-dynamic";

export default async function TwinPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [{ scores, stage }, insights, drifts] = await Promise.all([
    computeScoresCached(userId),
    prisma.twinInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.driftPrediction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return (
    <div>
      <PageHeader title={t("page.twin.title")} subtitle={t("page.twin.subtitle")} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={t("card.current_twin")}>
          <p className="text-sm text-slate-300">Stage: <span className="font-medium">{stage.current}</span></p>
          <div className="mt-3"><ScoreBar label={t("score.growth")} value={scores.growth} /><ScoreBar label={t("score.identity_alignment")} value={scores.identityAlignment} /><ScoreBar label={t("score.habit_consistency")} value={scores.habitConsistency} /></div>
        </Card>
        <Card title={t("card.simulate_a_scenario")}>
          <AnalyzeBox endpoint="/api/twin" mode="scenario" placeholder="e.g. Take a manager role / move cities / drop the side project…" button="Simulate" />
        </Card>
      </div>
      <div className="mt-5">
        <Card title={t("card.what_if_projection_deterministic")}>
          <p className="mb-3 text-xs text-slate-500">Counterfactual simulation over your real scores using the live scoring math — no AI guesswork. Set the levels you would sustain, then project.</p>
          <WhatIfSimulator />
        </Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title={t("card.drift_predictions")}>
          {drifts.length ? drifts.map((d) => (
            <div key={d.id} className="mb-2"><ScoreBar label={d.towardIdentity || "drift risk"} value={d.risk} />{d.rationale && <p className="text-xs text-slate-400">{d.rationale}</p>}</div>
          )) : <Empty>{t("empty.no_drift_predictions_yet")}</Empty>}
        </Card>
        <Card title={t("card.twin_insights")}>
          {insights.length ? <ul className="space-y-2 text-sm text-slate-300">{insights.map((i) => <li key={i.id}>· {i.insight}</li>)}</ul> : <Empty>{t("empty.run_a_simulation_to_generate_insights")}</Empty>}
        </Card>
      </div>
    </div>
  );
}
