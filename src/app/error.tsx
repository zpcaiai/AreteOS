"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto mt-24 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
      <div className="text-lg font-semibold text-slate-100">出了点问题</div>
      <p className="mt-2 text-sm text-slate-400">{error.message || "页面加载失败,请重试。"}</p>
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium">重试</button>
        <a href="/dashboard" className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm hover:bg-slate-700">返回首页</a>
      </div>
    </div>
  );
}
