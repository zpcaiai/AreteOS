"use client";
import { useEffect, useState } from "react";
import type { EngineConfig } from "./config";
import { PORTFOLIO_AREAS } from "./config";

/* Generic interactive panel for one Naval engine: renders the input fields from
   config, POSTs to the assess endpoint, and pretty-prints the JSON result. Also
   loads the latest persisted record from the profile endpoint on mount. */

const title = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const hue = Math.round(pct * 1.2);
  return (
    <div className="mb-1.5">
      <div className="mb-0.5 flex justify-between text-xs text-slate-400"><span>{label}</span><span className="tabular-nums">{pct}</span></div>
      <div className="h-2 w-full rounded-full bg-slate-800"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: `hsl(${hue} 70% 50%)` }} /></div>
    </div>
  );
}

function Value({ k, v }: { k: string; v: unknown }) {
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    if (/score/i.test(k) && v > 1) return <div><span className="text-2xl font-bold tabular-nums">{Math.round(v)}</span><span className="ml-1 text-xs text-slate-500">/100</span></div>;
    if (v >= 0 && v <= 1) return <ScoreBar label={title(k)} value={v} />;
    return <div className="text-sm tabular-nums">{v}</div>;
  }
  if (typeof v === "string") return <p className="text-sm text-slate-300">{v}</p>;
  if (typeof v === "boolean") return <span className="text-sm">{v ? "yes" : "no"}</span>;
  if (Array.isArray(v)) {
    if (!v.length) return null;
    return (
      <ul className="space-y-1 text-sm text-slate-300">
        {v.map((item, i) => (
          <li key={i} className="border-t border-slate-800 pt-1">
            {typeof item === "object" && item ? <Obj o={item as Record<string, unknown>} inline /> : String(item)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof v === "object") return <Obj o={v as Record<string, unknown>} />;
  return null;
}

function Obj({ o, inline }: { o: Record<string, unknown>; inline?: boolean }) {
  const entries = Object.entries(o).filter(([k]) => k !== "id" && k !== "userId" && k !== "createdAt" && k !== "updatedAt" && k !== "metadata" && k !== "profileId");
  return (
    <div className={inline ? "" : "space-y-3"}>
      {entries.map(([k, v]) => {
        const rendered = <Value k={k} v={v} />;
        if (!rendered || (Array.isArray(v) && !v.length)) return null;
        const isScalar = typeof v !== "object" || v == null;
        return (
          <div key={k}>
            {!inline && <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title(k)}</div>}
            {inline && isScalar ? <span className="text-slate-300"><span className="text-slate-500">{title(k)}: </span>{String(v)}</span> : rendered}
          </div>
        );
      })}
    </div>
  );
}

export default function EngineStudio({ config }: { config: EngineConfig }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<Record<string, number>>(Object.fromEntries(PORTFOLIO_AREAS.map((a) => [a, 50])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [existing, setExisting] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!config.profileEndpoint) return;
    fetch(config.profileEndpoint).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!d) return;
      const rec = d.profile ?? d.stacks?.[0] ?? d.games?.[0] ?? d.entries?.[0] ?? d.plans?.[0] ?? d.opportunities?.[0] ?? d.twin ?? null;
      if (rec) setExisting(rec);
    }).catch(() => {});
  }, [config.profileEndpoint]);

  function buildBody() {
    const body: Record<string, unknown> = {};
    for (const f of config.fields) {
      if (f.kind === "list") body[f.name] = (vals[f.name] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      else if (f.kind === "areas") body[f.name] = PORTFOLIO_AREAS.map((a) => ({ area: a, current: (areas[a] ?? 50) / 100 }));
      else body[f.name] = vals[f.name] ?? "";
    }
    return body;
  }

  async function run() {
    setBusy(true); setError(""); setResult(null);
    try {
      const res = await fetch(config.assessEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildBody()) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
      setExisting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold">Run</h2>
        <div className="space-y-3">
          {config.fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs text-slate-400">{f.label}</label>
              {f.kind === "areas" ? (
                <div className="space-y-2">
                  {PORTFOLIO_AREAS.map((a) => (
                    <div key={a} className="flex items-center gap-3">
                      <span className="w-28 text-xs text-slate-400">{title(a)}</span>
                      <input type="range" min={0} max={100} value={areas[a]} onChange={(e) => setAreas((s) => ({ ...s, [a]: Number(e.target.value) }))} className="flex-1 accent-indigo-500" />
                      <span className="w-8 text-right text-xs tabular-nums text-slate-300">{areas[a]}</span>
                    </div>
                  ))}
                </div>
              ) : f.kind === "text" ? (
                <input value={vals[f.name] ?? ""} onChange={(e) => setVals((s) => ({ ...s, [f.name]: e.target.value }))} placeholder={f.placeholder}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
              ) : (
                <textarea value={vals[f.name] ?? ""} onChange={(e) => setVals((s) => ({ ...s, [f.name]: e.target.value }))} placeholder={f.placeholder} rows={f.kind === "list" ? 4 : 3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
              )}
            </div>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
        <button onClick={run} disabled={busy} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {busy ? "Working…" : config.button}
        </button>
        <p className="mt-2 text-[11px] text-slate-600">Requires a Plus membership. Educational only — not financial, legal, or medical advice.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold">{result ? "Result" : existing ? "Latest saved" : "Output"}</h2>
        {result ? <Obj o={result} /> : existing ? <Obj o={existing} /> : <p className="text-sm text-slate-500">Run the engine to see your result here.</p>}
      </div>
    </div>
  );
}
