"use client";

/**
 * CompanionWidget — a small floating companion ("暖暖").
 *  • Tap her for a calm panel (greeting · Emotion Planet · 60s breathing · a line).
 *  • Drag her anywhere (mouse + touch). Dragging is driven by window-level pointer
 *    listeners (not pointer-capture) so the click-through clip layer can't block it.
 *  • On release she glides to the nearest side edge and remembers the spot; once
 *    docked she tucks half off-screen and dims, peeking back out on hover / tap.
 *  • A full-screen pointer-events-none + overflow-hidden layer hides the tucked
 *    half so the page never gains a scrollbar.
 * Fully secular, self-contained (no backend).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/client";
import CompanionSprite, { type CompanionState } from "./CompanionSprite";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const POS_KEY = "nuanPos";
const BTN = 60; // sprite box size
const EDGE = 12; // margin kept from the viewport edge when docked

const GREETINGS: [string, string][] = [
  ["小主～ 暖暖在这儿哦！此刻心里还好吗？", "Master~ Nuan's right here! How are you feeling now?"],
  ["小主辛苦啦，先停下来歇一口气，好不好？", "You've worked so hard, Master — let's pause for a breath, okay?"],
  ["要不要让暖暖陪小主看看此刻的情绪呀？", "Shall Nuan look at how you feel right now, together?"],
  ["小主，深呼吸一下，暖暖一直都在～", "Take a deep breath, Master — Nuan's always here~"],
];

const LINES: [string, string][] = [
  ["情绪只是信号，不是命令哦，小主～", "Feelings are just signals, not orders, Master~"],
  ["小主能叫出它的名字，就已经很勇敢啦。", "Just naming it already takes courage, Master."],
  ["先看一看，再回应，中间留一口气～", "Notice first, then respond — leave a little breath between."],
  ["慢一点也没关系的，小主。", "Slower is okay too, Master."],
  ["这一刻不用赢它，暖暖陪小主一起待着就好。", "No need to beat this moment — Nuan will just stay with you."],
];

export default function CompanionWidget() {
  const T = useT();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "breathing">("menu");
  const [state, setState] = useState<CompanionState>("idle");
  const [greeting, setGreeting] = useState(0);
  const [line, setLine] = useState<number | null>(null);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Free-drag position (mouse + touch). null = default corner (bottom-left).
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [snapAnim, setSnapAnim] = useState(false); // smooth glide only on release
  const [panelBelow, setPanelBelow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const draggedRef = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  useEffect(() => () => clearTimers(), []);

  // Restore saved position; keep her on-screen on resize.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) setPos(JSON.parse(raw));
    } catch {}
    const onResize = () => {
      setPos((p) => (p ? { x: clamp(p.x, EDGE, window.innerWidth - BTN - EDGE), y: clamp(p.y, EDGE, window.innerHeight - BTN - EDGE) } : p));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Window-level drag (works even though the wrapper is pointer-events-none).
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.moved && Math.hypot(dx, dy) < 4) return; // small move = still a tap
      d.moved = true;
      draggedRef.current = true;
      setDragging(true);
      setOpen(false);
      setPos({ x: clamp(d.ox + dx, EDGE, window.innerWidth - BTN - EDGE), y: clamp(d.oy + dy, EDGE, window.innerHeight - BTN - EDGE) });
    };
    const up = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setDragging(false);
      if (!d.moved) return; // a tap, not a drag — onClick will handle it
      setHovered(true); // pointer is still on her until it leaves
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const snapRight = rect.left + BTN / 2 > window.innerWidth / 2;
      setSnapAnim(true);
      setPos({ x: snapRight ? window.innerWidth - BTN - EDGE : EDGE, y: clamp(rect.top, EDGE, window.innerHeight - BTN - EDGE) });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  useEffect(() => {
    if (!pos) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(pos));
    } catch {}
  }, [pos]);

  const celebrate = () => {
    setState("celebrating");
    later(() => setState("idle"), 1800);
  };

  const openPanel = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) setPanelBelow(rect.top < window.innerHeight * 0.45);
    setOpen(true);
    setView("menu");
    setGreeting(Math.floor(Math.random() * GREETINGS.length));
    setLine(null);
    setState("listening");
    later(() => setState((s) => (s === "listening" ? "idle" : s)), 1300);
  };

  const closePanel = () => {
    clearTimers();
    setOpen(false);
    setView("menu");
    setState("idle");
  };

  // Guided breathing: 4s in · 2s hold · 4s out, sprite in "comforting".
  useEffect(() => {
    if (view !== "breathing") return;
    setState("comforting");
    setPhase("in");
    const local: ReturnType<typeof setTimeout>[] = [];
    const push = (fn: () => void, ms: number) => local.push(setTimeout(fn, ms));
    const cycle = () => {
      setPhase("in");
      push(() => setPhase("hold"), 4000);
      push(() => setPhase("out"), 6000);
      push(cycle, 10000);
    };
    cycle();
    return () => local.forEach(clearTimeout);
  }, [view]);

  // Start a potential drag (the window listeners above finish it).
  const onDragDown = (e: React.PointerEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSnapAnim(false); // follow the cursor 1:1
    drag.current = { sx: e.clientX, sy: e.clientY, ox: rect.left, oy: rect.top, moved: false };
    draggedRef.current = false;
  };

  const phaseText = phase === "in" ? T("吸气…", "Breathe in…") : phase === "hold" ? T("停一下", "Hold") : T("呼气…", "Breathe out…");

  const dockRight = pos != null && typeof window !== "undefined" ? pos.x + BTN / 2 > window.innerWidth / 2 : false;
  const tucked = pos != null && !open && !hovered && !dragging;

  const containerStyle: React.CSSProperties = {
    width: BTN,
    height: BTN,
    ...(pos ? { left: pos.x, top: pos.y } : { left: 20, bottom: 20 }),
    transition: snapAnim ? "left 0.24s cubic-bezier(0.22,0.9,0.3,1.05), top 0.24s cubic-bezier(0.22,0.9,0.3,1.05)" : undefined,
  };

  const panelStyle: React.CSSProperties = panelBelow ? { top: BTN + 12 } : { bottom: BTN + 12 };
  if (dockRight) panelStyle.right = 0;
  else panelStyle.left = 0;

  const spriteStyle: React.CSSProperties = {
    width: BTN,
    height: BTN,
    lineHeight: 0,
    touchAction: "none",
    transform: tucked ? `translateX(${dockRight ? "" : "-"}58%)` : undefined,
    opacity: tucked ? 0.62 : 1,
    transition: "transform 0.28s cubic-bezier(0.22,0.9,0.3,1.05), opacity 0.28s ease",
  };

  return (
    // Full-screen, click-through clip layer: hides the tucked half (no scrollbar).
    <div className="pointer-events-none fixed inset-0 z-[1190] overflow-hidden">
      <div ref={rootRef} className="pointer-events-auto absolute" style={containerStyle}>
        {open && (
          <section
            className="companion-panel absolute w-[300px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur"
            style={panelStyle}
          >
            <header className="flex items-center gap-3 border-b border-slate-800 px-3 py-2.5">
              <CompanionSprite state={state} size={36} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-100">{T("暖暖", "Nuan")}</div>
                <div className="text-[10px] text-slate-500">{T("小主的情绪小伙伴", "Your little feelings-buddy")}</div>
              </div>
              <button
                onClick={closePanel}
                aria-label={T("关闭", "Close")}
                className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </header>

            {view === "menu" ? (
              <div className="p-4">
                <p className="text-sm leading-6 text-slate-200">{T(GREETINGS[greeting][0], GREETINGS[greeting][1])}</p>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/cosmos/emotions"
                    onClick={closePanel}
                    className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 hover:border-indigo-400 hover:text-white"
                  >
                    🪐 {T("陪小主看看情绪", "See your feelings with me")} →
                  </Link>
                  <button
                    onClick={() => setView("breathing")}
                    className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-left text-sm text-slate-100 hover:border-indigo-400 hover:text-white"
                  >
                    🌬️ {T("陪小主呼吸 60 秒", "Breathe with me · 60s")}
                  </button>
                  <button
                    onClick={() => {
                      setLine(Math.floor(Math.random() * LINES.length));
                      celebrate();
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-left text-sm text-slate-100 hover:border-indigo-400 hover:text-white"
                  >
                    ✨ {T("给小主一句话", "A little line for you")}
                  </button>
                </div>

                {line !== null && (
                  <p className="mt-3 border-t border-slate-800 pt-3 text-sm italic leading-6 text-slate-300">{T(LINES[line][0], LINES[line][1])}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center p-5">
                <div
                  className="companion-breath-orb grid h-28 w-28 place-items-center rounded-full"
                  style={{ background: "radial-gradient(circle at 50% 45%, rgba(165,180,252,0.55), rgba(99,102,241,0.12) 70%)" }}
                >
                  <span className="text-sm font-medium text-slate-100">{phaseText}</span>
                </div>
                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  {T("跟着暖暖，慢慢吸气、停一下、再慢慢呼气～", "Follow Nuan — breathe in, hold, then out~")}
                </p>
                <button
                  onClick={() => {
                    clearTimers();
                    setView("menu");
                    celebrate();
                  }}
                  className="mt-4 rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-200 hover:border-indigo-400 hover:text-white"
                >
                  {T("好多啦，谢谢暖暖！", "Much better — thank you, Nuan!")}
                </button>
              </div>
            )}
          </section>
        )}

        <button
          onPointerDown={onDragDown}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => {
            if (draggedRef.current) {
              draggedRef.current = false;
              return; // that was a drag, not a tap
            }
            if (open) closePanel();
            else openPanel();
          }}
          aria-label={T("点击或拖动暖暖", "Tap or drag Nuan")}
          title={T("点我聊聊 · 拖我换位置（松手贴边，停靠后会探头躲一下）", "Tap to chat · drag to move (snaps & tucks to the edge)")}
          className="cursor-grab touch-none select-none rounded-full active:scale-95 active:cursor-grabbing"
          style={spriteStyle}
        >
          <CompanionSprite state={open ? state : "idle"} size={BTN} />
        </button>
      </div>
    </div>
  );
}
