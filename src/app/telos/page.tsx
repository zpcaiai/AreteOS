import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";

export const metadata = { title: "Mission" };
export const dynamic = "force-dynamic";

export default async function MissionPage() {
  const userId = await getUserId();
  const [missions, visions, themes, constitution] = await Promise.all([
    prisma.mission.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.vision.findMany({ where: { userId } }),
    prisma.lifeTheme.findMany({ where: { userId } }),
    prisma.constitution.findMany({ where: { userId }, orderBy: { rank: "asc" } }),
  ]);
  return (
    <div>
      <PageHeader title="Mission" subtitle="Why do I exist? What contribution do I want to make?" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Mission">
          {missions.length ? missions.map((m) => <p key={m.id} className="text-lg">{m.statement}</p>) : <Empty>Define your mission via POST /api/telos</Empty>}
        </Card>
        <Card title="Vision">
          {visions.length ? visions.map((v) => <p key={v.id} className="text-slate-300">{v.statement} <span className="text-xs text-slate-500">({v.horizon})</span></p>) : <Empty>No vision yet.</Empty>}
        </Card>
        <Card title="Life Themes">
          <div className="flex flex-wrap gap-2">{themes.map((t) => <span key={t.id} className="rounded-full bg-slate-800 px-3 py-1 text-sm">{t.name}</span>)}</div>
        </Card>
        <Card title="Personal Constitution">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">{constitution.map((c) => <li key={c.id}>{c.article}</li>)}</ol>
        </Card>
      </div>
    </div>
  );
}
