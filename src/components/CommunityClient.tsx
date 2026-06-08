"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LIBRARY } from "@/lib/community/statuses";

export function Composer() {
  const router = useRouter();
  const [status, setStatus] = useState(STATUS_LIBRARY[0].key);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function post() {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/community", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ status, message }) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setMessage(""); router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-slate-400">Status:</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm">
          {STATUS_LIBRARY.map((s) => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
        </select>
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Share an update with the community…"
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
      {err && <p className="mt-1 text-sm text-rose-400">{err}</p>}
      <button onClick={post} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium disabled:opacity-50">
        {busy ? "Posting…" : "Post"}
      </button>
    </div>
  );
}

export function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  async function send() {
    if (!content.trim()) return;
    setBusy(true);
    await fetch(`/api/community/${postId}/comment`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) });
    setContent(""); setBusy(false); router.refresh();
  }
  return (
    <div className="mt-2 flex gap-2">
      <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a comment…"
        onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm" />
      <button onClick={send} disabled={busy} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm disabled:opacity-50">Send</button>
    </div>
  );
}
