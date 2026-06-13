"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { clearRuntimeCachesAndReload } from "@/lib/client/cache-recovery";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
          <section className="max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-400">The error has been recorded. You can retry the current view or clear runtime caches after a deploy.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                Retry
              </button>
              <button onClick={clearRuntimeCachesAndReload} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">
                Clear cache
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
