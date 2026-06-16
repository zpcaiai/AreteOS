"use client";

import "./globals.css";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { clearRuntimeCachesAndReload } from "@/lib/client/cache-recovery";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const en = typeof document !== "undefined" && /(?:^|;\s*)locale=en(?:;|$)/.test(document.cookie);
  const T = (zh: string, e: string) => (en ? e : zh);

  return (
    <html lang={en ? "en" : "zh-CN"}>
      <body style={{ margin: 0 }}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">{T("出错了", "Something went wrong")}</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
              {T("错误已记录。可以重试,或清除运行时缓存后重新加载。", "The error has been recorded. Try again, or clear the runtime cache and reload.")}
            </p>
            {error.digest && (
              <p className="mt-3 font-mono text-[11px] text-slate-600">{T("错误编号", "Error ID")}: {error.digest}</p>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
                {T("重试", "Try again")}
              </button>
              <button onClick={clearRuntimeCachesAndReload} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
                {T("清除缓存", "Clear cache")}
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
