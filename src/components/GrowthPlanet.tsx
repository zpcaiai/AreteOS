"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

type Continent = {
  name: string; nameEn: string; color: string;
  question: string; questionEn: string;
  summary: string; summaryEn: string;
  links: [string, string, string][]; // [href, zh, en]
};

const CONTINENTS: Continent[] = [
  {
    name: "认识自己", nameEn: "Self Discovery", color: "#da77f2",
    question: "我正在被什么模式驱动?", questionEn: "What patterns are driving me?",
    summary: "从情绪、阴影、身份和信念里看见真实状态。", summaryEn: "See your true state through emotions, shadow, identity and beliefs.",
    links: [["/reflection", "反思", "Reflection"], ["/shadow", "阴影模式", "Shadow"], ["/beliefs", "信念", "Beliefs"], ["/twin", "数字孪生", "Digital Twin"]],
  },
  {
    name: "校准方向", nameEn: "Direction", color: "#ffd166",
    question: "我的选择是否对齐使命、身份和价值?", questionEn: "Do my choices align with mission, identity and values?",
    summary: "把 mission、identity、values 变成可执行的判断标准。", summaryEn: "Turn mission, identity and values into actionable criteria.",
    links: [["/telos", "使命", "Mission"], ["/identity", "身份", "Identity"], ["/values", "价值", "Values"], ["/decisions", "决策", "Decisions"]],
  },
  {
    name: "提升判断", nameEn: "Phronesis", color: "#60a5fa",
    question: "我用了哪些模型,错过了哪些假设?", questionEn: "Which models did I use, which assumptions did I miss?",
    summary: "用模型、第一性原理和复盘提高决策质量。", summaryEn: "Raise decision quality with models, first principles and review.",
    links: [["/phronesis", "认知", "Cognitive"], ["/models", "模型库", "Model Library"], ["/coach", "AI 教练", "AI Coach"], ["/naval/judgment", "Naval 判断", "Naval Judgment"]],
  },
  {
    name: "落地行动", nameEn: "Execution", color: "#34d399",
    question: "今天的最小行动是什么?", questionEn: "What is today's smallest action?",
    summary: "把洞见变成习惯、计划、练习和具体输出。", summaryEn: "Turn insight into habits, plans, practice and concrete output.",
    links: [["/habits", "习惯", "Habits"], ["/learning-path", "学习路径", "Learning Path"], ["/mastery", "精通", "Mastery"], ["/naval/plan", "90 天计划", "90-Day Plan"]],
  },
  {
    name: "复习内化", nameEn: "Memory", color: "#a78bfa",
    question: "哪些原则应该被记住,而不只是被看见?", questionEn: "Which principles should be remembered, not just seen?",
    summary: "把教训、原则和金句变成间隔重复卡片。", summaryEn: "Turn lessons, principles and quotes into spaced-repetition cards.",
    links: [["/memory-deck", "记忆卡", "Memory Cards"], ["/reviews", "周期复盘", "Reviews"], ["/timeline", "时间线", "Timeline"], ["/mnemosyne", "音频学习", "Audio Learning"]],
  },
  {
    name: "长期复利", nameEn: "Naval Life OS", color: "#f59e0b",
    question: "什么会随时间复利?", questionEn: "What compounds over time?",
    summary: "围绕 specific knowledge、leverage、wealth、freedom 建长期游戏。", summaryEn: "Build long-term games around specific knowledge, leverage, wealth and freedom.",
    links: [["/naval", "Naval 总览", "Naval Overview"], ["/naval/specific-knowledge", "专属知识", "Specific Knowledge"], ["/naval/leverage", "杠杆", "Leverage"], ["/naval/twin", "Naval 孪生", "Naval Twin"]],
  },
];

export default function GrowthPlanet() {
  const { locale } = useI18n();
  const en = locale === "en";
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,0.24),rgba(2,6,23,0)_55%)] px-5 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-indigo-300">Growth Planet</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">{en ? "Arete Growth Planet" : "Arete 成长星球"}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
          {en
            ? "Self-awareness, direction, judgment, execution, memory, long-term compounding — 36+ pages organized into one growth path."
            : "状态识别、方向校准、判断提升、行动落地、复习内化、长期复利。把 36+ 页面组织成一条成长路径。"}
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
                <h3 className="text-base font-semibold text-slate-100">{en ? item.nameEn : item.name}</h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em]" style={{ color: item.color }}>{en ? item.name : item.nameEn}</p>
              </div>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            </div>
            <p className="mt-3 text-sm italic leading-6 text-slate-200">"{en ? item.questionEn : item.question}"</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{en ? item.summaryEn : item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.links.map(([href, zh, enL]) => (
                <Link key={href} href={href} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-indigo-400 hover:text-white">
                  {en ? enL : zh}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
