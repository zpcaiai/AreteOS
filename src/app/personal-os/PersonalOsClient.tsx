"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { SuggestionField } from "@/components/SuggestionField";

interface Stack { primary: string; secondary: string; emerging: string; legacy: string }
interface OS {
  mission: string; identityStack: Stack; values: string[]; skillTree: string[]; habits: string[];
  deepWork: string; assetRoadmap: string[]; decisionRules: string[]; riskMap: string[]; ninetyDayPlan: { m1: string; m2: string; m3: string };
}
interface Result { version: number; template: string; os: OS }

function List({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <Card title={title}>
      <ul className="space-y-1 text-sm text-slate-300">{items.map((s, i) => <li key={i}>· {s}</li>)}</ul>
    </Card>
  );
}

export default function PersonalOSPage() {
  const { locale } = useI18n();
  const T = useT();
  const [intent, setIntent] = useState("");
  const run = useApiMutation<{ intent: string }, { result: Result }>("/api/personal-os");
  const r = run.data?.result;
  const os = r?.os;

  return (
    <div>
      <PageHeader title={T("人生 OS 编译器", "Personal OS Compiler")} subtitle={T("描述你想成为谁,系统把它编译成可执行的人生操作系统。", "Describe who you want to become; the system compiles an executable life OS.")} />
      <Card title={T("你想成为谁?", "Who do you want to become?")}>
        <SuggestionField
          value={intent}
          onChange={setIntent}
          rows={2}
          placeholder={T("例如:我想成为一名 AI 研究型创业者。", "e.g. I want to become an AI research entrepreneur.")}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
          chipLabel={T("身份备选", "Identity options")}
          suggestions={[
            T("我想成为一名能持续把 AI 想法做成可收费产品的创业者。", "I want to become a founder who consistently turns AI ideas into paid products."),
            T("我想成为一名能把专业知识沉淀成资产和课程的专家。", "I want to become an expert who turns knowledge into assets and courses."),
            T("我想成为一名能带团队完成真实业务结果的负责人。", "I want to become a leader who helps a team produce real business outcomes."),
          ]}
        />
        <button onClick={() => intent.trim().length >= 5 && run.mutate({ intent })} disabled={run.isPending || intent.trim().length < 5}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? T("编译中…", "Compiling…") : T("编译人生 OS", "Compile life OS")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={T("人生 OS 编译器", "Personal OS Compiler")} /></div>}

      {os && (
        <div className="mt-4 space-y-4">
          <Card title={`${T("使命", "Mission")} · v${r?.version} · ${r?.template}`} accent="#34d399">
            <p className="text-sm text-slate-200">{os.mission}</p>
            <p className="mt-2 text-xs text-slate-400">{T("身份栈", "Identity stack")}: {os.identityStack.primary} → {os.identityStack.secondary} → {os.identityStack.emerging} → {os.identityStack.legacy}</p>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            <List title={T("价值观", "Values")} items={os.values} />
            <List title={T("技能树", "Skill tree")} items={os.skillTree} />
            <List title={T("身份型习惯", "Habits")} items={os.habits} />
            <List title={T("资产路线图", "Asset roadmap")} items={os.assetRoadmap} />
            <List title={T("决策规则", "Decision rules")} items={os.decisionRules} />
            <List title={T("风险地图", "Risk map")} items={os.riskMap} />
          </div>
          <Card title={T("深度工作", "Deep work")}>
            <p className="text-sm text-slate-300">{os.deepWork}</p>
          </Card>
          <Card title={T("90 天计划", "90-day plan")} accent="#38bdf8">
            <p className="text-sm text-slate-300"><span className="text-slate-500">{T("第一月", "Month 1")}:</span> {os.ninetyDayPlan.m1}</p>
            <p className="mt-1 text-sm text-slate-300"><span className="text-slate-500">{T("第二月", "Month 2")}:</span> {os.ninetyDayPlan.m2}</p>
            <p className="mt-1 text-sm text-slate-300"><span className="text-slate-500">{T("第三月", "Month 3")}:</span> {os.ninetyDayPlan.m3}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
