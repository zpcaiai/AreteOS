import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";

export const metadata = { title: "Decisions" };
export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const userId = await getUserId();
  const decisions = await prisma.decision.findMany({
    where: { userId }, orderBy: { createdAt: "desc" },
    include: { options: true, reviews: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return (
    <div>
      <PageHeader title="Decisions" subtitle="Every decision scored on mission/identity/value fit, EV, 2nd-order, risk, reversibility, shadow motive." />
      <div className="space-y-4">
        {decisions.length ? decisions.map((d) => (
          <Card key={d.id} title={d.title}>
            <p className="text-sm text-slate-400">{d.context}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {d.options.map((o) => <span key={o.id} className={`rounded-full px-3 py-1 text-xs ${o.chosen ? "bg-emerald-700" : "bg-slate-800"}`}>{o.label}</span>)}
            </div>
            {d.quality != null && <div className="mt-3"><ScoreBar label="Decision Quality" value={d.quality} /></div>}
            {d.reviews[0]?.note && <p className="mt-1 text-sm text-slate-400">{d.reviews[0].note}</p>}
            <p className="mt-2 text-xs text-slate-500">Status: {d.status} · review via POST /api/decisions/{d.id}/review</p>
          </Card>
        )) : <Empty>No decisions yet.</Empty>}
      </div>
    </div>
  );
}
