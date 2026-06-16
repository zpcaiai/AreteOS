import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export default async function NotFound() {
  const { locale } = await getDict();
  const en = locale === "en";
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
        <div className="text-5xl font-bold tracking-wide font-serif text-slate-100">404</div>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {en ? "This page doesn't exist, or it has moved." : "这个页面不存在,或已迁移。"}
        </p>
        <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          {en ? "Back to dashboard" : "返回总览"}
        </Link>
      </div>
    </div>
  );
}
