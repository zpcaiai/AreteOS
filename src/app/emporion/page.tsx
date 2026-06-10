import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEntitlements } from "@/lib/emporion/service";
import { Card, PageHeader, Empty, StatGrid } from "@/components/ui";
import EmporionClient from "./EmporionClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Emporion · 商店" };

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  MEMBERSHIP_DAYS: "会员时长", CREDITS: "点数", CONTENT: "内容解锁",
};

export default async function EmporionPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [products, orders, ent] = await Promise.all([
    prisma.virtualProduct.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { price: "asc" }] }),
    prisma.storeOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 12 }),
    getEntitlements(userId),
  ]);

  return (
    <div>
      <PageHeader title={t("page.emporion.title")} subtitle={t("page.emporion.subtitle")} />

      <Card title="我的资产">
        <StatGrid items={[
          { value: ent.credits, label: "点数余额" },
          { value: ent.unlockedKeys.length, label: "已解锁内容" },
          { value: orders.filter((o) => o.status === "COMPLETED").length, label: "已完成订单" },
        ]} />
      </Card>

      <Card title="商品">
        {products.length ? (
          <EmporionClient products={products.map((p) => ({
            slug: p.slug, name: p.name, description: p.description,
            kind: p.kind, kindLabel: KIND_LABEL[p.kind] ?? p.kind, price: Number(p.price),
            owned: p.kind === "CONTENT" && ent.unlockedKeys.includes(p.grantContentKey),
          }))} />
        ) : <Empty>暂无商品 — 运行 <code>npm run db:seed</code> 加载商品目录。</Empty>}
      </Card>

      <Card title="我的订单">
        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="py-1 pr-3">商品</th><th className="px-3">金额</th><th className="px-3">状态</th><th className="px-3">发货</th><th className="px-3">时间</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-slate-800">
                    <td className="py-2 pr-3 text-slate-200">{o.productName}{o.quantity > 1 ? ` ×${o.quantity}` : ""}</td>
                    <td className="px-3 tabular-nums">¥{Number(o.amount)}</td>
                    <td className="px-3">
                      {o.status === "COMPLETED" ? <span className="text-emerald-400">已完成</span>
                        : o.status === "CREATED" ? <span className="text-amber-400">待支付</span>
                        : <span className="text-slate-500">{o.status}</span>}
                    </td>
                    <td className="px-3 text-xs text-slate-400">{o.deliveryNote || "—"}</td>
                    <td className="px-3 text-xs text-slate-600">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty>还没有订单。</Empty>}
      </Card>

      <p className="mt-4 text-xs text-slate-500">
        演示环境为模拟支付:点击「立即购买」即下单并完成支付与发货。接入支付宝/微信支付后,由验签后的支付回调触发同一履约逻辑(幂等)。
      </p>
    </div>
  );
}
