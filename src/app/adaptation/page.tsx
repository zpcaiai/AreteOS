import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { GeneratePathButton } from "@/components/ExcellenceClient";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("改编蓝图", "Adapted Blueprints");
export const dynamic = "force-dynamic";

export default async function AdaptationPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const adaptations = await prisma.blueprintAdaptation.findMany({
    where: { userId }, orderBy: { createdAt: "desc" }, include: { strategy: { include: { genius: true } }, paths: true },
  });
  return (
    <div>
      <PageHeader title={t("page.adaptation.title")} subtitle={t("page.adaptation.subtitle")} />
      {adaptations.length ? (
        <div className="space-y-4">
          {adaptations.map((a) => (
            <Card key={a.id} title={a.title}>
              <p className="text-xs text-slate-500">from {a.strategy.genius.name} · {a.strategy.name}</p>
              <p className="mt-2 text-sm">{a.summary}</p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-slate-800/60 p-2"><span className="text-xs uppercase text-slate-500">Identity</span><p>{a.identity}</p></div>
                <div className="rounded-lg bg-slate-800/60 p-2"><span className="text-xs uppercase text-slate-500">Beliefs</span><p>{a.beliefs}</p></div>
              </div>
              {Array.isArray(a.decisionRules) && (a.decisionRules as string[]).length > 0 && (
                <div className="mt-2"><span className="text-xs uppercase text-slate-500">Decision rules</span><ul className="list-disc pl-5 text-sm">{(a.decisionRules as string[]).map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              )}
              {Array.isArray(a.habits) && (a.habits as string[]).length > 0 && (
                <div className="mt-2"><span className="text-xs uppercase text-slate-500">Habits</span><ul className="list-disc pl-5 text-sm">{(a.habits as string[]).map((h, i) => <li key={i}>{h}</li>)}</ul></div>
              )}
              <div className="mt-3 flex items-center gap-3">
                {a.paths.length > 0 ? <span className="text-xs text-emerald-400">{a.paths.length} learning path(s) → see Learning Path</span> : <GeneratePathButton adaptationId={a.id} />}
              </div>
            </Card>
          ))}
        </div>
      ) : <Empty>{t("empty.no_adaptations_yet_go_to_the")}</Empty>}
    </div>
  );
}
