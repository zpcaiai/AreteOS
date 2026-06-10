"use client";

// Point-in-time event replay: drag the slider to rewind your event history and
// watch your aggregates (decisions, habits, reflections…) rebuild from the
// append-only domain-event log.

import { useCallback, useEffect, useState } from "react";

interface Aggregate { aggregateType: string; aggregateId: string; eventCount: number; lastEventAt: string | null; types: Record<string, number> }
interface Replay { eventCount: number; aggregates: Aggregate[]; events: { type: string; aggregateType: string; occurredAt: string }[] }

const DAY = 86_400_000;

export default function GrowthReplay({ firstEventAt }: { firstEventAt: string | null }) {
  const start = firstEventAt ? new Date(firstEventAt).getTime() : Date.now() - 90 * DAY;
  const totalDays = Math.max(1, Math.ceil((Date.now() - start) / DAY));
  const [offset, setOffset] = useState(totalDays);
  const [replay, setReplay] = useState<Replay | null>(null);
  const [busy, setBusy] = useState(false);

  const until = new Date(start + offset * DAY);

  const load = useCallback(async (o: number) => {
    setBusy(true);
    try {
      const r = await fetch("/api/events/replay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ until: new Date(start + o * DAY).toISOString() }),
      });
      if (r.ok) setReplay((await r.json()).replay);
    } finally {
      setBusy(false);
    }
  }, [start]);

  useEffect(() => { load(totalDays); }, [load, totalDays]);

  const byType = new Map<string, number>();
  for (const a of replay?.aggregates ?? []) {
    byType.set(a.aggregateType, (byType.get(a.aggregateType) ?? 0) + a.eventCount);
  }
  const rows = [...byType.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = rows[0]?.[1] ?? 1;
  const recent = (replay?.events ?? []).slice(-6).reverse();

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label htmlFor="replay-slider" className="text-sm text-slate-400">Rewind to</label>
        <input
          id="replay-slider"
          type="range"
          min={1}
          max={totalDays}
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
          onMouseUp={() => load(offset)}
          onTouchEnd={() => load(offset)}
          onKeyUp={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") load(offset); }}
          className="w-56 accent-indigo-500"
          aria-valuetext={until.toISOString().slice(0, 10)}
        />
        <span className="text-sm tabular-nums text-slate-200">{until.toISOString().slice(0, 10)}</span>
        {busy && <span className="text-xs text-slate-500" aria-live="polite">replaying…</span>}
        {replay && <span className="text-xs text-slate-500">{replay.eventCount} events</span>}
      </div>

      {replay && rows.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-1.5">
            {rows.map(([type, count]) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <span className="w-40 truncate text-slate-400">{type}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-slate-800">
                  <div className="h-full rounded bg-indigo-500" style={{ width: `${Math.max(4, (count / max) * 100)}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums text-slate-300">{count}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Last events before this point</p>
            <ul className="space-y-1 text-sm text-slate-400">
              {recent.map((e, i) => (
                <li key={i}>
                  <span className="text-slate-500">{new Date(e.occurredAt).toLocaleDateString()}</span>{" "}
                  {e.aggregateType} · {e.type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No domain events before this point yet — your history rebuilds here as you use the system.</p>
      )}
    </div>
  );
}
