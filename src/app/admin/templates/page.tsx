import { prisma } from "@/lib/db";
import { Card, Empty, PageHeader } from "@/components/ui";
import { titleMeta } from "@/lib/i18n/metadata";
import { WORKSPACE_TEMPLATES } from "@/lib/project-foundry-catalog";

export const generateMetadata = titleMeta("模板反馈", "Template feedback");

export default async function TemplateFeedbackPage() {
  const [summary, recent] = await Promise.all([
    prisma.workspaceTemplateFeedback.groupBy({ by: ["templateId", "templateVersion"], _count: { _all: true }, _avg: { rating: true }, orderBy: { _count: { templateId: "desc" } } }),
    prisma.workspaceTemplateFeedback.findMany({ orderBy: { updatedAt: "desc" }, take: 100, select: { id: true, templateId: true, templateVersion: true, rating: true, outcome: true, comment: true, updatedAt: true } }),
  ]);
  const names = new Map(WORKSPACE_TEMPLATES.map((template) => [template.id, template.name.zh]));
  return <div>
    <PageHeader title="模板反馈 · Template feedback" subtitle="按模板版本审查真实评分、结果与改进意见。" />
    <Card title="版本表现">
      {!summary.length ? <Empty>尚无试用反馈。</Empty> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{summary.map((item) => <div key={`${item.templateId}:${item.templateVersion}`} className="rounded-xl border border-slate-800 p-3"><p className="text-sm font-medium text-slate-200">{names.get(item.templateId) ?? item.templateId}</p><p className="mt-1 text-xs text-slate-500">v{item.templateVersion} · {item._count._all} 份反馈</p><p className="mt-2 text-lg font-bold text-amber-300">{(item._avg.rating ?? 0).toFixed(1)} / 5</p></div>)}</div>}
    </Card>
    <div className="mt-5"><Card title="最近反馈">
      {!recent.length ? <Empty>尚无反馈。</Empty> : <ul className="space-y-3">{recent.map((item) => <li key={item.id} className="rounded-xl border border-slate-800 p-3"><div className="flex flex-wrap justify-between gap-2"><span className="text-sm text-slate-200">{names.get(item.templateId) ?? item.templateId} · v{item.templateVersion}</span><span className="text-sm text-amber-300">{item.rating}/5 · {item.outcome}</span></div>{item.comment && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">{item.comment}</p>}<time className="mt-2 block text-[11px] text-slate-600">{item.updatedAt.toISOString()}</time></li>)}</ul>}
    </Card></div>
  </div>;
}
