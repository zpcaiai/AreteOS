"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inviteToken, setInviteToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get("invite");
    const invitedEmail = params.get("email");
    if (invite) {
      setInviteToken(invite);
      setEmail(invitedEmail || "");
      setMode("register");
      setNotice("请设置密码以接受一次性邀请。");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "register" ? { email, password, name, acceptTerms, ...(inviteToken ? { inviteToken } : {}) } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("login.failed"));
      if (data.verificationRequired) {
        setNotice("账户已创建。请查收验证邮件后再登录。");
        setMode("login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <h1 className="text-2xl font-bold tracking-wide font-serif">ARETE</h1>
      <p className="mb-1 text-xs italic text-slate-500">{t("common.appTagline")}</p>
      <p className="mb-6 text-sm text-slate-400">{mode === "login" ? t("login.continue") : t("login.create")}</p>
      {inviteToken && <p className="mb-4 rounded-lg border border-indigo-800 bg-indigo-950/40 p-2 text-xs text-indigo-200">一次性团队邀请将在注册完成后自动加入对应工作区。</p>}
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={t("login.name")} aria-label={t("login.name")} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" type="email" placeholder={t("login.email")} aria-label={t("login.email")} autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" type="password" placeholder={mode === "register" ? "密码（至少 12 位）" : t("login.password")} aria-label={t("login.password")} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "register" ? 12 : 1} />
        {mode === "register" && <label className="flex items-start gap-2 text-xs leading-5 text-slate-400">
          <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required className="mt-1 accent-indigo-500" />
          <span>我已阅读并同意 <a href="/terms" className="text-indigo-300 hover:underline">服务条款</a> 与 <a href="/privacy" className="text-indigo-300 hover:underline">隐私政策</a>。</span>
        </label>}
        {notice && <p role="status" className="text-sm text-emerald-400">{notice}</p>}
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium disabled:opacity-50">
          {busy ? t("login.busy") : mode === "login" ? t("login.login") : t("login.register")}
        </button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 text-sm text-indigo-400">
        {mode === "login" ? t("login.toRegister") : t("login.toLogin")}
      </button>
      {mode === "login" && <a href="/forgot-password" className="float-right mt-4 text-sm text-slate-400 hover:text-indigo-300">忘记密码？</a>}
    </div>
  );
}
