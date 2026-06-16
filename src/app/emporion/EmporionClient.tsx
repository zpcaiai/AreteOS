"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/client";

type Product = { slug: string; name: string; description: string; kind: string; kindLabel: string; price: number; owned: boolean };

export default function EmporionClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const T = useT();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function buy(slug: string) {
    setBusy(slug); setError(""); setDone("");
    try {
      // 1) 下单
      const co = await fetch("/api/emporion/checkout", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, quantity: 1 }),
      }).then((r) => r.json());
      if (!co.order) throw new Error(co.error || T("下单失败", "Checkout failed"));
      // 2) 支付 → 即时发货完成(生产环境此步由支付网关回调完成)
      const pay = await fetch("/api/emporion/pay", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: co.order.id }),
      }).then((r) => r.json());
      if (!pay.order) throw new Error(pay.error || T("支付失败", "Payment failed"));
      setDone(pay.order.deliveryNote || T("已完成", "Done"));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-3 rounded bg-rose-950/50 px-3 py-1.5 text-sm text-rose-300">{error}</p>}
      {done && <p className="mb-3 rounded bg-emerald-950/40 px-3 py-1.5 text-sm text-emerald-300">✓ {done}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.slug} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold text-slate-100">{p.name}</div>
              <span className="shrink-0 rounded bg-indigo-950/60 px-1.5 py-0.5 text-[10px] text-indigo-300">{p.kindLabel}</span>
            </div>
            <p className="mt-1 flex-1 text-xs text-slate-400">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-bold tabular-nums">¥{p.price}</span>
              <button
                disabled={busy !== null || p.owned}
                onClick={() => buy(p.slug)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium ${p.owned ? "cursor-default bg-slate-800 text-slate-500" : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"}`}
              >
                {p.owned ? T("已拥有", "Owned") : busy === p.slug ? T("处理中…", "Processing…") : T("立即购买", "Buy now")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
