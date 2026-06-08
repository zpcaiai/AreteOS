"use client";
import { useEffect, useRef, useState } from "react";

type Book = { id: string; title: string; author: string; relatedModule: string; inspiredByNote: string; sourceType: string; isPublicDomain: boolean };
type Progress = Record<string, { percent: number; completed: boolean }>;

export default function AudiobookShelf({ books, progress }: { books: Book[]; progress: Progress }) {
  const [active, setActive] = useState<Book | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState(true);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);

  const byModule = books.reduce<Record<string, Book[]>>((acc, b) => { (acc[b.relatedModule] ||= []).push(b); return acc; }, {});

  async function open(b: Book) {
    window.speechSynthesis?.cancel(); setSpeaking(false); setPaused(false);
    setActive(b); setLoading(true); setText("");
    try {
      const res = await fetch(`/api/mnemosyne/book/${b.id}`);
      const json = await res.json();
      setText(json.spokenText || json.book?.summary || "No readable text available for this entry.");
    } catch { setText("Could not load this book."); }
    finally { setLoading(false); }
  }

  function play() {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onend = () => { setSpeaking(false); setPaused(false); finish(true); };
    startRef.current = Date.now();
    window.speechSynthesis.speak(u);
    setSpeaking(true); setPaused(false);
  }
  function pause() { window.speechSynthesis.pause(); setPaused(true); }
  function resume() { window.speechSynthesis.resume(); setPaused(false); }
  function stop() { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); finish(false); }

  async function finish(completed: boolean) {
    if (!active) return;
    const seconds = Math.max(0, Math.round((Date.now() - startRef.current) / 1000));
    if (seconds > 0) {
      try {
        await fetch("/api/mnemosyne/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bookId: active.id, seconds }) });
        await fetch("/api/mnemosyne/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bookId: active.id, addSeconds: seconds, percent: completed ? 1 : 0.5, completed }) });
      } catch { /* ignore */ }
    }
  }

  return (
    <div>
      {active && (
        <div className="sticky top-2 z-10 mb-5 rounded-2xl border border-indigo-800 bg-slate-900/95 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-100">▶ {active.title}</div>
              <div className="text-xs text-slate-400">{active.author} · {active.relatedModule}</div>
            </div>
            <button onClick={() => { stop(); setActive(null); }} className="text-xs text-slate-500 hover:text-slate-300">close</button>
          </div>
          {!supported && <p className="mt-2 text-xs text-rose-400">Your browser doesn't support read-aloud (Web Speech API).</p>}
          {loading ? <p className="mt-2 text-sm text-slate-400">Loading…</p> : (
            <>
              <div className="mt-3 flex items-center gap-2">
                {!speaking || paused ? (
                  <button onClick={() => (paused ? resume() : play())} disabled={!supported} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium disabled:opacity-50">{paused ? "Resume" : "▶ Play"}</button>
                ) : (
                  <button onClick={pause} className="rounded-lg bg-slate-700 px-4 py-1.5 text-sm font-medium">⏸ Pause</button>
                )}
                <button onClick={stop} disabled={!speaking} className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm disabled:opacity-50">⏹ Stop</button>
                <label className="ml-2 text-xs text-slate-400">Speed
                  <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="ml-1 rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-xs">
                    {[0.8, 1, 1.2, 1.5, 2].map((r) => <option key={r} value={r}>{r}×</option>)}
                  </select>
                </label>
              </div>
              <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{text}</p>
            </>
          )}
        </div>
      )}

      {Object.entries(byModule).map(([mod, list]) => (
        <div key={mod} className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">{mod}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => {
              const p = progress[b.id];
              return (
                <button key={b.id} onClick={() => open(b)} className="rounded-xl border border-slate-800 p-3 text-left hover:border-indigo-700">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-slate-100">{b.title}</div>
                    {b.isPublicDomain ? <span className="shrink-0 rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-300">public domain</span>
                      : <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">summary</span>}
                  </div>
                  <div className="text-xs text-slate-500">{b.author}</div>
                  <div className="mt-1 text-xs text-slate-400">{b.inspiredByNote}</div>
                  {p?.completed && <div className="mt-1 text-[10px] text-emerald-400">✓ listened</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
