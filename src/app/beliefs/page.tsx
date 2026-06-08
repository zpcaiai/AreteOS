import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import AnalyzeBox from "@/components/AnalyzeBox";

export const metadata = { title: "Beliefs" };
export const dynamic = "force-dynamic";

export default async function BeliefsPage() {
  const userId = await getUserId();
  const beliefs = await prisma.belief.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { limiting: true, reframes: true } });
  return (
    <div>
      <PageHeader title="Beliefs" subtitle="Identify limiting beliefs and reframe them into empowering, actionable ones." />
      <div className="mb-5"><AnalyzeBox endpoint="/api/beliefs" mode="text" placeholder="Write a worry or a 'I can't because…' thought. e.g. 我年龄太大了，不适合转型。" button="Analyze & reframe" /></div>
      <div className="space-y-3">
        {beliefs.length ? beliefs.map((b) => (
          <Card key={b.id} title={b.type}>
            <p className="text-sm">{b.statement}</p>
            {b.limiting?.cost && <p className="mt-1 text-xs text-rose-400">Cost: {b.limiting.cost}</p>}
            {b.reframes.map((r) => (
              <div key={r.id} className="mt-2 rounded-lg bg-slate-800/60 p-3 text-sm">
                <p className="text-emerald-400">Reframe: {r.reframedText}</p>
                {r.empoweringText && <p className="mt-1">{r.empoweringText}</p>}
                {r.action && <p className="mt-1 text-xs text-slate-400">Action: {r.action}</p>}
              </div>
            ))}
          </Card>
        )) : <Empty>No beliefs analyzed yet.</Empty>}
      </div>
    </div>
  );
}
