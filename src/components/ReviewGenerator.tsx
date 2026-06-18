"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/client";

const PERIODS = ["WEEKLY", "MONTHLY", "QUARTERLY"] as const;
const PERIOD_LABEL: Record<string, [string, string]> = {
  WEEKLY: ["生成每周回顾", "Generate weekly"],
  MONTHLY: ["生成每月回顾", "Generate monthly"],
  QUARTERLY: ["生成每季回顾", "Generate quarterly"],
};

export default function ReviewGenerator() {
  const router = useRouter();
  const T = useT();
  const [busy, setBusy] = useState("");
  async function gen(period: string) {
    setBusy(period);
    await fetch("/api/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ period }) });
    setBusy("");
    router.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map((p) => (
        <button key={p} onClick={() => gen(p)} disabled={!!busy}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
          {busy === p ? "…" : T(PERIOD_LABEL[p][0], PERIOD_LABEL[p][1])}
        </button>
      ))}
    </div>
  );
}
