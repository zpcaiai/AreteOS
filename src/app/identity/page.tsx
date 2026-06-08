import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";

export const metadata = { title: "Identity" };
export const dynamic = "force-dynamic";

export default async function IdentityPage() {
  const userId = await getUserId();
  const identities = await prisma.identity.findMany({ where: { userId }, include: { roles: true, scores: { orderBy: { date: "desc" }, take: 1 } } });
  return (
    <div>
      <PageHeader title="Identity" subtitle="Who am I becoming? Behavior follows identity." />
      <div className="grid gap-5 lg:grid-cols-2">
        {identities.length ? identities.map((i) => (
          <Card key={i.id} title={i.name}>
            <p className="text-slate-300">{i.statement || "—"}</p>
            <div className="mt-3"><ScoreBar label="Clarity" value={i.clarity} /></div>
            {i.scores[0] && <ScoreBar label="Alignment" value={i.scores[0].alignment} />}
            {i.roles.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{i.roles.map((r) => <span key={r.id} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">{r.name}</span>)}</div>}
          </Card>
        )) : <Empty>No identities yet.</Empty>}
      </div>
    </div>
  );
}
