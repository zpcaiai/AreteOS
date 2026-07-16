"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => setToken(new URLSearchParams(window.location.search).get("token") || ""), []);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, password }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "链接无效");
    setMessage("密码已更新，正在返回登录页…");
    setTimeout(() => router.push("/login"), 800);
  }
  return <main className="mx-auto mt-24 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
    <h1 className="text-xl font-semibold">设置新密码</h1>
    <form onSubmit={submit} className="mt-5 space-y-3">
      <input type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="新密码（至少 12 位）" />
      <button disabled={!token} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm disabled:opacity-50">更新密码</button>
    </form>
    {message && <p role="status" className="mt-4 text-sm text-slate-300">{message}</p>}
  </main>;
}
