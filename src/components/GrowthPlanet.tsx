"use client";

import Link from "next/link";

const CONTINENTS = [
  {
    name: "认识自己",
    en: "Self Discovery",
    color: "#da77f2",
    question: "我正在被什么模式驱动？",
    summary: "从情绪、阴影、身份和信念里看见真实状态。",
    links: [
      ["/reflection", "反思"],
      ["/shadow", "阴影模式"],
      ["/beliefs", "信念"],
      ["/twin", "数字孪生"],
    ],
  },
  {
    name: "校准方向",
    en: "Direction",
    color: "#ffd166",
    question: "我的选择是否对齐使命、身份和价值？",
    summary: "把 mission、identity、values 变成可执行的判断标准。",
    links: [
      ["/telos", "使命"],
      ["/identity", "身份"],
      ["/values", "价值"],
      ["/decisions", "决策"],
    ],
  },
  {
    name: "提升判断",
    en: "Phronesis",
    color: "#60a5fa",
    question: "我用了哪些模型，错过了哪些假设？",
    summary: "用模型、第一性原理和复盘提高决策质量。",
    links: [
      ["/phronesis", "认知"],
      ["/models", "模型库"],
      ["/coach", "AI Coach"],
      ["/naval/judgment", "Naval 判断"],
    ],
  },
  {
    name: "落地行动",
    en: "Execution",
    color: "#34d399",
    question: "今天的最小行动是什么？",
    summary: "把洞见变成习惯、计划、练习和具体输出。",
    links: [
      ["/habits", "习惯"],
      ["/learning-path", "学习路径"],
      ["/mastery", "精通"],
      ["/naval/plan", "90-day plan"],
    ],
  },
  {
    name: "复习内化",
    en: "Memory",
    color: "#a78bfa",
    question: "哪些原则应该被记住，而不是只被看见？",
    summary: "把教训、原则和金句变成间隔重复卡片。",
    links: [
      ["/memory-deck", "记忆卡"],
      ["/reviews", "周期复盘"],
      ["/timeline", "时间线"],
      ["/mnemosyne", "音频学习"],
    ],
  },
  {
    name: "长期复利",
    en: "Naval Life OS",
    color: "#f59e0b",
    question: "什么会随时间复利？",
    summary: "围绕 specific knowledge、leverage、wealth、freedom 建长期游戏。",
    links: [
      ["/naval", "Naval Overview"],
      ["/naval/specific-knowledge", "Specific Knowledge"],
      ["/naval/leverage", "Leverage"],
      ["/naval/twin", "Naval Twin"],
    ],
  },
];

export default function GrowthPlanet() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,0.24),rgba(2,6,23,0)_55%)] px-5 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-indigo-300">Growth Planet</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">Arete 成长星球</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
          状态识别、方向校准、判断提升、行动落地、复习内化、长期复利。把 36+ 页面组织成一条成长路径。
        </p>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {CONTINENTS.map((item) => (
          <section
            key={item.name}
            className="rounded-lg border p-4"
            style={{ borderColor: `${item.color}55`, background: `linear-gradient(135deg, ${item.color}20, rgba(15,23,42,0.2))` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-100">{item.name}</h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em]" style={{ color: item.color }}>{item.en}</p>
              </div>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
            <p className="mt-3 text-sm italic leading-6 text-slate-200">"{item.question}"</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.links.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-indigo-400 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

