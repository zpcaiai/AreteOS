import type { ReactNode } from "react";

export function Card({ title, children, accent }: { title?: string; children: ReactNode; accent?: string }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      {title && <h2 className="mb-3 text-sm font-semibold" style={accent ? { color: accent } : undefined}>{title}</h2>}
      {children}
    </section>
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
      <div
        className="h-2 w-full rounded-full bg-slate-800"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: `hsl(${hue} 70% 50%)` }} />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </header>
  );
}

export function Empty({ children, cta }: { children: ReactNode; cta?: { href: string; label: string } }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700/70 bg-slate-900/30 px-6 py-8 text-center" role="status">
      <p className="text-sm text-slate-400">{children}</p>
      {cta && (
        <a href={cta.href} className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
          {cta.label}
        </a>
      )}
    </div>
  );
}

export function Line({ values, color = "#6366f1", height = 48, label }: { values: number[]; color?: string; height?: number; label?: string }) {
  if (values.length < 2) return <p className="text-xs text-slate-500">Not enough data.</p>;
  const w = 320;
  const y = (v: number) => height - Math.max(0, Math.min(1, v)) * (height - 2) - 1;
  const line = values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const id = `ln-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" role="img" aria-label={label ?? "Trend line"}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.22" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${height} ${line} ${w},${height}`} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Canonical sparkline: auto-scales any series, subtle gradient area + line.
 *  Use everywhere instead of bespoke inline SVGs for a consistent chart style. */
export function Sparkline({ values, color = "#6366f1", height = 36, ariaLabel = "trend" }: { values?: number[]; color?: string; height?: number; ariaLabel?: string }) {
  const v = (values ?? []).filter((x) => Number.isFinite(x));
  if (v.length < 2) return <div style={{ height }} className="mt-2" aria-hidden="true" />;
  const w = 160;
  const max = Math.max(...v), min = Math.min(...v, 0);
  const range = max - min || 1;
  const y = (val: number) => height - ((val - min) / range) * (height - 4) - 2;
  const line = v.map((val, i) => `${((i / (v.length - 1)) * w).toFixed(1)},${y(val).toFixed(1)}`).join(" ");
  const id = `sp-${color.replace("#", "")}-${height}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="mt-2 w-full" style={{ height }} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${height} ${line} ${w},${height}`} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Scoreboard({ rows }: { rows: [string, number][] }) {
  return <div className="mt-2 space-y-2">{rows.map(([label, value]) => <ScoreBar key={label} label={label} value={value} />)}</div>;
}

export function StatGrid({ items }: { items: { value: ReactNode; label: string }[] }) {
  return (
    <dl className="flex flex-wrap gap-8 text-sm">
      {items.map((it) => (
        <div key={it.label}>
          <dd className="text-2xl font-bold tabular-nums">{it.value}</dd>
          <dt className="text-xs text-slate-500">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}
