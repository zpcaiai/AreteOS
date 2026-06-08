import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

function List({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}

export default async function ArchetypeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.identityArchetype.findFirst({ where: { OR: [{ id }, { slug: id }] }, include: { family: true } });
  if (!a) notFound();

  return (
    <div>
      <Link href={`/ethos/archetypes?family=${a.family.slug}`} className="text-sm text-indigo-400">← {a.family.name}</Link>
      <PageHeader title={a.name} subtitle={a.identityStatement} />

      <Card title="Mission">
        <p className="text-sm text-slate-200">{a.mission}</p>
        <p className="mt-2 text-xs text-slate-500">Legacy: {a.legacyExpression}</p>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Core Values & Beliefs">
          <div className="space-y-3"><List title="Values" items={a.values} /><List title="Beliefs" items={a.beliefs} /></div>
        </Card>
        <Card title="Mental Models & Decision Rules">
          <div className="space-y-3"><List title="Mental models" items={a.mentalModels} /><List title="Decision rules" items={a.decisionRules} /></div>
        </Card>
        <Card title="Habits & Capabilities">
          <div className="space-y-3"><List title="Habits" items={a.habits} /><List title="Capabilities" items={a.capabilities} /></div>
        </Card>
        <Card title="Shadows & Failure Modes">
          <div className="space-y-3"><List title="Shadow patterns" items={a.shadowPatterns} /><List title="Failure modes" items={a.failureModes} /></div>
        </Card>
      </div>

      <Card title="Growth Path">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">{a.growthPath.map((g, i) => <li key={i}>{g}</li>)}</ol>
      </Card>
    </div>
  );
}
