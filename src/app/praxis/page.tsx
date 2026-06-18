import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeOrgHealth } from "@/lib/praxis/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import SfmStudio from "./SfmStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("业务规模化引擎(SFM)", "Business Scaling Engine (SFM)");

export const dynamic = "force-dynamic";

export default async function SfmPage() {
  const { t, locale } = await getDict();
  const en = locale === "en";
  const userId = await getUserId();
  const [health, founder, identity, factors, values, principles] = await Promise.all([
    computeOrgHealth(userId),
    prisma.founderProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.companyIdentity.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
    prisma.successFactor.findMany({ where: { userId }, orderBy: { scalabilityScore: "desc" }, take: 8 }),
    prisma.coreBusinessValue.findMany({ where: { userId }, orderBy: { rank: "asc" } }),
    prisma.operatingPrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <div>
      <PageHeader title={t("page.praxis.title")} subtitle={t("page.praxis.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.replication_readiness")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.replicationReadiness * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">{en ? "Can this succeed without the founder in the room?" : "没有创始人在场,这件事还能成吗?"}</p>
          <div className="mt-3 space-y-2">
            <ScoreBar label={t("score.founder_independence")} value={1 - health.founderDependency} />
            <ScoreBar label={t("score.repeatability")} value={health.repeatability} />
            <ScoreBar label={t("score.scalability")} value={health.scalability} />
          </div>
        </Card>
        <Card title={t("card.organizational_health")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.organizationalHealth * 100)}</div>
          <div className="mt-3 space-y-2">
            <ScoreBar label={t("score.values_alignment")} value={health.valuesAlignment} />
            <ScoreBar label={t("score.decision_consistency")} value={health.decisionConsistency} />
            <ScoreBar label={t("score.collaboration")} value={health.collaborationQuality} />
          </div>
        </Card>
        <Card title={t("card.leadership_resilience")}>
          <div className="mt-1 space-y-2">
            <ScoreBar label={t("score.leadership_maturity")} value={health.leadershipMaturity} />
            <ScoreBar label={t("score.resilience")} value={health.resilience} />
          </div>
          <Link href="/praxis/dashboard" className="mt-4 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">{en ? "Full dashboard →" : "完整仪表盘 →"}</Link>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.company_identity")}>
          {identity ? (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="font-semibold text-white">{identity.identityStatement}</p>
              <p><span className="text-slate-500">{en ? "We win by:" : "我们靠什么取胜:"}</span> {identity.strategicPosition}</p>
              <p><span className="text-slate-500">{en ? "We refuse to:" : "我们拒绝做:"}</span> {identity.enemyToAvoid}</p>
              <p><span className="text-slate-500">{en ? "Customers trust us because:" : "客户信任我们,是因为:"}</span> {identity.promiseToCustomer}</p>
            </div>
          ) : <Empty>{t("empty.no_company_identity_yet_build_one")}</Empty>}
        </Card>
        <Card title={t("card.founder_dna")}>
          {founder ? (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="font-semibold text-white">{founder.founderIdentity}</p>
              <p><span className="text-slate-500">{en ? "Strengths:" : "优势:"}</span> {founder.strengths.join(", ")}</p>
              <p><span className="text-slate-500">{en ? "Shadow risks:" : "阴影风险:"}</span> {founder.shadowRisks.join(", ")}</p>
            </div>
          ) : <Empty>{t("empty.no_founder_profile_yet_run_the")}</Empty>}
        </Card>
      </div>

      {factors.length > 0 && (
        <Card title={t("card.top_success_factors")} >
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="py-1 pr-3">{en ? "Factor" : "要素"}</th><th className="px-3">{en ? "Repeat" : "可重复"}</th><th className="px-3">{en ? "Scale" : "可规模化"}</th><th className="px-3">{en ? "Founder dep." : "创始人依赖"}</th><th className="px-3">{en ? "Replication" : "可复制"}</th></tr>
              </thead>
              <tbody>
                {factors.map((f) => (
                  <tr key={f.id} className="border-t border-slate-800">
                    <td className="py-2 pr-3 font-medium text-slate-200">{f.name}<div className="text-xs text-slate-500">{f.category}</div></td>
                    <td className="px-3 tabular-nums">{Math.round(f.repeatabilityScore * 100)}</td>
                    <td className="px-3 tabular-nums">{Math.round(f.scalabilityScore * 100)}</td>
                    <td className="px-3 tabular-nums text-amber-400">{Math.round(f.founderDependencyScore * 100)}</td>
                    <td className="px-3 text-xs text-slate-400">{f.replicationMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {values.length > 0 && (
        <Card title={t("card.core_values_operating_principles")}>
          <ul className="space-y-2 text-sm">
            {values.map((v) => (
              <li key={v.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-white">{v.rank}. {v.value}</span>
                <span className="text-slate-400"> — {v.operatingPrinciple}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {principles.length > 0 && (
        <Card title={t("card.operating_principles")}>
          <ul className="space-y-2 text-sm text-slate-300">
            {principles.map((p) => (
              <li key={p.id} className="border-t border-slate-800 pt-2">
                <span className="font-semibold text-white">{p.principle}</span>
                <div className="text-xs text-slate-500">Enforce: {p.enforcement}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-6">
        <SfmStudio />
      </div>
    </div>
  );
}
