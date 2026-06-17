import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Empty } from "@/components/ui";
import { Composer, CommentForm } from "@/components/CommunityClient";
import { statusLabel } from "@/lib/community/statuses";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("社区", "Community");
export const dynamic = "force-dynamic";

function who(u: { name: string | null; email: string }) {
  return u.name || u.email.split("@")[0];
}
function ago(d: Date) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
}

export default async function CommunityPage() {
  const { t } = await getDict();
  await getUserId();
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" }, take: 50,
    include: {
      user: { select: { name: true, email: true } },
      comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { name: true, email: true } } } },
    },
  });
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("page.community.title")} subtitle={t("page.community.subtitle")} />
      <div className="mb-6"><Composer /></div>
      {posts.length ? (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{who(p.user)}</span>
                <span className="rounded-full bg-indigo-900/50 px-2 py-0.5 text-xs text-indigo-200">{statusLabel(p.status)}</span>
                <span className="ml-auto text-xs text-slate-500">{ago(p.createdAt)}</span>
              </div>
              {p.message && <p className="mt-2 whitespace-pre-wrap text-sm">{p.message}</p>}

              {p.comments.length > 0 && (
                <div className="mt-3 space-y-1 border-l border-slate-800 pl-3">
                  {p.comments.map((c) => (
                    <p key={c.id} className="text-sm"><span className="font-medium text-slate-300">{who(c.user)}</span> <span className="text-slate-400">{c.content}</span></p>
                  ))}
                </div>
              )}
              <CommentForm postId={p.id} />
            </div>
          ))}
        </div>
      ) : <Empty>{t("empty.no_posts_yet_be_the_first")}</Empty>}
    </div>
  );
}
