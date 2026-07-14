"use client";

// The "Today" surface — the smallest possible loop. Ask how much time and energy the
// user has, then commit them to exactly ONE next action (reused from the prescription/
// bottleneck engine). Deliberately narrow so the 100+ route library never competes with
// the user's immediate intent. Instrumented with product telemetry (today_action).

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi } from "@/lib/hooks";
import { useT } from "@/lib/i18n/client";
import { track } from "@/lib/client/telemetry";

interface NextAction { action: string; source: string; href: string }

const MINUTES = [5, 25, 60] as const;
type Minutes = (typeof MINUTES)[number];
const ENERGY = ["low", "med", "high"] as const;
type Energy = (typeof ENERGY)[number];

export default function TodayClient() {
  const T = useT();
  const q = useApi<{ next: NextAction }>("/api/next-action");
  const [minutes, setMinutes] = useState<Minutes>(25);
  const [energy, setEnergy] = useState<Energy>("med");
  const n = q.data?.next;

  const scope =
    minutes === 5
      ? T("缩到最小的一步：只做能在 5 分钟内真正完成的那一点。", "Shrink to the smallest step — only what truly fits in 5 minutes.")
      : minutes === 25
        ? T("一个专注区块：完成一个清晰、完整的小结果。", "One focused block — finish one clear, complete outcome.")
        : T("深度投入：推进到一个真实的里程碑。", "Deep session — push to a real milestone.");
  const energyHint =
    energy === "low"
      ? T("精力低：选择机械、低决策的一步，先积累动量。", "Low energy — pick a mechanical, low-decision step to build momentum.")
      : energy === "high"
        ? T("精力高：把它用在最难、最有杠杆的一步上。", "High energy — spend it on the hardest, highest-leverage step.")
        : T("精力中等：稳定推进一个明确的小结果。", "Medium energy — steadily advance one clear outcome.");

  const start = () => {
    track("today_action", { minutes, energy, source: n?.source, action: "start" });
  };
  const done = () => {
    track("today_action", { minutes, energy, source: n?.source, action: "done" });
  };

  return (
    <div>
      <PageHeader
        title={T("今天", "Today")}
        subtitle={T("你有多少时间和精力？然后只做一件事。", "How much time and energy do you have? Then do one thing.")}
      />

      <Card title={T("1 · 你现在有多少时间？", "1 · How much time now?")}>
        <div className="flex flex-wrap gap-2">
          {MINUTES.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              aria-pressed={minutes === m}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${minutes === m ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              {m} {T("分钟", "min")}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-4">
        <Card title={T("2 · 你现在的精力？", "2 · Your energy now?")}>
          <div className="flex flex-wrap gap-2">
            {ENERGY.map((e) => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                aria-pressed={energy === e}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${energy === e ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
              >
                {e === "low" ? T("低", "Low") : e === "med" ? T("中", "Medium") : T("高", "High")}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{energyHint}</p>
        </Card>
      </div>

      <div className="mt-4">
        <Card title={T("3 · 你唯一要做的一件事", "3 · Your one thing")} accent="#10b981">
          {q.isPending ? (
            <p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p>
          ) : n && n.action ? (
            <div>
              <p className="text-base font-medium text-slate-100">{n.action}</p>
              <p className="mt-1 text-xs text-emerald-300/90">{scope}</p>
              {n.source && <p className="mt-0.5 text-xs text-slate-500">{T("来自", "from")}: {n.source}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={n.href}
                  onClick={start}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  {T("开始 →", "Start →")}
                </a>
                <button
                  onClick={done}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  {T("标记完成", "Mark done")}
                </button>
              </div>
            </div>
          ) : (
            <a href="/onboarding" className="block">
              <p className="text-base font-medium text-slate-100">{T("先跑一次首启闭环，得到你的第一个下一步 →", "Run the first-loop to get your first next action →")}</p>
            </a>
          )}
        </Card>
      </div>
    </div>
  );
}
