import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { habitConsistencyScore } from "@/lib/scoring";

export const metadata = { title: "Habits" };
export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const userId = await getUserId();
  const habits = await prisma.habit.findMany({
    where: { userId, active: true }, orderBy: { createdAt: "desc" },
    include: { logs: { where: { done: true, date: { gte: new Date(Date.now() - 30 * 86400000) } } } },
  });
  return (
    <div>
      <PageHeader title="Habits" subtitle="Habits are identity proofs, not tasks." />
      <div className="grid gap-5 lg:grid-cols-2">
        {habits.length ? habits.map((h) => {
          const target = (h.targetPerWeek * 30) / 7;
          return (
            <Card key={h.id} title={h.name}>
              <p className="text-sm text-slate-400">Proves: {h.identityProof || "—"}</p>
              <div className="mt-3"><ScoreBar label={`Consistency (30d, ${h.logs.length}/${Math.round(target)})`} value={habitConsistencyScore({ completions: h.logs.length, target })} /></div>
              <p className="mt-1 text-xs text-slate-500">Log via POST /api/habits/{h.id}/log</p>
            </Card>
          );
        }) : <Empty>No habits yet.</Empty>}
      </div>
    </div>
  );
}
