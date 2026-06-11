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
          <ScoreBar label={t("score.explorer_curiosity")} value={health.explorer} />
          <ScoreBar label={t("score.creator_creativity")} value={health.creator} />
          <ScoreBar label={t("score.problem_solver")} value={health.problemSolver} />
        </Card>
        <Card title={t("card.character_support")}>
          <ScoreBar label={t("score.resilience")} value={health.resilience} />
          <ScoreBar label={t("score.autonomy_agency")} value={health.autonomy} />
          <ScoreBar label={t("score.growth_mindset")} value={health.growthMindset} />
          <ScoreBar label={t("score.parent_support")} value={health.parentSupport} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.today_s_questions")}>
          {questions.length ? <ul className="space-y-1 text-sm text-slate-300">{questions.filter((q) => q.question).map((q) => <li key={q.id} className="border-t border-slate-800 pt-1">{q.question}</li>)}</ul> : <Empty>{t("empty.no_questions_logged_yet")}</Empty>}
        </Card>
        <Card title={t("card.projects_in_progress")}>
          {projects.length ? <ul className="space-y-1 text-sm text-slate-300">{projects.map((p) => <li key={p.id} className="border-t border-slate-800 pt-1">{p.title} <span className="text-xs text-slate-500">({p.status})</span></li>)}</ul> : <Empty>{t("empty.no_projects_yet")}</Empty>}
        </Card>
      </div>

      {env && (
        <Card title={t("card.learning_environment_parent")}>
          <ScoreBar label={t("score.environment_quality")} value={env.qualityScore} />
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
