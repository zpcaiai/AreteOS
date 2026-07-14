"use client";

// B2B team management. Create a team (buys N PRO seats), invite members by email, and
// each member is granted PRO via their team seat (resolved in membership/service.ts).

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useT } from "@/lib/i18n/client";

interface TeamSummary { id: string; name: string; seats: number; ownerId: string; role: string; memberCount: number }
interface MemberView { userId: string; email: string; name: string | null; role: string; createdAt: number }
interface TeamDetail { id: string; name: string; seats: number; ownerId: string; status: string; members: MemberView[] }

export default function TeamClient() {
  const T = useT();
  const teams = useApi<{ teams: TeamSummary[] }>("/api/teams");
  const create = useApiMutation<{ name: string; seats: number }, { team: { id: string } }>("/api/teams", { invalidate: ["/api/teams"] });
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(5);
  const [openId, setOpenId] = useState<string | null>(null);

  const detail = useApi<TeamDetail>(openId ? `/api/teams/${openId}/members` : null);
  const addMember = useApiMutation<{ email: string }, { added: boolean }>(openId ? `/api/teams/${openId}/members` : "/api/teams", { invalidate: openId ? [`/api/teams/${openId}/members`, "/api/teams"] : [] });
  const removeMember = useApiMutation<{ userId: string }, { removed: number }>(openId ? `/api/teams/${openId}/members` : "/api/teams", { method: "DELETE", invalidate: openId ? [`/api/teams/${openId}/members`, "/api/teams"] : [] });
  const [email, setEmail] = useState("");

  const list = teams.data?.teams ?? [];
  const d = detail.data;
  const seatUsed = d ? d.members.length : 0;

  return (
    <div>
      <PageHeader title={T("团队席位", "Team seats")} subtitle={T("为团队购买 PRO 席位并邀请成员——每个席位授予成员 PRO 访问权限。", "Buy PRO seats for your team and invite members — each seat grants that member PRO access.")} />

      <Card title={T("创建团队", "Create a team")}>
        <div className="flex flex-wrap items-end gap-3 text-sm">
          <div>
            <label className="block text-xs text-slate-500">{T("团队名称", "Team name")}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" placeholder={T("例如:增长小队", "e.g. Growth squad")} />
          </div>
          <div>
            <label className="block text-xs text-slate-500">{T("席位数", "Seats")}</label>
            <input type="number" min={1} max={500} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
          </div>
          <button onClick={() => name.trim() && create.mutate({ name, seats })} disabled={!name.trim() || create.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
            {create.isPending ? "…" : T("创建", "Create")}
          </button>
        </div>
        {create.error && <p className="mt-2 text-sm text-rose-400" role="alert">{create.error.message}</p>}
      </Card>

      <div className="mt-4">
        <Card title={T("你的团队", "Your teams")}>
          {teams.isPending ? <p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p> : list.length ? (
            <ul className="space-y-1 text-sm">
              {list.map((t) => (
                <li key={t.id} className="flex items-center justify-between border-t border-slate-800 pt-1">
                  <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="text-left text-slate-200 hover:text-indigo-300">
                    {t.name} <span className="text-xs text-slate-500">· {t.role} · {t.memberCount}/{t.seats} {T("席位", "seats")}</span>
                  </button>
                  {t.role === "owner" && <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="text-xs text-indigo-400">{openId === t.id ? T("收起", "Close") : T("管理", "Manage")}</button>}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">{T("还没有团队。创建一个开始。", "No teams yet — create one to start.")}</p>}
        </Card>
      </div>

      {openId && d && (
        <div className="mt-4">
          <Card title={`${d.name} · ${seatUsed}/${d.seats} ${T("席位", "seats")}`} accent="#6366f1">
            <div className="flex flex-wrap items-end gap-2 text-sm">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T("成员邮箱", "member email")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
              <button onClick={() => email.trim() && addMember.mutate({ email }, { onSuccess: () => setEmail("") })} disabled={addMember.isPending || seatUsed >= d.seats}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{T("邀请成员", "Invite member")}</button>
            </div>
            {addMember.error && <p className="mt-2 text-sm text-rose-400" role="alert">{addMember.error.message}</p>}
            <ul className="mt-3 space-y-1 text-sm">
              {d.members.map((m) => (
                <li key={m.userId} className="flex items-center justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300">{m.name || m.email} <span className="text-xs text-slate-500">· {m.role}</span></span>
                  {m.role !== "owner" && <button onClick={() => removeMember.mutate({ userId: m.userId })} disabled={removeMember.isPending} className="text-xs text-rose-400 hover:text-rose-300">{T("移除", "Remove")}</button>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
