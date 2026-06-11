"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, lines } from "@/components/studio";
import { useTx } from "@/lib/i18n/client";

const ta = inputCls;

export function ChildCreateForm() {
  const tx = useTx();
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);
  const [interests, setInterests] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!name.trim()) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/genius", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, age, interests: lines(interests.replace(/,/g, "\n")) }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setName(""); setInterests("");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="text-sm font-semibold">Add a child</h3>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tx("Name")} className={ta} />
        <input type="number" min={3} max={18} value={age} onChange={(e) => setAge(parseInt(e.target.value) || 0)} placeholder={tx("Age")} className={ta} />
        <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder={tx("Interests (comma separated)")} className={ta} />
      </div>
      <button onClick={add} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? tx("Adding…") : tx("Add child")}</button>
    </div>
  );
}

export function ChildStudio({ childId, age }: { childId: string; age: number }) {
  const tx = useTx();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [out, setOut] = useState("");
  const [obs, setObs] = useState("");
  const [fixed, setFixed] = useState("");
  const [interest, setInterest] = useState("");
  const [idea, setIdea] = useState("");
  const [envDesc, setEnvDesc] = useState("");
  const [problem, setProblem] = useState("");
  const [situation, setSituation] = useState("");
  const [parentCtx, setParentCtx] = useState("");

  async function run(key: string, endpoint: string, body: Record<string, unknown>, summarize?: (j: Record<string, unknown>) => string) {
    setBusy(key); setError(""); setOut("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ childId, ...body }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (summarize) setOut(summarize(json));
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(null); }
  }

  const Btn = ({ k, onClick, label }: { k: string; onClick: () => void; label: string }) => (
    <button disabled={busy !== null} onClick={onClick} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy === k ? "Running…" : label}</button>
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">Growth Studio</h2>
      <p className="mt-1 text-sm text-slate-400">Sponsor identity, build curiosity & creativity, design the environment, and coach the parent. Never graded. (Runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <Box title="1 · Identity Sponsorship" hint="What the child does and loves — one per line">
        <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className={ta} />
        <Btn k="id" onClick={() => run("id", "/api/genius/identity", { observations: lines(obs) }, (j) => `Primary: ${j.primaryIdentity} · Emerging: ${j.emergingIdentity}`)} label="Sponsor Identity" />
      </Box>

      <Box title="2 · Growth Mindset" hint="Fixed-mindset things the child says — one per line">
        <textarea value={fixed} onChange={(e) => setFixed(e.target.value)} rows={2} className={ta} />
        <Btn k="mind" onClick={() => run("mind", "/api/genius/mindset", { statements: lines(fixed) })} label="Reframe to Growth" />
      </Box>

      <Box title="3 · Curiosity & Creativity" hint="An interest, and a creative idea">
        <input value={interest} onChange={(e) => setInterest(e.target.value)} className={ta} placeholder={tx("Interest (e.g. dinosaurs)")} />
        <input value={idea} onChange={(e) => setIdea(e.target.value)} className={ta} placeholder={tx("Creative idea (e.g. comic about a space cat)")} />
        <div className="flex gap-2">
          <Btn k="exp" onClick={() => run("exp", "/api/genius/explorer", { interest })} label="Grow Curiosity" />
          <Btn k="cre" onClick={() => run("cre", "/api/genius/creativity", { idea })} label="Creativity Project" />
          <Btn k="prj" onClick={() => run("prj", "/api/genius/project", { interest })} label="Start a Project" />
        </div>
      </Box>

      <Box title="4 · Environment & Autonomy" hint="Describe the learning space; list behaviors for autonomy">
        <textarea value={envDesc} onChange={(e) => setEnvDesc(e.target.value)} rows={2} className={ta} placeholder={tx("Environment description")} />
        <div className="flex gap-2">
          <Btn k="env" onClick={() => run("env", "/api/genius/environment", { description: envDesc })} label="Assess Environment" />
          <Btn k="aut" onClick={() => run("aut", "/api/genius/autonomy", { observations: lines(envDesc) })} label="Assess Autonomy" />
        </div>
      </Box>

      <Box title="5 · Problem Solving & Resilience" hint="A real problem or a tough situation">
        <input value={problem} onChange={(e) => setProblem(e.target.value)} className={ta} placeholder={tx("Problem (e.g. my plant keeps dying)")} />
        <input value={situation} onChange={(e) => setSituation(e.target.value)} className={ta} placeholder={tx("Resilience situation (e.g. gives up when hard)")} />
        <div className="flex gap-2">
          <Btn k="ps" onClick={() => run("ps", "/api/genius/problem-solving", { problem })} label="Problem-Solving Steps" />
          <Btn k="res" onClick={() => run("res", "/api/genius/resilience", { situation })} label="Build Resilience" />
        </div>
      </Box>

      <Box title="6 · Parent Coach" hint="What you're struggling with as a parent — one per line">
        <textarea value={parentCtx} onChange={(e) => setParentCtx(e.target.value)} rows={2} className={ta} />
        <Btn k="pc" onClick={() => run("pc", "/api/genius/parent-coach", { context: lines(parentCtx) })} label="Coach Me" />
      </Box>
    </div>
  );
}

function Box({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  const tx = useTx();
  return (
    <details className="mt-3 rounded-lg border border-slate-800 p-3">
      <summary className="cursor-pointer text-sm font-semibold">{title}</summary>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}
