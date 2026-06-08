"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inp = "rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm";

async function call(endpoint: string, body: unknown, method = "POST") {
  const res = await fetch(endpoint, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "操作失败");
  return json;
}

/** Inline grant on the users table. */
export function GrantInline({ userId }: { userId: string }) {
  const router = useRouter();
  const [tier, setTier] = useState<"PLUS" | "PRO">("PRO");
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function grant() {
    setBusy(true); setMsg("");
    try { await call("/api/admin/membership/grant", { userId, tier, days }); setMsg("✓"); router.refresh(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "失败"); }
    finally { setBusy(false); }
  }
  return (
    <span className="flex items-center gap-1">
      <select value={tier} onChange={(e) => setTier(e.target.value as "PLUS" | "PRO")} className={inp}><option>PRO</option><option>PLUS</option></select>
      <input type="number" min={1} value={days} onChange={(e) => setDays(parseInt(e.target.value) || 0)} className={`${inp} w-16`} />
      <button onClick={grant} disabled={busy} className="rounded bg-indigo-600 px-2 py-1 text-xs disabled:opacity-50">{busy ? "…" : "发放"}</button>
      {msg && <span className="text-xs text-emerald-400">{msg}</span>}
    </span>
  );
}

/** Refund/cancel an order. */
export function RefundButton({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (status === "CANCELLED") return <span className="text-xs text-slate-500">已取消</span>;
  async function refund() {
    if (!confirm("确认退款/取消该订单?")) return;
    setBusy(true);
    try { await call(`/api/admin/orders/${orderId}/refund`, {}); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "失败"); }
    finally { setBusy(false); }
  }
  return <button onClick={refund} disabled={busy} className="rounded bg-rose-900/60 px-2 py-1 text-xs text-rose-200 hover:bg-rose-900 disabled:opacity-50">{busy ? "…" : "退款/取消"}</button>;
}

type Product = { id: string; slug: string; name: string; kind: string; price: number; active: boolean; sortOrder: number };

/** Product admin: create + edit price + toggle active. */
export function ProductsAdmin({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ slug: "", name: "", kind: "CREDITS", price: 9.9, grantCredits: 100, grantDays: 0, grantTier: "PRO", grantContentKey: "" });

  async function create() {
    setError("");
    try {
      const body: Record<string, unknown> = { slug: form.slug, name: form.name, kind: form.kind, price: Number(form.price), sortOrder: initial.length + 1 };
      if (form.kind === "MEMBERSHIP_DAYS") { body.grantTier = form.grantTier; body.grantDays = Number(form.grantDays); }
      if (form.kind === "CREDITS") body.grantCredits = Number(form.grantCredits);
      if (form.kind === "CONTENT") body.grantContentKey = form.grantContentKey;
      await call("/api/admin/products", body);
      setForm({ ...form, slug: "", name: "" }); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "失败"); }
  }
  async function patch(id: string, data: Record<string, unknown>) {
    try { await call(`/api/admin/products/${id}`, data, "PATCH"); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "失败"); }
  }

  return (
    <div>
      <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="mb-2 text-sm font-semibold">新增商品</div>
        {error && <p className="mb-2 text-xs text-rose-400">{error}</p>}
        <div className="flex flex-wrap items-end gap-2">
          <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inp} />
          <input placeholder="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} />
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={inp}>
            <option value="MEMBERSHIP_DAYS">会员时长</option><option value="CREDITS">点数</option><option value="CONTENT">内容解锁</option>
          </select>
          <input type="number" step="0.1" placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={`${inp} w-20`} />
          {form.kind === "MEMBERSHIP_DAYS" && <><select value={form.grantTier} onChange={(e) => setForm({ ...form, grantTier: e.target.value })} className={inp}><option>PRO</option><option>PLUS</option></select><input type="number" placeholder="天数" value={form.grantDays} onChange={(e) => setForm({ ...form, grantDays: Number(e.target.value) })} className={`${inp} w-16`} /></>}
          {form.kind === "CREDITS" && <input type="number" placeholder="点数" value={form.grantCredits} onChange={(e) => setForm({ ...form, grantCredits: Number(e.target.value) })} className={`${inp} w-20`} />}
          {form.kind === "CONTENT" && <input placeholder="contentKey" value={form.grantContentKey} onChange={(e) => setForm({ ...form, grantContentKey: e.target.value })} className={inp} />}
          <button onClick={create} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm">新增</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500"><tr><th className="p-2">商品</th><th className="px-2">类型</th><th className="px-2">价格</th><th className="px-2">状态</th><th className="px-2">操作</th></tr></thead>
          <tbody>
            {initial.map((p) => (
              <tr key={p.id} className="border-t border-slate-800">
                <td className="p-2"><div className="text-slate-200">{p.name}</div><div className="text-xs text-slate-500">{p.slug}</div></td>
                <td className="px-2 text-xs">{p.kind}</td>
                <td className="px-2">
                  <input type="number" step="0.1" defaultValue={p.price} className={`${inp} w-20`} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.price) patch(p.id, { price: v }); }} />
                </td>
                <td className="px-2">{p.active ? <span className="text-emerald-400">在售</span> : <span className="text-slate-500">已下架</span>}</td>
                <td className="px-2"><button onClick={() => patch(p.id, { active: !p.active })} className="rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700">{p.active ? "下架" : "上架"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Standalone grant form (memberships page). */
export function GrantForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [tier, setTier] = useState<"PLUS" | "PRO">("PRO");
  const [days, setDays] = useState(30);
  const [msg, setMsg] = useState("");
  async function grant() {
    setMsg("");
    try { const j = await call("/api/admin/membership/grant", { userId, tier, days }); setMsg(`✓ 已发放,到期 ${new Date(j.membership.expiresAt).toLocaleDateString()}`); router.refresh(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "失败"); }
  }
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-slate-400">用户 ID<input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="usr_..." className={`block ${inp} w-64`} /></label>
        <select value={tier} onChange={(e) => setTier(e.target.value as "PLUS" | "PRO")} className={inp}><option>PRO</option><option>PLUS</option></select>
        <input type="number" min={1} value={days} onChange={(e) => setDays(parseInt(e.target.value) || 0)} className={`${inp} w-20`} /><span className="text-xs text-slate-500">天</span>
        <button onClick={grant} disabled={!userId} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm disabled:opacity-50">发放/续期</button>
      </div>
      {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}
      <p className="mt-2 text-xs text-slate-500">用户 ID 可在「用户」页复制,或直接在用户列表里就地发放。</p>
    </div>
  );
}

/** Generic delete (community moderation). */
export function DeleteButton({ endpoint, label = "删除", confirmText = "确认删除?" }: { endpoint: string; label?: string; confirmText?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!confirm(confirmText)) return;
    setBusy(true);
    try { await call(endpoint, {}, "DELETE"); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "失败"); }
    finally { setBusy(false); }
  }
  return <button onClick={del} disabled={busy} className="rounded bg-rose-900/60 px-2 py-0.5 text-xs text-rose-200 hover:bg-rose-900 disabled:opacity-50">{busy ? "…" : label}</button>;
}
