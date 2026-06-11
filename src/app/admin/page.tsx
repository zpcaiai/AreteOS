import Link from "next/link";
import { overview } from "@/lib/admin/service";
import { Card, PageHeader, StatGrid, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "总览" };

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { t } = await getDict();
  const o = await overview();
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
      <Card title={t("card.membership_distribution")}>
        <div className="flex gap-6 text-sm">
          {["FREE", "PLUS", "PRO"].map((t) => (
            <div key={t}><span className="text-slate-400">{t}</span> <span className="font-bold tabular-nums">{o.tiers[t] ?? 0}</span></div>
          ))}
        </div>
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
