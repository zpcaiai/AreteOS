"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("正在验证邮箱…");
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!token) return setMessage("验证链接缺少令牌。");
    fetch("/api/auth/verify-email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => { if (!ok) setMessage(data.error || "验证失败"); else { setMessage("验证成功，正在进入工作区…"); setTimeout(() => router.push("/dashboard"), 700); } })
      .catch(() => setMessage("验证服务暂时不可用，请稍后重试。"));
  }, [router]);
  return <main className="mx-auto mt-24 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8"><h1 className="text-xl font-semibold">邮箱验证</h1><p role="status" className="mt-4 text-sm text-slate-300">{message}</p></main>;
}
