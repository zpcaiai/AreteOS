"use client";

// Deterministic what-if simulator: move the sliders, see the projected growth
// curve recompute from the same pure scoring math the live system uses.

import { useState } from "react";
import { useApiMutation } from "@/lib/hooks";

interface Point { day: number; growth: number }
interface Simulation {
  horizonDays: number;
  baseline: { growth: number };
  projected: { growth: number };
  delta: number;
  curve: Point[];
  notes: string[];
}

const LEVERS: { key: string; label: string }[] = [
  { key: "habitConsistency", label: "Habit consistency" },
  { key: "reflection", label: "Reflection practice" },
  { key: "decisionQuality", label: "Decision quality" },
  { key: "mentalModelUsage", label: "Mental-model usage" },
  { key: "firstPrinciple", label: "First-principles practice" },
];

export default function WhatIfSimulator() {
  const [levers, setLevers] = useState<Record<string, number>>({});
  const [horizon, setHorizon] = useState(90);
  const run = useApiMutation<Record<string, number>, { simulation: Simulation }>("/api/whatif");
  const sim = run.data?.simulation;

  function simulate() {
    run.mutate({ horizonDays: horizon, ...levers });
  }

  const w = 320;
  const h = 64;
  const curve = sim?.curve ?? [];
  const pts = curve
    .map((p, i) => `${((i / Math.max(1, curve.length - 1)) * w).toFixed(1)},${(h - p.growth * h).toFixed(1)}`)
    .join(" ");

  return (
    <div>
      <div className="space-y-2.5">
        {LEVERS.map((l) => (
          <div key={l.key} className="flex items-center gap-3 text-sm">
            <label htmlFor={`whatif-${l.key}`} className="w-44 shrink-0 text-slate-400">{l.label}</label>
            <input
              id={`whatif-${l.key}`}
              type="range"
              min={0}
              max={100}
              value={Math.round((levers[l.key] ?? 0.5) * 100)}
              onChange={(e) => setLevers((s) => ({ ...s, [l.key]: Number(e.target.value) / 100 }))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-10 text-right tabular-nums text-slate-300">{Math.round((levers[l.key] ?? 0.5) * 100)}%</span>
          </div>
        ))}
        <div className="flex items-center gap-3 text-sm">
          <label htmlFor="whatif-horizon" className="w-44 shrink-0 text-slate-400">Horizon (days)</label>
          <input
            id="whatif-horizon"
            type="range"
            min={30}
            max={365}
            step={15}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <span className="w-10 text-right tabular-nums text-slate-300">{horizon}</span>
        </div>
      </div>

      <button
        onClick={simulate}
        disabled={run.isPending}
        className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
        {run.isPending ? "Projecting…" : "Project growth"}
      </button>
      {run.error && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}

      {sim && (
        <div className="mt-4">
          <div className="flex items-end gap-4">
            <div>
              <div className="text-xs text-slate-500">Today</div>
              <div className="text-2xl font-bold tabular-nums">{Math.round(sim.baseline.growth * 100)}</div>
            </div>
            <div className="pb-1 text-slate-500">→</div>
            <div>
              <div className="text-xs text-slate-500">Day {sim.horizonDays}</div>
              <div className={`text-2xl font-bold tabular-nums ${sim.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {Math.round(sim.projected.growth * 100)}
              </div>
            </div>
            <div className={`pb-1 text-sm tabular-nums ${sim.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {sim.delta >= 0 ? "+" : ""}{Math.round(sim.delta * 100)}
            </div>
          </div>
          {curve.length > 1 && (
            <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full" role="img" aria-label="Projected growth curve">
              <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" />
            </svg>
          )}
          {sim.notes.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {sim.notes.map((n, i) => <li key={i}>· {n}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
