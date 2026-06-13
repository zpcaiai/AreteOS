"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deckStats } from "@/lib/client/memory-deck";
import { useDraft } from "@/lib/client/useDraft";

const POS_KEY = "arete-floating-coach-pos";
const BOX = 72;

function clampPos(x: number, y: number, w = BOX, h = BOX) {
  return {
    x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - w - 8)),
    y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - h - 8)),
  };
}

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const pos = JSON.parse(raw) as { x?: number; y?: number };
    if (typeof pos.x !== "number" || typeof pos.y !== "number") return null;
    return clampPos(pos.x, pos.y);
  } catch {
    return null;
  }
}

export default function FloatingCoachWidget() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"coach" | "checkin" | "memory">("coach");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [checkin, setCheckin] = useState("");
  const [memoryStats, setMemoryStats] = useState({ total: 0, due: 0, mature: 0 });
  const { savedHint, clearDraft } = useDraft("arete-floating-checkin-draft", checkin, setCheckin);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; w: number; h: number } | null>(null);
  const movedRef = useRef(false);

  useEffect(() => {
    setPos(loadPos());
    setMemoryStats(deckStats());
  }, []);

  if (pathname === "/login") return null;

  function pointerDown(e: React.PointerEvent) {
    const box = rootRef.current?.getBoundingClientRect();
    if (!box) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: box.left, originY: box.top, w: box.width, h: box.height };
    movedRef.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function pointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!movedRef.current && Math.hypot(dx, dy) < 6) return;
    movedRef.current = true;
    setPos(clampPos(drag.originX + dx, drag.originY + dy, drag.w, drag.h));
  }

  function pointerUp() {
    if (movedRef.current) {
      setPos((current) => {
        if (current) {
          try {
            localStorage.setItem(POS_KEY, JSON.stringify(current));
          } catch {
            // Ignore.
          }
        }
        return current;
      });
    }
    dragRef.current = null;
  }

  return (
    <div
      ref={rootRef}
      className="fixed z-[1200] flex flex-col items-end gap-3"
      style={pos ? { left: pos.x, top: pos.y } : { right: 20, bottom: 20 }}>
      {expanded && (
        <section className="flex h-[520px] max-h-[calc(100vh-130px)] w-[360px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur">
          <header
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
            className="flex cursor-grab items-center gap-3 border-b border-slate-800 px-3 py-2.5"
            style={{ touchAction: "none", userSelect: "none" }}>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">A</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-100">Arete Coach</p>
              <p className="text-xs text-slate-500">Companion, not a substitute for professional help</p>
            </div>
            <button onClick={() => setExpanded(false)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-800" aria-label="Collapse coach">-</button>
          </header>

          <div className="grid grid-cols-3 gap-1 border-b border-slate-800 p-2">
            <PanelTab active={tab === "coach"} onClick={() => setTab("coach")}>Coach</PanelTab>
            <PanelTab active={tab === "checkin"} onClick={() => setTab("checkin")}>Check-in</PanelTab>
            <PanelTab active={tab === "memory"} onClick={() => { setMemoryStats(deckStats()); setTab("memory"); }}>Memory</PanelTab>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {tab === "coach" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Next useful step</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Open a focused coaching session when you need multi-turn support with decisions, habits, reflection, or Naval planning.
                </p>
                <div className="mt-4 grid gap-2">
                  <QuickLink href="/coach" label="Open AI Coach" />
                  <QuickLink href="/growth-map" label="Choose a growth path" />
                  <QuickLink href="/naval/plan" label="Review 90-day plan" />
                </div>
              </div>
            )}
            {tab === "checkin" && (
              <div>
                <label htmlFor="floating-checkin" className="text-sm font-semibold text-slate-100">Quick check-in</label>
                <textarea
                  id="floating-checkin"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="mt-2 min-h-40 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm leading-6 text-slate-100"
                  placeholder="What is happening, what are you avoiding, and what is the next honest action?"
                  maxLength={1600}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500" aria-live="polite">{savedHint ? "Draft saved" : ""}</span>
                  <button onClick={() => { setCheckin(""); clearDraft(); }} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800">Clear</button>
                </div>
              </div>
            )}
            {tab === "memory" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Memory deck</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Metric label="Cards" value={memoryStats.total} />
                  <Metric label="Due" value={memoryStats.due} />
                  <Metric label="Mature" value={memoryStats.mature} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">Turn high-signal lessons into cards so they become available under pressure.</p>
                <div className="mt-4">
                  <QuickLink href="/memory-deck" label="Open memory deck" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label="Open Arete Coach"
        onClick={() => {
          if (movedRef.current) {
            movedRef.current = false;
            return;
          }
          setExpanded((value) => !value);
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        className="grid h-14 w-14 cursor-grab place-items-center rounded-full border border-indigo-400/40 bg-indigo-600 text-base font-bold text-white shadow-xl shadow-indigo-950/40 hover:bg-indigo-500"
        style={{ touchAction: "none" }}>
        A
      </button>
    </div>
  );
}

function PanelTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-2 py-1.5 text-xs ${active ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-900"}`}>
      {children}
    </button>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:bg-slate-900">
      {label}
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">
      <div className="text-lg font-bold tabular-nums text-slate-100">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

