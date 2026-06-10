import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { RefundButton } from "../AdminClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "订单" };

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const { t } = await getDict();
  const orders = await prisma.storeOrder.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div>
      <PageHeader title={t("page.admin.orders.title")} subtitle={t("page.admin.orders.subtitle")} />
      <Card title={`${orders.length} 笔订单`}>
        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="py-1 pr-3">商品</th><th className="px-3">金额</th><th className="px-3">状态</th><th className="px-3">用户</th><th className="px-3">时间</th><th className="px-3">操作</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-slate-800">
                    <td className="py-2 pr-3 text-slate-200">{o.productName}{o.quantity > 1 ? ` ×${o.quantity}` : ""}</td>
                    <td className="px-3 tabular-nums">¥{Number(o.amount)}</td>
                    <td className="px-3">{o.status === "COMPLETED" ? <span className="text-emerald-400">已完成</span> : o.status === "CANCELLED" ? <span className="text-slate-500">已取消</span> : <span className="text-amber-400">{o.status}</span>}</td>
                    <td className="px-3 text-xs text-slate-500">{o.userId.slice(0, 12)}…</td>
                    <td className="px-3 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-3"><RefundButton orderId={o.id} status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty>暂无订单</Empty>}
      </Card>
    </div>
  );
}
