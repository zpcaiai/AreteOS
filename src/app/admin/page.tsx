import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { overview } from "@/lib/admin/service";
import { telemetrySummary } from "@/lib/telemetry";
import { clinicalSafetyGate, expertReviewStatus } from "@/lib/clinical/review-registry";
import { Card, PageHeader, StatGrid, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("总览", "Overview");

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { t } = await getDict();
  const o = await overview();
  const funnel = await telemetrySummary(7);
  const clinicalGate = clinicalSafetyGate();
  const clinicalReview = expertReviewStatus();
  return (
    <div>
      <PageHeader title={t("page.admin.title")} subtitle={t("page.admin.subtitle")} />
      <Card title={t("card.key_metrics")}>
        <StatGrid items={[
          { value: o.users, label: "用户" },
          { value: o.ordersDone, label: "完成订单" },
          { value: `¥${o.revenue}`, label: "累计收入" },
          { value: o.productsActive, label: "在售商品" },
          { value: o.posts, label: "社区帖子" },
        ]} />
      </Card>
      <Card title="产品漏斗 · 近 7 天 (Product funnel · last 7d)">
        <StatGrid items={[
          { value: `${Math.round(funnel.activationRate * 100)}%`, label: "激活率 Activation" },
          { value: funnel.activatedUsers, label: "已激活 Activated" },
          { value: funnel.weeklyActiveUsers, label: "周活跃 WAU" },
          { value: funnel.knownUsers, label: "已埋点用户 Tracked" },
        ]} />
        {funnel.topEvents.length ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            {funnel.topEvents.map((e) => (
              <span key={e.name}><span className="text-slate-300">{e.name}</span> <span className="tabular-nums">{e.count}</span></span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">尚无事件 —— 运行数据库迁移后开始采集。No events yet — starts collecting after the migration runs.</p>
        )}
      </Card>
      <Card title={t("card.membership_distribution")}>
        <div className="flex gap-6 text-sm">
          {["FREE", "PLUS", "PRO"].map((t) => (
            <div key={t}><span className="text-slate-400">{t}</span> <span className="font-bold tabular-nums">{o.tiers[t] ?? 0}</span></div>
          ))}
        </div>
      </Card>
      <Card title="临床复核 · Clinical review">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div><span className="text-slate-400">安全基线门禁 Safety gate</span> <span className={clinicalGate.ok ? "font-bold text-emerald-400" : "font-bold text-rose-400"}>{clinicalGate.ok ? "PASS" : "FAIL"}</span> <span className="text-xs text-slate-500">({clinicalGate.checked} modules)</span></div>
          <div><span className="text-slate-400">专家签核 Expert sign-off</span> <span className="font-bold tabular-nums text-slate-200">{clinicalReview.reviewed}/{clinicalReview.clinicalModules}</span> <span className="text-xs text-slate-500">({Math.round(clinicalReview.coverage * 100)}%)</span></div>
        </div>
        {clinicalReview.pendingKeys.length ? (
          <p className="mt-2 text-xs text-slate-500">待复核 Pending: {clinicalReview.pendingKeys.join(", ")}</p>
        ) : null}
      </Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.recent_orders")}>
          {o.recentOrders.length ? (
            <ul className="space-y-1 text-sm">
              {o.recentOrders.map((r) => (
                <li key={r.id} className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300">{r.productName}</span>
                  <span className={r.status === "COMPLETED" ? "text-emerald-400" : "text-amber-400"}>¥{Number(r.amount)} · {r.status}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>{t("empty.no_orders_yet")}</Empty>}
          <Link href="/admin/orders" className="mt-2 inline-block text-xs text-indigo-400">全部订单 →</Link>
        </Card>
        <Card title={t("card.recent_signups")}>
          {o.recentUsers.length ? (
            <ul className="space-y-1 text-sm">
              {o.recentUsers.map((u) => (
                <li key={u.id} className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300">{u.name || u.email}</span>
                  <span className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>{t("empty.no_users_yet")}</Empty>}
          <Link href="/admin/users" className="mt-2 inline-block text-xs text-indigo-400">全部用户 →</Link>
        </Card>
      </div>
    </div>
  );
}
