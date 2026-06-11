"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTx } from "@/lib/i18n/client";

const SYS_LABEL: Record<string, string> = { V: "Visual", A: "Auditory", K: "Kinesthetic", Ad: "Self-talk" };

type Step = { step: number; system: string; description: string };
type Tote = { test: string; operate: string; testExit: string; exit: string };
type Strategy = {
  id: string; name: string; description: string;
  identity: string; beliefs: string; values: string; capabilities: string;
  highLeverage: string; repSequence: Step[] | null; tote: Tote | null; installProtocol: string[] | null;
};
type Genius = { id: string; name: string; era: string; domain: string; strategies: Strategy[] };
type Adoption = { id: string; strategyId: string; status: string };

export default function GeniusStudio({ geniuses, adoptions }: { geniuses: Genius[]; adoptions: Adoption[] }) {
  const tx = useTx();
  const router = useRouter();
  const adoptedByStrategy = new Map(adoptions.map((a) => [a.strategyId, a]));
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function model() {
    if (!name.trim()) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/genius-strategies/model", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ genius: name, focus }) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setName(""); setFocus(""); router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  }

  async function adopt(strategyId: string) {
    await fetch("/api/genius-strategies/adopt", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ strategyId }) });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 text-sm font-semibold">Model a genius</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tx("Genius (e.g. Da Vinci, Tesla, Mozart)")}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
          <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder={tx("Focus (optional)")}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
          <button onClick={model} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {busy ? tx("Modeling…") : tx("Model")}
          </button>
        </div>
        {err && <p className="mt-2 text-sm text-rose-400">{err}</p>}
        <p className="mt-2 text-xs text-slate-500">Builds an NLP system model: logical levels + representational-system sequence + T.O.T.E. + install protocol.</p>
      </div>

      {geniuses.map((g) => (
        <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-1 text-lg font-semibold">{g.name}</div>
          <div className="mb-4 text-xs text-slate-500">{[g.era, g.domain].filter(Boolean).join(" · ")}</div>
          <div className="space-y-4">
            {g.strategies.map((s) => {
              const adopted = adoptedByStrategy.get(s.id);
              return (
                <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.name}</div>
                    <button onClick={() => adopt(s.id)} disabled={!!adopted}
                      className={`rounded-lg px-3 py-1 text-xs ${adopted ? "bg-emerald-700/60 text-emerald-200" : "bg-indigo-600"}`}>
                      {adopted ? `Adopted · ${adopted.status}` : "Adopt"}
                    </button>
                  </div>
                  {s.description && <p className="mt-1 text-sm text-slate-300">{s.description}</p>}

                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <Level label="Identity" value={s.identity} />
                    <Level label="Beliefs" value={s.beliefs} />
                    <Level label="Values" value={s.values} />
                    <Level label="Capabilities" value={s.capabilities} />
                  </div>

                  {s.repSequence?.length ? (
                    <div className="mt-3">
                      <div className="text-xs uppercase text-slate-500">Strategy sequence</div>
                      <ol className="mt-1 space-y-1">
                        {s.repSequence.map((st) => (
                          <li key={st.step} className="text-sm">
                            <span className="mr-2 rounded bg-indigo-900/60 px-1.5 py-0.5 text-xs text-indigo-200">{st.system} · {SYS_LABEL[st.system] ?? st.system}</span>
                            {st.description}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  {s.tote ? (
                    <div className="mt-3 text-xs text-slate-400">
                      <span className="uppercase text-slate-500">T.O.T.E.</span> — Test: {s.tote.test} · Operate: {s.tote.operate} · Exit when: {s.tote.testExit} → {s.tote.exit}
                    </div>
                  ) : null}

                  {s.highLeverage && <p className="mt-2 text-xs text-amber-300">High-leverage: {s.highLeverage}</p>}

                  {s.installProtocol?.length ? (
                    <div className="mt-3">
                      <div className="text-xs uppercase text-slate-500">Install protocol</div>
                      <ul className="mt-1 list-disc pl-5 text-sm">{s.installProtocol.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                  ) : null}

                  {adopted && <PracticeBox adoptionId={adopted.id} onDone={() => router.refresh()} />}
                </div>
              );
            })}
            {g.strategies.length === 0 && <p className="text-sm text-slate-500">No strategy modeled yet.</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Level({ label, value }: { label: string; value: string }) {
  const tx = useTx();
  if (!value) return null;
  return <div className="rounded-lg bg-slate-900/60 p-2"><span className="text-xs uppercase text-slate-500">{label}: </span><span>{value}</span></div>;
}

function PracticeBox({ adoptionId, onDone }: { adoptionId: string; onDone: () => void }) {
  const tx = useTx();
  const [open, setOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const [fidelity, setFidelity] = useState(0.6);
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true);
    await fetch("/api/genius-strategies/practice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ adoptionId, reflection, fidelity }) });
    setBusy(false); setOpen(false); setReflection(""); onDone();
  }
  if (!open) return <button onClick={() => setOpen(true)} className="mt-3 text-xs text-indigo-400">+ Log a practice</button>;
  return (
    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3">
      <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows={2} placeholder={tx("How faithfully did you reproduce the strategy? What happened?")}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
      <label className="mt-2 block text-xs text-slate-400">Fidelity: {Math.round(fidelity * 100)}%
        <input type="range" min={0} max={1} step={0.05} value={fidelity} onChange={(e) => setFidelity(Number(e.target.value))} className="mt-1 w-full" />
      </label>
      <button onClick={submit} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm disabled:opacity-50">{busy ? tx("Saving…") : tx("Save practice")}</button>
    </div>
  );
}
