import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeChild } from "@/lib/genius/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import { ChildStudio } from "../ChildClient";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ChildDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { t } = await getDict();
  const userId = await getUserId();
  const { id } = await params;
  const child = await prisma.childProfile.findFirst({ where: { id, userId } });
  if (!child) notFound();

  const [health, questions, projects, env, coaching] = await Promise.all([
    computeChild(id),
    prisma.curiosityLog.findMany({ where: { childId: id }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.childProject.findMany({ where: { childId: id }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.learningEnvironment.findFirst({ where: { childId: id }, orderBy: { createdAt: "desc" } }),
    prisma.parentCoachingSession.findMany({ where: { childId: id }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <div>
      <Link href="/genius" className="text-sm text-indigo-400">← All children</Link>
      <PageHeader title={`${child.name} · Growth`} subtitle={`Age ${child.age}${child.primaryIdentity ? ` · ${child.primaryIdentity}${child.emergingIdentity ? ` → ${child.emergingIdentity}` : ""}` : ""}`} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_child_development_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.globalScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">Geometric mean — every capability counts.</p>
        </Card>
        <Card title={t("card.capabilities")}>
          <ScoreBar label="Explorer (curiosity)" value={health.explorer} />
          <ScoreBar label="Creator (creativity)" value={health.creator} />
          <ScoreBar label="Problem solver" value={health.problemSolver} />
        </Card>
        <Card title={t("card.character_support")}>
          <ScoreBar label="Resilience" value={health.resilience} />
          <ScoreBar label="Autonomy (agency)" value={health.autonomy} />
          <ScoreBar label="Growth mindset" value={health.growthMindset} />
          <ScoreBar label="Parent support" value={health.parentSupport} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.today_s_questions")}>
          {questions.length ? <ul className="space-y-1 text-sm text-slate-300">{questions.filter((q) => q.question).map((q) => <li key={q.id} className="border-t border-slate-800 pt-1">{q.question}</li>)}</ul> : <Empty>No questions logged yet.</Empty>}
        </Card>
        <Card title={t("card.projects_in_progress")}>
          {projects.length ? <ul className="space-y-1 text-sm text-slate-300">{projects.map((p) => <li key={p.id} className="border-t border-slate-800 pt-1">{p.title} <span className="text-xs text-slate-500">({p.status})</span></li>)}</ul> : <Empty>No projects yet.</Empty>}
        </Card>
      </div>

      {env && (
        <Card title={t("card.learning_environment_parent")}>
          <ScoreBar label="Environment quality" value={env.qualityScore} />
          {env.upgradePlan.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-400">{env.upgradePlan.map((u, i) => <li key={i}>{u}</li>)}</ul>}
        </Card>
      )}

      {coaching.length > 0 && (
        <Card title={t("card.parent_coaching")}>
          {coaching.map((c) => (
            <div key={c.id} className="border-t border-slate-800 pt-2 text-sm">
              <div className="font-medium text-indigo-300">{c.role}</div>
              {c.conversationScripts.length > 0 && <p className="text-xs text-slate-400">Try: {c.conversationScripts[0]}</p>}
            </div>
          ))}
        </Card>
      )}

      <div className="mt-6"><ChildStudio childId={id} age={child.age} /></div>
    </div>
  );
}
