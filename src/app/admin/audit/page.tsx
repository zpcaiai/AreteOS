import { prisma } from "@/lib/db";
import { Card, Empty, PageHeader } from "@/components/ui";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("安全审计", "Security audit");

export default async function SecurityAuditPage() {
  const events = await prisma.securityAuditEvent.findMany({ orderBy: { occurredAt: "desc" }, take: 200 });
  return <div>
    <PageHeader title="安全审计 · Security audit" subtitle="特权、权限与破坏性操作的不可变证据；IP 仅保存密钥哈希。" />
    <Card title={`最近 ${events.length} 条事件`}>
      {!events.length ? <Empty>尚无安全审计事件。</Empty> : <div className="overflow-x-auto"><table className="w-full text-left text-xs">
        <thead className="text-slate-500"><tr><th className="p-2">时间</th><th className="p-2">操作</th><th className="p-2">目标</th><th className="p-2">操作者</th><th className="p-2">结果</th></tr></thead>
        <tbody>{events.map((event) => <tr key={event.id} className="border-t border-slate-800"><td className="whitespace-nowrap p-2 text-slate-400">{event.occurredAt.toISOString()}</td><td className="p-2 font-medium text-slate-200">{event.action}</td><td className="p-2 text-slate-400">{event.targetType}{event.targetId ? ` · ${event.targetId}` : ""}</td><td className="p-2 text-slate-500">{event.actorId ?? "anonymous"}</td><td className={event.outcome === "success" ? "p-2 text-emerald-400" : "p-2 text-rose-400"}>{event.outcome}</td></tr>)}</tbody>
      </table></div>}
    </Card>
  </div>;
}
