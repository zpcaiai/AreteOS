"use client";

import { useEffect, useRef, useState } from "react";
import { CoachMessageSchema, firstIssue } from "@/lib/schemas";

interface Msg { id: string; role: string; content: string; toolCalls?: { tool: string }[] | null; createdAt: string }
interface Session { id: string; title: string; focus: string; updatedAt: string }

const FOCUSES: { value: string; label: string }[] = [
  { value: "", label: "General" },
  { value: "decisions", label: "Decisions" },
  { value: "habits", label: "Habits" },
  { value: "naval", label: "Naval Life" },
  { value: "reflection", label: "Reflection" },
];

export default function CoachChat() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [activity, setActivity] = useState("");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadSessions() {
    const r = await fetch("/api/coach");
    if (r.ok) setSessions((await r.json()).sessions);
  }
  useEffect(() => { loadSessions(); }, []);

  async function openSession(id: string) {
    setActive(id);
    setMessages([]);
    const r = await fetch(`/api/coach/${id}`);
    if (r.ok) setMessages((await r.json()).session.messages);
  }

  async function newSession() {
    setError("");
    const r = await fetch("/api/coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ focus }),
    });
    if (!r.ok) { setError("Could not start a session"); return; }
    const { session } = await r.json();
    await loadSessions();
    setActive(session.id);
    setMessages([]);
  }

  async function send() {
    const text = input.trim();
    if (!active || busy) return;
    const problem = firstIssue(CoachMessageSchema, { message: text });
    if (problem) { setError(problem); return; }
    setInput("");
    setBusy(true);
    setError("");
    setActivity("Thinking…");
    const optimistic: Msg = { id: `tmp-${Date.now()}`, role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, optimistic]);
    try {
      const r = await fetch(`/api/coach/${active}?stream=1`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "text/event-stream" },
        body: JSON.stringify({ message: text }),
      });
      if (!r.ok || !r.body) {
        const d = await r.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error || "Coach failed to reply");
      }

      // Parse the SSE stream: thinking / tool events update the activity line;
      // complete delivers the persisted assistant message.
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        buffer += decoder.decode(chunk.value ?? new Uint8Array(), { stream: !done });
        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          const event = /^event: (.+)$/m.exec(frame)?.[1] ?? "message";
          const dataRaw = /^data: (.+)$/m.exec(frame)?.[1];
          if (!dataRaw) continue;
          const data = JSON.parse(dataRaw) as { tool?: string; message?: Msg; error?: string };
          if (event === "thinking") setActivity("Thinking…");
          if (event === "tool" && data.tool) setActivity(`Checking ${data.tool.replaceAll("_", " ")}…`);
          if (event === "complete" && data.message) setMessages((m) => [...m, data.message as Msg]);
          if (event === "error") throw new Error(data.error || "Coach failed to reply");
        }
      }
      loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setActivity("");
    }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3" aria-label="Coaching sessions">
        <div className="mb-2 flex items-center gap-2">
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            aria-label="Session focus"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200">
            {FOCUSES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <button onClick={newSession} className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500">New</button>
        </div>
        <ul className="space-y-1" role="list">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => openSession(s.id)}
                className={`w-full truncate rounded-lg px-2 py-1.5 text-left text-xs ${active === s.id ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60"}`}>
                {s.title || "New conversation"}
              </button>
            </li>
          ))}
          {!sessions.length && <li className="px-2 py-1.5 text-xs text-slate-500">No sessions yet.</li>}
        </ul>
      </aside>

      <section className="flex min-h-[60vh] flex-col rounded-2xl border border-slate-800 bg-slate-900/60" aria-label="Coach conversation">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {!active && <p className="text-sm text-slate-500">Start a new session or pick one on the left. The coach can read your scores, decisions, reflections, habits, and long-term memories to ground its advice.</p>}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-indigo-600/80 text-white" : "border border-slate-800 bg-slate-950/60 text-slate-200"}`}>
                {m.content}
                {Array.isArray(m.toolCalls) && m.toolCalls.length > 0 && (
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">
                    checked: {[...new Set(m.toolCalls.map((t) => t.tool.replaceAll("_", " ")))].join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start" aria-live="polite">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-400">
                <span className="animate-pulse">{activity || "Coach is reviewing your data…"}</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {error && <p className="px-4 pb-1 text-sm text-rose-400" role="alert">{error}</p>}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex gap-2 border-t border-slate-800 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!active || busy}
            placeholder={active ? "Ask your coach…" : "Start a session first"}
            aria-label="Message to coach"
            maxLength={4000}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
          <button type="submit" disabled={!active || busy || !input.trim()} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
