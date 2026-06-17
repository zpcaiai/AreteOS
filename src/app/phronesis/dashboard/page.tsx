import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeCognitive } from "@/lib/phronesis/service";
import { Card, ScoreBar, PageHeader, Empty, Scoreboard } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("认知仪表盘", "Cognitive Dashboard");

export const dynamic = "force-dynamic";

export default async function CognitiveDashboard() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [h, journals, biasEvents, insights, principles, diagnoses] = await Promise.all([
    computeCognitive(userId),
    prisma.decisionJournal.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.biasEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.wisdomInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.personalPrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.diagnosis.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const board: [string, number][] = [
    ["Global cognitive", h.globalCognitiveScore], ["Judgment", h.judgmentScore], ["Model diversity", h.modelDiversity],
    ["Bias resistance", h.biasResistance], ["Decision quality", h.decisionQuality], ["Reflection", h.reflection],
    ["Wisdom", h.wisdom], ["Uncertainty handling", h.uncertaintyScore],
  ];

  return (
    <div>
      <PageHeader title={t("page.phronesis.dashboard.title")} subtitle={t("page.phronesis.dashboard.subtitle")} />
      <Card title={t("card.scoreboard")}><Scoreboard rows={board} /></Card>

      <Card title={t("card.decision_journal")}>
        {journals.length ? (
          <ul className="space-y-2 text-sm">
            {journals.map((j) => (
              <li key={j.id} className="border-t border-slate-800 pt-2">
                <span className="font-medium text-slate-100">{j.decision}</span>
                <span className={`ml-2 text-xs ${j.resolved ? "text-emerald-400" : "text-amber-400"}`}>{j.resolved ? "reviewed" : "open"}</span>
                <div className="text-xs text-slate-500">Expected: {j.expectedOutcome}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_journaled_decisions_yet")}</Empty>}
      </Card>

      <Card title={t("card.recent_bias_events")}>
        {biasEvents.length ? (
          <ul className="space-y-1 text-sm text-slate-300">
            {biasEvents.map((b) => <li key={b.id} className="border-t border-slate-800 pt-1"><span className="text-amber-400">{b.biasName}</span> <span className="text-xs text-slate-500">sev {Math.round(b.severity * 100)}</span></li>)}
          </ul>
        ) : <Empty>{t("empty.no_biases_flagged_yet")}</Empty>}
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.wisdom_insights")}>
          {insights.length ? <ul className="space-y-1 text-sm text-slate-300">{insights.map((i) => <li key={i.id} className="border-t border-slate-800 pt-1">{i.insight}</li>)}</ul> : <Empty>{t("empty.no_insights_yet")}</Empty>}
        </Card>
        <Card title={t("card.personal_principles")}>
          {principles.length ? <ul className="space-y-1 text-sm text-slate-300">{principles.map((p) => <li key={p.id} className="border-t border-slate-800 pt-1">{p.principle}</li>)}</ul> : <Empty>{t("empty.no_principles_yet")}</Empty>}
        </Card>
      </div>

      {diagnoses.length > 0 && (
        <Card title={t("card.diagnoses")}>
          <ul className="space-y-2 text-sm text-slate-300">{diagnoses.map((d) => <li key={d.id} className="border-t border-slate-800 pt-2"><span className="font-medium text-slate-100">{d.problem}</span><div className="text-xs text-slate-500">{d.diagnosis}</div></li>)}</ul>
        </Card>
      )}
    </div>
  );
}
