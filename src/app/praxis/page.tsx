import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeOrgHealth } from "@/lib/praxis/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import SfmStudio from "./SfmStudio";

export const metadata = { title: "Business Scaling Engine (SFM)" };

export const dynamic = "force-dynamic";

export default async function SfmPage() {
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
      <PageHeader title="Business Scaling Engine (SFM)" subtitle="Founder Genius → Success Factors → Shared Identity → Decision Rules → Operating Principles → Repeatable System → Scalable Organization." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Replication Readiness">
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.replicationReadiness * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">Can this succeed without the founder in the room?</p>
          <div className="mt-3 space-y-2">
            <ScoreBar label="Founder independence" value={1 - health.founderDependency} />
            <ScoreBar label="Repeatability" value={health.repeatability} />
            <ScoreBar label="Scalability" value={health.scalability} />
          </div>
        </Card>
        <Card title="Organizational Health">
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.organizationalHealth * 100)}</div>
          <div className="mt-3 space-y-2">
            <ScoreBar label="Values alignment" value={health.valuesAlignment} />
            <ScoreBar label="Decision consistency" value={health.decisionConsistency} />
            <ScoreBar label="Collaboration" value={health.collaborationQuality} />
          </div>
        </Card>
        <Card title="Leadership & Resilience">
          <div className="mt-1 space-y-2">
            <ScoreBar label="Leadership maturity" value={health.leadershipMaturity} />
            <ScoreBar label="Resilience" value={health.resilience} />
          </div>
          <Link href="/praxis/dashboard" className="mt-4 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Full dashboard →</Link>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Company Identity">
          {identity ? (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="font-semibold text-white">{identity.identityStatement}</p>
              <p><span className="text-slate-500">We win by:</span> {identity.strategicPosition}</p>
              <p><span className="text-slate-500">We refuse to:</span> {identity.enemyToAvoid}</p>
              <p><span className="text-slate-500">Customers trust us because:</span> {identity.promiseToCustomer}</p>
            </div>
          ) : <Empty>No company identity yet. Build one below.</Empty>}
        </Card>
        <Card title="Founder DNA">
          {founder ? (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="font-semibold text-white">{founder.founderIdentity}</p>
              <p><span className="text-slate-500">Strengths:</span> {founder.strengths.join(", ")}</p>
              <p><span className="text-slate-500">Shadow risks:</span> {founder.shadowRisks.join(", ")}</p>
            </div>
          ) : <Empty>No founder profile yet. Run the Founder DNA interview below.</Empty>}
        </Card>
      </div>

      {factors.length > 0 && (
        <Card title="Top Success Factors" >
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="py-1 pr-3">Factor</th><th className="px-3">Repeat</th><th className="px-3">Scale</th><th className="px-3">Founder dep.</th><th className="px-3">Replication</th></tr>
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
        <Card title="Core Values → Operating Principles">
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
        <Card title="Operating Principles">
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
