import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { DeleteButton } from "../AdminClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "社区审核" };

export const dynamic = "force-dynamic";

export default async function AdminCommunity() {
  const { t } = await getDict();
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" }, take: 100,
    include: {
      user: { select: { email: true, name: true } },
      comments: { orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { email: true } } } },
      _count: { select: { comments: true } },
    },
  });
  return (
    <div>
      <PageHeader title={t("page.admin.community.title")} subtitle={t("page.admin.community.subtitle")} />
      {posts.length ? posts.map((p) => (
        <Card key={p.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-500">{p.user.name || p.user.email} · {p.status || "—"} · {new Date(p.createdAt).toLocaleString()} · {p._count.comments} 评论</div>
              <p className="mt-1 text-sm text-slate-200">{p.message || <span className="text-slate-500">(无正文)</span>}</p>
            </div>
            <DeleteButton endpoint={`/api/admin/community/post/${p.id}`} label="删帖" confirmText="删除该帖及其全部评论?" />
          </div>
          {p.comments.length > 0 && (
            <ul className="mt-2 space-y-1 border-t border-slate-800 pt-2">
              {p.comments.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="min-w-0 text-slate-300"><span className="text-xs text-slate-500">{c.user.email}:</span> {c.content}</span>
                  <DeleteButton endpoint={`/api/admin/community/comment/${c.id}`} label="删" confirmText="删除该评论?" />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )) : <Empty>暂无社区内容</Empty>}
    </div>
  );
}
