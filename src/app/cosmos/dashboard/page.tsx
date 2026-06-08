import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeWorldview } from "@/lib/cosmos/service";
import { Card, ScoreBar, PageHeader, Empty, Scoreboard } from "@/components/ui";

export const metadata = { title: "Worldview Dashboard" };

export const dynamic = "force-dynamic";

export default async function WorldviewDashboard() {
  const userId = await getUserId();
  const [health, profile, meaning, conflicts, principles, timeline] = await Promise.all([
    computeWorldview(userId),
    prisma.worldviewProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.meaningProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.assumptionConflict.findMany({ where: { userId }, orderBy: { severity: "desc" }, take: 10 }),
    prisma.lifePrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.worldviewEvolution.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
  ]);

  const board: [string, number][] = [
    ["Global worldview", health.globalWorldviewScore], ["Clarity", health.clarity], ["Coherence", health.coherence],
    ["Assumption awareness", health.assumptionAwareness], ["Meaning", health.meaningScore], ["Wisdom", health.wisdom],
  ];

  return (
    <div>
      <PageHeader title="Worldview Dashboard" subtitle="Clarity, coherence, meaning, conflicts and conscious evolution." />
      <Card title="Scoreboard"><Scoreboard rows={board} /></Card>

      {profile && (
        <Card title="Dimensions">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(["reality","humanNature","meaning","success","failure","responsibility","time","change","risk","purpose"] as const).map((d) => (
              <div key={d} className="rounded-lg bg-slate-800/60 p-2 text-center">
                <div className="text-lg font-bold tabular-nums">{Math.round((profile[d] as number) * 100)}</div>
                <div className="text-[10px] uppercase text-slate-500">{d}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {meaning && (
        <Card title="Meaning Profile">
          <div className="mt-1 space-y-2">
            <ScoreBar label="Work" value={meaning.work} /><ScoreBar label="Learning" value={meaning.learning} />
            <ScoreBar label="Relationships" value={meaning.relationships} /><ScoreBar label="Contribution" value={meaning.contribution} />
            <ScoreBar label="Mastery" value={meaning.mastery} /><ScoreBar label="Legacy" value={meaning.legacy} />
          </div>
        </Card>
      )}

      <Card title="Assumption ⚔ Value Conflicts">
        {conflicts.length ? (
          <ul className="space-y-2 text-sm">{conflicts.map((c) => (
            <li key={c.id} className="border-t border-slate-800 pt-2">
              <span className="font-medium text-amber-400">{c.valueOrGoal} ⚔ {c.assumption}</span>
              <span className="ml-2 text-xs text-slate-500">sev {Math.round(c.severity * 100)}</span>
              {c.resolution && <div className="text-xs text-emerald-400">Resolve: {c.resolution}</div>}
            </li>
          ))}</ul>
        ) : <Empty>No conflicts recorded.</Empty>}
      </Card>

      <Card title="Personal Principles">
        {principles.length ? <ul className="space-y-1 text-sm text-slate-300">{principles.map((p) => <li key={p.id} className="border-t border-slate-800 pt-1">{p.principle}</li>)}</ul> : <Empty>No principles distilled yet.</Empty>}
      </Card>

      <Card title="Evolution Timeline">
        {timeline.length ? <ul className="space-y-1 text-sm text-slate-300">{timeline.map((t) => <li key={t.id} className="flex justify-between border-t border-slate-800 pt-1"><span>{String(t.stage).replace(/_/g," ")} · {t.note}</span><span className="text-xs text-slate-600">{new Date(t.createdAt).toLocaleDateString()}</span></li>)}</ul> : <Empty>No evolution entries yet.</Empty>}
      </Card>
    </div>
  );
}
