import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { StackTool } from "../IdentityClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Identity Stack" };

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [stack, recs] = await Promise.all([
    prisma.userIdentityStack.findMany({ where: { userId, active: true }, orderBy: { createdAt: "asc" } }),
    prisma.identityRecommendation.findMany({ where: { userId }, orderBy: { fitScore: "desc" }, take: 8 }),
  ]);
  return (
    <div>
      <PageHeader title={t("page.ethos.stack.title")} subtitle={t("page.ethos.stack.subtitle")} />
      <StackTool />
      <Card title={t("card.current_stack")}>
        {stack.length ? (
          <div className="space-y-2 text-sm">
            {stack.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span><span className="font-semibold text-slate-100">{s.archetypeName}</span> <span className="ml-2 text-xs text-indigo-300">{s.role}</span></span>
                <span className="text-xs text-slate-400">{s.stage}</span>
              </div>
            ))}
          </div>
        ) : <Empty>{t("empty.no_stack_yet_build_one_above")}</Empty>}
      </Card>
      {recs.length > 0 && (
        <Card title={t("card.recommended_identities")}>
          <ul className="space-y-2 text-sm">
            {recs.map((r) => (
              <li key={r.id} className="border-t border-slate-800 pt-2">
                <span className="font-medium text-slate-100">{r.archetypeName}</span>
                <span className="ml-2 text-xs text-emerald-400">fit {Math.round(r.fitScore * 100)}</span>
                <div className="text-xs text-slate-400">{r.rationale}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
