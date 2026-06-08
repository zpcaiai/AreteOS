"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PERIODS = ["WEEKLY", "MONTHLY", "QUARTERLY"] as const;

export default function ReviewGenerator() {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  async function gen(period: string) {
    setBusy(period);
    await fetch("/api/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ period }) });
    setBusy("");
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      {PERIODS.map((p) => (
        <button key={p} onClick={() => gen(p)} disabled={!!busy}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
          {busy === p ? "…" : `Generate ${p.toLowerCase()}`}
        </button>
      ))}
    </div>
  );
}
