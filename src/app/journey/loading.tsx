export default function JourneyLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-5 space-y-2">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-800" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-slate-800" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
        ))}
      </div>
    </div>
  );
}
