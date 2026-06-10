import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, Line } from "@/components/ui";
import { EVOLUTION_STAGES } from "@/lib/domain/enums";
import GrowthReplay from "@/components/GrowthReplay";

export const metadata = { title: "Growth Timeline" };
export const dynamic = "force-dynamic";

const TRACK_KINDS = [
  ["GROWTH", "Growth", "#6366f1"], ["IDENTITY_ALIGNMENT", "Identity", "#0ea5e9"],
  ["DECISION_QUALITY", "Decisions", "#f59e0b"], ["HABIT_CONSISTENCY", "Habits", "#10b981"],
] as const;

export default async function TimelinePage() {
  const userId = await getUserId();
  const [snapshots, identityScores, transitions, personality, firstEvent] = await Promise.all([
    prisma.scoreSnapshot.findMany({ where: { userId }, orderBy: { date: "asc" } }),
    prisma.identityScore.findMany({ where: { identity: { userId } }, include: { identity: { select: { name: true } } }, orderBy: { date: "asc" } }),
    prisma.personalityTransition.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.personalityState.findUnique({ where: { userId } }),
    prisma.domainEvent.findFirst({ where: { userId }, orderBy: { occurredAt: "asc" }, select: { occurredAt: true } }),
  ]);

  const byKind = (kind: string) => snapshots.filter((s) => s.kind === kind).map((s) => s.value);
  const byIdentity = new Map<string, number[]>();
  for (const s of identityScores) {
    const name = s.identity.name;
    byIdentity.set(name, [...(byIdentity.get(name) ?? []), s.alignment]);
  }
  const currentStage = personality?.stage ?? "UNAWARE";
  const currentIdx = EVOLUTION_STAGES.indexOf(currentStage as never);

  return (
    <div>
      <PageHeader title="Growth Timeline" subtitle="Score trends, personality evolution, and identity history over time." />

      <div className="grid gap-5 lg:grid-cols-2">
        {TRACK_KINDS.map(([kind, label, color]) => {
          const vals = byKind(kind);
          return (
            <Card key={kind} title={label}>
              {vals.length > 1 ? <Line values={vals} color={color} /> : <Empty>Not enough history.</Empty>}
            </Card>
          );
        })}
      </div>

      <div className="mt-5">
        <Card title="Personality Evolution">
          <div className="flex flex-wrap items-center gap-2">
            {EVOLUTION_STAGES.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs ${i <= currentIdx ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>{s}</span>
                {i < EVOLUTION_STAGES.length - 1 && <span className="text-slate-600">→</span>}
              </div>
            ))}
          </div>
          {transitions.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-slate-400">
              {transitions.map((t) => (
                <li key={t.id}>{new Date(t.createdAt).toLocaleDateString()}: {t.fromStage} → {t.toStage} {t.reason && `(${t.reason})`}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Growth Replay (event sourcing)">
          <GrowthReplay firstEventAt={firstEvent?.occurredAt.toISOString() ?? null} />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Identity Evolution (alignment over time)">
          {byIdentity.size ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {[...byIdentity.entries()].map(([name, vals]) => (
                <div key={name}>
                  <div className="mb-1 text-sm font-medium">{name}</div>
                  {vals.length > 1 ? <Line values={vals} color="#a855f7" /> : <Empty>One data point so far.</Empty>}
                </div>
              ))}
            </div>
          ) : <Empty>No identity alignment history yet.</Empty>}
        </Card>
      </div>
    </div>
  );
}
