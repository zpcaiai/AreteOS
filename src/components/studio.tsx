"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Shared primitives for the engine "Studios" (Cosmos, Phronesis, Praxis, Archon, Oikos…).
// Previously every studio re-declared its own useRun hook + Box + Btn + input class + lines
// helper. Centralizing them removes ~5 copies of identical scaffolding and keeps the
// run/loading/error behavior consistent across every engine.

export const inputCls = "w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm";
export const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/** POSTs to an agent endpoint, surfaces busy/error, optionally a one-line result note, and refreshes. */
export function useAgentRun() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function run(
    key: string,
    endpoint: string,
    body: unknown,
    summarize?: (json: Record<string, unknown>) => string,
  ): Promise<Record<string, unknown> | null> {
    setBusy(key); setError(""); setNote("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (summarize) setNote(summarize(json));
      router.refresh();
      return json;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setBusy(null);
    }
  }

  return { busy, error, note, run };
}

/** Outer wrapper for a studio: title, intro, and shared error/result banners. */
export function StudioShell({
  title, intro, error, note, children,
}: { title: string; intro: string; error?: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{intro}</p>
      {error ? <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p> : null}
      {note ? <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{note}</p> : null}
      {children}
    </div>
  );
}

/** A collapsible section inside a studio. */
export function StudioSection({
  title, hint, children, open = false,
}: { title: string; hint?: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="mt-3 rounded-lg border border-slate-800 p-3" open={open}>
      <summary className="cursor-pointer text-sm font-semibold">{title}</summary>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}

/** A run button wired to the useAgentRun busy key. */
export function RunButton({
  busy, runKey, onClick, label,
}: { busy: string | null; runKey: string; onClick: () => void; label: string }) {
  return (
    <button
      disabled={busy !== null}
      onClick={onClick}
      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
    >
      {busy === runKey ? "Running…" : label}
    </button>
  );
}
