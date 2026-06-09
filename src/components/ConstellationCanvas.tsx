"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { ConsNode } from "./Constellation";

const Scene = dynamic(() => import("./ConstellationScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading 3D scene…</div>
  ),
});

const GROUP_COLOR: Record<string, string> = {
  Foundation: "#0ea5e9", Direction: "#6366f1", Thinking: "#a855f7",
  Execution: "#10b981", Organization: "#f59e0b", Memory: "#ec4899", Value: "#eab308",
};

export default function ConstellationCanvas({ nodes, title }: { nodes: ConsNode[]; title?: string }) {
  const [selected, setSelected] = useState<ConsNode | null>(null);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      {title ? <h2 className="mb-2 text-lg font-bold">{title}</h2> : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="h-[480px] w-full overflow-hidden rounded-xl bg-[#060b18] lg:flex-1">
          <Scene nodes={nodes} onSelect={setSelected} selectedId={selected?.id ?? null} onMiss={() => setSelected(null)} />
        </div>
        <div className="w-full lg:w-64">
          {selected ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wide" style={{ color: GROUP_COLOR[selected.group] ?? "#64748b" }}>{selected.group}</div>
              <div className="mt-1 text-lg font-bold">{selected.label}</div>
              {selected.blurb ? <p className="mt-2 text-sm text-slate-400">{selected.blurb}</p> : null}
              {selected.href ? (
                <a href={selected.href} className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Open →</a>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-400">
              Drag to orbit · scroll to zoom · click a node to inspect. Each node is part of your development system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
