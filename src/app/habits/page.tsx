import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { habitConsistencyScore } from "@/lib/scoring";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("习惯", "Habits");
export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const habits = await prisma.habit.findMany({
    where: { userId, active: true }, orderBy: { createdAt: "desc" },
    include: { logs: { where: { done: true, date: { gte: new Date(Date.now() - 30 * 86400000) } } } },
  });
  return (
    <div>
      <PageHeader title={t("page.habits.title")} subtitle={t("page.habits.subtitle")} />
      <a href="/psychology" className="mb-4 block rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-950/50">New · Behavioral activation: adapt a stuck habit to your current energy (Green/Yellow/Red) → Psychology Studio</a>
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
        }) : <Empty>{t("empty.no_habits_yet")}</Empty>}
      </div>
    </div>
  );
}
