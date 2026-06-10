import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { masteryScore } from "@/lib/scoring";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Mastery" };
export const dynamic = "force-dynamic";

export default async function MasteryPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const skills = await prisma.skill.findMany({ where: { userId }, include: { masteryLevel: true } });
  return (
    <div>
      <PageHeader title={t("page.mastery.title")} subtitle={t("page.mastery.subtitle")} />
      <div className="grid gap-5 lg:grid-cols-2">
        {skills.length ? skills.map((s) => {
          const m = s.masteryLevel;
          const score = m ? masteryScore({ knowledge: m.knowledge, execution: m.execution, problemSolving: m.problemSolving, teaching: m.teaching }) : 0;
          return (
            <Card key={s.id} title={`${s.name} · ${m?.stage ?? "NOVICE"}`}>
              <p className="text-xs text-slate-500">{s.domain}</p>
              <div className="mt-3"><ScoreBar label="Mastery" value={score} /></div>
              {m && <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs text-slate-400">
                <span>Knowledge {Math.round(m.knowledge*100)}</span><span>Execution {Math.round(m.execution*100)}</span>
                <span>Problem-solving {Math.round(m.problemSolving*100)}</span><span>Teaching {Math.round(m.teaching*100)}</span>
              </div>}
            </Card>
          );
        }) : <Empty>No skills tracked yet.</Empty>}
      </div>
    </div>
  );
}
