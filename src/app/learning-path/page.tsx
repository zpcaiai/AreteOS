import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { StepToggle } from "@/components/ExcellenceClient";

export const metadata = { title: "Excellence Learning Loop" };
export const dynamic = "force-dynamic";

export default async function LearningPathPage() {
  const userId = await getUserId();
  const paths = await prisma.learningPath.findMany({
    where: { userId }, orderBy: { createdAt: "desc" }, include: { steps: { orderBy: { order: "asc" } } },
  });
  return (
    <div>
      <PageHeader title="Excellence Learning Loop" subtitle="Observe → Imitate → Practice → Internalize → Adapt → Create → Teach." />
      {paths.length ? (
        <div className="space-y-4">
          {paths.map((p) => {
            const done = p.steps.filter((s) => s.done).length;
            return (
              <Card key={p.id} title={p.title}>
                <div className="mb-3"><ScoreBar label={`Progress (${done}/${p.steps.length})`} value={p.steps.length ? done / p.steps.length : 0} /></div>
                <ul className="space-y-2">
                  {p.steps.map((s) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <StepToggle stepId={s.id} done={s.done} />
                      <div>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">{s.stage}</span>
                        <span className={`ml-2 text-sm ${s.done ? "text-slate-500 line-through" : ""}`}>{s.action}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      ) : <Empty>No learning paths yet. Create an adaptation, then "Generate learning path".</Empty>}
    </div>
  );
}
