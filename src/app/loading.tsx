/** A stable loading surface prevents the main pane from appearing broken on slow data routes. */
export default function GlobalLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading content">
      <div className="h-8 w-56 rounded bg-slate-800" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-800" />
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {["a", "b", "c"].map((key) => <div key={key} className="h-40 rounded-2xl border border-slate-800 bg-slate-900/60" />)}
      </div>
    </div>
  );
}
