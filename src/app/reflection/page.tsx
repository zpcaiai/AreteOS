import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Reflection" };
export const dynamic = "force-dynamic";

export default async function ReflectionPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const reflections = await prisma.reflection.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 20, include: { lessons: true } });
  return (
    <div>
      <PageHeader title={t("page.reflection.title")} subtitle={t("page.reflection.subtitle")} />
      <div className="space-y-4">
        {reflections.length ? reflections.map((r) => (
          <Card key={r.id} title={new Date(r.date).toLocaleDateString()}>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-emerald-400">Worked:</span> {r.worked || "—"}</p>
              <p><span className="text-rose-400">Failed:</span> {r.failed || "—"}</p>
              <p><span className="text-sky-400">Learned:</span> {r.learned || "—"}</p>
              <p><span className="text-amber-400">Reinforced:</span> {r.identityReinforced || "—"}</p>
            </div>
            {r.lessons.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm text-slate-300">{r.lessons.map((l) => <li key={l.id}>{l.text}</li>)}</ul>}
          </Card>
        )) : <Empty>{t("empty.no_reflections_yet_post_api_reflection")}</Empty>}
      </div>
    </div>
  );
}
