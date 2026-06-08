import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto mt-24 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
      <div className="text-3xl font-bold tracking-wide font-serif">404</div>
      <p className="mt-2 text-sm text-slate-400">这个页面不存在,或已迁移。</p>
      <Link href="/dashboard" className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium">返回首页</Link>
    </div>
  );
}
