"use client";

import { useEffect } from "react";
import { clearRuntimeCachesAndReload } from "@/lib/client/cache-recovery";
import { useT } from "@/lib/i18n/client";

/** A recoverable, calm failure state instead of a blank content pane. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const T = useT();
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-rose-800/60 bg-slate-900/60 p-6 text-center" role="alert">
      <p className="text-sm font-semibold text-rose-300">{T("这一页暂时无法打开", "This page is temporarily unavailable")}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{T("你的数据没有被修改。请重试；如果问题持续出现，可以先从起点页继续。", "Your data was not changed. Try again; if the issue persists, continue from the start page.")}</p>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">{T("重试", "Retry")}</button>
        <button onClick={clearRuntimeCachesAndReload} className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-amber-100 hover:bg-amber-500/10">{T("清理缓存并刷新", "Clear cache and reload")}</button>
        <a href="/start" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">{T("回到起点", "Go to start")}</a>
      </div>
    </section>
  );
}
