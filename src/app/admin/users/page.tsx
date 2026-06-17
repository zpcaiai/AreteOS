import { titleMeta } from "@/lib/i18n/metadata";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { GrantInline } from "../AdminClient";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("用户", "Users");

export const dynamic = "force-dynamic";

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { t } = await getDict();
  const { q } = await searchParams;
  const users = await prisma.user.findMany({
    where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] } : undefined,
    orderBy: { createdAt: "desc" }, take: 100,
    select: { id: true, email: true, name: true, createdAt: true, membership: { select: { tier: true, expiresAt: true } } },
  });
  return (
    <div>
      <PageHeader title={t("page.admin.users.title")} subtitle={t("page.admin.users.subtitle")} />
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q ?? ""} placeholder="按邮箱/姓名搜索" className="w-64 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm" />
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm">搜索</button>
      </form>
      <Card title={`${users.length} 个用户`}>
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="py-1 pr-3">用户</th><th className="px-3">会员</th><th className="px-3">到期</th><th className="px-3">注册</th><th className="px-3">发放会员</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800">
                    <td className="py-2 pr-3"><div className="text-slate-200">{u.name || "—"}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                    <td className="px-3">{u.membership?.tier ?? "FREE"}</td>
                    <td className="px-3 text-xs text-slate-400">{u.membership?.expiresAt ? new Date(u.membership.expiresAt).toLocaleDateString() : "—"}</td>
                    <td className="px-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-3"><GrantInline userId={u.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty>{t("empty.no_matching_users")}</Empty>}
      </Card>
    </div>
  );
}
