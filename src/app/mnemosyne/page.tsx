import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/ui";
import Disclaimer from "@/components/Disclaimer";
import AudiobookShelf from "./AudiobookShelf";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "听书成长 · Listen to Grow" };

export const dynamic = "force-dynamic";

export default async function AudiobooksPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [books, progress, sessions] = await Promise.all([
    prisma.audioBook.findMany({
      where: { OR: [{ sourceType: { in: ["CATALOG", "PUBLIC_DOMAIN"] } }, { ownerUserId: userId }] },
      orderBy: [{ relatedModule: "asc" }, { title: "asc" }],
    }),
    prisma.listeningProgress.findMany({ where: { userId } }),
    prisma.listeningSession.findMany({ where: { userId } }),
  ]);
  const totalMin = Math.round(sessions.reduce((a, s) => a + s.seconds, 0) / 60);

  return (
    <div>
      <PageHeader title={t("page.mnemosyne.title")} subtitle={t("page.mnemosyne.subtitle")} />
      <Card title="Your listening">
        <div className="flex gap-8 text-sm">
          <div><div className="text-2xl font-bold tabular-nums">{totalMin}</div><div className="text-xs text-slate-500">minutes listened</div></div>
          <div><div className="text-2xl font-bold tabular-nums">{new Set(sessions.map((s) => s.bookId)).size}</div><div className="text-xs text-slate-500">books opened</div></div>
          <div><div className="text-2xl font-bold tabular-nums">{progress.filter((p) => p.completed).length}</div><div className="text-xs text-slate-500">completed</div></div>
        </div>
      </Card>
      <AudiobookShelf
        books={books.map((b) => ({ id: b.id, title: b.title, author: b.author, relatedModule: b.relatedModule, inspiredByNote: b.inspiredByNote, sourceType: b.sourceType, isPublicDomain: b.isPublicDomain }))}
        progress={Object.fromEntries(progress.map((p) => [p.bookId, { percent: p.percent, completed: p.completed }]))}
      />
      <Card title="About this library (please read)">
        <p className="text-sm leading-relaxed text-slate-300">
          This is a study companion, not a bookstore. For copyrighted books we play <strong>original summaries</strong> of the
          ideas — never the book's text. Public-domain works may include longer excerpts. You can add your own legally-owned
          PDF/EPUB as a personal reference (and paste text from it for read-aloud); we never host or share copyrighted files.
          Please support authors by buying their books.
        </p>
      </Card>
      <Disclaimer variant="inline" />
    </div>
  );
}
