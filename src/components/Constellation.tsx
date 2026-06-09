"use client";
import { useEffect, useRef, useState } from "react";

/* Dependency-free 3D constellation (inspired by emotion-sphere's react-three-fiber
   sphere, rebuilt in pure SVG so it needs no three.js). Nodes sit on a sphere,
   rotate around the Y axis, project to 2D with depth-based size/opacity. Click a
   node to inspect it. Drag to spin. */

export interface ConsNode {
  id: string;
  label: string;
  group: string;
  blurb?: string;
  href?: string;
  /** spherical seed; auto-distributed if omitted */
  theta?: number;
  phi?: number;
}

const GROUP_COLOR: Record<string, string> = {
  Foundation: "#0ea5e9", Direction: "#6366f1", Thinking: "#a855f7",
  Execution: "#10b981", Organization: "#f59e0b", Memory: "#ec4899", Value: "#eab308",
};
const colorFor = (g: string) => GROUP_COLOR[g] ?? "#64748b";

// Fibonacci-sphere distribution for any nodes lacking explicit angles.
function distribute(nodes: ConsNode[]): Required<Pick<ConsNode, "theta" | "phi">>[] {
  const n = nodes.length;
  return nodes.map((nd, i) => {
    if (nd.theta != null && nd.phi != null) return { theta: nd.theta, phi: nd.phi };
    const y = 1 - (i / Math.max(n - 1, 1)) * 2; // 1..-1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = Math.acos(y);
    const theta = (Math.PI * (3 - Math.sqrt(5))) * i; // golden angle
    void r;
    return { theta, phi };
  });
}

export default function Constellation({
  nodes, size = 460, title,
}: { nodes: ConsNode[]; size?: number; title?: string }) {
  const angles = distribute(nodes);
  const [rotY, setRotY] = useState(0.4);
  const [selected, setSelected] = useState<ConsNode | null>(null);
  const dragging = useRef<{ x: number; startRot: number } | null>(null);
  const spin = useRef(true);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      if (spin.current && !dragging.current) setRotY((r) => r + 0.0035);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  const cx = size / 2, cy = size / 2, R = size * 0.4;

  // project each node
  const projected = nodes.map((nd, i) => {
    const { theta, phi } = angles[i];
    // base cartesian on unit sphere
    let x = Math.sin(phi) * Math.cos(theta);
    let y = Math.cos(phi);
    let z = Math.sin(phi) * Math.sin(theta);
    // rotate around Y
    const ca = Math.cos(rotY), sa = Math.sin(rotY);
    const xr = x * ca - z * sa;
    const zr = x * sa + z * ca;
    x = xr; z = zr;
    const depth = (z + 1) / 2; // 0 (back) .. 1 (front)
    return {
      node: nd,
      sx: cx + x * R,
      sy: cy + y * R,
      depth,
      r: 4 + depth * 7,
      opacity: 0.35 + depth * 0.65,
    };
  }).sort((a, b) => a.depth - b.depth); // draw back-to-front

  function onDown(e: React.PointerEvent) {
    dragging.current = { x: e.clientX, startRot: rotY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setRotY(dragging.current.startRot + (e.clientX - dragging.current.x) * 0.01);
  }
  function onUp() { dragging.current = null; }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      {title ? <h2 className="mb-2 text-lg font-bold">{title}</h2> : null}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
        <svg
          width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        >
          <defs>
            <radialGradient id="cons-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R * 1.15} fill="url(#cons-halo)" />
          {projected.map((p) => {
            const isSel = selected?.id === p.node.id;
            const c = colorFor(p.node.group);
            return (
              <g key={p.node.id} onClick={() => { setSelected(p.node); spin.current = false; }} className="cursor-pointer">
                <circle cx={p.sx} cy={p.sy} r={p.r} fill={c} opacity={p.opacity}
                  stroke={isSel ? "#fff" : "none"} strokeWidth={isSel ? 2 : 0} />
                {p.depth > 0.55 || isSel ? (
                  <text x={p.sx + p.r + 3} y={p.sy + 3} fontSize={10}
                    fill="#cbd5e1" opacity={p.opacity}>{p.node.label}</text>
                ) : null}
              </g>
            );
          })}
        </svg>

        <div className="w-full lg:w-64">
          {selected ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wide" style={{ color: colorFor(selected.group) }}>{selected.group}</div>
              <div className="mt-1 text-lg font-bold">{selected.label}</div>
              {selected.blurb ? <p className="mt-2 text-sm text-slate-400">{selected.blurb}</p> : null}
              {selected.href ? (
                <a href={selected.href} className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Open →</a>
              ) : null}
              <button onClick={() => { setSelected(null); spin.current = true; }}
                className="mt-3 block text-xs text-slate-500 hover:text-slate-300">Resume spin</button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-400">
              Drag to spin · click a node to inspect. Each node is a part of your development system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
