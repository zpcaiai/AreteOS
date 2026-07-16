"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      setMessage(response.ok ? data.message : data.error || "请求失败");
    } finally { setBusy(false); }
  }
  return <main className="mx-auto mt-24 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
    <h1 className="text-xl font-semibold">重置密码</h1>
    <p className="mt-2 text-sm text-slate-400">输入注册邮箱。若账户存在，我们会发送一次性重置链接。</p>
    <form onSubmit={submit} className="mt-5 space-y-3">
      <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="邮箱" />
      <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm disabled:opacity-50">{busy ? "发送中…" : "发送重置链接"}</button>
    </form>
    {message && <p role="status" className="mt-4 text-sm text-slate-300">{message}</p>}
    <a href="/login" className="mt-5 inline-block text-sm text-indigo-300">返回登录</a>
  </main>;
}
