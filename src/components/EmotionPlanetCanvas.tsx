"use client";

/**
 * EmotionPlanetCanvas — wraps the 3D scene (loaded client-only) with AreteOS's
 * panel + detail-sidebar pattern. Click a node on the planet to inspect it; the
 * panel keeps the original's multi-section interaction structure (name it → work
 * with it → nearby), with fully secular copy.
 */

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useI18n, useT } from "@/lib/i18n/client";
import { EMOTION_NODES, type EmotionNode } from "@/data/emotionSphere";

const Scene = dynamic(() => import("./EmotionPlanetScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading planet…</div>
  ),
});

// Secular reflective prompts — three are shown per emotion (chosen deterministically
// so each node feels distinct). CBT / Stoic flavour, no religious framing.
const PROMPTS: [string, string][] = [
  ["给它起个更准确的名字 —— 是「{zh}」，还是别的词更贴切？", "Name it precisely — is it “{en}”, or is another word closer?"],
  ["它出现在身体的哪个部位？强度 1–10 打几分？", "Where does it sit in your body? Rate its intensity 1–10."],
  ["它想推动你去做什么？那是当下值得做的吗？", "What is it urging you to do? Is that worth doing right now?"],
  ["如果一位你敬重的人此刻在场，他会提醒你什么？", "If someone you respect were here, what would they remind you of?"],
  ["这种感受在为你指向哪一个需要或价值？", "What need or value is this feeling pointing to?"],
  ["一小时后、一周后，它还会这么重要吗？", "Will this feel as important in an hour? In a week?"],
  ["把它当作信息，而非命令 —— 它在向你报告什么？", "Treat it as information, not an order — what is it reporting?"],
  ["此刻你能迈出的、最小的一步是什么？", "What is the smallest next step you can take right now?"],
];

const MAXIMS: [string, string][] = [
  ["情绪是信息，不是指令。", "Emotions are information, not instructions."],
  ["你能准确命名的，就能开始驾驭。", "What you can name precisely, you can begin to steer."],
  ["先观察，再回应 —— 中间留一口气的距离。", "Observe first, then respond — leave a breath in between."],
  ["感受会过去；你选择如何回应会留下。", "Feelings pass; how you choose to respond remains."],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function promptsFor(node: EmotionNode): [string, string][] {
  const base = hash(node.id);
  const idx = [base % PROMPTS.length, (base + 3) % PROMPTS.length, (base + 5) % PROMPTS.length];
  const uniq = Array.from(new Set(idx)).slice(0, 3);
  return uniq.map((i) => PROMPTS[i]);
}

export default function EmotionPlanetCanvas() {
  const T = useT();
  const { locale } = useI18n();
  const en = locale === "en";
  const nodes = EMOTION_NODES;
  const [selected, setSelected] = useState<EmotionNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return nodes.filter((n) => n.zh.toLowerCase().includes(q) || n.en.toLowerCase().includes(q) || n.kw.toLowerCase().includes(q)).slice(0, 14);
  }, [query, nodes]);

  const fill = (tpl: string, n: EmotionNode) => tpl.replace("{zh}", n.zh || n.en).replace("{en}", n.en);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,0.22),rgba(2,6,23,0)_58%)] px-5 py-5 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-indigo-300">Pathos</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">{T("情绪星球", "Emotion Planet")}</h2>
        <p className="mx-auto mt-1.5 max-w-xl text-sm leading-6 text-slate-400">
          {T(
            `171 个情绪，按语义相近排布在一颗星球上。拖动旋转、滚动缩放、点击任意节点，看见你此刻停在哪里。`,
            `171 emotions arranged on a planet by semantic nearness. Drag to orbit, scroll to zoom, click any node to see where you've paused.`,
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start">
        <div className="h-[520px] w-full overflow-hidden rounded-xl bg-[#060b18] lg:flex-1">
          <Scene
            nodes={nodes}
            selectedId={selected?.id ?? null}
            hoveredId={hovered}
            labelFor={(n) => (en ? n.en : n.zh || n.en)}
            font="/fonts/emotion-cjk.woff"
            onSelect={setSelected}
            onHover={(n) => setHovered(n?.id ?? null)}
            onMiss={() => setSelected(null)}
          />
        </div>

        <div className="w-full lg:w-80">
          {/* Search / jump */}
          <div className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={T("搜索情绪… (如 焦虑 / calm)", "Search emotions… (e.g. anxiety / calm)")}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            />
            {matches.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {matches.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelected(n);
                      setQuery("");
                    }}
                    className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:border-indigo-400 hover:text-white"
                  >
                    {n.zh}
                    <span className="ml-1 text-slate-500">{n.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-xl font-bold text-slate-50">{selected.zh}</div>
                  <div className="text-xs uppercase tracking-wide text-indigo-300">{selected.en}</div>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{selected.kw}</span>
              </div>

              {/* Section 1 — name it */}
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{T("此刻", "Right now")}</div>
                <p className="mt-1 text-sm leading-6 text-slate-200">
                  {T(`你正停在「${selected.zh}」。先承认它在这里，不急着改变它。`, `You've paused on “${selected.en}”. Acknowledge it's here before trying to change it.`)}
                </p>
                {selected.gloss && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-300">{T("原始释义", "Source gloss")}</summary>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{selected.gloss}</p>
                  </details>
                )}
              </div>

              {/* Section 2 — work with it */}
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{T("与它相处", "Work with it")}</div>
                <ul className="mt-1.5 space-y-1.5">
                  {promptsFor(selected).map(([zh, en], i) => (
                    <li key={i} className="text-sm leading-6 text-slate-300">
                      · {fill(T(zh, en), selected)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3 — nearby */}
              {selected.near.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{T("临近的情绪", "Nearby")}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selected.near
                      .map((id) => byId.get(id))
                      .filter((n): n is EmotionNode => !!n)
                      .map((n) => (
                        <button
                          key={n.id}
                          onClick={() => setSelected(n)}
                          className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:border-indigo-400 hover:text-white"
                        >
                          {n.zh}
                          <span className="ml-1 text-slate-500">{n.en}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <p className="mt-4 border-t border-slate-800 pt-3 text-xs italic leading-5 text-slate-400">
                {(() => {
                  const m = MAXIMS[hash(selected.id) % MAXIMS.length];
                  return T(m[0], m[1]);
                })()}
              </p>

              <button onClick={() => setSelected(null)} className="mt-3 block text-xs text-slate-500 hover:text-slate-300">
                {T("← 返回星球", "← Back to the planet")}
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
              {T(
                "拖动旋转 · 滚动缩放 · 点击节点查看。每个节点是一种情绪，相近的情绪彼此靠近 —— 这是一张感受的地图，不是一份待办。",
                "Drag to orbit · scroll to zoom · click a node. Each node is an emotion, and similar feelings sit near each other — a map of feeling, not a to-do list.",
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
