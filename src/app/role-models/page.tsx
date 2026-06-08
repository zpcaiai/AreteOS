import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";

export const metadata = { title: "Role Models" };
export const dynamic = "force-dynamic";

export default async function RoleModelsPage() {
  const userId = await getUserId();
  const models = await prisma.roleModel.findMany({
    where: { userId }, orderBy: { createdAt: "desc" },
    include: { identityPatterns: true, decisionPatterns: true, habitPatterns: true },
  });
  return (
    <div>
      <PageHeader title="Role Models" subtitle="Excellence Blueprints (Dilts): identity, values, mental models, decision rules, habits." />
      <div className="space-y-4">
        {models.length ? models.map((m) => (
          <Card key={m.id} title={`${m.person} · ${m.archetype}`}>
            <p className="text-sm text-slate-400">Values: {m.values}</p>
            <p className="text-sm text-slate-400">Beliefs: {m.beliefs}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
              <div><div className="text-xs uppercase text-slate-500">Identity</div>{m.identityPatterns.map((p) => <p key={p.id}>{p.pattern}</p>)}</div>
              <div><div className="text-xs uppercase text-slate-500">Decision rules</div>{m.decisionPatterns.map((p) => <p key={p.id}>· {p.rule}</p>)}</div>
              <div><div className="text-xs uppercase text-slate-500">Habits</div>{m.habitPatterns.map((p) => <p key={p.id}>· {p.habit}</p>)}</div>
            </div>
          </Card>
        )) : <Empty>No role models yet. POST /api/modeling with {`{"person":"Charlie Munger"}`} (runs ExcellenceModeler).</Empty>}
      </div>
    </div>
  );
}
