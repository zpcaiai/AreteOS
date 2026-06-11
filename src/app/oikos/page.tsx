import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeManagement } from "@/lib/oikos/service";
import { MATURITY, FIRST_PRINCIPLES } from "@/lib/oikos/levels";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import ManagementStudio from "./ManagementStudio";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Management OS" };

export const dynamic = "force-dynamic";

export default async function ManagementPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [health, profile, leverage] = await Promise.all([
    computeManagement(userId),
    prisma.managementProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.leverageLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader title={t("page.oikos.title")} subtitle={t("page.oikos.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_management_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.globalManagementScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">(Leverage × Knowledge × Alignment × Decisions × Health × Resilience) ÷ Dependency</p>
          {profile && <p className="mt-2 text-sm text-indigo-300">Maturity: {profile.level.replace(/_/g, " ")}</p>}
        </Card>
        <Card title={t("card.leverage_knowledge")}>
          <ScoreBar label={t("score.leverage")} value={health.leverageScore} />
          <ScoreBar label={t("score.knowledge_worker_effectiveness")} value={health.knowledge} />
          <ScoreBar label={t("score.decision_governance")} value={health.decisionQuality} />
        </Card>
        <Card title={t("card.health_resilience")}>
          <ScoreBar label={t("score.org_health")} value={health.healthScore} />
          <ScoreBar label={t("score.resilience_anti_fragility")} value={health.resilience} />
          <ScoreBar label={t("score.dependency_risk")} value={health.dependencyRisk} />
          <Link href="/oikos/dashboard" className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Full dashboard →</Link>
        </Card>
      </div>

      {leverage && (
        <Card title={t("card.leverage_distribution")}>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center text-sm">
            <div><div className="text-2xl font-bold tabular-nums text-rose-400">{Math.round(leverage.lowShare * 100)}%</div><div className="text-xs text-slate-500">Low</div></div>
            <div><div className="text-2xl font-bold tabular-nums text-amber-400">{Math.round(leverage.mediumShare * 100)}%</div><div className="text-xs text-slate-500">Medium</div></div>
            <div><div className="text-2xl font-bold tabular-nums text-emerald-400">{Math.round(leverage.highShare * 100)}%</div><div className="text-xs text-slate-500">High</div></div>
          </div>
          {leverage.improvementPlan.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {leverage.improvementPlan.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}
        </Card>
      )}

      <Card title={t("card.management_maturity_model")}>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-1 pr-3">Lvl</th><th className="px-3">Role</th><th className="px-3">Focus</th><th className="px-3">Question</th></tr></thead>
            <tbody>
              {MATURITY.map((m) => (
                <tr key={m.level} className={`border-t border-slate-800 ${profile?.level === m.level ? "bg-indigo-950/30" : ""}`}>
                  <td className="py-2 pr-3 tabular-nums text-slate-500">{m.n}</td>
                  <td className="px-3 font-medium text-slate-200">{m.level.replace(/_/g, " ")}</td>
                  <td className="px-3 text-indigo-300">{m.focus}</td>
                  <td className="px-3 text-xs text-slate-400">{m.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t("card.first_principles")}>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-300">
          {FIRST_PRINCIPLES.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      </Card>

      <div className="mt-6"><ManagementStudio /></div>
    </div>
  );
}
