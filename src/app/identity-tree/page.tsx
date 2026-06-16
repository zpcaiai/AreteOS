"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import type { Bi } from "@/lib/identity-tree-catalog";

interface Node { key: string; name: Bi; family: string; level: number; next: string[]; req: { habits: number; assets: number; reflections: number }; evidence: { habits: number; assets: number; reflections: number }; progress: number; unlocked: boolean }
interface Quest { title: string; requirements: string[]; successCriteria: string }

export default function IdentityTreePage() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const tree = useApi<{ nodes: Node[] }>("/api/identity-tree");
  const evidence = useApiMutation<{ action: string; nodeKey: string; kind: string }, { nodes: Node[] }>("/api/identity-tree", { invalidate: ["/api/identity-tree"] });
  const quest = useApiMutation<{ action: string; nodeKey: string }, { quest: Quest }>("/api/identity-tree");
  const [sel, setSel] = useState<string | null>(null);
  const nodes = tree.data?.nodes ?? [];
  const node = nodes.find((n) => n.key === sel) ?? null;

  const families = [...new Set(nodes.map((n) => n.family))];
  const W = 360, stepX = 42, rowH = 70, padX = 24;
  const pos = (n: Node) => ({ x: padX + (n.level - 1) * stepX, y: 30 + families.indexOf(n.family) * rowH });
  const byKey = Object.fromEntries(nodes.map((n) => [n.key, n]));
  const color = (p: number) => `hsl(${Math.round(p * 120)} 70% 50%)`;
  const H = 30 + families.length * rowH;

  return (
    <div>
      <PageHeader title={T("身份进化树", "Identity Evolution Tree")} subtitle={T("身份靠证据进化:用习惯、资产与反思解锁下一个你。", "Identity evolves through evidence — unlock the next you with habits, assets, reflections.")} />
      <Card title={T("进化树", "The tree")}>
        {nodes.length > 0 ? (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Identity evolution tree">
            {nodes.flatMap((n) => n.next.filter((nk) => byKey[nk]).map((nk) => {
              const a = pos(n), b = pos(byKey[nk]);
              return <line key={n.key + nk} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#475569" strokeWidth={1.5} />;
            }))}
            {nodes.map((n) => {
              const pt = pos(n);
              return (
                <g key={n.key} onClick={() => setSel(n.key)} style={{ cursor: "pointer" }}>
                  <circle cx={pt.x} cy={pt.y} r={sel === n.key ? 9 : 6} fill={color(n.progress)} stroke={n.unlocked ? "#fff" : "#1e293b"} strokeWidth={n.unlocked ? 2 : 1} />
                  <text x={pt.x} y={pt.y + 18} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 8 }}>{L(n.name)}</text>
                </g>
              );
            })}
          </svg>
        ) : <p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p>}
        <p className="mt-1 text-xs text-slate-500">{T("点击节点查看与记录证据。颜色=进度,白圈=已解锁。", "Click a node to view and record evidence. Color = progress, white ring = unlocked.")}</p>
      </Card>

      {evidence.error && isUpgradeError(evidence.error) && <div className="mt-4"><UpgradeNotice feature={T("身份进化树", "Identity Evolution Tree")} tier="Plus" /></div>}

      {node && (
        <div className="mt-4 space-y-3">
          <Card title={`${L(node.name)} · L${node.level}`}>
            <ScoreBar label={`${T("习惯", "Habits")} ${node.evidence.habits}/${node.req.habits}`} value={node.req.habits ? node.evidence.habits / node.req.habits : 1} />
            <ScoreBar label={`${T("资产", "Assets")} ${node.evidence.assets}/${node.req.assets}`} value={node.req.assets ? node.evidence.assets / node.req.assets : 1} />
            <ScoreBar label={`${T("反思", "Reflections")} ${node.evidence.reflections}/${node.req.reflections}`} value={node.req.reflections ? node.evidence.reflections / node.req.reflections : 1} />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(["habit", "asset", "reflection"] as const).map((k) => (
                <button key={k} onClick={() => evidence.mutate({ action: "evidence", nodeKey: node.key, kind: k })} disabled={evidence.isPending}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 font-medium hover:bg-slate-600 disabled:opacity-50">+ {T(k === "habit" ? "习惯" : k === "asset" ? "资产" : "反思", k)}</button>
              ))}
              <button onClick={() => quest.mutate({ action: "quest", nodeKey: node.key })} disabled={quest.isPending}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{quest.isPending ? "…" : T("生成任务", "Generate quest")}</button>
            </div>
          </Card>
          {quest.data?.quest && (
            <Card title={quest.data.quest.title} accent="#a78bfa">
              <ul className="space-y-1 text-sm text-slate-300">{quest.data.quest.requirements.map((q, i) => <li key={i}>· {q}</li>)}</ul>
              <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{T("成功标准", "Success")}:</span> {quest.data.quest.successCriteria}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
