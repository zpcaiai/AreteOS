import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader } from "@/components/ui";
import { AdaptForm } from "@/components/ExcellenceClient";
export const dynamic = "force-dynamic";

const SYS: Record<string, string> = { V: "Visual", A: "Auditory", K: "Kinesthetic", Ad: "Self-talk" };

export default async function ModelDetail({ params }: { params: Promise<{ id: string }> }) {
  await getUserId();
  const { id } = await params;
  const genius = await prisma.genius.findUnique({ where: { id }, include: { strategies: { orderBy: { createdAt: "asc" } } } });
  if (!genius) notFound();
  const s = genius.strategies[0];

  return (
    <div>
      <Link href="/models" className="text-sm text-indigo-400">← Library</Link>
      <PageHeader title={genius.name} subtitle={[genius.era, genius.domain].filter(Boolean).join(" · ")} />
      {!s ? <p className="text-sm text-slate-500">No blueprint yet.</p> : (
        <div className="space-y-4">
          <Card title={`Strategy · ${s.name}`}><p className="text-sm text-slate-300">{s.description}</p></Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Identity Blueprint"><p className="text-sm">{s.identity}</p></Card>
            <Card title="Belief Blueprint"><p className="text-sm">{s.beliefs}</p><p className="mt-1 text-xs text-slate-500">Values: {s.values}</p></Card>
            <Card title="Decision Blueprint">
              {s.tote ? (() => { const t = s.tote as { test: string; operate: string; testExit: string; exit: string }; return (
                <p className="text-sm">T.O.T.E. — Test: {t.test} · Operate: {t.operate} · Exit when: {t.testExit} → {t.exit}</p>
              ); })() : <p className="text-sm text-slate-500">—</p>}
              {s.highLeverage && <p className="mt-1 text-xs text-amber-300">High-leverage: {s.highLeverage}</p>}
            </Card>
            <Card title="Creative Blueprint">
              <p className="text-sm">{s.creativeProcess || "—"}</p>
              {Array.isArray(s.repSequence) && (
                <ol className="mt-2 space-y-1 text-sm">
                  {(s.repSequence as { step: number; system: string; description: string }[]).map((st) => (
                    <li key={st.step}><span className="mr-2 rounded bg-indigo-900/60 px-1.5 py-0.5 text-xs text-indigo-200">{st.system}·{SYS[st.system] ?? st.system}</span>{st.description}</li>
                  ))}
                </ol>
              )}
            </Card>
            <Card title="Learning Blueprint"><p className="text-sm">{s.learningProcess || "—"}</p><p className="mt-1 text-xs text-slate-500">Feedback: {s.feedbackProcess || "—"}</p></Card>
            <Card title="Failure Blueprint"><p className="text-sm text-rose-300">Shadow: {s.shadowPatterns || "—"}</p><p className="mt-1 text-sm text-rose-300">Failure modes: {s.failureModes || "—"}</p></Card>
          </div>

          <AdaptForm strategyId={s.id} />
        </div>
      )}
    </div>
  );
}
