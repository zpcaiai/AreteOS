"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, lines } from "@/components/studio";
import { useTx } from "@/lib/i18n/client";

const ta = inputCls;

export function AssessmentTool() {
  const tx = useTx();
  const router = useRouter();
  const [reflections, setReflections] = useState("");
  const [mission, setMission] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ summary: string; globalScore: number } | null>(null);

  async function run() {
    setBusy(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/ethos/assess", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ reflections: lines(reflections), mission }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setResult({ summary: json.assessment.summary, globalScore: json.assessment.globalScore });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">Identity Assessment</h2>
      <p className="mt-1 text-sm text-slate-400">Reflect on how you actually spend attention and make decisions — one thought per line.</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      <input value={mission} onChange={(e) => setMission(e.target.value)} placeholder={tx("Your mission (optional)")} className={`mt-3 ${ta}`} />
      <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={5} placeholder={tx("Reflections, one per line…")} className={`mt-2 ${ta}`} />
      <button onClick={run} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? tx("Assessing…") : tx("Assess my identity")}</button>
      {result && (
        <div className="mt-3 rounded-lg border border-indigo-800 bg-indigo-950/30 p-3 text-sm">
          <div className="text-2xl font-bold tabular-nums">{Math.round(result.globalScore * 100)}<span className="text-sm text-slate-500"> / 100</span></div>
          <p className="mt-1 text-slate-300">{result.summary}</p>
        </div>
      )}
    </div>
  );
}

export function StackTool() {
  const tx = useTx();
  const router = useRouter();
  const [mission, setMission] = useState("");
  const [values, setValues] = useState("");
  const [strengths, setStrengths] = useState("");
  const [current, setCurrent] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function call(key: string, endpoint: string, body: unknown) {
    setBusy(key); setError("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">Build Your Identity Stack</h2>
      <p className="mt-1 text-sm text-slate-400">Compose a primary, secondary, emerging and legacy identity — then detect conflicts and get recommendations.</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      <input value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Mission" className={`mt-3 ${ta}`} />
      <label className="mt-2 block text-xs text-slate-400">Values (one per line)</label>
      <textarea value={values} onChange={(e) => setValues(e.target.value)} rows={2} className={ta} />
      <label className="mt-2 block text-xs text-slate-400">Strengths (one per line)</label>
      <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} className={ta} />
      <label className="mt-2 block text-xs text-slate-400">Current identities (one per line, optional)</label>
      <textarea value={current} onChange={(e) => setCurrent(e.target.value)} rows={2} className={ta} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button disabled={busy !== null} onClick={() => call("stack", "/api/ethos/stack", { mission, values: lines(values), strengths: lines(strengths), current: lines(current) })}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy === "stack" ? tx("Building…") : tx("Build stack")}</button>
        <button disabled={busy !== null} onClick={() => call("rec", "/api/ethos/recommend", { mission, values: lines(values), strengths: lines(strengths) })}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-50">{busy === "rec" ? "…" : tx("Recommend identities")}</button>
        <button disabled={busy !== null} onClick={() => call("conf", "/api/ethos/conflicts", { identities: lines(current) })}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-50">{busy === "conf" ? "…" : tx("Detect conflicts")}</button>
      </div>
      <p className="mt-3 text-xs text-slate-500">Results appear in the <Link href="/ethos/evolution" className="text-indigo-400">Evolution</Link> view.</p>
    </div>
  );
}
