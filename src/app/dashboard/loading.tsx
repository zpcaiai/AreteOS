import type { ReactNode } from "react";

function Bar({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} animate-pulse rounded bg-slate-800`} />;
}
function SkCard({ children }: { children?: ReactNode }) {
  return <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">{children}</div>;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Bar w="w-40" h="h-7" />
        <Bar w="w-80" h="h-4" />
      </div>
      <div className="h-16 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkCard key={i}>
            <Bar w="w-24" />
            <Bar w="w-16" h="h-10" />
            <Bar w="w-full" />
          </SkCard>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <SkCard key={i}>
            <Bar w="w-32" />
            {[0, 1, 2, 3].map((j) => <Bar key={j} />)}
          </SkCard>
        ))}
      </div>
    </div>
  );
}
