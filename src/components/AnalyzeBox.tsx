"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

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
      <SuggestionField
        value={text}
        onChange={setText}
        placeholder={tx(placeholder)}
        rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        chipLabel={tx("可选样例")}
        suggestions={[
          tx("我想把一个长期目标拆成今天能完成的最小行动。"),
          tx("我在多个选择之间摇摆，需要识别真正的约束。"),
          tx("我刚完成一件事，想沉淀成可复用的经验。"),
        ]}
      />
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      <button onClick={run} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
        {busy ? tx("Analyzing…") : tx(button)}
      </button>
    </div>
  );
}
