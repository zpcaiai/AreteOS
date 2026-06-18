"use client";

/**
 * CompanionWidget — a small floating companion that lives in the corner. Click it
 * to open a calm little panel: a greeting, a jump to the Emotion Planet, a 60s
 * guided-breathing exercise, and a gentle line. Fully secular, self-contained
 * (no backend). The sprite reacts with state-driven animations.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/client";
import CompanionSprite, { type CompanionState } from "./CompanionSprite";

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

  const celebrate = useCallback(() => {
    setState("celebrating");
    later(() => setState("idle"), 1800);
  }, []);

  const openPanel = () => {
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
  // Uses its OWN local timers so leaving breathing never cancels the celebrate timer.
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

  const phaseText = phase === "in" ? T("吸气…", "Breathe in…") : phase === "hold" ? T("停一下", "Hold") : T("呼气…", "Breathe out…");

  return (
    <div className="fixed bottom-5 left-5 z-[1190] flex flex-col items-start gap-3">
      {open && (
        <section className="companion-panel w-[300px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur">
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
        onClick={() => (open ? closePanel() : openPanel())}
        aria-label={T("打开暖暖", "Open Nuan")}
        className="rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{ lineHeight: 0 }}
      >
        <CompanionSprite state={open ? state : "idle"} size={60} />
      </button>
    </div>
  );
}
