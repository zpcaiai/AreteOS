"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTx } from "@/lib/i18n/client";

type Mode = "text" | "scenario" | "answers";

export default function AnalyzeBox({ endpoint, mode, placeholder, button }: { endpoint: string; mode: Mode; placeholder: string; button: string }) {
  const router = useRouter();
  const tx = useTx();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function bodyFor(t: string) {
    if (mode === "text") return { text: t };
    if (mode === "scenario") return { scenario: t };
    return { answers: [{ question: "self-report", answer: t }] };
  }

  async function run() {
    if (!text.trim()) return;
    setBusy(true); setError("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(bodyFor(text)) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setText("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={tx(placeholder)} rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      <button onClick={run} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
        {busy ? tx("Analyzing…") : tx(button)}
      </button>
    </div>
  );
}
