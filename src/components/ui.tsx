import type { ReactNode } from "react";

export function Card({ title, children, accent }: { title?: string; children: ReactNode; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      {title && <h2 className="mb-3 text-sm font-semibold" style={accent ? { color: accent } : undefined}>{title}</h2>}
      {children}
    </div>
  );
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const hue = Math.round(pct * 1.2); // red→green
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span><span className="tabular-nums">{pct}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: `hsl(${hue} 70% 50%)` }} />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function Line({ values, color = "#6366f1", height = 48 }: { values: number[]; color?: string; height?: number }) {
  if (values.length < 2) return <p className="text-xs text-slate-500">Not enough data.</p>;
  const w = 320;
  const pts = values
    .map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(height - Math.max(0, Math.min(1, v)) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function Scoreboard({ rows }: { rows: [string, number][] }) {
  return <div className="mt-2 space-y-2">{rows.map(([label, value]) => <ScoreBar key={label} label={label} value={value} />)}</div>;
}

export function StatGrid({ items }: { items: { value: ReactNode; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-8 text-sm">
      {items.map((it) => (
        <div key={it.label}>
          <div className="text-2xl font-bold tabular-nums">{it.value}</div>
          <div className="text-xs text-slate-500">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
