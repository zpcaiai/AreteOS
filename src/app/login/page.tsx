"use client";
import { useState } from "react";
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
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "register" ? { email, password, name } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("login.failed"));
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
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={t("login.name")} aria-label={t("login.name")} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" type="email" placeholder={t("login.email")} aria-label={t("login.email")} autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" type="password" placeholder={t("login.password")} aria-label={t("login.password")} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium disabled:opacity-50">
          {busy ? t("login.busy") : mode === "login" ? t("login.login") : t("login.register")}
        </button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 text-sm text-indigo-400">
        {mode === "login" ? t("login.toRegister") : t("login.toLogin")}
      </button>
    </div>
  );
}
