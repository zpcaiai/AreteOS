import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export default async function NotFound() {
  const { locale } = await getDict();
  const en = locale === "en";
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
        <div className="font-serif text-6xl font-bold tracking-wide text-slate-100">404</div>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-400">
          {en ? "This page doesn't exist, or it has moved." : "这个页面不存在,或已迁移。"}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
            {en ? "Back to dashboard" : "返回总览"}
          </Link>
          <Link href="/start" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
            {en ? "Start here" : "从这里开始"}
          </Link>
        </div>
      </div>
    </div>
  );
}
