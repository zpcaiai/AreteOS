"use client";
/* Lightweight SVG radar for the seven Naval drivers (values 0..100). No deps. */
export default function Radar({ points, size = 280 }: { points: { label: string; value: number }[]; size?: number }) {
  const n = points.length;
  if (n < 3) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 44;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, frac: number) => [cx + Math.cos(angle(i)) * r * frac, cy + Math.sin(angle(i)) * r * frac] as const;
  const poly = points.map((p, i) => pt(i, Math.max(0, Math.min(1, p.value / 100))).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]">
      {rings.map((f) => (
        <polygon key={f} points={points.map((_, i) => pt(i, f).join(",")).join(" ")} fill="none" stroke="#1e293b" strokeWidth="1" />
      ))}
      {points.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth="1" />; })}
      <polygon points={poly} fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="2" />
      {points.map((p, i) => {
        const [x, y] = pt(i, 1.18);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-400" style={{ fontSize: 9 }}>{p.label}</text>;
      })}
    </svg>
  );
}
